import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const JournalsContext = createContext();

const normalizeJournalData = (data) => ({
  ...data,
  editorialBoard: data.editorialBoard || data.editorialboard || { ru: '', en: '', kg: '' },
  about: data.about || { ru: '', en: '', kg: '' },
  indexing: data.indexing || { ru: '', en: '', kg: '' },
});

export const JournalsProvider = ({ children }) => {
  const [journalList, setJournalList] = useState([]);
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Базовый URL из переменной окружения
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
  const API_URL = `${API_BASE_URL}/api/journals`;

  // Загрузка всех журналов
  const fetchJournals = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API_URL);
      const normalized = res.data.map(normalizeJournalData);
      setJournalList(normalized);
    } catch (err) {
      setError('Ошибка при загрузке списка журналов');
      console.error('❌ Ошибка при загрузке списка журналов:', err);
    } finally {
      setLoading(false);
    }
  };

  // Загрузка одного журнала по ID
  const fetchJournalById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/${id}`);
      const normalized = normalizeJournalData(res.data);
      setSelectedJournal(normalized);
    } catch (err) {
      setError('Ошибка при загрузке данных журнала');
      console.error('❌ Ошибка при загрузке журнала:', err);
    } finally {
      setLoading(false);
    }
  };

  // Создание нового журнала
  const createJournal = async (journalData) => {
    setLoading(true);
    setError(null);
    try {
      if (typeof journalData !== 'object' || typeof journalData.name !== 'string') {
        throw new Error('Данные журнала должны содержать поле name (строка)');
      }
      const trimmedName = journalData.name.trim();
      if (!trimmedName) throw new Error('Название журнала не может быть пустым');

      const payload = {
        name: trimmedName,
        abbreviation: journalData.abbreviation || '',
        about: { ru: '', en: '', kg: '' },
        editorialBoard: { ru: '', en: '', kg: '' },
        indexing: { ru: '', en: '', kg: '' },
      };

      const res = await axios.post(API_URL, payload);
      await fetchJournals();
      return normalizeJournalData(res.data);
    } catch (err) {
      setError(err.message || 'Ошибка при создании журнала');
      console.error('❌ Ошибка при создании журнала:', err.response?.data || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Обновление журнала
  const updateJournal = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.put(`${API_URL}/${id}`, data);
      const updated = normalizeJournalData(res.data);

      setJournalList((prev) => prev.map((j) => (j.id === id ? updated : j)));
      setSelectedJournal(updated);

      return true;
    } catch (err) {
      setError('Ошибка при обновлении журнала');
      console.error('❌ Ошибка при обновлении журнала:', err.response?.data || err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Удаление журнала
  const deleteJournal = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_URL}/${id}`);
      setSelectedJournal(null);
      await fetchJournals();
      return true;
    } catch (err) {
      setError('Ошибка при удалении журнала');
      console.error('❌ Ошибка при удалении журнала:', err.response?.data || err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournals();
  }, []);

  return (
    <JournalsContext.Provider
      value={{
        journalList,
        selectedJournal,
        fetchJournalById,
        createJournal,
        updateJournal,
        deleteJournal,
        setSelectedJournal,
        loading,
        error,
        setError,
      }}
    >
      {children}
    </JournalsContext.Provider>
  );
};
