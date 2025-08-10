import { createTheme } from '@mui/material/styles'

/**
 * Tema padrão para os componentes de consentimento.
 * Baseado no design system da ANPD/governo brasileiro.
 */
export const defaultConsentTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Azul institucional
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#dc004e', // Rosa/vermelho para ações importantes
      contrastText: '#ffffff',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
    action: {
      hover: 'rgba(25, 118, 210, 0.04)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none', // Manter capitalização original
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          paddingX: 16,
          paddingY: 8,
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
        },
      },
    },
  },
})

export type ConsentTheme = typeof defaultConsentTheme
