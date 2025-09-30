import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Box, Paper, Button, Stack, useMediaQuery, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import InfoIcon from '@mui/icons-material/Info';
import SearchIcon from '@mui/icons-material/Search';
import ArchiveIcon from '@mui/icons-material/Archive';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PeopleIcon from '@mui/icons-material/People';

import myImage from '/assets/ivkk.jpg';

const Journal2Layout = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  // Определяем размеры экранов
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // <600px
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md')); // 600-900px
  const isDesktop = useMediaQuery(theme.breakpoints.up('md')); // >900px

  const linkStyles = ({ isActive }) => ({
    color: isActive ? 'black' : 'rgba(0,0,0,0.87)',
    borderColor: isActive ? 'black' : '#ccc',
    textTransform: 'none',
    fontWeight: 800,
    width: isMobile ? '90%' : isTablet ? '75%' : '80%', // адаптивная ширина кнопок
    boxShadow: 'none',
    borderStyle: 'solid',
    backgroundColor: '#E8F8FA',
    borderWidth: 1,
    transition: 'transform 0.2s ease, box-shadow 0.2s ease', 
    '&:hover': {
      borderColor: 'black',
      backgroundColor: '#f9f9f9',
      transform: 'scale(1.03)', 
      boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
    },
  });

  return (
    <Box
      sx={{
        display: isMobile || isTablet ? 'block' : 'flex',
        maxWidth: 1200,
        mx: 'auto',
        p: 2,
        gap: 3,
      }}
    >
      {/* Sidebar */}
      <Paper
        elevation={0}
        sx={{
          width: isMobile || isTablet ? '100%' : 240,
          p: 2,
          bgcolor: '#fff',
          borderRadius: 1,
          border: '1px solid #e0e0e0',
          boxShadow: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flexShrink: 0,
          mb: isMobile || isTablet ? 3 : 0,
        }}
      >
        {/* Кнопки */}
        <Stack spacing={1.5} alignItems="center" sx={{ width: '100%' }}>
          <Button component={NavLink} to="" startIcon={<InfoIcon />} sx={linkStyles}>
            {t('aboutJournal')}
          </Button>
          <Button component={NavLink} to="indexing2" startIcon={<AssessmentIcon />} sx={linkStyles}>
            {t('indexing')}
          </Button>
          <Button component={NavLink} to="editorial2" startIcon={<PeopleIcon />} sx={linkStyles}>
            {t('editorialboard')}
          </Button>
          <Button component={NavLink} to="archive2" startIcon={<ArchiveIcon />} sx={linkStyles}>
            {t('archive')}
          </Button>
          <Button component={NavLink} to="search2" startIcon={<SearchIcon />} sx={linkStyles}>
            {t('search')}
          </Button>
        </Stack>

        {/* Адаптивная картинка */}
        <Box sx={{ mt: 3, width: '100%', textAlign: 'center' }}>
          <img
            src={myImage}
            alt={t('journal')}
            style={{
              width: '100%',
              maxWidth: isMobile ? 180 : isTablet ? 220 : '100%',
              height: 'auto',
              objectFit: 'cover',
              borderRadius: 8,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'pointer',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.25)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
          />
        </Box>
      </Paper>

      {/* Основной контент */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Journal2Layout;