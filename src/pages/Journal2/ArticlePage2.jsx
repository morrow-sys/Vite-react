import React, { useEffect, useState } from "react"; 
import { useParams } from "react-router-dom";
import { Box, Typography, Link, CircularProgress, Button, Collapse } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTranslation } from "react-i18next";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ArticlePage2 = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSection, setOpenSection] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/articles/by-journal/ivk/archive/${id}`);
        if (!res.ok) throw new Error(`Ошибка сервера: ${res.status}`);
        const data = await res.json();
        setArticle(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) return <Box sx={{ textAlign: "center", mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Typography align="center" color="red" sx={{ mt: 4 }}>{error}</Typography>;
  if (!article) return <Typography align="center" sx={{ mt: 4 }}>{t("articleNotFound")}</Typography>;

  const renderAllLanguages = (field) => {
    if (!field || typeof field !== "object") return "None";
    return (
      <>
        <Typography><strong>RU:</strong> {field.ru || "None"}</Typography>
        <Typography><strong>EN:</strong> {field.en || "None"}</Typography>
        <Typography><strong>KG:</strong> {field.kg || "None"}</Typography>
      </>
    );
  };

  const sections = [
    { key: "authors", label: t("authors"), content: renderAllLanguages(article.authors) },
    { key: "titles", label: t("title"), content: renderAllLanguages(article.titles) },
    { key: "abstracts", label: t("abstract"), content: renderAllLanguages(article.abstracts) },
    { key: "keywords", label: t("keywords"), content: renderAllLanguages(article.keywords) },
    { key: "authorsInfo", label: t("authorsInfo"), content: renderAllLanguages(article.authorsInfo) },
    { key: "udc", label: t("udc"), content: renderAllLanguages(article.udc) },
    { 
      key: "pdf", 
      label: t("fullTextVersion"), 
      content: article.pdfFileName ? (
        <Link
          href={`${API_BASE_URL}/uploads/articles/${article.pdfFileName}`}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ display: "flex", alignItems: "center", gap: 1, color: "#d32f2f", textDecoration: "underline" }}
        >
          <PictureAsPdfIcon /> {t("downloadPDF")}
        </Link>
      ) : "None"
    },
    { 
      key: "doi", 
      label: "DOI", 
      content: article.doi || "None"  // DOI теперь просто текст
    },
    { 
      key: "citation", 
      label: t("citationVersion"), 
      content: `${article.authors?.ru || "None"}, ${article.titles?.ru || "None"}, Наука, новые технологии и инновации Кыргызстана, ${article.year || "None"}, №${article.issueNumber || "None"}, c. ${article.pageStart || "None"}-${article.pageEnd || "None"}.`
    },
  ];

  return (
    <Box sx={{ p: 6, maxWidth: 900, mx: "auto" }}>
      {/* Главный заголовок журнала — не переводится */}
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
        Наука, новые технологии и инновации Кыргызстана
      </Typography>

      {/* Заголовок "Статья" — переводится */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <Box sx={{ flex: 1, borderBottom: "1px solid #ccc" }} />
        <Typography
          variant="h5"
          sx={{
            mx: 2,
            fontWeight: 600,
            fontSize: { xs: "16px", sm: "18px", md: "20px" },
            textAlign: "center",
          }}
        >
          {t("article")}
        </Typography>
        <Box sx={{ flex: 1, borderBottom: "1px solid #ccc" }} />
      </Box>

      {/* Секции статьи с Collapse */}
      {sections.map((section) => (
        <Box key={section.key} sx={{ mb: 1 }}>
          <Button
            variant="contained"
            onClick={() => setOpenSection(openSection === section.key ? null : section.key)}
            endIcon={
              <ExpandMoreIcon
                sx={{
                  transition: "transform 0.3s",
                  transform: openSection === section.key ? "rotate(180deg)" : "rotate(0deg)"
                }}
              />
            }
            sx={{
              backgroundColor: "#1e2a38",
              color: "#fff",
              textTransform: "none",
              fontSize: "0.9rem",
              mb: 0.5,
            }}
          >
            {section.label}
          </Button> 
          <Collapse in={openSection === section.key}>
            <Box sx={{ p: 2, border: "1px solid #ddd", borderRadius: 1, mb: 1 }}>
              {section.content}
            </Box>
          </Collapse>
        </Box>
      ))}
    </Box>
  );
};

export default ArticlePage2;
