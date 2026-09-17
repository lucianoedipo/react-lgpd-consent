/**
 * @jest-environment node
 */

import {
  createClarityIntegration,
  createFacebookPixelIntegration,
  createGoogleAnalyticsIntegration,
  createGoogleTagManagerIntegration,
  createHotjarIntegration,
  createIntercomIntegration,
  createMixpanelIntegration,
  createSuggestedIntegration,
  createUserWayIntegration,
  createZendeskChatIntegration,
} from '../scriptIntegrations'

describe('scriptIntegrations SSR (node)', () => {
  it('does not throw when window is undefined', () => {
    const ga = createGoogleAnalyticsIntegration({ measurementId: 'G-TEST' })
    const gtm = createGoogleTagManagerIntegration({ containerId: 'GTM-TEST' })
    const fb = createFacebookPixelIntegration({ pixelId: '123' })
    const hotjar = createHotjarIntegration({ siteId: '999' })
    const mixpanel = createMixpanelIntegration({ token: 'tok' })
    const clarity = createClarityIntegration({ projectId: 'clarity', upload: true })
    const intercom = createIntercomIntegration({ app_id: 'app' })
    const zendesk = createZendeskChatIntegration({ key: 'key' })
    const userway = createUserWayIntegration({ accountId: 'acc' })
    const suggested = createSuggestedIntegration({
      id: 'custom-chat',
      src: 'https://example.com/chat.js',
    })

    const consent = {
      consented: true,
      preferences: { necessary: true, analytics: true, marketing: true, functional: true },
    }

    expect(() => ga.bootstrap?.()).not.toThrow()
    expect(() => ga.init?.()).not.toThrow()
    expect(() => ga.beforeLoad?.(consent)).not.toThrow()
    expect(() => gtm.bootstrap?.()).not.toThrow()
    expect(() => gtm.init?.()).not.toThrow()
    expect(() => gtm.beforeLoad?.(consent)).not.toThrow()
    expect(() => fb.init?.()).not.toThrow()
    expect(() => fb.beforeLoad?.(consent)).not.toThrow()
    expect(() => fb.onConsentUpdate?.(consent)).not.toThrow()
    expect(() => hotjar.init?.()).not.toThrow()
    expect(() => hotjar.beforeLoad?.(consent)).not.toThrow()
    expect(() => hotjar.onConsentUpdate?.(consent)).not.toThrow()
    expect(() => mixpanel.init?.()).not.toThrow()
    expect(() => mixpanel.beforeLoad?.(consent)).not.toThrow()
    expect(() => mixpanel.onConsentUpdate?.(consent)).not.toThrow()
    expect(() => clarity.init?.()).not.toThrow()
    expect(() => clarity.beforeLoad?.(consent)).not.toThrow()
    expect(() => clarity.onConsentUpdate?.(consent)).not.toThrow()
    expect(() => intercom.init?.()).not.toThrow()
    expect(() => intercom.beforeLoad?.(consent)).not.toThrow()
    expect(() => intercom.onConsentUpdate?.(consent)).not.toThrow()
    expect(() => zendesk.init?.()).not.toThrow()
    expect(() => zendesk.beforeLoad?.(consent)).not.toThrow()
    expect(() => zendesk.onConsentUpdate?.(consent)).not.toThrow()
    expect(() => userway.init?.()).not.toThrow()
    expect(suggested.category).toBe('functional')
  })
})
