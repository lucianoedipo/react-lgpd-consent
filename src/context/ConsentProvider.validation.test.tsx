import React from 'react'
import { render } from '@testing-library/react'
import { ConsentProvider } from '../index'
import { setDebugLogging, LogLevel } from '../utils/logger'

describe('ConsentProvider validation (Zod)', () => {
  beforeAll(() => {
    setDebugLogging(true, LogLevel.WARN)
  })

  afterAll(() => {
    setDebugLogging(false)
  })

  test('warns when categories prop is missing (uses safe defaults)', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})

    render(
      <ConsentProvider>
        <div>app</div>
      </ConsentProvider>,
    )

    expect(warn).toHaveBeenCalled()
    const message = warn.mock.calls.map((c) => c.join(' ')).join(' ')
    expect(message).toMatch(/categories/i)
    warn.mockRestore()
  })

  test("warns and sanitizes when 'necessary' is in enabledCategories", () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})

    render(
      <ConsentProvider categories={{ enabledCategories: ['analytics', 'necessary'] }}>
        <div>app</div>
      </ConsentProvider>,
    )

    const message = warn.mock.calls.map((c) => c.join(' ')).join(' ')
    expect(message).toMatch(/necessary.*inclu[ií]da automaticamente/i)
    warn.mockRestore()
  })

  test('errors on invalid customCategories entry', () => {
    const error = jest.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ConsentProvider
        categories={{
          enabledCategories: ['analytics'],
          // valores vazios devem gerar erro de validação em runtime (Zod)
          customCategories: [{ id: '', name: '', description: '' }],
        }}
      >
        <div>app</div>
      </ConsentProvider>,
    )

    const message = error.mock.calls.map((c) => c.join(' ')).join(' ')
    expect(message).toMatch(/customCategories/i)
    error.mockRestore()
  })
})
