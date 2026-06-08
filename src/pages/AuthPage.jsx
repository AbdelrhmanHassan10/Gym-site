import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Eye, EyeOff } from 'lucide-react';
import { AuthContext } from '../AuthContext';
import './AuthPage.css';

const AuthPage = () => {
  const { t } = useTranslation();
  const { updateLocalUser } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  // We removed the getRedirectResult useEffect as we will use signInWithPopup instead
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
        const user = userCredential.user;
        
        // Update user profile with name
        await updateProfile(user, {
          displayName: formData.name
        });

        // Save user to Firestore Database
        try {
          await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            name: formData.name,
            email: formData.email,
            phone: formData.phone || '',
            role: 'user',
            createdAt: new Date().toISOString()
          });
        } catch (dbError) {
          console.error("Firestore error on signup:", dbError);
        }
        
        // Sign out and navigate to login so the user can log in with their new credentials
        await auth.signOut();
        navigate('/login');
      }
    } catch (err) {
      console.error(err);
      let errorMessage = 'An error occurred. Please try again.';
      
      switch (err.code) {
        case 'auth/configuration-not-found':
          errorMessage = 'Authentication is not set up on the server. Please wait or contact support.';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered. Try logging in.';
          break;
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          errorMessage = 'Invalid email or password.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address format.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your internet connection.';
          break;
        default:
          errorMessage = err.message.replace('Firebase: ', '');
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle redirect result (for iOS Safari where popup is blocked)
  useEffect(() => {
    getRedirectResult(auth)
      .then(async (result) => {
        if (result && result.user) {
          const redirectUser = result.user;
          const userDocRef = doc(db, "users", redirectUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (!userDoc.exists()) {
            await setDoc(userDocRef, {
              uid: redirectUser.uid,
              name: redirectUser.displayName || 'Google User',
              email: redirectUser.email,
              phone: redirectUser.phoneNumber || '',
              role: 'user',
              createdAt: new Date().toISOString()
            });
          }
          navigate('/');
        }
      })
      .catch((err) => {
        console.error("Redirect result error:", err);
      });
  }, []);

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      
      // Try popup first
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
          await setDoc(userDocRef, {
            uid: user.uid,
            name: user.displayName || 'Google User',
            email: user.email,
            phone: user.phoneNumber || '',
            role: 'user',
            createdAt: new Date().toISOString()
          });
        }
        navigate('/');
      } catch (popupError) {
        // If popup is blocked (common on iOS Safari), fall back to redirect
        if (
          popupError.code === 'auth/popup-blocked' || 
          popupError.code === 'auth/popup-closed-by-user' ||
          popupError.code === 'auth/cancelled-popup-request' ||
          popupError.code === 'auth/internal-error'
        ) {
          console.log('Popup blocked, using redirect...');
          await signInWithRedirect(auth, provider);
          // Page will reload after redirect
          return;
        }
        throw popupError;
      }
    } catch (err) {
      console.error("Google Auth Error:", err);
      var errMsg = '';
      if (err && err.message) {
        errMsg = err.message.replace('Firebase: ', '');
      } else {
        errMsg = 'Google sign-in failed. Please try again.';
      }
      setError(errMsg);
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{isLogin ? t('auth.welcomeBack') : t('auth.joinTeam')}</h2>
          <p>{isLogin ? t('auth.loginSubtitle') : t('auth.registerSubtitle')}</p>
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
                  <label>{t('auth.fullName')}</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Ahmed Ragab" required={!isLogin} />
                </div>
              )}
              
              <div className="form-group">
                <label>{t('auth.email')}</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="coach@example.com" required />
              </div>

              {!isLogin && (
                <div className="form-group">
                  <label>{t('auth.phone')}</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+20 123 456 7890" />
                </div>
              )}

              <div className="form-group">
                <label>{t('auth.password')}</label>
                <div className="password-input-wrapper">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    placeholder="••••••••" 
                    required 
                  />
                  <button 
                    type="button" 
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="form-group">
                  <label>{t('auth.confirmPassword')}</label>
                  <div className="password-input-wrapper">
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      name="confirmPassword" 
                      value={formData.confirmPassword} 
                      onChange={handleChange} 
                      placeholder="••••••••" 
                      required={!isLogin} 
                    />
                    <button 
                      type="button" 
                      className="password-toggle-btn"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      tabIndex="-1"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              )}

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? "..." : (isLogin ? t('auth.loginBtn') : t('auth.registerBtn'))}
              </button>

              <div className="auth-divider">
                <span>{t('auth.orContinue')}</span>
              </div>
              
              <button 
                type="button" 
                className="google-sign-in-btn" 
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <svg className="google-icon" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </button>
            </form>
          </motion.div>
        </AnimatePresence>

        <p className="auth-toggle">
          {isLogin ? t('auth.noAccount') : t('auth.haveAccount')}
          <span onClick={() => {
            setIsLogin(!isLogin);
            setError('');
            setFormData({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
          }}>
            {isLogin ? t('auth.registerLink') : t('auth.loginLink')}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
