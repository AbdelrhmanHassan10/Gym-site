import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Dumbbell, Utensils, Key, Activity } from 'lucide-react';
import './Features.css';

const Features = () => {
  const { t } = useTranslation();
  return (
    <section className="features-section">
      <div className="features-container">
        <div className="features-header text-center">
          <h2 className="section-title italic uppercase">{t('features.title')}</h2>
          <div className="title-underline"></div>
        </div>
        
        <div className="features-grid">
          {/* Feature 1 */}
          <div className="feature-card feature-large group">
            <div className="feature-content">
              <Dumbbell className="feature-icon" size={48} />
              <h3 className="feature-title">{t('features.f1Title')}</h3>
              <p className="feature-text">{t('features.f1Desc')}</p>
            </div>
            <div className="feature-bg-image overlay-gradient"></div>
          </div>
          
          {/* Feature 2 */}
          <div className="feature-card feature-small hover-card">
            <Utensils className="feature-icon" size={48} />
            <div>
              <h3 className="feature-title">{t('features.f2Title')}</h3>
              <p className="feature-text">{t('features.f2Desc')}</p>
            </div>
          </div>
          
          {/* Feature 3 */}
          <div className="feature-card feature-small hover-card">
            <Key className="feature-icon" size={48} />
            <div>
              <h3 className="feature-title">{t('features.f3Title')}</h3>
              <p className="feature-text">{t('features.f3Desc')}</p>
            </div>
          </div>
          
          {/* Feature 4 */}
          <div className="feature-card feature-wide">
            <div className="feature-content-relative">
              <h3 className="feature-title">{t('features.f4Title')}</h3>
              <p className="feature-text max-w-sm">{t('features.f4Desc')}</p>
            </div>
            <Activity className="feature-watermark" size={180} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
