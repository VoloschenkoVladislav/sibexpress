import React, { FC } from 'react';
import { useLazyLogoutQuery } from '../../services/AuthService';
import { styled } from '@mui/material/styles';
import { AppBar, Box, Toolbar, IconButton } from '@mui/material';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { drawerWidth } from './DashboardDrawer';


const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
})); 

export const navbarHeight = 64;

export const DashboardNavbar: FC = () => {
  const [ logoutFetch ] = useLazyLogoutQuery();

  return (
    <DashboardNavbarRoot
      sx={{
        left: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          minHeight: navbarHeight,
          left: 0,
          px: 2,
        }}
      >
        <Box sx={{ flexGrow: 1 }} />
        <IconButton onClick={e => logoutFetch()} size='large'>
          <LogoutOutlinedIcon fontSize='inherit'/>
        </IconButton>
      </Toolbar>
    </DashboardNavbarRoot>
  );
};
