import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import './SuccessStories.css';

const SuccessStories = () => {
  const { t } = useTranslation();
  return (
    <section className="success-section">
      <div className="success-container">
        <div className="success-header">
          <div className="success-title-wrapper">
            <h2 className="section-title italic uppercase">{t('success.title')}</h2>
            <p className="success-subtitle">{t('success.subtitle')}</p>
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
              <div className="story-badge">{t('success.s1Badge')}</div>
            </div>
            <div className="story-content">
              <div className="stars">
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
              </div>
              <p className="story-quote">{t('success.s1Quote')}</p>
              <p className="story-author">{t('success.s1Author')}</p>
            </div>
          </div>
          
          {/* Story 2 */}
          <div className="story-card group">
            <div className="story-image-wrap">
              <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop" alt="Transformation" className="story-img" />
              <div className="story-badge">{t('success.s2Badge')}</div>
            </div>
            <div className="story-content">
              <div className="stars">
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
              </div>
              <p className="story-quote">{t('success.s2Quote')}</p>
              <p className="story-author">{t('success.s2Author')}</p>
            </div>
          </div>
          
          {/* Stats Card */}
          <div className="stats-card">
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">{t('success.stat1Label')}</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">98%</span>
              <span className="stat-label">{t('success.stat2Label')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
