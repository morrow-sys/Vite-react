import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ForAuthorsContext = createContext();

export const ForAuthorsProvider = ({ children }) => {
  const [files, setFiles] = useState([]);

  // Используем переменную окружения
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const API_URL = `${API_BASE_URL}/api/author-files`;

  useEffect(() => {
    axios.get(API_URL)
      .then(res => setFiles(res.data))
      .catch(err => console.error(err));
  }, [API_URL]);

  const addFile = async (title, file) => {
    try {   
      const formData = new FormData();
      formData.append('title', title);
      if (file) formData.append('file', file);

      const res = await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setFiles(prev => [...prev, res.data]);
    } catch (err) {
      console.error('Failed to add file:', err);
    }
  };

  const updateFileTitle = async (id, title) => {
    try {
      const res = await axios.patch(`${API_URL}/${id}`, { title });
      setFiles(prev => prev.map(f => (f.id === id ? res.data : f)));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteFile = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setFiles(prev => prev.filter(f => f.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ForAuthorsContext.Provider
      value={{
        files,
        addFile,
        updateFileTitle,
        deleteFile,
      }}
    >
      {children}
    </ForAuthorsContext.Provider>
  );
};

export const useAuthors = () => {
  const context = useContext(ForAuthorsContext);
  if (!context) {
    throw new Error('useAuthors must be used within a ForAuthorsProvider');
  }
  return context;
};
