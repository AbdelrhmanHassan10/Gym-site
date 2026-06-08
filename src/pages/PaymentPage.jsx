import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ShieldCheck, ArrowLeft, Lock, Award } from 'lucide-react';
import { AuthContext } from '../AuthContext';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import './PaymentPage.css';

const PaymentPage = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const plan = location.state?.plan;

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if we came back from Stripe success
    const query = new URLSearchParams(location.search);
    if (query.get('success')) {
      setSuccess(true);
      return;
    }

    if (!user) {
      navigate('/login');
      return;
    }

    if (!plan && !success) {
      navigate('/packages');
    }
  }, [plan, navigate, location, user]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    paymentMethod: 'vodafone_cash',
    address: '',
    city: '',
    state: '',
    senderNumber: '',
    receiptPhoto: null
  });
  
  // Early return if not logged in or missing plan (prevents flash of content before redirect)
  if (!user || (!plan && !success)) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, receiptPhoto: e.target.files[0] });
    }
  };

  // Function to compress image and convert to base64
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith('image/')) {
        return reject(new Error('Selected file is not an image'));
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 800;
            const MAX_HEIGHT = 800;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            // Compress to JPEG with 0.6 quality to ensure it's small enough for Firestore
            const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
            resolve(dataUrl);
          } catch (e) {
            reject(e);
          }
        };
        img.onerror = (error) => {
          console.error("Image load error", error);
          reject(new Error('Failed to load image for compression'));
        };
        img.src = event.target.result;
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Starting submission...");
      
      let receiptUrl = '';
      if (formData.receiptPhoto) {
        console.log("Compressing image...");
        receiptUrl = await compressImage(formData.receiptPhoto);
        console.log("Image compressed successfully");
      }
      
      console.log("Saving to Firestore...");
      const subData = {
        userEmail: user.email.toLowerCase(),
        ...formData,
        receiptPhoto: receiptUrl,
        planTitle: plan.title,
        duration: plan.duration,
        price: plan.price,
        currency: plan.currency || 'EGP',
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'subscriptions'), subData);
      setSuccess(true);
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="payment-page-container success-view">
        <motion.div 
          className="success-card"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <CheckCircle size={64} color="#f5a623" style={{ margin: '0 auto', marginBottom: '1rem' }} />
          <h2>PAYMENT PENDING!</h2>
          <p>We have received your request. Our team will contact you shortly to verify your payment.</p>
          
          <div className="pending-details">
            <p><span>{t('auth.fullName')}:</span> <strong>{formData.name || 'AHMED RAGAB'}</strong></p>
            <p><span>{t('auth.phone')}:</span> <strong>{formData.phone || '+20 123 456 7890'}</strong></p>
            <p><span>{t('payment.package')}:</span> <strong>{plan?.title || 'Gym Plan'}</strong></p>
            <p><span>{t('payment.methodPay')}:</span> <strong style={{ textTransform: 'capitalize' }}>{formData.paymentMethod.replace('_', ' ')}</strong></p>
            <p><span>{t('admin.senderNo')}:</span> <strong>{formData.senderNumber || 'N/A'}</strong></p>
            <p><span>{t('payment.amountPay')}:</span> <strong>{plan?.price || '0'} {plan?.currency || 'EGP'}</strong></p>
          </div>

          <div style={{ padding: '0.8rem', background: 'rgba(245, 166, 35, 0.1)', border: '1px solid #f5a623', borderRadius: '4px', marginBottom: '1rem', color: '#f5a623', fontSize: '0.9rem', lineHeight: '1.4' }}>
            {t('payment.reminder')}
          </div>

          <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/')}>{t('payment.returnHome')}</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="payment-page-container">
      <div className="payment-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} /> {t('payment.back')}
        </button>
        <h1>{t('payment.secureCheckout')}</h1>
      </div>

      <div className="payment-content">
        <motion.div 
          className="order-summary"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3>{t('payment.orderSummary')}</h3>
          <div className="summary-card">
            <div className="plan-details">
              <h4>{plan.title}</h4>
              <span className="plan-duration">{plan.duration}</span>
            </div>
            <div className="plan-price-large">
              {plan.price} <span>{plan.currency || 'EGP'}</span>
            </div>
            
            <ul className="summary-features">
              {plan.features?.map((f, i) => (
                <li key={i}><CheckCircle size={16} /> {f}</li>
              ))}
            </ul>
            
            <div className="price-breakdown">
              <div className="breakdown-row">
                <span>{t('payment.subtotal')}</span>
                <span>{plan.price} {plan.currency || 'EGP'}</span>
              </div>
              <div className="breakdown-row">
                <span>{t('payment.fee')}</span>
                <span className="free-fee"><del>99.00 {plan.currency || 'EGP'}</del> <strong>{t('payment.free')}</strong></span>
              </div>
              <div className="breakdown-row">
                <span>{t('payment.taxes')}</span>
                <span>0.00 {plan.currency || 'EGP'}</span>
              </div>
              <div className="breakdown-total">
                <span>{t('payment.total')}</span>
                <span className="total-highlight">{plan.price} {plan.currency || 'EGP'}</span>
              </div>
            </div>

            <div className="testimonial-card">
              <p>{t('payment.testimonial')}</p>
              <span>{t('payment.testimonialAuthor')}</span>
            </div>
          </div>
          
          <div className="trust-badges">
            <div className="trust-badge">
              <ShieldCheck size={32} />
              <span>{t('payment.ssl')}</span>
            </div>
            <div className="trust-badge">
              <Lock size={32} />
              <span>{t('payment.encrypted')}</span>
            </div>
            <div className="trust-badge">
              <Award size={32} />
              <span>{t('payment.premium')}</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="payment-form-section"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <form onSubmit={handleSubmit} className="payment-form">
            <h3>{t('payment.billingDetails')}</h3>
            
            <div className="form-group">
              <label>{t('auth.fullName')}</label>
              <input type="text" name="name" required onChange={handleChange} placeholder="AHMED RAGAB" />
            </div>
            
            <div className="form-group">
              <label>{t('auth.email')}</label>
              <input type="email" name="email" required onChange={handleChange} placeholder="Ahmedragab1@example.com" />
            </div>

            <div className="form-group">
              <label>{t('auth.phone')}</label>
              <input type="tel" name="phone" required onChange={handleChange} placeholder="+20 123 456 7890" />
            </div>

            <h3 className="payment-method-title">{t('payment.paymentMethod')}</h3>
            <div className="form-group">
              <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="payment-select">
                <option value="vodafone_cash">Vodafone Cash</option>
                <option value="fawry">Fawry</option>
                <option value="instapay">InstaPay</option>
              </select>
            </div>

            {formData.paymentMethod !== 'instapay' && (
              <>
                <h3 className="payment-method-title">{t('payment.transferDetails')}</h3>
                <div className="form-group">
                  <label>{t('payment.senderLabel')}</label>
                  <input type="tel" name="senderNumber" required onChange={handleChange} placeholder="010xxxxxxxx" />
                </div>
              </>
            )}

            <h3 className="payment-method-title">Payment Receipt</h3>
            <div className="form-group">
              <div style={{ padding: '0.8rem', background: 'rgba(245, 166, 35, 0.1)', border: '1px solid #f5a623', borderRadius: '4px', marginBottom: '1rem', color: '#f5a623', fontSize: '0.9rem', lineHeight: '1.4' }}>
                {t('payment.importantNote')} {formData.paymentMethod === 'instapay' ? 'InstaPay' : formData.paymentMethod === 'vodafone_cash' ? 'Vodafone Cash' : 'Fawry'}{t('payment.importantNote2')}
              </div>
              <label>{t('payment.receiptLabel')}</label>
              <input type="file" name="receiptPhoto" required onChange={handleFileChange} accept="image/*" className="file-input" />
            </div>

            <div className="payment-total">
              <span>{t('payment.totalPay')}</span>
              <strong>{plan.price} {plan.currency || 'EGP'}</strong>
            </div>

            <button type="submit" className="btn-primary pay-button" disabled={loading}>
              {loading ? t('payment.processing') : t('payment.submitReview')}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentPage;
