import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Функция безопасного парсинга HTML с поддержкой <b>, <i>, <u>, <a>, <p>, <div>, <br>
const parseSafeHTML = (html) => {
  if (!html) return null;

  const blocks = html.split(/(<div[^>]*>|<\/div>|<p[^>]*>|<\/p>|<br\s*\/?>|\n)/gi);
  const elements = [];
  let key = 0;
  let currentStyle = { textAlign: 'justify', margin: '5px 0' };

  blocks.forEach((block) => {
    if (!block) return;

    const divCenter = block.match(/<div[^>]*style="[^"]*text-align\s*:\s*center[^"]*"[^>]*>/i);
    const pCenter = block.match(/<p[^>]*style="[^"]*text-align\s*:\s*center[^"]*"[^>]*>/i);

    if (divCenter || pCenter) {
      currentStyle = { textAlign: 'center', margin: '5px 0' };
      return;
    }

    if (block.match(/<\/div>|<\/p>/i)) {
      currentStyle = { textAlign: 'justify', margin: '5px 0' };
      return;
    }

    if (block.match(/<br\s*\/?>/i)) {
      elements.push(<br key={key++} />);
      return;
    }

    const parts = block.split(/(https?:\/\/[^\s<]+)/gi);
    const lineElements = parts.map((part, idx) => {
      if (/^https?:\/\//.test(part)) {
        return (
          <a
            key={idx}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#0077cc', textDecoration: 'underline' }}
          >
            {part}
          </a>
        );
      }

      const innerElements = [];
      let currentTag = null;
      part.split(/(<\/?[biu]>)/gi).forEach((token) => {
        if (token === '<b>') currentTag = 'b';
        else if (token === '<i>') currentTag = 'i';
        else if (token === '<u>') currentTag = 'u';
        else if (token === '</b>' || token === '</i>' || token === '</u>') currentTag = null;
        else {
          if (currentTag === 'b') innerElements.push(<b key={innerElements.length}>{token}</b>);
          else if (currentTag === 'i') innerElements.push(<i key={innerElements.length}>{token}</i>);
          else if (currentTag === 'u') innerElements.push(<u key={innerElements.length}>{token}</u>);
          else innerElements.push(token);
        }
      });
      return innerElements;
    });

    elements.push(<p key={key++} style={currentStyle}>{lineElements.flat()}</p>);
  });

  return elements;
};

function Journal1() {
  const { t, i18n } = useTranslation();
  const [journal, setJournal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentLang, setCurrentLang] = useState(i18n.language?.slice(0, 2) || 'ru');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchJournal = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/journals/by-abbreviation/nntiik`, {
          headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) throw new Error(`Ошибка сервера: ${res.status}`);
        const data = await res.json();
        setJournal(data);
        setLoading(false);
      } catch (e) {
        setError(e.message);
        setLoading(false);
      }
    };
    fetchJournal();
  }, [API_BASE_URL]);

  useEffect(() => {
    const onLanguageChanged = (lng) => setCurrentLang(lng.slice(0, 2));
    i18n.on('languageChanged', onLanguageChanged);
    return () => i18n.off('languageChanged', onLanguageChanged);
  }, [i18n]);

  if (loading) return <div style={{ textAlign: 'center' }}>{t('loading') || 'Загрузка...'}</div>;
  if (error) return <div style={{ textAlign: 'center', color: 'red' }}>{t('error')}: {error}</div>;
  if (!journal) return <div style={{ textAlign: 'center' }}>{t('dataNotFound') || 'Данные не найдены'}</div>;

  const langKey = currentLang;
  const aboutText = journal.about?.[langKey] || journal.about?.['ru'] || '';

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2 style={{ marginBottom: '10px', color: '#00b5ad' }}>
        {journal.name || t('journalNameMissing') || 'Название отсутствует'}
      </h2>

      <h3 style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px',
      }}>
        <span style={{ flex: 1, height: '1px', backgroundColor: '#ccc', marginRight: '10px' }} />
        {t('aboutJournal') || 'О журнале'}
        <span style={{ flex: 1, height: '1px', backgroundColor: '#ccc', marginLeft: '10px' }} />
      </h3>

      <div style={{ maxWidth: 800, margin: '0 auto', lineHeight: '1.6', textAlign: 'justify' }}>
        {parseSafeHTML(aboutText)}
      </div>
    </div>
  );
}

export default Journal1;
