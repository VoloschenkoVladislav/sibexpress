import React, { FC } from "react";
import { useAppSelector } from "../../hooks/redux/redux";
import { Button, Typography, Box } from "@mui/material";
import { PATHS } from "../../constants/path";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../../hooks/redux/redux";
import { resetError } from "../../store/reducers/AuthSlice";


interface ErrorProps {
  errorMessage: string,
  exitRef: {
    link: string,
    title: string,
  }
}

interface ErrorBoundaryProps {
  children: React.ReactNode,
}

const Error: FC<ErrorProps> = props => {
  const dispatch = useAppDispatch();
  const { errorMessage, exitRef } = props;
  const { link, title } = exitRef;

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography>
        {errorMessage}
      </Typography>
      <Link to={link}>
        <Button onClick={() => dispatch(resetError())}>{title}</Button>
      </Link>
    </Box>
  );
}

export const ErrorBoundary: FC<ErrorBoundaryProps> = props => {
  const { children } = props;
  const errorMessage = useAppSelector(state => state.authReducer.errorMessage) || '';
  const errorCode = useAppSelector(state => state.authReducer.errorCode) || '';

  return (
    <>
      {
        !errorMessage
          ? children
          : <Error errorMessage={`${errorCode}: ${errorMessage}`} exitRef={{ link: PATHS.LOGIN, title: 'К форме выхода' }} />
      }
    </>
  );
}
