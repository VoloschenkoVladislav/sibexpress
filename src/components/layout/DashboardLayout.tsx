import { FC } from 'react';
import { Alert, Box, Snackbar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DashboardNavbar, navbarHeight } from './DashboardNavbar';
import { DashboardDrawer, drawerWidth } from './DashboardDrawer';
import { useAppDispatch, useAppSelector } from '../../hooks/redux/redux';
import { resetErrors, resetSuccess } from '../../store/reducers/AppSlice';


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
  const { errors, success } = useAppSelector(state => state.appReducer);
  const dispatch = useAppDispatch();
  const handleErrorSnackBarClose = () => {
    dispatch(resetErrors());
  };
  const handleSuccessSnackBarClose = () => {
    dispatch(resetSuccess());
  };

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
      {
        errors
        ? <Snackbar open onClose={handleErrorSnackBarClose}>
          <Alert
            severity='error'
            variant='filled'
            sx={{ width: '100%' }}
            onClose={handleErrorSnackBarClose}
          >
            {errors.map(error => (<Box key={error}>{error}<br/></Box>))}
          </Alert>
        </Snackbar>
        : null
      }
      {
        success
        ? <Snackbar open autoHideDuration={2000} onClose={handleSuccessSnackBarClose}>
          <Alert
            severity='success'
            variant='filled'
            sx={{ width: '100%' }}
            onClose={handleSuccessSnackBarClose}
          >
            {success}
          </Alert>
        </Snackbar>
        : null
      } 
    </>
  );
};
