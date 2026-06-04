import React from 'react';
import { useTranslation } from 'react-i18next';
import { Star } from 'lucide-react';
import Marquee from 'react-fast-marquee';
import './SuccessStories.css';

const SuccessStories = () => {
  const { t } = useTranslation();
  const FastMarquee = Marquee.default || Marquee;

  return (
    <section className="success-section">
      <div className="success-container">
        <div className="success-header">
          <div className="success-title-wrapper">
            <h2 className="section-title italic uppercase">{t('success.title')}</h2>
            <p className="success-subtitle">{t('success.subtitle')}</p>
          </div>
        </div>
        
        <div className="success-marquee-wrap" style={{ margin: '0 -2rem' }}>
          <FastMarquee gradient={false} speed={50} pauseOnHover={true} className="success-marquee">
            {/* Story 1 */}
            <div className="story-card group hover-target" style={{ margin: '0 1rem', width: '350px' }}>
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
            <div className="story-card group hover-target" style={{ margin: '0 1rem', width: '350px' }}>
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

            {/* Story 3 (Duplicate for Marquee fill) */}
            <div className="story-card group hover-target" style={{ margin: '0 1rem', width: '350px' }}>
              <div className="story-image-wrap">
                <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop" alt="Transformation" className="story-img" />
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
            
            {/* Story 4 (Duplicate for Marquee fill) */}
            <div className="story-card group hover-target" style={{ margin: '0 1rem', width: '350px' }}>
              <div className="story-image-wrap">
                <img src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop" alt="Transformation" className="story-img" />
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
          </FastMarquee>
        </div>

        <div className="stats-container" style={{ marginTop: '3rem', display: 'flex', gap: '2rem', justifyContent: 'center' }}>
          {/* Stats Card */}
          <div className="stats-card" style={{ flexDirection: 'row', gap: '3rem', width: '100%', maxWidth: '800px', padding: '2rem 4rem' }}>
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">{t('success.stat1Label')}</span>
            </div>
            <div className="stat-divider" style={{ width: '1px', height: '80px', margin: '0' }}></div>
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
