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
 * Configuração de categorias ativas no projeto.
 * Define quais categorias fixas serão usadas (além de necessary)
 * e quais categorias customizadas serão adicionadas.
 */
export interface ProjectCategoriesConfig {
  /** Categorias padrão que serão ativadas (necessary sempre incluída automaticamente) */
  enabledCategories?: Category[]
  /** Categorias customizadas específicas do projeto */
  customCategories?: CategoryDefinition[]
}

/**
 * Preferências de consentimento do usuário.
 * Contém apenas as categorias realmente utilizadas no projeto.
 */
export interface ConsentPreferences {
  necessary: boolean // Sempre presente e true (essencial)
  [key: string]: boolean // Apenas categorias habilitadas no projeto
}

/**
 * Dados do cookie de consentimento em conformidade com LGPD/ANPD.
 * Contém apenas informações essenciais para compliance e funcionamento.
 */
export interface ConsentCookieData {
  /** Versão do esquema do cookie para migração futura */
  version: string
  /** Se o usuário já prestou consentimento */
  consented: boolean
  /** Preferências por categoria (apenas categorias ativas) */
  preferences: ConsentPreferences
  /** Timestamp ISO da primeira interação com o banner */
  consentDate: string
  /** Timestamp ISO da última modificação das preferências */
  lastUpdate: string
  /** Origem da decisão de consentimento */
  source: 'banner' | 'modal' | 'programmatic'
}

/**
 * Estado interno completo do consentimento (memória + UI).
 * Inclui dados persistidos + estado da interface.
 */
export interface ConsentState extends ConsentCookieData {
  /** Se o modal de preferências está aberto (NÃO persistido) */
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
 * Propriedades do componente ConsentProvider - configuração principal da biblioteca.
 *
 * @example Uso básico (configuração mínima):
 * ```tsx
 * <ConsentProvider
 *   categories={{ enabledCategories: ['analytics'] }}
 * >
 *   <App />
 * </ConsentProvider>
 * ```
 *
 * @example Configuração completa com textos ANPD:
 * ```tsx
 * <ConsentProvider
 *   categories={{
 *     enabledCategories: ['analytics', 'functional'],
 *     customCategories: [{
 *       id: 'governo',
 *       name: 'Cookies Governamentais',
 *       description: 'Coleta para estatísticas públicas',
 *       essential: false
 *     }]
 *   }}
 *   texts={{
 *     bannerMessage: 'Utilizamos cookies conforme LGPD...',
 *     controllerInfo: 'Controlado por: Ministério XYZ - CNPJ: 00.000.000/0001-00',
 *     dataTypes: 'Coletamos: dados de navegação para análise estatística',
 *     userRights: 'Direitos: acessar, corrigir, excluir dados',
 *     contactInfo: 'DPO: dpo@ministerio.gov.br'
 *   }}
 *   onConsentGiven={(state) => console.log('Consentimento:', state)}
 * >
 *   <App />
 * </ConsentProvider>
 * ```
 */
export interface ConsentProviderProps {
  /**
   * Estado inicial do consentimento para hidratação SSR.
   *
   * @example
   * ```tsx
   * // Em Next.js para evitar flash do banner
   * <ConsentProvider initialState={{ consented: true, preferences: {...} }}>
   * ```
   */
  initialState?: ConsentState

  /**
   * Configuração das categorias de cookies utilizadas no projeto.
   * Define quais categorias padrão serão habilitadas e categorias customizadas.
   *
   * @example Apenas analytics:
   * ```tsx
   * categories={{ enabledCategories: ['analytics'] }}
   * ```
   *
   * @example Com categoria customizada:
   * ```tsx
   * categories={{
   *   enabledCategories: ['analytics', 'marketing'],
   *   customCategories: [{
   *     id: 'pesquisa',
   *     name: 'Cookies de Pesquisa',
   *     description: 'Coleta feedback e opinião dos usuários',
   *     essential: false
   *   }]
   * }}
   * ```
   */
  categories?: ProjectCategoriesConfig

  /**
   * Textos customizados da interface (banner e modal).
   * Todos os campos são opcionais - valores não fornecidos usam o padrão em português.
   *
   * @example Textos básicos:
   * ```tsx
   * texts={{
   *   bannerMessage: 'We use cookies...',
   *   acceptAll: 'Accept All',
   *   declineAll: 'Reject'
   * }}
   * ```
   *
   * @example Textos ANPD para compliance:
   * ```tsx
   * texts={{
   *   controllerInfo: 'Controlado por: Empresa XYZ - CNPJ: 12.345.678/0001-90',
   *   dataTypes: 'Coletamos: endereço IP, preferências de navegação',
   *   userRights: 'Você pode solicitar acesso, correção ou exclusão dos dados'
   * }}
   * ```
   */
  texts?: Partial<ConsentTexts>

  /**
   * Tema customizado Material-UI aplicado aos componentes.
   * Aceita qualquer objeto que será passado para ThemeProvider.
   *
   * @example
   * ```tsx
   * theme={{
   *   palette: { primary: { main: '#1976d2' } },
   *   components: { MuiButton: { styleOverrides: { root: { borderRadius: 8 } } } }
   * }}
   * ```
   */
  theme?: any

  /**
   * @deprecated Usar `categories.customCategories` em vez disso.
   * Mantido para compatibilidade com v0.1.x
   */
  customCategories?: CategoryDefinition[]

  /**
   * Integrações nativas de scripts terceiros (Google Analytics, etc.).
   * Scripts são carregados automaticamente baseado no consentimento.
   *
   * @example
   * ```tsx
   * import { createGoogleAnalyticsIntegration } from 'react-lgpd-consent'
   *
   * scriptIntegrations={[
   *   createGoogleAnalyticsIntegration('GA_MEASUREMENT_ID')
   * ]}
   * ```
   */
  scriptIntegrations?: import('../utils/scriptIntegrations').ScriptIntegration[]

  /**
   * Componente customizado para substituir o modal padrão de preferências.
   * Deve implementar a lógica de consentimento usando os hooks da biblioteca.
   */
  PreferencesModalComponent?: React.ComponentType<any>

  /** Props adicionais passadas para o modal customizado. */
  preferencesModalProps?: Record<string, any>

  /**
   * Desabilita o modal automático de preferências.
   * Útil quando se quer controle total sobre quando/como exibir as opções.
   */
  disableAutomaticModal?: boolean

  /**
   * Comportamento do banner de consentimento:
   * - `false` (padrão): Banner não-intrusivo, usuário pode navegar livremente
   * - `true`: Banner bloqueia interação até decisão (compliance rigorosa)
   */
  blocking?: boolean

  /** Oculta o branding "fornecido por LÉdipO.eti.br" dos componentes. */
  hideBranding?: boolean

  /**
   * Callback executado quando usuário dá consentimento pela primeira vez.
   * Útil para inicializar analytics, registrar evento, etc.
   *
   * @example
   * ```tsx
   * onConsentGiven={(state) => {
   *   console.log('Consentimento registrado:', state)
   *   // Inicializar Google Analytics, etc.
   * }}
   * ```
   */
  onConsentGiven?: (state: ConsentState) => void

  /**
   * Callback executado quando usuário modifica preferências.
   * Executado após salvar as mudanças.
   *
   * @example
   * ```tsx
   * onPreferencesSaved={(prefs) => {
   *   console.log('Novas preferências:', prefs)
   *   // Reconfigurar scripts baseado nas preferências
   * }}
   * ```
   */
  onPreferencesSaved?: (prefs: ConsentPreferences) => void

  /**
   * Configurações do cookie de consentimento.
   * Valores não fornecidos usam padrões seguros para LGPD.
   *
   * @example
   * ```tsx
   * cookie={{
   *   name: 'meuAppConsent',
   *   maxAgeDays: 180,
   *   sameSite: 'Strict'
   * }}
   * ```
   */
  cookie?: Partial<ConsentCookieOptions>

  /** Elementos filhos - toda a aplicação que precisa de contexto de consentimento. */
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
