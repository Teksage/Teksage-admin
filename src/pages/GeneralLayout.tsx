// layouts/GeneralLayout.tsx
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Page from '../components/common/Page';
import { LayoutProps } from '../types/common';

const GeneralLayout: React.FC<LayoutProps> = ({ title = '' }) => {
  return (
    <Page title={title}>
      <Box 
        sx={{ 
          backgroundColor: '#fff', 
          p: '0 !important', 
          borderRadius: '3px',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Outlet />
      </Box>
    </Page>
  );
};

export default GeneralLayout;