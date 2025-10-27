import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import Cookies from 'js-cookie'
import { ConsentProvider, useConsent, type Category } from '../index'
import * as devGuidance from '../utils/developerGuidance'
import { logger } from '../utils/logger'

// Mock do js-cookie
jest.mock('js-cookie')

let logGuidanceSpy: jest.SpyInstance
let consoleGroupSpy: jest.SpyInstance

const TestComponentBasic = () => {
  const { consented, preferences, acceptAll, rejectAll, setPreferences } = useConsent()
  return (
    <div>
      <div data-testid="consented">{consented.toString()}</div>
      <div data-testid="analytics">{preferences.analytics?.toString() || 'false'}</div>
      <div data-testid="marketing">{preferences.marketing?.toString() || 'false'}</div>
      <button onClick={acceptAll}>Accept All</button>
      <button onClick={rejectAll}>Reject All</button>
      <button
        onClick={() => setPreferences({ necessary: true, analytics: true, marketing: false })}
      >
        Set Prefs
      </button>
    </div>
  )
}

// Versão estendida usada pelos testes adicionais
const TestComponentExtended = () => {
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
      <div data-testid="necessary">{preferences.necessary?.toString() || 'false'}</div>
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
      <button onClick={() => setPreference('necessary' as Category, false)}>
        Try Disable Necessary
      </button>
      <button
        onClick={() =>
          setPreferences({
            ...preferences,
            necessary: false,
          })
        }
      >
        Submit Without Necessary
      </button>
      <button onClick={() => setPreference('custom' as Category, true)}>Set Custom True</button>
      <button onClick={openPreferences}>Open Modal</button>
      <button onClick={closePreferences}>Close Modal</button>
      <button onClick={resetConsent}>Reset Consent</button>
    </div>
  )
}

describe('ConsentProvider', () => {
  beforeEach(() => {
    ;(Cookies.get as jest.Mock).mockClear()
    ;(Cookies.set as jest.Mock).mockClear()
    ;(Cookies.remove as jest.Mock).mockClear()
    logGuidanceSpy = jest.spyOn(devGuidance, 'logDeveloperGuidance')
    consoleGroupSpy = jest.spyOn(console, 'group').mockImplementation(() => {})
  })

  afterEach(() => {
    logGuidanceSpy.mockRestore()
    consoleGroupSpy.mockRestore()
  })

  it('ignora alterações na categoria necessary e mantém o estado protegido', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    const loggerWarnSpy = jest.spyOn(logger, 'warn').mockImplementation(() => {})

    render(
      <ConsentProvider categories={{ enabledCategories: ['analytics'] }}>
        <TestComponentExtended />
      </ConsentProvider>,
    )

    // Estado inicial mantém necessary como true
    expect(screen.getByTestId('necessary').textContent).toBe('true')

    await act(async () => {
      fireEvent.click(screen.getByText('Try Disable Necessary'))
    })

    // Estado permanece true e warning é emitido
    expect(screen.getByTestId('necessary').textContent).toBe('true')
    expect(loggerWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('necessary category ignored'),
    )
    expect(warnSpy).not.toHaveBeenCalledWith(expect.stringContaining('React does not recognize'))

    loggerWarnSpy.mockRestore()
    warnSpy.mockRestore()
  })

  it('deve carregar o estado padrão (sem consentimento)', () => {
    act(() => {
      render(
        <ConsentProvider categories={{ enabledCategories: ['analytics', 'marketing'] }}>
          <TestComponentBasic />
        </ConsentProvider>,
      )
    })

    expect(screen.getByTestId('consented').textContent).toBe('false')
    expect(screen.getByTestId('analytics').textContent).toBe('false')
    expect(screen.getByTestId('marketing').textContent).toBe('false')
  })

  it('deve aceitar todas as categorias ao clicar em "Accept All"', async () => {
    act(() => {
      render(
        <ConsentProvider categories={{ enabledCategories: ['analytics', 'marketing'] }}>
          <TestComponentBasic />
        </ConsentProvider>,
      )
    })

    await act(async () => {
      fireEvent.click(screen.getByText('Accept All'))
      await waitFor(() => {
        expect(screen.getByTestId('consented').textContent).toBe('true')
      })
    })

    expect(screen.getByTestId('consented').textContent).toBe('true')
    expect(screen.getByTestId('analytics').textContent).toBe('true')
    expect(screen.getByTestId('marketing').textContent).toBe('true')
    expect(Cookies.set).toHaveBeenCalled()
  })

  it('deve rejeitar categorias não essenciais ao clicar em "Reject All"', () => {
    act(() => {
      render(
        <ConsentProvider categories={{ enabledCategories: ['analytics', 'marketing'] }}>
          <TestComponentBasic />
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
        <ConsentProvider categories={{ enabledCategories: ['analytics', 'marketing'] }}>
          <TestComponentBasic />
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
        <ConsentProvider categories={{ enabledCategories: ['analytics', 'marketing'] }}>
          <TestComponentBasic />
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
        <TestComponentBasic />
      </ConsentProvider>,
    )
    expect(logGuidanceSpy).toHaveBeenCalled()
  })

  it('não deve chamar os logs de orientação quando desabilitado', () => {
    consoleGroupSpy.mockClear() // Clear any previous calls

    render(
      <ConsentProvider disableDeveloperGuidance={true}>
        <TestComponentBasic />
      </ConsentProvider>,
    )

    // Verifica se nenhum grupo de console foi criado (indicando que não há logs)
    expect(consoleGroupSpy).not.toHaveBeenCalled()
  })
})

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
        <TestComponentExtended />
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
        <TestComponentExtended />
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
        <TestComponentExtended />
      </ConsentProvider>,
    )

    expect(screen.getByTestId('consented').textContent).toBe('true')
    setCookieSpy.mockClear() // Clear calls from initial render/hydration

    act(() => {
      fireEvent.click(screen.getByText('Reset Consent'))
    })

    expect(screen.getByTestId('consented').textContent).toBe('false')
    expect(screen.getByTestId('analytics').textContent).toBe('false')
    expect(removeCookieSpy).toHaveBeenCalledWith(
      'lgpd-consent__v1',
      expect.objectContaining({ path: '/' }),
    )
    expect(setCookieSpy).not.toHaveBeenCalled() // Não deve setar um novo cookie após reset
  })

  it('deve chamar onConsentGiven quando o consentimento é dado pela primeira vez', async () => {
    const onConsentGiven = jest.fn()
    render(
      <ConsentProvider onConsentGiven={onConsentGiven}>
        <TestComponentExtended />
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
        <TestComponentExtended />
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

  it('mantém a categoria necessary sempre ativa em qualquer operação de atualização', async () => {
    render(
      <ConsentProvider categories={{ enabledCategories: ['analytics', 'marketing'] }}>
        <TestComponentExtended />
      </ConsentProvider>,
    )

    expect(screen.getByTestId('necessary').textContent).toBe('true')

    fireEvent.click(screen.getByText('Try Disable Necessary'))
    await waitFor(() => {
      expect(screen.getByTestId('necessary').textContent).toBe('true')
    })

    fireEvent.click(screen.getByText('Submit Without Necessary'))
    await waitFor(() => {
      expect(screen.getByTestId('necessary').textContent).toBe('true')
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
        <TestComponentExtended />
      </ConsentProvider>,
    )

    expect(screen.getByTestId('consented').textContent).toBe('true')
    expect(screen.getByTestId('analytics').textContent).toBe('true')
    expect(screen.getByTestId('marketing').textContent).toBe('false')
    expect(screen.getByTestId('isModalOpen').textContent).toBe('false') // isModalOpen deve ser false na hidratação
  })

  it('deve forçar re-consentimento ao alterar storage.version e notificar via onConsentVersionChange', async () => {
    const onConsentVersionChange = jest.fn()

    const { rerender } = render(
      <ConsentProvider
        categories={{ enabledCategories: ['analytics'] }}
        storage={{ namespace: 'Portal.GOV', version: '2025-Q3' }}
        onConsentVersionChange={onConsentVersionChange}
      >
        <TestComponentExtended />
      </ConsentProvider>,
    )

    await act(async () => {
      fireEvent.click(screen.getByText('Accept All'))
      await waitFor(() => expect(screen.getByTestId('consented').textContent).toBe('true'))
    })
    ;(Cookies.set as jest.Mock).mockClear()
    ;(Cookies.remove as jest.Mock).mockClear()
    onConsentVersionChange.mockClear()

    rerender(
      <ConsentProvider
        categories={{ enabledCategories: ['analytics'] }}
        storage={{ namespace: 'Portal.GOV', version: '2025-Q4' }}
        onConsentVersionChange={onConsentVersionChange}
      >
        <TestComponentExtended />
      </ConsentProvider>,
    )

    await waitFor(() => {
      expect(onConsentVersionChange).toHaveBeenCalledTimes(1)
    })

    const [firstRemoveCall, secondRemoveCall] = (Cookies.remove as jest.Mock).mock.calls
    expect(firstRemoveCall[0]).toBe('portal.gov__v2025-q3')
    expect(secondRemoveCall[0]).toBe('portal.gov__v2025-q4')

    expect(onConsentVersionChange).toHaveBeenCalledWith(
      expect.objectContaining({
        previousKey: 'portal.gov__v2025-q3',
        nextKey: 'portal.gov__v2025-q4',
      }),
    )

    await waitFor(() => {
      expect(screen.getByTestId('consented').textContent).toBe('false')
    })

    // resetConsent helper permanece idempotente
    const { resetConsent } = onConsentVersionChange.mock.calls[0][0]
    act(() => {
      resetConsent()
    })
    await waitFor(() => {
      expect(screen.getByTestId('consented').textContent).toBe('false')
    })
    expect(Cookies.set).not.toHaveBeenCalled()
  })

  // Teste removido: Custom categories foram descontinuadas na v0.3.0+

  describe('DataLayer events after reset', () => {
    it('deve disparar consent_updated após resetConsent', async () => {
      // Mockar Cookies.get para retornar undefined (sem cookie salvo)
      ;(Cookies.get as jest.Mock).mockReturnValue(undefined)

      // Mock do window.dataLayer
      const mockDataLayer: Array<Record<string, unknown>> = []
      // @ts-ignore - test mock
      global.window.dataLayer = mockDataLayer

      render(
        <ConsentProvider categories={{ enabledCategories: ['analytics', 'marketing'] }}>
          <TestComponentExtended />
        </ConsentProvider>,
      )

      // Aguardar hidratação - deve iniciar com consented: false (sem cookie salvo)
      await waitFor(() => {
        expect(screen.getByTestId('analytics').textContent).toBe('false')
      })

      // Limpar dataLayer inicial
      mockDataLayer.length = 0

      // Aceitar todas as categorias
      fireEvent.click(screen.getByText('Accept All'))

      await waitFor(() => {
        expect(screen.getByTestId('consented').textContent).toBe('true')
      })

      // Verificar que consent_updated foi disparado
      const acceptEvent = mockDataLayer.find((e) => e.event === 'consent_updated')
      expect(acceptEvent).toBeDefined()

      // Limpar novamente
      mockDataLayer.length = 0

      // Executar reset
      fireEvent.click(screen.getByText('Reset Consent'))

      await waitFor(() => {
        expect(screen.getByTestId('consented').textContent).toBe('false')
      })

      // Verificar que consent_updated foi disparado após reset
      const resetEvent = mockDataLayer.find((e) => e.event === 'consent_updated')
      expect(resetEvent).toBeDefined()
      expect(resetEvent?.origin).toBe('reset')

      // Limpar novamente
      mockDataLayer.length = 0

      // Aceitar novamente após reset
      fireEvent.click(screen.getByText('Accept All'))

      await waitFor(() => {
        expect(screen.getByTestId('consented').textContent).toBe('true')
      })

      // Verificar que consent_updated foi disparado após accept
      const postResetAcceptEvent = mockDataLayer.find((e) => e.event === 'consent_updated')
      expect(postResetAcceptEvent).toBeDefined()
      expect(postResetAcceptEvent?.origin).toBe('banner')
    })

    it('em ambiente de desenvolvimento emite aviso quando nenhum componente de UI é fornecido', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})

      render(
        <ConsentProvider
          categories={{ enabledCategories: ['analytics'] }}
          disableDeveloperGuidance
          disableFloatingPreferencesButton
        >
          <div>App</div>
        </ConsentProvider>,
      )

      expect(
        warnSpy.mock.calls.find(
          (call) =>
            typeof call[0] === 'string' &&
            call[0].includes('[@react-lgpd-consent/core] Aviso: Nenhum componente UI fornecido'),
        ),
      ).toBeTruthy()

      warnSpy.mockRestore()
      process.env.NODE_ENV = originalEnv
    })
  })
})
