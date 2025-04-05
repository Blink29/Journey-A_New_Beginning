from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from llm import call_mistral

app = Flask(__name__)
CORS(app)  # Enable CORS to allow frontend to make requests

@app.route('/api/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({"status": "ok", "message": "Flask API is running"})

@app.route('/api/generate-story', methods=['POST'])
def generate_story():
    """Endpoint to generate a story based on user input"""
    data = request.json
    
    if not data or 'query' not in data:
        return jsonify({
            "success": False,
            "message": "Missing 'query' in request data"
        }), 400
    
    user_query = data['query']
    
    # Generate story using the Mistral model
    story = call_mistral(user_query)
    
    response = {
        "success": True,
        "message": "Story generated successfully",
        "story": story
    }
    
    return jsonify(response)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)