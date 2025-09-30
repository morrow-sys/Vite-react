  import React from 'react';
  import { Outlet, Link, useMatch } from 'react-router-dom';
  import { Box, Button, ButtonGroup } from '@mui/material';
  
  const JournalsAdminPage = () => {
    // проверяем каждый путь
    const matchJournals = useMatch({ path: '/admin/journals/journals', end: true });
    const matchCategories = useMatch({ path: '/admin/journals/categories', end: true });
    const matchArticles = useMatch({ path: '/admin/journals/articles', end: true });
  
    const showOnlyBackButton = matchJournals || matchCategories || matchArticles;
  
    return (
      <Box sx={{ p: 3 }}>
        <ButtonGroup variant="outlined" sx={{ mb: 3 }}>
          {!showOnlyBackButton ? (
            <>
              <Button component={Link} to="journals">Журналы</Button>
              <Button component={Link} to="categories">Категории</Button>
              <Button component={Link} to="articles">Статьи</Button>
            </>
          ) : (
            <Button component={Link} to="/admin/journals">
              ← Назад
            </Button>
          )}
        </ButtonGroup>
  
        <Outlet />
      </Box>
    );
  };
  
  export default JournalsAdminPage;
