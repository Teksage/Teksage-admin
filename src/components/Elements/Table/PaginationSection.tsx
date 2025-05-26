// // import React from "react";
// // import { TablePagination, Box, IconButton, useTheme, alpha } from "@mui/material";
// // import { FirstPage as FirstPageIcon, LastPage as LastPageIcon } from "@mui/icons-material";

// // interface PaginationSectionProps {
// //   totalCount: number;
// //   page: number;
// //   rowsPerPage: number;
// //   onPageChange?: (newPage: number) => void;
// //   onRowsPerPageChange?: (newRowsPerPage: number) => void;
// // }

// // const PaginationSection: React.FC<PaginationSectionProps> = ({
// //   totalCount,
// //   page,
// //   rowsPerPage,
// //   onPageChange,
// //   onRowsPerPageChange,
// // }) => {
// //   const theme = useTheme();

// //   const handleChangePage = (event: any, newPage: number) => {
// //     console.log(event)
// //     onPageChange?.(newPage);
// //   };

// //   const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
// //     const newRowsPerPage = parseInt(event.target.value, 10);
// //     onRowsPerPageChange?.(newRowsPerPage);
// //     onPageChange?.(0);
// //   };

// //   return (
// //     <TablePagination
// //       component="div"
// //       count={totalCount}
// //       rowsPerPage={rowsPerPage}
// //       page={page}
// //       onPageChange={handleChangePage}
// //       onRowsPerPageChange={handleChangeRowsPerPage}
// //       rowsPerPageOptions={[5, 10, 25, 50]}
// //       sx={{
// //         borderTop: `1px solid ${alpha("#ddd", 0.2)}`,
// //         background: alpha("#f9f9f9", 0.95),
// //         position: "sticky",
// //         bottom: 0,
// //         zIndex: 2,
// //         "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
// //           // fontFamily: "Roboto, sans-serif",
// //           fontSize: "1rem",
// //           fontFamily: 'Urbanist', fontWeight: 800
// //         },
// //       }}
// //       ActionsComponent={(props) => {
// //         const { count, page, rowsPerPage, onPageChange } = props;
// //         return (
// //           <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
// //             <IconButton
// //               onClick={() => onPageChange(null, 0)}
// //               disabled={page === 0}
// //               aria-label="first page"
// //             >
// //               <FirstPageIcon />
// //             </IconButton>
// //             <IconButton
// //               onClick={() => onPageChange(null, page - 1)}
// //               disabled={page === 0}
// //               aria-label="previous page"
// //             >
// //               {theme.direction === "rtl" ? ">" : "<"}
// //             </IconButton>
// //             <IconButton
// //               onClick={() => onPageChange(null, page + 1)}
// //               disabled={page >= Math.ceil(count / rowsPerPage) - 1}
// //               aria-label="next page"
// //             >
// //               {theme.direction === "rtl" ? "<" : ">"}
// //             </IconButton>
// //             <IconButton
// //               onClick={() => onPageChange(null, Math.max(0, Math.ceil(count / rowsPerPage) - 1))}
// //               disabled={page >= Math.ceil(count / rowsPerPage) - 1}
// //               aria-label="last page"
// //             >
// //               <LastPageIcon />
// //             </IconButton>
// //           </Box>
// //         );
// //       }}
// //     />
// //   );
// // };

// // export default PaginationSection;

// import React from "react";
// import { TablePagination, Box, IconButton, useTheme, alpha } from "@mui/material";
// import { FirstPage as FirstPageIcon, LastPage as LastPageIcon } from "@mui/icons-material";

// interface PaginationSectionProps {
//   totalCount: number;
//   page: number;
//   rowsPerPage: number;
//   onPageChange?: (newPage: number) => void;
//   onRowsPerPageChange?: (newRowsPerPage: number) => void;
// }

// const PaginationSection: React.FC<PaginationSectionProps> = ({
//   totalCount,
//   page,
//   rowsPerPage,
//   onPageChange,
//   onRowsPerPageChange,
// }) => {
//   const theme = useTheme();

//   const handleChangePage = (event: any, newPage: number) => {
//     console.log(event)
//     onPageChange?.(newPage);
//   };

//   const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const newRowsPerPage = parseInt(event.target.value, 10);
//     onRowsPerPageChange?.(newRowsPerPage);
//     onPageChange?.(0);
//   };

//   return (
//     <TablePagination
//       component="div"
//       count={totalCount}
//       rowsPerPage={rowsPerPage}
//       page={page}
//       onPageChange={handleChangePage}
//       onRowsPerPageChange={handleChangeRowsPerPage}
//       rowsPerPageOptions={[5, 10, 25, 50]}
//       sx={{
//         borderTop: `1px solid ${alpha("#ddd", 0.2)}`,
//         background: alpha("#f9f9f9", 0.95),
//         position: "sticky",
//         bottom: 0,
//         left: 0,
//         right: 0,
//         zIndex: 2,
//         "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
//           fontFamily: 'Urbanist',
//           fontWeight: 800,
//           fontSize: "1rem",
//         },
//       }}
//       ActionsComponent={(props) => {
//         const { count, page, rowsPerPage, onPageChange } = props;
//         return (
//           <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//             <IconButton
//               onClick={() => onPageChange(null, 0)}
//               disabled={page === 0}
//               aria-label="first page"
//             >
//               <FirstPageIcon />
//             </IconButton>
//             <IconButton
//               onClick={() => onPageChange(null, page - 1)}
//               disabled={page === 0}
//               aria-label="previous page"
//             >
//               {theme.direction === "rtl" ? ">" : "<"}
//             </IconButton>
//             <IconButton
//               onClick={() => onPageChange(null, page + 1)}
//               disabled={page >= Math.ceil(count / rowsPerPage) - 1}
//               aria-label="next page"
//             >
//               {theme.direction === "rtl" ? "<" : ">"}
//             </IconButton>
//             <IconButton
//               onClick={() => onPageChange(null, Math.max(0, Math.ceil(count / rowsPerPage) - 1))}
//               disabled={page >= Math.ceil(count / rowsPerPage) - 1}
//               aria-label="last page"
//             >
//               <LastPageIcon />
//             </IconButton>
//           </Box>
//         );
//       }}
//     />
//   );
// };

// export default PaginationSection;

import React, { useMemo } from "react";
import {
  Box,
  TablePagination,
  useTheme,
  useMediaQuery,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useLocation } from 'react-router-dom';

const StyledPaginationContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  padding: theme.spacing(1, 2),
  background: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.divider}`,
  position: "sticky",
  bottom: 0,
  zIndex: 1,
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "flex-end",
    gap: theme.spacing(1),
  },
}));

interface PaginationSectionProps {
  totalCount: number;
  page: number;
  rowsPerPage: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
}

const PaginationSection = ({
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: PaginationSectionProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  const pathSegments = location.pathname.split('/');
  const lastSegment = pathSegments[pathSegments.length - 1];
  const showLabel = ['subscription', 'coupons', 'services'].includes(lastSegment);
  console.log(lastSegment, "lastSegment", showLabel, "showLabel");

  // Ensure totalCount is non-negative to prevent pagination issues
  const safeTotalCount = Math.max(0, totalCount);
  // Ensure page is within valid bounds
  const maxPage = Math.max(0, Math.ceil(safeTotalCount / rowsPerPage) - 1);
  const safePage = Math.min(Math.max(0, page), maxPage);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    console.log(event)
    if (onPageChange && newPage >= 0 && newPage <= maxPage) {
      onPageChange(newPage);
    } else {
      console.warn(`Invalid page change attempt: newPage=${newPage}, maxPage=${maxPage}`);
    }
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | SelectChangeEvent<number>
  ) => {
    const value:any = "value" in event ? String(event.value) : event.target.value;
    const newRowsPerPage = parseInt(value, 10);
    if (onRowsPerPageChange && !isNaN(newRowsPerPage)) {
      onRowsPerPageChange(newRowsPerPage);
      // Reset to page 0 when rows per page changes to avoid invalid page
      if (onPageChange) {
        console.log(newRowsPerPage, "newRowsPerPage");
        onPageChange(0);
      }
    }
  };

  const rowsPerPageOptions = useMemo(() => [10, 25, 50, 100], []);

  return (
    <StyledPaginationContainer>
      {isMobile ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Select
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage as (event: SelectChangeEvent<number>) => void}
            size="small"
            sx={{
              fontFamily: "Urbanist",
              fontWeight: 500,
              "& .MuiSelect-select": {
                padding: "6px 24px 6px 12px",
              },
            }}
          >
            {rowsPerPageOptions.map((option) => (
              <MenuItem
                key={option}
                value={option}
                sx={{ fontFamily: "Urbanist", fontWeight: 500 }}
              >
                {option}
              </MenuItem>
            ))}
          </Select>
          <TablePagination
            component="div"
            count={safeTotalCount}
            page={safePage}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[]} // Hide rows per page in mobile view since handled by Select
            showFirstButton
            showLastButton
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
            }
            sx={{
              "& .MuiTablePagination-toolbar": {
                minHeight: "40px",
                padding: 0,
              },
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                fontFamily: "Urbanist",
                fontWeight: 500,
                fontSize: "0.85rem",
              },
            }}
          />
        </Box>
      ) : (
        <TablePagination
          component="div"
          count={safeTotalCount}
          page={safePage}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          // onRowsPerPageChange={handleChangeRowsPerPage}
          // rowsPerPageOptions={rowsPerPageOptions}
          onRowsPerPageChange={
            showLabel ? undefined : handleChangeRowsPerPage
          }
          rowsPerPageOptions={
            showLabel ? [rowsPerPage] : rowsPerPageOptions
          }
          showFirstButton
          showLastButton
          labelRowsPerPage="Rows per page:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
          }
          sx={{
            "& .MuiTablePagination-toolbar": {
              minHeight: "48px",
            },
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows, & .MuiTablePagination-select": {
              fontFamily: "Urbanist",
              fontWeight: 500,
              fontSize: "0.9rem",
            },
            "& .MuiTablePagination-actions": {
              marginLeft: theme.spacing(1),
            },
          }}
        />
      )}
    </StyledPaginationContainer>
  );
};

export default PaginationSection;