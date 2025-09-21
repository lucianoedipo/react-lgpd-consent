import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import { PreferencesModal } from './PreferencesModal'
import { Box, Typography, Button, DialogProps } from '@mui/material'
import { createTheme } from '@mui/material/styles'
import { ConsentProvider } from '../context/ConsentContext'
import { useConsent } from '../hooks/useConsent'
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
      <Typography variant="h4" gutterBottom>
        Demonstração do Modal de Preferências
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">Preferências atuais:</Typography>
        <pre style={{ fontSize: '14px' }}>{JSON.stringify(preferences, null, 2)}</pre>
      </Box>

      <Button variant="contained" onClick={openPreferences} disabled={isModalOpen}>
        {isModalOpen ? 'Modal Aberto' : 'Abrir Preferências'}
      </Button>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Clique no botão acima para abrir o modal de preferências e ver como funciona.
      </Typography>
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
    // Não forçar abertura via prop para permitir fechar corretamente
    openModal: false,
  },
  render: (args: StoryArgs) => {
    // Não definir DialogProps.open aqui para que o controle seja do contexto
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
