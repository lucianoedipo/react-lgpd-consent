/**
 * Ponto de entrada público do pacote @react-lgpd-consent/core.
 * Exporta componentes headless, hooks, utilitários e tipos para gerenciamento de consentimento de cookies conforme LGPD.
 *
 * - Context Provider headless para estado global de consentimento
 * - Hooks customizados para acesso ao consentimento
 * - Utilitários para manipulação de cookies e scripts
 * - Tipos TypeScript para máxima segurança e clareza
 * - Integrações prontas (Google Analytics, GTM, UserWay, etc.)
 *
 * @packageDocumentation
 * @category Packages
 */

// Contexto + Hooks

/**
 * Provider global de consentimento. Deve envolver sua aplicação para fornecer contexto de consentimento.
 * @category Context
 * @since 0.4.1
 */
export { ConsentProvider } from './context/ConsentContext'

/**
 * Hook para acessar e manipular o estado de consentimento do usuário.
 * @returns Estado e métodos para consentimento.
 * @category Hooks
 * @since 0.4.1
 */
export {
  /**
   * Função para abrir o modal de preferências de fora do contexto React.
   * Útil para integração com código JavaScript puro.
   */
  openPreferencesModal,
  useConsent,
  /**
   * Hook para verificar se o consentimento já foi hidratado (SSR/CSR).
   * @returns Booleano indicando hidratação.
   */
  useConsentHydration,
  /**
   * Hook para acessar os textos customizados de consentimento.
   * @returns Textos definidos via prop `texts`.
   */
  useConsentTexts,
  /**
   * Hook para abrir o modal de preferências programaticamente.
   * @returns Função para abrir o modal.
   */
  useOpenPreferencesModal,
} from './hooks/useConsent'

// Hooks de categorias - novo sistema

/**
 * Hook para obter a lista de categorias ativas no projeto.
 * @returns Array de categorias configuradas.
 * @category Hooks
 * @since 0.4.1
 */
/**
 * Hook para verificar o status de consentimento de uma categoria específica.
 * @param categoryId ID da categoria.
 * @returns Booleano indicando se a categoria está consentida.
 * @category Hooks
 * @since 0.4.1
 */
export { useCategories, useCategoryStatus } from './context/CategoriesContext'
export { DesignProvider, useDesignTokens } from './context/DesignContext'

// Utils

/**
 * Componente utilitário para renderização condicional baseada em consentimento.
 * @category Utils
 * @component
 * @since 0.4.1
 */
export { ConsentGate } from './utils/ConsentGate'
export { buildConsentStorageKey } from './utils/cookieUtils'

/**
 * Função utilitária para carregamento dinâmico de scripts externos.
 * @category Utils
 * @since 0.4.1
 */
export { loadScript } from './utils/scriptLoader'
/**
 * Mecanismo experimental para descobrir cookies em tempo de execução e categorizá-los.
 * @category Utils
 * @since 0.4.1
 */
export {
  categorizeDiscoveredCookies,
  detectConsentCookieName,
  discoverRuntimeCookies,
} from './utils/cookieDiscovery'

/**
 * Loader de scripts condicionado ao consentimento do usuário.
 * Inclui hook para uso programático.
 * @category Utils
 * @since 0.4.1
 */
export { ConsentScriptLoader, useConsentScriptLoader } from './utils/ConsentScriptLoader'

/**
 * Integrações prontas para Google Analytics, Google Tag Manager e UserWay.
 * Tipos auxiliares para configuração dessas integrações.
 * @category Utils
 * @since 0.4.1
 */
export {
  COMMON_INTEGRATIONS,
  createClarityIntegration,
  createCorporateIntegrations,
  createECommerceIntegrations,
  createFacebookPixelIntegration,
  createGoogleAnalyticsIntegration,
  createGoogleTagManagerIntegration,
  createHotjarIntegration,
  createIntercomIntegration,
  createMixpanelIntegration,
  createSaaSIntegrations,
  createUserWayIntegration,
  createZendeskChatIntegration,
  INTEGRATION_TEMPLATES,
  suggestCategoryForScript,
  type ClarityConfig,
  type CorporateConfig,
  type ECommerceConfig,
  type FacebookPixelConfig,
  type GoogleAnalyticsConfig,
  type GoogleTagManagerConfig,
  type HotjarConfig,
  type IntercomConfig,
  type MixpanelConfig,
  type SaaSConfig,
  type ScriptIntegration,
  type UserWayConfig,
  type ZendeskConfig,
} from './utils/scriptIntegrations'

/**
 * Sistema inteligente de auto-configuração de categorias baseado nas integrações.
 * @since 0.4.1
 * @category Utils
 */
export {
  analyzeIntegrationCategories,
  autoConfigureCategories,
  extractCategoriesFromIntegrations,
  validateIntegrationCategories,
  validateNecessaryClassification,
} from './utils/autoConfigureCategories'

// Tipos

/**
 * Tipos principais para configuração e uso do sistema de consentimento.
 * @category Types
 * @since 0.4.1
 */
export type {
  Category,
  CategoryDefinition,
  ConsentContextValue,
  ConsentCookieData,
  ConsentCookieOptions,
  ConsentPreferences,
  /**
   * Props do ConsentProvider principal.
   */
  ConsentProviderProps,
  ConsentState,
  ConsentStorageConfig,
  ConsentTexts,
  ConsentVersionChangeContext,
  CookieDescriptor,
  /**
   * Props esperadas por um componente customizado de CookieBanner.
   */
  CustomCookieBannerProps,
  /**
   * Props esperadas por um componente customizado de FloatingPreferencesButton.
   */
  CustomFloatingPreferencesButtonProps,
  /**
   * Props esperadas por um componente customizado de PreferencesModal.
   */
  CustomPreferencesModalProps,
  DesignTokens,
  ProjectCategoriesConfig,
} from './types/types'

/**
 * Sistema avançado de textos com suporte a i18n e contextos específicos.
 * @since 0.4.1
 * @category Types
 */
export type { AdvancedConsentTexts } from './types/advancedTexts'

/**
 * Utilitários para sistema avançado de textos.
 * @since 0.4.1
 * @category Utils
 */
export { EXPANDED_DEFAULT_TEXTS, resolveTexts, TEXT_TEMPLATES } from './types/advancedTexts'

/**
 * Tipos para o sistema de auto-configuração de categorias.
 * @since 0.4.1
 * @category Types
 */
export type { CategoryAutoConfigResult } from './utils/autoConfigureCategories'

// Utilitários de orientação para developers

/**
 * Utilitários de orientação para developers
 * @category Utils
 * @since 0.4.1
 */
export type {
  DeveloperGuidance,
  GuidanceConfig,
  GuidanceMessage,
  GuidanceSeverity,
} from './utils/developerGuidance'

/**
 * Tipo do contexto de categorias para acesso avançado.
 * @category Types
 * @since 0.4.1
 */
export type { CategoriesContextValue } from './context/CategoriesContext'

/**
 * Categorias padrão do projeto e função para análise da configuração do desenvolvedor.
 * @category Utils
 * @since 0.4.1
 */
export {
  analyzeDeveloperConfiguration,
  DEFAULT_PROJECT_CATEGORIES,
  GUIDANCE_PRESETS,
  logDeveloperGuidance,
  useDeveloperGuidance,
} from './utils/developerGuidance'

/**
 * Sistema de logging para debug e troubleshooting.
 * @category Utils
 * @since 0.4.1
 */
export { logger, LogLevel, setDebugLogging } from './utils/logger'

// Cookie registry APIs (overrides + lookup)
export {
  getCookiesInfoForCategory,
  setCookieCatalogOverrides,
  setCookieCategoryOverrides,
} from './utils/cookieRegistry'

/**
 * Tipos de props para o componente ConsentScriptLoader.
 * @category Types
 * @since 0.4.1
 */
export type { ConsentScriptLoaderProps } from './utils/ConsentScriptLoader'

// Utilitários e constantes (para customização avançada)

/**
 * Textos padrão para o sistema de consentimento, usados como fallback.
 * @category Utils
 * @since 0.4.1
 */
export { defaultTexts } from './context/ConsentContext'

/**
 * Funções utilitárias para criação e validação de preferências de projeto.
 * Inclui criação de preferências, obtenção de categorias e validação.
 * @category Utils
 * @since 0.4.1
 */
export {
  createProjectPreferences,
  ensureNecessaryAlwaysOn,
  getAllProjectCategories,
  validateProjectPreferences,
} from './utils/categoryUtils'

/**
 * Utilitários para disparar eventos de consentimento no dataLayer (GTM).
 * @category Utils
 * @since 0.4.5
 */
export {
  pushConsentInitializedEvent,
  pushConsentUpdatedEvent,
  useDataLayerEvents,
} from './utils/dataLayerEvents'

/**
 * Tipos de eventos de consentimento para dataLayer (GTM).
 * @category Types
 * @since 0.4.5
 */
export type {
  ConsentEvent,
  ConsentEventOrigin,
  ConsentInitializedEvent,
  ConsentUpdatedEvent,
} from './types/types'
