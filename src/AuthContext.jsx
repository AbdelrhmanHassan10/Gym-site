import React, { createContext, useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged, signOut, browserLocalPersistence, setPersistence } from 'firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set persistence to LOCAL to ensure it works on iOS Safari
    // iOS Safari may block session/cookie-based persistence
    setPersistence(auth, browserLocalPersistence)
      .catch((err) => {
        console.warn('Auth persistence warning:', err);
      });

    // Listen to Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // We can attach custom properties if needed
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          name: currentUser.displayName || 'Current User',
          phone: currentUser.phoneNumber || '',
          avatarUrl: currentUser.photoURL || ('https://ui-avatars.com/api/?name=' + encodeURIComponent(currentUser.displayName || currentUser.email || 'User') + '&background=f5a623&color=fff&bold=true')
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-color, #0a0a0a)', color: 'var(--text-color, #fff)' }}>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
