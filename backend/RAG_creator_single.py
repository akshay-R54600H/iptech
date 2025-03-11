from pydantic import BaseModel
from typing import List, Dict
from chromadb import Client as ChromaClient
from sentence_transformers import SentenceTransformer
import PyPDF2
import os
import gc
import random


# Define Pydantic models
class Document(BaseModel):
    page_content: str
    metadata: Dict[str, str]

class PatentProcessor:

    chunk_size = 256
    chunk_overlap = 25

    def __init__(self, pdf_path: str, embedding_model_name: str):
        self.pdf_path = pdf_path
        self.embedding_model_name = embedding_model_name
        self.embedding_model = SentenceTransformer(embedding_model_name)
        self.chroma_client = ChromaClient()  # Runs in-memory, no persistence
        # Get current system time as a string
        num = random.randint(1, 10000)  # Random integer between 1 and 100
        self.collection_name = 'documents_'+str(num)
        self.chroma_collection = self.chroma_client.get_or_create_collection(name=self.collection_name)
        self.add_info = ""

    def load_single_pdf(self) -> List[Document]:
        try:
            documents = []
            with open(self.pdf_path, "rb") as f:
                reader = PyPDF2.PdfReader(f)
                for i, page in enumerate(reader.pages):
                    text = page.extract_text()
                    if text:
                        documents.append(Document(page_content=text, metadata={"source": os.path.basename(self.pdf_path), "page": str(i+1)}))
            return documents
        except Exception as e:
            print(f"Error loading file {self.pdf_path}: {e}")
            return []
    
    def split_text(self, documents: List[Document], chunk_size: int = chunk_size, chunk_overlap: int = chunk_overlap) -> List[Document]:
        split_docs = []
        for doc in documents:
            words = doc.page_content.split()
            for i in range(0, len(words), chunk_size - chunk_overlap):
                chunk_text = " ".join(words[i:i + chunk_size])
                split_docs.append(Document(page_content=chunk_text, metadata=doc.metadata))
        return split_docs
    
    def process_documents(self):
        documents = self.load_single_pdf()
        docs = self.split_text(documents)
        print(f"Number of chunks generated: {len(docs)}")
        
        for i, doc in enumerate(docs):
            embedding = self.embedding_model.encode(doc.page_content).tolist()
            self.chroma_collection.add(
                ids=[str(i)],  # Ensure unique ID for each document
                embeddings=[embedding],
                documents=[doc.page_content],
                metadatas=[doc.metadata]
            )
    
    def retrieve_documents(self, query: str, top_k: int = 20) -> List[Document]:
        query_embedding = self.embedding_model.encode(query).tolist()
        results = self.chroma_collection.query(query_embeddings=[query_embedding], n_results=top_k)
        
        retrieved_docs = [
            Document(page_content=doc, metadata=meta)
            for doc, meta in zip(results["documents"][0], results["metadatas"][0])
        ]
        return retrieved_docs
    
    def create_prompt(self, input_query: str, document_type: str, add_info: str) -> str:
        """Retrieves relevant documents and generates a structured response."""
        retrieved_docs = self.retrieve_documents(input_query)
        context = "\n\n".join([doc.page_content for doc in retrieved_docs])
        prompt = f"""
            ### User Input:
            {input_query}

            ### User Additional Information:
            {add_info}

            ### Context (if any):
            {context}

            ### Output:
            (Generate a structured and concise {document_type} without any introductory text or explanations.)
        """
        self.chroma_client.delete_collection(self.collection_name)
        del self.chroma_client
        gc.collect()        
        return prompt


# Usage Example
# if __name__ == "__main__":
#     pdf_path = "Patents/ViewPDF (1).pdf"
#     embedding_model_name = "all-MiniLM-L6-v2"
#     persist_directory = "vector_store"
    
#     processor = PatentProcessor(pdf_path, embedding_model_name, persist_directory)
#     processor.process_documents()
    
#     query = "Write an elevator pitch for the patent that I can tell to a potential investor."
#     document_type = "elevator pitch"
#     prompt = processor.create_prompt(input_query = query, document_type = document_type)
    
#     print("Generated Prompt:")
#     print(prompt)