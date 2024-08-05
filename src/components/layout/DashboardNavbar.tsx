import { FC } from 'react';
import { AppBar, Box, Toolbar, Button } from '@mui/material';
import { PATHS } from '../../constants/path';
import { Link } from 'react-router-dom';
import { useLazyLogoutQuery } from '../../services/AuthService';


const items = [
  {
    link: PATHS.NEWS,
    title: 'Материалы',
  },
  {
    link: PATHS.TOPICS_MANAGEMENT,
    title: 'Управление темами',
  },
  {
    link: PATHS.USER_LIST,
    title: 'Пользователи',
  },
];

export const toolbarHeight = '40px';

export const DashboardNavbar: FC = () => {
  const [ logoutFetch ] = useLazyLogoutQuery();

  return (
    <>
      <AppBar
        sx={{
          width: '100%',
        }}
      >
        <Toolbar
          sx={{
            height: toolbarHeight,
            left: 0,
            px: 2,
          }}
        >
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {items.map((item) => (
              <Link to={item.link} style={{ textDecoration: 'none' }}>
                <Button
                  key={item.title}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {item.title}
                </Button>
              </Link>
            ))}
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            sx={{
              my: 2,
              color: 'white',
              display: 'block'
            }}
            onClick={() => logoutFetch()}
          >
            Выйти
          </Button>
        </Toolbar>
      </AppBar>
    </>
  );
};
