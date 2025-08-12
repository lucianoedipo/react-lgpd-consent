// src/context/ConsentContext.tsx
import * as React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import {
  type Category,
  type CategoryDefinition,
  type ConsentContextValue,
  type ConsentPreferences,
  type ConsentProviderProps,
  type ConsentState,
  type ConsentTexts,
  type ProjectCategoriesConfig, // eslint-disable-line no-unused-vars
} from '../types/types'
import {
  readConsentCookie,
  writeConsentCookie,
  removeConsentCookie,
  DEFAULT_COOKIE_OPTS,
} from '../utils/cookieUtils'
import { defaultConsentTheme } from '../utils/theme'
import { CategoriesProvider } from './CategoriesContext'
import { useDeveloperGuidance } from '../utils/developerGuidance'

// Lazy load do PreferencesModal para evitar dependência circular
const PreferencesModal = React.lazy(() =>
  import('../components/PreferencesModal').then((m) => ({
    default: m.PreferencesModal,
  })),
)

// 🔹 Identificadores internos/contrato público em EN
const DEFAULT_PREFERENCES: ConsentPreferences = {
  necessary: true, // Sempre ativo (essencial)
}

/**
 * Cria preferências iniciais incluindo categorias customizadas.
 */
function createInitialPreferences(
  customCategories?: CategoryDefinition[],
): ConsentPreferences {
  const prefs: ConsentPreferences = { ...DEFAULT_PREFERENCES }

  if (customCategories) {
    customCategories.forEach((category) => {
      // Categorias essenciais sempre true, não essenciais false por padrão
      prefs[category.id] = category.essential === true
    })
  }

  return prefs
}

/**
 * Cria um estado completo de consentimento com todos os campos obrigatórios.
 */
function createFullConsentState(
  consented: boolean,
  preferences: ConsentPreferences,
  source: 'banner' | 'modal' | 'programmatic',
  isModalOpen: boolean = false,
  existingState?: ConsentState,
): ConsentState {
  const now = new Date().toISOString()

  return {
    version: '1.0',
    consented,
    preferences,
    consentDate: existingState?.consentDate || now,
    lastUpdate: now,
    source,
    isModalOpen,
  }
}

// 🔹 Chaves EN, valores padrão pt-BR (UI do usuário final)
const DEFAULT_TEXTS: ConsentTexts = {
  // Textos básicos
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

  // Textos ANPD expandidos (opcionais)
  controllerInfo: undefined, // Exibido se definido
  dataTypes: undefined, // Exibido se definido
  thirdPartySharing: undefined, // Exibido se definido
  userRights: undefined, // Exibido se definido
  contactInfo: undefined, // Exibido se definido
  retentionPeriod: undefined, // Exibido se definido
  lawfulBasis: undefined, // Exibido se definido
  transferCountries: undefined, // Exibido se definido
}

// 🔹 Actions em EN
type Action =
  | { type: 'ACCEPT_ALL'; customCategories?: CategoryDefinition[] }
  | { type: 'REJECT_ALL'; customCategories?: CategoryDefinition[] }
  | { type: 'SET_CATEGORY'; category: Category; value: boolean }
  | { type: 'SET_PREFERENCES'; preferences: ConsentPreferences }
  | { type: 'OPEN_MODAL' }
  | { type: 'CLOSE_MODAL' }
  | { type: 'RESET'; customCategories?: CategoryDefinition[] }
  | { type: 'HYDRATE'; state: ConsentState }

function reducer(state: ConsentState, action: Action): ConsentState {
  switch (action.type) {
    case 'ACCEPT_ALL': {
      const prefs = createInitialPreferences(action.customCategories)
      // Aceita todas as categorias não essenciais
      Object.keys(prefs).forEach((key) => {
        prefs[key] = true
      })
      return createFullConsentState(true, prefs, 'banner', false, state)
    }
    case 'REJECT_ALL': {
      const prefs = createInitialPreferences(action.customCategories)
      // Mantém apenas as essenciais como true
      if (action.customCategories) {
        action.customCategories.forEach((category) => {
          if (category.essential) {
            prefs[category.id] = true
          }
        })
      }
      return createFullConsentState(true, prefs, 'banner', false, state)
    }
    case 'SET_CATEGORY':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          [action.category]: action.value,
        },
        lastUpdate: new Date().toISOString(),
      }
    case 'SET_PREFERENCES':
      return createFullConsentState(
        true,
        action.preferences,
        'modal',
        false,
        state,
      )
    case 'OPEN_MODAL':
      return { ...state, isModalOpen: true }
    case 'CLOSE_MODAL':
      return createFullConsentState(
        true,
        state.preferences,
        'modal',
        false,
        state,
      )
    case 'RESET': {
      return createFullConsentState(
        false,
        createInitialPreferences(action.customCategories),
        'programmatic',
        false,
      )
    }
    case 'HYDRATE':
      return { ...action.state, isModalOpen: false } // Nunca hidratar com modal aberto
    default:
      return state
  }
}

const StateCtx = React.createContext<ConsentState | null>(null)
const ActionsCtx = React.createContext<ConsentContextValue | null>(null)
const TextsCtx = React.createContext<ConsentTexts>(DEFAULT_TEXTS)
const HydrationCtx = React.createContext<boolean>(false)

/**
 * Provider principal do contexto de consentimento LGPD.
 *
 * Gerencia o estado global de consentimento de cookies, preferências do usuário,
 * textos customizáveis e integração com SSR. Permite customização do modal de preferências,
 * callbacks externos e opções de cookie.
 *
 * @param props Propriedades do ConsentProvider (ver ConsentProviderProps)
 * @returns JSX.Element
 *
 * @example
 * <ConsentProvider>
 *   <App />
 * </ConsentProvider>
 */
export function ConsentProvider({
  initialState,
  categories, // NOVO: configuração completa de categorias
  texts: textsProp,
  theme,
  customCategories, // LEGACY: compatibilidade
  scriptIntegrations, // eslint-disable-line no-unused-vars
  PreferencesModalComponent,
  preferencesModalProps = {},
  disableAutomaticModal = false,
  hideBranding = false,
  onConsentGiven,
  onPreferencesSaved,
  cookie: cookieOpts,
  disableDeveloperGuidance, // NOVO: desabilita avisos de dev
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

  // Configuração de categorias (nova API ou compatibilidade)
  const finalCategoriesConfig = React.useMemo(() => {
    if (categories) return categories
    // LEGACY: migração automática de customCategories para nova API
    if (customCategories) {
      return {
        enabledCategories: ['analytics'] as Category[], // padrão quando usando API antiga
        customCategories,
      }
    }
    return undefined // Vai usar padrão no CategoriesProvider
  }, [categories, customCategories])

  // 🚨 Sistema de orientações para desenvolvedores (v0.2.3 fix)
  useDeveloperGuidance(finalCategoriesConfig, disableDeveloperGuidance)

  // Boot state: prioriza initialState; senão, estado padrão (cookie será lido no useEffect)
  const boot = React.useMemo<ConsentState>(() => {
    if (initialState) return { ...initialState, isModalOpen: false }
    // Sempre começamos com estado padrão (sem consentimento)
    // O cookie será lido no useEffect para garantir hidratação correta
    return createFullConsentState(
      false,
      createInitialPreferences(customCategories),
      'banner',
      false,
    )
  }, [initialState, customCategories])

  const [state, dispatch] = React.useReducer(reducer, boot)
  const [isHydrated, setIsHydrated] = React.useState(false)

  // Hidratação imediata após mount (evita flash do banner)
  React.useEffect(() => {
    // Executa apenas se não houver initialState (para permitir controle externo)
    if (!initialState) {
      const saved = readConsentCookie(cookie.name)
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
    if (state.consented) writeConsentCookie(state, state.source, cookie)
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
    const acceptAll = () => dispatch({ type: 'ACCEPT_ALL', customCategories })
    const rejectAll = () => dispatch({ type: 'REJECT_ALL', customCategories })
    const setPreference = (category: Category, value: boolean) =>
      dispatch({ type: 'SET_CATEGORY', category, value })
    const setPreferences = (preferences: ConsentPreferences) =>
      dispatch({ type: 'SET_PREFERENCES', preferences })
    const openPreferences = () => dispatch({ type: 'OPEN_MODAL' })
    const closePreferences = () => dispatch({ type: 'CLOSE_MODAL' })
    const resetConsent = () => {
      removeConsentCookie(cookie)
      dispatch({ type: 'RESET', customCategories })
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
  }, [state, cookie, customCategories])

  return (
    <ThemeProvider theme={appliedTheme}>
      <StateCtx.Provider value={state}>
        <ActionsCtx.Provider value={api}>
          <TextsCtx.Provider value={texts}>
            <HydrationCtx.Provider value={isHydrated}>
              <CategoriesProvider
                config={finalCategoriesConfig}
                categories={customCategories} // LEGACY fallback
              >
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
              </CategoriesProvider>
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
