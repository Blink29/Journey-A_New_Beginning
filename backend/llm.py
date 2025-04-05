from langchain_ollama.llms import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate


def call_mistral(query: str, sys_promt: str) -> str:
    try:
        print(f"Received query: {query}")
        prompt = ChatPromptTemplate.from_template(
            f"""[INST] <<SYS>>
            {sys_promt}
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