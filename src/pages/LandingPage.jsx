import React from 'react'
import './LandingPage.css'

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-brand">
            <span className="brand-icon">🌊</span>
            <span className="brand-text">University Innovation Connect - UIC</span>
          </div>
          <div className="nav-links">
            <a href="/login" className="nav-link">Login</a>
            <a href="/register" className="nav-btn">Get Started</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
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
            <a href="/register" className="btn-primary">
              🚀 Start Innovating
            </a>
            <a href="/login" className="btn-secondary">
              Sign In
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
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

      {/* Categories Section */}
      <section className="categories-section">
        <div className="categories-container">
          <h2 className="section-title">Explore Challenges in different Category</h2>
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

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>Ready to Make a Difference?</h2>
          <p>Join SUZA's innovation community and turn your ideas into reality.</p>
          <a href="/register" className="btn-primary btn-large">
            🌟 Join Now
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-text">
            <p className="footer-tagline">
              🎓 SUZA Innovation Hub - Where Ideas Become Reality
            </p>
            <p className="footer-contact">
              📞 0675788310 | 📧 khadija09said09@gmail.com | 📧 rahma@gmail.com
            </p>
            <p className="footer-developers">
              Khadija Ali Said (24BCS026) |  Rahma Suleiman Abdalla (24BIT038)
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