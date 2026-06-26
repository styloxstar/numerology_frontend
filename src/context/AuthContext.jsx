import { createContext, useState, useEffect } from 'react';
import * as api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [email, setEmail] = useState(localStorage.getItem('email'));
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    if (token && email) {
      localStorage.setItem('token', token);
      localStorage.setItem('email', email);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('email');
    }
  }, [token, email]);

  const login = async (e, p) => {
    const data = await api.login(e, p);
    setToken(data.token);
    setEmail(data.email);
    setIsGuest(false);
  };

  const register = async (e, p) => {
    const data = await api.register(e, p);
    setToken(data.token);
    setEmail(data.email);
    setIsGuest(false);
  };

  const loginAsGuest = () => {
    setToken(null);
    setEmail(null);
    setIsGuest(true);
  };

  const logout = () => {
    setToken(null);
    setEmail(null);
    setIsGuest(false);
  };

  return (
    <AuthContext.Provider value={{ token, email, isGuest, isAuthenticated: !!token, login, register, loginAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
