import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import './About.css';

const Counter = ({ from = 0, to, duration = 2, suffix = '' }) => {
  const [count, setCount] = useState(from);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
        setCount(Math.floor(progress * (to - from) + from));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, from, to, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

import { Link } from 'react-router-dom';

const About = ({ linkTo }) => {
  const { t } = useTranslation();

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="about-section">
      <div className="about-container">
        <motion.h2 
          className="about-title"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          {t('about.title')} <br />
          <span className="gold-text">{t('about.titleSpan')}</span>
        </motion.h2>
        
        <motion.p 
          className="about-description"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          variants={fadeUp}
        >
          {t('about.desc')}
        </motion.p>

        <div className="stats-grid">
          {[
            { to: 1000, suffix: '+', label: t('about.stats.clients') },
            { to: 8, suffix: '+', label: t('about.stats.experience') },
            { to: 24, suffix: '/7', label: t('about.stats.support') },
            { to: 3, suffix: '', label: t('about.stats.packages') }
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              className="stat-item"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              variants={fadeUp}
            >
              <span className="stat-number gold-text">
                <Counter to={stat.to} suffix={stat.suffix} />
              </span>
              <span className="stat-label">{stat.label}</span>
            </motion.div>
          ))}
        </div>

        {linkTo && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            variants={fadeUp}
            style={{ marginTop: '3rem', textAlign: 'center' }}
          >
            <Link to={linkTo} className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
              READ MORE ABOUT ME
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default About;
