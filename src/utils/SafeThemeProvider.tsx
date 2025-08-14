import * as React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'

/**
 * Theme Provider seguro que garante que todas as propriedades necessárias
 * estão disponíveis com fallbacks, evitando erros de propriedades indefinidas.
 *
 * Usado internamente pela biblioteca para garantir compatibilidade com
 * diferentes configurações de ThemeProvider do usuário.
 */

const createSafeTheme = (userTheme?: any): Theme => {
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

export interface SafeThemeProviderProps {
  theme?: any
  children: React.ReactNode
}

/**
 * @component
 * @category Utils
 * @since 0.3.1
 * Componente ThemeProvider interno que garante compatibilidade e fallbacks seguros.
 * Deve ser usado nos componentes internos da biblioteca para evitar erros de tema.
 */
export function SafeThemeProvider({
  theme,
  children,
}: Readonly<SafeThemeProviderProps>) {
  const safeTheme = React.useMemo(() => createSafeTheme(theme), [theme])

  return <ThemeProvider theme={safeTheme}>{children}</ThemeProvider>
}
