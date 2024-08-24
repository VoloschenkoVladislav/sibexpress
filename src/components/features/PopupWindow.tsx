import React, { FC, ReactNode } from 'react';
import { Box, Paper } from '@mui/material';


interface Props {
  visible: boolean,
  children: ReactNode
};

export const PopupWindow: FC<Props> = ({ visible, children }) => {
  return (
    visible
    ? <Box sx={{
      zIndex: 1201,
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
      <Paper
        sx={{
          minWidth: 400,
          minHeight: 200,
          padding: 5
        }}
      >
        {children}
      </Paper>
    </Box>
    : <></>
  );
};
