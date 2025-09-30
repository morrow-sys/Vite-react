import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { List, ListItem, ListItemButton, ListItemText, Typography, Box } from '@mui/material';

const adminLinks = [
  { to: '/admin/authors', label: 'Авторам' },
  { to: '/admin/journals', label: 'Журналы' },
  { to: '/admin/publishers', label: 'Издатели' },
  { to: '/admin/associations', label: 'Ассоциации'},
  { to: '/admin/books', label: 'Книги' },
  { to: '/admin/contact', label: 'Контакты' },
  { to: '/admin/news', label: 'Новости' },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <Box
      sx={{
        width: 200,
        minWidth: 200,
        backgroundColor: '#141e28',
        color: '#eee',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 2,
        boxShadow: 3,
        flexShrink: 0,
      }}
    >
      <Typography variant="h6" align="center" sx={{ mb: 3, fontWeight: 'bold' }}>
        Администратор
      </Typography>

      <List>
        {adminLinks.map(({ to, label }) => {
          const isActive = location.pathname === to;

          return (
            <ListItem key={to} disablePadding sx={{ px: 1 }}>
              <ListItemButton
                component={Link}
                to={to}
                sx={{
                  color: isActive ? '#141e28' : '#eee',
                  backgroundColor: isActive ? 'rgba(221, 235, 34, 0.7)' : 'transparent',
                  border: '1px solid',
                  borderColor: isActive ? 'rgba(221, 235, 34, 1)' : 'rgba(255, 255, 255, 0.2)',
                  borderRadius: 1,
                  mb: 1,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(221, 235, 34, 0.3)',
                    borderColor: 'rgba(221, 235, 34, 0.7)',
                    color: '#141e28',
                  },
                }}
              >
                <ListItemText primary={label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default Sidebar;
