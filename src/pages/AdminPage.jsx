import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Package, Star, ClipboardList } from 'lucide-react';
import { AuthContext } from '../AuthContext';
import { useTranslation } from 'react-i18next';
import AdminPackages from '../components/AdminPackages';
import AdminChampions from '../components/AdminChampions';
import AdminOrders from '../components/AdminOrders';
import './AdminPage.css';

const AdminPage = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('orders');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Define admin emails
  const ADMIN_EMAILS = ['coachahmedragab@gmail.com', 'admin@gym.com', 'coach@gym.com'];

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!user) {
      navigate('/login');
    } else if (!user.email || !ADMIN_EMAILS.includes(user.email.toLowerCase())) {
      // If user is not an admin, redirect to their profile
      navigate('/profile');
    }
  }, [user, navigate]);

  if (!user || !user.email || !ADMIN_EMAILS.includes(user.email.toLowerCase())) return null;

  return (
    <div className="admin-page-container">
      <div className="admin-header">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="admin-title">
            <Shield className="admin-icon" size={40} />
            {t('admin.dashboard')}
          </h1>
          <p className="admin-subtitle">{t('admin.subtitle')}</p>
        </motion.div>
      </div>

      <div className="admin-tabs">
        <button className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
          <ClipboardList size={18} /> {i18n.language === 'ar' ? 'طلبات الاشتراك' : 'Orders'}
        </button>
        <button className={`admin-tab ${activeTab === 'packages' ? 'active' : ''}`} onClick={() => setActiveTab('packages')}>
          <Package size={18} /> {i18n.language === 'ar' ? 'إدارة الباقات' : 'Manage Packages'}
        </button>
        <button className={`admin-tab ${activeTab === 'champions' ? 'active' : ''}`} onClick={() => setActiveTab('champions')}>
          <Star size={18} /> {i18n.language === 'ar' ? 'أبطالنا (التحولات)' : 'Transformations'}
        </button>
      </div>

      <motion.div 
        className="admin-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {activeTab === 'orders' && (
          <AdminOrders />
        )}

        {activeTab === 'packages' && (
          <AdminPackages />
        )}

        {activeTab === 'champions' && (
          <AdminChampions />
        )}
      </motion.div>
    </div>
  );
};

export default AdminPage;
