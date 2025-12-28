import { ConsentProvider } from '@react-lgpd-consent/core'
import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PreferencesModal } from '../PreferencesModal'
import { setCookieCatalogOverrides } from '../../../../core/src/utils/cookieRegistry'

// Mock js-cookie to avoid actual cookie operations in tests
jest.mock('js-cookie')

// Suprimir logs do developerGuidance durante estes testes
// console.* é suprimido globalmente em jest.setup.ts

function makeInitialState() {
  const now = new Date().toISOString()
  return {
    version: '1.0',
    consented: true,
    preferences: { necessary: true, analytics: false },
    consentDate: now,
    lastUpdate: now,
    source: 'programmatic' as const,
    projectConfig: { enabledCategories: ['analytics'] as any },
  }
}

describe('PreferencesModal', () => {
  it('applies typography and spacing tokens when provided', async () => {
    const tokens = {
      typography: { fontSize: { modal: '18px' } },
      spacing: { padding: { modal: '20px' } },
    }

    render(
      <ConsentProvider
        categories={{ enabledCategories: ['analytics'] }}
        initialState={makeInitialState()}
        designTokens={tokens as any}
      >
        <PreferencesModal DialogProps={{ open: true }} />
      </ConsentProvider>,
    )

    // Aguardar lazy loading do modal
    await waitFor(
      () => {
        const title = document.getElementById('cookie-pref-title')
        expect(title).toBeTruthy()
      },
      { timeout: 3000 },
    )

    const title = document.getElementById('cookie-pref-title')
    const computedTitle = window.getComputedStyle(title as Element)
    expect(computedTitle.fontSize).toBe('18px')

    const content = document.querySelector('div.MuiDialogContent-root')
    expect(content).toBeTruthy()
    const computed = window.getComputedStyle(content as Element)
    // padding may be applied as shorthand - assert it contains our value
    expect(computed.padding).toEqual(expect.stringContaining('20'))
  })

  it('toggles a category and saves preferences via context', async () => {
    const onSaved = jest.fn()

    render(
      <ConsentProvider
        categories={{ enabledCategories: ['analytics'] }}
        initialState={makeInitialState()}
        onPreferencesSaved={onSaved}
      >
        <PreferencesModal DialogProps={{ open: true }} />
      </ConsentProvider>,
    )

    // find the non-disabled switch (necessary is disabled) - MUI Switch has role 'switch'
    const switches = await screen.findAllByRole('switch')
    const target = switches.find((s: Element) => !(s as HTMLInputElement).disabled)
    expect(target).toBeTruthy()
    const switchEl = target as HTMLInputElement
    expect(switchEl.checked).toBe(false)

    await userEvent.click(switchEl)
    expect(switchEl.checked).toBe(true)

    // click save
    const saveBtn = screen.getByRole('button', { name: /salvar|save/i })
    await userEvent.click(saveBtn)

    // onPreferencesSaved is invoked asynchronously by the provider; assert it received new prefs
    await waitFor(() => expect(onSaved).toHaveBeenCalledWith({ necessary: true, analytics: true }))
  })

  it('renders customCategories with proper names and descriptions', async () => {
    render(
      <ConsentProvider
        categories={{
          enabledCategories: ['analytics'],
          customCategories: [
            { id: 'chat', name: 'Chat de Suporte', description: 'Widget de chat' },
            { id: 'video', name: 'Vídeo', description: 'Players de vídeo' },
          ],
        }}
        initialState={makeInitialState()}
      >
        <PreferencesModal DialogProps={{ open: true }} />
      </ConsentProvider>,
    )

    // Labels combine name and description
    expect(await screen.findByText(/Chat de Suporte - Widget de chat/i)).toBeInTheDocument()
    expect(screen.getByText(/Vídeo - Players de vídeo/i)).toBeInTheDocument()
  })

  it('does not render Branding when hideBranding=true', async () => {
    render(
      <ConsentProvider
        categories={{ enabledCategories: ['analytics'] }}
        initialState={makeInitialState()}
      >
        <PreferencesModal DialogProps={{ open: true }} hideBranding={true} />
      </ConsentProvider>,
    )

    // Branding contains text 'LÉdipO.eti.br' - ensure not present
    const maybe = screen.queryByText(/LÉdipO.eti.br/i)
    expect(maybe).not.toBeInTheDocument()
  })

  it('reseta preferências temporárias ao cancelar e chama closePreferences', async () => {
    const closePreferences = jest.fn()
    const setPreferences = jest.fn()
    const preferences = { necessary: true, analytics: false }

    render(
      <ConsentProvider
        categories={{ enabledCategories: ['analytics'] }}
        initialState={makeInitialState()}
      >
        <PreferencesModal
          DialogProps={{ open: true }}
          preferences={preferences as any}
          setPreferences={setPreferences}
          closePreferences={closePreferences}
        />
      </ConsentProvider>,
    )

    const switches = await screen.findAllByRole('switch')
    const target = switches.find((s: Element) => !(s as HTMLInputElement).disabled)
    expect(target).toBeTruthy()
    const switchEl = target as HTMLInputElement
    expect(switchEl.checked).toBe(false)

    await userEvent.click(switchEl)
    expect(switchEl.checked).toBe(true)

    const closeBtn = screen.getByRole('button', { name: /Fechar|Close/i })
    await userEvent.click(closeBtn)

    expect(closePreferences).toHaveBeenCalled()
    expect(switchEl.checked).toBe(false)
    expect(setPreferences).not.toHaveBeenCalled()
  })

  it('renderiza scripts ativos quando não há cookies detalhados', async () => {
    ;(globalThis as unknown as { __LGPD_INTEGRATIONS_MAP__?: Record<string, string> })
      .__LGPD_INTEGRATIONS_MAP__ = {
      'my-script': 'custom',
    }

    render(
      <ConsentProvider
        categories={
          {
            enabledCategories: ['custom'],
            customCategories: [
              { id: 'custom', name: 'Custom', description: 'Categoria custom' },
            ],
          } as any
        }
        initialState={makeInitialState()}
      >
        <PreferencesModal DialogProps={{ open: true }} />
      </ConsentProvider>,
    )

    expect(await screen.findByText('(script) my-script')).toBeInTheDocument()

    delete (globalThis as unknown as { __LGPD_INTEGRATIONS_MAP__?: Record<string, string> })
      .__LGPD_INTEGRATIONS_MAP__
  })

  it('aplica zIndex de modal quando token está definido', async () => {
    render(
      <ConsentProvider
        categories={{ enabledCategories: ['analytics'] }}
        initialState={makeInitialState()}
        designTokens={{ layout: { zIndex: { modal: 3000 } } } as any}
      >
        <PreferencesModal DialogProps={{ open: true }} />
      </ConsentProvider>,
    )

    const root = await screen.findByTestId('lgpd-preferences-modal-root')
    expect((root as HTMLElement).style.zIndex).toBe('3000')
  })

  it('aplica textos customizados de detalhes via props', async () => {
    render(
      <ConsentProvider
        categories={{ enabledCategories: ['analytics'] }}
        initialState={makeInitialState()}
      >
        <PreferencesModal
          DialogProps={{ open: true }}
          texts={{
            cookieDetails: {
              toggleDetails: { expand: 'Details' },
              tableHeaders: { name: 'Cookie Name', purpose: 'Purpose' },
            },
          }}
        />
      </ConsentProvider>,
    )

    expect(await screen.findAllByText('Details')).not.toHaveLength(0)
    expect(screen.getAllByText('Cookie Name').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Purpose').length).toBeGreaterThan(0)
  })

  it('usa isModalOpen quando DialogProps.open não é fornecido', async () => {
    render(
      <ConsentProvider
        categories={{ enabledCategories: ['analytics'] }}
        initialState={makeInitialState()}
      >
        <PreferencesModal isModalOpen />
      </ConsentProvider>,
    )

    expect(await screen.findByRole('dialog')).toBeInTheDocument()
  })

  it('DialogProps.open sobrescreve isModalOpen', () => {
    render(
      <ConsentProvider
        categories={{ enabledCategories: ['analytics'] }}
        initialState={makeInitialState()}
      >
        <PreferencesModal
          isModalOpen={false}
          DialogProps={{
            open: true,
            slotProps: {
              root: { 'data-testid': 'custom-root' } as any,
            },
          }}
        />
      </ConsentProvider>,
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByTestId('custom-root')).toBeInTheDocument()
  })

  it('preenche detalhes faltantes com placeholders quando descriptor está incompleto', async () => {
    setCookieCatalogOverrides({
      byIntegration: {
        'google-analytics': [{ name: 'ga_missing' }],
      },
    })
    ;(globalThis as unknown as { __LGPD_USED_INTEGRATIONS__?: string[] }).__LGPD_USED_INTEGRATIONS__ =
      ['google-analytics']

    render(
      <ConsentProvider
        categories={{ enabledCategories: ['analytics'] }}
        initialState={makeInitialState()}
      >
        <PreferencesModal DialogProps={{ open: true }} />
      </ConsentProvider>,
    )

    const cell = await screen.findByText('ga_missing')
    const row = cell.closest('tr')
    expect(row).toBeTruthy()
    expect(row).toHaveTextContent('-')

    setCookieCatalogOverrides({
      byIntegration: {
        'google-analytics': [],
      },
    })
    delete (globalThis as unknown as { __LGPD_USED_INTEGRATIONS__?: string[] })
      .__LGPD_USED_INTEGRATIONS__
  })
})
