import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { ConsentProvider, useConsent } from '../index'
import Cookies from 'js-cookie'
import * as devGuidance from '../utils/developerGuidance'

// Mock do js-cookie
jest.mock('js-cookie')

let logGuidanceSpy: jest.SpyInstance
let consoleGroupSpy: jest.SpyInstance

const TestComponent = () => {
  const { consented, preferences, acceptAll, rejectAll, setPreferences } =
    useConsent()
  return (
    <div>
      <div data-testid="consented">{consented.toString()}</div>
      <div data-testid="analytics">
        {preferences.analytics?.toString() || 'false'}
      </div>
      <div data-testid="marketing">
        {preferences.marketing?.toString() || 'false'}
      </div>
      <button onClick={acceptAll}>Accept All</button>
      <button onClick={rejectAll}>Reject All</button>
      <button
        onClick={() =>
          setPreferences({ necessary: true, analytics: true, marketing: false })
        }
      >
        Set Prefs
      </button>
    </div>
  )
}

describe('ConsentProvider', () => {
  beforeEach(() => {
    ;(Cookies.get as jest.Mock).mockClear()
    ;(Cookies.set as jest.Mock).mockClear()
    logGuidanceSpy = jest.spyOn(devGuidance, 'logDeveloperGuidance')
    consoleGroupSpy = jest.spyOn(console, 'group').mockImplementation(() => {})
  })

  afterEach(() => {
    logGuidanceSpy.mockRestore()
    consoleGroupSpy.mockRestore()
  })

  it('deve carregar o estado padrão (sem consentimento)', () => {
    act(() => {
      render(
        <ConsentProvider
          categories={{ enabledCategories: ['analytics', 'marketing'] }}
        >
          <TestComponent />
        </ConsentProvider>,
      )
    })

    expect(screen.getByTestId('consented').textContent).toBe('false')
    expect(screen.getByTestId('analytics').textContent).toBe('false')
    expect(screen.getByTestId('marketing').textContent).toBe('false')
  })

  it('deve aceitar todas as categorias ao clicar em "Accept All"', () => {
    act(() => {
      render(
        <ConsentProvider
          categories={{ enabledCategories: ['analytics', 'marketing'] }}
        >
          <TestComponent />
        </ConsentProvider>,
      )
    })

    act(() => {
      fireEvent.click(screen.getByText('Accept All'))
    })

    expect(screen.getByTestId('consented').textContent).toBe('true')
    expect(screen.getByTestId('analytics').textContent).toBe('true')
    expect(screen.getByTestId('marketing').textContent).toBe('true')
    expect(Cookies.set).toHaveBeenCalled()
  })

  it('deve rejeitar categorias não essenciais ao clicar em "Reject All"', () => {
    act(() => {
      render(
        <ConsentProvider
          categories={{ enabledCategories: ['analytics', 'marketing'] }}
        >
          <TestComponent />
        </ConsentProvider>,
      )
    })

    act(() => {
      fireEvent.click(screen.getByText('Reject All'))
    })

    expect(screen.getByTestId('consented').textContent).toBe('true')
    expect(screen.getByTestId('analytics').textContent).toBe('false')
    expect(screen.getByTestId('marketing').textContent).toBe('false')
    expect(Cookies.set).toHaveBeenCalled()
  })

  it('deve definir preferências específicas', () => {
    act(() => {
      render(
        <ConsentProvider
          categories={{ enabledCategories: ['analytics', 'marketing'] }}
        >
          <TestComponent />
        </ConsentProvider>,
      )
    })

    act(() => {
      fireEvent.click(screen.getByText('Set Prefs'))
    })

    expect(screen.getByTestId('consented').textContent).toBe('true')
    expect(screen.getByTestId('analytics').textContent).toBe('true')
    expect(screen.getByTestId('marketing').textContent).toBe('false')
    expect(Cookies.set).toHaveBeenCalled()
  })

  it('deve hidratar o estado a partir de um cookie existente', () => {
    const mockCookie = {
      version: '1.0',
      consented: true,
      preferences: { necessary: true, analytics: true, marketing: false },
      consentDate: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      source: 'banner',
      projectConfig: { enabledCategories: ['analytics', 'marketing'] },
    }
    ;(Cookies.get as jest.Mock).mockReturnValue(JSON.stringify(mockCookie))

    act(() => {
      render(
        <ConsentProvider
          categories={{ enabledCategories: ['analytics', 'marketing'] }}
        >
          <TestComponent />
        </ConsentProvider>,
      )
    })

    expect(screen.getByTestId('consented').textContent).toBe('true')
    expect(screen.getByTestId('analytics').textContent).toBe('true')
    expect(screen.getByTestId('marketing').textContent).toBe('false')
  })

  it('deve chamar os logs de orientação por padrão', () => {
    render(
      <ConsentProvider>
        <TestComponent />
      </ConsentProvider>,
    )
    expect(logGuidanceSpy).toHaveBeenCalled()
  })

  it('não deve chamar os logs de orientação quando desabilitado', () => {
    consoleGroupSpy.mockClear() // Clear any previous calls

    render(
      <ConsentProvider disableDeveloperGuidance={true}>
        <TestComponent />
      </ConsentProvider>,
    )

    // Verifica se nenhum grupo de console foi criado (indicando que não há logs)
    expect(consoleGroupSpy).not.toHaveBeenCalled()
  })
})
