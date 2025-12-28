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

    expect(() => ga.bootstrap?.()).not.toThrow()
    expect(() => ga.init?.()).not.toThrow()
    expect(() => gtm.bootstrap?.()).not.toThrow()
    expect(() => gtm.init?.()).not.toThrow()
    expect(() => fb.init?.()).not.toThrow()
    expect(() => hotjar.init?.()).not.toThrow()
    expect(() => mixpanel.init?.()).not.toThrow()
    expect(() => clarity.init?.()).not.toThrow()
    expect(() => intercom.init?.()).not.toThrow()
    expect(() => zendesk.init?.()).not.toThrow()
    expect(() => userway.init?.()).not.toThrow()
    expect(suggested.category).toBe('functional')
  })
})
