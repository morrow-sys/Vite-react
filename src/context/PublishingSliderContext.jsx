import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const PublishingSliderContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const PublishingSliderProvider = ({ children }) => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/publishingslider`);
      setPublications(res.data);
    } catch (err) {
      console.error('Error fetching publications:', err);
    }
    setLoading(false);
  };

  const addPublication = async ({ title, description }, imageFile) => {
    const formData = new FormData();
    formData.append('title', JSON.stringify(title));
    formData.append('description', JSON.stringify(description));
    formData.append('date', new Date().toISOString());

    if (imageFile) formData.append('image', imageFile);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/publishingslider`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPublications(prev => [res.data, ...prev]);
    } catch (err) {
      console.error('Error adding publication:', err);
      throw err;
    }
  };

  const deletePublication = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/publishingslider/${id}`);
      setPublications(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting publication:', err);
    }
  };

  return (
    <PublishingSliderContext.Provider value={{ publications, addPublication, deletePublication, loading }}>
      {children}
    </PublishingSliderContext.Provider>
  );
};

export const usePublishingSlider = () => useContext(PublishingSliderContext);
