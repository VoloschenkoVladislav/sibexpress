import { FC } from 'react';
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import { Posts } from './news/Posts';
import { PATHS } from '../constants/path';
import { Users } from './users/Users';
import { Themes } from './themes/Themes';
import { AuthRoute } from './auth/AuthRoute';
import { LoginWrap } from './auth/LoginForm';
import { PostEdit } from './news/PostEdit';
import { Banners } from './banners/Banners';
import { ErrorBoundary } from './features/ErrorBoundary';
import './App.css';


const App: FC = () => {
  return (
    <>
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            <Route path={PATHS.LOGIN} element={<LoginWrap />} />
            <Route element={<AuthRoute />}>
              <Route path='/' element={<Navigate to={PATHS.NEWS} replace />} />
              <Route path={PATHS.NEWS} element={<Posts />} />
              <Route path={`${PATHS.NEWS}/:id`} element={<PostEdit />} />
              <Route path={PATHS.TOPICS_MANAGEMENT} element={<Themes />} />
              <Route path={PATHS.USER_LIST} element={<Users />} />
              <Route path={PATHS.BANNERS} element={<Banners />} />
            </Route>
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </>
  );
}

export default App;
