import * as React from 'react'
import { renderToString } from 'react-dom/server'
import { ConsentProvider } from './ConsentContext'

describe('ConsentProvider SSR render', () => {
  test('renders on server without throwing', () => {
    const html = renderToString(
      <ConsentProvider categories={{ enabledCategories: ['analytics'] }}>
        <div>app</div>
      </ConsentProvider>,
    )
    expect(typeof html).toBe('string')
    expect(html.length).toBeGreaterThan(0)
  })
})
