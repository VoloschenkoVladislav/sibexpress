import { Button, Typography, Box } from '@mui/material';
import { FC } from 'react';


interface Props {
  onReject: () => void,
  onSubmit: () => void,
  message: string,
  submitTitle?: string,
  rejectTitle?: string,
  submitColor?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
  rejectColor?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
};

export const ConfirmationWindow: FC<Props> = props => {
  const {
    message,
    onSubmit,
    onReject,
    submitTitle,
    rejectTitle,
    submitColor,
    rejectColor,
  } = props;

  return (
    <Box
      sx={{
        minHeight: 200,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Typography variant='h5'>Подтвердите действие</Typography>
      <Box sx={{ my: 4, display: 'flex' }}>
        <Typography>{message}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant='outlined' color={rejectColor} onClick={onReject}>{rejectTitle ? rejectTitle : 'Нет'}</Button>
        <Button variant='contained' color={submitColor} onClick={onSubmit}>{submitTitle ? submitTitle : 'Да'}</Button>
      </Box>
    </Box>
  );
}
