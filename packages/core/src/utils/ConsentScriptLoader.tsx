/**
 * Componente que carrega scripts automaticamente baseado no consentimento.
 * Facilita integração com ferramentas como Google Analytics, Tag Manager, etc.
 */

import * as React from 'react'
import { useCategories } from '../context/CategoriesContext'
import { useConsent, useConsentHydration } from '../hooks/useConsent'
import type { ConsentPreferences } from '../types/types'
import {
  autoConfigureCategories,
  validateIntegrationCategories,
  validateNecessaryClassification,
} from './autoConfigureCategories'
import { logger } from './logger'
import type { ScriptIntegration } from './scriptIntegrations'
import { loadScript } from './scriptLoader'

type ScriptStatus = 'pending' | 'running' | 'executed'

export interface RegisteredScript {
  id: string
  category: string
  execute: () => void | Promise<void>
  priority?: number
  allowReload?: boolean
  onConsentUpdate?: (consent: { consented: boolean; preferences: ConsentPreferences }) => void
}

type InternalScript = RegisteredScript & {
  status: ScriptStatus
  lastAllowed: boolean
  registeredAt: number
  token: number
}

type QueueListener = () => void

const scriptRegistry = new Map<string, InternalScript>()
const queueListeners = new Set<QueueListener>()

function notifyQueue() {
  queueListeners.forEach((listener) => {
    try {
      listener()
    } catch {
      // ignore listener errors to avoid breaking queue
    }
  })
}

function subscribeQueue(listener: QueueListener) {
  queueListeners.add(listener)
  return () => {
    queueListeners.delete(listener)
  }
}

function createInternalScript(def: RegisteredScript): InternalScript {
  return {
    ...def,
    status: 'pending',
    lastAllowed: false,
    registeredAt: Date.now(),
    token: Date.now() + Math.random(),
    priority: def.priority ?? 0,
    allowReload: def.allowReload ?? false,
    onConsentUpdate: def.onConsentUpdate,
  }
}

/**
 * Registra um script (inline ou externo) na fila controlada por consentimento.
 *
 * @remarks
 * - Scripts `necessary` rodam imediatamente; demais aguardam consentimento da categoria.
 * - Fluxo de estados: `pending` → `running` → `executed` (respeitando `allowReload` e `onConsentUpdate`).
 * - A fila é ordenada por categoria, `priority` (maior primeiro) e ordem de registro.
 * - `allowReload` permite reexecutar scripts quando o usuário muda preferências.
 * - Use `onConsentUpdate` para reenviar sinais (ex.: Consent Mode) após novas decisões.
 * - Sempre chame o cleanup retornado em efeitos React para evitar múltiplos registros do mesmo `id`.
 *
 * @param def Definição do script a ser registrado.
 * @returns Função de cleanup para remover o script da fila.
 */
export function registerScript(def: RegisteredScript): () => void {
  const entry = createInternalScript(def)
  scriptRegistry.set(def.id, entry)
  notifyQueue()

  return () => {
    const current = scriptRegistry.get(def.id)
    if (current && current.token === entry.token) {
      scriptRegistry.delete(def.id)
      notifyQueue()
    }
  }
}

/** @internal - usado apenas em testes para limpar a fila */
export function __resetScriptRegistryForTests() {
  scriptRegistry.clear()
}

function getExecutableScripts(consent: {
  consented: boolean
  preferences: ConsentPreferences
}): InternalScript[] {
  const allowedScripts: InternalScript[] = []

  scriptRegistry.forEach((script) => {
    const categoryAllowed =
      script.category === 'necessary' ||
      (consent.consented && Boolean(consent.preferences?.[script.category]))

    if (!categoryAllowed) {
      script.lastAllowed = false
      return
    }

    if (script.status === 'running') return
    if (script.status === 'executed' && !script.allowReload) return
    if (script.status === 'executed' && script.allowReload && script.lastAllowed) return

    script.lastAllowed = true
    allowedScripts.push(script)
  })

  return allowedScripts.sort((a, b) => {
    if (a.category === 'necessary' && b.category !== 'necessary') return -1
    if (b.category === 'necessary' && a.category !== 'necessary') return 1
    if (a.category !== b.category) return a.category.localeCompare(b.category)
    if (a.priority !== b.priority) return (b.priority ?? 0) - (a.priority ?? 0)
    return a.registeredAt - b.registeredAt
  })
}

async function processQueue(
  consent: { consented: boolean; preferences: ConsentPreferences },
  devLogging: boolean,
) {
  const scripts = getExecutableScripts(consent)
  let order = 0

  for (const script of scripts) {
    order += 1
    script.status = 'running'
    if (devLogging) {
      logger.info('[ConsentScriptLoader] executando script', {
        id: script.id,
        category: script.category,
        priority: script.priority ?? 0,
        order,
      })
    }

    try {
      await Promise.resolve(script.execute())
    } catch (error) {
      logger.error(`❌ Failed to execute script ${script.id}`, error)
    } finally {
      script.status = 'executed'
      if (script.onConsentUpdate) {
        script.onConsentUpdate(consent)
      }
    }
  }
}

/**
 * Props do ConsentScriptLoader.
 *
 * @category Types
 * @since 0.2.0
 *
 * @example
 * ```tsx
 * <ConsentScriptLoader
 *   integrations={[COMMON_INTEGRATIONS.googleTagManager({ containerId: 'GTM-XXXX' })]}
 *   reloadOnChange
 * />
 * ```
 */
export interface ConsentScriptLoaderProps {
  /** Lista de integrações de scripts para carregar baseado no consentimento */
  integrations: ScriptIntegration[]
  /** Se true, força recarregamento se consentimento mudar */
  reloadOnChange?: boolean
  /** Nonce CSP aplicado às tags <script> geradas automaticamente (sobrescrevível por integração). */
  nonce?: string
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
 *
 * @example
 * ```tsx
 * <ConsentScriptLoader
 *   integrations={[COMMON_INTEGRATIONS.googleTagManager({ containerId: 'GTM-XXXX' })]}
 *   nonce="csp-nonce"
 * />
 * ```
 */
export function ConsentScriptLoader({
  integrations,
  reloadOnChange = false,
  nonce,
}: Readonly<ConsentScriptLoaderProps>) {
  const { preferences, consented } = useConsent()
  const isHydrated = useConsentHydration()
  const categories = useCategories()
  const [queueVersion, bumpQueueVersion] = React.useState(0)

  React.useEffect(() => {
    const unsubscribe = subscribeQueue(() => bumpQueueVersion((v) => v + 1))
    return unsubscribe
  }, [])

  // Registrar integrações usadas (para catálogo de cookies e guidance)
  React.useEffect(() => {
    try {
      const ids = (integrations || []).map((i) => i.id)
      const gt = globalThis as unknown as { __LGPD_USED_INTEGRATIONS__?: string[] }
      const current = Array.isArray(gt.__LGPD_USED_INTEGRATIONS__)
        ? gt.__LGPD_USED_INTEGRATIONS__
        : []
      const merged = Array.from(new Set([...current, ...ids]))
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
      const merged = Array.from(new Set([...current, ...required]))
      gt.__LGPD_REQUIRED_CATEGORIES__ = merged
      if (
        globalThis.window !== undefined &&
        typeof globalThis.window.dispatchEvent === 'function'
      ) {
        globalThis.window.dispatchEvent(new CustomEvent('lgpd:requiredCategories'))
      }
    } catch {
      // Ignora erros de globalThis em ambientes sem suporte
    }
  }, [integrations])

  // Validação inteligente das categorias em modo DEV
  React.useEffect(() => {
    const isDev = process.env.NODE_ENV !== 'production'
    if (!isDev || integrations.length === 0) return

    // Usar apenas categorias HABILITADAS, não todas as definidas
    const enabledCategories = categories.config.enabledCategories ?? []
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

  // Previne reexecução de integrações quando apenas a referência do array muda
  // Usa hash estrutural para detectar mudanças reais de configuração
  const processedIntegrationsRef = React.useRef<Map<string, string>>(new Map())

  React.useEffect(() => {
    const cleanups: Array<() => void> = []
    const currentIds = new Set<string>()

    integrations.forEach((integration) => {
      currentIds.add(integration.id)

      // Criar hash estrutural da integração para detectar mudanças reais
      const structuralHash = JSON.stringify({
        category: integration.category,
        src: integration.src,
        priority: integration.priority,
        hasBootstrap: Boolean(integration.bootstrap),
        hasInit: Boolean(integration.init),
        hasOnConsentUpdate: Boolean(integration.onConsentUpdate),
      })

      const existingHash = processedIntegrationsRef.current.get(integration.id)

      // Se já está registrado E não mudou estruturalmente, pular registro
      // Isso permite primeiro registro mas previne re-registro em renders subsequentes
      if (existingHash === structuralHash && scriptRegistry.has(integration.id)) {
        return
      }

      // Atualizar hash processado
      processedIntegrationsRef.current.set(integration.id, structuralHash)

      if (integration.bootstrap) {
        cleanups.push(
          registerScript({
            id: `${integration.id}__bootstrap`,
            category: 'necessary',
            priority: (integration.priority ?? 0) + 1000,
            execute: integration.bootstrap,
          }),
        )
      }

      cleanups.push(
        registerScript({
          id: integration.id,
          category: integration.category,
          priority: integration.priority,
          allowReload: reloadOnChange,
          onConsentUpdate: integration.onConsentUpdate,
          execute: async () => {
            const mergedAttrs = integration.attrs ? { ...integration.attrs } : {}
            const scriptNonce = integration.nonce ?? nonce
            if (scriptNonce && !mergedAttrs.nonce) mergedAttrs.nonce = scriptNonce
            await loadScript(
              integration.id,
              integration.src,
              integration.category,
              mergedAttrs,
              scriptNonce,
              { skipConsentCheck: true },
            )
            if (integration.init) {
              integration.init()
            }
          },
        }),
      )
    })

    // Remover integrações que não estão mais presentes
    processedIntegrationsRef.current.forEach((_, id) => {
      if (!currentIds.has(id)) {
        processedIntegrationsRef.current.delete(id)
        // Limpar do registry também
        const script = scriptRegistry.get(id)
        if (script) {
          scriptRegistry.delete(id)
        }
        const bootstrapScript = scriptRegistry.get(`${id}__bootstrap`)
        if (bootstrapScript) {
          scriptRegistry.delete(`${id}__bootstrap`)
        }
      }
    })

    return () => cleanups.forEach((fn) => fn())
  }, [integrations, reloadOnChange, nonce])

  React.useEffect(() => {
    if (!isHydrated) return
    void processQueue({ consented, preferences }, process.env.NODE_ENV !== 'production')
  }, [consented, preferences, isHydrated, queueVersion])

  React.useEffect(() => {
    if (!isHydrated) return
    scriptRegistry.forEach((script) => {
      if (script.status !== 'executed') return
      if (typeof script.onConsentUpdate !== 'function') return
      script.onConsentUpdate({ consented, preferences })
    })
  }, [consented, preferences, isHydrated])

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
  const isHydrated = useConsentHydration()

  return React.useCallback(
    async (integration: ScriptIntegration, nonce?: string) => {
      if (!isHydrated) {
        logger.warn(`⚠️ Cannot load script ${integration.id}: Consent not hydrated yet`)
        return false
      }
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
        const mergedAttrs = integration.attrs ? { ...integration.attrs } : {}
        const scriptNonce = integration.nonce ?? nonce
        if (scriptNonce && !mergedAttrs.nonce) mergedAttrs.nonce = scriptNonce

        await loadScript(
          integration.id,
          integration.src,
          integration.category,
          mergedAttrs,
          scriptNonce,
          {
            consentSnapshot: { consented, preferences },
            skipConsentCheck: true,
          },
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
    [preferences, consented, isHydrated],
  )
}
