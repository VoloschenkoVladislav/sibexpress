import { FC, useMemo, useRef, useState } from 'react';
import { DashboardLayout } from '../layout/DashboardLayout';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import {
  useCreateBannerMutation,
  useDeleteBannerMutation,
  useGetBannersQuery,
} from '../../services/BannerService';
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
} from '@mui/material';
import { PopupWindow } from '../features/PopupWindow';
import { LoadingWrap } from '../features/LoadingWrap';
import { ConfirmationWindow } from '../features/ConfirmationWindow';
import { useBannerPlacesQuery, useStatusesQuery } from '../../services/DictionaryService';
import { PATHS } from '../../constants/path';
import { Link } from 'react-router-dom';


interface BannerSkeletonProps {
  id: number,
}

interface NewBannerProps {
  onSave: (title: string) => void,
  onCancel: () => void,
}

const BannerSkeleton: FC<BannerSkeletonProps> = props => {
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

const BannersTable: FC = () => {
  const [ page, setPage ] = useState(0);
  const [ rowsPerPage, setRowsPerPage ] = useState(10);
  const [ selectedBanner, setSelectedBanner ] = useState<number | null>(null);
  const [ showDeletePopup, setShowDeletePopup ] = useState(false);
  const { data: banners, isLoading: isPostsLoading, isFetching: isPostsFetching } = useGetBannersQuery({ page: page + 1, perPage: rowsPerPage });
  const [ deleteBanner ] = useDeleteBannerMutation();
  const { data: statuses = [], isLoading: isStatusesLoading } = useStatusesQuery();
  const { data: places = [], isLoading: isPlacesLoading } = useBannerPlacesQuery();

  const bannersCount = useMemo(() => banners?.data?.items?.length, [banners]);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };
  
  const getPlaceTitle = (place_id: number) => {
    return places.filter(place => place.id === place_id)[0]?.title || '';
  };

  const getStatusTitle = (status_id: number) => {
    return statuses.filter(status => status.id === status_id)[0]?.title || '';
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
            if (selectedBanner) deleteBanner(selectedBanner);
            setShowDeletePopup(false);
          }}
          onReject={() => setShowDeletePopup(false)}
          message={`Вы уверены, что хотите удалить тему №${selectedBanner}?`}
        />
      </PopupWindow>
      <TableContainer component={Paper}  sx={{ minWidth: 650, h: '100%' }}>
        <Table size='small' aria-label='a dense table'>
          <TableHead>
            <TableRow component='th' scope='row'>
              <TableCell>ID</TableCell>
              <TableCell>Имя</TableCell>
              <TableCell>Положение</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell align='right'></TableCell>
              <TableCell align='right'></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <LoadingWrap
              isLoading={isPostsLoading || isPostsFetching}
              loader={Array.from(Array(rowsPerPage).keys()).map(id => (
                <BannerSkeleton id={id} key={id} />
              ))}
            >
              {banners?.data?.items?.map(banner => (
                <TableRow
                  key={banner.id}
                >
                  <TableCell>{banner.id}</TableCell>
                  <TableCell>{banner.title}</TableCell>
                  <TableCell>
                    <LoadingWrap
                      isLoading={isPlacesLoading}
                      loader={<Skeleton variant="text" />}
                    >
                      {banner.place_id !== null ? getPlaceTitle(banner.place_id) : ''}
                    </LoadingWrap>
                  </TableCell>
                  <TableCell>
                    <LoadingWrap
                      isLoading={isStatusesLoading}
                      loader={<Skeleton variant="text" />}
                    >
                      {banner.status_id !== null ? getStatusTitle(banner.status_id) : ''}
                    </LoadingWrap>
                  </TableCell>
                  <TableCell align='right' sx={{ maxWidth: 7 }}>
                    <Link to={`${PATHS.BANNERS}/${banner.id}`} style={{ textDecoration: 'none' }}>
                      <Button>
                        <CreateOutlinedIcon />
                      </Button>
                    </Link>
                  </TableCell>
                  <TableCell align='right' sx={{ maxWidth: 7 }}>
                    <Button onClick={() => {
                      setSelectedBanner(banner.id);
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
                labelRowsPerPage={'Баннеров на странице:'}
                labelDisplayedRows={({ from, to }) => {
                  const toCalc = bannersCount === rowsPerPage
                    ? to
                    : !!bannersCount
                      ? from + bannersCount - 1
                      : '?';
                  return `${from} - ${toCalc}`;
                }}
                slotProps={{
                  actions: {
                    nextButton: {
                      disabled: !banners?.data?.links.next
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

const NewBanner: FC<NewBannerProps> = props => {
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
        <Typography variant='h6' gutterBottom>Введите наименование баннера</Typography>
        <TextField variant='outlined' placeholder='Наименование' onChange={e => { title.current = e.target.value }} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant='outlined' color='primary' onClick={onCancel}>Отменить</Button>
        <Button variant='outlined' color='success' onClick={() => onSave(title.current)}>Добавить</Button>
      </Box>
    </Box>
  );
}

export const Banners: FC = () => {
  const [ newBannerPopupVisible, setNewBannerPopupVisible ] = useState(false);
  const [ createBanner ] = useCreateBannerMutation();

  return (
    <DashboardLayout>
      <PopupWindow visible={newBannerPopupVisible}>
        <NewBanner
          onSave={title => {
            createBanner(title);
            setNewBannerPopupVisible(false);
          }}
          onCancel={() => setNewBannerPopupVisible(false)}
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
          Управление баннерами
        </Typography>
        <Button
          variant='outlined'
          onClick={() => setNewBannerPopupVisible(true)}
          sx={{
            my: 1
          }}
        >
          Добавить баннер
        </Button>
      </Box>
      <Box sx={{ height: '100%', mt: 2 }}>
        <BannersTable />
      </Box>
    </DashboardLayout>
  )
};
