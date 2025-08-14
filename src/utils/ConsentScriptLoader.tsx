/**
 * Componente que carrega scripts automaticamente baseado no consentimento.
 * Facilita integração com ferramentas como Google Analytics, Tag Manager, etc.
 */

import * as React from 'react'
import { useConsent } from '../hooks/useConsent'
import { loadScript } from './scriptLoader'
import { logger } from './logger'
import type { ScriptIntegration } from './scriptIntegrations'

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
        logger.error(`❌ Failed to load script: ${integration.id}`, error)
        return false
      }
    },
    [preferences, consented],
  )
}
