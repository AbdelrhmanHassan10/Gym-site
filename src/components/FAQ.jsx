import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import './FAQ.css';

const FAQ = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      questionEn: "Do I need to go to a gym to follow the training plan?",
      questionAr: "هل لازم أشترك في جيم عشان أمشي على خطة التدريب؟",
      answerEn: "Not necessarily. I can design a customized home workout plan using bodyweight or minimal equipment if you prefer.",
      answerAr: "مش شرط. لو حابب تتمرن في البيت، هصمملك خطة تمرين مخصصة باستخدام وزن الجسم أو أدوات بسيطة جداً."
    },
    {
      questionEn: "Are the nutrition plans restrictive? Do I have to eat boring food?",
      questionAr: "هل أنظمة الدايت قاسية؟ وهل لازم أكل أكل مسلوق وممل؟",
      answerEn: "Absolutely not! I use a flexible dieting approach. You will eat foods you love while staying within your caloric goals.",
      answerAr: "خالص! أنا بستخدم نظام المرونة (Flexible Dieting). هتاكل الأكل اللي بتحبه ومن أكل البيت العادي، بس محسوب السعرات عشان توصل لهدفك."
    },
    {
      questionEn: "How do I receive my plan after payment?",
      questionAr: "إزاي بستلم خطة التدريب والدايت بعد الدفع؟",
      answerEn: "Once your payment is approved, your plan will be uploaded to your Profile under 'My Assigned Plan'. You can download the PDF and read my notes anytime.",
      answerAr: "بمجرد ما باكد دفعك، برفعلك الخطة على البروفايل بتاعك في الموقع في قسم 'My Assigned Plan'. هتقدر تحمل ملف الـ PDF وتقرأ ملاحظاتي في أي وقت."
    },
    {
      questionEn: "How do you track my progress?",
      questionAr: "إزاي بتتابع التطور بتاعي؟",
      answerEn: "We will have weekly check-ins via WhatsApp to discuss your weight, measurements, and photos. Adjustments are made based on your results.",
      answerAr: "بنتواصل أسبوعياً على الواتساب بتبعتلي وزنك ومقاساتك وصورك، وبناءً على النتايج دي ببدأ أعدل الخطة عشان نضمن أفضل نتيجة ممكنة."
    },
    {
      questionEn: "Can I upgrade my package later?",
      questionAr: "هل أقدر أرقي الباقة بتاعتي بعدين؟",
      answerEn: "Yes, you can upgrade your package at any time from your dashboard or by messaging support.",
      answerAr: "أكيد، تقدر ترقي باقتك في أي وقت من خلال الموقع أو إنك تكلمنا على الدعم الفني."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="faq-container">
        <motion.div 
          className="faq-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="faq-badge">{isArabic ? 'أسئلة شائعة' : 'FAQ'}</span>
          <h2 className="faq-title">
            {isArabic ? 'عندك أسئلة؟ عندنا ' : 'GOT QUESTIONS? WE HAVE '}
            <span className="text-gold">{isArabic ? 'الإجابات' : 'ANSWERS'}</span>
          </h2>
          <div className="title-divider"></div>
        </motion.div>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index} 
              className={`faq-item ${activeIndex === index ? 'active' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <button className="faq-question" onClick={() => toggleFAQ(index)}>
                <span>{isArabic ? faq.questionAr : faq.questionEn}</span>
                <ChevronDown 
                  className={`faq-icon ${activeIndex === index ? 'rotate' : ''}`} 
                  size={20} 
                />
              </button>
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="faq-answer-wrapper"
                  >
                    <div className="faq-answer">
                      {isArabic ? faq.answerAr : faq.answerEn}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
