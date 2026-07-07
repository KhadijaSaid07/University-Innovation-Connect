import React from 'react'
import { Link } from 'react-router-dom'
import './AboutPage.css'

const AboutPage = () => {
  return (
    <div className="about-page">
      
   
      <nav className="about-nav">
        <div className="nav-container">
          <div className="nav-brand">
            <span className="brand-icon">🌊</span>
            <span className="brand-text">UIC</span>
          </div>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link active">About</Link>
            <Link to="/mission" className="nav-link">Mission</Link>
            <Link to="/terms" className="nav-link">Terms</Link>
            <Link to="/privacy-policy" className="nav-link">Privacy</Link>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-btn">Register</Link>
          </div>
        </div>
      </nav>

      
      <section className="about-hero">
        <div className="about-hero-container">
          <h1>About Us</h1>
          <p>Learn more about University Innovation Connect (UIC)</p>
        </div>
      </section>

      <section className="about-content-section">
        <div className="about-content-container">
          
          <div className="about-block">
            <h2>🌊 Who We Are</h2>
            <p>
              <strong>University Innovation Connect (UIC)</strong> is a collaborative web platform 
              designed to connect SUZA students with real community challenges in Zanzibar. 
              We are a team of passionate students and lecturers dedicated to fostering 
              innovation and problem-solving within the university environment.
            </p>
            <p>
              UIC was created to address the lack of a structured platform for students to 
              share, discuss, and develop innovative ideas. We believe that every student 
              has the potential to create meaningful change in their community.
            </p>
          </div>

         
          <div className="about-block">
            <h2>💡 What We Do</h2>
            <p>
              UIC provides a structured digital platform where students and lecturers can:
            </p>
            <ul className="about-list">
              <li>📝 <strong>Post Ideas</strong> - Share innovative solutions to community challenges</li>
              <li>💬 <strong>Discuss & Collaborate</strong> - Engage with peers and lecturers</li>
              <li>⭐ <strong>Vote & Recognize</strong> - Best ideas rise to the top</li>
              <li>👨‍🏫 <strong>Get Expert Feedback</strong> - Receive guidance from lecturers</li>
              <li>🤝 <strong>Build Teams</strong> - Connect with like-minded innovators</li>
            </ul>
          </div>

          <div className="about-block">
            <h2>🎯 Why We Exist</h2>
            <div className="why-grid">
              <div className="why-card">
                <div className="why-icon">🚫</div>
                <h4>No Centralized System</h4>
                <p>There was no platform for collecting and managing innovative ideas at SUZA.</p>
              </div>
              <div className="why-card">
                <div className="why-icon">📱</div>
                <h4>Ideas Lost on WhatsApp</h4>
                <p>Ideas were shared informally and often lost or duplicated.</p>
              </div>
              <div className="why-card ">
                <div className="why-icon">🤝</div>
                <h4>Lack of Collaboration</h4>
                <p>Students lacked structured collaboration opportunities.</p>
              </div>
              <div className="why-card">
                <div className="why-icon">🌍</div>
                <h4>Weak Community Connection</h4>
                <p>Academic work was not connected to real-world challenges.</p>
              </div>
            </div>
          </div>

        
          <div className="about-block">
            <h2>👩‍💻 Our Team</h2>
            <div className="team-grid">
              <div className="team-card">
                <div className="team-avatar">👩‍💻</div>
                <h4>Khadija Ali Said</h4>
                <p className="team-reg">24BCS026</p>
                <p className="team-role">Frontend Developer</p>
                <p className="team-email">📧 khadija09said09@gmail.com</p>
              </div>
              <div className="team-card">
                <div className="team-avatar">👩‍💻</div>
                <h4>Rahma Suleiman Abdalla</h4>
                <p className="team-reg">24BIT038</p>
                <p className="team-role">Backend Developer</p>
                <p className="team-email">📧 rahma@gmail.com</p>
              </div>
            </div>
          </div>

         
          <div className="about-block contact-block">
            <h2>📞 Contact Us</h2>
            <div className="contact-info">
              <p>
                <strong>📧 Email:</strong> khadija09said09@gmail.com / rahma@gmail.com
              </p>
              <p>
                <strong>📞 Phone:</strong> 0675788310
              </p>
              <p>
                <strong>🏫 Address:</strong> The State University of Zanzibar (SUZA), 
                Department of Computer Science and Information Technology
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="about-back">
            <Link to="/" className="btn-primary">
              ← Back to Home
            </Link>
          </div>

        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="about-footer">
        <div className="footer-container">
          <p className="footer-tagline">🎓 SUZA Innovation Hub - Where Ideas Become Reality</p>
          <p className="footer-copyright">
            © 2025 University Innovation Connect (UIC) - SUZA Zanzibar
          </p>
        </div>
      </footer>
    </div>
  )
}

export default AboutPage