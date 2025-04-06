from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import requests
import base64
import urllib.parse
from gtts import gTTS
from generator import generate_chapters, generate_scene_description

app = Flask(__name__)
CORS(app) 

CONTENT_DIR = os.path.join(os.path.dirname(__file__), 'generated_content')
IMAGES_DIR = os.path.join(CONTENT_DIR, 'images')
AUDIO_DIR = os.path.join(CONTENT_DIR, 'audio')

os.makedirs(IMAGES_DIR, exist_ok=True)
os.makedirs(AUDIO_DIR, exist_ok=True)

@app.route('/api/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({"status": "ok", "message": "Flask API is running"})

@app.route('/content/<path:filename>')
def serve_content(filename):
    """Serve generated content files"""
    return send_from_directory(CONTENT_DIR, filename)

@app.route('/api/generate-story', methods=['POST'])
def generate_story():
    """Endpoint to generate a story based on user input and create media assets"""
    data = request.json
    
    if not data or 'query' not in data:
        return jsonify({
            "success": False,
            "message": "Missing 'query' in request data"
        }), 400
    
    user_query = data['query']

    story_chapters = generate_chapters(user_query)

    scene_descriptions = []
    for chapter in story_chapters:
        scene_description = generate_scene_description(chapter)
        scene_descriptions.append(scene_description)

    media_results = generate_media_for_scenes(story_chapters, scene_descriptions)
    
    response = {
        "success": True,
        "message": "Story and media generated successfully",
        "story": story_chapters,
        "scene_descriptions": scene_descriptions,
        "media_results": media_results
    }
    
    return jsonify(response)

def generate_media_for_scenes(story_chapters, scenes):
    """Generate images and audio for each scene"""
    base_url = "https://ed9zya-ip-35-233-232-61.tunnelmole.net"
    results = []
    
    for i, (chapter, scene) in enumerate(zip(story_chapters, scenes)):
        scene_result = {"scene_index": i}

        try:
            image_prompt = chapter.get('description', '')
            # print(f"Generating image for prompt: {image_prompt}")
            encoded_prompt = urllib.parse.quote(image_prompt)
            image_url = f"{base_url}/generate_image?prompt={encoded_prompt}"
            response = requests.get(image_url)
            
            if response.status_code == 200:
                img_data = response.json().get('image')
                if img_data:
                    img_filename = f'scene_{i}.jpg'
                    img_path = os.path.join(IMAGES_DIR, img_filename)
                    with open(img_path, "wb") as img_file:
                        img_file.write(base64.b64decode(img_data))
                    scene_result["image_path"] = f'/content/images/{img_filename}'
            else:
                scene_result["image_error"] = f"Failed to generate image: {response.status_code}"
        except Exception as e:
            scene_result["image_error"] = f"Error generating image: {str(e)}"
        
        try:
            narration = scene.get('narration', '')
            if narration:
                narration_filename = f'scene_{i}_narration.mp3'
                narration_path = os.path.join(AUDIO_DIR, narration_filename)
                tts = gTTS(text=narration, lang='en', slow=False)
                tts.save(narration_path)
                scene_result["narration_path"] = f'/content/audio/{narration_filename}'
        except Exception as e:
            scene_result["narration_error"] = f"Error generating narration audio: {str(e)}"
        
        try:
            dialogues = scene.get('dialogue', [])
            dialogue_paths = []
            
            for j, dialogue in enumerate(dialogues):
                character = dialogue.get('character', 'Unknown')
                line = dialogue.get('line', '')
                
                if line:
                    tlds = ['com', 'co.uk', 'com.au', 'co.in', 'ca']
                    tld = tlds[j % len(tlds)]
                    
                    dialogue_filename = f'scene_{i}_dialogue_{j}.mp3'
                    dialogue_path = os.path.join(AUDIO_DIR, dialogue_filename)
                    tts = gTTS(text=line, lang='en', tld=tld, slow=False)
                    tts.save(dialogue_path)
                    dialogue_paths.append({
                        "character": character,
                        "line": line,
                        "audio_path": f'/content/audio/{dialogue_filename}'
                    })
            
            scene_result["dialogue_paths"] = dialogue_paths
        except Exception as e:
            scene_result["dialogue_error"] = f"Error generating dialogue audio: {str(e)}"
        
        results.append(scene_result)
    
    return results

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)