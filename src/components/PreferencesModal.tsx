import Button from '@mui/material/Button'
import Dialog, { DialogProps } from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { useCategories } from '../context/CategoriesContext'
import { useConsent, useConsentTexts } from '../hooks/useConsent'
import { useDesignTokens } from '../context/DesignContext'
import { ConsentPreferences } from '../types/types'
import { Branding } from './Branding'
import type { Theme, SxProps } from '@mui/material/styles'

/**
 * @interface PreferencesModalProps
 * Propriedades para customizar o componente `PreferencesModal`.
 */
export interface PreferencesModalProps {
  /** Propriedades opcionais para customizar o componente `Dialog` do Material-UI. */
  DialogProps?: Partial<DialogProps>
  /** Se `true`, oculta a marca "fornecido por LÉdipO.eti.br" no modal. Padrão: `false`. */
  hideBranding?: boolean
}

/**
 * O `PreferencesModal` é o componente de UI que permite ao usuário ajustar suas preferências de consentimento.
 * @component
 * @category Components
 * @since 0.1.0
 * @remarks
 * Este modal é renderizado automaticamente pelo `ConsentProvider` quando o usuário clica para gerenciar as preferências.
 * Você pode substituí-lo passando seu próprio componente para a prop `PreferencesModalComponent`
 * no `ConsentProvider` para ter controle total sobre a aparência e o comportamento do modal.
 * @param {Readonly<PreferencesModalProps>} props As propriedades para customizar o modal.
 * @returns {JSX.Element} O componente do modal de preferências.
 * @example
 * ```tsx
 * <PreferencesModal DialogProps={{ maxWidth: 'md' }} hideBranding={true} />
 * ```
 */
export function PreferencesModal({
  DialogProps,
  hideBranding = false,
}: Readonly<PreferencesModalProps>) {
  const { preferences, setPreferences, closePreferences, isModalOpen } = useConsent()
  const texts = useConsentTexts()
  const designTokens = useDesignTokens()
  const { toggleableCategories } = useCategories() // Categorias que precisam de toggle

  // Estado local para mudanças temporárias - INICIALIZADO com valores padrão
  const [tempPreferences, setTempPreferences] = useState<ConsentPreferences>(() => {
    // Inicializa com state atual ou valores padrão seguros
    const initialPrefs: ConsentPreferences = { necessary: true }

    // Para cada categoria que precisa de toggle, define valor inicial
    toggleableCategories.forEach((category) => {
      initialPrefs[category.id] = preferences[category.id] ?? false
    })

    return initialPrefs
  })

  // Sincroniza estado local com contexto quando modal abre ou preferences mudam
  useEffect(() => {
    if (isModalOpen) {
      const syncedPrefs: ConsentPreferences = { necessary: true }

      // Sincroniza apenas categorias ativas que precisam de toggle
      toggleableCategories.forEach((category) => {
        syncedPrefs[category.id] = preferences[category.id] ?? false
      })

      setTempPreferences(syncedPrefs)
    }
  }, [isModalOpen, preferences, toggleableCategories])

  // Se DialogProps.open for fornecido, usa ele. Senão, usa o estado do contexto
  const open = DialogProps?.open ?? isModalOpen ?? false

  const handleSave = () => {
    // Aplica as mudanças temporárias ao contexto definitivo
    setPreferences(tempPreferences)
    // closePreferences já é chamado automaticamente pela ação SET_PREFERENCES
  }

  const handleCancel = () => {
    // Descarta mudanças temporárias
    setTempPreferences(preferences)
    closePreferences()
  }

  const modalTitleSx: SxProps<Theme> = (theme) => ({
    fontSize: designTokens?.typography?.fontSize?.modal ?? undefined,
    color: designTokens?.colors?.text ?? theme.palette.text.primary,
  })

  const modalContentSx: SxProps<Theme> = (theme) => ({
    p: designTokens?.spacing?.padding?.modal ?? undefined,
    backgroundColor: designTokens?.colors?.background ?? theme.palette.background.paper,
    color: designTokens?.colors?.text ?? theme.palette.text.primary,
  })

  return (
    <Dialog aria-labelledby="cookie-pref-title" open={open} onClose={handleCancel} {...DialogProps}>
      <DialogTitle id="cookie-pref-title" sx={modalTitleSx}>
        {texts.modalTitle}
      </DialogTitle>
      <DialogContent dividers sx={modalContentSx}>
        <Typography
          variant="body2"
          sx={(theme) => ({
            mb: 2,
            fontSize: designTokens?.typography?.fontSize?.modal ?? undefined,
            color: designTokens?.colors?.text ?? theme.palette.text.primary,
          })}
        >
          {texts.modalIntro}
        </Typography>
        <FormGroup>
          {/* Renderiza dinamicamente apenas categorias que precisam de toggle */}
          {toggleableCategories.map((category) => (
            <FormControlLabel
              key={category.id}
              control={
                <Switch
                  checked={tempPreferences[category.id] ?? false}
                  onChange={(e) =>
                    setTempPreferences((prev) => ({
                      ...prev,
                      [category.id]: e.target.checked,
                    }))
                  }
                />
              }
              label={`${category.name} - ${category.description}`}
            />
          ))}

          {/* Categoria necessária sempre exibida por último (disabled) */}
          <FormControlLabel control={<Switch checked disabled />} label={texts.necessaryAlwaysOn} />
        </FormGroup>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={handleCancel}>
          {texts.close}
        </Button>
        <Button variant="contained" onClick={handleSave}>
          {texts.save}
        </Button>
      </DialogActions>
      {/* Branding */}
      {!hideBranding && <Branding variant="modal" />}
    </Dialog>
  )
}
