/**
 * Testes de acessibilidade (a11y) para o CookieBanner
 * Usa jest-axe para validar conformidade com WCAG
 */
import { ConsentProvider } from '@react-lgpd-consent/core'
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

describe('CookieBanner - Acessibilidade', () => {
  test('CookieBanner deve ser acessível (sem violações WCAG)', async () => {
    const { container } = render(
      <ConsentProvider categories={{ enabledCategories: ['analytics'] }}>
        <div>Test App</div>
      </ConsentProvider>,
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  test('CookieBanner com backdrop deve ser acessível', async () => {
    const { container } = render(
      <ConsentProvider
        categories={{ enabledCategories: ['analytics', 'marketing'] }}
        blocking={true}
      >
        <div>Test App</div>
      </ConsentProvider>,
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  test('CookieBanner com textos customizados deve ser acessível', async () => {
    const { container } = render(
      <ConsentProvider
        categories={{ enabledCategories: ['analytics'] }}
        texts={{
          bannerMessage: 'Nós utilizamos cookies para melhorar sua experiência.',
          acceptAll: 'Aceitar Todos',
          declineAll: 'Recusar Todos',
          preferences: 'Configurar',
        }}
      >
        <div>Test App</div>
      </ConsentProvider>,
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
