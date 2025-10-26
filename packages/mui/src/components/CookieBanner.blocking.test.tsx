import { ConsentProvider } from '@react-lgpd-consent/core'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Cookies from 'js-cookie'

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
})
