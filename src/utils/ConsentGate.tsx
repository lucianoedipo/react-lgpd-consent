/**
 * @module ConsentGate
 * @description
 * Componente condicional para renderização de conteúdo baseado no consentimento do usuário para uma categoria específica de cookies.
 * Utiliza o contexto de consentimento para verificar se a categoria informada foi aceita.
 *
 * @param props.category Categoria de consentimento a ser verificada (ex: 'analytics', 'marketing').
 * @param props.children Elementos React a serem renderizados caso o consentimento esteja ativo para a categoria.
 *
 * @returns Os filhos fornecidos se o consentimento para a categoria estiver ativo, ou `null` caso contrário.
 *
 * @example
 * ```tsx
 * <ConsentGate category="analytics">
 *   <AnalyticsScript />
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
