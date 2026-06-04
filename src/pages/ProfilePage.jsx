import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Clock, CreditCard, LogOut, Package, TrendingUp, Heart } from 'lucide-react';
import { AuthContext } from '../AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import './ProfilePage.css';

const ProfilePage = () => {
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
            date: doc.data().createdAt || doc.data().date // fallback if needed
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
      {/* Welcome Header */}
      <motion.div 
        className="dash-welcome"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="dash-welcome-left">
          <span className="dash-tag">DASHBOARD</span>
          <h1 className="dash-title">WELCOME, {user.name ? user.name.toUpperCase() : 'MEMBER'}</h1>
        </div>
        <div className="dash-user-chip" onClick={() => handleLogout()}>
          <div className="dash-user-avatar">
            <img src={user.avatarUrl || "https://i.pravatar.cc/150?img=11"} alt="Profile" />
          </div>
          <div className="dash-user-info">
            <p className="dash-user-status">{user.name ? user.name.toUpperCase() : 'MEMBER'}</p>
            <p className="dash-user-since">Since {new Date().getFullYear()}</p>
          </div>
          <LogOut size={18} className="dash-logout-icon" />
        </div>
      </motion.div>

      {/* Bento Grid */}
      <div className="dash-bento">

        {/* Active Subscription (Large Card) */}
        <motion.div 
          className="dash-card dash-card-large kinetic-gradient"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="dash-card-glow"></div>
          <div className="dash-card-inner">
            <div className="dash-card-top">
              <span className="dash-badge">ACTIVE PLAN</span>
            </div>
            {loading ? (
              <p className="dash-muted">Loading subscription...</p>
            ) : activeSubscription ? (
              <div className="dash-plan-info">
                <h2 className="dash-plan-name">{activeSubscription.planTitle}</h2>
                {(() => {
                  const startDate = new Date(activeSubscription.date);
                  const daysMatch = activeSubscription.duration.match(/(\d+)/);
                  const durationDays = daysMatch ? parseInt(daysMatch[1]) : 30;
                  const endDate = new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000);
                  const now = new Date();
                  const elapsed = Math.max(0, now - startDate);
                  const total = endDate - startDate;
                  const remaining = Math.max(0, Math.ceil((endDate - now) / (24 * 60 * 60 * 1000)));
                  const progress = Math.min(100, (elapsed / total) * 100);
                  const isExpired = now > endDate;

                  return (
                    <>
                      <div className="dash-plan-stats">
                        <div className="dash-plan-stat">
                          <p className="dash-stat-label">STATUS</p>
                          <p className="dash-stat-value">{(activeSubscription.status || 'ACTIVE').toUpperCase()}</p>
                        </div>
                        <div className="dash-plan-divider"></div>
                        <div className="dash-plan-stat">
                          <p className="dash-stat-label">START DATE</p>
                          <p className="dash-stat-value">{startDate.toLocaleDateString()}</p>
                        </div>
                        <div className="dash-plan-divider"></div>
                        <div className="dash-plan-stat">
                          <p className="dash-stat-label">END DATE</p>
                          <p className="dash-stat-value">{endDate.toLocaleDateString()}</p>
                        </div>
                        <div className="dash-plan-divider"></div>
                        <div className="dash-plan-stat">
                          <p className="dash-stat-label">REMAINING</p>
                          <p className="dash-stat-value">{isExpired ? 'EXPIRED' : `${remaining} DAYS`}</p>
                        </div>
                      </div>
                      <div className="dash-plan-progress-wrap">
                        <div className="dash-progress-bar-bg">
                          <div className={`dash-progress-bar-fill ${isExpired ? 'expired' : ''} glow-accent`} style={{width: `${progress}%`}}></div>
                        </div>
                        <span className={`dash-plan-status-text ${isExpired ? 'expired-text' : ''}`}>
                          {isExpired ? '⚠ Subscription Expired' : `✓ Active — ${Math.round(progress)}% elapsed`}
                        </span>
                      </div>
                    </>
                  );
                })()}
              </div>
            ) : (
              <div className="dash-plan-info">
                <h2 className="dash-plan-name" style={{opacity: 0.5}}>No Active Plan</h2>
                <p className="dash-muted">Subscribe to a coaching package to get started.</p>
                <button className="dash-cta-btn" onClick={() => navigate('/packages')}>
                  Browse Packages
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
            <h4>PAYMENT HISTORY</h4>
            <CreditCard size={24} className="dash-icon-accent" />
          </div>
          <div className="history-table-wrap">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Package</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center' }}>Loading history...</td></tr>
                ) : history.length > 0 ? (
                  history.map((item, idx) => (
                    <tr key={idx}>
                      <td>{new Date(item.date).toLocaleDateString()}</td>
                      <td>{item.planTitle}</td>
                      <td>{item.price} EGP</td>
                      <td>{item.paymentMethod}</td>
                      <td>
                        <span className={`status-badge status-${item.status || 'pending'}`}>
                          {(item.status || 'pending').toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5" style={{ textAlign: 'center', opacity: 0.7 }}>No payment history found.</td></tr>
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
