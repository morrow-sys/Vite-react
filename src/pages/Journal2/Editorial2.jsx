import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

function Editorial2   () {
  const { t, i18n } = useTranslation();
  const [journal, setJournal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentLang, setCurrentLang] = useState(i18n.language?.slice(0, 2) || 'ru');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const JOURNAL_URL = `${API_BASE_URL}/api/journals/by-abbreviation/ivk`; // /api добавлено

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(JOURNAL_URL, { headers: { 'Content-Type': 'application/json' } });
        if (!res.ok) throw new Error(`${t('serverError')}: ${res.status}`);
        const data = await res.json();
        setJournal(data);
        setLoading(false);
      } catch (e) {
        setError(e.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [JOURNAL_URL, t]);

  useEffect(() => {
    const onLanguageChanged = (lng) => setCurrentLang(lng.slice(0, 2));
    i18n.on('languageChanged', onLanguageChanged);
    return () => i18n.off('languageChanged', onLanguageChanged);
  }, [i18n]);

  if (loading) return <div style={{ textAlign: 'center' }}>{t('loading') || 'Загрузка...'}</div>;
  if (error) return <div style={{ textAlign: 'center', color: 'red' }}>{t('error')}: {error}</div>;
  if (!journal) return <div style={{ textAlign: 'center' }}>{t('dataNotFound') || 'Данные не найдены'}</div>;

  const editorialRaw = journal.editorialBoard || journal.editorialboard || journal.editorial_board || {};
  const editorialBoard =
    typeof editorialRaw === 'string'
      ? { ru: editorialRaw, en: '', kg: '' }
      : editorialRaw;

  const currentText = editorialBoard[currentLang] || editorialBoard['ru'] || null;

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2 style={{ marginBottom: '10px', color: '#00b5ad' }}>
        {journal.name || t('journalNameMissing') || 'Название отсутствует'}
      </h2>

      <h3
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
        }}
      >
        <span style={{ flex: 1, height: '1px', backgroundColor: '#ccc', marginRight: '10px' }} />
        {t('editorialboard') || 'Редколлегия'}
        <span style={{ flex: 1, height: '1px', backgroundColor: '#ccc', marginLeft: '10px' }} />
      </h3>

      {currentText ? (
        <div style={{ marginTop: 10, textAlign: 'left', maxWidth: 800, margin: '10px auto' }}>
          <p style={{ textAlign: 'justify', whiteSpace: 'pre-wrap' }}>{currentText}</p>
        </div>
      ) : (
        <div style={{ height: 10 }} />
      )}
    </div>
  );
}

export default Editorial2;
