import React, { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useTranslation } from 'react-i18next';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

import { usePublishingSlider } from '../context/PublishingSliderContext.jsx';

const PublishingSlider = () => {
  const { publications, loading } = usePublishingSlider();
  const { t } = useTranslation();
  const [expandedIndex, setExpandedIndex] = useState(null);

  if (loading) return <Typography align="center">{t('loadingPublications', 'Загрузка публикаций...')}</Typography>;
  if (!publications.length) return <Typography align="center">{t('noPublications', 'Публикации отсутствуют')}</Typography>;

  return (
    <Box
      id="publishing"
      sx={{
        py: 6,
        background: 'linear-gradient(135deg, #e0e7ff 0%, #fff 100%)',
        textAlign: 'center',
        position: 'relative',
      }}
    >
      {/* Заголовок */}
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={8}
        sx={{
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.4rem' },
          '@media (min-width:360px) and (max-width:375px)': { fontSize: '1.3rem' },
        }}
      >
        {t('publishing', 'Издательство научных журналов')}
      </Typography>

      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
        spaceBetween={40}
        slidesPerView={1.2}
        effect="coverflow"
        coverflowEffect={{ rotate: 30, stretch: 0, depth: 150, modifier: 1, slideShadows: true }}
        navigation={{ prevEl: '.custom-prev', nextEl: '.custom-next' }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        breakpoints={{ 600: { slidesPerView: 1.5 }, 900: { slidesPerView: 2.3 }, 1200: { slidesPerView: 3.2 } }}
        style={{ paddingBottom: 60, cursor: 'grab' }}
      >
        {publications.map((item, index) => (
          <SwiperSlide key={item.id ?? index} style={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                width: 320,
                backgroundColor: '#fff',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(26, 35, 126, 0.2), 0 8px 24px rgba(26, 35, 126, 0.1)',
                transition: 'transform 0.4s ease, box-shadow 0.4s ease',
                '&:hover': {
                  transform: 'scale(1.07)',
                  boxShadow: '0 30px 60px rgba(26,35,126,0.35),0 12px 36px rgba(26,35,126,0.2)',
                },
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
              }}
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
            >
              {/* Изображение */}
              <Box
                component="img"
                src={item.image}
                alt={item.title}
                sx={{
                  width: '100%',
                  height: 220,
                  objectFit: 'cover',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
                  '@media (min-width:360px) and (max-width:375px)': { height: 180 },
                }}
              />

              {/* Содержимое */}
              <Box
                p={3}
                flexGrow={1}
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{
                    mb: 1,
                    color: '#303f9f',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    fontSize: { xs: '0.85rem', sm: '1rem', md: '1.1rem' },
                    '@media (min-width:360px) and (max-width:375px)': { fontSize: '0.75rem' },
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    maxHeight: expandedIndex === index ? 300 : 60,
                    overflow: 'hidden',
                    transition: 'max-height 0.5s ease, opacity 0.5s ease',
                    opacity: expandedIndex === index ? 1 : 0.8,
                    lineHeight: 1.4,
                    display: expandedIndex === index ? 'block' : '-webkit-box',
                    WebkitLineClamp: expandedIndex === index ? 'unset' : 3,
                    WebkitBoxOrient: 'vertical',
                    whiteSpace: 'normal',
                    fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.9rem' },
                    '@media (min-width:360px) and (max-width:375px)': { fontSize: '0.7rem' },
                  }}
                >
                  {item.description}
                </Typography>
              </Box>
            </Box>
          </SwiperSlide>
        ))}

        <IconButton
          className="custom-prev"
          sx={{
            position: 'absolute',
            top: '50%',
            left: 16,
            transform: 'translateY(-50%)',
            zIndex: 20,
            bgcolor: '#3f51b5',
            color: '#fff',
          }}
        >
          <NavigateBeforeIcon fontSize="large" />
        </IconButton>
        <IconButton
          className="custom-next"
          sx={{
            position: 'absolute',
            top: '50%',
            right: 16,
            transform: 'translateY(-50%)',
            zIndex: 20,
            bgcolor: '#3f51b5',
            color: '#fff',
          }}
        >
          <NavigateNextIcon fontSize="large" />
        </IconButton>
      </Swiper>
    </Box>
  );
};

export default PublishingSlider;
