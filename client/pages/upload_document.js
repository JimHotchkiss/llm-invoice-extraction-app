import { userAgent } from 'next/server';
import React, { useState } from 'react';

export default function UploadFile({triggerRefresh}) {
  const [files, setFiles] = useState([]);
  const [spinnerActive, setSpinnerActive] = useState(false)


  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSpinnerActive(true)
      llm_call(file)
      handleFiles(e.target.files);
    }
  };

  
  const llm_call = async (file) => {
    const backend_url = 'http://127.0.0.1:8080/api/extract';
   
    // Create FormData to send the PDF file
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(backend_url, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - browser sets it automatically with boundary
      });

      if (!response.ok) {
        throw new Error(`HTTP error! response.status: ${response.status}`)
      }

      const data = await response.json()

      // Trigger invoice table to update
      setSpinnerActive(false)
      triggerRefresh()

      return data;
    } catch(error) {
      console.error('Error:', error)
      throw error;
    }


  }
  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList);
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
  };

  const removeFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div className=" bg-[rgb(50,51,57)] flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        {/* Upload Area */}
        <div
          className= "relative border-2 border-dashed rounded-xl p-12 text-center transition-all border-gray-600 hover:border-[rgb(244,184,64)]"
       
        >
          <input
            id="input_file"
            type="file"
            multiple
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="pointer-events-none">
            <div className="w-16 h-16 bg-[rgb(244,184,64)] rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-[rgb(50,51,57)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            
            <h3 className="text-xl font-semibold text-white mb-2">
              Drop invoices here
            </h3>
            <p className="text-gray-400 mb-4">
              or click to browse
            </p>
            <p className="text-sm text-gray-500">
              Support for multiple files
            </p>
          </div>
        </div>
        {/* spinnger */}
        <div className={`${!spinnerActive ? 'hidden': 'flex'} pt-8 items-center justify-center`}>
          <div className={`h-12 w-12 animate-spin rounded-full border-4 border-solid border-[rgb(244,184,64)] border-t-transparent`}></div>
          <p className='ml-5'>Loading invoice data...</p>
        </div>
        {/* spinnger */}

        {/* File List */}
        {files.length > 0 && (
          <div className="mt-6 space-y-3">
            {files.map((file, index) => (
              <div
                key={index}
                className="bg-[rgb(44,45,50)] rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-[rgb(244,184,64)] rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-[rgb(50,51,57)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{file.name}</p>
                    <p className="text-sm text-gray-400">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="ml-4 text-gray-400 hover:text-[rgb(244,184,64)] transition-colors shrink-0"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            
            {/* Upload Button */}
            <button className="w-full bg-[rgb(244,184,64)] text-[rgb(50,51,57)] py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
              Upload {files.length} {files.length === 1 ? 'File' : 'Files'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}