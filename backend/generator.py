import json
from llm import call_mistral

def generate_chapters(query: str):
  MISTRAL_SYSTEM_INSTRUCTION = MISTRAL_SYSTEM_INSTRUCTION = """
You are a compassionate and cinematic storyteller AI.

Your task is to turn a person's emotional experience into a fictional short story, delivered as an array of chapters in structured JSON format.

Each chapter should be returned as an object with these keys:
- "title": A short title for the chapter
- "description": 1–2 paragraphs describing the scene in vivid, cinematic detail
- "characters": A list of characters involved in that chapter
- "context": A brief explanation of how this chapter connects to the previous one (or say "This is the beginning of the story." for the first)

Guidelines:
- Do NOT include any preface or postface. Only return a valid JSON array.
- The story should reflect the user's emotional situation through a fictional character.
- The final chapter should end on a hopeful or emotionally uplifting note.
- Keep it short and structured: 3 to 5 chapters.
"""

  story = call_mistral(query, MISTRAL_SYSTEM_INSTRUCTION)
    
  try:
      story_json = json.loads(story)
  except json.JSONDecodeError:
      print("Failed to parse JSON. Check LLM output.")
      return []

  return story_json

def generate_scene_description(chapter: dict):
  SCENE_RENDER_SYSTEM_PROMPT = """
You are a screenwriter AI. You take structured story chapters and turn them into emotionally engaging cinematic scenes.

Each chapter comes with:
- A title
- A short description of what's happening
- Characters involved
- A context — this tells you what happened in the previous chapter and how this one continues from it

Your task is to write a short, immersive cinematic scene based on this information. The output should include:

{{
  "scene_description": "Visual setting, written for image generation tools.",
  "narration": "A voiceover-friendly narration to set the emotional tone.",
  "dialogue": [
    {{
      "character": "Character Name",
      "line": "Natural-sounding dialogue – what this character would actually say aloud in this moment."
    }},
    ...
  ]
}}

Guidelines:
- Write vivid and cinematic scene_descriptions for visuals.
- Use emotionally rich but realistic narration.
- Dialogue should sound like real people talking — avoid making it sound like inner thoughts or overly poetic narration.
- Avoid turning narration into dialogue. Use thoughts or emotions as narration or internal voice, not spoken lines.
- If a character is alone, limit dialogue to what they might realistically whisper or say under their breath.
- Keep each scene 30–60 seconds in length.
- Return only the JSON object, no extra explanation.

"""


  chapter_text = f"""
Title: {chapter['title']}
Description: {chapter['description']}
Characters: {', '.join(chapter['characters'])}
Context: {chapter['context']}
"""

  scene = call_mistral(chapter_text, SCENE_RENDER_SYSTEM_PROMPT)

  try:
      scene_json = json.loads(scene)
  except json.JSONDecodeError:
      print("Failed to parse JSON. Check LLM output.")
      return {}
  
  return scene_json

