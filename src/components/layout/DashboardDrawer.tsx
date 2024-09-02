import { FC } from 'react';
import { PATHS } from '../../constants/path';
import { Drawer, Box, Divider } from '@mui/material';
import { NavItem } from './NavItem';
import NewspaperOutlinedIcon from '@mui/icons-material/NewspaperOutlined';
import SpeakerNotesOutlinedIcon from '@mui/icons-material/SpeakerNotesOutlined';
import AutoAwesomeMosaicOutlinedIcon from '@mui/icons-material/AutoAwesomeMosaicOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import { Logo } from './Logo';


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

export const drawerWidth = 280;

export const DashboardDrawer: FC = () => {

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        alignItems: 'start'
      }}
    >
      <Logo />
      <Divider sx={{ backgroundColor: 'grey.200', width: '100%' }} />
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
          width: drawerWidth,
          backgroundColor: 'primary.dark'
        },
      }}
      variant='permanent'
    >
      {content}
    </Drawer>
  );
}
