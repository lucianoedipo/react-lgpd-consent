import type { Category, CategoryDefinition, ProjectCategoriesConfig } from '../types/types'

/**
 * Presets de categorias conforme usos típicos da LGPD/ANPD.
 *
 * @category Utils
 * @since 0.6.4
 */
export const ANPD_CATEGORY_PRESETS: Record<Category, CategoryDefinition> = {
  necessary: {
    id: 'necessary',
    name: 'Necessários',
    description: 'Essenciais para funcionamento do site e segurança. Sempre ativos.',
    essential: true,
    cookies: [],
  },
  analytics: {
    id: 'analytics',
    name: 'Analytics',
    description: 'Mede desempenho e uso para melhorar a experiência.',
    essential: false,
    cookies: ['_ga', '_ga_*', '_gid'],
  },
  functional: {
    id: 'functional',
    name: 'Funcionais',
    description: 'Habilitam recursos adicionais e preferências do usuário.',
    essential: false,
    cookies: [],
  },
  marketing: {
    id: 'marketing',
    name: 'Marketing',
    description: 'Personaliza anúncios e campanhas baseadas no seu perfil.',
    essential: false,
    cookies: ['_fbp', 'fr'],
  },
  social: {
    id: 'social',
    name: 'Social',
    description: 'Integrações sociais, compartilhamento e widgets de redes.',
    essential: false,
    cookies: [],
  },
  personalization: {
    id: 'personalization',
    name: 'Personalização',
    description: 'Personaliza conteúdo e recomendações.',
    essential: false,
    cookies: [],
  },
}

export type AnpdPresetCategory = keyof typeof ANPD_CATEGORY_PRESETS

export interface CreateAnpdCategoriesOptions {
  /**
   * Lista de categorias que devem ser habilitadas (além de necessary que é sempre inclusa).
   * @default ['analytics', 'functional', 'marketing']
   */
  include?: AnpdPresetCategory[]
  /**
   * Overrides de descrições por categoria.
   */
  descriptions?: Partial<Record<AnpdPresetCategory, string>>
  /**
   * Overrides de nomes por categoria.
   */
  names?: Partial<Record<AnpdPresetCategory, string>>
}

/**
 * Gera um `ProjectCategoriesConfig` com presets LGPD/ANPD tipados.
 *
 * @category Utils
 * @since 0.6.4
 */
export function createAnpdCategoriesConfig(
  options: CreateAnpdCategoriesOptions = {},
): ProjectCategoriesConfig {
  const include =
    options.include && options.include.length > 0
      ? options.include
      : (['analytics', 'functional', 'marketing'] satisfies AnpdPresetCategory[])

  const enabledCategories = include.filter((cat) => cat !== 'necessary') as Category[]

  const customCategories: CategoryDefinition[] = include
    .filter((cat) => cat === 'necessary')
    .map((cat) => {
      const base = ANPD_CATEGORY_PRESETS[cat]
      return {
        ...base,
        name: options.names?.[cat] ?? base.name,
        description: options.descriptions?.[cat] ?? base.description,
      }
    })

  return {
    enabledCategories,
    customCategories: customCategories.length ? customCategories : undefined,
  }
}
