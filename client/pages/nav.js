import React from 'react'

function Nav() {
  return (
    <nav className="container mx-auto px-6 py-6">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-[rgb(244,184,64)]">Invoice Parcer</div>
          <div className="hidden md:flex space-x-8">
            <a href="#" className="hover:text-[rgb(244,184,64)] transition-colors">Features</a>
            <a href="#" className="hover:text-[rgb(244,184,64)] transition-colors">About</a>
            <a href="#" className="hover:text-[rgb(244,184,64)] transition-colors">Contact</a>
          </div>
        </div>
    </nav>
  )
}

export default Nav
