import { Box, Button, TextField, Typography } from "@mui/material";
import { FC, useState } from "react";


interface NewItemProps {
  onSave: (title: string) => void,
  onCancel: () => void,
  title: string,
  placeholder?: string,
}

export const NewItem: FC<NewItemProps> = props => {
  const [ title, setTitle ] = useState('');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
        <Typography variant='h6' gutterBottom>{props.title}</Typography>
        <TextField variant='outlined' placeholder={props.placeholder} onChange={e => setTitle(e.target.value)} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button variant='outlined' color='primary' onClick={props.onCancel} sx={{ mr: 1 }}>Отмена</Button>
        <Button variant='contained' disabled={!title} color='success' onClick={() => props.onSave(title)}>Добавить</Button>
      </Box>
    </Box>
  );
}
