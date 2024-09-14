import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, ListItem } from '@mui/material';

interface Props {
  link: string,
  icon: JSX.Element,
  title: string,
}

export const NavItem: React.FunctionComponent<Props> = props => {
  const { link, title, icon } = props;
  const paths = window.location.pathname.match(/\/\w*/g);
  const subLink = paths ? paths[0] : '';
  const active = link ? (subLink === link) : false;

  return (
    <ListItem
      disableGutters
      sx={{
        display: 'flex',
        mb: 0.5,
        py: 0,
        px: 2,
        width: '100%',
      }}
    >
      <Link to={link} style={{ textDecoration: 'none', width: '100%' }}>
        <Button
          startIcon={icon}
          disableRipple
          sx={{
            color: active ? 'common.white' : 'primary.light',
            backgroundColor: active ? 'primary.light' : undefined,
            borderRadius: 2,
            justifyContent: 'flex-start',
            px: 3,
            py: 1,
            textAlign: 'left',
            textTransform: 'none',
            width: '100%',
            '& .MuiButton-startIcon': {
              color: active ? 'common.white' : 'primary.light',
            },
            '&:hover': {
              backgroundColor: active ? 'primary.light' : 'rgba(255,255,255, 0.22)',
            },
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            {title}
          </Box>
        </Button>
      </Link>
    </ListItem>
  );
};
