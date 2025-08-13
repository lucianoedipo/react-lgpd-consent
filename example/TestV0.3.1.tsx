import React from 'react'
import {
  ConsentProvider,
  useConsent,
  useOpenPreferencesModal,
  openPreferencesModal,
  setDebugLogging,
  LogLevel,
  type CustomCookieBannerProps,
  type CustomPreferencesModalProps,
  type CustomFloatingPreferencesButtonProps,
} from 'react-lgpd-consent'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import {
  Button,
  Paper,
  Typography,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  Switch,
  FormControlLabel,
  Alert,
} from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'

// Habilitar debug para demonstração
setDebugLogging(true, LogLevel.DEBUG)

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
})

// Exemplo de banner customizado
function CustomCookieBanner({
  consented,
  acceptAll,
  rejectAll,
  openPreferences,
  texts,
}: CustomCookieBannerProps) {
  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        p: 2,
        zIndex: 1300,
      }}
    >
      <Alert severity="info" sx={{ mb: 1 }}>
        <Typography variant="body2">{texts.bannerMessage}</Typography>
      </Alert>
      <Stack direction="row" spacing={1} justifyContent="flex-end">
        <Button onClick={rejectAll} variant="outlined">
          {texts.declineAll}
        </Button>
        <Button onClick={openPreferences} variant="text">
          {texts.preferencesButton || texts.preferences}
        </Button>
        <Button onClick={acceptAll} variant="contained">
          {texts.acceptAll}
        </Button>
      </Stack>
    </Paper>
  )
}

// Exemplo de modal de preferências customizado
function CustomPreferencesModal({
  preferences,
  setPreferences,
  closePreferences,
  isModalOpen,
  texts,
}: CustomPreferencesModalProps) {
  const handleChange = (category: string, value: boolean) => {
    setPreferences({
      ...preferences,
      [category]: value,
    })
  }

  return (
    <Dialog
      open={isModalOpen || false}
      onClose={closePreferences}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{texts.preferencesTitle || texts.modalTitle}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {texts.preferencesDescription || texts.modalIntro}
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={preferences.necessary || false}
                disabled={true} // Sempre obrigatório
              />
            }
            label="Cookies Necessários (obrigatório)"
          />

          <FormControlLabel
            control={
              <Switch
                checked={preferences.analytics || false}
                onChange={(_, checked) => handleChange('analytics', checked)}
              />
            }
            label="Cookies Analíticos"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={closePreferences}>{texts.close || 'Fechar'}</Button>
      </DialogActions>
    </Dialog>
  )
}

// Exemplo de botão flutuante customizado (não usado pois foi desabilitado)
function CustomFloatingPreferencesButton({
  openPreferences,
  consented,
}: CustomFloatingPreferencesButtonProps) {
  return (
    <Fab
      sx={{ position: 'fixed', bottom: 16, right: 16 }}
      onClick={openPreferences}
      color="secondary"
    >
      <SettingsIcon />
    </Fab>
  )
}

// AccessibilityDock com controle programático
function AccessibilityDock() {
  const openModal = useOpenPreferencesModal()
  const { consented, preferences } = useConsent()

  return (
    <Paper
      sx={{
        position: 'fixed',
        top: 16,
        right: 16,
        p: 2,
        minWidth: 200,
        zIndex: 1200,
      }}
    >
      <Typography variant="h6" gutterBottom>
        🔧 Acessibilidade
      </Typography>

      <Stack spacing={1}>
        <Button
          onClick={openModal}
          variant="outlined"
          size="small"
          startIcon={<SettingsIcon />}
        >
          Configurar Cookies
        </Button>

        <Typography variant="caption" color="text.secondary">
          Status: {consented ? '✅ Configurado' : '⚠️ Pendente'}
        </Typography>

        {consented && (
          <Typography variant="caption">
            Analytics: {preferences.analytics ? '✅' : '❌'}
          </Typography>
        )}
      </Stack>
    </Paper>
  )
}

// JavaScript puro para demonstrar API global
function setupGlobalButton() {
  setTimeout(() => {
    const button = document.createElement('button')
    button.textContent = '🍪 Abrir via JS Puro'
    button.style.position = 'fixed'
    button.style.top = '100px'
    button.style.right = '16px'
    button.style.zIndex = '1300'
    button.addEventListener('click', () => {
      // Usar função global
      openPreferencesModal()
    })
    document.body.appendChild(button)
  }, 1000)
}

// Componente principal
function App() {
  React.useEffect(() => {
    setupGlobalButton()
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <ConsentProvider
        categories={{
          enabledCategories: ['analytics'],
        }}
        // Nova funcionalidade: desabilitar botão flutuante padrão
        disableFloatingPreferencesButton={true}
        // Componentes customizados
        CookieBannerComponent={CustomCookieBanner}
        PreferencesModalComponent={CustomPreferencesModal}
        texts={{
          bannerMessage:
            'Utilizamos cookies para melhorar sua experiência e analisar o uso do site.',
          acceptAll: 'Aceitar Todos',
          declineAll: 'Recusar Todos',
          preferences: 'Configurar', // Usa campo padrão
          preferencesButton: 'Configurar', // Campo adicional para compatibilidade
          preferencesTitle: 'Configurações de Cookies',
          preferencesDescription:
            'Escolha quais tipos de cookies você permite:',
          close: 'Fechar',
          modalTitle: 'Configurações de Cookies', // Fallback
          modalIntro: 'Escolha quais tipos de cookies você permite:', // Fallback
        }}
        onConsentGiven={(state) => {
          console.log('🎉 Consentimento dado:', state)
        }}
        onPreferencesSaved={(prefs) => {
          console.log('💾 Preferências salvas:', prefs)
        }}
      >
        <div style={{ padding: '20px', paddingBottom: '100px' }}>
          <Typography variant="h4" gutterBottom>
            Exemplo react-lgpd-consent v0.3.1
          </Typography>

          <Typography variant="body1" paragraph>
            Esta demonstração mostra as correções implementadas na v0.3.1:
          </Typography>

          <Stack spacing={2}>
            <Alert severity="success">
              ✅ <strong>Theme Provider Compatibility:</strong> Funcionando com
              fallbacks seguros
            </Alert>

            <Alert severity="success">
              ✅ <strong>FloatingPreferencesButton:</strong> Desabilitado via
              prop, usando AccessibilityDock customizado
            </Alert>

            <Alert severity="success">
              ✅ <strong>Controle Programático:</strong> Hook
              useOpenPreferencesModal() + função global openPreferencesModal()
            </Alert>

            <Alert severity="success">
              ✅ <strong>TypeScript Types:</strong> Todos os Custom*Props
              exportados
            </Alert>

            <Alert severity="info">
              🐛 <strong>Debug Logging:</strong> Ativado - verifique o console
              do navegador
            </Alert>
          </Stack>
        </div>

        <AccessibilityDock />
      </ConsentProvider>
    </ThemeProvider>
  )
}

export default App
