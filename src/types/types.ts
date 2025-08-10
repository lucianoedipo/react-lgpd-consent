/**
 * Categoria de consentimento para cookies.
 * Pode ser 'analytics' ou 'marketing'.
 */
export type Category = 'analytics' | 'marketing'

/**
 * Preferências de consentimento do usuário para cada categoria.
 */
export interface ConsentPreferences {
  analytics: boolean
  marketing: boolean
}

/**
 * Estado geral do consentimento, incluindo se o usuário consentiu,
 * suas preferências e se o modal está aberto.
 */
export interface ConsentState {
  consented: boolean
  preferences: ConsentPreferences
  isModalOpen?: boolean
}

/**
 * Textos utilizados na interface de consentimento.
 */
export interface ConsentTexts {
  bannerMessage: string
  acceptAll: string
  declineAll: string
  preferences: string
  policyLink?: string
  modalTitle: string
  modalIntro: string
  save: string
  necessaryAlwaysOn: string
}

/**
 * Opções para configuração do cookie de consentimento.
 */
export interface ConsentCookieOptions {
  /** Nome do cookie. Padrão: 'cookieConsent' */
  name: string
  /** Tempo de expiração em dias. Padrão: 365 */
  maxAgeDays: number
  /** Política SameSite do cookie. */
  sameSite: 'Lax' | 'Strict'
  /** Se o cookie deve ser seguro (HTTPS). Padrão: true */
  secure: boolean
  /** Caminho do cookie. Padrão: '/' */
  path: string
}

/**
 * Propriedades aceitas pelo componente ConsentProvider.
 */
export interface ConsentProviderProps {
  /** Estado inicial do consentimento. */
  initialState?: ConsentState
  /** Textos customizados para a interface. */
  texts?: Partial<ConsentTexts>
  /** Tema customizado para os componentes MUI. */
  theme?: any // Theme do MUI (evita dependência circular)
  /** Componente customizado para modal de preferências. */
  PreferencesModalComponent?: React.ComponentType<any>
  /** Props adicionais para o modal customizado. */
  preferencesModalProps?: Record<string, any>
  /** Desabilita o modal automático (para usar componente totalmente customizado). */
  disableAutomaticModal?: boolean
  /** Callback chamado quando o consentimento é dado. */
  onConsentGiven?: (state: ConsentState) => void
  /** Callback chamado ao salvar preferências. */
  onPreferencesSaved?: (prefs: ConsentPreferences) => void
  /** Configurações customizadas do cookie. */
  cookie?: Partial<ConsentCookieOptions>
  /** Elementos filhos do provider. */
  children: React.ReactNode
}

/**
 * Valor do contexto de consentimento, incluindo estado e métodos de manipulação.
 */
export interface ConsentContextValue {
  /** Indica se o usuário consentiu. */
  consented: boolean
  /** Preferências atuais do usuário. */
  preferences: ConsentPreferences
  /** Indica se o modal de preferências está aberto. */
  isModalOpen?: boolean
  /** Aceita todas as categorias de consentimento. */
  acceptAll: () => void
  /** Rejeita todas as categorias de consentimento. */
  rejectAll: () => void
  /** Define a preferência para uma categoria específica. */
  setPreference: (cat: Category, value: boolean) => void
  /** Define múltiplas preferências de uma vez e salva. */
  setPreferences: (preferences: ConsentPreferences) => void
  /** Abre o modal de preferências. */
  openPreferences: () => void
  /** Fecha o modal de preferências. */
  closePreferences: () => void
  /** Reseta o consentimento do usuário. */
  resetConsent: () => void
}
