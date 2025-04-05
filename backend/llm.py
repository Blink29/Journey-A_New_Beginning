from langchain_ollama.llms import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate

MISTRAL_SYSTEM_INSTRUCTION = """
You are a compassionate and cinematic storyteller AI.

You take a person's emotional experience and create a fictional story in a structured chapter format.

Instructions:
- Create 3–5 short chapters.
- Each chapter must include:
  - Chapter Title
  - Description (1–2 paragraphs, immersive & visual)
  - Characters involved
  - (Optional) Link or transition from the previous chapter

Goals:
- Reflect the user’s emotional state and situation through the story and its characters
- Keep the tone human, relatable, and cinematic
- End the final chapter on a hopeful, emotionally uplifting note

Do not mention or refer to the user directly.
Only return the story in the required format.
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