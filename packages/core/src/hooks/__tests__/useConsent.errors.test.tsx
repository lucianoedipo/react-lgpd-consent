import '@testing-library/jest-dom'
import { render } from '@testing-library/react'

import { useCategories } from '../../context/CategoriesContext'
import { ConsentProvider } from '../../context/ConsentContext'
import { useConsent } from '../useConsent'

describe('DX errors para hooks fora do provider', () => {
  it('useConsent lança erro claro em pt-BR quando usado fora do provider', () => {
    function Broken() {
      useConsent()
      return null
    }

    expect(() => render(<Broken />)).toThrow(
      /\[react-lgpd-consent\] useConsentState deve ser usado dentro de <ConsentProvider>/i,
    )
  })

  it('useCategories lança erro claro em pt-BR quando usado fora do provider', () => {
    function Broken() {
      useCategories()
      return null
    }

    expect(() => render(<Broken />)).toThrow(
      /\[react-lgpd-consent\] useCategories deve ser usado dentro de <ConsentProvider>/i,
    )
  })

  it('não lança quando provider está presente', () => {
    function Safe() {
      useConsent()
      useCategories()
      return <div>ok</div>
    }

    expect(() =>
      render(
        <ConsentProvider categories={{ enabledCategories: ['analytics'] }}>
          <Safe />
        </ConsentProvider>,
      ),
    ).not.toThrow()
  })
})
