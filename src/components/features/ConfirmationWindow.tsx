import { Stack, Button, Typography, Box } from "@mui/material";
import { FC } from "react";


interface Props {
  onReject: () => void,
  onSubmit: () => void,
  message: string,
};
export const ConfirmationWindow: FC<Props> = ({ message, onSubmit, onReject }) => {
  return (
    <Box
      sx={{
        minHeight: 200,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ my: 4, display: 'flex', justifyContent: 'center' }}>
        <Typography sx={{ textAlign: 'center' }}>{message}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant='outlined' color='primary' onClick={onReject}>Нет</Button>
        <Button variant='outlined' color='primary' onClick={onSubmit}>Да</Button>
      </Box>
    </Box>
  );
}
