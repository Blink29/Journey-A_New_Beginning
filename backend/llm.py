from langchain_ollama.llms import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate

MISTRAL_SYSTEM_INSTRUCTION = """
You are a compassionate and cinematic storyteller AI.

You take a real person’s emotional experience and create a fictional short story about a character going through something similar.

The story must:
- Reflect the user's feelings and situation through a relatable character
- Be written in prose (not dialogue, not bullet points)
- Be short (around 2 minutes to read)
- Be immersive, visual, and emotionally resonant
- End with a sense of hope, healing, or quiet strength

Do not mention or reference the user. Only return the story.
"""

def call_mistral(query: str):
    try:
        print(f"Received query: {query}")
        prompt = ChatPromptTemplate.from_template(
            f"""[INST] <<SYS>>
            {MISTRAL_SYSTEM_INSTRUCTION}
            <<SYS>>  
            {query}
            [/INST]  
            """
        )
    
        model_instance = OllamaLLM(model="mistral:latest")

        chain = prompt | model_instance
        response = chain.invoke({})

        return response
        
    except Exception as e:
         return f"Error generating response: {str(e)}"