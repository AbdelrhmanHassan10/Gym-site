import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Dumbbell } from 'lucide-react';
import './Footer.css';

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const TwitterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-grid">
          
          {/* Brand Column */}
          <motion.div 
            className="footer-col"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="logo" style={{ marginBottom: '1rem', alignItems: 'flex-start' }}>
              <div className="logo-icon">
                <Dumbbell size={28} color="var(--accent-red)" />
              </div>
              <div className="logo-text">
                <span>AHMED</span>
                <span>RAGAB</span>
              </div>
            </div>
            <p className="footer-desc">{t('footer.desc')}</p>
          </motion.div>

          {/* Quick Links Column */}
          <motion.div 
            className="footer-col"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3>{t('footer.quickLinks')}</h3>
            <ul>
              <li><Link to="/about">{t('nav.about')}</Link></li>
              <li><Link to="/packages">{t('packages.title')}</Link></li>
              <li><Link to="/champions">{t('champions.title')}</Link></li>
              <li><Link to="/faq">{t('faq.title')}</Link></li>
            </ul>
          </motion.div>

          {/* Contact Column */}
          <motion.div 
            className="footer-col"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3>{t('footer.contactUs')}</h3>
            <ul className="contact-list">
              <li><Phone size={18} /> <span>+20 123 456 7890</span></li>
              <li><Mail size={18} /> <span>coach@ahmedragab.com</span></li>
              <li><MapPin size={18} /> <span>Cairo, Egypt</span></li>
            </ul>
          </motion.div>

          {/* Social Column */}
          <motion.div 
            className="footer-col"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3>{t('footer.social')}</h3>
            <div className="footer-socials">
              <a href="#" className="social-icon"><FacebookIcon /></a>
              <a href="#" className="social-icon"><InstagramIcon /></a>
              <a href="#" className="social-icon"><TwitterIcon /></a>
            </div>
          </motion.div>

        </div>

        <div className="footer-bottom">
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
