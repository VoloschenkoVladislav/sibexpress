import { FC } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DashboardNavbar, navbarHeight } from './DashboardNavbar';
import { DashboardDrawer, drawerWidth } from './DashboardDrawer';


interface Props {
  children: React.ReactNode,
}

const DashboardLayoutRoot = styled('div')(() => ({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  paddingTop: navbarHeight,
  paddingLeft: drawerWidth,
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
            position: 'absolute',
            right: 0,
            left: drawerWidth,
            bottom: 0,
            top: navbarHeight,
            p: 5,
          }}
        >
          {children}
        </Box>
      </DashboardLayoutRoot>
      <DashboardNavbar />
      <DashboardDrawer />
    </>
  );
};
