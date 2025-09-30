import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useContact } from '../context/ContactContext';

const Contact = () => {
  const { t } = useTranslation();
  const { contactData, loading } = useContact();

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: { xs: 3, sm: 6 } }}>
        <Typography
          sx={{
            fontSize: { xs: '0.85rem', sm: '1rem', md: '1.1rem' },
            '@media (min-width:360px) and (max-width:375px)': { fontSize: '0.75rem' },
          }}
        >
          {t('loading', 'Загрузка...')}
        </Typography>
      </Box>
    );
  }

  const addressText = contactData?.address?.ru || '';
  const phoneText = contactData?.phone || '';
  const emailText = contactData?.email || '';
  const images = contactData?.images || [];
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  return (
    <Box
      id="contact"
      sx={{
        py: { xs: 4, sm: 6 },
        px: { xs: 2, sm: 3, md: 4 },
        maxWidth: { xs: '90%', sm: 700, md: 900, lg: 1200 },
        mx: 'auto',
        textAlign: 'center',
      }}
    >
      {/* Заголовок */}
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={6}
        sx={{
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.4rem' },
          '@media (min-width:360px) and (max-width:375px)': { fontSize: '1.3rem' },
        }}
      >
        {t('contact', 'Контакты')}
      </Typography>

      {/* Изображения */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mb: 4,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        {(images.length ? images : ['/assets/address.jpg']).map((img, i) => (
          <Box
            key={i}
            component="img"
            src={images.length ? `${baseURL}/uploads/contact/${img}` : img}
            alt={`office-${i}`}
            sx={{
              width: { xs: '100%', sm: 500 },
              maxWidth: '100%',
              borderRadius: 1,
              boxShadow: 4,
              objectFit: 'cover',
              height: { xs: 180, sm: 240 },
              '@media (min-width:360px) and (max-width:375px)': { height: 160 },
            }}
          />
        ))}
      </Box>

      {/* Контактная информация */}
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 4 },
          maxWidth: 500,
          mx: 'auto',
          textAlign: 'left',
          mb: 6,
        }}
      >
        <Typography
          variant="body1"
          mb={2}
          sx={{
            fontSize: { xs: '0.85rem', sm: '1rem', md: '1.05rem' },
            '@media (min-width:360px) and (max-width:375px)': { fontSize: '0.75rem' },
          }}
        >
          <strong>{t('address', 'Адрес:')}</strong> {addressText}
        </Typography>
        <Typography
          variant="body1"
          mb={2}
          sx={{
            fontSize: { xs: '0.85rem', sm: '1rem', md: '1.05rem' },
            '@media (min-width:360px) and (max-width:375px)': { fontSize: '0.75rem' },
          }}
        >
          <strong>{t('phone', 'Телефоны:')}</strong> {phoneText}
        </Typography>
        <Typography
          variant="body1"
          mb={2}
          sx={{
            fontSize: { xs: '0.85rem', sm: '1rem', md: '1.05rem' },
            '@media (min-width:360px) and (max-width:375px)': { fontSize: '0.75rem' },
          }}
        >
          <strong>{t('email', 'Email:')}</strong>{' '}
          <a
            href={`mailto:${emailText}`}
            style={{ color: '#1976d2', textDecoration: 'none', fontSize: 'inherit' }}
          >
            {emailText}
          </a>
        </Typography>
      </Paper>

      {/* Карта */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: 0,
          paddingBottom: '56.25%',
          borderRadius: 1,
          overflow: 'hidden',
          boxShadow: 4,
        }}
      >
        <iframe
          title={t('mapTitle', 'Карта - г.Бишкек, ул. Дж.Боконбаева, д.99')}
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d365.53390342942856!2d74.60878324856334!3d42.86711909999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x389eb7ceeb87333d%3A0x7bc25070952f6a90!2zMTA0INGD0LsuINCR0L7QutC-0L3QsdCw0LXQstCwLCDQkdC40YjQutC10Lo!5e0!3m2!1sru!2skg!4v1757482773427!5m2!1sru!2skg"
          width="100%"
          height="700px"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </Box>
    </Box>
  );
};

export default Contact;
