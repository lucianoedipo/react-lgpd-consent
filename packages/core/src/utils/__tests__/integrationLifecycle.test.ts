import { waitFor } from '@testing-library/react'
import {
  createClarityIntegration,
  createFacebookPixelIntegration,
  createGoogleAnalyticsIntegration,
  createGoogleTagManagerIntegration,
  createHotjarIntegration,
  createIntercomIntegration,
  createMixpanelIntegration,
  createZendeskMessagingIntegration,
  type IntegrationConsent,
  type ScriptIntegration,
} from '../scriptIntegrations'
import { executeIntegration, resetIntegrationRuntime, syncIntegration } from '../integrationRuntime'
import { loadScript } from '../scriptLoader'

jest.mock('../scriptLoader', () => ({ loadScript: jest.fn() }))
const load = jest.mocked(loadScript)
const granted: IntegrationConsent = {
  consented: true,
  preferences: { necessary: true, analytics: true, marketing: true, functional: true },
}
const denied: IntegrationConsent = { consented: false, preferences: granted.preferences }
const globals = window as unknown as Record<string, any>

beforeEach(() => {
  resetIntegrationRuntime()
  load.mockReset().mockResolvedValue(undefined)
  for (const key of [
    'gtag',
    'dataLayer',
    'customLayer',
    'fbq',
    '_fbq',
    'hj',
    '_hjSettings',
    'mixpanel',
    'clarity',
    'Intercom',
    'intercomSettings',
    'zE',
  ])
    delete globals[key]
})

function deferred() {
  let resolve!: () => void
  const promise = new Promise<void>((done) => {
    resolve = done
  })
  return { promise, resolve }
}

test('bootstrap, preparação, download e inicialização respeitam a ordem e são idempotentes', async () => {
  const order: string[] = []
  const integration: ScriptIntegration = {
    id: 'ordered',
    category: 'analytics',
    src: 'https://example.test/sdk.js',
    bootstrap: () => {
      order.push('bootstrap')
    },
    beforeLoad: () => {
      order.push('prepare')
    },
    init: () => {
      order.push('init')
    },
    onConsentUpdate: () => {
      order.push('consent')
    },
  }
  load.mockImplementation(async () => {
    order.push('download')
  })
  await Promise.all([
    executeIntegration(integration, () => granted),
    executeIntegration(integration, () => granted),
  ])
  expect(order).toEqual(['bootstrap', 'prepare', 'download', 'init', 'consent'])
  await executeIntegration(integration, () => granted)
  expect(load).toHaveBeenCalledTimes(1)
  expect(order.filter((step) => step === 'init')).toHaveLength(1)
})

test('bootstrap local pode rodar sem permissão, mas preparação e download não', async () => {
  const integration = {
    id: 'blocked',
    category: 'analytics',
    src: 'sdk.js',
    bootstrap: jest.fn(),
    beforeLoad: jest.fn(),
    init: jest.fn(),
  }
  expect(await executeIntegration(integration, () => denied)).toBe(false)
  expect(integration.bootstrap).toHaveBeenCalledTimes(1)
  expect(integration.beforeLoad).not.toHaveBeenCalled()
  expect(load).not.toHaveBeenCalled()
})

test('revogação durante download impede init e é transmitida ao SDK; novo aceite inicializa uma vez', async () => {
  const download = deferred()
  load.mockReturnValue(download.promise)
  let consent = granted
  const integration = {
    id: 'race',
    category: 'analytics',
    src: 'sdk.js',
    init: jest.fn(),
    onConsentUpdate: jest.fn(),
  }
  const result = executeIntegration(integration, () => consent)
  await waitFor(() => expect(load).toHaveBeenCalledTimes(1))
  consent = denied
  syncIntegration(integration, consent)
  expect(integration.onConsentUpdate).toHaveBeenLastCalledWith(denied)
  download.resolve()
  expect(await result).toBe(false)
  expect(integration.init).not.toHaveBeenCalled()
  syncIntegration(integration, granted)
  expect(integration.init).toHaveBeenCalledTimes(1)
})

test('falha de download permite nova tentativa e não executa init', async () => {
  load.mockRejectedValueOnce(new Error('offline'))
  const integration = { id: 'retry', category: 'analytics', src: 'sdk.js', init: jest.fn() }
  await expect(executeIntegration(integration, () => granted)).rejects.toThrow('offline')
  expect(integration.init).not.toHaveBeenCalled()
  await expect(executeIntegration(integration, () => granted)).resolves.toBe(true)
  expect(integration.init).toHaveBeenCalledTimes(1)
})

test('Google envia um comando por chamada no formato Arguments e isola layers', () => {
  const ga = createGoogleAnalyticsIntegration({ measurementId: 'G-TEST' })
  const gtm = createGoogleTagManagerIntegration({
    containerId: 'GTM-TEST',
    dataLayerName: 'customLayer',
  })
  ga.bootstrap?.()
  gtm.bootstrap?.()
  expect(globals.dataLayer).toHaveLength(1)
  expect(globals.customLayer).toHaveLength(1)
  expect(Object.prototype.toString.call(globals.dataLayer[0])).toBe('[object Arguments]')
  gtm.onConsentUpdate?.(granted)
  expect(globals.dataLayer).toHaveLength(1)
  expect(globals.customLayer).toHaveLength(2)
})

test('Google mapeia categorias customizadas e consented=false prevalece sobre preferências', () => {
  const ga = createGoogleAnalyticsIntegration({
    measurementId: 'G-TEST',
    category: 'stats',
    adStorageCategory: 'ads',
  })
  ga.onConsentUpdate?.({
    consented: true,
    preferences: { necessary: true, stats: true, ads: true },
  })
  expect(globals.dataLayer[0][2]).toMatchObject({
    analytics_storage: 'granted',
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
  })
  ga.onConsentUpdate?.(denied)
  expect(Object.values(globals.dataLayer[1][2])).toEqual(['denied', 'denied', 'denied', 'denied'])
})

test('GTM prepara evento gtm.js antes de inserir o container', async () => {
  const integration = createGoogleTagManagerIntegration({ containerId: 'GTM-TEST' })
  load.mockImplementation(async () => {
    expect(globals.dataLayer.some((event: any) => event.event === 'gtm.js')).toBe(true)
  })
  await executeIntegration(integration, () => granted)
  expect(load).toHaveBeenCalledTimes(1)
})

test('Meta prepara fila oficial antes do SDK, revoga e concede sem repetir PageView', async () => {
  const integration = createFacebookPixelIntegration({ pixelId: '123' })
  const fbq = jest.fn()
  load.mockImplementation(async () => {
    expect(globals._fbq).toBe(globals.fbq)
    expect(globals.fbq.version).toBe('2.0')
    expect(globals.fbq.queue).toContainEqual(['consent', 'grant'])
    globals.fbq = fbq
  })
  await executeIntegration(integration, () => granted)
  syncIntegration(integration, denied)
  expect(fbq).toHaveBeenLastCalledWith('consent', 'revoke')
  syncIntegration(integration, granted)
  expect(fbq).toHaveBeenLastCalledWith('consent', 'grant')
  expect(fbq.mock.calls.filter((args) => args[0] === 'track')).toEqual([['track', 'PageView']])
})

test('Hotjar prepara settings antes do SDK e encerra uma vez na revogação', async () => {
  const onRevoke = jest.fn()
  const integration = createHotjarIntegration({ siteId: '123', debug: true, onRevoke })
  load.mockImplementation(async () => {
    expect(globals._hjSettings).toEqual({ hjid: 123, hjsv: 6, hjdebug: true })
    expect(typeof globals.hj).toBe('function')
  })
  await executeIntegration(integration, () => granted)
  syncIntegration(integration, denied)
  syncIntegration(integration, denied)
  expect(onRevoke).toHaveBeenCalledTimes(1)
})

test('Mixpanel prepara marcador do CDN, configura região e sincroniza opt-out', async () => {
  const sdk = { init: jest.fn(), opt_in_tracking: jest.fn(), opt_out_tracking: jest.fn() }
  load.mockImplementation(async () => {
    expect(globals.mixpanel.__SV).toBe(1.2)
    expect(globals.mixpanel._i).toEqual([])
    expect(Array.isArray(globals.mixpanel)).toBe(true)
    globals.mixpanel = sdk
  })
  const integration = createMixpanelIntegration({
    token: 'token',
    api_host: 'https://api-eu.mixpanel.com',
    config: { debug: true },
  })
  await executeIntegration(integration, () => granted)
  expect(sdk.init).toHaveBeenCalledWith('token', {
    debug: true,
    api_host: 'https://api-eu.mixpanel.com',
  })
  syncIntegration(integration, denied)
  expect(sdk.opt_out_tracking).toHaveBeenCalledTimes(1)
  syncIntegration(integration, granted)
  expect(sdk.opt_in_tracking).toHaveBeenLastCalledWith({ track: false })
})

test('Clarity usa categoria customizada e envia consentimento antes do script', async () => {
  const integration = createClarityIntegration({ projectId: 'test', category: 'stats' })
  const consent = { consented: true, preferences: { necessary: true, stats: true } }
  load.mockImplementation(async () => {
    expect(globals.clarity.q).toContainEqual([
      'consentv2',
      { analytics_Storage: 'granted', ad_Storage: 'denied' },
    ])
  })
  await executeIntegration(integration, () => consent)
  syncIntegration(integration, denied)
  expect(globals.clarity.q.at(-1)).toEqual([
    'consentv2',
    { analytics_Storage: 'denied', ad_Storage: 'denied' },
  ])
})

test('Intercom configura região antes do SDK e reinicia após shutdown', async () => {
  const sdk = jest.fn()
  load.mockImplementation(async () => {
    expect(globals.intercomSettings.api_base).toBe('https://api-iam.eu.intercom.io')
    expect(globals.Intercom.q).toEqual([])
    globals.Intercom = sdk
  })
  const integration = createIntercomIntegration({
    app_id: 'app',
    api_base: 'https://api-iam.eu.intercom.io',
  })
  await executeIntegration(integration, () => granted)
  syncIntegration(integration, denied)
  expect(sdk).toHaveBeenLastCalledWith('shutdown')
  syncIntegration(integration, granted)
  expect(sdk).toHaveBeenLastCalledWith('boot', expect.objectContaining({ app_id: 'app' }))
})

test('Zendesk Messaging tem nome explícito e não anuncia cookies do Chat Classic', () => {
  const integration = createZendeskMessagingIntegration({
    key: 'widget',
    analyticsStorageCategory: 'stats',
  })
  globals.zE = jest.fn()
  expect(integration.id).toBe('zendesk-messaging')
  expect(integration.attrs).toEqual({ id: 'ze-snippet' })
  expect(integration.cookies).toEqual([])
  integration.onConsentUpdate?.({
    consented: true,
    preferences: { necessary: true, functional: true, stats: true },
  })
  expect(globals.zE).toHaveBeenLastCalledWith('messenger:set', 'cookies', 'all')
  integration.onConsentUpdate?.(denied)
  expect(globals.zE).toHaveBeenLastCalledWith('messenger:set', 'cookies', 'none')
})
