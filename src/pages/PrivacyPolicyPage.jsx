import React from 'react'
import { Link } from 'react-router-dom'
import './PrivacyPolicyPage.css'

const PrivacyPolicyPage = () => {
  return (
    <div className="privacy-page">
      

      <nav className="privacy-nav">
        <div className="nav-container">
          <div className="nav-brand">
            <span className="brand-icon">🌊</span>
            <span className="brand-text">UIC</span>
          </div>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/mission" className="nav-link">Mission</Link>
            <Link to="/terms" className="nav-link">Terms</Link>
            <Link to="/privacy-policy" className="nav-link active">Privacy</Link>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-btn">Register</Link>
          </div>
        </div>
      </nav>

     
      <section className="privacy-hero">
        <div className="privacy-hero-container">
          <h1>🔒 Privacy Policy</h1>
          <p>We respect your privacy. Here's how we protect your information.</p>
        </div>
      </section>

     
      <section className="privacy-content-section">
        <div className="privacy-content-container">
          
         
          <div className="privacy-updated">
            <p><strong>Last Updated:</strong> June 2026</p>
          </div>

        
          <div className="privacy-block">
            <h2>📊 What Information We Collect</h2>
            <p>When you use UIC, we collect:</p>
            <ul className="privacy-list">
              <li><strong>Your name, email, and registration number</strong> - to create your account</li>
              <li><strong>Your ideas and comments</strong> - to share with the community</li>
              <li><strong>Your votes and feedback</strong> - to improve the platform</li>
              <li><strong>Basic usage data</strong> - like which pages you visit</li>
            </ul>
          </div>

        
          <div className="privacy-block">
            <h2>🎯 How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="privacy-list">
              <li>Create and manage your account</li>
              <li>Show your ideas to other users</li>
              <li>Connect you with lecturers and peers</li>
              <li>Send you notifications about your ideas</li>
              <li>Make the platform better for everyone</li>
            </ul>
          </div>

       
          <div className="privacy-block">
            <h2>🔄 Who We Share Your Information With</h2>
            <p>We do NOT sell your personal information. We only share:</p>
            <ul className="privacy-list">
              <li><strong>With SUZA</strong> - for academic and research purposes</li>
              <li><strong>With other users</strong> - your ideas are visible to everyone on the platform</li>
              <li><strong>When required by law</strong> - if we are legally required to do so</li>
            </ul>
          </div>

         
          <div className="privacy-block">
            <h2>🛡️ How We Protect Your Data</h2>
            <p>We take your security seriously. We protect your information by:</p>
            <ul className="privacy-list">
              <li>Encrypting all data during transmission</li>
              <li>Hashing passwords so no one can read them</li>
              <li>Limiting access to your personal information</li>
              <li>Regularly updating our security measures</li>
            </ul>
          </div>

         
          <div className="privacy-block">
            <h2>👤 Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="privacy-list">
              <li><strong>See</strong> what information we have about you</li>
              <li><strong>Update</strong> or correct your information</li>
              <li><strong>Delete</strong> your account and data</li>
              <li><strong>Stop</strong> us from using your data in certain ways</li>
            </ul>
            <p>Just contact us and we will help you.</p>
          </div>

      
          <div className="privacy-block">
            <h2>🍪 Cookies</h2>
            <p>
              We use cookies to make your experience better. Cookies help us:
            </p>
            <ul className="privacy-list">
              <li>Keep you logged in</li>
              <li>Remember your preferences</li>
              <li>Understand how you use the platform</li>
            </ul>
            <p>You can turn off cookies in your browser settings at any time.</p>
          </div>

        
          <div className="privacy-block">
            <h2>📁 How Long We Keep Your Data</h2>
            <p>
              We keep your information as long as your account is active. 
              If you delete your account, we remove your personal data within 30 days.
            </p>
            <p>
              Your ideas and comments may stay on the platform anonymously for 
              academic and research purposes.
            </p>
          </div>

        
          <div className="privacy-block">
            <h2>📝 Changes to This Policy</h2>
            <p>
              We may update this policy from time to time. When we do, we will 
              post the new version here.
            </p>
            <p>
              Your continued use of UIC means you accept the updated policy.
            </p>
          </div>

        
          <div className="privacy-block contact-block">
            <h2>📞 Contact Us</h2>
            <p>
              If you have any questions about this policy, please contact us:
            </p>
            <div className="contact-info">
              <p><strong>📧 Email:</strong> khadija09said09@gmail.com / rahma@gmail.com</p>
              <p><strong>📞 Phone:</strong> 0675788310</p>
              <p><strong>🏫 Address:</strong> SUZA Zanzibar, Department of Computer Science and IT</p>
            </div>
          </div>

         
          <div className="privacy-back">
            <Link to="/" className="btn-primary">
              ← Back to Home
            </Link>
          </div>

        </div>
      </section>

     
      <footer className="privacy-footer">
        <div className="footer-container">
          <p className="footer-tagline">🎓 SUZA Innovation Hub - Where Ideas Become Reality</p>
          <p className="footer-copyright">
            © 2026 University Innovation Connect (UIC) - SUZA Zanzibar
          </p>
        </div>
      </footer>
    </div>
  )
}

export default PrivacyPolicyPage