import React, { useContext } from 'react';
import { Box, Typography, List, ListItem, Divider } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { BooksContext } from '../context/BooksContext';
import { useTranslation } from 'react-i18next';

const BooksPage = () => {
  const { books } = useContext(BooksContext);
  const { t } = useTranslation();

  if (books.length === 0) {
    return (
      <Box sx={{ p: { xs: 3, sm: 6 } }}>
        <Typography
          textAlign="center"
          color="text.secondary"
          variant="h6"
          sx={{
            fontSize: { xs: '0.85rem', sm: '1rem', md: '1.1rem' },
            '@media (min-width:360px) and (max-width:375px)': { fontSize: '0.75rem' },
          }}
        >
          {t('booksNotAdded', 'Книги ещё не добавлены')}
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
        {t('books', 'Книги')}
      </Typography>

      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 0.5,
          border: '1px solid #ddd',
          backgroundColor: '#F0F8FF',
        }}
      >
        <List disablePadding>
          {books.map((book, index) => (
            <React.Fragment key={book.id}>
              <ListItem sx={{ py: { xs: 1.5, sm: 2 }, px: { xs: 1, sm: 1 } }}>
                <Typography
                  variant="subtitle1"
                  fontWeight={500}
                  component="div"
                  sx={{
                    fontSize: { xs: '0.8rem', sm: '1rem', md: '1.05rem' },
                    '@media (min-width:360px) and (max-width:375px)': { fontSize: '0.75rem' },
                  }}
                >
                  <ReactMarkdown
                    components={{
                      a: ({ node, ...props }) => (
                        <a
                          {...props}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: 'blue',
                            fontSize: 'inherit', // наследуем размер шрифта
                          }}
                        >
                          {props.children}
                        </a>
                      ),
                    }}
                  >
                    {book.text}
                  </ReactMarkdown>
                </Typography>
              </ListItem>
              {index < books.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default BooksPage;
