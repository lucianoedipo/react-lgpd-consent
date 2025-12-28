/**
 * @module react-lgpd-consent/integrations
 *
 * @description
 * Re-exporta todas as integrações de scripts de terceiros do pacote @react-lgpd-consent/core.
 * Este módulo fornece acesso conveniente às factories de integrações (Google Analytics, GTM,
 * Facebook Pixel, etc.) sem precisar importar diretamente do pacote core.
 *
 * English:
 * Re-exports all third-party script integrations from the @react-lgpd-consent/core package.
 * This module provides a convenient access point to integration factories
 * (Google Analytics, GTM, Facebook Pixel, etc.) without importing from core directly.
 *
 * @category Utils
 * @since 0.5.0
 * @exports COMMON_INTEGRATIONS
 * @exports createClarityIntegration
 * @exports createCorporateIntegrations
 * @exports createECommerceIntegrations
 * @exports createFacebookPixelIntegration
 * @exports createGoogleAnalyticsIntegration
 * @exports createGoogleTagManagerIntegration
 * @exports createHotjarIntegration
 * @exports createIntercomIntegration
 * @exports createMixpanelIntegration
 * @exports createSaaSIntegrations
 * @exports createUserWayIntegration
 * @exports createZendeskChatIntegration
 *
 * @example
 * ```tsx
 * import { COMMON_INTEGRATIONS } from 'react-lgpd-consent/integrations'
 *
 * const integrations = [
 *   COMMON_INTEGRATIONS.googleAnalytics({ measurementId: 'G-XXXX' }),
 *   COMMON_INTEGRATIONS.googleTagManager({ containerId: 'GTM-XXXX' })
 * ]
 * ```
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
