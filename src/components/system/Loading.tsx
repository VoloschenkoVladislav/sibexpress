import { FC } from 'react';
import { Box, CircularProgress } from '@mui/material';


export const Loading: FC = () => {
  return (
    <Box sx={{
      display: 'flex',
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      backdropFilter: 'blur(5px)'
    }}>
      <CircularProgress />
    </Box>
  );
}
