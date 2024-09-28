'use client'

import { createTheme } from '@mui/material/styles'
import { QueryClient } from '@tanstack/react-query'
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--open-font-family',
})

const theme = createTheme({
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  cssVariables: {
    colorSchemeSelector: 'data',
  },

  colorSchemes: {
    dark: {
      palette: {
        primary: {
          main: '#7F72DB',
        },
        secondary: {
          main: '#FD615B',
          contrastText: 'var(--mui-palette-text-secondary)',
        },
        tag: {
          main: '#201F26',
          dark: '#45444F',
          contrastText: 'var(--mui-palette-text-secondary)',
        },
        text: {
          primary: '#f9f9f9',
          secondary: 'rgba(249, 249, 249, 0.8)',
        },
      },
    },
    light: {
      palette: {
        primary: {
          main: '#7F72DB',
        },
        secondary: {
          main: '#f50057',
        },
        tag: {
          light: '#757ce8',
          main: 'var(--mui-palette-text-secondary)',
          dark: 'var(--grey-color-2)',
          contrastText: 'var(--mui-palette-text-secondary)',
        },
        text: {
          primary: '#201F26',
          secondary: 'rgba(32, 31, 38, 0.8)',
        },
      },
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // 禁用大写
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '1rem',
          background: '#16161a',
        },
      },
    },
  },
})

export default theme

export const queryClient = new QueryClient()
