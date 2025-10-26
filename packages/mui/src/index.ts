/**
 * @packageDocumentation
 * Implementação Material-UI para react-lgpd-consent.
 *
 * @remarks
 * Este pacote fornece componentes visuais usando Material-UI para gerenciar
 * consentimento LGPD. Inclui banner de cookies, modal de preferências e botão flutuante.
 *
 * @since 0.5.0
 * @category Packages
 */

// Re-exporta tudo do core
export * from '@react-lgpd-consent/core'

// Exporta o Provider do core como ConsentProviderHeadless (para uso avançado)
export { ConsentProvider as ConsentProviderHeadless } from '@react-lgpd-consent/core'

// Componentes MUI
export { Branding } from './components/Branding'
export { ConsentProvider } from './components/ConsentProvider'
export { CookieBanner } from './components/CookieBanner'
export { FloatingPreferencesButton } from './components/FloatingPreferencesButton'
export { PreferencesModal } from './components/PreferencesModal'

// Tipos dos componentes MUI
export type { BrandingProps } from './components/Branding'
export type { ConsentProviderProps } from './components/ConsentProvider'
export type { CookieBannerProps } from './components/CookieBanner'
export type { FloatingPreferencesButtonProps } from './components/FloatingPreferencesButton'
export type { PreferencesModalProps } from './components/PreferencesModal'

