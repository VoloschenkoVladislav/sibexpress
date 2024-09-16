import { FC } from 'react';
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import { Posts } from './news/Posts';
import { PATHS } from '../constants/path';
import { Users } from './users/Users';
import { UserEdit } from './users/UserEdit';
import { Topics } from './topics/Topics';
import { AuthRoute } from './auth/AuthRoute';
import { LoginWrap } from './auth/LoginForm';
import { PostEdit } from './news/PostEdit';
import { Banners } from './banners/Banners';
import { BannerEdit } from './banners/BannerEdit';
import { ErrorBoundary } from './features/ErrorBoundary';
import { AbacProvider } from 'react-abac';
import { useAppSelector } from '../hooks/redux/redux';


const App: FC = () => {
  const permissions = useAppSelector(state => state.authReducer.user?.permissions) || [];
  return (
    <AbacProvider
      rules={{}}
      permissions={permissions}
    >
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            <Route path={PATHS.LOGIN} element={<LoginWrap />} />
            <Route element={<AuthRoute />}>
              <Route path='/' element={<Navigate to={PATHS.NEWS} replace />} />
              <Route path={PATHS.NEWS} element={<Posts />} />
              <Route path={`${PATHS.NEWS}/:id`} element={<PostEdit />} />
              <Route path={PATHS.TOPICS_MANAGEMENT} element={<Topics />} />
              <Route path={PATHS.USERS} element={<Users />} />
              <Route path={`${PATHS.USERS}/:id`} element={<UserEdit />} />
              <Route path={PATHS.BANNERS} element={<Banners />} />
              <Route path={`${PATHS.BANNERS}/:id`} element={<BannerEdit />} />
            </Route>
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </AbacProvider>
  );
}

export default App;
