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
  customCategories: [],
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

  // 3. Categorias customizadas
  const customCategories = finalConfig.customCategories || []
  customCategories.forEach((category) => {
    guidance.activeCategoriesInfo.push({
      id: category.id,
      name: category.name,
      description: category.description,
      essential: category.essential === true,
      uiRequired: category.essential !== true, // Apenas não-essenciais precisam toggle
    })
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

  // Verifica se há categorias sem descrição adequada
  const poorDescriptions = customCategories.filter(
    (c) => !c.description || c.description.length < 10,
  )
  if (poorDescriptions.length > 0) {
    guidance.warnings.push(
      `Categorias customizadas com descrições inadequadas: ${poorDescriptions.map((c) => c.id).join(', ')}. ` +
        'Descrições claras são obrigatórias para compliance LGPD.',
    )
  }

  return guidance
}

/**
 * Exibe orientações no console durante desenvolvimento.
 * Apenas em modo desenvolvimento (NODE_ENV !== 'production').
 */
export function logDeveloperGuidance(guidance: DeveloperGuidance): void {
  // Detecta ambiente de produção através de verificação de variáveis globais
  const isProduction =
    (typeof globalThis !== 'undefined' &&
      (globalThis as any).__LGPD_PRODUCTION__) ||
    (typeof window !== 'undefined' && !(window as any).__LGPD_DEV__)

  if (isProduction) return

  if (guidance.warnings.length > 0) {
    console.group('🟨 LGPD-CONSENT: Avisos de Configuração')
    guidance.warnings.forEach((warning) => console.warn(warning))
    console.groupEnd()
  }

  if (guidance.suggestions.length > 0) {
    console.group('💡 LGPD-CONSENT: Sugestões')
    guidance.suggestions.forEach((suggestion) => console.info(suggestion))
    console.groupEnd()
  }

  if (guidance.usingDefaults) {
    console.info(
      '📋 LGPD-CONSENT: Usando configuração padrão. Para personalizar, use a prop "categories" no ConsentProvider.',
    )
  }

  // Log das categorias ativas para orientar UI customizada
  console.group('🔧 LGPD-CONSENT: Categorias Ativas (para UI customizada)')
  console.table(
    guidance.activeCategoriesInfo.map((cat) => ({
      ID: cat.id,
      Nome: cat.name,
      'Toggle UI?': cat.uiRequired ? '✅ SIM' : '❌ NÃO (sempre ativo)',
      'Essencial?': cat.essential ? '🔒 SIM' : '⚙️ NÃO',
    })),
  )
  console.groupEnd()
}

/**
 * Hook para developers obterem orientações sobre configuração atual.
 * Útil para componentes customizados verificarem se estão adequados.
 */
export function useDeveloperGuidance(config?: ProjectCategoriesConfig) {
  const guidance = analyzeDeveloperConfiguration(config)

  // Log apenas uma vez quando configuração muda
  React.useEffect(() => {
    logDeveloperGuidance(guidance)
  }, [JSON.stringify(config)])

  return guidance
}
