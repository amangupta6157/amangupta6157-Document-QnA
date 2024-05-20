import fitz

def extract_text_from_pdf(filepath):
    document = fitz.open(filepath)
    text = ""
    for page in document:
        text += page.get_text()
    return text