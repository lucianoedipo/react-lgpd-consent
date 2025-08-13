/**
 * Componente que carrega scripts automaticamente baseado no consentimento.
 * Facilita integração com ferramentas como Google Analytics, Tag Manager, etc.
 */

import * as React from 'react'
import { useConsent } from '../hooks/useConsent'
import { loadScript } from './scriptLoader'
import type { ScriptIntegration } from './scriptIntegrations'

interface ConsentScriptLoaderProps {
  /** Lista de integrações de scripts para carregar baseado no consentimento */
  integrations: ScriptIntegration[]
  /** Se true, força recarregamento se consentimento mudar */
  reloadOnChange?: boolean
}

/**
 * Componente para carregamento automático de scripts baseado no consentimento.
 *
 * @example
 * ```tsx
 * const integrations = [
 *   createGoogleAnalyticsIntegration({ measurementId: 'GA_ID' }),
 *   createUserWayIntegration({ accountId: 'USERWAY_ID' })
 * ]
 *
 * <ConsentScriptLoader integrations={integrations} />
 * ```
 */
export function ConsentScriptLoader({
  integrations,
  reloadOnChange = false,
}: Readonly<ConsentScriptLoaderProps>) {
  const { preferences, consented } = useConsent()
  const loadedScripts = React.useRef<Set<string>>(new Set())

  React.useEffect(() => {
    if (!consented) return

    integrations.forEach(async (integration) => {
      const shouldLoad = preferences[integration.category]
      const alreadyLoaded = loadedScripts.current.has(integration.id)

      if (shouldLoad && (!alreadyLoaded || reloadOnChange)) {
        try {
          await loadScript(
            integration.id,
            integration.src,
            integration.category as any, // Categoria dinâmica
            integration.attrs,
          )

          // Executa função de inicialização se disponível
          if (integration.init) {
            integration.init()
          }

          loadedScripts.current.add(integration.id)
        } catch (error) {
          console.error(`❌ Failed to load script: ${integration.id}`, error)
        }
      }
    })
  }, [preferences, consented, integrations, reloadOnChange])

  // Este componente não renderiza nada
  return null
}

/**
 * Hook para carregamento manual de scripts baseado no consentimento.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const loadConsentScript = useConsentScriptLoader()
 *
 *   React.useEffect(() => {
 *     loadConsentScript({
 *       id: 'my-script',
 *       category: 'analytics',
 *       src: 'https://example.com/script.js'
 *     })
 *   }, [])
 * }
 * ```
 */
export function useConsentScriptLoader() {
  const { preferences, consented } = useConsent()

  return React.useCallback(
    async (integration: ScriptIntegration) => {
      if (!consented) {
        console.warn(
          `⚠️ Cannot load script ${integration.id}: No consent given`,
        )
        return false
      }

      const shouldLoad = preferences[integration.category]
      if (!shouldLoad) {
        console.warn(
          `⚠️ Cannot load script ${integration.id}: Category '${integration.category}' not consented`,
        )
        return false
      }

      try {
        await loadScript(
          integration.id,
          integration.src,
          integration.category as any, // Categoria dinâmica
          integration.attrs,
        )

        if (integration.init) {
          integration.init()
        }

        return true
      } catch (error) {
        console.error(`❌ Failed to load script: ${integration.id}`, error)
        return false
      }
    },
    [preferences, consented],
  )
}
