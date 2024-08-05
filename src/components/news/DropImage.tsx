import React, { FC, useState, useMemo, CSSProperties } from "react";
import { useDropzone } from "react-dropzone";
import { useUploadThumbnailMutation } from "../../services/PostService";
import { CircularProgress } from "@mui/material";


const baseStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
};

const focusedStyle: CSSProperties = {
  borderColor: '#2196f3',
};

const acceptStyle: CSSProperties = {
  borderColor: '#00e676',
};

const rejectStyle: CSSProperties = {
  borderColor: '#ff1744',
};

const thumb: CSSProperties = {
  display: 'inline-flex',
  justifyContent: 'center',
  width: '100%',
  height: 200,
};

const thumbInner: CSSProperties = {
  display: 'flex',
  minWidth: 0,
};

const img: CSSProperties = {
  display: 'block',
  width: 'auto',
  height: '100%',
};

export const DropImage: FC = () => {
  const [ files, setFiles ] = useState<File[]>([]);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ sendImage ] = useUploadThumbnailMutation();
  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: {
      'image/png': ['.png'],
      'image/jpg': ['.jpg'],
      'image/jpeg': ['.jpeg'],
    },
    maxFiles: 1,
    onDrop: acceptedFiles => {
      setIsLoading(false);
      if (acceptedFiles.length) {
        sendImage({ postId: 1, imageFile: acceptedFiles[0] });
      }
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
    },
    onDragOver: () => {
      setIsLoading(true);
    },
  });

  const thumbs = files.map(file => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        {
          isLoading
          ? <CircularProgress />
          : <img
            // @ts-ignore
            src={file.preview}
            style={img}
            // @ts-ignore
            onLoad={() => { URL.revokeObjectURL(file.preview); console.log('loaded') }}
          />
        }
      </div>
    </div>
  ));

  const listOfFiles = acceptedFiles.map(file => (
    <li key={file.name}>
      {file.name} - {file.size} bytes
    </li>
  ));

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isFocused ? focusedStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isFocused,
    isDragAccept,
    isDragReject
  ]);

  return (
    <section className="container">
      <div {...getRootProps({ className: 'dropzone', style })}>
        <input {...getInputProps()} />
        {
          acceptedFiles.length
          ? thumbs
          : <p>Перетащите изображение или кликните, чтобы выбрать файл...</p>
        }
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{listOfFiles}</ul>
      </aside>
    </section>
  );
}
