import * as React from 'react'
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles'
import { render, screen } from '@testing-library/react'
import { ConsentProvider } from './ConsentContext'

function ThemeInspector() {
  const theme = useTheme()
  return <div data-testid="theme-primary">{(theme as any).palette?.primary?.main}</div>
}

describe('ConsentProvider theme integration', () => {
  test('prefers app ThemeProvider over library default', () => {
    const appTheme = createTheme({ palette: { primary: { main: '#ff0000' } } })

    render(
      <ThemeProvider theme={appTheme}>
        <ConsentProvider categories={{ enabledCategories: ['analytics'] }}>
          <ThemeInspector />
        </ConsentProvider>
      </ThemeProvider>,
    )

    expect(screen.getByTestId('theme-primary').textContent).toBe('#ff0000')
  })
})
