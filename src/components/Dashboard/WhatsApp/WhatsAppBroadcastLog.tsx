import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { fetchWhatsAppBroadcastLogs } from "../../../api/whatsappAdmin";

export default function WhatsAppBroadcastLog() {
  const [rows, setRows] = useState<
    Array<{
      id: number;
      sender_email: string;
      recipient_mode: string;
      message_mode: string;
      template_name?: string | null;
      recipient_count: number;
      sent_count: number;
      failed_count: number;
      created_at?: string | null;
    }>
  >([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetchWhatsAppBroadcastLogs()
      .then((res) => setRows(res.data))
      .catch((e: Error) => setError(e.message));
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        WhatsApp broadcast log
      </Typography>
      {error ? <Alert severity="error">{error}</Alert> : null}
      <Paper>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>When</TableCell>
              <TableCell>Sender</TableCell>
              <TableCell>Mode</TableCell>
              <TableCell>Template</TableCell>
              <TableCell align="right">Recipients</TableCell>
              <TableCell align="right">Sent</TableCell>
              <TableCell align="right">Failed</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.id}</TableCell>
                <TableCell>{r.created_at || "—"}</TableCell>
                <TableCell>{r.sender_email}</TableCell>
                <TableCell>
                  {r.recipient_mode} / {r.message_mode}
                </TableCell>
                <TableCell>{r.template_name || "—"}</TableCell>
                <TableCell align="right">{r.recipient_count}</TableCell>
                <TableCell align="right">{r.sent_count}</TableCell>
                <TableCell align="right">{r.failed_count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
