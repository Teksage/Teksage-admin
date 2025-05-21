// import React from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Typography,
//   IconButton,
// } from "@mui/material";
// import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
// import { TableColumn } from "./types";

// interface MobileRowDetailDialogProps<T> {
//   mobileRowDetail: T | null;
//   setMobileRowDetail: React.Dispatch<React.SetStateAction<T | null>>;
//   columns: TableColumn<T>[];
//   onEdit?: (row: T) => void;
//   onDelete?: (row: T) => void;
// }

// const MobileRowDetailDialog = <T,>({
//   mobileRowDetail,
//   setMobileRowDetail,
//   columns,
//   onEdit,
//   onDelete,
// }: MobileRowDetailDialogProps<T>) => {
//   if (!mobileRowDetail) return null;

//   return (
//     <Dialog open={!!mobileRowDetail} onClose={() => setMobileRowDetail(null)}>
//       <DialogTitle>Row Details</DialogTitle>
//       <DialogContent>
//         {columns.map((column) => (
//           <Typography key={column.id as string} sx={{ mb: 1 }}>
//             <strong>{column.label}:</strong>{" "}
//             {/* Use the render function if provided, otherwise fallback to toString */}
//             {column.render
//               ? column.render(mobileRowDetail[column.id], mobileRowDetail)
//               : mobileRowDetail[column.id]?.toString() || "N/A"}
//           </Typography>
//         ))}
//       </DialogContent>
//       <DialogActions>
//         {onEdit && (
//           <IconButton onClick={() => onEdit(mobileRowDetail)}>
//             <EditIcon />
//           </IconButton>
//         )}
//         {onDelete && (
//           <IconButton onClick={() => onDelete(mobileRowDetail)}>
//             <DeleteIcon />
//           </IconButton>
//         )}
//         <Button onClick={() => setMobileRowDetail(null)}>Close</Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default MobileRowDetailDialog;

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  useTheme,
  alpha
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { TableColumn } from "./types";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: "12px",
    background: theme.palette.background.paper,
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
    maxWidth: "400px",
    width: "90%",
    margin: theme.spacing(2),
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  background: alpha(theme.palette.primary.light, 0.05),
}));

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
  const theme = useTheme();

  const handleClose = () => {
    setMobileRowDetail(null);
  };

  if (!mobileRowDetail) {
    return null;
  }

  const dataColumns = columns.filter((col) => !col.filterOnly) as Array<
    TableColumn<T> & { id: keyof T }
  >;

  return (
    <StyledDialog open={!!mobileRowDetail} onClose={handleClose}>
      <StyledDialogTitle>
        <Typography
          variant="h6"
          sx={{ fontFamily: "Urbanist", fontWeight: 600 }}
        >
          Row Details
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: theme.palette.text.primary }}>
          <CloseIcon />
        </IconButton>
      </StyledDialogTitle>
      <DialogContent
        sx={{
          padding: theme.spacing(2),
          display: "flex",
          flexDirection: "column",
          gap: theme.spacing(2),
        }}
      >
        {dataColumns.map((column) => {
          const value = mobileRowDetail[column.id];
          const displayValue = column.render
            ? column.render(value, mobileRowDetail)
            : value != null
            ? String(value)
            : "N/A";

          return (
            <Box
              key={column.id as string}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: theme.spacing(0.5),
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontFamily: "Urbanist",
                  fontWeight: 600,
                  color: theme.palette.text.secondary,
                }}
              >
                {column.label}
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontFamily: "Urbanist", fontWeight: 500 }}
              >
                {displayValue}
              </Typography>
            </Box>
          );
        })}
      </DialogContent>
      <DialogActions
        sx={{
          padding: theme.spacing(2),
          borderTop: `1px solid ${theme.palette.divider}`,
          justifyContent: "space-between",
        }}
      >
        <Box>
          {onEdit && (
            <Button
              onClick={() => onEdit(mobileRowDetail)}
              variant="contained"
              color="primary"
              sx={{
                fontFamily: "Urbanist",
                fontWeight: 600,
                mr: 1,
                textTransform: "none",
              }}
            >
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              onClick={() => onDelete(mobileRowDetail)}
              variant="outlined"
              color="error"
              sx={{
                fontFamily: "Urbanist",
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              Delete
            </Button>
          )}
        </Box>
        <Button
          onClick={handleClose}
          variant="text"
          sx={{
            fontFamily: "Urbanist",
            fontWeight: 600,
            textTransform: "none",
          }}
        >
          Close
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default MobileRowDetailDialog;