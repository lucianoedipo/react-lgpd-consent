import React from 'react'
import { render } from '@testing-library/react'
import { useConsent, useOpenPreferencesModal } from './useConsent'

// These tests ensure the hooks throw informative errors when used outside the ConsentProvider
describe('useConsent error paths (outside provider)', () => {
  test('useConsent throws when used outside ConsentProvider', () => {
    function Consumer() {
      useConsent()
      return null
    }

    // Rendering the component should throw a clear error from the internal hook
    expect(() => render(<Consumer />)).toThrow(/useConsentState must be used within ConsentProvider/)
  })

  test('useOpenPreferencesModal (hook) throws when used outside ConsentProvider', () => {
    function Consumer() {
      useOpenPreferencesModal()
      return null
    }

  // The internal hooks can throw slightly different messages depending on which
  // context is accessed first; just assert it complains about being outside the provider.
  expect(() => render(<Consumer />)).toThrow(/must be used within ConsentProvider/)
  })
})
