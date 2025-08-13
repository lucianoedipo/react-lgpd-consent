import CookieOutlined from '@mui/icons-material/CookieOutlined'
import type { FabProps } from '@mui/material/Fab'
import Fab from '@mui/material/Fab'
import Tooltip from '@mui/material/Tooltip'
import { useTheme } from '@mui/material/styles'
import { useConsent } from '../hooks/useConsent'
import { logger } from '../utils/logger'

/**
 * Função utilitária para acessar propriedades de tema com fallbacks seguros.
 * Evita erros quando o ThemeProvider não está configurado corretamente.
 */
function useThemeWithFallbacks() {
  const theme = useTheme()

  // Log para debug de compatibilidade de tema
  logger.themeCompatibility(theme)

  return {
    palette: {
      primary: {
        main: theme?.palette?.primary?.main || '#1976d2',
        dark: theme?.palette?.primary?.dark || '#1565c0',
      },
    },
    transitions: {
      duration: {
        shortest: theme?.transitions?.duration?.shortest || 150,
        short: theme?.transitions?.duration?.short || 250,
      },
    },
  }
}

/**
 * Props para o componente FloatingPreferencesButton.
 *
 * Permite configurar posição, ícone, tooltip, e comportamento de exibição do botão flutuante
 * para abrir o modal de preferências de cookies LGPD.
 *
 * Todos os campos são opcionais e possuem valores padrão.
 */
export interface FloatingPreferencesButtonProps {
  /** Posição do botão flutuante. Padrão: 'bottom-right' */
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
  /** Offset da borda em pixels. Padrão: 24 */
  offset?: number
  /** Ícone customizado. Padrão: CookieOutlined */
  icon?: React.ReactNode
  /** Tooltip customizado exibido ao passar o mouse */
  tooltip?: string
  /** Props adicionais para o Fab do MUI */
  FabProps?: Partial<FabProps>
  /** Se deve esconder quando consentimento já foi dado. Padrão: false */
  hideWhenConsented?: boolean
}

/**
 * Botão flutuante para abrir o modal de preferências de cookies.
 *
 * Permite ao usuário acessar rapidamente as configurações de consentimento LGPD.
 * Pode ser posicionado em qualquer canto da tela e customizado via props.
 *
 * @param position Posição do botão na tela. Padrão: 'bottom-right'.
 * @param offset Distância da borda em pixels. Padrão: 24.
 * @param icon Ícone customizado para o botão. Padrão: CookieOutlined.
 * @param tooltip Texto do tooltip exibido ao passar o mouse. Padrão: 'Gerenciar Preferências de Cookies'.
 * @param FabProps Props adicionais para o componente Fab do MUI.
 * @param hideWhenConsented Se verdadeiro, esconde o botão após consentimento. Padrão: false.
 *
 * @returns JSX.Element | null
 */
export function FloatingPreferencesButton({
  position = 'bottom-right',
  offset = 24,
  icon = <CookieOutlined />,
  tooltip,
  FabProps,
  hideWhenConsented = false,
}: Readonly<FloatingPreferencesButtonProps>) {
  const { openPreferences, consented } = useConsent()
  const safeTheme = useThemeWithFallbacks()

  logger.componentRender('FloatingPreferencesButton', {
    position,
    offset,
    hideWhenConsented,
    consented,
  })

  if (hideWhenConsented && consented) {
    logger.debug(
      'FloatingPreferencesButton: Hidden due to hideWhenConsented=true and consented=true',
    )
    return null
  }

  const tooltipText = tooltip ?? 'Gerenciar Preferências de Cookies'

  const getPosition = () => {
    const styles: Record<string, any> = {
      position: 'fixed',
      zIndex: 1200,
    }

    switch (position) {
      case 'bottom-left':
        return { ...styles, bottom: offset, left: offset }
      case 'bottom-right':
        return { ...styles, bottom: offset, right: offset }
      case 'top-left':
        return { ...styles, top: offset, left: offset }
      case 'top-right':
        return { ...styles, top: offset, right: offset }
      default:
        return { ...styles, bottom: offset, right: offset }
    }
  }

  return (
    <Tooltip title={tooltipText} placement="top">
      <Fab
        size="medium"
        color="primary"
        onClick={openPreferences}
        sx={{
          ...getPosition(),
          backgroundColor: safeTheme.palette.primary.main,
          '&:hover': {
            backgroundColor: safeTheme.palette.primary.dark,
          },
          transition: `all ${safeTheme.transitions.duration.short}ms`,
        }}
        aria-label={tooltipText}
        {...FabProps}
      >
        {icon}
      </Fab>
    </Tooltip>
  )
}
