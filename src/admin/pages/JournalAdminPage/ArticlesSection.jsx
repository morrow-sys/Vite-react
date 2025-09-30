import React, { useState, useEffect, useContext } from 'react';
import {
  Box, Button, TextField, Typography, Stack, Paper,
  TableContainer, Table, TableHead, TableBody, TableRow, TableCell, TablePagination,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { ArticlesContext } from '../../../context/ArticlesContext';
import { JournalsContext } from '../../../context/JournalsContext';
import { CategoriesContext } from '../../../context/СategoriesContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const languages = ['ru', 'en', 'kg'];
const languageLabels = { ru: 'Русский', en: 'Английский', kg: 'Кыргызский' };

const getInitialArticleState = () => ({
  id: null,
  journalAbbr: '',
  category: '',
  year: '',
  issueNumber: '',
  subIssueNumber: '',
  doi: '',
  titles: { ru: '', en: '', kg: '' },
  authors: { ru: '', en: '', kg: '' },
  abstracts: { ru: '', en: '', kg: '' },
  keywords: { ru: '', en: '', kg: '' },
  authorsInfo: { ru: '', en: '', kg: '' },
  udc: { ru: '', en: '', kg: '' },
  pageStart: '',
  pageEnd: '',
  pdfFileName: null,
});

const ArticlesSection = () => {
  const { articles, createArticle, updateArticle, deleteArticle, fetchArticles } = useContext(ArticlesContext);
  const { journalList } = useContext(JournalsContext);
  const { categories } = useContext(CategoriesContext);

  const [article, setArticle] = useState(getInitialArticleState());
  const [selectedJournal, setSelectedJournal] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [bulkText, setBulkText] = useState('');

  // Диалог подтверждения удаления
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('_')) {
      const [field, lang] = name.split('_');
      setArticle(prev => ({ ...prev, [field]: { ...prev[field], [lang]: value } }));
    } else {
      setArticle(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await updateArticle(article.id, article, file);
    } else {
      await createArticle(article, file);
    }
    setArticle(getInitialArticleState());
    setFile(null);
    setShowForm(false);
    setIsEditing(false);
  };

  const handleEdit = (a) => {
    setArticle(a);
    setIsEditing(true);
    setShowForm(true);
    setFile(null);
  };

  const handleCancel = () => {
    setArticle(getInitialArticleState());
    setFile(null);
    setShowForm(false);
    setIsEditing(false);
  };

  const filteredArticles = selectedJournal === 'all'
    ? articles
    : articles.filter(a => a.journalAbbr === selectedJournal);

  const handleDeleteClick = (id) => {
    setDeleteDialog({ open: true, id });
  };

  const confirmDelete = async () => {
    await deleteArticle(deleteDialog.id);
    setDeleteDialog({ open: false, id: null });
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Статьи</Typography>
        {!showForm && <Button variant="contained" size="small" onClick={() => setShowForm(true)}>Добавить статью</Button>}
      </Stack>

      {!showForm && (
        <TextField
          select
          label="Фильтр по журналу"
          value={selectedJournal}
          onChange={e => setSelectedJournal(e.target.value)}
          SelectProps={{ native: true }}
          sx={{ width: 300 }}
        >
          <option value="all">Все</option>
          {journalList.map(j => <option key={j.id} value={j.abbreviation}>{j.name}</option>)}
        </TextField>
      )}

      {showForm && (
        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Stack direction="row" spacing={3}>
              <Stack spacing={3} flex={1}>
                <TextField
                  select
                  label="Журнал"
                  name="journalAbbr"
                  value={article.journalAbbr}
                  onChange={handleChange}
                  SelectProps={{ native: true }}
                  fullWidth
                  required
                >
                  <option value="">Выберите журнал</option>
                  {journalList.map(j => <option key={j.id} value={j.abbreviation}>{j.name}</option>)}
                </TextField>

                <TextField
                  select
                  label="Категория"
                  name="category"
                  value={article.category}
                  onChange={handleChange}
                  SelectProps={{ native: true }}
                  fullWidth
                  required
                >
                  <option value="">Выберите категорию</option>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </TextField>

                <Stack direction="row" spacing={2}>
                  <TextField label="Год" name="year" value={article.year} onChange={handleChange} fullWidth required />
                  <TextField label="Выпуск" name="issueNumber" value={article.issueNumber} onChange={handleChange} fullWidth required />
                  <TextField label="Подвыпуск" name="subIssueNumber" value={article.subIssueNumber} onChange={handleChange} fullWidth />
                </Stack>

                <TextField label="DOI" name="doi" value={article.doi} onChange={handleChange} fullWidth />

                {languages.map(lang => {
                  const bgColor = lang === 'ru' ? 'rgba(173,216,230,0.3)' :
                                  lang === 'en' ? 'rgba(144,238,144,0.3)' : 'rgba(255,255,153,0.3)';
                  return (
                    <Paper key={lang} variant="outlined" sx={{ p: 2, backgroundColor: bgColor }}>
                      <Typography variant="subtitle1" sx={{ mb: 1 }}>{languageLabels[lang]}</Typography>
                      <Stack spacing={2}>
                        <TextField label="Название" name={`titles_${lang}`} value={article.titles[lang]} onChange={handleChange} fullWidth />
                        <TextField label="Автор(ы)" name={`authors_${lang}`} value={article.authors[lang]} onChange={handleChange} fullWidth />
                        <TextField label="Аннотация" name={`abstracts_${lang}`} value={article.abstracts[lang]} onChange={handleChange} fullWidth multiline rows={6} />
                        <TextField label="Ключевые слова" name={`keywords_${lang}`} value={article.keywords[lang]} onChange={handleChange} fullWidth />
                        <TextField label="Информация об авторах" name={`authorsInfo_${lang}`} value={article.authorsInfo[lang]} onChange={handleChange} fullWidth />
                        <TextField label="УДК" name={`udc_${lang}`} value={article.udc[lang]} onChange={handleChange} fullWidth />
                      </Stack>
                    </Paper>
                  );
                })}

                <Stack direction="row" spacing={2} alignItems="center">
                  <TextField type="number" label="Стартовая страница" name="pageStart" value={article.pageStart} onChange={handleChange} />
                  <TextField type="number" label="Конечная страница" name="pageEnd" value={article.pageEnd} onChange={handleChange} />
                </Stack>

                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Полнотекстовая версия:</Typography>
                  <Stack direction="column" spacing={1} sx={{ border: '1px solid #ccc', p: 2, borderRadius: 1 }}>
                    <Typography variant="body2">
                      На данный момент:{' '}
                      {article.pdfFileName ? (
                        <a
                          href={`${API_BASE_URL}/uploads/articles/${article.pdfFileName}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {article.pdfFileName}
                        </a>
                      ) : '-'}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2">Изменить:</Typography>
                      <Button variant="outlined" component="label" size="small">
                        Выберите файл
                        <input type="file" hidden accept=".pdf" onChange={handleFileChange} />
                      </Button>
                      <Typography variant="body2">{file ? file.name : 'Файл не выбран'}</Typography>
                      {file && <Button variant="contained" size="small" onClick={handleSubmit}>Сохранить</Button>}
                    </Stack>
                  </Stack>
                </Box>

                <Stack direction="row" spacing={2}>
                  <Button type="submit" variant="contained">{isEditing ? 'Сохранить' : 'Добавить'}</Button>
                  <Button variant="outlined" onClick={handleCancel}>Отмена</Button>
                </Stack>
              </Stack>

              <TextField
                label="Поле для вставки текста"
                multiline
                rows={93}
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder="Вставьте сюда текст для просмотра..."
                fullWidth
                sx={{ flex: 1 }}
              />
            </Stack>
          </form>
        </Paper>
      )}

      {!showForm && (
        <Paper sx={{ p: 2 }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Название (рус)</TableCell>
                  <TableCell>Автор(ы) (рус)</TableCell>
                  <TableCell>УДК (рус)</TableCell>
                  <TableCell>Журнал</TableCell>
                  <TableCell>Год</TableCell>
                  <TableCell>Выпуск</TableCell>
                  <TableCell>Страницы</TableCell>
                  <TableCell>Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredArticles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(a => (
                  <TableRow key={a.id} hover>
                    <TableCell sx={{ cursor: 'pointer', color: 'primary.main', textDecoration: 'underline' }} onClick={() => handleEdit(a)}>
                      {a.titles?.ru || '-'}
                    </TableCell>
                    <TableCell>{a.authors?.ru || '-'}</TableCell>
                    <TableCell>{a.udc?.ru || '-'}</TableCell>
                    <TableCell>{a.journalName || '-'}</TableCell>
                    <TableCell>{a.year || '-'}</TableCell>
                    <TableCell>{a.issueNumber || '-'}</TableCell>
                    <TableCell>{a.pageStart && a.pageEnd ? `${a.pageStart}-${a.pageEnd}` : '-'}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(a.id)}
                      >
                        Удалить
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={filteredArticles.length}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0); }}
            />
          </TableContainer>
        </Paper>
      )}

      {/* Диалог удаления */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null })}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>Вы уверены, что хотите удалить эту статью?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, id: null })}>Отмена</Button>
          <Button color="error" onClick={confirmDelete}>Удалить</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ArticlesSection;
