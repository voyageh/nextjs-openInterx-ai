'use client'

import { createTheme } from '@mui/material/styles'
import { QueryClient } from '@tanstack/react-query'

export const theme = createTheme({
  typography: {
    fontFamily: 'var(--open-font-family)',
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
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          background: 'var(--bg-color-1)',
          marginTop: '0.3rem',
          borderRadius: '0.5rem',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        outlined: {
          borderColor: 'var(--bg-color-2)',
        },
        root: {
          textTransform: 'none', // 禁用大写
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '1rem',
          background: 'var(--bg-color-0)',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '0.5rem 1.25rem',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '1rem',
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: 'var(--grey-color-8)',
          color: 'var(--grey-color-0)',
          fontSize: '0.875rem',
          borderRadius: '0.3rem',
          padding: '0.5rem',
        },
        arrow: {
          color: 'var(--grey-color-8)',
        },
      },
    },
    MuiPopover:{
      styleOverrides:{
        paper:{
          background: 'var(--bg-color-0)',
        },
      }
    },
    MuiMenuItem:{
      styleOverrides:{
        root:{
          color: 'var(--text-color-0)',
          fontSize:'0.875rem'
        }
      }
    }
  },
})

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
})
