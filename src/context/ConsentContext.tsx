/**
 * @fileoverview
 * Contexto principal do sistema de consentimento LGPD/ANPD para React.
 *
 * Este arquivo implementa o contexto global que gerencia o estado de consentimento,
 * coordena componentes de UI (banner, modal, botão flutuante) e fornece integração
 * com cookies, temas Material-UI e sistema de debug/logging.
 *
 * @author Luciano Édipo
 * @since 0.1.0
 */

// src/context/ConsentContext.tsx
import { ThemeProvider } from '@mui/material/styles'
import * as React from 'react'
import {
  type ConsentContextValue,
  type ConsentPreferences,
  type ConsentProviderProps,
  type ConsentState,
  type ConsentTexts,
  type ProjectCategoriesConfig,
} from '../types/types'
import { createProjectPreferences, validateProjectPreferences } from '../utils/categoryUtils'
import {
  DEFAULT_COOKIE_OPTS,
  readConsentCookie,
  removeConsentCookie,
  writeConsentCookie,
} from '../utils/cookieUtils'
// Intentionally do not create a default theme at module scope. If consumers
// need a default theme, they can call createDefaultConsentTheme() from the utils.
import {
  _registerGlobalOpenPreferences,
  _unregisterGlobalOpenPreferences,
} from '../hooks/useConsent'
import { DEFAULT_PROJECT_CATEGORIES, useDeveloperGuidance } from '../utils/developerGuidance'
import { logger } from '../utils/logger'
import { CategoriesProvider } from './CategoriesContext'
import { DesignProvider } from './DesignContext'
import { validateConsentProviderProps } from '../utils/validation'

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
 *
 * @remarks
 * Esta função utilitária garante que um objeto `ConsentState` seja criado com
 * todos os campos necessários, aplicando defaults seguros e validações.
 * É usada internamente pelo reducer e pelos handlers de ações do usuário.
 *
 * @param consented - Se o usuário deu consentimento geral
 * @param preferences - Preferências detalhadas por categoria
 * @param source - Origem da ação ('banner' | 'modal' | 'programmatic')
 * @param projectConfig - Configuração de categorias do projeto
 * @param isModalOpen - Se o modal está aberto (padrão: false)
 * @param existingState - Estado anterior para preservar timestamps
 *
 * @returns Estado de consentimento completo e válido
 *
 * @internal
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

  // Textos adicionais para UI customizada
  preferencesButton: 'Configurar Cookies',
  preferencesTitle: 'Gerenciar Preferências de Cookies',
  preferencesDescription: 'Escolha quais tipos de cookies você permite que sejam utilizados.',
  close: 'Fechar',
  accept: 'Aceitar',
  reject: 'Rejeitar',

  // Textos ANPD expandidos (opcionais)
  brandingPoweredBy: 'fornecido por',
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
  | { type: 'SET_CATEGORY'; category: string; value: boolean }
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
  logger.consentState(action.type, state)

  switch (action.type) {
    case 'ACCEPT_ALL': {
      const prefs = createProjectPreferences(action.config, true)
      const newState = createFullConsentState(true, prefs, 'banner', action.config, false, state)
      logger.info('User accepted all cookies', {
        preferences: newState.preferences,
      })
      return newState
    }
    case 'REJECT_ALL': {
      const prefs = createProjectPreferences(action.config, false)
      const newState = createFullConsentState(true, prefs, 'banner', action.config, false, state)
      logger.info('User rejected all cookies', {
        preferences: newState.preferences,
      })
      return newState
    }
    case 'SET_CATEGORY':
      logger.debug('Category preference changed', {
        category: action.category,
        value: action.value,
      })
      return {
        ...state,
        preferences: {
          ...state.preferences,
          [action.category]: action.value,
        },
        lastUpdate: new Date().toISOString(),
      }
    case 'SET_PREFERENCES':
      logger.info('Preferences saved', { preferences: action.preferences })
      return createFullConsentState(true, action.preferences, 'modal', action.config, false, state)
    case 'OPEN_MODAL':
      return { ...state, isModalOpen: true }
    case 'CLOSE_MODAL':
      return createFullConsentState(true, state.preferences, 'modal', action.config, false, state)
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
 * @component
 * @category Context
 * @since 0.1.0
 * Provider principal da biblioteca. Envolva sua aplicação com este componente para habilitar o gerenciamento de consentimento.
 *
 * @remarks
 * Este provider gerencia o estado de consentimento, renderiza a UI (banner, modal) e fornece o contexto para todos os hooks, como o `useConsent`.
 * A configuração é feita através de props, permitindo desde um uso "zero-config" (além da prop obrigatória `categories`) até customizações avançadas.
 *
 * @param {Readonly<ConsentProviderProps>} props - As propriedades para configurar o provider.
 * @param {ProjectCategoriesConfig} props.categories - **Obrigatório**. Define as categorias de cookies que seu projeto utiliza, em conformidade com o princípio de minimização da LGPD.
 * @param {Partial<ConsentTexts>} [props.texts] - Objeto para customizar todos os textos exibidos na UI.
 * @param {boolean} [props.blocking=false] - Se `true`, exibe um overlay que impede a interação com o site até uma decisão do usuário.
 * @param {(state: ConsentState) => void} [props.onConsentGiven] - Callback executado na primeira vez que o usuário dá o consentimento.
 * @param {(prefs: ConsentPreferences) => void} [props.onPreferencesSaved] - Callback executado sempre que o usuário salva novas preferências.
 * @param {boolean} [props.disableDeveloperGuidance=false] - Desativa as mensagens de orientação no console em ambiente de desenvolvimento.
 * @param {boolean} [props.disableFloatingPreferencesButton=false] - Desabilita o botão flutuante para reabrir as preferências.
 * @param {React.ComponentType<CustomCookieBannerProps>} [props.CookieBannerComponent] - Permite substituir o componente de banner padrão por um customizado.
 * @param {React.ComponentType<CustomPreferencesModalProps>} [props.PreferencesModalComponent] - Permite substituir o modal de preferências padrão por um customizado.
 * @param {any} [props.theme] - Objeto de tema do Material-UI para estilizar os componentes padrão.
 * @param {ConsentState} [props.initialState] - Estado inicial para hidratação em SSR, evitando o "flash" do banner.
 * @param {Partial<ConsentCookieOptions>} [props.cookie] - Opções para customizar o nome, duração e outros atributos do cookie de consentimento.
 * @param {React.ReactNode} props.children - A aplicação ou parte dela que terá acesso ao contexto de consentimento.
 *
 * @example
 * ```tsx
 * // Uso básico
 * <ConsentProvider categories={{ enabledCategories: ['analytics'] }}>
 *   <MyApp />
 * </ConsentProvider>
 * ```
 *
 * @example
 * ```tsx
 * // Uso avançado com UI customizada e callbacks
 * <ConsentProvider
 *   categories={{ enabledCategories: ['analytics', 'marketing'] }}
 *   blocking={true}
 *   texts={{ bannerMessage: 'Usamos cookies!' }}
 *   onPreferencesSaved={(prefs) => console.log('Preferências salvas:', prefs)}
 *   CookieBannerComponent={MeuBannerCustomizado}
 * >
 *   <MyApp />
 * </ConsentProvider>
 * ```
 */
export function ConsentProvider({
  initialState,
  categories,
  texts: textsProp,
  theme,

  designTokens,
  PreferencesModalComponent,
  preferencesModalProps = {},
  CookieBannerComponent,
  cookieBannerProps = {},
  FloatingPreferencesButtonComponent,
  floatingPreferencesButtonProps = {},
  disableFloatingPreferencesButton = false,
  blocking = false,
  blockingStrategy = 'auto',
  hideBranding = false,
  onConsentGiven,
  onPreferencesSaved,
  cookie: cookieOpts,
  disableDeveloperGuidance,
  guidanceConfig,
  children,
  disableDiscoveryLog,
}: Readonly<ConsentProviderProps>) {
  const texts = React.useMemo(() => ({ ...DEFAULT_TEXTS, ...(textsProp ?? {}) }), [textsProp])
  const cookie = React.useMemo(
    () => ({ ...DEFAULT_COOKIE_OPTS, ...(cookieOpts ?? {}) }),
    [cookieOpts],
  )
  // If a theme prop is provided, we explicitly apply it.
  // Otherwise we intentionally do NOT create or inject a theme provider and let the host app provide one.
  // This avoids altering the app's theme context and prevents SSR/context regressions.
  // Importante: não criar/mesclar tema aqui para não sobrescrever o tema do app hospedeiro.
  // Apenas passamos adiante o tema fornecido pelo consumidor (se houver).
  const mergedTheme = theme

  // Configuração de categorias (nova API)
  const finalCategoriesConfig = React.useMemo(() => {
    // Executa validação e sanitização em modo DEV; em produção apenas aplica fallback padrão
    const isProd = typeof process !== 'undefined' && process.env?.NODE_ENV === 'production'
    if (!categories) return DEFAULT_PROJECT_CATEGORIES
    if (isProd) return categories
    const { sanitized } = validateConsentProviderProps({ categories })
    return sanitized.categories ?? categories
  }, [categories])

  // Aviso explícito em DEV quando categories não é fornecida
  React.useEffect(() => {
    const isProd = typeof process !== 'undefined' && process.env?.NODE_ENV === 'production'
    if (!isProd && !categories) {
      logger.warn(
        "Prop 'categories' não fornecida. A lib aplicará um padrão seguro, mas recomenda-se definir 'categories.enabledCategories' explicitamente para clareza e auditoria.",
      )
    }
  }, [categories])

  // 🚨 Sistema de orientações para desenvolvedores (v0.2.3 fix)
  useDeveloperGuidance(finalCategoriesConfig, disableDeveloperGuidance, guidanceConfig)
  // Logging adicional quando Modal customizado é usado (dev only)
  React.useEffect(() => {
    const isProd = typeof process !== 'undefined' && process.env?.NODE_ENV === 'production'
    if (!isProd && PreferencesModalComponent) {
      console.info(
        '[LGPD-CONSENT] Dica: seu PreferencesModal é customizado. Garanta exibir os detalhes dos cookies por categoria (nome, finalidade, duração) usando as APIs setCookieCatalogOverrides / setCookieCategoryOverrides e getCookiesInfoForCategory. Consulte QUICKSTART e INTEGRACOES.md.',
      )
    }
  }, [PreferencesModalComponent])

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

  // Hidratação imediata após mount (evita flash do banner)
  React.useEffect(() => {
    // Executa apenas se não houver initialState (para permitir controle externo)
    if (!initialState) {
      const saved = readConsentCookie(cookie.name)
      if (saved?.consented) {
        dispatch({
          type: 'HYDRATE',
          state: saved,
          config: finalCategoriesConfig,
        })
      }
    }
    // Marca como hidratado para permitir exibição do banner (se necessário)
    setIsHydrated(true)
  }, [cookie.name, initialState, finalCategoriesConfig]) // Executa apenas uma vez após mount

  // Persiste somente após decisão (consented)
  React.useEffect(() => {
    if (state.consented) writeConsentCookie(state, finalCategoriesConfig, cookie)
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

  const api = React.useMemo<ConsentContextValue>(() => {
    const acceptAll = () => dispatch({ type: 'ACCEPT_ALL', config: finalCategoriesConfig })
    const rejectAll = () => dispatch({ type: 'REJECT_ALL', config: finalCategoriesConfig })
    const setPreference = (category: string, value: boolean) =>
      dispatch({ type: 'SET_CATEGORY', category, value })
    const setPreferences = (preferences: ConsentPreferences) => {
      dispatch({
        type: 'SET_PREFERENCES',
        preferences,
        config: finalCategoriesConfig,
      })
      if (onPreferencesSaved) {
        setTimeout(() => onPreferencesSaved(preferences), 150)
      }
    }
    const openPreferences = () => dispatch({ type: 'OPEN_MODAL' })
    const closePreferences = () => dispatch({ type: 'CLOSE_MODAL', config: finalCategoriesConfig })
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
  }, [state, cookie, finalCategoriesConfig, onPreferencesSaved])

  // Registrar função global para openPreferencesModal
  React.useEffect(() => {
    _registerGlobalOpenPreferences(api.openPreferences)
    return () => _unregisterGlobalOpenPreferences()
  }, [api.openPreferences])

  // Extrai a lógica de cálculo do backdrop para uma variável memoizada
  const providerBackdropColor = React.useMemo(() => {
    const backdrop = designTokens?.layout?.backdrop
    if (backdrop === false) return 'transparent'
    if (typeof backdrop === 'string') return backdrop
    return 'rgba(0, 0, 0, 0.4)'
  }, [designTokens])

  const content = (
    <StateCtx.Provider value={state}>
      <ActionsCtx.Provider value={api}>
        <TextsCtx.Provider value={texts}>
          <HydrationCtx.Provider value={isHydrated}>
            <DesignProvider tokens={designTokens}>
              <CategoriesProvider
                config={finalCategoriesConfig}
                disableDeveloperGuidance={disableDeveloperGuidance}
                disableDiscoveryLog={disableDiscoveryLog}
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

                {/* Overlay de bloqueio no Provider (opt-in via blockingStrategy) */}
                {blocking && isHydrated && !state.consented && blockingStrategy === 'provider' && (
                  <div
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: providerBackdropColor,
                      zIndex: 1299,
                    }}
                    data-testid="lgpd-provider-overlay"
                    aria-hidden
                  />
                )}

                {/* Cookie Banner - renderizado se não houver consentimento e estiver hidratado */}
                {!state.consented &&
                  isHydrated &&
                  (CookieBannerComponent ? (
                    <CookieBannerComponent
                      consented={api.consented}
                      acceptAll={api.acceptAll}
                      rejectAll={api.rejectAll}
                      openPreferences={api.openPreferences}
                      texts={texts}
                      blocking={blocking}
                      {...cookieBannerProps}
                    />
                  ) : (
                    <CookieBanner
                      blocking={blocking}
                      hideBranding={hideBranding}
                      {...cookieBannerProps}
                    />
                  ))}

                {/* Floating Preferences Button - renderizado se houver consentimento e não estiver desabilitado */}
                {state.consented &&
                  !disableFloatingPreferencesButton &&
                  (FloatingPreferencesButtonComponent ? (
                    <FloatingPreferencesButtonComponent
                      openPreferences={api.openPreferences}
                      consented={api.consented}
                      {...floatingPreferencesButtonProps}
                    />
                  ) : (
                    // Encaminha `floatingPreferencesButtonProps` para o componente padrão
                    <FloatingPreferencesButton
                      {...((floatingPreferencesButtonProps ?? {}) as Partial<
                        React.ComponentProps<typeof FloatingPreferencesButton>
                      >)}
                    />
                  ))}
              </CategoriesProvider>
            </DesignProvider>
          </HydrationCtx.Provider>
        </TextsCtx.Provider>
      </ActionsCtx.Provider>
    </StateCtx.Provider>
  )

  if (mergedTheme) {
    return <ThemeProvider theme={mergedTheme}>{content}</ThemeProvider>
  }

  return content
}

// Hooks internos (o público é `useConsent` em hooks/useConsent.ts)
/**
 * @hook
 * @category Context
 * @since 0.1.0
 */
export function useConsentStateInternal() {
  const ctx = React.useContext(StateCtx)
  if (!ctx) throw new Error('useConsentState must be used within ConsentProvider')
  return ctx
}
/**
 * @hook
 * @category Context
 * @since 0.1.0
 */
export function useConsentActionsInternal() {
  const ctx = React.useContext(ActionsCtx)
  if (!ctx) throw new Error('useConsentActions must be used within ConsentProvider')
  return ctx
}
/**
 * @hook
 * @category Context
 * @since 0.1.0
 */
export function useConsentTextsInternal() {
  const ctx = React.useContext(TextsCtx)
  return ctx // TextsCtx sempre tem fallback, não precisa de throw
}
/**
 * @hook
 * @category Context
 * @since 0.1.0
 */
export function useConsentHydrationInternal() {
  return React.useContext(HydrationCtx)
}

// Textos padrão exportáveis (se o integrador quiser referenciar)
export const defaultTexts = DEFAULT_TEXTS
