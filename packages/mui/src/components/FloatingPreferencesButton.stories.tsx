import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Paper,
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
} from '@react-lgpd-consent/core'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { FloatingPreferencesButton } from './FloatingPreferencesButton'

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
    position: {
      control: { type: 'select' },
      options: ['bottom-left', 'bottom-right', 'top-left', 'top-right'],
    },
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
    <ConsentProvider
      categories={{ enabledCategories: ['analytics'] }}
      floatingPreferencesButtonProps={args}
    >
      <Box sx={{ minHeight: '100vh', p: 3, position: 'relative', bgcolor: '#f8fafc' }}>
        <Typography variant="h4" gutterBottom color="primary">
          🏠 Botão Flutuante Padrão
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Botão flutuante acessível que permite reconfigurar preferências a qualquer momento.
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} sx={{ mb: 3 }}>
          <Chip label="Position: bottom-right" size="small" color="primary" variant="outlined" />
          <Chip label="Always visible" size="small" color="success" variant="outlined" />
          <Chip label="Accessibility: ✅" size="small" color="info" variant="outlined" />
        </Stack>

        <Card elevation={1} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              📱 Experiência do Usuário
            </Typography>
            <Typography variant="body2" color="text.secondary">
              O botão flutuante garante que o usuário sempre tenha acesso às configurações de
              privacidade, promovendo transparência e controle sobre seus dados.
            </Typography>
          </CardContent>
        </Card>

        <Paper elevation={1} sx={{ p: 3, bgcolor: 'grey.50' }}>
          <Typography variant="body2" color="text.secondary">
            💡 <strong>Dica:</strong> O botão aparece após o usuário tomar uma decisão inicial sobre
            cookies e permanece acessível durante toda a navegação.
          </Typography>
        </Paper>

        <FloatingPreferencesButton {...args} />
      </Box>
    </ConsentProvider>
  ),
}

export const CustomPosition: Story = {
  render: (args) => (
    <ConsentProvider
      categories={{ enabledCategories: ['analytics'] }}
      floatingPreferencesButtonProps={args}
    >
      <Box sx={{ minHeight: '100vh', p: 3, position: 'relative', bgcolor: '#f0f9ff' }}>
        <Typography variant="h4" gutterBottom color="info.dark">
          📍 Posicionamento Customizado
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Demonstra como personalizar posição e estilo do botão flutuante.
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} sx={{ mb: 3 }}>
          <Chip label="Custom position" size="small" color="info" />
          <Chip label="MUI props" size="small" color="secondary" variant="outlined" />
          <Chip label="Flexible styling" size="small" color="primary" variant="outlined" />
        </Stack>

        <Card elevation={1} sx={{ mb: 3, bgcolor: '#dbeafe' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🎨 Personalização Avançada
            </Typography>
            <Typography variant="body2">
              O botão flutuante herda todas as props do Fab do Material-UI, permitindo customização
              completa de cores, tamanhos, ícones e comportamento.
            </Typography>
          </CardContent>
        </Card>

        <Paper elevation={2} sx={{ p: 3, bgcolor: '#bfdbfe', mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Área de Conteúdo Principal
          </Typography>
          <Typography variant="body2">
            O botão se adapta automaticamente ao layout, mantendo acessibilidade.
          </Typography>
        </Paper>

        <FloatingPreferencesButton {...args} />
      </Box>
    </ConsentProvider>
  ),
}

export const WithLongContent: Story = {
  render: (args) => (
    <ConsentProvider
      categories={{ enabledCategories: ['analytics', 'marketing', 'functional'] }}
      floatingPreferencesButtonProps={args}
    >
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
      floatingPreferencesButtonProps={args}
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
    <ConsentProvider
      categories={{ enabledCategories: ['analytics'] }}
      floatingPreferencesButtonProps={args}
    >
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

export const DarkTheme: Story = {
  args: {
    position: 'bottom-right',
    offset: 24,
  },
  render: (args) => (
    <ThemeProvider theme={createTheme({ palette: { mode: 'dark' } })}>
      <ConsentProvider
        categories={{ enabledCategories: ['analytics', 'marketing'] }}
        floatingPreferencesButtonProps={args}
      >
        <Box
          sx={{
            minHeight: '100vh',
            p: 3,
            position: 'relative',
            bgcolor: '#121212',
            color: 'white',
          }}
        >
          <Typography variant="h4" gutterBottom color="white">
            Tema Escuro - Floating Button
          </Typography>
          <FloatingPreferencesButton {...args} />
        </Box>
      </ConsentProvider>
    </ThemeProvider>
  ),
}

// ===== NOVOS STORIES v0.4.1 =====

// Status Dashboard Component
const StatusDashboard = () => {
  const { preferences, consented, isModalOpen } = useConsent()

  return (
    <Card elevation={2} sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          📊 Status do Sistema v0.4.1
        </Typography>

        <Alert severity={consented ? 'success' : 'info'} sx={{ mb: 2 }}>
          Status: {consented ? '✅ Configurado' : '⏳ Aguardando'} | Modal:{' '}
          {isModalOpen ? '🔓 Aberto' : '🔒 Fechado'}
        </Alert>

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
  )
}

export const WithAdvancedPositioning: Story = {
  args: {
    position: 'bottom-left',
    offset: 32,
  },
  render: (args) => {
    const advancedTexts = resolveTexts(TEXT_TEMPLATES.government, {
      variant: 'formal',
      language: 'pt',
    })

    return (
      <ConsentProvider
        categories={{
          enabledCategories: ['analytics', 'functional', 'marketing'],
        }}
        texts={advancedTexts}
        floatingPreferencesButtonProps={args}
      >
        <Box sx={{ minHeight: '100vh', p: 3, position: 'relative', bgcolor: '#f8f9fa' }}>
          <Typography variant="h4" gutterBottom color="primary">
            🎯 Posicionamento Avançado v0.4.1
          </Typography>

          <StatusDashboard />

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <Paper elevation={1} sx={{ p: 3, height: '300px', flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                Conteúdo Principal
              </Typography>
              <Typography variant="body2" color="text.secondary">
                O botão flutuante posicionado no canto inferior esquerdo com offset personalizado.
              </Typography>
            </Paper>
            <Paper elevation={1} sx={{ p: 3, height: '300px', flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                Área Secundária
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Demonstra como o botão se adapta a diferentes layouts de página.
              </Typography>
            </Paper>
          </Stack>

          <Box sx={{ mt: 3 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              <Chip label="Position: bottom-left" size="small" color="info" />
              <Chip label="Offset: 32px" size="small" color="secondary" />
              <Chip label="Template: government" size="small" color="warning" />
              <Chip label="Variant: formal" size="small" color="success" />
            </Stack>
          </Box>

          <FloatingPreferencesButton {...args} />
        </Box>
      </ConsentProvider>
    )
  },
}

export const WithCustomDesignTokens: Story = {
  args: {
    position: 'top-right',
    offset: 24,
  },
  render: (args) => {
    const modernDesignTokens: DesignTokens = {
      colors: {
        primary: {
          main: '#7c3aed', // Purple
          light: '#a78bfa',
          dark: '#5b21b6',
        },
        secondary: {
          main: '#059669', // Emerald
          light: '#10b981',
          dark: '#047857',
        },
      },
      layout: {
        position: 'top',
        backdrop: '#1f2937',
      },
    }

    return (
      <ConsentProvider
        categories={{
          enabledCategories: ['analytics', 'marketing', 'functional', 'social'],
        }}
        designTokens={modernDesignTokens}
        floatingPreferencesButtonProps={args}
      >
        <Box sx={{ minHeight: '100vh', p: 3, position: 'relative', bgcolor: '#f3f4f6' }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#7c3aed' }}>
            🎨 Design Tokens v0.4.1
          </Typography>

          <StatusDashboard />

          <Card elevation={2} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Customizações Aplicadas
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                <Chip
                  label="Primary: Purple"
                  size="small"
                  sx={{ bgcolor: '#7c3aed', color: 'white' }}
                />
                <Chip
                  label="Secondary: Emerald"
                  size="small"
                  sx={{ bgcolor: '#059669', color: 'white' }}
                />
                <Chip label="Position: top-right" size="small" color="info" />
                <Chip label="Custom Backdrop" size="small" color="warning" />
              </Stack>
            </CardContent>
          </Card>

          <Paper elevation={1} sx={{ p: 3, bgcolor: 'white' }}>
            <Typography variant="h6" gutterBottom>
              Interface Personalizada
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              O botão flutuante herda as cores personalizadas dos design tokens, mantendo
              consistência visual com o resto da aplicação.
            </Typography>
            <Alert severity="info">
              💡 <strong>Dica:</strong> Todos os componentes da biblioteca respeitam os design
              tokens personalizados para uma experiência visual coesa.
            </Alert>
          </Paper>

          <FloatingPreferencesButton {...args} />
        </Box>
      </ConsentProvider>
    )
  },
}

export const MultipleCategories: Story = {
  args: {
    position: 'bottom-right',
    offset: 20,
    tooltip: 'Configurar todas as categorias',
  },
  render: (args) => (
    <ConsentProvider
      categories={{
        enabledCategories: ['necessary', 'analytics', 'marketing', 'functional', 'social'],
        customCategories: [
          {
            id: 'ai',
            name: 'Inteligência Artificial',
            description: 'Recursos de IA para personalização avançada',
          },
          {
            id: 'biometric',
            name: 'Biométricos',
            description: 'Dados biométricos para autenticação',
          },
        ],
      }}
      floatingPreferencesButtonProps={args}
    >
      <Box sx={{ minHeight: '100vh', p: 3, position: 'relative', bgcolor: '#fef7e0' }}>
        <Typography variant="h4" gutterBottom color="warning.dark">
          🔧 Múltiplas Categorias v0.4.1
        </Typography>

        <StatusDashboard />

        <Card elevation={2} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Categorias Disponíveis (7 total)
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              <Chip label="necessary" size="small" color="error" variant="outlined" />
              <Chip label="analytics" size="small" color="info" variant="outlined" />
              <Chip label="marketing" size="small" color="secondary" variant="outlined" />
              <Chip label="functional" size="small" color="success" variant="outlined" />
              <Chip label="social" size="small" color="primary" variant="outlined" />
              <Chip label="ai" size="small" color="warning" variant="outlined" />
              <Chip label="biometric" size="small" sx={{ bgcolor: '#e3f2fd' }} variant="outlined" />
            </Stack>
          </CardContent>
        </Card>

        <Paper elevation={1} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Gerenciamento Complexo
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            O botão flutuante permanece simples e acessível mesmo com múltiplas categorias
            complexas, incluindo categorias customizadas específicas do projeto.
          </Typography>
          <Alert severity="success">
            ✅ <strong>Escalabilidade:</strong> A interface se adapta automaticamente independente
            do número de categorias configuradas.
          </Alert>
        </Paper>

        <FloatingPreferencesButton {...args} />
      </Box>
    </ConsentProvider>
  ),
}

export const ResponsiveDemo: Story = {
  args: {
    position: 'bottom-right',
    offset: 16,
  },
  render: (args) => (
    <ConsentProvider
      categories={{
        enabledCategories: ['analytics', 'marketing', 'functional'],
      }}
      floatingPreferencesButtonProps={args}
    >
      <Box
        sx={{
          minHeight: '100vh',
          p: { xs: 2, sm: 3, md: 4 },
          position: 'relative',
          bgcolor: '#f0f9ff',
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
          📱 Responsivo v0.4.1
        </Typography>

        <StatusDashboard />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, md: 3 }} flexWrap="wrap">
          <Card
            elevation={1}
            sx={{ height: '200px', flex: { xs: 1, sm: '1 1 300px' }, minWidth: '280px' }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📱 Mobile
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Botão otimizado para telas pequenas com touch-friendly sizing.
              </Typography>
            </CardContent>
          </Card>
          <Card
            elevation={1}
            sx={{ height: '200px', flex: { xs: 1, sm: '1 1 300px' }, minWidth: '280px' }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📱 Tablet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Posicionamento adaptativo para diferentes orientações.
              </Typography>
            </CardContent>
          </Card>
          <Card
            elevation={1}
            sx={{ height: '200px', flex: { xs: 1, sm: '1 1 300px' }, minWidth: '280px' }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🖥️ Desktop
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Posicionamento preciso com hover states e tooltips.
              </Typography>
            </CardContent>
          </Card>
        </Stack>

        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">
            💡 <strong>Teste a responsividade:</strong> Redimensione a janela para ver como o botão
            se adapta a diferentes breakpoints.
          </Typography>
        </Alert>

        <FloatingPreferencesButton {...args} />
      </Box>
    </ConsentProvider>
  ),
}
