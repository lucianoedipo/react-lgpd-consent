import * as React from 'react'
import { render } from '@testing-library/react'
import { SafeThemeProvider } from './SafeThemeProvider'
import { useTheme } from '@mui/material/styles'

function ThemeConsumer() {
  const theme = useTheme()
  return <div data-testid="primary">{theme.palette.primary.main}</div>
}

describe('SafeThemeProvider', () => {
  // Suprimir logs do developerGuidance durante estes testes
  let __logSpy: jest.SpyInstance,
    __infoSpy: jest.SpyInstance,
    __groupSpy: jest.SpyInstance,
    __warnSpy: jest.SpyInstance,
    __errorSpy: jest.SpyInstance

  beforeAll(() => {
    __logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    __infoSpy = jest.spyOn(console, 'info').mockImplementation(() => {})
    __groupSpy = jest.spyOn(console, 'group').mockImplementation(() => {})
    __warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    __errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterAll(() => {
    __logSpy.mockRestore()
    __infoSpy.mockRestore()
    __groupSpy.mockRestore()
    __warnSpy.mockRestore()
    __errorSpy.mockRestore()
  })

  test('renders children with a safe theme when no theme provided', () => {
    const { getByTestId } = render(
      <SafeThemeProvider>
        <ThemeConsumer />
      </SafeThemeProvider>,
    )

    const el = getByTestId('primary')
    expect(el.textContent).toBe('#1976d2')
  })

  test('merges user theme with safe defaults', () => {
    const userTheme = { palette: { primary: { main: '#123456' } } }
    const { getByTestId } = render(
      <SafeThemeProvider theme={userTheme}>
        <ThemeConsumer />
      </SafeThemeProvider>,
    )

    const el = getByTestId('primary')
    expect(el.textContent).toBe('#123456')
  })
})
