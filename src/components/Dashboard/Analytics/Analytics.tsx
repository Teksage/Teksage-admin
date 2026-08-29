import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Chip,
  Grid,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip as MuiTooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { callAPI } from "../../../api/crudFactory";

type PlatformUsage = {
  android_only?: number;
  web_only?: number;
  both?: number;
  unknown?: number;
};

type SourceTotals = {
  installs: number;
  signups: number;
  conversion_rate?: number;
};

type PlatformTotals = {
  android_installs?: number;
  android_signups?: number;
  ios_installs?: number;
  ios_signups?: number;
};

type CampaignStats = {
  campaign: string;
  source: string;
  installs: number;
  signups: number;
  conversion_rate: number;
};

type RecentInstallItem = {
  id: number;
  install_id: string;
  platform: string;
  source: string;
  campaign?: string | null;
  medium?: string | null;
  referrer?: string | null;
  user_id?: number | null;
  user_name?: string | null;
  user_phone?: string | null;
  created_at?: string | null;
  signup_at?: string | null;
};

type AcquisitionData = {
  totals_by_source?: Record<string, SourceTotals>;
  platform_breakdown?: PlatformTotals;
  campaigns?: CampaignStats[];
  recent_installs?: RecentInstallItem[];
  monthly?: Array<{
    name: string;
    facebook_installs: number;
    organic_installs: number;
    unknown_installs: number;
    facebook_signups: number;
    organic_signups: number;
    unknown_signups: number;
  }>;
  facebook_conversion_rate?: number;
  overall_conversion_rate?: number;
  total_installs?: number;
  total_signups?: number;
};

type AnalyticsPayload = {
  subscription?: Record<string, { plans?: any[] }>;
  users_per_service?: Array<{
    service_id: number;
    name: string;
    user_count: number;
  }>;
  platform_usage?: PlatformUsage;
  acquisition?: AcquisitionData;
};

const PLAN_COLORS: Record<string, string> = {
  "Premium (3 months)": "#1B5E20",
  "Premium (1 years)": "#FF8042",
  "Premium (1 months)": "#0088FE",
};

const FALLBACK_COLORS = [
  "#4CAF50",
  "#81C784",
  "#A5D6A7",
  "#00C49F",
  "#FFBB28",
  "#8884D8",
  "#FF6699",
];

const DONUT_COLORS = [
  "#2E7D32",
  "#66BB6A",
  "#26A69A",
  "#009688",
  "#8BC34A",
  "#C0CA33",
  "#00ACC1",
  "#7CB342",
  "#43A047",
  "#B2DFDB",
];

const SOURCE_COLORS: Record<string, string> = {
  facebook: "#1877F2",
  instagram: "#E1306C",
  organic: "#2E7D32",
  unknown: "#90A4AE",
};

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

const getPlanColor = (plan: string, index: number) =>
  PLAN_COLORS[plan] || FALLBACK_COLORS[index % FALLBACK_COLORS.length];

const formatIstDateTime = (value?: string | null): string => {
  if (!value) return "-";
  const str = value.trim();
  const normalized = str.endsWith("Z") || str.includes("+") ? str : `${str.replace(" ", "T")}Z`;
  const date = new Date(normalized);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const Analytics: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [tab, setTab] = useState(0);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [filterType, setFilterType] = useState("previous12");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsPayload>({});
  const [loading, setLoading] = useState(true);
  const [acquisitionMetric, setAcquisitionMetric] = useState<"installs" | "signups">("installs");
  const [recentPage, setRecentPage] = useState(0);
  const [recentRowsPerPage, setRecentRowsPerPage] = useState(10);

  useEffect(() => {
    let mounted = true;
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await callAPI({
          endpoint: "/api/admin/analytics",
          method: "get",
        });
        if (!mounted) return;
        const data = (response.data || {}) as AnalyticsPayload;
        setAnalyticsData(data);
        const years = Object.keys(data.subscription || {})
          .map((y) => parseInt(y, 10))
          .sort((a, b) => a - b);
        if (years.length > 0) setSelectedYear(years[years.length - 1]);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
        if (mounted) setAnalyticsData({});
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchAnalytics();
    return () => {
      mounted = false;
    };
  }, []);

  const availableYears = useMemo(
    () =>
      Object.keys(analyticsData.subscription || {})
        .map((y) => parseInt(y, 10))
        .sort((a, b) => a - b),
    [analyticsData.subscription]
  );

  const getPlanNames = () => {
    const names = new Set<string>();
    const subscription = analyticsData.subscription || {};
    Object.values(subscription).forEach((yearData) => {
      (yearData.plans || []).forEach((month: any) => {
        Object.keys(month).forEach((key) => {
          if (key !== "name") names.add(key);
        });
      });
    });
    return Array.from(names);
  };

  const getYearWiseData = (year: number) => {
    const plans = analyticsData.subscription?.[year]?.plans || [];
    const allPlanNames = getPlanNames();
    return monthOrder.map((monthName) => {
      const monthData =
        plans.find((month: any) => month.name === monthName) || {
          name: monthName,
        };
      const point: any = { name: monthName };
      allPlanNames.forEach((plan) => {
        point[plan] = monthData[plan] || 0;
      });
      return point;
    });
  };

  const getPrevious12MonthsData = () => {
    const subscription = analyticsData.subscription || {};
    let allData: any[] = [];
    Object.keys(subscription).forEach((year) => {
      const yearPlans = (subscription[year].plans || []).map((month: any) => ({
        name: `${month.name} ${year}`,
        ...month,
        year: parseInt(year, 10),
        monthIndex: monthOrder.indexOf(month.name),
      }));
      allData = allData.concat(yearPlans);
    });
    allData.sort(
      (a, b) =>
        new Date(a.year, a.monthIndex, 1).getTime() -
        new Date(b.year, b.monthIndex, 1).getTime()
    );

    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth() - 11, 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const filtered = allData.filter((d) => {
      const date = new Date(d.year, d.monthIndex, 1);
      return date >= startDate && date <= endDate;
    });

    const allPlanNames = getPlanNames();
    const result: any[] = [];
    const cursor = new Date(startDate);
    while (cursor <= endDate) {
      const year = cursor.getFullYear();
      const monthName = monthOrder[cursor.getMonth()];
      const label = `${monthName} ${year}`;
      const existing =
        filtered.find((d) => `${d.name}` === label || d.name === monthName) ||
        {};
      const point: any = { name: label };
      allPlanNames.forEach((plan) => {
        point[plan] = existing[plan] !== undefined ? existing[plan] : 0;
      });
      result.push(point);
      cursor.setMonth(cursor.getMonth() + 1);
    }
    return result;
  };

  const planData = useMemo(() => {
    if (!analyticsData.subscription || !Object.keys(analyticsData.subscription).length) {
      return [];
    }
    return filterType === "previous12"
      ? getPrevious12MonthsData()
      : selectedYear
      ? getYearWiseData(selectedYear)
      : [];
  }, [filterType, selectedYear, analyticsData.subscription]);

  const donutData = useMemo(
    () =>
      (analyticsData.users_per_service || []).map((service) => ({
        name: service.name,
        value: service.user_count > 0 ? service.user_count : 0.01,
      })),
    [analyticsData.users_per_service]
  );

  const allValuesZero = useMemo(
    () =>
      (analyticsData.users_per_service || []).every(
        (service) => service.user_count === 0
      ),
    [analyticsData.users_per_service]
  );

  const totalUsers = useMemo(
    () =>
      donutData.reduce(
        (sum, entry) => sum + (entry.value === 0.01 ? 0 : entry.value),
        0
      ),
    [donutData]
  );

  const platformCards = useMemo(() => {
    const p = analyticsData.platform_usage || {};
    return [
      { label: "Android only", value: p.android_only || 0 },
      { label: "Web only", value: p.web_only || 0 },
      { label: "Both", value: p.both || 0 },
      { label: "Unknown", value: p.unknown || 0 },
    ];
  }, [analyticsData.platform_usage]);

  const acquisition = analyticsData.acquisition || {};
  const bySource = acquisition.totals_by_source || {};
  const acquisitionMonthly = acquisition.monthly || [];

  return (
    <Box
      sx={{
        p: isMobile ? 2 : 3,
        background: "linear-gradient(135deg, #E8F5E9 0%, #FFFFFF 100%)",
        minHeight: "100vh",
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto", width: "100%" }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            color: "#1B5E20",
            mb: 2,
            fontFamily: "Urbanist, Arial, sans-serif",
          }}
        >
          Analytics Dashboard
        </Typography>

        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="Product" />
          <Tab label="Acquisition" />
        </Tabs>

        {tab === 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Select
                value={filterType}
                onChange={(e: SelectChangeEvent) => {
                  const next = e.target.value;
                  setFilterType(next);
                  if (next === "previous12") setSelectedYear(null);
                  else if (availableYears.length)
                    setSelectedYear(availableYears[availableYears.length - 1]);
                }}
                disabled={loading}
                sx={{ minWidth: 160, background: "#fff" }}
              >
                <MenuItem value="previous12">Previous 12 Months</MenuItem>
                <MenuItem value="year">Year</MenuItem>
              </Select>
              {filterType === "year" && (
                <Select
                  value={selectedYear || ""}
                  onChange={(e: SelectChangeEvent<number>) =>
                    setSelectedYear(Number(e.target.value))
                  }
                  disabled={!availableYears.length || loading}
                  sx={{ minWidth: 100, background: "#fff" }}
                >
                  {availableYears.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </Box>

            <Grid container spacing={2}>
              {platformCards.map((card) => (
                <Grid item xs={6} sm={3} key={card.label}>
                  <Paper sx={{ p: 2, textAlign: "center", borderRadius: 2 }}>
                    <Typography sx={{ fontWeight: 700, color: "#1B5E20" }}>
                      {card.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {card.label}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
              <Typography sx={{ fontWeight: 600, color: "#1B5E20", mb: 2 }}>
                Users by Plan{" "}
                {filterType === "year" && selectedYear
                  ? `(${selectedYear})`
                  : "(Previous 12 Months)"}
              </Typography>
              <Box sx={{ height: isMobile ? 250 : 300 }}>
                {loading ? (
                  <Typography align="center" sx={{ mt: 4 }}>
                    Loading...
                  </Typography>
                ) : planData.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={planData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} domain={[0, "auto"]} />
                      <Tooltip />
                      <Legend />
                      {getPlanNames().map((plan, index) => (
                        <Line
                          key={plan}
                          type="monotone"
                          dataKey={plan}
                          stroke={getPlanColor(plan, index)}
                          strokeWidth={2}
                          dot={{ r: 3 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <Typography align="center" sx={{ mt: 4 }} color="text.secondary">
                    No plan data available.
                  </Typography>
                )}
              </Box>
            </Paper>

            <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
              <Typography sx={{ fontWeight: 600, color: "#1B5E20", mb: 2 }}>
                Service Usage
              </Typography>
              <Box
                sx={{
                  minHeight: isMobile ? 400 : 320,
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  gap: 2,
                }}
              >
                {loading ? (
                  <Typography>Loading...</Typography>
                ) : !donutData.length || allValuesZero ? (
                  <Typography color="text.secondary">
                    No service usage data available.
                  </Typography>
                ) : (
                  <>
                    <Box sx={{ flex: 1, height: isMobile ? 220 : 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={donutData}
                            dataKey="value"
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                          >
                            {donutData.map((_, index) => (
                              <Cell
                                key={index}
                                fill={DONUT_COLORS[index % DONUT_COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value: number) =>
                              value === 0.01 ? 0 : value
                            }
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontWeight: 700, mb: 1, color: "#1B5E20" }}>
                        Total usage: {Math.round(totalUsers)}
                      </Typography>
                      <Grid container spacing={1}>
                        {donutData.map((entry) => (
                          <Grid item xs={6} key={entry.name}>
                            <Box
                              sx={{
                                p: 1,
                                borderRadius: 1,
                                bgcolor: "rgba(233,245,233,0.5)",
                              }}
                            >
                              <Typography variant="caption" noWrap>
                                {entry.name}
                              </Typography>
                              <Typography sx={{ fontWeight: 700 }}>
                                {entry.value === 0.01 ? 0 : entry.value}
                              </Typography>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  </>
                )}
              </Box>
            </Paper>
          </Box>
        )}

        {tab === 1 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Top KPI Cards */}
            <Grid container spacing={2}>
              <Grid item xs={6} sm={4} md={2}>
                <Paper sx={{ p: 2, textAlign: "center", borderRadius: 2 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: "1.3rem", color: "#1B5E20" }}>
                    {acquisition.total_installs || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Total Installs</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Paper sx={{ p: 2, textAlign: "center", borderRadius: 2 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: "1.3rem", color: "#1B5E20" }}>
                    {acquisition.total_signups || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Total Signups</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Paper sx={{ p: 2, textAlign: "center", borderRadius: 2 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: "1.3rem", color: "#2E7D32" }}>
                    {acquisition.overall_conversion_rate || 0}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Overall Conversion</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Paper sx={{ p: 2, textAlign: "center", borderRadius: 2 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: "1.3rem", color: SOURCE_COLORS.facebook }}>
                    {bySource.facebook?.installs || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">FB Installs</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Paper sx={{ p: 2, textAlign: "center", borderRadius: 2 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: "1.3rem", color: SOURCE_COLORS.facebook }}>
                    {bySource.facebook?.signups || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">FB Signups</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Paper sx={{ p: 2, textAlign: "center", borderRadius: 2 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: "1.3rem", color: SOURCE_COLORS.facebook }}>
                    {acquisition.facebook_conversion_rate || 0}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">FB Conversion</Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Source and Platform Breakdown Cards */}
            <Grid container spacing={2}>
              {(["facebook", "instagram", "organic", "unknown"] as const).map((source) => {
                const sData = bySource[source];
                const inst = sData?.installs || 0;
                const sgn = sData?.signups || 0;
                const cr = sData?.conversion_rate !== undefined
                  ? sData.conversion_rate
                  : (inst > 0 ? Math.round((sgn / inst) * 1000) / 10 : 0);
                return (
                  <Grid item xs={6} sm={3} key={source}>
                    <Paper sx={{ p: 2, borderRadius: 2, borderTop: `4px solid ${SOURCE_COLORS[source] || "#90A4AE"}` }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            textTransform: "capitalize",
                            color: SOURCE_COLORS[source] || "#333",
                          }}
                        >
                          {source}
                        </Typography>
                        <Chip
                          label={`${cr}% conv`}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            bgcolor: "rgba(0,0,0,0.05)",
                          }}
                        />
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">Installs:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{inst}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" color="text.secondary">Signups:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{sgn}</Typography>
                      </Box>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>

            {/* Platform & Campaign Breakdown */}
            <Grid container spacing={2}>
              {/* Platform breakdown */}
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, borderRadius: 2, height: "100%" }}>
                  <Typography sx={{ fontWeight: 700, color: "#1B5E20", mb: 1.5 }}>
                    Platform Distribution
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    <Box sx={{ p: 1.5, bgcolor: "rgba(233,245,233,0.5)", borderRadius: 1.5 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>🤖 Android</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {acquisition.platform_breakdown?.android_installs || 0} installs
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        Signups: {acquisition.platform_breakdown?.android_signups || 0}
                      </Typography>
                    </Box>

                    <Box sx={{ p: 1.5, bgcolor: "rgba(233,245,233,0.5)", borderRadius: 1.5 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>🍎 iOS</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {acquisition.platform_breakdown?.ios_installs || 0} installs
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        Signups: {acquisition.platform_breakdown?.ios_signups || 0}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              {/* Campaign breakdown */}
              <Grid item xs={12} md={8}>
                <Paper sx={{ p: 2, borderRadius: 2, height: "100%" }}>
                  <Typography sx={{ fontWeight: 700, color: "#1B5E20", mb: 1.5 }}>
                    Campaign Performance
                  </Typography>
                  {(acquisition.campaigns || []).length > 0 ? (
                    <TableContainer sx={{ maxHeight: 180 }}>
                      <Table size="small" stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Campaign</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Source</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700 }}>Installs</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700 }}>Signups</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700 }}>Conversion</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {acquisition.campaigns?.map((c) => (
                            <TableRow key={c.campaign}>
                              <TableCell sx={{ fontWeight: 600 }}>{c.campaign}</TableCell>
                              <TableCell>
                                <Chip
                                  label={c.source}
                                  size="small"
                                  sx={{
                                    textTransform: "capitalize",
                                    bgcolor: c.source === "facebook" ? "#E3F2FD" : "#E8F5E9",
                                    color: c.source === "facebook" ? "#1877F2" : "#2E7D32",
                                    fontWeight: 600,
                                  }}
                                />
                              </TableCell>
                              <TableCell align="right">{c.installs}</TableCell>
                              <TableCell align="right">{c.signups}</TableCell>
                              <TableCell align="right" sx={{ fontWeight: 700, color: "#1B5E20" }}>
                                {c.conversion_rate}%
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Box sx={{ p: 3, textAlign: "center", bgcolor: "#FAFAFA", borderRadius: 1.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        No campaign tags captured yet. Add <code>?utm_campaign=your_campaign_name</code> to Facebook ad URLs to track specific ads.
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>
            </Grid>

            {/* Monthly Trend Chart */}
            <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 1 }}>
                <Typography sx={{ fontWeight: 600, color: "#1B5E20" }}>
                  Monthly Acquisition Trend ({acquisitionMetric === "installs" ? "Installs" : "Signups"})
                </Typography>
                <ToggleButtonGroup
                  size="small"
                  value={acquisitionMetric}
                  exclusive
                  onChange={(_, val) => val && setAcquisitionMetric(val)}
                  sx={{ bgcolor: "#fff" }}
                >
                  <ToggleButton value="installs" sx={{ px: 2, textTransform: "none", fontWeight: 600 }}>
                    Installs
                  </ToggleButton>
                  <ToggleButton value="signups" sx={{ px: 2, textTransform: "none", fontWeight: 600 }}>
                    Signups
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              <Box sx={{ height: isMobile ? 260 : 320 }}>
                {loading ? (
                  <Typography align="center" sx={{ mt: 4 }}>
                    Loading...
                  </Typography>
                ) : acquisitionMonthly.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={acquisitionMonthly}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} domain={[0, "auto"]} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey={acquisitionMetric === "installs" ? "facebook_installs" : "facebook_signups"}
                        name="Facebook"
                        stroke={SOURCE_COLORS.facebook}
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey={acquisitionMetric === "installs" ? "organic_installs" : "organic_signups"}
                        name="Organic"
                        stroke={SOURCE_COLORS.organic}
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey={acquisitionMetric === "installs" ? "unknown_installs" : "unknown_signups"}
                        name="Unknown"
                        stroke={SOURCE_COLORS.unknown}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <Typography align="center" sx={{ mt: 4 }} color="text.secondary">
                    No install data yet. Data appears after the mobile app reports first opens.
                  </Typography>
                )}
              </Box>
            </Paper>

            {/* Real-time Recent Installs Table */}
            <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
              <Typography sx={{ fontWeight: 600, color: "#1B5E20", mb: 2 }}>
                Recent Installs Activity Log
              </Typography>
              {(acquisition.recent_installs || []).length > 0 ? (
                <>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: "#F1F8E9" }}>
                          <TableCell sx={{ fontWeight: 700 }}>Installed At</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Source</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Platform</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Campaign</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>User Status</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Install ID</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(acquisition.recent_installs || [])
                          .slice(
                            recentPage * recentRowsPerPage,
                            recentPage * recentRowsPerPage + recentRowsPerPage
                          )
                          .map((row) => (
                            <TableRow key={row.id} hover>
                              <TableCell sx={{ whiteSpace: "nowrap" }}>
                                {formatIstDateTime(row.created_at)}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={row.source}
                                  size="small"
                                  sx={{
                                    textTransform: "capitalize",
                                    fontWeight: 700,
                                    bgcolor:
                                      row.source === "facebook"
                                        ? "#E3F2FD"
                                        : row.source === "instagram"
                                        ? "#FCE4EC"
                                        : row.source === "organic"
                                        ? "#E8F5E9"
                                        : "#ECEFF1",
                                    color:
                                      row.source === "facebook"
                                        ? "#1877F2"
                                        : row.source === "instagram"
                                        ? "#E1306C"
                                        : row.source === "organic"
                                        ? "#2E7D32"
                                        : "#546E7A",
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={row.platform === "ios" ? "🍎 iOS" : "🤖 Android"}
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontWeight: 600 }}
                                />
                              </TableCell>
                              <TableCell>
                                {row.campaign ? (
                                  <Chip
                                    label={row.campaign}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    sx={{ fontWeight: 600 }}
                                  />
                                ) : (
                                  <Typography variant="caption" color="text.secondary">
                                    -
                                  </Typography>
                                )}
                              </TableCell>
                              <TableCell>
                                {row.user_id ? (
                                  <MuiTooltip
                                    title={`User ID: ${row.user_id}${
                                      row.user_phone ? ` | Phone: ${row.user_phone}` : ""
                                    }`}
                                  >
                                    <Chip
                                      label={
                                        row.user_name
                                          ? `✓ ${row.user_name}`
                                          : `✓ User #${row.user_id}`
                                      }
                                      size="small"
                                      sx={{
                                        bgcolor: "#E8F5E9",
                                        color: "#2E7D32",
                                        fontWeight: 700,
                                      }}
                                    />
                                  </MuiTooltip>
                                ) : (
                                  <Chip
                                    label="Guest (Not signed up)"
                                    size="small"
                                    sx={{ bgcolor: "#FAFAFA", color: "#9E9E9E", fontSize: "0.75rem" }}
                                  />
                                )}
                              </TableCell>
                              <TableCell sx={{ fontFamily: "monospace", fontSize: "0.75rem", color: "text.secondary" }}>
                                <MuiTooltip title={row.install_id}>
                                  <span>{row.install_id.substring(0, 13)}...</span>
                                </MuiTooltip>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={(acquisition.recent_installs || []).length}
                    rowsPerPage={recentRowsPerPage}
                    page={recentPage}
                    onPageChange={(_, newPage) => setRecentPage(newPage)}
                    onRowsPerPageChange={(e) => {
                      setRecentRowsPerPage(parseInt(e.target.value, 10));
                      setRecentPage(0);
                    }}
                  />
                </>
              ) : (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                  No recent install records found.
                </Typography>
              )}
            </Paper>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Analytics;
