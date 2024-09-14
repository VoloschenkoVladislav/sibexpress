import { FC, useEffect, useMemo, useState } from 'react';
import { useBannerPlacesQuery } from '../../services/DictionaryService';
import { Box, CircularProgress, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { LoadingWrap } from '../features/LoadingWrap';
import { useDeleteBannerImageMutation, useEditBannerMutation, useGetBannerQuery, useUploadBannerImageMutation } from '../../services/BannerService';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DATE_FORMAT_INPUT, DATE_FORMAT_OUTPUT } from '../../constants/date';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { parseDate } from '../../utils/dateParser';
import { Loading } from '../features/Loading';
import { DashboardLayout } from '../layout/DashboardLayout';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux/redux';
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { DropImage } from '../features/DropImage';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import { updateBanner } from '../../store/reducers/BannerSlice';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { setSuccess } from '../../store/reducers/AppSlice';
import { bannerStatuses } from './Banners';
import { useAbac } from "react-abac";
import { PERMISSIONS } from "../../constants/permission";
import { PopupWindow } from '../features/PopupWindow';
import { ConfirmationWindow } from '../features/ConfirmationWindow';
import { ResetInput } from '../features/ResetInput';


export const BannerEdit: FC = () => {
  const { userHasPermissions } = useAbac();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { isLoading: isBannerLoading } = useGetBannerQuery(+id!);
  const { data: places = [], isLoading: isPlacesLoading } = useBannerPlacesQuery();
  const [ editBanner ] = useEditBannerMutation();
  const [ uploadImage ] = useUploadBannerImageMutation();
  const [ deleteImage ] = useDeleteBannerImageMutation();
  const [ isSending, setIsSending ] = useState(false);
  const [ showImageDeletePopup, setShowImageDeletePopup ] = useState(false);
  const [ bannerTitle, setBannerTitle ] = useState('');
  const [ bannerLink, setBannerLink ] = useState('');
  const [ selectedStatusId, setSelectedStatusId ] = useState<number | null>(null);
  const [ selectedPlaceId, setSelectedPlaceId ] = useState<number | null>(null);
  const [ startedAt, setStartedAt ] = useState<Dayjs | null>(null);
  const [ finishedAt, setFinishedAt ] = useState<Dayjs | null>(null);
  const {
    title,
    place_id,
    status_id,
    link,
    filename,
    created_at,
    updated_at,
    finished_at,
    started_at,
  } = useAppSelector(state => state.bannersReducer);
  

  const resetAll = () => {
    setSelectedStatusId(status_id);
    setSelectedPlaceId(place_id);
    setStartedAt(parseDate(started_at) ? dayjs(parseDate(started_at)) : null);
    setFinishedAt(parseDate(finished_at) ? dayjs(parseDate(finished_at)) : null);
    setBannerTitle(title);
    setBannerLink(link || '');
  };

  useEffect(() => {
    resetAll();
    // eslint-disable-next-line
  }, [
    status_id,
    place_id,
    started_at,
    finished_at,
    title,
    link,
  ]);

  const handleSave = () => {
    setIsSending(true);
    editBanner({
      id: +id!,
      data: {
        place_id: selectedPlaceId,
        status_id: selectedStatusId,
        title: bannerTitle,
        link: bannerLink,
        started_at:	startedAt ? startedAt.format(DATE_FORMAT_INPUT) : null,
        finished_at: finishedAt ? finishedAt.format(DATE_FORMAT_INPUT) : null,
      }
    }).then(response => {
      setIsSending(false);
      if (!response.error) {
        dispatch(updateBanner({
          place_id: selectedPlaceId,
          status_id: selectedStatusId,
          title: bannerTitle,
          link: bannerLink,
          started_at:	startedAt ? startedAt.format(DATE_FORMAT_INPUT) : null,
          finished_at: finishedAt ? finishedAt.format(DATE_FORMAT_INPUT) : null,
        }));
        dispatch(setSuccess('Баннер сохранён'));
      }
    });
  };

  const hasChanged = useMemo(() => {
    return (
      selectedPlaceId !== place_id
      || selectedStatusId !== status_id
      || bannerTitle !== title
      || bannerLink !== (link || '')
      || (startedAt ? startedAt.format(DATE_FORMAT_INPUT) : null) !== started_at
      || (finishedAt ? finishedAt.format(DATE_FORMAT_INPUT) : null) !== finished_at
    )}, [
      selectedPlaceId,
      selectedStatusId,
      bannerTitle,
      bannerLink,
      finishedAt,
      startedAt,
      place_id,
      status_id,
      title,
      link,
      started_at,
      finished_at,
  ]);

  return (
    <DashboardLayout>
      <PopupWindow visible={showImageDeletePopup}>
        <ConfirmationWindow
          onSubmit={() => {
              setShowImageDeletePopup(false);
              setIsSending(true);
              deleteImage(+id!).then(response => {
                setIsSending(false);
                if (!response.error) {
                  dispatch(setSuccess('Изображение удалено'));
                }
              });
          }}
          onReject={() => setShowImageDeletePopup(false)}
          message={`Вы уверены, что хотите удалить изображение баннера?`}
          submitColor='error'
          submitTitle='Удалить'
          rejectTitle='Отмена'
        />
      </PopupWindow>
      <Loading visible={isSending} />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          alignItems: 'center',
        }}
      >
        {
          userHasPermissions(PERMISSIONS.BANNER_EDIT)
          ? <>
            <Typography variant='h4' gutterBottom>Редактирование баннера</Typography>
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
          </>
          : <Typography variant='h4' gutterBottom>Просмотр баннера</Typography>
        }
      </Box>
      <LoadingWrap
        isLoading={isBannerLoading}
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant='h6' gutterBottom>Наименование</Typography>
              {
                userHasPermissions(PERMISSIONS.BANNER_EDIT)
                ? <IconButton onClick={() => setBannerTitle(title)} disabled={bannerTitle === title} color='primary'>
                  <ReplayOutlinedIcon />
                </IconButton>
                : null
              }
            </Box>
            <Paper sx={{ p: 2, mb: 3 }}>
              <TextField
                value={bannerTitle}
                variant='outlined'
                placeholder='Наименование'
                onChange={e => setBannerTitle(e.target.value)}
                sx={{ width: '100%' }}
                disabled={!userHasPermissions(PERMISSIONS.BANNER_EDIT)}
              />
            </Paper>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant='h6' gutterBottom>Ссылка</Typography>
              {
                userHasPermissions(PERMISSIONS.BANNER_EDIT)
                ? <IconButton onClick={() => setBannerLink(link || '')} disabled={bannerLink === (link || '')} color='primary'>
                  <ReplayOutlinedIcon />
                </IconButton>
                : null
              }
            </Box>
            <Paper sx={{ p: 2, mb: 3 }}>
              <TextField
                value={bannerLink}
                variant='outlined'
                placeholder='Наименование'
                onChange={e => setBannerLink(e.target.value)}
                sx={{ width: '100%' }}
                disabled={!userHasPermissions(PERMISSIONS.BANNER_EDIT)}
              />
            </Paper>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant='h6' gutterBottom>Изображение баннера</Typography>
              {
                userHasPermissions(PERMISSIONS.BANNER_EDIT)
                ? <Tooltip title='Удалить изображение'>
                  <span>
                    <IconButton onClick={() => setShowImageDeletePopup(true)} color='error' disabled={!filename}>
                      <DeleteOutlinedIcon />
                    </IconButton>
                  </span>
                </Tooltip>
                : null
              }
            </Box>
            <Paper sx={{ p: 2, mb: 3 }}>
              <DropImage
                field='image'
                disabled={!userHasPermissions(PERMISSIONS.BANNER_EDIT)}
                onDrop={file => {
                  setIsSending(true);
                  uploadImage({ id: +id!, bannerImage: file }).then(response => {
                    setIsSending(false);
                    if (!response.error) {
                      dispatch(setSuccess('Изображение загружено'));
                    }
                  });
                }}
                path={filename}
              />
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
              <ResetInput
                disabled={selectedStatusId === status_id}
                onReset={() => setSelectedStatusId(status_id)}
                visible={userHasPermissions(PERMISSIONS.BANNER_EDIT)}
              >
                <FormControl sx={{ width: '100%' }}>
                  <InputLabel id='banner-edit-status-select-standard-label'>Статус</InputLabel>
                  <Select
                    value={selectedStatusId?.toString() || ''}
                    fullWidth
                    disabled={!userHasPermissions(PERMISSIONS.BANNER_EDIT)}
                    onChange={e => setSelectedStatusId(e.target.value ? +e.target.value : null)}
                    label='Статус'
                    labelId='banner-edit-status-select-standard-label'
                    sx={{ mr: 1 }}
                  >
                    {bannerStatuses.map(status => (
                      <MenuItem key={status.id} value={status.id.toString()}>{status.title}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </ResetInput>
              <ResetInput
                disabled={selectedPlaceId === place_id}
                onReset={() => setSelectedPlaceId(place_id)}
                visible={userHasPermissions(PERMISSIONS.BANNER_EDIT)}
              >
                <LoadingWrap
                  isLoading={isPlacesLoading}
                  loader={<CircularProgress />}
                >
                  <FormControl sx={{ width: '100%' }}>
                    <InputLabel id='banner-edit-place-select-standard-label'>Положение</InputLabel>
                    <Select
                      value={selectedPlaceId?.toString() || ''}
                      fullWidth
                      disabled={!userHasPermissions(PERMISSIONS.BANNER_EDIT)}
                      onChange={e => setSelectedPlaceId(e.target.value ? +e.target.value : null)}
                      label='Положение'
                      labelId='banner-edit-place-select-standard-label'
                      sx={{ mr: 1 }}
                    >
                      {places!.map(place => (
                        <MenuItem key={place.id} value={place.id.toString()}>{place.title}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </LoadingWrap>
              </ResetInput>
              <ResetInput
                disabled={(startedAt ? startedAt.format(DATE_FORMAT_INPUT) : null) === started_at}
                onReset={() => setStartedAt(parseDate(started_at) ? dayjs(parseDate(started_at)) : null)}
                visible={userHasPermissions(PERMISSIONS.BANNER_EDIT)}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}  adapterLocale='ru'>
                  <DateTimePicker
                    views={['year', 'month', 'day', 'hours', 'minutes']}
                    viewRenderers={{
                      hours: renderTimeViewClock,
                      minutes: renderTimeViewClock,
                    }}
                    disabled={!userHasPermissions(PERMISSIONS.BANNER_EDIT)}
                    value={startedAt}
                    onChange={setStartedAt}
                    label='Дата начала показа'
                    format={DATE_FORMAT_OUTPUT}
                    sx={{ width: '100%' }}
                  />
                </LocalizationProvider>
              </ResetInput>
              <ResetInput
                disabled={(finishedAt ? finishedAt.format(DATE_FORMAT_INPUT) : null) === finished_at}
                onReset={() => setFinishedAt(parseDate(finished_at) ? dayjs(parseDate(finished_at)) : null)}
                visible={userHasPermissions(PERMISSIONS.BANNER_EDIT)}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}  adapterLocale='ru'>
                  <DateTimePicker
                    views={['year', 'month', 'day', 'hours', 'minutes']}
                    viewRenderers={{
                      hours: renderTimeViewClock,
                      minutes: renderTimeViewClock,
                    }}
                    disabled={!userHasPermissions(PERMISSIONS.BANNER_EDIT)}
                    value={finishedAt}
                    onChange={setFinishedAt}
                    label='Дата окончания показа'
                    format={DATE_FORMAT_OUTPUT}
                    sx={{ width: '100%' }}
                  />
                </LocalizationProvider>
              </ResetInput>
            </Paper>
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