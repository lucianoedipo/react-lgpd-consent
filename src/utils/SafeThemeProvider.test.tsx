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
  // console.* é suprimido globalmente em jest.setup.ts
  afterAll(() => jest.restoreAllMocks())

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
