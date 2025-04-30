import React from "react";
import { Box, Typography } from "@mui/material";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Brightness3Icon from "@mui/icons-material/Brightness3";

interface AstroChartProps {
  chartHtml: string;
  chartType: "Rasi" | "Navamsa";
}

export const AstroChart: React.FC<AstroChartProps> = ({
  chartHtml,
  chartType,
}) => {
  const isRasi = chartType === "Rasi";

  return (
    <Box
      sx={{
        fontFamily: "'Urbanist', sans-serif",
        width: "100%",
        maxWidth: "320px",
        mx: "auto",
        position: "relative",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          textAlign: "center",
          mb: 2,
          fontWeight: 600,
          color: isRasi ? "#1B4D3E" : "#6A1B9A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
        }}
      >
        {isRasi ? (
          <Brightness7Icon fontSize="small" />
        ) : (
          <Brightness3Icon fontSize="small" />
        )}
        {chartType} Chart
      </Typography>

      {/* Chart Container */}
      <Box
        sx={{
          position: "relative",
          width: "320px",
          height: "320px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Outer Zodiac Ring */}
        <Box
          sx={{
            position: "absolute",
            width: "310px",
            height: "310px",
            borderRadius: "50%",
            border: "2px dashed rgba(16, 177, 0, 0.3)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            animation: "spin 60s linear infinite",
            "@keyframes spin": {
              "0%": { transform: "rotate(0deg)" },
              "100%": { transform: "rotate(360deg)" },
            },
            zIndex: 1,
          }}
        >
          {[
            "Ari",
            "Tau",
            "Gem",
            "Can",
            "Leo",
            "Vir",
            "Lib",
            "Sco",
            "Sag",
            "Cap",
            "Aqu",
            "Pis",
          ].map((sign, i) => (
            <Box
              key={i}
              sx={{
                position: "absolute",
                width: "30px",
                height: "30px",
                background: "rgba(255,255,255,0.8)",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: 500,
                fontSize: "12px",
                color: "#1B4D3E",
                transform: `rotate(${i * 30}deg) translate(140px) rotate(-${
                  i * 30
                }deg)`,
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                border: "1px solid rgba(16, 177, 0, 0.2)",
                zIndex: 1,
              }}
            >
              {sign}
            </Box>
          ))}
        </Box>

        {/* Chart Grid */}
        <Box
          sx={{
            width: "317px",
            height: "285px",
            zIndex: 2,
          }}
          dangerouslySetInnerHTML={{ __html: chartHtml }}
        />
      </Box>
    </Box>
  );
};