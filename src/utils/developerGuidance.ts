/* eslint-env browser, node */

// src/utils/developerGuidance.ts
import React from 'react'
import type { ProjectCategoriesConfig } from '../types/types'

/**
 * @interface DeveloperGuidance
 * Define a estrutura do objeto de orientação para desenvolvedores, contendo avisos, sugestões e informações sobre categorias ativas.
 */
export interface DeveloperGuidance {
  /** Um array de strings, cada uma representando um aviso sobre a configuração. */
  warnings: string[]
  /** Um array de strings, cada uma representando uma sugestão para melhorar a conformidade ou UX. */
  suggestions: string[]
  /** Um array de objetos, cada um descrevendo uma categoria de cookie ativa e suas propriedades relevantes para a UI. */
  activeCategoriesInfo: {
    id: string
    name: string
    description: string
    essential: boolean
    uiRequired: boolean
  }[]
  /** Indica se a configuração padrão da biblioteca está sendo utilizada (quando nenhuma configuração explícita é fornecida). */
  usingDefaults: boolean
}

/**
 * @constant
 * Configuração padrão de categorias de cookies utilizada quando o desenvolvedor não especifica nenhuma configuração.
 * Inclui apenas a categoria 'analytics' além da 'necessary' (que é sempre incluída).
 */
export const DEFAULT_PROJECT_CATEGORIES: ProjectCategoriesConfig = {
  enabledCategories: ['analytics'],
}

/**
 * @function
 * Analisa a configuração de categorias do projeto e gera um objeto de orientação para o desenvolvedor.
 * Este objeto contém avisos, sugestões e informações detalhadas sobre as categorias ativas.
 *
 * @param {ProjectCategoriesConfig} [config] A configuração de categorias fornecida pelo desenvolvedor. Se não for fornecida, a configuração padrão será utilizada.
 * @returns {DeveloperGuidance} Um objeto `DeveloperGuidance` com a análise da configuração.
 */
export function analyzeDeveloperConfiguration(config?: ProjectCategoriesConfig): DeveloperGuidance {
  const guidance: DeveloperGuidance = {
    warnings: [],
    suggestions: [],
    activeCategoriesInfo: [],
    usingDefaults: !config,
  }

  const finalConfig = config || DEFAULT_PROJECT_CATEGORIES

  if (!config) {
    guidance.warnings.push(
      'LGPD-CONSENT: Nenhuma configuração de categorias especificada. Usando padrão: necessary + analytics. ' +
        'Para produção, recomenda-se especificar explicitamente as categorias via prop "categories".',
    )
  }

  guidance.activeCategoriesInfo.push({
    id: 'necessary',
    name: 'Cookies Necessários',
    description: 'Essenciais para funcionamento básico do site',
    essential: true,
    uiRequired: false,
  })

  const enabledCategories = finalConfig.enabledCategories || []
  const categoryNames: Record<string, { name: string; description: string }> = {
    analytics: {
      name: 'Cookies Analíticos',
      description: 'Medem uso e performance do site',
    },
    functional: {
      name: 'Cookies Funcionais',
      description: 'Melhoram experiência e funcionalidades',
    },
    marketing: {
      name: 'Cookies de Marketing',
      description: 'Publicidade direcionada e campanhas',
    },
    social: {
      name: 'Cookies de Redes Sociais',
      description: 'Integração com plataformas sociais',
    },
    personalization: {
      name: 'Cookies de Personalização',
      description: 'Adaptam conteúdo às preferências do usuário',
    },
  }

  enabledCategories.forEach((categoryId) => {
    const categoryInfo = categoryNames[categoryId]
    if (categoryInfo) {
      guidance.activeCategoriesInfo.push({
        id: categoryId,
        name: categoryInfo.name,
        description: categoryInfo.description,
        essential: false,
        uiRequired: true,
      })
    }
  })

  const totalToggleable = guidance.activeCategoriesInfo.filter((c) => c.uiRequired).length

  if (totalToggleable === 0) {
    guidance.suggestions.push(
      'Apenas cookies necessários estão configurados. Para compliance completo LGPD, ' +
        'considere adicionar categorias como "analytics" ou "functional" conforme uso real.',
    )
  }

  if (totalToggleable > 5) {
    guidance.warnings.push(
      `${totalToggleable} categorias opcionais detectadas. UI com muitas opções pode prejudicar experiência do usuário. Considere agrupar categorias similares.`,
    )
  }

  return guidance
}

/**
 * @function
 * Exibe orientações e avisos no console do navegador durante o desenvolvimento.
 * Esta função é automaticamente desativada em builds de produção.
 *
 * @param {DeveloperGuidance} guidance O objeto de orientação gerado por `analyzeDeveloperConfiguration`.
 * @param {boolean} [disableGuidanceProp] Se `true`, desativa explicitamente a exibição das orientações, mesmo em desenvolvimento.
 */
export function logDeveloperGuidance(
  guidance: DeveloperGuidance,
  disableGuidanceProp?: boolean,
): void {
  // NÃO usar "window" diretamente: SSR-safe
  const nodeEnv =
    typeof (globalThis as any).process !== 'undefined'
      ? (globalThis as any).process.env?.NODE_ENV
      : undefined

  const isProd =
    nodeEnv === 'production' ||
    ((globalThis as any).__LGPD_PRODUCTION__ === true && typeof globalThis !== 'undefined')

  const isDisabled =
    !!disableGuidanceProp ||
    ((globalThis as any).__LGPD_DISABLE_GUIDANCE__ === true && typeof globalThis !== 'undefined')

  if (isProd || isDisabled) return

  const PREFIX = '[🍪 LGPD-CONSENT]'

  if (guidance.warnings.length > 0) {
    console.group(`${PREFIX} ⚠️  Avisos de Configuração`)
    guidance.warnings.forEach((msg) => console.warn(`${PREFIX} ${msg}`))
    console.groupEnd()
  }

  if (guidance.suggestions.length > 0) {
    console.group(`${PREFIX} 💡 Sugestões`)
    guidance.suggestions.forEach((msg) => console.info(`${PREFIX} ${msg}`))
    console.groupEnd()
  }

  if (guidance.usingDefaults) {
    console.warn(
      `${PREFIX} 📋 Usando configuração padrão. Para personalizar, use a prop "categories" no ConsentProvider.`,
    )
  }

  const rows = guidance.activeCategoriesInfo.map((cat) => ({
    ID: cat.id,
    Nome: cat.name,
    'Toggle UI?': cat.uiRequired ? '✅ SIM' : '❌ NÃO (sempre ativo)',
    'Essencial?': cat.essential ? '🔒 SIM' : '⚙️ NÃO',
  }))

  if (typeof console.table === 'function') {
    console.group(`${PREFIX} 🔧 Categorias Ativas (para UI customizada)`)
    console.table(rows)
    console.info(`${PREFIX} ℹ️  Use estes dados para criar componentes customizados adequados.`)
    console.groupEnd()
  } else {
    console.log(`${PREFIX} 🔧 Categorias Ativas (para UI customizada)`, rows)
    console.info(`${PREFIX} ℹ️  Use estes dados para criar componentes customizados adequados.`)
  }
}

/**
 * @hook
 * Hook para desenvolvedores obterem orientações sobre a configuração atual da biblioteca.
 * Útil para componentes customizados verificarem se estão adequados à configuração do `ConsentProvider`.
 *
 * @param {ProjectCategoriesConfig} [config] A configuração de categorias do projeto. Se não for fornecida, a configuração padrão será utilizada.
 * @param {boolean} [disableGuidanceProp] Se `true`, desativa explicitamente a exibição das orientações no console, mesmo em desenvolvimento.
 * @returns {DeveloperGuidance} Um objeto `DeveloperGuidance` com a análise da configuração.
 */
export function useDeveloperGuidance(
  config?: ProjectCategoriesConfig,
  disableGuidanceProp?: boolean,
): DeveloperGuidance {
  const guidance = React.useMemo(() => {
    return analyzeDeveloperConfiguration(config)
  }, [config])

  React.useEffect(() => {
    if (!disableGuidanceProp) {
      logDeveloperGuidance(guidance, disableGuidanceProp)
    }
  }, [guidance, disableGuidanceProp])

  return guidance
}
