/**
 * @fileoverview
 * Componente CookieBanner - Banner principal de consentimento LGPD/ANPD.
 *
 * Este arquivo implementa o banner de cookies que aparece para usuários que ainda não
 * deram consentimento explícito. O componente é totalmente customizável via props
 * e tokens de design, suportando dois modos de exibição: bloqueante e não-bloqueante.
 *
 * ### Funcionalidades Principais
 * - Exibição automática baseada no estado de consentimento
 * - Suporte a modo bloqueante (modal) e não-bloqueante (snackbar)
 * - Integração completa com sistema de logging para debug
 * - Customização via Material-UI theme e design tokens
 * - Suporte a SSR com hidratação adequada
 * - Acessibilidade completa com ARIA labels
 *
 * @author Luciano Édipo
 * @version 0.4.1
 * @since 0.1.0
 */

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import type { PaperProps } from '@mui/material/Paper'
import Paper from '@mui/material/Paper'
import type { SnackbarProps } from '@mui/material/Snackbar'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import type { SxProps, Theme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import {
  logger,
  useConsent,
  useConsentHydration,
  useConsentTexts,
  useDesignTokens,
} from '@react-lgpd-consent/core'
import { Branding } from './Branding'

/**
 * Propriedades para customizar o comportamento e aparência do componente CookieBanner.
 *
 * @remarks
 * Esta interface permite controle completo sobre o banner de consentimento, desde
 * o comportamento de exibição até a customização visual avançada. O banner pode
 * operar em dois modos principais: bloqueante (modal) ou não-bloqueante (snackbar).
 *
 * ### Modos de Exibição
 * - **Bloqueante** (`blocking: true`): Banner como modal sobreposto, impede interação
 * - **Não-bloqueante** (`blocking: false`): Banner como snackbar, permite navegação
 *
 * ### Integração com Material-UI
 * - Suporte completo a theming via `ThemeProvider`
 * - Props diretas para componentes internos (`SnackbarProps`, `PaperProps`)
 * - Compatibilidade com design tokens customizados
 * - Responsividade automática em diferentes viewport sizes
 *
 * ### Debug e Desenvolvimento
 * - Prop `debug` força exibição independente do estado de consentimento
 * - Logging automático de interações do usuário quando ativo
 * - Suporte a React DevTools para inspecionar props
 *
 * @example Configuração básica
 * ```tsx
 * <CookieBanner
 *   policyLinkUrl="/privacy-policy"
 *   blocking={false}
 * />
 * ```
 *
 * @example Configuração avançada com customização
 * ```tsx
 * <CookieBanner
 *   policyLinkUrl="https://example.com/cookies"
 *   blocking={true}
 *   hideBranding={true}
 *   debug={process.env.NODE_ENV === 'development'}
 *   SnackbarProps={{
 *     anchorOrigin: { vertical: 'top', horizontal: 'center' }
 *   }}
 *   PaperProps={{
 *     elevation: 8,
 *     sx: { borderRadius: 2 }
 *   }}
 * />
 * ```
 *
 * @public
 * @since 0.1.0
 */
export interface CookieBannerProps {
  /**
   * URL para a política de privacidade ou cookies do site.
   *
   * @remarks
   * Quando fornecida, aparece como link "Política de Privacidade" no banner.
   * Link abre em nova aba/janela (`target="_blank"`) por segurança.
   *
   * @example "/privacy-policy" | "https://example.com/cookies"
   */
  policyLinkUrl?: string

  /**
   * URL para os termos de uso do site (opcional). Quando fornecida, será considerada uma rota "segura"
   * para não aplicar bloqueio total (overlay) mesmo em modo bloqueante.
   */
  termsLinkUrl?: string

  /**
   * Força exibição do banner em modo de debug, independente do consentimento.
   *
   * @remarks
   * Útil durante desenvolvimento para testar diferentes estados visuais.
   * **Nunca deixe `true` em produção** - causará exibição permanente do banner.
   *
   * @defaultValue false
   */
  debug?: boolean

  /**
   * Controla se o banner bloqueia interação com o restante da página.
   *
   * @remarks
   * - `true`: Banner como modal/overlay, bloqueia interação até decisão
   * - `false`: Banner como snackbar, permite navegação normal
   *
   * Banner bloqueante é mais eficaz para compliance, mas pode afetar UX.
   *
   * @defaultValue true
   */
  blocking?: boolean

  /**
   * Oculta a marca "fornecido por LÉdipO.eti.br" no banner.
   *
   * @remarks
   * A biblioteca é open-source e gratuita. O branding é uma forma de apoiar
   * o projeto, mas pode ser removido se necessário para sua marca.
   *
   * @defaultValue false
   */
  hideBranding?: boolean

  /**
   * Propriedades personalizadas para o componente Snackbar (modo não-bloqueante).
   *
   * @remarks
   * Aplica-se apenas quando `blocking={false}`. Permite customização completa
   * da posição, animação e comportamento do snackbar do Material-UI.
   *
   * @example
   * ```tsx
   * SnackbarProps={{
   *   anchorOrigin: { vertical: 'top', horizontal: 'center' },
   *   autoHideDuration: null, // Banner fica até decisão do usuário
   *   TransitionComponent: Slide
   * }}
   * ```
   */
  SnackbarProps?: Partial<SnackbarProps>

  /**
   * Propriedades personalizadas para o componente Paper que envolve o conteúdo.
   *
   * @remarks
   * Permite customização avançada da aparência: elevação, bordas, cores, etc.
   * Aplicado em ambos os modos (bloqueante e não-bloqueante).
   *
   * @example
   * ```tsx
   * PaperProps={{
   *   elevation: 12,
   *   sx: {
   *     borderRadius: '16px',
   *     border: '2px solid',
   *     borderColor: 'primary.main'
   *   }
   * }}
   * ```
   */
  PaperProps?: Partial<PaperProps>
}

/**
 * Banner principal de consentimento LGPD que solicita decisão do usuário sobre cookies.
 * @component
 * @category Components
 * @remarks
 * O CookieBanner é o ponto de entrada principal para interação com o sistema de consentimento.
 * Aparece automaticamente quando o usuário ainda não tomou decisão sobre cookies,
 * oferecendo opções claras de aceitar, rejeitar ou personalizar preferências.
 *
 * ### Funcionalidades Principais
 * - **Exibição condicional**: Aparece apenas se usuário não deu consentimento
 * - **Duas modalidades**: Bloqueante (modal) ou não-bloqueante (snackbar)
 * - **Ações do usuário**: Aceitar tudo, rejeitar tudo, ou abrir preferências
 * - **Link para política**: Opção de link para política de privacidade
 * - **Branding opcional**: Marca discreta "fornecido por LÉdipO.eti.br"
 * - **Totalmente customizável**: Via props, tokens de design ou componente próprio
 *
 * ### Estados de Exibição
 * - **Não exibido**: Usuário já consentiu ou ainda hidratando (SSR)
 * - **Snackbar**: Modo não-bloqueante, permite interação com a página
 * - **Modal**: Modo bloqueante, impede interação até decisão
 * - **Debug**: Sempre visível independente do estado (desenvolvimento)
 *
 * ### Integração com Sistema
 * - Conecta automaticamente com `ConsentProvider`
 * - Usa textos do `useConsentTexts()` para i18n
 * - Aplica design tokens do `useDesignTokens()`
 * - Registra todas as interações via sistema de logging
 * - Suporte completo a SSR com hidratação segura
 *
 * ### Substituição Personalizada
 * Para controle total, use `CookieBannerComponent` no ConsentProvider:
 *
 * ```tsx
 * function CustomBanner() {
 *   const { acceptAll, rejectAll } = useConsent();
 *   return <div>Meu banner customizado</div>;
 * }
 *
 * <ConsentProvider CookieBannerComponent={CustomBanner}>
 * ```
 *
 * @param props - Propriedades para customizar comportamento e aparência do banner (tipado via CookieBannerProps)
 * @returns Banner de consentimento ou `null` se não deve ser exibido
 *
 * @example Uso básico (renderizado automaticamente pelo ConsentProvider)
 * ```typescript
 * // ConsentProvider renderiza CookieBanner automaticamente
 * function App() {
 *   return (
 *     // ConsentProvider envolve a aplicação
 *     // CookieBanner aparece quando necessário
 *   );
 * }
 * ```
 *
 * @example Customização via props no ConsentProvider
 * ```typescript
 * // Configuração com propriedades customizadas
 * const bannerProps = {
 *   policyLinkUrl: "/privacy",
 *   blocking: false,
 *   hideBranding: true
 * };
 *
 * // ConsentProvider com cookieBannerProps
 * ```
 *
 * @example Uso manual com customização avançada
 * ```typescript
 * function App() {
 *   const bannerConfig = {
 *     policyLinkUrl: "https://example.com/cookies",
 *     blocking: true,
 *     PaperProps: { elevation: 8 },
 *     SnackbarProps: { anchorOrigin: { vertical: 'top' as const } }
 *   };
 *
 *   // Renderização manual com config avançada
 *   return null; // CookieBanner com bannerConfig
 * }
 * ```
 *
 * @see {@link ConsentProvider} - Provider que renderiza este componente automaticamente
 * @see {@link useConsent} - Hook para acessar funções de consentimento
 * @see {@link useConsentTexts} - Hook para textos personalizáveis
 * @see {@link CookieBannerProps} - Interface completa de propriedades
 *
 * @public
 * @since 0.1.0
 */
export function CookieBanner({
  policyLinkUrl,
  termsLinkUrl,
  debug,
  blocking = true,
  hideBranding = false,
  SnackbarProps,
  PaperProps,
}: Readonly<CookieBannerProps>) {
  const { consented, acceptAll, rejectAll, openPreferences } = useConsent()
  const texts = useConsentTexts()
  const isHydrated = useConsentHydration()
  const designTokens = useDesignTokens()

  const open = debug ? true : isHydrated && !consented

  logger.componentRender('CookieBanner', {
    open,
    consented,
    isHydrated,
    blocking,
    hideBranding,
  })

  if (!open) return null

  // Dynamic styles from design tokens
  /**
   * Inline style object for the cookie banner component.
   *
   * @remarks
   * Uses design tokens for consistent theming across the application.
   *
   * @property {number} p - Padding for the banner, defaults to 2 if not specified in design tokens.
   * @property {number} maxWidth - Maximum width of the banner in pixels.
   * @property {'auto'} mx - Horizontal margin set to 'auto' for centering.
   * @property {string | undefined} backgroundColor - Background color from design tokens.
   * @property {string | undefined} color - Text color from design tokens.
   * @property {string | number | undefined} borderRadius - Border radius for the banner from design tokens.
   * @property {string | undefined} fontFamily - Font family for the banner text from design tokens.
   */
  const bannerStyle: SxProps<Theme> = (theme) => ({
    p: designTokens?.spacing?.padding?.banner ?? 2,
    maxWidth: 720,
    mx: 'auto' as const,
    backgroundColor: designTokens?.colors?.background ?? theme.palette.background?.paper,
    color: designTokens?.colors?.text ?? theme.palette.text?.primary,
    borderRadius: designTokens?.spacing?.borderRadius?.banner,
    fontFamily: designTokens?.typography?.fontFamily,
  })

  /**
   * Conteúdo JSX do banner de cookies: mensagem, botões de ação e branding opcional.
   */
  const bannerContent = (
    <Paper elevation={3} sx={bannerStyle} {...PaperProps}>
      <Stack spacing={1}>
        <Typography variant="body2" sx={{ fontSize: designTokens?.typography?.fontSize?.banner }}>
          {texts.bannerMessage}{' '}
          {policyLinkUrl && (
            <Link
              href={policyLinkUrl}
              underline="hover"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: designTokens?.colors?.primary }}
            >
              {texts.policyLink ?? 'Saiba mais'}
            </Link>
          )}
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="flex-end">
          <Button
            variant="outlined"
            onClick={() => {
              logger.apiUsage('rejectAll', { source: 'banner' })
              rejectAll()
            }}
            sx={{ color: designTokens?.colors?.secondary }}
          >
            {texts.declineAll}
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              logger.apiUsage('acceptAll', { source: 'banner' })
              acceptAll()
            }}
            sx={{ backgroundColor: designTokens?.colors?.primary }}
          >
            {texts.acceptAll}
          </Button>
          <Button
            variant="text"
            onClick={() => {
              logger.apiUsage('openPreferences', { source: 'banner' })
              openPreferences()
            }}
            sx={{ color: designTokens?.colors?.text }}
          >
            {texts.preferences}
          </Button>
        </Stack>

        {!hideBranding && <Branding variant="banner" />}
      </Stack>
    </Paper>
  )

  /**
   * Estilos para posicionamento do banner de cookies.
   *
   * Fornece um objeto de estilos utilizado para fixar o banner na tela,
   * cobrindo toda a largura horizontal e sobrepondo outros elementos.
   *
   * Comportamento:
   * - position: "fixed" para torná-lo fixo em relação à viewport.
   * - zIndex: 1300 para garantir que o banner fique acima da maioria dos elementos.
   * - Define top: 0 quando designTokens.layout.position === "top", caso contrário define bottom: 0.
   * - left: 0 e right: 0 para estender o banner de ponta a ponta horizontalmente.
   * - width: utiliza designTokens.layout.width.desktop quando disponível; caso contrário, "100%".
   * - p: 2 representa shorthand de padding conforme a escala de espaçamento do tema/sistema de estilos.
   *
   * Observações:
   * - O campo `p` pressupõe uso de um sistema de estilos (por exemplo, Theme UI ou Material-UI `sx`) que interprete a escala de espaçamento.
   * - `designTokens` é consultado de forma defensiva (opcional), então valores padrão são aplicados quando ausentes.
   *
   * @constant positionStyle
   * @type {object}
   * @example
   * // Uso típico com um componente que aceita objeto de estilos/sx:
   * // <Box sx={positionStyle}>...</Box>
   */
  const positionStyle = {
    position: 'fixed',
    zIndex: 1300,
    ...(designTokens?.layout?.position === 'top' ? { top: 0 } : { bottom: 0 }),
    left: 0,
    right: 0,
    width: designTokens?.layout?.width?.desktop ?? '100%',
    p: 2,
  }

  /**
   * Cor do backdrop usado quando o banner está em modo bloqueante.
   *
   * @remarks
   * A cor é decidida de forma condicional conforme os tokens de design:
   * - Se `designTokens.layout.backdrop === false` => `'transparent'` (sem backdrop).
   * - Se `designTokens.layout.backdrop` for uma string => usa essa string como cor (ex.: `'#00000088'`).
   * - Caso contrário => padrão seguro `'rgba(0, 0, 0, 0.4)'`.
   *
   * Since v0.4.1: valor `'auto'` e comportamento padrão passam a ser sensíveis ao tema (dark/light).
   */
  const backdropToken = designTokens?.layout?.backdrop
  const resolveBackdropColor = (theme: { palette?: { mode?: 'dark' | 'light' } }): string => {
    if (backdropToken === false) return 'transparent'
    if (typeof backdropToken === 'string') {
      if (backdropToken.toLowerCase() === 'auto') {
        const isDark = theme?.palette?.mode === 'dark'
        return isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.4)'
      }
      return backdropToken
    }
    const isDark = theme?.palette?.mode === 'dark'
    return isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.4)'
  }

  // Rota segura: se a URL atual corresponder à política/termos, não aplicar overlay (SSR-safe)
  const isSafeRoute = (() => {
    try {
      if (typeof window === 'undefined') return false
      const current = new URL(window.location.href)
      const safeUrls = [policyLinkUrl, termsLinkUrl].filter(Boolean) as string[]
      return safeUrls.some((u) => {
        try {
          const target = new URL(u, current.origin)
          return target.pathname === current.pathname
        } catch {
          return false
        }
      })
    } catch {
      return false
    }
  })()

  const effectiveBlocking = blocking && !isSafeRoute

  if (effectiveBlocking) {
    return (
      <>
        <Box
          sx={(theme) => ({
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: resolveBackdropColor(theme),
            zIndex: 1299,
          })}
        />
        <Box sx={positionStyle}>{bannerContent}</Box>
      </>
    )
  }

  return (
    <Snackbar
      open={open}
      anchorOrigin={{
        vertical: designTokens?.layout?.position === 'top' ? 'top' : 'bottom',
        horizontal: 'center',
      }}
      {...SnackbarProps}
    >
      {bannerContent}
    </Snackbar>
  )
}
