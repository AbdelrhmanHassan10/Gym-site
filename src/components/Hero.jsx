import React, { useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../ThemeContext';
import { ArrowUpRight, Menu, Sun, Moon, Globe, Dumbbell } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme, lang, toggleLang } = useContext(ThemeContext);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="hero">
      <div className="hero-overlay"></div>


      <motion.div 
        className="hero-content animate-fade-in-up"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-badge">
          <span className="skew-text">{t('hero.subtitle')}</span>
        </div>
        
        <h1 className="hero-title-new">
          {t('hero.title1')}<br/>
          <span className="text-glow">{t('hero.title2')}</span>
        </h1>
        
        <p className="hero-quote-new">
          {t('hero.quote')}
        </p>

        <div className="hero-actions">
          <button className="btn-primary-new group" onClick={() => navigate('/packages')}>
            {t('hero.startJourney')}
            <span className="material-symbols-outlined icon-arrow">arrow_forward</span>
          </button>
          <button className="btn-outline-new" onClick={() => navigate('/champions')}>
            {t('hero.viewChampions')}
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
