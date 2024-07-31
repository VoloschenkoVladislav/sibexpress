import { FC } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { PATHS } from '../../constants/path';
import { useAppSelector } from '../../hooks/redux/redux';


export const AuthRoute: FC = () => {
  const location = useLocation();
  console.log(location);
  const isAuthorized = useAppSelector(state => state.authReducer.isAuthorized);
  const errorMessage = useAppSelector(state => state.authReducer.errorMessage);

  return isAuthorized
    ? <Outlet />
    : (
      errorMessage
        ? (() => {
          switch(errorMessage) {
            case 'Unauthorized':
              return <Navigate to={PATHS.UNAUTHORIZED} state={location.pathname} />;
            default:
              return <Navigate to={PATHS.UNAUTHORIZED} state={location.pathname} />;
          }
        })() 
        : <Navigate to={PATHS.LOGIN} state={location.pathname} />
    );
    
};
