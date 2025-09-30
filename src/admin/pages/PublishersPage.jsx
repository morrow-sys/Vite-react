import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { usePublishingSlider } from '../../context/PublishingSliderContext.jsx';

const PublishersPage = () => {
  const { publications, addPublication, deletePublication, loading } = usePublishingSlider();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImageFile(file);
  };

  const handleAdd = () => {
    if (!title.trim() || !description.trim() || !imageFile) return;
    addPublication({ title, description }, imageFile);
    setTitle('');
    setDescription('');
    setImageFile(null);
  };

  const handleOpenDialog = (index) => {
    setDeleteIndex(index);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    if (deleteIndex === null) return;
    const pub = publications[deleteIndex];
    deletePublication(pub.id || deleteIndex);
    setOpenDialog(false);
    setDeleteIndex(null);
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
    setDeleteIndex(null);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 4,
        height: '100vh',
        bgcolor: '#f5f5f5',
        overflow: 'hidden',
      }}
    >
      {/* Левая форма добавления */}
      <Paper
        sx={{
          width: 260,
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          borderRadius: 2,
          boxShadow: 4,
          flexShrink: 0,
          height: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Typography variant="h6" fontWeight="bold" textAlign="center">
          Добавить издателя
        </Typography>

        <Button variant="outlined" component="label" size="small">
          Выбрать изображение
          <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
        </Button>

        {imageFile && (
          <Typography variant="body2" noWrap>
            {imageFile.name}
          </Typography>
        )}

        <TextField
          label="Заголовок"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          size="small"
          fullWidth
        />

        <TextField
          label="Описание"
          multiline
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          size="small"
          fullWidth
          minRows={12}
          maxRows={12}
          sx={{
            '& textarea': {
              maxHeight: 360,
              overflowY: 'auto',
            },
          }}
        />

        <Button
          variant="contained"
          onClick={handleAdd}
          disabled={!title || !description || !imageFile}
          sx={{
            backgroundColor: '#141e28',
            color: '#fff',
            '&:hover': { backgroundColor: 'aqua' },
          }}
        >
          Добавить
        </Button>
      </Paper>

      {/* Правая колонка — список */}
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: 'white',
          borderRadius: 2,
          boxShadow: 4,
          p: 3,
          overflowY: 'auto',
          height: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Список издателей
        </Typography>

        {loading ? (
          <Typography textAlign="center" mt={4}>
            Загрузка...
          </Typography>
        ) : !publications?.length ? (
          <Typography textAlign="center" mt={4}>
            Публикации отсутствуют.
          </Typography>
        ) : (
          <Stack spacing={3}>
            {publications.map((item, index) => (
              <Paper
                key={item.id || index}
                sx={{
                  display: 'flex',
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  alignItems: 'flex-start',
                  maxHeight: 200,
                  position: 'relative',
                }}
              >
                <Box
                  component="img"
                  src={item.image}
                  alt={item.title}
                  sx={{ width: 180, height: 160, objectFit: 'cover', borderRadius: 1 }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom noWrap title={item.title}>
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      maxHeight: 100,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 5,
                      WebkitBoxOrient: 'vertical',
                    }}
                    title={item.description}
                  >
                    {item.description}
                  </Typography>
                </Box>
                <IconButton
                  aria-label="удалить"
                  color="error"
                  onClick={() => handleOpenDialog(index)}
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Paper>
            ))}
          </Stack>
        )}
      </Box>

      {/* Диалог удаления */}
      <Dialog open={openDialog} onClose={handleCancelDelete}>
        <DialogTitle>Удалить публикацию?</DialogTitle>
        <DialogContent>
          <Typography>Вы действительно хотите удалить эту публикацию? Действие нельзя будет отменить.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Отмена</Button>
          <Button color="error" onClick={handleConfirmDelete}>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PublishersPage;
