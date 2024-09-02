/* eslint-disable @typescript-eslint/no-unused-vars */
import { Palette, PaletteOptions } from '@mui/material/styles/createPalette';

declare module '@mui/material/styles' {
  interface Palette {
    neutral?: Palette['primary'];
    selected?: PaletteOptions['primary'];
  }
  interface PaletteOptions {
    neutral?: PaletteOptions['primary'];
    selected?: PaletteOptions['primary'];
  }
}
