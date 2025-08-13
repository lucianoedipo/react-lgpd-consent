// src/context/CategoriesContext.tsx
import * as React from 'react'
import type {
  CategoryDefinition,
  ProjectCategoriesConfig,
} from '../types/types'
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
  /** LEGACY: Apenas categorias customizadas (backward compatibility) */
  legacyCategories: CategoryDefinition[]
}

const CategoriesContext = React.createContext<CategoriesContextValue | null>(
  null,
)

// LEGACY: Context antigo para backward compatibility
const CategoriesCtx = React.createContext<CategoryDefinition[]>([])

/**
 * Provider para contexto de categorias.
 * Automaticamente analisa configuração e fornece orientações.
 */
export function CategoriesProvider({
  children,
  categories, // LEGACY: prop antiga (apenas customCategories)
  config, // NOVO: configuração completa
  disableDeveloperGuidance,
}: Readonly<{
  children: React.ReactNode
  categories?: CategoryDefinition[] // LEGACY
  config?: ProjectCategoriesConfig // NOVO
  disableDeveloperGuidance?: boolean
}>) {
  const contextValue = React.useMemo(() => {
    // Migração automática: se usou prop antiga, converte para novo formato
    let finalConfig: ProjectCategoriesConfig

    if (categories && !config) {
      // LEGACY: apenas categorias customizadas foram fornecidas
      finalConfig = {
        enabledCategories: DEFAULT_PROJECT_CATEGORIES.enabledCategories,
        customCategories: categories,
      }
    } else {
      // NOVO: usa configuração completa ou padrão
      finalConfig = config || DEFAULT_PROJECT_CATEGORIES
    }

    const guidance = analyzeDeveloperConfiguration(
      config || (categories ? { customCategories: categories } : undefined),
    )

    // Separa categorias que precisam de toggle das que são sempre ativas
    const toggleableCategories = guidance.activeCategoriesInfo.filter(
      (cat) => cat.uiRequired,
    )

    return {
      config: finalConfig,
      guidance,
      toggleableCategories,
      allCategories: guidance.activeCategoriesInfo,
      legacyCategories: categories || [],
    }
  }, [config, categories])

  // Log orientações apenas em desenvolvimento
  React.useEffect(() => {
    // Só loga se a prop não estiver explicitamente desabilitada
    if (disableDeveloperGuidance) {
      return;
    }
    logDeveloperGuidance(contextValue.guidance, disableDeveloperGuidance)
  }, [contextValue.guidance, disableDeveloperGuidance])

  return (
    <CategoriesContext.Provider value={contextValue}>
      <CategoriesCtx.Provider value={contextValue.legacyCategories}>
        {children}
      </CategoriesCtx.Provider>
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
 * LEGACY: Hook para acessar as categorias customizadas.
 * Mantido para backward compatibility.
 *
 * @deprecated Use useCategories() ao invés disso para acesso completo às categorias.
 */
export function useCustomCategories() {
  return React.useContext(CategoriesCtx)
}

/**
 * Hook para obter todas as categorias (padrão + customizadas).
 */
export function useAllCategories() {
  const customCategories = useCustomCategories()

  return React.useMemo(() => {
    // Categorias baseadas no Guia Orientativo da ANPD sobre Cookies
    const defaultCategories: CategoryDefinition[] = [
      {
        id: 'necessary',
        name: 'Cookies Necessários',
        description:
          'Essenciais para o funcionamento básico do site. Incluem cookies de sessão, autenticação e segurança.',
        essential: true,
        cookies: ['PHPSESSID', 'JSESSIONID', 'cookieConsent', 'csrf_token'],
      },
      {
        id: 'analytics',
        name: 'Analytics e Estatísticas',
        description:
          'Permitem medir audiência e desempenho, gerando estatísticas anônimas de uso.',
        essential: false,
        cookies: ['_ga', '_ga_*', '_gid', '_gat', 'gtag'],
      },
      {
        id: 'functional',
        name: 'Cookies Funcionais',
        description:
          'Melhoram a experiência do usuário, lembrando preferências e configurações.',
        essential: false,
        cookies: ['language', 'theme', 'timezone', 'preferences'],
      },
      {
        id: 'marketing',
        name: 'Marketing e Publicidade',
        description:
          'Utilizados para publicidade direcionada e medição de campanhas publicitárias.',
        essential: false,
        cookies: ['_fbp', 'fr', 'tr', 'ads_*', 'doubleclick'],
      },
      {
        id: 'social',
        name: 'Redes Sociais',
        description:
          'Permitem compartilhamento e integração com redes sociais como Facebook, YouTube, etc.',
        essential: false,
        cookies: ['__Secure-*', 'sb', 'datr', 'c_user', 'social_*'],
      },
      {
        id: 'personalization',
        name: 'Personalização',
        description:
          'Adaptam o conteúdo e interface às preferências individuais do usuário.',
        essential: false,
        cookies: ['personalization_*', 'content_*', 'layout_*'],
      },
    ]

    return [...defaultCategories, ...customCategories]
  }, [customCategories])
}
