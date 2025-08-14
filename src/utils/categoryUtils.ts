import type {
  Category,
  CategoryDefinition,
  ConsentPreferences,
  ProjectCategoriesConfig,
} from '../types/types'

/**
 * Categorias padrão disponíveis (exceto necessary que é sempre incluída).
 */
const DEFAULT_CATEGORIES: Category[] = [
  'analytics',
  'functional',
  'marketing',
  'social',
  'personalization',
]

/**
 * @function
 * Cria um objeto de preferências de consentimento inicial baseado na configuração de categorias do projeto.
 * Inclui apenas as categorias especificadas na configuração, com `necessary` sempre como `true`.
 *
 * @param {ProjectCategoriesConfig} [config] A configuração de categorias do projeto. Se não fornecida, um padrão será usado.
 * @param {boolean} [defaultValue=false] O valor padrão para categorias não essenciais. Por padrão, `false` para conformidade LGPD.
 * @returns {ConsentPreferences} Um objeto `ConsentPreferences` com as categorias e seus valores iniciais.
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

  return preferences
}

/**
 * @function
 * Valida um objeto de preferências de consentimento, removendo categorias que não estão permitidas pela configuração do projeto.
 * Categorias não autorizadas são removidas silenciosamente para garantir a integridade dos dados.
 *
 * @param {ConsentPreferences} preferences O objeto de preferências a ser validado.
 * @param {ProjectCategoriesConfig} [config] A configuração de categorias do projeto. Se não fornecida, um padrão será usado.
 * @returns {ConsentPreferences} Um novo objeto `ConsentPreferences` contendo apenas categorias válidas.
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

  return validPreferences
}

/**
 * @function
 * Retorna um array com as definições detalhadas de todas as categorias de cookies ativas no projeto.
 * Inclui categorias padrão e customizadas, se houver.
 *
 * @param {ProjectCategoriesConfig} [config] A configuração de categorias do projeto. Se não fornecida, um padrão será usado.
 * @returns {CategoryDefinition[]} Um array de objetos `CategoryDefinition`.
 */
export function getAllProjectCategories(
  config?: ProjectCategoriesConfig,
): CategoryDefinition[] {
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

  return allCategories
}

/**
 * Retorna a definição padrão de uma categoria baseada no Guia da ANPD.
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
      description:
        'Cookies para funcionalidades extras como preferências e idioma',
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
      description:
        'Cookies para integração com redes sociais e compartilhamento',
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
 * @function
 * Verifica se uma configuração de categorias é válida, identificando categorias padrão inválidas.
 *
 * @param {ProjectCategoriesConfig} [config] A configuração de categorias a ser validada.
 * @returns {string[]} Uma lista de strings, onde cada string é uma mensagem de erro. A lista estará vazia se a configuração for válida.
 */
export function validateCategoriesConfig(
  config?: ProjectCategoriesConfig,
): string[] {
  const errors: string[] = []

  if (!config) return errors

  if (config.enabledCategories) {
    config.enabledCategories.forEach((category) => {
      if (!DEFAULT_CATEGORIES.includes(category) && category !== 'necessary') {
        errors.push(`Categoria padrão inválida: ${category}`)
      }
    })
  }

  return errors
}