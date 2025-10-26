import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { DesignProvider, useDesignTokens } from './DesignContext'

function TestConsumer() {
  const tokens = useDesignTokens()
  return (
    <div>
      <div data-testid="has">{tokens ? 'true' : 'false'}</div>
      <div data-testid="json">{tokens ? JSON.stringify(tokens) : ''}</div>
    </div>
  )
}

describe('DesignContext', () => {
  test('returns undefined when no provider is present', () => {
    render(<TestConsumer />)
    expect(screen.getByTestId('has').textContent).toBe('false')
    expect(screen.getByTestId('json').textContent).toBe('')
  })

  test('provides tokens to consumers when given', () => {
    const tokens = { colors: { primary: '#112233' } }
    render(
      <DesignProvider tokens={tokens as any}>
        <TestConsumer />
      </DesignProvider>,
    )

    expect(screen.getByTestId('has').textContent).toBe('true')
    expect(screen.getByTestId('json').textContent).toContain('#112233')
  })

  test('updates when provider tokens change via rerender', () => {
    const tokensA = { colors: { primary: '#111111' } }
    const tokensB = { colors: { primary: '#222222' } }

    const { rerender } = render(
      <DesignProvider tokens={tokensA as any}>
        <TestConsumer />
      </DesignProvider>,
    )

    expect(screen.getByTestId('json').textContent).toContain('#111111')

    rerender(
      <DesignProvider tokens={tokensB as any}>
        <TestConsumer />
      </DesignProvider>,
    )

    expect(screen.getByTestId('json').textContent).toContain('#222222')
  })
})
