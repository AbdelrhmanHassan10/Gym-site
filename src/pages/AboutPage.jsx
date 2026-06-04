import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import About from '../components/About';
import './PageStyle.css';

const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <div className="page-container">
      <div className="page-header">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {t('nav.about')}
        </motion.h1>
      </div>
      <div className="page-content">
        <About />
        
        <div className="extra-info section-padding">
          <h2>Our Philosophy</h2>
          <p>We believe in sustainable transformations that last a lifetime. Our training methodology isn't just about lifting weights; it's about shifting mindsets, building resilience, and fostering a community of growth.</p>
          
          <div className="image-grid mt-4">
            <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop" alt="Gym setup" />
            <img src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070&auto=format&fit=crop" alt="Workout" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
