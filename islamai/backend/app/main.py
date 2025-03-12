from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import google.generativeai as genai
from openai import OpenAI
import requests
import json
import os
from pathlib import Path
import logging
import time
from fastapi.responses import JSONResponse

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import config directly using absolute path
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config.config import Config

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    logger.warning("python-dotenv not installed. Environment variables must be set manually.")

app = FastAPI()
config = Config()

# Enhanced CORS middleware with specific headers
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

class ApiKeyUpdate(BaseModel):
    provider: str
    key: str

class ChatMessage(BaseModel):
    content: str
    model: str

class ApiResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None

MODEL_MAPPINGS = {
    "gemini-pro": "gemini-2.0-pro-exp-02-05",      # Gemini 2.0 Pro Experimental 02-05
    "gemini-flash": "gemini-2.0-flash-thinking-exp-01-21",  # Gemini 2.0 Flash Thinking Experimental 01-21
    "deepseek-v3": "deepseek-chat",
    "deepseek-r1": "deepseek-reasoner"
}

@app.post("/api/keys")
async def update_api_key(key_update: ApiKeyUpdate):
    try:
        if key_update.provider not in ["gemini", "deepseek"]:
            raise HTTPException(status_code=400, detail="Invalid provider. Must be 'gemini' or 'deepseek'")
        
        if not key_update.key:
            raise HTTPException(status_code=400, detail="API key cannot be empty")
            
        config.set_api_key(key_update.provider, key_update.key)
        return ApiResponse(success=True, message=f"{key_update.provider} API key updated successfully")
    except Exception as e:
        logger.error(f"Error updating API key: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/keys/{provider}")
async def get_api_key(provider: str):
    try:
        if provider not in ["gemini", "deepseek"]:
            raise HTTPException(status_code=400, detail="Invalid provider. Must be 'gemini' or 'deepseek'")
            
        key = config.get_api_key(provider)
        return ApiResponse(
            success=True,
            message=f"Successfully retrieved {provider} API key",
            data={"key": key}
        )
    except Exception as e:
        logger.error(f"Error getting API key: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat")
async def chat(message: ChatMessage):
    start_time = time.time()
    logger.info(f"Received chat request for model {message.model} at {start_time}")
    
    try:
        if message.model.startswith("gemini"):
            api_key = config.get_api_key("gemini")
            if not api_key:
                raise HTTPException(status_code=400, detail="Gemini API key not configured")
            
            logger.info("Configuring Gemini API...")
            genai.configure(api_key=api_key)
            model_name = MODEL_MAPPINGS.get(message.model, MODEL_MAPPINGS["gemini-pro"])
            
            try:
                logger.info(f"Initializing Gemini model: {model_name}")
                model = genai.GenerativeModel(model_name)
                generation_config = {
                    "temperature": 0.7,
                    "top_p": 0.8,
                    "top_k": 40,
                    "max_output_tokens": 2048,
                }
                
                safety_settings = [
                    {
                        "category": "HARM_CATEGORY_HARASSMENT",
                        "threshold": "BLOCK_NONE"
                    },
                    {
                        "category": "HARM_CATEGORY_HATE_SPEECH",
                        "threshold": "BLOCK_NONE"
                    },
                    {
                        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        "threshold": "BLOCK_NONE"
                    },
                    {
                        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                        "threshold": "BLOCK_NONE"
                    }
                ]

                # Modify prompt for thinking/reasoning models
                if message.model in ["gemini-flash", "deepseek-r1"]:
                    prompt = f"""You are a knowledgeable Islamic AI assistant. Please analyze the question carefully and provide a well-structured response.

Format your response in two parts:
1. THOUGHT PROCESS:
   - Break down your analysis step by step
   - Each step should start with "Thinking: [number]."
   - Consider Islamic principles, scholarly views, and relevant context
   - Make your reasoning clear and logical

2. FINAL ANSWER:
   - Start with "---"
   - Provide a clear, concise, and well-structured answer
   - Use appropriate formatting:
     * Use ** for important points
     * Start new topics with clear headings
     * Use bullet points for lists
   - Ensure the answer is respectful and accurate

Question: {message.content}

Remember to:
- Keep your thought process focused and relevant
- Structure your final answer for easy reading
- Use appropriate Islamic terminology when relevant
- Be clear and precise in your explanations"""
                else:
                    prompt = f"""You are a knowledgeable Islamic AI assistant. Please provide a clear and well-structured response.

Guidelines for your response:
- Structure your answer with clear sections when needed
- Use ** for emphasizing important points
- Use bullet points for lists
- Start new topics with clear headings
- Be concise and precise
- Use appropriate Islamic terminology when relevant

Question: {message.content}"""
                
                logger.info("Generating content from Gemini API...")
                generation_start = time.time()
                response = model.generate_content(
                    prompt,
                    generation_config=generation_config,
                    safety_settings=safety_settings,
                    stream=True if message.model in ["gemini-flash", "deepseek-r1"] else False
                )
                generation_time = time.time() - generation_start
                logger.info(f"Content generation took {generation_time:.2f} seconds")
                
                if not response:
                    logger.error("Invalid response structure from Gemini API")
                    raise HTTPException(
                        status_code=500,
                        detail="No valid response generated from the AI model"
                    )

                # Handle streaming response
                if message.model in ["gemini-flash", "deepseek-r1"]:
                    full_response = ""
                    for chunk in response:
                        if chunk.text:
                            full_response += chunk.text
                    response_text = full_response
                else:
                    response_text = response.text.strip()
                
                # Post-process the response text for better formatting
                def clean_response(text: str) -> str:
                    # Remove excessive newlines
                    text = "\n".join(line for line in text.splitlines() if line.strip())
                    
                    # Ensure proper spacing around section breaks
                    text = text.replace("---", "\n---\n")
                    
                    # Clean up thinking points format
                    text = text.replace("Thinking:", "\nThinking:")
                    
                    # Ensure proper spacing around headings
                    import re
                    text = re.sub(r'(\n[A-Z][^:.\n]+:)', r'\n\n\1', text)
                    
                    # Clean up bullet points
                    text = text.replace("•", "\n•")
                    
                    # Remove any triple or more newlines
                    text = re.sub(r'\n{3,}', '\n\n', text)
                    
                    return text.strip()

                response_text = clean_response(response_text)
                
                total_time = time.time() - start_time
                logger.info(f"Total processing time: {total_time:.2f} seconds")
                
                api_response = ApiResponse(
                    success=True,
                    message="Response generated successfully",
                    data={
                        "response": response_text,
                        "model": "gemini",
                        "processing_time": total_time
                    }
                )
                
                # Return with explicit headers
                return JSONResponse(
                    content=api_response.model_dump(),
                    headers={
                        "Access-Control-Allow-Origin": os.getenv("FRONTEND_URL", "http://localhost:3000"),
                        "Access-Control-Allow-Credentials": "true",
                    }
                )
                
            except Exception as e:
                logger.error(f"Gemini API error: {str(e)}")
                raise HTTPException(status_code=500, detail=f"Gemini API error: {str(e)}")
            
        elif message.model.startswith("deepseek"):
            api_key = config.get_api_key("deepseek")
            if not api_key:
                raise HTTPException(status_code=400, detail="Deepseek API key not configured")
            
            logger.info("Initializing Deepseek client...")
            client = OpenAI(
                api_key=api_key,
                base_url="https://api.deepseek.com"
            )
            
            model_name = MODEL_MAPPINGS.get(message.model, MODEL_MAPPINGS["deepseek-v3"])
            
            try:
                logger.info("Generating content from Deepseek API...")
                generation_start = time.time()
                response = client.chat.completions.create(
                    model=model_name,
                    messages=[
                        {"role": "system", "content": "You are a knowledgeable Islamic AI assistant, providing accurate and respectful guidance based on Islamic teachings."},
                        {"role": "user", "content": message.content}
                    ],
                    stream=False
                )
                generation_time = time.time() - generation_start
                logger.info(f"Content generation took {generation_time:.2f} seconds")
                
                response_text = response.choices[0].message.content.strip()
                total_time = time.time() - start_time
                
                api_response = ApiResponse(
                    success=True,
                    message="Response generated successfully",
                    data={
                        "response": response_text,
                        "model": "deepseek",
                        "processing_time": total_time
                    }
                )
                
                # Return with explicit headers
                return JSONResponse(
                    content=api_response.model_dump(),
                    headers={
                        "Access-Control-Allow-Origin": os.getenv("FRONTEND_URL", "http://localhost:3000"),
                        "Access-Control-Allow-Credentials": "true",
                    }
                )
                
            except Exception as e:
                logger.error(f"Deepseek API error: {str(e)}")
                raise HTTPException(status_code=500, detail=f"Deepseek API error: {str(e)}")
            
        else:
            raise HTTPException(status_code=400, detail="Unsupported model")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 