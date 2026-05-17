import { createContext, useState, useContext, useEffect } from 'react';
import { authApi } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authApi.login(email, password);
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);
      toast.success('Successfully logged in!');
      return true;
    } catch (error) {
      toast.error(error.message || 'Login failed');
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      await authApi.register(name, email, password);
      toast.success('Registration successful! Please check your email to verify your account.');
      return true;
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      return false;
    }
  };

  const forgotPassword = async (email) => {
    try {
      await authApi.forgotPassword(email);
      toast.success('Password reset link sent to your email');
      return true;
    } catch (error) {
      toast.error(error.message || 'Failed to send reset link');
      return false;
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      await authApi.resetPassword(token, newPassword);
      toast.success('Password has been reset successfully');
      return true;
    } catch (error) {
      toast.error(error.message || 'Failed to reset password');
      return false;
    }
  };

  const verifyEmail = async (token) => {
    try {
      await authApi.verifyEmail(token);
      toast.success('Email verified successfully! You can now log in.');
      return true;
    } catch (error) {
      toast.error(error.message || 'Email verification failed');
      return false;
    }
  };

  const resendVerification = async (email) => {
    try {
      await authApi.resendVerification(email);
      toast.success('Verification email sent! Please check your inbox.');
      return true;
    } catch (error) {
      toast.error(error.message || 'Failed to resend verification email');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
    logout
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
