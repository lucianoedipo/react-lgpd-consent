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
 * @interface CategoriesContextValue
 * O valor fornecido pelo `CategoriesContext`, contendo informações sobre as categorias de cookies ativas no projeto.
 */
export interface CategoriesContextValue {
  /** A configuração final das categorias, incluindo padrões aplicados. */
  config: ProjectCategoriesConfig
  /** Análise e orientações para desenvolvedores, incluindo avisos e sugestões. */
  guidance: DeveloperGuidance
  /** Um array de categorias que requerem um toggle na UI de preferências (não essenciais). */
  toggleableCategories: DeveloperGuidance['activeCategoriesInfo']
  /** Um array contendo todas as categorias ativas no projeto (essenciais e não essenciais). */
  allCategories: DeveloperGuidance['activeCategoriesInfo']
}

const CategoriesContext = React.createContext<CategoriesContextValue | null>(null)

/**
 * @component
 * @category Context
 * @since 0.2.2
 * O `CategoriesProvider` é um componente interno que gerencia e fornece informações sobre as categorias de cookies ativas.
 * Ele analisa a configuração do projeto e fornece orientações para desenvolvedores.
 *
 * @param {object} props As propriedades do componente.
 * @param {React.ReactNode} props.children Os elementos filhos que terão acesso ao contexto de categorias.
 * @param {ProjectCategoriesConfig} [props.config] A configuração de categorias do projeto. Se não fornecida, um padrão será usado.
 * @param {boolean} [props.disableDeveloperGuidance] Se `true`, desativa as mensagens de orientação no console.
 */
export function CategoriesProvider({
  children,
  config,
  disableDeveloperGuidance,
}: Readonly<{
  children: React.ReactNode
  config?: ProjectCategoriesConfig
  disableDeveloperGuidance?: boolean
}>) {
  const [impliedVersion, setImpliedVersion] = React.useState(0)

  React.useEffect(() => {
    const handler = () => setImpliedVersion((v) => v + 1)
    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('lgpd:requiredCategories', handler)
      return () => window.removeEventListener('lgpd:requiredCategories', handler)
    }
    return () => {}
  }, [])

  // Nota sobre dependência: `impliedVersion` NÃO é usado dentro do callback,
  // mas é intencionalmente incluído para reavaliar guidance quando integrações
  // anunciam categorias requeridas via evento global.
  const contextValue = React.useMemo(() => {
    const finalConfig: ProjectCategoriesConfig = config || DEFAULT_PROJECT_CATEGORIES

    const guidance = analyzeDeveloperConfiguration(config)

    const toggleableCategories = guidance.activeCategoriesInfo.filter((cat) => cat.uiRequired)

    return {
      config: finalConfig,
      guidance,
      toggleableCategories,
      allCategories: guidance.activeCategoriesInfo,
    }
  }, [config, impliedVersion]) // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    logDeveloperGuidance(contextValue.guidance, disableDeveloperGuidance)
  }, [contextValue.guidance, disableDeveloperGuidance])

  return <CategoriesContext.Provider value={contextValue}>{children}</CategoriesContext.Provider>
}

/**
 * @hook
 * @category Hooks
 * @since 0.2.2
 * Hook para acessar informações sobre as categorias de cookies ativas no projeto.
 *
 * @remarks
 * Este hook deve ser usado dentro do `ConsentProvider` (que internamente renderiza o `CategoriesProvider`).
 * Ele é útil para construir componentes de UI customizados que precisam se adaptar dinamicamente às categorias configuradas.
 *
 * @returns {CategoriesContextValue} Um objeto contendo a configuração, orientações e listas de categorias.
 *
 * @throws {Error} Se usado fora do `CategoriesProvider`.
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
 * @hook
 * @category Hooks
 * @since 0.2.2
 * Hook de conveniência para verificar o status de uma categoria de cookie específica.
 *
 * @param {string} categoryId O ID da categoria a ser verificada (ex: 'analytics', 'necessary').
 * @returns {object} Um objeto com o status da categoria:
 * - `isActive`: `true` se a categoria está configurada e ativa no projeto.
 * - `isEssential`: `true` se a categoria é essencial (não pode ser desativada pelo usuário).
 * - `needsToggle`: `true` se a categoria requer um controle (switch) na UI de preferências.
 * - `name`: O nome amigável da categoria.
 * - `description`: A descrição da categoria.
 * @example
 * ```tsx
 * const analyticsStatus = useCategoryStatus('analytics')
 * if (analyticsStatus.isActive && analyticsStatus.needsToggle) {
 *   // Renderizar switch para analytics
 * }
 * ```
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
 * @hook
 * @category Hooks
 * @since 0.2.2
 * Hook para obter todas as categorias de cookies ativas no projeto (padrão e customizadas).
 *
 * @returns {DeveloperGuidance['activeCategoriesInfo']} Um array com as definições detalhadas de todas as categorias ativas.
 * @example
 * ```tsx
 * const { allCategories } = useCategories()
 * allCategories.forEach(category => {
 *   console.log(`Categoria: ${category.name}, Essencial: ${category.essential}`)
 * })
 * ```
 */
