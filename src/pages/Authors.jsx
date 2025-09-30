import React from 'react';
import { Box, Typography, List, ListItem, Link, Divider } from '@mui/material';
import { useAuthors } from '../context/forAuthorsContext';
import { useTranslation } from 'react-i18next';

const Authors = () => {
  const { files } = useAuthors();
  const { t } = useTranslation();

  if (!files.length) {
    return (
      <Box sx={{ p: 6 }}>
        <Typography
          textAlign="center"
          color="text.secondary"
          variant="h6"
          sx={{
            fontSize: { xs: '0.85rem', sm: '1rem', md: '1.1rem' },
            '@media (min-width:360px) and (max-width:375px)': { fontSize: '0.75rem' },
          }}
        >
          {t('noFilesAdded', 'Файлы ещё не добавлены')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 3, sm: 6 }, maxWidth: 1200, mx: 'auto' }}>
      {/* Заголовок */}
      <Typography
        variant="h4"
        textAlign="center"
        mb={5}
        fontWeight={800}
        sx={{
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.4rem' },
          '@media (min-width:360px) and (max-width:375px)': { fontSize: '1.3rem' },
        }}
      >
        {t('authors')}
      </Typography>

      <Box sx={{ p: { xs: 2, sm: 3 }, borderRadius: 0.5, border: '1px solid #ddd', backgroundColor: '#F0F8FF' }}>
        <List disablePadding>
          {files.map((f, index) => (
            <React.Fragment key={f.id}>
              <ListItem
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: { xs: 2, sm: 4 },
                  px: { xs: 1, sm: 1 },
                  flexWrap: 'wrap',
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight={500}
                  sx={{
                    fontSize: { xs: '0.8rem', sm: '1rem', md: '1.05rem' },
                    '@media (min-width:360px) and (max-width:375px)': { fontSize: '0.75rem' },
                  }}
                >
                  {f.title}
                </Typography>
                {f.url && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontSize: { xs: '0.7rem', sm: '0.85rem', md: '0.9rem' },
                      '@media (min-width:360px) and (max-width:375px)': { fontSize: '0.65rem' },
                    }}
                  >
                    <Link href={f.url} target="_blank" rel="noopener noreferrer">
                      {t('openFile', 'Открыть файл')}
                    </Link>
                  </Typography>
                )}
              </ListItem>
              {index < files.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default Authors;
