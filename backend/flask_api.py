import os
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from flask_cors import CORS
from RAG_creator_single import PatentProcessor
import ollama

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Route to handle file uploads
@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(filepath)

    return jsonify({"message": "File uploaded successfully", "filename": filename}), 200

# Route to list all uploaded files
@app.route("/list-files", methods=["GET"])
def list_files():
    files = os.listdir(app.config["UPLOAD_FOLDER"])
    return jsonify({"files": files}), 200

# Route to process an uploaded file
@app.route("/process", methods=["POST"])
def process_patent():
    if not request.is_json:
        return jsonify({'error': 'Request must be in JSON format'}), 400
    
    data = request.get_json()
    file_name = data.get("file_name")
    if not file_name:
        return jsonify({'error': 'file_name is required'}), 400
    
    file_path = os.path.join(app.config["UPLOAD_FOLDER"], file_name)
    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404

    # Optional parameters with default values
    document_type = data.get('document_type', 'elevator pitch')
    embedding_model_name = data.get('embedding_model_name', 'all-MiniLM-L6-v2')
    persist_directory = data.get('persist_directory', 'vector_store')
    model_name = data.get('model_name', 'llama3')
    additional_info = data.get('additional_info', '')

    # Initialize processor
    processor = PatentProcessor(file_path, embedding_model_name)
    processor.process_documents()
    
    # Construct the prompt
    query = f"Create a {document_type} for the patent."
    prompt = processor.create_prompt(input_query=query, document_type=document_type, add_info=additional_info)
    
    sys_prompt = f"""
    You are an expert content creator specializing in generating {document_type} tailored to the user's needs.
    Your task is to produce a compelling, well-structured, and high-quality {document_type} based on the provided details.
    Ensure the content is engaging, informative, and aligned with the desired objective.
    """
    
    # Generate response using Ollama
    response = ollama.chat(
        model=model_name,
        messages=[
            {"role": "system", "content": sys_prompt},
            {"role": "user", "content": prompt}
        ]
    )
    
    return jsonify({'generated_text': response['message']['content']})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)