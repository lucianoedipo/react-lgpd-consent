// src/context/ConsentContext.tsx
import * as React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import {
  type Category,
  type ConsentContextValue,
  type ConsentPreferences,
  type ConsentProviderProps,
  type ConsentState,
  type ConsentTexts,
} from '../types/types'
import {
  readConsentCookie,
  writeConsentCookie,
  removeConsentCookie,
  DEFAULT_COOKIE_OPTS,
} from '../utils/cookieUtils'
import { defaultConsentTheme } from '../utils/theme'

// Lazy load do PreferencesModal para evitar dependência circular
const PreferencesModal = React.lazy(() =>
  import('../components/PreferencesModal').then((m) => ({
    default: m.PreferencesModal,
  })),
)

// 🔹 Identificadores internos/contrato público em EN
const DEFAULT_PREFERENCES: ConsentPreferences = {
  analytics: false,
  marketing: false,
}

// 🔹 Chaves EN, valores padrão pt-BR (UI do usuário final)
const DEFAULT_TEXTS: ConsentTexts = {
  bannerMessage: 'Utilizamos cookies para melhorar sua experiência.',
  acceptAll: 'Aceitar todos',
  declineAll: 'Recusar',
  preferences: 'Preferências',
  policyLink: 'Saiba mais',
  modalTitle: 'Preferências de Cookies',
  modalIntro:
    'Ajuste as categorias de cookies. Cookies necessários são sempre utilizados para funcionalidades básicas.',
  save: 'Salvar preferências',
  necessaryAlwaysOn: 'Cookies necessários (sempre ativos)',
}

// 🔹 Actions em EN
type Action =
  | { type: 'ACCEPT_ALL' }
  | { type: 'REJECT_ALL' }
  | { type: 'SET_CATEGORY'; category: Category; value: boolean }
  | { type: 'SET_PREFERENCES'; preferences: ConsentPreferences }
  | { type: 'OPEN_MODAL' }
  | { type: 'CLOSE_MODAL' }
  | { type: 'RESET' }
  | { type: 'HYDRATE'; state: ConsentState }

function reducer(state: ConsentState, action: Action): ConsentState {
  switch (action.type) {
    case 'ACCEPT_ALL':
      return {
        consented: true,
        preferences: { analytics: true, marketing: true },
        isModalOpen: false,
      }
    case 'REJECT_ALL':
      return {
        consented: true,
        preferences: { analytics: false, marketing: false },
        isModalOpen: false,
      }
    case 'SET_CATEGORY':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          [action.category]: action.value,
        },
      }
    case 'SET_PREFERENCES':
      return {
        ...state,
        consented: true,
        preferences: action.preferences,
        isModalOpen: false,
      }
    case 'OPEN_MODAL':
      return { ...state, isModalOpen: true }
    case 'CLOSE_MODAL':
      return { ...state, isModalOpen: false, consented: true } // houve interação
    case 'RESET':
      return {
        consented: false,
        preferences: { ...DEFAULT_PREFERENCES },
        isModalOpen: false,
      }
    case 'HYDRATE':
      return { ...action.state }
    default:
      return state
  }
}

const StateCtx = React.createContext<ConsentState | null>(null)
const ActionsCtx = React.createContext<ConsentContextValue | null>(null)
const TextsCtx = React.createContext<ConsentTexts>(DEFAULT_TEXTS)
const HydrationCtx = React.createContext<boolean>(false)

export function ConsentProvider({
  initialState,
  texts: textsProp,
  theme,
  PreferencesModalComponent,
  preferencesModalProps = {},
  disableAutomaticModal = false,
  hideBranding = false,
  onConsentGiven,
  onPreferencesSaved,
  cookie: cookieOpts,
  children,
}: Readonly<ConsentProviderProps>) {
  const texts = React.useMemo(
    () => ({ ...DEFAULT_TEXTS, ...(textsProp ?? {}) }),
    [textsProp],
  )
  const cookie = React.useMemo(
    () => ({ ...DEFAULT_COOKIE_OPTS, ...(cookieOpts ?? {}) }),
    [cookieOpts],
  )
  const appliedTheme = React.useMemo(
    () => theme || defaultConsentTheme,
    [theme],
  )

  // SSR-safe boot: prioriza initialState; senão, estado padrão (cookie será lido no useEffect)
  const boot = React.useMemo<ConsentState>(() => {
    if (initialState) return { ...initialState, isModalOpen: false }
    // Em SSR, sempre começamos com estado padrão (sem consentimento)
    // O cookie será lido no useEffect para evitar problemas de hidratação
    return {
      consented: false,
      preferences: { ...DEFAULT_PREFERENCES },
      isModalOpen: false,
    }
  }, [initialState])

  const [state, dispatch] = React.useReducer(reducer, boot)
  const [isHydrated, setIsHydrated] = React.useState(false)

  // Re-sincroniza com cookie após hidratação (SSR fix) - EXECUTA IMEDIATAMENTE
  React.useEffect(() => {
    // Só executa no cliente e apenas se não houver initialState
    if (typeof window !== 'undefined' && !initialState) {
      const saved = readConsentCookie<ConsentState>(cookie.name)
      if (saved?.consented) {
        console.log('🚀 Immediate hydration: Cookie found', saved)
        dispatch({ type: 'HYDRATE', state: saved })
      }
    }
    // Marca como hidratado para permitir exibição do banner (se necessário)
    setIsHydrated(true)
  }, [cookie.name, initialState]) // Executa apenas uma vez após mount

  // Persiste somente após decisão (consented)
  React.useEffect(() => {
    if (state.consented) writeConsentCookie(state, cookie)
  }, [state, cookie])

  // Callbacks externos (com pequeno delay para animações)
  const prevConsented = React.useRef(state.consented)
  React.useEffect(() => {
    if (!prevConsented.current && state.consented && onConsentGiven) {
      // Pequeno delay para permitir animações de fechamento
      setTimeout(() => onConsentGiven(state), 150)
    }
    prevConsented.current = state.consented
  }, [state, onConsentGiven])

  const prevPrefs = React.useRef(state.preferences)
  React.useEffect(() => {
    if (
      state.consented &&
      onPreferencesSaved &&
      prevPrefs.current !== state.preferences
    ) {
      // Pequeno delay para permitir animações
      setTimeout(() => onPreferencesSaved(state.preferences), 150)
      prevPrefs.current = state.preferences
    }
  }, [state, onPreferencesSaved])

  const api = React.useMemo<ConsentContextValue>(() => {
    const acceptAll = () => dispatch({ type: 'ACCEPT_ALL' })
    const rejectAll = () => dispatch({ type: 'REJECT_ALL' })
    const setPreference = (category: Category, value: boolean) =>
      dispatch({ type: 'SET_CATEGORY', category, value })
    const setPreferences = (preferences: ConsentPreferences) =>
      dispatch({ type: 'SET_PREFERENCES', preferences })
    const openPreferences = () => dispatch({ type: 'OPEN_MODAL' })
    const closePreferences = () => dispatch({ type: 'CLOSE_MODAL' })
    const resetConsent = () => {
      removeConsentCookie(cookie)
      dispatch({ type: 'RESET' })
    }
    return {
      consented: !!state.consented,
      preferences: state.preferences,
      isModalOpen: state.isModalOpen,
      acceptAll,
      rejectAll,
      setPreference,
      setPreferences,
      openPreferences,
      closePreferences,
      resetConsent,
    }
  }, [state, cookie])

  return (
    <ThemeProvider theme={appliedTheme}>
      <StateCtx.Provider value={state}>
        <ActionsCtx.Provider value={api}>
          <TextsCtx.Provider value={texts}>
            <HydrationCtx.Provider value={isHydrated}>
              {children}
              {/* Modal de preferências - customizável ou padrão */}
              {!disableAutomaticModal && (
                <React.Suspense fallback={null}>
                  {PreferencesModalComponent ? (
                    <PreferencesModalComponent {...preferencesModalProps} />
                  ) : (
                    <PreferencesModal hideBranding={hideBranding} />
                  )}
                </React.Suspense>
              )}
            </HydrationCtx.Provider>
          </TextsCtx.Provider>
        </ActionsCtx.Provider>
      </StateCtx.Provider>
    </ThemeProvider>
  )
}

// Hooks internos (o público é `useConsent` em hooks/useConsent.ts)
export function useConsentStateInternal() {
  const ctx = React.useContext(StateCtx)
  if (!ctx)
    throw new Error('useConsentState must be used within ConsentProvider')
  return ctx
}
export function useConsentActionsInternal() {
  const ctx = React.useContext(ActionsCtx)
  if (!ctx)
    throw new Error('useConsentActions must be used within ConsentProvider')
  return ctx
}
export function useConsentTextsInternal() {
  const ctx = React.useContext(TextsCtx)
  return ctx // TextsCtx sempre tem fallback, não precisa de throw
}
export function useConsentHydrationInternal() {
  return React.useContext(HydrationCtx)
}

// Textos padrão exportáveis (se o integrador quiser referenciar)
export const defaultTexts = DEFAULT_TEXTS
