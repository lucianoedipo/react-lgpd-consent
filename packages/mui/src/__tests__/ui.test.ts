import * as ui from '../ui'

describe('ui entrypoint', () => {
  it('exports ui-only components', () => {
    expect(ui.Branding).toBeDefined()
    expect(ui.ConsentProvider).toBeDefined()
    expect(ui.CookieBanner).toBeDefined()
    expect(ui.FloatingPreferencesButton).toBeDefined()
    expect(ui.PreferencesModal).toBeDefined()
  })
})
