from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Dict, Optional
from io import BytesIO
import base64
import requests
import hashlib
import torch
from diffusers import StableDiffusionPipeline
import secrets

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ollama API endpoints
OLLAMA_API_URL = "http://localhost:11434/api/generate"
OLLAMA_TAGS_URL = "http://localhost:11434/api/tags"

# Load image generation model
pipe = StableDiffusionPipeline.from_pretrained(
    "runwayml/stable-diffusion-v1-5",
    torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
).to("cuda" if torch.cuda.is_available() else "cpu")

# In-memory data stores
users: Dict[str, str] = {}  # email -> hashed_password
tokens: Dict[str, str] = {}  # token -> email

# Utility
def hash_password(password: str):
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token():
    return secrets.token_hex(32)

# Request Models
class ChatRequest(BaseModel):
    prompt: str
    model: str

class ImageRequest(BaseModel):
    prompt: str

class UserRegister(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Routes
@app.get("/")
def home():
    return {"message": "FastAPI server is running!"}

@app.post("/register")
def register(user: UserRegister):
    if user.email in users:
        raise HTTPException(status_code=400, detail="User already exists")
    users[user.email] = hash_password(user.password)
    return {"message": "User registered successfully"}

@app.post("/login")
def login(user: UserLogin):
    stored_password = users.get(user.email)
    if not stored_password or stored_password != hash_password(user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = generate_token()
    tokens[token] = user.email
    return {"message": "Login successful", "accessToken": token, "email": user.email}

@app.get("/me")
def get_me(authorization: Optional[str] = Header(None)):
    if not authorization or authorization not in tokens:
        raise HTTPException(status_code=401, detail="Invalid or missing token")
    return {"email": tokens[authorization]}

@app.get("/models/")
def get_models():
    try:
        response = requests.get(OLLAMA_TAGS_URL)
        response.raise_for_status()
        data = response.json()
        models = [model["model"] for model in data.get("models", [])]
        return {"models": models}
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error fetching models: {str(e)}")

@app.post("/chat/")
def chat(request: ChatRequest):
    available_models = get_models()["models"]
    if request.model not in available_models:
        raise HTTPException(status_code=400, detail="Model not found")

    ollama_payload = {
        "model": request.model,
        "prompt": request.prompt,
        "stream": False
    }

    try:
        response = requests.post(OLLAMA_API_URL, json=ollama_payload)
        response.raise_for_status()
        data = response.json()
        return {"response": data.get("response", "Ollama did not return a response.")}
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Ollama API Error: {str(e)}")

@app.post("/generate-image/")
def generate_image(request: ImageRequest):
    try:
        image = pipe(request.prompt).images[0]
        buffered = BytesIO()
        image.save(buffered, format="PNG")
        encoded_image = base64.b64encode(buffered.getvalue()).decode("utf-8")
        return {"image_data": encoded_image}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image generation error: {str(e)}")
