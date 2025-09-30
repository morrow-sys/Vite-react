import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  Button,
  Container,
  Paper,
  Typography,
  Stack,
  IconButton,
  Modal,
  Backdrop,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Linkify from 'linkify-react';

const BooksAdminPage = () => {
  const [books, setBooks] = useState([]);

  const [text, setText] = useState('');
  const [editId, setEditId] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [openLinkDialog, setOpenLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const textFieldRef = useRef(null);
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  // Загрузка книг с сервера при монтировании
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch('/api/books');
      if (!res.ok) throw new Error('Ошибка загрузки книг');
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      console.error(err);
      alert('Ошибка при загрузке книг');
    }
  };

  const addBook = async (text) => {
    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error('Ошибка при добавлении книги');
      const newBook = await res.json();
      setBooks((prev) => [newBook, ...prev]);
    } catch (err) {
      console.error(err);
      alert('Ошибка при добавлении книги');
    }
  };

  const updateBook = async (id, text) => {
    try {
      const res = await fetch(`/api/books/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error('Ошибка при обновлении книги');
      const updatedBook = await res.json();
      setBooks((prev) => prev.map((b) => (b.id === id ? updatedBook : b)));
    } catch (err) {
      console.error(err);
      alert('Ошибка при обновлении книги');
    }
  };

  const removeBook = async (id) => {
    try {
      const res = await fetch(`/api/books/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Ошибка при удалении книги');
      setBooks((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
      alert('Ошибка при удалении книги');
    }
  };

  // Обработчики из твоего оригинального кода ниже

  const handleOpenLinkDialog = () => {
    if (selection.start === selection.end) {
      alert('Пожалуйста, выделите текст, чтобы добавить ссылку.');
      return;
    }
    setLinkUrl('');
    setOpenLinkDialog(true);
  };

  const handleCloseLinkDialog = () => {
    setOpenLinkDialog(false);
  };

  const handleInsertLink = () => {
    if (!linkUrl.trim()) {
      alert('Введите URL ссылки.');
      return;
    }
    const selectedText = text.substring(selection.start, selection.end);
    const markdownLink = `[${selectedText}](${linkUrl.trim()})`;

    const newText =
      text.substring(0, selection.start) +
      markdownLink +
      text.substring(selection.end);

    setText(newText);
    setOpenLinkDialog(false);

    const newCursorPos = selection.start + markdownLink.length;
    setTimeout(() => {
      if (textFieldRef.current) {
        textFieldRef.current.selectionStart = newCursorPos;
        textFieldRef.current.selectionEnd = newCursorPos;
        textFieldRef.current.focus();
      }
    }, 0);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleSelect = (e) => {
    setSelection({
      start: e.target.selectionStart,
      end: e.target.selectionEnd,
    });
  };

  const handleSave = () => {
    if (!text.trim()) return;

    if (editId === null) {
      addBook(text);
    } else {
      updateBook(editId, text);
    }

    setText('');
    setEditId(null);
  };

  const handleEdit = (id) => {
    const book = books.find((b) => b.id === id);
    if (book) {
      setText(book.text);
      setEditId(id);
    }
  };

  const openDeleteConfirm = (id) => {
    setDeleteId(id);
    setOpenDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteId === null) return;
    removeBook(deleteId);
    setDeleteId(null);
    setOpenDeleteModal(false);

    if (editId === deleteId) {
      setEditId(null);
      setText('');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteId(null);
    setOpenDeleteModal(false);
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setText('');
  };

  return (
    <Container sx={{ py: 4, maxWidth: '800px', mx: 'auto' }}>
      <TextField
        inputRef={textFieldRef}
        label="Введите книгу"
        value={text}
        onChange={handleTextChange}
        onSelect={handleSelect}
        multiline
        rows={6}
        fullWidth
        variant="outlined"
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
        <Button variant="outlined" onClick={handleOpenLinkDialog}>
          Добавить ссылку
        </Button>
        {editId !== null && (
          <Button variant="text" color="error" onClick={handleCancelEdit}>
            Отмена
          </Button>
        )}
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{
            backgroundColor: '#141e28',
            '&:hover': {
              backgroundColor: 'aqua',
              color: '#141e28',
            },
          }}
        >
          {editId !== null ? 'Сохранить изменения' : 'Сохранить'}
        </Button>
      </Box>

      {books.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Сохранённые книги
          </Typography>
          <Stack spacing={2}>
            {books.map((record) => (
              <Paper
                key={record.id}
                elevation={3}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: '#fafafa',
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    flexGrow: 1,
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    component="div"
                  >
                    <Linkify
                      options={{ target: '_blank', rel: 'noopener noreferrer' }}
                    >
                      {record.text}
                    </Linkify>
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(record.id)}
                    aria-label="Редактировать"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => openDeleteConfirm(record.id)}
                    aria-label="Удалить"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Box>
      )}

      <Modal
        open={openDeleteModal}
        onClose={handleDeleteCancel}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: { timeout: 300 },
        }}
      >
        <Fade in={openDeleteModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 300,
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" mb={3}>
              Вы уверены, что хотите удалить запись?
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button variant="outlined" onClick={handleDeleteCancel}>
                Отмена
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteConfirm}
              >
                Удалить
              </Button>
            </Stack>
          </Box>
        </Fade>
      </Modal>

      <Dialog open={openLinkDialog} onClose={handleCloseLinkDialog}>
        <DialogTitle>Добавить ссылку</DialogTitle>
        <DialogContent>
          <InputLabel htmlFor="link-url-input" sx={{ mb: 1 }}>
            Введите URL ссылки
          </InputLabel>
          <OutlinedInput
            id="link-url-input"
            fullWidth
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://example.com"
            type="url"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLinkDialog}>Отмена</Button>
          <Button variant="contained" onClick={handleInsertLink}>
            Вставить
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BooksAdminPage;
