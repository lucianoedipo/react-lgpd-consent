import { createTheme } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'
/**
 * @constant
 * @category Utils
 * @since 0.1.0
 * Tema padrão utilizado pelos componentes de consentimento da biblioteca.
 *
 * Inclui configurações de cores, tipografia e estilos para componentes Material-UI,
 * garantindo aparência consistente e acessível conforme guidelines LGPD.
 *
 * @remarks
 * Pode ser sobrescrito via ThemeProvider externo se necessário.
 */
export function createDefaultConsentTheme(): Theme {
  return createTheme({
    palette: {
      primary: {
        main: '#1976d2',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#dc004e',
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
        textTransform: 'none',
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
}

/**
 * Compatibilidade: getter para o tema padrão.
 *
 * @deprecated Use `createDefaultConsentTheme()` em vez de importar um tema criado no escopo do módulo.
 * Importar um tema já instanciado pode causar side-effects em SSR e conflitos de contexto.
 * Esta função retorna uma nova instância do tema quando chamada.
 */
export const defaultConsentTheme = (): Theme => createDefaultConsentTheme()

/**
 * @type
 * @category Types
 * @since 0.1.0
 * Tipo do tema de consentimento utilizado na biblioteca.
 *
 * Útil para tipar props customizadas de tema ou para extensão do tema padrão.
 */
export type ConsentTheme = ReturnType<typeof createDefaultConsentTheme>
