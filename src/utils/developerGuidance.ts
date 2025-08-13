// src/utils/developerGuidance.ts
import * as React from 'react'
import type { ProjectCategoriesConfig } from '../types/types'

/**
 * Sistema de orientações para developers sobre configuração de categorias.
 * Ajuda a manter coerência entre configuração da lib e componentes customizados.
 */

export interface DeveloperGuidance {
  /** Avisos sobre configuração inconsistente */
  warnings: string[]
  /** Sugestões de melhoria */
  suggestions: string[]
  /** Informações sobre categorias ativas */
  activeCategoriesInfo: {
    id: string
    name: string
    description: string
    essential: boolean
    uiRequired: boolean
  }[]
  /** Se usa configuração padrão (não explícita) */
  usingDefaults: boolean
}

/**
 * Configuração padrão quando developer não especifica categorias.
 * Baseado nas necessidades mais comuns em conformidade LGPD.
 */
export const DEFAULT_PROJECT_CATEGORIES: ProjectCategoriesConfig = {
  enabledCategories: ['analytics'], // Só analytics além de necessary
}

/**
 * Analisa configuração do projeto e retorna orientações para o developer.
 */
export function analyzeDeveloperConfiguration(
  config?: ProjectCategoriesConfig,
): DeveloperGuidance {
  const guidance: DeveloperGuidance = {
    warnings: [],
    suggestions: [],
    activeCategoriesInfo: [],
    usingDefaults: !config,
  }

  // Se nenhuma configuração foi fornecida, usa padrão e avisa
  const finalConfig = config || DEFAULT_PROJECT_CATEGORIES

  if (!config) {
    guidance.warnings.push(
      'LGPD-CONSENT: Nenhuma configuração de categorias especificada. Usando padrão: necessary + analytics. ' +
        'Para produção, recomenda-se especificar explicitamente as categorias via prop "categories".',
    )
  }

  // Monta informações sobre categorias ativas
  // 1. Necessary (sempre presente)
  guidance.activeCategoriesInfo.push({
    id: 'necessary',
    name: 'Cookies Necessários',
    description: 'Essenciais para funcionamento básico do site',
    essential: true,
    uiRequired: false, // Não precisa de toggle (sempre ativo)
  })

  // 2. Categorias padrão habilitadas
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
        uiRequired: true, // Precisa de toggle na UI
      })
    }
  })

  // Validações e sugestões
  const totalToggleable = guidance.activeCategoriesInfo.filter(
    (c) => c.uiRequired,
  ).length

  if (totalToggleable === 0) {
    guidance.suggestions.push(
      'Apenas cookies necessários estão configurados. Para compliance completo LGPD, ' +
        'considere adicionar categorias como "analytics" ou "functional" conforme uso real.',
    )
  }

  if (totalToggleable > 5) {
    guidance.warnings.push(
      `${totalToggleable} categorias opcionais detectadas. UI com muitas opções pode ' +
      'prejudicar experiência do usuário. Considere agrupar categorias similares.`,
    )
  }

  return guidance
}

/**
 * Exibe orientações no console durante desenvolvimento.
 * Detecta ambiente de produção através de várias heurísticas.
 */
export function logDeveloperGuidance(
  guidance: DeveloperGuidance,
  disableGuidanceProp?: boolean,
): void {
  if (disableGuidanceProp) {
    return
  }

  const isProduction =
    // 1. NODE_ENV de bundlers (Vite, webpack, etc.)
    (typeof (globalThis as any).process !== 'undefined' &&
      (globalThis as any).process.env?.NODE_ENV === 'production') ||
    // 2. Flag customizada para desabilitar logs
    (typeof globalThis !== 'undefined' &&
      (globalThis as any).__LGPD_PRODUCTION__ === true) ||
    // 3. Flag de desenvolvimento desabilitada via window global (legado)
    (typeof window !== 'undefined' &&
      (window as any).__LGPD_DISABLE_GUIDANCE__ === true)

  if (isProduction) return

  // Prefix consistente para fácil filtro
  const PREFIX = '[🍪 LGPD-CONSENT]'

  if (guidance.warnings.length > 0) {
    console.group(`${PREFIX} ⚠️  Avisos de Configuração`)
    guidance.warnings.forEach((warning) => console.warn(`${PREFIX} ${warning}`))
    console.groupEnd()
  }

  if (guidance.suggestions.length > 0) {
    console.group(`${PREFIX} 💡 Sugestões`)
    guidance.suggestions.forEach((suggestion) =>
      console.info(`${PREFIX} ${suggestion}`),
    )
    console.groupEnd()
  }

  if (guidance.usingDefaults) {
    console.warn(
      // Changed from console.info to console.warn
      `${PREFIX} 📋 Usando configuração padrão. Para personalizar, use a prop "categories" no ConsentProvider.`,
    )
  }

  // Log das categorias ativas para orientar UI customizada
  console.group(`${PREFIX} 🔧 Categorias Ativas (para UI customizada)`)
  console.table(
    guidance.activeCategoriesInfo.map((cat) => ({
      ID: cat.id,
      Nome: cat.name,
      'Toggle UI?': cat.uiRequired ? '✅ SIM' : '❌ NÃO (sempre ativo)',
      'Essencial?': cat.essential ? '🔒 SIM' : '⚙️ NÃO',
    })),
  )
  console.info(
    `${PREFIX} ℹ️  Use estes dados para criar componentes customizados adequados.`,
  )
  console.groupEnd()
}

/**
 * Hook para developers obterem orientações sobre configuração atual.
 * Útil para componentes customizados verificarem se estão adequados.
 */
export function useDeveloperGuidance(
  config?: ProjectCategoriesConfig,
  disableGuidanceProp?: boolean,
) {
  const guidance = analyzeDeveloperConfiguration(config)

  // Stringify config for stable dependency comparison
  const stringifiedConfig = React.useMemo(
    () => JSON.stringify(config),
    [config],
  )

  // Log apenas uma vez quando configuração muda (se não desabilitado)
  React.useEffect(() => {
    // Se guidance está explicitamente desabilitado, não chamar a função
    if (disableGuidanceProp === true) {
      return
    }
    logDeveloperGuidance(guidance, disableGuidanceProp)
  }, [guidance, stringifiedConfig, disableGuidanceProp])

  return guidance
}
