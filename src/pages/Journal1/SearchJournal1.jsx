import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Link, Divider, Stack, Paper } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { Link as RouterLink } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Search1 = () => {
  const [searchTitle, setSearchTitle] = useState("");
  const [searchAuthor, setSearchAuthor] = useState("");
  const [articles, setArticles] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [journalName, setJournalName] = useState("");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/articles/by-journal/nntiik`);
        if (!res.ok) throw new Error("Ошибка загрузки статей");
        const data = await res.json();
        setArticles(data);
      } catch (e) {
        console.error(e);
      }
    };

    const fetchJournalName = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/journals/by-abbreviation/nntiik`);
        if (!res.ok) throw new Error("Ошибка загрузки журнала");
        const data = await res.json();
        setJournalName(data.name || "Журнал");
      } catch (e) {
        setJournalName("Журнал");
      }
    };

    fetchArticles();
    fetchJournalName();
  }, []);

  useEffect(() => {
    if (!searchTitle && !searchAuthor) {
      setFiltered([]);
      return;
    }

    const result = articles.filter((a) => {
      const titleMatch =
        (a.titles?.ru || "").toLowerCase().includes(searchTitle.toLowerCase());
      const authorMatch =
        (a.authors?.ru || "").toLowerCase().includes(searchAuthor.toLowerCase());
      return titleMatch && authorMatch;
    });
    setFiltered(result);
  }, [searchTitle, searchAuthor, articles]);

  return (
    <Box sx={{ p: { xs: 3, sm: 4, md: 6 }, maxWidth: 1100, mx: "auto" }}>
      {/* Главный заголовок адаптивный, уменьшен на один размер */}
      <Typography
        component="h2"
        sx={{
          mb: { xs: 1.5, sm: 2, md: 2.5 },
          color: "#00b5ad",
          fontWeight: 600,
          fontSize: { xs: "18px", sm: "21px", md: "23px" }, // уменьшено на один размер
          textAlign: "center",
          lineHeight: 1.2,
        }}
      >
        {journalName}
      </Typography>

      {/* Нижний заголовок "Поиск" с линиями по бокам адаптивный */}
      <Typography
        component="h3"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: { xs: 2, sm: 3, md: 3 },
          fontWeight: 700,
          fontSize: { xs: "17px", sm: "18px", md: "20px" }, // увеличено на xs
          "&::before, &::after": {
            content: '""',
            flex: 1,
            borderBottom: "1px solid #ccc",
            mr: 1,
            ml: 1,
          },
        }}
      >
        Поиск
      </Typography>

      {/* Поля поиска */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ mb: { xs: 3, sm: 4 } }}
      >
        <TextField
          label="Поиск по названию"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          fullWidth
        />
        <TextField
          label="Поиск по автору"
          value={searchAuthor}
          onChange={(e) => setSearchAuthor(e.target.value)}
          fullWidth
        />
      </Stack>

      {/* Результаты с рамкой */}
      {filtered.length > 0 ? (
        <Paper
          sx={{
            p: { xs: 2, sm: 3 },
            border: "1px solid #ccc",
            borderRadius: 2,
            boxShadow: 2,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {filtered.map((a, index) => (
              <Box key={a.id}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 0.25, flexWrap: "wrap" }}>
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
                        mb: { xs: 1, sm: 0 },
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

                    <RouterLink
                      to={`/journal/nntiik/article/${a.id}`}
                      style={{ textDecoration: "underline", color: "#1976d2" }}
                    >
                      <Typography variant="body2" sx={{ mt: 0.25, lineHeight: 1.2 }}>
                        {a.titles?.ru || "Без названия"} Стр.: {a.pageStart || "-"}-{a.pageEnd || "-"}
                      </Typography>
                    </RouterLink>
                  </Box>
                </Box>

                {index < filtered.length - 1 && <Divider sx={{ my: 0.25 }} />}
              </Box>
            ))}
          </Box>
        </Paper>
      ) : (
        <Typography align="center" sx={{ mt: 4 }}>
          Введите параметры поиска
        </Typography>
      )}
    </Box>
  );
};

export default Search1;
