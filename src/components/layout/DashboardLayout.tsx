import { FC } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DashboardNavbar } from './DashboardNavbar';

interface Props {
  children: React.ReactNode,
}

const DashboardLayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  paddingTop: 64,
}));

export const DashboardLayout: FC<Props> = props => {
  const { children } = props;

  return (
    <>
      <DashboardLayoutRoot>
        <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            width: '100%',
            pb: 10,
          }}
        >
          {children}
        </Box>
      </DashboardLayoutRoot>
      <DashboardNavbar />
    </>
  );
};
