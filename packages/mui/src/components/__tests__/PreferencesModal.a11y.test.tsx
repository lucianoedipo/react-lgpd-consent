/**
 * Testes de acessibilidade (a11y) para o PreferencesModal
 * Usa jest-axe para validar conformidade com WCAG
 */
import { ConsentProvider, useConsent } from '@react-lgpd-consent/mui'
import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

// Componente auxiliar para abrir o modal
function TestComponent() {
  const { openPreferences } = useConsent()
  return (
    <div>
      <button onClick={openPreferences}>Abrir Preferências</button>
    </div>
  )
}

describe('PreferencesModal - Acessibilidade', () => {
  test('PreferencesModal deve ser acessível quando aberto', async () => {
    const user = userEvent.setup()
    const { container, getByText } = render(
      <ConsentProvider categories={{ enabledCategories: ['analytics', 'marketing'] }}>
        <TestComponent />
      </ConsentProvider>,
    )

    // Abrir o modal
    const button = getByText('Abrir Preferências')
    await user.click(button)

    // Aguardar modal carregar e ficar visível (lazy loading)
    await waitFor(
      () => {
        const dialog = document.querySelector('[role="dialog"]')
        expect(dialog).toBeTruthy()
      },
      { timeout: 3000 },
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  test('PreferencesModal com múltiplas categorias deve ser acessível', async () => {
    const user = userEvent.setup()
    const { container, getByText } = render(
      <ConsentProvider
        categories={{
          enabledCategories: ['analytics', 'marketing', 'functional'],
        }}
      >
        <TestComponent />
      </ConsentProvider>,
    )

    const button = getByText('Abrir Preferências')
    await user.click(button)

    await waitFor(
      () => {
        const dialog = document.querySelector('[role="dialog"]')
        expect(dialog).toBeTruthy()
      },
      { timeout: 3000 },
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  test('PreferencesModal com textos customizados deve ser acessível', async () => {
    const user = userEvent.setup()
    const { container, getByText } = render(
      <ConsentProvider
        categories={{ enabledCategories: ['analytics'] }}
        texts={{
          modalTitle: 'Configurações de Privacidade',
          preferences: 'Configurar',
        }}
      >
        <TestComponent />
      </ConsentProvider>,
    )

    const button = getByText('Abrir Preferências')
    await user.click(button)

    await waitFor(
      () => {
        const dialog = document.querySelector('[role="dialog"]')
        expect(dialog).toBeTruthy()
      },
      { timeout: 3000 },
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  test('respeita z-index customizado via designTokens.layout.zIndex.modal', async () => {
    const { getByText } = render(
      <ConsentProvider
        categories={{ enabledCategories: ['analytics'] }}
        initialState={{
          version: '1.0',
          consented: true,
          preferences: { necessary: true },
          consentDate: new Date().toISOString(),
          lastUpdate: new Date().toISOString(),
          source: 'programmatic',
          projectConfig: { enabledCategories: [] },
          isModalOpen: false,
        }}
        designTokens={{ layout: { zIndex: { modal: 2600 } } } as any}
      >
        <TestComponent />
      </ConsentProvider>,
    )

    const button = getByText('Abrir Preferências')
    await userEvent.click(button)

    await waitFor(() => {
      const dialog = document.querySelector('[role="dialog"]')
      expect(dialog).toBeTruthy()
    })

    const root = document.querySelector(
      '[data-testid="lgpd-preferences-modal-root"]',
    ) as HTMLElement
    expect(root).not.toBeNull()
    expect(root.style.zIndex).toBe('2600')
  })
})
