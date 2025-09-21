/* eslint-env browser, node */

import React from 'react'
import type { ProjectCategoriesConfig } from '../types/types'
import { COOKIE_PATTERNS_BY_CATEGORY } from './cookieRegistry'

export interface DeveloperGuidance {
  warnings: string[]
  suggestions: string[]
  activeCategoriesInfo: {
    id: string
    name: string
    description: string
    essential: boolean
    uiRequired: boolean
    cookies?: string[]
  }[]
  usingDefaults: boolean
}

export const DEFAULT_PROJECT_CATEGORIES: ProjectCategoriesConfig = {
  enabledCategories: ['analytics'],
}

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
      'LGPD-CONSENT: Nenhuma configuração de categorias especificada. Usando padrão: necessary + analytics. Para produção, especifique explicitamente as categorias via prop "categories".',
    )
  }

  guidance.activeCategoriesInfo.push({
    id: 'necessary',
    name: 'Cookies Necessários',
    description: 'Essenciais para funcionamento básico do site',
    essential: true,
    uiRequired: false,
    cookies: COOKIE_PATTERNS_BY_CATEGORY['necessary'],
  })

  const enabled = (finalConfig.enabledCategories || []) as string[]
  const NAMES: Record<string, { name: string; description: string }> = {
    analytics: { name: 'Cookies Analíticos', description: 'Medem uso e performance do site' },
    functional: { name: 'Cookies Funcionais', description: 'Melhoram experiência e funcionalidades' },
    marketing: { name: 'Cookies de Marketing', description: 'Publicidade direcionada e campanhas' },
    social: { name: 'Cookies de Redes Sociais', description: 'Integração com plataformas sociais' },
    personalization: { name: 'Cookies de Personalização', description: 'Adaptação de conteúdo' },
  }

  enabled.forEach((id) => {
    const info = NAMES[id]
    if (info) {
      guidance.activeCategoriesInfo.push({
        id,
        name: info.name,
        description: info.description,
        essential: false,
        uiRequired: true,
        cookies: COOKIE_PATTERNS_BY_CATEGORY[id as keyof typeof COOKIE_PATTERNS_BY_CATEGORY],
      })
    }
  })

  const custom = finalConfig.customCategories || []
  custom.forEach((cat) => {
    if (!cat?.id || cat.id === 'necessary') return
    guidance.activeCategoriesInfo.push({
      id: cat.id,
      name: cat.name,
      description: cat.description,
      essential: !!cat.essential,
      uiRequired: !cat.essential,
      cookies: cat.cookies,
    })
  })

  try {
    const gt = globalThis as { __LGPD_REQUIRED_CATEGORIES__?: string[] }
    const implied = (gt.__LGPD_REQUIRED_CATEGORIES__ || []).filter(Boolean)
    implied.forEach((id) => {
      if (!guidance.activeCategoriesInfo.find((c) => c.id === id)) {
        const info = NAMES[id]
        if (info) {
          guidance.activeCategoriesInfo.push({
            id,
            name: info.name,
            description: info.description,
            essential: false,
            uiRequired: true,
            cookies: COOKIE_PATTERNS_BY_CATEGORY[id as keyof typeof COOKIE_PATTERNS_BY_CATEGORY],
          })
          if (!enabled.includes(id)) {
            guidance.suggestions.push(
              `Integrações detectadas requerem a categoria '${id}'. Adicione-a em categories.enabledCategories.`,
            )
          }
        }
      }
    })
  } catch {
    // ignore SSR / globals issues
  }

  const totalToggleable = guidance.activeCategoriesInfo.filter((c) => c.uiRequired).length
  if (totalToggleable === 0) {
    guidance.suggestions.push(
      'Apenas cookies necessários estão configurados. Para compliance LGPD, considere adicionar categorias como "analytics" ou "functional" conforme uso real.',
    )
  }
  if (totalToggleable > 5) {
    guidance.warnings.push(
      `${totalToggleable} categorias opcionais detectadas. UI com muitas opções pode prejudicar a experiência. Considere agrupar categorias similares.`,
    )
  }

  return guidance
}

export function logDeveloperGuidance(guidance: DeveloperGuidance, disableGuidanceProp?: boolean): void {
  const gt = globalThis as unknown as { process?: { env?: { NODE_ENV?: string } }; __LGPD_PRODUCTION__?: boolean }
  const nodeEnv = typeof gt.process !== 'undefined' ? gt.process?.env?.NODE_ENV : undefined
  const isProd = nodeEnv === 'production' || gt.__LGPD_PRODUCTION__ === true
  if (isProd || disableGuidanceProp) return

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
    console.warn(`${PREFIX} 📋 Usando configuração padrão. Para personalizar, use a prop "categories" no ConsentProvider.`)
  }

  const rows = guidance.activeCategoriesInfo.map((cat) => ({
    ID: cat.id,
    Nome: cat.name,
    'Toggle UI?': cat.uiRequired ? '✅ SIM' : '❌ NÃO (sempre ativo)',
    'Essencial?': cat.essential ? '🔒 SIM' : '⚙️ NÃO',
    Cookies: (cat.cookies || []).join(', '),
  }))
  if (typeof console.table === 'function') {
    console.group(`${PREFIX} 🔧 Categorias Ativas (para UI customizada)`)
    console.table(rows)
    console.info(`${PREFIX} ℹ️  Use estes dados para criar componentes customizados adequados.`)
    console.groupEnd()
  } else {
    console.log(`${PREFIX} 🔧 Categorias Ativas (para UI customizada)`, rows)
  }

  console.group(`${PREFIX} 📖 Boas práticas LGPD (Brasil)`)
  console.info(`${PREFIX} 🔒 Necessary: sempre ativos. Outras categorias devem iniciar como rejeitadas (opt-out).`)
  console.info(`${PREFIX} 📜 Política clara por categoria e link visível para o usuário.`)
  console.info(`${PREFIX} 🧾 Registre consentimento (data/hora, origem) e permita revisão posterior.`)
  console.info(`${PREFIX} ⏳ Defina prazos de retenção compatíveis e evite coleta antes do consentimento.`)
  console.groupEnd()
}

export function useDeveloperGuidance(
  config?: ProjectCategoriesConfig,
  disableGuidanceProp?: boolean,
): DeveloperGuidance {
  const guidance = React.useMemo(() => analyzeDeveloperConfiguration(config), [config])
  React.useEffect(() => {
    if (!disableGuidanceProp) logDeveloperGuidance(guidance, disableGuidanceProp)
  }, [guidance, disableGuidanceProp])
  return guidance
}
