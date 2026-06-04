import React, { useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../ThemeContext';
import { Dumbbell, Globe, Moon, Sun, Menu, X, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthContext } from '../AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme, lang, toggleLang } = useContext(ThemeContext);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const threshold = window.location.pathname === '/' ? window.innerHeight * 0.85 : 50;
      setScrolled(window.scrollY > threshold);
    };
    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navLinks = [
    { name: t('nav.home') || 'Home', path: '/' },
    { name: t('nav.about') || 'About', path: '/about' },
    { name: t('packages.title') || 'Coaching Packages', path: '/packages' },
    { name: t('champions.title') || 'Our Champions', path: '/champions' },
    { name: t('faq.title') || 'FAQ', path: '/faq' },
  ];

  return (
    <>
      <nav className={`global-nav ${scrolled ? 'scrolled' : ''} ${location.pathname === '/' ? 'is-home' : ''}`}>
        <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
          <div className="logo-icon">
            <Dumbbell size={28} color="#ecb613" />
          </div>
          <div className="logo-text">
            <span>AHMED</span>
            <span>RAGAB</span>
          </div>
        </Link>
        <div className="nav-right">
          {!user ? (
            <div className="auth-buttons-desktop">
              <button className="btn-text" onClick={() => navigate('/login')}>{t('auth.loginBtn')}</button>
              <button className="btn-primary-small" onClick={() => navigate('/register')}>{t('auth.registerBtn')}</button>
            </div>
          ) : (
            <div className="auth-buttons-desktop">
              <button className="btn-icon header-action-btn" onClick={() => navigate('/profile')} title="Profile">
                <User size={20} />
              </button>
            </div>
          )}
          <button onClick={toggleLang} className="btn-icon header-action-btn">
            <Globe size={20} />
          </button>
          <button onClick={toggleTheme} className="btn-icon header-action-btn">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button className="menu-btn header-action-btn" onClick={() => setMenuOpen(true)}>
            <Menu size={32} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            className="full-screen-menu"
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <div className="menu-header">
              <button className="btn-icon close-btn" onClick={() => setMenuOpen(false)}>
                <X size={36} />
              </button>
            </div>
            <div className="menu-links">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + (idx * 0.1) }}
                >
                  <Link to={link.path} className={`menu-link ${location.pathname === link.path ? 'active' : ''}`}>
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              
              {!user ? (
                <>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                    <Link to="/login" className="menu-link" style={{ color: 'var(--accent-gold)' }}>{t('auth.loginBtn')}</Link>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
                    <Link to="/register" className="menu-link" style={{ color: 'var(--accent-gold)' }}>{t('auth.registerBtn')}</Link>
                  </motion.div>
                </>
              ) : (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                  <Link to="/profile" className="menu-link" style={{ color: 'var(--accent-gold)' }}>{t('profile.dashboard')}</Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
