import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { FloatingPreferencesButton } from './FloatingPreferencesButton'
import { Box, Typography } from '@mui/material'
import { ConsentProvider } from '../context/ConsentContext'

const meta: Meta<typeof FloatingPreferencesButton> = {
  title: 'Components/FloatingPreferencesButton',
  component: FloatingPreferencesButton,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Botão flutuante que permite ao usuário reabrir o modal de preferências de cookies a qualquer momento.',
      },
    },
  },
  argTypes: {
    position: { control: { type: 'select' }, options: ['bottom-left', 'bottom-right', 'top-left', 'top-right'] },
    offset: { control: { type: 'number' } },
    tooltip: { control: 'text' },
    hideWhenConsented: { control: 'boolean' },
    FabProps: { control: 'object' },
    icon: { table: { disable: true } },
  },
  args: {
    position: 'bottom-right',
    offset: 24,
    tooltip: undefined,
    hideWhenConsented: false,
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <ConsentProvider categories={{ enabledCategories: ['analytics', 'marketing'] }}>
      <Box sx={{ minHeight: '100vh', p: 3, position: 'relative' }}>
        <Typography variant="h4" gutterBottom>
          Página com Botão Flutuante
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          O botão flutuante aparece no canto inferior direito da tela, permitindo que o usuário
          reabra as configurações de cookies a qualquer momento.
        </Typography>

        <Typography variant="h6" gutterBottom>
          Conteúdo da Página
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </Typography>

        <Box sx={{ height: '200px', bgcolor: '#f5f5f5', p: 2, borderRadius: 1, mb: 2 }}>
          <Typography variant="body2">
            Área de conteúdo simulada para demonstrar como o botão flutuante se posiciona em relação
            ao conteúdo da página.
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary">
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
          nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
          deserunt mollit anim id est laborum.
        </Typography>

  <FloatingPreferencesButton {...args} />
      </Box>
    </ConsentProvider>
  ),
}

export const CustomPosition: Story = {
  render: (args) => (
    <ConsentProvider categories={{ enabledCategories: ['analytics'] }}>
      <Box sx={{ minHeight: '100vh', p: 3, position: 'relative' }}>
        <Typography variant="h4" gutterBottom>
          Botão com Posicionamento Customizado
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Este exemplo mostra como o botão pode ser personalizado através de props do Material-UI.
        </Typography>

        <Box sx={{ height: '300px', bgcolor: '#e3f2fd', p: 2, borderRadius: 1, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Área de Conteúdo Principal
          </Typography>
          <Typography variant="body2">
            O botão flutuante permanece acessível independentemente do scroll da página.
          </Typography>
        </Box>

        <Box sx={{ height: '300px', bgcolor: '#f3e5f5', p: 2, borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            Mais Conteúdo
          </Typography>
          <Typography variant="body2">
            Demonstra como o botão se comporta com diferentes quantidades de conteúdo.
          </Typography>
        </Box>

  <FloatingPreferencesButton {...args} />
      </Box>
    </ConsentProvider>
  ),
}

export const WithLongContent: Story = {
  render: (args) => (
    <ConsentProvider categories={{ enabledCategories: ['analytics', 'marketing', 'functional'] }}>
      <Box sx={{ minHeight: '200vh', p: 3, position: 'relative' }}>
        <Typography variant="h4" gutterBottom>
          Página Longa com Scroll
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Esta página tem conteúdo suficiente para demonstrar como o botão flutuante permanece
          visível durante o scroll.
        </Typography>

        {Array.from({ length: 10 }, (_, i) => (
          <Box key={i} sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Seção {i + 1}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </Typography>
            <Box
              sx={{ height: '150px', bgcolor: `hsl(${i * 36}, 50%, 95%)`, p: 2, borderRadius: 1 }}
            >
              <Typography variant="body2">
                Conteúdo da seção {i + 1}. Role a página para ver como o botão flutuante permanece
                fixo na posição.
              </Typography>
            </Box>
          </Box>
        ))}

        <Typography variant="h6" sx={{ mt: 4 }}>
          Final da Página
        </Typography>
        <Typography variant="body2" color="text.secondary">
          O botão flutuante deve estar sempre visível, mesmo aqui no final da página.
        </Typography>

  <FloatingPreferencesButton {...args} />
      </Box>
    </ConsentProvider>
  ),
}

export const Disabled: Story = {
  render: (args) => (
    <ConsentProvider
      categories={{ enabledCategories: ['analytics'] }}
      disableFloatingPreferencesButton={true}
    >
      <Box sx={{ minHeight: '100vh', p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Botão Flutuante Desabilitado
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Quando a prop <code>disableFloatingPreferencesButton</code> está definida como true, o
          botão flutuante não aparece.
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Esta configuração é útil quando você quer fornecer sua própria forma de acessar as
          configurações de cookies, como um link no footer ou menu.
        </Typography>

    {/* não renderizamos manualmente o FloatingPreferencesButton aqui: o ConsentProvider gerencia sua exibição
      quando `disableFloatingPreferencesButton` está false. Como queremos demonstrar o caso desabilitado,
      deixamos o provider controlar a renderização e não incluímos o componente explicitamente. */}
      </Box>
    </ConsentProvider>
  ),
}

export const MultipleSizes: Story = {
  render: (args) => (
    <ConsentProvider categories={{ enabledCategories: ['analytics'] }}>
      <Box sx={{ minHeight: '100vh', p: 3, position: 'relative' }}>
        <Typography variant="h4" gutterBottom>
          Tamanhos Diferentes
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Demonstração de diferentes tamanhos e estilos do botão flutuante.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
          <Typography variant="h6">Variações Disponíveis:</Typography>
          <Typography variant="body2">
            • Tamanho padrão (demonstrado no canto inferior direito)
          </Typography>
          <Typography variant="body2">• Cores customizadas via sx prop</Typography>
          <Typography variant="body2">• Posicionamento flexível</Typography>
        </Box>

        <Box sx={{ height: '400px', bgcolor: '#f8f9fa', p: 2, borderRadius: 1 }}>
          <Typography variant="body2">
            Área de conteúdo para demonstrar o botão em diferentes contextos visuais.
          </Typography>
        </Box>

  <FloatingPreferencesButton {...args} />
      </Box>
    </ConsentProvider>
  ),
}
