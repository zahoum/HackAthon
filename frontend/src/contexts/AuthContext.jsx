// AuthContext.jsx - Complete working version
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on app start
  useEffect(() => {
  const loadUser = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      console.log('Loading user from localStorage:', storedUser);
      
      if (storedUser && storedUser !== 'undefined') {
        const userData = JSON.parse(storedUser);
        console.log('Parsed user data:', userData);
        
        // Handle both _id and id field names
        const userId = userData._id || userData.id;
        
        if (userId) {
          // Create a normalized user object
          const normalizedUser = {
            _id: userId,
            id: userId,
            name: userData.name,
            mail: userData.mail || userData.email,
            email: userData.mail || userData.email
          };
          
          console.log('Normalized user:', normalizedUser);
          setUser(normalizedUser);
          
          // Update localStorage with normalized format
          localStorage.setItem('user', JSON.stringify(normalizedUser));
        } else {
          console.error('Invalid user data - missing ID');
          localStorage.removeItem('user');
        }
      }
    } catch (error) {
      console.error('Error loading user:', error);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };
  
  loadUser();
}, []);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Attempting login with:', { mail: email });
      
      const response = await api.post('/login', {
        mail: email,
        password: password
      });
      
      console.log('Login response:', response.data);
      
      if (response.data.user && response.data.user._id) {
        // Create user object with proper ID
        const userData = {
          _id: response.data.user._id.toString(),
          name: response.data.user.name,
          mail: response.data.user.mail,
          email: response.data.user.mail
        };
        
        console.log('Setting user data:', userData);
        
        // Store in state and localStorage
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', response.data.token || 'authenticated');
        
        setLoading(false);
        return { success: true, user: userData };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  // Register function
  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Attempting registration:', { name, mail: email });
      
      const response = await api.post('/signup', {
        name: name,
        mail: email,
        password: password
      });
      
      console.log('Register response:', response.data);
      
      if (response.data.user && response.data.user._id) {
        // Create user object with proper ID
        const userData = {
          _id: response.data.user._id.toString(),
          name: response.data.user.name,
          mail: response.data.user.mail,
          email: response.data.user.mail
        };
        
        console.log('Setting user data after registration:', userData);
        
        // Store in state and localStorage
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', response.data.token || 'registered');
        
        setLoading(false);
        return { success: true, user: userData };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    console.log('Logging out, clearing user data');
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Update user function (for profile updates)
  const updateUser = (updatedUser) => {
    console.log('Updating user:', updatedUser);
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    clearError,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};