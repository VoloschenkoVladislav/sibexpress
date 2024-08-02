import { FC } from "react";
import { DashboardLayout } from "../layout/DashboardLayout";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, Skeleton } from "@mui/material";
import { Link } from "react-router-dom";
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { PATHS } from "../../constants/path";
import { ShortPostInterface, usePostsQuery } from "../../services/PostService";
import { StatusInterface, TypeInterface, useStatusesQuery, useTypesQuery } from "../../services/DictionaryService";


interface TableProps {
  posts: ShortPostInterface[],
  statuses: StatusInterface[],
  types: TypeInterface[],
  isPostsLoading?: boolean,
  isStatusesLoading?: boolean,
  isTypesLoading?: boolean,
};

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
}

const PostsTable: FC<TableProps> = props => {
  const {
    posts,
    statuses,
    types,
    isPostsLoading,
    isStatusesLoading,
    isTypesLoading,
  } = props;
  
  const getTypeTitle = (type_id: number) => {
    return types.filter(type => type.id === type_id)[0].title;
  };

  const getStatusTitle = (status_id: number) => {
    return statuses.filter(status => status.id === status_id)[0].title;
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
            isPostsLoading
              ? [1, 2, 3, 4, 5].map(id => (
                <PostSkeleton id={id} />
              ))
              : posts.map(post => (
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
      </Table>
    </TableContainer>
  );
}

export const Posts: FC = () => {
  const { data: posts = [], isLoading: isPostsLoading } = usePostsQuery(10);
  const { data: statuses = [], isLoading: isStatusesLoading } = useStatusesQuery();
  const { data: types = [], isLoading: isTypesLoading } = useTypesQuery();

  return (
    <DashboardLayout>
      <PostsTable
        posts={posts}
        statuses={statuses}
        types={types}
        isPostsLoading={isPostsLoading}
        isStatusesLoading={isStatusesLoading}
        isTypesLoading={isTypesLoading}
      />
    </DashboardLayout>
  )
};
