/**
 * Pacote agregador react-lgpd-consent.
 * Re-exporta tudo de @react-lgpd-consent/mui para retrocompatibilidade.
 *
 * @remarks
 * Use este entrypoint para ter a experiência completa (UI MUI + core).
 * Para bundles menores, prefira `@react-lgpd-consent/core` (headless) ou
 * `@react-lgpd-consent/mui/ui` (apenas UI, sem re-export do core).
 *
 * @example
 * ```tsx
 * import { ConsentProvider } from 'react-lgpd-consent'
 *
 * <ConsentProvider categories={{ enabledCategories: ['analytics'] }}>
 *   <App />
 * </ConsentProvider>
 * ```
 *
 * @packageDocumentation
 * @category Packages
 */
export * from '@react-lgpd-consent/mui'
