import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import './FAQ.css';

const FAQ = ({ linkTo }) => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') },
    { q: t('faq.q4'), a: t('faq.a4') }
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="faq-container">
        <motion.h2 
          className="faq-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {t('faq.title')}
        </motion.h2>

        <div className="faq-list">
          {faqs.map((faq, idx) => (
            <motion.div 
              key={idx} 
              className={`faq-item ${openIndex === idx ? 'open' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <button className="faq-question" onClick={() => toggleFaq(idx)}>
                <span>{faq.q}</span>
                <ChevronDown className="faq-icon" size={20} />
              </button>
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div 
                    className="faq-answer-wrapper"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <div className="faq-answer">{faq.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {linkTo && (
          <div style={{ marginTop: '3rem', textAlign: 'center' }}>
            <Link to={linkTo} className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
              VIEW ALL FAQs
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FAQ;
