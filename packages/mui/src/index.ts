/**
 * @module @react-lgpd-consent/mui
 * @description
 * Pacote de componentes Material-UI para react-lgpd-consent.
 * Fornece componentes visuais prontos para uso baseados em Material-UI.
 *
 * @remarks
 * Este pacote contém:
 * - CookieBanner: Banner de consentimento (modal ou snackbar)
 * - PreferencesModal: Modal de preferências detalhadas
 * - FloatingPreferencesButton: Botão flutuante para abrir preferências
 * - Branding: Componente de marca/logo customizável
 *
 * @category Main
 * @since 0.5.0
 */

// Re-exportar todo o core para facilitar uso
export * from '@react-lgpd-consent/core'

// Componentes MUI
export { CookieBanner } from './components/CookieBanner'
export { PreferencesModal } from './components/PreferencesModal'
export { FloatingPreferencesButton } from './components/FloatingPreferencesButton'
export { Branding } from './components/Branding'

// Tipos dos componentes MUI
export type { CookieBannerProps } from './components/CookieBanner'
export type { PreferencesModalProps } from './components/PreferencesModal'
export type { FloatingPreferencesButtonProps } from './components/FloatingPreferencesButton'
export type { BrandingProps } from './components/Branding'
