import React, { createContext, useState, useEffect } from 'react';

export const AssociationsContext = createContext();

export const AssociationsProvider = ({ children }) => {
  const [associations, setAssociations] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const API_URL = `${API_BASE_URL}/api/associations`;

  // Загрузка ассоциаций с сервера
  useEffect(() => {
    const fetchAssociations = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Ошибка загрузки ассоциаций');
        const data = await res.json();
        setAssociations(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAssociations();
  }, [API_URL]);

  const addAssociation = async (text) => {
    const newAssoc = { text };
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAssoc),
      });
      if (!res.ok) throw new Error('Ошибка добавления ассоциации');
      const created = await res.json();
      setAssociations((prev) => [created, ...prev]);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const updateAssociation = async (id, text) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error('Ошибка обновления ассоциации');
      const updatedAssoc = await res.json();
      setAssociations((prev) =>
        prev.map((assoc) => (assoc.id === id ? updatedAssoc : assoc))
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const removeAssociation = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Ошибка удаления ассоциации');
      setAssociations((prev) => prev.filter((assoc) => assoc.id !== id));
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return (
    <AssociationsContext.Provider
      value={{
        associations,
        addAssociation,
        updateAssociation,
        removeAssociation,
      }}
    >
      {children}
    </AssociationsContext.Provider>
  );
};
