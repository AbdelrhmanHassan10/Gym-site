import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Clock, CreditCard, LogOut, Package, TrendingUp, Heart, Calendar, Target } from 'lucide-react';
import { AuthContext } from '../AuthContext';
import { useTranslation } from 'react-i18next';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import './ProfilePage.css';

const ProfilePage = () => {
  const { t } = useTranslation();
  const { user, logout } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!user) {
      navigate('/login');
    } else {
      const fetchHistory = async () => {
        try {
          const q = query(collection(db, "subscriptions"), where("userEmail", "==", user.email.toLowerCase()));
          const querySnapshot = await getDocs(q);
          const data = querySnapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data(),
            date: doc.data().createdAt || doc.data().date
          }));
          
          data.sort((a, b) => new Date(b.date) - new Date(a.date));
          setHistory(data);
        } catch (err) {
          console.error('Error fetching profile:', err);
        } finally {
          setLoading(false);
        }
      };
      
      fetchHistory();
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const activeSubscription = history.length > 0 ? history[0] : null;

  return (
    <div className="profile-page-container">
      <div className="dash-welcome">
        <div>
          <span className="dash-tag">{t('profile.dashboard')}</span>
          <h1 className="dash-title">{t('profile.welcome')} {user?.name?.toUpperCase() || 'MEMBER'}</h1>
          {['coachahmedragab@gmail.com', 'admin@gym.com', 'coach@gym.com'].includes(user.email?.toLowerCase()) && (
            <button 
              className="dash-cta-btn" 
              style={{marginTop: '1rem', background: '#333', color: 'white', padding: '0.6rem 1rem'}} 
              onClick={() => navigate('/admin')}
            >
              {t('profile.adminPanel')}
            </button>
          )}
        </div>
        <div className="dash-user-chip" onClick={() => handleLogout()}>
          <div className="dash-user-avatar">
            <img src={user.avatarUrl || "https://i.pravatar.cc/150?img=11"} alt="Profile" />
          </div>
          <div>
            <span className="dash-user-status" style={{display: 'block'}}>{user.name || 'MEMBER'}</span>
            <span className="dash-user-since" style={{display: 'block'}}>{t('profile.since')} {new Date().getFullYear()}</span>
          </div>
          <LogOut size={18} className="dash-logout-icon" />
        </div>
      </div>

      <div className="dash-bento">
        <motion.div 
          className="dash-card dash-card-large kinetic-gradient"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="dash-card-glow"></div>
          <div className="dash-card-inner">
            <div className="dash-card-top">
              <span className="dash-badge">{t('profile.activePlan')}</span>
            </div>
            {loading ? (
              <p className="dash-muted">{t('profile.loading')}</p>
            ) : activeSubscription ? (
              <div className="dash-plan-info">
                <h2 className="dash-plan-name">{activeSubscription.planTitle}</h2>
                {(() => {
                  const status = (activeSubscription.status || 'pending').toLowerCase();
                  const daysMatch = activeSubscription.duration.match(/(\d+)/);
                  const durationDays = daysMatch ? parseInt(daysMatch[1]) : 30;

                  if (status === 'pending') {
                    return (
                      <>
                        <div className="dash-plan-stats">
                          <div className="dash-plan-stat">
                            <p className="dash-stat-label">{t('profile.status')}</p>
                            <p className="dash-stat-value" style={{color: '#f5a623'}}>{t('profile.pending')}</p>
                          </div>
                          <div className="dash-plan-divider"></div>
                          <div className="dash-plan-stat">
                            <p className="dash-stat-label">{t('profile.startDate')}</p>
                            <p className="dash-stat-value">{t('profile.awaitingApproval')}</p>
                          </div>
                          <div className="dash-plan-divider"></div>
                          <div className="dash-plan-stat">
                            <p className="dash-stat-label">{t('profile.endDate')}</p>
                            <p className="dash-stat-value">{t('profile.awaitingApproval')}</p>
                          </div>
                          <div className="dash-plan-divider"></div>
                          <div className="dash-plan-stat">
                            <p className="dash-stat-label">{t('profile.remaining')}</p>
                            <p className="dash-stat-value">-- {t('profile.days')}</p>
                          </div>
                        </div>
                        <div className="dash-plan-progress-wrap">
                          <div className="dash-progress-bar-bg">
                            <div className="dash-progress-bar-fill" style={{width: '0%', background: '#555'}}></div>
                          </div>
                          <span className="dash-plan-status-text" style={{color: '#aaa'}}>
                            {t('profile.waitingAdmin')}
                          </span>
                        </div>
                      </>
                    );
                  }

                  if (status === 'rejected') {
                    return (
                      <>
                        <div className="dash-plan-stats">
                          <div className="dash-plan-stat">
                            <p className="dash-stat-label">{t('profile.status')}</p>
                            <p className="dash-stat-value" style={{color: '#ff4d4d'}}>{t('profile.rejected')}</p>
                          </div>
                        </div>
                        <div className="dash-plan-progress-wrap">
                          <span className="dash-plan-status-text expired-text">
                            {t('profile.rejectedDesc')}
                          </span>
                        </div>
                      </>
                    );
                  }

                  // Active status
                  const startDate = new Date(activeSubscription.startDate || activeSubscription.date);
                  const endDate = new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000);
                  const now = new Date();
                  const elapsed = Math.max(0, now - startDate);
                  const total = endDate - startDate;
                  const remaining = Math.max(0, Math.ceil((endDate - now) / (24 * 60 * 60 * 1000)));
                  const progress = Math.min(100, (elapsed / total) * 100);
                  const isExpired = now > endDate;
                  const isExpiringSoon = !isExpired && remaining <= 5;

                  return (
                    <>
                      <div className="dash-plan-stats">
                        <div className="dash-plan-stat">
                          <p className="dash-stat-label">{t('profile.status')}</p>
                          <p className="dash-stat-value" style={{color: isExpired ? '#ff4d4d' : 'var(--accent-gold)'}}>
                            {isExpired ? t('profile.expired') : t('profile.active')}
                          </p>
                        </div>
                        <div className="dash-plan-divider"></div>
                        <div className="dash-plan-stat">
                          <p className="dash-stat-label">{t('profile.startDate')}</p>
                          <p className="dash-stat-value">{startDate.toLocaleDateString()}</p>
                        </div>
                        <div className="dash-plan-divider"></div>
                        <div className="dash-plan-stat">
                          <p className="dash-stat-label">{t('profile.endDate')}</p>
                          <p className="dash-stat-value">{endDate.toLocaleDateString()}</p>
                        </div>
                        <div className="dash-plan-divider"></div>
                        <div className="dash-plan-stat">
                          <p className="dash-stat-label">{t('profile.remaining')}</p>
                          <p className="dash-stat-value" style={{color: isExpiringSoon ? '#ff9800' : isExpired ? '#ff4d4d' : 'inherit'}}>
                            {isExpired ? `0 ${t('profile.days')}` : `${remaining} ${t('profile.days')}`}
                          </p>
                        </div>
                      </div>
                      <div className="dash-plan-progress-wrap">
                        <div className="dash-progress-bar-bg">
                          <div 
                            className={`dash-progress-bar-fill ${isExpired ? 'expired' : ''} glow-accent`} 
                            style={{width: `${progress}%`, background: isExpiringSoon ? '#ff9800' : isExpired ? '#ff4d4d' : ''}}
                          ></div>
                        </div>
                        <span className={`dash-plan-status-text ${isExpired ? 'expired-text' : ''}`} style={{color: isExpiringSoon ? '#ff9800' : ''}}>
                          {isExpired 
                            ? t('profile.expiredDesc')
                            : isExpiringSoon 
                              ? `${t('profile.expiringSoon')} ${remaining} ${t('profile.daysLeft')}`
                              : `${t('profile.activeDesc')} ${Math.round(progress)}% ${t('profile.elapsed')}`}
                        </span>
                        
                        {(isExpired || isExpiringSoon) && (
                          <button className="dash-cta-btn" style={{marginTop: '1rem', padding: '0.8rem 1.5rem', fontSize: '0.9rem'}} onClick={() => navigate('/packages')}>
                            {t('profile.renew')}
                          </button>
                        )}
                      </div>

                      {/* CLIENT DELIVERY SYSTEM: Show Plan/Notes if provided */}
                      {(activeSubscription.planLink || activeSubscription.coachNotes) && (
                        <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(245, 166, 35, 0.05)', border: '1px solid rgba(245, 166, 35, 0.2)', borderRadius: '12px' }}>
                          <h3 style={{ color: '#f5a623', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Target size={20} /> My Assigned Plan
                          </h3>
                          
                          {activeSubscription.coachNotes && (
                            <div style={{ marginBottom: '1.5rem' }}>
                              <h4 style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '0.5rem', opacity: 0.8 }}>Coach Notes:</h4>
                              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', color: '#ddd', fontSize: '0.95rem', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                                {activeSubscription.coachNotes}
                              </div>
                            </div>
                          )}

                          {activeSubscription.planLink && (
                            <div>
                              <a 
                                href={activeSubscription.planLink} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="btn-primary" 
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', padding: '0.8rem 1.5rem' }}
                              >
                                <Package size={18} /> Access Full Plan (PDF/Video)
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            ) : (
              <div className="dash-plan-info">
                <h2 className="dash-plan-name" style={{opacity: 0.5}}>{t('profile.noActivePlan')}</h2>
                <p className="dash-muted">{t('profile.subscribeToGetStarted')}</p>
                <button className="dash-cta-btn" onClick={() => navigate('/packages')}>
                  {t('profile.browsePackages')}
                </button>
              </div>
            )}
          </div>
        </motion.div>
        {/* Payment History (Full Width) */}
        <motion.div 
          className="dash-card dash-card-full inner-glow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="dash-card-header">
            <h4>{t('profile.paymentHistory')}</h4>
            <CreditCard size={24} className="dash-icon-accent" />
          </div>
          <div className="history-table-wrap">
            <table className="history-table">
              <thead>
                <tr>
                  <th>{t('profile.historyDate')}</th>
                  <th>{t('profile.historyPackage')}</th>
                  <th>{t('profile.historyAmount')}</th>
                  <th>{t('profile.historyMethod')}</th>
                  <th>{t('profile.historyStatus')}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center' }}>{t('profile.loadingHistory')}</td></tr>
                ) : history.length > 0 ? (
                  history.map((item, idx) => (
                    <tr key={idx}>
                      <td>{new Date(item.date).toLocaleDateString()}</td>
                      <td>{item.planTitle}</td>
                      <td>{item.price} EGP</td>
                      <td>{item.paymentMethod}</td>
                      <td>
                        <span className={`status-badge status-${item.status || 'pending'}`}>
                          {t(`profile.${item.status || 'pending'}`)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5" style={{ textAlign: 'center', opacity: 0.7 }}>{t('profile.noHistory')}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default ProfilePage;
