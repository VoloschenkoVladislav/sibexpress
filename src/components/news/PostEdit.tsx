import { Box, ToggleButtonGroup, InputLabel, ToggleButton, TextField, Autocomplete, CircularProgress, Select, MenuItem, SelectChangeEvent, Paper, FormControl } from "@mui/material";
import { FC, useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "../layout/DashboardLayout";
import { JEditor } from "../editor/JoditEditor";
import { SEditor } from "../editor/SunEditor";
import { TopicInterface, useStatusesQuery, useTopicsQuery } from "../../services/DictionaryService";
import { useParams } from "react-router-dom";
import { usePostQuery } from "../../services/PostService";
import { useAppSelector } from "../../hooks/redux/redux";

enum EditorType {
  Jodit = 'Jodit',
  SunEditor = 'SunEditor'
}

export const PostEdit: FC = () => {
  const { id } = useParams();
  const { tags_id, status_id, content } = useAppSelector(state => state.postsReducer);
  const [ editorType, setEditorType ] = useState(EditorType.SunEditor);
  const { data: topics = [], isLoading: isTopicsLoading } = useTopicsQuery();
  const { data: statuses = [], isLoading: isStatusesLoading } = useStatusesQuery();
  const { isLoading: isPostLoading } = usePostQuery(+id!);
  const [ selectedTopicIds, setSelectedTopicIds ] = useState<number[]>(tags_id);
  const [ selectedStatusId, setSelectedStatusId ] = useState<number | null>(status_id);

  useEffect(() => setSelectedTopicIds(tags_id), [tags_id]);
  useEffect(() => setSelectedStatusId(status_id), [status_id]);

  const onEditorToggle = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: EditorType,
  ) => {
    setEditorType(newAlignment)
  };

  const handleChangeStatus = (event: SelectChangeEvent) => {
    setSelectedStatusId(+event.target.value);
  };

  const handleChangeTypes = (event: any, newValue: TopicInterface[]) => {
    setSelectedTopicIds(newValue.map(v => v.id));
  };

  const selectedTopics = useMemo(
    () => topics!.filter(topic => selectedTopicIds.indexOf(topic.id) !== -1),
    [selectedTopicIds, topics]
  );

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
            <ToggleButtonGroup
              color="primary"
              value={editorType}
              exclusive
              onChange={onEditorToggle}
              aria-label="Platform"
              sx={{
                p: 2,
              }}
            >
              <ToggleButton value={EditorType.Jodit}>Jodit</ToggleButton>
              <ToggleButton value={EditorType.SunEditor}>SunEditor</ToggleButton>
            </ToggleButtonGroup> 
            <Box sx={{ pr: 2, pl: 2 }}>
              {
                (() => {
                  switch(editorType) {
                    case EditorType.Jodit:
                      return <Box><JEditor placeholder={'Hello, world!'} /></Box>
                    case EditorType.SunEditor:
                      return <Box><SEditor editorContent={content} onChange={() => {}} /></Box>
                  }
                })()
              }
            </Box>
          </Box>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '25%',
            p: 3,
            height: '100%',
          }}>
            <Paper sx={{ p: 1, height: '100%' }}>
              <Box sx={{ m: 1 }}>
                {
                  isStatusesLoading
                    ? <CircularProgress />
                    : <FormControl sx={{ width: '100%' }}>
                      <InputLabel id="post-edit-status-select-standard-label">Статус</InputLabel>
                      <Select
                        value={selectedStatusId?.toString()}
                        onChange={handleChangeStatus}
                        label="Статус"
                        labelId="post-edit-status-select-standard-label"
                      >
                        {statuses!.map(status => (
                          <MenuItem value={status.id}>{status.title}</MenuItem>
                        ))}
                      </Select>
                    </FormControl> 
                }
              </Box>
              <Box sx={{ m: 1 }}>
                {
                  isTopicsLoading
                    ? <CircularProgress />
                    : <Autocomplete
                      multiple
                      options={topics as TopicInterface[]}
                      getOptionLabel={(option) => option.title}
                      filterSelectedOptions
                      value={selectedTopics}
                      onChange={handleChangeTypes}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Темы"
                          placeholder="Начните вводить название темы..."
                        />
                      )}
                    />
                }
              </Box>
            </Paper>
          </Box>
        </Box>
      }
    </DashboardLayout>
  );
}
