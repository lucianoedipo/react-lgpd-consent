/**
 * @component
 * Renderiza componentes filhos apenas se o usuário deu consentimento para uma categoria de cookie específica.
 *
 * @param props As propriedades do componente.
 * @param {string} props.category A categoria de consentimento a ser verificada (ex: 'analytics', 'marketing').
 * @param {React.ReactNode} props.children Os componentes a serem renderizados se o consentimento para a categoria for `true`.
 *
 * @returns {React.ReactNode | null} Os componentes filhos se o consentimento foi dado, ou `null`.
 *
 * @example
 * ```tsx
 * <ConsentGate category="analytics">
 *   <GoogleAnalyticsScript />
 * </ConsentGate>
 * ```
 */
import * as React from 'react'
import { useConsent } from '../hooks/useConsent'

export function ConsentGate(
  props: Readonly<{
    category: string // Aceita qualquer categoria (padrão ou customizada)
    children: React.ReactNode
  }>,
) {
  const { preferences } = useConsent()
  if (!preferences[props.category]) return null
  return <>{props.children}</>
}
