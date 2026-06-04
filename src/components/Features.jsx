import React from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Utensils, Key, Activity } from 'lucide-react';
import './Features.css';

const Features = () => {
  return (
    <section className="features-section">
      <div className="features-container">
        <div className="features-header text-center">
          <h2 className="section-title italic uppercase">The Standard of Excellence</h2>
          <div className="title-underline"></div>
        </div>
        
        <div className="features-grid">
          {/* Feature 1 */}
          <div className="feature-card feature-large group">
            <div className="feature-content">
              <Dumbbell className="feature-icon" size={48} />
              <h3 className="feature-title">Private Sessions</h3>
              <p className="feature-text">1-on-1 coaching in a distraction-free environment. Every set, every rep, monitored for maximum efficiency.</p>
            </div>
            <div className="feature-bg-image overlay-gradient"></div>
          </div>
          
          {/* Feature 2 */}
          <div className="feature-card feature-small hover-card">
            <Utensils className="feature-icon" size={48} />
            <div>
              <h3 className="feature-title">Customized Nutrition</h3>
              <p className="feature-text">Biometric-driven meal plans designed for your unique metabolism and performance goals.</p>
            </div>
          </div>
          
          {/* Feature 3 */}
          <div className="feature-card feature-small hover-card">
            <Key className="feature-icon" size={48} />
            <div>
              <h3 className="feature-title">24/7 Access</h3>
              <p className="feature-text">The keys to the gym are yours. Train on your schedule, day or night, with full biosecurity access.</p>
            </div>
          </div>
          
          {/* Feature 4 */}
          <div className="feature-card feature-wide">
            <div className="feature-content-relative">
              <h3 className="feature-title">Recovery Lounge</h3>
              <p className="feature-text max-w-sm">Cryotherapy, infrared saunas, and compression therapy to ensure your body recovers as hard as you train.</p>
            </div>
            <Activity className="feature-watermark" size={180} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
