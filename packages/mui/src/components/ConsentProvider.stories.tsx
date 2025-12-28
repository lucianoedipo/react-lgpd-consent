import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  ThemeProvider,
  Typography,
} from '@mui/material'
import { createTheme } from '@mui/material/styles'
import {
  ConsentProvider,
  resolveTexts,
  TEXT_TEMPLATES,
  useConsent,
  type DesignTokens,
} from '@react-lgpd-consent/mui'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { PreferencesModal } from './PreferencesModal'

const meta: Meta<typeof ConsentProvider> = {
  title: 'Components/ConsentProvider',
  component: ConsentProvider,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'O componente principal que gerencia o estado de consentimento LGPD e renderiza a UI de cookies.',
      },
    },
  },
  argTypes: {
    categories: {
      control: 'object',
      description: 'Configuração das categorias de cookies ativas no projeto',
    },
    blocking: {
      control: 'boolean',
      description: 'Se true, exibe overlay bloqueando interação até decisão do usuário',
    },
    blockingStrategy: {
      control: { type: 'select' },
      options: ['auto', 'provider', 'component'],
      description: 'Estratégia de bloqueio quando blocking está ativo',
    },
    blockingMode: {
      control: { type: 'select' },
      options: ['soft', 'hard'],
      description: 'Intensidade do bloqueio (soft = overlay, hard = conteúdo inerte)',
    },
    hideBranding: {
      control: 'boolean',
      description: 'Se true, oculta branding da biblioteca',
    },
    disableFloatingPreferencesButton: {
      control: 'boolean',
      description: 'Se true, desabilita o botão flutuante de preferências',
    },
    texts: {
      control: 'object',
      description: 'Textos customizados para a interface',
    },
    designTokens: {
      control: 'object',
      description: 'Tokens de design para personalização visual (cores, layout, tipografia)',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Componente interno para demonstrar o estado
const ConsentDemo = () => {
  const { preferences, consented, acceptAll, rejectAll, openPreferences, resetConsent } =
    useConsent()

  return (
    <Box sx={{ p: 3, minHeight: '50vh', bgcolor: 'grey.50' }}>
      <Typography variant="h4" gutterBottom color="primary.main" fontWeight="bold">
        Demonstração do Sistema de Consentimento LGPD
      </Typography>

      <Stack spacing={3} sx={{ mb: 4 }}>
        {/* Status Card */}
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="text.primary" fontWeight="medium">
              📊 Status do Consentimento
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Chip
                label={consented ? 'Consentimento Dado' : 'Aguardando Decisão'}
                color={consented ? 'success' : 'warning'}
                icon={<span>{consented ? '✅' : '⏳'}</span>}
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Preferences Card */}
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="text.primary" fontWeight="medium">
              🍪 Preferências por Categoria
            </Typography>
            <Stack spacing={2}>
              {Object.entries(preferences).map(([category, accepted]) => (
                <Stack
                  key={category}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body1" fontWeight="medium">
                    {category}
                  </Typography>
                  <Chip
                    label={accepted ? 'Aceito' : 'Rejeitado'}
                    size="small"
                    color={accepted ? 'success' : 'default'}
                    variant={accepted ? 'filled' : 'outlined'}
                  />
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button variant="contained" onClick={acceptAll} color="success">
          ✅ Aceitar Todos
        </Button>
        <Button variant="outlined" onClick={rejectAll} color="error">
          ❌ Rejeitar Todos
        </Button>
        <Button variant="outlined" onClick={openPreferences} color="primary">
          ⚙️ Abrir Preferências
        </Button>
        <Button variant="outlined" color="warning" onClick={resetConsent}>
          Reset (mostrar banner novamente)
        </Button>
      </Box>
    </Box>
  )
}

export const Default: Story = {
  args: {
    categories: {
      enabledCategories: ['analytics', 'marketing'],
    },
  },
  render: (args) => (
    <ConsentProvider {...args} PreferencesModalComponent={PreferencesModal}>
      <ConsentDemo />
    </ConsentProvider>
  ),
}

export const WithBlocking: Story = {
  args: {
    categories: {
      enabledCategories: ['analytics', 'marketing'],
    },
    blocking: true,
    blockingStrategy: 'provider',
  },
  render: (args) => (
    <ConsentProvider {...args} PreferencesModalComponent={PreferencesModal}>
      <ConsentDemo />
    </ConsentProvider>
  ),
}

export const HardBlocking: Story = {
  args: {
    categories: {
      enabledCategories: ['analytics', 'marketing'],
    },
    blocking: true,
    blockingMode: 'hard',
    blockingStrategy: 'provider',
  },
  render: (args) => (
    <ConsentProvider {...args} PreferencesModalComponent={PreferencesModal}>
      <ConsentDemo />
    </ConsentProvider>
  ),
}

export const CustomTexts: Story = {
  args: {
    categories: {
      enabledCategories: ['analytics'],
    },
    texts: {
      bannerMessage: 'Este site usa cookies para melhorar sua experiência. Você aceita?',
      acceptAll: 'Sim, aceito',
      declineAll: 'Não, obrigado',
      preferences: 'Personalizar',
      modalTitle: 'Configurações de Cookies',
    },
  },
  render: (args) => (
    <ConsentProvider {...args} PreferencesModalComponent={PreferencesModal}>
      <ConsentDemo />
    </ConsentProvider>
  ),
}

export const MinimalSetup: Story = {
  args: {
    categories: {
      enabledCategories: ['analytics'],
    },
    hideBranding: true,
    disableFloatingPreferencesButton: true,
  },
  render: (args) => (
    <ConsentProvider {...args} PreferencesModalComponent={PreferencesModal}>
      <ConsentDemo />
    </ConsentProvider>
  ),
}

export const ECommerce: Story = {
  args: {
    categories: {
      enabledCategories: ['analytics', 'marketing'],
    },
    texts: {
      bannerMessage:
        'Usamos cookies para melhorar sua experiência de compra e exibir ofertas personalizadas.',
      acceptAll: 'Aceitar e continuar',
      declineAll: 'Apenas essenciais',
    },
  },
  render: (args) => (
    <ConsentProvider {...args} PreferencesModalComponent={PreferencesModal}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          🛒 Loja Virtual
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Exemplo de integração em um e-commerce com cookies de analytics, marketing e advertising.
        </Typography>
        <ConsentDemo />
      </Box>
    </ConsentProvider>
  ),
}

export const Corporate: Story = {
  args: {
    categories: {
      enabledCategories: ['analytics', 'functional'],
    },
    blocking: true,
    blockingStrategy: 'provider',
    texts: {
      bannerMessage:
        'Este sistema corporativo utiliza cookies para funcionalidade e análise. Sua decisão é obrigatória.',
      acceptAll: 'Autorizar',
      declineAll: 'Recusar',
      preferences: 'Configurar',
    },
  },
  render: (args) => (
    <ConsentProvider {...args} PreferencesModalComponent={PreferencesModal}>
      <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: '50vh' }}>
        <Typography variant="h4" gutterBottom>
          🏢 Sistema Corporativo
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Exemplo de integração corporativa com controle rigoroso e bloqueio obrigatório.
        </Typography>
        <ConsentDemo />
      </Box>
    </ConsentProvider>
  ),
}

export const DarkTheme: Story = {
  args: {
    categories: { enabledCategories: ['analytics', 'marketing'] },
  },
  render: (args) => (
    <ThemeProvider theme={createTheme({ palette: { mode: 'dark' } })}>
      <ConsentProvider {...args} PreferencesModalComponent={PreferencesModal}>
        <Box sx={{ p: 3, bgcolor: '#121212', color: 'white', minHeight: '50vh' }}>
          <ConsentDemo />
        </Box>
      </ConsentProvider>
    </ThemeProvider>
  ),
}

export const WithCustomCategories: Story = {
  args: {
    categories: {
      enabledCategories: ['analytics'],
      customCategories: [
        { id: 'chat', name: 'Chat de Suporte', description: 'Widget de chat' },
        { id: 'video', name: 'Vídeo', description: 'Players incorporados' },
      ],
    },
  },
  render: (args) => (
    <ConsentProvider {...args} PreferencesModalComponent={PreferencesModal}>
      <ConsentDemo />
    </ConsentProvider>
  ),
}

// =====  =====

// Dashboard aprimorado para ConsentProvider
const EnhancedConsentDashboard = () => {
  const { preferences, consented, acceptAll, rejectAll, openPreferences, resetConsent } =
    useConsent()

  return (
    <Stack spacing={3}>
      <Card elevation={2}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            🛡️ Sistema de Consentimento LGPD
          </Typography>

          <Alert severity={consented ? 'success' : 'warning'} sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Status:</strong>{' '}
              {consented ? '✅ Consentimento configurado' : '⏳ Aguardando decisão do usuário'}
            </Typography>
          </Alert>

          <Typography variant="h6" gutterBottom>
            📊 Preferências Ativas
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} sx={{ mb: 3 }}>
            {Object.entries(preferences).map(([category, enabled]) => (
              <Chip
                key={category}
                label={`${category}: ${enabled ? '✅' : '❌'}`}
                size="small"
                color={enabled ? 'success' : 'default'}
                variant={enabled ? 'filled' : 'outlined'}
              />
            ))}
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            🎛️ Controles
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" gap={1}>
            <Button variant="contained" onClick={acceptAll} size="small">
              Aceitar Todos
            </Button>
            <Button variant="outlined" onClick={rejectAll} size="small">
              Rejeitar Todos
            </Button>
            <Button variant="outlined" onClick={openPreferences} size="small">
              Configurar
            </Button>
            <Button variant="outlined" color="warning" onClick={resetConsent} size="small">
              Reset
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}

export const WithAdvancedTextSystem: Story = {
  args: {
    categories: {
      enabledCategories: ['analytics', 'marketing', 'functional'],
    },
    texts: resolveTexts(TEXT_TEMPLATES.government, {
      variant: 'formal',
      language: 'pt',
    }),
  },
  render: (args) => (
    <ConsentProvider {...args} PreferencesModalComponent={PreferencesModal}>
      <Box sx={{ p: 3, bgcolor: '#f8fffe' }}>
        <Typography variant="h4" gutterBottom color="primary">
          �️ Sistema de Textos Avançado v0.4.1
        </Typography>

        <Card elevation={1} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Template: Government
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              <Chip label="Template: government" size="small" color="info" />
              <Chip label="Variant: formal" size="small" color="secondary" />
              <Chip label="Language: pt" size="small" color="success" />
            </Stack>
          </CardContent>
        </Card>

        <EnhancedConsentDashboard />
      </Box>
    </ConsentProvider>
  ),
}

export const WithCustomDesignTokens: Story = {
  args: {
    categories: {
      enabledCategories: ['analytics', 'marketing', 'functional'],
    },
    designTokens: {
      colors: {
        primary: {
          main: '#d97706', // Orange
          light: '#f59e0b',
          dark: '#b45309',
        },
        secondary: {
          main: '#0369a1', // Blue
          light: '#0ea5e9',
          dark: '#0c4a6e',
        },
      },
      layout: {
        position: 'center',
        backdrop: 'rgba(0, 0, 0, 0.8)',
      },
    } as DesignTokens,
  },
  render: (args) => (
    <ConsentProvider {...args} PreferencesModalComponent={PreferencesModal}>
      <Box sx={{ p: 3, bgcolor: '#fef3c7', minHeight: '100vh' }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#d97706' }}>
          🎨 Design Tokens Personalizados v0.4.1
        </Typography>

        <Card elevation={2} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Customizações Aplicadas
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              <Chip
                label="Primary: Orange"
                size="small"
                sx={{ bgcolor: '#d97706', color: 'white' }}
              />
              <Chip
                label="Secondary: Blue"
                size="small"
                sx={{ bgcolor: '#0369a1', color: 'white' }}
              />
              <Chip label="Position: center" size="small" color="info" />
              <Chip label="Backdrop: Custom" size="small" color="warning" />
            </Stack>
          </CardContent>
        </Card>

        <EnhancedConsentDashboard />
      </Box>
    </ConsentProvider>
  ),
}

export const CompleteIntegrationDemo: Story = {
  args: {
    categories: {
      enabledCategories: ['necessary', 'analytics', 'marketing', 'functional', 'social'],
      customCategories: [
        {
          id: 'ai',
          name: 'Inteligência Artificial',
          description: 'Recursos de IA para recomendações personalizadas',
        },
        {
          id: 'geolocation',
          name: 'Geolocalização',
          description: 'Serviços baseados em localização',
        },
      ],
    },
    texts: resolveTexts(TEXT_TEMPLATES.saas, {
      variant: 'casual',
      language: 'pt',
    }),
    blocking: true,
    blockingStrategy: 'provider',
  },
  render: (args) => (
    <ConsentProvider {...args} PreferencesModalComponent={PreferencesModal}>
      <Box sx={{ p: 3, bgcolor: '#f0f4f8' }}>
        <Typography variant="h4" gutterBottom color="primary">
          🚀 Integração Completa v0.4.1
        </Typography>

        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Demonstração Completa:</strong> 7 categorias (5 padrão + 2 customizadas),
            sistema de textos SaaS casual, bloqueio ativo com estratégia provider.
          </Typography>
        </Alert>

        <Card elevation={1} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              📋 Configuração Ativa
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              <Chip label="7 Categorias" size="small" color="primary" />
              <Chip label="Template: SaaS" size="small" color="secondary" />
              <Chip label="Variant: casual" size="small" color="success" />
              <Chip label="Blocking: ✅" size="small" color="warning" />
              <Chip label="Strategy: provider" size="small" color="info" />
            </Stack>
          </CardContent>
        </Card>

        <EnhancedConsentDashboard />
      </Box>
    </ConsentProvider>
  ),
}
