import React from 'react'
import { Link } from 'react-router-dom'
import './TermsPage.css'

const TermsPage = () => {
  return (
    <div className="terms-page">
      
 
      <nav className="terms-nav">
        <div className="nav-container">
          <div className="nav-brand">
            <span className="brand-icon">🌊</span>
            <span className="brand-text">UIC</span>
          </div>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/mission" className="nav-link">Mission</Link>
            <Link to="/terms" className="nav-link active">Terms</Link>
            <Link to="/privacy-policy" className="nav-link">Privacy</Link>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-btn">Register</Link>
          </div>
        </div>
      </nav>

    
      <section className="terms-hero">
        <div className="terms-hero-container">
          <h1>📋 Terms of Services</h1>
          <p>Please read these terms carefully before using UIC</p>
        </div>
      </section>

     
      <section className="terms-content-section">
        <div className="terms-content-container">
          
        
          <div className="terms-updated">
            <p><strong>Last Updated:</strong> June 2026</p>
          </div>

        
          <div className="terms-block">
            <h2>1. ✅ Acceptance of Terms</h2>
            <p>
              By using University Innovation Connect (UIC), you agree to be bound by these 
              Terms of Services. If you do not agree to these terms, please do not use our platform.
            </p>
            <p>
              We reserve the right to update these terms at any time. Your continued use of 
              the platform constitutes acceptance of the updated terms.
            </p>
          </div>

          
          <div className="terms-block">
            <h2>2. 👤 User Registration</h2>
            <p>
              To access certain features of UIC, you must register using valid SUZA credentials.
            </p>
            <ul className="terms-list">
              <li>You must provide accurate and complete information</li>
              <li>You are responsible for maintaining the confidentiality of your account</li>
              <li>You are responsible for all activities that occur under your account</li>
              <li>You must notify us immediately of any unauthorized use of your account</li>
            </ul>
          </div>

         
          <div className="terms-block">
            <h2>3. 👨‍💻 User Responsibilities</h2>
            <p>As a user of UIC, you agree to:</p>
            <ul className="terms-list">
              <li>Post content that is respectful and constructive</li>
              <li>Respect the intellectual property rights of others</li>
              <li>Not engage in harassment, hate speech, or discriminatory behavior</li>
              <li>Not post spam, malware, or malicious content</li>
              <li>Not impersonate others or provide false information</li>
            </ul>
          </div>

          
          <div className="terms-block">
            <h2>4. 📝 Content Ownership</h2>
            <p>
              You retain full ownership of the ideas and content you post on UIC.
            </p>
            <p>
              By posting content, you grant UIC a non-exclusive, worldwide, royalty-free 
              license to display, distribute, and promote your content on our platform.
            </p>
            <p>
              We respect your intellectual property rights and will not claim ownership 
              of your ideas.
            </p>
          </div>

          <div className="terms-block">
            <h2>5. 🚫 Prohibited Content</h2>
            <p>The following content is strictly prohibited on UIC:</p>
            <ul className="terms-list">
              <li>Hate speech or discriminatory content</li>
              <li>Harassment, bullying, or threatening behavior</li>
              <li>Spam, phishing, or malicious links</li>
              <li>Illegal or fraudulent activities</li>
              <li>Content that violates privacy or intellectual property rights</li>
              <li>Inappropriate, offensive, or explicit content</li>
            </ul>
            <p>
              Violation of these rules may result in content removal and account termination.
            </p>
          </div>

        
          <div className="terms-block">
            <h2>6. 🔧 Service Availability</h2>
            <p>
              We strive to keep UIC available 24/7 for all users. However, we cannot 
              guarantee uninterrupted access to the platform.
            </p>
            <p>
              We may experience downtime for maintenance, updates, or unexpected issues. 
              We will make reasonable efforts to notify users in advance of scheduled maintenance.
            </p>
          </div>

       
          <div className="terms-block">
            <h2>7. 💡 Intellectual Property</h2>
            <p>
              The UIC platform, logo, design, and content (excluding user-submitted content) 
              are the intellectual property of UIC and its developers.
            </p>
            <p>
              Users may not reproduce, distribute, or create derivative works without 
              explicit permission.
            </p>
          </div>

         
          <div className="terms-block">
            <h2>8. ⚠️ Disclaimer of Warranties</h2>
            <p>
              UIC is provided "as is" without any warranties, express or implied. 
              We do not guarantee the accuracy, reliability, or completeness of 
              any content on the platform.
            </p>
            <p>
              We are not responsible for any damages or losses resulting from the 
              use of our platform or any user-submitted content.
            </p>
          </div>

         
          <div className="terms-block">
            <h2>9. ⚖️ Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, UIC and its developers shall 
              not be liable for any indirect, incidental, special, consequential, 
              or punitive damages arising from your use of the platform.
            </p>
            <p>
              This includes loss of profits, data, or goodwill, even if we have 
              been advised of the possibility of such damages.
            </p>
          </div>

          <div className="terms-block">
            <h2>10. 🚪 Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account at any time 
              if you violate these terms or engage in inappropriate behavior.
            </p>
            <p>
              You may also delete your account at any time by contacting us.
            </p>
          </div>

        
          <div className="terms-block">
            <h2>11. 📝 Changes to Terms</h2>
            <p>
              We may update these Terms of Services from time to time. We will 
              notify users of any significant changes by posting a notice on our platform.
            </p>
            <p>
              Your continued use of UIC after changes are posted constitutes your 
              acceptance of the updated terms.
            </p>
          </div>

         
          <div className="terms-block contact-block">
            <h2>12. 📞 Contact Us</h2>
            <p>
              If you have any questions, concerns, or feedback about these terms, 
              please contact us:
            </p>
            <div className="contact-info">
              <p><strong>📧 Email:</strong> khadija09said09@gmail.com / rahma@gmail.com</p>
              <p><strong>📞 Phone:</strong> 0675788310</p>
              <p><strong>🏫 Address:</strong> SUZA Zanzibar, Department of Computer Science and IT</p>
            </div>
          </div>

       
          <div className="terms-back">
            <Link to="/" className="btn-primary">
              ← Back to Home
            </Link>
          </div>

        </div>
      </section>

     
      <footer className="terms-footer">
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

export default TermsPage