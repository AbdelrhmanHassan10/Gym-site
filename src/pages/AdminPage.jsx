import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Check, X, Clock, RefreshCw } from 'lucide-react';
import { AuthContext } from '../AuthContext';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import './AdminPage.css';

const AdminPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Define admin emails
  const ADMIN_EMAILS = ['admin@coachgym.com', 'admin@gym.com', 'coach@gym.com'];

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

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      setActionLoading(id);
      const subRef = doc(db, 'subscriptions', id);
      await updateDoc(subRef, { status: newStatus });
      
      // Update local state
      setSubscriptions(prev => 
        prev.map(sub => sub.id === id ? { ...sub, status: newStatus } : sub)
      );
    } catch (err) {
      console.error('Error updating status', err);
      alert('Error updating status');
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
            ADMIN DASHBOARD
          </h1>
          <p className="admin-subtitle">Manage memberships and payment approvals</p>
        </motion.div>
        
        <button className="refresh-btn" onClick={fetchSubscriptions} disabled={loading}>
          <RefreshCw size={18} className={loading ? 'spinning' : ''} />
          Refresh Data
        </button>
      </div>

      <motion.div 
        className="admin-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="admin-card">
          <h2 className="admin-card-title">Recent Subscriptions</h2>
          
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Plan & Duration</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && subscriptions.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-8 text-muted">Loading subscriptions...</td>
                  </tr>
                ) : subscriptions.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-8 text-muted">No subscriptions found in the database.</td>
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
                      </td>
                      <td className="text-muted">{new Date(sub.date).toLocaleString()}</td>
                      <td>
                        <span className={`status-badge status-${sub.status || 'pending'}`}>
                          {(sub.status || 'pending').toUpperCase()}
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
                            <button 
                              className="btn-revoke" 
                              onClick={() => handleStatusUpdate(sub.id, 'rejected')}
                              disabled={actionLoading === sub.id}
                              title="Revoke Membership"
                            >
                              <X size={16} /> Revoke
                            </button>
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
      </motion.div>
    </div>
  );
};

export default AdminPage;
