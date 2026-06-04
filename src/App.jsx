import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeContext } from './ThemeContext';
import { useTranslation } from 'react-i18next';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import PackagesPage from './pages/PackagesPage';
import ChampionsPage from './pages/ChampionsPage';
import FAQPage from './pages/FAQPage';
import PaymentPage from './pages/PaymentPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';

import { MessageCircle } from 'lucide-react';

function App() {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();

  return (
    <div className={`app-container ${theme}`}>
      <Navbar />
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/champions" element={<ChampionsPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>

      <Footer />
      
      {/* Fixed WhatsApp Button */}
      <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
        <MessageCircle size={28} />
      </a>
    </div>
  );
}

export default App;
