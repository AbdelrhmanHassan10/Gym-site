import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import './AuthPage.css';

const AuthPage = () => {
  const { login } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Use the entered email, fallback name/phone if login mode
    const mockUser = {
      name: formData.name || 'Current User',
      email: formData.email,
      phone: formData.phone || '',
      avatarUrl: 'https://i.pravatar.cc/150?img=11'
    };
    
    login(mockUser);
    
    // Redirect to home upon login
    setTimeout(() => {
      navigate('/');
    }, 500);
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
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" required />
              </div>
              {!isLogin && (
                <></>  
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

              <button type="submit" className="auth-submit-btn">
                {isLogin ? 'Login' : 'Create Account'}
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
