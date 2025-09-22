import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  CssBaseline,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import {
  categorizeDiscoveredCookies,
  ConsentGate,
  ConsentProvider,
  ConsentScriptLoader,
  createGoogleAnalyticsIntegration,
  createGoogleTagManagerIntegration,
  detectConsentCookieName,
  // Novas funcionalidades v0.4.1
  discoverRuntimeCookies,
  resolveTexts,
  TEXT_TEMPLATES,
  useConsent,
  type DesignTokens,
} from 'react-lgpd-consent'

// ===== CONFIGURAÇÕES AVANÇADAS v0.4.1 =====

// Design tokens customizados
const designTokens: DesignTokens = {
  colors: {
    primary: {
      main: '#4CAF50', // Verde sustentável
      light: '#81C784',
      dark: '#388E3C',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FF6F00', // Laranja amigável
      light: '#FF8F00',
      dark: '#E65100',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF',
      overlay: 'rgba(46, 125, 50, 0.4)', // Verde translúcido
    },
  },
  typography: {
    fontSize: {
      h1: '2.5rem',
      h2: '2rem',
    },
    fontWeight: {
      bold: 700,
      semibold: 600,
      normal: 400,
    },
  },
  spacing: {
    scale: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
    },
  },
  layout: {
    borderRadius: '12px',
    width: {
      max: '1200px',
    },
  },
}

// Textos personalizados usando templates avançados
const customTexts = resolveTexts(TEXT_TEMPLATES.ecommerce, {
  variant: 'casual',
  language: 'pt',
})

// Integrações de scripts
const scriptIntegrations = [
  createGoogleAnalyticsIntegration({
    measurementId: 'GA_MEASUREMENT_ID',
  }),
  createGoogleTagManagerIntegration({
    containerId: 'GTM-XXXXXXX',
  }),
]

// ===== COMPONENTES =====

function ConsentStatus() {
  const { consented, preferences, acceptAll, rejectAll, openPreferences } = useConsent()

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        📊 Status do Consentimento
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Chip
          label={consented ? '✅ Consentido' : '❌ Não consentido'}
          color={consented ? 'success' : 'error'}
          variant="filled"
        />
      </Stack>

      <Stack direction="row" flexWrap="wrap" spacing={2} sx={{ mb: 2 }}>
        <Box sx={{ minWidth: '45%' }}>
          <Typography variant="body2">
            <strong>Analytics:</strong> {preferences.analytics ? '✅ Aceito' : '❌ Recusado'}
          </Typography>
        </Box>
        <Box sx={{ minWidth: '45%' }}>
          <Typography variant="body2">
            <strong>Marketing:</strong> {preferences.marketing ? '✅ Aceito' : '❌ Recusado'}
          </Typography>
        </Box>
        <Box sx={{ minWidth: '45%' }}>
          <Typography variant="body2">
            <strong>Functional:</strong> {preferences.functional ? '✅ Aceito' : '❌ Recusado'}
          </Typography>
        </Box>
        <Box sx={{ minWidth: '45%' }}>
          <Typography variant="body2">
            <strong>Social:</strong> {preferences.social ? '✅ Aceito' : '❌ Recusado'}
          </Typography>
        </Box>
      </Stack>

      <Stack direction="row" spacing={2}>
        <Button onClick={acceptAll} variant="contained" color="success" size="small">
          Aceitar Tudo
        </Button>
        <Button onClick={rejectAll} variant="outlined" color="error" size="small">
          Recusar Tudo
        </Button>
        <Button onClick={openPreferences} variant="outlined" size="small">
          Preferências
        </Button>
      </Stack>
    </Paper>
  )
}

function CookieDiscoveryDemo() {
  const [discoveredCookies, setDiscoveredCookies] = useState<any[]>([])
  const [consentCookieName, setConsentCookieName] = useState<string | null>(null)
  const [categorizedCookies, setCategorizedCookies] = useState<any>({})

  const handleDiscoverCookies = () => {
    const cookies = discoverRuntimeCookies()
    setDiscoveredCookies(cookies)

    const consentName = detectConsentCookieName()
    setConsentCookieName(consentName)

    const categorized = categorizeDiscoveredCookies(cookies, false)
    setCategorizedCookies(categorized)
  }

  useEffect(() => {
    // Auto-discover on mount
    handleDiscoverCookies()
  }, [])

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        🔍 Descoberta de Cookies v0.4.1
      </Typography>

      <Button onClick={handleDiscoverCookies} variant="outlined" sx={{ mb: 2 }}>
        Descobrir Cookies
      </Button>

      <Stack spacing={2}>
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Cookie de Consentimento Detectado:
          </Typography>
          <Chip
            label={consentCookieName || 'Não encontrado'}
            color={consentCookieName ? 'success' : 'default'}
            size="small"
          />
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Cookies Descobertos ({discoveredCookies.length}):
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            {discoveredCookies.map((cookie) => (
              <Chip key={cookie.name} label={cookie.name} size="small" variant="outlined" />
            ))}
            {discoveredCookies.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                Nenhum cookie encontrado
              </Typography>
            )}
          </Stack>
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Categorização Automática:
          </Typography>
          {Object.entries(categorizedCookies).map(([category, cookies]: [string, any]) => (
            <Box key={category} sx={{ mb: 1 }}>
              <Typography variant="body2" component="strong">
                {category}: {cookies.length} cookies
              </Typography>
            </Box>
          ))}
        </Box>
      </Stack>
    </Paper>
  )
}

function DesignTokensDemo() {
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        🎨 Design Tokens Customizados v0.4.1
      </Typography>

      <Typography variant="body2" sx={{ mb: 2 }}>
        Esta aplicação usa design tokens customizados para demonstrar a flexibilidade da v0.4.1.
      </Typography>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              p: 2,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              borderRadius: 2,
            }}
          >
            <Typography variant="body2">Cor Primária Customizada</Typography>
          </Box>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              p: 2,
              bgcolor: 'secondary.main',
              color: 'secondary.contrastText',
              borderRadius: 2,
            }}
          >
            <Typography variant="body2">Cor Secundária Customizada</Typography>
          </Box>
        </Box>
      </Stack>
    </Paper>
  )
}

function AdvancedTextDemo() {
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        📝 Sistema Avançado de Textos v0.4.1
      </Typography>

      <Typography variant="body2" sx={{ mb: 2 }}>
        Usando template "ecommerce" com variação "casual" em português:
      </Typography>

      <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="body2">
          <strong>Banner Message:</strong> {customTexts.bannerMessage}
        </Typography>
        <Typography variant="body2">
          <strong>Accept All:</strong> {customTexts.acceptAll}
        </Typography>
      </Box>
    </Paper>
  )
}

// Componente principal da aplicação
function App() {
  return (
    <ConsentProvider
      categories={{ enabledCategories: ['necessary', 'analytics', 'marketing', 'functional'] }}
      texts={customTexts}
      designTokens={designTokens}
      onConsentGiven={(state) => {
        console.log('✅ Consentimento dado:', state)
      }}
      onPreferencesSaved={(preferences) => {
        console.log('💾 Preferências salvas:', preferences)
      }}
      hideBranding={false}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          🍪 React LGPD Consent v0.4.1
        </Typography>

        <Typography variant="h6" component="h2" gutterBottom align="center" color="text.secondary">
          Demonstração das Novas Funcionalidades
        </Typography>

        <Divider sx={{ my: 4 }} />

        <ConsentStatus />

        <CookieDiscoveryDemo />

        <DesignTokensDemo />

        <AdvancedTextDemo />

        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            🎯 Renderização Condicional
          </Typography>

          <ConsentGate category="analytics">
            <Alert severity="success" sx={{ mb: 2 }}>
              ✅ <strong>Analytics aceito!</strong> Este conteúdo só aparece quando analytics está
              habilitado.
            </Alert>
          </ConsentGate>

          <ConsentGate category="marketing">
            <Alert severity="info" sx={{ mb: 2 }}>
              📈 <strong>Marketing aceito!</strong> Este conteúdo só aparece quando marketing está
              habilitado.
            </Alert>
          </ConsentGate>

          <ConsentGate category="functional">
            <Alert severity="warning" sx={{ mb: 2 }}>
              ⚙️ <strong>Funcional aceito!</strong> Este conteúdo só aparece quando funcional está
              habilitado.
            </Alert>
          </ConsentGate>
        </Paper>

        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            📋 Novidades v0.4.1
          </Typography>

          <ul>
            <li>
              <strong>Design Tokens Expandidos:</strong> 200+ pontos de customização
            </li>
            <li>
              <strong>Sistema Avançado de Textos:</strong> i18n, contexts, variants
            </li>
            <li>
              <strong>Descoberta de Cookies:</strong> Detecção automática em runtime
            </li>
            <li>
              <strong>Melhor Cobertura de Testes:</strong> 193 testes passando
            </li>
            <li>
              <strong>Suporte a Múltiplas Categorias:</strong> necessary, analytics, marketing,
              functional, social, personalization
            </li>
          </ul>
        </Paper>

        {/* Script Loader para demonstrar integrações */}
        <ConsentScriptLoader integrations={scriptIntegrations} />
      </Container>
    </ConsentProvider>
  )
}

// Tema Material-UI customizado
const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32',
    },
    secondary: {
      main: '#FF6F00',
    },
  },
  typography: {
    h3: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
})

// Renderização da aplicação
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
