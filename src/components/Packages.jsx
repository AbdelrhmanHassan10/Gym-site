import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Apple, Dumbbell, Users, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Tilt from 'react-parallax-tilt';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import './Packages.css';

const Packages = ({ linkTo }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const FastTilt = Tilt.default || Tilt;
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const defaultNutritionPlans = [
    {
      id: 1,
      type: 'nutrition',
      title: t('packages.nutrition'),
      duration: i18n.language === 'ar' ? '٣٠ يوم' : '30 DAYS',
      oldPrice: i18n.language === 'ar' ? '٥٠٠ ج.م' : '500 EGP',
      price: 250,
      currency: i18n.language === 'ar' ? 'ج.م' : 'EGP',
      save: i18n.language === 'ar' ? 'وفر ٥٠٪' : 'Save 50%',
      bestValue: false,
      features: [
        i18n.language === 'ar' ? 'خطة غذائية مدروسة بدقة لهدفك' : 'A meticulously studied nutrition plan for your goal',
        i18n.language === 'ar' ? 'متابعة يومية عبر الواتساب' : 'Daily follow-up via WhatsApp',
        i18n.language === 'ar' ? 'تعديل النظام الغذائي كل ١٥ يوم' : 'Diet modified every 15 days'
      ]
    },
    {
      id: 2,
      type: 'nutrition',
      title: t('packages.nutrition'),
      duration: i18n.language === 'ar' ? '٩٠ يوم' : '90 DAYS',
      oldPrice: i18n.language === 'ar' ? '١٥٠٠ ج.م' : '1500 EGP',
      price: 600,
      currency: i18n.language === 'ar' ? 'ج.م' : 'EGP',
      save: i18n.language === 'ar' ? 'وفر ٦٠٪' : 'Save 60%',
      bestValue: true,
      features: [
        i18n.language === 'ar' ? 'خطة غذائية مدروسة بدقة لهدفك' : 'A meticulously studied nutrition plan for your goal',
        i18n.language === 'ar' ? 'متابعة يومية عبر الواتساب' : 'Daily follow-up via WhatsApp',
        i18n.language === 'ar' ? 'تعديل النظام الغذائي كل ١٥ يوم' : 'Diet modified every 15 days',
        i18n.language === 'ar' ? 'أولوية في الدعم' : 'Priority support'
      ]
    }
  ];

  const defaultTrainingPlans = [
    {
      id: 3,
      type: 'training',
      title: t('packages.training'),
      duration: i18n.language === 'ar' ? '٣٠ يوم' : '30 DAYS',
      oldPrice: i18n.language === 'ar' ? '٨٠٠ ج.م' : '800 EGP',
      price: 400,
      currency: i18n.language === 'ar' ? 'ج.م' : 'EGP',
      save: i18n.language === 'ar' ? 'وفر ٥٠٪' : 'Save 50%',
      bestValue: false,
      features: [
        i18n.language === 'ar' ? 'برنامج تمرين مخصص' : 'Customized workout program',
        i18n.language === 'ar' ? 'فيديوهات توضيحية لجميع التمارين' : 'Video demonstrations for all exercises',
        i18n.language === 'ar' ? 'متابعة وتعديل الأداء أسبوعياً' : 'Weekly form check and adjustments'
      ]
    },
    {
      id: 4,
      type: 'training',
      title: t('packages.training'),
      duration: i18n.language === 'ar' ? '٩٠ يوم' : '90 DAYS',
      oldPrice: i18n.language === 'ar' ? '٢٤٠٠ ج.م' : '2400 EGP',
      price: 1000,
      currency: i18n.language === 'ar' ? 'ج.م' : 'EGP',
      save: i18n.language === 'ar' ? 'وفر ٥٨٪' : 'Save 58%',
      bestValue: true,
      features: [
        i18n.language === 'ar' ? 'برنامج تمرين مخصص' : 'Customized workout program',
        i18n.language === 'ar' ? 'فيديوهات توضيحية لجميع التمارين' : 'Video demonstrations for all exercises',
        i18n.language === 'ar' ? 'متابعة وتعديل الأداء أسبوعياً' : 'Weekly form check and adjustments',
        i18n.language === 'ar' ? 'دعم مباشر عبر المكالمات' : 'Direct call support'
      ]
    }
  ];

  const defaultVipPlan = [
    {
      id: 5,
      type: 'vip',
      title: t('packages.vip'),
      duration: i18n.language === 'ar' ? 'سنة واحدة VIP' : '1 YEAR VIP',
      oldPrice: i18n.language === 'ar' ? '١٠٠٠٠ ج.م' : '10000 EGP',
      price: 4000,
      currency: i18n.language === 'ar' ? 'ج.م' : 'EGP',
      save: i18n.language === 'ar' ? 'وفر ٦٠٪' : 'Save 60%',
      bestValue: true,
      features: [
        i18n.language === 'ar' ? 'برنامج غذائي وتدريبي مخصص لمدة عام' : 'Full year customized nutrition & training',
        i18n.language === 'ar' ? 'دعم WhatsApp للأولوية 24/7' : '24/7 Priority VIP WhatsApp Support',
        i18n.language === 'ar' ? 'استشارة فيديو شهرية' : 'Monthly live video consultation',
        i18n.language === 'ar' ? 'دخول حصري للمجتمع الخاص' : 'Exclusive access to private community'
      ]
    }
  ];

  const allDefaultPlans = [...defaultNutritionPlans, ...defaultTrainingPlans, ...defaultVipPlan];

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "packages"));
        if (!querySnapshot.empty) {
          const fetchedPackages = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setPackages(fetchedPackages);
        } else {
          setPackages(allDefaultPlans);
        }
      } catch (err) {
        console.error("Error fetching packages: ", err);
        setPackages(allDefaultPlans);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, [i18n.language]);

  const RenderCard = ({ plan, index }) => (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      style={{ height: '100%' }}
    >
      <FastTilt
        tiltMaxAngleX={5}
        tiltMaxAngleY={5}
        scale={1.02}
        transitionSpeed={2500}
        glareEnable={true}
        glareMaxOpacity={0.1}
        glareColor="#ecb613"
        glarePosition="all"
        className={`package-card ${plan.bestValue ? 'best-value-card' : ''}`}
        style={{ height: '100%' }}
      >
      {plan.bestValue && (
        <div className="best-value-badge">
          <span>&#x23F1; {t('packages.bestValue')}</span>
        </div>
      )}
      <div className="save-badge">{plan.save}</div>
      <h3 className="package-duration">{plan.duration}</h3>
      <p className="old-price">{plan.oldPrice}</p>
      <div className="new-price-wrapper">
        <span className="new-price">{plan.price}</span>
        <span className="currency">{plan.currency}</span>
      </div>
      
      <ul className="features-list">
        {plan.features.map((feature, idx) => (
          <li key={idx}>
            <Check size={18} className="check-icon" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      
      <button className="btn-subscribe" onClick={() => navigate('/payment', { state: { plan } })}>{t('packages.subscribe')}</button>
      </FastTilt>
    </motion.div>
  );

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: '#fff' }}>Loading Packages...</div>;
  }

  return (
    <section className="packages-section">
      <div className="packages-container">
        <motion.h2 
          className="packages-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {t('packages.title')}
        </motion.h2>
        <div className="title-divider"></div>

        <div className="category-section">
          <motion.div 
            className="category-header"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Apple size={32} className="gold-text" />
            <h3 className="category-title">{t('packages.nutrition')}</h3>
          </motion.div>
          <div className="cards-grid">
            {packages.filter(p => p.type === 'nutrition').map((plan, idx) => <RenderCard key={plan.id} plan={plan} index={idx} />)}
          </div>
        </div>

        <div className="category-section">
          <motion.div 
            className="category-header"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Dumbbell size={32} className="gold-text" />
            <h3 className="category-title">{t('packages.training')}</h3>
          </motion.div>
          <div className="cards-grid">
            {packages.filter(p => p.type === 'training').map((plan, idx) => <RenderCard key={plan.id} plan={plan} index={idx} />)}
          </div>
        </div>

        {/* VIP MEMBERSHIPS */}
        <div className="category-section">
          <motion.div 
            className="category-header"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Users size={32} className="gold-text" />
            <h3 className="category-title">{t('packages.vip')}</h3>
          </motion.div>
          <div className="cards-grid single-card-centered">
            {packages.filter(p => p.type === 'vip').map((plan, idx) => <RenderCard key={plan.id} plan={plan} index={idx} />)}
          </div>
        </div>

        {linkTo && (
          <div style={{ marginTop: '3rem', textAlign: 'center' }}>
            <Link to={linkTo} className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
              SEE FULL PACKAGE DETAILS
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Packages;
