import React, {useState} from 'react';
import EditInvoiceModal from './editInvoiceModal';
import DeleteInvoiceModal from './deleteInvoiceModal';

export default function Table({ invoices, triggerRefresh }) {
  const [expandedId, setExpandedId] = useState(null)
  const [editingInvoice, setEditingInvoice] = useState(null)
  const [deleteInvoice, setDeleteInvoice] = useState(null)

  // Handle edit click

  const handleEditClick = (e, invoice) => {
    console.log('invoice:', invoice)
    setEditingInvoice(invoice)

  }

  const handleSaveDelete = () => {
    setDeleteInvoice(null)
    triggerRefresh()
  }

  const handleSaveEdit = () => {
    setEditingInvoice(null) // Close the modal
    triggerRefresh()
  }
  if (!invoices) {
    return (
      <div className="bg-[rgb(44,45,50)] rounded-xl p-6">
        <p className="text-gray-400">Loading invoices</p>
      </div>
    )
  }

  // Extract the data array
  const invoice_data = invoices.message || [];
  if (invoice_data.length === 0) {
    return (
      <div className="bg-[rgb(44,45,50)] rounded-xl p-6">
        <p className="text-gray-400">No invoice found.</p>
      </div>
    )
  }

  return (
    <div className="bg-[rgb(44,45,50)] rounded-xl overflow-hidden h-[calc(100vh-8rem)]">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-700">
        <h2 className="text-2xl font-semibold text-white">Invoices</h2>
      </div>
      {/* Table */}
      <div className="overflow-auto h-[calc(100%-4rem)]">
        <table className="w-full">
          <thead className="sticky top-0 bg-[rgb(44,45,50)] z-10">
            <tr className="border-b border-gray-700">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">created_at</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">customer_address</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">customer_id</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">customer_name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">freight</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">invoice_id</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">invoice_number</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">invoice_total</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">order_date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">po_number</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">sales_person</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">ship_date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">ship_to_address</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">sub_total</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">terms</th>
            </tr>
          </thead>
          <tbody>
            {invoices.message.map((invoice) => (
              <React.Fragment key={invoice.invoice_id}>
              <tr 
                key={invoice.invoice_id} 
                className="border-b border-gray-700 hover:bg-[rgb(50,51,57)] transition-colors"
              >
                <td className="px-6 py-4 text-white">{invoice.created_at == null ? 'No Value' : invoice.created_at}</td>
                <td className="px-6 py-4 text-white">{invoice.customer_address == null ? 'No Value' : invoice.customer_address}</td>
                <td className="px-6 py-4 text-white">{invoice.customer_id == null ? 'No Value' : invoice.customer_id}</td>
                <td className="px-6 py-4 text-white">{invoice.customer_name  == null ? 'No Value' : invoice.customer_name }</td>
                <td className="px-6 py-4 text-white">{invoice.freight == null ? 'No Value' : invoice.freight}</td>
                <td className="px-6 py-4 text-white">{invoice.invoice_id == null ? 'No Value' : invoice.invoice_id}</td>
                <td className="px-6 py-4 text-white">{invoice.invoice_number == null ? 'No Value' : invoice.invoice_number}</td>
                <td className="px-6 py-4 text-white">{invoice.invoice_total == null ? 'No Value' : invoice.invoice_total}</td>
                <td className="px-6 py-4 text-white">{invoice.order_date == null ? 'No Value' : invoice.order_date}</td>
                <td className="px-6 py-4 text-white">{invoice.po_numbers == null ? 'No Value' : invoice.po_numbers}</td>
                <td className="px-6 py-4 text-white">{invoice.sales_person == null ? 'No Value' : invoice.sales_person}</td>
                <td className="px-6 py-4 text-white">{invoice.ship_date == null ? 'No Value' : invoice.ship_date}</td>
                <td className="px-6 py-4 text-white">{invoice.ship_to_address == null ? 'No Value' : invoice.ship_to_address}</td>
                <td className="px-6 py-4 text-white">{invoice.status == null ? 'No Value' : invoice.status}</td>
                <td className="px-6 py-4 text-white">{invoice.sub_total == null ? 'No Value' : invoice.sub_total}</td>
                <td className="px-6 py-4 text-white">{invoice.terms == null ? 'No Value' : invoice.terms}</td>
                <td className="px-6 py-4">
                  <button 
                    id={invoice.invoice_id }
                    className="text-[rgb(244,184,64)] hover:opacity-80 transition-opacity cursor-pointer"
                    onClick={(e) => setExpandedId(
                      expandedId === invoice.invoice_id ? null : invoice.invoice_id
                    )}
                    >
                    {expandedId === invoice.invoice_id ? 'Close line items' : 'View line items'}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button 
                    id={invoice.invoice_id }
                    className="text-[rgb(244,184,64)] hover:opacity-80 transition-opacity cursor-pointer"
                    onClick={(e) => handleEditClick(e, invoice)}
                    // disabled={isButtonDisabled}
                    >
                    Edit
                  </button>
                  <button 
                    id={invoice.customer_name }
                    className="text-[rgb(244,184,64)] hover:opacity-80 transition-opacity cursor-pointer"
                    onClick={() => setDeleteInvoice(invoice)}
                    // disabled={isButtonDisabled}
                    >
                    Delete
                  </button>
                </td>
              </tr>
               {/* If expandedId is truthy rending the following if not render nothing */}
              {expandedId === invoice.invoice_id && (
                <tr>
                  <td colSpan="17" 
                      className="bg-[rgb(40,41,45)] pl-8 pr-4 py-4 border-l-4 border-[rgb(244,184,64)]">
                    <table className="w-full pl-8">
                    <thead className="sticky top-0 bg-[rgb(44,45,50)] z-10">
                      <tr className="border-b border-gray-700">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">discount_percent</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">invoice_id</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">item_number</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">line_item_id</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">line_total</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">product_description</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">product_id</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">quantity</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">total_unit_price</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">unit_price</th>
                      </tr>
                    </thead>
                    {invoice.line_items.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-700 hover:bg-[rgb(50,51,57)] transition-colors">
                        <td className="px-6 py-4 text-white">{item.discount_percent == null ? 'No Value' : item.discount_percent}</td>
                        <td className="px-6 py-4 text-white">{item.invoice_id == null ? 'No Value' : item.invoice_id}</td>
                        <td className="px-6 py-4 text-white">{item.item_number == null ? 'No Value' : item.item_number}</td>
                        <td className="px-6 py-4 text-white">{item.line_item_id  == null ? 'No Value' : item.line_item_id }</td>
                        <td className="px-6 py-4 text-white">{item.line_total == null ? 'No Value' : item.line_total}</td>
                        <td className="px-6 py-4 text-white">{item.product_description == null ? 'No Value' : item.product_description}</td>
                        <td className="px-6 py-4 text-white">{item.product_id == null ? 'No Value' : item.product_id}</td>
                        <td className="px-6 py-4 text-white">{item.quantity == null ? 'No Value' : item.quantity}</td>
                        <td className="px-6 py-4 text-white">{item.total_unit_price == null ? 'No Value' : item.total_unit_price}</td>
                        <td className="px-6 py-4 text-white">{item.unit_price == null ? 'No Value' : item.unit_price}</td>
                      </tr>
                    ))}
                  </table>
                  </td>    
                </tr>
                
                )}
            </React.Fragment>))}
          </tbody>
        </table>
        {deleteInvoice && (
          <DeleteInvoiceModal 
            invoice={deleteInvoice}
            onSave={handleSaveDelete}
            onCancel={() => setDeleteInvoice(null)}
            />
        )}
        {editingInvoice && (
          <EditInvoiceModal 
            invoice={editingInvoice}
            onSave={handleSaveEdit}
            onCancel={() => setEditingInvoice(null)}
            />
        )}
      </div>
    </div>
  );
}