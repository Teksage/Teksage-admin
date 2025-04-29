import React from "react";
import {
  Box,
  Typography,
} from "@mui/material";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Brightness3Icon from "@mui/icons-material/Brightness3";

interface AstroChartProps {
  chartData: string;
  chartType: "Rasi" | "Navamsa";
}

// Helper function to parse the chart HTML and extract planetary positions
const parseChartData = (chartHtml: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(chartHtml, "text/html");
  const boxes = Array.from(doc.querySelectorAll(".container")).map((box) => {
    const items = Array.from(box.querySelectorAll(".item")).map((item) => {
      const span = item.querySelector("span");
      return {
        text: span?.textContent || "",
        className: span?.className || "",
        style: item.getAttribute("style") || "",
      };
    });
    return items;
  });
  return boxes;
};

// Updated AstroChart Component (Removed userDetails to avoid duplication)
export const AstroChart: React.FC<AstroChartProps> = ({
  chartData,
  chartType,
}) => {
  const boxes = parseChartData(chartData);
  const isRasi = chartType === "Rasi";

  return (
    <Box
      sx={{
        fontFamily: "'Poppins', sans-serif",
        width: "100%",
        maxWidth: "320px",
        mx: "auto",
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

      {/* Zodiac Ring */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
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
          }}
        >
          {[...Array(12)].map((_, i) => (
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
              }}
            >
              {[
                "Aries",
                "Taurus",
                "Gemini",
                "Cancer",
                "Leo",
                "Virgo",
                "Libra",
                "Scorpio",
                "Sagittarius",
                "Capricorn",
                "Aquarius",
                "Pisces",
              ][i].substring(0, 3)}
            </Box>
          ))}
        </Box>

        {/* Chart Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 80px)",
            gridTemplateRows: "repeat(4, 80px)",
            gap: "5px",
            position: "relative",
            zIndex: 2,
          }}
        >
          {boxes.map((boxItems, index) => {
            const boxId = `box${index + 1}`;
            const isCenter = index === 5;

            if (isCenter) {
              return (
                <Box
                  key={boxId}
                  sx={{
                    gridColumn: "2 / span 2",
                    gridRow: "2 / span 2",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "18px",
                    fontWeight: 600,
                    color: isRasi ? "#1B4D3E" : "#6A1B9A",
                    border: `2px solid ${isRasi ? "#10B100" : "#9C27B0"}`,
                    background: isRasi
                      ? "rgba(16, 177, 0, 0.05)"
                      : "rgba(156, 39, 176, 0.05)",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  {chartType}
                </Box>
              );
            }

            return (
              <Box
                key={boxId}
                sx={{
                  position: "relative",
                  border: `2px solid ${
                    isRasi ? "rgba(16, 177, 0, 0.3)" : "rgba(156, 39, 176, 0.3)"
                  }`,
                  background: "rgba(255,255,255,0.7)",
                  borderRadius:
                    index === 0
                      ? "16px 0 0 0"
                      : index === 3
                      ? "0 16px 0 0"
                      : index === 9
                      ? "0 0 0 16px"
                      : index === 11
                      ? "0 0 16px 0"
                      : "0",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                    zIndex: 3,
                  },
                }}
              >
                {boxItems.map((item, itemIndex) => {
                  let transformStyle = "none";
                  if (item.style.includes("translate")) {
                    const translateValues =
                      item.style.match(/translate\(([^)]+)\)/)?.[1];
                    if (translateValues) {
                      const [x, y] = translateValues
                        .split(",")
                        .map((val) => val.trim());
                      transformStyle = `translate(${parseFloat(
                        x
                      )}px, ${parseFloat(y)}px)`;
                    }
                  }

                  return (
                    <Box
                      key={itemIndex}
                      sx={{
                        position: "absolute",
                        width: "30%",
                        height: "30%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        transform: transformStyle,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: item.className.includes("font-10")
                            ? "16px"
                            : "12px",
                          fontWeight: 600,
                          color: item.className.includes("red")
                            ? "#E53935"
                            : item.className.includes("pink")
                            ? "#D81B60"
                            : isRasi
                            ? "#1B4D3E"
                            : "#6A1B9A",
                          textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                        }}
                      >
                        {item.text}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};
