import { FC, useMemo, useState } from "react";
import { DashboardLayout } from "../layout/DashboardLayout";
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import {
  useCreateTopicMutation,
  useDeleteTopicMutation,
  useGetTopicsQuery,
  useEditTopicMutation,
} from "../../services/TopicService";
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
  IconButton,
  Tooltip,
} from "@mui/material";
import { PopupWindow } from "../features/PopupWindow";
import { LoadingWrap } from "../features/LoadingWrap";
import { ConfirmationWindow } from "../features/ConfirmationWindow";
import { Loading } from "../features/Loading";
import { NewItem } from "../features/NewItem";
import { useAbac } from "react-abac";
import { PERMISSIONS } from "../../constants/permission";


interface TopicSkeletonProps {
  id: number,
}

interface EditTopicProps {
  onSave: (title: string) => void,
  onCancel: () => void,
  title: string | null,
}

const TopicSkeleton: FC<TopicSkeletonProps> = props => {
  const { id } = props;

  return (
    <TableRow
      key={id}
    >
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

const TopicsTable: FC = () => {
  const { userHasPermissions } = useAbac();
  const [ page, setPage ] = useState(0);
  const [ rowsPerPage, setRowsPerPage ] = useState(localStorage.getItem('topicsPerPage') ? +localStorage.getItem('topicsPerPage')! :  10);
  const [ selectedTopic, setSelectedTopic ] = useState<number | null>(null);
  const [ selectedTopicTitle, setSelectedTopicTitle ] = useState<string | null>(null);
  const [ showDeletePopup, setShowDeletePopup ] = useState(false);
  const [ showEditPopup, setShowEditPopup ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const { data: topics, isLoading: isPostsLoading, isFetching: isPostsFetching } = useGetTopicsQuery({ page: page + 1, perPage: rowsPerPage });
  const [ editTopic ] = useEditTopicMutation();
  const [ deleteTopic ] = useDeleteTopicMutation();

  const topicsCount = useMemo(() => topics?.data?.items?.length, [topics]);

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
    localStorage.setItem('topicsPerPage', event.target.value);
    setPage(0);
  };

  return (
    <>
      <Loading visible={loading} />
      <PopupWindow visible={showDeletePopup}>
        <ConfirmationWindow
          onSubmit={() => {
            if (selectedTopic) {
              setShowDeletePopup(false);
              setLoading(true);
              deleteTopic(selectedTopic).then(() => {
                setLoading(false);
              });
            }
          }}
          onReject={() => setShowDeletePopup(false)}
          message={`Вы уверены, что хотите удалить тему №${selectedTopic}?`}
          submitColor='error'
          submitTitle='Удалить'
          rejectTitle='Отмена'
        />
      </PopupWindow>
      <PopupWindow visible={showEditPopup}>
        <EditTopic
          title={selectedTopicTitle}
          onSave={title => {
            setShowEditPopup(false);
            setLoading(true);
            if (selectedTopic) {
              editTopic({ id: selectedTopic, title }).then(() => {
                setLoading(false);
              });
            }
          }}
          onCancel={() => setShowEditPopup(false)}
        />
      </PopupWindow>
      <TableContainer component={Paper}  sx={{ minWidth: 650, h: '100%' }}>
        <Table size='small' aria-label="a dense table">
          <TableHead>
            <TableRow component='th' scope='row'>
              <TableCell>ID</TableCell>
              <TableCell>Имя</TableCell>
              <TableCell>Упоминаний в материалах</TableCell>
              {
                userHasPermissions(PERMISSIONS.TOPIC_EDIT)
                ? <TableCell align="right"></TableCell>
                : null
              }
              {
                userHasPermissions(PERMISSIONS.TOPIC_DELETE)
                ? <TableCell align="right"></TableCell>
                : null
              }
            </TableRow>
          </TableHead>
          <TableBody>
            <LoadingWrap
              isLoading={isPostsLoading || isPostsFetching}
              loader={Array.from(Array(rowsPerPage).keys()).map(id => (
                <TopicSkeleton id={id} key={id} />
              ))}
            >
              {topics?.data?.items?.map(topic => (
                <TableRow
                  key={topic.id}
                >
                  <TableCell>{topic.id}</TableCell>
                  <TableCell>{topic.title}</TableCell>
                  <TableCell>{topic.count}</TableCell>
                  {
                    userHasPermissions(PERMISSIONS.TOPIC_EDIT)
                    ? <TableCell align="right" sx={{ maxWidth: 7 }}>
                      <Tooltip title='Редактировать тему'>
                        <span>
                          <IconButton
                            color='primary'
                            onClick={() => {
                              setSelectedTopicTitle(topic.title);
                              setSelectedTopic(topic.id);
                              setShowEditPopup(true);
                            }}
                          >
                            <CreateOutlinedIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                    : null
                  }
                  {
                    userHasPermissions(PERMISSIONS.TOPIC_DELETE)
                    ? <TableCell align="right" sx={{ maxWidth: 7 }}>
                      <Tooltip title='Удалить тему'>
                        <span>
                          <IconButton
                            color='error'
                            onClick={() => {
                              setSelectedTopic(topic.id);
                              setShowDeletePopup(true);
                            }}
                          >
                            <DeleteOutlinedIcon />
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
                labelRowsPerPage={"Тем на странице:"}
                labelDisplayedRows={({ from, to }) => {
                  const toCalc = topicsCount === rowsPerPage
                    ? to
                    : !!topicsCount
                      ? from + topicsCount - 1
                      : '?';
                  return `${from} - ${toCalc}`;
                }}
                slotProps={{
                  actions: {
                    nextButton: {
                      disabled: !topics?.data?.links.next
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

const EditTopic: FC<EditTopicProps> = props => {
  const [ title, setTitle ] = useState(props.title);
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
        <Typography variant='h6' gutterBottom>Название темы</Typography>
        <TextField value={title} variant='outlined' placeholder='Название' onChange={e => setTitle(e.target.value)} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant='outlined' color='primary' onClick={onCancel}>Отменить</Button>
        <Button variant='outlined' disabled={!title} color='success' onClick={() => onSave(title || '')}>Сохранить</Button>
      </Box>
    </Box>
  );
}

export const Topics: FC = () => {
  const { userHasPermissions } = useAbac();
  const [ newTopicPopupVisible, setNewTopicPopupVisible ] = useState(false);
  const [ createTopic ] = useCreateTopicMutation();
  const [ loading, setLoading ] = useState(false);

  return (
    <DashboardLayout>
      <Loading visible={loading} />
      <PopupWindow visible={newTopicPopupVisible}>
        <NewItem
          onSave={title => {
            setNewTopicPopupVisible(false);
            setLoading(true);
            createTopic(title).then(() => {
              setLoading(false);
            });
          }}
          onCancel={() => setNewTopicPopupVisible(false)}
          title='Название темы'
          placeholder='Название'
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
          Управление темами
        </Typography>
        {
          userHasPermissions(PERMISSIONS.TOPIC_CREATE)
          ? <Tooltip title='Добавить новую тему'>
            <span>
              <IconButton
                color='primary'
                onClick={() => setNewTopicPopupVisible(true)}
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
        <TopicsTable />
      </Box>
    </DashboardLayout>
  )
};
