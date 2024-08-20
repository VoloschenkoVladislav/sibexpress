import { FC, useMemo, useRef, useState } from "react";
import { DashboardLayout } from "../layout/DashboardLayout";
import { Link } from "react-router-dom";
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { PATHS } from "../../constants/path";
import { useCreatePostMutation, useDeletePostMutation, useGetPostsQuery } from "../../services/PostService";
import {
  useStatusesQuery,
  useTypesQuery,
} from "../../services/DictionaryService";
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
} from "@mui/material";
import { PopupWindow } from "../features/PopupWindow";
import { LoadingWrap } from "../features/LoadingWrap";
import { ConfirmationWindow } from "../features/ConfirmationWindow";


interface PostSkeletonProps {
  id: number,
}

interface NewPostProps {
  onSave: (title: string) => void,
  onCancel: () => void,
}

const PostSkeleton: FC<PostSkeletonProps> = props => {
  const { id } = props;

  return (
    <TableRow
      key={id}
    >
      <TableCell><Skeleton variant="text" /></TableCell>
      <TableCell><Skeleton variant="text" /></TableCell>
      <TableCell><Skeleton variant="text" /></TableCell>
      <TableCell><Skeleton variant="text" /></TableCell>
      <TableCell><Skeleton variant="text" /></TableCell>
      <TableCell align="right" sx={{ maxWidth: 7 }}>
        <Button disabled>
          <CreateOutlinedIcon />
        </Button>
      </TableCell>
      <TableCell align="right" sx={{ maxWidth: 7 }}>
        <Button disabled>
          <DeleteOutlinedIcon/>
        </Button>
      </TableCell>
    </TableRow>
  );
};

const PostsTable: FC = () => {
  const [ page, setPage ] = useState(0);
  const [ rowsPerPage, setRowsPerPage ] = useState(10);
  const [ selectedPost, setSelectedPost ] = useState<number | null>(null);
  const [ showDeletePopup, setShowDeletePopup ] = useState(false);
  const { data: posts, isLoading: isPostsLoading, isFetching: isPostsFetching } = useGetPostsQuery({ page: page + 1, perPage: rowsPerPage });
  const { data: statuses = [], isLoading: isStatusesLoading } = useStatusesQuery();
  const { data: types = [], isLoading: isTypesLoading } = useTypesQuery();
  const [ deletePost ] = useDeletePostMutation();

  const postsCount = useMemo(() => posts?.data?.items?.length, [posts]);
  
  const getTypeTitle = (type_id: number) => {
    return types.filter(type => type.id === type_id)[0].title;
  };

  const getStatusTitle = (status_id: number) => {
    return statuses.filter(status => status.id === status_id)[0].title;
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
          message={`Вы уверены, что хотите удалить материал №${selectedPost}`}
        />
      </PopupWindow>
      <TableContainer component={Paper}  sx={{ minWidth: 650, h: '100%' }}>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow component='th' scope='row'>
              <TableCell>ID</TableCell>
              <TableCell>Заголовок</TableCell>
              <TableCell>Тип</TableCell>
              <TableCell>Дата и время</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
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
                <TableRow
                  key={post.id}
                >
                  <TableCell>{post.id}</TableCell>
                  <TableCell>{post.title.replaceAll(/<.*?>/ig, '')}</TableCell>
                  <TableCell>
                    <LoadingWrap
                      isLoading={isTypesLoading}
                      loader={<Skeleton variant="text" />}
                    >
                      {getTypeTitle(post.type_id)}
                    </LoadingWrap>
                  </TableCell>
                  <TableCell>{post.published_at}</TableCell>
                  <TableCell>
                    <LoadingWrap
                      isLoading={isStatusesLoading}
                      loader={<Skeleton variant="text" />}
                    >
                      {getStatusTitle(post.status_id)}
                    </LoadingWrap>
                  </TableCell>
                  <TableCell align="right" sx={{ maxWidth: 7 }}>
                    <Link to={`${PATHS.NEWS}/${post.id}`} style={{ textDecoration: 'none' }}>
                      <Button>
                        <CreateOutlinedIcon />
                      </Button>
                    </Link>
                  </TableCell>
                  <TableCell align="right" sx={{ maxWidth: 7 }}>
                    <Button onClick={() => {
                      setSelectedPost(post.id);
                      setShowDeletePopup(true);
                    }}>
                      <DeleteOutlinedIcon sx={{ color: '#C50000' }}/>
                    </Button>
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
                labelRowsPerPage={"Новостей на странице:"}
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

export const NewPost: FC<NewPostProps> = props => {
  const title = useRef('');
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
        <Typography variant='h6' gutterBottom>Введите заголовок</Typography>
        <TextField variant='outlined' placeholder='Заголовок' onChange={e => { title.current = e.target.value }} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant='outlined' color='primary' onClick={onCancel}>Отменить</Button>
        <Button variant='outlined' color='success' onClick={() => onSave(title.current)}>Добавить</Button>
      </Box>
    </Box>
  );
}

export const Posts: FC = () => {
  const [ newPostPopupVisible, setNewPostPopupVisible ] = useState(false);
  const [ createPost ] = useCreatePostMutation();

  return (
    <DashboardLayout>
      <PopupWindow visible={newPostPopupVisible}>
        <NewPost
          onSave={title => {
            createPost(`<p>${title}</p>`);
            setNewPostPopupVisible(false);
          }}
          onCancel={() => setNewPostPopupVisible(false)}
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
        <Button
          variant='outlined'
          onClick={() => setNewPostPopupVisible(true)}
          sx={{
            my: 1
          }}
        >
          Добавить материал
        </Button>
      </Box>
      <Box sx={{ height: '100%', mt: 2 }}>
        <PostsTable />
      </Box>
    </DashboardLayout>
  )
};
