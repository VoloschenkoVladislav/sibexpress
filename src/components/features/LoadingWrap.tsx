import { FC, ReactNode } from "react";


interface Props {
  isLoading: boolean,
  loader: ReactNode,
  children?: ReactNode,
}

export const LoadingWrap: FC<Props> = ({ isLoading, loader, children }) => {
  return (
    <>
      {
        isLoading
        ? loader
        : children
      }
    </>
  );
}
