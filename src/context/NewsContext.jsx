import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const NewsContext = createContext();
export const useNews = () => useContext(NewsContext);

// Используем Vite переменную окружения
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const NewsProvider = ({ children }) => {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/news`);
      setNewsItems(res.data);
    } catch (err) {
      console.error('Fetch news error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addNews = async (form, file) => {
    try {
      const formData = new FormData();
      formData.append('title', JSON.stringify(form.title));
      formData.append('description', JSON.stringify(form.description));
      formData.append('date', form.date);
      if (file) formData.append('image', file);

      const res = await axios.post(`${BASE_URL}/api/news`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setNewsItems((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error('Add news error:', err);
    }
  };

  const updateNews = async (id, form, file) => {
    try {
      const formData = new FormData();
      formData.append('title', JSON.stringify(form.title));
      formData.append('description', JSON.stringify(form.description));
      formData.append('date', form.date);
      if (file) formData.append('image', file);

      const res = await axios.put(`${BASE_URL}/api/news/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setNewsItems((prev) =>
        prev.map((item) => (item.id === id ? res.data : item))
      );
    } catch (err) {
      console.error('Update news error:', err);
    }
  };

  const deleteNews = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/news/${id}`);
      setNewsItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Delete news error:', err);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <NewsContext.Provider
      value={{ newsItems, loading, fetchNews, addNews, updateNews, deleteNews }}
    >
      {children}
    </NewsContext.Provider>
  );
};
