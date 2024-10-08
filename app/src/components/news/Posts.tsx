import { FC, useMemo, useState } from 'react';
import { DashboardLayout } from '../layout/DashboardLayout';
import { Link } from 'react-router-dom';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { PATHS } from '../../constants/path';
import { useCreatePostMutation, useDeletePostMutation, useGetPostsQuery } from '../../services/PostService';
import {
  useStatusesQuery,
  useTypesQuery,
} from '../../services/DictionaryService';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Skeleton,
  TableFooter,
  TablePagination,
  Box,
  Typography,
  IconButton,
  Tooltip,
  useMediaQuery,
  Theme,
  Stack,
} from '@mui/material';
import { PopupWindow } from '../features/PopupWindow';
import { LoadingWrap } from '../features/LoadingWrap';
import { ConfirmationWindow } from '../features/ConfirmationWindow';
import { NewItem } from '../features/NewItem';
import { useAbac } from 'react-abac';
import { PERMISSIONS } from '../../constants/permission';


interface PostSkeletonProps {
  id: number,
}

const PostSkeleton: FC<PostSkeletonProps> = props => {
  const { id } = props;

  return (
    <TableRow
      key={id}
    >
      <TableCell><Skeleton variant='text' /></TableCell>
      <TableCell><Skeleton variant='text' /></TableCell>
      <TableCell><Skeleton variant='text' /></TableCell>
      <TableCell><Skeleton variant='text' /></TableCell>
      <TableCell><Skeleton variant='text' /></TableCell>
      <TableCell align='right' sx={{ py: 0 }}>
        <Stack direction='row' spacing={3} justifyContent='flex-end'>
          <IconButton disabled>
            <CreateOutlinedIcon />
          </IconButton>
          <IconButton disabled>
            <DeleteOutlinedIcon/>
          </IconButton>
        </Stack>
      </TableCell>
    </TableRow>
  );
};

const PostsTable: FC = () => {
  const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const { userHasPermissions } = useAbac();
  const [ page, setPage ] = useState(0);
  const [ rowsPerPage, setRowsPerPage ] = useState(localStorage.getItem('postsPerPage') ? +localStorage.getItem('postsPerPage')! :  10);
  const [ selectedPost, setSelectedPost ] = useState<number | null>(null);
  const [ showDeletePopup, setShowDeletePopup ] = useState(false);
  const { data: posts, isLoading: isPostsLoading, isFetching: isPostsFetching } = useGetPostsQuery({ page: page + 1, perPage: rowsPerPage });
  const { data: statuses = [], isLoading: isStatusesLoading } = useStatusesQuery();
  const { data: types = [], isLoading: isTypesLoading } = useTypesQuery();
  const [ deletePost ] = useDeletePostMutation();

  const postsCount = useMemo(() => posts?.data?.items?.length, [posts]);
  
  const getTypeTitle = (type_id: number) => {
    return types.filter(type => type.id === type_id)[0]?.title || '';
  };

  const getStatusTitle = (status_id: number) => {
    return statuses.filter(status => status.id === status_id)[0]?.title || '';
  };

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
    localStorage.setItem('postsPerPage', event.target.value);
    setPage(0);
  };

  return (
    <>
      <PopupWindow visible={showDeletePopup}>
        <ConfirmationWindow
          onSubmit={() => {
            if (selectedPost) deletePost(selectedPost);
            setShowDeletePopup(false);
          }}
          onReject={() => setShowDeletePopup(false)}
          message={`Вы уверены, что хотите удалить материал №${selectedPost}?`}
          submitTitle='Удалить'
          rejectTitle='Отмена'
          submitColor='error'
          rejectColor='primary'
        />
      </PopupWindow>
      <TableContainer component={Paper}  sx={{ width: '100%', h: '100%' }}>
        <Table aria-label='a dense table' stickyHeader>
          <TableHead>
            <TableRow component='th' scope='row'>
              <TableCell>ID</TableCell>
              <TableCell>Заголовок</TableCell>
              <TableCell sx={{ display: { sm: 'table-cell', xs: 'none' } }}>Тип</TableCell>
              <TableCell sx={{ display: { sm: 'table-cell', xs: 'none' } }}>Статус</TableCell>
              <TableCell sx={{ display: { lg: 'table-cell', xs: 'none' } }}>Дата и время</TableCell>
              <TableCell align='right' sx={{ maxWidth: 8 }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <LoadingWrap
              isLoading={isPostsLoading || isPostsFetching}
              loader={Array.from(Array(rowsPerPage).keys()).map(id => (
                <PostSkeleton id={id} key={id} />
              ))}
            >
              {posts?.data?.items?.map(post => (
                <TableRow key={post.id}>
                  <TableCell>{post.id}</TableCell>
                  <TableCell>{post.title.replaceAll(/<.*?>/ig, '')}</TableCell>
                  <TableCell sx={{ display: { sm: 'table-cell', xs: 'none' } }}>
                    <LoadingWrap
                      isLoading={isTypesLoading}
                      loader={<Skeleton variant='text' />}
                    >
                      {getTypeTitle(post.type_id)}
                    </LoadingWrap>
                  </TableCell>
                  <TableCell sx={{ display: { sm: 'table-cell', xs: 'none' } }}>
                    <LoadingWrap
                      isLoading={isStatusesLoading}
                      loader={<Skeleton variant='text' />}
                    >
                      {getStatusTitle(post.status_id)}
                    </LoadingWrap>
                  </TableCell>
                  <TableCell sx={{ display: { lg: 'table-cell', xs: 'none' } }}>{post.published_at}</TableCell>
                  <TableCell align='right' sx={{ py: 0 }}>
                    <Stack direction='row' spacing={3} justifyContent='flex-end'>
                      <Link to={`${PATHS.NEWS}/${post.id}`} style={{ textDecoration: 'none' }}>
                        <Tooltip
                          title={
                            userHasPermissions(PERMISSIONS.POST_EDIT)
                            ? 'Редактировать материал'
                            : 'Открыть материал'
                          }
                        >
                          <span>
                            <IconButton color='primary'>
                              {
                                userHasPermissions(PERMISSIONS.POST_EDIT)
                                ? <CreateOutlinedIcon />
                                : <VisibilityOutlinedIcon />
                              }
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Link>
                      {
                        userHasPermissions(PERMISSIONS.POST_DELETE)
                        ? <Tooltip title='Удалить материал'>
                          <span>
                            <IconButton
                              onClick={() => {
                                setSelectedPost(post.id);
                                setShowDeletePopup(true);
                              }}
                              color='error'
                            >
                              <DeleteOutlinedIcon/>
                            </IconButton>
                          </span>
                        </Tooltip>
                        : null
                      }
                    </Stack>
                  </TableCell>
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
                labelRowsPerPage={smDown ? '' : 'Новостей на странице:'}
                labelDisplayedRows={({ from, to }) => {
                  const toCalc = postsCount === rowsPerPage
                    ? to
                    : !!postsCount
                      ? from + postsCount - 1
                      : '?';
                  return `${from} - ${toCalc}`;
                }}
                slotProps={{
                  actions: {
                    nextButton: {
                      disabled: !posts?.data?.links.next
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

export const Posts: FC = () => {
  const { userHasPermissions } = useAbac();
  const [ newPostPopupVisible, setNewPostPopupVisible ] = useState(false);
  const [ createPost ] = useCreatePostMutation();

  return (
    <DashboardLayout>
      <PopupWindow visible={newPostPopupVisible}>
        <NewItem
          onSave={title => {
            createPost(`<p>${title}</p>`);
            setNewPostPopupVisible(false);
          }}
          onCancel={() => setNewPostPopupVisible(false)}
          title='Введите заголовок материала'
          placeholder='Заголовок'
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
          Материалы
        </Typography>
        {
          userHasPermissions(PERMISSIONS.POST_CREATE)
          ? <Tooltip title='Добавить новый материал'>
            <span>
              <IconButton
                color='primary'
                onClick={() => setNewPostPopupVisible(true)}
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
        <PostsTable />
      </Box>
    </DashboardLayout>
  )
};
