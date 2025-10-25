import type { Theme, ThemeOptions } from '@mui/material/styles'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import * as React from 'react'

/**
 * Cria um tema seguro garantindo que todas as propriedades necessárias estão disponíveis com fallbacks,
 * evitando erros de propriedades indefinidas.
 *
 * @param userTheme - Opções de tema do usuário para mesclar com o tema base.
 * @returns Tema Material-UI criado com fallbacks seguros aplicados.
 * @remarks Usado internamente pela biblioteca para garantir compatibilidade com diferentes configurações de ThemeProvider do usuário.
 */

const createSafeTheme = (userTheme?: ThemeOptions): Theme => {
  const baseTheme = createTheme({
    palette: {
      primary: {
        main: '#1976d2',
        dark: '#1565c0',
        light: '#42a5f5',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#dc004e',
        dark: '#9a0036',
        light: '#e33371',
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
    },
    transitions: {
      duration: {
        shortest: 150,
        shorter: 200,
        short: 250,
        standard: 300,
        complex: 375,
        enteringScreen: 225,
        leavingScreen: 195,
      },
    },
  })

  if (!userTheme) {
    return baseTheme
  }

  // Merge do tema do usuário com fallbacks seguros
  return createTheme({
    ...baseTheme,
    ...userTheme,
    palette: {
      ...baseTheme.palette,
      ...userTheme.palette,
      primary: {
        ...baseTheme.palette.primary,
        ...userTheme.palette?.primary,
      },
      secondary: {
        ...baseTheme.palette.secondary,
        ...userTheme.palette?.secondary,
      },
      background: {
        ...baseTheme.palette.background,
        ...userTheme.palette?.background,
      },
      text: {
        ...baseTheme.palette.text,
        ...userTheme.palette?.text,
      },
    },
    transitions: {
      ...baseTheme.transitions,
      ...userTheme.transitions,
      duration: {
        ...baseTheme.transitions.duration,
        ...userTheme.transitions?.duration,
      },
    },
  })
}

/**
 * Propriedades de SafeThemeProvider.
 *
 * @property theme Opções do tema Material-UI a serem mescladas com fallbacks seguros.
 * @property children Nó(s) filho(s) a serem renderizados dentro do ThemeProvider.
 */
export interface SafeThemeProviderProps {
  /** Opções de tema MUI a combinar com fallbacks internos. */
  theme?: ThemeOptions
  /** Conteúdo filho. */
  children: React.ReactNode
}

/**
 * @component
 * @category Utils
 * @since 0.3.1
 * Componente ThemeProvider interno que garante compatibilidade e fallbacks seguros.
 * Aceita `ThemeOptions` e cria um `Theme` com `createTheme` aplicado a fallbacks padrão.
 * Deve ser usado nos componentes internos da biblioteca para evitar erros de tema.
 */
export function SafeThemeProvider({ theme, children }: Readonly<SafeThemeProviderProps>) {
  const safeTheme = React.useMemo(() => createSafeTheme(theme), [theme])

  return <ThemeProvider theme={safeTheme}>{children}</ThemeProvider>
}
