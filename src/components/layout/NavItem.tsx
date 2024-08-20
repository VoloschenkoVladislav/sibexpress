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
      }}
    >
      <Link to={link} style={{ textDecoration: 'none' }}>
        <Button
          startIcon={icon}
          disableRipple
          sx={{
            backgroundColor: active ? 'rgba(255,255,255, 0.08)' : undefined,
            borderRadius: 1,
            color: active ? 'secondary.main' : 'neutral.300',
            fontWeight: active ? 'fontWeightBold' : undefined,
            justifyContent: 'flex-start',
            px: 3,
            textAlign: 'left',
            textTransform: 'none',
            width: '100%',
            '& .MuiButton-startIcon': {
              color: active ? 'secondary.main' : 'neutral.400',
            },
            '&:hover': {
              backgroundColor: 'rgba(255,255,255, 0.08)',
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
