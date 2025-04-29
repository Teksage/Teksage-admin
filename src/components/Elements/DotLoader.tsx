import { Box, keyframes } from "@mui/material";

const bounce = keyframes`
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1.0); }
`;

const DotLoader = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      gap: 1,
      my: 4,
    }}
  >
    {[0, 1, 2].map((i) => (
      <Box
        key={i}
        sx={{
          width: 10,
          height: 10,
          bgcolor: "primary.main",
          borderRadius: "50%",
          animation: `${bounce} 1.4s infinite ease-in-out`,
          animationDelay: `${i * 0.2}s`,
        }}
      />
    ))}
  </Box>
);

export default DotLoader;
