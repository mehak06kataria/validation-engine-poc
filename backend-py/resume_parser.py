import os
from fastapi import UploadFile


async def parse_resume(file: UploadFile):
    if not file.filename.endswith(".pdf"):
        return {"error": "Only PDF files are allowed."}

    contents = await file.read()
    # Dummy data extraction logic
    return {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "phone": "9876543210",
        "experience": "3 years"
    }
