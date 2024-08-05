import {
  Box,
  Button,
  Stack,
  InputLabel,
  TextField,
  Autocomplete,
  CircularProgress,
  Select,
  MenuItem,
  SelectChangeEvent,
  Paper,
  FormControl,
  IconButton
} from "@mui/material";
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import dayjs, { Dayjs } from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import 'dayjs/locale/ru';
import { FC, useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "../layout/DashboardLayout";
import { SEditor } from "../editor/SunEditor";
import { TopicInterface, useStatusesQuery, useTopicsQuery, useTypesQuery } from "../../services/DictionaryService";
import { useParams } from "react-router-dom";
import { usePostQuery } from "../../services/PostService";
import { useAppSelector } from "../../hooks/redux/redux";
import { parseDate } from "../../utils/dateParser";


const DATE_FORMAT = 'DD/MM/YYYY HH:mm:ss';

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

const SidePanel: FC<SidePanelProps> = props => {
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

  return (<Paper sx={{ p: 1, height: '100%' }}>
    <Box sx={{ m: 1, mb: 2 }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}  adapterLocale="ru">
        <DemoContainer components={['DateField']} >
          <DateTimeField
            readOnly
            sx={{ width: '100%' }}
            value={createdAt}
            label='Дата создания'
            format={DATE_FORMAT}
          />
        </DemoContainer>
      </LocalizationProvider>
    </Box>
    <Box sx={{ m: 1, mb: 2 }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}  adapterLocale="ru">
        <DemoContainer components={['DateField']} >
          <DateTimeField
            readOnly
            sx={{ width: '100%' }}
            value={updatedAt}
            label='Дата обновления'
            format={DATE_FORMAT}
          />
        </DemoContainer>
      </LocalizationProvider>
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
            format={DATE_FORMAT}
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
                  <MenuItem value={status.id}>{status.title}</MenuItem>
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
                  <MenuItem value={type.id}>{type.title}</MenuItem>
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
  </Paper>);
};

export const PostEdit: FC = () => {
  const { id } = useParams();
  const { content } = useAppSelector(state => state.postsReducer);
  const { isLoading: isPostLoading } = usePostQuery(+id!);
  const { tags_id, status_id, type_id, published_at, updated_at, created_at } = useAppSelector(state => state.postsReducer);
  const [ selectedTopicIds, setSelectedTopicIds ] = useState<number[]>([]);
  const [ selectedStatusId, setSelectedStatusId ] = useState<number | null>(null);
  const [ selectedTypeId, setSelectedTypeId ] = useState<number | null>(null);
  const [ publishedAt, setPublishedAt ] = useState<Date | null>(null);

  useEffect(() => {
    setSelectedTopicIds(tags_id);
    setSelectedStatusId(status_id);
    setSelectedTypeId(type_id);
    setPublishedAt(parseDate(published_at));
  }, [
    tags_id,
    status_id,
    type_id,
    published_at,
  ]);

  const handleChangeStatus = (event: SelectChangeEvent) => {
    setSelectedStatusId(+event.target.value);
  };

  const handleChangeType = (event: SelectChangeEvent) => {
    setSelectedTypeId(+event.target.value);
  };

  const handleChangeTopics = (event: any, newValue: TopicInterface[]) => {
    setSelectedTopicIds(newValue.map(v => v.id));
  };

  const resetAll = () => {
    setSelectedTopicIds(tags_id);
    setSelectedTypeId(type_id);
    setSelectedStatusId(status_id);
    setPublishedAt(parseDate(published_at));
  }

  const hasChanged = useMemo(() => {
    return (
      selectedTopicIds !== tags_id
      || selectedTypeId !== type_id
      || selectedStatusId !== status_id
      || publishedAt !== published_at
    );
  }, [
    selectedTopicIds,
    selectedTypeId,
    selectedStatusId,
    publishedAt,
    tags_id,
    type_id,
    status_id,
    published_at
  ]);

  return (
    <DashboardLayout>
      {
        isPostLoading
        ? <CircularProgress />
        : <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'start',
          height: '100%',
        }}>
          <Box sx={{ width: '75%', p: 3 }}>
            <SEditor editorContent={content} onChange={() => {}} />
          </Box>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '25%',
            p: 3,
            height: '100%',
          }}>
            <SidePanel
              selectedTopicIds={selectedTopicIds}
              selectedStatusId={selectedStatusId}
              selectedTypeId={selectedTypeId}
              publishedAt={dayjs(publishedAt)}
              createdAt={dayjs(parseDate(created_at))}
              updatedAt={dayjs(parseDate(updated_at))}
              onTopicsChange={handleChangeTopics}
              onTypeChange={handleChangeType}
              onStatusChange={handleChangeStatus}
              onPublishedAtChange={newValue => setPublishedAt(!!newValue ? newValue.toDate() : null)}
              onTopicsReset={() => setSelectedTopicIds(tags_id)}
              onTypeReset={() => setSelectedTypeId(type_id)}
              onStatusReset={() => setSelectedStatusId(status_id)}
              onPublishedAtReset={() => setPublishedAt(parseDate(published_at))}
              topicsResetDisabled={selectedTopicIds === tags_id}
              typeResetDisabled={selectedTypeId === type_id}
              statusResetDisabled={selectedStatusId === status_id}
              publishedAtResetDisabled={publishedAt === published_at}
            />
            <Stack direction='row' spacing={2}>
              <Button
                variant='outlined'
                startIcon={<ReplayOutlinedIcon />}
                disabled={!hasChanged}
                onClick={resetAll}
              >
                Отменить
              </Button>
              <Button
                variant='outlined'
                startIcon={<SaveOutlinedIcon />}
                disabled={!hasChanged}
                color='success'
              >
                Сохранить
              </Button>
            </Stack>
          </Box>
        </Box>
      }
    </DashboardLayout>
  );
}
