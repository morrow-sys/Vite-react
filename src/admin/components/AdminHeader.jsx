import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleGoToSite = () => {
    window.location.href = '/';
  };

  const handleLogoutClick = () => {
    logout();
    sessionStorage.clear();
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    navigate('/admin/login', { replace: true });
  };

  return (
    <Box
      sx={{
        height: 60,
        backgroundColor: '#1e2a38',
        color: '#eee',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 1, sm: 3 },
        whiteSpace: 'nowrap', // предотвращает перенос текста
        overflow: 'hidden',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          display: 'flex',
          alignItems: 'center',
          fontSize: { xs: '0.7rem', sm: '0.9rem', md: '1.25rem' },
          whiteSpace: 'nowrap', // не переносим username
        }}
      >
        Добро пожаловать,
        {user?.username && (
          <Typography
            component="span"
            sx={{
              color: '#4caf50',
              ml: 0.5,
              fontWeight: 'bold',
              fontSize: { xs: '0.7rem', sm: '0.9rem', md: '1.25rem' },
            }}
          >
            {user.username}!
          </Typography>
        )}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          gap: { xs: 0.5, sm: 1.5 },
          flexShrink: 0,
          whiteSpace: 'nowrap', // кнопки не переносятся
        }}
      >
        <Button
          variant="contained"
          color="secondary"
          sx={{
            fontSize: { xs: '0.65rem', sm: '0.85rem', md: '1rem' },
            px: { xs: 1, sm: 2 },
            py: { xs: 0.25, sm: 0.5 },
          }}
          onClick={handleGoToSite}
        >
          На сайт
        </Button>

        <Button
          variant="outlined"
          color="inherit"
          sx={{
            fontSize: { xs: '0.65rem', sm: '0.85rem', md: '1rem' },
            px: { xs: 1, sm: 2 },
            py: { xs: 0.25, sm: 0.5 },
          }}
          onClick={handleLogoutClick}
        >
          Выйти
        </Button>
      </Box>
    </Box>
  );
};

export default AdminHeader;
