/**
 * Categorias padrão de consentimento para cookies baseadas no Guia da ANPD.
 *
 * - necessary: Cookies essenciais (sempre ativos)
 * - analytics: Análise e estatísticas
 * - functional: Funcionalidades extras
 * - marketing: Publicidade e marketing
 * - social: Integração com redes sociais
 * - personalization: Personalização de conteúdo
 */
export type Category =
  | 'necessary'
  | 'analytics'
  | 'functional'
  | 'marketing'
  | 'social'
  | 'personalization'

/**
 * Definição detalhada de uma categoria de cookie.
 */
export interface CategoryDefinition {
  /** ID único da categoria */
  id: string
  /** Nome amigável exibido na interface */
  name: string
  /** Descrição detalhada da categoria */
  description: string
  /** Se é uma categoria essencial (não pode ser desabilitada) */
  essential?: boolean
  /** Scripts/cookies específicos desta categoria */
  cookies?: string[]
}

/**
 * Preferências de consentimento do usuário para cada categoria.
 * Baseado nas categorias do Guia da ANPD, mas extensível.
 */
export interface ConsentPreferences {
  necessary: boolean // Sempre true (essencial)
  analytics: boolean
  functional: boolean
  marketing: boolean
  social: boolean
  personalization: boolean
  [key: string]: boolean // Permite categorias customizadas
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
 *
 * @remarks
 * Esta interface define todos os textos exibidos na UI do banner e modal de consentimento.
 * Os campos opcionais permitem adequação à ANPD e customização conforme necessidade do projeto.
 *
 * @property bannerMessage - Mensagem principal exibida no banner de consentimento.
 * @property acceptAll - Texto do botão para aceitar todos os cookies.
 * @property declineAll - Texto do botão para recusar todos os cookies.
 * @property preferences - Texto do botão para abrir preferências.
 * @property policyLink - (Opcional) Link para política de privacidade.
 * @property modalTitle - Título do modal de preferências.
 * @property modalIntro - Texto introdutório do modal.
 * @property save - Texto do botão para salvar preferências.
 * @property necessaryAlwaysOn - Texto explicativo para cookies necessários.
 * @property controllerInfo - (Opcional) Informação sobre o controlador dos dados.
 * @property dataTypes - (Opcional) Tipos de dados coletados.
 * @property thirdPartySharing - (Opcional) Compartilhamento com terceiros.
 * @property userRights - (Opcional) Direitos do titular dos dados.
 * @property contactInfo - (Opcional) Informações de contato do DPO.
 */
export interface ConsentTexts {
  // Textos básicos (obrigatórios)
  bannerMessage: string
  acceptAll: string
  declineAll: string
  preferences: string
  policyLink?: string
  modalTitle: string
  modalIntro: string
  save: string
  necessaryAlwaysOn: string

  // Textos ANPD expandidos (opcionais - v0.2.0)
  controllerInfo?: string // "Controlado por [Empresa/CNPJ]"
  dataTypes?: string // "Coletamos: navegação, preferências..."
  thirdPartySharing?: string // "Compartilhamos com: Google Analytics..."
  userRights?: string // "Direitos: acesso, correção, exclusão..."
  contactInfo?: string // "Contato DPO: dpo@empresa.com"
  retentionPeriod?: string // "Prazo de armazenamento: 12 meses"
  lawfulBasis?: string // "Base legal: consentimento/interesse legítimo"
  transferCountries?: string // "Transferência para: EUA, Irlanda"
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
  /** Tema customizado para os componentes MUI. Aceita qualquer propriedade. */
  theme?: any // Theme do MUI flexível (aceita propriedades customizadas)
  /** Categorias customizadas de cookies (complementa as padrão). */
  customCategories?: CategoryDefinition[]
  /** Integrações nativas de scripts (Google Analytics, etc.). */
  scriptIntegrations?: import('../utils/scriptIntegrations').ScriptIntegration[]
  /** Componente customizado para modal de preferências. */
  PreferencesModalComponent?: React.ComponentType<any>
  /** Props adicionais para o modal customizado. */
  preferencesModalProps?: Record<string, any>
  /** Desabilita o modal automático (para usar componente totalmente customizado). */
  disableAutomaticModal?: boolean
  /** Esconde branding "fornecido por LÉdipO.eti.br". */
  hideBranding?: boolean
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
