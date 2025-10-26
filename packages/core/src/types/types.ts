import type { GuidanceConfig } from '../utils/developerGuidance'

/**
 * @fileoverview
 * Definições de tipos TypeScript para o sistema de consentimento LGPD/ANPD.
 *
 * Este arquivo contém todas as interfaces, tipos e estruturas de dados utilizadas
 * pela biblioteca react-lgpd-consent, incluindo definições de categorias,
 * estado de consentimento, configurações e textos da interface.
 *
 * @author Luciano Édipo
 * @since 0.1.0
 */

/**
 * Tipos de categorias padrão de consentimento para cookies, conforme definido pela ANPD.
 * @category Types
 * @since 0.2.0
 *
 * @remarks
 * Use este tipo para identificar as categorias principais de cookies suportadas nativamente pela biblioteca.
 * Cada categoria representa um tipo específico de processamento de dados:
 *
 * - `'necessary'`: Cookies essenciais para funcionamento do site (sempre ativos).
 * - `'analytics'`: Cookies para análise e estatísticas de uso.
 * - `'functional'`: Cookies para funcionalidades extras e preferências do usuário.
 * - `'marketing'`: Cookies para publicidade e marketing direcionado.
 * - `'social'`: Cookies para integração com redes sociais.
 * - `'personalization'`: Cookies para personalização de conteúdo e experiência.
 *
 * @example
 * ```typescript
 * const categories: Category[] = ['analytics', 'marketing'];
 * ```
 *
 * @public
 */
export type Category =
  | 'necessary'
  | 'analytics'
  | 'functional'
  | 'marketing'
  | 'social'
  | 'personalization'

/**
 * Definição detalhada de uma categoria de cookie para uso interno.
 * @category Types
 * @since 0.2.0
 *
 * @remarks
 * Esta interface define a estrutura completa de uma categoria de cookies,
 * incluindo metadados e configurações específicas para processamento
 * e exibição na interface do usuário.
 *
 * @example
 * ```typescript
 * // Categoria padrão da biblioteca
 * const analyticsCategory: CategoryDefinition = {
 *   id: 'analytics',
 *   name: 'Cookies Analíticos',
 *   description: 'Utilizados para análise de uso do site',
 *   essential: false,
 *   cookies: ['_ga', '_ga_*', '_gid']
 * };
 *
 * // Categoria customizada específica do projeto
 * const chatCategory: CategoryDefinition = {
 *   id: 'chat',
 *   name: 'Chat de Suporte',
 *   description: 'Widget de chat para suporte ao cliente',
 *   essential: false
 * };
 * ```
 *
 * @public
 */
export interface CategoryDefinition {
  /**
   * Identificador único da categoria.
   * @example 'analytics'
   */
  id: string

  /**
   * Nome amigável exibido na interface do usuário.
   * @example 'Cookies Analíticos'
   */
  name: string

  /**
   * Descrição detalhada da finalidade da categoria.
   * @example 'Utilizados para análise de uso e comportamento no site'
   */
  description: string

  /**
   * Indica se é uma categoria essencial que não pode ser desabilitada pelo usuário.
   * @defaultValue false
   */
  essential?: boolean

  /**
   * Lista de nomes de cookies ou padrões específicos desta categoria.
   * @example ['_ga', '_ga_*', '_gid']
   */
  cookies?: string[]

  /**
   * Metadados detalhados sobre cookies típicos desta categoria.
   * Não exaustivo; serve para orientar UI e documentação.
   */
  cookiesInfo?: CookieDescriptor[]
}

/**
 * Descritor de cookie com metadados úteis para UI/documentação.
 * @category Types
 * @since 0.2.0
 *
 * @remarks
 * Mantém compatibilidade com abordagens comuns no mercado.
 * Fornece informações detalhadas sobre cookies para exibição em interfaces
 * e documentação de compliance.
 *
 * @example
 * ```typescript
 * const cookieInfo: CookieDescriptor = {
 *   name: '_ga',
 *   purpose: 'analytics',
 *   duration: '2 years',
 *   domain: '.example.com',
 *   provider: 'Google Analytics'
 * };
 * ```
 *
 * @public
 */
export interface CookieDescriptor {
  /**
   * Identificador ou padrão do cookie.
   * @example '_ga'
   */
  name: string
  /**
   * Finalidade do cookie (opcional).
   * @example 'analytics'
   */
  purpose?: string
  /**
   * Tempo de retenção do cookie (opcional).
   * @example '2 years'
   */
  duration?: string
  /**
   * Domínio associado ao cookie (opcional).
   * @example '.example.com'
   */
  domain?: string
  /**
   * Provedor ou serviço associado ao cookie (opcional).
   * @example 'Google Analytics'
   */
  provider?: string
}

/**
 * Configuração de categorias ativas no projeto.
 * @category Types
 * @since 0.2.0
 *
 * @remarks
 * Define quais categorias fixas serão usadas (além de 'necessary' que é sempre incluída)
 * e permite extensão com categorias customizadas específicas do projeto.
 *
 * A categoria 'necessary' é sempre incluída automaticamente e não precisa ser
 * especificada em `enabledCategories`.
 *
 * @example
 * ```typescript
 * // Configuração básica
 * const config: ProjectCategoriesConfig = {
 *   enabledCategories: ['analytics', 'marketing']
 * };
 * ```
 *
 * @example
 * ```typescript
 * // Configuração com categorias customizadas
 * const config: ProjectCategoriesConfig = {
 *   enabledCategories: ['analytics'],
 *   customCategories: [
 *     {
 *       id: 'chat',
 *       name: 'Chat de Suporte',
 *       description: 'Widget de chat para suporte ao cliente'
 *     },
 *     {
 *       id: 'abTesting',
 *       name: 'A/B Testing',
 *       description: 'Experimentos de interface e funcionalidades'
 *     }
 *   ]
 * };
 * ```
 *
 * @public
 */
export interface ProjectCategoriesConfig {
  /**
   * Categorias padrão que serão ativadas.
   * A categoria 'necessary' é sempre incluída automaticamente.
   * @example ['analytics', 'marketing']
   */
  enabledCategories?: Category[]

  /**
   * Categorias customizadas específicas do projeto.
   * Permite extensão além das categorias padrão da biblioteca.
   * @example [{ id: 'chat', name: 'Chat de Suporte', description: 'Widget de chat' }]
   */
  customCategories?: CategoryDefinition[]
}

/**
 * Preferências de consentimento do usuário por categoria.
 * @category Types
 * @since 0.1.0
 *
 * @remarks
 * Contém o estado de consentimento para cada categoria ativa no projeto.
 * A categoria 'necessary' está sempre presente e definida como `true`,
 * pois cookies essenciais não podem ser desabilitados pelo usuário.
 *
 * ### Comportamento Dinâmico
 * - As chaves são determinadas pela configuração de `enabledCategories` no `ConsentProvider`
 * - Categorias não habilitadas no projeto não aparecem no objeto
 * - TypeScript infere automaticamente as chaves baseado na configuração
 * - Estado é persistido no cookie e restaurado em novas sessões
 *
 * ### Valores e Significados
 * - `true`: Usuário consentiu explicitamente para a categoria
 * - `false`: Usuário rejeitou explicitamente a categoria
 * - Ausência da chave: Categoria não está habilitada no projeto
 *
 * ### Integração com Scripts
 * - Use com `ConsentScriptLoader` para carregamento condicional
 * - Estado é automaticamente reativo - mudanças atualizam scripts
 * - Compatível com Google Analytics Enhanced Consent Mode
 * - Suporta integração com ferramentas de tag management
 *
 * @example Configuração típica
 * ```typescript
 * const preferences: ConsentPreferences = {
 *   necessary: true,    // Sempre true (cookies essenciais)
 *   analytics: false,   // Usuário rejeitou análise
 *   marketing: true     // Usuário aceitou marketing
 * };
 * ```
 *
 * @example Integração condicional com features
 * ```typescript
 * function MyComponent() {
 *   const { preferences } = useConsent();
 *
 *   return (
 *     <div>
 *       {preferences.analytics && <AnalyticsComponent />}
 *       {preferences.marketing && <PersonalizationEngine />}
 *       {preferences.functional && <ChatWidget />}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example Verificação programática de múltiplas categorias
 * ```typescript
 * function hasConsentForFeature(preferences: ConsentPreferences): boolean {
 *   // Feature requer analytics OU marketing
 *   return preferences.analytics || preferences.marketing;
 * }
 *
 * function hasFullConsent(preferences: ConsentPreferences): boolean {
 *   // Verificar se todas as categorias opcionais foram aceitas
 *   const optionalCategories = Object.keys(preferences).filter(key => key !== 'necessary');
 *   return optionalCategories.every(key => preferences[key] === true);
 * }
 * ```
 *
 * @public
 */
export interface ConsentPreferences {
  /**
   * Categoria de cookies necessários - sempre presente e verdadeira.
   * Cookies essenciais não podem ser desabilitados pelo usuário.
   */
  necessary: boolean

  /**
   * Estado de consentimento para outras categorias ativas no projeto.
   * As chaves correspondem aos IDs das categorias configuradas.
   */
  [key: string]: boolean
}

/**
 * Estrutura do cookie de consentimento em conformidade com LGPD/ANPD.
 * @category Types
 * @since 0.2.1
 *
 * @remarks
 * Esta interface define o formato do cookie persistido no navegador do usuário,
 * contendo todas as informações necessárias para compliance com a LGPD e
 * para o funcionamento correto da biblioteca.
 *
 * **Importante**: A estrutura utiliza um formato JSON simples e legível, projetado
 * para ser autoexplicativo e atender diretamente aos requisitos da LGPD para sites
 * de primeira parte (first-party contexts).
 *
 * **Não implementa IAB TCF**: Este formato **não** segue o padrão IAB Transparency
 * and Consent Framework (TCF), que é mais complexo e voltado para o ecossistema
 * de publicidade programática (ad-tech). A adoção do TCF pode ser uma evolução
 * futura da biblioteca.
 *
 * @example
 * ```typescript
 * const cookieData: ConsentCookieData = {
 *   version: '1.0',
 *   consented: true,
 *   preferences: {
 *     necessary: true,
 *     analytics: true,
 *     marketing: false
 *   },
 *   consentDate: '2024-01-15T10:30:00.000Z',
 *   lastUpdate: '2024-01-15T10:30:00.000Z',
 *   source: 'banner',
 *   projectConfig: {
 *     enabledCategories: ['analytics', 'marketing']
 *   }
 * };
 * ```
 *
 * @see {@link https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm | LGPD - Lei 13.709/2018}
 * @see {@link https://www.gov.br/anpd/pt-br/documentos-e-publicacoes/guia-orientativo-cookies-e-protecao-de-dados-pessoais.pdf | Guia de Cookies ANPD}
 *
 * @public
 */
export interface ConsentCookieData {
  /**
   * Versão do esquema do cookie para compatibilidade e migração futura.
   * @example '1.0'
   */
  version: string

  /**
   * Indica se o usuário já prestou consentimento explícito.
   * @example true
   */
  consented: boolean

  /**
   * Preferências detalhadas por categoria de cookies.
   * Contém apenas as categorias ativas no projeto.
   */
  preferences: ConsentPreferences

  /**
   * Timestamp ISO 8601 da primeira interação com o banner de consentimento.
   * @example '2024-01-15T10:30:00.000Z'
   */
  consentDate: string

  /**
   * Timestamp ISO 8601 da última modificação das preferências.
   * Atualizado sempre que o usuário muda suas preferências.
   * @example '2024-01-15T10:30:00.000Z'
   */
  lastUpdate: string

  /**
   * Origem da decisão de consentimento para auditoria.
   * - 'banner': Decisão tomada no banner principal
   * - 'modal': Decisão tomada no modal de preferências
   * - 'programmatic': Decisão tomada via API programática
   */
  source: 'banner' | 'modal' | 'programmatic'

  /**
   * Snapshot da configuração de categorias no momento do consentimento.
   * Útil para detectar mudanças na configuração e solicitar novo consentimento.
   */
  projectConfig?: ProjectCategoriesConfig
}

/**
 * Estado interno completo do sistema de consentimento.
 * @category Types
 * @since 0.1.0
 *
 * @remarks
 * Estende {@link ConsentCookieData} com informações de estado da interface
 * que não são persistidas no cookie, como o estado de abertura do modal.
 *
 * Este é o estado completo mantido em memória pelo React Context e
 * utilizado por todos os componentes da biblioteca.
 *
 * ### Dados Persistidos vs. Temporários
 * - **Persistidos**: Herdados de `ConsentCookieData` - salvos no cookie
 * - **Temporários**: `isModalOpen` - apenas em memória durante a sessão
 *
 * ### Ciclo de Vida do Estado
 * 1. **Inicialização**: Estado padrão ou lido do cookie
 * 2. **Hidratação**: Restauração do cookie no lado cliente (SSR)
 * 3. **Interação**: Usuário modifica preferências via UI
 * 4. **Persistência**: Estado é salvo no cookie automaticamente
 * 5. **Sincronização**: Componentes reagem às mudanças via Context
 *
 * ### Performance e Reatividade
 * - Estado é imutável - mudanças criam novo objeto
 * - Optimized com `useMemo` para evitar re-renders desnecessários
 * - Subscriber pattern para notificações de mudança
 * - Integração automática com React DevTools
 *
 * @example Estado típico com consentimento dado
 * ```typescript
 * const state: ConsentState = {
 *   version: '1.0',
 *   consented: true,
 *   preferences: { necessary: true, analytics: true, marketing: false },
 *   consentDate: '2024-01-15T10:30:00.000Z',
 *   lastUpdate: '2024-01-15T10:30:00.000Z',
 *   source: 'banner',
 *   projectConfig: { enabledCategories: ['analytics', 'marketing'] },
 *   isModalOpen: false  // Estado da UI não persistido
 * };
 * ```
 *
 * @example Estado inicial antes do consentimento
 * ```typescript
 * const initialState: ConsentState = {
 *   version: '1.0',
 *   consented: false,
 *   preferences: { necessary: true }, // Apenas essenciais
 *   isModalOpen: false
 *   // consentDate, lastUpdate, source serão definidos após consentimento
 * };
 * ```
 *
 * @example Uso em componente para verificação de estado
 * ```typescript
 * function ConsentAwareComponent() {
 *   const { consented, preferences, isModalOpen } = useConsent();
 *
 *   if (!consented) {
 *     return <div>Aguardando decisão do usuário sobre cookies...</div>;
 *   }
 *
 *   if (isModalOpen) {
 *     return <div>Modal de preferências está aberto</div>;
 *   }
 *
 *   return (
 *     <div>
 *       Analytics ativo: {preferences.analytics ? 'Sim' : 'Não'}
 *       Marketing ativo: {preferences.marketing ? 'Sim' : 'Não'}
 *     </div>
 *   );
 * }
 * ```
 *
 * @see {@link ConsentCookieData} - Interface base com dados persistidos
 * @see {@link useConsent} - Hook para acessar este estado
 * @see {@link ConsentProvider} - Provider que mantém este estado
 *
 * @public
 */
export interface ConsentState extends ConsentCookieData {
  /**
   * Estado de abertura do modal de preferências.
   * Esta informação não é persistida no cookie, apenas mantida em memória.
   * @defaultValue false
   */
  isModalOpen?: boolean
}

/**
 * Interface de textos personalizáveis para todos os componentes da UI de consentimento LGPD.
 * @category Types
 * @since 0.1.0
 *
 * @remarks
 * Esta interface define todos os textos exibidos na UI do banner e modal de consentimento.
 * Os campos opcionais permitem adequação completa aos requisitos da ANPD e customização
 * conforme necessidade específica do projeto. Todos os campos possuem valores padrão em português.
 *
 * A interface é dividida em três seções:
 * - **Textos básicos**: Elementos essenciais do banner e modal (obrigatórios)
 * - **Textos alternativos**: Variações para UI customizada (opcionais)
 * - **Textos ANPD expandidos**: Informações de compliance com LGPD (opcionais)
 *
 * @example Configuração básica em inglês
 * ```typescript
 * const customTexts: Partial<ConsentTexts> = {
 *   bannerMessage: 'We use cookies to enhance your experience.',
 *   acceptAll: 'Accept All',
 *   declineAll: 'Reject All',
 *   preferences: 'Preferences'
 * };
 * ```
 *
 * @example Configuração completa ANPD
 * ```typescript
 * const anpdTexts: Partial<ConsentTexts> = {
 *   controllerInfo: 'Controlado por: Empresa XYZ - CNPJ: 12.345.678/0001-90',
 *   dataTypes: 'Coletamos: endereço IP, preferências de navegação, dados de uso',
 *   userRights: 'Você pode solicitar acesso, correção ou exclusão dos seus dados',
 *   contactInfo: 'DPO: dpo@empresa.com.br | Tel: (11) 1234-5678'
 * };
 * ```
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
 * @property preferencesButton - (Opcional) Texto alternativo para botão de preferências.
 * @property preferencesTitle - (Opcional) Título alternativo do modal.
 * @property preferencesDescription - (Opcional) Descrição do modal.
 * @property close - (Opcional) Texto do botão fechar.
 * @property accept - (Opcional) Texto alternativo aceitar.
 * @property reject - (Opcional) Texto alternativo rejeitar.
 * @property brandingPoweredBy - (Opcional) Texto "fornecido por".
 * @property controllerInfo - (Opcional) Informação sobre o controlador dos dados.
 * @property dataTypes - (Opcional) Tipos de dados coletados.
 * @property thirdPartySharing - (Opcional) Compartilhamento com terceiros.
 * @property userRights - (Opcional) Direitos do titular dos dados.
 * @property contactInfo - (Opcional) Informações de contato do DPO.
 * @property retentionPeriod - (Opcional) Prazo de armazenamento dos dados.
 * @property lawfulBasis - (Opcional) Base legal para o processamento.
 * @property transferCountries - (Opcional) Países para transferência de dados.
 *
 * @see {@link ConsentProvider} - Para usar os textos personalizados
 * @see {@link useConsentTexts} - Hook para acessar textos no contexto
 *
 * @public
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
  // Textos ANPD expandidos (opcionais - v0.2.0)
  brandingPoweredBy?: string // Texto "fornecido por"
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
 * @category Types
 * @since 0.1.0
 * @public
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
 * Tipo alias para valores de espaçamento que suportam eixos x/y.
 * @category Types
 * @since 0.1.3
 * @remarks
 * Permite especificar espaçamento como string, número ou objeto com eixos x e y separados.
 * Útil para configurações de padding e margin em design tokens.
 * @example
 * ```typescript
 * const spacing: SpacingValue = { x: 10, y: 20 };
 * ```
 */
type SpacingValue = string | number | { x?: string | number; y?: string | number }

/**
 * Tipo alias para cores com variações.
 * @category Types
 * @since 0.1.3
 * @remarks
 * Suporta cor simples ou objeto com variações light, main, dark e contrastText.
 * Compatível com sistemas de design que precisam de paletas completas.
 * @example
 * ```typescript
 * const color: ColorVariant = { main: '#1976d2', dark: '#1565c0' };
 * ```
 */
type ColorVariant = string | { light?: string; main?: string; dark?: string; contrastText?: string }

/**
 * Tipo alias para altura com auto.
 * @category Types
 * @since 0.1.3
 * @remarks
 * Permite 'auto' ou qualquer string válida para altura CSS, com type safety.
 * Evita valores inválidos através de interseção com Record<never, never>.
 * @example
 * ```typescript
 * const height: HeightValue = 'auto';
 * const customHeight: HeightValue = '100px';
 * ```
 */
type HeightValue = 'auto' | (string & Record<never, never>)

/**
 * Tipo alias para configuração de backdrop.
 * @category Types
 * @since 0.1.3
 * @remarks
 * Define configuração do backdrop como booleano simples, string de cor ou objeto detalhado
 * com propriedades como enabled, color, blur e opacity para controle granular.
 * @example
 * ```typescript
 * const backdrop: BackdropConfig = { enabled: true, color: 'rgba(0,0,0,0.5)', blur: '4px' };
 * ```
 */
type BackdropConfig =
  | boolean
  | string
  | {
      enabled?: boolean
      color?: string
      blur?: string
      opacity?: number
    }

/**
 * Tokens de design para customização visual avançada dos componentes.
 *
 * Sistema robusto de design tokens que permite controle granular sobre todos os aspectos
 * visuais da biblioteca. Suporta responsive design, estados interativos, acessibilidade
 * e temas dark/light.
 *
 * @category Types
 * @since 0.1.3
 * @version 0.4.1 - Expandido substancialmente com novos tokens
 * @public
 *
 * @example Configuração básica
 * ```tsx
 * const tokens: DesignTokens = {
 *   colors: {
 *     primary: '#1976d2',
 *     background: '#ffffff',
 *     text: '#333333'
 *   }
 * }
 * ```
 *
 * @example Configuração avançada com responsive e estados
 * ```tsx
 * const advancedTokens: DesignTokens = {
 *   colors: {
 *     primary: { light: '#42a5f5', main: '#1976d2', dark: '#1565c0' },
 *     semantic: {
 *       error: '#f44336',
 *       warning: '#ff9800',
 *       success: '#4caf50',
 *       info: '#2196f3'
 *     }
 *   },
 *   spacing: {
 *     responsive: {
 *       mobile: { padding: '12px', margin: '8px' },
 *       tablet: { padding: '16px', margin: '12px' },
 *       desktop: { padding: '24px', margin: '16px' }
 *     }
 *   }
 * }
 * ```
 */
export interface DesignTokens {
  /**
   * Sistema de cores expandido com suporte a variações e semântica
   */
  colors?: {
    /** Cor primária da aplicação */
    primary?: ColorVariant
    /** Cor secundária */
    secondary?: ColorVariant
    /** Cor de fundo principal */
    background?: string | { main?: string; paper?: string; overlay?: string; default?: string }
    /** Cor do texto */
    text?: string | { primary?: string; secondary?: string; disabled?: string }

    /** Cor da borda */
    border?: ColorVariant
    /** Cores semânticas para estados */
    semantic?: {
      error?: string
      warning?: string
      success?: string
      info?: string
    }
    /** Cores específicas para componentes */
    components?: {
      banner?: {
        background?: string
        text?: string
        border?: string
        shadow?: string
      }
      modal?: {
        background?: string
        text?: string
        overlay?: string
        border?: string
      }
      button?: {
        primary?: { background?: string; text?: string; hover?: string }
        secondary?: { background?: string; text?: string; hover?: string }
        outlined?: { border?: string; text?: string; hover?: string }
      }
    }
  }

  /**
   * Sistema tipográfico completo com hierarquia e responsive
   */
  typography?: {
    /** Família de fontes principal */
    fontFamily?: string | { primary?: string; secondary?: string; monospace?: string }
    /** Tamanhos de fonte com hierarchy */
    fontSize?: {
      /** Tamanhos para banner */
      banner?: {
        title?: string
        message?: string
        button?: string
      }
      /** Tamanhos para modal */
      modal?: {
        title?: string
        body?: string
        button?: string
        caption?: string
      }
      /** Scale tipográfica */
      scale?: {
        xs?: string
        sm?: string
        base?: string
        lg?: string
        xl?: string
        '2xl'?: string
        '3xl'?: string
      }
      /** Tamanhos específicos de cabeçalhos */
      h1?: string
      h2?: string
      h3?: string
      h4?: string
      h5?: string
      h6?: string
    }
    /** Pesos de fonte */
    fontWeight?: {
      light?: number
      normal?: number
      medium?: number
      semibold?: number
      bold?: number
    }
    /** Altura de linha */
    lineHeight?: {
      tight?: number
      normal?: number
      relaxed?: number
      loose?: number
    }
    /** Espaçamento de letras */
    letterSpacing?: {
      tight?: string
      normal?: string
      wide?: string
    }
  }

  /**
   * Sistema de espaçamento e dimensões flexível
   */
  spacing?: {
    /** Valores diretos de espaçamento */
    xs?: string | number
    sm?: string | number
    md?: string | number
    lg?: string | number
    xl?: string | number
    /** Escala de espaçamento base */
    scale?: {
      xs?: string | number
      sm?: string | number
      md?: string | number
      lg?: string | number
      xl?: string | number
      '2xl'?: string | number
      '3xl'?: string | number
    }
    /** Padding específico por componente */
    padding?: {
      banner?: SpacingValue
      modal?: SpacingValue
      button?: SpacingValue
    }
    /** Margem específica por componente */
    margin?: {
      banner?: SpacingValue
      modal?: SpacingValue
      button?: SpacingValue
    }
    /** Bordas arredondadas */
    borderRadius?: {
      banner?: string | number
      modal?: string | number
      button?: string | number
      /** Scale de border radius */
      scale?: {
        none?: string | number
        sm?: string | number
        md?: string | number
        lg?: string | number
        xl?: string | number
        full?: string | number
      }
    }
    /** Configurações responsive */
    responsive?: {
      mobile?: {
        padding?: string | number
        margin?: string | number
        borderRadius?: string | number
      }
      tablet?: {
        padding?: string | number
        margin?: string | number
        borderRadius?: string | number
      }
      desktop?: {
        padding?: string | number
        margin?: string | number
        borderRadius?: string | number
      }
    }
  }

  /**
   * Configurações de layout e posicionamento
   */
  layout?: {
    /** Posição do banner */
    position?: 'bottom' | 'top' | 'floating' | 'center'
    /** Larguras por breakpoint */
    width?: {
      mobile?: string
      tablet?: string
      desktop?: string
      max?: string
    }
    /** Alturas específicas */
    height?: {
      banner?: HeightValue
      modal?: HeightValue
      button?: HeightValue
    }
    /** Configuração do backdrop */
    backdrop?: BackdropConfig
    /** Z-index para layering */
    zIndex?: {
      banner?: number
      modal?: number
      backdrop?: number
      floatingButton?: number
    }
    /** Breakpoints customizados */
    breakpoints?: {
      mobile?: string
      tablet?: string
      desktop?: string
      wide?: string
    }
    /** Border radius para componentes */
    borderRadius?:
      | string
      | number
      | {
          banner?: string | number
          modal?: string | number
          button?: string | number
          scale?: {
            none?: string | number
            sm?: string | number
            md?: string | number
            lg?: string | number
            xl?: string | number
            full?: string | number
          }
        }
  }

  /**
   * Efeitos visuais e interações
   */
  effects?: {
    /** Sombras */
    shadow?: {
      banner?: string
      modal?: string
      button?: string
      /** Scale de sombras */
      scale?: {
        none?: string
        sm?: string
        md?: string
        lg?: string
        xl?: string
      }
    }
    /** Transições e animações */
    transitions?: {
      duration?: {
        fast?: string
        normal?: string
        slow?: string
      }
      easing?: {
        linear?: string
        easeIn?: string
        easeOut?: string
        easeInOut?: string
      }
      /** Transições específicas */
      banner?: {
        enter?: string
        exit?: string
      }
      modal?: {
        enter?: string
        exit?: string
      }
    }
    /** Blur e filtros */
    filters?: {
      backdrop?: string
      disabled?: string
    }
  }

  /**
   * Configurações de acessibilidade
   */
  accessibility?: {
    /** Contraste mínimo */
    contrast?: {
      normal?: number
      enhanced?: number
    }
    /** Configurações para motion */
    motion?: {
      respectPreferences?: boolean
      reducedMotion?: {
        duration?: string
        easing?: string
      }
    }
    /** Focus indicators */
    focus?: {
      color?: string
      width?: string
      style?: 'solid' | 'dashed' | 'dotted'
      offset?: string
    }
  }

  /**
   * Temas e variações
   */
  themes?: {
    /** Configurações específicas para tema claro */
    light?: Partial<Omit<DesignTokens, 'themes'>>
    /** Configurações específicas para tema escuro */
    dark?: Partial<Omit<DesignTokens, 'themes'>>
    /** Auto-detecção baseada no sistema */
    auto?: boolean
  }
}

/**
 * Propriedades do componente ConsentProvider - configuração principal da biblioteca.
 * @category Types
 * @since 0.1.0
 * @public
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
   *   userRights: 'Você pode solicitar acesso, correção ou exclusão dos seus dados'
   * }}
   * ```
   */
  texts?: Partial<ConsentTexts>

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
   * Componente customizado para substituir o modal padrão de preferências.
   * Deve implementar a lógica de consentimento usando as props definidas em `CustomPreferencesModalProps`.
   */
  PreferencesModalComponent?: React.ComponentType<CustomPreferencesModalProps>

  /** Props adicionais passadas para o modal customizado (repassadas sem transformação). */
  preferencesModalProps?: Record<string, unknown>

  /**
   * Componente customizado para substituir o banner padrão de cookies.
   * Se não fornecido, o `CookieBanner` padrão será renderizado.
   * Deve implementar a lógica de consentimento usando as props definidas em `CustomCookieBannerProps`.
   */
  CookieBannerComponent?: React.ComponentType<CustomCookieBannerProps>

  /** Props adicionais passadas para o banner customizado (repassadas sem transformação). */
  cookieBannerProps?: Record<string, unknown>

  /**
   * Componente customizado para substituir o botão flutuante de preferências.
   * Se não fornecido, o `FloatingPreferencesButton` padrão será renderizado.
   * Deve implementar a lógica de consentimento usando as props definidas em `CustomFloatingPreferencesButtonProps`.
   */
  FloatingPreferencesButtonComponent?: React.ComponentType<CustomFloatingPreferencesButtonProps>

  /** Props adicionais passadas para o botão flutuante customizado (repassadas sem transformação). */
  floatingPreferencesButtonProps?: Record<string, unknown>

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

  /**
   * Estratégia de bloqueio quando `blocking` estiver habilitado.
   * - 'auto' (padrão):
   *   - Se usar o banner padrão da lib, o bloqueio visual/funcional fica a cargo do próprio banner.
   *   - Se usar `CookieBannerComponent` custom, o Provider NÃO cria overlay; o bloqueio fica a cargo do componente custom (compatibilidade atual).
   * - 'provider': o Provider cria um overlay de bloqueio por cima da aplicação (e abaixo do banner),
   *   garantindo que cliques sejam bloqueados, independentemente do banner custom implementar ou não esse comportamento.
   * - 'component': nenhum overlay do Provider; espera-se que o banner (padrão ou custom) trate o bloqueio.
   *
   * Observações:
   * - Visual do overlay do Provider controlado por `designTokens.layout.backdrop`:
   *   - `false`: overlay transparente (bloqueia cliques sem escurecer — útil quando o app já possui um dark-filter visual próprio).
   *   - `string` (ex.: 'rgba(0,0,0,0.4)'): overlay com escurecimento gerenciado pela lib.
   * - A11y: recomenda-se que o banner use semântica de diálogo (role="dialog", aria-modal="true") e trap de foco.
   */
  blockingStrategy?: 'auto' | 'provider' | 'component'

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

  /**
   * Desabilita o log automático de descoberta de cookies em modo desenvolvimento.
   * Mesmo com `disableDeveloperGuidance` ativado, por padrão a descoberta é logada uma vez para ajudar o mapeamento.
   * Use esta prop para suprimir também esse log experimental.
   * @since 0.4.1
   */
  disableDiscoveryLog?: boolean

  /**
   * Configuração avançada para o sistema de developer guidance.
   * Permite controle granular sobre quais tipos de guias são exibidos e como.
   * @since 0.4.1
   * @example
   * ```tsx
   * // Usar preset de desenvolvimento
   * guidanceConfig={GUIDANCE_PRESETS.development}
   *
   * // Configuração personalizada
   * guidanceConfig={{
   *   showWarnings: true,
   *   showComplianceScore: true,
   *   minimumSeverity: 'warning'
   * }}
   * ```
   */
  guidanceConfig?: GuidanceConfig

  /** Elementos filhos - toda a aplicação que precisa de contexto de consentimento. */
  children: React.ReactNode
}

/**
 * Props esperadas por um componente customizado de CookieBanner.
 * @category Types
 * @since 0.3.1
 * @public
 * Fornece acesso ao estado de consentimento e ações necessárias para o banner.
 */
export interface CustomCookieBannerProps {
  consented: boolean
  acceptAll: () => void
  rejectAll: () => void
  openPreferences: () => void
  texts: ConsentTexts
  /**
   * Indica se o modo bloqueante está ativo no contexto.
   * Esta prop é apenas informativa para banners customizados ajustarem sua UI.
   * O bloqueio funcional pode ser garantido pelo Provider quando `blockingStrategy='provider'`.
   */
  blocking?: boolean
}

/**
 * Props esperadas por um componente customizado de PreferencesModal.
 * @category Types
 * @since 0.3.1
 * @public
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
 * @category Types
 * @since 0.3.1
 * @public
 * Fornece acesso às ações de abertura do modal e ao estado de consentimento.
 */
export interface CustomFloatingPreferencesButtonProps {
  openPreferences: () => void
  consented: boolean
}

/**
 * Valor do contexto de consentimento, incluindo estado e métodos de manipulação.
 * @category Types
 * @since 0.1.0
 * @public
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
  /**
   * Define a preferência para uma categoria específica.
   * Suporta tanto categorias predefinidas quanto customizadas.
   *
   * @param cat - ID da categoria (predefinida ou customizada)
   * @param value - Valor do consentimento para a categoria
   *
   * @breakingChange
   * **v0.4.1**: Parâmetro `cat` mudou de `Category` para `string` para suportar
   * categorias customizadas. O uso com strings literais continua funcionando.
   *
   * @example
   * ```typescript
   * // ✅ Continua funcionando (categorias predefinidas)
   * setPreference('analytics', true)
   * setPreference('marketing', false)
   *
   * // ✅ Novo: categorias customizadas
   * setPreference('custom-tracking', true)
   * ```
   */
  setPreference: (cat: string, value: boolean) => void
  /** Define múltiplas preferências de uma vez e salva. */
  setPreferences: (preferences: ConsentPreferences) => void
  /** Abre o modal de preferências. */
  openPreferences: () => void
  /** Fecha o modal de preferências. */
  closePreferences: () => void
  /** Reseta o consentimento do usuário. */
  resetConsent: () => void
}

/**
 * Origem da ação de consentimento que gerou um evento.
 * @category Types
 * @since 0.4.5
 *
 * @remarks
 * Utilizado para rastrear a origem da ação de consentimento nos eventos do dataLayer.
 *
 * - `'banner'`: Ação realizada através do banner de cookies.
 * - `'modal'`: Ação realizada através do modal de preferências.
 * - `'reset'`: Ação de reset de consentimento.
 * - `'programmatic'`: Ação realizada programaticamente via API.
 *
 * @example
 * ```typescript
 * const origin: ConsentEventOrigin = 'banner';
 * ```
 *
 * @public
 */
export type ConsentEventOrigin = 'banner' | 'modal' | 'reset' | 'programmatic'

/**
 * Payload do evento `consent_initialized` disparado no dataLayer.
 * @category Types
 * @since 0.4.5
 *
 * @remarks
 * Este evento é disparado quando o sistema de consentimento é inicializado.
 * Útil para rastreamento de primeira visualização e auditoria LGPD.
 *
 * @example
 * ```typescript
 * // Exemplo de evento no dataLayer
 * window.dataLayer.push({
 *   event: 'consent_initialized',
 *   consent_version: '0.4.5',
 *   timestamp: '2025-10-25T13:52:33.729Z',
 *   categories: {
 *     necessary: true,
 *     analytics: false,
 *     marketing: false
 *   }
 * });
 * ```
 *
 * @public
 */
export interface ConsentInitializedEvent {
  /** Nome do evento (sempre 'consent_initialized') */
  event: 'consent_initialized'
  /** Versão da biblioteca react-lgpd-consent */
  consent_version: string
  /** Timestamp ISO 8601 da inicialização */
  timestamp: string
  /** Estado inicial das categorias de consentimento */
  categories: Record<string, boolean>
}

/**
 * Payload do evento `consent_updated` disparado no dataLayer.
 * @category Types
 * @since 0.4.5
 *
 * @remarks
 * Este evento é disparado sempre que o usuário atualiza suas preferências de consentimento.
 * Útil para rastreamento, auditoria LGPD e integrações com GTM.
 *
 * @example
 * ```typescript
 * // Exemplo de evento no dataLayer após aceitar analytics
 * window.dataLayer.push({
 *   event: 'consent_updated',
 *   consent_version: '0.4.5',
 *   timestamp: '2025-10-25T13:52:33.729Z',
 *   origin: 'modal',
 *   categories: {
 *     necessary: true,
 *     analytics: true,
 *     marketing: false
 *   },
 *   changed_categories: ['analytics']
 * });
 * ```
 *
 * @see {@link ConsentEventOrigin} para valores possíveis de `origin`
 * @public
 */
export interface ConsentUpdatedEvent {
  /** Nome do evento (sempre 'consent_updated') */
  event: 'consent_updated'
  /** Versão da biblioteca react-lgpd-consent */
  consent_version: string
  /** Timestamp ISO 8601 da atualização */
  timestamp: string
  /** Origem da ação que gerou a atualização */
  origin: ConsentEventOrigin
  /** Estado atualizado das categorias de consentimento */
  categories: Record<string, boolean>
  /** Lista de categorias que foram modificadas nesta atualização */
  changed_categories: string[]
}

/**
 * União de todos os tipos de eventos de consentimento.
 * @category Types
 * @since 0.4.5
 *
 * @public
 */
export type ConsentEvent = ConsentInitializedEvent | ConsentUpdatedEvent
