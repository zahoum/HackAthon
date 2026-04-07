import React, { createContext, useState, useContext, useEffect } from 'react';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation de chargement - à remplacer par ton API plus tard
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        // Simuler un utilisateur connecté
        setUser({ name: 'Test User', email: 'test@example.com' });
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (email, password) => {
    // Simulation - à remplacer par ton API
    setLoading(true);
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      const user = { name: 'Test User', email, id: 1 };
      localStorage.setItem('token', 'fake-token');
      setUser(user);
      setLoading(false);
      return user;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const register = async (userData) => {
    // Simulation - à remplacer par ton API
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const user = { name: userData.name, email: userData.email, id: 1 };
      localStorage.setItem('token', 'fake-token');
      setUser(user);
      setLoading(false);
      return user;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};