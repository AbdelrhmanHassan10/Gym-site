import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import FAQ from '../components/FAQ';
import './PageStyle.css';

const FAQPage = () => {
  const { t } = useTranslation();

  return (
    <div className="page-container">
      <div className="page-header">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {t('faq.title')}
        </motion.h1>
      </div>
      <div className="page-content">
        <FAQ />
      </div>
    </div>
  );
};

export default FAQPage;
