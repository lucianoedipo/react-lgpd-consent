import React from 'react'
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import { ConsentProvider, useConsent, type Category } from '../index'
import Cookies from 'js-cookie'

// Mock do js-cookie
jest.mock('js-cookie')

const TestComponent = () => {
  const {
    consented,
    preferences,
    acceptAll,
    rejectAll,
    setPreference,
    setPreferences,
    openPreferences,
    closePreferences,
    resetConsent,
    isModalOpen,
  } = useConsent()
  return (
    <div>
      <div data-testid="consented">{consented.toString()}</div>
      <div data-testid="isModalOpen">{isModalOpen?.toString() || 'false'}</div>
      <div data-testid="analytics">{preferences.analytics?.toString() || 'false'}</div>
      <div data-testid="marketing">{preferences.marketing?.toString() || 'false'}</div>
      <div data-testid="custom-category">{preferences.custom?.toString() || 'false'}</div>
      <button onClick={acceptAll}>Accept All</button>
      <button onClick={rejectAll}>Reject All</button>
      <button onClick={() => setPreference('analytics' as Category, true)}>
        Set Analytics True
      </button>
      <button
        onClick={() => setPreferences({ necessary: true, analytics: true, marketing: false })}
      >
        Set Prefs
      </button>
      <button onClick={() => setPreference('custom' as Category, true)}>Set Custom True</button>
      <button onClick={openPreferences}>Open Modal</button>
      <button onClick={closePreferences}>Close Modal</button>
      <button onClick={resetConsent}>Reset Consent</button>
    </div>
  )
}

describe('ConsentProvider Additional Tests', () => {
  let setCookieSpy: jest.SpyInstance
  let removeCookieSpy: jest.SpyInstance

  beforeEach(() => {
    ;(Cookies.get as jest.Mock).mockClear()
    setCookieSpy = jest.spyOn(Cookies, 'set')
    removeCookieSpy = jest.spyOn(Cookies, 'remove')
  })

  afterEach(() => {
    setCookieSpy.mockRestore()
    removeCookieSpy.mockRestore()
  })

  it('deve definir uma preferência de categoria específica com setPreference', () => {
    render(
      <ConsentProvider categories={{ enabledCategories: ['analytics'] }}>
        <TestComponent />
      </ConsentProvider>,
    )

    act(() => {
      fireEvent.click(screen.getByText('Set Analytics True'))
      fireEvent.click(screen.getByText('Set Prefs')) // Save the preference
    })

    expect(screen.getByTestId('consented').textContent).toBe('true')
    expect(screen.getByTestId('analytics').textContent).toBe('true')
    expect(setCookieSpy).toHaveBeenCalled()
  })

  it('deve abrir e fechar o modal de preferências', () => {
    render(
      <ConsentProvider>
        <TestComponent />
      </ConsentProvider>,
    )

    // Modal deve estar fechado inicialmente
    expect(screen.getByTestId('isModalOpen').textContent).toBe('false')

    act(() => {
      fireEvent.click(screen.getByText('Open Modal'))
    })
    expect(screen.getByTestId('isModalOpen').textContent).toBe('true')

    act(() => {
      fireEvent.click(screen.getByText('Close Modal'))
    })
    expect(screen.getByTestId('isModalOpen').textContent).toBe('false')
  })

  it('deve resetar o consentimento e remover o cookie', () => {
    // Simula um estado inicial consentido
    const mockCookie = {
      version: '1.0',
      consented: true,
      preferences: { necessary: true, analytics: true },
      consentDate: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      source: 'banner',
      projectConfig: { enabledCategories: ['analytics'] },
    }
    ;(Cookies.get as jest.Mock).mockReturnValue(JSON.stringify(mockCookie))

    render(
      <ConsentProvider categories={{ enabledCategories: ['analytics'] }}>
        <TestComponent />
      </ConsentProvider>,
    )

    expect(screen.getByTestId('consented').textContent).toBe('true')
    setCookieSpy.mockClear() // Clear calls from initial render/hydration

    act(() => {
      fireEvent.click(screen.getByText('Reset Consent'))
    })

    expect(screen.getByTestId('consented').textContent).toBe('false')
    expect(screen.getByTestId('analytics').textContent).toBe('false')
    expect(removeCookieSpy).toHaveBeenCalledWith('cookieConsent', { path: '/' })
    expect(setCookieSpy).not.toHaveBeenCalled() // Não deve setar um novo cookie após reset
  })

  it('deve chamar onConsentGiven quando o consentimento é dado pela primeira vez', async () => {
    const onConsentGiven = jest.fn()
    render(
      <ConsentProvider onConsentGiven={onConsentGiven}>
        <TestComponent />
      </ConsentProvider>,
    )

    act(() => {
      fireEvent.click(screen.getByText('Accept All'))
    })

    await waitFor(() => {
      expect(onConsentGiven).toHaveBeenCalledTimes(1)
      expect(onConsentGiven).toHaveBeenCalledWith(
        expect.objectContaining({
          consented: true,
          preferences: expect.objectContaining({ necessary: true }),
        }),
      )
    })
  })

  it('deve chamar onPreferencesSaved quando as preferências são salvas', async () => {
    const onPreferencesSaved = jest.fn()
    render(
      <ConsentProvider onPreferencesSaved={onPreferencesSaved}>
        <TestComponent />
      </ConsentProvider>,
    )

    // Primeiro, dê o consentimento inicial para que onPreferencesSaved seja chamado em atualizações
    act(() => {
      fireEvent.click(screen.getByText('Accept All'))
    })
    await waitFor(() => expect(screen.getByTestId('consented').textContent).toBe('true'))
    onPreferencesSaved.mockClear() // Clear calls from initial consent

    // Agora, altere as preferências
    act(() => {
      fireEvent.click(screen.getByText('Set Prefs'))
    })

    await waitFor(() => {
      expect(onPreferencesSaved).toHaveBeenCalledTimes(1)
      expect(onPreferencesSaved).toHaveBeenCalledWith(
        expect.objectContaining({
          necessary: true,
          analytics: true,
          marketing: false,
        }),
      )
    })
  })

  it('deve inicializar com o initialState fornecido', () => {
    const initialMockState = {
      version: '1.0',
      consented: true,
      preferences: { necessary: true, analytics: true, marketing: false },
      consentDate: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      source: 'programmatic' as const,
      projectConfig: {
        enabledCategories: ['analytics', 'marketing'] as Category[],
      },
      isModalOpen: false,
    }

    render(
      <ConsentProvider initialState={initialMockState}>
        <TestComponent />
      </ConsentProvider>,
    )

    expect(screen.getByTestId('consented').textContent).toBe('true')
    expect(screen.getByTestId('analytics').textContent).toBe('true')
    expect(screen.getByTestId('marketing').textContent).toBe('false')
    expect(screen.getByTestId('isModalOpen').textContent).toBe('false') // isModalOpen deve ser false na hidratação
  })

  // Teste removido: Custom categories foram descontinuadas na v0.3.0+
})
