import React, { useContext, useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { JournalsContext } from '../../../context/JournalsContext';

const languages = ['ru', 'en', 'kg'];
const langLabels = { ru: 'Русский', en: 'Английский', kg: 'Кыргызский' };

const initialData = {
  abbreviation: '',
  about: { ru: '', en: '', kg: '' },
  editorialBoard: { ru: '', en: '', kg: '' },
  indexing: { ru: '', en: '', kg: '' },
  name: '',
};

const FormattingButtons = ({ value, onChange, inputRef, openLinkDialog }) => {
  const wrapSelection = (tag) => {
    const input = inputRef.current;
    if (!input) return;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    if (start === end) return;
    const selectedText = value.slice(start, end);
    const newText = value.slice(0, start) + `<${tag}>${selectedText}</${tag}>` + value.slice(end);
    onChange(newText);
  };

  const centerText = () => {
    const input = inputRef.current;
    if (!input) return;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    if (start === end) return;
    const selectedText = value.slice(start, end);
    const newText =
      value.slice(0, start) +
      `<div style="text-align:center">${selectedText}</div>` +
      value.slice(end);
    onChange(newText);
  };

  const clearFormatting = () => {
    const input = inputRef.current;
    if (!input) return;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    if (start === end) return;
    const selectedText = value.slice(start, end).replace(/<\/?[^>]+(>|$)/g, '');
    const newText = value.slice(0, start) + selectedText + value.slice(end);
    onChange(newText);
  };

  return (
    <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
      <Button variant="outlined" size="small" onClick={() => wrapSelection('b')}>
        Жирный
      </Button>
      <Button variant="outlined" size="small" onClick={centerText}>
        Центр
      </Button>
      <Button variant="outlined" size="small" onClick={openLinkDialog}>
        Ссылка
      </Button>
      <Button variant="outlined" size="small" color="error" onClick={clearFormatting}>
        Очистить
      </Button>
    </Stack>
  );
};

const JournalsSection = () => {
  const {
    journalList,
    selectedJournal,
    fetchJournalById,
    setSelectedJournal,
    createJournal,
    deleteJournal,
    updateJournal,
    loading,
    error,
    setError,
  } = useContext(JournalsContext);

  const [newJournalName, setNewJournalName] = useState('');
  const [newJournalAbbreviation, setNewJournalAbbreviation] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(initialData);
  const [dialog, setDialog] = useState({ open: false, title: '', message: '', onConfirm: null });

  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkURL, setLinkURL] = useState('');
  const [linkTarget, setLinkTarget] = useState({ section: '', lang: '' });
  const inputRefs = useRef({});

  const openDialog = (title, message, onConfirm = null) =>
    setDialog({ open: true, title, message, onConfirm });
  const closeDialog = () => {
    setDialog({ open: false, title: '', message: '', onConfirm: null });
    setError(null);
  };
  const confirmDialog = () => {
    if (dialog.onConfirm) dialog.onConfirm();
    closeDialog();
  };

  useEffect(() => {
    if (selectedJournal) {
      setFormData({
        abbreviation: selectedJournal.abbreviation || '',
        about: selectedJournal.about || { ru: '', en: '', kg: '' },
        editorialBoard: selectedJournal.editorialBoard || { ru: '', en: '', kg: '' },
        indexing: selectedJournal.indexing || { ru: '', en: '', kg: '' },
        name: selectedJournal.name || '',
      });
      setEditMode(false);
    } else setFormData(initialData);
  }, [selectedJournal]);

  const handleAddJournal = async () => {
    const trimmedName = newJournalName.trim();
    const trimmedAbbr = newJournalAbbreviation.trim();
    if (!trimmedName) return openDialog('Ошибка', 'Введите название журнала');

    const alreadyExists = journalList?.some(
      (j) => j.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (alreadyExists) return openDialog('Ошибка', 'Журнал с таким именем уже существует');

    const created = await createJournal({ name: trimmedName, abbreviation: trimmedAbbr });
    if (created) {
      setNewJournalName('');
      setNewJournalAbbreviation('');
      openDialog('Успех', 'Журнал успешно добавлен');
    }
  };

  const handleDeleteJournal = (journal) =>
    openDialog(
      'Удалить журнал',
      `Вы уверены, что хотите удалить "${journal.name}"? Это действие необратимо.`,
      async () => {
        await deleteJournal(journal.id);
        openDialog('Удалено', `Журнал "${journal.name}" успешно удалён.`);
      }
    );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleLangChange = (section, lang, value) =>
    setFormData((prev) => ({ ...prev, [section]: { ...prev[section], [lang]: value } }));

  const handleSave = async () => {
    if (!selectedJournal) return openDialog('Ошибка', 'Выберите журнал перед сохранением');
    const dataToSend = { ...formData, name: formData.name || selectedJournal.name };
    try {
      const success = await updateJournal(selectedJournal.id, dataToSend);
      if (success) {
        openDialog('Успех', 'Данные журнала успешно сохранены');
        setEditMode(false);
      } else openDialog('Ошибка', 'Не удалось сохранить данные журнала');
    } catch {
      openDialog('Ошибка', 'Произошла ошибка при сохранении данных');
    }
  };

  const openLinkDialog = (section, lang) => {
    setLinkTarget({ section, lang });
    setLinkDialogOpen(true);
    setLinkURL('');
  };

  const insertLink = () => {
    const { section, lang } = linkTarget;
    const input = inputRefs.current[`${section}-${lang}`];
    if (!input) return;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    if (start === end) {
      setLinkDialogOpen(false);
      return;
    }
    const selectedText = formData[section][lang].slice(start, end);
    const newText =
      formData[section][lang].slice(0, start) +
      `<a href="${linkURL}" target="_blank" rel="noopener noreferrer">${selectedText}</a>` +
      formData[section][lang].slice(end);
    handleLangChange(section, lang, newText);
    setLinkDialogOpen(false);
  };

  if (loading)
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
        Журналы
      </Typography>

      {selectedJournal ? (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Button variant="outlined" onClick={() => setSelectedJournal(null)}>
              ← Назад
            </Button>
            {!editMode && (
              <Button variant="outlined" onClick={() => setEditMode(true)} startIcon={<EditIcon />}>
                Редактировать
              </Button>
            )}
          </Box>

          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
            {selectedJournal.name}
          </Typography>
          <Typography sx={{ fontWeight: 'bold', mb: 3, ml: 3 }}>
            <strong>Аббревиатура:</strong> {formData.abbreviation}
          </Typography>

          {!editMode ? (
            <Box>
              {['about', 'editorialBoard', 'indexing'].map((key) => (
                <Box key={key} mt={2}>
                  <Typography
                    variant="h6"
                    sx={{ mb: 2, mt: 4, textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase' }}
                  >
                    {key === 'about'
                      ? 'О журнале'
                      : key === 'editorialBoard'
                      ? 'Редакционная коллегия'
                      : 'Индексация'}
                  </Typography>
                  {languages.map((lang) => (
                    <Typography
                      key={lang}
                      sx={{
                        mx: 3,
                        my: 1,
                        textAlign: lang === 'ru' ? 'left' : 'center',
                        fontWeight: lang === 'ru' ? 'bold' : 'normal',
                      }}
                      dangerouslySetInnerHTML={{ __html: formData[key][lang] }}
                    />
                  ))}
                </Box>
              ))}
            </Box>
          ) : (
            <Box sx={{ px: 3 }}>
              <TextField label="Название" name="name" fullWidth value={formData.name} onChange={handleChange} sx={{ mb: 3, mt: 1 }} />
              <TextField label="Аббревиатура" name="abbreviation" fullWidth value={formData.abbreviation} onChange={handleChange} sx={{ mb: 3 }} />
              {['about', 'editorialBoard', 'indexing'].map((section) => (
                <Box key={section} sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', textTransform: 'uppercase' }}>
                    {section === 'about' ? 'О журнале' : section === 'editorialBoard' ? 'Редакционная коллегия' : 'Индексация'}
                  </Typography>
                  {languages.map((lang) => (
                    <Box key={lang}>
                      <FormattingButtons
                        value={formData[section][lang]}
                        onChange={(val) => handleLangChange(section, lang, val)}
                        inputRef={(inputRefs.current[`${section}-${lang}`] = React.createRef()) && inputRefs.current[`${section}-${lang}`]}
                        openLinkDialog={() => openLinkDialog(section, lang)}
                      />
                      <TextField
                        inputRef={inputRefs.current[`${section}-${lang}`]}
                        label={`${langLabels[lang]} (${lang})`}
                        multiline
                        minRows={2}
                        fullWidth
                        value={formData[section][lang]}
                        onChange={(e) => handleLangChange(section, lang, e.target.value)}
                        sx={{ mb: 1 }}
                        onSelect={(e) => (inputRefs.current[`${section}-${lang}`] = e.target)}
                      />
                    </Box>
                  ))}
                </Box>
              ))}
              <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
                <Button variant="outlined" onClick={() => setEditMode(false)}>
                  Отмена
                </Button>
                <Button variant="contained" onClick={handleSave}>
                  Сохранить
                </Button>
              </Stack>
            </Box>
          )}
        </Paper>
      ) : (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1 }}>
            <TextField label="Название нового журнала" value={newJournalName} onChange={(e) => setNewJournalName(e.target.value)} fullWidth />
            <TextField label="Аббревиатура" value={newJournalAbbreviation} onChange={(e) => setNewJournalAbbreviation(e.target.value)} sx={{ width: 150 }} />
            <Button variant="contained" onClick={handleAddJournal}>
              Добавить
            </Button>
          </Box>
          {journalList.length === 0 ? (
            <Typography>Список журналов пуст</Typography>
          ) : (
            <Stack spacing={1}>
              {journalList.map((journal) => (
                <Paper
                  key={journal.id}
                  sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', '&:hover': { backgroundColor: '#f0f0f0' } }}
                  onClick={() => fetchJournalById(journal.id)}
                >
                  <Typography sx={{ fontWeight: 'bold' }}>{journal.name}</Typography>
                  <Typography sx={{ fontStyle: 'italic', mr: 1 }}>{journal.abbreviation}</Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon fontSize="small" />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteJournal(journal);
                    }}
                    sx={{
                      ml: 1,
                      minWidth: 'auto',
                      px: 1.2,
                      py: 0.3,
                      fontSize: '0.75rem',
                    }}
                  >
                    Удалить
                  </Button>
                </Paper>
              ))}
            </Stack>
          )}
        </Box>
      )}

      {/* Диалоги */}
      <Dialog open={dialog.open} onClose={closeDialog}>
        <DialogTitle>{dialog.title}</DialogTitle>
        <DialogContent>
          <Typography>{dialog.message}</Typography>
          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Закрыть</Button>
          {dialog.onConfirm && <Button onClick={confirmDialog}>Подтвердить</Button>}
        </DialogActions>
      </Dialog>

      {/* Вставка ссылки */}
      <Dialog open={linkDialogOpen} onClose={() => setLinkDialogOpen(false)}>
        <DialogTitle>Вставить ссылку</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="URL" value={linkURL} onChange={(e) => setLinkURL(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLinkDialogOpen(false)}>Отмена</Button>
          <Button onClick={insertLink} variant="contained">
            Вставить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JournalsSection;
