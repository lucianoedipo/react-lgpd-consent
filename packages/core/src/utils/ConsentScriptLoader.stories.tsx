import { Alert, Box, Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConsentProvider } from '../context/ConsentContext'
import { useConsent } from '../hooks/useConsent'
import { ConsentScriptLoader } from './ConsentScriptLoader'
import {
  createCorporateIntegrations,
  createECommerceIntegrations,
  createFacebookPixelIntegration,
  createGoogleAnalyticsIntegration,
  createHotjarIntegration,
  createMixpanelIntegration,
  createSaaSIntegrations,
} from './scriptIntegrations'

// Helper to make integrations safe for Storybook (avoid real network requests)
function withMockSrc<T extends { src: string }>(i: T): T {
  return { ...i, src: 'data:text/javascript,/* mocked */' }
}

function mockAll(list: Array<{ src: string }>): Array<{ src: string }>
function mockAll<T extends { src: string }>(list: T[]): T[]
function mockAll(list: any[]) {
  return list.map((i) => withMockSrc(i))
}

const meta: Meta<typeof ConsentScriptLoader> = {
  title: 'Utils/ConsentScriptLoader',
  component: ConsentScriptLoader,
  parameters: {
    docs: {
      description: {
        component:
          'Demonstra o carregamento condicional de integrações (mockado via data: URL para evitar rede).',
      },
    },
  },
  argTypes: {
    includeGA: { control: 'boolean' },
    includePixel: { control: 'boolean' },
    includeHotjar: { control: 'boolean' },
    includeMixpanel: { control: 'boolean' },
    reloadOnChange: { control: 'boolean' },
  } as any,
} as Meta<typeof ConsentScriptLoader>

export default meta
type Story = StoryObj<
  typeof ConsentScriptLoader & {
    includeGA: boolean
    includePixel: boolean
    includeHotjar: boolean
    includeMixpanel: boolean
  }
>

const DemoControls = () => {
  const { preferences, openPreferences, acceptAll, rejectAll, consented } = useConsent()

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          🎛️ Controles de Demonstração
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Button size="small" onClick={openPreferences} variant="outlined">
            Preferências
          </Button>
          <Button size="small" variant="contained" onClick={acceptAll} color="success">
            Aceitar Todos
          </Button>
          <Button size="small" variant="outlined" onClick={rejectAll} color="error">
            Recusar Todos
          </Button>
        </Stack>

        <Alert severity={consented ? 'success' : 'warning'} sx={{ mb: 2 }}>
          <Typography variant="body2">
            Status: {consented ? '✅ Consentimento dado' : '⚠️ Aguardando consentimento'}
          </Typography>
        </Alert>

        <Typography variant="subtitle2" gutterBottom>
          🍪 Estado das Categorias:
        </Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          {Object.entries(preferences).map(([category, enabled]) => (
            <Chip
              key={category}
              label={`${category}: ${enabled ? 'ON' : 'OFF'}`}
              color={enabled ? 'success' : 'default'}
              variant={enabled ? 'filled' : 'outlined'}
              size="small"
            />
          ))}
        </Stack>
      </CardContent>
    </Card>
  )
}

export const Playground: Story = {
  args: {
    includeGA: true,
    includePixel: false,
    includeHotjar: false,
    includeMixpanel: false,
    reloadOnChange: false,
  } as any,
  render: (args: any) => {
    const integrations = [] as any[]
    if (args.includeGA)
      integrations.push(withMockSrc(createGoogleAnalyticsIntegration({ measurementId: 'G-XXXX' })))
    if (args.includePixel)
      integrations.push(withMockSrc(createFacebookPixelIntegration({ pixelId: '123' })))
    if (args.includeHotjar)
      integrations.push(withMockSrc(createHotjarIntegration({ siteId: '999' })))
    if (args.includeMixpanel)
      integrations.push(withMockSrc(createMixpanelIntegration({ token: 'token' })))

    return (
      <ConsentProvider
        categories={{ enabledCategories: ['analytics', 'marketing', 'functional'] }}
        disableFloatingPreferencesButton
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h4" gutterBottom align="center">
            🚀 ConsentScriptLoader Demo
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Demonstração do carregamento condicional de scripts baseado no consentimento
          </Typography>

          <DemoControls />

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📊 Script Loader Status
              </Typography>
              <ConsentScriptLoader
                integrations={integrations as any}
                reloadOnChange={args.reloadOnChange}
              />
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  💡 <strong>Scripts são simulados</strong> com <code>src="data:"</code> para evitar
                  requisições reais no Storybook. Em produção, os scripts reais seriam carregados
                  baseados no consentimento.
                </Typography>
              </Alert>

              {integrations.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    🔧 Integrações Configuradas:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    {integrations.map((integration, index) => (
                      <Chip
                        key={integration.name || `script-${integration.src || index}`}
                        label={integration.name || `Script ${index + 1}`}
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Stack>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </ConsentProvider>
    )
  },
}

export const EcommerceTemplate: Story = {
  args: { reloadOnChange: false } as any,
  render: (args: any) => {
    const integrations = mockAll(
      createECommerceIntegrations({
        googleAnalytics: { measurementId: 'G-ECOM' },
        facebookPixel: { pixelId: 'PIXEL-ECOM' },
        hotjar: { siteId: '123456' },
      }) as any,
    )

    return (
      <ConsentProvider
        categories={{ enabledCategories: ['analytics', 'marketing', 'functional'] }}
        disableFloatingPreferencesButton
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            E-commerce Template (mocked)
          </Typography>
          <DemoControls />
          <ConsentScriptLoader
            integrations={integrations as any}
            reloadOnChange={args.reloadOnChange}
          />
        </Box>
      </ConsentProvider>
    )
  },
}

export const SaaSTemplate: Story = {
  args: { reloadOnChange: false } as any,
  render: (args: any) => {
    const integrations = mockAll(
      createSaaSIntegrations({
        googleAnalytics: { measurementId: 'G-SAAS' },
        mixpanel: { token: 'MIXPANEL' },
        intercom: { app_id: 'APP-ID' },
        hotjar: { siteId: '654321' },
      }) as any,
    )

    return (
      <ConsentProvider
        categories={{ enabledCategories: ['analytics', 'functional'] }}
        disableFloatingPreferencesButton
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            SaaS Template (mocked)
          </Typography>
          <DemoControls />
          <ConsentScriptLoader
            integrations={integrations as any}
            reloadOnChange={args.reloadOnChange}
          />
        </Box>
      </ConsentProvider>
    )
  },
}

export const CorporateTemplate: Story = {
  args: { reloadOnChange: false } as any,
  render: (args: any) => {
    const integrations = mockAll(
      createCorporateIntegrations({
        googleAnalytics: { measurementId: 'G-CORP' },
        clarity: { projectId: 'CLARITY' },
        zendesk: { key: 'ZENDESK' },
        userway: { accountId: 'USERWAY' },
      }) as any,
    )

    return (
      <ConsentProvider
        categories={{ enabledCategories: ['analytics', 'functional'] }}
        disableFloatingPreferencesButton
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Corporate Template (mocked)
          </Typography>
          <DemoControls />
          <ConsentScriptLoader
            integrations={integrations as any}
            reloadOnChange={args.reloadOnChange}
          />
        </Box>
      </ConsentProvider>
    )
  },
}
