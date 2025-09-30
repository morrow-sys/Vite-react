  import React, { createContext, useEffect, useState, useContext } from 'react';
  import axios from 'axios';
  import { JournalsContext } from './JournalsContext';
  import { CategoriesContext } from './СategoriesContext';

  export const ArticlesContext = createContext();

  export const ArticlesProvider = ({ children }) => {
    const [articles, setArticles] = useState([]);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { journalList } = useContext(JournalsContext);
    const { categories } = useContext(CategoriesContext);

    // Используем import.meta.env для Vite
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    const API_URL = `${API_BASE_URL}/api/articles`;

    // Получить все статьи
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(API_URL);
        setArticles(res.data);
      } catch (err) {
        console.error('Ошибка при загрузке статей:', err);
        setError('Ошибка при загрузке статей');
      } finally {
        setLoading(false);
      }
    };

    // Создание статьи с PDF
    const createArticle = async (articleData, file) => {
      setLoading(true);
      setError(null);
      try {
        const formData = new FormData();

        const journalName = journalList.find(j => j.abbreviation === articleData.journalAbbr)?.name || '';
        formData.append('journalAbbr', articleData.journalAbbr);
        formData.append('journalName', journalName);

        Object.keys(articleData).forEach(key => {
          if (['journalAbbr', 'journalName', 'pdfFile'].includes(key)) return;
          formData.append(key, typeof articleData[key] === 'object' ? JSON.stringify(articleData[key]) : articleData[key]);
        });

        if (file) formData.append('pdfFile', file);

        const res = await axios.post(API_URL, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        setArticles(prev => [...prev, { ...res.data, pdfFileName: res.data.pdfFileName }]);
        return res.data;
      } catch (err) {
        console.error('Ошибка при создании статьи:', err);
        setError('Ошибка при создании статьи');
        return null;
      } finally {
        setLoading(false);
      }
    };

    // Обновление статьи с PDF
    const updateArticle = async (id, articleData, file) => {
      setLoading(true);
      setError(null);
      try {
        const formData = new FormData();

        const journalName = journalList.find(j => j.abbreviation === articleData.journalAbbr)?.name || '';
        formData.append('journalAbbr', articleData.journalAbbr);
        formData.append('journalName', journalName);

        Object.keys(articleData).forEach(key => {
          if (['journalAbbr', 'journalName', 'pdfFile'].includes(key)) return;
          formData.append(key, typeof articleData[key] === 'object' ? JSON.stringify(articleData[key]) : articleData[key]);
        });

        if (file) formData.append('pdfFile', file);

        const res = await axios.put(`${API_URL}/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        setArticles(prev => prev.map(a => a.id === id ? { ...res.data, pdfFileName: res.data.pdfFileName } : a));
        setSelectedArticle({ ...res.data, pdfFileName: res.data.pdfFileName });
        return true;
      } catch (err) {
        console.error('Ошибка при обновлении статьи:', err);
        setError('Ошибка при обновлении статьи');
        return false;
      } finally {
        setLoading(false);
      }
    };

    const deleteArticle = async (id) => {
      setLoading(true);
      setError(null);
      try {
        await axios.delete(`${API_URL}/${id}`);
        setArticles(prev => prev.filter(a => a.id !== id));
        setSelectedArticle(null);
        return true;
      } catch (err) {
        console.error('Ошибка при удалении статьи:', err);
        setError('Ошибка при удалении статьи');
        return false;
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchArticles();
    }, []);

    return (
      <ArticlesContext.Provider
        value={{
          articles,
          selectedArticle,
          setSelectedArticle,
          fetchArticles,
          createArticle,
          updateArticle,
          deleteArticle,
          loading,
          error,
          setError,
        }}
      >
        {children}
      </ArticlesContext.Provider>
    );
  };
