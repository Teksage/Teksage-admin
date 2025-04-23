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
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
} from "recharts";
import { Card, CardContent, Typography, Grid, Box } from "@mui/material";

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
  return (
    <Box p={3}>
    <Typography variant="h5" sx={{ fontWeight: 700, color: "#1b4d3e" }} gutterBottom>
      Analytics Overview
    </Typography>
    <Grid container spacing={4}>
      {/* Plan-wise User Count - Radial Bar Chart */}
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Users by Plan
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="30%"
                outerRadius="90%"
                barSize={15}
                data={planData}
              >
                <RadialBar
                  minAngle={15}
                  label={{ position: "insideStart", fill: "#fff" }}
                  background
                  clockWise
                  dataKey="users"
                >
                  {planData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </RadialBar>
                <Legend
                  iconSize={10}
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Service Usage - Area Chart */}
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Service Usage
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={serviceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="usage"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorUsage)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
    </Box>
  );
};

export default Analytics;

