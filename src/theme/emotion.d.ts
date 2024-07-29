import { Theme as MuiTheme } from '@mui/material/styles';

declare module '@emotion/react' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface Theme extends MuiTheme {}
}
