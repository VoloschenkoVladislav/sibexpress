import {
  Box,
  Button,
  Stack,
  CircularProgress,
  SelectChangeEvent,
} from "@mui/material";
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ru';
import { FC, useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "../layout/DashboardLayout";
import { TopicInterface } from "../../services/DictionaryService";
import { useParams } from "react-router-dom";
import { usePostQuery } from "../../services/PostService";
import { useAppSelector } from "../../hooks/redux/redux";
import { parseDate } from "../../utils/dateParser";
import { DropImage } from "./DropImage";
import { BlockEditor } from "../editor/EditorJS";
import { SidePanel } from "./SidePanel";
import { OutputData } from "@editorjs/editorjs";


const DATE_FORMAT_INPUT = 'YYYY-MM-DD HH:mm:ss';

const editorJSDefaultValue = {
  time: 1635603431943,
  blocks: [
    {
      id: "IpKh1dMyC6",
      type: "paragraph",
      data: {
        text: "We have been working on this project more than three years.",
      }
    },
  ],
};

export const PostEdit: FC = () => {
  const { id } = useParams();
  const { content } = useAppSelector(state => state.postsReducer);
  const { isLoading: isPostLoading } = usePostQuery(+id!);
  const { tags_id, status_id, type_id, published_at, updated_at, created_at } = useAppSelector(state => state.postsReducer);
  const [ selectedTopicIds, setSelectedTopicIds ] = useState<number[]>([]);
  const [ selectedStatusId, setSelectedStatusId ] = useState<number | null>(null);
  const [ selectedTypeId, setSelectedTypeId ] = useState<number | null>(null);
  const [ publishedAt, setPublishedAt ] = useState<Dayjs | null>(null);
  const [editorData, setEditorData] = useState<OutputData | undefined>(undefined);

  const handleEditorChange = (data: OutputData) => {
    setEditorData(data);
    console.log('Editor data:', data);
  };

  useEffect(() => {
    setSelectedTopicIds(tags_id);
    setSelectedStatusId(status_id);
    setSelectedTypeId(type_id);
    setPublishedAt(dayjs(published_at, DATE_FORMAT_INPUT));
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
    setPublishedAt(dayjs(published_at, DATE_FORMAT_INPUT));
  }

  const hasChanged = useMemo(() => {
    return (
      selectedTopicIds !== tags_id
      || selectedTypeId !== type_id
      || selectedStatusId !== status_id
      || publishedAt?.format(DATE_FORMAT_INPUT) !== published_at
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
            {/* <SEditor editorContent={content} onChange={() => {}} /> */}
            <BlockEditor data={editorJSDefaultValue} onChange={handleEditorChange} />
            {/* <Editor data={editorData} onChange={handleEditorChange} /> */}
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
              selectedStatusId={selectedStatusId || status_id}
              selectedTypeId={selectedTypeId || type_id}
              publishedAt={dayjs(publishedAt)}
              createdAt={dayjs(parseDate(created_at))}
              updatedAt={dayjs(parseDate(updated_at))}
              onTopicsChange={handleChangeTopics}
              onTypeChange={handleChangeType}
              onStatusChange={handleChangeStatus}
              onPublishedAtChange={newValue => setPublishedAt(newValue)}
              onTopicsReset={() => setSelectedTopicIds(tags_id)}
              onTypeReset={() => setSelectedTypeId(type_id)}
              onStatusReset={() => setSelectedStatusId(status_id)}
              onPublishedAtReset={() => setPublishedAt(dayjs(published_at, DATE_FORMAT_INPUT))}
              topicsResetDisabled={selectedTopicIds === tags_id}
              typeResetDisabled={selectedTypeId === type_id}
              statusResetDisabled={selectedStatusId === status_id}
              publishedAtResetDisabled={publishedAt?.format(DATE_FORMAT_INPUT) === published_at}
            />
            <DropImage />
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
