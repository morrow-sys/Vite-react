import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const BookCard = ({ src, title, linkTo }) => {
  const { t } = useTranslation();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    if (isAnimating) return;
    setIsAnimating(true);

    setTimeout(() => {
      navigate(linkTo);
    }, 300);
  };

  return (
    <Box
      sx={{
        textDecoration: "none",
        color: "white",
        perspective: 900,
        display: "inline-block",
        width: { xs: "40%", sm: 220, md: 280, lg: 300 },
        minWidth: { xs: "40%", sm: 220, md: 280 },
        cursor: isAnimating ? "default" : "pointer",
        mb: { xs: 2, sm: 0 },
        flex: "0 0 auto",
        transition: "transform 0.3s ease",
        transform: isTouched ? "scale(1.1) translateY(-10px)" : "none",
        zIndex: isTouched ? 20 : "auto",
        '@media (max-width:375px)': {
          width: "38%",
          minWidth: "38%",
        },
      }}
      onClick={handleClick}
      onTouchStart={() => setIsTouched(true)}
      onTouchEnd={() => setIsTouched(false)}
    >
      <Box
        sx={{
          width: "100%",
          height: { xs: 180, sm: 320, md: 380, lg: 450 },
          '@media (min-width:360px) and (max-width:375px)': {
            height: 170,
          },
          position: "relative",
          transformStyle: "preserve-3d",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          boxShadow: isAnimating
            ? "25px 40px 80px rgba(0,0,0,0.8)"
            : "5px 8px 15px rgba(0,0,0,0.3)",
          borderRadius: 2,
          transform: isAnimating
            ? "scale(2.2) translateZ(50px)"
            : "rotateY(20deg)",
          zIndex: isAnimating ? 30 : "auto",
          "&:hover": {
            transform: isAnimating
              ? "scale(2.2) translateZ(50px)"
              : "rotateY(-15deg) scale(1.1)",
            zIndex: 10,
            boxShadow: "10px 15px 30px rgba(0,0,0,0.5)",
          },
        }}
      >
        <Box
          component="img"
          src={src}
          alt={title}
          sx={{
            width: "100%",
            height: "100%",
            borderRadius: 2,
            objectFit: "cover",
            backfaceVisibility: "hidden",
            position: "relative",
            zIndex: 5,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 30,
            height: "100%",
            backgroundColor: "#444",
            borderTopLeftRadius: 6,
            borderBottomLeftRadius: 6,
            boxShadow: "inset -3px 0 8px rgba(0,0,0,0.7)",
            transformOrigin: "left center",
            transform: "rotateY(-70deg) translateX(-30px)",
            zIndex: 1,
          }}
        />
      </Box>

      <Typography
        variant="subtitle1"
        textAlign="center"
        mt={2}
        sx={{
          width: "100%",
          fontSize: { xs: "0.75rem", sm: "1rem", md: "1.05rem", lg: "1.1rem" },
          '@media (min-width:360px) and (max-width:375px)': {
            fontSize: "0.7rem",
          },
          fontWeight: 700,
          userSelect: "none",
        }}
      >
        {title}
      </Typography>

      <Box textAlign="center" mt={1}>
        <Button
          variant="contained"
          size="small"
          sx={{
            textTransform: "none",
            fontSize: { xs: "0.65rem", sm: "0.85rem", md: "0.9rem", lg: "0.9rem" },
            px: { xs: 1.5, sm: 3 },
            py: 0.5,
            '@media (min-width:360px) and (max-width:375px)': {
              fontSize: "0.6rem",
              px: 1.2,
            },
          }}
          onClick={(e) => {
            e.stopPropagation();
            navigate(linkTo);
          }}
        >
          {t("moreDetails")}
        </Button>
      </Box>
    </Box>
  );
};

const JournalsPage = () => {
  const { t } = useTranslation();

  const journals = [
    { src: "/assets/journal1.png", title: t("journal1"), linkTo: "/journal1" },
    { src: "/assets/ivkk.jpg", title: t("journal2"), linkTo: "/journal2" },
  ];

  return (
    <Box
      sx={{
        minHeight: { xs: "60vh", sm: "800px" },
        pt: { xs: 4, sm: 6 },
        px: { xs: 3, sm: 4 },
        backgroundImage: 'url("/assets/bghhhh.jpg")',
        backgroundSize: "cover",
        backgroundPosition: { xs: "top center", sm: "center center" },
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "#fff",
        textShadow: "0 0 6px rgba(0,0,0,0.7)",
        position: "relative",
      }}
    >
      {/* Адаптивный заголовок Journals */}
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={4}
        zIndex={2}
        textAlign="center"
        sx={{
          fontSize: { xs: "1.5rem", sm: "2rem", md: "2.4rem" },
          '@media (min-width:360px) and (max-width:375px)': {
            fontSize: '1.3rem', // уменьшенный размер для Galaxy S8+
          },
        }}
      >
        {t("journals")}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: { xs: "center", sm: "space-around" },
          gap: { xs: 3, sm: 4 },
          width: "100%",
          maxWidth: 1400,
          zIndex: 2,
        }}
      >
        {journals.map((j) => (
          <BookCard key={j.title} {...j} />
        ))}
      </Box>
    </Box>
  );
};

export default JournalsPage;
