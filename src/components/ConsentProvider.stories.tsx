import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import { ConsentProvider } from '../context/ConsentContext'
import { Box, Typography, Button } from '@mui/material'
import { createTheme } from '@mui/material/styles'
import { useConsent } from '../hooks/useConsent'

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
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Componente interno para demonstrar o estado
const ConsentDemo = () => {
  const { preferences, consented, acceptAll, rejectAll, openPreferences, resetConsent } =
    useConsent()

  return (
    <Box sx={{ p: 3, minHeight: '50vh' }}>
      <Typography variant="h4" gutterBottom>
        Demonstração do Sistema de Consentimento LGPD
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">Status atual:</Typography>
        <Typography>Consentimento dado: {consented ? '✅ Sim' : '❌ Não'}</Typography>
        <Typography>Preferências:</Typography>
        <pre>{JSON.stringify(preferences, null, 2)}</pre>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button variant="contained" onClick={acceptAll}>
          Aceitar Todos
        </Button>
        <Button variant="outlined" onClick={rejectAll}>
          Rejeitar Todos
        </Button>
        <Button variant="outlined" onClick={openPreferences}>
          Abrir Preferências
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
    <ConsentProvider {...args}>
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
    <ConsentProvider {...args}>
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
    <ConsentProvider {...args}>
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
    <ConsentProvider {...args}>
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
    <ConsentProvider {...args}>
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
    <ConsentProvider {...args}>
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
    <ConsentProvider {...args} theme={createTheme({ palette: { mode: 'dark' } })}>
      <Box sx={{ p: 3, bgcolor: '#121212', color: 'white', minHeight: '50vh' }}>
        <ConsentDemo />
      </Box>
    </ConsentProvider>
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
    <ConsentProvider {...args}>
      <ConsentDemo />
    </ConsentProvider>
  ),
}
