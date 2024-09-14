import { FC, useMemo } from "react";
import {
  Box,
  InputLabel,
  TextField,
  Autocomplete,
  CircularProgress,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormControl,
} from "@mui/material";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import { ITopic, useStatusesQuery, useTopicsQuery, useTypesQuery } from "../../services/DictionaryService";
import { Dayjs } from 'dayjs';
import { LoadingWrap } from "../features/LoadingWrap";
import { DATE_FORMAT_OUTPUT } from "../../constants/date";
import { useAbac } from "react-abac";
import { PERMISSIONS } from "../../constants/permission";
import { ResetInput } from '../features/ResetInput';


interface SidePanelProps {
  selectedTopicIds: number[],
  selectedStatusId: number | null,
  selectedTypeId: number | null,
  publishedAt: Dayjs | null,
  createdAt: Dayjs | null,
  updatedAt: Dayjs | null,
  onTopicsChange?: (event: any, newValue: ITopic[]) => void,
  onTypeChange?: (event: SelectChangeEvent) => void,
  onStatusChange?: (event: SelectChangeEvent) => void,
  onPublishedAtChange?: (newValue: Dayjs | null) => void,
  onTopicsReset?: () => void,
  onTypeReset?: () => void,
  onStatusReset?: () => void,
  onPublishedAtReset?: () => void,
  topicsResetDisabled: boolean,
  typeResetDisabled: boolean,
  statusResetDisabled: boolean,
  publishedAtResetDisabled: boolean,
}

export const SidePanel: FC<SidePanelProps> = props => {
  const { userHasPermissions } = useAbac();
  const {
    selectedTopicIds,
    selectedStatusId,
    selectedTypeId,
    publishedAt,
    createdAt,
    updatedAt,
    onTopicsChange,
    onTypeChange,
    onStatusChange,
    onPublishedAtChange,
    onTopicsReset,
    onTypeReset,
    onStatusReset,
    onPublishedAtReset,
    topicsResetDisabled,
    typeResetDisabled,
    statusResetDisabled,
    publishedAtResetDisabled,
  } = props;
  const { data: topics = [], isLoading: isTopicsLoading } = useTopicsQuery();
  const { data: statuses = [], isLoading: isStatusesLoading } = useStatusesQuery();
  const { data: types = [], isLoading: isTypesLoading } = useTypesQuery();

  const selectedTopics = useMemo(
    () => topics.filter(topic => selectedTopicIds.indexOf(topic.id) !== -1),
    [selectedTopicIds, topics]
  );

  return (
    <Box sx={{ p: 1, height: '100%' }}>
      <LoadingWrap
        isLoading={isStatusesLoading}
        loader={<CircularProgress />}
      >
        <ResetInput
          disabled={statusResetDisabled}
          onReset={onStatusReset}
          visible={userHasPermissions(PERMISSIONS.POST_EDIT)}
        >
          <FormControl sx={{ width: '100%' }}>
            <InputLabel id="post-edit-status-select-standard-label">Статус</InputLabel>
            <Select
              MenuProps={{
                disableScrollLock: true,
              }}
              value={selectedStatusId?.toString()}
              onChange={onStatusChange}
              label="Статус"
              labelId="post-edit-status-select-standard-label"
              disabled={!userHasPermissions(PERMISSIONS.POST_EDIT)}
            >
              {statuses!.map(status => (
                <MenuItem key={status.id} value={status.id.toString()}>{status.title}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </ResetInput>
      </LoadingWrap>
      <LoadingWrap
        isLoading={isTypesLoading}
        loader={<CircularProgress />}
      >
        <ResetInput
          disabled={typeResetDisabled}
          onReset={onTypeReset}
          visible={userHasPermissions(PERMISSIONS.POST_EDIT)}
        >
          <FormControl sx={{ width: '100%' }}>
            <InputLabel id="post-edit-type-select-standard-label">Тип публикации</InputLabel>
            <Select
              MenuProps={{
                disableScrollLock: true,
              }}
              value={selectedTypeId?.toString() || ''}
              onChange={onTypeChange}
              label="Тип публикации"
              labelId="post-edit-type-select-standard-label"
              disabled={!userHasPermissions(PERMISSIONS.POST_EDIT)}
            >
              {types!.map(type => (
                <MenuItem key={type.id} value={type.id.toString()}>{type.title}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </ResetInput>
      </LoadingWrap>
      <LoadingWrap
        isLoading={isTopicsLoading}
        loader={<CircularProgress />}
      >
        <ResetInput
          disabled={topicsResetDisabled}
          onReset={onTopicsReset}
          visible={userHasPermissions(PERMISSIONS.POST_EDIT)}
        >
          <Autocomplete
            multiple
            options={topics as ITopic[]}
            getOptionLabel={(option) => option.title}
            filterSelectedOptions
            value={selectedTopics}
            onChange={onTopicsChange}
            fullWidth
            disabled={!userHasPermissions(PERMISSIONS.POST_EDIT)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Темы"
                placeholder="Начните вводить название темы..."
              />
            )}
          />
        </ResetInput>
      </LoadingWrap>
      <ResetInput
        disabled={publishedAtResetDisabled}
        onReset={onPublishedAtReset}
        visible={userHasPermissions(PERMISSIONS.POST_EDIT)}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}  adapterLocale="ru">
          <DateTimePicker
            views={['year', 'month', 'day', 'hours', 'minutes']}
            viewRenderers={{
              hours: renderTimeViewClock,
              minutes: renderTimeViewClock,
            }}
            value={publishedAt}
            disabled={!userHasPermissions(PERMISSIONS.POST_EDIT)}
            onChange={onPublishedAtChange}
            label='Дата публикации'
            format={DATE_FORMAT_OUTPUT}
            sx={{ width: '100%' }}
          />
        </LocalizationProvider>
      </ResetInput>
      <Box sx={{ mb: 2, mt: 1 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}  adapterLocale="ru">
          <DateTimeField
            disabled
            sx={{ width: '100%' }}
            value={createdAt}
            label='Дата создания'
            format={DATE_FORMAT_OUTPUT}
            fullWidth
          />
        </LocalizationProvider>
      </Box>
      <Box sx={{ mb: 2, mt: 1 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}  adapterLocale="ru">
          <DateTimeField
            disabled
            sx={{ width: '100%' }}
            value={updatedAt}
            label='Дата обновления'
            format={DATE_FORMAT_OUTPUT}
            fullWidth
          />
        </LocalizationProvider>
      </Box>
    </Box>
  );
};
