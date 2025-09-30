import React, { useState, useEffect } from 'react';
import { Box, Typography, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';

const AnimatedImageShift = ({ src, alt }) => {
  const [shift, setShift] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShift(true);
      setTimeout(() => setShift(false), 600);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        width: { xs: 100, sm: 120, md: 160 },
        height: { xs: 100, sm: 120, md: 160 },
        borderRadius: '50%',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: 3,
        mb: 1.5,
        '@media (min-width:360px) and (max-width:375px)': {
          width: 80,  // уменьшение картинки для S8+
          height: 80,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '200%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: shift ? '-100%' : '0',
          transition: 'left 0.6s ease-in-out',
        }}
      >
        <Box
          component="img"
          src={src}
          alt={alt}
          sx={{ width: '50%', height: '100%', objectFit: 'cover' }}
        />
        <Box
          component="img"
          src={src}
          alt={`${alt} copy`}
          sx={{ width: '50%', height: '100%', objectFit: 'cover' }}
        />
      </Box>
    </Box>
  );
};

const Section = () => {
  const { t } = useTranslation();

  const platforms = [
    { src: '/assets/izd.jpg', alt: t('publishing'), link: 'http://localhost:5173/', label: t('publishing') },
    { src: '/assets/elibrary.png', alt: 'eLibrary', link: 'https://elibrary.ru', label: 'eLIBRARY.RU' },
    { src: '/assets/DOI.png', alt: 'DOI', link: 'https://gefest.rads-doi.org/gefest/login', label: 'DOI' },
  ];

  const [touchedIndex, setTouchedIndex] = useState(null);

  return (
    <Box
      sx={{
        py: { xs: 6, sm: 8, md: 10 },
        px: { xs: 2, sm: 4, md: 6 },
        textAlign: 'center',
        background: 'linear-gradient(135deg, #f0f4ff 0%, #ffffff 100%)',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: { xs: 4, sm: 5 },
          fontSize: { xs: '1.3rem', sm: '1.8rem', md: '2rem', lg: '2.2rem' },
          '@media (min-width:360px) and (max-width:375px)': {
            fontSize: '1.2rem', // уменьшенный заголовок для S8+
          },
        }}
      >
        {t('weUploadArticles')}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'nowrap',
          overflowX: 'auto',
          columnGap: { xs: 2, sm: 3, md: 10, lg: 12 }, 
          pb: 2,
        }}
      >
        {platforms.map(({ src, alt, link, label }, index) => (
          <Box
            key={index}
            onTouchStart={() => setTouchedIndex(index)}
            onTouchEnd={() => setTouchedIndex(null)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: { xs: 100, sm: 140, md: 160 },
              transition: 'transform 0.3s ease, font-size 0.3s ease',
              transform: touchedIndex === index ? 'scale(1.1) translateY(-5px)' : 'none',
              '& a': {
                fontSize: touchedIndex === index
                  ? { xs: '0.85rem', sm: '1.1rem', md: '1.2rem' }
                  : { xs: '0.8rem', sm: '1rem', md: '1.1rem' },
                '@media (min-width:360px) and (max-width:375px)': {
                  fontSize: touchedIndex === index ? '0.8rem' : '0.75rem', // уменьшенный текст для S8+
                },
              },
            }}
          >
            <AnimatedImageShift src={src} alt={alt} />
            <Link
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{
                fontWeight: 700,
                color: '#3f51b5',
                textAlign: 'center',
                transition: 'font-size 0.3s ease',
                fontSize: { xs: '0.8rem', sm: '1rem', md: '1.1rem' },
                '@media (min-width:360px) and (max-width:375px)': {
                  fontSize: '0.75rem', // уменьшенный текст для S8+
                },
              }}
            >
              {label}
            </Link>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Section;
