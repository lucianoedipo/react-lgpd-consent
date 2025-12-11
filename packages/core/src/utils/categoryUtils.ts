/** @module src/utils/categoryUtils */
/**
 * @category Utils
 * @since 0.2.0
 * Utilitários para gerenciamento de categorias de consentimento LGPD.
 *
 * Fornece funções para criar, validar e recuperar definições de categorias de cookies,
 * garantindo conformidade com a LGPD e suporte a categorias customizadas.
 */

import type {
  Category,
  CategoryDefinition,
  ConsentPreferences,
  ProjectCategoriesConfig,
} from '../types/types'

/**
 * Categorias padrão disponíveis (exceto necessary que é sempre incluída).
 * Armazenado como Set para checagens de existência eficientes.
 * @internal
 */
const DEFAULT_CATEGORIES: Set<Category> = new Set([
  'analytics',
  'functional',
  'marketing',
  'social',
  'personalization',
])

/**
 * Cria um objeto de preferências de consentimento inicial baseado na configuração de categorias do projeto.
 * @category Utils
 * @since 0.2.0
 * @param config A configuração de categorias do projeto. Se não fornecida, um padrão será usado.
 * @param defaultValue O valor padrão para categorias não essenciais. Por padrão, `false` para conformidade LGPD (rejeitar por padrão).
 * @returns Um objeto `ConsentPreferences` com as categorias e seus valores iniciais.
 * @remarks
 * Esta função é crucial para inicializar o estado de consentimento. Ela garante que apenas as categorias
 * definidas no `ConsentProvider` sejam incluídas no objeto de preferências (tanto categorias padrão
 * em `enabledCategories` quanto `customCategories`), alinhando-se ao princípio de minimização de dados da LGPD.
 *
 * Since v0.4.0: inclui categorias de `config.customCategories` na inicialização.
 * @example
 * ```ts
 * // Gera preferências com 'analytics' e 'marketing' desabilitados por padrão
 * const initialPrefs = createProjectPreferences({
 *   enabledCategories: ['analytics', 'marketing']
 * })
 * // Result: { necessary: true, analytics: false, marketing: false }
 *
 * // Inclui categorias customizadas
 * const initialWithCustom = createProjectPreferences({
 *   enabledCategories: ['analytics'],
 *   customCategories: [
 *     { id: 'abTesting', name: 'AB Testing', description: 'Experimentos de interface' },
 *   ],
 * })
 * // Result: { necessary: true, analytics: false, abTesting: false }
 *
 * // Gera preferências com todas as categorias habilitadas
 * const allAcceptedPrefs = createProjectPreferences(
 *   { enabledCategories: ['analytics', 'marketing'] },
 *   true
 * )
 * // Result: { necessary: true, analytics: true, marketing: true }
 * ```
 */
export function createProjectPreferences(
  config?: ProjectCategoriesConfig,
  defaultValue: boolean = false,
): ConsentPreferences {
  const preferences: ConsentPreferences = {
    necessary: true, // Sempre presente e true (essencial)
  }

  const enabledCategories = config?.enabledCategories || []
  enabledCategories.forEach((category) => {
    if (category !== 'necessary') {
      preferences[category] = defaultValue
    }
  })

  // Incluir categorias customizadas (ids definidos pelo projeto)
  const customCategories = config?.customCategories || []
  customCategories.forEach((cat) => {
    if (cat.id && cat.id !== 'necessary') {
      preferences[cat.id] = defaultValue
    }
  })

  return preferences
}

/**
 * Garante que a categoria `necessary` permaneça ativa em qualquer estrutura de preferências.
 * @category Utils
 * @since 0.5.2
 */
export function ensureNecessaryAlwaysOn(preferences: ConsentPreferences): ConsentPreferences {
  if (preferences.necessary === true) {
    return { ...preferences, necessary: true }
  }

  return {
    ...preferences,
    necessary: true,
  }
}

/**
 * Valida um objeto de preferências de consentimento, removendo categorias que não estão permitidas pela configuração do projeto.
 * @category Utils
 * @since 0.2.6
 * @param preferences O objeto de preferências a ser validado.
 * @param config A configuração de categorias do projeto. Se não fornecida, um padrão será usado.
 * @returns Um novo objeto `ConsentPreferences` contendo apenas categorias válidas.
 * @remarks
 * Garante a integridade dos dados ao carregar o estado de um cookie. Se a configuração do projeto mudou
 * (ex: uma categoria foi removida), esta função limpa as preferências obsoletas do estado,
 * evitando inconsistências.
 *
 * Since v0.4.0: reconhece `config.customCategories` como válidas ao validar.
 * @example
 * ```ts
 * const savedPrefs = { necessary: true, analytics: true, oldCategory: false }
 * const currentConfig = { enabledCategories: ['analytics'] }
 *
 * const validPrefs = validateProjectPreferences(savedPrefs, currentConfig)
 * // Result: { necessary: true, analytics: true }
 * ```
 */
export function validateProjectPreferences(
  preferences: ConsentPreferences,
  config?: ProjectCategoriesConfig,
): ConsentPreferences {
  const validPreferences: ConsentPreferences = {
    necessary: true, // Sempre válida
  }

  const enabledCategories = config?.enabledCategories || []
  enabledCategories.forEach((category) => {
    if (category !== 'necessary' && preferences[category] !== undefined) {
      validPreferences[category] = preferences[category]
    }
  })

  // Mantém somente categorias customizadas presentes na configuração
  const customCategories = config?.customCategories || []
  customCategories.forEach((cat) => {
    const id = cat.id
    if (id && id !== 'necessary' && preferences[id] !== undefined) {
      validPreferences[id] = preferences[id]
    }
  })

  return validPreferences
}

/**
 * Retorna um array com as definições detalhadas de todas as categorias de cookies ativas no projeto.
 * @category Utils
 * @since 0.2.2
 * @param config A configuração de categorias do projeto. Se não fornecida, um padrão será usado.
 * @returns Um array de objetos `CategoryDefinition`.
 * @remarks
 * Útil para construir UIs de preferência customizadas, pois fornece os nomes e descrições
 * de todas as categorias que devem ser exibidas ao usuário, incluindo quaisquer `customCategories`
 * definidas no `ConsentProvider`.
 *
 * Since v0.4.0: inclui categorias definidas em `config.customCategories`.
 * @example
 * ```ts
 * const config = { enabledCategories: ['analytics'] }
 * const categories = getAllProjectCategories(config)
 * // Result:
 * // [
 * //   { id: 'necessary', name: 'Necessários', ... },
 * //   { id: 'analytics', name: 'Análise e Estatísticas', ... }
 * // ]
 * ```
 */
export function getAllProjectCategories(config?: ProjectCategoriesConfig): CategoryDefinition[] {
  const allCategories: CategoryDefinition[] = [
    {
      id: 'necessary',
      name: 'Necessários',
      description: 'Cookies essenciais para funcionamento básico do site',
      essential: true,
    },
  ]

  const enabledCategories = config?.enabledCategories || []
  enabledCategories.forEach((category) => {
    if (category !== 'necessary') {
      allCategories.push(getDefaultCategoryDefinition(category))
    }
  })

  // Acrescenta definições customizadas fornecidas pelo projeto
  const customCategories = config?.customCategories || []
  customCategories.forEach((cat) => {
    if (cat.id && cat.id !== 'necessary') {
      allCategories.push({ ...cat, essential: !!cat.essential })
    }
  })

  return allCategories
}

/**
 * Retorna a definição padrão de uma categoria baseada no Guia da ANPD.
 * @internal
 * @param category A categoria para a qual obter a definição.
 * @returns Um objeto `CategoryDefinition` com os detalhes da categoria.
 * @remarks
 * Esta função interna é usada para mapear categorias padrão para suas definições,
 * incluindo nome, descrição e status essencial, conforme diretrizes da ANPD.
 */
function getDefaultCategoryDefinition(category: Category): CategoryDefinition {
  const definitions: Record<Category, CategoryDefinition> = {
    necessary: {
      id: 'necessary',
      name: 'Necessários',
      description: 'Cookies essenciais para funcionamento básico do site',
      essential: true,
    },
    analytics: {
      id: 'analytics',
      name: 'Análise e Estatísticas',
      description: 'Cookies para análise de uso e estatísticas do site',
      essential: false,
    },
    functional: {
      id: 'functional',
      name: 'Funcionalidades',
      description: 'Cookies para funcionalidades extras como preferências e idioma',
      essential: false,
    },
    marketing: {
      id: 'marketing',
      name: 'Marketing e Publicidade',
      description: 'Cookies para publicidade direcionada e marketing',
      essential: false,
    },
    social: {
      id: 'social',
      name: 'Redes Sociais',
      description: 'Cookies para integração com redes sociais e compartilhamento',
      essential: false,
    },
    personalization: {
      id: 'personalization',
      name: 'Personalização',
      description: 'Cookies para personalização de conteúdo e experiência',
      essential: false,
    },
  }

  return definitions[category]
}

/**
 * Verifica se uma configuração de categorias é válida, identificando categorias padrão inválidas.
 * @category Utils
 * @since 0.2.2
 * @param config A configuração de categorias a ser validada.
 * @returns Uma lista de strings, onde cada string é uma mensagem de erro. A lista estará vazia se a configuração for válida.
 * @remarks
 * Esta é uma função de diagnóstico usada internamente pelo sistema de orientações para
 * alertar o desenvolvedor sobre possíveis erros de digitação ou uso de categorias
 * que não existem na biblioteca.
 */
export function validateCategoriesConfig(config?: ProjectCategoriesConfig): string[] {
  const errors: string[] = []

  if (!config) return errors

  if (config.enabledCategories) {
    config.enabledCategories.forEach((category) => {
      if (!DEFAULT_CATEGORIES.has(category) && category !== 'necessary') {
        errors.push(`Categoria padrão inválida: ${category}`)
      }
    })
  }

  return errors
}
