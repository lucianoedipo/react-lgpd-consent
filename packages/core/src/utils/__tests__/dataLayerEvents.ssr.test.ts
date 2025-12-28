/**
 * @jest-environment node
 */

import { pushConsentInitializedEvent, pushConsentUpdatedEvent } from '../dataLayerEvents'

describe('dataLayerEvents SSR (node)', () => {
  it('does not throw when window is undefined', () => {
    expect(() => pushConsentInitializedEvent({ necessary: true })).not.toThrow()
    expect(() => pushConsentUpdatedEvent({ necessary: true }, 'programmatic')).not.toThrow()
  })
})
