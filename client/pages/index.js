import React, {useEffect, useState} from 'react'
import UploadFile from './upload_document'
import Nav from './nav'
import Table from './table'


function Home() {
  const [invoices, setInvoices] = useState([])
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    fetch('http://127.0.0.1:8080/api/invoices')
      .then(response => response.json())
      .then(data => setInvoices(data))
      .catch(error => console.log(error))
  }, [refreshTrigger])

   // Callback function to refresh data
  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);  // ✅ Increment to trigger useEffect
  };

  return (
    <div className="min-h-screen bg-[rgb(50,51,57)] text-white">
      {/* Navigation */}
      <Nav />
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Upload File - 1/3 */}
        <div className="lg:col-span-1">
          <UploadFile triggerRefresh = {triggerRefresh}/>
        </div>
        
        {/* Table - 2/3 */}
        <div className="lg:col-span-2">
          <Table 
            invoices = {invoices}
            triggerRefresh = {triggerRefresh}
            />
        </div>
      </div>
    </div>
  )
}

export default Home
