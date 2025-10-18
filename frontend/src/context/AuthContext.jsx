import { createContext, useContext, useEffect, useState } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';
import { attachClerkAuth } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const { user: clerkUser, isLoaded: clerkLoaded, isSignedIn } = useUser();
  const { getToken, signOut } = useClerkAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (clerkLoaded) {
      if (getToken) {
        attachClerkAuth(getToken);
      }
      
      if (isSignedIn && clerkUser) {
        setUser({
          id: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress,
          name: clerkUser.fullName || clerkUser.firstName,
          registerNumber: clerkUser.publicMetadata?.registerNumber || '',
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    }
  }, [clerkUser, isSignedIn, clerkLoaded, getToken]);

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear user state even if signOut fails
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: isSignedIn,
    logout,
    getToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
