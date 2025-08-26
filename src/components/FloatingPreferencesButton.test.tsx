import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { ConsentProvider } from '../index'

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

describe('FloatingPreferencesButton (integration via ConsentProvider)', () => {
  it('renders provider-mounted floating button and applies tooltip as aria-label', async () => {
    render(
      <ConsentProvider
        categories={{ enabledCategories: ['analytics'] }}
        initialState={makeInitialState(true)}
        floatingPreferencesButtonProps={{ tooltip: 'Open preferences' }}
      >
        <div>App</div>
      </ConsentProvider>,
    )

    const button = await screen.findByLabelText('Open preferences')
    expect(button).toBeInTheDocument()
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
      </ConsentProvider>,
    )

    const maybe = screen.queryByLabelText('Should be hidden')
    expect(maybe).not.toBeInTheDocument()
  })

  it('forwards floatingPreferencesButtonProps to a custom FloatingPreferencesButtonComponent', async () => {
    const CustomFab = (props: any) => {
      // render something that exposes a prop value
      return <div data-testid="custom-fab" data-prop={String(props.customFlag)} />
    }

    render(
      <ConsentProvider
        categories={{ enabledCategories: ['analytics'] }}
        initialState={makeInitialState(true)}
        FloatingPreferencesButtonComponent={CustomFab as any}
        floatingPreferencesButtonProps={{ customFlag: 'yes' } as any}
      >
        <div>App</div>
      </ConsentProvider>,
    )

    const el = await screen.findByTestId('custom-fab')
    expect(el).toBeInTheDocument()
    expect(el.getAttribute('data-prop')).toBe('yes')
  })
})
