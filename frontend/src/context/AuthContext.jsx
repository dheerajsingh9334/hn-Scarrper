import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await api.get('/auth/me');
          setUser(data);
        } catch (error) {
          console.error('Failed to fetch user', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (username, password) => {
    const { data } = await api.post('/auth/login', { username, password });
    localStorage.setItem('token', data.token);
    const userRes = await api.get('/auth/me');
    setUser(userRes.data);
  };

  const register = async (username, password) => {
    const { data } = await api.post('/auth/register', { username, password });
    localStorage.setItem('token', data.token);
    const userRes = await api.get('/auth/me');
    setUser(userRes.data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const toggleBookmarkContext = (storyId) => {
    if (!user) return;
    const isBookmarked = user.bookmarks.some(b => b._id === storyId || b === storyId);
    let updatedBookmarks;
    if (isBookmarked) {
      updatedBookmarks = user.bookmarks.filter(b => b._id !== storyId && b !== storyId);
    } else {
      updatedBookmarks = [...user.bookmarks, storyId];
    }
    setUser({ ...user, bookmarks: updatedBookmarks });
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, toggleBookmarkContext }}>
      {children}
    </AuthContext.Provider>
  );
};
