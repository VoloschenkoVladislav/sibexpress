import { FC, useMemo, useRef, useState } from 'react';
import { DashboardLayout } from '../layout/DashboardLayout';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import {
  ICreateUserRequest,
  useCreateUserMutation,
  useDeleteUserMutation,
  useGetUsersQuery,
} from '../../services/UserService';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  Skeleton,
  TableFooter,
  TablePagination,
  Box,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Tooltip,
} from '@mui/material';
import { PopupWindow } from '../features/PopupWindow';
import { LoadingWrap } from '../features/LoadingWrap';
import { ConfirmationWindow } from '../features/ConfirmationWindow';
import { PATHS } from '../../constants/path';
import { Link } from 'react-router-dom';
import { useAbac } from "react-abac";
import { PERMISSIONS } from "../../constants/permission";


interface UserSkeletonProps {
  id: number,
}

interface NewUserProps {
  onSave: (user: ICreateUserRequest) => void,
  onCancel: () => void,
}

const UserSkeleton: FC<UserSkeletonProps> = props => {
  const { id } = props;

  return (
    <TableRow
      key={id}
    >
      <TableCell><Skeleton variant='text' /></TableCell>
      <TableCell><Skeleton variant='text' /></TableCell>
      <TableCell><Skeleton variant='text' /></TableCell>
      <TableCell align='right' sx={{ maxWidth: 7 }}>
        <Button disabled>
          <CreateOutlinedIcon />
        </Button>
      </TableCell>
      <TableCell align='right' sx={{ maxWidth: 7 }}>
        <Button disabled>
          <DeleteOutlinedIcon/>
        </Button>
      </TableCell>
    </TableRow>
  );
};

const UsersTable: FC = () => {
  const { userHasPermissions } = useAbac();
  const [ page, setPage ] = useState(0);
  const [ rowsPerPage, setRowsPerPage ] = useState(localStorage.getItem('usersPerPage') ? +localStorage.getItem('usersPerPage')! :  10);
  const [ selectedUser, setSelectedUser ] = useState<number | null>(null);
  const [ showDeletePopup, setShowDeletePopup ] = useState(false);
  const { data: users, isLoading: isPostsLoading, isFetching: isPostsFetching } = useGetUsersQuery({ page: page + 1, perPage: rowsPerPage });
  const [ deleteUser ] = useDeleteUserMutation();

  const usersCount = useMemo(() => users?.data?.items?.length, [users]);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(+event.target.value);
    localStorage.setItem('usersPerPage', event.target.value);
    setPage(0);
  };

  return (
    <>
      <PopupWindow visible={showDeletePopup}>
        <ConfirmationWindow
          onSubmit={() => {
            if (selectedUser) deleteUser(selectedUser);
            setShowDeletePopup(false);
          }}
          onReject={() => setShowDeletePopup(false)}
          message={`Вы уверены, что хотите удалить пользователя №${selectedUser}?`}
          submitColor='error'
          submitTitle='Удалить'
          rejectTitle='Отмена'
        />
      </PopupWindow>
      <TableContainer component={Paper}  sx={{ minWidth: 650, h: '100%' }}>
        <Table size='small' aria-label='a dense table'>
          <TableHead>
            <TableRow component='th' scope='row'>
              <TableCell>ID</TableCell>
              <TableCell>E-mail</TableCell>
              <TableCell>Создан</TableCell>
              <TableCell>Изменён</TableCell>
              <TableCell align='right'></TableCell>
              {
                userHasPermissions(PERMISSIONS.USER_DELETE)
                ? <TableCell align="right"></TableCell>
                : null
              }
            </TableRow>
          </TableHead>
          <TableBody>
            <LoadingWrap
              isLoading={isPostsLoading || isPostsFetching}
              loader={Array.from(Array(rowsPerPage).keys()).map(id => (
                <UserSkeleton id={id} key={id} />
              ))}
            >
              {users?.data?.items?.map(user => (
                <TableRow
                  key={user.id}
                >
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.created_at}</TableCell>
                  <TableCell>{user.updated_at}</TableCell>
                  <TableCell align='right' sx={{ maxWidth: 7 }}>
                    <Link to={`${PATHS.USERS}/${user.id}`} style={{ textDecoration: 'none' }}>
                      <Tooltip
                        title={
                          userHasPermissions(PERMISSIONS.USER_EDIT)
                          ? 'Редактировать данные пользователя'
                          : 'Открыть данные пользователя'
                        }
                      >
                        <span>
                          <IconButton color='primary'>
                            {
                              userHasPermissions(PERMISSIONS.USER_EDIT)
                              ? <CreateOutlinedIcon />
                              : <VisibilityOutlinedIcon />
                            }
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Link>
                  </TableCell>
                  {
                    userHasPermissions(PERMISSIONS.USER_DELETE)
                    ? <TableCell align='right' sx={{ maxWidth: 7 }}>
                      <Tooltip title='Удалить пользователя'>
                        <span>
                          <IconButton
                            onClick={() => {
                              setSelectedUser(user.id);
                              setShowDeletePopup(true);
                            }}
                            color='error'
                          >
                            <DeleteOutlinedIcon/>
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                    : null
                  }
                </TableRow>
              ))}
            </LoadingWrap>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                showFirstButton
                count={-1}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[10, 25, 50]}
                onRowsPerPageChange={handleChangeRowsPerPage}
                page={page}
                labelRowsPerPage={'Пользавтелей на странице:'}
                labelDisplayedRows={({ from, to }) => {
                  const toCalc = usersCount === rowsPerPage
                    ? to
                    : !!usersCount
                      ? from + usersCount - 1
                      : '?';
                  return `${from} - ${toCalc}`;
                }}
                slotProps={{
                  actions: {
                    nextButton: {
                      disabled: !users?.data?.links.next
                    },
                  },
                }}
                onPageChange={handleChangePage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
}

const NewUser: FC<NewUserProps> = props => {
  const email = useRef('');
  const name = useRef('');
  const password = useRef('');
  const [ showPassword, setShowPassword ] = useState(false);
  const { onSave, onCancel } = props;

  return (
    <Box
      sx={{
        minHeight: 200,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', mb: 3 }}>
        <Typography variant='h6' sx={{ mb: 3 }}>Заполните данные о новом пользователе</Typography>
        <TextField variant='outlined' label='Почта' onChange={e => { email.current = e.target.value }} sx={{ mb: 3 }} />
        <TextField variant='outlined' label='Логин' onChange={e => { name.current = e.target.value }} sx={{ mb: 3 }} />
        <TextField
          variant='outlined'
          label='Пароль'
          onChange={e => { password.current = e.target.value }}
          type={showPassword ? "text" : "password"}
          sx={{ mb: 2 }}
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant='outlined' color='primary' onClick={onCancel}>Отмена</Button>
        <Button
          variant='contained'
          color='success'
          onClick={() => onSave({
            email: email.current,
            name: name.current,
            password: password.current,
          })}
        >Добавить</Button>
      </Box>
    </Box>
  );
}

export const Users: FC = () => {
  const { userHasPermissions } = useAbac();
  const [ newUserPopupVisible, setNewUserPopupVisible ] = useState(false);
  const [ createUser ] = useCreateUserMutation();

  return (
    <DashboardLayout>
      <PopupWindow visible={newUserPopupVisible}>
        <NewUser
          onSave={userData => {
            createUser(userData);
            setNewUserPopupVisible(false);
          }}
          onCancel={() => setNewUserPopupVisible(false)}
        />
      </PopupWindow>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          alignItems: 'center',
        }}
      >
        <Typography variant='h4' gutterBottom>
          Управление пользователями
        </Typography>
        {
          userHasPermissions(PERMISSIONS.USER_CREATE)
          ? <Tooltip title='Добавить нового пользователя'>
            <span>
              <IconButton
                color='primary'
                onClick={() => setNewUserPopupVisible(true)}
                sx={{
                  my: 1
                }}
              >
                <AddOutlinedIcon />
              </IconButton>
            </span>
          </Tooltip>
          : null
        }
      </Box>
      <Box sx={{ height: '100%', mt: 2 }}>
        <UsersTable />
      </Box>
    </DashboardLayout>
  )
};
