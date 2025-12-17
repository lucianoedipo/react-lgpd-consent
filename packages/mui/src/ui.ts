/**
 * Entrypoint UI-only para @react-lgpd-consent/mui.
 * Exporta apenas os componentes MUI, evitando re-exportar o core para bundles menores e sem ambiguidade.
 *
 * @packageDocumentation
 * @category Packages
 * @since 0.7.1
 */

export { Branding } from './components/Branding'
export type { BrandingProps } from './components/Branding'

export { ConsentProvider } from './components/ConsentProvider'
export type { ConsentProviderProps } from './components/ConsentProvider'

export { CookieBanner } from './components/CookieBanner'
export type { CookieBannerProps } from './components/CookieBanner'

export { FloatingPreferencesButton } from './components/FloatingPreferencesButton'
export type { FloatingPreferencesButtonProps } from './components/FloatingPreferencesButton'

export { PreferencesModal } from './components/PreferencesModal'
export type { PreferencesModalProps } from './components/PreferencesModal'
