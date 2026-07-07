import React from 'react'
import { Link } from 'react-router-dom'
import './MissionPage.css'

const MissionPage = () => {
  return (
    <div className="mission-page">
      
   
      <nav className="mission-nav">
        <div className="nav-container">
          <div className="nav-brand">
            <span className="brand-icon">🌊</span>
            <span className="brand-text">UIC</span>
          </div>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/mission" className="nav-link active">Mission</Link>
            <Link to="/terms" className="nav-link">Terms</Link>
            <Link to="/privacy-policy" className="nav-link">Privacy</Link>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-btn">Register</Link>
          </div>
        </div>
      </nav>

   
      <section className="mission-hero">
        <div className="mission-hero-container">
          <h1>🎯 Our Mission</h1>
          <p>Empowering SUZA students to create real change in Zanzibar</p>
        </div>
      </section>

      
      <section className="mission-content-section">
        <div className="mission-content-container">
          
          {/* Main Mission */}
          <div className="mission-block main-mission">
            <div className="mission-icon-large">🌟</div>
            <h2>Our Mission</h2>
            <p className="mission-statement">
              To connect SUZA students with real community challenges and help them 
              turn their ideas into solutions that make a difference.
            </p>
          </div>

       
          <div className="mission-block">
            <h2>💜 Our Core Values</h2>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">🤝</div>
                <h4>Collaboration</h4>
                <p>Working together to solve problems</p>
              </div>
              <div className="value-card">
                <div className="value-icon">💡</div>
                <h4>Innovation</h4>
                <p>Finding new ways to create change</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🌍</div>
                <h4>Community</h4>
                <p>Building a better Zanzibar together</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🎓</div>
                <h4>Excellence</h4>
                <p>Striving for the best solutions</p>
              </div>
            </div>
          </div>

         
          <div className="mission-block">
            <h2>💭 What We Believe</h2>
            <div className="belief-grid">
              <div className="belief-item">
                <span className="belief-number">01</span>
                <h4>Every Idea Matters</h4>
                <p>Every student has the power to create change. No idea is too small.</p>
              </div>
              <div className="belief-item">
                <span className="belief-number">02</span>
                <h4>Together We Are Stronger</h4>
                <p>Collaboration makes better solutions. We bring people together.</p>
              </div>
              <div className="belief-item">
                <span className="belief-number">03</span>
                <h4>Action Creates Impact</h4>
                <p>Ideas are great, but action creates real change in our community.</p>
              </div>
              <div className="belief-item">
                <span className="belief-number">04</span>
                <h4>Zanzibar's Future Starts Here</h4>
                <p>SUZA students are the future leaders of Zanzibar. We support them.</p>
              </div>
            </div>
          </div>

        
          <div className="mission-block">
            <h2>🏆 Our Goals</h2>
            <div className="goals-grid">
              <div className="goal-card">
                <div className="goal-number">1</div>
                <h4>Connect Students</h4>
                <p>Bring students together to share ideas and work as a team.</p>
              </div>
              <div className="goal-card">
                <div className="goal-number">2</div>
                <h4>Solve Real Problems</h4>
                <p>Focus on challenges that matter to Zanzibar communities.</p>
              </div>
              <div className="goal-card">
                <div className="goal-number">3</div>
                <h4>Get Lecturer Support</h4>
                <p>Connect students with lecturers who can guide them.</p>
              </div>
              <div className="goal-card">
                <div className="goal-number">4</div>
                <h4>Turn Ideas into Action</h4>
                <p>Help students take their ideas from concept to reality.</p>
              </div>
            </div>
          </div>

         
          <div className="mission-block why-block">
            <h2>❤️ Why We Do This</h2>
            <p>
              We believe that SUZA students have the talent, creativity, and passion 
              to solve the biggest challenges facing Zanzibar. But they need a platform 
              to connect, share, and grow their ideas.
            </p>
            <p>
              That's why we created UIC. To give every student a voice and a chance 
              to make a real difference in their community.
            </p>
            <div className="why-highlights">
              <span>🌊 Protect our oceans</span>
              <span>🌾 Support our farmers</span>
              <span>🏥 Improve healthcare</span>
              <span>📚 Enhance education</span>
              <span>💰 Grow our economy</span>
              <span>🌿 Preserve our environment</span>
            </div>
          </div>

         
          <div className="mission-block join-block">
            <h2>🚀 Join Us</h2>
            <p>
              Are you ready to make a difference? Join UIC today and be part of 
              the change Zanzibar needs.
            </p>
            <div className="join-buttons">
              <Link to="/register" className="btn-primary">
                🌟 Get Started
              </Link>
              <Link to="/about" className="btn-secondary">
                Learn More
              </Link>
            </div>
          </div>

         
          <div className="mission-back">
            <Link to="/" className="btn-primary">
              ← Back to Home
            </Link>
          </div>

        </div>
      </section>

      
      <footer className="mission-footer">
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

export default MissionPage