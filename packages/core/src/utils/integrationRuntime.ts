import type { IntegrationConsent, ScriptIntegration } from './scriptIntegrations'
import { loadScript } from './scriptLoader'

interface Runtime {
  bootstrap?: Promise<void>
  loading?: Promise<boolean>
  prepared?: ScriptIntegration
  loaded: boolean
  initialized: boolean
}

const runtimes = new Map<string, Runtime>()

function runtimeFor(integration: ScriptIntegration) {
  const key = JSON.stringify([integration.id, integration.src])
  let runtime = runtimes.get(key)
  if (!runtime) {
    runtime = { loaded: false, initialized: false }
    runtimes.set(key, runtime)
  }
  return runtime
}

export function resetIntegrationRuntime() {
  runtimes.clear()
}

export function isIntegrationAllowed(integration: ScriptIntegration, consent: IntegrationConsent) {
  return (
    integration.category === 'necessary' ||
    (consent.consented && Boolean(consent.preferences[integration.category]))
  )
}

export async function bootstrapIntegration(integration: ScriptIntegration) {
  const runtime = runtimeFor(integration)
  if (!runtime.bootstrap) {
    runtime.bootstrap = Promise.resolve()
      .then(() => integration.bootstrap?.())
      .catch((error) => {
        runtime.bootstrap = undefined
        throw error
      })
  }
  await runtime.bootstrap
}

export function syncIntegration(integration: ScriptIntegration, consent: IntegrationConsent) {
  const runtime = runtimeFor(integration)
  if (!runtime.prepared) return
  integration = runtime.prepared
  if (runtime.loaded && !runtime.initialized && isIntegrationAllowed(integration, consent)) {
    integration.init?.()
    runtime.initialized = true
  }
  integration.onConsentUpdate?.(consent)
}

/** Compartilhado pelos caminhos automático e manual; nunca inicializa com consentimento obsoleto. */
export async function executeIntegration(
  integration: ScriptIntegration,
  getConsent: () => IntegrationConsent,
  nonce?: string,
  reload = false,
) {
  const runtime = runtimeFor(integration)
  if (runtime.loading) return runtime.loading
  const execute = async () => {
    await bootstrapIntegration(integration)
    if (!isIntegrationAllowed(integration, getConsent())) return false
    if (!runtime.loaded || reload) {
      runtime.initialized = false
      runtime.prepared = integration
      integration.beforeLoad?.(getConsent())
      const attrs = { ...integration.attrs }
      const scriptNonce = integration.nonce ?? nonce
      if (scriptNonce && !attrs.nonce) attrs.nonce = scriptNonce
      await loadScript(integration.id, integration.src, integration.category, attrs, scriptNonce, {
        skipConsentCheck: true,
      })
      runtime.loaded = true
    }
    syncIntegration(integration, getConsent())
    return isIntegrationAllowed(integration, getConsent())
  }
  runtime.loading = execute()
  try {
    return await runtime.loading
  } finally {
    runtime.loading = undefined
  }
}
