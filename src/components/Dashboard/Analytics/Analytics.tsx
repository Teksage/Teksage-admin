// import React from "react";
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   RadialBarChart,
//   RadialBar,
//   Legend,
//   Cell,
// } from "recharts";
// import { Typography, Grid, Box, Paper, useTheme } from "@mui/material";

// const planData = [
//   { plan_name: "Basic", users: 40 },
//   { plan_name: "Standard", users: 70 },
//   { plan_name: "Premium", users: 90 },
//   { plan_name: "Enterprise", users: 50 },
// ];

// const serviceData = [
//   { name: "Love", usage: 120 },
//   { name: "Career", usage: 80 },
//   { name: "Finance", usage: 65 },
//   { name: "Marriage", usage: 95 },
// ];

// const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

// const Analytics = () => {
//   const theme = useTheme();

//   return (
//     <Box
//       sx={{
//         p: 3,
//         background: "linear-gradient(135deg, #f5f7fa 0%, #e4f0f9 100%)",
//         minHeight: "100vh",
//       }}
//     >
//       <Typography
//         variant="h5"
//         sx={{
//           fontWeight: 700,
//           color: "#1b4d3e",
//           mb: 3,
//           textAlign: "center",
//           position: "relative",
//           "&:after": {
//             content: '""',
//             display: "block",
//             width: "60px",
//             height: "3px",
//             background: "linear-gradient(90deg, #1b4d3e, #4caf50)",
//             margin: "8px auto 0",
//             borderRadius: "2px",
//           },
//         }}
//       >
//         Analytics Dashboard
//       </Typography>

//       <Grid container spacing={3} sx={{ maxWidth: "1200px", mx: "auto" }}>
//         {/* Plan-wise User Count - Radial Bar Chart */}
//         <Grid item xs={12} md={6}>
//           <Paper
//             elevation={0}
//             sx={{
//               p: 2,
//               borderRadius: "12px",
//               background: "rgba(255, 255, 255, 0.9)",
//               border: "1px solid rgba(0, 0, 0, 0.05)",
//               height: "100%",
//               display: "flex",
//               flexDirection: "column",
//             }}
//           >
//             <Typography
//               variant="subtitle1"
//               sx={{
//                 fontWeight: 600,
//                 color: "#1b4d3e",
//                 mb: 1,
//                 display: "flex",
//                 alignItems: "center",
//                 fontSize: "1rem",
//                 "&:before": {
//                   content: '""',
//                   display: "inline-block",
//                   width: "8px",
//                   height: "8px",
//                   borderRadius: "50%",
//                   background: COLORS[0],
//                   marginRight: "8px",
//                 },
//               }}
//             >
//               Users by Plan
//             </Typography>
//             <Box sx={{ flex: 1 }}>
//               <ResponsiveContainer width="100%" height={250}>
//                 <RadialBarChart
//                   cx="50%"
//                   cy="50%"
//                   innerRadius="30%"
//                   outerRadius="90%"
//                   barSize={8}
//                   data={planData}
//                 >
//                   <RadialBar
//                     minAngle={15}
//                     label={{ position: "insideStart", fill: "#fff", fontSize: "10px" }}
//                     background
//                     clockWise
//                     dataKey="users"
//                   >
//                     {planData.map((entry, index) => (
//                       <Cell key={index} fill={COLORS[index % COLORS.length]} />
//                     ))}
//                   </RadialBar>
//                   <Legend
//                     iconSize={8}
//                     layout="vertical"
//                     verticalAlign="middle"
//                     align="right"
//                     formatter={(value) => (
//                       <span style={{ color: "#1b4d3e", fontSize: "11px" }}>
//                         {value}
//                       </span>
//                     )}
//                   />
//                 </RadialBarChart>
//               </ResponsiveContainer>
//             </Box>
//           </Paper>
//         </Grid>

//         {/* Service Usage - Area Chart */}
//         <Grid item xs={12} md={6}>
//           <Paper
//             elevation={0}
//             sx={{
//               p: 2,
//               borderRadius: "12px",
//               background: "rgba(255, 255, 255, 0.9)",
//               border: "1px solid rgba(0, 0, 0, 0.05)",
//               height: "100%",
//               display: "flex",
//               flexDirection: "column",
//             }}
//           >
//             <Typography
//               variant="subtitle1"
//               sx={{
//                 fontWeight: 600,
//                 color: "#1b4d3e",
//                 mb: 1,
//                 display: "flex",
//                 alignItems: "center",
//                 fontSize: "1rem",
//                 "&:before": {
//                   content: '""',
//                   display: "inline-block",
//                   width: "8px",
//                   height: "8px",
//                   borderRadius: "50%",
//                   background: COLORS[3],
//                   marginRight: "8px",
//                 },
//               }}
//             >
//               Service Usage
//             </Typography>
//             <Box sx={{ flex: 1 }}>
//               <ResponsiveContainer width="100%" height={250}>
//                 <AreaChart
//                   data={serviceData}
//                   margin={{ top: 10, right: 15, left: 0, bottom: 0 }}
//                 >
//                   <defs>
//                     <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
//                       <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
//                     </linearGradient>
//                   </defs>
//                   <XAxis
//                     dataKey="name"
//                     tick={{ fill: "#1b4d3e", fontSize: "12px" }}
//                     axisLine={{ stroke: "#1b4d3e", opacity: 0.2 }}
//                   />
//                   <YAxis
//                     tick={{ fill: "#1b4d3e", fontSize: "12px" }}
//                     axisLine={{ stroke: "#1b4d3e", opacity: 0.2 }}
//                   />
//                   <Tooltip
//                     contentStyle={{
//                       background: "rgba(255, 255, 255, 0.95)",
//                       border: "none",
//                       borderRadius: "6px",
//                       fontSize: "12px",
//                       boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//                     }}
//                   />
//                   <Area
//                     type="monotone"
//                     dataKey="usage"
//                     stroke="#8884d8"
//                     strokeWidth={1.5}
//                     fillOpacity={1}
//                     fill="url(#colorUsage)"
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </Box>
//           </Paper>
//         </Grid>
//       </Grid>

//       {/* Compact Stats Row */}
//       <Grid container spacing={2} sx={{ mt: 2, maxWidth: "1200px", mx: "auto" }}>
//         {planData.map((plan, index) => (
//           <Grid item xs={6} sm={3} key={index}>
//             <Box
//               sx={{
//                 p: 1.5,
//                 borderRadius: "8px",
//                 background: `linear-gradient(135deg, ${COLORS[index]}, ${COLORS[(index + 1) % COLORS.length]})`,
//                 color: "white",
//                 textAlign: "center",
//                 boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//               }}
//             >
//               <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.25rem" }}>
//                 {plan.users}
//               </Typography>
//               <Typography variant="caption" sx={{ opacity: 0.9, fontSize: "0.75rem" }}>
//                 {plan.plan_name} Users
//               </Typography>
//             </Box>
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );
// };

// export default Analytics;

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
  LabelList, Cell
} from "recharts";
import { Typography, Grid, Box, Paper, useTheme, MenuItem, Select, useMediaQuery } from "@mui/material";

// Data with monthly counts for plans, services, and consultations
const yearlyData = {
  2023: {
    plans: [
      { name: "Jan", Basic: 40, Standard: 70, Premium: 90, Enterprise: 50 },
      { name: "Feb", Basic: 42, Standard: 72, Premium: 92, Enterprise: 52 },
      { name: "Mar", Basic: 45, Standard: 75, Premium: 95, Enterprise: 55 },
      { name: "Apr", Basic: 48, Standard: 78, Premium: 98, Enterprise: 58 },
      { name: "May", Basic: 50, Standard: 80, Premium: 100, Enterprise: 60 },
      { name: "Jun", Basic: 52, Standard: 82, Premium: 102, Enterprise: 62 },
      { name: "Jul", Basic: 55, Standard: 85, Premium: 105, Enterprise: 65 },
      { name: "Aug", Basic: 58, Standard: 88, Premium: 108, Enterprise: 68 },
      { name: "Sep", Basic: 60, Standard: 90, Premium: 110, Enterprise: 70 },
      { name: "Oct", Basic: 62, Standard: 92, Premium: 112, Enterprise: 72 },
      { name: "Nov", Basic: 65, Standard: 95, Premium: 115, Enterprise: 75 },
      { name: "Dec", Basic: 68, Standard: 98, Premium: 118, Enterprise: 78 },
    ],
    services: [
      { name: "Jan", Love: 120, Career: 80, Finance: 65, Marriage: 95 },
      { name: "Feb", Love: 90, Career: 70, Finance: 55, Marriage: 85 },
      { name: "Mar", Love: 110, Career: 75, Finance: 60, Marriage: 90 },
      { name: "Apr", Love: 130, Career: 85, Finance: 70, Marriage: 100 },
      { name: "May", Love: 115, Career: 80, Finance: 65, Marriage: 95 },
      { name: "Jun", Love: 125, Career: 90, Finance: 75, Marriage: 105 },
      { name: "Jul", Love: 135, Career: 95, Finance: 80, Marriage: 110 },
      { name: "Aug", Love: 140, Career: 100, Finance: 85, Marriage: 115 },
      { name: "Sep", Love: 130, Career: 90, Finance: 75, Marriage: 105 },
      { name: "Oct", Love: 145, Career: 105, Finance: 90, Marriage: 120 },
      { name: "Nov", Love: 160, Career: 115, Finance: 100, Marriage: 135 },
      { name: "Dec", Love: 180, Career: 130, Finance: 115, Marriage: 150 }
    ],
    consultations: [
      { name: "Jan", "30mins": 120, "1hr": 80, date: "2023-01-15" },
      { name: "Feb", "30mins": 90, "1hr": 70, date: "2023-02-15" },
      { name: "Mar", "30mins": 110, "1hr": 75, date: "2023-03-15" },
      { name: "Apr", "30mins": 130, "1hr": 85, date: "2023-04-15" },
      { name: "May", "30mins": 115, "1hr": 80, date: "2023-05-15" },
      { name: "Jun", "30mins": 125, "1hr": 90, date: "2023-06-15" },
      { name: "Jul", "30mins": 135, "1hr": 95, date: "2023-07-15" },
      { name: "Aug", "30mins": 140, "1hr": 100, date: "2023-08-15" },
      { name: "Sep", "30mins": 130, "1hr": 90, date: "2023-09-15" },
      { name: "Oct", "30mins": 145, "1hr": 105, date: "2023-10-15" },
      { name: "Nov", "30mins": 160, "1hr": 115, date: "2023-11-15" },
      { name: "Dec", "30mins": 180, "1hr": 130, date: "2023-12-15" }
    ]
  },
  2024: {
    plans: [
      { name: "Jan", Basic: 50, Standard: 80, Premium: 100, Enterprise: 60 },
      { name: "Feb", Basic: 52, Standard: 82, Premium: 102, Enterprise: 62 },
      { name: "Mar", Basic: 55, Standard: 85, Premium: 105, Enterprise: 65 },
      { name: "Apr", Basic: 58, Standard: 88, Premium: 108, Enterprise: 68 },
      { name: "May", Basic: 60, Standard: 90, Premium: 110, Enterprise: 70 },
      { name: "Jun", Basic: 62, Standard: 92, Premium: 112, Enterprise: 72 },
      { name: "Jul", Basic: 65, Standard: 95, Premium: 115, Enterprise: 75 },
      { name: "Aug", Basic: 68, Standard: 98, Premium: 118, Enterprise: 78 },
      { name: "Sep", Basic: 70, Standard: 100, Premium: 120, Enterprise: 80 },
      { name: "Oct", Basic: 72, Standard: 102, Premium: 122, Enterprise: 82 },
      { name: "Nov", Basic: 75, Standard: 105, Premium: 125, Enterprise: 85 },
      { name: "Dec", Basic: 78, Standard: 108, Premium: 128, Enterprise: 88 },
    ],
    services: [
      { name: "Jan", Love: 140, Career: 90, Finance: 75, Marriage: 105 },
      { name: "Feb", Love: 110, Career: 80, Finance: 65, Marriage: 95 },
      { name: "Mar", Love: 130, Career: 85, Finance: 70, Marriage: 100 },
      { name: "Apr", Love: 150, Career: 95, Finance: 80, Marriage: 110 },
      { name: "May", Love: 135, Career: 90, Finance: 75, Marriage: 105 },
      { name: "Jun", Love: 145, Career: 100, Finance: 85, Marriage: 115 },
      { name: "Jul", Love: 155, Career: 110, Finance: 95, Marriage: 125 },
      { name: "Aug", Love: 160, Career: 115, Finance: 100, Marriage: 130 },
      { name: "Sep", Love: 150, Career: 105, Finance: 90, Marriage: 120 },
      { name: "Oct", Love: 165, Career: 120, Finance: 105, Marriage: 140 },
      { name: "Nov", Love: 180, Career: 130, Finance: 115, Marriage: 155 },
      { name: "Dec", Love: 200, Career: 150, Finance: 130, Marriage: 170 }
    ],
    consultations: [
      { name: "Jan", "30mins": 140, "1hr": 90, date: "2024-01-15" },
      { name: "Feb", "30mins": 110, "1hr": 80, date: "2024-02-15" },
      { name: "Mar", "30mins": 130, "1hr": 85, date: "2024-03-15" },
      { name: "Apr", "30mins": 150, "1hr": 95, date: "2024-04-15" },
      { name: "May", "30mins": 135, "1hr": 90, date: "2024-05-15" },
      { name: "Jun", "30mins": 145, "1hr": 100, date: "2024-06-15" },
      { name: "Jul", "30mins": 155, "1hr": 110, date: "2024-07-15" },
      { name: "Aug", "30mins": 160, "1hr": 115, date: "2024-08-15" },
      { name: "Sep", "30mins": 150, "1hr": 105, date: "2024-09-15" },
      { name: "Oct", "30mins": 165, "1hr": 120, date: "2024-10-15" },
      { name: "Nov", "30mins": 180, "1hr": 130, date: "2024-11-15" },
      { name: "Dec", "30mins": 200, "1hr": 150, date: "2024-12-15" }
    ]
  }
};

const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const Analytics: React.FC = () => {
  const theme = useTheme();
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [visiblePlans, setVisiblePlans] = useState<string[]>(["Basic", "Standard", "Premium", "Enterprise"]);
  const [visibleServices, setVisibleServices] = useState<string[]>(["Love", "Career", "Finance", "Marriage"]);
  const [visibleConsultations, setVisibleConsultations] = useState<string[]>(["30mins", "1hr"]);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const currentYearData = yearlyData[selectedYear];

  const handleYearChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedYear(event.target.value as number);
  };

  const handleLegendClick = (entry: any, type: string) => {
    const key = entry.dataKey;
    if (type === "plans") {
      setVisiblePlans(prev => prev.includes(key) ? prev.filter(p => p !== key) : [...prev, key]);
    } else if (type === "services") {
      setVisibleServices(prev => prev.includes(key) ? prev.filter(p => p !== key) : [...prev, key]);
    } else if (type === "consultations") {
      setVisibleConsultations(prev => prev.includes(key) ? prev.filter(p => p !== key) : [...prev, key]);
    }
  };

  // Utility function to calculate trends and max/min
  const enhanceData = (data: any[], keys: string[]) => {
    const enhancedData = data.map((month, index) => {
      const enhancedMonth = { ...month };
      keys.forEach(key => {
        if (index > 0) {
          const prevValue = data[index - 1][key] || 0;
          const currentValue = month[key] || 0;
          enhancedMonth[`${key}_trend`] = currentValue > prevValue ? "↑" : currentValue < prevValue ? "↓" : "→";
        } else {
          enhancedMonth[`${key}_trend`] = "";
        }
      });
      return enhancedMonth;
    });

    const stats = keys.reduce((acc, key) => {
      const values = data.map(m => m[key] || 0).filter(v => v > 0);
      const max = values.length ? Math.max(...values) : 0;
      const min = values.length ? Math.min(...values) : 0;
      acc[key] = {
        maxMonth: max ? (data.find(m => m[key] === max)?.name || "") : "",
        minMonth: min ? (data.find(m => m[key] === min)?.name || "") : "",
      };
      return acc;
    }, {} as { [key: string]: { maxMonth: string; minMonth: string } });

    return { enhancedData, stats };
  };

  // Plans
  const { enhancedData: enhancedPlanData, stats: planStats } = enhanceData(currentYearData.plans, ["Basic", "Standard", "Premium", "Enterprise"]);
  
  // Services
  const { enhancedData: enhancedServiceData, stats: serviceStats } = enhanceData(currentYearData.services, ["Love", "Career", "Finance", "Marriage"]);
  
  // Consultations
  const { enhancedData: enhancedConsultationData, stats: consultationStats } = enhanceData(currentYearData.consultations, ["30mins", "1hr"]);

  // Custom Tooltip for all charts
  const CustomTooltip: React.FC<{ active?: boolean; payload?: any[]; label?: string; type: string; keys: string[]; stats: any }> = ({ active, payload, label, type, stats }) => {
    if (active && payload && payload.length && label) {
      return (
        <Box
          sx={{
            background: "rgba(255, 255, 255, 0.95)",
            border: "none",
            borderRadius: "6px",
            padding: "10px",
            fontSize: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 600 }}>{label}</Typography>
          {payload.map((entry, index) => {
            const key = entry.name;
            const isMax = stats[key]?.maxMonth === label;
            const isMin = stats[key]?.minMonth === label;
            const trend = (
              type === "plans" ? enhancedPlanData :
              type === "services" ? enhancedServiceData :
              enhancedConsultationData
            ).find((m: any) => m.name === label)?.[`${key}_trend`] || "";
            return (
              <Box key={index} sx={{ color: entry.color }}>
                <Typography variant="caption">
                  {key}: {entry.value} {trend}
                  {isMax && " (Peak)"}
                  {isMin && " (Low)"}
                </Typography>
              </Box>
            );
          })}
        </Box>
      );
    }
    return null;
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        background: "linear-gradient(135deg, #f5f7fa 0%, #e4f0f9 100%)",
        minHeight: "100vh",
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' },
        maxWidth: "1200px", 
        mx: "auto", 
        mb: 3,
        gap: 2
      }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "#1b4d3e",
            position: "relative",
            "&:after": {
              content: '""',
              display: "block",
              width: "60px",
              height: "3px",
              background: "linear-gradient(90deg, #1b4d3e, #4caf50)",
              margin: "8px 0 0",
              borderRadius: "2px",
            },
          }}
        >
          Analytics Dashboard
        </Typography>
        
        <Select
          value={selectedYear}
          onChange={handleYearChange}
          sx={{
            minWidth: 120,
            background: "rgba(255, 255, 255, 0.9)",
            border: "1px solid rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            "& .MuiSelect-select": {
              py: 1,
            },
          }}
        >
          {Object.keys(yearlyData).map(year => (
            <MenuItem key={year} value={parseInt(year)}>{year}</MenuItem>
          ))}
        </Select>
      </Box>

      {/* Column layout for charts */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 3, 
        maxWidth: "1200px", 
        mx: "auto" 
      }}>
        {/* Plan-wise User Count */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: "12px",
            background: "rgba(255, 255, 255, 0.9)",
            border: "1px solid rgba(0, 0, 0, 0.05)",
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
            Users by Plan ({selectedYear})
          </Typography>
          <Box sx={{ height: isMobile ? '250px' : '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={enhancedPlanData}
                margin={{ top: 20, right: 15, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#1b4d3e", fontSize: "12px" }}
                  axisLine={{ stroke: "#1b4d3e", opacity: 0.2 }}
                />
                <YAxis
                  tick={{ fill: "#1b4d3e", fontSize: "12px" }}
                  axisLine={{ stroke: "#1b4d3e", opacity: 0.2 }}
                  label={{ value: "User Count", angle: -90, position: "insideLeft", fill: "#1b4d3e", fontSize: "12px" }}
                />
                <Tooltip content={<CustomTooltip type="plans" keys={["Basic", "Standard", "Premium", "Enterprise"]} stats={planStats} />} />
                <Legend
                  onClick={(entry) => handleLegendClick(entry, "plans")}
                  wrapperStyle={{
                    paddingTop: isMobile ? '10px' : '0',
                    cursor: 'pointer'
                  }}
                />
                {["Basic", "Standard", "Premium", "Enterprise"].map((plan, index) => (
                  visiblePlans.includes(plan) && (
                    <Bar
                      key={plan}
                      dataKey={plan}
                      fill={COLORS[index % COLORS.length]}
                      name={`${plan} Users`}
                      opacity={0.8}
                    >
                      <LabelList
                        dataKey={plan}
                        position="top"
                        fill="#1b4d3e"
                        fontSize={isMobile ? 10 : 12}
                        formatter={(value: number) => value || ""}
                      />
                      {enhancedPlanData.map((entry, i) => (
                        <Cell
                          key={`cell-${i}`}
                          fill={
                            planStats[plan]?.maxMonth === entry.name
                              ? COLORS[index % COLORS.length]
                              : planStats[plan]?.minMonth === entry.name
                              ? `${COLORS[index % COLORS.length]}80`
                              : COLORS[index % COLORS.length]
                          }
                        />
                      ))}
                    </Bar>
                  )
                ))}
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>

        {/* Service Usage */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: "12px",
            background: "rgba(255, 255, 255, 0.9)",
            border: "1px solid rgba(0, 0, 0, 0.05)",
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
            Service Usage ({selectedYear})
          </Typography>
          <Box sx={{ height: isMobile ? '250px' : '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={enhancedServiceData}
                margin={{ top: 20, right: 15, left: 0, bottom: 0 }}
              >
                <defs>
                  {["Love", "Career", "Finance", "Marriage"].map((service, i) => (
                    <linearGradient key={i} id={`color${service}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS[i]} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={COLORS[i]} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#1b4d3e", fontSize: "12px" }}
                  axisLine={{ stroke: "#1b4d3e", opacity: 0.2 }}
                />
                <YAxis
                  tick={{ fill: "#1b4d3e", fontSize: "12px" }}
                  axisLine={{ stroke: "#1b4d3e", opacity: 0.2 }}
                  label={{ value: "Usage Count", angle: -90, position: "insideLeft", fill: "#1b4d3e", fontSize: "12px" }}
                />
                <Tooltip content={<CustomTooltip type="services" keys={["Love", "Career", "Finance", "Marriage"]} stats={serviceStats} />} />
                <Legend
                  onClick={(entry) => handleLegendClick(entry, "services")}
                  wrapperStyle={{
                    paddingTop: isMobile ? '10px' : '0',
                    cursor: 'pointer'
                  }}
                />
                {["Love", "Career", "Finance", "Marriage"].map((service, i) => (
                  visibleServices.includes(service) && (
                    <Area
                      key={i}
                      type="monotone"
                      dataKey={service}
                      stackId="1"
                      stroke={COLORS[i]}
                      fill={`url(#color${service})`}
                      strokeWidth={1.5}
                    >
                      <LabelList
                        dataKey={service}
                        position="top"
                        fill="#1b4d3e"
                        fontSize={isMobile ? 10 : 12}
                        formatter={(value: number) => value || ""}
                      />
                    </Area>
                  )
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Paper>

        {/* Astrologer Consultations */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: "12px",
            background: "rgba(255, 255, 255, 0.9)",
            border: "1px solid rgba(0, 0, 0, 0.05)",
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
                background: COLORS[2],
                marginRight: "8px",
              },
            }}
          >
            Astrologer Consultations ({selectedYear})
          </Typography>
          <Box sx={{ height: isMobile ? '250px' : '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={enhancedConsultationData}
                margin={{ top: 20, right: 15, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#1b4d3e", fontSize: "12px" }}
                  axisLine={{ stroke: "#1b4d3e", opacity: 0.2 }}
                />
                <YAxis
                  tick={{ fill: "#1b4d3e", fontSize: "12px" }}
                  axisLine={{ stroke: "#1b4d3e", opacity: 0.2 }}
                  label={{ value: "Consultation Count", angle: -90, position: "insideLeft", fill: "#1b4d3e", fontSize: "12px" }}
                />
                <Tooltip content={<CustomTooltip type="consultations" keys={["30mins", "1hr"]} stats={consultationStats} />} />
                <Legend
                  onClick={(entry) => handleLegendClick(entry, "consultations")}
                  wrapperStyle={{
                    paddingTop: isMobile ? '10px' : '0',
                    cursor: 'pointer'
                  }}
                />
                {["30mins", "1hr"].map((consultation, index) => (
                  visibleConsultations.includes(consultation) && (
                    <Bar
                      key={consultation}
                      dataKey={consultation}
                      fill={COLORS[(index + 2) % COLORS.length]}
                      name={consultation === "30mins" ? "30 mins consultations" : "1 hour consultations"}
                      opacity={0.8}
                    >
                      <LabelList
                        dataKey={consultation}
                        position="top"
                        fill="#1b4d3e"
                        fontSize={isMobile ? 10 : 12}
                        formatter={(value: number) => value || ""}
                      />
                      {enhancedConsultationData.map((entry, i) => (
                        <Cell
                          key={`cell-${i}`}
                          fill={
                            consultationStats[consultation]?.maxMonth === entry.name
                              ? COLORS[(index + 2) % COLORS.length]
                              : consultationStats[consultation]?.minMonth === entry.name
                              ? `${COLORS[(index + 2) % COLORS.length]}80`
                              : COLORS[(index + 2) % COLORS.length]
                          }
                        />
                      ))}
                    </Bar>
                  )
                ))}
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>

        {/* Compact Stats Row */}
        <Grid container spacing={2}>
          {[
            { plan_name: "Basic", users: currentYearData.plans[11].Basic },
            { plan_name: "Standard", users: currentYearData.plans[11].Standard },
            { plan_name: "Premium", users: currentYearData.plans[11].Premium },
            { plan_name: "Enterprise", users: currentYearData.plans[11].Enterprise },
          ].map((plan, index) => (
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
    </Box>
  );
};

export default Analytics;