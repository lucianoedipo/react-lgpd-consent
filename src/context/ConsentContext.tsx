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
  type ProjectCategoriesConfig,
} from '../types/types'
import {
  readConsentCookie,
  removeConsentCookie,
  writeConsentCookie,
  DEFAULT_COOKIE_OPTS,
} from '../utils/cookieUtils'
import {
  createProjectPreferences,
  validateProjectPreferences,
} from '../utils/categoryUtils'
import { defaultConsentTheme } from '../utils/theme'
import { CategoriesProvider } from './CategoriesContext'
import { DesignProvider } from './DesignContext'
import {
  useDeveloperGuidance,
  DEFAULT_PROJECT_CATEGORIES,
} from '../utils/developerGuidance'

// Lazy load do PreferencesModal para evitar dependência circular
const PreferencesModal = React.lazy(() =>
  import('../components/PreferencesModal').then((m) => ({
    default: m.PreferencesModal,
  })),
)

import { CookieBanner } from '../components/CookieBanner'
import { FloatingPreferencesButton } from '../components/FloatingPreferencesButton'

/**
 * Cria um estado completo de consentimento com todos os campos obrigatórios.
 */
function createFullConsentState(
  consented: boolean,
  preferences: ConsentPreferences,
  source: 'banner' | 'modal' | 'programmatic',
  projectConfig: ProjectCategoriesConfig,
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
    projectConfig,
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
  | { type: 'ACCEPT_ALL'; config: ProjectCategoriesConfig }
  | { type: 'REJECT_ALL'; config: ProjectCategoriesConfig }
  | { type: 'SET_CATEGORY'; category: Category; value: boolean }
  | {
      type: 'SET_PREFERENCES'
      preferences: ConsentPreferences
      config: ProjectCategoriesConfig
    }
  | { type: 'OPEN_MODAL' }
  | { type: 'CLOSE_MODAL'; config: ProjectCategoriesConfig }
  | { type: 'RESET'; config: ProjectCategoriesConfig }
  | { type: 'HYDRATE'; state: ConsentState; config: ProjectCategoriesConfig }

function reducer(state: ConsentState, action: Action): ConsentState {
  switch (action.type) {
    case 'ACCEPT_ALL': {
      const prefs = createProjectPreferences(action.config, true)
      return createFullConsentState(
        true,
        prefs,
        'banner',
        action.config,
        false,
        state,
      )
    }
    case 'REJECT_ALL': {
      const prefs = createProjectPreferences(action.config, false)
      return createFullConsentState(
        true,
        prefs,
        'banner',
        action.config,
        false,
        state,
      )
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
        action.config,
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
        action.config,
        false,
        state,
      )
    case 'RESET': {
      return createFullConsentState(
        false,
        createProjectPreferences(action.config),
        'programmatic',
        action.config,
        false,
      )
    }
    case 'HYDRATE': {
      const validatedPreferences = validateProjectPreferences(
        action.state.preferences,
        action.config,
      )
      return {
        ...action.state,
        preferences: validatedPreferences,
        isModalOpen: false,
      } // Nunca hidratar com modal aberto
    }
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
  designTokens,
  scriptIntegrations, // eslint-disable-line no-unused-vars
  PreferencesModalComponent,
  preferencesModalProps = {},
  CookieBannerComponent,
  cookieBannerProps = {},
  FloatingPreferencesButtonComponent,
  floatingPreferencesButtonProps = {},
  disableFloatingPreferencesButton = false,
  hideBranding = false,
  onConsentGiven,
  onPreferencesSaved,
  cookie: cookieOpts,
  disableDeveloperGuidance,
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
    return DEFAULT_PROJECT_CATEGORIES // Fallback para o padrão
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
      createProjectPreferences(finalCategoriesConfig),
      'banner',
      finalCategoriesConfig,
      false,
    )
  }, [initialState, finalCategoriesConfig])

  const [state, dispatch] = React.useReducer(reducer, boot)
  const [isHydrated, setIsHydrated] = React.useState(false)

  console.log('ConsentProvider Render - state.consented:', state.consented, 'isHydrated:', isHydrated);

  // Hidratação imediata após mount (evita flash do banner)
  React.useEffect(() => {
    // Executa apenas se não houver initialState (para permitir controle externo)
    if (!initialState) {
      const saved = readConsentCookie(cookie.name)
      if (saved?.consented) {
        console.log('🚀 Immediate hydration: Cookie found', saved)
        dispatch({
          type: 'HYDRATE',
          state: saved,
          config: finalCategoriesConfig,
        })
      }
    }
    // Marca como hidratado para permitir exibição do banner (se necessário)
    setIsHydrated(true)
    console.log('useEffect hydration complete. isHydrated set to true.');
  }, [cookie.name, initialState, finalCategoriesConfig]) // Executa apenas uma vez após mount

  // Persiste somente após decisão (consented)
  React.useEffect(() => {
    if (state.consented)
      writeConsentCookie(state, state.source, finalCategoriesConfig, cookie)
  }, [state, cookie, finalCategoriesConfig])

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
    const acceptAll = () =>
      dispatch({ type: 'ACCEPT_ALL', config: finalCategoriesConfig })
    const rejectAll = () =>
      dispatch({ type: 'REJECT_ALL', config: finalCategoriesConfig })
    const setPreference = (category: Category, value: boolean) =>
      dispatch({ type: 'SET_CATEGORY', category, value })
    const setPreferences = (preferences: ConsentPreferences) =>
      dispatch({
        type: 'SET_PREFERENCES',
        preferences,
        config: finalCategoriesConfig,
      })
    const openPreferences = () => dispatch({ type: 'OPEN_MODAL' })
    const closePreferences = () =>
      dispatch({ type: 'CLOSE_MODAL', config: finalCategoriesConfig })
    const resetConsent = () => {
      removeConsentCookie(cookie)
      dispatch({ type: 'RESET', config: finalCategoriesConfig })
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
  }, [state, cookie, finalCategoriesConfig])

  return (
    <ThemeProvider theme={appliedTheme}>
      <StateCtx.Provider value={state}>
        <ActionsCtx.Provider value={api}>
          <TextsCtx.Provider value={texts}>
            <HydrationCtx.Provider value={isHydrated}>
              <DesignProvider tokens={designTokens}>
                <CategoriesProvider
                  config={finalCategoriesConfig}
                  categories={customCategories} // LEGACY fallback
                  disableDeveloperGuidance={disableDeveloperGuidance}
                >
                  {children}
                  {/* Modal de preferências - customizável ou padrão */}
                  <React.Suspense fallback={null}>
                    {PreferencesModalComponent ? (
                      <PreferencesModalComponent
                        preferences={api.preferences}
                        setPreferences={api.setPreferences}
                        closePreferences={api.closePreferences}
                        isModalOpen={api.isModalOpen}
                        texts={texts}
                        {...preferencesModalProps}
                      />
                    ) : (
                      <PreferencesModal hideBranding={hideBranding} />
                    )}
                  </React.Suspense>

                  {/* Cookie Banner - renderizado se não houver consentimento e estiver hidratado */}
                  {!state.consented && isHydrated && (
                    CookieBannerComponent ? (
                      <CookieBannerComponent
                        consented={api.consented}
                        acceptAll={api.acceptAll}
                        rejectAll={api.rejectAll}
                        openPreferences={api.openPreferences}
                        texts={texts}
                        {...cookieBannerProps}
                      />
                    ) : (
                      <CookieBanner />
                    )
                  )}

                  {/* Floating Preferences Button - renderizado se houver consentimento e não estiver desabilitado */}
                  {state.consented && !disableFloatingPreferencesButton && (
                    FloatingPreferencesButtonComponent ? (
                      <FloatingPreferencesButtonComponent
                        openPreferences={api.openPreferences}
                        consented={api.consented}
                        {...floatingPreferencesButtonProps}
                      />
                    ) : (
                      <FloatingPreferencesButton />
                    )
                  )}
                </CategoriesProvider>
              </DesignProvider>
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
