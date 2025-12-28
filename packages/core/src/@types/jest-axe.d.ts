import 'jest-axe'

/**
 * Extensão dos matchers do Jest para acessibilidade via jest-axe.
 * @category Testes
 * @since 0.4.0
 * @remarks
 * Disponibiliza o matcher `toHaveNoViolations` para uso em testes de acessibilidade.
 * @see https://github.com/nickcolley/jest-axe
 */

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveNoViolations(): R
    }
  }
}

/**
 * Declaração global para extensão dos matchers do Jest.
 * @category Testes
 * @since 0.4.0
 */
declare global {
  namespace jest {
    /**
     * Interface customizada de matchers para jest-axe.
     * @category Testes
     * @since 0.4.0
     * @example
     * expect(results).toHaveNoViolations()
     */
    interface Matchers<R> {
      /**
       * Valida que não há violações de acessibilidade no resultado do jest-axe.
       * @returns O resultado do matcher Jest.
       * @see https://github.com/nickcolley/jest-axe#tohavenoviolations
       */
      toHaveNoViolations(): R
    }
  }
}
