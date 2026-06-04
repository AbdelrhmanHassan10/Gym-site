import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import './AuthPage.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (location.pathname === '/register') {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        // Login
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        navigate('/');
      } else {
        // Register
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        
        // Update user profile with name
        await updateProfile(userCredential.user, {
          displayName: formData.name
        });
        
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{isLogin ? 'Welcome Back' : 'Join the Team'}</h2>
          <p>{isLogin ? 'Login to access your coaching portal' : 'Create an account to start your journey'}</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? 'login' : 'register'}
            initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
            transition={{ duration: 0.3 }}
          >
            <form className="auth-form" onSubmit={handleSubmit}>
              {error && <div className="auth-error" style={{ color: '#ff4d4d', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
              {!isLogin && (
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" required={!isLogin} />
                </div>
              )}
              
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="ahmed@example.com" required />
              </div>

              {!isLogin && (
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+20 123 456 7890" required={!isLogin} />
                </div>
              )}

              <div className="form-group">
                <label>Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required />
              </div>

              {!isLogin && (
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" required={!isLogin} />
                </div>
              )}

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
              </button>
            </form>
          </motion.div>
        </AnimatePresence>

        <div className="auth-toggle">
          {isLogin ? (
            <p>Don't have an account? <span onClick={() => navigate('/register')}>Register</span></p>
          ) : (
            <p>Already have an account? <span onClick={() => navigate('/login')}>Login</span></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
