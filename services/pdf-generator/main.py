"""PDF Generator Service - FastAPI + WeasyPrint"""

from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel
import os

app = FastAPI(title="AOE PDF Generator", version="1.0.0")

API_KEY = os.getenv("PDF_SERVICE_API_KEY", "")


class ContractRequest(BaseModel):
    template: str
    data: dict


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/generate")
async def generate_pdf(
    request: ContractRequest,
    x_api_key: str = Header(...),
):
    if x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")

    # TODO: render template with Jinja2
    # TODO: convert HTML to PDF with WeasyPrint
    # TODO: upload to Supabase Storage
    # TODO: return PDF URL

    return {"message": "PDF generation not yet implemented", "template": request.template}
