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
export { Branding } from './components/Branding'
export { CookieBanner } from './components/CookieBanner'
export { FloatingPreferencesButton } from './components/FloatingPreferencesButton'
export { PreferencesModal } from './components/PreferencesModal'

// Tipos dos componentes MUI
export type { BrandingProps } from './components/Branding'
export type { CookieBannerProps } from './components/CookieBanner'
export type { FloatingPreferencesButtonProps } from './components/FloatingPreferencesButton'
export type { PreferencesModalProps } from './components/PreferencesModal'

