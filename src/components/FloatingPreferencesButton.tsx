import Fab from '@mui/material/Fab'
import type { FabProps } from '@mui/material/Fab'
import Tooltip from '@mui/material/Tooltip'
import SettingsIcon from '@mui/icons-material/Settings'
import { useTheme } from '@mui/material/styles'
import { useConsent } from '../hooks/useConsent'

export interface FloatingPreferencesButtonProps {
  /** Posição do botão flutuante. Padrão: 'bottom-right' */
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
  /** Offset da borda em pixels. Padrão: 24 */
  offset?: number
  /** Ícone customizado. Padrão: SettingsIcon */
  icon?: React.ReactNode
  /** Tooltip customizado */
  tooltip?: string
  /** Props do Fab do MUI */
  FabProps?: Partial<FabProps>
  /** Se deve esconder quando consentimento já foi dado. Padrão: false */
  hideWhenConsented?: boolean
}

export function FloatingPreferencesButton({
  position = 'bottom-right',
  offset = 24,
  icon = <SettingsIcon />,
  tooltip,
  FabProps,
  hideWhenConsented = false,
}: Readonly<FloatingPreferencesButtonProps>) {
  const { openPreferences, consented } = useConsent()
  const theme = useTheme()

  // Se deve esconder quando já consentiu
  if (hideWhenConsented && consented) {
    return null
  }

  const tooltipText = tooltip ?? 'Gerenciar Preferências de Cookies'

  // Define posição baseada na prop
  const getPosition = () => {
    const styles: Record<string, any> = {
      position: 'fixed',
      zIndex: 1200, // Abaixo do modal mas acima do conteúdo
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
          backgroundColor: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          },
        }}
        aria-label={tooltipText}
        {...FabProps}
      >
        {icon}
      </Fab>
    </Tooltip>
  )
}
