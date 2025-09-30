import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const Indexing2 = () => {
  const { t, i18n } = useTranslation();
  const [indexing, setIndexing] = useState(null);
  const [journalName, setJournalName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentLang, setCurrentLang] = useState(i18n.language?.slice(0, 2) || 'ru');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const JOURNAL_URL = `${API_BASE_URL}/api/journals/by-abbreviation/ivk`; // /api обязательно

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(JOURNAL_URL, {
          headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) throw new Error(`${t('serverError')}: ${res.status}`);
        const data = await res.json();

        setJournalName(data.name || '');

        let parsedIndexing = null;
        if (data.indexing) {
          parsedIndexing = typeof data.indexing === 'string' ? JSON.parse(data.indexing) : data.indexing;
        }

        setIndexing(parsedIndexing);
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

  const indexingText = indexing?.[currentLang] || indexing?.['ru'] || null;
  if (!indexingText) return <div style={{ textAlign: 'center' }}>{t('indexingMissing') || 'Индексация отсутствует'}</div>;

  // Разбивка текста на строки и ссылки
  const renderText = (text) => {
    return text.split('\n').map((line, idx) => {
      const parts = line.split(/(https?:\/\/[^\s]+)/g);
      return (
        <div key={idx} style={{ marginBottom: '0.5em', textAlign: 'justify' }}>
          {parts.map((part, i) =>
            /^https?:\/\//.test(part) ? (
              <a
                key={i}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#1976d2', wordBreak: 'break-all' }}
              >
                {part}
              </a>
            ) : (
              part
            )
          )}
        </div>
      );
    });
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2 style={{ marginBottom: '10px', color: '#00b5ad' }}>
        {journalName || t('journalNameMissing') || 'Название отсутствует'}
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
        {t('indexing') || 'Индексация'}
        <span style={{ flex: 1, height: '1px', backgroundColor: '#ccc', marginLeft: '10px' }} />
      </h3>

      <div style={{ maxWidth: 800, margin: '0 auto', lineHeight: '1.6', textAlign: 'justify' }}>
        {renderText(indexingText)}
      </div>
    </div>
  );
};

export default Indexing2;
