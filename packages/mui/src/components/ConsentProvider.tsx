/**
 * @fileoverview
 * Wrapper do ConsentProvider que automaticamente injeta os componentes UI do Material-UI.
 * Este wrapper fornece uma experiência "batteries included" onde o modal de preferências
 * é renderizado automaticamente sem necessidade de configuração adicional.
 *
 * @since 0.5.0
 * @category Components
 */

import type { Theme } from '@mui/material/styles'
import { ThemeProvider } from '@mui/material/styles'
import {
  ConsentProvider as ConsentProviderCore,
  type ConsentProviderProps as ConsentProviderCoreProps,
} from '@react-lgpd-consent/core'
import { CookieBanner } from './CookieBanner'
import { FloatingPreferencesButton } from './FloatingPreferencesButton'
import { PreferencesModal } from './PreferencesModal'

/**
 * Props do ConsentProvider com suporte a componentes MUI.
 * Estende as props do core com valores padrão para componentes UI.
 *
 * @category Types
 * @public
 * @since 0.5.0
 */
export interface ConsentProviderProps extends ConsentProviderCoreProps {
  /**
   * Se `true`, desabilita a injeção automática do PreferencesModal.
   * Use isso se quiser passar seu próprio modal via `PreferencesModalComponent`.
   *
   * @default false
   * @since 0.5.0
   */
  disableDefaultModal?: boolean
  /**
   * Se `true`, desabilita a injeção automática do CookieBanner padrão.
   * Útil quando se deseja uma implementação própria, mantendo outras integrações.
   *
   * @default false
   * @since 0.5.0
   */
  disableDefaultBanner?: boolean
  /**
   * Se `true`, desabilita a injeção automática do FloatingPreferencesButton.
   * Normalmente não é necessário — `disableFloatingPreferencesButton` já oculta o botão.
   *
   * @default false
   * @since 0.5.0
   */
  disableDefaultFloatingButton?: boolean
  /**
   * Tema Material-UI a ser aplicado ao redor dos componentes padrões.
   *
   * @remarks
   * O tema é aplicado apenas nesta camada de apresentação. O core permanece agnóstico.
   *
   * @example
   * ```tsx
   * const theme = createTheme({ palette: { primary: { main: '#1976d2' } } })
   * <ConsentProvider theme={theme} />
   * ```
   *
   * @since 0.5.0
   */
  theme?: Theme
}

/**
 * Provider de consentimento com componentes Material-UI integrados.
 *
 * Este componente é um wrapper sobre o `ConsentProvider` do core que automaticamente
 * fornece um `PreferencesModal` padrão, tornando o setup mais simples.
 *
 * @component
 * @category Components
 * @public
 * @since 0.5.0
 *
 * @remarks
 * **Diferenças do Core:**
 * - ✅ Automaticamente renderiza `PreferencesModal` quando o usuário clica em "Preferências"
 * - ✅ Não requer configuração de `PreferencesModalComponent` (mas permite override)
 * - ✅ Ideal para uso rápido com Material-UI
 *
 * **Quando usar o Core diretamente:**
 * - ❌ Se você quiser controle total sobre qual modal renderizar
 * - ❌ Se você estiver usando uma biblioteca de UI diferente
 * - ❌ Se você quiser implementação headless
 *
 * @example
 * **Uso Básico (Modal automático):**
 * ```tsx
 * import { ConsentProvider } from '@react-lgpd-consent/mui'
 *
 * function App() {
 *   return (
 *     <ConsentProvider categories={{ enabledCategories: ['analytics'] }}>
 *       <YourApp />
 *     </ConsentProvider>
 *   )
 * }
 * ```
 *
 * @example
 * **Modal customizado:**
 * ```tsx
 * import { ConsentProvider, PreferencesModal } from '@react-lgpd-consent/mui'
 *
 * function App() {
 *   return (
 *     <ConsentProvider
 *       categories={{ enabledCategories: ['analytics'] }}
 *       PreferencesModalComponent={(props) => (
 *         <PreferencesModal {...props} hideBranding={true} />
 *       )}
 *     >
 *       <YourApp />
 *     </ConsentProvider>
 *   )
 * }
 * ```
 *
 * @example
 * **Desabilitar modal padrão (headless):**
 * ```tsx
 * import { ConsentProvider } from '@react-lgpd-consent/mui'
 *
 * function App() {
 *   return (
 *     <ConsentProvider
 *       categories={{ enabledCategories: ['analytics'] }}
 *       disableDefaultModal={true}
 *     >
 *       <YourApp />
 *     </ConsentProvider>
 *   )
 * }
 * ```
 *
 * @param props - Props do provider incluindo categorias, textos, callbacks, etc.
 * @returns Provider React com contexto de consentimento e UI integrada
 *
 * @see {@link ConsentProviderCore} Para a versão headless sem UI
 * @see {@link PreferencesModal} Para o componente de modal usado por padrão
 */
export function ConsentProvider({
  disableDefaultModal = false,
  disableDefaultBanner = false,
  disableDefaultFloatingButton = false,
  PreferencesModalComponent,
  CookieBannerComponent,
  FloatingPreferencesButtonComponent,
  theme,
  hideBranding,
  cookieBannerProps,
  preferencesModalProps,
  floatingPreferencesButtonProps,
  children,
  ...coreProps
}: ConsentProviderProps) {
  // Se já tem um modal customizado OU desabilitou o padrão, usa o que foi passado
  // Caso contrário, injeta o PreferencesModal padrão
  const modalComponent = disableDefaultModal
    ? PreferencesModalComponent
    : PreferencesModalComponent || PreferencesModal

  const bannerComponent = disableDefaultBanner
    ? CookieBannerComponent
    : CookieBannerComponent || CookieBanner

  const floatingButtonComponent = disableDefaultFloatingButton
    ? FloatingPreferencesButtonComponent
    : FloatingPreferencesButtonComponent || FloatingPreferencesButton

  const mergedCookieBannerProps = {
    ...cookieBannerProps,
    hideBranding: cookieBannerProps?.hideBranding ?? hideBranding,
  }

  const mergedPreferencesModalProps = {
    ...preferencesModalProps,
    hideBranding: preferencesModalProps?.hideBranding ?? hideBranding,
  }

  const provider = (
    <ConsentProviderCore
      {...coreProps}
      hideBranding={hideBranding}
      cookieBannerProps={mergedCookieBannerProps}
      preferencesModalProps={mergedPreferencesModalProps}
      floatingPreferencesButtonProps={floatingPreferencesButtonProps}
      CookieBannerComponent={bannerComponent as ConsentProviderCoreProps['CookieBannerComponent']}
      PreferencesModalComponent={
        modalComponent as ConsentProviderCoreProps['PreferencesModalComponent']
      }
      FloatingPreferencesButtonComponent={
        floatingButtonComponent as ConsentProviderCoreProps['FloatingPreferencesButtonComponent']
      }
    >
      {children}
    </ConsentProviderCore>
  )

  if (!theme) return provider

  return <ThemeProvider theme={theme}>{provider}</ThemeProvider>
}

// Adiciona displayName para melhor debugging
ConsentProvider.displayName = 'ConsentProvider(MUI)'
