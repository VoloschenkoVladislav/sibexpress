import React, { FC, useState, ChangeEvent } from 'react';
import { Box, Button, Grid, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CollectionsOutlinedIcon from '@mui/icons-material/CollectionsOutlined';
import { styled } from "@mui/material/styles";
import { BASE_BACKEND_URL } from '../../constants/baseUrl';


interface ImageGalleryProps {
  media: {
    src: string | null,
    images: string[] | null,
  },
  toolbar: boolean,
  onLoadImage?: (file: FormData) => void
  onCancel?: () => void,
  onDelete?: (images: string[]) => void,
  onImageClick?: (image: string) => void,
};

interface ImageItemInterface {
  src: string | null,
  name: string,
  onClick?: () => void,
  selected?: boolean,
};

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const ImageItem: FC<ImageItemInterface> = ({ src, name, onClick, selected }) => {
  return (
    <Grid
      item
      xs={12}
      sm={6}
      md={4}
      lg={3}
      onClick={onClick}
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
    >
      <CheckCircleOutlineOutlinedIcon
        color='success'
        style={{
          display: !selected ? 'none' : undefined,
          position: 'relative',
          top: '8%',
          left: '-50%',
          zIndex: 120,
          fontSize: '1.5em',
          backgroundColor: '#FFFFFF',
          borderRadius: '50%'
        }}
      />
      <img
        style={{
          transform: selected ? 'scale(0.95)' : undefined,
          transitionDuration: '0.2s',
          border: '2px solid',
          borderColor: selected ? '#2e7d32' : '#d9d9d9',
          borderRadius: '3px',
          pointerEvents: 'none',
          userSelect: 'none',
          width: '100%'
        }}
        srcSet={`${BASE_BACKEND_URL}/${src + name}?w=248&fit=crop&auto=format&dpr=2 2x`}
        src={`${BASE_BACKEND_URL}/${src + name}?w=248&fit=crop&auto=format`}
        alt={name}
      />
    </Grid>
  );
}

export const ImageManager: FC<ImageGalleryProps> = ({ media, onLoadImage, onCancel, toolbar,  onDelete, onImageClick }) => {
  const images = media.images || [];
  const [ selectedImages, setSelectedImages ] = useState<Set<string>>(new Set([]));

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && onLoadImage) {
      const data = new FormData();
      for (let i = 0; i < e.target.files?.length; i++) {
        data.append('images[]', e.target.files[i]);
      }
      onLoadImage(data);
    }
  }

  const handleSelectedImagesChange = (image: string) => {
    const currentSelectedImages = new Set(selectedImages);
    if (currentSelectedImages.has(image)) {
      currentSelectedImages.delete(image);
    } else {                      
      currentSelectedImages.add(image);
    }
    setSelectedImages(currentSelectedImages);
  };

  return (
    <Box>
      <Typography variant='h4' gutterBottom>Галерея</Typography>
      {
        images.length
        ? <Grid
          container
          sx={{
            maxWidth: 800,
            width: '100%',
            maxHeight: 450,
            height: '100%',
            my: 1,
            pr: 1,
            overflowY: 'auto'
          }}
          spacing={2}
        >
          {
            images.map(image => (
              <ImageItem
                key={image}
                name={image}
                src={media.src}
                onClick={() => {
                  handleSelectedImagesChange(image);
                  if (onImageClick) onImageClick(media.src + image);
                }}
                selected={selectedImages.has(image)}
              />
            ))
          }
        </Grid>
        : <Box sx={{ width: 800, height: 450, p: 1 }}>
          <Stack
            direction='row'
            spacing={2}
            justifyContent='center'
            alignItems='center'
            sx={{ position: 'relative', top: '40%' }}
          >
            <CollectionsOutlinedIcon color='disabled' sx={{ fontSize: '4em' }} />
            <Typography sx={{ fontSize: '1.8em' }}>
              Нет изображений в галерее
            </Typography>
          </Stack>
        </Box>
      }
      <Stack direction='row' spacing={2} justifyContent='space-between'>
        <Button onClick={onCancel} variant='outlined'>
          Назад
        </Button>
        <Stack direction='row' spacing={2} justifyContent='end'>
          {
            toolbar
            ? <>
              <Tooltip title='Удалить изображения'>
                <span>
                  <IconButton
                    disabled={!selectedImages.size}
                    color='error'
                    onClick={
                      onDelete
                      ? () => {
                        onDelete(Array.from(selectedImages));
                        setSelectedImages(new Set([]));
                      }
                      : undefined
                    }
                  >
                    <DeleteOutlinedIcon />
                  </IconButton>
                </span>
              </Tooltip>
              <VisuallyHiddenInput
                multiple
                type='file'
                accept='image/*'
                onChange={handleFileChange}
                id='icon-button-file-manager'
              />
              <Tooltip title='Добавить новые изображения'>
                <span>
                  <label htmlFor='icon-button-file-manager'>
                    <IconButton color='success' component='span'>
                      <AddOutlinedIcon />
                    </IconButton>
                  </label>
                </span>
              </Tooltip>
            </>
            : null
          }
        </Stack>
      </Stack>
    </Box>
  );
}
