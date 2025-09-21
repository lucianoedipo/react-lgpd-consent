//📦 Exportações principais do sistema LGPD v0.3.1
export {
  ConsentGate,
  ConsentScriptLoader,
  LGPDConsentProvider,
  useCategories,
  useCategoryStatus,
  useLGPDConsent,
  useOpenPreferencesModal,
} from "./LGPDWithLibrary"

// Componentes utilitários
export {
  ConditionalAnalytics,
  ConditionalClarity,
  ConditionalVLibras,
  loadScript,
  useConditionalScripts,
} from "./ConditionalScriptsSimple"

// Debug (apenas para desenvolvimento)
export { LGPDDebugPanel } from "./LGPDDebugPanel"

// Configuração centralizada
export { LGPDConfig } from "./LGPDConfig"
export type { LGPDConfigType } from "./LGPDConfig"

// Componentes legados (manter por compatibilidade se necessário)
export { CookieCategory } from "./CookieCategory"
export { LGPDConsentBanner } from "./LGPDConsentBanner"
export { LGPDPreferencesModal } from "./LGPDPreferencesModal"
