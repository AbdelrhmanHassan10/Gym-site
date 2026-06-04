import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import './BMI.css';

const BMI = () => {
  const { t } = useTranslation();
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmiResult, setBmiResult] = useState(null);

  const calculateBMI = (e) => {
    e.preventDefault();
    if (weight && height) {
      const heightInMeters = height / 100;
      const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
      setBmiResult(bmi);
    }
  };

  return (
    <section className="bmi-section">
      <motion.div 
        className="bmi-container"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="bmi-content">
          <h2 className="bmi-title">{t('bmi.title')}</h2>
          <form onSubmit={calculateBMI} className="bmi-form">
            <div className="bmi-inputs">
              <div className="input-group">
                <input 
                  type="number" 
                  placeholder={t('bmi.height')}
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <input 
                  type="number" 
                  placeholder={t('bmi.weight')}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn-calculate">{t('bmi.calculate')}</button>
          </form>
          
          {bmiResult && (
            <motion.div 
              className="bmi-result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3>{t('bmi.result')} <span className="gold-text">{bmiResult}</span></h3>
              <p className="bmi-category">
                {bmiResult < 18.5 ? 'Underweight' : bmiResult < 25 ? 'Normal weight' : bmiResult < 30 ? 'Overweight' : 'Obese'}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
};

export default BMI;
