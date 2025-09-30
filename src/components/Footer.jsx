import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  IconButton,
  Grid,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#1e2a38',
        color: '#eee',
        py: 3,
      }}
    >
      <Container maxWidth="lg">
        {/* Основные колонки */}
        <Grid
          container
          spacing={{ xs: 2, sm: 2, md: 4 }}
          justifyContent={{ xs: 'center', md: 'space-between' }}
          textAlign="center"
        >
          {/* Журналы */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
            >
              {t('footer.journals')}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                alignItems: 'center',
              }}
            >
              {[t('footer.journal1'), t('footer.journal2'), t('footer.publishing')].map((text, idx) => (
                <Link
                  key={idx}
                  href="#"
                  color="inherit"
                  underline="hover"
                  sx={{
                    wordBreak: 'break-word',
                    fontSize: { xs: '0.85rem', md: '1rem' },
                    maxWidth: { xs: '90%', md: '100%' },
                    textAlign: 'center',
                  }}
                >
                  {text}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Контакты */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
            >
              {t('footer.contacts')}
            </Typography>
            {[t('footer.address'), t('footer.phone'), t('footer.email')].map((text, idx) => (
              <Typography
                key={idx}
                sx={{
                  fontSize: { xs: '0.85rem', md: '1rem' },
                  wordBreak: 'break-word',
                }}
              >
                {text}
              </Typography>
            ))}
          </Grid>

          {/* Соцсети */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom textAlign="center">
              {t('footer.socials')}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: 1,
              }}
            >
              <IconButton href="#" color="inherit">
                <FacebookIcon />
              </IconButton>
              <IconButton href="#" color="inherit">
                <TwitterIcon />
              </IconButton>
              <IconButton
                component="a"
                href="https://www.instagram.com/izdatelstvo.kg/"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
              >
                <InstagramIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        {/* Нижний блок с developer email и © */}
        <Box
          sx={{
            mt: 4,
            pt: 3,
            borderTop: '1px solid rgba(255,255,255,0.2)',
            fontSize: '0.875rem',
            color: '#eee',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2, // увеличенный отступ
            px: 2,
          }}
        >
          {/* Developer email */}
          <Box sx={{ textAlign: 'center', color: 'gray' }}>
            <Typography variant="body2" component="span">
              {t('footer.developer')}:&nbsp;
            </Typography>
            <Link
              href="mailto:baktiarbejseev@gmail.com"
              color="inherit"
              underline="hover"
            >
              baktiarbejseev@gmail.com
            </Link>
          </Box>

          {/* © 2025 Journal-science */}
          <Typography variant="body2" textAlign="center" sx={{ wordBreak: 'break-word' }}>
            © 2025 Journal-science. {t('footer.rights')}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
