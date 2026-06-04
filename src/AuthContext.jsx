import React, { createContext, useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const name = currentUser.displayName || 'Member';
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          name: name,
          phone: currentUser.phoneNumber || '',
          avatarUrl: currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f5a623&color=fff&bold=true`
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

  const updateLocalUser = (updates) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0a0a0a', color: '#fff' }}>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, logout, updateLocalUser }}>
      {children}
    </AuthContext.Provider>
  );
};


