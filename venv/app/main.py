from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db import SessionLocal, engine
from app.models import Base, Document
from app.utils.pdf_handler import extract_text_from_pdf
from app.utils.nlp_handler import generate_answer
import os

# Define file upload path
UPLOAD_PATH = "uploads"
if not os.path.exists(UPLOAD_PATH):
    os.makedirs(UPLOAD_PATH)

app = FastAPI()

# Create database tables
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AskQuestionRequest(BaseModel):  # Define Pydantic model for request body
    document_id: int
    question: str

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        contents = await file.read()
        file_location = os.path.join(UPLOAD_PATH, file.filename)
        
        # Save file to local filesystem
        with open(file_location, "wb") as f:
            f.write(contents)
        
        # Extract text from PDF
        text = extract_text_from_pdf(file_location)

        document = Document(filename=file.filename, content=text)
        db.add(document)
        db.commit()
        db.refresh(document)
        
        return {"id": document.id, "filename": file.filename, "content": text}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/ask/")
async def ask_question(request: AskQuestionRequest, db: Session = Depends(get_db)):
    document = db.query(Document).filter(Document.id == request.document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    answer = generate_answer(document.content, request.question)
    return JSONResponse({"answer": answer})