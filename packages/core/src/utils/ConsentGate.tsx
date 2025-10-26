/**
 * Renderiza componentes filhos apenas se o usuário deu consentimento para uma categoria de cookie específica.
 * @category Utils
 * @component
 * @param props As propriedades do componente.
 * @param props.category A categoria de consentimento a ser verificada (ex: 'analytics', 'marketing').
 * @param props.children Os componentes a serem renderizados se o consentimento para a categoria for `true`.
 * @returns Os componentes filhos se o consentimento foi dado, ou `null`.
 * @remarks
 * Este componente é fundamental para garantir que scripts de terceiros, pixels de rastreamento,
 * ou qualquer funcionalidade que dependa do consentimento do usuário, só seja carregada ou executada
 * após a permissão explícita. Ele atua como um "portão" de privacidade.
 * @since 0.1.0
 * @example
 * ```tsx
 * import { ConsentGate } from 'react-lgpd-consent'
 *
 * function MyAnalyticsComponent() {
 *   return (
 *     <ConsentGate category="analytics">
 *       {/* Este código só será executado se o usuário consentir com 'analytics' * /}
 *       <script src="https://www.google-analytics.com/analytics.js"></script>
 *       <p>Google Analytics ativado!</p>
 *     </ConsentGate>
 *   )
 * }
 *
 * function MyMarketingContent() {
 *   return (
 *     <ConsentGate category="marketing">
 *       {/* Conteúdo de marketing personalizado * /}
 *       <img src="/ads/promo.jpg" alt="Promoção" />
 *       <p>Ofertas personalizadas para você!</p>
 *     </ConsentGate>
 *   )
 * }
 * ```
 */
import * as React from 'react'
import { useConsent } from '../hooks/useConsent'

/**
 * ConsentGate - renderiza children apenas se houver consentimento para a categoria.
 *
 * @remarks
 * Não usa React.memo pois o estado de preferências muda dinamicamente
 * e o componente precisa re-renderizar quando as preferências mudam.
 * A lógica é leve o suficiente para não justificar memoização.
 */
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
