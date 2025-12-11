import * as React from 'react'
import { render } from '@testing-library/react'
import { ConsentProvider, useConsent } from '../index'

describe('index exports', () => {
  beforeAll(() => {
    // console.* é suprimido globalmente em jest.setup.ts
  })
  afterAll(() => jest.restoreAllMocks())

  test('exports expected members and can render ConsentProvider', () => {
    expect(typeof ConsentProvider).toBe('function')
    expect(typeof useConsent).toBe('function')

    // quick smoke render of ConsentProvider (provide children prop)
    render(
      <ConsentProvider categories={{ enabledCategories: ['analytics'] }}>
        <div />
      </ConsentProvider>,
    )
  })
})
