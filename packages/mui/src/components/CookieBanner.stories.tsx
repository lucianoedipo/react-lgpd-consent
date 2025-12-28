import { Box, Chip, Stack, ThemeProvider, Typography } from '@mui/material'
import { createTheme } from '@mui/material/styles'
import {
  ConsentProvider,
  resolveTexts,
  TEXT_TEMPLATES,
  type DesignTokens,
} from '@react-lgpd-consent/mui'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { CookieBanner } from './CookieBanner'

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
    <ConsentProvider
      categories={{ enabledCategories: ['analytics'] }}
      CookieBannerComponent={() => null}
    >
      <Box sx={{ position: 'relative', minHeight: '100vh', bgcolor: '#f8fafc' }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom color="primary">
            🏠 Banner Padrão
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Demonstração do banner de cookies padrão com configuração básica.
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            <Chip label="Analytics: ✅" size="small" color="success" variant="outlined" />
            <Chip label="Position: bottom" size="small" color="info" variant="outlined" />
            <Chip label="Mode: standard" size="small" color="secondary" variant="outlined" />
          </Box>
        </Box>
        <CookieBanner {...args} />
      </Box>
    </ConsentProvider>
  ),
}

export const ECommerceVariant: Story = {
  args: {
    debug: true,
    blocking: true,
  },
  render: (args) => (
    <ConsentProvider
      categories={{ enabledCategories: ['analytics'] }}
      CookieBannerComponent={() => null}
    >
      <Box sx={{ position: 'relative', minHeight: '100vh', bgcolor: '#fef3c7' }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom color="warning.dark">
            🔒 Modo Bloqueante
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Banner configurado para bloquear interação até que o usuário tome uma decisão.
          </Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
            <Chip label="Blocking: ✅" size="small" color="warning" />
            <Chip label="Backdrop: dark" size="small" color="default" variant="outlined" />
            <Chip label="Interaction: blocked" size="small" color="error" variant="outlined" />
          </Stack>

          <Typography variant="body2" color="warning.dark">
            ⚠️ <strong>Atenção:</strong> O conteúdo abaixo ficará inacessível até decisão do
            usuário.
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
    <ConsentProvider
      categories={{ enabledCategories: ['analytics', 'marketing'] }}
      CookieBannerComponent={() => null}
    >
      <Box sx={{ position: 'relative', minHeight: '100vh', bgcolor: '#e0f2fe' }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom color="info.dark">
            🔗 Com Link de Política
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Banner que inclui link para política de privacidade, oferecendo transparência ao
            usuário.
          </Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
            <Chip label="Analytics: ✅" size="small" color="info" />
            <Chip label="Marketing: ✅" size="small" color="info" />
            <Chip label="Policy Link: ✅" size="small" color="success" />
          </Stack>

          <Typography variant="body2" color="info.dark">
            💡 <strong>Transparência:</strong> Usuários podem acessar a política antes de decidir.
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
      CookieBannerComponent={() => null}
      texts={{
        bannerMessage: '🍪 Ei! Usamos cookies deliciosos para tornar sua experiência ainda melhor!',
        acceptAll: '✨ Aceitar Tudo',
        declineAll: '🚫 Só o Essencial',
      }}
    >
      <Box sx={{ position: 'relative', minHeight: '100vh', bgcolor: '#fef7ed' }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom color="orange">
            ✏️ Textos Personalizados
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Banner com textos customizados para criar uma experiência única e envolvente.
          </Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
            <Chip label="Custom texts: ✅" size="small" color="warning" />
            <Chip label="Branding: hidden" size="small" color="default" variant="outlined" />
            <Chip label="Tone: casual" size="small" color="secondary" variant="outlined" />
          </Stack>

          <Box
            sx={{
              p: 2,
              bgcolor: 'orange.50',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'orange.200',
            }}
          >
            <Typography variant="body2" color="orange.dark">
              🎨 <strong>Personalização:</strong> Textos adaptados ao contexto e tom da aplicação.
            </Typography>
          </Box>
        </Box>
        <CookieBanner {...args} />
      </Box>
    </ConsentProvider>
  ),
}

export const English: Story = {
  args: {
    debug: true,
  },
  render: (args) => (
    <ConsentProvider
      categories={{ enabledCategories: ['analytics'] }}
      CookieBannerComponent={() => null}
      language="en"
    >
      <Box sx={{ position: 'relative', minHeight: '100vh', bgcolor: '#f1f5f9' }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom color="primary">
            🌍 English
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Banner com idioma inglês resolvido via i18n no Provider.
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
    <ThemeProvider theme={createTheme({ palette: { mode: 'dark' } })}>
      <ConsentProvider
        categories={{ enabledCategories: ['analytics'] }}
        CookieBannerComponent={() => null}
      >
        <Box sx={{ position: 'relative', minHeight: '100vh', bgcolor: '#0f172a', color: 'white' }}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom color="primary.light">
              🌙 Tema Escuro
            </Typography>
            <Typography variant="body1" color="grey.300" sx={{ mb: 3 }}>
              Banner adaptado para interfaces escuras com contraste otimizado.
            </Typography>

            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
              <Chip
                label="Theme: dark"
                size="small"
                sx={{ bgcolor: 'grey.800', color: 'grey.100' }}
              />
              <Chip
                label="Contrast: optimized"
                size="small"
                sx={{ bgcolor: 'primary.dark', color: 'white' }}
              />
              <Chip
                label="Accessibility: ✅"
                size="small"
                sx={{ bgcolor: 'success.dark', color: 'white' }}
              />
            </Stack>

            <Box
              sx={{
                p: 2,
                bgcolor: 'grey.900',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'grey.700',
              }}
            >
              <Typography variant="body2" color="grey.300">
                🎨 <strong>Design Escuro:</strong> Banner integrado com tema escuro da aplicação.
              </Typography>
            </Box>
          </Box>
          <CookieBanner {...args} />
        </Box>
      </ConsentProvider>
    </ThemeProvider>
  ),
}

// ===== NOVOS STORIES v0.4.1 =====

export const WithAdvancedTexts: Story = {
  args: {
    debug: true,
  },
  render: (args) => {
    const ecommerceTexts = resolveTexts(TEXT_TEMPLATES.ecommerce, {
      variant: 'casual',
      language: 'pt',
    })

    return (
      <ConsentProvider
        categories={{
          enabledCategories: ['analytics', 'marketing', 'functional'],
        }}
        CookieBannerComponent={() => null}
        texts={ecommerceTexts}
      >
        <Box sx={{ position: 'relative', minHeight: '100vh', bgcolor: '#f8f9fa' }}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom color="primary">
              🛍️ E-commerce com Textos Avançados v0.4.1
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Banner usando sistema avançado de textos com template e-commerce casual.
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              <Chip label="Template: ecommerce" size="small" color="primary" />
              <Chip label="Variant: casual" size="small" color="secondary" />
              <Chip label="Language: pt" size="small" color="success" />
            </Stack>
          </Box>
          <CookieBanner {...args} />
        </Box>
      </ConsentProvider>
    )
  },
}

export const WithCustomDesignTokens: Story = {
  args: {
    debug: true,
  },
  render: (args) => {
    const customDesignTokens: DesignTokens = {
      colors: {
        primary: {
          main: '#e91e63', // Pink moderno
          light: '#f8bbd9',
          dark: '#ad1457',
        },
        secondary: {
          main: '#00bcd4', // Ciano
          light: '#62ebff',
          dark: '#008ba3',
        },
        background: {
          main: '#fafafa',
          paper: '#ffffff',
        },
      },
      spacing: {
        padding: {
          banner: { x: '24px', y: '20px' },
        },
        borderRadius: {
          banner: '12px',
        },
      },
      typography: {
        fontSize: {
          banner: {
            message: '16px',
            button: '14px',
          },
        },
        fontWeight: {
          medium: 500,
          semibold: 600,
        },
      },
    }

    return (
      <ConsentProvider
        categories={{ enabledCategories: ['analytics', 'marketing'] }}
        CookieBannerComponent={() => null}
        designTokens={customDesignTokens}
      >
        <Box sx={{ position: 'relative', minHeight: '100vh', bgcolor: '#fafafa' }}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ color: '#e91e63' }}>
              🎨 Design Tokens Customizados v0.4.1
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Banner com design tokens personalizados - cores, espaçamentos, tipografia e efeitos.
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              <Chip
                label="Primary: Pink"
                size="small"
                sx={{ bgcolor: '#e91e63', color: 'white' }}
              />
              <Chip
                label="Secondary: Cyan"
                size="small"
                sx={{ bgcolor: '#00bcd4', color: 'white' }}
              />
              <Chip label="Custom Shadows" size="small" color="info" />
              <Chip label="Custom Spacing" size="small" color="success" />
            </Stack>
          </Box>
          <CookieBanner {...args} />
        </Box>
      </ConsentProvider>
    )
  },
}

export const MultipleCategories: Story = {
  args: {
    debug: true,
  },
  render: (args) => (
    <ConsentProvider
      categories={{
        enabledCategories: ['necessary', 'analytics', 'marketing', 'functional', 'social'],
      }}
      CookieBannerComponent={() => null}
    >
      <Box sx={{ position: 'relative', minHeight: '100vh', bgcolor: '#fff8e1' }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom color="warning.dark">
            🔧 Múltiplas Categorias v0.4.1
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Banner com todas as categorias suportadas pela v0.4.1.
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            <Chip label="necessary" size="small" color="error" variant="outlined" />
            <Chip label="analytics" size="small" color="info" variant="outlined" />
            <Chip label="marketing" size="small" color="secondary" variant="outlined" />
            <Chip label="functional" size="small" color="success" variant="outlined" />
            <Chip label="social" size="small" color="primary" variant="outlined" />
          </Stack>
        </Box>
        <CookieBanner {...args} />
      </Box>
    </ConsentProvider>
  ),
}
