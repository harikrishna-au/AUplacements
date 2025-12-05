import { createContext, useContext, useEffect, useState } from 'react';
// import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';
// import { attachClerkAuth } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Mock User State
  const [user, setUser] = useState({
    id: '319123456789',
    email: 'test.student@andhrauniversity.edu.in',
    name: 'Test Student',
    registerNumber: '319123456789',
  });
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    console.log('Mock Logout');
    // In no-auth mode, we might not want to actually clear the user, 
    // or we could set it to null and provide a "Login" button that just resets it.
    // For now, let's just alert.
    alert('Logout disabled in No-Auth mode');
  };

  const getToken = async () => 'mock-token';

  const value = {
    user,
    loading,
    isAuthenticated: true,
    logout,
    getToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
