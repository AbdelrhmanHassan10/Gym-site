import React from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import './SuccessStories.css';

const SuccessStories = () => {
  return (
    <section className="success-section">
      <div className="success-container">
        <div className="success-header">
          <div className="success-title-wrapper">
            <h2 className="section-title italic uppercase">Success Stories</h2>
            <p className="success-subtitle">Real transformations from the individuals who committed to the process. Excellence is earned, not given.</p>
          </div>
          <div className="success-nav">
            <button className="nav-btn"><ChevronLeft size={24} /></button>
            <button className="nav-btn"><ChevronRight size={24} /></button>
          </div>
        </div>
        
        <div className="success-grid">
          {/* Story 1 */}
          <div className="story-card group">
            <div className="story-image-wrap">
              <img src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop" alt="Transformation" className="story-img" />
              <div className="story-badge">12 WEEK RESULT</div>
            </div>
            <div className="story-content">
              <div className="stars">
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
              </div>
              <p className="story-quote">"The private setting allowed me to focus purely on my form. The results surpassed my expectations."</p>
              <p className="story-author">— Marcus T., Executive</p>
            </div>
          </div>
          
          {/* Story 2 */}
          <div className="story-card group">
            <div className="story-image-wrap">
              <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop" alt="Transformation" className="story-img" />
              <div className="story-badge">6 MONTH RESULT</div>
            </div>
            <div className="story-content">
              <div className="stars">
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
              </div>
              <p className="story-quote">"Nutrition was my missing link. Coach Gym Private provided the blueprint for my entire lifestyle."</p>
              <p className="story-author">— Sarah L., Athlete</p>
            </div>
          </div>
          
          {/* Stats Card */}
          <div className="stats-card">
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Success Stories</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">98%</span>
              <span className="stat-label">Retention Rate</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
