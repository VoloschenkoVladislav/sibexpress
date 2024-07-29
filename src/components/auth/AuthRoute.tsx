import { FC } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { PATHS } from '../../constants/path';
import { useAppSelector } from '../../hooks/redux/redux';
import { useMeQuery } from '../../services/AuthService';


const AdminPanelOutlet: FC = () => {
  useMeQuery();
  return <Outlet />;
};

export const AuthRoute: FC = () => {
  const location = useLocation();
  const isAuthorized = useAppSelector(state => state.authReducer.isAuthorized);

  return isAuthorized
    ? <AdminPanelOutlet />
    : <Navigate to={PATHS.LOGIN} state={location.pathname} />;
};
