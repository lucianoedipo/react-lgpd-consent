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
 * Cria preferências iniciais baseadas na configuração de categorias do projeto.
 * Inclui apenas as categorias especificadas na configuração.
 *
 * @param config Configuração de categorias do projeto
 * @param defaultValue Valor padrão para categorias não essenciais (padrão: false para conformidade LGPD)
 */
export function createProjectPreferences(
  config?: ProjectCategoriesConfig,
  defaultValue: boolean = false,
): ConsentPreferences {
  const preferences: ConsentPreferences = {
    necessary: true, // Sempre presente e true (essencial)
  }

  // Adicionar categorias padrão habilitadas
  const enabledCategories = config?.enabledCategories || []
  enabledCategories.forEach((category) => {
    if (category !== 'necessary') {
      // necessary já está incluída
      preferences[category] = defaultValue
    }
  })

  // Adicionar categorias customizadas
  const customCategories = config?.customCategories || []
  customCategories.forEach((category) => {
    preferences[category.id] = category.essential === true ? true : defaultValue
  })

  return preferences
}

/**
 * Valida se uma preferência contém apenas categorias permitidas pela configuração.
 * Remove categorias não autorizadas silenciosamente.
 *
 * @param preferences Preferências a serem validadas
 * @param config Configuração de categorias do projeto
 * @returns Preferências filtradas apenas com categorias válidas
 */
export function validateProjectPreferences(
  preferences: ConsentPreferences,
  config?: ProjectCategoriesConfig,
): ConsentPreferences {
  const validPreferences: ConsentPreferences = {
    necessary: true, // Sempre válida
  }

  // Categorias padrão permitidas
  const enabledCategories = config?.enabledCategories || []
  enabledCategories.forEach((category) => {
    if (category !== 'necessary' && preferences[category] !== undefined) {
      validPreferences[category] = preferences[category]
    }
  })

  // Categorias customizadas permitidas
  const customCategories = config?.customCategories || []
  customCategories.forEach((category) => {
    if (preferences[category.id] !== undefined) {
      validPreferences[category.id] = preferences[category.id]
    }
  })

  return validPreferences
}

/**
 * Retorna todas as categorias ativas no projeto (padrão + customizadas).
 *
 * @param config Configuração de categorias do projeto
 * @returns Array com todas as definições de categorias
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

  // Adicionar categorias padrão habilitadas
  const enabledCategories = config?.enabledCategories || []
  enabledCategories.forEach((category) => {
    if (category !== 'necessary') {
      allCategories.push(getDefaultCategoryDefinition(category))
    }
  })

  // Adicionar categorias customizadas
  const customCategories = config?.customCategories || []
  allCategories.push(...customCategories)

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
 * Verifica se uma configuração de categorias é válida.
 *
 * @param config Configuração a ser validada
 * @returns Lista de erros de validação (vazia se válida)
 */
export function validateCategoriesConfig(
  config?: ProjectCategoriesConfig,
): string[] {
  const errors: string[] = []

  if (!config) return errors

  // Validar categorias habilitadas
  if (config.enabledCategories) {
    config.enabledCategories.forEach((category) => {
      if (!DEFAULT_CATEGORIES.includes(category) && category !== 'necessary') {
        errors.push(`Categoria padrão inválida: ${category}`)
      }
    })
  }

  // Validar categorias customizadas
  if (config.customCategories) {
    const customIds = new Set<string>()

    config.customCategories.forEach((category, index) => {
      // Verificar ID único
      if (customIds.has(category.id)) {
        errors.push(`ID de categoria duplicado: ${category.id}`)
      }
      customIds.add(category.id)

      // Verificar se não conflita com categorias padrão
      if (
        DEFAULT_CATEGORIES.includes(category.id as Category) ||
        category.id === 'necessary'
      ) {
        errors.push(
          `ID de categoria conflita com categoria padrão: ${category.id}`,
        )
      }

      // Verificar campos obrigatórios
      if (!category.name.trim()) {
        errors.push(`Nome vazio na categoria customizada ${index}`)
      }

      if (!category.description.trim()) {
        errors.push(`Descrição vazia na categoria customizada ${index}`)
      }
    })
  }

  return errors
}
