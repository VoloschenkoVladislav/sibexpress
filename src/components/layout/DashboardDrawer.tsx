import { FC } from 'react';
import { PATHS } from '../../constants/path';
import { Link } from 'react-router-dom';
import { Drawer, Box, Divider } from '@mui/material';
import { NavItem } from './NavItem';
import { Logo } from './Logo';
import NewspaperOutlinedIcon from '@mui/icons-material/NewspaperOutlined';
import SpeakerNotesOutlinedIcon from '@mui/icons-material/SpeakerNotesOutlined';
import AutoAwesomeMosaicOutlinedIcon from '@mui/icons-material/AutoAwesomeMosaicOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import { navbarHeight } from './DashboardNavbar';


const items = [
  {
    link: PATHS.NEWS,
    title: 'Материалы',
    icon: <NewspaperOutlinedIcon />,
  },
  {
    link: PATHS.TOPICS_MANAGEMENT,
    title: 'Управление темами',
    icon: <SpeakerNotesOutlinedIcon />,
  },
  {
    link: PATHS.BANNERS,
    title: 'Управление баннерами',
    icon: <AutoAwesomeMosaicOutlinedIcon />,
  },
  {
    link: PATHS.USERS,
    title: 'Пользователи',
    icon: <PeopleAltOutlinedIcon />,
  },
];

export const drawerWidth = 240;

export const DashboardDrawer: FC = () => {

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Box sx={{ flexGrow: 1, mt: 3 }}>
        {items.map(item => (
          <NavItem
            key={item.title}
            icon={item.icon}
            link={item.link}
            title={item.title}
          />
        ))}
      </Box>
    </Box>
  );

  return (
    <Drawer
      anchor='left'
      open
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.900',
          color: '#FFFFFF',
          width: drawerWidth,
        },
      }}
      variant='permanent'
    >
      {content}
    </Drawer>
  );
}
