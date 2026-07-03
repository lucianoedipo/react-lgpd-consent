/**
 * @file autoConfigureCategories.ts
 * @description Sistema inteligente de auto-habilitação de categorias baseado nas integrações utilizadas
 * @since 0.4.1
 */

import type { Category, ProjectCategoriesConfig } from '../types/types'
import type { ScriptIntegration } from './scriptIntegrations'
import { isDevelopmentEnv } from './env'

/**
 * Scripts conhecidos que NUNCA devem ser classificados como "necessary"
 * Baseado em regulamentações GDPR/LGPD e práticas da indústria
 * @since 0.4.1
 */
const FORBIDDEN_NECESSARY_SCRIPTS = new Set([
  // Analytics & Performance
  'google-analytics',
  'google-tag-manager',
  'hotjar',
  'mixpanel',
  'clarity',
  'amplitude',
  'segment',

  // Marketing & Advertising
  'facebook-pixel',
  'twitter-pixel',
  'linkedin-insight',
  'pinterest-tag',
  'snapchat-pixel',
  'tiktok-pixel',
  'reddit-pixel',

  // Communication & Support
  'intercom',
  'zendesk-chat',
  'drift',
  'crisp',
  'freshchat',

  // A/B Testing & Optimization
  'optimizely',
  'vwo',
  'google-optimize',
  'unbounce',

  // Social & Content
  'youtube-embed',
  'vimeo-embed',
  'twitter-widget',
  'facebook-widget',
  'instagram-widget',

  // Accessibility (exceto scripts críticos)
  'userway',
])

/**
 * @interface CategoryAutoConfigResult
 * Resultado da análise e auto-configuração de categorias
 */
export interface CategoryAutoConfigResult {
  /** Configuração original fornecida pelo desenvolvedor */
  originalConfig: ProjectCategoriesConfig
  /** Configuração ajustada automaticamente pela biblioteca */
  adjustedConfig: ProjectCategoriesConfig
  /** Categorias que foram automaticamente habilitadas */
  autoEnabledCategories: string[]
  /** Categorias requeridas pelas integrações mas não habilitadas */
  missingCategories: string[]
  /** Se algum ajuste foi necessário */
  wasAdjusted: boolean
  /** Integrações que requerem cada categoria */
  categoryIntegrations: Record<string, string[]>
}

/**
 * @function
 * @category Utils
 * @since 0.4.1
 * Analisa as integrações fornecidas e determina quais categorias são necessárias.
 *
 * @param integrations Array de integrações de script
 * @returns Record mapeando categoria para nomes das integrações que a utilizam
 */
export function analyzeIntegrationCategories(
  integrations: ScriptIntegration[],
): Record<string, string[]> {
  const categoryMap: Record<string, string[]> = {}

  integrations.forEach((integration) => {
    const category = integration.category
    if (!categoryMap[category]) {
      categoryMap[category] = []
    }
    categoryMap[category].push(integration.id)
  })

  return categoryMap
}

/**
 * @function
 * @category Utils
 * @since 0.4.1
 * Configura automaticamente as categorias necessárias baseado nas integrações utilizadas.
 *
 * Esta função implementa o comportamento inteligente da biblioteca:
 * 1. Detecta categorias requeridas pelas integrações
 * 2. Auto-habilita categorias em falta (modo padrão)
 * 3. Ou apenas avisa sobre categorias em falta (modo warning-only)
 * 4. Loga no console em modo DEV
 *
 * @param originalConfig Configuração original do ConsentProvider
 * @param integrations Array de integrações que serão utilizadas
 * @param options Opções de comportamento
 * @returns Resultado da análise e configuração automática
 */
export function autoConfigureCategories(
  originalConfig: ProjectCategoriesConfig | undefined,
  integrations: ScriptIntegration[],
  options: {
    /** Se true, apenas avisa mas não modifica a config (padrão: false - auto-habilita) */
    warningOnly?: boolean
    /** Se true, desabilita logs no console (padrão: false) */
    silent?: boolean
  } = {},
): CategoryAutoConfigResult {
  const { warningOnly = false, silent = false } = options

  // Configuração padrão se não fornecida
  const config = originalConfig || { enabledCategories: ['analytics'] }

  // Analisa categorias requeridas pelas integrações
  const categoryIntegrations = analyzeIntegrationCategories(integrations)
  const requiredCategories = Object.keys(categoryIntegrations) as Category[]

  // Categorias atualmente habilitadas
  const currentCategories = new Set(config.enabledCategories || [])

  // Detecta categorias em falta
  const missingCategories = requiredCategories.filter((cat) => !currentCategories.has(cat))

  let adjustedConfig = { ...config }
  let autoEnabledCategories: Category[] = []

  if (missingCategories.length > 0) {
    if (warningOnly) {
      // Modo warning-only: apenas avisa, não modifica
      if (!silent) {
        logMissingCategoriesWarning(missingCategories, categoryIntegrations)
      }
    } else {
      // Modo padrão: auto-habilita categorias em falta
      autoEnabledCategories = [...missingCategories]
      adjustedConfig = {
        ...config,
        enabledCategories: [...currentCategories, ...missingCategories],
      }

      if (!silent) {
        logAutoEnabledCategories(autoEnabledCategories, categoryIntegrations)
      }
    }
  }

  return {
    originalConfig: config,
    adjustedConfig,
    autoEnabledCategories,
    missingCategories,
    wasAdjusted: autoEnabledCategories.length > 0,
    categoryIntegrations,
  }
}

/**
 * @function
 * @category Utils
 * @since 0.4.1
 * Loga avisos sobre categorias em falta (modo warning-only)
 */
function logMissingCategoriesWarning(
  missingCategories: Category[],
  categoryIntegrations: Record<Category, string[]>,
): void {
  if (!isDevelopmentEnv()) return

  const PREFIX = '[🍪 LGPD-CONSENT AUTO-CONFIG]'

  console.group(`${PREFIX} ⚠️ Categorias Requeridas Não Habilitadas`)

  missingCategories.forEach((category) => {
    const integrations = categoryIntegrations[category] || []
    console.warn(
      `${PREFIX} Categoria '${category}' requerida por integrações: ${integrations.join(', ')}`,
    )
  })

  const categoriesCode = missingCategories.map((c) => `'${c}'`).join(', ')
  console.warn(
    `${PREFIX} Para corrigir, adicione estas categorias ao ConsentProvider:`,
    `categories={{ enabledCategories: [...existingCategories, ${categoriesCode}] }}`,
  )

  console.groupEnd()
}

/**
 * @function
 * @category Utils
 * @since 0.4.1
 * Loga informações sobre categorias auto-habilitadas
 */
function logAutoEnabledCategories(
  autoEnabledCategories: Category[],
  categoryIntegrations: Record<Category, string[]>,
): void {
  if (!isDevelopmentEnv()) return

  const PREFIX = '[🍪 LGPD-CONSENT AUTO-CONFIG]'

  console.group(`${PREFIX} ✅ Categorias Auto-Habilitadas`)

  autoEnabledCategories.forEach((category) => {
    const integrations = categoryIntegrations[category] || []
    console.info(
      `${PREFIX} Categoria '${category}' auto-habilitada para integrações: ${integrations.join(', ')}`,
    )
  })

  console.info(`${PREFIX} 💡 Essas categorias foram automaticamente adicionadas à configuração.`)
  console.info(`${PREFIX} 🔧 Para controle manual, especifique explicitamente no ConsentProvider.`)

  console.groupEnd()
}

/**
 * @function
 * @category Utils
 * @since 0.4.1
 * Valida se todas as integrações têm suas categorias habilitadas.
 * Útil para validação em tempo de execução.
 *
 * @param integrations Array de integrações
 * @param enabledCategories Array de categorias habilitadas
 * @returns true se todas as categorias necessárias estão habilitadas
 */
export function validateIntegrationCategories(
  integrations: ScriptIntegration[],
  enabledCategories: string[],
): boolean {
  const requiredCategories = integrations.map((i) => i.category)
  const enabledSet = new Set(enabledCategories)

  return requiredCategories.every((category) => enabledSet.has(category))
}

/**
 * @function
 * @category Utils
 * @since 0.4.1
 * Extrai categorias únicas de um array de integrações
 *
 * @param integrations Array de integrações
 * @returns Array de categorias únicas
 */
export function extractCategoriesFromIntegrations(integrations: ScriptIntegration[]): string[] {
  const categories = new Set<string>()
  integrations.forEach((integration) => {
    categories.add(integration.category)
  })
  return Array.from(categories)
}

/**
 * @function
 * @category Utils
 * @since 0.4.1
 * Valida se integrações estão sendo incorretamente classificadas como "necessary".
 *
 * Esta função protege contra violações de GDPR/LGPD identificando scripts que
 * NUNCA devem ser considerados estritamente necessários.
 *
 * @param integrations Array de integrações para validar
 * @param enabledCategories Categorias habilitadas na configuração
 * @returns Lista de avisos sobre classificações incorretas
 *
 * @example
 * ```typescript
 * const warnings = validateNecessaryClassification([
 *   createGoogleAnalyticsIntegration({...}), // ❌ NUNCA é necessary
 *   createCustomIntegration({...})           // ✅ Pode ser necessary se apropriado
 * ], ['necessary', 'analytics'])
 *
 * if (warnings.length > 0) {
 *   console.warn('Scripts incorretamente classificados como necessary:', warnings)
 * }
 * ```
 */
export function validateNecessaryClassification(
  integrations: ScriptIntegration[],
  enabledCategories: Category[],
): string[] {
  const warnings: string[] = []

  // Verifica se 'necessary' está habilitado
  const hasNecessaryCategory = enabledCategories.includes('necessary')
  if (!hasNecessaryCategory) {
    return warnings // Sem categoria 'necessary', nada para validar
  }

  // Identifica integrações potencialmente problemáticas (marcadas como necessary quando não deveriam)
  const problematicIntegrations = integrations.filter(
    (integration) =>
      integration.category === 'necessary' && FORBIDDEN_NECESSARY_SCRIPTS.has(integration.id),
  )

  if (problematicIntegrations.length > 0) {
    warnings.push(
      `⚠️ ATENÇÃO GDPR/LGPD: As seguintes integrações NUNCA devem ser classificadas como 'necessary':`,
    )

    problematicIntegrations.forEach((integration) => {
      warnings.push(
        `   • '${integration.id}' (categoria: ${integration.category}) - Requer consentimento explícito`,
      )
    })

    warnings.push(
      `💡 Scripts 'necessary' executam SEM consentimento e podem resultar em multas.`,
      `📚 Apenas scripts de segurança, autenticação ou core do site se qualificam.`,
      `🔧 Mova estes scripts para categorias apropriadas (analytics, marketing, etc.)`,
    )
  }

  return warnings
}
