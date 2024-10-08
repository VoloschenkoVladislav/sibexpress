import React, { FC, useMemo, CSSProperties } from 'react';
import { useDropzone } from 'react-dropzone';
import { BASE_BACKEND_URL } from '../../constants/baseUrl';


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

interface Props {
  field: string,
  onDrop: (file: FormData) => void,
  path: string | null,
  disabled?: boolean,
}

export const DropImage: FC<Props> = ({ field, onDrop, path, disabled }) => {
  const {
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
      'image/gif': ['.gif'],
    },
    maxFiles: 1,
    onDrop: async acceptedFiles => {
      if (acceptedFiles.length) {
        const data = new FormData();
        data.append(field, acceptedFiles[0]);
        onDrop(data);
      }
    },
    disabled
  });

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isFocused ? focusedStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isFocused,
    isDragAccept,
    isDragReject,
  ]);

  return (
    <section className='container'>
      <div {...getRootProps({ className: 'dropzone', style })}>
        <input {...getInputProps()} />
        {
          path
          ? <div style={thumb}>
            <div style={thumbInner}>
              <img
                src={`${BASE_BACKEND_URL}/${path}`}
                alt={path}
                loading='lazy'
                style={{
                  width: '100%',
                  objectFit: 'contain',
                }}
              />
            </div>
          </div>
          : <p>Перетащите изображение или кликните, чтобы выбрать файл...</p>
        }
      </div>
    </section>
  );
}
