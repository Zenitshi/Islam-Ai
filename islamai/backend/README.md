# IslamAI Backend

This is the backend server for IslamAI, providing API endpoints for chat functionality and API key management.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
- Windows:
```bash
.\venv\Scripts\activate
```
- Linux/Mac:
```bash
source venv/bin/activate
```

3. Install the backend package in development mode:
```bash
pip install -e .
```

This will install all required dependencies and set up the Python path correctly.

## Running the Server

To start the development server:
```bash
python run.py
```

The server will start at `http://localhost:8000`

## Environment Variables

Create a `.env` file in the backend directory with the following variables:
```env
# Server Configuration
PORT=8000
HOST=0.0.0.0

# CORS Settings
FRONTEND_URL=http://localhost:3000

# API Configuration
CONFIG_DIR=~/.islamai
CONFIG_FILE=config.json
```

## API Endpoints

- `POST /api/keys` - Update API keys for AI providers
- `GET /api/keys/{provider}` - Get API key for a specific provider
- `POST /api/chat` - Send a chat message to the AI

## Configuration

API keys are stored securely in the user's home directory under `.islamai/config.json`

## Development

The backend uses:
- FastAPI for the web framework
- Google's GenerativeAI SDK for Gemini
- OpenAI SDK for Deepseek API integration
- Pydantic for data validation

## Supported Models

- Gemini 2.0 Pro Experimental (gemini-2.0-pro-exp-02-05)
- Gemini 2.0 Flash Thinking (gemini-2.0-flash-thinking-exp-01-21)
- DeepSeek V3 (deepseek-chat)
- DeepSeek R1 (deepseek-reasoner) 



# cd islamai/backend
# python -m venv venv
.\venv\Scripts\activate  # On Windows