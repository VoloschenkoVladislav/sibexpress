import { FC } from 'react';
import { PATHS } from '../../constants/path';
import { Drawer, Box, Divider } from '@mui/material';
import { NavItem } from './NavItem';
import NewspaperOutlinedIcon from '@mui/icons-material/NewspaperOutlined';
import SpeakerNotesOutlinedIcon from '@mui/icons-material/SpeakerNotesOutlined';
import AutoAwesomeMosaicOutlinedIcon from '@mui/icons-material/AutoAwesomeMosaicOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import { Logo } from './Logo';
import { PERMISSIONS } from '../../constants/permission';
import { useAbac } from 'react-abac';


const items = [
  {
    link: PATHS.NEWS,
    title: 'Материалы',
    icon: <NewspaperOutlinedIcon />,
    permission: PERMISSIONS.POST_VIEW,
  },
  {
    link: PATHS.TOPICS_MANAGEMENT,
    title: 'Управление темами',
    icon: <SpeakerNotesOutlinedIcon />,
    permission: PERMISSIONS.TOPIC_VIEW,
  },
  {
    link: PATHS.BANNERS,
    title: 'Управление баннерами',
    icon: <AutoAwesomeMosaicOutlinedIcon />,
    permission: PERMISSIONS.BANNER_VIEW,
  },
  {
    link: PATHS.USERS,
    title: 'Пользователи',
    icon: <PeopleAltOutlinedIcon />,
    permission: PERMISSIONS.USER_VIEW,
  },
];

export const drawerWidth = 280;

export const DashboardDrawer: FC = () => {
  const { userHasPermissions } = useAbac();
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
        {items.map(item => userHasPermissions(item.permission) ? (
          <NavItem
            key={item.title}
            icon={item.icon}
            link={item.link}
            title={item.title}
          />
        ) : null)}
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
