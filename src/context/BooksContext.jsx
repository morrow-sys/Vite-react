import React, { createContext, useState, useEffect } from 'react';

export const BooksContext = createContext();

export const BooksProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Базовый адрес API (берётся из .env)
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const API_URL = `${API_BASE_URL}/api/books`;

  // Загрузка книг при старте
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Ошибка загрузки книг');
        const data = await res.json();
        setBooks(data);
      } catch (err) {
        console.error('Ошибка загрузки книг:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [API_URL]);

  // Добавление книги
  const addBook = async (text) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error('Ошибка при добавлении книги');

      const newBook = await res.json();
      setBooks((prev) => [newBook, ...prev]);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // Обновление книги
  const updateBook = async (id, text) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error('Ошибка при обновлении книги');

      const updatedBook = await res.json();
      setBooks((prev) =>
        prev.map((book) => (book.id === id ? updatedBook : book))
      );
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // Удаление книги
  const removeBook = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Ошибка при удалении книги');

      setBooks((prev) => prev.filter((book) => book.id !== id));
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <BooksContext.Provider
      value={{
        books,
        loading,
        error,
        addBook,
        updateBook,
        removeBook,
      }}
    >
      {children}
    </BooksContext.Provider>
  );
};
