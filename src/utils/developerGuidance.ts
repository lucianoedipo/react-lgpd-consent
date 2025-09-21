/* eslint-env browser, node */

import React from 'react'
import type { Category, ProjectCategoriesConfig } from '../types/types'
import { COOKIE_PATTERNS_BY_CATEGORY, getCookiesInfoForCategory } from './cookieRegistry'

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

/**
 * Analisa configuração e integrações implícitas para orientar o dev.
 *
 * Since v0.4.0: inclui customCategories.
 * Since v0.4.1: considera categorias/integrações implícitas e enriquece cookies por categoria.
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
    functional: {
      name: 'Cookies Funcionais',
      description: 'Melhoram experiência e funcionalidades',
    },
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

  // Categorias implícitas por integrações
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
    // ignore
  }

  // Enriquecer cookies (nomes) por integrações usadas
  try {
    const gt2 = globalThis as { __LGPD_USED_INTEGRATIONS__?: string[] }
    const used = gt2.__LGPD_USED_INTEGRATIONS__ || []
    guidance.activeCategoriesInfo = guidance.activeCategoriesInfo.map((c) => {
      const info = getCookiesInfoForCategory(c.id as unknown as Category, used)
      const names = Array.from(new Set([...(c.cookies || []), ...info.map((d) => d.name)]))
      return { ...c, cookies: names }
    })
  } catch {
    // ignore
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

// Sistema de cache para evitar logs repetitivos
const GUIDANCE_CACHE = new Set<string>()
const SESSION_LOGGED = {
  intro: false,
  bestPractices: false,
}

function getGuidanceHash(guidance: DeveloperGuidance): string {
  const sortedWarnings = [...guidance.warnings].sort((a: string, b: string) => a.localeCompare(b))
  const sortedSuggestions = [...guidance.suggestions].sort((a: string, b: string) =>
    a.localeCompare(b),
  )
  const sortedCategories = guidance.activeCategoriesInfo
    .map((c) => c.id)
    .sort((a: string, b: string) => a.localeCompare(b))

  return JSON.stringify({
    warnings: sortedWarnings,
    suggestions: sortedSuggestions,
    categories: sortedCategories,
    usingDefaults: guidance.usingDefaults,
  })
}

function logIntroOnce(): void {
  if (SESSION_LOGGED.intro) return
  SESSION_LOGGED.intro = true

  console.log(
    `%c🍪 LGPD-CONSENT v0.4.1 %c- Sistema de Consentimento Ativo`,
    'background: #4caf50; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;',
    'color: #2e7d32; font-weight: 500;',
  )
}

function logServerSideIfAvailable(guidance: DeveloperGuidance): void {
  // Tenta logar no servidor se estiver em ambiente Node.js (SSR/dev server)
  try {
    const gt = globalThis as unknown as {
      process?: {
        stdout?: {
          write: (data: string) => boolean
        }
      }
    }

    if (gt.process?.stdout?.write) {
      const prefix = '\x1b[36m[LGPD-CONSENT]\x1b[0m'
      const warnings = guidance.warnings.length
      const suggestions = guidance.suggestions.length
      const stdout = gt.process.stdout

      if (warnings > 0 || suggestions > 0) {
        stdout.write(`${prefix} 🔧 Config: ${warnings} avisos, ${suggestions} sugestões\n`)

        if (warnings > 0) {
          guidance.warnings.forEach((w: string) => {
            stdout.write(`${prefix} \x1b[33m⚠️  ${w}\x1b[0m\n`)
          })
        }

        if (suggestions > 0) {
          guidance.suggestions.forEach((s: string) => {
            stdout.write(`${prefix} \x1b[36m💡 ${s}\x1b[0m\n`)
          })
        }
      }
    }
  } catch {
    // Silently ignore if not in Node.js environment
  }
}

export function logDeveloperGuidance(
  guidance: DeveloperGuidance,
  disableGuidanceProp?: boolean,
): void {
  const gt = globalThis as unknown as {
    process?: { env?: { NODE_ENV?: string } }
    __LGPD_PRODUCTION__?: boolean
  }
  const nodeEnv = typeof gt.process !== 'undefined' ? gt.process?.env?.NODE_ENV : undefined
  const isProd = nodeEnv === 'production' || gt.__LGPD_PRODUCTION__ === true
  
  if (isProd || disableGuidanceProp) return

  // Verificar se já foi logado nesta sessão
  const guidanceHash = getGuidanceHash(guidance)
  if (GUIDANCE_CACHE.has(guidanceHash)) return

  GUIDANCE_CACHE.add(guidanceHash)

  // Log no servidor se disponível
  logServerSideIfAvailable(guidance)

  // Log do browser apenas para situações importantes
  logIntroOnce()

  const PREFIX = '🍪'
  let hasImportantInfo = false

  // Apenas avisos críticos no browser
  if (guidance.warnings.length > 0) {
    hasImportantInfo = true
    console.group(`%c${PREFIX} Avisos de Configuração`, 'color: #f57c00; font-weight: bold;')
    guidance.warnings.forEach((msg) =>
      console.warn(`%c${PREFIX}%c ${msg}`, 'color: #f57c00;', 'color: #bf360c;'),
    )
    console.groupEnd()
  }

  // Sugestões importantes (apenas se houver avisos ou uso de defaults)
  if (guidance.suggestions.length > 0 && (guidance.warnings.length > 0 || guidance.usingDefaults)) {
    hasImportantInfo = true
    console.group(`%c${PREFIX} Sugestões`, 'color: #2196f3; font-weight: bold;')
    guidance.suggestions.forEach((msg) =>
      console.info(`%c${PREFIX}%c ${msg}`, 'color: #2196f3;', 'color: #1565c0;'),
    )
    console.groupEnd()
  }

  // Tabela de categorias apenas se solicitado ou há problemas
  if (hasImportantInfo || guidance.usingDefaults) {
    const rows = guidance.activeCategoriesInfo.map((cat) => ({
      '📊 Categoria': cat.id,
      '🏷️  Nome': cat.name,
      '🎛️  UI': cat.uiRequired ? '✅' : '🔒',
      '🍪 Cookies':
        (cat.cookies || []).slice(0, 3).join(', ') +
        (cat.cookies && cat.cookies.length > 3 ? ` (+${cat.cookies.length - 3})` : ''),
    }))

    if (typeof console.table === 'function') {
      console.group(`%c${PREFIX} Configuração Ativa`, 'color: #4caf50; font-weight: bold;')
      console.table(rows)
      console.groupEnd()
    }
  }

  // Boas práticas apenas uma vez por sessão
  if (!SESSION_LOGGED.bestPractices && hasImportantInfo) {
    SESSION_LOGGED.bestPractices = true
    console.group(`%c${PREFIX} LGPD - Boas Práticas`, 'color: #9c27b0; font-weight: bold;')
    console.info(
      `%c${PREFIX}%c Necessary: sempre ativo • Demais: opt-out por padrão`,
      'color: #9c27b0;',
      'color: #7b1fa2;',
    )
    console.info(
      `%c${PREFIX}%c Documente políticas claras por categoria`,
      'color: #9c27b0;',
      'color: #7b1fa2;',
    )
    console.info(
      `%c${PREFIX}%c Registre consentimento com data/hora/origem`,
      'color: #9c27b0;',
      'color: #7b1fa2;',
    )
    console.groupEnd()
  }
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
