import React from 'react'
import '@testing-library/jest-dom'
import { render, waitFor, screen } from '@testing-library/react'
import { ConsentProvider } from '../index'
import type { CustomCookieBannerProps } from '../types/types'
import { useConsent } from '../hooks/useConsent'

describe('ConsentProvider blockingStrategy overlay', () => {
  beforeEach(() => {
    // Limpa possível cookie persistente entre testes
    document.cookie = 'cookieConsent=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
  })
  it('renders provider overlay when blockingStrategy="provider" and not consented', async () => {
    const { queryByTestId } = render(
      <ConsentProvider blocking blockingStrategy="provider">
        <div>App</div>
      </ConsentProvider>,
    )

    await waitFor(() => {
      expect(queryByTestId('lgpd-provider-overlay')).toBeInTheDocument()
    })
  })

  it('does not render provider overlay when blockingStrategy="auto" (default)', async () => {
    const { queryByTestId } = render(
      <ConsentProvider blocking disableFloatingPreferencesButton>
        <div>App</div>
      </ConsentProvider>,
    )

    // Hydration happens asynchronously; wait a tick to ensure effect runs
    await waitFor(() => {
      expect(queryByTestId('lgpd-provider-overlay')).not.toBeInTheDocument()
    })
  })

  it('uses designTokens.layout.backdrop=false as transparent overlay', async () => {
    const { getByTestId } = render(
      <ConsentProvider
        blocking
        blockingStrategy="provider"
        designTokens={{ layout: { backdrop: false } }}
        disableFloatingPreferencesButton
      >
        <div>App</div>
      </ConsentProvider>,
    )

    const overlay = await waitFor(() => getByTestId('lgpd-provider-overlay'))
    expect(overlay).toHaveAttribute('data-testid', 'lgpd-provider-overlay')
    // jsdom may normalize 'transparent' to 'rgba(0, 0, 0, 0)'; aceitar ambas formas
    const bg = window.getComputedStyle(overlay).backgroundColor
    expect(['transparent', 'rgba(0, 0, 0, 0)', 'rgba(0,0,0,0)']).toContain(bg)
  })

  it('uses designTokens.layout.backdrop color when provided', async () => {
    const color = 'rgba(10, 20, 30, 0.5)'
    const { getByTestId } = render(
      <ConsentProvider
        blocking
        blockingStrategy="provider"
        designTokens={{ layout: { backdrop: color } }}
        disableFloatingPreferencesButton
      >
        <div>App</div>
      </ConsentProvider>,
    )
    const overlay = await waitFor(() => getByTestId('lgpd-provider-overlay'))
    expect(overlay).toHaveStyle(`background-color: ${color}`)
  })

  it('falls back to default overlay color when no designTokens provided', async () => {
    const { getByTestId } = render(
      <ConsentProvider blocking blockingStrategy="provider" disableFloatingPreferencesButton>
        <div>App</div>
      </ConsentProvider>,
    )
    const overlay = await waitFor(() => getByTestId('lgpd-provider-overlay'))
    expect(overlay).toHaveStyle('background-color: rgba(0, 0, 0, 0.4)')
  })

  it('does not render overlay when blocking=false even with provider strategy', async () => {
    const { queryByTestId } = render(
      <ConsentProvider
        blocking={false}
        blockingStrategy="provider"
        disableFloatingPreferencesButton
      >
        <div>App</div>
      </ConsentProvider>,
    )
    await waitFor(() => {
      expect(queryByTestId('lgpd-provider-overlay')).not.toBeInTheDocument()
    })
  })

  it('removes overlay after user consents (provider strategy)', async () => {
    function TriggerAccept() {
      const { acceptAll } = useConsent()
      React.useEffect(() => {
        const timer = setTimeout(() => acceptAll(), 0)
        return () => clearTimeout(timer)
      }, [acceptAll])
      return null
    }

    const { queryByTestId, getByTestId } = render(
      <ConsentProvider blocking blockingStrategy="provider" disableFloatingPreferencesButton>
        <TriggerAccept />
        <div>App</div>
      </ConsentProvider>,
    )

    // Overlay aparece primeiro
    await waitFor(() => getByTestId('lgpd-provider-overlay'))
    // Após consentimento, overlay some
    await waitFor(() => {
      expect(queryByTestId('lgpd-provider-overlay')).not.toBeInTheDocument()
    })
  })

  it('passes blocking prop to custom banner (informative), overlay only with provider strategy', async () => {
    const CustomBanner = (props: CustomCookieBannerProps) => {
      return (
        <div>
          <span data-testid="custom-banner" data-blocking={props.blocking ? 'true' : 'false'}>
            Banner
          </span>
        </div>
      )
    }

    const { rerender } = render(
      <ConsentProvider
        blocking
        CookieBannerComponent={CustomBanner}
        disableFloatingPreferencesButton
      >
        <div>App</div>
      </ConsentProvider>,
    )
    await waitFor(() => expect(screen.getByTestId('custom-banner')).toBeInTheDocument())
    expect(screen.getByTestId('custom-banner').getAttribute('data-blocking')).toBe('true')
    // Estratégia padrão 'auto': sem overlay
    expect(screen.queryByTestId('lgpd-provider-overlay')).not.toBeInTheDocument()

    // Com provider: overlay presente
    rerender(
      <ConsentProvider
        blocking
        blockingStrategy="provider"
        CookieBannerComponent={CustomBanner}
        disableFloatingPreferencesButton
      >
        <div>App</div>
      </ConsentProvider>,
    )
    await waitFor(() => expect(screen.getByTestId('custom-banner')).toBeInTheDocument())
    expect(screen.getByTestId('custom-banner').getAttribute('data-blocking')).toBe('true')
    await waitFor(() => expect(screen.getByTestId('lgpd-provider-overlay')).toBeInTheDocument())
  })
})
