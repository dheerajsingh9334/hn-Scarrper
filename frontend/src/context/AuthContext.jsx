import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setUser(data);
      } catch (error) {
        // If 401 or network error, it means no valid cookie
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (username, password) => {
    await api.post('/auth/login', { username, password });
    const userRes = await api.get('/auth/me');
    setUser(userRes.data);
  };

  const register = async (username, password) => {
    await api.post('/auth/register', { username, password });
    const userRes = await api.get('/auth/me');
    setUser(userRes.data);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed', error);
    }
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
