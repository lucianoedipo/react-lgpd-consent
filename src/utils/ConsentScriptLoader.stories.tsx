import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import { ConsentProvider } from '../context/ConsentContext'
import { ConsentScriptLoader } from './ConsentScriptLoader'
import {
  createGoogleAnalyticsIntegration,
  createFacebookPixelIntegration,
  createHotjarIntegration,
  createMixpanelIntegration,
  createECommerceIntegrations,
  createSaaSIntegrations,
  createCorporateIntegrations,
} from './scriptIntegrations'
import { Box, Button, Typography } from '@mui/material'
import { useConsent } from '../hooks/useConsent'

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
  const { preferences, openPreferences, acceptAll, rejectAll } = useConsent()
  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
      <Typography variant="body2">Prefs: {JSON.stringify(preferences)}</Typography>
      <Button size="small" onClick={openPreferences}>
        Preferências
      </Button>
      <Button size="small" variant="contained" onClick={acceptAll}>
        Aceitar todos
      </Button>
      <Button size="small" variant="outlined" onClick={rejectAll}>
        Recusar todos
      </Button>
    </Box>
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
          <Typography variant="h6" gutterBottom>
            ConsentScriptLoader (mocked)
          </Typography>
          <DemoControls />
          <ConsentScriptLoader integrations={integrations as any} reloadOnChange={args.reloadOnChange} />
          <Typography variant="caption" color="text.secondary">
            Scripts são injetados com src="data:" para evitar requisições reais.
          </Typography>
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
          <ConsentScriptLoader integrations={integrations as any} reloadOnChange={args.reloadOnChange} />
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
      <ConsentProvider categories={{ enabledCategories: ['analytics', 'functional'] }} disableFloatingPreferencesButton>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            SaaS Template (mocked)
          </Typography>
          <DemoControls />
          <ConsentScriptLoader integrations={integrations as any} reloadOnChange={args.reloadOnChange} />
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
      <ConsentProvider categories={{ enabledCategories: ['analytics', 'functional'] }} disableFloatingPreferencesButton>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Corporate Template (mocked)
          </Typography>
          <DemoControls />
          <ConsentScriptLoader integrations={integrations as any} reloadOnChange={args.reloadOnChange} />
        </Box>
      </ConsentProvider>
    )
  },
}
