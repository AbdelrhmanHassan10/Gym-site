import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Champions.css';

const Champions = ({ linkTo }) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const transformations = [
    { id: 1, name: 'Mohammed Ali', weightLost: '15kg', duration: '3 Months', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop' },
    { id: 2, name: 'Omar Hassan', weightLost: '20kg', duration: '5 Months', image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop' }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === transformations.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? transformations.length - 1 : prev - 1));
  };

  return (
    <section className="champions-section">
      <div className="champions-container">
        <motion.h4 
          className="champions-subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {t('champions.subtitle')}
        </motion.h4>
        <motion.h2 
          className="champions-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          {t('champions.title')}
        </motion.h2>
        <motion.p 
          className="champions-desc"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {t('champions.desc')}
        </motion.p>

        <motion.div 
          className="carousel-wrapper"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <button className="carousel-btn prev-btn" onClick={prevSlide}>
            <ChevronLeft size={30} />
          </button>
          
          <div className="carousel-content">
            <AnimatePresence mode="wait">
              <motion.img 
                key={currentIndex}
                src={transformations[currentIndex].image} 
                alt="Transformation" 
                className="transformation-img"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>
            <div className="transformation-info">
              <h3>{transformations[currentIndex].name}</h3>
              <p>{t('champions.lost')} {transformations[currentIndex].weightLost} {t('champions.in')} {transformations[currentIndex].duration}</p>
            </div>
          </div>

          <button className="carousel-btn next-btn" onClick={nextSlide}>
            <ChevronRight size={30} />
          </button>
        </motion.div>

        <div className="carousel-dots">
          {transformations.map((_, idx) => (
            <div 
              key={idx} 
              className={`dot ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
            />
          ))}
        </div>

        {linkTo ? (
          <Link to={linkTo} className="btn-more" style={{ textDecoration: 'none' }}>
            {t('champions.more')} <ArrowUpRight size={18} />
          </Link>
        ) : (
          <button className="btn-more">
            {t('champions.more')} <ArrowUpRight size={18} />
          </button>
        )}
      </div>
    </section>
  );
};

export default Champions;
