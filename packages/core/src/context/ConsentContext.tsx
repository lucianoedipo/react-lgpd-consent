/**
 * @fileoverview
 * Contexto principal do sistema de consentimento LGPD para React.
 *
 * Este arquivo implementa o contexto global que gerencia o estado de consentimento,
 * coordena componentes de UI (banner, modal, botão flutuante) e fornece integração
 * com cookies e sistema de debug/logging.
 *
 * @author Luciano Édipo
 * @since 0.1.0
 */

// src/context/ConsentContext.tsx
import * as React from 'react'
import {
  type ConsentContextValue,
  type ConsentPreferences,
  type ConsentProviderProps,
  type ConsentState,
  type ProjectCategoriesConfig,
} from '../types/types'
import type { AdvancedConsentTexts } from '../types/advancedTexts'
import { EXPANDED_DEFAULT_TEXTS, resolveTexts } from '../types/advancedTexts'
import {
  createProjectPreferences,
  ensureNecessaryAlwaysOn,
  validateProjectPreferences,
} from '../utils/categoryUtils'
import {
  DEFAULT_COOKIE_OPTS,
  buildConsentStorageKey,
  createConsentAuditEntry,
  readConsentCookie,
  removeConsentCookie,
  writeConsentCookie,
} from '../utils/cookieUtils'
import { pushConsentInitializedEvent, pushConsentUpdatedEvent } from '../utils/dataLayerEvents'
// Intentionally do not create a default theme at module scope. If consumers
// need a default theme, they can call createDefaultConsentTheme() from the utils.
import {
  _registerGlobalOpenPreferences,
  _unregisterGlobalOpenPreferences,
} from '../hooks/useConsent'
import { DEFAULT_PROJECT_CATEGORIES, useDeveloperGuidance } from '../utils/developerGuidance'
import { logger } from '../utils/logger'
import { runPeerDepsCheck } from '../utils/peerDepsCheck'
import { validateConsentProviderProps } from '../utils/validation'
import { CategoriesProvider } from './CategoriesContext'
import { DesignProvider } from './DesignContext'

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
  const enforcedPreferences = ensureNecessaryAlwaysOn(preferences)

  return {
    version: '1.0',
    consented,
    preferences: enforcedPreferences,
    consentDate: existingState?.consentDate || now,
    lastUpdate: now,
    source,
    projectConfig,
    isModalOpen,
  }
}

// 🔹 Chaves EN, valores padrão pt-BR (UI do usuário final)
const BASE_TEXTS: AdvancedConsentTexts = {
  // Textos básicos
  bannerMessage:
    'Usamos cookies necessários para o funcionamento do site e, com sua autorização, cookies opcionais para melhorar sua experiência. Você pode aceitar todos, rejeitar os opcionais ou ajustar suas preferências.',
  acceptAll: 'Aceitar todos',
  declineAll: 'Rejeitar opcionais',
  preferences: 'Preferências',
  policyLink: 'Política de privacidade',
  modalTitle: 'Preferências de cookies',
  modalIntro:
    'Cookies necessários são sempre ativos. As categorias opcionais só serão usadas com sua autorização e podem ser ativadas ou desativadas a qualquer momento.',
  save: 'Salvar preferências',
  necessaryAlwaysOn: 'Cookies necessários (sempre ativos)',

  // Textos adicionais para UI customizada
  preferencesButton: 'Gerenciar cookies',
  preferencesTitle: 'Gerenciar preferências de cookies',
  preferencesDescription:
    'Escolha quais categorias opcionais você permite. Cookies necessários permanecem sempre ativos e você pode mudar sua escolha quando quiser.',
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

const DEFAULT_TEXTS: AdvancedConsentTexts = {
  ...BASE_TEXTS,
  ...EXPANDED_DEFAULT_TEXTS,
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
    case 'SET_CATEGORY': {
      if (action.category === 'necessary') {
        logger.warn('Attempt to toggle necessary category ignored for compliance reasons.')
        return state
      }

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
    }
    case 'SET_PREFERENCES': {
      const sanitized = ensureNecessaryAlwaysOn(action.preferences)
      logger.info('Preferences saved', { preferences: sanitized })
      return createFullConsentState(true, sanitized, 'modal', action.config, false, state)
    }
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
const TextsCtx = React.createContext<AdvancedConsentTexts>(DEFAULT_TEXTS)
const HydrationCtx = React.createContext<boolean>(false)

function buildProviderError(hookName: string) {
  return new Error(
    `[react-lgpd-consent] ${hookName} deve ser usado dentro de <ConsentProvider>. ` +
      'Envolva seu componente com o provider ou use o wrapper @react-lgpd-consent/mui.',
  )
}

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
 * @param {Partial<AdvancedConsentTexts>} [props.texts] - Objeto para customizar todos os textos exibidos na UI.
 * @param {boolean} [props.blocking=false] - Se `true`, exibe um overlay que impede a interação com o site até uma decisão do usuário.
 * @param {'soft' | 'hard'} [props.blockingMode='soft'] - Intensidade do bloqueio; use `hard` para tornar o conteúdo inerte e restringir navegação por teclado.
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
  language,
  textVariant,
  designTokens,
  PreferencesModalComponent,
  preferencesModalProps = {},
  CookieBannerComponent,
  cookieBannerProps = {},
  FloatingPreferencesButtonComponent,
  floatingPreferencesButtonProps = {},
  disableFloatingPreferencesButton = false,
  blocking = false,
  blockingMode = 'soft',
  blockingStrategy = 'auto',
  hideBranding: _hideBranding = false,
  onConsentGiven,
  onPreferencesSaved,
  cookie: cookieOpts,
  storage,
  onConsentVersionChange,
  disableDeveloperGuidance,
  guidanceConfig,
  children,
  disableDiscoveryLog,
  onConsentInit,
  onConsentChange,
  onAuditLog,
}: Readonly<ConsentProviderProps>) {
  const storageDomain = storage?.domain
  const storageNamespace = storage?.namespace
  const storageVersion = storage?.version
  const mergedTexts = React.useMemo(() => ({ ...DEFAULT_TEXTS, ...(textsProp ?? {}) }), [textsProp])
  const texts = React.useMemo(
    () => resolveTexts(mergedTexts, { language, variant: textVariant }),
    [mergedTexts, language, textVariant],
  )
  const cookie = React.useMemo(() => {
    const base = { ...DEFAULT_COOKIE_OPTS, ...(cookieOpts ?? {}) }
    base.name =
      cookieOpts?.name ??
      buildConsentStorageKey({
        namespace: storageNamespace,
        version: storageVersion,
      })
    if (!base.domain && storageDomain) {
      base.domain = storageDomain
    }
    return base
  }, [cookieOpts, storageDomain, storageNamespace, storageVersion])
  const consentVersion = storageVersion?.trim() || '1'

  React.useEffect(() => {
    try {
      ;(globalThis as unknown as { __LGPD_CONSENT_COOKIE__?: string }).__LGPD_CONSENT_COOKIE__ =
        cookie.name
    } catch {
      // Ignora falhas ao atribuir em ambientes restritos
    }
  }, [cookie.name])
  // If a theme prop is provided, we explicitly apply it.
  // Otherwise we intentionally do NOT create or inject a theme provider and let the host app provide one.
  // This avoids altering the app's theme context and prevents SSR/context regressions.
  // Importante: não criar/mesclar tema aqui para não sobrescrever o tema do app hospedeiro.
  // Apenas passamos adiante o tema fornecido pelo consumidor (se houver).
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

  // Ref para controlar aviso sobre componentes UI ausentes (exibe apenas uma vez)
  const didWarnAboutMissingUI = React.useRef(false)

  // 🚨 Sistema de orientações para desenvolvedores (v0.2.3 fix)
  useDeveloperGuidance(finalCategoriesConfig, disableDeveloperGuidance, guidanceConfig)

  // 🔍 Diagnóstico de peer dependencies (v0.5.4)
  // Executa apenas uma vez no mount e apenas em desenvolvimento
  React.useEffect(() => {
    const isProd = typeof process !== 'undefined' && process.env?.NODE_ENV === 'production'
    if (!isProd && !disableDeveloperGuidance) {
      runPeerDepsCheck()
    }
  }, [disableDeveloperGuidance])

  // Logging adicional quando Modal customizado é usado (dev only)
  React.useEffect(() => {
    const isProd = typeof process !== 'undefined' && process.env?.NODE_ENV === 'production'
    if (!isProd && PreferencesModalComponent) {
      console.info(
        '[LGPD-CONSENT] Dica: seu PreferencesModal é customizado. Garanta exibir os detalhes dos cookies por categoria (nome, finalidade, duração) usando as APIs setCookieCatalogOverrides / setCookieCategoryOverrides e getCookiesInfoForCategory. Consulte QUICKSTART e INTEGRACOES.md.',
      )
    }
  }, [PreferencesModalComponent])

  React.useEffect(() => {
    const isProd = typeof process !== 'undefined' && process.env?.NODE_ENV === 'production'
    if (
      isProd ||
      globalThis.window === undefined ||
      didWarnAboutMissingUI.current ||
      PreferencesModalComponent ||
      CookieBannerComponent ||
      FloatingPreferencesButtonComponent
    ) {
      return
    }

    didWarnAboutMissingUI.current = true
    console.warn(
      '%c[@react-lgpd-consent/core] Aviso: Nenhum componente UI fornecido',
      'color: #ff9800; font-weight: bold; font-size: 14px',
      `\n\n` +
        `⚠️  O ConsentProvider do core é HEADLESS (sem interface visual).\n` +
        `    Usuários não verão banner de consentimento nem conseguirão gerenciar preferências.\n\n` +
        `📦 Componentes UI ausentes:\n` +
        `   • CookieBanner - Banner de consentimento inicial\n` +
        `   • PreferencesModal - Modal de gerenciamento de preferências\n` +
        `   • FloatingPreferencesButton - Botão para reabrir preferências\n\n` +
        `✅ Soluções:\n\n` +
        `   1️⃣  Usar pacote MUI (RECOMENDADO - componentes prontos):\n` +
        `       import { ConsentProvider } from '@react-lgpd-consent/mui'\n` +
        `       // Modal, banner e botão injetados automaticamente!\n\n` +
        `   2️⃣  Fornecer seus próprios componentes:\n` +
        `       <ConsentProvider\n` +
        `         CookieBannerComponent={YourBanner}\n` +
        `         PreferencesModalComponent={YourModal}\n` +
        `         FloatingPreferencesButtonComponent={YourButton}\n` +
        `       />\n\n` +
        `   3️⃣  Usar headless (sem UI - intencional):\n` +
        `       // Use hooks como useConsent() para criar UI customizada\n` +
        `       // Ignore este aviso se for intencional\n\n` +
        `📚 Docs: https://github.com/lucianoedipo/react-lgpd-consent#usage\n`,
    )
  }, [PreferencesModalComponent, CookieBannerComponent, FloatingPreferencesButtonComponent])

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
  const previousCookieRef = React.useRef(cookie)
  // Ref usado para evitar persistência do cookie imediatamente após detecção de mudança de versão.
  // Isso é necessário para evitar gravar um estado antigo/obsoleto antes que o reset de consentimento seja concluído.
  const skipCookiePersistRef = React.useRef(false)
  const [isHydrated, markHydrated] = React.useReducer(() => true, false)

  // Ref para rastrear estado anterior (para detectar mudanças de preferências)
  const previousPreferencesRef = React.useRef<ConsentPreferences>(state.preferences)
  const auditInitEmittedRef = React.useRef(false)
  const previousConsentedAuditRef = React.useRef(state.consented)
  const pendingCallbackTimersRef = React.useRef<Array<ReturnType<typeof setTimeout>>>([])

  React.useEffect(() => {
    return () => {
      for (const timer of pendingCallbackTimersRef.current) {
        clearTimeout(timer)
      }
      pendingCallbackTimersRef.current = []
    }
  }, [])

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
    markHydrated()
  }, [cookie.name, initialState, finalCategoriesConfig]) // Executa apenas uma vez após mount

  React.useEffect(() => {
    const previousCookie = previousCookieRef.current

    // Compara nome, domínio e path para detectar qualquer mudança relevante
    const isSameCookie =
      previousCookie.name === cookie.name &&
      previousCookie.domain === cookie.domain &&
      previousCookie.path === cookie.path

    if (isSameCookie) {
      previousCookieRef.current = cookie
      return
    }

    skipCookiePersistRef.current = true
    // Remove cookie antigo (pode ter domínio diferente)
    removeConsentCookie(previousCookie)

    const reset = () => {
      removeConsentCookie(cookie)
      dispatch({ type: 'RESET', config: finalCategoriesConfig })
    }

    reset()

    if (onConsentVersionChange) {
      onConsentVersionChange({
        previousKey: previousCookie.name,
        nextKey: cookie.name,
        resetConsent: reset,
      })
    }

    previousCookieRef.current = cookie
  }, [cookie, finalCategoriesConfig, onConsentVersionChange, dispatch])

  // Reset skipCookiePersistRef when consent is revoked.
  // This ensures that cookie persistence logic is re-enabled after consent is lost,
  // preventing accidental skipping of persistence in future consent cycles.
  function resetSkipCookiePersistOnConsentRevoked() {
    if (skipCookiePersistRef.current && !state.consented) {
      skipCookiePersistRef.current = false
    }
  }
  React.useEffect(resetSkipCookiePersistOnConsentRevoked, [state.consented])

  // Evento consent_initialized: dispara após hidratação inicial
  React.useEffect(() => {
    if (isHydrated) {
      pushConsentInitializedEvent(state.preferences)
      logger.info('DataLayer: consent_initialized event dispatched', {
        preferences: state.preferences,
      })
      if (onConsentInit) onConsentInit(state)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- state.preferences intencionalmente rastreado via isHydrated
  }, [isHydrated]) // Dispara apenas uma vez após hidratação

  React.useEffect(() => {
    if (!isHydrated) return
    if (!onAuditLog) return
    if (auditInitEmittedRef.current) return

    onAuditLog(
      createConsentAuditEntry(state, {
        action: 'init',
        storageKey: cookie.name,
        consentVersion,
      }),
    )
    auditInitEmittedRef.current = true
  }, [isHydrated, onAuditLog, state, cookie.name, consentVersion])

  // Persiste somente após decisão (consented)
  React.useEffect(() => {
    if (!state.consented) return
    if (skipCookiePersistRef.current) return
    writeConsentCookie(state, finalCategoriesConfig, cookie)
  }, [state, cookie, finalCategoriesConfig])

  React.useEffect(() => {
    if (!onAuditLog) {
      previousConsentedAuditRef.current = state.consented
      return
    }
    if (previousConsentedAuditRef.current && !state.consented) {
      onAuditLog(
        createConsentAuditEntry(state, {
          action: 'reset',
          storageKey: cookie.name,
          consentVersion,
          origin: 'reset',
        }),
      )
    }
    previousConsentedAuditRef.current = state.consented
  }, [state, onAuditLog, cookie.name, consentVersion])

  // Callbacks externos (com pequeno delay para animações)
  const prevConsented = React.useRef(state.consented)
  React.useEffect(() => {
    const shouldNotifyConsentGiven = !prevConsented.current && state.consented && onConsentGiven
    prevConsented.current = state.consented
    if (!shouldNotifyConsentGiven) return

    // Pequeno delay para permitir animações de fechamento.
    const timer = setTimeout(() => onConsentGiven(state), 150)
    return () => clearTimeout(timer)
  }, [state, onConsentGiven])

  // Evento consent_updated: dispara quando preferências mudam
  React.useEffect(() => {
    // Não disparar na hidratação inicial
    if (!isHydrated) return

    // Verificar se houve mudança real nas preferências
    const hasChanged = Object.keys(state.preferences).some(
      (key) => state.preferences[key] !== previousPreferencesRef.current[key],
    )

    if (hasChanged) {
      const origin: 'banner' | 'modal' | 'programmatic' | 'reset' =
        state.source === 'programmatic' ? 'reset' : state.source
      pushConsentUpdatedEvent(state.preferences, origin, previousPreferencesRef.current)
      logger.info('DataLayer: consent_updated event dispatched', {
        origin,
        preferences: state.preferences,
        consented: state.consented,
      })
      if (onConsentChange) {
        onConsentChange(state, { origin })
      }
      if (onAuditLog) {
        onAuditLog(
          createConsentAuditEntry(state, {
            action: 'update',
            storageKey: cookie.name,
            consentVersion,
            origin,
          }),
        )
      }
      previousPreferencesRef.current = state.preferences
    }
  }, [
    state,
    state.preferences,
    state.consented,
    state.source,
    isHydrated,
    onConsentChange,
    onAuditLog,
    cookie.name,
    consentVersion,
  ])

  const api = React.useMemo<ConsentContextValue>(() => {
    const acceptAll = () => dispatch({ type: 'ACCEPT_ALL', config: finalCategoriesConfig })
    const rejectAll = () => dispatch({ type: 'REJECT_ALL', config: finalCategoriesConfig })
    const setPreference = (category: string, value: boolean) => {
      if (category === 'necessary') {
        logger.warn('setPreference: attempt to toggle necessary category ignored.')
        return
      }
      dispatch({ type: 'SET_CATEGORY', category, value })
    }
    const setPreferences = (preferences: ConsentPreferences) => {
      const sanitized = ensureNecessaryAlwaysOn(preferences)
      dispatch({
        type: 'SET_PREFERENCES',
        preferences: sanitized,
        config: finalCategoriesConfig,
      })
      if (onPreferencesSaved) {
        const timer = setTimeout(() => {
          onPreferencesSaved(sanitized)
          pendingCallbackTimersRef.current = pendingCallbackTimersRef.current.filter(
            (pendingTimer) => pendingTimer !== timer,
          )
        }, 150)
        pendingCallbackTimersRef.current.push(timer)
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

  const cookieBannerPropsWithDefaults = React.useMemo(() => {
    const incoming: Record<string, unknown> = cookieBannerProps ?? {}

    return {
      ...incoming,
      blocking: incoming.blocking === undefined ? blocking : Boolean(incoming.blocking),
      hideBranding:
        incoming.hideBranding === undefined ? _hideBranding : Boolean(incoming.hideBranding),
    }
  }, [cookieBannerProps, blocking, _hideBranding])

  const hardBlockingActive = blocking && isHydrated && !state.consented && blockingMode === 'hard'

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
                <div
                  data-testid="lgpd-app-content"
                  aria-hidden={hardBlockingActive ? true : undefined}
                  inert={hardBlockingActive}
                  style={{ display: 'contents' }}
                >
                  {children}
                </div>
                {/* Modal de preferências - renderizado apenas quando fornecido */}
                {PreferencesModalComponent ? (
                  <PreferencesModalComponent
                    preferences={api.preferences}
                    setPreferences={api.setPreferences}
                    closePreferences={api.closePreferences}
                    isModalOpen={api.isModalOpen}
                    texts={texts}
                    {...preferencesModalProps}
                  />
                ) : null}

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
                {!state.consented && isHydrated && CookieBannerComponent && (
                  <CookieBannerComponent
                    consented={api.consented}
                    acceptAll={api.acceptAll}
                    rejectAll={api.rejectAll}
                    openPreferences={api.openPreferences}
                    texts={texts}
                    {...cookieBannerPropsWithDefaults}
                  />
                )}

                {/* Floating Preferences Button - renderizado se houver consentimento e não estiver desabilitado */}
                {state.consented &&
                  !disableFloatingPreferencesButton &&
                  FloatingPreferencesButtonComponent && (
                    <FloatingPreferencesButtonComponent
                      openPreferences={api.openPreferences}
                      consented={api.consented}
                      {...floatingPreferencesButtonProps}
                    />
                  )}
              </CategoriesProvider>
            </DesignProvider>
          </HydrationCtx.Provider>
        </TextsCtx.Provider>
      </ActionsCtx.Provider>
    </StateCtx.Provider>
  )

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
  if (!ctx) throw buildProviderError('useConsentState')
  return ctx
}
/**
 * @hook
 * @category Context
 * @since 0.1.0
 */
export function useConsentActionsInternal() {
  const ctx = React.useContext(ActionsCtx)
  if (!ctx) throw buildProviderError('useConsentActions')
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
