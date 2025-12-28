import '@testing-library/jest-dom'
import type { Category } from '@react-lgpd-consent/core'
import { ConsentProvider, useConsent } from '@react-lgpd-consent/mui'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

function TestComponent() {
  const { openPreferences } = useConsent()
  return (
    <button type="button" onClick={openPreferences}>
      Abrir Preferencias
    </button>
  )
}

function makeInitialState(enabledCategories: Category[]) {
  const now = new Date().toISOString()
  return {
    version: '1.0',
    consented: true,
    preferences: { necessary: true, analytics: true },
    consentDate: now,
    lastUpdate: now,
    source: 'programmatic' as const,
    projectConfig: { enabledCategories },
    isModalOpen: false,
  }
}

describe('PreferencesModal - teclado e foco', () => {
  it('mantem o foco dentro do dialog ao abrir e retorna ao gatilho ao fechar com Escape', async () => {
    const user = userEvent.setup()
    render(
      <ConsentProvider
        categories={{ enabledCategories: ['analytics', 'marketing'] }}
        initialState={makeInitialState(['analytics', 'marketing'])}
        disableDefaultBanner={true}
        disableDefaultFloatingButton={true}
      >
        <TestComponent />
      </ConsentProvider>,
    )

    const trigger = screen.getByRole('button', { name: 'Abrir Preferencias' })
    trigger.focus()
    await user.click(trigger)

    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')

    await user.keyboard('{Escape}')

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    expect(trigger).toHaveFocus()
  })

  it('exponha aria-describedby apontando para a descricao do modal', async () => {
    const user = userEvent.setup()
    render(
      <ConsentProvider
        categories={{ enabledCategories: ['analytics'] }}
        initialState={makeInitialState(['analytics'])}
        disableDefaultBanner={true}
        disableDefaultFloatingButton={true}
      >
        <TestComponent />
      </ConsentProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Abrir Preferencias' }))
    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveAttribute('aria-describedby', 'cookie-pref-description')
  })
})
