import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        <div className="footer-middle">
          <div className="footer-contact">
            <span>📞 0675788310</span>
            <span className="footer-divider">|</span>
            <span>📧 khadija09said09@gmail.com</span>
            <span className="footer-divider">|</span>
            <span>📧 rahma@gmail.com</span>
          </div>
          <div className="footer-developers">
            <span>👩‍💻 Khadija Ali Said (24BCS026)</span>
            <span className="footer-divider">|</span>
            <span>👩‍💻 Rahma Suleiman Abdalla (24BIT038)</span>
          </div>
        </div>

        {/* Bottom Section - Copyright */}
        <div className="footer-bottom">
          <span>© 2026 University Innovation Connect (UIC) - SUZA Zanzibar</span>
        </div>

      </div>
    </footer>
  )
}

export default Footer