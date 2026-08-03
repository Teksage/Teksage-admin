import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Alert,
  Tab,
  Tabs,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { callAPI } from "../../../api/crudFactory";
import GenericTable from "../../Elements/Table/Table";
import { TableColumn } from "../../Elements/Table/types";

type SmsFraudSummary = {
  last_24h_sent: number;
  last_24h_rate_limited: number;
  last_24h_verified: number;
  last_24h_provider_failed: number;
  last_24h_requested: number;
  verification_rate: number;
  circuit_breaker_active: boolean;
  circuit_state: string;
  hourly_sent: number;
  hourly_limit: number;
  daily_sent: number;
  daily_limit: number;
  warning_limit: number;
  redis_ok: boolean;
  hours: number;
};

type RecentEvent = {
  id: number;
  user_id: number | null;
  created_at: string | null;
  phone_masked: string | null;
  country_code: string | null;
  ip_address: string | null;
  status: string;
  endpoint: string | null;
  verified: boolean;
};

type RequestRow = RecentEvent & {
  outcome_label: string;
};

type SmsFraudData = {
  requests_per_hour: Array<Record<string, number | string>>;
  top_countries: Array<{
    country_code: string;
    requested: number;
    sent: number;
    verified: number;
  }>;
  top_ips: Array<{ ip: string; count: number; rate_limited: number }>;
  recent_events: RecentEvent[];
  filtered_event_count: number;
  alerts: Array<{
    id: number;
    alert_type: string;
    severity: string;
    message: string;
    status: string;
    created_at: string | null;
  }>;
  summary: SmsFraudSummary;
};

const STATE_LABEL: Record<string, string> = {
  normal: "Sending normally",
  warning: "Warning",
  auto_paused: "Automatically paused",
  manual_paused: "Manually paused",
};

const STATE_COLOR: Record<string, "success" | "warning" | "error" | "default"> = {
  normal: "success",
  warning: "warning",
  auto_paused: "error",
  manual_paused: "error",
};

const EVENT_LABEL: Record<string, string> = {
  sent: "SMS sent",
  rate_limited: "Blocked: too many requests",
  circuit_open: "Blocked: safety limit reached",
  manual_paused: "Blocked: paused by admin",
  cooldown: "Blocked: resend wait active",
  locked: "Blocked: verification locked",
  provider_failed: "SMS provider error",
};

const EVENT_FILTER_OPTIONS = [
  ["", "All outcomes"],
  ["sent", EVENT_LABEL.sent],
  ["rate_limited", EVENT_LABEL.rate_limited],
  ["cooldown", EVENT_LABEL.cooldown],
  ["locked", EVENT_LABEL.locked],
  ["circuit_open", EVENT_LABEL.circuit_open],
  ["manual_paused", EVENT_LABEL.manual_paused],
  ["provider_failed", EVENT_LABEL.provider_failed],
] as const;

const EVENT_STATUS_BY_LABEL = Object.fromEntries(
  Object.entries(EVENT_LABEL).map(([status, label]) => [label, status])
);

const SmsFraudDashboard: React.FC = () => {
  const [data, setData] = useState<SmsFraudData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [busy, setBusy] = useState(false);
  const [detailTab, setDetailTab] = useState(0);
  const [requestFilters, setRequestFilters] = useState<
    Record<string, string>
  >({});
  const [requestPage, setRequestPage] = useState(0);
  const [requestRowsPerPage, setRequestRowsPerPage] = useState(10);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const response = await callAPI({
        endpoint: "/api/admin/sms-fraud",
        method: "get",
        params: {
          hours: 24,
          phone:
            requestFilters.phone_masked && requestFilters.country_code
              ? requestFilters.phone_masked
              : undefined,
          country_code: requestFilters.country_code || undefined,
          ip_address: requestFilters.ip_address || undefined,
          event_status:
            EVENT_STATUS_BY_LABEL[requestFilters.outcome_label] ||
            requestFilters.outcome_label ||
            undefined,
          user_id: requestFilters.user_id || undefined,
          start_datetime: requestFilters.start_datetime || undefined,
          end_datetime: requestFilters.end_datetime || undefined,
          page: requestPage + 1,
          page_size: requestRowsPerPage,
        },
      });
      setData(response.data);
      setLastRefresh(new Date());
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to load SMS fraud data");
    } finally {
      setLoading(false);
    }
  }, [requestFilters, requestPage, requestRowsPerPage]);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 60000);
    return () => clearInterval(id);
  }, [fetchData]);

  const requestRows = useMemo<RequestRow[]>(
    () =>
      (data?.recent_events || []).map((event) => ({
        ...event,
        outcome_label: EVENT_LABEL[event.status] || event.status,
      })),
    [data?.recent_events]
  );

  const requestColumns = useMemo<TableColumn<RequestRow>[]>(
    () => [
      {
        id: "created_at",
        label: "When",
        width: "190px",
        render: (value: string | null) =>
          value ? new Date(value).toLocaleString() : "—",
      },
      {
        id: "user_id",
        label: "User ID",
        filterable: true,
        render: (value: number | null) => value ?? "Guest / unknown",
      },
      {
        id: "phone_masked",
        label: "Mobile (choose country first)",
        filterable: true,
        width: "210px",
        render: (value: string | null) => value || "—",
      },
      {
        id: "country_code",
        label: "Country",
        filterable: true,
        filterOptions: (data?.top_countries || []).map(
          (country) => country.country_code
        ),
        render: (value: string | null) => (value ? `+${value}` : "—"),
      },
      {
        id: "ip_address",
        label: "IP address",
        filterable: true,
        filterOptions: (data?.top_ips || []).map((item) => item.ip),
        width: "180px",
        render: (value: string | null) => value || "—",
      },
      {
        id: "outcome_label",
        label: "Outcome",
        filterable: true,
        filterOptions: EVENT_FILTER_OPTIONS.slice(1).map(
          ([, label]) => label
        ),
        width: "260px",
        render: (value: string, row: RequestRow) => (
          <Chip
            size="small"
            label={value}
            color={
              row.status === "sent"
                ? "success"
                : row.status === "provider_failed"
                ? "warning"
                : "error"
            }
          />
        ),
      },
      {
        id: "endpoint",
        label: "Endpoint",
        render: (value: string | null) => value || "—",
      },
    ],
    [data?.top_countries, data?.top_ips]
  );

  const fetchRequestFilterOptions = useCallback(
    async (_field: keyof RequestRow, searchValue: string) =>
      searchValue.trim() ? [searchValue.trim()] : [],
    []
  );

  const togglePause = async () => {
    if (!data) return;
    const paused = data.summary.circuit_state !== "manual_paused";
    setBusy(true);
    try {
      await callAPI({
        endpoint: "/api/admin/sms-fraud/pause",
        method: "post",
        data: { paused },
      });
      await fetchData();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to update pause state");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  const summary = data?.summary;

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontFamily="Urbanist" fontWeight={800}>
          SMS Fraud Monitor
        </Typography>
        <Box display="flex" gap={1} alignItems="center">
          <Typography variant="caption" color="text.secondary">
            Last refresh: {lastRefresh ? lastRefresh.toLocaleTimeString() : "—"}
          </Typography>
          <Button variant="outlined" onClick={fetchData}>
            Refresh
          </Button>
          <Button
            variant="contained"
            color={summary?.circuit_state === "manual_paused" ? "success" : "error"}
            disabled={busy}
            onClick={togglePause}
          >
            {summary?.circuit_state === "manual_paused" ? "Resume SMS" : "Pause SMS"}
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {summary && (
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2">Circuit status</Typography>
              <Chip
                label={STATE_LABEL[summary.circuit_state] || summary.circuit_state}
                color={STATE_COLOR[summary.circuit_state] || "default"}
                sx={{ mt: 1 }}
              />
              <Typography variant="caption" display="block" mt={1}>
                Redis: {summary.redis_ok ? "OK" : "Fallback / offline"}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={2}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2">Requested</Typography>
              <Typography variant="h5">{summary.last_24h_requested}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={2}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2">Sent</Typography>
              <Typography variant="h5">{summary.last_24h_sent}</Typography>
              <Typography variant="caption">
                Hour {summary.hourly_sent}/{summary.hourly_limit} · Day{" "}
                {summary.daily_sent}/{summary.daily_limit}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={2}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2">Verified</Typography>
              <Typography variant="h5">{summary.last_24h_verified}</Typography>
              <Typography variant="caption">
                Rate {(summary.verification_rate * 100).toFixed(1)}%
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2">Blocked / failed</Typography>
              <Typography variant="body1">
                Blocked for too many requests: {summary.last_24h_rate_limited}
              </Typography>
              <Typography variant="body1">
                SMS provider errors: {summary.last_24h_provider_failed}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Provider errors mean MSG91 rejected the API call or could not be
                reached. They are not counted as sent SMS.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      <Paper sx={{ p: 2, mb: 3, height: 360 }}>
        <Typography variant="h6" mb={2}>
          Hourly activity (last 24h)
        </Typography>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={data?.requests_per_hour || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="hour"
              tickFormatter={(v) => String(v).slice(11, 16)}
            />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="sent" fill="#2E7D32" name="Sent" />
            <Bar dataKey="verified" fill="#66BB6A" name="Verified" />
            <Bar
              dataKey="rate_limited"
              fill="#E53935"
              name="Blocked: too many requests"
            />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" mb={1}>
              Top countries (monitor only)
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Country</TableCell>
                  <TableCell align="right">Requested</TableCell>
                  <TableCell align="right">Sent</TableCell>
                  <TableCell align="right">Verified</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(data?.top_countries || []).map((row) => (
                  <TableRow key={row.country_code}>
                    <TableCell>+{row.country_code}</TableCell>
                    <TableCell align="right">{row.requested}</TableCell>
                    <TableCell align="right">{row.sent}</TableCell>
                    <TableCell align="right">{row.verified}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" mb={1}>
              Top IPs
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>IP</TableCell>
                  <TableCell align="right">Requests</TableCell>
                  <TableCell align="right">Blocked requests</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(data?.top_ips || []).map((row) => (
                  <TableRow key={row.ip}>
                    <TableCell>{row.ip}</TableCell>
                    <TableCell align="right">{row.count}</TableCell>
                    <TableCell align="right">{row.rate_limited}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Tabs
              value={detailTab}
              onChange={(_, value) => setDetailTab(value)}
              sx={{ mb: 2 }}
            >
              <Tab
                label={`Requests (${data?.filtered_event_count || 0})`}
              />
              <Tab label={`Alerts (${data?.alerts?.length || 0})`} />
            </Tabs>

            {detailTab === 0 && (
              <GenericTable<RequestRow>
                title="SMS OTP Requests"
                data={requestRows}
                columns={requestColumns}
                totalCount={data?.filtered_event_count || 0}
                getRowId={(row) => row.id}
                showActions={false}
                tableHeight="520px"
                page={requestPage}
                rowsPerPage={requestRowsPerPage}
                initialRowsPerPage={requestRowsPerPage}
                onPageChange={setRequestPage}
                onRowsPerPageChange={(rowsPerPage) => {
                  setRequestRowsPerPage(rowsPerPage);
                  setRequestPage(0);
                }}
                onFilterChange={(nextFilters) => {
                  setRequestFilters(nextFilters);
                  setRequestPage(0);
                }}
                onFetchFilterOptions={fetchRequestFilterOptions}
              />
            )}

            {detailTab === 1 && (
              <>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Manual pause/resume actions are recorded here for audit, but
                  they do not send email. Email is reserved for automatic
                  safety-limit and provider warnings.
                </Alert>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>When</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Severity</TableCell>
                      <TableCell>Message</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(data?.alerts || []).map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>
                          {row.created_at
                            ? new Date(row.created_at).toLocaleString()
                            : "—"}
                        </TableCell>
                        <TableCell>
                          {EVENT_LABEL[row.alert_type] ||
                            STATE_LABEL[row.alert_type] ||
                            row.alert_type.split("_").join(" ")}
                        </TableCell>
                        <TableCell>{row.severity}</TableCell>
                        <TableCell>{row.message}</TableCell>
                        <TableCell>{row.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SmsFraudDashboard;
