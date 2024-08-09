import { FC } from "react";
import { Box, ImageList, ImageListItem, ImageListItemBar, Paper } from "@mui/material";


interface ImageGalleryProps {
  media: {
    src: string | null,
    images: string[],
  },
  onImageSelect: (src: string) => void,
};

interface ImageItemInterface {
  src: string | null,
  name: string,
  onImageSelect: () => void,
};

const ImageItem: FC<ImageItemInterface> = ({ src, name, onImageSelect }) => {
  return (
    <ImageListItem
      key={src + name}
      onClick={onImageSelect}
    >
      <img
        srcSet={`${src + name}?w=248&fit=crop&auto=format&dpr=2 2x`}
        src={`${src + name}?w=248&fit=crop&auto=format`}
        alt={name}
        loading="lazy"
      />
      <ImageListItemBar
        title={name.slice(0, 7) + '...'}
      />
    </ImageListItem>
  );
}

export const ImageGallery: FC<ImageGalleryProps> = ({ media, onImageSelect }) => {

  return (
    <Box sx={{
      zIndex: 99,
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(200, 200, 200, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Paper
        sx={{
          minWidth: 400,
          minHeight: 200
        }}
      >
        <ImageList sx={{ width: 500, height: 450 }}>
          {media.images.map(image => (
            <ImageItem
              name={image}
              src={media.src}
              onImageSelect={() => onImageSelect(media.src + image)}
            />
          ))}
        </ImageList>
      </Paper>
    </Box>
  );
}
