import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  // Берём базовый URL из .env
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // http://new.science-journal.kg
  const LOGIN_URL = `${API_BASE_URL}/api/auth/login`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Заполните все поля');
      return;
    }

    try {
      const res = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Ошибка входа');
        return;
      }

      // Сохраняем пользователя и токен
      login({ username: data.username, role: data.role }, data.token);
      navigate('/admin'); // редирект в админку
    } catch (err) {
      console.error('Login failed', err);
      setError('Сервер не отвечает');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
        backgroundColor: '#f9f9f9',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          maxWidth: 400,
          width: '100%',
          padding: 5,
          borderRadius: 3,
          backgroundColor: '#ffffff',
        }}
      >
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ fontWeight: 700, color: '#1976d2' }}
        >
          Вход в админ панель
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Имя пользователя"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
          <TextField
            label="Пароль"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <Typography
              color="error"
              variant="body2"
              sx={{ textAlign: 'center', mt: 1 }}
            >
              {error}
            </Typography>
          )}

          <Box display="flex" justifyContent="center" mt={3}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                width: '50%',
                py: 1.5,
                backgroundColor: '#1976d2',
                fontWeight: 700,
                '&:hover': { backgroundColor: '#115293' },
              }}
            >
              Войти
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
