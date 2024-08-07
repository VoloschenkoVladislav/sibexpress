import { FC, useEffect, useMemo } from "react";
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
  IconButton
} from "@mui/material";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import { TopicInterface, useStatusesQuery, useTopicsQuery, useTypesQuery } from "../../services/DictionaryService";
import { Dayjs } from 'dayjs';
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';


interface SidePanelProps {
  selectedTopicIds: number[],
  selectedStatusId: number | null,
  selectedTypeId: number | null,
  publishedAt: Dayjs | null,
  createdAt: Dayjs | null,
  updatedAt: Dayjs | null,
  onTopicsChange?: (event: any, newValue: TopicInterface[]) => void,
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

const DATE_FORMAT_OUTPUT = 'DD/MM/YYYY HH:mm:ss';

export const SidePanel: FC<SidePanelProps> = props => {
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

  useEffect(() => {}, [statuses, types]);

  const selectedTopics = useMemo(
    () => topics!.filter(topic => selectedTopicIds.indexOf(topic.id) !== -1),
    [selectedTopicIds, topics]
  );

  return (<Box sx={{ p: 1, height: '100%' }}>
    <Box sx={{ m: 1, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
      {
        isStatusesLoading
          ? <CircularProgress />
          : <>
            <FormControl sx={{ width: '100%' }}>
              <InputLabel id="post-edit-status-select-standard-label">Статус</InputLabel>
              <Select
                value={selectedStatusId?.toString()}
                onChange={onStatusChange}
                label="Статус"
                labelId="post-edit-status-select-standard-label"
              >
                {statuses!.map(status => (
                  <MenuItem key={status.id} value={status.id}>{status.title}</MenuItem>
                ))}
              </Select>
            </FormControl> 
            <IconButton
              aria-label='Отменить'
              onClick={onStatusReset}
              disabled={statusResetDisabled}
            >
              <ReplayOutlinedIcon />
            </IconButton>
          </>
      }
    </Box>
    <Box sx={{ m: 1, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
      {
        isTypesLoading
          ? <CircularProgress />
          : <>
            <FormControl sx={{ width: '100%' }}>
              <InputLabel id="post-edit-type-select-standard-label">Тип публикации</InputLabel>
              <Select
                value={selectedTypeId?.toString()}
                onChange={onTypeChange}
                label="Тип публикации"
                labelId="post-edit-type-select-standard-label"
              >
                {types!.map(type => (
                  <MenuItem key={type.id} value={type.id}>{type.title}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <IconButton
              aria-label='Отменить'
              onClick={onTypeReset}
              disabled={typeResetDisabled}
            >
              <ReplayOutlinedIcon />
            </IconButton>
          </>
      }
    </Box>
    <Box sx={{ m: 1, display: 'flex', justifyContent: 'space-between' }}>
      {
        isTopicsLoading
          ? <CircularProgress />
          : <>
            <Autocomplete
              multiple
              options={topics as TopicInterface[]}
              getOptionLabel={(option) => option.title}
              filterSelectedOptions
              value={selectedTopics}
              onChange={onTopicsChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Темы"
                  placeholder="Начните вводить название темы..."
                />
              )}
            />
            <IconButton
              aria-label='Отменить'
              onClick={onTopicsReset}
              disabled={topicsResetDisabled}
            >
              <ReplayOutlinedIcon />
            </IconButton>
          </>
      }
    </Box>
    <Box sx={{ m: 1, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}  adapterLocale="ru">
        <DemoContainer components={['DatePicker']} >
          <DateTimePicker
            views={['year', 'month', 'day', 'hours', 'minutes']}
            viewRenderers={{
              hours: renderTimeViewClock,
              minutes: renderTimeViewClock,
            }}
            disablePast
            value={publishedAt}
            onChange={onPublishedAtChange}
            label='Дата публикации'
            format={DATE_FORMAT_OUTPUT}
          />
        </DemoContainer>
      </LocalizationProvider>
      <IconButton
        aria-label='Отменить'
        onClick={onPublishedAtReset}
        disabled={publishedAtResetDisabled}
      >
        <ReplayOutlinedIcon />
      </IconButton>
    </Box>
    <Box sx={{ m: 1, mb: 2 }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}  adapterLocale="ru">
        <DemoContainer components={['DateField']} >
          <DateTimeField
            disabled
            sx={{ width: '100%' }}
            value={createdAt}
            label='Дата создания'
            format={DATE_FORMAT_OUTPUT}
          />
        </DemoContainer>
      </LocalizationProvider>
    </Box>
    <Box sx={{ m: 1, mb: 2 }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}  adapterLocale="ru">
        <DemoContainer components={['DateField']} >
          <DateTimeField
            disabled
            sx={{ width: '100%' }}
            value={updatedAt}
            label='Дата обновления'
            format={DATE_FORMAT_OUTPUT}
          />
        </DemoContainer>
      </LocalizationProvider>
    </Box>
  </Box>);
};
