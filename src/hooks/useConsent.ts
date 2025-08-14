import {
  useConsentActionsInternal,
  useConsentStateInternal,
  useConsentTextsInternal,
  useConsentHydrationInternal,
} from '../context/ConsentContext'
import { logger } from '../utils/logger'
import type { ConsentContextValue, ConsentTexts } from '../types/types'

/**
 * Hook principal para acessar e manipular o estado de consentimento de cookies.
 *
 * Retorna o estado atual do consentimento, preferências do usuário e métodos para
 * aceitar, recusar, modificar ou resetar consentimentos. Ideal para integração
 * com componentes customizados ou lógica de negócio.
 *
 * @returns {ConsentContextValue} Estado e ações do consentimento.
 *
 * @example
 * const {
 *   consented,
 *   preferences,
 *   acceptAll,
 *   rejectAll,
 *   setPreference,
 *   openPreferences,
 *   closePreferences,
 *   resetConsent,
 * } = useConsent();
 */
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
    setPreferences: actions.setPreferences,
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

/**
 * Hook para verificar se a hidratação do cookie foi concluída.
 * Útil para evitar flash do banner antes de verificar cookies existentes.
 */
export function useConsentHydration(): boolean {
  return useConsentHydrationInternal()
}

/**
 * Hook para abrir o modal de preferências programaticamente.
 * Útil quando você tem controle customizado sobre como o modal é aberto.
 *
 * @returns Função para abrir o modal de preferências.
 *
 * @example
 * ```tsx
 * function CustomAccessibilityDock() {
 *   const openPreferencesModal = useOpenPreferencesModal()
 *
 *   return (
 *     <button onClick={openPreferencesModal}>
 *       ⚙️ Configurar Cookies
 *     </button>
 *   )
 * }
 * ```
 */
export function useOpenPreferencesModal() {
  const { openPreferences } = useConsent()
  return openPreferences
}

/**
 * Função utilitária para abrir o modal de preferências de fora do contexto React.
 * Útil para integração com código não-React.
 *
 * @example
 * ```javascript
 * // Em código JavaScript puro
 * import { openPreferencesModal } from 'react-lgpd-consent'
 *
 * document.getElementById('cookie-settings').addEventListener('click', () => {
 *   openPreferencesModal()
 * })
 * ```
 */
let globalOpenPreferences: (() => void) | null = null

export function openPreferencesModal() {
  if (globalOpenPreferences) {
    globalOpenPreferences()
  } else {
    logger.warn(
      'openPreferencesModal: ConsentProvider não foi inicializado ou não está disponível.',
    )
  }
}

// Função interna para registrar o handler global
export function _registerGlobalOpenPreferences(openPreferences: () => void) {
  globalOpenPreferences = openPreferences
}

// Função interna para limpar o handler global
export function _unregisterGlobalOpenPreferences() {
  globalOpenPreferences = null
}
