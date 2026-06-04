import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { PhoneCall, Calendar, Activity, Utensils, Dumbbell, UserCheck } from 'lucide-react';
import './Program.css';

const Program = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <PhoneCall size={40} strokeWidth={1.5} />,
      title: t('program.f1')
    },
    {
      icon: <Utensils size={40} strokeWidth={1.5} />,
      title: t('program.f2')
    },
    {
      icon: <Dumbbell size={40} strokeWidth={1.5} />,
      title: t('program.f3')
    },
    {
      icon: <Activity size={40} strokeWidth={1.5} />,
      title: t('program.f4')
    },
    {
      icon: <Calendar size={40} strokeWidth={1.5} />,
      title: t('program.f5')
    },
    {
      icon: <UserCheck size={40} strokeWidth={1.5} />,
      title: t('program.f6')
    }
  ];

  return (
    <section className="program-section">
      <div className="program-container">
        <motion.h2 
          className="program-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {t('program.title')}
        </motion.h2>
        
        <motion.p 
          className="program-desc"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          {t('program.desc')}
        </motion.p>

        <div className="features-grid">
          {features.map((feature, idx) => (
            <motion.div 
              key={idx} 
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * idx }}
            >
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Program;
