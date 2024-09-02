import React, { FC, useState } from 'react';
import { useLazyLogoutQuery } from '../../services/AuthService';
import { styled } from '@mui/material/styles';
import { AppBar, Box, Toolbar, IconButton, Tooltip } from '@mui/material';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { drawerWidth } from './DashboardDrawer';
import { ConfirmationWindow } from '../features/ConfirmationWindow';
import { PopupWindow } from '../features/PopupWindow';


const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
})); 

export const navbarHeight = 64;

export const DashboardNavbar: FC = () => {
  const [ logoutConfirmationUp, setLogoutConfirmationUp ] = useState(false);
  const [ logout ] = useLazyLogoutQuery();

  return (
    <>
      <PopupWindow visible={logoutConfirmationUp}>
        <ConfirmationWindow
          message='Вы точно хотите выйти?'
          onSubmit={() => logout()}
          onReject={() => setLogoutConfirmationUp(false)}
          submitTitle='Выйти'
          rejectTitle='Отмена'
        />
      </PopupWindow>
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
          
          <Tooltip title='Выйти'>
            <span>
              <IconButton onClick={e => setLogoutConfirmationUp(true)} size='large'>
                <LogoutOutlinedIcon fontSize='inherit'/>
              </IconButton>
            </span>
          </Tooltip>
        </Toolbar>
      </DashboardNavbarRoot>
    </>
  );
};
