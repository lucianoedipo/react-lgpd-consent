import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { ConsentProvider } from '../index'

import { Branding } from './Branding'

// Mock js-cookie to avoid actual cookie operations in tests
jest.mock('js-cookie')

function makeInitialState() {
  const now = new Date().toISOString()
  return {
    version: '1.0',
    consented: true,
    preferences: { necessary: true },
    consentDate: now,
    lastUpdate: now,
    source: 'programmatic' as const,
    projectConfig: { enabledCategories: [] as any },
  }
}

describe('Branding component', () => {
  it('uses designTokens.colors.primary for link color when provided', async () => {
    const tokens = { colors: { primary: '#112233' } }

    render(
      <ConsentProvider categories={{ enabledCategories: [] }} initialState={makeInitialState()} designTokens={tokens as any}>
        <Branding variant="banner" />
      </ConsentProvider>,
    )

    const link = await screen.findByRole('link', { name: /LÉdipO.eti.br/i })
    // color is applied by sx prop into style attribute; check computed style
    const computed = window.getComputedStyle(link)
  expect(computed.color).toBe('rgb(17, 34, 51)') // #112233
  })

  it('falls back to theme primary when no designTokens provided', async () => {
    render(
      <ConsentProvider categories={{ enabledCategories: [] }} initialState={makeInitialState()}>
        <Branding variant="modal" />
      </ConsentProvider>,
    )

    const link = await screen.findByRole('link', { name: /LÉdipO.eti.br/i })
    const computed = window.getComputedStyle(link)
    // default safe theme primary.main in tests is MUI default (#1976d2) -> rgb(25,118,210)
  expect(computed.color).toBe('rgb(25, 118, 210)')
  })

  it('does not render when hidden=true', () => {
    render(
      <ConsentProvider categories={{ enabledCategories: [] }} initialState={makeInitialState()}>
        <Branding variant="banner" hidden={true} />
      </ConsentProvider>,
    )

    const maybe = screen.queryByText(/fornecido por|LÉdipO.eti.br/i)
    expect(maybe).not.toBeInTheDocument()
  })
})
