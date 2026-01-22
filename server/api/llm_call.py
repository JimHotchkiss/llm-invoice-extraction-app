import os
from typing import List
from datetime import datetime, date
from flask import jsonify
from openai import OpenAI
from pydantic import BaseModel



from dotenv import load_dotenv

load_dotenv()

client = OpenAI()


# ------------------------------------------------------
# 1. Define the Pydantic model for the invoice
# ------------------------------------------------------
class LineItem(BaseModel):
    item_number: int
    product_description: str
    quantity: int
    unit_price: float
    total_unit_price: float


    

class InvoiceDetails(BaseModel):
    invoice_number: int
    customer_id: int
    order_date: date
    customer_name: str
    customer_address: str
    ship_to_address: str
    sales_person: str
    po_number: int
    ship_date: date
    ship_method: str
    terms: str
    sub_total: float
    sales_tax: float
    invoice_total: float
    line_items: List[LineItem]



# ------------------------------------------------------------
# 2. Call to LLM
# ------------------------------------------------------------
def llm_call(file):
    """
    Extract structured data from an invoice PDF using OpenAI's GPT-4o.
    
    Sends the PDF to the LLM with instructions to extract invoice details
    and returns the data structured according to the InvoiceDetails schema.
    
    Args:
        file (FileStorage): Uploaded PDF file as a base64 string from Flask request.files
        
    Returns:
        InvoiceDetails: Pydantic model containing extracted invoice data
        
    Raises:
        OpenAIError: If the API call fails
        ValidationError: If the response doesn't match InvoiceDetails schema
    """
    completion = client.beta.chat.completions.parse(
        model='gpt-4o',
        messages = [
            {
                "role": "user",
                "content": [
                    {
                        "type": "file",
                        "file": {
                            "filename": "Invoice_1_TechSupply_Complete.pdf",
                            "file_data": f"data:application/pdf;base64,{file}",
                        }
                    },
                    {
                        "type": "text",
                        "text": """
                                Extract all line items from this invoice into structured data.
    
                                For each line item, extract:
                                item_number
                                product_description
                                quantity
                                unit_price
                                total_unit_price
                                
                                Return all line items as a list.


                                """,
                    }
                ],
            },
        ],
        response_format=InvoiceDetails,
    )

    # ------------------------------------------------------------
    # 3. Parse the response
    # ------------------------------------------------------------
    invoices = completion.choices[0].message.parsed.model_dump()

    return invoices
    

