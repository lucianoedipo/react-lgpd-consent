/* eslint-disable no-unused-vars */
/**
 * Tipos de categorias padrão de consentimento para cookies, conforme definido pela ANPD.
 *
 * @remarks
 * Use este tipo para identificar as categorias principais de cookies suportadas nativamente pela biblioteca.
 * - `'necessary'`: Cookies essenciais para funcionamento do site (sempre ativos).
 * - `'analytics'`: Cookies para análise e estatísticas de uso.
 * - `'functional'`: Cookies para funcionalidades extras e preferências do usuário.
 * - `'marketing'`: Cookies para publicidade e marketing direcionado.
 * - `'social'`: Cookies para integração com redes sociais.
 * - `'personalization'`: Cookies para personalização de conteúdo e experiência.
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
  /** Snapshot da configuração de categorias usada para este consentimento */
  projectConfig?: ProjectCategoriesConfig
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

  // Textos adicionais para UI customizada
  preferencesButton?: string // Texto alternativo para botão de preferências
  preferencesTitle?: string // Título alternativo do modal
  preferencesDescription?: string // Descrição do modal
  close?: string // Texto do botão fechar
  accept?: string // Texto alternativo aceitar
  reject?: string // Texto alternativo rejeitar

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
 * Tokens de design para customização visual avançada dos componentes.
 * Permite um controle mais direto sobre a aparência sem a necessidade de `sx` props complexas.
 */
export interface DesignTokens {
  colors?: {
    background?: string
    text?: string
    primary?: string
    secondary?: string
  }
  typography?: {
    fontFamily?: string
    fontSize?: {
      banner?: string
      modal?: string
    }
    fontWeight?: {
      normal?: number
      bold?: number
    }
  }
  spacing?: {
    padding?: {
      banner?: string | number
      modal?: string | number
    }
    borderRadius?: {
      banner?: string | number
      modal?: string | number
    }
  }
  layout?: {
    position?: 'bottom' | 'top' | 'floating'
    width?: {
      mobile?: string
      desktop?: string
    }
    backdrop?: boolean
  }
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
   * Define quais categorias padrão serão habilitadas.
   *
   * @example Apenas analytics:
   * ```tsx
   * categories={{ enabledCategories: ['analytics'] }}
   * ```
   *
   * @example Com categoria padrão apenas:
   * ```tsx
   * categories={{ enabledCategories: ['analytics', 'marketing'] }}
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
   * Tokens de design para customização visual avançada.
   * Oferece controle direto sobre cores, fontes, espaçamento e layout.
   *
   * @example
   * ```tsx
   * designTokens={{
   *   colors: { background: '#000', text: '#fff' },
   *   typography: { fontFamily: ''Inter', sans-serif' },
   *   spacing: { borderRadius: { banner: 0 } }
   * }}
   * ```
   */
  designTokens?: DesignTokens

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
   * Deve implementar a lógica de consentimento usando as props definidas em `CustomPreferencesModalProps`.
   */
  PreferencesModalComponent?: React.ComponentType<CustomPreferencesModalProps>

  /** Props adicionais passadas para o modal customizado. */
  preferencesModalProps?: Record<string, any>

  /**
   * Componente customizado para substituir o banner padrão de cookies.
   * Se não fornecido, o `CookieBanner` padrão será renderizado.
   * Deve implementar a lógica de consentimento usando as props definidas em `CustomCookieBannerProps`.
   */
  CookieBannerComponent?: React.ComponentType<CustomCookieBannerProps>

  /** Props adicionais passadas para o banner customizado. */
  cookieBannerProps?: Record<string, any>

  /**
   * Componente customizado para substituir o botão flutuante de preferências.
   * Se não fornecido, o `FloatingPreferencesButton` padrão será renderizado.
   * Deve implementar a lógica de consentimento usando as props definidas em `CustomFloatingPreferencesButtonProps`.
   */
  FloatingPreferencesButtonComponent?: React.ComponentType<CustomFloatingPreferencesButtonProps>

  /** Props adicionais passadas para o botão flutuante customizado. */
  floatingPreferencesButtonProps?: Record<string, any>

  /**
   * Desabilita o botão flutuante de preferências.
   * Útil quando o usuário da lib quer ter controle total sobre o acesso às preferências.
   */
  disableFloatingPreferencesButton?: boolean

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

  /**
   * Desabilita os avisos e sugestões para desenvolvedores no console.
   * Útil para ambientes de produção ou quando os avisos não são desejados.
   * Por padrão, os avisos já são desabilitados em builds de produção.
   */
  disableDeveloperGuidance?: boolean

  /** Elementos filhos - toda a aplicação que precisa de contexto de consentimento. */
  children: React.ReactNode
}

/**
 * Props esperadas por um componente customizado de CookieBanner.
 * Fornece acesso ao estado de consentimento e ações necessárias para o banner.
 */
export interface CustomCookieBannerProps {
  consented: boolean
  acceptAll: () => void
  rejectAll: () => void
  openPreferences: () => void
  texts: ConsentTexts
}

/**
 * Props esperadas por um componente customizado de PreferencesModal.
 *
 * Fornece acesso às preferências atuais do usuário, funções para atualizar e salvar preferências,
 * fechar o modal e textos customizados da interface.
 *
 * @property preferences Preferências atuais de consentimento do usuário.
 * @property setPreferences Função para atualizar e salvar as preferências.
 * @property closePreferences Função para fechar o modal de preferências.
 * @property isModalOpen Indica se o modal está aberto (opcional).
 * @property texts Textos customizados da interface de consentimento.
 */
export interface CustomPreferencesModalProps {
  preferences: ConsentPreferences
  setPreferences: (preferences: ConsentPreferences) => void
  closePreferences: () => void
  isModalOpen?: boolean
  texts: ConsentTexts
}

/**
 * Props esperadas por um componente customizado de FloatingPreferencesButton.
 * Fornece acesso às ações de abertura do modal e ao estado de consentimento.
 */
export interface CustomFloatingPreferencesButtonProps {
  openPreferences: () => void
  consented: boolean
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
