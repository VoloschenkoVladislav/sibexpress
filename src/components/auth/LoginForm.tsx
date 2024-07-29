import { FC } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux/redux';
import { useLoginMutation } from '../../services/AuthService';


const LoginForm: FC = () => {
  const authError = useAppSelector(state => state.authReducer.authError);
  const [ login ] = useLoginMutation();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email: string = data.get('email')!.toString();
    const password: string = data.get('password')!.toString();

    login({ email, password });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Войти
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            error={!!authError?.email}
            helperText={authError?.email?.join('\n')}
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            error={!!authError?.password}
            helperText={authError?.password?.join('\n')}
            margin="normal"
            required
            fullWidth
            name="password"
            label="Пароль"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, '&:hover': {backgroundColor: 'primary.dark'} }}
          >
            Войти
          </Button>                   
        </Box>
      </Box>
    </Container>
  );
};

export const LoginWrap: React.FunctionComponent = () => {
  const to = useLocation().state || '/';
  const isAuthorized = useAppSelector(state => state.authReducer.isAuthorized);
  return isAuthorized ? <Navigate to={to} /> : <LoginForm />;
};
