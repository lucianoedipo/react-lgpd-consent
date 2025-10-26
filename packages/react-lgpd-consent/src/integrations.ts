/**
 * @module react-lgpd-consent/integrations
 *
 * @description
 * Re-exporta todas as integrações de scripts de terceiros do pacote @react-lgpd-consent/core.
 * 
 * Este módulo fornece acesso conveniente às factories de integrações (Google Analytics, GTM, 
 * Facebook Pixel, etc.) sem precisar importar diretamente do pacote core.
 * 
 * @category Integrations
 * @since 0.5.0
 */

export {
  // Templates e utilitários
  COMMON_INTEGRATIONS,
  createClarityIntegration,
  createCorporateIntegrations,
  // Factories de conjuntos de integrações
  createECommerceIntegrations,
  createFacebookPixelIntegration,
  // Factories de integrações individuais
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
  // Tipos
  type ScriptIntegration,
  type UserWayConfig,
  type ZendeskConfig,
} from '@react-lgpd-consent/core'
