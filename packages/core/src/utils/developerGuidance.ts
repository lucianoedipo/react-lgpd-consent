/* eslint-env browser, node */

import React from 'react'
import type { Category, ProjectCategoriesConfig } from '../types/types'
import { COOKIE_PATTERNS_BY_CATEGORY, getCookiesInfoForCategory } from './cookieRegistry'

export type GuidanceSeverity = 'info' | 'warning' | 'error'

export interface GuidanceMessage {
  severity: GuidanceSeverity
  message: string
  category?: string
  actionable?: boolean
}

export interface GuidanceConfig {
  /** Controla se avisos devem ser exibidos */
  showWarnings?: boolean
  /** Controla se sugestões devem ser exibidas */
  showSuggestions?: boolean
  /** Controla se a tabela de categorias deve ser exibida */
  showCategoriesTable?: boolean
  /** Controla se as boas práticas devem ser exibidas */
  showBestPractices?: boolean
  /** Controla se deve exibir score de conformidade */
  showComplianceScore?: boolean
  /** Filtro de severidade mínima para exibir mensagens */
  minimumSeverity?: GuidanceSeverity
  /** Callback personalizado para processar mensagens */
  messageProcessor?: (messages: GuidanceMessage[]) => void
}

export interface DeveloperGuidance {
  warnings: string[]
  suggestions: string[]
  messages: GuidanceMessage[]
  activeCategoriesInfo: {
    id: string
    name: string
    description: string
    essential: boolean
    uiRequired: boolean
    cookies?: string[]
  }[]
  usingDefaults: boolean
  complianceScore?: number
}

export const DEFAULT_PROJECT_CATEGORIES: ProjectCategoriesConfig = {
  enabledCategories: ['analytics'],
}

/**
 * Calcula score de conformidade LGPD baseado na configuração (0-100)
 */
function calculateComplianceScore(guidance: DeveloperGuidance): number {
  let score = 0
  const maxScore = 100

  // Pontuação base por ter configuração explícita
  if (!guidance.usingDefaults) score += 30

  // Pontuação por categorias configuradas
  const totalCategories = guidance.activeCategoriesInfo.length
  const toggleableCategories = guidance.activeCategoriesInfo.filter((c) => c.uiRequired).length

  if (totalCategories > 1) score += 20 // Além de necessary
  if (toggleableCategories >= 2 && toggleableCategories <= 4) score += 25 // Quantidade ideal

  // Pontuação por ausência de problemas críticos
  const criticalWarnings = guidance.messages.filter((m) => m.severity === 'error').length
  const warnings = guidance.messages.filter((m) => m.severity === 'warning').length

  if (criticalWarnings === 0) score += 15
  if (warnings === 0) score += 10

  return Math.min(score, maxScore)
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
    messages: [],
    activeCategoriesInfo: [],
    usingDefaults: !config,
    complianceScore: 0,
  }

  const addMessage = (
    severity: GuidanceSeverity,
    message: string,
    category?: string,
    actionable = true,
  ) => {
    const guidanceMessage: GuidanceMessage = { severity, message, category, actionable }
    guidance.messages.push(guidanceMessage)

    // Manter compatibilidade com arrays existentes
    if (severity === 'warning' || severity === 'error') {
      guidance.warnings.push(message)
    } else {
      guidance.suggestions.push(message)
    }
  }

  const finalConfig = config || DEFAULT_PROJECT_CATEGORIES
  if (!config) {
    addMessage(
      'warning',
      'LGPD-CONSENT: Nenhuma configuração de categorias especificada. Usando padrão: necessary + analytics. Para produção, especifique explicitamente as categorias via prop "categories".',
      'configuration',
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
            addMessage(
              'info',
              `Integrações detectadas requerem a categoria '${id}'. Adicione-a em categories.enabledCategories.`,
              'integration',
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
    addMessage(
      'info',
      'Apenas cookies necessários estão configurados. Para compliance LGPD, considere adicionar categorias como "analytics" ou "functional" conforme uso real.',
      'compliance',
    )
  }
  if (totalToggleable > 5) {
    addMessage(
      'warning',
      `${totalToggleable} categorias opcionais detectadas. UI com muitas opções pode prejudicar a experiência. Considere agrupar categorias similares.`,
      'usability',
    )
  }

  // Calcular score de conformidade LGPD
  guidance.complianceScore = calculateComplianceScore(guidance)

  return guidance
}

// Sistema de cache para evitar logs repetitivos
const GUIDANCE_CACHE = new Set<string>()
const SESSION_LOGGED = {
  intro: false,
  bestPractices: false,
}

// Funções auxiliares para logging
function getComplianceScoreColor(score: number): string {
  if (score >= 80) return '#4caf50'
  if (score >= 60) return '#ff9800'
  return '#f44336'
}

function logComplianceScore(prefix: string, score: number): void {
  const color = getComplianceScoreColor(score)
  console.log(
    `%c${prefix} Score de Conformidade LGPD: ${score}/100`,
    `color: ${color}; font-weight: bold; font-size: 14px;`,
  )
}

function logMessagesByType(
  prefix: string,
  messages: GuidanceMessage[],
  type: GuidanceSeverity,
  config: GuidanceConfig,
): boolean {
  const filteredMessages = messages.filter((m) => m.severity === type)
  if (filteredMessages.length === 0) return false

  const typeConfig = {
    error: {
      show: config.showWarnings,
      title: 'Erros Críticos',
      color: '#d32f2f',
      method: console.error,
    },
    warning: {
      show: config.showWarnings,
      title: 'Avisos de Configuração',
      color: '#f57c00',
      method: console.warn,
    },
    info: {
      show: config.showSuggestions,
      title: 'Sugestões',
      color: '#2196f3',
      method: console.info,
    },
  }

  const typeSettings = typeConfig[type]
  if (!typeSettings.show) return false

  console.group(
    `%c${prefix} ${typeSettings.title}`,
    `color: ${typeSettings.color}; font-weight: bold;`,
  )
  filteredMessages.forEach((msg) =>
    typeSettings.method(
      `%c${prefix}%c ${msg.message}`,
      `color: ${typeSettings.color};`,
      'color: #333;',
    ),
  )
  console.groupEnd()
  return true
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
    `%c🍪 LGPD-CONSENT %c- Sistema de Consentimento Ativo`,
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
  config?: GuidanceConfig,
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

  // Configurações padrão
  const guidanceConfig: GuidanceConfig = {
    showWarnings: true,
    showSuggestions: true,
    showCategoriesTable: true,
    showBestPractices: true,
    showComplianceScore: true,
    minimumSeverity: 'info',
    ...config,
  }

  // Processar mensagens customizadas se fornecido
  if (guidanceConfig.messageProcessor) {
    guidanceConfig.messageProcessor(guidance.messages)
    return
  }

  // Log do browser apenas para situações importantes
  logIntroOnce()

  const PREFIX = '🍪'
  let hasImportantInfo = false

  // Filtrar mensagens por severidade
  const filteredMessages = guidance.messages.filter((msg) => {
    const severityLevels = { info: 0, warning: 1, error: 2 }
    const minLevel = severityLevels[guidanceConfig.minimumSeverity || 'info']
    const msgLevel = severityLevels[msg.severity]
    return msgLevel >= minLevel
  })

  // Exibir mensagens usando funções auxiliares
  hasImportantInfo =
    logMessagesByType(PREFIX, filteredMessages, 'error', guidanceConfig) || hasImportantInfo
  hasImportantInfo =
    logMessagesByType(PREFIX, filteredMessages, 'warning', guidanceConfig) || hasImportantInfo

  // Sugestões apenas se há problemas ou usando defaults
  if (hasImportantInfo || guidance.usingDefaults) {
    hasImportantInfo =
      logMessagesByType(PREFIX, filteredMessages, 'info', guidanceConfig) || hasImportantInfo
  }

  // Score de conformidade LGPD
  if (guidanceConfig.showComplianceScore && guidance.complianceScore !== undefined) {
    logComplianceScore(PREFIX, guidance.complianceScore)
  }

  // Tabela de categorias
  if (guidanceConfig.showCategoriesTable && (hasImportantInfo || guidance.usingDefaults)) {
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
  guidanceConfig?: GuidanceConfig,
): DeveloperGuidance {
  const guidance = React.useMemo(() => analyzeDeveloperConfiguration(config), [config])
  React.useEffect(() => {
    if (!disableGuidanceProp) logDeveloperGuidance(guidance, disableGuidanceProp, guidanceConfig)
  }, [guidance, disableGuidanceProp, guidanceConfig])
  return guidance
}

/**
 * Presets de configuração para diferentes ambientes
 */
export const GUIDANCE_PRESETS = {
  /** Configuração completa para desenvolvimento */
  development: {
    showWarnings: true,
    showSuggestions: true,
    showCategoriesTable: true,
    showBestPractices: true,
    showComplianceScore: true,
    minimumSeverity: 'info' as const,
  },
  /** Configuração silenciosa para produção */
  production: {
    showWarnings: false,
    showSuggestions: false,
    showCategoriesTable: false,
    showBestPractices: false,
    showComplianceScore: false,
    minimumSeverity: 'error' as const,
  },
  /** Apenas erros críticos */
  minimal: {
    showWarnings: true,
    showSuggestions: false,
    showCategoriesTable: false,
    showBestPractices: false,
    showComplianceScore: false,
    minimumSeverity: 'error' as const,
  },
  /** Focado em conformidade LGPD */
  compliance: {
    showWarnings: true,
    showSuggestions: true,
    showCategoriesTable: true,
    showBestPractices: true,
    showComplianceScore: true,
    minimumSeverity: 'warning' as const,
  },
} as const
