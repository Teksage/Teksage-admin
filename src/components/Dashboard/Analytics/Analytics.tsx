import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
  Cell,
} from "recharts";
import { Typography, Grid, Box, Paper, useTheme } from "@mui/material";

const planData = [
  { plan_name: "Basic", users: 40 },
  { plan_name: "Standard", users: 70 },
  { plan_name: "Premium", users: 90 },
  { plan_name: "Enterprise", users: 50 },
];

const serviceData = [
  { name: "Love", usage: 120 },
  { name: "Career", usage: 80 },
  { name: "Finance", usage: 65 },
  { name: "Marriage", usage: 95 },
];

const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const Analytics = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 3,
        background: "linear-gradient(135deg, #f5f7fa 0%, #e4f0f9 100%)",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          color: "#1b4d3e",
          mb: 3,
          textAlign: "center",
          position: "relative",
          "&:after": {
            content: '""',
            display: "block",
            width: "60px",
            height: "3px",
            background: "linear-gradient(90deg, #1b4d3e, #4caf50)",
            margin: "8px auto 0",
            borderRadius: "2px",
          },
        }}
      >
        Analytics Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ maxWidth: "1200px", mx: "auto" }}>
        {/* Plan-wise User Count - Radial Bar Chart */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: "12px",
              background: "rgba(255, 255, 255, 0.9)",
              border: "1px solid rgba(0, 0, 0, 0.05)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: "#1b4d3e",
                mb: 1,
                display: "flex",
                alignItems: "center",
                fontSize: "1rem",
                "&:before": {
                  content: '""',
                  display: "inline-block",
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: COLORS[0],
                  marginRight: "8px",
                },
              }}
            >
              Users by Plan
            </Typography>
            <Box sx={{ flex: 1 }}>
              <ResponsiveContainer width="100%" height={250}>
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="30%"
                  outerRadius="90%"
                  barSize={8}
                  data={planData}
                >
                  <RadialBar
                    minAngle={15}
                    label={{ position: "insideStart", fill: "#fff", fontSize: "10px" }}
                    background
                    clockWise
                    dataKey="users"
                  >
                    {planData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </RadialBar>
                  <Legend
                    iconSize={8}
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    formatter={(value) => (
                      <span style={{ color: "#1b4d3e", fontSize: "11px" }}>
                        {value}
                      </span>
                    )}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Service Usage - Area Chart */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: "12px",
              background: "rgba(255, 255, 255, 0.9)",
              border: "1px solid rgba(0, 0, 0, 0.05)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: "#1b4d3e",
                mb: 1,
                display: "flex",
                alignItems: "center",
                fontSize: "1rem",
                "&:before": {
                  content: '""',
                  display: "inline-block",
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: COLORS[3],
                  marginRight: "8px",
                },
              }}
            >
              Service Usage
            </Typography>
            <Box sx={{ flex: 1 }}>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart
                  data={serviceData}
                  margin={{ top: 10, right: 15, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#1b4d3e", fontSize: "12px" }}
                    axisLine={{ stroke: "#1b4d3e", opacity: 0.2 }}
                  />
                  <YAxis
                    tick={{ fill: "#1b4d3e", fontSize: "12px" }}
                    axisLine={{ stroke: "#1b4d3e", opacity: 0.2 }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "12px",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="usage"
                    stroke="#8884d8"
                    strokeWidth={1.5}
                    fillOpacity={1}
                    fill="url(#colorUsage)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Compact Stats Row */}
      <Grid container spacing={2} sx={{ mt: 2, maxWidth: "1200px", mx: "auto" }}>
        {planData.map((plan, index) => (
          <Grid item xs={6} sm={3} key={index}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: "8px",
                background: `linear-gradient(135deg, ${COLORS[index]}, ${COLORS[(index + 1) % COLORS.length]})`,
                color: "white",
                textAlign: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.25rem" }}>
                {plan.users}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9, fontSize: "0.75rem" }}>
                {plan.plan_name} Users
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Analytics;