import { suggestCategoryForScript } from './scriptIntegrations'

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
})
