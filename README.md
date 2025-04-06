# Journey - A New Beginning

This project combines React frontend with AI capabilities.

## Image Generation

For image generation using Stable Diffusion, use the following Google Colab link:
- [Stable Diffusion Image Generation](https://colab.research.google.com/drive/1NqXO83_tATvxKYmzlHUYZ2PnGPnpNvS7?usp=sharing)

## Updating the base_url for Media Generation

When using the `generate_media_for_scenes` function in app.py, update the `base_url` with the URL you receive from your Google Drive and TunnelMole setup:

```python
def generate_media_for_scenes(scenes):
  base_url="https://your-tunnelmole-url.tunnelmole.net"
  # Function code...
```

Replace `"https://your-tunnelmole-url.tunnelmole.net"` with the actual URL provided by TunnelMole after connecting to your Google Drive instance.

## Prerequisites

- Install [Ollama](https://ollama.com/) and Mistral-7B model
- Run `ollama pull mistral:7b` to download the model

## Setup Instructions

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Install JavaScript dependencies:
```bash
npm install
```

## Running the Application

1. Start Ollama service:
```bash
ollama serve
```

2. Start the backend server:
```bash
python .\backend\app.py
```

3. Start the frontend development server:
```bash
npm run dev
```

