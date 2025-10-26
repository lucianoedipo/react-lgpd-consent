/**
 * Componente que carrega scripts automaticamente baseado no consentimento.
 * Facilita integração com ferramentas como Google Analytics, Tag Manager, etc.
 */

import * as React from 'react'
import { useCategories } from '../context/CategoriesContext'
import { useConsent } from '../hooks/useConsent'
import type { Category } from '../types/types'
import {
  autoConfigureCategories,
  validateIntegrationCategories,
  validateNecessaryClassification,
} from './autoConfigureCategories'
import { logger } from './logger'
import type { ScriptIntegration } from './scriptIntegrations'
import { loadScript } from './scriptLoader'

export interface ConsentScriptLoaderProps {
  /** Lista de integrações de scripts para carregar baseado no consentimento */
  integrations: ScriptIntegration[]
  /** Se true, força recarregamento se consentimento mudar */
  reloadOnChange?: boolean
}

/**
 * @component
 * @category Utils
 * @since 0.2.0
 * Componente que não renderiza UI, mas gerencia o carregamento de scripts de terceiros
 * (como Google Analytics) com base nas preferências de consentimento do usuário.
 *
 * @param props As propriedades do componente.
 * @param {ScriptIntegration[]} props.integrations Um array de objetos de integração de script. Use as factory functions (`createGoogleAnalyticsIntegration`, etc.) para criar.
 * @param {boolean} [props.reloadOnChange=false] Se `true`, recarrega os scripts se as preferências de consentimento mudarem.
 *
 * @example
 * ```tsx
 * const integrations = [
 *   createGoogleAnalyticsIntegration({ measurementId: 'GA_ID' }),
 *   createFacebookPixelIntegration({ pixelId: 'PIXEL_ID' })
 * ];
 *
 * <ConsentScriptLoader integrations={integrations} />
 * ```
 */
export function ConsentScriptLoader({
  integrations,
  reloadOnChange = false,
}: Readonly<ConsentScriptLoaderProps>) {
  const { preferences, consented } = useConsent()
  const categories = useCategories()
  const loadedScripts = React.useRef<Set<string>>(new Set())

  // Registrar integrações usadas (para catálogo de cookies e guidance)
  React.useEffect(() => {
    try {
      const ids = (integrations || []).map((i) => i.id)
      const gt = globalThis as unknown as { __LGPD_USED_INTEGRATIONS__?: string[] }
      const current = Array.isArray(gt.__LGPD_USED_INTEGRATIONS__)
        ? gt.__LGPD_USED_INTEGRATIONS__
        : []
      const merged = Array.from(new Set([...(current as string[]), ...ids]))
      gt.__LGPD_USED_INTEGRATIONS__ = merged

      // Mapear id -> categoria para uso na UI (experimental)
      try {
        const gmap = globalThis as unknown as { __LGPD_INTEGRATIONS_MAP__?: Record<string, string> }
        const map = gmap.__LGPD_INTEGRATIONS_MAP__ || {}
        ;(integrations || []).forEach((i) => {
          map[i.id] = i.category
        })
        gmap.__LGPD_INTEGRATIONS_MAP__ = map
      } catch {
        // ignore
      }
    } catch {
      // ignore
    }
  }, [integrations])
  // Registrar categorias requeridas globalmente e notificar contexto (para guidance/Modal)
  React.useEffect(() => {
    try {
      const required = Array.from(new Set((integrations || []).map((i) => i.category))).filter(
        Boolean,
      )
      const gt = globalThis as unknown as { __LGPD_REQUIRED_CATEGORIES__?: string[] }
      const current = Array.isArray(gt.__LGPD_REQUIRED_CATEGORIES__)
        ? gt.__LGPD_REQUIRED_CATEGORIES__
        : []
      const merged = Array.from(new Set([...(current as string[]), ...(required as string[])]))
      gt.__LGPD_REQUIRED_CATEGORIES__ = merged
      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
        window.dispatchEvent(new CustomEvent('lgpd:requiredCategories'))
      }
    } catch {
      // Ignora erros de globalThis em ambientes sem suporte
    }
  }, [integrations])

  // Validação inteligente das categorias em modo DEV
  React.useEffect(() => {
    const isDev = process.env.NODE_ENV !== 'production'
    if (!isDev || integrations.length === 0) return

    const enabledCategories = categories.allCategories.map((cat) => cat.id) as Category[]
    const isValid = validateIntegrationCategories(integrations, enabledCategories)

    if (!isValid) {
      // Analisa e loga informações sobre categorias em falta
      autoConfigureCategories({ enabledCategories }, integrations, {
        warningOnly: true,
        silent: false,
      })
    }

    // Validação de proteção contra classificação incorreta como "necessary"
    const necessaryWarnings = validateNecessaryClassification(integrations, enabledCategories)
    if (necessaryWarnings.length > 0) {
      console.group('🚨 [LGPD-CONSENT] VALIDAÇÃO DE COMPLIANCE')
      necessaryWarnings.forEach((warning) => {
        if (warning.startsWith('⚠️')) {
          console.error(warning)
        } else if (
          warning.startsWith('💡') ||
          warning.startsWith('📚') ||
          warning.startsWith('🔧')
        ) {
          console.warn(warning)
        } else {
          console.log(warning)
        }
      })
      console.groupEnd()
    }
  }, [integrations, categories])

  React.useEffect(() => {
    if (!consented) return

    integrations.forEach(async (integration) => {
      const shouldLoad = preferences[integration.category]
      const alreadyLoaded = loadedScripts.current.has(integration.id)

      if (shouldLoad && (!alreadyLoaded || reloadOnChange)) {
        try {
          await loadScript(integration.id, integration.src, integration.category, integration.attrs)

          // Executa função de inicialização se disponível
          if (integration.init) {
            integration.init()
          }

          loadedScripts.current.add(integration.id)
        } catch (error) {
          logger.error(`❌ Failed to load script: ${integration.id}`, error)
        }
      }
    })
  }, [preferences, consented, integrations, reloadOnChange])

  // Este componente não renderiza nada
  return null
}

/**
 * @hook
 * @category Hooks
 * @since 0.2.0
 * Hook para carregamento programático de um script baseado no consentimento.
 *
 * @returns Uma função assíncrona que recebe um objeto de integração de script e tenta carregá-lo.
 * Retorna `true` em caso de sucesso e `false` em caso de falha (por falta de consentimento ou erro de rede).
 *
 * @example
 * ```tsx
 * const loadScript = useConsentScriptLoader();
 *
 * useEffect(() => {
 *   const handleUserAction = async () => {
 *     const hotjarIntegration = { id: 'hotjar', category: 'analytics', src: '...' };
 *     const success = await loadScript(hotjarIntegration);
 *     if (success) {
 *       console.log('Hotjar carregado com sucesso!');
 *     }
 *   };
 *
 *   // Exemplo: carregar script após uma ação específica do usuário
 *   myButton.addEventListener('click', handleUserAction);
 * }, [loadScript]);
 * ```
 */
export function useConsentScriptLoader() {
  const { preferences, consented } = useConsent()

  return React.useCallback(
    async (integration: ScriptIntegration) => {
      if (!consented) {
        logger.warn(`⚠️ Cannot load script ${integration.id}: No consent given`)
        return false
      }

      const shouldLoad = preferences[integration.category]
      if (!shouldLoad) {
        logger.warn(
          `⚠️ Cannot load script ${integration.id}: Category '${integration.category}' not consented`,
        )
        return false
      }

      try {
        await loadScript(integration.id, integration.src, integration.category, integration.attrs)

        if (integration.init) {
          integration.init()
        }

        return true
      } catch (error) {
        logger.error(`❌ Failed to load script: ${integration.id}`, error)
        return false
      }
    },
    [preferences, consented],
  )
}
