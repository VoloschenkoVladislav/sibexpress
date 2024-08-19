import { Stack, Button, Typography } from "@mui/material";
import { FC } from "react";


interface Props {
  onReject: () => void,
  onSubmit: () => void,
  message: string,
};

export const ConfirmationWindow: FC<Props> = ({ message, onSubmit, onReject }) => {
  return (
    <>
      <Typography>{message}</Typography>
      <Stack direction='column' spacing={2}>
        <Button onClick={onReject}>Нет</Button>
        <Button onClick={onSubmit}>Да</Button>
      </Stack>
    </>
  );
}
