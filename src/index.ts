// Componentes
export { CookieBanner } from './components/CookieBanner'
export { PreferencesModal } from './components/PreferencesModal'

// Contexto + Hooks
export { ConsentProvider } from './context/ConsentContext'
export { useConsent, useConsentTexts } from './hooks/useConsent'

// Utils
export { ConsentGate } from './utils/ConsentGate'
export { loadScript } from './utils/scriptLoader'
export { defaultConsentTheme } from './utils/theme'

// Tipos
export type {
  Category,
  ConsentPreferences,
  ConsentState,
  ConsentTexts,
  ConsentCookieOptions,
} from './types/types'
