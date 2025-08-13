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
import { ConsentPreferences } from '../types/types'
import { Branding } from './Branding'

/**
 * Props para o componente PreferencesModal.
 *
 * @property DialogProps Props opcionais para customizar o Dialog do Material-UI.
 * @property hideBranding Se true, oculta o branding "fornecido por LÉdipO.eti.br".
 */
export interface PreferencesModalProps {
  DialogProps?: Partial<DialogProps>
  hideBranding?: boolean // Se true, esconde "fornecido por LÉdipO.eti.br"
}

/**
 * Modal de preferências de cookies.
 *
 * Permite ao usuário ajustar suas preferências de consentimento para cookies analíticos e de marketing.
 * Utiliza Material-UI Dialog, switches para cada categoria e textos customizáveis via contexto.
 * Acessível, responsivo e compatível com SSR.
 *
 * @param props Props do modal, incluindo customização do Dialog e opção de ocultar branding.
 */
export function PreferencesModal({
  DialogProps,
  hideBranding = false,
}: Readonly<PreferencesModalProps>) {
  const { preferences, setPreferences, closePreferences, isModalOpen } =
    useConsent()
  const texts = useConsentTexts()
  const { toggleableCategories } = useCategories() // Categorias que precisam de toggle

  // Estado local para mudanças temporárias - INICIALIZADO com valores padrão
  const [tempPreferences, setTempPreferences] = useState<ConsentPreferences>(
    () => {
      // Inicializa com state atual ou valores padrão seguros
      const initialPrefs: ConsentPreferences = { necessary: true }

      // Para cada categoria que precisa de toggle, define valor inicial
      toggleableCategories.forEach((category) => {
        initialPrefs[category.id] = preferences[category.id] ?? false
      })

      return initialPrefs
    },
  )

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

  return (
    <Dialog
      aria-labelledby="cookie-pref-title"
      open={open}
      onClose={handleCancel}
      {...DialogProps}
    >
      <DialogTitle id="cookie-pref-title">{texts.modalTitle}</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" sx={{ mb: 2 }}>
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
          <FormControlLabel
            control={<Switch checked disabled />}
            label={texts.necessaryAlwaysOn}
          />
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
