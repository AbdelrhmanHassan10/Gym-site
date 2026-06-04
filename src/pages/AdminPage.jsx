import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Check, X, Clock, RefreshCw, Package } from 'lucide-react';
import { AuthContext } from '../AuthContext';
import { useTranslation } from 'react-i18next';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import AdminPackages from '../components/AdminPackages';
import './AdminPage.css';

const AdminPage = () => {
  const { t, i18n } = useTranslation();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('subscriptions');
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [addingPlanTo, setAddingPlanTo] = useState(null);
  const [planForm, setPlanForm] = useState({ planLink: '', coachNotes: '' });
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Define admin emails
  const ADMIN_EMAILS = ['coachahmedragab@gmail.com', 'admin@gym.com', 'coach@gym.com'];

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "subscriptions"));
      const data = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        date: doc.data().createdAt || doc.data().date // fallback
      }));
      // Sort by date descending
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setSubscriptions(data);
    } catch (err) {
      console.error('Failed to fetch subscriptions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!user) {
      navigate('/login');
    } else if (!ADMIN_EMAILS.includes(user.email.toLowerCase())) {
      // If user is not an admin, redirect to their profile
      navigate('/profile');
    } else {
      fetchSubscriptions();
    }
  }, [user, navigate]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      setActionLoading(id);
      const subRef = doc(db, 'subscriptions', id);
      
      const updateData = { status: newStatus };
      if (newStatus === 'active') {
        updateData.startDate = new Date().toISOString();
      }

      await updateDoc(subRef, updateData);
      
      // Update local state
      setSubscriptions(prev => 
        prev.map(sub => sub.id === id ? { ...sub, ...updateData } : sub)
      );
    } catch (err) {
      console.error('Error updating status', err);
      alert('Error updating status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSavePlan = async (id) => {
    try {
      setActionLoading(id);
      const subRef = doc(db, 'subscriptions', id);
      await updateDoc(subRef, {
        planLink: planForm.planLink,
        coachNotes: planForm.coachNotes
      });
      setSubscriptions(prev => 
        prev.map(sub => sub.id === id ? { ...sub, planLink: planForm.planLink, coachNotes: planForm.coachNotes } : sub)
      );
      setAddingPlanTo(null);
      alert('Plan added successfully!');
    } catch (err) {
      console.error('Error saving plan', err);
      alert('Error saving plan');
    } finally {
      setActionLoading(null);
    }
  };

  if (!user || !ADMIN_EMAILS.includes(user.email.toLowerCase())) return null;

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
        
        <button className="refresh-btn" onClick={fetchSubscriptions} disabled={loading}>
          <RefreshCw size={18} className={loading ? 'spinning' : ''} />
          {t('admin.refresh')}
        </button>
      </div>

      <div className="admin-tabs">
        <button className={`admin-tab ${activeTab === 'subscriptions' ? 'active' : ''}`} onClick={() => setActiveTab('subscriptions')}>
          <Shield size={18} /> {t('admin.dashboard')}
        </button>
        <button className={`admin-tab ${activeTab === 'packages' ? 'active' : ''}`} onClick={() => setActiveTab('packages')}>
          <Package size={18} /> {i18n.language === 'ar' ? 'إدارة الباقات' : 'Manage Packages'}
        </button>
      </div>

      <motion.div 
        className="admin-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {activeTab === 'subscriptions' && (
        <div className="admin-card">
          <h2 className="admin-card-title">{t('admin.recentSub')}</h2>
          
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t('admin.id')}</th>
                  <th>{t('admin.user')}</th>
                  <th>{t('admin.planDuration')}</th>
                  <th>{t('admin.amount')}</th>
                  <th>{t('admin.method')}</th>
                  <th>{t('admin.senderNo')}</th>
                  <th>{t('admin.date')}</th>
                  <th>{t('admin.statusTitle')}</th>
                  <th>{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {loading && subscriptions.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-8 text-muted">{t('admin.loading')}</td>
                  </tr>
                ) : subscriptions.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-8 text-muted">{t('admin.noSubs')}</td>
                  </tr>
                ) : (
                  subscriptions.map((sub) => (
                    <tr key={sub.id}>
                      <td className="text-muted">#{sub.id}</td>
                      <td>
                        <div className="user-cell">
                          <span className="user-name">{sub.name}</span>
                          <span className="user-contact">{sub.email}</span>
                          <span className="user-contact">{sub.phone}</span>
                        </div>
                      </td>
                      <td>
                        <span className="plan-title">{sub.planTitle}</span>
                        <span className="plan-duration">{sub.duration}</span>
                      </td>
                      <td className="font-bold">{sub.price} EGP</td>
                      <td>
                        <span className={`method-badge method-${sub.paymentMethod}`}>
                          {sub.paymentMethod.toUpperCase()}
                        </span>
                        {sub.receiptPhoto && (
                          <div style={{marginTop: '0.5rem'}}>
                            <button 
                              onClick={() => setSelectedReceipt(sub.receiptPhoto)}
                              style={{color: '#f5a623', fontSize: '0.8rem', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', padding: 0}}
                            >
                              {t('admin.viewReceipt')}
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="text-muted" style={{ fontWeight: 'bold' }}>{sub.senderNumber || 'N/A'}</td>
                      <td className="text-muted">{new Date(sub.date).toLocaleString()}</td>
                      <td>
                        <span className={`status-badge status-${sub.status || 'pending'}`}>
                          {t(`profile.${sub.status || 'pending'}`)}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          {(sub.status === 'pending' || !sub.status) && (
                            <>
                              <button 
                                className="btn-approve" 
                                onClick={() => handleStatusUpdate(sub.id, 'active')}
                                disabled={actionLoading === sub.id}
                                title="Approve Payment"
                              >
                                {actionLoading === sub.id ? <RefreshCw size={16} className="spinning" /> : <Check size={16} />}
                              </button>
                              <button 
                                className="btn-reject" 
                                onClick={() => handleStatusUpdate(sub.id, 'rejected')}
                                disabled={actionLoading === sub.id}
                                title="Reject Payment"
                              >
                                {actionLoading === sub.id ? <RefreshCw size={16} className="spinning" /> : <X size={16} />}
                              </button>
                            </>
                          )}
                          {sub.status === 'active' && (
                            <>
                              <button 
                                className="btn-approve" 
                                style={{background: '#2ecc71', marginRight: '0.5rem'}}
                                onClick={() => {
                                  setAddingPlanTo(sub.id);
                                  setPlanForm({ planLink: sub.planLink || '', coachNotes: sub.coachNotes || '' });
                                }}
                                title={i18n.language === 'ar' ? 'إضافة/تعديل خطة' : 'Add/Edit Plan'}
                              >
                                <Check size={16} /> {i18n.language === 'ar' ? 'الخطة' : 'Plan'}
                              </button>
                              <button 
                                className="btn-revoke" 
                                onClick={() => handleStatusUpdate(sub.id, 'rejected')}
                                disabled={actionLoading === sub.id}
                                title={i18n.language === 'ar' ? 'إلغاء الاشتراك' : 'Revoke Membership'}
                              >
                                <X size={16} /> {i18n.language === 'ar' ? 'إلغاء' : 'Revoke'}
                              </button>
                            </>
                          )}
                          {sub.status === 'rejected' && (
                            <button 
                              className="btn-restore" 
                              onClick={() => handleStatusUpdate(sub.id, 'active')}
                              disabled={actionLoading === sub.id}
                              title="Restore Membership"
                            >
                              <Check size={16} /> Restore
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        )}

        {activeTab === 'packages' && (
          <AdminPackages />
        )}
      </motion.div>

      {/* Receipt Modal */}
      {selectedReceipt && (
        <div className="receipt-modal-overlay" onClick={() => setSelectedReceipt(null)}>
          <div className="receipt-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setSelectedReceipt(null)}>
              <X size={24} />
            </button>
            <img src={selectedReceipt} alt="Payment Receipt" className="receipt-image" />
          </div>
        </div>
      )}

      {/* Plan Modal */}
      {addingPlanTo && (
        <div className="receipt-modal-overlay" onClick={() => setAddingPlanTo(null)}>
          <div className="plan-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '1.5rem', color: '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>
              {i18n.language === 'ar' ? 'إضافة الخطة والملاحظات' : 'Add Plan & Notes'}
            </h3>
            
            <div className="form-group" style={{ marginBottom: '1.25rem', width: '100%' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc', fontSize: '0.9rem' }}>
                {i18n.language === 'ar' ? 'لينك جوجل درايف (PDF/Video)' : 'Google Drive Link (PDF/Video)'}
              </label>
              <input 
                type="url" 
                value={planForm.planLink} 
                onChange={e => setPlanForm(prev => ({...prev, planLink: e.target.value}))}
                style={{ width: '100%', padding: '0.8rem 1rem', background: '#222', border: '1px solid #333', color: '#fff', borderRadius: '6px', fontSize: '1rem', outline: 'none' }}
                placeholder="https://drive.google.com/..."
              />
            </div>

            <div className="form-group" style={{ marginBottom: '2rem', width: '100%' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc', fontSize: '0.9rem' }}>
                {i18n.language === 'ar' ? 'ملاحظات الكابتن / دايت' : 'Coach Notes / Diet Text'}
              </label>
              <textarea 
                value={planForm.coachNotes} 
                onChange={e => setPlanForm(prev => ({...prev, coachNotes: e.target.value}))}
                rows="5"
                style={{ width: '100%', padding: '0.8rem 1rem', background: '#222', border: '1px solid #333', color: '#fff', borderRadius: '6px', fontSize: '1rem', resize: 'vertical', outline: 'none' }}
                placeholder={i18n.language === 'ar' ? 'الماكروز بتاعتك هي...' : 'Your macro targets are...'}
              ></textarea>
            </div>

            <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
              <button 
                onClick={() => handleSavePlan(addingPlanTo)}
                disabled={actionLoading === addingPlanTo}
                style={{ 
                  flex: 2, 
                  padding: '1rem', 
                  background: '#f5a623', 
                  color: '#000', 
                  border: 'none', 
                  borderRadius: '6px', 
                  cursor: actionLoading === addingPlanTo ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  textTransform: 'uppercase',
                  opacity: actionLoading === addingPlanTo ? 0.7 : 1
                }}
              >
                {actionLoading === addingPlanTo ? (i18n.language === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (i18n.language === 'ar' ? 'حفظ الخطة' : 'Save Plan')}
              </button>
              
              <button 
                onClick={() => setAddingPlanTo(null)}
                style={{ 
                  flex: 1, 
                  padding: '1rem', 
                  background: 'transparent', 
                  color: '#fff', 
                  border: '1px solid #555', 
                  borderRadius: '6px', 
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                {i18n.language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
