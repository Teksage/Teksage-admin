import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { TableColumn } from "./types";

interface MobileRowDetailDialogProps<T> {
  mobileRowDetail: T | null;
  setMobileRowDetail: React.Dispatch<React.SetStateAction<T | null>>;
  columns: TableColumn<T>[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
}

const MobileRowDetailDialog = <T,>({
  mobileRowDetail,
  setMobileRowDetail,
  columns,
  onEdit,
  onDelete,
}: MobileRowDetailDialogProps<T>) => {
  if (!mobileRowDetail) return null;

  return (
    <Dialog open={!!mobileRowDetail} onClose={() => setMobileRowDetail(null)}>
      <DialogTitle>Row Details</DialogTitle>
      <DialogContent>
        {columns.map((column) => (
          <Typography key={column.id as string} sx={{ mb: 1 }}>
            <strong>{column.label}:</strong>{" "}
            {/* Use the render function if provided, otherwise fallback to toString */}
            {column.render
              ? column.render(mobileRowDetail[column.id], mobileRowDetail)
              : mobileRowDetail[column.id]?.toString() || "N/A"}
          </Typography>
        ))}
      </DialogContent>
      <DialogActions>
        {onEdit && (
          <IconButton onClick={() => onEdit(mobileRowDetail)}>
            <EditIcon />
          </IconButton>
        )}
        {onDelete && (
          <IconButton onClick={() => onDelete(mobileRowDetail)}>
            <DeleteIcon />
          </IconButton>
        )}
        <Button onClick={() => setMobileRowDetail(null)}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MobileRowDetailDialog;