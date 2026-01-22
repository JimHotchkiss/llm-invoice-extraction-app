import React, {useState} from 'react'

const EditInvoiceModal = ({ invoice, onSave, onCancel }) => {

    const [formData, setFormData] = useState(invoice)

    const handleEdit = async (e) => {
        e.preventDefault();
        const invoice_id = invoice.invoice_id
        try {
            // Call flask server to update
            const response = await fetch(`http://127.0.0.1:8080/api/edit/${invoice_id}`, {
                method: 'PUT', 
                headers: { 'Content-Type': 'application/json'}, 
                body: JSON.stringify(formData)
        })

        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        if (data) {
            console.log(`response data: ${data.message}`)
            onSave()
        }
            
    
            } catch (error) {
                console.error('Error updating invoice', error)
                alert('Failed to update invoice')
            }
    }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[rgb(44,45,50)] p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Edit Invoice</h2>
        
        <form onSubmit={handleEdit}>
            {/* Header Fields */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                <label className="block text-sm mb-2 text-gray-400">Invoice Number</label>
                <input 
                    value={formData.invoice_number}
                    onChange={(e) => setFormData({...formData, invoice_number: e.target.value})}
                    className="w-full p-2 bg-[rgb(50,51,57)] rounded text-white"
                />
                </div>
                
                <div>
                <label className="block text-sm mb-2 text-gray-400">Customer ID</label>
                <input 
                    value={formData.customer_id || ''}
                    onChange={(e) => setFormData({...formData, customer_id: e.target.value})}
                    className="w-full p-2 bg-[rgb(50,51,57)] rounded text-white"
                />
                </div>
                
                <div>
                <label className="block text-sm mb-2 text-gray-400">Customer Name</label>
                <input 
                    value={formData.customer_name || ''}
                    onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                    className="w-full p-2 bg-[rgb(50,51,57)] rounded text-white"
                />
                </div>
                
                <div>
                <label className="block text-sm mb-2 text-gray-400">Order Date</label>
                <input 
                    type="date"
                    value={formData.order_date || ''}
                    onChange={(e) => setFormData({...formData, order_date: e.target.value})}
                    className="w-full p-2 bg-[rgb(50,51,57)] rounded text-white"
                />
                </div>
                
                <div>
                <label className="block text-sm mb-2 text-gray-400">Ship Date</label>
                <input 
                    type="date"
                    value={formData.ship_date || ''}
                    onChange={(e) => setFormData({...formData, ship_date: e.target.value})}
                    className="w-full p-2 bg-[rgb(50,51,57)] rounded text-white"
                />
                </div>
                
                <div>
                <label className="block text-sm mb-2 text-gray-400">PO Number</label>
                <input 
                    value={formData.po_number || ''}
                    onChange={(e) => setFormData({...formData, po_number: e.target.value})}
                    className="w-full p-2 bg-[rgb(50,51,57)] rounded text-white"
                />
                </div>
                
                <div>
                <label className="block text-sm mb-2 text-gray-400">Sales Person</label>
                <input 
                    value={formData.sales_person || ''}
                    onChange={(e) => setFormData({...formData, sales_person: e.target.value})}
                    className="w-full p-2 bg-[rgb(50,51,57)] rounded text-white"
                />
                </div>
                
                <div>
                <label className="block text-sm mb-2 text-gray-400">Ship Method</label>
                <input 
                    value={formData.ship_method || ''}
                    onChange={(e) => setFormData({...formData, ship_method: e.target.value})}
                    className="w-full p-2 bg-[rgb(50,51,57)] rounded text-white"
                />
                </div>
                
                <div className="col-span-2">
                <label className="block text-sm mb-2 text-gray-400">Customer Address</label>
                <textarea 
                    value={formData.customer_address || ''}
                    onChange={(e) => setFormData({...formData, customer_address: e.target.value})}
                    className="w-full p-2 bg-[rgb(50,51,57)] rounded text-white"
                    rows="2"
                />
                </div>
                
                <div className="col-span-2">
                <label className="block text-sm mb-2 text-gray-400">Ship To Address</label>
                <textarea 
                    value={formData.ship_to_address || ''}
                    onChange={(e) => setFormData({...formData, ship_to_address: e.target.value})}
                    className="w-full p-2 bg-[rgb(50,51,57)] rounded text-white"
                    rows="2"
                />
                </div>
                
                <div>
                <label className="block text-sm mb-2 text-gray-400">Subtotal</label>
                <input 
                    type="number"
                    step="0.01"
                    value={formData.sub_total || ''}
                    onChange={(e) => setFormData({...formData, sub_total: parseFloat(e.target.value)})}
                    className="w-full p-2 bg-[rgb(50,51,57)] rounded text-white"
                />
                </div>
                
                <div>
                <label className="block text-sm mb-2 text-gray-400">Sales Tax</label>
                <input 
                    type="number"
                    step="0.01"
                    value={formData.sales_tax || ''}
                    onChange={(e) => setFormData({...formData, sales_tax: parseFloat(e.target.value)})}
                    className="w-full p-2 bg-[rgb(50,51,57)] rounded text-white"
                />
                </div>
                
                <div>
                <label className="block text-sm mb-2 text-gray-400">Freight</label>
                <input 
                    type="number"
                    step="0.01"
                    value={formData.freight || ''}
                    onChange={(e) => setFormData({...formData, freight: parseFloat(e.target.value)})}
                    className="w-full p-2 bg-[rgb(50,51,57)] rounded text-white"
                />
                </div>
                
                <div>
                <label className="block text-sm mb-2 text-gray-400">Invoice Total</label>
                <input 
                    type="number"
                    step="0.01"
                    value={formData.invoice_total || ''}
                    onChange={(e) => setFormData({...formData, invoice_total: parseFloat(e.target.value)})}
                    className="w-full p-2 bg-[rgb(50,51,57)] rounded text-white"
                />
                </div>
                
                <div className="col-span-2">
                <label className="block text-sm mb-2 text-gray-400">Terms</label>
                <input 
                    value={formData.terms || ''}
                    onChange={(e) => setFormData({...formData, terms: e.target.value})}
                    className="w-full p-2 bg-[rgb(50,51,57)] rounded text-white"
                />
                </div>
            </div>
            
            {/* Line Items Section */}
            <h3 className="text-lg font-semibold mt-6 mb-4 text-white border-b border-gray-700 pb-2">
                Line Items
            </h3>
            
            {formData.line_items.map((item, idx) => (
                <div key={idx} className="mb-4 p-4 bg-[rgb(50,51,57)] rounded border border-gray-700">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm mb-2 text-gray-400">Product Description</label>
                    <input 
                        value={item.product_description || ''}
                        onChange={(e) => {
                        const updatedItems = [...formData.line_items];
                        updatedItems[idx].product_description = e.target.value;
                        setFormData({...formData, line_items: updatedItems});
                        }}
                        className="w-full p-2 bg-[rgb(44,45,50)] rounded text-white"
                    />
                    </div>
                    
                    <div>
                    <label className="block text-sm mb-2 text-gray-400">Product ID</label>
                    <input 
                        value={item.product_id || ''}
                        onChange={(e) => {
                        const updatedItems = [...formData.line_items];
                        updatedItems[idx].product_id = e.target.value;
                        setFormData({...formData, line_items: updatedItems});
                        }}
                        className="w-full p-2 bg-[rgb(44,45,50)] rounded text-white"
                    />
                    </div>
                    
                    <div>
                    <label className="block text-sm mb-2 text-gray-400">Quantity</label>
                    <input 
                        type="number"
                        value={item.quantity || ''}
                        onChange={(e) => {
                        const updatedItems = [...formData.line_items];
                        updatedItems[idx].quantity = parseInt(e.target.value);
                        setFormData({...formData, line_items: updatedItems});
                        }}
                        className="w-full p-2 bg-[rgb(44,45,50)] rounded text-white"
                    />
                    </div>
                    
                    <div>
                    <label className="block text-sm mb-2 text-gray-400">Unit Price</label>
                    <input 
                        type="number"
                        step="0.01"
                        value={item.unit_price || ''}
                        onChange={(e) => {
                        const updatedItems = [...formData.line_items];
                        updatedItems[idx].unit_price = parseFloat(e.target.value);
                        setFormData({...formData, line_items: updatedItems});
                        }}
                        className="w-full p-2 bg-[rgb(44,45,50)] rounded text-white"
                    />
                    </div>
                    
                    <div>
                    <label className="block text-sm mb-2 text-gray-400">Discount %</label>
                    <input 
                        type="number"
                        step="0.01"
                        value={item.discount_percent || ''}
                        onChange={(e) => {
                        const updatedItems = [...formData.line_items];
                        updatedItems[idx].discount_percent = parseFloat(e.target.value);
                        setFormData({...formData, line_items: updatedItems});
                        }}
                        className="w-full p-2 bg-[rgb(44,45,50)] rounded text-white"
                    />
                    </div>
                    
                    <div>
                    <label className="block text-sm mb-2 text-gray-400">Line Total</label>
                    <input 
                        type="number"
                        step="0.01"
                        value={item.line_total || ''}
                        onChange={(e) => {
                        const updatedItems = [...formData.line_items];
                        updatedItems[idx].line_total = parseFloat(e.target.value);
                        setFormData({...formData, line_items: updatedItems});
                        }}
                        className="w-full p-2 bg-[rgb(44,45,50)] rounded text-white"
                    />
                    </div>
                </div>
                </div>
            ))}
            
            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
                <button 
                type="submit" 
                className="bg-[rgb(244,184,64)] text-black px-6 py-2 rounded font-semibold hover:opacity-80 transition-opacity"
                >
                Save Changes
                </button>
                <button 
                type="button" 
                onClick={onCancel} 
                className="bg-gray-600 text-white px-6 py-2 rounded font-semibold hover:opacity-80 transition-opacity"
                >
                Cancel
                </button>
            </div>
        </form>
      </div>
    </div>
  )
}

export default EditInvoiceModal
