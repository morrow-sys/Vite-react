import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useContact } from '../../context/ContactContext';
import DeleteIcon from '@mui/icons-material/Delete';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ContactAdminPage = () => {
  const { contactData, loading, updating, updateContact, deleteContactImage } = useContact();

  const [form, setForm] = useState({
    phone: '',
    email: '',
    address: { ru: '', en: '', ky: '' },
  });
  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState([]);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

  useEffect(() => {
    if (contactData) {
      setForm({
        phone: contactData.phone || '',
        email: contactData.email || '',
        address: {
          ru: contactData.address?.ru || '',
          en: contactData.address?.en || '',
          ky: contactData.address?.ky || '',
        },
      });

      if (contactData.images?.length) {
        setPreview(contactData.images.map((img) => `${API_BASE_URL}/uploads/contact/${img}`));
      }
    }
  }, [contactData]);

  const handleChange = (e) => {
    const { name, value, dataset } = e.target;
    if (dataset.lang) {
      setForm((prev) => ({
        ...prev,
        address: { ...prev.address, [dataset.lang]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setPreview(selectedFiles.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('phone', form.phone);
    formData.append('email', form.email);
    formData.append('address_ru', form.address.ru);
    formData.append('address_en', form.address.en);
    formData.append('address_ky', form.address.ky);
    files.forEach((f) => formData.append('images', f));

    await updateContact(formData);
    setFiles([]);
  };

  const openDeleteModal = (img) => {
    setImageToDelete(img);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (imageToDelete) {
      await deleteContactImage(imageToDelete);
      setDeleteModalOpen(false);
      setImageToDelete(null);
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <CircularProgress />
        <Typography>Загрузка...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 700, margin: '20px auto' }}>
      <form onSubmit={handleSubmit}>
        {['ru', 'en', 'ky'].map((lang) => (
          <Box key={lang} sx={{ mb: 2 }}>
            <Typography sx={{ mb: 0.5 }}>Адрес ({lang})</Typography>
            <TextField
              value={form.address[lang] || ''}
              onChange={handleChange}
              fullWidth
              inputProps={{ 'data-lang': lang, name: 'address' }}
            />
          </Box>
        ))}

        <Typography sx={{ mb: 0.5 }}>Телефон</Typography>
        <TextField
          name="phone"
          value={form.phone || ''}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />

        <Typography sx={{ mb: 0.5 }}>Email</Typography>
        <TextField
          name="email"
          value={form.email || ''}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />

        <input type="file" multiple onChange={handleFileChange} style={{ marginBottom: 20 }} />

        {contactData.images?.length > 0 && (
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            {contactData.images.map((img, i) => (
              <Box key={i} sx={{ position: 'relative' }}>
                <img
                  src={`${API_BASE_URL}/uploads/contact/${img}`}
                  alt={`img-${i}`}
                  width={100}
                  height={100}
                  style={{ objectFit: 'cover', borderRadius: 4 }}
                />
                <IconButton
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    backgroundColor: 'rgba(255,0,0,0.8)',
                    color: 'white',
                    '&:hover': { backgroundColor: 'red' },
                  }}
                  onClick={() => openDeleteModal(img)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}

        <Button type="submit" variant="contained" disabled={updating}>
          {updating ? 'Сохраняем...' : 'Сохранить'}
        </Button>
      </form>

      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          Вы уверены, что хотите удалить это изображение?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)}>Отмена</Button>
          <Button color="error" onClick={confirmDelete}>Удалить</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContactAdminPage;
