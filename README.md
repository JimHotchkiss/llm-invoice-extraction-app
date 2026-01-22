# AI-Powered Invoice Extraction App

A full-stack application that uses GPT-4o to automatically extract structured data from invoice PDFs. Upload an invoice, and the LLM extracts customer details, line items, and totals into a SQLite database with full CRUD operations.

**Tech Stack:** Next.js, Flask, SQLite, OpenAI API, Tailwind CSS

## Setup & Run

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd case_study
```

### 2. Backend Setup
```bash
cd server
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Create .env file with your OpenAI API key
echo "OPENAI_API_KEY=your_key_here" > .env

# Initialize database
python database/init_db.py

# Start server
python app.py
```
Backend runs at `http://127.0.0.1:8080`

### 3. Frontend Setup
```bash
cd ../client
npm install
npm run dev
```
Frontend runs at `http://localhost:3000`

## Usage

1. Upload an invoice PDF
2. AI extracts data automatically
3. View, edit, or delete invoices in the table
4. Click "View line items" to see invoice details

Sample invoices included in `/server/invoices/`