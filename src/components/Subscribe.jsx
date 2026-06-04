import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { CreditCard, MessageSquare, Target } from 'lucide-react';
import './Subscribe.css';

const Subscribe = () => {
  const { t } = useTranslation();

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="subscribe-section">
      <div className="subscribe-container">
        <motion.h2 
          className="subscribe-title"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={itemVariants}
        >
          {t('subscribeSteps.title')}
        </motion.h2>
        
        <div className="subscribe-steps">
          <motion.div 
            className="step-item"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            variants={itemVariants}
          >
            <span className="step-number">01</span>
            <div className="step-icon">
              <Target size={40} className="gold-text" />
            </div>
            <h3 className="step-title">{t('subscribeSteps.step1')}</h3>
          </motion.div>
          
          <motion.div 
            className="step-item"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            variants={itemVariants}
          >
            <span className="step-number">02</span>
            <div className="step-icon">
              <CreditCard size={40} className="gold-text" />
            </div>
            <h3 className="step-title">{t('subscribeSteps.step2')}</h3>
          </motion.div>
          
          <motion.div 
            className="step-item"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            variants={itemVariants}
          >
            <span className="step-number">03</span>
            <div className="step-icon">
              <MessageSquare size={40} className="gold-text" />
            </div>
            <h3 className="step-title">{t('subscribeSteps.step3')}</h3>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Subscribe;
