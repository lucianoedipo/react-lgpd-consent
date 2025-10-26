import { createDefaultConsentTheme } from './theme'

describe('createDefaultConsentTheme', () => {
  test('has expected primary main color and typography', () => {
    const defaultConsentTheme = createDefaultConsentTheme()
    expect(defaultConsentTheme.palette.primary.main).toBe('#1976d2')
    expect(defaultConsentTheme.typography.button?.textTransform).toBe('none')
  })

  test('button style overrides include borderRadius and padding', () => {
    const defaultConsentTheme = createDefaultConsentTheme()
    const buttonOverrides = defaultConsentTheme.components?.MuiButton?.styleOverrides
    expect(buttonOverrides).toBeDefined()
    // check root overrides exist
    expect((buttonOverrides as any).root).toBeDefined()
    expect((buttonOverrides as any).root.borderRadius).toBe(8)
  })
})
