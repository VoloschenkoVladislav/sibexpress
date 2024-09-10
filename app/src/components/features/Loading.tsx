import { FC } from 'react';
import { Box, CircularProgress } from '@mui/material';


interface Props {
  visible: boolean,
};

export const Loading: FC<Props> = ({ visible }) => {
  return (
    visible
    ? <Box sx={{
      zIndex: 1202,
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(200, 200, 200, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(1px)',
    }}>
      <CircularProgress />
    </Box>
    : null
  );
}
