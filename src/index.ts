/**
 * @module react-lgpd-consent
 * @description
 * Ponto de entrada público da biblioteca react-lgpd-consent.
 * Exporta componentes, hooks, utilitários e tipos para gerenciamento de consentimento de cookies conforme LGPD.
 *
 * - Componentes de UI baseados em Material-UI
 * - Context Provider para estado global de consentimento
 * - Hooks customizados para acesso ao consentimento
 * - Utilitários para manipulação de cookies e scripts
 * - Tipos TypeScript para máxima segurança e clareza
 *
 * @remarks
 * Consulte a documentação oficial para exemplos de uso e integração.
 */

// Componentes

/**
 * Modal de preferências de cookies conforme configuração do projeto.
 * Exibe categorias ativas e permite ao usuário ajustar consentimentos.
 */
export { PreferencesModal } from './components/PreferencesModal'

// Contexto + Hooks

/**
 * Provider global de consentimento. Deve envolver sua aplicação para fornecer contexto de consentimento.
 */
export { ConsentProvider } from './context/ConsentContext'

/**
 * Hook para acessar e manipular o estado de consentimento do usuário.
 * @returns Estado e métodos para consentimento.
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
 */
/**
 * Hook para verificar o status de consentimento de uma categoria específica.
 * @param categoryId ID da categoria.
 * @returns Booleano indicando se a categoria está consentida.
 */
export { useCategories, useCategoryStatus } from './context/CategoriesContext'

// Utils

/**
 * Componente utilitário para renderização condicional baseada em consentimento.
 */
export { ConsentGate } from './utils/ConsentGate'

/**
 * Função utilitária para carregamento dinâmico de scripts externos.
 */
export { loadScript } from './utils/scriptLoader'

/**
 * Tema padrão para componentes de consentimento.
 */
/**
 * Fábrica do tema padrão para componentes de consentimento.
 * Use somente quando realmente necessário; preferir herdar o tema do app.
 */
export { createDefaultConsentTheme, defaultConsentTheme } from './utils/theme'

/**
 * Loader de scripts condicionado ao consentimento do usuário.
 * Inclui hook para uso programático.
 */
export { ConsentScriptLoader, useConsentScriptLoader } from './utils/ConsentScriptLoader'

/**
 * Integrações prontas para Google Analytics, Google Tag Manager e UserWay.
 * Tipos auxiliares para configuração dessas integrações.
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
  ConsentTexts,
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
 * Tipos para o sistema de auto-configuração de categorias.
 * @since 0.4.1
 */
export type { CategoryAutoConfigResult } from './utils/autoConfigureCategories'

// Utilitários de orientação para developers

/**
 * Utilitários de orientação para developers
 */
export type { DeveloperGuidance } from './utils/developerGuidance'

/**
 * Tipo do contexto de categorias para acesso avançado.
 */
export type { CategoriesContextValue } from './context/CategoriesContext'

/**
 * Categorias padrão do projeto e função para análise da configuração do desenvolvedor.
 */
export {
  analyzeDeveloperConfiguration,
  DEFAULT_PROJECT_CATEGORIES,
} from './utils/developerGuidance'

/**
 * Sistema de logging para debug e troubleshooting.
 */
export { LogLevel, setDebugLogging } from './utils/logger'

// Cookie registry APIs (overrides + lookup)
export {
  getCookiesInfoForCategory,
  setCookieCatalogOverrides,
  setCookieCategoryOverrides,
} from './utils/cookieRegistry'

// Componentes padrão (para wrapping ou uso avançado)
export { CookieBanner } from './components/CookieBanner'
export { FloatingPreferencesButton } from './components/FloatingPreferencesButton'

// Tipos de props dos componentes para uso avançado
export type { CookieBannerProps } from './components/CookieBanner'
export type { FloatingPreferencesButtonProps } from './components/FloatingPreferencesButton'
export type { PreferencesModalProps } from './components/PreferencesModal'
export type { ConsentScriptLoaderProps } from './utils/ConsentScriptLoader'

// Utilitários e constantes (para customização avançada)
export { defaultTexts } from './context/ConsentContext'
export {
  createProjectPreferences,
  getAllProjectCategories,
  validateProjectPreferences,
} from './utils/categoryUtils'
