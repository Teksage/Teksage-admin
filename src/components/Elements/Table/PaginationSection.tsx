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
//         zIndex: 2,
//         "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
//           // fontFamily: "Roboto, sans-serif",
//           fontSize: "1rem",
//           fontFamily: 'Urbanist', fontWeight: 800
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

import React from "react";
import { TablePagination, Box, IconButton, useTheme, alpha } from "@mui/material";
import { FirstPage as FirstPageIcon, LastPage as LastPageIcon } from "@mui/icons-material";

interface PaginationSectionProps {
  totalCount: number;
  page: number;
  rowsPerPage: number;
  onPageChange?: (newPage: number) => void;
  onRowsPerPageChange?: (newRowsPerPage: number) => void;
}

const PaginationSection: React.FC<PaginationSectionProps> = ({
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const theme = useTheme();

  const handleChangePage = (event: any, newPage: number) => {
    onPageChange?.(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    onRowsPerPageChange?.(newRowsPerPage);
    onPageChange?.(0);
  };

  return (
    <TablePagination
      component="div"
      count={totalCount}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      rowsPerPageOptions={[5, 10, 25, 50]}
      sx={{
        borderTop: `1px solid ${alpha("#ddd", 0.2)}`,
        background: alpha("#f9f9f9", 0.95),
        position: "sticky",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 2,
        "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
          fontFamily: 'Urbanist',
          fontWeight: 800,
          fontSize: "1rem",
        },
      }}
      ActionsComponent={(props) => {
        const { count, page, rowsPerPage, onPageChange } = props;
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              onClick={() => onPageChange(null, 0)}
              disabled={page === 0}
              aria-label="first page"
            >
              <FirstPageIcon />
            </IconButton>
            <IconButton
              onClick={() => onPageChange(null, page - 1)}
              disabled={page === 0}
              aria-label="previous page"
            >
              {theme.direction === "rtl" ? ">" : "<"}
            </IconButton>
            <IconButton
              onClick={() => onPageChange(null, page + 1)}
              disabled={page >= Math.ceil(count / rowsPerPage) - 1}
              aria-label="next page"
            >
              {theme.direction === "rtl" ? "<" : ">"}
            </IconButton>
            <IconButton
              onClick={() => onPageChange(null, Math.max(0, Math.ceil(count / rowsPerPage) - 1))}
              disabled={page >= Math.ceil(count / rowsPerPage) - 1}
              aria-label="last page"
            >
              <LastPageIcon />
            </IconButton>
          </Box>
        );
      }}
    />
  );
};

export default PaginationSection;