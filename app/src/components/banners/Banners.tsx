import { FC, useMemo, useState } from 'react';
import { DashboardLayout } from '../layout/DashboardLayout';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
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
  Skeleton,
  TableFooter,
  TablePagination,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Theme,
  useMediaQuery,
  Stack,
} from '@mui/material';
import { PopupWindow } from '../features/PopupWindow';
import { LoadingWrap } from '../features/LoadingWrap';
import { ConfirmationWindow } from '../features/ConfirmationWindow';
import { useBannerPlacesQuery } from '../../services/DictionaryService';
import { PATHS } from '../../constants/path';
import { Link } from 'react-router-dom';
import { NewItem } from '../features/NewItem';
import { useAbac } from 'react-abac';
import { PERMISSIONS } from '../../constants/permission';


export const bannerStatuses = [
  {
    id: 0,
    title: 'Выключен'
  },
  {
    id: 1,
    title: 'Включен'
  }
];

interface BannerSkeletonProps {
  id: number,
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

const BannersTable: FC = () => {
  const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const { userHasPermissions } = useAbac();
  const [ page, setPage ] = useState(0);
  const [ rowsPerPage, setRowsPerPage ] = useState(localStorage.getItem('bannersPerPage') ? +localStorage.getItem('bannersPerPage')! :  10);
  const [ selectedBanner, setSelectedBanner ] = useState<number | null>(null);
  const [ showDeletePopup, setShowDeletePopup ] = useState(false);
  const { data: banners, isLoading: isPostsLoading, isFetching: isPostsFetching } = useGetBannersQuery({ page: page + 1, perPage: rowsPerPage });
  const [ deleteBanner ] = useDeleteBannerMutation();
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
    return bannerStatuses.filter(status => status.id === status_id)[0]?.title || '';
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(+event.target.value);
    localStorage.setItem('bannersPerPage', event.target.value);
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
          submitColor='error'
          submitTitle='Удалить'
          rejectTitle='Отмена'
        />
      </PopupWindow>
      <TableContainer component={Paper}  sx={{ width: '100%', h: '100%' }}>
        <Table aria-label='a dense table'>
          <TableHead>
            <TableRow component='th' scope='row'>
              <TableCell>ID</TableCell>
              <TableCell>Имя</TableCell>
              <TableCell sx={{ display: { md: 'table-cell', xs: 'none' } }}>Положение</TableCell>
              <TableCell sx={{ display: { sm: 'table-cell', xs: 'none' } }}>Статус</TableCell>
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
                  <TableCell sx={{ display: { md: 'table-cell', xs: 'none' } }}>
                    <LoadingWrap
                      isLoading={isPlacesLoading}
                      loader={<Skeleton variant='text' />}
                    >
                      {banner.type_id !== null ? getPlaceTitle(banner.type_id) : ''}
                    </LoadingWrap>
                  </TableCell>
                  <TableCell sx={{ display: { sm: 'table-cell', xs: 'none' } }}>
                    {banner.status_id !== null ? getStatusTitle(banner.status_id) : ''}
                  </TableCell>
                  <TableCell align='right' sx={{ py: 0 }}>
                    <Stack direction='row' spacing={3} justifyContent='flex-end'>
                      <Link to={`${PATHS.BANNERS}/${banner.id}`} style={{ textDecoration: 'none' }}>
                        <Tooltip
                          title={
                            userHasPermissions(PERMISSIONS.BANNER_EDIT)
                            ? 'Редактировать баннер'
                            : 'Открыть баннер'
                          }
                        >
                          <span>
                            <IconButton color='primary'>
                              {
                                userHasPermissions(PERMISSIONS.BANNER_EDIT)
                                ? <CreateOutlinedIcon />
                                : <VisibilityOutlinedIcon />
                              }
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Link>
                      {
                        userHasPermissions(PERMISSIONS.BANNER_DELETE)
                        ? <Tooltip title='Удалить баннер'>
                          <span>
                            <IconButton
                              onClick={() => {
                                setSelectedBanner(banner.id);
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
                labelRowsPerPage={smDown ? '' : 'Баннеров на странице:'}
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

export const Banners: FC = () => {
  const { userHasPermissions } = useAbac();
  const [ newBannerPopupVisible, setNewBannerPopupVisible ] = useState(false);
  const [ createBanner ] = useCreateBannerMutation();

  return (
    <DashboardLayout>
      <PopupWindow visible={newBannerPopupVisible}>
        <NewItem
          onSave={title => {
            createBanner(title);
            setNewBannerPopupVisible(false);
          }}
          onCancel={() => setNewBannerPopupVisible(false)}
          title='Введите наименование баннера'
          placeholder='Наименование'
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
        {
          userHasPermissions(PERMISSIONS.BANNER_CREATE)
          ? <Tooltip title='Добавить новый баннер'>
            <span>
              <IconButton
                color='primary'
                onClick={() => setNewBannerPopupVisible(true)}
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
        <BannersTable />
      </Box>
    </DashboardLayout>
  )
};
