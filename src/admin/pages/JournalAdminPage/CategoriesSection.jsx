import React, { useContext, useState } from 'react';
import { CategoriesContext } from '../../../context/СategoriesContext';
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  CircularProgress,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';

const CategoriesSection = () => {
  const {
    categories,
    createCategory,
    updateCategory,
    deleteCategory,
    selectedCategory,
    setSelectedCategory,
    loading,
    error,
  } = useContext(CategoriesContext);

  const [newCategoryName, setNewCategoryName] = useState('');
  const [editName, setEditName] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    await createCategory(newCategoryName.trim());
    setNewCategoryName('');
  };

  const handleUpdateCategory = async (id) => {
    if (!editName.trim()) return;
    await updateCategory(id, editName.trim());
    setEditName('');
    setSelectedCategory(null);
  };

  const handleDeleteCategory = async (id) => {
    await deleteCategory(id);
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
    if (selectedCategory?.id === id) setSelectedCategory(null);
  };

  const openDeleteDialog = (category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 3 }}>
      <Typography variant="h4" mb={3}>Категории</Typography>

      {/* Поле добавления категории */}
      <Paper sx={{ p: 2, mb: 3 }} elevation={3}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            label="Новая категория"
            variant="outlined"
            fullWidth
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <Button
            variant="contained"
            sx={{ minWidth: 150 }}
            onClick={handleAddCategory}
            disabled={loading}
          >
            {loading ? 'Сохраняем...' : 'Добавить'}
            {loading && (
              <CircularProgress
                size={24}
                sx={{
                  color: 'white',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }}
              />
            )}
          </Button>
        </Stack>
        {error && <Typography color="error" mt={1}>{error}</Typography>}
      </Paper>

      {/* Список категорий */}
      <Paper sx={{ p: 2 }} elevation={3}>
        <Stack spacing={2}>
          {categories.map((cat) => (
            <Box key={cat.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {selectedCategory?.id === cat.id ? (
                <>
                  <TextField
                    variant="outlined"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    fullWidth
                  />
                  <Button
                    variant="contained"
                    onClick={() => handleUpdateCategory(cat.id)}
                    disabled={loading}
                  >
                    Сохранить
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setSelectedCategory(null)}
                  >
                    Отмена
                  </Button>
                </>
              ) : (
                <>
                  <Typography sx={{ flex: 1 }}>{cat.name}</Typography>
                  <Button
                    variant="outlined"
                    onClick={() => { setSelectedCategory(cat); setEditName(cat.name); }}
                  >
                    Редактировать
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => openDeleteDialog(cat)}
                  >
                    Удалить
                  </Button>
                </>
              )}
            </Box>
          ))}
        </Stack>
      </Paper>

      {/* Модальное окно для подтверждения удаления */}
      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>Вы уверены, что хотите удалить категорию "{categoryToDelete?.name}"?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Отмена</Button>
          <Button
            onClick={() => handleDeleteCategory(categoryToDelete.id)}
            color="error"
            variant="contained"
            disabled={loading}
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoriesSection;
