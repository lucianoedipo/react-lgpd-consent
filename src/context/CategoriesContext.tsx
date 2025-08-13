// src/context/CategoriesContext.tsx
import * as React from 'react'
import type { ProjectCategoriesConfig } from '../types/types'
import {
  analyzeDeveloperConfiguration,
  logDeveloperGuidance,
  DEFAULT_PROJECT_CATEGORIES,
  type DeveloperGuidance,
} from '../utils/developerGuidance'

/**
 * Context para informações sobre categorias ativas no projeto.
 * Fornece orientações e validações para components UI.
 */
export interface CategoriesContextValue {
  /** Configuração final das categorias (com padrão aplicado) */
  config: ProjectCategoriesConfig
  /** Análise e orientações para developers */
  guidance: DeveloperGuidance
  /** Categorias que precisam de toggle na UI */
  toggleableCategories: DeveloperGuidance['activeCategoriesInfo']
  /** Todas as categorias ativas */
  allCategories: DeveloperGuidance['activeCategoriesInfo']
}

const CategoriesContext = React.createContext<CategoriesContextValue | null>(
  null,
)

/**
 * Provider para contexto de categorias.
 * Automaticamente analisa configuração e fornece orientações.
 */
export function CategoriesProvider({
  children,
  config, // NOVO: configuração completa
  disableDeveloperGuidance,
}: Readonly<{
  children: React.ReactNode
  config?: ProjectCategoriesConfig // NOVO
  disableDeveloperGuidance?: boolean
}>) {
  const contextValue = React.useMemo(() => {
    // NOVO: usa configuração completa ou padrão
    const finalConfig: ProjectCategoriesConfig =
      config || DEFAULT_PROJECT_CATEGORIES

    const guidance = analyzeDeveloperConfiguration(config)

    // Separa categorias que precisam de toggle das que são sempre ativas
    const toggleableCategories = guidance.activeCategoriesInfo.filter(
      (cat) => cat.uiRequired,
    )

    return {
      config: finalConfig,
      guidance,
      toggleableCategories,
      allCategories: guidance.activeCategoriesInfo,
    }
  }, [config])

  // Log orientações apenas em desenvolvimento
  React.useEffect(() => {
    logDeveloperGuidance(contextValue.guidance, disableDeveloperGuidance)
  }, [contextValue.guidance, disableDeveloperGuidance])

  return (
    <CategoriesContext.Provider value={contextValue}>
      {children}
    </CategoriesContext.Provider>
  )
}

/**
 * Hook para acessar informações sobre categorias ativas.
 * Usado por componentes UI para renderizar adequadamente.
 */
export function useCategories(): CategoriesContextValue {
  const context = React.useContext(CategoriesContext)
  if (!context) {
    throw new Error(
      'useCategories deve ser usado dentro de CategoriesProvider. ' +
        'Certifique-se de que o ConsentProvider está envolvendo seu componente.',
    )
  }
  return context
}

/**
 * Hook de conveniência para verificar se uma categoria específica está ativa.
 */
export function useCategoryStatus(categoryId: string) {
  const { allCategories } = useCategories()
  const category = allCategories.find((cat) => cat.id === categoryId)

  return {
    isActive: !!category,
    isEssential: category?.essential || false,
    needsToggle: category?.uiRequired || false,
    name: category?.name,
    description: category?.description,
  }
}

/**
 * Hook para obter todas as categorias (padrão + customizadas).
 */
export function useAllCategories() {
  const { allCategories } = useCategories()

  return React.useMemo(() => {
    return allCategories
  }, [allCategories])
}
