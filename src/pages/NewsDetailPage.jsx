import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const NewsDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lang, setLang] = useState(i18n.language || 'ru');

  // Базовый URL API
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  // Обновляем локальный язык при смене языка в i18n
  useEffect(() => {
    const handleLanguageChange = (lng) => setLang(lng);
    i18n.on('languageChanged', handleLanguageChange);
    return () => i18n.off('languageChanged', handleLanguageChange);
  }, [i18n]);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/news/${id}`);
        setNewsItem(res.data);
        setError(null);
      } catch (err) {
        setError(t('news.notFound', 'Новость не найдена'));
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [id, t, API_BASE_URL]);

  if (loading) {
    return (
      <Container sx={{ py: 5, maxWidth: 700, mx: 'auto', textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 5, maxWidth: 700, mx: 'auto', textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>{error}</Typography>
        <Button variant="contained" onClick={() => navigate(-1)}>{t('back')}</Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 3, maxWidth: 700, mx: 'auto' }}>
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 3 }}>
        {t('back')}
      </Button>

      {newsItem.image && (
        <Box
          component="img"
          src={`${API_BASE_URL}${newsItem.image}`}
          alt={newsItem.title?.[lang]}
          sx={{ width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: 2, mb: 2 }}
        />
      )}

      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
        {newsItem.title?.[lang]}
      </Typography>
      <Typography variant="caption" color="text.secondary" gutterBottom>
        {new Date(newsItem.date).toLocaleDateString(lang)}
      </Typography>
      <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.6, mt: 2 }}>
        {newsItem.description?.[lang]}
      </Typography>
    </Container>
  );
};

export default NewsDetailPage;
