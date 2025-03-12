from setuptools import setup, find_packages

setup(
    name="islamai-backend",
    version="0.1.0",
    packages=find_packages(include=['app', 'app.*', 'config', 'config.*']),
    install_requires=[
        "fastapi==0.104.1",
        "uvicorn==0.24.0",
        "pydantic==2.5.2",
        "google-generativeai==0.3.1",
        "openai==1.12.0",
        "requests==2.31.0",
        "python-dotenv==1.0.0",
        "python-multipart==0.0.6"
    ],
) 