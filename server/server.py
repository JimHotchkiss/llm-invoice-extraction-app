from flask import Flask, jsonify, request
from flask_cors import CORS
from api.llm_call import llm_call
from database.queries import get_invoices, save_invoice_to_db, edit_invoice, delete_invoice
import base64



# Instantiate instance
app = Flask(__name__)
CORS(app)

@app.route("/api/invoices", methods=["GET"])
def query():
    invoices = get_invoices()
    data_as_dict = [dict(row) for row in invoices]
    return jsonify({
        "message": data_as_dict
    })

@app.route("/api/edit/<int:invoice_id>", methods=["PUT"])
def edit(invoice_id):
    data = request.json
    invoices = edit_invoice(invoice_id, data)
    # data_as_dict = [dict(row) for row in invoices]
    return jsonify({
        "message": invoices
    })

@app.route("/api/delete/<int:invoice_id>", methods=["DELETE"])
def delete(invoice_id):
    print(f"invoice_id: {invoice_id}")
    response = delete_invoice(invoice_id)
    return jsonify({
        "message": "Delete Successful"
    }), 200


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Backend home route"
    })

# Define my LLM API Route
@app.route("/api/extract", methods=["POST"])
def api():
    file = request.files['file']
     # Read the binary data
    pdf_bytes = file.read()
    # Encode the binary data to base64 bytes
    base64_string = base64.b64encode(pdf_bytes).decode('utf-8')

    # Note: response has already been converted to dict at the LLM call
    response = llm_call(base64_string)

    # Convert to json for client
    json_response = jsonify(response), 200

    # Save to database
    invoice_id = save_invoice_to_db(response)

    return json_response
    

      
if __name__ == "__main__":
    app.run(debug=True, port=8080)