import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Packages from '../components/Packages';
import './PackagesPage.css';

const PackagesPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="membership-page">
      {/* Hero Glow */}
      <div className="membership-hero-glow"></div>

      {/* Header */}
      <header className="membership-header">
        <motion.div 
          className="membership-badge"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          MEMBERSHIP PLANS
        </motion.div>
        <motion.h1 
          className="membership-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          CHOOSE YOUR <span className="text-gold">LEVEL</span>
        </motion.h1>
        <motion.p 
          className="membership-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Precision-engineered training programs for those who demand more than just a workout. Select the path to your peak performance.
        </motion.p>
      </header>

      {/* Existing Packages Component */}
      <Packages />

      {/* Comparison Table */}
      <section className="comparison-section">
        <div className="comparison-header">
          <h2 className="comparison-title">DEEP DIVE COMPARISON</h2>
          <div className="comparison-underline"></div>
        </div>
        <div className="comparison-table-wrap">
          <table className="comparison-table">
            <thead>
              <tr>
                <th className="feature-col">FEATURES</th>
                <th className="plan-col">NUTRITION</th>
                <th className="plan-col highlight-col">TRAINING</th>
                <th className="plan-col">VIP</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Custom Meal Plan</td>
                <td className="center-cell"><span className="material-symbols-outlined check-icon-table">check_circle</span></td>
                <td className="center-cell"><span className="table-dash">—</span></td>
                <td className="center-cell"><span className="material-symbols-outlined check-icon-table">check_circle</span></td>
              </tr>
              <tr>
                <td>WhatsApp Follow-up</td>
                <td className="center-cell"><span className="material-symbols-outlined check-icon-table">check_circle</span></td>
                <td className="center-cell"><span className="material-symbols-outlined check-icon-table">check_circle</span></td>
                <td className="center-cell"><span className="material-symbols-outlined check-icon-table">check_circle</span></td>
              </tr>
              <tr>
                <td>Custom Workout Program</td>
                <td className="center-cell"><span className="table-dash">—</span></td>
                <td className="center-cell"><span className="material-symbols-outlined check-icon-table">check_circle</span></td>
                <td className="center-cell"><span className="material-symbols-outlined check-icon-table">check_circle</span></td>
              </tr>
              <tr>
                <td>Exercise Video Demos</td>
                <td className="center-cell"><span className="table-dash">—</span></td>
                <td className="center-cell"><span className="material-symbols-outlined check-icon-table">check_circle</span></td>
                <td className="center-cell"><span className="material-symbols-outlined check-icon-table">check_circle</span></td>
              </tr>
              <tr>
                <td>Monthly Video Consultation</td>
                <td className="center-cell"><span className="table-dash">—</span></td>
                <td className="center-cell"><span className="table-dash">—</span></td>
                <td className="center-cell"><span className="material-symbols-outlined check-icon-table">check_circle</span></td>
              </tr>
              <tr>
                <td>Private Community Access</td>
                <td className="center-cell"><span className="table-dash">—</span></td>
                <td className="center-cell"><span className="table-dash">—</span></td>
                <td className="center-cell"><span className="material-symbols-outlined check-icon-table">check_circle</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="cta-banner-inner">
          <img 
            className="cta-bg-image" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDePrYACOe1-BNnr4G2o2LGpFFI5i9nxJU5fHTqYQ4bZTSYxsWi2t1Z5_daWj_kTyVO2GkTKQ2m0t1eHhQ17HjGvTD5gtxTIdfLo5lJw-bGeFWAXpZ2Wbo8woq-TZ4piCW7QR6Dpf_tFJDbq_IWqR0TmovmEptQIAC1FO3lOtnNSc5_qTaB6SZPIeDZzpPw_kfBEyLXwWVp35roQ4_segIelOcLY_MXY6gJBMGnyIa5lQgyYMj74T4yb2DAfCb0-BqvToCXzEty9GA" 
            alt="Gym Interior" 
          />
          <div className="cta-overlay"></div>
          <div className="cta-content">
            <h2 className="cta-title">STILL NOT SURE WHICH PATH TO TAKE?</h2>
            <p className="cta-text">Schedule a free consultation to find the program that aligns with your specific goals.</p>
            <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="cta-button">
              Book Consultation
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PackagesPage;
