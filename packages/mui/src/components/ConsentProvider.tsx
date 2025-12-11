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
 * Propriedades do ConsentProvider com suporte a componentes Material-UI integrados.
 *
 * @remarks
 * Estende as props do `ConsentProviderCore` com valores padrão para componentes UI.
 * Este Provider é o ponto de entrada principal para uso da biblioteca com Material-UI,
 * oferecendo uma experiência "batteries included" (tudo pronto para uso).
 *
 * ### Diferenças do Core
 * - ✅ Injeção automática de `PreferencesModal`, `CookieBanner` e `FloatingPreferencesButton`
 * - ✅ Suporte a tema Material-UI via `ThemeProvider`
 * - ✅ Props dedicadas para desabilitar componentes padrão
 * - ✅ Não requer configuração manual de componentes UI
 *
 * ### Quando Usar Este Provider
 * - Você está usando Material-UI no seu projeto
 * - Quer começar rápido com UI pronta
 * - Prefere defaults sensatos com possibilidade de override
 *
 * ### Quando Usar o Core
 * - Você quer controle total sobre a UI
 * - Está usando outra biblioteca de UI (Chakra, Ant Design, etc.)
 * - Prefere implementação headless
 *
 * @category Components
 * @public
 * @since 0.5.0
 *
 * @example Uso básico com defaults
 * ```tsx
 * import { ConsentProvider } from '@react-lgpd-consent/mui'
 *
 * <ConsentProvider categories={{ enabledCategories: ['analytics'] }}>
 *   <App />
 * </ConsentProvider>
 * ```
 *
 * @example Com tema customizado
 * ```tsx
 * import { createTheme } from '@mui/material/styles'
 * import { ConsentProvider } from '@react-lgpd-consent/mui'
 *
 * const theme = createTheme({
 *   palette: {
 *     primary: { main: '#1976d2' }
 *   }
 * })
 *
 * <ConsentProvider
 *   theme={theme}
 *   categories={{ enabledCategories: ['analytics'] }}
 * >
 *   <App />
 * </ConsentProvider>
 * ```
 *
 * @example Desabilitando componentes padrão
 * ```tsx
 * <ConsentProvider
 *   categories={{ enabledCategories: ['analytics'] }}
 *   disableDefaultModal={true}
 *   disableDefaultBanner={true}
 *   disableDefaultFloatingButton={true}
 * >
 *   <App />
 * </ConsentProvider>
 * ```
 */
export interface ConsentProviderProps extends ConsentProviderCoreProps {
  /**
   * Se `true`, desabilita a injeção automática do PreferencesModal.
   *
   * @remarks
   * Use isso quando quiser passar seu próprio modal via `PreferencesModalComponent`
   * ou quando quiser implementação totalmente headless.
   *
   * Quando `false` (padrão), o modal padrão do MUI é renderizado automaticamente
   * quando o usuário clica em "Preferências" ou "Gerenciar".
   *
   * @defaultValue false
   * @since 0.5.0
   *
   * @example
   * ```tsx
   * function MyModal() {
   *   const { closePreferences } = useConsent()
   *   return <div>Meu modal customizado</div>
   * }
   *
   * <ConsentProvider
   *   disableDefaultModal={true}
   *   PreferencesModalComponent={MyModal}
   * >
   *   <App />
   * </ConsentProvider>
   * ```
   */
  disableDefaultModal?: boolean

  /**
   * Se `true`, desabilita a injeção automática do CookieBanner.
   *
   * @remarks
   * Útil quando você quer uma implementação própria de banner,
   * mantendo outras integrações (modal, botão flutuante).
   *
   * Quando `false` (padrão), o banner padrão do MUI é renderizado
   * automaticamente quando o usuário ainda não consentiu.
   *
   * @defaultValue false
   * @since 0.5.0
   *
   * @example
   * ```tsx
   * function MyBanner() {
   *   const { acceptAll, rejectAll } = useConsent()
   *   return <div>Meu banner customizado</div>
   * }
   *
   * <ConsentProvider
   *   disableDefaultBanner={true}
   *   CookieBannerComponent={MyBanner}
   * >
   *   <App />
   * </ConsentProvider>
   * ```
   */
  disableDefaultBanner?: boolean

  /**
   * Se `true`, desabilita a injeção automática do FloatingPreferencesButton.
   *
   * @remarks
   * Útil quando você quer controlar completamente como usuários reacessam
   * suas preferências (ex: link no footer, menu de configurações).
   *
   * **Nota**: `disableFloatingPreferencesButton` do core também oculta o botão,
   * mas esta prop impede completamente a renderização do componente.
   *
   * @defaultValue false
   * @since 0.5.0
   *
   * @example
   * ```tsx
   * <ConsentProvider
   *   disableDefaultFloatingButton={true}
   *   categories={{ enabledCategories: ['analytics'] }}
   * >
   *   <App />
   * </ConsentProvider>
   * ```
   */
  disableDefaultFloatingButton?: boolean

  /**
   * Tema Material-UI a ser aplicado ao redor dos componentes padrão.
   *
   * @remarks
   * O tema é aplicado apenas nesta camada de apresentação via `ThemeProvider`.
   * O core permanece agnóstico de UI.
   *
   * Se você já tem um `ThemeProvider` no seu app, os componentes
   * herdarão automaticamente. Esta prop é opcional e útil quando você quer
   * um tema específico apenas para os componentes de consentimento.
   *
   * @defaultValue undefined (herda tema do contexto pai)
   * @since 0.5.0
   *
   * @example
   * ```tsx
   * import { createTheme } from '@mui/material/styles'
   *
   * const consentTheme = createTheme({
   *   palette: {
   *     primary: { main: '#2e7d32' },
   *     background: { paper: '#fafafa' }
   *   },
   *   typography: {
   *     fontFamily: 'Inter, sans-serif'
   *   }
   * })
   *
   * <ConsentProvider
   *   theme={consentTheme}
   *   categories={{ enabledCategories: ['analytics'] }}
   * >
   *   <App />
   * </ConsentProvider>
   * ```
   */
  theme?: Theme
}

/**
 * Provider de consentimento com componentes Material-UI integrados ("batteries included").
 *
 * @component
 * @category Components
 * @public
 * @since 0.5.0
 *
 * @remarks
 * Este componente é um wrapper sobre o `ConsentProvider` do core que automaticamente
 * injeta `PreferencesModal`, `CookieBanner` e `FloatingPreferencesButton` com estilos MUI,
 * tornando o setup extremamente simples e rápido.
 *
 * ### Características Principais
 * - ✅ **Injeção Automática**: Renderiza modal, banner e botão flutuante sem configuração
 * - ✅ **Tema Material-UI**: Aceita `theme` prop para customização de cores e tipografia
 * - ✅ **Override Flexível**: Permite substituir componentes padrão via props `*Component`
 * - ✅ **Desabilitar Seletivo**: Props `disable*` para controle granular de UI
 * - ✅ **SSR-Safe**: Compatível com NextJS e outros frameworks SSR
 * - ✅ **Tree-shakeable**: Apenas o que você usa é incluído no bundle
 *
 * ### Diferenças do Core Provider
 * | Recurso | MUI Provider | Core Provider |
 * |---------|--------------|---------------|
 * | Modal padrão | ✅ Automático | ❌ Manual |
 * | Banner padrão | ✅ Automático | ❌ Manual |
 * | Botão flutuante | ✅ Automático | ❌ Manual |
 * | Suporte a tema MUI | ✅ Sim | ❌ Não |
 * | Tamanho bundle | ~104KB | ~86KB |
 * | Headless | Via `disable*` | ✅ Nativo |
 *
 * ### Quando Usar Este Provider
 * - ✅ Você está usando Material-UI no projeto
 * - ✅ Quer começar rápido sem configurar UI
 * - ✅ Prefere defaults sensatos com possibilidade de override
 * - ✅ Precisa de acessibilidade pronta (ARIA labels, keyboard nav)
 *
 * ### Quando Usar o Core Provider
 * - ❌ Você quer controle total sobre a UI
 * - ❌ Está usando outra biblioteca (Chakra, Ant Design, Tailwind)
 * - ❌ Precisa de bundle mínimo (~18KB a menos)
 * - ❌ Quer implementação 100% headless
 *
 * ### Estrutura de Renderização
 * ```
 * ConsentProviderCore
 *   └─ ThemeProvider (se theme fornecido)
 *      ├─ children (sua aplicação)
 *      ├─ CookieBanner (se não desabilitado e sem consentimento)
 *      ├─ PreferencesModal (se não desabilitado e preferências abertas)
 *      └─ FloatingPreferencesButton (se não desabilitado)
 * ```
 *
 * @param props - Propriedades do provider (estende ConsentProviderCoreProps)
 * @returns Elemento React contendo o provider de contexto e componentes UI integrados
 *
 * @throws {Error} Se `categories.enabledCategories` não for fornecido (validação do core)
 *
 * @example Uso Básico (Modal + Banner + Botão Automáticos)
 * ```tsx
 * import { ConsentProvider } from '@react-lgpd-consent/mui'
 *
 * function App() {
 *   return (
 *     <ConsentProvider
 *       categories={{
 *         enabledCategories: ['analytics', 'marketing']
 *       }}
 *     >
 *       <YourApp />
 *     </ConsentProvider>
 *   )
 * }
 * ```
 *
 * @example Com Tema Customizado MUI
 * ```tsx
 * import { createTheme } from '@mui/material/styles'
 * import { ConsentProvider } from '@react-lgpd-consent/mui'
 *
 * const theme = createTheme({
 *   palette: {
 *     primary: { main: '#2e7d32' },
 *     background: { paper: '#fafafa' }
 *   }
 * })
 *
 * function App() {
 *   return (
 *     <ConsentProvider
 *       theme={theme}
 *       categories={{ enabledCategories: ['analytics'] }}
 *     >
 *       <YourApp />
 *     </ConsentProvider>
 *   )
 * }
 * ```
 *
 * @example Override de Componentes Padrão
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
 *       CookieBannerComponent={() => <div>Meu banner customizado</div>}
 *     >
 *       <YourApp />
 *     </ConsentProvider>
 *   )
 * }
 * ```
 *
 * @example Modo Headless (Desabilitando UI Padrão)
 * ```tsx
 * import { ConsentProvider } from '@react-lgpd-consent/mui'
 * import { useConsent } from '@react-lgpd-consent/core'
 *
 * function CustomUI() {
 *   const { acceptAll, rejectAll } = useConsent()
 *   return <div>Minha UI totalmente customizada</div>
 * }
 *
 * function App() {
 *   return (
 *     <ConsentProvider
 *       categories={{ enabledCategories: ['analytics'] }}
 *       disableDefaultModal={true}
 *       disableDefaultBanner={true}
 *       disableDefaultFloatingButton={true}
 *     >
 *       <CustomUI />
 *       <YourApp />
 *     </ConsentProvider>
 *   )
 * }
 * ```
 *
 * @example Com Callbacks de Eventos
 * ```tsx
 * function App() {
 *   return (
 *     <ConsentProvider
 *       categories={{ enabledCategories: ['analytics', 'marketing'] }}
 *       onConsentChange={(newState) => {
 *         console.log('Novo estado:', newState)
 *         // Enviar evento para analytics
 *       }}
 *       onPreferencesOpen={() => console.log('Modal aberto')}
 *       onPreferencesClose={() => console.log('Modal fechado')}
 *     >
 *       <YourApp />
 *     </ConsentProvider>
 *   )
 * }
 * ```
 *
 * @see {@link ConsentProviderCore} Para a versão headless sem UI
 * @see {@link PreferencesModal} Para o componente de modal usado por padrão
 * @see {@link CookieBanner} Para o componente de banner usado por padrão
 * @see {@link FloatingPreferencesButton} Para o botão flutuante usado por padrão
 * @see {@link https://mui.com/material-ui/customization/theming/ | MUI Theming Guide} Para customização de tema
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
}: Readonly<ConsentProviderProps>) {
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
