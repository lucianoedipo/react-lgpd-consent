import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Cookies from 'js-cookie'
import { ConsentProvider } from '../index'

jest.mock('js-cookie')

// console.* é suprimido globalmente em jest.setup.ts

function makeInitialState(consented = false) {
  const now = new Date().toISOString()
  return {
    version: '1.0',
    consented,
    preferences: { necessary: true },
    consentDate: now,
    lastUpdate: now,
    source: 'programmatic' as const,
    projectConfig: { enabledCategories: [] as any },
  }
}

describe('CookieBanner component', () => {
  beforeEach(() => jest.clearAllMocks())

  it('renders when not consented and buttons trigger provider actions', async () => {
    render(
      <ConsentProvider
        categories={{ enabledCategories: ['analytics'] }}
        initialState={makeInitialState(false)}
      >
        <div />
      </ConsentProvider>,
    )

    // Banner should be present (may appear in multiple wrappers: take any)
    const messages = await screen.findAllByText(/Utilizamos cookies/i)
    expect(messages.length).toBeGreaterThan(0)

    // Click 'Aceitar todos' should call Cookies.set via provider flow
    const acceptBtn = screen.getByRole('button', { name: /Aceitar todos|Aceitar/i })
    await userEvent.click(acceptBtn)

    expect(Cookies.set).toHaveBeenCalled()
  })

  it('applies design tokens for colors and spacing when provided', async () => {
    const tokens = {
      colors: { primary: '#0000ff', text: '#101010', background: '#ffffff' },
      spacing: { padding: { banner: 5 } },
      typography: { fontSize: { banner: '16px' } },
    }

    render(
      <ConsentProvider
        categories={{ enabledCategories: [] }}
        initialState={makeInitialState(false)}
        designTokens={tokens as any}
      >
        <div />
      </ConsentProvider>,
    )

    const papers = await screen.findAllByText(/Utilizamos cookies/i)
    const paper = papers[0]
    const computed = window.getComputedStyle(paper as Element)
    // Check font size from tokens
    expect(computed.fontSize).toBe('16px')
  })

  it('hides branding when hideBranding=true', async () => {
    render(
      <ConsentProvider
        categories={{ enabledCategories: [] }}
        initialState={makeInitialState(false)}
        cookieBannerProps={{ hideBranding: true }}
      >
        <div />
      </ConsentProvider>,
    )

    // Branding text should not be present
    const matches = screen.queryAllByText(/L\u00c9dipO.eti.br|fornecido por/i)
    expect(matches.length).toBe(0)
  })
})
