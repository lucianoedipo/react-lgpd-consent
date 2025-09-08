import { createGoogleAnalyticsIntegration } from './scriptIntegrations'

describe('scriptIntegrations attrs', () => {
  it('google analytics integration provides async attr', () => {
    const ga = createGoogleAnalyticsIntegration({ measurementId: 'G-ATTR' })
    expect(ga.attrs).toBeDefined()
    expect(ga.attrs).toHaveProperty('async', 'true')
  })
})

