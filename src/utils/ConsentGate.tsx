import * as React from 'react'
import { useConsent } from '../hooks/useConsent'
import type { Category } from '../types/types'

export function ConsentGate(
  props: Readonly<{
    category: Category
    children: React.ReactNode
  }>,
) {
  const { preferences } = useConsent()
  if (!preferences[props.category]) return null
  return <>{props.children}</>
}
