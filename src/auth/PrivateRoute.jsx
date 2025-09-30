import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { token, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Берём базовый URL из .env
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const ME_URL = `${API_BASE_URL}/api/auth/me`;

  useEffect(() => {
    // Если токена нет, сразу редирект
    if (!token) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(ME_URL, {
          headers: { Authorization: `Bearer ${token}` }, // передаём токен
        });

        if (!res.ok) throw new Error('Unauthorized');

        const data = await res.json();
        setIsAdmin(data.role === 'admin');
      } catch (err) {
        logout(); // очищаем токен при ошибке
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token, logout, ME_URL]);

  if (loading) return <div>Загрузка...</div>;

  return isAdmin ? children : <Navigate to="/admin/login" />;
};

export default PrivateRoute;
