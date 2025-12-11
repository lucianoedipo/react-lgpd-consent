import { createDefaultConsentTheme, defaultConsentTheme } from '../theme'

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

  test('has complete palette configuration', () => {
    const theme = createDefaultConsentTheme()
    expect(theme.palette.primary.contrastText).toBe('#ffffff')
    expect(theme.palette.secondary.main).toBe('#dc004e')
    expect(theme.palette.background.default).toBe('#fafafa')
    expect(theme.palette.background.paper).toBe('#ffffff')
    expect(theme.palette.text.primary).toBe('#333333')
    expect(theme.palette.text.secondary).toBe('#666666')
  })

  test('has typography configuration', () => {
    const theme = createDefaultConsentTheme()
    expect(theme.typography.fontFamily).toContain('Roboto')
    expect(theme.typography.body2?.fontSize).toBe('0.875rem')
    expect(theme.typography.button?.fontWeight).toBe(500)
  })

  test('has Paper and Dialog component overrides', () => {
    const theme = createDefaultConsentTheme()
    const paperOverrides = theme.components?.MuiPaper?.styleOverrides
    const dialogOverrides = theme.components?.MuiDialog?.styleOverrides

    expect((paperOverrides as any)?.root?.borderRadius).toBe(12)
    expect((dialogOverrides as any)?.paper?.borderRadius).toBe(16)
  })

  test('has contained button hover shadow', () => {
    const theme = createDefaultConsentTheme()
    const buttonOverrides = theme.components?.MuiButton?.styleOverrides
    expect((buttonOverrides as any)?.contained?.boxShadow).toBeDefined()
    expect((buttonOverrides as any)?.contained?.['&:hover']?.boxShadow).toBeDefined()
  })
})

describe('defaultConsentTheme (deprecated)', () => {
  test('returns a valid theme instance', () => {
    const theme = defaultConsentTheme()
    expect(theme.palette.primary.main).toBe('#1976d2')
  })

  test('returns new instance each time called', () => {
    const theme1 = defaultConsentTheme()
    const theme2 = defaultConsentTheme()
    // São objetos diferentes (nova instância)
    expect(theme1).not.toBe(theme2)
    // Mas com mesmos valores
    expect(theme1.palette.primary.main).toBe(theme2.palette.primary.main)
  })
})
