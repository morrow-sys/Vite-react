import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ContactContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ContactProvider = ({ children }) => {
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/contact`);
      setContactData(res.data);
    } catch (err) {
      console.error('Ошибка при получении контактов:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateContact = async (formData) => {
    try {
      setUpdating(true);
      const res = await axios.put(`${API_BASE_URL}/api/contact`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setContactData(res.data);
      alert('Сохранено!');
    } catch (err) {
      console.error('Ошибка при обновлении контактов:', err);
      alert('Ошибка при обновлении контактов');
    } finally {
      setUpdating(false);
    }
  };

  const deleteContactImage = async (imageName) => {
    try {
      const res = await axios.delete(`${API_BASE_URL}/api/contact/image/${imageName}`);
      setContactData(res.data);
    } catch (err) {
      console.error('Ошибка при удалении изображения:', err);
      alert('Ошибка при удалении изображения');
    }
  };

  return (
    <ContactContext.Provider
      value={{ contactData, loading, updating, updateContact, deleteContactImage }}
    >
      {children}
    </ContactContext.Provider>
  );
};

export const useContact = () => useContext(ContactContext);
