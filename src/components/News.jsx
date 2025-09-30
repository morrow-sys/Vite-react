import React, { useState, useEffect } from 'react';
import { useNews } from '../context/NewsContext';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, List, ListItemButton } from '@mui/material';
import { useTranslation } from 'react-i18next';

const News = () => {
  const { newsItems } = useNews();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [lang, setLang] = useState(i18n.language || 'ru');

  // Базовый URL API
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    const handleLanguageChange = (lng) => setLang(lng);
    i18n.on('languageChanged', handleLanguageChange);
    return () => i18n.off('languageChanged', handleLanguageChange);
  }, [i18n]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!newsItems.length) return;
    const interval = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % newsItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [newsItems]);

  if (!newsItems.length) return null;

  const mainNews = newsItems[selectedIndex];

  return (
    <Box sx={{ width: '100%', px: { xs: 2, sm: 3, md: 4 }, py: 5 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          textAlign: 'center',
          mb: 4,
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.4rem' },
          '@media (min-width:360px) and (max-width:375px)': { fontSize: '1.3rem' },
        }}
      >
        {t('news.title')}
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, flexWrap: { xs: 'wrap', md: 'nowrap' }, alignItems: 'stretch' }}>
        <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: '58%' }, position: 'relative', minHeight: 300 }}>
          {mainNews && (
            <Paper
              elevation={3}
              onClick={() => navigate(`/news/${mainNews.id}`)}
              sx={{ width: '100%', height: '100%', cursor: 'pointer', overflow: 'hidden', position: 'relative' }}
            >
              {mainNews.image && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${BASE_URL}${mainNews.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    zIndex: 1,
                  }}
                />
              )}

              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))',
                  color: '#fff',
                  p: 2,
                  zIndex: 2,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, wordBreak: 'break-word' }}>
                  {mainNews.title?.[lang]}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {mainNews.description?.[lang]}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff' }}>
                  <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
                    {new Date(mainNews.date).toLocaleDateString(lang)}
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ ml: 1, color: 'white' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/news/${mainNews.id}`);
                    }}
                  >
                    {t('news.read')}
                  </Button>
                </Box>
              </Box>
            </Paper>
          )}
        </Box>

        <Paper
          elevation={3}
          sx={{
            flexGrow: 1,
            minWidth: { xs: '100%', md: '38%' },
            p: 2,
            maxHeight: 500,
            overflowY: 'auto',
            backgroundColor: '#f2f2f2',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <List disablePadding>
            {newsItems.filter((_, index) => index !== selectedIndex).map((item) => (
              <ListItemButton
                key={item.id}
                onClick={() => setSelectedIndex(newsItems.indexOf(item))}
                sx={{
                  mb: 2,
                  p: 2,
                  flexDirection: 'column',
                  backgroundColor: 'white',
                  borderRadius: 2,
                  '&:hover': { backgroundColor: '#e0e0e0' },
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, wordBreak: 'break-word' }}>
                  {item.title?.[lang]}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', width: '100%' }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#424242',
                      lineHeight: 1.4,
                      wordBreak: 'break-word',
                      flex: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.description?.[lang]}
                  </Typography>

                  {item.image && (
                    <Box
                      component="img"
                      src={`${BASE_URL}${item.image}`}
                      alt=""
                      sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 2, flexShrink: 0 }}
                    />
                  )}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(item.date).toLocaleDateString(lang)}
                  </Typography>
                  <Box sx={{ flex: 1 }} />
                  <Button
                    variant="text"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/news/${item.id}`);
                    }}
                  >
                    {t('news.read')}
                  </Button>
                </Box>
              </ListItemButton>
            ))}
          </List>
        </Paper>
      </Box>
    </Box>
  );
};

export default News;
