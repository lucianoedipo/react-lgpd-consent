import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  DialogProps,
  Divider,
  Stack,
  Typography,
} from '@mui/material'
import { createTheme } from '@mui/material/styles'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConsentProvider } from '../context/ConsentContext'
import { useConsent } from '../hooks/useConsent'
import { resolveTexts, TEXT_TEMPLATES, type DesignTokens } from '../index'
import { PreferencesModal } from './PreferencesModal'
type StoryArgs = {
  DialogProps?: Partial<DialogProps>
  hideBranding?: boolean
  openModal?: boolean
}

const meta: Meta<typeof PreferencesModal> = {
  title: 'Components/PreferencesModal',
  component: PreferencesModal,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Modal de preferências que permite ao usuário gerenciar suas configurações de cookies por categoria.',
      },
    },
  },
  argTypes: {
    hideBranding: { control: 'boolean' },
    // desabilita edição direta do objeto DialogProps para evitar o prompt de salvar alterações
    DialogProps: { control: false },
    openModal: {
      control: 'boolean',
      description: 'Abrir/fechar o modal (mapeado para DialogProps.open)',
    },
  } as unknown as any,
  args: {
    hideBranding: false,
    DialogProps: { open: false },
    openModal: false,
  } as unknown as any,
}

export default meta
type Story = StoryObj<StoryArgs>

// Componente de demonstração que integra o modal
const ModalDemo = () => {
  const { openPreferences, preferences, isModalOpen } = useConsent()

  return (
    <Box sx={{ p: 3, minHeight: '50vh' }}>
      <Typography variant="h4" gutterBottom color="primary">
        🎛️ Modal de Preferências
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Interface para configuração detalhada de consentimento por categoria.
      </Typography>

      <Card elevation={2} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📊 Status Atual
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
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
        </CardContent>
      </Card>

      <Stack direction="row" spacing={2} alignItems="center">
        <Button variant="contained" onClick={openPreferences} disabled={isModalOpen}>
          {isModalOpen ? '🔓 Modal Aberto' : '⚙️ Configurar Preferências'}
        </Button>
        <Typography variant="body2" color={isModalOpen ? 'success.main' : 'text.secondary'}>
          {isModalOpen
            ? 'Modal ativo - configurações disponíveis'
            : 'Clique para abrir configurações'}
        </Typography>
      </Stack>
    </Box>
  )
}

export const Default: Story = {
  render: (args: StoryArgs) => {
    const dialogProps = { ...(args.DialogProps ?? {}), open: !!args.openModal }
    return (
      <ConsentProvider categories={{ enabledCategories: ['analytics', 'marketing'] }}>
        <ModalDemo />
        <PreferencesModal {...args} DialogProps={dialogProps} />
      </ConsentProvider>
    )
  },
}

export const WithAllCategories: Story = {
  render: (args: StoryArgs) => {
    const dialogProps = { ...(args.DialogProps ?? {}), open: !!args.openModal }
    return (
      <ConsentProvider
        categories={{
          enabledCategories: ['analytics', 'marketing', 'functional', 'social'],
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Todas as Categorias
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Modal com todas as categorias de cookies disponíveis.
          </Typography>
          <ModalDemo />
        </Box>
        <PreferencesModal {...args} DialogProps={dialogProps} />
      </ConsentProvider>
    )
  },
}

export const CustomTexts: Story = {
  render: (args: StoryArgs) => {
    const dialogProps = { ...(args.DialogProps ?? {}), open: !!args.openModal }
    return (
      <ConsentProvider
        categories={{ enabledCategories: ['analytics', 'functional'] }}
        texts={{
          modalTitle: '🍪 Configurações de Cookies',
          modalIntro: 'Personalize sua experiência escolhendo quais cookies você permite:',
          save: '💾 Salvar Configurações',
          necessaryAlwaysOn: '🔒 Sempre Ativo',
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Textos Personalizados
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Modal com textos customizados e emojis para uma experiência mais amigável.
          </Typography>
          <ModalDemo />
        </Box>
        <PreferencesModal {...args} DialogProps={dialogProps} />
      </ConsentProvider>
    )
  },
}

export const ECommerceExample: Story = {
  render: (args: StoryArgs) => {
    const dialogProps = { ...(args.DialogProps ?? {}), open: !!args.openModal }
    return (
      <ConsentProvider
        categories={{ enabledCategories: ['analytics', 'marketing'] }}
        texts={{
          modalTitle: 'Configurações de Cookies da Loja',
          modalIntro: 'Gerencie como coletamos dados para melhorar sua experiência de compra:',
          save: 'Salvar e Continuar Comprando',
        }}
      >
        <Box sx={{ p: 3, bgcolor: '#f9f9f9', minHeight: '50vh' }}>
          <Typography variant="h4" gutterBottom>
            🛒 Loja Online
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Exemplo de modal de preferências adaptado para e-commerce.
          </Typography>
          <ModalDemo />
        </Box>
        <PreferencesModal {...args} DialogProps={dialogProps} />
      </ConsentProvider>
    )
  },
}

export const CorporateExample: Story = {
  render: (args: StoryArgs) => {
    const dialogProps = { ...(args.DialogProps ?? {}), open: !!args.openModal }
    return (
      <ConsentProvider
        categories={{ enabledCategories: ['analytics', 'functional'] }}
        texts={{
          modalTitle: 'Política de Cookies Corporativa',
          modalIntro: 'Configure suas preferências de acordo com nossa política de dados:',
          save: 'Confirmar Configurações',
        }}
        hideBranding={true}
      >
        <Box sx={{ p: 3, bgcolor: '#e8f5e8', minHeight: '50vh' }}>
          <Typography variant="h4" gutterBottom>
            🏢 Sistema Corporativo
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Modal com linguagem formal para ambiente corporativo.
          </Typography>
          <ModalDemo />
        </Box>
        <PreferencesModal {...args} DialogProps={dialogProps} />
      </ConsentProvider>
    )
  },
}

export const InteractiveDemo: Story = {
  args: {
    hideBranding: true,
  },
  render: (args: StoryArgs) => {
    const dialogProps = { ...(args.DialogProps ?? {}), open: !!args.openModal }
    return (
      <ConsentProvider categories={{ enabledCategories: ['analytics', 'marketing'] }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Demo Interativo
          </Typography>

          <Typography variant="body1" sx={{ mb: 3 }}>
            Este exemplo mostra como o modal permite gerenciar preferências de cookies em tempo
            real.
          </Typography>

          <ModalDemo />
        </Box>
        <PreferencesModal {...args} DialogProps={dialogProps} />
      </ConsentProvider>
    )
  },
}

export const DarkTheme: Story = {
  args: {
    hideBranding: false,
    openModal: false,
  },
  render: (args: StoryArgs) => {
    const dialogProps = { ...(args.DialogProps ?? {}) }
    return (
      <ConsentProvider
        categories={{ enabledCategories: ['analytics', 'marketing'] }}
        theme={createTheme({ palette: { mode: 'dark' } })}
      >
        <Box sx={{ p: 3, bgcolor: '#121212', minHeight: '50vh', color: 'white' }}>
          <Typography variant="h4" gutterBottom color="white">
            Tema Escuro - Modal
          </Typography>
          <ModalDemo />
        </Box>
        <PreferencesModal {...args} DialogProps={dialogProps} />
      </ConsentProvider>
    )
  },
}

// ===== NOVOS STORIES v0.4.1 =====

// Modal Demo melhorado para v0.4.1
const EnhancedModalDemo = () => {
  const { openPreferences, preferences, isModalOpen, consented } = useConsent()

  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          🎛️ Controle de Preferências v0.4.1
        </Typography>

        <Alert severity={consented ? 'success' : 'warning'} sx={{ mb: 2 }}>
          <Typography variant="body2">
            Status: {consented ? '✅ Consentimento configurado' : '⏳ Aguardando configuração'}
          </Typography>
        </Alert>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Categorias Ativas:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
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
        </Box>

        <Divider sx={{ my: 2 }} />

        <Button variant="contained" onClick={openPreferences} disabled={isModalOpen} fullWidth>
          {isModalOpen ? '🔓 Modal Aberto' : '⚙️ Abrir Configurações'}
        </Button>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Interface aprimorada com status visual e categorização inteligente
        </Typography>
      </CardContent>
    </Card>
  )
}

export const WithAdvancedTextSystem: Story = {
  args: {
    hideBranding: false,
    openModal: false,
  },
  render: (args: StoryArgs) => {
    const saasTexts = resolveTexts(TEXT_TEMPLATES.saas, {
      variant: 'formal',
      language: 'pt',
    })

    const dialogProps = { ...(args.DialogProps ?? {}) }
    return (
      <ConsentProvider
        categories={{
          enabledCategories: ['analytics', 'functional', 'marketing'],
        }}
        texts={saasTexts}
      >
        <Box sx={{ p: 3, bgcolor: '#f5f7fa' }}>
          <Typography variant="h4" gutterBottom color="primary">
            📝 Sistema Avançado de Textos v0.4.1
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Modal usando template SaaS formal com sistema avançado de textos.
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mb: 3 }} flexWrap="wrap" gap={1}>
            <Chip label="Template: SaaS" size="small" color="primary" />
            <Chip label="Variant: formal" size="small" color="secondary" />
            <Chip label="Language: pt" size="small" color="success" />
            <Chip label="i18n Ready" size="small" color="info" />
          </Stack>

          <EnhancedModalDemo />
        </Box>
        <PreferencesModal {...args} DialogProps={dialogProps} />
      </ConsentProvider>
    )
  },
}

export const WithCustomDesignTokens: Story = {
  args: {
    hideBranding: false,
    openModal: false,
  },
  render: (args: StoryArgs) => {
    const modernDesignTokens: DesignTokens = {
      colors: {
        primary: {
          main: '#6366f1', // Indigo moderno
          light: '#a5b4fc',
          dark: '#4338ca',
        },
        secondary: {
          main: '#f59e0b', // Amber
          light: '#fbbf24',
          dark: '#d97706',
        },
        background: {
          main: '#f8fafc',
          paper: '#ffffff',
        },
      },
      spacing: {
        padding: {
          modal: { x: '32px', y: '24px' },
        },
        borderRadius: {
          modal: '16px',
        },
      },
      typography: {
        fontSize: {
          modal: {
            title: '24px',
            body: '16px',
            button: '14px',
          },
        },
        fontWeight: {
          medium: 500,
          semibold: 600,
        },
      },
    }

    const dialogProps = { ...(args.DialogProps ?? {}) }
    return (
      <ConsentProvider
        categories={{
          enabledCategories: ['analytics', 'marketing', 'functional'],
        }}
        designTokens={modernDesignTokens}
      >
        <Box sx={{ p: 3, bgcolor: '#f8fafc' }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#6366f1' }}>
            🎨 Design Tokens Customizados v0.4.1
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Modal com design tokens personalizados para uma experiência visual única.
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mb: 3 }} flexWrap="wrap" gap={1}>
            <Chip
              label="Primary: Indigo"
              size="small"
              sx={{ bgcolor: '#6366f1', color: 'white' }}
            />
            <Chip
              label="Secondary: Amber"
              size="small"
              sx={{ bgcolor: '#f59e0b', color: 'white' }}
            />
            <Chip label="Custom Spacing" size="small" color="info" />
            <Chip label="Modern Typography" size="small" color="success" />
          </Stack>

          <EnhancedModalDemo />
        </Box>
        <PreferencesModal {...args} DialogProps={dialogProps} />
      </ConsentProvider>
    )
  },
}

export const MultipleCategories: Story = {
  args: {
    hideBranding: false,
    openModal: false,
  },
  render: (args: StoryArgs) => {
    const dialogProps = { ...(args.DialogProps ?? {}) }
    return (
      <ConsentProvider
        categories={{
          enabledCategories: ['necessary', 'analytics', 'marketing', 'functional', 'social'],
          customCategories: [
            {
              id: 'personalization',
              name: 'Personalização',
              description: 'Cookies para personalizar sua experiência baseada em suas preferências',
            },
            {
              id: 'support',
              name: 'Suporte',
              description: 'Ferramentas de chat e suporte ao cliente',
            },
          ],
        }}
      >
        <Box sx={{ p: 3, bgcolor: '#fff9e6' }}>
          <Typography variant="h4" gutterBottom color="warning.dark">
            🔧 Múltiplas Categorias v0.4.1
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Modal com todas as categorias padrão + categorias customizadas.
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Categorias Disponíveis:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              <Chip label="necessary" size="small" color="error" variant="outlined" />
              <Chip label="analytics" size="small" color="info" variant="outlined" />
              <Chip label="marketing" size="small" color="secondary" variant="outlined" />
              <Chip label="functional" size="small" color="success" variant="outlined" />
              <Chip label="social" size="small" color="primary" variant="outlined" />
              <Chip label="personalization" size="small" color="warning" variant="outlined" />
              <Chip label="support" size="small" sx={{ bgcolor: '#e3f2fd' }} variant="outlined" />
            </Stack>
          </Box>

          <EnhancedModalDemo />
        </Box>
        <PreferencesModal {...args} DialogProps={dialogProps} />
      </ConsentProvider>
    )
  },
}

export const ResponsiveDesign: Story = {
  args: {
    hideBranding: false,
    openModal: false,
  },
  render: (args: StoryArgs) => {
    const dialogProps = { ...(args.DialogProps ?? {}) }
    return (
      <ConsentProvider
        categories={{
          enabledCategories: ['analytics', 'marketing', 'functional'],
        }}
      >
        <Box
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            bgcolor: '#f0f4f8',
            minHeight: '60vh',
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
              color: 'primary.main',
            }}
          >
            📱 Design Responsivo v0.4.1
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Modal otimizado para desktop, tablet e mobile com breakpoints adaptativos.
          </Typography>

          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              💡 <strong>Teste a responsividade:</strong> Redimensione a janela para ver como o
              modal se adapta a diferentes tamanhos de tela.
            </Typography>
          </Alert>

          <EnhancedModalDemo />
        </Box>
        <PreferencesModal {...args} DialogProps={dialogProps} />
      </ConsentProvider>
    )
  },
}
