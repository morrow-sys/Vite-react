import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  Link,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';
import { useAuthors } from '../../context/forAuthorsContext';

const AuthorsPage = () => {
  const { files, addFile, deleteFile, moveFileUp, moveFileDown } = useAuthors();
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  
  // ref для кнопки удаления внутри модалки
  const deleteButtonRef = useRef(null);

  const handleAdd = async () => {
    if (!title.trim()) return alert('Введите название');
    await addFile(title, file);
    setTitle('');
    setFile(null);
  };

  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      await deleteFile(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  // Переносим фокус на кнопку "Удалить" при открытии модалки
  useEffect(() => {
    if (deleteTarget && deleteButtonRef.current) {
      deleteButtonRef.current.focus();
    }
  }, [deleteTarget]);

  return (
    <Box sx={{ p: 2, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" mb={4}>Управление файлами</Typography>

      <TextField
        label="Название"
        value={title}
        onChange={e => setTitle(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <input
        type="file"
        name="file"
        accept=".pdf,.doc,.docx"
        onChange={e => setFile(e.target.files[0])}
        style={{ marginBottom: 16 }}
      />

      <Button variant="contained" onClick={handleAdd}>
        Добавить
      </Button>

      <List sx={{ mt: 4 }}>
        {files.map((f, index) => (
          <ListItem
            key={f.id}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #ddd',
              py: 2,
              flexWrap: 'wrap',
            }}
          >
            <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
              {f.title} —{' '}
              {f.url ? (
                <Link href={f.url} target="_blank" rel="noopener noreferrer">
                  Открыть
                </Link>
              ) : (
                ''
              )}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                disabled={index === 0}
                onClick={() => moveFileUp(f.id)}
              >
                <ArrowUpward />
              </IconButton>

              <IconButton
                disabled={index === files.length - 1}
                onClick={() => moveFileDown(f.id)}
              >
                <ArrowDownward />
              </IconButton>

              <IconButton onClick={() => setDeleteTarget(f)}>
                <DeleteIcon color="error" />
              </IconButton>
            </Box>
          </ListItem>
        ))}
      </List>

      {/* Модальное окно подтверждения удаления */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">
          Удалить файл "{deleteTarget?.title}"?
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>
            Отмена
          </Button>
          <Button
            color="error"
            onClick={handleConfirmDelete}
            ref={deleteButtonRef}
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AuthorsPage;
