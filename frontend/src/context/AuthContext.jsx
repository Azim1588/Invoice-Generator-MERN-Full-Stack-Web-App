import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, businessProfileAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [businessProfile, setBusinessProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      try {
        const response = await authAPI.getProfile();
        setUser(response.data.data);
        await fetchBusinessProfile();
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setBusinessProfile(null);
      }
    }
    setLoading(false);
  };

  const fetchBusinessProfile = async () => {
    try {
      const response = await businessProfileAPI.get();
      setBusinessProfile(response.data.data);
    } catch (err) {
      setBusinessProfile(null);
    }
  };

  const refreshBusinessProfile = fetchBusinessProfile;

  const login = async (email, password) => {
    try {
      setError(null);
      console.log('🔑 AuthContext: Starting login process');
      const response = await authAPI.login({ email, password });
      const { user, token } = response.data.data;
      console.log('🔑 AuthContext: Login API response received', { user: user.name, token: token.substring(0, 20) + '...' });
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      console.log('🔑 AuthContext: User state updated, fetching business profile');
      await fetchBusinessProfile();
      console.log('🔑 AuthContext: Login process completed successfully');
      return { success: true };
    } catch (err) {
      console.log('🔑 AuthContext: Login failed', err.response?.data?.error || err.message);
      const errorMessage = err.response?.data?.error || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await authAPI.register(userData);
      const { user, token } = response.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      await fetchBusinessProfile();
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = (redirectCallback) => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setBusinessProfile(null);
    setError(null);
    if (redirectCallback && typeof redirectCallback === 'function') {
      redirectCallback();
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const response = await authAPI.updateProfile(profileData);
      const updatedUser = response.data.data;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Profile update failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      await authAPI.changePassword({ currentPassword, newPassword });
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Password change failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    user,
    businessProfile,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshBusinessProfile,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 