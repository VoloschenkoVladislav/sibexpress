import { FC } from 'react';
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import { News } from './news/News';
import { PATHS } from '../constants/path';
import { Users } from './users/Users';
import { Themes } from './themes/Themes';
import { AuthRoute } from './auth/AuthRoute';
import { LoginWrap } from './auth/LoginForm';
import { NewsEdit } from './news/NewsEdit';


const App: FC = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path={PATHS.LOGIN} element={<LoginWrap />} />
          <Route element={<AuthRoute />}>
            <Route path='/' element={<Navigate to={PATHS.NEWS} replace />} />
            <Route path={PATHS.NEWS} element={<News />} />
            <Route path={`${PATHS.NEWS}/:id`} element={<NewsEdit />} />
            <Route path={PATHS.TOPICS_MANAGEMENT} element={<Themes />} />
            <Route path={PATHS.USER_LIST} element={<Users />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
