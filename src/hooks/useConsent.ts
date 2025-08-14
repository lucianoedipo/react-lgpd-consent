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
 * @remarks
 * Este é o hook mais importante para interagir com a biblioteca. Ele provê acesso ao estado atual do consentimento
 * e às funções para modificar esse estado.
 *
 * @returns {ConsentContextValue} Um objeto contendo o estado e as ações de consentimento.
 *
 * @example
 * ```tsx
 * const { consented, preferences, acceptAll, rejectAll } = useConsent();
 *
 * if (!consented) {
 *   return <p>Aguardando consentimento...</p>;
 * }
 * ```
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
 * Hook para acessar os textos customizados definidos na prop `texts` do `ConsentProvider`.
 *
 * @returns {ConsentTexts} O objeto com os textos da UI.
 *
 * @example
 * ```tsx
 * const texts = useConsentTexts();
 * return <button>{texts.acceptAll}</button>;
 * ```
 */
export function useConsentTexts(): ConsentTexts {
  return useConsentTextsInternal()
}

/**
 * Hook para verificar se a hidratação do estado a partir do cookie foi concluída.
 *
 * @remarks
 * Em aplicações com Server-Side Rendering (SSR), o estado inicial é `false`. Este hook permite
 * saber quando a biblioteca já leu o cookie e atualizou o estado, evitando o "flash" do banner.
 *
 * @returns {boolean} `true` se a hidratação do cookie já ocorreu, `false` caso contrário.
 */
export function useConsentHydration(): boolean {
  return useConsentHydrationInternal()
}

/**
 * Hook que retorna uma função para abrir o modal de preferências de forma programática.
 *
 * @returns {() => void} Uma função que, quando chamada, abre o modal de preferências.
 *
 * @example
 * ```tsx
 * function MeuFooter() {
 *   const abrirModal = useOpenPreferencesModal();
 *
 *   return (
 *     <footer>
 *       <a href="#" onClick={abrirModal}>
 *         Configurações de Cookies
 *       </a>
 *     </footer>
 *   );
 * }
 * ```
 */
export function useOpenPreferencesModal() {
  const { openPreferences } = useConsent()
  return openPreferences
}

/**
 * Função utilitária para abrir o modal de preferências de fora de um componente React.
 *
 * @remarks
 * Útil para ser chamada por scripts vanilla JS ou código legado que não tem acesso ao contexto React.
 * O `ConsentProvider` precisa estar renderizado na árvore para que esta função tenha efeito.
 *
 * @example
 * ```javascript
 * // Em um arquivo .js separado
 * import { openPreferencesModal } from 'react-lgpd-consent';
 *
 * const botaoExterno = document.getElementById('cookie-settings-button');
 * botaoExterno.addEventListener('click', () => {
 *   openPreferencesModal();
 * });
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
