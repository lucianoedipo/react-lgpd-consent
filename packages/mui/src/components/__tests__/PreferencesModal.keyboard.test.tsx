import '@testing-library/jest-dom'
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

describe('PreferencesModal - teclado e foco', () => {
  it('mantem o foco dentro do dialog ao abrir e retorna ao gatilho ao fechar com Escape', async () => {
    const user = userEvent.setup()
    render(
      <ConsentProvider categories={{ enabledCategories: ['analytics', 'marketing'] }}>
        <TestComponent />
      </ConsentProvider>,
    )

    const trigger = screen.getByRole('button', { name: 'Abrir Preferencias' })
    trigger.focus()
    await user.click(trigger)

    const dialog = await screen.findByRole('dialog')
    await waitFor(() => {
      expect(dialog.contains(document.activeElement)).toBe(true)
    })

    await user.keyboard('{Escape}')

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    expect(trigger).toHaveFocus()
  })

  it('exponha aria-describedby apontando para a descricao do modal', async () => {
    const user = userEvent.setup()
    render(
      <ConsentProvider categories={{ enabledCategories: ['analytics'] }}>
        <TestComponent />
      </ConsentProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Abrir Preferencias' }))
    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveAttribute('aria-describedby', 'cookie-pref-description')
  })
})
