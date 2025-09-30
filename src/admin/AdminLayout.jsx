import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AdminHeader from './components/AdminHeader';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const { user, token, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Берём базовый URL из .env
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
  const ME_URL = `${API_BASE_URL}/api/auth/me`;

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetch(ME_URL, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => setLoading(false))
      .catch(() => {
        logout();
        navigate('/admin/login');
      });
  }, [token, navigate, logout, ME_URL]);

  if (loading) return <div style={{ padding: '20px' }}>Загрузка...</div>;

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <AdminHeader adminName={user?.username} onLogout={handleLogout} />
        <main style={{ flexGrow: 1, padding: '20px', backgroundColor: '#f0f2f5' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
