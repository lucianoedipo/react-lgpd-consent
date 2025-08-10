import {
  useConsentActionsInternal,
  useConsentStateInternal,
  useConsentTextsInternal,
} from '../context/ConsentContext'
import type { ConsentContextValue, ConsentTexts } from '../types/types'

export function useConsent(): ConsentContextValue {
  const state = useConsentStateInternal()
  const actions = useConsentActionsInternal()
  return {
    consented: state.consented,
    preferences: state.preferences,
    isModalOpen: state.isModalOpen,
    acceptAll: actions.acceptAll,
    rejectAll: actions.rejectAll,
    setPreference: actions.setPreference,
    openPreferences: actions.openPreferences,
    closePreferences: actions.closePreferences,
    resetConsent: actions.resetConsent,
  }
}

/**
 * Hook para acessar textos customizados do ConsentProvider.
 * Útil para componentes personalizados que precisam dos textos configurados.
 */
export function useConsentTexts(): ConsentTexts {
  return useConsentTextsInternal()
}
