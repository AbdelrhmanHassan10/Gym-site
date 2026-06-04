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
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const plan = location.state?.plan;

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
    paymentMethod: 'card',
    address: '',
    city: '',
    state: '',
    senderNumber: '',
    receiptPhoto: null
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
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
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.paymentMethod === 'card') {
        // Warning: Secure Stripe Checkout usually requires a backend.
        // For a completely backend-less approach, you might want to use Stripe Payment Links instead.
        alert('Card payment integration requires a backend or Stripe Payment Links. Storing as pending request for now.');
      }
      
      let receiptUrl = '';
      if (formData.receiptPhoto) {
        // Compress and convert to base64 instead of Firebase Storage
        receiptUrl = await compressImage(formData.receiptPhoto);
      }
      
      const subData = {
        userEmail: user.email.toLowerCase(),
        ...formData,
        receiptPhoto: receiptUrl,
        planTitle: plan.title,
        duration: plan.duration,
        price: plan.price,
        currency: plan.currency || 'EGP',
        status: formData.paymentMethod === 'card' ? 'active' : 'pending',
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
            <p><span>Name:</span> <strong>{formData.name || 'AHMED RAGAB'}</strong></p>
            <p><span>Phone:</span> <strong>{formData.phone || '+20 123 456 7890'}</strong></p>
            <p><span>Package:</span> <strong>{plan?.title || 'Gym Plan'}</strong></p>
            <p><span>Method:</span> <strong style={{ textTransform: 'capitalize' }}>{formData.paymentMethod === 'card' ? 'Credit Card' : formData.paymentMethod}</strong></p>
            {formData.paymentMethod !== 'card' && (
              <p><span>Sender Number:</span> <strong>{formData.senderNumber || 'N/A'}</strong></p>
            )}
            <p><span>Amount:</span> <strong>{plan?.price || '0'} {plan?.currency || 'EGP'}</strong></p>
          </div>

          {formData.paymentMethod !== 'card' && (
            <div style={{ padding: '0.8rem', background: 'rgba(245, 166, 35, 0.1)', border: '1px solid #f5a623', borderRadius: '4px', marginBottom: '1rem', color: '#f5a623', fontSize: '0.9rem', lineHeight: '1.4' }}>
              <strong>⚠️ Reminder:</strong> Please ensure you have transferred the exact amount. Our team will review your uploaded screenshot and activate your account shortly.
            </div>
          )}

          <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/')}>Return Home</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="payment-page-container">
      <div className="payment-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} /> Back
        </button>
        <h1>Secure Checkout</h1>
      </div>

      <div className="payment-content">
        <motion.div 
          className="order-summary"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3>Order Summary</h3>
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
                <span>Subtotal</span>
                <span>{plan.price} {plan.currency || 'EGP'}</span>
              </div>
              <div className="breakdown-row">
                <span>Initiation Fee</span>
                <span className="free-fee"><del>99.00 {plan.currency || 'EGP'}</del> <strong>FREE</strong></span>
              </div>
              <div className="breakdown-row">
                <span>Taxes</span>
                <span>0.00 {plan.currency || 'EGP'}</span>
              </div>
              <div className="breakdown-total">
                <span>Total due today</span>
                <span className="total-highlight">{plan.price} {plan.currency || 'EGP'}</span>
              </div>
            </div>

            <div className="testimonial-card">
              <p>"The private coaching sessions here completely transformed my performance. Worth every penny."</p>
              <span>— Marcus V., Pro Athlete</span>
            </div>
          </div>
          
          <div className="trust-badges">
            <div className="trust-badge">
              <ShieldCheck size={32} />
              <span>SSL Secure</span>
            </div>
            <div className="trust-badge">
              <Lock size={32} />
              <span>Encrypted</span>
            </div>
            <div className="trust-badge">
              <Award size={32} />
              <span>Premium Care</span>
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
            <h3>Billing Details</h3>
            
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" required onChange={handleChange} placeholder="AHMED RAGAB" />
            </div>
            
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" required onChange={handleChange} placeholder="Ahmedragab1@example.com" />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" name="phone" required onChange={handleChange} placeholder="+20 123 456 7890" />
            </div>

            <h3 className="payment-method-title">Payment Method</h3>
            <div className="form-group">
              <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="payment-select">
                <option value="card">Credit / Debit Card</option>
                <option value="fawry">Fawry</option>
                <option value="instapay">InstaPay</option>
              </select>
            </div>

            {formData.paymentMethod === 'card' && (
              <>
                <h3 className="payment-method-title">3. Billing Address</h3>
                <div className="form-group">
                  <label>Street Address</label>
                  <input type="text" name="address" required onChange={handleChange} placeholder="123 Performance Way" />
                </div>
                
                <div className="billing-grid">
                  <div className="form-group">
                    <label>City</label>
                    <input type="text" name="city" required onChange={handleChange} placeholder="Cairo" />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input type="text" name="state" required onChange={handleChange} placeholder="Cairo Governorate" />
                  </div>
                </div>
              </>
            )}

            {formData.paymentMethod !== 'card' && (
              <>
                <h3 className="payment-method-title">3. Transfer Details</h3>
                <div className="form-group">
                  <label>Sender Mobile Number (The number you transferred from)</label>
                  <input type="tel" name="senderNumber" required onChange={handleChange} placeholder="010xxxxxxxx" />
                </div>

                <h3 className="payment-method-title">4. Payment Receipt</h3>
                <div className="form-group">
                  <div style={{ padding: '0.8rem', background: 'rgba(245, 166, 35, 0.1)', border: '1px solid #f5a623', borderRadius: '4px', marginBottom: '1rem', color: '#f5a623', fontSize: '0.9rem', lineHeight: '1.4' }}>
                    <strong>⚠️ Important Note:</strong> Please complete the transfer using {formData.paymentMethod === 'instapay' ? 'InstaPay' : 'Fawry'}, take a screenshot of the successful payment receipt, and upload it below to avoid any delays in your subscription.
                  </div>
                  <label>Upload screenshot/photo of the transfer receipt</label>
                  <input type="file" name="receiptPhoto" required onChange={handleFileChange} accept="image/*" className="file-input" />
                </div>
              </>
            )}

            <div className="payment-total">
              <span>Total to pay:</span>
              <strong>{plan.price} {plan.currency || 'EGP'}</strong>
            </div>

            <button type="submit" className="btn-primary pay-button" disabled={loading}>
              {loading ? 'Processing...' : formData.paymentMethod === 'card' ? `Pay with Card (${plan.price} ${plan.currency || 'EGP'})` : `Submit for Review`}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentPage;
