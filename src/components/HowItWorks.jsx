import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ShoppingCart, ClipboardList, Zap, Trophy } from 'lucide-react';
import './HowItWorks.css';

const HowItWorks = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const steps = [
    {
      id: 1,
      icon: <ShoppingCart size={32} />,
      titleEn: "1. Choose Your Plan",
      titleAr: "١. اختر باقتك",
      descEn: "Select the package that fits your goals and complete the payment.",
      descAr: "اختر الباقة التي تناسب أهدافك وأتمم عملية الدفع بسهولة."
    },
    {
      id: 2,
      icon: <ClipboardList size={32} />,
      titleEn: "2. Complete Assessment",
      titleAr: "٢. املأ التقييم",
      descEn: "Fill out a detailed form about your lifestyle, diet, and fitness level.",
      descAr: "قم بملء استمارة مفصلة عن أسلوب حياتك، تغذيتك، ومستواك البدني."
    },
    {
      id: 3,
      icon: <Zap size={32} />,
      titleEn: "3. Get Your Custom Plan",
      titleAr: "٣. استلم خطتك المخصصة",
      descEn: "I will design a tailored workout and nutrition plan just for you.",
      descAr: "سأقوم بتصميم خطة تدريب وتغذية مخصصة خصيصاً لجسمك وأهدافك."
    },
    {
      id: 4,
      icon: <Trophy size={32} />,
      titleEn: "4. Achieve Results",
      titleAr: "٤. حقق هدفك",
      descEn: "Follow the plan, track your progress, and see the transformation!",
      descAr: "التزم بالخطة، تابع تطورك معي أسبوعياً، وشاهد التغيير الحقيقي!"
    }
  ];

  return (
    <section className="how-it-works-section">
      <div className="hiw-container">
        <motion.div 
          className="hiw-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="hiw-badge">{isArabic ? 'الخطوات' : 'THE PROCESS'}</span>
          <h2 className="hiw-title">
            {isArabic ? 'كيف نبدأ ' : 'HOW IT '}
            <span className="text-gold">{isArabic ? 'الرحلة؟' : 'WORKS'}</span>
          </h2>
          <div className="title-divider"></div>
        </motion.div>

        <div className="hiw-grid">
          {steps.map((step, index) => (
            <motion.div 
              key={step.id} 
              className="hiw-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <div className="hiw-icon-wrapper">
                {step.icon}
                <div className="hiw-step-number">{step.id}</div>
              </div>
              <h3 className="hiw-card-title">{isArabic ? step.titleAr : step.titleEn}</h3>
              <p className="hiw-card-desc">{isArabic ? step.descAr : step.descEn}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
