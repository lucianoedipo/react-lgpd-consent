import { ConsentProvider, useConsent } from '@react-lgpd-consent/mui'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock js-cookie to avoid actual cookie operations in tests
jest.mock('js-cookie')

function makeInitialState(consented = true) {
  const now = new Date().toISOString()
  return {
    version: '1.0',
    consented,
    preferences: { necessary: true, analytics: consented },
    consentDate: now,
    lastUpdate: now,
    source: 'programmatic' as const,
    projectConfig: { enabledCategories: ['analytics'] as any },
  }
}

// Suprimir logs do developerGuidance durante estes testes
// console.* é suprimido globalmente em jest.setup.ts

describe('FloatingPreferencesButton (integration via ConsentProvider)', () => {
  // Small consumer to observe context changes (isModalOpen) caused by openPreferences
  const TestConsumer = () => {
    const { isModalOpen } = useConsent()
    return <div data-testid="modal-state">{isModalOpen ? 'open' : 'closed'}</div>
  }

  it('renders provider-mounted floating button and applies tooltip as aria-label', async () => {
    render(
      <ConsentProvider
        categories={{ enabledCategories: ['analytics'] }}
        initialState={makeInitialState(true)}
        floatingPreferencesButtonProps={{ tooltip: 'Open preferences' }}
      >
        <div>App</div>
        <TestConsumer />
      </ConsentProvider>,
    )

    const button = await screen.findByLabelText('Open preferences')
    expect(button).toBeInTheDocument()

    // verify clicking opens the preferences (context change)
    const modalState = screen.getByTestId('modal-state')
    expect(modalState).toHaveTextContent('closed')
    await userEvent.click(button)
    expect(modalState).toHaveTextContent('open')
  })

  it('does not render when floatingPreferencesButtonProps.hideWhenConsented=true and already consented', async () => {
    render(
      <ConsentProvider
        categories={{ enabledCategories: ['analytics'] }}
        initialState={makeInitialState(true)}
        floatingPreferencesButtonProps={
          { tooltip: 'Should be hidden', hideWhenConsented: true } as any
        }
      >
        <div>App</div>
        <TestConsumer />
      </ConsentProvider>,
    )

    const maybe = screen.queryByLabelText('Should be hidden')
    expect(maybe).not.toBeInTheDocument()
  })

  it('forwards floatingPreferencesButtonProps to a custom FloatingPreferencesButtonComponent', async () => {
    const CustomFab = (props: any) => {
      // render something that exposes a prop value and wires onClick to simulate user interaction
      return (
        <button
          data-testid="custom-fab"
          data-prop={String(props.customFlag)}
          onClick={props.openPreferences}
        />
      )
    }

    render(
      <ConsentProvider
        categories={{ enabledCategories: ['analytics'] }}
        initialState={makeInitialState(true)}
        FloatingPreferencesButtonComponent={CustomFab as any}
        floatingPreferencesButtonProps={{ customFlag: 'yes' } as any}
      >
        <div>App</div>
        <TestConsumer />
      </ConsentProvider>,
    )

    const el = await screen.findByTestId('custom-fab')
    expect(el).toBeInTheDocument()
    expect(el.getAttribute('data-prop')).toBe('yes')
    // also ensure clicking the custom component calls openPreferences via provider
    const modalState = screen.getByTestId('modal-state')
    expect(modalState).toHaveTextContent('closed')
    // simulate click on custom element which should call provided openPreferences (if wired)
    await userEvent.click(el)
    expect(modalState).toHaveTextContent('open')
  })

  it('uses texts.preferencesButton as fallback when tooltip prop is not provided', async () => {
    render(
      <ConsentProvider
        categories={{ enabledCategories: ['analytics'] }}
        initialState={makeInitialState(true)}
        // no tooltip provided here
      >
        <div>App</div>
        <TestConsumer />
      </ConsentProvider>,
    )

    const button = await screen.findByLabelText('Configurar Cookies')
    expect(button).toBeInTheDocument()
  })

  it('applies position and offset via floatingPreferencesButtonProps', async () => {
    render(
      <ConsentProvider
        categories={{ enabledCategories: ['analytics'] }}
        initialState={makeInitialState(true)}
        floatingPreferencesButtonProps={{ position: 'top-left', offset: 10 } as any}
      >
        <div>App</div>
        <TestConsumer />
      </ConsentProvider>,
    )

    const button = await screen.findByLabelText('Configurar Cookies')
    // MUI aplica styles via CSS-in-JS classes; use getComputedStyle to inspect layout values
    expect(button).toBeInTheDocument()
    const target =
      button.tagName === 'BUTTON' ? button : (button.closest('button') as Element) || button
    const computed = window.getComputedStyle(target as Element)
    // should be positioned fixed and have top/left set for 'top-left' position
    expect(computed.position).toBe('fixed')
    expect(computed.top).toEqual(expect.stringContaining('10'))
    expect(computed.left).toEqual(expect.stringContaining('10'))
  })

  it('does not render the floating button when initialState.consented is false', async () => {
    render(
      <ConsentProvider
        categories={{ enabledCategories: ['analytics'] }}
        initialState={makeInitialState(false)}
      >
        <div>App</div>
        <TestConsumer />
      </ConsentProvider>,
    )

    const maybe = screen.queryByLabelText('Configurar Cookies')
    expect(maybe).not.toBeInTheDocument()
  })

  it('posiciona corretamente o botão em combinações diversas, incluindo fallback default', async () => {
    const { rerender, findByLabelText } = render(
      <ConsentProvider
        categories={{ enabledCategories: ['analytics'] }}
        initialState={makeInitialState(true)}
        floatingPreferencesButtonProps={{ position: 'bottom-left', offset: 32 } as any}
      >
        <div>App</div>
        <TestConsumer />
      </ConsentProvider>,
    )

    const baseButton = await findByLabelText('Configurar Cookies')
    const baseEl =
      baseButton.tagName === 'BUTTON'
        ? baseButton
        : (baseButton.closest('button') as Element) || baseButton
    let computed = window.getComputedStyle(baseEl as Element)
    expect(computed.bottom).toMatch(/32/)
    expect(computed.left).toMatch(/32/)

    rerender(
      <ConsentProvider
        categories={{ enabledCategories: ['analytics'] }}
        initialState={makeInitialState(true)}
        floatingPreferencesButtonProps={{ position: 'top-right', offset: 32 } as any}
      >
        <div>App</div>
        <TestConsumer />
      </ConsentProvider>,
    )

    const updatedButton = screen.getByLabelText('Configurar Cookies')
    const updatedEl =
      updatedButton.tagName === 'BUTTON'
        ? updatedButton
        : (updatedButton.closest('button') as Element) || updatedButton
    computed = window.getComputedStyle(updatedEl as Element)
    expect(computed.top).toMatch(/32/)
    expect(computed.right).toMatch(/32/)

    rerender(
      <ConsentProvider
        categories={{ enabledCategories: ['analytics'] }}
        initialState={makeInitialState(true)}
        floatingPreferencesButtonProps={{ position: 'desconhecida', offset: 32 } as any}
      >
        <div>App</div>
        <TestConsumer />
      </ConsentProvider>,
    )

    const fallbackButton = screen.getByLabelText('Configurar Cookies')
    const fallbackEl =
      fallbackButton.tagName === 'BUTTON'
        ? fallbackButton
        : (fallbackButton.closest('button') as Element) || fallbackButton
    computed = window.getComputedStyle(fallbackEl as Element)
    expect(computed.bottom).toMatch(/32/)
    expect(computed.right).toMatch(/32/)
  })
})
