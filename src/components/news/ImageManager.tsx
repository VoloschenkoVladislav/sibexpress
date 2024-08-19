import React, { FC, useState, ChangeEvent } from 'react';
import { Box, Button, ImageList, ImageListItem, ImageListItemBar, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";


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
    <ImageListItem
      onClick={onClick}
      sx={{
        // transform: selected ? 'scale(1.2)' : null,
        boxShadow: selected ? '7px 4px 6px grey' : null,
        transitionDuration: '0.5s',
      }}
    >
      <img
        srcSet={`${process.env.REACT_APP_BASE_URL}/${src + name}?w=248&fit=crop&auto=format&dpr=2 2x`}
        src={`${process.env.REACT_APP_BASE_URL}/${src + name}?w=248&fit=crop&auto=format`}
        alt={name}
        loading="lazy"
      />
      <ImageListItemBar
        title={name.slice(0, 12) + '...'}
      />
    </ImageListItem>
  );
}

export const ImageManager: FC<ImageGalleryProps> = ({ media, onLoadImage, onCancel, toolbar,  onDelete, onImageClick }) => {
  const images = media.images || [];
  const [ selectedImage, setSelectedImage ] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && onLoadImage) {
      const data = new FormData();
      for (let i = 0; i < e.target.files?.length; i++) {
        data.append('images[]', e.target.files[i]);
      }
      onLoadImage(data);
    }
  }

  return (
    <Box>
      <ImageList sx={{ width: 800, height: 450 }}>
        {
          images.map(image => (
            <ImageItem
              key={image}
              name={image}
              src={media.src}
              onClick={() => {
                setSelectedImage(image)
                if (onImageClick) onImageClick(media.src + image);
              }}
              selected={selectedImage === image}
            />
          ))
        }
      </ImageList>
      <Stack direction='row' spacing={2}>
        <Button onClick={onCancel}>
          Отмена
        </Button>
        {
          toolbar
          ? <>
            <Button
              disabled={!selectedImage}
              onClick={
                onDelete
                ? () => {
                  onDelete([ selectedImage! ]);
                  setSelectedImage(null);
                }
                : undefined
              }
            >
              Удалить
            </Button>
            <Button
              component='label'
              tabIndex={-1}
              role={undefined}
            >
              Добавить
              <VisuallyHiddenInput
                type='file'
                onChange={handleFileChange}
              />
            </Button>
          </>
          : null
        }
      </Stack>
    </Box>
  );
}
