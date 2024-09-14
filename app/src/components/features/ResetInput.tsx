import { FC, ReactNode } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';


interface Props {
  onReset?: () => void,
  disabled: boolean,
  visible: boolean,
  children: ReactNode,
};

export const ResetInput: FC<Props> = ({ onReset, disabled, visible, children }) => {
  return (
    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      {children}
      {
        visible
        ? <Box>
          <Tooltip title='Отменить'>
            <span>
              <IconButton
                aria-label='Отменить'
                onClick={onReset}
                disabled={disabled}
                color='primary'
                sx={{ ml: 1 }}
              >
                <ReplayOutlinedIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
        : null
      }
    </Box>
  );
};
