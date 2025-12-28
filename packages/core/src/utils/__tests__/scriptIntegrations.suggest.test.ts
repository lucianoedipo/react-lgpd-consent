import { createSuggestedIntegration, suggestCategoryForScript } from '../scriptIntegrations'

describe('suggestCategoryForScript', () => {
  it('suggests marketing for facebook/pixel', () => {
    expect(suggestCategoryForScript('facebook-pixel')).toEqual(['marketing'])
    expect(suggestCategoryForScript('pixel')).toEqual(['marketing'])
  })

  it('suggests analytics for hotjar/mixpanel/clarity', () => {
    expect(suggestCategoryForScript('hotjar')).toEqual(['analytics'])
    expect(suggestCategoryForScript('mixpanel')).toEqual(['analytics'])
    expect(suggestCategoryForScript('clarity')).toEqual(['analytics'])
  })

  it('suggests functional for intercom/zendesk/chat', () => {
    expect(suggestCategoryForScript('intercom')).toEqual(['functional'])
    expect(suggestCategoryForScript('zendesk-chat')).toEqual(['functional'])
    expect(suggestCategoryForScript('live-chat')).toEqual(['functional'])
  })

  it('defaults to analytics for unknown scripts', () => {
    expect(suggestCategoryForScript('unknown-script')).toEqual(['analytics'])
  })
})

describe('createSuggestedIntegration', () => {
  it('applies suggested category when none is provided', () => {
    const integration = createSuggestedIntegration({
      id: 'facebook-pixel',
      src: 'https://example.com/pixel.js',
    })

    expect(integration.category).toBe('marketing')
  })

  it('allows overriding the suggested category', () => {
    const integration = createSuggestedIntegration({
      id: 'custom-chat',
      src: 'https://example.com/chat.js',
      category: 'analytics',
    })

    expect(integration.category).toBe('analytics')
  })
})
