import React from 'react'

const DeleteInvoiceModal = ({invoice, onSave, onCancel}) => {

    const handleDelete = async (invoice) => {
       console.log(invoice.invoice_id)
       const invoice_id = invoice.invoice_id
        try {
            // Call flask server to update
            const response = await fetch(`http://127.0.0.1:8080/api/delete/${invoice_id}`, {
                method: 'DELETE', 
                headers: { 'Content-Type': 'application/json'}, 
                body: JSON.stringify(invoice_id)
        })

        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log('Update successful:', data.message)

        onSave()
    
            } catch (error) {
                console.error('Error updating invoice', error)
                alert('Failed to update invoice')
            }
    }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[rgb(44,45,50)] p-6 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-white">Delete Invoice</h2>
        
        <p className="text-gray-300 mb-6">
          Are you sure you want to delete invoice{' '}
          <span className="font-semibold text-white">
            {invoice.invoice_id}
          </span>{' '}
          for{' '}
          <span className="font-semibold text-white">
            {invoice.customer_name}
          </span>?
        </p>
        
        <p className="text-red-400 text-sm mb-6">
          This action cannot be undone.
        </p>
        
        <div className="flex gap-4">
          <button
            onClick={() => handleDelete(invoice)}
            className="flex-1 bg-red-600 text-white px-6 py-2 rounded font-semibold hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-600 text-white px-6 py-2 rounded font-semibold hover:opacity-80 transition-opacity"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteInvoiceModal
