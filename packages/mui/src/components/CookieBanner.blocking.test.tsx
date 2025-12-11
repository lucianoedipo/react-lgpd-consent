import { ConsentProvider } from '@react-lgpd-consent/mui'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Cookies from 'js-cookie'
import { ThemeProvider, createTheme } from '@mui/material/styles'

jest.mock('js-cookie')

function makeInitialState(consented = false) {
  const now = new Date().toISOString()
  return {
    version: '1.0',
    consented,
    preferences: { necessary: true },
    consentDate: now,
    lastUpdate: now,
    source: 'programmatic' as const,
    projectConfig: { enabledCategories: [] as any },
  }
}

describe('CookieBanner blocking/non-blocking rendering', () => {
  beforeEach(() => jest.clearAllMocks())

  it('renders as Snackbar when blocking=false', async () => {
    render(
      <ConsentProvider
        categories={{ enabledCategories: ['analytics'] }}
        initialState={makeInitialState(false)}
        cookieBannerProps={{
          blocking: false,
          SnackbarProps: { 'data-testid': 'cookie-snackbar' } as any,
        }}
      >
        <div />
      </ConsentProvider>,
    )

    // Message visible and Snackbar wrapper present
    expect(await screen.findByText(/Utilizamos cookies/i)).toBeInTheDocument()
    expect(screen.getByTestId('cookie-snackbar')).toBeInTheDocument()
  })

  it('does not render Snackbar when blocking=true (overlay/modal style)', async () => {
    render(
      <ConsentProvider
        categories={{ enabledCategories: ['analytics'] }}
        initialState={makeInitialState(false)}
        cookieBannerProps={{
          blocking: true,
          SnackbarProps: { 'data-testid': 'cookie-snackbar' } as any,
        }}
      >
        <div />
      </ConsentProvider>,
    )

    // Banner text is visible but Snackbar wrapper should not exist
    expect(await screen.findByText(/Utilizamos cookies/i)).toBeInTheDocument()
    expect(screen.queryByTestId('cookie-snackbar')).toBeNull()
  })

  it('clicking Recusar triggers provider persistence (cookie write)', async () => {
    render(
      <ConsentProvider
        categories={{ enabledCategories: ['analytics'] }}
        initialState={makeInitialState(false)}
      >
        <div />
      </ConsentProvider>,
    )

    const rejectBtn = await screen.findByRole('button', {
      name: /Recusar|Rejeitar/i,
    })
    await userEvent.click(rejectBtn)
    expect(Cookies.set).toHaveBeenCalled()
  })

  it('clicking Preferências opens the modal dialog', async () => {
    render(
      <ConsentProvider
        categories={{ enabledCategories: ['analytics'] }}
        initialState={makeInitialState(false)}
      >
        <div />
      </ConsentProvider>,
    )

    const prefsBtn = await screen.findByRole('button', { name: /Preferências/i })
    await userEvent.click(prefsBtn)
    expect(await screen.findByRole('dialog')).toBeInTheDocument()
  })

  it('não aplica overlay quando a rota atual é segura (policyLinkUrl/termsLinkUrl)', async () => {
    const originalHref = window.location.href
    window.history.replaceState(null, '', '/politica')

    try {
      render(
        <ConsentProvider
          categories={{ enabledCategories: ['analytics'] }}
          initialState={makeInitialState(false)}
          cookieBannerProps={{
            blocking: true,
            policyLinkUrl: '/politica',
            SnackbarProps: { 'data-testid': 'cookie-snackbar' } as any,
          }}
        >
          <div />
        </ConsentProvider>,
      )

      expect(await screen.findByText(/Utilizamos cookies/i)).toBeInTheDocument()
      expect(screen.getByTestId('cookie-snackbar')).toBeInTheDocument()
      expect(screen.queryByTestId('lgpd-cookie-banner-overlay')).toBeNull()
    } finally {
      window.history.replaceState(null, '', originalHref)
    }
  })

  it("usa backdrop 'auto' com tema dark aplicando cor clara", async () => {
    const theme = createTheme({ palette: { mode: 'dark' } })

    render(
      <ThemeProvider theme={theme}>
        <ConsentProvider
          categories={{ enabledCategories: ['analytics'] }}
          initialState={makeInitialState(false)}
          designTokens={{ layout: { backdrop: 'auto' } } as any}
          cookieBannerProps={{ blocking: true } as any}
        >
          <div />
        </ConsentProvider>
      </ThemeProvider>,
    )

    expect(await screen.findByText(/Utilizamos cookies/i)).toBeInTheDocument()

    const overlay = await screen.findByTestId('lgpd-cookie-banner-overlay')
    const overlayStyles = window.getComputedStyle(overlay)
    expect(overlayStyles.backgroundColor).toBe('rgba(255, 255, 255, 0.12)')
  })

  it('aplica z-index customizado vindo de designTokens no banner e overlay', async () => {
    render(
      <ConsentProvider
        categories={{ enabledCategories: ['analytics'] }}
        initialState={makeInitialState(false)}
        designTokens={{ layout: { zIndex: { banner: 2500, backdrop: 2400 } } } as any}
        cookieBannerProps={{ blocking: true } as any}
      >
        <div />
      </ConsentProvider>,
    )

    const overlay = await screen.findByTestId('lgpd-cookie-banner-overlay')
    expect(window.getComputedStyle(overlay).zIndex).toBe('2400')

    const bannerWrapper = await screen.findByTestId('lgpd-cookie-banner-wrapper')
    expect(window.getComputedStyle(bannerWrapper as HTMLElement).zIndex).toBe('2500')
  })

  it('propaga hideBranding do provider para o CookieBanner padrão', async () => {
    render(
      <ConsentProvider
        categories={{ enabledCategories: ['analytics'] }}
        initialState={makeInitialState(false)}
        hideBranding
      >
        <div />
      </ConsentProvider>,
    )

    expect(await screen.findByText(/Utilizamos cookies/i)).toBeInTheDocument()
    expect(screen.queryByText(/fornecido por|LÉdipO\.eti\.br/i)).toBeNull()
  })

  it('permite sobrescrever hideBranding via cookieBannerProps', async () => {
    render(
      <ConsentProvider
        categories={{ enabledCategories: ['analytics'] }}
        initialState={makeInitialState(false)}
        hideBranding
        cookieBannerProps={{ hideBranding: false } as any}
      >
        <div />
      </ConsentProvider>,
    )

    expect(await screen.findByText(/Utilizamos cookies/i)).toBeInTheDocument()
    expect(
      screen.getByRole('link', {
        name: /LÉdipO\.eti\.br/i,
      }),
    ).toBeInTheDocument()
  })

  it('aplica z-index customizado vindo de designTokens no banner e overlay (blocking mode)', async () => {
    render(
      <ConsentProvider
        categories={{ enabledCategories: ['analytics'] }}
        initialState={makeInitialState(false)}
        designTokens={{ layout: { zIndex: { banner: 2500, backdrop: 2400 } } } as any}
        cookieBannerProps={{ blocking: true } as any}
      >
        <div />
      </ConsentProvider>,
    )

    const overlay = await screen.findByTestId('lgpd-cookie-banner-overlay')
    expect(window.getComputedStyle(overlay).zIndex).toBe('2400')

    const bannerWrapper = await screen.findByTestId('lgpd-cookie-banner-wrapper')
    expect(window.getComputedStyle(bannerWrapper as HTMLElement).zIndex).toBe('2500')
  })
})
