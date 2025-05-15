// components/Modals/ConfirmModal.tsx

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title = "Are you sure?",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onClose,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 2,
          maxWidth: 400,
          textAlign: "center",
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold" style={{fontFamily: "Urbanist", fontWeight: 800, color: "#2e7d32"}}>
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" color="text.secondary" mb={2} style={{fontFamily: "Urbanist", fontWeight: 500}}>
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
        <Button variant="outlined" onClick={onClose} style={{fontFamily: "Urbanist", fontWeight: 800}}>
          {cancelText}
        </Button>
        <Button variant="contained" color="error" onClick={onConfirm} style={{fontFamily: "Urbanist", fontWeight: 800}}>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmModal;
