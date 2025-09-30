import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const BookYearCard = ({ year, issues, expandedYear, setExpandedYear, journalId, coverSrc }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => setExpandedYear(expandedYear === year ? null : year);

  return (
    <Box sx={{ width: { xs: "22%", sm: 100, md: 120 }, mb: 3, cursor: "pointer", textAlign: "center" }}>
      <Typography
        component="div"
        sx={{ fontWeight: 700, mb: 1, fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" } }}
      >
        {year}
      </Typography>

      <Box
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          width: "100%",
          height: { xs: 100, sm: 140, md: 160 },
          position: "relative",
          transformStyle: "preserve-3d",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          transform: isHovered ? "rotateY(-10deg) scale(1.05)" : "rotateY(5deg) scale(1)",
          boxShadow: isHovered ? "5px 10px 25px rgba(0,0,0,0.5)" : "2px 4px 10px rgba(0,0,0,0.2)",
          borderRadius: 0.5,
        }}
      >
        <Box
          component="img"
          src={coverSrc}
          alt={`Обложка ${year}`}
          sx={{
            width: "100%",
            height: "100%",
            borderRadius: 0.5,
            objectFit: "cover",
            backfaceVisibility: "hidden",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 2,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 15,
            height: "100%",
            backgroundColor: "#444",
            borderTopLeftRadius: 4,
            borderBottomLeftRadius: 4,
            boxShadow: "inset -2px 0 5px rgba(0,0,0,0.7)",
            transformOrigin: "left center",
            transform: "rotateY(-70deg) translateX(-15px)",
            zIndex: 3,
          }}
        />
      </Box>

      {expandedYear === year && (
        <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 1 }}>
          {issues.map((num) => (
            <Box
              key={num}
              sx={{
                width: { xs: "40%", sm: 60, md: 70 },
                height: { xs: 25, sm: 30, md: 35 },
                backgroundColor: "#fff",
                color: "#1976d2",
                borderRadius: 1,
                boxShadow: "2px 3px 8px rgba(0,0,0,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: { xs: "0.6rem", sm: "0.7rem", md: "0.75rem" },
                "&:hover": { transform: "scale(1.05)", boxShadow: "4px 6px 15px rgba(0,0,0,0.3)" },
                transition: "all 0.2s ease",
              }}
              onClick={() => navigate(`/journal/${journalId}/${year}/${num}`)}
            >
              № {num}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

const Archive1 = () => {
  const { t } = useTranslation();
  const journalId = "nntiik";
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [years, setYears] = useState([]);
  const [issuesByYear, setIssuesByYear] = useState({});
  const [expandedYear, setExpandedYear] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/articles/by-journal/${journalId}`);
        if (!res.ok) throw new Error(`Ошибка сервера: ${res.status}`);
        const data = await res.json();
        setArticles(data);

        const uniqueYears = [...new Set(data.map((a) => a.year))].sort((a, b) => a - b);
        setYears(uniqueYears);

        const issuesMap = {};
        uniqueYears.forEach((y) => {
          issuesMap[y] = [...new Set(data.filter((a) => a.year === y).map((a) => a.issueNumber))].sort((a, b) => a - b);
        });
        setIssuesByYear(issuesMap);

        setLoading(false);
      } catch (e) {
        setError(e.message);
        setLoading(false);
      }
    };
    fetchArticles();
  }, [journalId]);

  if (loading) return <div style={{ textAlign: "center" }}>{t("loading") || "Загрузка..."}</div>;
  if (error) return <div style={{ textAlign: "center", color: "red" }}>{t("error") || "Ошибка"}: {error}</div>;
  if (!articles.length) return <div style={{ textAlign: "center" }}>{t("noArticles") || "Статей нет"}</div>;

  return (
    <Box sx={{ textAlign: "center", p: 2 }}>
      {/* Главный заголовок журнала — НЕ переводится */}
      <Typography
        component="h2"
        sx={{
          mt: { xs: 2, sm: 3, md: 4 },
          mb: 1,
          color: "#00b5ad",
          fontWeight: 600,
          fontSize: { xs: "18px", sm: "22px", md: "24px" },
          lineHeight: 1.2,
        }}
      >
        Наука, новые технологии и инновации Кыргызстана
      </Typography>

      {/* Заголовок архива — переводится через i18n */}
      <Typography
        component="h3"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt: { xs: 1, sm: 2, md: 2 },
          mb: 3,
          fontWeight: 700,
          fontSize: { xs: "18px", sm: "20px", md: "20px" },
          "&::before, &::after": {
            content: '""',
            flex: 1,
            borderBottom: "1px solid #ccc",
            mr: 1,
            ml: 1,
          },
        }}
      >
        {t("archive")}
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 2 }}>
        {years.map((y) => (
          <BookYearCard
            key={y}
            year={y}
            issues={issuesByYear[y]}
            expandedYear={expandedYear}
            setExpandedYear={setExpandedYear}
            journalId={journalId}
            coverSrc="/assets/journal1.png"
          />
        ))}
      </Box>
    </Box>
  );
};

export default Archive1;
