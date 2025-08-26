import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { CookieBanner } from './CookieBanner'
import { Box, Typography } from '@mui/material'
import { ConsentProvider } from '../context/ConsentContext'

const meta: Meta<typeof CookieBanner> = {
  title: 'Components/CookieBanner',
  component: CookieBanner,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Banner de consentimento de cookies que aparece quando o usuário ainda não tomou uma decisão.',
      },
    },
  },
  argTypes: {
    blocking: {
      control: 'boolean',
      description: 'Se true, exibe banner como modal bloqueante',
    },
    hideBranding: {
      control: 'boolean',
      description: 'Se true, oculta branding da biblioteca',
    },
    debug: {
      control: 'boolean',
      description: 'Se true, força exibição do banner independente do estado',
    },
    policyLinkUrl: {
      control: 'text',
      description: 'URL para política de privacidade/cookies',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    debug: true,
  },
  render: (args) => (
    <ConsentProvider categories={{ enabledCategories: ['analytics'] }}>
      <Box sx={{ position: 'relative', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Página de Exemplo
          </Typography>
          <Typography variant="body1">
            Esta é uma página de exemplo para demonstrar o banner de cookies. O banner aparece na
            parte inferior da tela.
          </Typography>
        </Box>
        <CookieBanner {...args} />
      </Box>
    </ConsentProvider>
  ),
}

export const WithBlocking: Story = {
  args: {
    debug: true,
    blocking: true,
  },
  render: (args) => (
    <ConsentProvider categories={{ enabledCategories: ['analytics'] }}>
      <Box sx={{ position: 'relative', minHeight: '100vh' }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Página com Bloqueio
          </Typography>
          <Typography variant="body1">
            Esta página demonstra o banner com modo bloqueante ativo.
          </Typography>
        </Box>
        <CookieBanner {...args} />
      </Box>
    </ConsentProvider>
  ),
}

export const WithPolicyLink: Story = {
  args: {
    debug: true,
    policyLinkUrl: '/privacy-policy',
  },
  render: (args) => (
    <ConsentProvider categories={{ enabledCategories: ['analytics', 'marketing'] }}>
      <Box sx={{ position: 'relative', minHeight: '100vh', bgcolor: '#e3f2fd' }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Com Link de Política
          </Typography>
          <Typography variant="body1">
            Banner que inclui link para política de privacidade.
          </Typography>
        </Box>
        <CookieBanner {...args} />
      </Box>
    </ConsentProvider>
  ),
}

export const CustomTexts: Story = {
  args: {
    debug: true,
    hideBranding: true,
  },
  render: (args) => (
    <ConsentProvider
      categories={{ enabledCategories: ['analytics'] }}
      texts={{
        bannerMessage: '🍪 Ei! Usamos cookies deliciosos para tornar sua experiência ainda melhor!',
        acceptAll: '✨ Aceitar Tudo',
        declineAll: '🚫 Só o Essencial',
        preferences: '⚙️ Personalizar',
      }}
    >
      <Box sx={{ position: 'relative', minHeight: '100vh', bgcolor: '#fff3e0' }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Textos Personalizados
          </Typography>
          <Typography variant="body1">
            Banner com textos customizados para um contexto específico.
          </Typography>
        </Box>
        <CookieBanner {...args} />
      </Box>
    </ConsentProvider>
  ),
}

export const DarkTheme: Story = {
  args: {
    debug: true,
  },
  render: (args) => (
    <ConsentProvider categories={{ enabledCategories: ['analytics'] }}>
      <Box sx={{ position: 'relative', minHeight: '100vh', bgcolor: '#121212', color: 'white' }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom color="white">
            Tema Escuro
          </Typography>
          <Typography variant="body1" color="white">
            Banner integrado com tema escuro da aplicação.
          </Typography>
        </Box>
        <CookieBanner {...args} />
      </Box>
    </ConsentProvider>
  ),
}
