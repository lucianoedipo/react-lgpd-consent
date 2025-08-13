import * as React from 'react'
import type { DesignTokens } from '../types/types'

/**
 * Context para fornecer tokens de design para componentes da UI.
 */
const DesignContext = React.createContext<DesignTokens | undefined>(undefined)

/**
 * Provider para o contexto de design.
 */
export function DesignProvider({
  tokens,
  children,
}: Readonly<{ tokens?: DesignTokens; children: React.ReactNode }>) {
  return (
    <DesignContext.Provider value={tokens}>{children}</DesignContext.Provider>
  )
}

/**
 * Hook para acessar os tokens de design.
 */
export function useDesignTokens(): DesignTokens | undefined {
  return React.useContext(DesignContext)
}
