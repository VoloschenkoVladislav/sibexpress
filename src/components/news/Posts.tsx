import { FC, useState } from "react";
import { DashboardLayout } from "../layout/DashboardLayout";
import { Link } from "react-router-dom";
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { PATHS } from "../../constants/path";
import { usePostsQuery } from "../../services/PostService";
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
} from "@mui/material";


interface PostSkeletonProps {
  id: number,
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
  const { data: posts, isLoading: isPostsLoading, isFetching: isPostsFetching } = usePostsQuery({ page: page + 1, perPage: rowsPerPage });
  const { data: statuses = [], isLoading: isStatusesLoading } = useStatusesQuery();
  const { data: types = [], isLoading: isTypesLoading } = useTypesQuery();
  
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
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
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
          {
            isPostsLoading || isPostsFetching
              ? Array.from(Array(rowsPerPage).keys()).map(id => (
                <PostSkeleton id={id} />
              ))
              : posts?.data?.items.map(post => (
                <TableRow
                  key={post.id}
                >
                  <TableCell>{post.id}</TableCell>
                  <TableCell>{post.title}</TableCell>
                  <TableCell>
                    {(() => isTypesLoading
                      ? <Skeleton variant="text" />
                      : getTypeTitle(post.type_id)
                    )()}
                  </TableCell>
                  <TableCell>{post.published_at}</TableCell>
                  <TableCell>
                    {(() => isStatusesLoading
                      ? <Skeleton variant="text" />
                      : getStatusTitle(post.status_id)
                    )()}
                  </TableCell>
                  <TableCell align="right" sx={{ maxWidth: 7 }}>
                    <Link to={`${PATHS.NEWS}/${post.id}`} style={{ textDecoration: 'none' }}>
                      <Button>
                        <CreateOutlinedIcon />
                      </Button>
                    </Link>
                  </TableCell>
                  <TableCell align="right" sx={{ maxWidth: 7 }}>
                    <Button>
                      <DeleteOutlinedIcon sx={{ color: '#C50000' }}/>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
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
  );
}

export const Posts: FC = () => {
  return (
    <DashboardLayout>
      <PostsTable />
    </DashboardLayout>
  )
};
