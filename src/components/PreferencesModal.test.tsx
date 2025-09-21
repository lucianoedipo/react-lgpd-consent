import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConsentProvider } from '../index'
import { PreferencesModal } from './PreferencesModal'

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

    const title = document.getElementById('cookie-pref-title')
    expect(title).toBeTruthy()
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
})
