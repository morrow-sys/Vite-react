import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const CategoriesContext = createContext();

export const CategoriesProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/categories');
      setCategories(res.data);
    } catch (err) {
      setError('Ошибка при загрузке категорий');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (name) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/categories', { name });
      await fetchCategories();
      return res.data;
    } catch (err) {
      setError('Ошибка при создании категории');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id, name) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.put(`/api/categories/${id}`, { name });
      await fetchCategories();
      return res.data;
    } catch (err) {
      setError('Ошибка при обновлении категории');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/api/categories/${id}`);
      await fetchCategories();
      return true;
    } catch (err) {
      setError('Ошибка при удалении категории');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        selectedCategory,
        setSelectedCategory,
        fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory,
        loading,
        error,
        setError,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};
