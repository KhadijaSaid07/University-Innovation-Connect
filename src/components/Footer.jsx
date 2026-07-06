import React from 'react'

const Footer = () => {
  return (
    <footer className="sticky-footer bg-white">
      <div className="container my-auto">
        {/* About UIC */}
        

        {/* Contact & Developers */}
        <div className="text-center mb-2">
          <span className="text-muted small">
            📞 0675788310 | 📧 khadija09said09@gmail.com | 📧 rahma@gmail.com
          </span>
        </div>
        <div className="text-center mb-2">
          <span className="text-muted small">
            Khadija Ali Said (24BCS026) | Rahma Suleiman Abdalla (24BIT038)
          </span>
        </div>

        {/* Copyright */}
        <div className="copyright text-center my-auto">
          <span>© 2026 University Innovation Connect (UIC) - SUZA</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer