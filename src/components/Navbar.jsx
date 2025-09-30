import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Box, Button,
  useTheme, useMediaQuery, Drawer, Collapse, Divider
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import Clock from './Clock';

const navItems = [
  { key: 'home', path: '/' },
  { key: 'authors', path: '/authors', isAuthorsDropdown: true },
  { key: 'journals', path: '/journals', isDropdown: true },
  { key: 'publishing', path: '/publishing' },
  { key: 'associations', path: '/associations' },
  { key: 'books', path: '/books' },
  { key: 'contact', path: '/contact' },
];

const journalItems = [
  { key: 'journal1', title: 'Наука, новые технологии и инновации Кыргызстана', path: '/journal1' },
  { key: 'journal2', title: 'Журнал "Известия ВУЗов Кыргызстана"', path: '/journal2' },
];

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || 'ru');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const [journalAnchorEl, setJournalAnchorEl] = useState(null);
  const [languageAnchorEl, setLanguageAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileJournalOpen, setMobileJournalOpen] = useState(false);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    setLanguageAnchorEl(null);
  };

  const handleLanguageMenuOpen = (event) => {
    setLanguageAnchorEl(event.currentTarget);
  };

  const handleJournalMenuOpen = (event) => {
    event.stopPropagation();
    setJournalAnchorEl(event.currentTarget);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={4}
        sx={{
          backgroundColor: 'rgba(20, 30, 40, 1)',
          backdropFilter: 'blur(10px)',
          color: '#eee',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              pl: 2,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <MenuBookIcon sx={{ fontSize: 32, mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {t('journal')}
            </Typography>
          </Box>

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, pr: 2 }}>
              {navItems.map(({ key, path, isDropdown, isAuthorsDropdown }) => {
                if (isDropdown) {
                  return (
                    <Box key={key} sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                      <Button
                        variant="outlined"
                        color="inherit"
                        onClick={() => navigate(path)}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 300,
                          borderColor: '#ddd',
                          borderRight: 'none',
                          borderTopRightRadius: 0,
                          borderBottomRightRadius: 0,
                          px: 2,
                          height: 36,
                          '&:hover': {
                            backgroundColor: 'rgba(221, 235, 34, 1)',
                            color: 'rgba(20, 30, 40, 1)',
                            borderColor: '#ddd',
                          },
                        }}
                      >
                        {t('journals')}
                      </Button>
                      <Button
                        variant="outlined"
                        color="inherit"
                        onClick={handleJournalMenuOpen}
                        sx={{
                          borderLeft: 'none',
                          borderTopLeftRadius: 0,
                          borderBottomLeftRadius: 0,
                          minWidth: 36,
                          px: 0,
                          height: 36,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          '&:hover': {
                            backgroundColor: 'rgba(221, 235, 34, 1)',
                            color: 'rgba(20, 30, 40, 1)',
                            borderColor: '#ddd',
                          },
                        }}
                      >
                        <ArrowDropDownIcon sx={{ color: 'white' }} />
                      </Button>
                      <Menu
                        anchorEl={journalAnchorEl}
                        open={Boolean(journalAnchorEl)}
                        onClose={() => setJournalAnchorEl(null)}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                        MenuListProps={{
                          onMouseLeave: () => setJournalAnchorEl(null),
                        }}
                      >
                        {journalItems.map(({ key, title, path }) => (
                          <MenuItem
                            key={key}
                            onClick={() => {
                              setJournalAnchorEl(null);
                              navigate(path);
                            }}
                          >
                            {title}
                          </MenuItem>
                        ))}
                      </Menu>
                    </Box>
                  );
                }

                if (isAuthorsDropdown) {
                  return (
                    <Button
                      key={key}
                      color="inherit"
                      onClick={() => navigate(path)}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 300,
                        borderColor: '#ddd',
                        px: 2,
                        height: 36,
                        '&:hover': {
                          backgroundColor: 'rgba(221, 235, 34, 1)',
                          color: 'rgba(20, 30, 40, 1)',
                          borderColor: '#ddd',
                        },
                      }}
                    >
                      {t('authors')}
                    </Button>
                  );
                }

                return (
                  <Button
                    key={key}
                    component={RouterLink}
                    to={path}
                    sx={{
                      fontWeight: 300,
                      color: 'inherit',
                      textTransform: 'none',
                      border: 'none',
                      px: 2,
                      height: 36,
                      '&:hover': {
                        backgroundColor: 'rgba(221, 235, 34, 1)',
                        color: 'rgba(20, 30, 40, 1)',
                        borderColor: 'transparent',
                      },
                    }}
                  >
                    {t(key)}
                  </Button>
                );
              })}

              <Button
                variant="outlined"
                color="inherit"
                onClick={handleLanguageMenuOpen}
                sx={{
                  textTransform: 'none',
                  fontWeight: 300,
                  borderColor: '#ddd',
                  px: 2,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  '&:hover': {
                    backgroundColor: 'rgba(221, 235, 34, 1)',
                    color: 'rgba(20, 30, 40, 1)',
                    borderColor: '#ddd',
                  },
                }}
              >
                {t('language')}
                <ArrowDropDownIcon sx={{ color: 'white' }} />
              </Button>
              <Menu
                anchorEl={languageAnchorEl}
                open={Boolean(languageAnchorEl)}
                onClose={() => setLanguageAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem onClick={() => handleLanguageChange('ky')}>Кыргызча</MenuItem>
                <MenuItem onClick={() => handleLanguageChange('ru')}>Русский</MenuItem>
                <MenuItem onClick={() => handleLanguageChange('en')}>English</MenuItem>
              </Menu>

              <Clock />
            </Box>
          )}

          {isMobile && (
            <>
              <IconButton color="inherit" edge="end" onClick={handleDrawerToggle} size="large">
                <MenuIcon />
              </IconButton>

              <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                PaperProps={{ sx: { backgroundColor: 'rgba(20, 30, 40, 1)', color: '#eee', width: 250 } }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', p: 2, boxSizing: 'border-box' }}>
                  {/* Часы сверху */}
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                    <Clock />
                  </Box>

                  {navItems.map(({ key, path, isDropdown }) => {
                    if (isDropdown) {
                      return (
                        <Box key={key} sx={{ width: '100%' }}>
                          <Button
                            fullWidth
                            endIcon={mobileJournalOpen ? <ExpandLess /> : <ExpandMore />}
                            onClick={() => setMobileJournalOpen(!mobileJournalOpen)}
                            sx={{ color: '#eee', justifyContent: 'space-between', mb: 1 }}
                          >
                            {t('journals')}
                          </Button>
                          <Collapse in={mobileJournalOpen} timeout="auto" unmountOnExit>
                            {journalItems.map(({ key: jKey, title, path: jPath }) => (
                              <Button
                                key={jKey}
                                fullWidth
                                sx={{ color: '#eee', pl: 3, mb: 1, justifyContent: 'flex-start' }}
                                onClick={() => { navigate(jPath); setMobileOpen(false); }}
                              >
                                {title}
                              </Button>
                            ))}
                          </Collapse>
                        </Box>
                      );
                    }
                    return (
                      <Button
                        key={key}
                        fullWidth
                        sx={{ color: '#eee', mb: 1, justifyContent: 'flex-start' }}
                        onClick={() => { navigate(path); setMobileOpen(false); }}
                      >
                        {t(key)}
                      </Button>
                    );
                  })}

                  <Divider sx={{ my: 1, bgcolor: '#555' }} />

                  {/* Языки внизу */}
                  <Button fullWidth sx={{ color: '#eee', mb: 1, justifyContent: 'flex-start' }} onClick={() => handleLanguageChange('ky')}>Кыргызча</Button>
                  <Button fullWidth sx={{ color: '#eee', mb: 1, justifyContent: 'flex-start' }} onClick={() => handleLanguageChange('ru')}>Русский</Button>
                  <Button fullWidth sx={{ color: '#eee', justifyContent: 'flex-start' }} onClick={() => handleLanguageChange('en')}>English</Button>
                </Box>
              </Drawer>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Toolbar />
    </>
  );
};

export default Navbar;
