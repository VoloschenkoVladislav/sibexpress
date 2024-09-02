import { FC, useEffect, useMemo, useState } from 'react';
import { usePermissionsQuery } from '../../services/DictionaryService';
import { Box, Checkbox, CircularProgress, FormControlLabel, Grid, IconButton, InputAdornment, Paper, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { LoadingWrap } from '../features/LoadingWrap';
import { useGetUserQuery, useEditUserMutation } from '../../services/UserService';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DATE_FORMAT_OUTPUT } from '../../constants/date';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { parseDate } from '../../utils/dateParser';
import { Loading } from '../features/Loading';
import { DashboardLayout } from '../layout/DashboardLayout';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux/redux';
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import { updateUser } from '../../store/reducers/UserSlice';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { setSuccess } from '../../store/reducers/AppSlice';


export const UserEdit: FC = () => {
  const { id } = useParams();
  const {
    email,
    name,
    permissions: userPermissions = [],
    created_at,
    updated_at,
  } = useAppSelector(state => state.usersReducer);
  const dispatch = useAppDispatch();
  const { isLoading: isUserLoading } = useGetUserQuery(+id!);
  const { data: permissions = [], isLoading: isPermissionsLoading } = usePermissionsQuery();
  const [ isSending, setIsSending ] = useState(false);
  const [ userName, setUserName ] = useState('');
  const [ password, setPassword ] = useState<string>('');
  const [ showPassword, setShowPassword ] = useState(false);
  const [ selectedUserPermissions, setSelectedUserPermissions ] = useState<Set<string>>(new Set(userPermissions));
  const [ editUser ] = useEditUserMutation();
  

  const resetAll = () => {
    setSelectedUserPermissions(new Set(userPermissions));
    setUserName(name);
  };

  useEffect(() => {
    resetAll();
    // eslint-disable-next-line
  }, [
    name,
    userPermissions,
  ]);

  const handleSave = () => {
    setIsSending(true);
    editUser({
      id: +id!,
      userData: {
        name: userName,
        permissions: Array.from(selectedUserPermissions),
        password: password || null,
      }
    }).then(response => {
      setIsSending(false);
      if (!response.error) {
        dispatch(updateUser({
          name: userName,
          permissions: Array.from(selectedUserPermissions),
        }));
        dispatch(setSuccess('Данные по пользователю сохранены'));
        setPassword('');
      }
    });
  };

  const handlePermissionChange = (permission: string) => {
    const currentPermissions = new Set(selectedUserPermissions);
    if (currentPermissions.has(permission)) {
      currentPermissions.delete(permission);
    } else {                      
      currentPermissions.add(permission);
    }
    setSelectedUserPermissions(currentPermissions);
  };

  const hasChanged = useMemo(() => {
    return (
      (
        userPermissions.length !== selectedUserPermissions.size ||
        !userPermissions.every(p => selectedUserPermissions.has(p))
      ) || userName !== name
      || password !== ''
    )}, [
      selectedUserPermissions,
      userName,
      password,
      userPermissions,
      name,
  ]);

  return (
    <DashboardLayout>
      <Loading visible={isSending} />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          alignItems: 'center',
        }}
      >
        <Typography variant='h4' gutterBottom>Редактирование пользователя</Typography>
        <Stack direction='row' spacing={2}>
          <Tooltip title='Отменить всё'>
            <span>
              <IconButton
                disabled={!hasChanged}
                onClick={resetAll}
                color='primary'
              >
                <ReplayOutlinedIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title='Сохранить'>
            <span>
              <IconButton
                disabled={!hasChanged}
                onClick={handleSave}
                color='success'
              >
                <SaveOutlinedIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Box>
      <LoadingWrap
        isLoading={isUserLoading}
        loader={<CircularProgress sx={{ position: 'relative', top: '50%', left: '50%' }} />}
      >
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'start',
          height: '100%',
          mt: 2,
        }}>
          <Box sx={{ width: '75%', mr: 2 }}>
            <Typography variant='h6' gutterBottom>Учётные данные</Typography>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Box sx={{ m: 1, mb: 2 }}>
                <TextField
                  variant='outlined'
                  label='E-mail'
                  disabled
                  fullWidth
                  value={email}
                />
              </Box>
              <Box sx={{ m: 1, mb: 2 }}>
                <TextField
                  variant='outlined'
                  label='Логин'
                  fullWidth
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                />
              </Box>
              <Box sx={{ m: 1 }}>
                <TextField
                  variant='outlined'
                  label='Пароль'
                  placeholder='Оставьте пустым, чтобы не менять пароль'
                  fullWidth
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Box>
            </Paper>
            <Typography variant='h6' gutterBottom>Права</Typography>
            <Paper sx={{ p: 2 }}>
              <LoadingWrap
                isLoading={isPermissionsLoading}
                loader={<CircularProgress />}
              >
                <Grid container spacing={2} sx={{ p: 3 }}>
                  {permissions.map(p => (
                    <Grid item xs={3} key={p.name}>
                      <FormControlLabel
                        key={p.title}
                        label={p.title}
                        control={
                          <Checkbox
                            checked={selectedUserPermissions.has(p.name)}
                            onChange={() => handlePermissionChange(p.name)}
                          />
                        }
                      />
                    </Grid>
                  ))}
                </Grid>
              </LoadingWrap>
            </Paper>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '25%',
              height: '100%',
            }}
          >
            <Paper sx={{ p: 2, mb: 3 }}>
              <Box sx={{ mb: 2 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}  adapterLocale='ru'>
                  <DateTimeField
                    disabled
                    fullWidth
                    value={dayjs(parseDate(created_at))}
                    label='Дата создания'
                    format={DATE_FORMAT_OUTPUT}
                  />
                </LocalizationProvider>
              </Box>
              <Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}  adapterLocale='ru'>
                  <DateTimeField
                    disabled
                    fullWidth
                    value={dayjs(parseDate(updated_at))}
                    label='Дата изменения'
                    format={DATE_FORMAT_OUTPUT}
                  />
                </LocalizationProvider>
              </Box>
            </Paper>
          </Box>
        </Box>
      </LoadingWrap>
    </DashboardLayout>
  );
}