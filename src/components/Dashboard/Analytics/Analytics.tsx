// import React, { useState, useEffect, useMemo } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   CartesianGrid,
//   Legend,
// } from "recharts";
// import {
//   Typography,
//   Grid,
//   Box,
//   Paper,
//   useTheme,
//   MenuItem,
//   Select,
//   useMediaQuery,
//   SelectChangeEvent,
// } from "@mui/material";
// import { callAPI } from "../../../api/crudFactory";
// import { motion, useAnimation } from "framer-motion";

// // Colors for Line Chart
// const COLORS = [
//   "#1B5E20", // dark green
//   "#4CAF50", // medium green
//   "#81C784", // light green
//   "#A5D6A7", // pale green
//   "#00C49F", // teal
//   "#FFBB28", // amber
//   "#FF8042", // orange
//   "#8884D8", // purple
//   "#0088FE", // blue
//   "#FF6699", // pink
// ];

// // Green variants for Donut Chart
// // const DONUT_COLORS = [
// //   "#1B5E20", // forest green
// //   "#2E7D32", // emerald green
// //   "#4CAF50", // lime green
// //   "#66BB6A", // mint green
// //   "#81C784", // seafoam green
// //   "#A5D6A7", // pale green
// //   "#388E3C", // deep green
// //   "#689F38", // olive green
// //   "#AED581", // spring green
// //   "#C8E6C9", // very light green
// // ];

// const DONUT_COLORS = [
//   "#2E7D32", // Emerald Green
//   "#66BB6A", // Mint Green
//   "#26A69A", // Teal
//   "#009688", // Blue-Green
//   "#8BC34A", // Light Olive
//   "#C0CA33", // Yellow-Green
//   "#00ACC1", // Cyan
//   "#7CB342", // Chartreuse
//   "#43A047", // Deep Leaf Green
//   "#B2DFDB", // Soft Aqua
// ];

// const Analytics: React.FC = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"));

//   const [selectedYear, setSelectedYear] = useState<number | null>(null);
//   const [filterType, setFilterType] = useState<string>("previous12");
//   console.log(filterType, "filterType");
//   const [analyticsData, setAnalyticsData] = useState<any>({
//     subscription: {},
//     users_per_service: [],
//   });
//   const [loading, setLoading] = useState<boolean>(true);

//   // Animation controls
//   const mainControls = useAnimation();
//   const lineChartControls = useAnimation();
//   const donutChartControls = useAnimation();
//   const statsControls = useAnimation();

//   useEffect(() => {
//     let isMounted = true;

//     const fetchAnalytics = async () => {
//       try {
//         setLoading(true);
//         const response = await callAPI({
//           endpoint: "/api/admin/analytics",
//           method: "get",
//         });
//         if (isMounted) {
//           console.log(response.data, "response.data");
//           setAnalyticsData(response.data);
//           const availableYears = Object.keys(response.data.subscription)
//             .map((year) => parseInt(year))
//             .sort((a, b) => a - b);
//           if (availableYears.length > 0) {
//             setSelectedYear(availableYears[availableYears.length - 1]);
//           }
//         }
//       } catch (error) {
//         console.error("Failed to fetch analytics:", error);
//       } finally {
//         if (isMounted) {
//           setLoading(false);
//         }
//       }
//     };

//     fetchAnalytics();

//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   // Memoize available years
//   const availableYears = useMemo(
//     () =>
//       Object.keys(analyticsData.subscription)
//         .map((year) => parseInt(year))
//         .sort((a, b) => a - b),
//     [analyticsData.subscription]
//   );

//   // Month order for sorting
//   const monthOrder = [
//     "Jan",
//     "Feb",
//     "Mar",
//     "Apr",
//     "May",
//     "Jun",
//     "Jul",
//     "Aug",
//     "Sep",
//     "Oct",
//     "Nov",
//     "Dec",
//   ];

//   // Prepare Plans data for LineChart (Year-wise)
//   const getYearWiseData = (year: number) => {
//     if (!analyticsData.subscription[year]?.plans) return [];
//     const plans = analyticsData.subscription[year].plans;
//     return plans.map((month: any) => ({
//       name: month.name,
//       ...month,
//     }));
//   };

//   const getPrevious12MonthsData = () => {
//     let allData: any[] = [];

//     for (const year in analyticsData.subscription) {
//       if (analyticsData.subscription[year].plans) {
//         const yearPlans = analyticsData.subscription[year].plans.map(
//           (month: any) => ({
//             name: `${month.name} ${year}`,
//             ...month,
//             year: parseInt(year),
//             monthIndex: monthOrder.indexOf(month.name),
//           })
//         );
//         allData = allData.concat(yearPlans);
//       }
//     }

//     // Sort by actual date
//     allData.sort((a, b) => {
//       const dateA = new Date(a.year, a.monthIndex, 1).getTime();
//       const dateB = new Date(b.year, b.monthIndex, 1).getTime();
//       return dateA - dateB;
//     });

//     // Return only the last 12 entries
//     // return allData.slice(-12).map(({ year, monthIndex, ...rest }) => rest);
//     return allData.slice(-12).map(({ ...rest }) => rest);
//   };

//   // Get all plan names dynamically from the data for the selected year
//   const getPlanNames = (year: number) => {
//     if (!analyticsData.subscription[year]?.plans) return [];
//     const plans = analyticsData.subscription[year].plans;
//     const planNames = new Set<string>();
//     plans.forEach((month: any) => {
//       Object.keys(month).forEach((key) => {
//         if (key !== "name") {
//           planNames.add(key);
//         }
//       });
//     });
//     return Array.from(planNames);
//   };

//   // Memoize planData to prevent re-computation
//   const planData = useMemo(
//     () =>
//       filterType === "previous12"
//         ? getPrevious12MonthsData()
//         : selectedYear
//         ? getYearWiseData(selectedYear)
//         : [],
//     [filterType, selectedYear, analyticsData.subscription]
//   );

//   // Memoize donutData to prevent re-computation
//   const donutData = useMemo(
//     () =>
//       analyticsData.users_per_service?.length > 0
//         ? analyticsData.users_per_service.map((service: any) => ({
//             name: service.name,
//             value: service.user_count > 0 ? service.user_count : 0.01,
//           }))
//         : [],
//     [analyticsData.users_per_service]
//   );

//   // Memoize allValuesZero to prevent re-computation
//   const allValuesZero = useMemo(
//     () =>
//       analyticsData.users_per_service?.every(
//         (service: any) => service.user_count === 0
//       ) || false,
//     [analyticsData.users_per_service]
//   );

//   // Calculate total users for donut chart center label
//   const totalUsers = useMemo(
//     () =>
//       donutData.reduce(
//         (sum: any, entry: any) =>
//           sum + (entry.value === 0.01 ? 0 : entry.value),
//         0
//       ),
//     [donutData]
//   );

//   // Memoize latestMonthData for Compact Stats Row
//   const latestMonthData = useMemo(
//     () =>
//       selectedYear &&
//       analyticsData.subscription[selectedYear]?.plans?.length > 0
//         ? analyticsData.subscription[selectedYear].plans.reduce(
//             (acc: any, month: any) => {
//               Object.keys(month).forEach((key) => {
//                 if (key !== "name") {
//                   acc[key] = (acc[key] || 0) + month[key];
//                 }
//               });
//               return acc;
//             },
//             {}
//           )
//         : {},
//     [selectedYear, analyticsData.subscription]
//   );

//   // Memoize compactStatsData
//   const compactStatsData = useMemo(
//     () =>
//       Object.keys(latestMonthData)
//         .filter((key) => key !== "name")
//         .map((plan, index) => ({
//           plan_name: plan,
//           users: latestMonthData[plan] || 0,
//           colorIndex: index % COLORS.length,
//         })),
//     [latestMonthData]
//   );

//   const handleYearChange = (event: SelectChangeEvent<number>) => {
//     setSelectedYear(event.target.value as number);
//     setFilterType("year");
//   };

//   const handleFilterChange = (event: SelectChangeEvent<string>) => {
//     setFilterType(event.target.value as string);
//   };

//   // Custom Tooltip for LineChart
//   const CustomTooltip: React.FC<{
//     active?: boolean;
//     payload?: any[];
//     label?: string;
//   }> = ({ active, payload, label }) => {
//     if (active && payload && payload.length && label) {
//       return (
//         <Box
//           sx={{
//             background: "rgba(255, 255, 255, 0.95)",
//             border: "1px solid #1B5E20",
//             borderRadius: "8px",
//             padding: "12px",
//             fontSize: "14px",
//             boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
//           }}
//         >
//           <Typography
//             variant="caption"
//             sx={{ fontWeight: 600, color: "#1B5E20" }}
//             style={{ fontFamily: "Urbanist", fontWeight: 600 }}
//           >
//             {label}
//           </Typography>
//           {payload.map((entry, index) => (
//             <Box key={index} sx={{ color: entry.color }}>
//               <Typography
//                 variant="caption"
//                 style={{ fontFamily: "Urbanist", fontWeight: 500 }}
//               >
//                 {entry.name}: {entry.value}
//               </Typography>
//             </Box>
//           ))}
//         </Box>
//       );
//     }
//     return null;
//   };

//   // Animation variants for the entire component
//   const containerVariants = {
//     hidden: { opacity: 0, y: 100 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.6, // Reduced from 0.8
//         ease: "easeOut",
//       },
//     },
//   };

//   // Animation variants for Line Chart container
//   const lineChartVariants = {
//     hidden: { opacity: 0, y: 50 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.6, // Reduced from 0.8
//         ease: "easeOut",
//         delay: 0.2, // Reduced from 0.3
//       },
//     },
//   };

//   // Animation variants for Donut Chart container
//   const donutChartVariants = {
//     hidden: { opacity: 0, y: 50 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.6, // Reduced from 0.8
//         ease: "easeOut",
//         delay: 0.4, // Reduced from 0.6
//       },
//     },
//   };

//   // Animation for Compact Stats Row
//   const statsVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: (i: number) => ({
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.4, // Reduced from 0.5
//         ease: "easeOut",
//         delay: 0.7 + i * 0.15, // Reduced from 0.9 + i * 0.2
//       },
//     }),
//   };

//   // Trigger animations on mount
//   useEffect(() => {
//     const animate = async () => {
//       await mainControls.start("visible");
//       await lineChartControls.start("visible");
//       await donutChartControls.start("visible");
//       await statsControls.start("visible");
//     };
//     animate();
//   }, [mainControls, lineChartControls, donutChartControls, statsControls]);

//   console.log(planData, "planData");

//   return (
//     <motion.div
//       variants={containerVariants}
//       initial="hidden"
//       animate={mainControls}
//       style={{
//         padding: isMobile ? "16px" : "24px",
//         background: "linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)",
//         minHeight: "100vh",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//       }}
//     >
//       {/* Header Section */}
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: { xs: "column", sm: "row" },
//           justifyContent: "space-between",
//           alignItems: { xs: "flex-start", sm: "center" },
//           maxWidth: "1200px",
//           width: "100%",
//           mb: 3,
//           gap: 2,
//         }}
//       >
//         <Typography
//           variant="h5"
//           sx={{
//             fontWeight: 700,
//             color: "#1B5E20",
//             "&:after": {
//               content: '""',
//               display: "block",
//               width: "60px",
//               height: "4px",
//               background: "linear-gradient(90deg, #1B5E20, #4CAF50)",
//               mt: 1,
//               borderRadius: "2px",
//             },
//           }}
//           style={{ fontFamily: "Urbanist", fontWeight: 800 }}
//         >
//           Analytics Dashboard
//         </Typography>
//         <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
//           <Select<string>
//             value={filterType}
//             onChange={handleFilterChange}
//             sx={{
//               minWidth: 140,
//               background: "#FFFFFF",
//               fontFamily: "Urbanist",
//               fontWeight: 600,
//               borderRadius: "8px",
//               "& .MuiSelect-select": { py: 1.5 },
//               "&:hover": { background: "#E8F5E9" },
//               "& .MuiOutlinedInput-notchedOutline": { borderColor: "#4CAF50" },
//             }}
//             disabled={loading}
//           >
//             <MenuItem
//               value="previous12"
//               style={{ fontFamily: "Urbanist", fontWeight: 500 }}
//             >
//               Previous 12 Months
//             </MenuItem>
//             <MenuItem
//               value="year"
//               style={{ fontFamily: "Urbanist", fontWeight: 500 }}
//             >
//               Year-wise
//             </MenuItem>
//           </Select>
//           {filterType === "year" && selectedYear !== null && (
//             <Select<number>
//               value={selectedYear ?? availableYears[0] ?? ""}
//               onChange={handleYearChange}
//               sx={{
//                 minWidth: 140,
//                 background: "#FFFFFF",
//                 borderRadius: "8px",
//                 fontFamily: "Urbanist",
//                 fontWeight: 600,
//                 "& .MuiSelect-select": { py: 1.5 },
//                 "&:hover": { background: "#E8F5E9" },
//                 "& .MuiOutlinedInput-notchedOutline": {
//                   borderColor: "#4CAF50",
//                 },
//               }}
//               disabled={availableYears.length === 0 || loading}
//             >
//               {availableYears.map((year) => (
//                 <MenuItem
//                   key={year}
//                   value={year}
//                   style={{ fontFamily: "Urbanist", fontWeight: 500 }}
//                 >
//                   {year}
//                 </MenuItem>
//               ))}
//             </Select>
//           )}
//         </Box>
//       </Box>

//       {/* Main Content */}
//       <Box
//         sx={{
//           maxWidth: "1200px",
//           width: "100%",
//           display: "flex",
//           flexDirection: "column",
//           gap: 3,
//         }}
//       >
//         {/* Line Chart: Users by Plan */}
//         <motion.div
//           variants={lineChartVariants}
//           initial="hidden"
//           animate={lineChartControls}
//         >
//           <Paper
//             elevation={2}
//             sx={{
//               p: { xs: 2, md: 3 },
//               borderRadius: "12px",
//               background: "linear-gradient(145deg, #FFFFFF, #F1F8E9)",
//               border: "1px solid #E8F5E9",
//               boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
//             }}
//           >
//             <Typography
//               variant="subtitle1"
//               style={{ fontFamily: "Urbanist", fontWeight: 600 }}
//               sx={{
//                 fontWeight: 600,
//                 color: "#1B5E20",
//                 mb: 2,
//                 display: "flex",
//                 alignItems: "center",
//                 "&:before": {
//                   content: '""',
//                   width: "10px",
//                   height: "10px",
//                   borderRadius: "50%",
//                   background: "#4CAF50",
//                   mr: 1,
//                 },
//               }}
//             >
//               Users by Plan{" "}
//               {filterType === "year" && selectedYear
//                 ? `(${selectedYear})`
//                 : filterType === "previous12"
//                 ? "(Previous 12 Months)"
//                 : ""}
//             </Typography>
//             <Box sx={{ height: isMobile ? 250 : 350 }}>
//               {loading ? (
//                 <Typography
//                   variant="body2"
//                   color="text.secondary"
//                   sx={{ textAlign: "center", mt: 2 }}
//                   style={{ fontFamily: "Urbanist", fontWeight: 600 }}
//                 >
//                   Loading...
//                 </Typography>
//               ) : planData.length > 0 ? (
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart
//                     data={planData}
//                     margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
//                   >
//                     <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
//                     <XAxis
//                       dataKey="name"
//                       tick={{
//                         fill: "#1B5E20",
//                         fontSize: isMobile ? 10 : 12,
//                         fontFamily: "Urbanist",
//                         fontWeight: 500,
//                       }}
//                       axisLine={{ stroke: "#1B5E20", opacity: 0.3 }}
//                     />
//                     <YAxis
//                       tick={{
//                         fill: "#1B5E20",
//                         fontSize: isMobile ? 10 : 12,
//                         fontFamily: "Urbanist",
//                         fontWeight: 500,
//                       }}
//                       axisLine={{ stroke: "#1B5E20", opacity: 0.3 }}
//                       label={{
//                         value: "Users Count",
//                         angle: -90,
//                         position: "insideLeft",
//                         fill: "#1B5E20",
//                         fontSize: isMobile ? 10 : 12,
//                         fontFamily: "Urbanist",
//                         fontWeight: 600,
//                       }}
//                     />
//                     <Tooltip content={<CustomTooltip />} />
//                     <Legend
//                       wrapperStyle={{
//                         paddingTop: isMobile ? 10 : 20,
//                         fontSize: isMobile ? 10 : 12,
//                         fontFamily: "Urbanist",
//                         fontWeight: 600,
//                       }}
//                     />
//                     {selectedYear &&
//                       getPlanNames(selectedYear).map((plan, index) => (
//                         <Line
//                           key={plan}
//                           type="monotone"
//                           dataKey={plan}
//                           stroke={COLORS[index % COLORS.length]}
//                           strokeWidth={2}
//                           // dot={{ r: 4 }}
//                           activeDot={{ r: 6 }}
//                           name={`${plan} Users`}
//                           isAnimationActive={false}
//                           dot={
//                             <motion.circle
//                               initial={{ scale: 0 }}
//                               animate={{ scale: 1 }}
//                               transition={{
//                                 duration: 0.4,
//                                 delay: 0.4 + index * 0.2,
//                                 type: "spring",
//                                 bounce: 0.4,
//                               }}
//                               r={4}
//                               fill={COLORS[index % COLORS.length]}
//                             />
//                           }
//                         />
//                       ))}
//                   </LineChart>
//                 </ResponsiveContainer>
//               ) : (
//                 <Typography
//                   variant="body2"
//                   color="text.secondary"
//                   sx={{ textAlign: "center", mt: 2 }}
//                   style={{ fontFamily: "Urbanist", fontWeight: 600 }}
//                 >
//                   No plan data available.
//                 </Typography>
//               )}
//             </Box>
//           </Paper>
//         </motion.div>

//         {/* Compact Stats Row */}
//         <Grid container spacing={2}>
//           {compactStatsData.map((plan, index) => (
//             <Grid item xs={6} sm={3} key={index}>
//               <motion.div
//                 variants={statsVariants}
//                 initial="hidden"
//                 animate={statsControls}
//                 custom={index}
//               >
//                 <Box
//                   sx={{
//                     p: 1.5,
//                     borderRadius: "8px",
//                     background: `linear-gradient(135deg, ${
//                       COLORS[plan.colorIndex]
//                     }, ${COLORS[(plan.colorIndex + 1) % COLORS.length]})`,
//                     color: "#FFFFFF",
//                     textAlign: "center",
//                     boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//                     transition: "transform 0.2s",
//                     "&:hover": { transform: "scale(1.05)" },
//                   }}
//                 >
//                   <Typography
//                     style={{ fontFamily: "Urbanist", fontWeight: 500 }}
//                     variant="h6"
//                     sx={{
//                       fontWeight: 700,
//                       fontSize: isMobile ? "1rem" : "1.25rem",
//                     }}
//                   >
//                     {plan.users}
//                   </Typography>
//                   <Typography
//                     style={{ fontFamily: "Urbanist", fontWeight: 500 }}
//                     variant="caption"
//                     sx={{
//                       opacity: 0.9,
//                       fontSize: isMobile ? "0.65rem" : "0.75rem",
//                     }}
//                   >
//                     {plan.plan_name} Users
//                   </Typography>
//                 </Box>
//               </motion.div>
//             </Grid>
//           ))}
//         </Grid>

//         {/* Donut Chart: Service Usage */}
//         {/* Donut Chart: Service Usage */}
//         <motion.div
//           variants={donutChartVariants}
//           initial="hidden"
//           animate={donutChartControls}
//         >
//           <Paper
//             elevation={2}
//             sx={{
//               p: { xs: 2, md: 3 },
//               borderRadius: "12px",
//               background: "linear-gradient(145deg, #FFFFFF, #F1F8E9)",
//               border: "1px solid #E8F5E9",
//               boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
//               position: "relative",
//               overflow: "hidden",
//               minHeight: isMobile ? "500px" : "auto", // Increased mobile height
//             }}
//           >
//             <Typography
//               variant="subtitle1"
//               style={{ fontFamily: "Urbanist", fontWeight: 600 }}
//               sx={{
//                 fontWeight: 600,
//                 color: "#1B5E20",
//                 mb: 2,
//                 display: "flex",
//                 alignItems: "center",
//                 "&:before": {
//                   content: '""',
//                   width: "10px",
//                   height: "10px",
//                   borderRadius: "50%",
//                   background: "#4CAF50",
//                   mr: 1,
//                 },
//               }}
//             >
//               Service Usage
//             </Typography>
//             <Box
//               sx={{
//                 height: isMobile ? "400px" : "350px", // Adjusted heights
//                 position: "relative",
//                 display: "flex",
//                 flexDirection: isMobile ? "column" : "row",
//                 alignItems: "center",
//                 gap: isMobile ? 3 : 2,
//               }}
//             >
//               {loading ? (
//                 <Typography
//                   variant="body2"
//                   color="text.secondary"
//                   sx={{ textAlign: "center", mt: 2 }}
//                   style={{ fontFamily: "Urbanist", fontWeight: 600 }}
//                 >
//                   Loading...
//                 </Typography>
//               ) : donutData.length > 0 ? (
//                 allValuesZero ? (
//                   <Typography
//                     variant="body2"
//                     color="text.secondary"
//                     sx={{ textAlign: "center", mt: 2 }}
//                     style={{ fontFamily: "Urbanist", fontWeight: 600 }}
//                   >
//                     No usage recorded for any service.
//                   </Typography>
//                 ) : (
//                   <>
//                     {/* Donut Chart - Top on mobile, left on desktop */}
//                     <Box
//                       sx={{
//                         width: isMobile ? "100%" : "50%",
//                         height: isMobile ? "45%" : "100%", // Percentage-based height
//                         minHeight: isMobile ? "200px" : "auto",
//                       }}
//                     >
//                       <ResponsiveContainer width="100%" height="100%">
//                         <PieChart>
//                           <Pie
//                             data={donutData}
//                             cx="50%"
//                             cy="50%"
//                             innerRadius={isMobile ? 60 : 70} // Slightly larger on mobile
//                             outerRadius={isMobile ? 90 : 110}
//                             labelLine={false}
//                             label={false}
//                             dataKey="value"
//                             isAnimationActive={false}
//                             startAngle={90}
//                             endAngle={-270}
//                           >
//                             {donutData.map((entry: any, index: number) => (
//                               <Cell
//                                 key={`cell-${index}`}
//                                 fill={DONUT_COLORS[index % DONUT_COLORS.length]}
//                                 opacity={entry.value === 0.01 ? 0.3 : 1}
//                                 // startAngle={pieAngles[index]?.startAngle || 90}
//                                 // endAngle={pieAngles[index]?.endAngle || 90}
//                               />
//                             ))}
//                           </Pie>
//                           <Tooltip
//                             formatter={(value: number, name: string) => [
//                               value === 0.01 ? 0 : value,
//                               name,
//                             ]}
//                             contentStyle={{
//                               background: "rgba(255, 255, 255, 0.95)",
//                               border: "1px solid #1B5E20",
//                               borderRadius: "8px",
//                               boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
//                               fontSize: isMobile ? "12px" : "14px",
//                             }}
//                           />
//                         </PieChart>
//                       </ResponsiveContainer>
//                     </Box>

//                     {/* User Counts - Bottom on mobile, right on desktop */}
//                     <Box
//                       sx={{
//                         width: "100%",
//                         height: isMobile ? "55%" : "100%", // Takes remaining space
//                         display: "flex",
//                         flexDirection: "column",
//                         gap: 1.5, // Increased gap
//                         p: isMobile ? 0 : "0 16px",
//                       }}
//                     >
//                       {/* Total Users - More prominent on mobile */}
//                       <Box
//                         sx={{
//                           p: 1.5,
//                           mb: 1,
//                           borderRadius: "8px",
//                           background: "rgba(233, 245, 233, 0.7)",
//                           textAlign: "center",
//                           boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
//                         }}
//                       >
//                         <Typography
//                           variant={isMobile ? "h6" : "h6"}
//                           sx={{
//                             fontWeight: 700,
//                             color: "#1B5E20",
//                             fontSize: isMobile ? "1.1rem" : "1.25rem",
//                           }}
//                           style={{ fontFamily: "Urbanist", fontWeight: 800 }}
//                         >
//                           Total Users: {Math.round(totalUsers)}
//                         </Typography>
//                       </Box>

//                       {/* Services Grid - Improved mobile layout */}
//                       <Box
//                         sx={{
//                           flex: 1,
//                           overflowY: "auto",
//                           pr: 1,
//                           "&::-webkit-scrollbar": {
//                             width: "6px",
//                           },
//                           "&::-webkit-scrollbar-track": {
//                             background: "#f1f1f1",
//                             borderRadius: "10px",
//                           },
//                           "&::-webkit-scrollbar-thumb": {
//                             background: "#4CAF50",
//                             borderRadius: "10px",
//                           },
//                         }}
//                       >
//                         <Grid container spacing={1.5}>
//                           {donutData.map((entry: any, index: number) => (
//                             <Grid item xs={6} key={index}>
//                               <Box
//                                 sx={{
//                                   display: "flex",
//                                   flexDirection: "column",
//                                   p: 1.5,
//                                   borderRadius: "6px",
//                                   background: "rgba(233, 245, 233, 0.4)",
//                                   height: "100%",
//                                   minHeight: "70px",
//                                   justifyContent: "space-between",
//                                   "&:hover": {
//                                     background: "rgba(233, 245, 233, 0.8)",
//                                     transform: "translateY(-2px)",
//                                     boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
//                                   },
//                                   transition: "all 0.2s ease",
//                                 }}
//                               >
//                                 <Box
//                                   sx={{ display: "flex", alignItems: "center" }}
//                                 >
//                                   <Box
//                                     sx={{
//                                       width: "12px",
//                                       height: "12px",
//                                       borderRadius: "2px",
//                                       background:
//                                         DONUT_COLORS[
//                                           index % DONUT_COLORS.length
//                                         ],
//                                       mr: 1.5,
//                                       flexShrink: 0,
//                                     }}
//                                   />
//                                   <Typography
//                                     variant="body2"
//                                     sx={{
//                                       fontSize: isMobile
//                                         ? "0.85rem"
//                                         : "0.875rem",
//                                       color: "#1B5E20",
//                                       fontWeight: 500,
//                                       overflow: "hidden",
//                                       textOverflow: "ellipsis",
//                                       whiteSpace: "nowrap",
//                                     }}
//                                     style={{
//                                       fontFamily: "Urbanist",
//                                       fontWeight: 500,
//                                     }}
//                                   >
//                                     {entry.name}
//                                   </Typography>
//                                 </Box>
//                                 <Typography
//                                   variant="body1"
//                                   sx={{
//                                     fontWeight: 700,
//                                     fontSize: isMobile ? "1rem" : "1.1rem",
//                                     color: "#1B5E20",
//                                     textAlign: "right",
//                                     pt: 0.5,
//                                   }}
//                                 >
//                                   {entry.value === 0.01 ? 0 : entry.value}
//                                 </Typography>
//                               </Box>
//                             </Grid>
//                           ))}
//                         </Grid>
//                       </Box>
//                     </Box>
//                   </>
//                 )
//               ) : (
//                 <Typography
//                   variant="body2"
//                   color="text.secondary"
//                   sx={{ textAlign: "center", mt: 2 }}
//                   style={{ fontFamily: "Urbanist", fontWeight: 600 }}
//                 >
//                   No service usage data available.
//                 </Typography>
//               )}
//             </Box>
//           </Paper>
//         </motion.div>
//       </Box>
//     </motion.div>
//   );
// };

// export default Analytics;

import React, { useState, useEffect, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  Typography,
  Grid,
  Box,
  Paper,
  useTheme,
  MenuItem,
  Select,
  useMediaQuery,
  SelectChangeEvent,
} from "@mui/material";
import { motion, useAnimation } from "framer-motion";

// Simulated callAPI function
const callAPI = async ({
  endpoint,
  method,
}: {
  endpoint: string;
  method: string;
}) => {
  if (endpoint === "/api/admin/analytics" && method === "get") {
    return {
      data: {
        subscription: {
          "2024": {
            plans: [
              { name: "Apr", "Premium (3 months)": 1 },
              { name: "May", "Premium (3 months)": 1 },
              { name: "Jun", "Premium (3 months)": 1 },
              { name: "Jul", "Premium (3 months)": 2 },
              { name: "Aug", "Premium (3 months)": 1, "Premium (1 years)": 1 },
              { name: "Sep", "Premium (1 months)": 2 },
              { name: "Oct", "Premium (1 months)": 1 },
              { name: "Nov", "Premium (3 months)": 2 },
              { name: "Dec", "Premium (3 months)": 1 },
            ],
          },
          "2025": {
            plans: [
              { name: "Jan", "Premium (3 months)": 1 },
              { name: "Feb", "Premium (1 years)": 1 },
              { name: "Mar", "Premium (3 months)": 1 },
              { name: "Apr", "Premium (3 months)": 1 },
              { name: "May", "Premium (3 months)": 1 },
            ],
          },
        },
        users_per_service: [
          { service_id: 9, name: "Astrology Consultation", user_count: 81 },
          { service_id: 1, name: "Daily Predictions", user_count: 479 },
          { service_id: 6, name: "Daily Panchang", user_count: 166 },
          { service_id: 7, name: "Horoscope", user_count: 0 },
          { service_id: 2, name: "Weekly Predictions", user_count: 85 },
          { service_id: 4, name: "Marriage Match Making", user_count: 32 },
          { service_id: 8, name: "Live Chat", user_count: 7 },
          { service_id: 5, name: "Yearly Predictions", user_count: 17 },
          { service_id: 3, name: "Life Predictions", user_count: 8 },
        ],
      },
    };
  }
  throw new Error("Invalid endpoint or method");
};

// Map subscription plans to specific colors
const PLAN_COLORS: { [key: string]: string } = {
  "Premium (3 months)": "#1B5E20", // dark green
  "Premium (1 years)": "#FF8042", // orange
  "Premium (1 months)": "#0088FE", // blue
};

// Fallback colors for new plans
const FALLBACK_COLORS = [
  "#4CAF50", // medium green
  "#81C784", // light green
  "#A5D6A7", // pale green
  "#00C49F", // teal
  "#FFBB28", // amber
  "#8884D8", // purple
  "#FF6699", // pink
];

const getPlanColor = (plan: string, index: number) => {
  return PLAN_COLORS[plan] || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
};

const DONUT_COLORS = [
  "#2E7D32", // Emerald Green
  "#66BB6A", // Mint Green
  "#26A69A", // Teal
  "#009688", // Blue-Green
  "#8BC34A", // Light Olive
  "#C0CA33", // Yellow-Green
  "#00ACC1", // Cyan
  "#7CB342", // Chartreuse
  "#43A047", // Deep Leaf Green
  "#B2DFDB", // Soft Aqua
];

const Analytics: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<string>("previous12");
  const [analyticsData, setAnalyticsData] = useState<any>({
    subscription: {},
    users_per_service: [],
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Animation controls
  const mainControls = useAnimation();
  const lineChartControls = useAnimation();
  const donutChartControls = useAnimation();
  const statsControls = useAnimation();

  // Fetch analytics data
  useEffect(() => {
    let isMounted = true;

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await callAPI({
          endpoint: "/api/admin/analytics",
          method: "get",
        });
        if (isMounted) {
          // console.log(response.data, "response.data");
          setAnalyticsData(response.data);
          const availableYears = Object.keys(response.data.subscription)
            .map((year) => parseInt(year))
            .sort((a, b) => a - b);
          if (availableYears.length > 0) {
            setSelectedYear(availableYears[availableYears.length - 1]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
        if (isMounted) {
          setAnalyticsData({
            subscription: {},
            users_per_service: [],
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAnalytics();

    return () => {
      isMounted = false;
    };
  }, []);

  // Memoize available years
  const availableYears = useMemo(() => {
    const years = Object.keys(analyticsData.subscription)
      .map((year) => parseInt(year))
      .sort((a, b) => a - b);
    return years;
  }, [analyticsData.subscription]);

  // Month order for sorting
  const monthOrder = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Get all plan names dynamically from the data across all years
  const getPlanNames = () => {
    const planNames = new Set<string>();
    for (const year in analyticsData.subscription) {
      if (analyticsData.subscription[year]?.plans) {
        analyticsData.subscription[year].plans.forEach((month: any) => {
          Object.keys(month).forEach((key) => {
            if (key !== "name") {
              planNames.add(key);
            }
          });
        });
      }
    }
    return Array.from(planNames);
  };

  // Prepare Plans data for LineChart (Year-wise)
  const getYearWiseData = (year: number) => {
    if (!analyticsData.subscription[year]?.plans) return [];
    const plans = analyticsData.subscription[year].plans;
    const allPlanNames = getPlanNames();

    return monthOrder.map((monthName) => {
      const monthData = plans.find(
        (month: any) => month.name === monthName
      ) || { name: monthName };
      const dataPoint: any = { name: monthName };
      allPlanNames.forEach((plan) => {
        dataPoint[plan] = monthData[plan] || 0;
      });
      return dataPoint;
    });
  };

  const getPrevious12MonthsData = () => {
    let allData: any[] = [];

    // Step 1: Collect all data points
    for (const year in analyticsData.subscription) {
      if (analyticsData.subscription[year]?.plans) {
        const yearPlans = analyticsData.subscription[year].plans.map(
          (month: any) => ({
            name: `${month.name} ${year}`,
            ...month,
            year: parseInt(year),
            monthIndex: monthOrder.indexOf(month.name),
          })
        );
        allData = allData.concat(yearPlans);
      }
    }

    // Step 2: Sort by date
    allData.sort((a, b) => {
      const dateA = new Date(a.year, a.monthIndex, 1).getTime();
      const dateB = new Date(b.year, b.monthIndex, 1).getTime();
      return dateA - dateB;
    });

    // const keys = Object.keys(analyticsData.subscription);
    // const firstTwoKeys = keys.slice(0, 2);

    // Step 3: Filter for the last 12 months (June 2024 to May 2025)
    // const startDate = new Date(Number(firstTwoKeys[0]), 5, 1);
    // const endDate = new Date(Number(firstTwoKeys[1]), 4, 1);
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth() - 11, 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const filteredData = allData.filter((d) => {
      const date = new Date(d.year, d.monthIndex, 1);
      return date >= startDate && date <= endDate;
    });
    // Step 4: Generate data for each month in the range
    const allPlanNames = getPlanNames();
    const result: any[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const year = currentDate.getFullYear();
      const monthName = monthOrder[currentDate.getMonth()];
      const monthYear = `${monthName} ${year}`;

      const existingData =
        filteredData.find((d) => `${d.name} ${d.year}` === monthYear) || {};

      const dataPoint: any = { name: monthYear };
      allPlanNames.forEach((plan) => {
        dataPoint[plan] =
          existingData[plan] !== undefined ? existingData[plan] : 0;
      });

      result.push(dataPoint);
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return result;
  };

  // Memoize planData to prevent re-computation
  const planData = useMemo(() => {
    if (
      !analyticsData.subscription ||
      Object.keys(analyticsData.subscription).length === 0
    ) {
      return [];
    }
    return filterType === "previous12"
      ? getPrevious12MonthsData()
      : selectedYear
      ? getYearWiseData(selectedYear)
      : [];
  }, [filterType, selectedYear, analyticsData.subscription]);

  // Memoize donutData to prevent re-computation
  const donutData = useMemo(
    () =>
      analyticsData.users_per_service?.length > 0
        ? analyticsData.users_per_service.map((service: any) => ({
            name: service.name,
            value: service.user_count > 0 ? service.user_count : 0.01,
          }))
        : [],
    [analyticsData.users_per_service]
  );

  // Memoize allValuesZero to prevent re-computation
  const allValuesZero = useMemo(
    () =>
      analyticsData.users_per_service?.every(
        (service: any) => service.user_count === 0
      ) || false,
    [analyticsData.users_per_service]
  );

  // Calculate total users for donut chart center label
  const totalUsers = useMemo(
    () =>
      donutData.reduce(
        (sum: any, entry: any) =>
          sum + (entry.value === 0.01 ? 0 : entry.value),
        0
      ),
    [donutData]
  );

  // Memoize latestMonthData for Compact Stats Row
  // const latestMonthData = useMemo(() => {
  //   if (filterType === "previous12") {
  //     const lastMonth = planData[planData.length - 1] || {};
  //     const result: any = {};
  //     getPlanNames().forEach((plan) => {
  //       result[plan] = lastMonth[plan] || 0;
  //     });
  //     return result;
  //   } else if (
  //     selectedYear &&
  //     analyticsData.subscription[selectedYear]?.plans?.length > 0
  //   ) {
  //     const lastMonth = analyticsData.subscription[selectedYear].plans.reduce(
  //       (acc: any, month: any) => {
  //         Object.keys(month).forEach((key) => {
  //           if (key !== "name") {
  //             acc[key] = (acc[key] || 0) + (month[key] || 0);
  //           }
  //         });
  //         return acc;
  //       },
  //       {}
  //     );
  //     return lastMonth;
  //   }
  //   return {};
  // }, [filterType, selectedYear, analyticsData.subscription, planData]);

  // Memoize compactStatsData
  // const compactStatsData = useMemo(() => {
  //   const allPlanNames = getPlanNames();
  //   return allPlanNames.map((plan, index) => ({
  //     plan_name: plan,
  //     users: latestMonthData[plan] || 0,
  //     color: getPlanColor(plan, index),
  //   }));
  // }, [latestMonthData]);

  const handleYearChange = (event: SelectChangeEvent<number>) => {
    setSelectedYear(event.target.value as number);
    setFilterType("year");
  };

  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    const newFilterType = event.target.value as string;
    setFilterType(newFilterType);
    if (newFilterType === "previous12") {
      setSelectedYear(null);
    } else if (newFilterType === "year" && availableYears.length > 0) {
      setSelectedYear(availableYears[availableYears.length - 1]);
    }
  };

  // Custom Tooltip for LineChart
  const CustomTooltip: React.FC<{
    active?: boolean;
    payload?: any[];
    label?: string;
  }> = ({ active, payload, label }) => {
    if (active && payload && payload.length && label) {
      return (
        <Box
          sx={{
            background: "rgba(255, 255, 255, 0.95)",
            border: "1px solid #1B5E20",
            borderRadius: "8px",
            padding: "12px",
            fontSize: "14px",
            boxShadow: "0 5px 12px rgba(0,0,0,0.15)",
          }}
        >
          <Typography
            variant="caption"
            sx={{ fontWeight: 600, color: "#1B5E20" }}
            style={{ fontFamily: "Arial", fontWeight: 600 }}
          >
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Box key={index} sx={{ color: entry.color }}>
              <Typography
                variant="caption"
                style={{ fontFamily: "Arial", fontWeight: 500 }}
              >
                {entry.name}: {entry.value}
              </Typography>
            </Box>
          ))}
        </Box>
      );
    }
    return null;
  };

  // Animation variants for the entire component
  const containerVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const lineChartVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.2,
      },
    },
  };

  const donutChartVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.4,
      },
    },
  };

  // const statsVariants = {
  //   hidden: { opacity: 0, y: 20 },
  //   visible: (i: number) => ({
  //     opacity: 1,
  //     y: 0,
  //     transition: {
  //       duration: 0.4,
  //       ease: "easeOut",
  //       delay: 0.7 + i * 0.15,
  //     },
  //   }),
  // };

  useEffect(() => {
    const animate = async () => {
      await mainControls.start("visible");
      await statsControls.start("visible");
      await lineChartControls.start("visible");
      await donutChartControls.start("visible");
    };
    animate();
  }, [mainControls, lineChartControls, donutChartControls, statsControls]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate={mainControls}
      style={{
        padding: isMobile ? "16px" : "24px",
        background: "linear-gradient(135deg, #E8F5E9 0%, #FFFFFF 100%)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          maxWidth: "1200px",
          width: "100%",
          mb: 3,
          gap: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "#1B5E20",
            "&:after": {
              content: '""',
              display: "block",
              width: "100px",
              height: "4px",
              background: "linear-gradient(90deg, #1B5E20, #4CAF50)",
              mt: 1,
              borderRadius: "2px",
            },
          }}
          style={{ fontFamily: "Arial", fontWeight: 800 }}
        >
          Analytics Dashboard
        </Typography>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Select
            value={filterType}
            onChange={handleFilterChange}
            sx={{
              minWidth: 120,
              background: "#FFFFFF",
              borderRadius: "8px",
              fontFamily: "Arial",
              fontWeight: 600,
              "& .MuiSelect-select": { py: 1 },
              "&:hover": { background: "#E8F5E9" },
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#4CAF50" },
            }}
            disabled={loading}
          >
            <MenuItem
              value="previous12"
              style={{ fontFamily: "Arial", fontWeight: 500 }}
            >
              Previous 12 Months
            </MenuItem>
            <MenuItem
              value="year"
              style={{ fontFamily: "Arial", fontWeight: 500 }}
            >
              Year
            </MenuItem>
          </Select>
          {filterType === "year" && (
            <Select
              value={selectedYear || ""}
              onChange={handleYearChange}
              sx={{
                minWidth: 100,
                background: "#FFFFFF",
                borderRadius: "8px",
                fontFamily: "Arial",
                fontWeight: 600,
                "& .MuiSelect-select": { py: 1 },
                "&:hover": { background: "#E8F5E9" },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#4CAF50",
                },
              }}
              disabled={availableYears.length === 0 || loading}
            >
              {availableYears.map((year) => (
                <MenuItem
                  key={year}
                  value={year}
                  style={{ fontFamily: "Arial", fontWeight: 500 }}
                >
                  {year}
                </MenuItem>
              ))}
            </Select>
          )}
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          maxWidth: "1200px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* Line Chart: Users by Plan */}
        <motion.div
          variants={lineChartVariants}
          initial="hidden"
          animate={lineChartControls}
        >
          <Paper
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: "12px",
              background: "linear-gradient(145deg, #FFFFFF, #F1F8E9)",
              border: "1px solid #E8F5E9",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            }}
          >
            <Typography
              variant="subtitle1"
              style={{ fontFamily: "Arial", fontWeight: 600 }}
              sx={{
                fontWeight: 600,
                color: "#1B5E20",
                mb: 2,
                display: "flex",
                alignItems: "center",
                "&:before": {
                  content: '""',
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "#4CAF50",
                  mr: 1,
                },
              }}
            >
              Users by Plan{" "}
              {filterType === "year" && selectedYear
                ? `(${selectedYear})`
                : filterType === "previous12"
                ? "(Previous 12 Months)"
                : ""}
            </Typography>
            <Box sx={{ height: isMobile ? 250 : 300 }}>
              {loading ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: "center", mt: 2 }}
                  style={{ fontFamily: "Arial", fontWeight: 600 }}
                >
                  Loading...
                </Typography>
              ) : planData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={planData}
                    margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis
                      dataKey="name"
                      style={{
                        fontSize: isMobile ? 10 : 12,
                        fontFamily: "Arial",
                        fontWeight: 500,
                        fill: "#1B5E20",
                      }}
                    />
                    <YAxis
                      style={{
                        fontSize: isMobile ? 10 : 12,
                        fontFamily: "Arial",
                        fontWeight: 500,
                        fill: "#1B5E20",
                      }}
                      label={{
                        value: "Users Count",
                        angle: -90,
                        position: "insideLeft",
                        style: {
                          fontSize: isMobile ? 10 : 12,
                          fontFamily: "Arial",
                          fontWeight: 600,
                          fill: "#1B5E20",
                        },
                      }}
                      domain={[0, "auto"]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      wrapperStyle={{
                        paddingTop: isMobile ? 10 : 20,
                        fontSize: isMobile ? 10 : 12,
                        fontFamily: "Arial",
                        fontWeight: 600,
                      }}
                    />
                    {(filterType === "previous12" || selectedYear) &&
                      getPlanNames().map((plan, index) => (
                        <Line
                          key={plan}
                          type="monotone"
                          dataKey={plan}
                          stroke={getPlanColor(plan, index)}
                          strokeWidth={2}
                          activeDot={{ r: 6 }}
                          name={`${plan}`}
                          isAnimationActive={false}
                          dot={{ r: 4, fill: getPlanColor(plan, index) }}
                        />
                      ))}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: "center", mt: 2 }}
                  style={{ fontFamily: "Arial", fontWeight: 600 }}
                >
                  No plan data available.
                </Typography>
              )}
            </Box>
          </Paper>
        </motion.div>

        {/* Compact Stats Row */}
        {/* <Grid container spacing={2}>
            {compactStatsData.map((plan, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <motion.div
                  variants={statsVariants}
                  initial="hidden"
                  animate={statsControls}
                  custom={index}
                >
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: "8px",
                      background: `linear-gradient(135deg, ${plan.color}, ${plan.color}AA)`,
                      color: "white",
                      textAlign: "center",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                      transition: "transform 0.2s",
                      "&:hover": { transform: "scale(1.05)" },
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        fontSize: isMobile ? "1rem" : "1.25rem",
                        fontFamily: "Arial",
                      }}
                    >
                      {plan.users}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: isMobile ? "0.65rem" : "0.75rem",
                        fontFamily: "Arial",
                      }}
                    >
                      {plan.plan_name} Users
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid> */}

        {/* Donut Chart: Service Usage */}
        <motion.div
          variants={donutChartVariants}
          initial="hidden"
          animate={donutChartControls}
        >
          <Paper
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: "12px",
              background: "linear-gradient(145deg, #FFFFFF, #F1F8E9)",
              border: "1px solid #E8F5E9",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              position: "relative",
              overflow: "hidden",
              minHeight: isMobile ? "500px" : "auto",
            }}
          >
            <Typography
              variant="subtitle1"
              style={{ fontFamily: "Arial", fontWeight: 600 }}
              sx={{
                fontWeight: 600,
                color: "#1B5E20",
                mb: 2,
                display: "flex",
                alignItems: "center",
                "&:before": {
                  content: '""',
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "#4CAF50",
                  mr: 1,
                },
              }}
            >
              Service Usage
            </Typography>
            <Box
              sx={{
                height: isMobile ? "400px" : "350px",
                position: "relative",
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                alignItems: "center",
                gap: isMobile ? 3 : 2,
              }}
            >
              {loading ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: "center", mt: 2 }}
                  style={{ fontFamily: "Arial", fontWeight: 600 }}
                >
                  Loading...
                </Typography>
              ) : donutData.length > 0 ? (
                allValuesZero ? (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: "center", mt: 2 }}
                    style={{ fontFamily: "Arial", fontWeight: 600 }}
                  >
                    No usage recorded for any service.
                  </Typography>
                ) : (
                  <>
                    <Box
                      sx={{
                        width: isMobile ? "100%" : "50%",
                        height: isMobile ? "45%" : "100%",
                        minHeight: isMobile ? "200px" : "auto",
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={donutData}
                            cx="50%"
                            cy="50%"
                            innerRadius={isMobile ? 60 : 70}
                            outerRadius={isMobile ? 90 : 110}
                            labelLine={false}
                            label={false}
                            dataKey="value"
                            isAnimationActive={false}
                            startAngle={90}
                            endAngle={-270}
                          >
                            {donutData.map((entry: any, index: number) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={DONUT_COLORS[index % DONUT_COLORS.length]}
                                opacity={entry.value === 0.01 ? 0.3 : 1}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value: number, name: string) => [
                              value === 0.01 ? 0 : value,
                              name,
                            ]}
                            contentStyle={{
                              background: "rgba(255, 255, 255, 0.95)",
                              border: "1px solid #1B5E20",
                              borderRadius: "5px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                              fontSize: isMobile ? "12px" : "14px",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>

                    <Box
                      sx={{
                        width: "100%",
                        height: isMobile ? "55%" : "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                        p: isMobile ? 0 : "0 16px",
                      }}
                    >
                      <Box
                        sx={{
                          p: 1.5,
                          mb: 1,
                          borderRadius: "8px",
                          background: "rgba(233, 245, 233, 0.7)",
                          textAlign: "center",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        }}
                      >
                        <Typography
                          variant={isMobile ? "h6" : "h5"}
                          sx={{
                            fontWeight: 700,
                            color: "#1B5E20",
                            fontSize: isMobile ? "1.1rem" : "1.25rem",
                          }}
                          style={{ fontFamily: "Arial", fontWeight: 800 }}
                        >
                          Total Users: {Math.round(totalUsers)}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          flex: 1,
                          overflowY: "auto",
                          pr: 1,
                          "&::-webkit-scrollbar": {
                            width: "6px",
                          },
                          "&::-webkit-scrollbar-track": {
                            background: "#f1f1f1",
                            borderRadius: "10px",
                          },
                          "&::-webkit-scrollbar-thumb": {
                            background: "#4CAF50",
                            borderRadius: "10px",
                          },
                        }}
                      >
                        <Grid container spacing={1.5}>
                          {donutData.map((entry: any, index: number) => (
                            <Grid item xs={6} key={index}>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  p: 1.5,
                                  borderRadius: "6px",
                                  background: "rgba(233, 245, 233, 0.4)",
                                  height: "100%",
                                  minHeight: "70px",
                                  justifyContent: "space-between",
                                  "&:hover": {
                                    background: "rgba(233, 245, 233, 0.8)",
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                  },
                                  transition: "all 0.2s ease",
                                }}
                              >
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <Box
                                    sx={{
                                      width: "12px",
                                      height: "12px",
                                      borderRadius: "2px",
                                      background:
                                        DONUT_COLORS[
                                          index % DONUT_COLORS.length
                                        ],
                                      mr: 1.5,
                                      flexShrink: 0,
                                    }}
                                  />
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontSize: isMobile
                                        ? "0.85rem"
                                        : "0.875rem",
                                      color: "#1B5E20",
                                      fontWeight: 500,
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    }}
                                    style={{
                                      fontFamily: "Arial",
                                      fontWeight: 500,
                                    }}
                                  >
                                    {entry.name}
                                  </Typography>
                                </Box>
                                <Typography
                                  variant="body1"
                                  sx={{
                                    fontWeight: 700,
                                    fontSize: isMobile ? "1rem" : "1.1rem",
                                    color: "#1B5E20",
                                    textAlign: "right",
                                    pt: 0.5,
                                  }}
                                >
                                  {entry.value === 0.01 ? 0 : entry.value}
                                </Typography>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    </Box>
                  </>
                )
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: "center", mt: 2 }}
                  style={{ fontFamily: "Arial", fontWeight: 600 }}
                >
                  No service usage data available.
                </Typography>
              )}
            </Box>
          </Paper>
        </motion.div>
      </Box>
    </motion.div>
  );
};

export default Analytics;
