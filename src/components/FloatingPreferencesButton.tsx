import CookieOutlined from '@mui/icons-material/CookieOutlined'
import type { FabProps } from '@mui/material/Fab'
import Fab from '@mui/material/Fab'
import Tooltip from '@mui/material/Tooltip'
import { useTheme } from '@mui/material/styles'
import { useDesignTokens } from '../context/DesignContext'
import { useConsent, useConsentTexts } from '../hooks/useConsent'
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
 * @component
 * @category Components
 * @since 0.3.0
 * Botão flutuante para abrir o modal de preferências de cookies.
 *
 * @remarks
 * Este componente é renderizado automaticamente pelo `ConsentProvider` após o consentimento inicial.
 * Ele permite ao usuário acessar rapidamente as configurações de consentimento LGPD a qualquer momento.
 * Você pode substituí-lo passando seu próprio componente para a prop `FloatingPreferencesButtonComponent`
 * no `ConsentProvider`.
 *
 * @param {Readonly<FloatingPreferencesButtonProps>} props As propriedades para customizar o botão.
 * @returns {JSX.Element | null} O componente do botão flutuante ou `null` se não for necessário exibi-lo.
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
  const texts = useConsentTexts()
  const safeTheme = useThemeWithFallbacks()
  const designTokens = useDesignTokens()

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

  const tooltipText = tooltip ?? texts.preferencesButton ?? 'Gerenciar Preferências de Cookies'

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
          backgroundColor: designTokens?.colors?.primary ?? safeTheme.palette.primary.main,
          '&:hover': {
            backgroundColor: designTokens?.colors?.primary
              ? designTokens?.colors?.primary
              : safeTheme.palette.primary.dark,
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
