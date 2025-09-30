import React, { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { Box, Typography, Link, Divider } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const IssuePage2 = () => {
  const { year, issueNumber } = useParams();
  const journalId = "ivk";
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [journalName, setJournalName] = useState("");

  useEffect(() => {
    if (isNaN(Number(year)) || isNaN(Number(issueNumber))) {
      setError(`Некорректный год или номер выпуска: ${JSON.stringify({ year, issueNumber })}`);
      setLoading(false);
      return;
    }

    const fetchArticles = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/articles/by-journal/${journalId}/${year}/${issueNumber}`
        );
        if (!res.ok) throw new Error(`Ошибка сервера: ${res.status}`);
        const data = await res.json();
        setArticles(data);
        setLoading(false);
      } catch (e) {
        setError(e.message);
        setLoading(false);
      }
    };

    const fetchJournalName = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/journals/by-abbreviation/${journalId}`);
        if (!res.ok) throw new Error(`Ошибка сервера: ${res.status}`);
        const data = await res.json();
        setJournalName(data.name || "Название журнала");
      } catch (e) {
        setJournalName("Известия ВУЗов Кыргызстана");
      }
    };

    fetchArticles();
    fetchJournalName();
  }, [year, issueNumber]);

  if (loading) return <Typography align="center">Загрузка...</Typography>;
  if (error) return <Typography align="center" color="red">{error}</Typography>;
  if (!articles.length) return <Typography align="center">Статей нет</Typography>;

  return (
    <Box sx={{ p: 6, maxWidth: 900, mx: "auto" }}>
      <Typography
        variant="h2"
        sx={{
          mb: 2,
          color: "#00b5ad",
          fontWeight: 600,
          fontSize: { xs: "18px", sm: "22px", md: "24px" },
          textAlign: "center",
        }}
      >
        {journalName}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Box sx={{ flex: 1, borderBottom: "1px solid #ccc" }} />
        <Typography
          variant="h5"
          sx={{ mx: 2, fontWeight: 600, fontSize: { xs: "16px", sm: "18px", md: "20px" } }}
        >
          {year}, №{issueNumber}, Статей: {articles.length}
        </Typography>
        <Box sx={{ flex: 1, borderBottom: "1px solid #ccc" }} />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        {articles.map((a, index) => (
          <Box key={a.id}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 0.25 }}>
              {a.pdfFileName && (
                <Link
                  href={`${API_BASE_URL}/uploads/articles/${a.pdfFileName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    color: "#d32f2f",
                    textDecoration: "none",
                    minWidth: 50,
                  }}
                >
                  <PictureAsPdfIcon fontSize="medium" />
                  <Typography variant="body2" sx={{ textDecoration: "underline", mt: 0.25 }}>
                    PDF
                  </Typography>
                </Link>
              )}

              <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <Typography variant="body2" sx={{ fontWeight: "bold", lineHeight: 1.2 }}>
                  {a.authors?.ru || "-"}
                </Typography>

                {/* Ссылка на ArticlePage */}
                <RouterLink
                  to={`/journal/ivk/article/${a.id}`}
                  style={{ textDecoration: "underline", color: "#1976d2" }}
                >
                  <Typography variant="body2" sx={{ mt: 0.25, lineHeight: 1.2 }}>
                    {a.titles?.ru || "Без названия"} Стр.: {a.pageStart || "-"}-{a.pageEnd || "-"}
                  </Typography>
                </RouterLink>
              </Box>
            </Box>

            {index < articles.length - 1 && <Divider sx={{ my: 0.25 }} />}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default IssuePage2;
