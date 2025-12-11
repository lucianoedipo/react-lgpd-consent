import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'
import * as ConsentContext from '../../context/ConsentContext'
import { ConsentProvider } from '../../context/ConsentContext'
import {
  _registerGlobalOpenPreferences,
  _unregisterGlobalOpenPreferences,
  openPreferencesModal,
  useConsent,
  useOpenPreferencesModal,
} from '../useConsent'

function TestConsumer() {
  const { preferences, acceptAll, rejectAll, setPreference } = useConsent()

  return (
    <div>
      <div data-testid="preferences">{JSON.stringify(preferences)}</div>
      <button onClick={() => acceptAll()} data-testid="accept-all">
        accept
      </button>
      <button onClick={() => rejectAll()} data-testid="reject-all">
        reject
      </button>
      <button onClick={() => setPreference('analytics', true)} data-testid="set-analytics-true">
        set-analytics
      </button>
    </div>
  )
}

describe('useConsent hook', () => {
  // console.* é suprimido globalmente em jest.setup.ts
  test('acceptAll and rejectAll update preferences', async () => {
    const initialState = {
      consented: false,
      isModalOpen: false,
      preferences: { necessary: true, analytics: false },
      version: '1.0',
      consentDate: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      source: 'programmatic',
      projectConfig: { enabledCategories: ['analytics'] },
    }

    render(
      <ConsentProvider initialState={initialState as any}>
        <TestConsumer />
      </ConsentProvider>,
    )

    expect(screen.getByTestId('preferences').textContent).toContain('analytics":false')

    await userEvent.click(screen.getByTestId('accept-all'))
    expect(screen.getByTestId('preferences').textContent).toContain('analytics":true')

    await userEvent.click(screen.getByTestId('reject-all'))
    expect(screen.getByTestId('preferences').textContent).toContain('analytics":false')
  })

  test('setPreference updates single category', async () => {
    const initialState = {
      consented: false,
      isModalOpen: false,
      preferences: { necessary: true, analytics: false, marketing: false },
      version: '1.0',
      consentDate: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      source: 'programmatic',
      projectConfig: { enabledCategories: ['analytics', 'marketing'] },
    }

    render(
      <ConsentProvider initialState={initialState as any}>
        <TestConsumer />
      </ConsentProvider>,
    )

    expect(screen.getByTestId('preferences').textContent).toContain('marketing":false')
    await userEvent.click(screen.getByTestId('set-analytics-true'))
    expect(screen.getByTestId('preferences').textContent).toContain('analytics":true')
  })
})

describe('useOpenPreferencesModal', () => {
  it('should throw an error when used outside of ConsentProvider', () => {
    const originalError = console.error
    console.error = jest.fn()

    const actionsSpy = jest
      .spyOn(ConsentContext, 'useConsentActionsInternal')
      .mockReturnValue(null as any)

    function TestComponent() {
      useOpenPreferencesModal()
      return null
    }

    expect(() => {
      render(<TestComponent />)
    }).toThrow(
      '[LGPD-CONSENT] useOpenPreferencesModal deve ser usado dentro do ConsentProvider. Envolva seu componente com <ConsentProvider>.',
    )

    console.error = originalError
    actionsSpy.mockRestore()
  })

  it('retorna a função openPreferences quando dentro do provider', async () => {
    const recorder = jest.fn()

    function Observer() {
      const open = useOpenPreferencesModal()
      const { isModalOpen } = useConsent()
      React.useEffect(() => {
        recorder(open)
      }, [open])
      return <div data-testid="modal-state">{isModalOpen ? 'open' : 'closed'}</div>
    }

    render(
      <ConsentProvider categories={{ enabledCategories: ['analytics'] }}>
        <Observer />
      </ConsentProvider>,
    )

    expect(recorder).toHaveBeenCalledWith(expect.any(Function))
    const openFn = recorder.mock.calls[0][0] as () => void

    await act(async () => {
      openFn()
    })

    expect(screen.getByTestId('modal-state')).toHaveTextContent('open')
  })
})

describe('openPreferencesModal', () => {
  it('should call the global handler when registered', () => {
    const handler = jest.fn()
    _registerGlobalOpenPreferences(handler)
    openPreferencesModal()
    expect(handler).toHaveBeenCalled()
  })

  it('should not throw when no handler is registered', () => {
    _unregisterGlobalOpenPreferences()
    expect(() => openPreferencesModal()).not.toThrow()
  })
})
