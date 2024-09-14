import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Stack,
  CircularProgress,
  IconButton,
  Typography,
  Paper,
  Tooltip,
} from "@mui/material";
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CollectionsOutlinedIcon from '@mui/icons-material/CollectionsOutlined';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { DashboardLayout } from "../layout/DashboardLayout";
import { useParams } from "react-router-dom";
import {
  useDeleteImagesMutation,
  useDeleteThumbnailMutation,
  useEditPostMutation,
  useGetPostQuery,
  useUploadImagesMutation,
  useUploadThumbnailMutation
} from '../../services/PostService';
import { useAppDispatch, useAppSelector } from '../../hooks/redux/redux';
import { parseDate } from '../../utils/dateParser';
import { DropImage } from '../features/DropImage';
import { BlockEditor } from '../editor/EditorJS';
import { SidePanel } from './SidePanel';
import { ImageManager } from "./ImageManager";
import { PopupWindow } from "../features/PopupWindow";
import { LoadingWrap } from "../features/LoadingWrap";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import SimpleImage from "../editor/plugins/SimpleImage";
import { updatePost } from "../../store/reducers/PostSlice";
import { DATE_FORMAT_INPUT } from "../../constants/date";
import { Loading } from "../features/Loading";
import { setSuccess } from "../../store/reducers/AppSlice";
import { useAbac } from "react-abac";
import { PERMISSIONS } from "../../constants/permission";

interface TitleEditorProps {
  value: string,
  onChange: (value: string) => void,
  readOnly?: boolean,
  placeholder?: string,
}

const TitleEditor: FC<TitleEditorProps> = props => {
  return (
    <div
      onKeyDownCapture={(e) => {
        if (e.code === 'Enter') {
          e.preventDefault()
        }
      }}
      style={{ width: '100%' }}
    >
      <ReactQuill
        style={{
          border: '1px solid rgb(201, 201, 204)',
          borderRadius: '4px',
          padding: '4px',
          margin: '16px',
        }}
        readOnly={props.readOnly}
        theme='bubble'
        value={props.value}
        placeholder={props.placeholder}
        onChange={props.onChange}
        modules={{
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
          ]
        }}
      />
    </div>
  );
}

export const PostEdit: FC = () => {
  const { userHasPermissions } = useAbac();
  const { id } = useParams();
  const { isLoading: isPostLoading } = useGetPostQuery(+id!);
  const [editorRenderNum, setEditorRenderNum] = useState(0);

  const [ editPost ] = useEditPostMutation();
  const [ sendThumbnail ] = useUploadThumbnailMutation();
  const [ sendImages ] = useUploadImagesMutation();
  const [ deleteImage ] = useDeleteImagesMutation();
  const [ deleteThumbnail ] = useDeleteThumbnailMutation();

  const {
    content,
    tags_id,
    status_id,
    type_id,
    published_at,
    updated_at,
    created_at,
    media,
    title,
  } = useAppSelector(state => state.postsReducer);
  const dispatch = useAppDispatch();

  const [ selectedTopicIds, setSelectedTopicIds ] = useState<number[]>([]);
  const [ selectedStatusId, setSelectedStatusId ] = useState<number | null>(null);
  const [ selectedTypeId, setSelectedTypeId ] = useState<number | null>(null);
  const [ publishedAt, setPublishedAt ] = useState<string | null>(null);
  const [ editorData, setEditorData] = useState<string | null>(null);
  const [ imageManagerUp, setImageManagerUp ] = useState(false);
  const [ imageGalleryUp, setImageGalleryUp ] = useState(false);
  const [ postTitle, setPostTitle ] = useState<string>("");
  const [ isSending, setIsSending ] = useState(false);

  const simpleImagePluginInstance = useRef<SimpleImage>(null);
  
  const resetAll = () => {
    setSelectedTopicIds(tags_id);
    setSelectedTypeId(type_id);
    setSelectedStatusId(status_id);
    setPublishedAt(published_at);
    setEditorData(content);
    setPostTitle(title);
    setEditorRenderNum(editorRenderNum + 1);
  };

  useEffect(() => {
    resetAll();
    // eslint-disable-next-line
  }, [
    tags_id,
    status_id,
    type_id,
    published_at,
    content,
    title,
    content,
  ]);

  const compareEditorData = (previous: string | null, current: string | null) => {
    if (previous && current) {
      return JSON.stringify(JSON.parse(previous).blocks) === JSON.stringify(JSON.parse(current).blocks);
    }
    return previous === current;
  };

  const handleEditorChange = (data: string) => {
    setEditorData(data);
  };

  const handleDeleteThumbnail = () => {
    setIsSending(true);
    deleteThumbnail(+id!).then(response => {
      setIsSending(false);
      if (!response.error) {
        dispatch(setSuccess('Изображение удалено'));
      }
    })
  };

  const handleSave = () => {
    setIsSending(true);
    editPost({
      id: +id!,
      postData: {
        title: postTitle,
        tags_id: selectedTopicIds,
        type_id: selectedTypeId,
        status_id: selectedStatusId,
        raw_content: editorData,
        published_at: publishedAt || null,
      }
    }).then(response => {
      setIsSending(false);
      if (!response.error) {
        dispatch(updatePost({
          title: postTitle,
          tags_id: selectedTopicIds,
          type_id: selectedTypeId,
          status_id: selectedStatusId,
          content: editorData,
          published_at: publishedAt || null,
          created_at: created_at,
          updated_at: updated_at,
          media: media,
        }));
        dispatch(setSuccess('Материал сохранён'));
      }
    });
  };

  const hasChanged = useMemo(() => {
    return (
      selectedTopicIds !== tags_id
      || selectedTypeId !== type_id
      || selectedStatusId !== status_id
      || publishedAt !== published_at
      || !compareEditorData(content, editorData)
      || title !== postTitle
    );
  }, [
    selectedTopicIds,
    selectedTypeId,
    selectedStatusId,
    publishedAt,
    tags_id,
    type_id,
    status_id,
    published_at,
    title,
    postTitle,
    content,
    editorData,
  ]);

  return (
    <DashboardLayout>
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
          userHasPermissions(PERMISSIONS.POST_EDIT)
          ? <>
            <Typography variant='h4' gutterBottom>Редактирование материала</Typography>
            <Stack direction='row' spacing={2}>
              <Tooltip title='Отменить все изменения'>
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
              <Tooltip title='Галерея изображений'>
                <span>
                  <IconButton
                    onClick={() => setImageManagerUp(true)}
                    color='primary'
                  >
                    <CollectionsOutlinedIcon />
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
          : <Typography variant='h4' gutterBottom>Просмотр материала</Typography>
        }
      </Box>
      <LoadingWrap
        isLoading={isPostLoading}
        loader={<CircularProgress sx={{ position: 'relative', top: '50%', left: '50%' }} />}
      >
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'start',
          height: '100%',
          mt: 2,
        }}>
          <PopupWindow visible={imageManagerUp}>
            <ImageManager
              onCancel={() => setImageManagerUp(false)}
              media={{
                src: media.src,
                images: media.images,
              }}
              toolbar={true}
              onLoadImage={data => {
                setIsSending(true);
                sendImages({ id: +id!, images: data }).then(response => {
                  setIsSending(false);
                  if (!response.error) {
                    dispatch(setSuccess('Изображения загружены'));
                  }
                });
              }}
              onDelete={images => {
                setIsSending(true);
                deleteImage({ id: +id!, images }).then(response => {
                  setIsSending(false);
                  if (!response.error) {
                    dispatch(setSuccess('Изображения удалены'));
                  }
                });
              }}
            />
          </PopupWindow>

          <PopupWindow visible={imageGalleryUp}>
            <ImageManager
              onCancel={() => setImageGalleryUp(false)}
              media={{
                src: media.src,
                images: media.images,
              }}
              onImageClick={image => {
                simpleImagePluginInstance.current?.setImage(image);
                setImageGalleryUp(false);
              }}
              toolbar={false}
            />
          </PopupWindow>

          <Box sx={{ width: '75%', mr: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant='h6' gutterBottom>Заголовок</Typography>
              {
                userHasPermissions(PERMISSIONS.POST_EDIT)
                ? <IconButton
                  aria-label='Отменить'
                  color='primary'
                  onClick={() => setPostTitle(title)}
                  disabled={title === postTitle}
                >
                  <ReplayOutlinedIcon />
                </IconButton>
                : null
              }
            </Box>
            <Paper sx={{ display: 'flex', p: 1, mb: 3 }}>
              <TitleEditor
                value={postTitle}
                readOnly={!userHasPermissions(PERMISSIONS.POST_EDIT)}
                onChange={value => setPostTitle(value)}
                placeholder='Введите заголовок'
              />
            </Paper>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant='h6' gutterBottom>Тело материала</Typography>
              {
                userHasPermissions(PERMISSIONS.POST_EDIT)
                ? <IconButton
                  aria-label='Отменить'
                  color='primary'
                  onClick={() => {
                    setEditorData(content);
                    setEditorRenderNum(editorRenderNum + 1);
                  }}
                  disabled={compareEditorData(content, editorData)}
                >
                  <ReplayOutlinedIcon />
                </IconButton>
                : null
              }
            </Box>
            <Paper sx={{ p: 1, mb: 3 }}>
              <BlockEditor
                readOnly={!userHasPermissions(PERMISSIONS.POST_EDIT)}
                editorRenderNum={editorRenderNum}
                initialData={content || undefined}
                onChange={handleEditorChange}
                onButtonPressed={editor => {
                  // @ts-ignore
                  simpleImagePluginInstance.current = editor;
                  setImageGalleryUp(true);
                }}
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
            <Paper sx={{
              p: 1,
              mb: 3,
            }}>
              <SidePanel
                selectedTopicIds={selectedTopicIds}
                selectedStatusId={selectedStatusId || status_id}
                selectedTypeId={selectedTypeId || type_id}
                publishedAt={parseDate(publishedAt) ? dayjs(parseDate(publishedAt)) : null}
                createdAt={dayjs(parseDate(created_at))}
                updatedAt={dayjs(parseDate(updated_at))}
                onTopicsChange={(e, newValue) => setSelectedTopicIds(newValue.map(v => v.id))}
                onTypeChange={e => setSelectedTypeId(+e.target.value)}
                onStatusChange={e => setSelectedStatusId(+e.target.value)}
                onPublishedAtChange={newValue => setPublishedAt(newValue?.format(DATE_FORMAT_INPUT) || null)}
                onTopicsReset={() => setSelectedTopicIds(tags_id)}
                onTypeReset={() => setSelectedTypeId(type_id)}
                onStatusReset={() => setSelectedStatusId(status_id)}
                onPublishedAtReset={() => setPublishedAt(published_at)}
                topicsResetDisabled={selectedTopicIds === tags_id}
                typeResetDisabled={selectedTypeId === type_id}
                statusResetDisabled={selectedStatusId === status_id}
                publishedAtResetDisabled={publishedAt === published_at}
              />
            </Paper>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant='h6' gutterBottom>Главное изображение</Typography>
              {
                userHasPermissions(PERMISSIONS.POST_EDIT)
                ? <IconButton onClick={handleDeleteThumbnail} color='error' disabled={!(media.src && media.thumb)}>
                  <DeleteOutlinedIcon />
                </IconButton>
                : null
              }
            </Box>
            <Paper sx={{ p: 3, mb: 2 }}>
              <DropImage
                field="thumbnail"
                disabled={!userHasPermissions(PERMISSIONS.POST_EDIT)}
                onDrop={file => {
                  setIsSending(true);
                  sendThumbnail({ id: +id!, thumbnail: file })
                    .then(response => {
                      setIsSending(false);
                      if (!response.error) {
                        dispatch(setSuccess('Изображение сохранено'));
                      }
                    });
                }}
                path={(media.src && media.thumb) ? `${media.src}${media.thumb}` : null}
              />
            </Paper>
          </Box>
        </Box>
      </LoadingWrap>
    </DashboardLayout>
  );
}
