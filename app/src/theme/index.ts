import { createTheme } from '@mui/material';

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 1000,
      lg: 1200,
      xl: 1920,
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    fontSize: 15,
  },
  palette: {
    primary: {
      main: '#1565c0',
      light: '#88bbf1',
      dark: '#0e2443',
      contrastText: '#FFF',
    },
    grey: {
      '50': '#f6f6f6',
      '100': '#e7e7e7',
      '200': '#d1d1d1',
      '300': '#b0b0b0',
      '400': '#888888',
      '500': '#6d6d6d',
      '600': '#5d5d5d',
      '700': '#555555',
      '800': '#454545',
      '900': '#3d3d3d',
      'A100': '#262626',
    }
  }
});
