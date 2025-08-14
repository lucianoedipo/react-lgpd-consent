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
  useConsent,
  /**
   * Hook para acessar os textos customizados de consentimento.
   * @returns Textos definidos via prop `texts`.
   */
  useConsentTexts,
  /**
   * Hook para verificar se o consentimento já foi hidratado (SSR/CSR).
   * @returns Booleano indicando hidratação.
   */
  useConsentHydration,
  /**
   * Hook para abrir o modal de preferências programaticamente.
   * @returns Função para abrir o modal.
   */
  useOpenPreferencesModal,
  /**
   * Função para abrir o modal de preferências de fora do contexto React.
   * Útil para integração com código JavaScript puro.
   */
  openPreferencesModal,
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
export { defaultConsentTheme } from './utils/theme'

/**
 * Loader de scripts condicionado ao consentimento do usuário.
 * Inclui hook para uso programático.
 */
export {
  ConsentScriptLoader,
  useConsentScriptLoader,
} from './utils/ConsentScriptLoader'

/**
 * Integrações prontas para Google Analytics, Google Tag Manager e UserWay.
 * Tipos auxiliares para configuração dessas integrações.
 */
export {
  createGoogleAnalyticsIntegration,
  createGoogleTagManagerIntegration,
  createUserWayIntegration,
  COMMON_INTEGRATIONS,
  type ScriptIntegration,
  type GoogleAnalyticsConfig,
  type GoogleTagManagerConfig,
  type UserWayConfig,
} from './utils/scriptIntegrations'

// Tipos

/**
 * Tipos principais para configuração e uso do sistema de consentimento.
 */
export type {
  Category,
  CategoryDefinition,
  ConsentPreferences,
  ConsentState,
  ConsentTexts,
  ConsentCookieOptions,
  ProjectCategoriesConfig,
  /**
   * Props do ConsentProvider principal.
   */
  ConsentProviderProps,
  /**
   * Props esperadas por um componente customizado de CookieBanner.
   */
  CustomCookieBannerProps,
  /**
   * Props esperadas por um componente customizado de PreferencesModal.
   */
  CustomPreferencesModalProps,
  /**
   * Props esperadas por um componente customizado de FloatingPreferencesButton.
   */
  CustomFloatingPreferencesButtonProps,
} from './types/types'

// Utilitários de orientação para developers

/**
 * Tipo para orientações automáticas de configuração para desenvolvedores.
 */
export type { DeveloperGuidance } from './utils/developerGuidance'

/**
 * Categorias padrão do projeto e função para análise da configuração do desenvolvedor.
 */
export {
  DEFAULT_PROJECT_CATEGORIES,
  analyzeDeveloperConfiguration,
} from './utils/developerGuidance'

/**
 * Sistema de logging para debug e troubleshooting.
 */
export { setDebugLogging, LogLevel } from './utils/logger'

// Componentes padrão (para wrapping ou uso avançado)
export { CookieBanner } from './components/CookieBanner'
export { FloatingPreferencesButton } from './components/FloatingPreferencesButton'

// Utilitários e constantes (para customização avançada)
export { defaultTexts } from './context/ConsentContext'
export {
  createProjectPreferences,
  validateProjectPreferences,
  getAllProjectCategories,
} from './utils/categoryUtils'
