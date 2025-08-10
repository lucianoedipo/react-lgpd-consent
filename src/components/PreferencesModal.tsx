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
import { useConsent, useConsentTexts } from '../hooks/useConsent'
import { ConsentPreferences } from '../types/types'
import { Branding } from './Branding'

export interface PreferencesModalProps {
  DialogProps?: Partial<DialogProps>
  hideBranding?: boolean // Se true, esconde "fornecido por LÉdipO.eti.br"
}

export function PreferencesModal({
  DialogProps,
  hideBranding = false,
}: Readonly<PreferencesModalProps>) {
  const { preferences, setPreferences, closePreferences, isModalOpen } =
    useConsent()
  const texts = useConsentTexts()

  // Estado local para mudanças temporárias
  const [tempPreferences, setTempPreferences] =
    useState<ConsentPreferences>(preferences)

  // Sincroniza estado local com contexto quando modal abre
  useEffect(() => {
    if (isModalOpen) {
      setTempPreferences(preferences)
    }
  }, [isModalOpen, preferences])

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
          <FormControlLabel
            control={
              <Switch
                checked={tempPreferences.analytics}
                onChange={(e) =>
                  setTempPreferences((prev) => ({
                    ...prev,
                    analytics: e.target.checked,
                  }))
                }
              />
            }
            label="Cookies Analíticos (medem uso do site)"
          />
          <FormControlLabel
            control={
              <Switch
                checked={tempPreferences.marketing}
                onChange={(e) =>
                  setTempPreferences((prev) => ({
                    ...prev,
                    marketing: e.target.checked,
                  }))
                }
              />
            }
            label="Cookies de Marketing/Publicidade"
          />
          <FormControlLabel
            control={<Switch checked disabled />}
            label={texts.necessaryAlwaysOn}
          />
        </FormGroup>
      </DialogContent>

      {/* Branding */}
      {!hideBranding && <Branding variant="modal" />}

      <DialogActions>
        <Button variant="outlined" onClick={handleCancel}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSave}>
          {texts.save}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
