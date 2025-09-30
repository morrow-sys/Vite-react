import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const defaultForm = {
  title: { ru: '', en: '', ky: '' },
  description: { ru: '', en: '', ky: '' },
  date: '',
};

const NewsAdminPage = () => {
  const { newsItems, loading, addNews, updateNews, deleteNews } = useNews();
  const [form, setForm] = useState(defaultForm);
  const [file, setFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ visible: false, id: null });

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const formatInputDate = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleChange = (e) => {
    const { name, value, dataset } = e.target;
    if (dataset.lang) {
      setForm((prev) => ({
        ...prev,
        [name]: { ...prev[name], [dataset.lang]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateNews(editingId, form, file);
    } else {
      await addNews(form, file);
    }
    setForm(defaultForm);
    setFile(null);
    setEditingId(null);
  };

  const startEdit = (news) => {
    setEditingId(news.id);
    setForm({
      title: news.title || { ru: '', en: '', ky: '' },
      description: news.description || { ru: '', en: '', ky: '' },
      date: formatInputDate(news.date),
    });
    setFile(null);
  };

  const confirmDelete = async () => {
    await deleteNews(deleteModal.id);
    setDeleteModal({ visible: false, id: null });
  };

  return (
    <div style={{ maxWidth: 900, margin: '20px auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 30 }}>Управление новостями</h1>

      {/* Форма добавления/редактирования */}
      <form
        onSubmit={handleSubmit}
        style={{ marginBottom: 40, background: '#f9f9f9', padding: 20, borderRadius: 8 }}
      >
        <h3 style={{ marginBottom: 20 }}>{editingId ? 'Редактировать новость' : 'Добавить новость'}</h3>

        {['ru', 'en', 'ky'].map((lang) => (
          <div key={lang}>
            <div style={{ marginBottom: 15 }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 6 }}>
                Название ({lang.toUpperCase()}):
              </label>
              <input
                name="title"
                data-lang={lang}
                value={form.title[lang] || ''}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #ccc', borderRadius: 4, fontSize: 14 }}
              />
            </div>

            <div style={{ marginBottom: 15 }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 6 }}>
                Описание ({lang.toUpperCase()}):
              </label>
              <textarea
                name="description"
                data-lang={lang}
                value={form.description[lang] || ''}
                onChange={handleChange}
                required
                rows={3}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #ccc', borderRadius: 4, fontSize: 14, resize: 'vertical' }}
              />
            </div>
          </div>
        ))}

        <div style={{ marginBottom: 15 }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 6 }}>Дата:</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #ccc', borderRadius: 4, fontSize: 14 }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 6 }}>Изображение:</label>
          <input type="file" onChange={handleFileChange} />
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            type="submit"
            style={{ backgroundColor: '#007BFF', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold' }}
          >
            {editingId ? 'Обновить' : 'Добавить'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => { setForm(defaultForm); setFile(null); setEditingId(null); }}
              style={{ backgroundColor: '#6c757d', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold' }}
            >
              Отмена
            </button>
          )}
        </div>
      </form>

      {/* Список новостей */}
      <h2 style={{ marginBottom: 15 }}>Список новостей</h2>
      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <div>
          {newsItems.map((news) => (
            <div key={news.id} style={{ background: '#fff', padding: 16, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0 }}>{news.title?.ru || ''}</h3>
                <p style={{ margin: '4px 0', fontSize: 14, color: '#555' }}>{formatDate(news.date)}</p>
                <p style={{ marginTop: 10 }}>{(news.description?.ru || '').slice(0, 50)}{news.description?.ru && news.description.ru.length > 50 && '...'}</p>
              </div>

              {news.image && (
                <img
                  src={`${BASE_URL}${news.image}`}
                  alt=""
                  style={{ width: 100, height: 60, borderRadius: 4, objectFit: 'cover' }}
                />
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <button
                  onClick={() => startEdit(news)}
                  style={{ backgroundColor: '#28a745', color: '#fff', padding: '6px 12px', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Редактировать
                </button>
                <button
                  onClick={() => setDeleteModal({ visible: true, id: news.id })}
                  style={{ backgroundColor: '#dc3545', color: '#fff', padding: '6px 12px', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteModal.visible && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#fff', padding: 30, borderRadius: 8, minWidth: 300, textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
            <p style={{ fontSize: 16, marginBottom: 20 }}>Удалить эту новость?</p>
            <button
              onClick={confirmDelete}
              style={{ backgroundColor: '#dc3545', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: 4, fontWeight: 'bold', marginRight: 10 }}
            >
              Да, удалить
            </button>
            <button
              onClick={() => setDeleteModal({ visible: false, id: null })}
              style={{ backgroundColor: '#6c757d', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: 4, fontWeight: 'bold' }}
            >
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsAdminPage;
