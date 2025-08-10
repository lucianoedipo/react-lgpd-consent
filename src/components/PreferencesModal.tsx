import Button from '@mui/material/Button'
import Dialog, { DialogProps } from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import { useConsent, useConsentTexts } from '../hooks/useConsent'

export interface PreferencesModalProps {
  DialogProps?: Partial<DialogProps>
}

export function PreferencesModal({
  DialogProps,
}: Readonly<PreferencesModalProps>) {
  const { preferences, setPreference, closePreferences, isModalOpen } =
    useConsent()
  const texts = useConsentTexts()

  // Usa o estado do contexto como padrão, mas permite override via DialogProps
  const open = DialogProps?.open ?? isModalOpen ?? false

  return (
    <Dialog
      aria-labelledby="cookie-pref-title"
      open={open}
      onClose={closePreferences}
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
                checked={preferences.analytics}
                onChange={(e) => setPreference('analytics', e.target.checked)}
              />
            }
            label="Cookies Analíticos (medem uso do site)"
          />
          <FormControlLabel
            control={
              <Switch
                checked={preferences.marketing}
                onChange={(e) => setPreference('marketing', e.target.checked)}
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
      <DialogActions>
        <Button variant="contained" onClick={closePreferences}>
          {texts.save}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
