import React from 'react'
import { Link } from 'react-router-dom'
import './LandingPage.css'

const LandingPage = () => {
  return (
    <div className="landing-page">
      
      {/* ===== NAVIGATION ===== */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-brand">
            <span className="brand-icon">🌊</span>
            <span className="brand-text">UIC</span>
          </div>
          <div className="nav-links">
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/mission" className="nav-link">Mission</Link>
            <Link to="/terms" className="nav-link">Terms</Link>
            <Link to="/privacy-policy" className="nav-link">Privacy</Link>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-btn">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-badge">
            <span>🎓 SUZA Innovation Hub</span>
          </div>
          <h1 className="hero-title">
            Turn Your Ideas Into<br />
            <span className="highlight">Real Solutions</span>
          </h1>
          <p className="hero-subtitle">
            University Innovation Connect (UIC) brings together SUZA students and lecturers 
            to solve real community challenges in Zanzibar. Share, discuss, and vote on ideas 
            that matter.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn-primary">
              🚀 Start Innovating
            </Link>
            <Link to="/login" className="btn-secondary">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="features-section">
        <div className="features-container">
          <h2 className="section-title">How It Works</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>Share Your Idea</h3>
              <p>Post innovative solutions to community challenges in Zanzibar.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>Get Feedback</h3>
              <p>Receive constructive feedback from lecturers and peers.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Vote & Rise</h3>
              <p>Best ideas get recognized and move to the top.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES SECTION ===== */}
      <section className="categories-section">
        <div className="categories-container">
          <h2 className="section-title">Explore Challenges by Category</h2>
          <div className="categories-grid">
            <span className="category-tag">🌊 Blue Economy</span>
            <span className="category-tag">🌾 Agriculture</span>
            <span className="category-tag">🏥 Health</span>
            <span className="category-tag">💰 Fintech</span>
            <span className="category-tag">🎓 Education</span>
            <span className="category-tag">🏖️ Tourism</span>
            <span className="category-tag">♻️ Waste Management</span>
            <span className="category-tag">⚡ Renewable Energy</span>
            <span className="category-tag">💧 Water & Hygiene</span>
            <span className="category-tag">🚍 Transportation</span>
            <span className="category-tag">🌿 Environment</span>
            <span className="category-tag">👥 Social Impact</span>
            <span className="category-tag">💡 General Technology</span>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>Ready to Make a Difference?</h2>
          <p>Join SUZA's innovation community and turn your ideas into reality.</p>
          <Link to="/register" className="btn-primary btn-large">
            🌟 Join Now
          </Link>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="landing-footer">
        <div className="footer-container">
          
          {/* Footer Top - 4 Columns */}
          <div className="footer-top">
            
            {/* Column 1: Brand */}
            <div className="footer-col">
              <div className="footer-brand">
                <span className="footer-brand-icon">🌊</span>
                <span className="footer-brand-text">UIC</span>
              </div>
              <p className="footer-brand-desc">
                University Innovation Connect
              </p>
              <p className="footer-brand-location">
                SUZA Zanzibar
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/mission">Mission</Link></li>
                <li><Link to="/terms">Terms</Link></li>
                <li><Link to="/privacy-policy">Privacy</Link></li>
              </ul>
            </div>

            {/* Column 3: Contact */}
            <div className="footer-col">
              <h4>Contact</h4>
              <ul>
                <li>
                  <span className="footer-icon">📞</span>
                  <span>0675788310</span>
                </li>
                <li>
                  <span className="footer-icon">📧</span>
                  <span>khadija09said09@gmail.com</span>
                </li>
                <li>
                  <span className="footer-icon">📧</span>
                  <span>rahma@gmail.com</span>
                </li>
              </ul>
            </div>

            {/* Column 4: Developers */}
            <div className="footer-col">
              <h4>Developers</h4>
              <ul>
                <li>
                  <span className="footer-icon">👩‍💻</span>
                  <span>Khadija Ali Said</span>
                </li>
                <li className="footer-reg">24BCS026</li>
                <li>
                  <span className="footer-icon">👩‍💻</span>
                  <span>Rahma Suleiman</span>
                </li>
                <li className="footer-reg">24BIT038</li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
            <p className="footer-tagline">
              🎓 SUZA Innovation Hub - Where Ideas Become Reality
            </p>
            <p className="footer-copyright">
              © 2026 University Innovation Connect (UIC) - SUZA Zanzibar
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage