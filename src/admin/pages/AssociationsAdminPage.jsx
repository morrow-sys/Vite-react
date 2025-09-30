import React, { useContext, useState, useRef } from 'react';
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
import { AssociationsContext } from '../../context/AssociationsContext';

const AssociationsAdminPage = () => {
  const { associations, addAssociation, updateAssociation, removeAssociation } = useContext(AssociationsContext);

  const [text, setText] = useState('');
  const [editId, setEditId] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Для модального окна добавления ссылки
  const [openLinkDialog, setOpenLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  
  // Для хранения позиции выделения текста в TextField
  const textFieldRef = useRef(null);
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  // Открываем окно добавления ссылки
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

  // Вставляем Markdown ссылку на выделенный текст
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

    // Поставим курсор после вставленной ссылки
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

  // Обновляем позицию выделения при выделении текста
  const handleSelect = (e) => {
    setSelection({
      start: e.target.selectionStart,
      end: e.target.selectionEnd,
    });
  };

  // Теперь асинхронные операции с обработкой ошибок
  const handleSave = async () => {
    if (!text.trim()) return;

    try {
      if (editId === null) {
        await addAssociation(text);
      } else {
        await updateAssociation(editId, text);
      }
      setText('');
      setEditId(null);
    } catch (error) {
      alert('Произошла ошибка при сохранении ассоциации.');
      console.error(error);
    }
  };

  const handleEdit = (id) => {
    const assoc = associations.find((a) => a.id === id);
    if (assoc) {
      setText(assoc.text);
      setEditId(id);
    }
  };

  const openDeleteConfirm = (id) => {
    setDeleteId(id);
    setOpenDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteId === null) return;

    try {
      await removeAssociation(deleteId);
      setDeleteId(null);
      setOpenDeleteModal(false);

      if (editId === deleteId) {
        setEditId(null);
        setText('');
      }
    } catch (error) {
      alert('Произошла ошибка при удалении ассоциации.');
      console.error(error);
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
        label="Введите ассоциацию"
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

      {associations.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Сохранённые ассоциации
          </Typography>
          <Stack spacing={2}>
            {associations.map((record) => (
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
                <Box sx={{ flexGrow: 1, wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                  <Typography variant="body2" color="text.secondary" component="div">
                    <Linkify options={{ target: '_blank', rel: 'noopener noreferrer' }}>
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

      {/* Модалка подтверждения удаления */}
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
              <Button variant="contained" color="error" onClick={handleDeleteConfirm}>
                Удалить
              </Button>
            </Stack>
          </Box>
        </Fade>
      </Modal>

      {/* Диалог добавления ссылки */}
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

export default AssociationsAdminPage;
