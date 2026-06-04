import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../firebase';
import { collection, getDocs, doc, setDoc, updateDoc } from 'firebase/firestore';
import { Eye, Check, X, FileText, Link as LinkIcon, MessageSquare } from 'lucide-react';

const AdminOrders = () => {
  const { i18n } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [planLink, setPlanLink] = useState('');
  const [coachNotes, setCoachNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "subscriptions"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort by date (newest first)
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openOrder = (order) => {
    setSelectedOrder(order);
    setPlanLink(order.planLink || '');
    setCoachNotes(order.coachNotes || '');
  };

  const closeOrder = () => {
    setSelectedOrder(null);
    setPlanLink('');
    setCoachNotes('');
  };

  const handleQuickStatusUpdate = async (id, status) => {
    setIsUpdating(true);
    try {
      const updateData = {
        status: status,
        updatedAt: new Date().toISOString()
      };
      if (status === 'active') {
        // Only set startDate if it doesn't already have one
        const order = orders.find(o => o.id === id);
        if (order && !order.startDate) {
          updateData.startDate = new Date().toISOString();
        }
      }
      await updateDoc(doc(db, "subscriptions", id), updateData);
      setOrders(orders.map(o => o.id === id ? { ...o, ...updateData } : o));
    } catch (error) {
      console.error("Error updating status", error);
      alert("Error updating status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateStatus = async (status) => {
    if (!selectedOrder) return;
    
    // If approving, we might want to ensure they provide a plan link or note (optional, but good practice)
    
    setIsUpdating(true);
    try {
      const updateData = {
        status: status,
        updatedAt: new Date().toISOString()
      };

      if (status === 'active') {
        updateData.planLink = planLink;
        updateData.coachNotes = coachNotes;
        // Start the plan countdown from the moment of approval if not already started
        if (!selectedOrder.startDate) {
          updateData.startDate = new Date().toISOString();
        }
      }

      await updateDoc(doc(db, "subscriptions", selectedOrder.id), updateData);
      
      // Update local state
      setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, ...updateData } : o));
      closeOrder();
    } catch (error) {
      console.error("Error updating order", error);
      alert("Error updating order");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="admin-packages">
      <div className="admin-card">
        <h2 className="admin-card-title">{i18n.language === 'ar' ? 'طلبات الاشتراك' : 'Subscriptions / Orders'}</h2>
        
        {loading ? (
          <p>{i18n.language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
        ) : orders.length === 0 ? (
          <p className="text-muted">{i18n.language === 'ar' ? 'لا يوجد طلبات حالياً.' : 'No orders found.'}</p>
        ) : (
          <>
            <div className="mobile-scroll-hint">
              {i18n.language === 'ar' ? 'اسحب الجدول لليمين أو اليسار لرؤية باقي التفاصيل ↔️' : 'Swipe table horizontally to see more ↔️'}
            </div>
            <div className="admin-table-container">
              <div className="admin-table-wrap">
                <table className="admin-table" style={{ width: '100%', minWidth: '900px' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '22%', textAlign: i18n.language === 'ar' ? 'right' : 'left' }}>{i18n.language === 'ar' ? 'العميل' : 'USER'}</th>
                      <th style={{ width: '18%', textAlign: i18n.language === 'ar' ? 'right' : 'left' }}>{i18n.language === 'ar' ? 'الباقة' : 'PLAN'}</th>
                      <th style={{ width: '15%', textAlign: i18n.language === 'ar' ? 'right' : 'left' }}>{i18n.language === 'ar' ? 'الدفع' : 'PAYMENT'}</th>
                      <th style={{ width: '10%', textAlign: 'center' }}>{i18n.language === 'ar' ? 'الوصل' : 'RECEIPT'}</th>
                      <th style={{ width: '12%', textAlign: 'center' }}>{i18n.language === 'ar' ? 'التاريخ' : 'DATE'}</th>
                      <th style={{ width: '10%', textAlign: 'center' }}>{i18n.language === 'ar' ? 'الحالة' : 'STATUS'}</th>
                      <th style={{ width: '13%', textAlign: i18n.language === 'ar' ? 'left' : 'right' }}>{i18n.language === 'ar' ? 'إجراءات' : 'ACTIONS'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id} style={{ background: order.status === 'pending' ? 'rgba(245, 166, 35, 0.05)' : 'transparent', borderLeft: order.status === 'pending' ? '3px solid #f5a623' : 'none' }}>
                        <td style={{ textAlign: i18n.language === 'ar' ? 'right' : 'left' }}>
                          <div style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '0.3rem', color: '#fff' }}>{order.name}</div>
                          <div style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '0.2rem' }}>{order.userEmail}</div>
                          <div style={{ fontSize: '0.85rem', opacity: 0.5 }}>{order.phone}</div>
                        </td>
                        <td style={{ textAlign: i18n.language === 'ar' ? 'right' : 'left' }}>
                          <div style={{ fontWeight: 'bold', marginBottom: '0.3rem', color: '#fff' }}>{order.planTitle}</div>
                          <div style={{ fontSize: '0.85rem', color: '#f5a623', marginBottom: '0.3rem' }}>{order.duration}</div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 'bold', background: 'rgba(255,255,255,0.05)', display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>{order.price} {order.currency || 'EGP'}</div>
                        </td>
                        <td style={{ textAlign: i18n.language === 'ar' ? 'right' : 'left' }}>
                          <div style={{ marginBottom: '0.5rem' }}>
                            <span style={{
                              padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold',
                              background: order.paymentMethod === 'instapay' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                              color: order.paymentMethod === 'instapay' ? '#a78bfa' : '#60a5fa',
                              textTransform: 'uppercase'
                            }}>
                              {order.paymentMethod?.replace('_', ' ')}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                            <div style={{ opacity: 0.5, marginBottom: '0.2rem' }}>{i18n.language === 'ar' ? 'محول من: ' : 'From: '}</div>
                            <div style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#ddd' }}>{order.senderNumber || '-'}</div>
                          </div>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {order.receiptPhoto ? (
                            <button onClick={() => openOrder(order)} style={{ background: 'rgba(245, 166, 35, 0.1)', border: '1px solid rgba(245, 166, 35, 0.3)', borderRadius: '6px', color: '#f5a623', fontSize: '0.8rem', cursor: 'pointer', padding: '0.4rem 0.8rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', margin: '0 auto', transition: 'all 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(245, 166, 35, 0.2)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(245, 166, 35, 0.1)'}>
                              <Eye size={18} /> 
                              <span style={{ fontWeight: 'bold' }}>{i18n.language === 'ar' ? 'عرض' : 'View'}</span>
                            </button>
                          ) : (
                            <span style={{ opacity: 0.3, fontSize: '0.9rem' }}>-</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'center', fontSize: '0.9rem' }}>
                          <div style={{ marginBottom: '0.3rem', color: '#eee' }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                          <div style={{ opacity: 0.5 }}>{new Date(order.createdAt).toLocaleTimeString()}</div>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span style={{
                            padding: '0.4rem 0.8rem',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            background: order.status === 'active' ? 'rgba(46, 204, 113, 0.15)' : order.status === 'rejected' ? 'rgba(231, 76, 60, 0.15)' : 'rgba(245, 166, 35, 0.15)',
                            color: order.status === 'active' ? '#2ecc71' : order.status === 'rejected' ? '#e74c3c' : '#f5a623',
                            border: `1px solid ${order.status === 'active' ? 'rgba(46, 204, 113, 0.3)' : order.status === 'rejected' ? 'rgba(231, 76, 60, 0.3)' : 'rgba(245, 166, 35, 0.3)'}`,
                            display: 'inline-block'
                          }}>
                            {order.status === 'active' ? (i18n.language === 'ar' ? 'نشط' : 'ACTIVE') : order.status === 'rejected' ? (i18n.language === 'ar' ? 'مرفوض' : 'REJECTED') : (i18n.language === 'ar' ? 'قيد الانتظار' : 'PENDING')}
                          </span>
                        </td>
                        <td style={{ textAlign: i18n.language === 'ar' ? 'left' : 'right' }}>
                          <div className="action-buttons" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: i18n.language === 'ar' ? 'flex-start' : 'flex-end', flexWrap: 'wrap' }}>
                            {(order.status === 'pending' || !order.status) && (
                              <>
                                <button 
                                  onClick={() => handleQuickStatusUpdate(order.id, 'active')}
                                  title="Approve Payment"
                                  disabled={isUpdating}
                                  style={{ background: 'rgba(46, 204, 113, 0.2)', color: '#2ecc71', border: '1px solid rgba(46, 204, 113, 0.5)', padding: '0.5rem 0.5rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', fontSize: '0.85rem', fontWeight: 'bold', width: '115px', textAlign: 'center', transition: 'all 0.2s' }}
                                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(46, 204, 113, 0.3)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(46, 204, 113, 0.2)'}
                                >
                                  <Check size={16} /> {i18n.language === 'ar' ? 'موافقة' : 'Approve'}
                                </button>
                                <button 
                                  onClick={() => handleQuickStatusUpdate(order.id, 'rejected')}
                                  title="Reject Payment"
                                  disabled={isUpdating}
                                  style={{ background: 'rgba(231, 76, 60, 0.2)', color: '#e74c3c', border: '1px solid rgba(231, 76, 60, 0.5)', padding: '0.5rem 0.5rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', fontSize: '0.85rem', fontWeight: 'bold', width: '115px', textAlign: 'center', transition: 'all 0.2s' }}
                                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(231, 76, 60, 0.3)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(231, 76, 60, 0.2)'}
                                >
                                  <X size={16} /> {i18n.language === 'ar' ? 'رفض' : 'Reject'}
                                </button>
                              </>
                            )}
                            
                            {order.status === 'active' && (
                              <>
                                <button 
                                  onClick={() => openOrder(order)} 
                                  title="Plan & Details" 
                                  style={{ background: '#2ecc71', color: '#000', border: 'none', padding: '0.5rem 0.5rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', fontSize: '0.85rem', fontWeight: 'bold', width: '115px', textAlign: 'center', transition: 'all 0.2s' }}
                                  onMouseOver={(e) => e.currentTarget.style.background = '#27ae60'} onMouseOut={(e) => e.currentTarget.style.background = '#2ecc71'}
                                >
                                  <FileText size={16} style={{ flexShrink: 0 }} /> <span>{i18n.language === 'ar' ? 'تسليم الخطة' : 'Deliver Plan'}</span>
                                </button>
                                <button 
                                  onClick={() => handleQuickStatusUpdate(order.id, 'rejected')}
                                  title={i18n.language === 'ar' ? 'إلغاء الاشتراك' : 'Revoke'}
                                  disabled={isUpdating}
                                  style={{ background: 'transparent', color: '#e74c3c', border: '1px solid rgba(231, 76, 60, 0.5)', padding: '0.5rem 0.5rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', fontSize: '0.85rem', width: '115px', textAlign: 'center', transition: 'all 0.2s' }}
                                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(231, 76, 60, 0.1)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                  <X size={14} style={{ flexShrink: 0 }} /> <span>{i18n.language === 'ar' ? 'إلغاء' : 'Revoke'}</span>
                                </button>
                              </>
                            )}

                            {order.status === 'rejected' && (
                              <button 
                                onClick={() => handleQuickStatusUpdate(order.id, 'active')}
                                title="Restore"
                                disabled={isUpdating}
                                style={{ background: 'transparent', color: '#2ecc71', border: '1px solid rgba(46, 204, 113, 0.5)', padding: '0.5rem 0.5rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', fontSize: '0.85rem', width: '115px', textAlign: 'center', transition: 'all 0.2s' }}
                                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(46, 204, 113, 0.1)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                              >
                                <Check size={14} style={{ flexShrink: 0 }} /> <span>{i18n.language === 'ar' ? 'استرجاع' : 'Restore'}</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {selectedOrder && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', 
          justifyContent: 'center', alignItems: 'center', padding: '1rem'
        }}>
          <div style={{
            background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px',
            width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto',
            padding: '2rem', position: 'relative'
          }}>
            <button 
              onClick={closeOrder}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>
            
            <h2 style={{ marginBottom: '1.5rem', color: '#f5a623', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
              {i18n.language === 'ar' ? 'تفاصيل الطلب' : 'Order Details'}
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ fontSize: '0.85rem', color: '#888', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Customer Info</h3>
                <p style={{ marginBottom: '0.5rem', wordBreak: 'break-word' }}><strong>Name:</strong> <br/>{selectedOrder.name}</p>
                <p style={{ marginBottom: '0.5rem', wordBreak: 'break-word' }}><strong>Email:</strong> <br/>{selectedOrder.userEmail}</p>
                <p style={{ marginBottom: '0.5rem', wordBreak: 'break-word' }}><strong>Phone:</strong> <br/>{selectedOrder.phone}</p>
                <p style={{ marginBottom: '0.5rem', wordBreak: 'break-word' }}><strong>Date:</strong> <br/>{new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ fontSize: '0.85rem', color: '#888', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Payment Info</h3>
                <p style={{ marginBottom: '0.5rem', wordBreak: 'break-word' }}><strong>Plan:</strong> <br/>{selectedOrder.planTitle} ({selectedOrder.duration})</p>
                <p style={{ marginBottom: '0.5rem', wordBreak: 'break-word' }}><strong>Amount:</strong> <br/>{selectedOrder.price} {selectedOrder.currency}</p>
                <p style={{ marginBottom: '0.5rem', wordBreak: 'break-word' }}><strong>Method:</strong> <br/><span style={{ textTransform: 'capitalize' }}>{selectedOrder.paymentMethod?.replace('_', ' ')}</span></p>
                <p style={{ marginBottom: '0.5rem', wordBreak: 'break-word' }}><strong>Sender No:</strong> <br/><span style={{ color: '#f5a623', fontWeight: 'bold' }}>{selectedOrder.senderNumber}</span></p>
              </div>
            </div>

            {selectedOrder.receiptPhoto && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1rem', color: '#888', marginBottom: '1rem' }}>Payment Receipt</h3>
                <a href={selectedOrder.receiptPhoto} target="_blank" rel="noreferrer">
                  <img src={selectedOrder.receiptPhoto} alt="Receipt" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '4px', border: '1px solid #333', cursor: 'pointer' }} />
                </a>
              </div>
            )}

            <div style={{ background: '#222', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #333' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={18} /> {i18n.language === 'ar' ? 'تسليم الخطة التدريبية للعميل' : 'Deliver Plan to Customer'}
              </h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa' }}>
                  <LinkIcon size={14} /> {i18n.language === 'ar' ? 'رابط ملف درايف / PDF' : 'Google Drive / PDF Link'}
                </label>
                <input 
                  type="url" 
                  value={planLink} 
                  onChange={(e) => setPlanLink(e.target.value)} 
                  placeholder="https://drive.google.com/..."
                  style={{ width: '100%', padding: '0.8rem', background: '#111', border: '1px solid #444', color: '#fff', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa' }}>
                  <MessageSquare size={14} /> {i18n.language === 'ar' ? 'ملاحظات الكابتن (تظهر للعميل)' : 'Coach Notes (Visible to customer)'}
                </label>
                <textarea 
                  value={coachNotes} 
                  onChange={(e) => setCoachNotes(e.target.value)} 
                  placeholder={i18n.language === 'ar' ? "أهلاً بيك يا بطل، ده نظامك التدريبي..." : "Welcome champion! Here is your plan..."}
                  rows="4"
                  style={{ width: '100%', padding: '0.8rem', background: '#111', border: '1px solid #444', color: '#fff', borderRadius: '4px', resize: 'vertical' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => handleUpdateStatus('rejected')}
                disabled={isUpdating}
                style={{ padding: '0.8rem 1.5rem', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <X size={18} /> {i18n.language === 'ar' ? 'رفض الطلب' : 'Reject'}
              </button>
              
              <button 
                onClick={() => handleUpdateStatus('active')}
                disabled={isUpdating}
                style={{ padding: '0.8rem 1.5rem', background: '#2ecc71', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}
              >
                <Check size={18} /> {i18n.language === 'ar' ? 'تأكيد الدفع وتسليم الخطة' : 'Approve & Deliver'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
