import CookieOutlined from '@mui/icons-material/CookieOutlined'
import type { FabProps } from '@mui/material/Fab'
import Fab from '@mui/material/Fab'
import Tooltip from '@mui/material/Tooltip'
import { useTheme } from '@mui/material/styles'
import {
  logger,
  resolveTexts,
  useConsent,
  useConsentTexts,
  useDesignTokens,
  type AdvancedConsentTexts,
} from '@react-lgpd-consent/core'
import * as React from 'react'

/**
 * Função utilitária para acessar propriedades de tema com fallbacks seguros.
 * Evita erros quando o ThemeProvider não está configurado corretamente.
 * @category Utils
 * @returns {Object} Objeto com propriedades de tema seguras, incluindo palette e transitions.
 * @remarks Utiliza logger para compatibilidade de tema. Compatível com SSR.
 */
function useThemeWithFallbacks() {
  const theme = useTheme()

  // Log para debug de compatibilidade de tema
  logger.themeCompatibility(theme)

  return {
    palette: {
      primary: {
        main: theme?.palette?.primary?.main || '#1976d2',
        dark: theme?.palette?.primary?.dark || '#1565c0',
      },
    },
    transitions: {
      duration: {
        shortest: theme?.transitions?.duration?.shortest || 150,
        short: theme?.transitions?.duration?.short || 250,
      },
    },
  }
}

/**
 * Propriedades para customizar o comportamento e aparência do FloatingPreferencesButton.
 *
 * @remarks
 * Interface que permite controle completo sobre o botão flutuante de preferências LGPD.
 * O botão aparece após o consentimento inicial para permitir que usuários revisitem
 * suas escolhas a qualquer momento.
 *
 * ### Posicionamento
 * Suporta 4 posições fixas na tela:
 * - `bottom-left`: Canto inferior esquerdo
 * - `bottom-right`: Canto inferior direito (padrão)
 * - `top-left`: Canto superior esquerdo
 * - `top-right`: Canto superior direito
 *
 * ### Customização Visual
 * - **Ícone**: Pode ser substituído por qualquer `ReactNode`
 * - **Tooltip**: Texto exibido ao hover (padrão vem de `useConsentTexts`)
 * - **Cores**: Respeita design tokens ou tema MUI
 * - **Offset**: Distância da borda em pixels
 *
 * ### Comportamento
 * - **Auto-hide**: Opcional via `hideWhenConsented` (padrão: `false`)
 * - **Z-index**: 1200 (acima de conteúdo normal, abaixo de modais MUI)
 * - **Transições**: Suaves via tema MUI
 *
 * @category Components
 * @public
 * @since 0.3.0
 *
 * @example Configuração básica
 * ```tsx
 * <FloatingPreferencesButton
 *   position="bottom-left"
 *   offset={16}
 * />
 * ```
 *
 * @example Customização avançada
 * ```tsx
 * import SettingsIcon from '@mui/icons-material/Settings'
 *
 * <FloatingPreferencesButton
 *   position="top-right"
 *   offset={32}
 *   icon={<SettingsIcon />}
 *   tooltip="Configurações de Privacidade"
 *   hideWhenConsented={true}
 *   FabProps={{
 *     size: 'large',
 *     color: 'secondary',
 *     sx: { boxShadow: 3 }
 *   }}
 * />
 * ```
 */
export interface FloatingPreferencesButtonProps {
  /**
   * Posição do botão flutuante na tela.
   *
   * @remarks
   * Define o canto da viewport onde o botão será fixado.
   * Usa `position: fixed` e responde a scroll da página.
   *
   * @defaultValue 'bottom-right'
   */
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'

  /**
   * Offset (distância) da borda em pixels.
   *
   * @remarks
   * Aplicado tanto horizontal quanto verticalmente dependendo da posição.
   * Exemplo: `offset={24}` em `bottom-right` = 24px da direita e 24px do fundo.
   *
   * @defaultValue 24
   */
  offset?: number

  /**
   * Ícone customizado para o botão.
   *
   * @remarks
   * Pode ser qualquer ReactNode: ícone do MUI, SVG, imagem, texto, etc.
   * Se omitido, usa `<CookieOutlined />` do Material-UI Icons.
   *
   * @defaultValue `<CookieOutlined />`
   *
   * @example
   * ```tsx
   * import SettingsIcon from '@mui/icons-material/Settings'
   * <FloatingPreferencesButton icon={<SettingsIcon />} />
   * ```
   */
  icon?: React.ReactNode

  /**
   * Tooltip customizado exibido ao passar o mouse.
   *
   * @remarks
   * Se omitido, usa o valor de `texts.preferencesButton` do contexto,
   * com fallback para "Gerenciar Preferências de Cookies".
   *
   * @defaultValue undefined (usa texto do contexto)
   *
   * @example
   * ```tsx
   * <FloatingPreferencesButton tooltip="Configurações de Privacidade" />
   * ```
   */
  tooltip?: string

  /**
   * Props adicionais para o componente Fab do Material-UI.
   *
   * @remarks
   * Permite customização completa do botão: tamanho, cor, elevação, sx, etc.
   * Props passadas aqui sobrescrevem os defaults internos.
   *
   * @defaultValue undefined
   *
   * @example
   * ```tsx
   * <FloatingPreferencesButton
   *   FabProps={{
   *     size: 'large',
   *     color: 'secondary',
   *     variant: 'extended',
   *     sx: { borderRadius: 2 }
   *   }}
   * />
   * ```
   */
  FabProps?: Partial<FabProps>

  /**
   * Se deve esconder o botão quando consentimento já foi dado.
   *
   * @remarks
   * Útil para reduzir poluição visual após decisão inicial.
   * Quando `true`, botão só aparece se `consented === false`.
   *
   * **Importante**: Mesmo escondido, usuário pode reabrir preferências
   * via outras formas (ex: link no footer, menu de configurações).
   *
   * @defaultValue false
   */
  hideWhenConsented?: boolean

  /**
   * Textos customizados para o botão flutuante.
   */
  texts?: Partial<AdvancedConsentTexts>

  /**
   * Idioma local para resolver `texts.i18n`.
   */
  language?: 'pt' | 'en' | 'es' | 'fr' | 'de' | 'it'

  /**
   * Variação de tom local para resolver `texts.variants`.
   */
  textVariant?: 'formal' | 'casual' | 'concise' | 'detailed'
}

/**
 * Componente interno do botão flutuante de preferências.
 * @internal
 * @category Components
 * @param {FloatingPreferencesButtonProps} props - Propriedades do componente.
 * @returns {JSX.Element | null} Elemento JSX do botão ou null se oculto.
 * @remarks Memoiza estilos de posição para performance. Usa design tokens defensivamente.
 */
function FloatingPreferencesButtonComponent({
  position = 'bottom-right',
  offset = 24,
  icon = <CookieOutlined />,
  tooltip,
  FabProps,
  hideWhenConsented = false,
  texts: textsProp,
  language,
  textVariant,
}: Readonly<FloatingPreferencesButtonProps>) {
  const { openPreferences, consented } = useConsent()
  const baseTexts = useConsentTexts()
  const mergedTexts = React.useMemo(
    () => ({ ...baseTexts, ...(textsProp ?? {}) }),
    [baseTexts, textsProp],
  )
  const texts = React.useMemo(
    () => resolveTexts(mergedTexts, { language, variant: textVariant }),
    [mergedTexts, language, textVariant],
  )
  const safeTheme = useThemeWithFallbacks()
  const designTokens = useDesignTokens()

  // Memoizar positionStyles ANTES de qualquer early return
  const positionStyles = React.useMemo(() => {
    const styles: React.CSSProperties = {
      position: 'fixed',
      zIndex: 1200,
    }

    switch (position) {
      case 'bottom-left':
        return { ...styles, bottom: offset, left: offset }
      case 'bottom-right':
        return { ...styles, bottom: offset, right: offset }
      case 'top-left':
        return { ...styles, top: offset, left: offset }
      case 'top-right':
        return { ...styles, top: offset, right: offset }
      default:
        return { ...styles, bottom: offset, right: offset }
    }
  }, [position, offset])

  logger.componentRender('FloatingPreferencesButton', {
    position,
    offset,
    hideWhenConsented,
    consented,
  })

  if (hideWhenConsented && consented) {
    logger.debug(
      'FloatingPreferencesButton: Hidden due to hideWhenConsented=true and consented=true',
    )
    return null
  }

  const tooltipText = tooltip ?? texts.preferencesButton ?? 'Gerenciar Preferências de Cookies'

  return (
    <Tooltip title={tooltipText} placement="top">
      <Fab
        size="medium"
        color="primary"
        onClick={openPreferences}
        sx={{
          ...positionStyles,
          backgroundColor: designTokens?.colors?.primary ?? safeTheme.palette.primary.main,
          '&:hover': {
            backgroundColor: designTokens?.colors?.primary
              ? designTokens?.colors?.primary
              : safeTheme.palette.primary.dark,
          },
          transition: `all ${safeTheme.transitions.duration.short}ms`,
        }}
        aria-label={tooltipText}
        {...FabProps}
      >
        {icon}
      </Fab>
    </Tooltip>
  )
}

/**
 * Botão flutuante (FAB) para reabrir o modal de preferências de consentimento LGPD.
 *
 * @component
 * @category Components
 * @public
 * @since 0.3.0
 *
 * @remarks
 * Este componente fornece acesso rápido e sempre visível às preferências de consentimento,
 * permitindo que usuários revisem e alterem suas escolhas a qualquer momento.
 *
 * ### Renderização Automática
 * O botão é renderizado automaticamente pelo `ConsentProvider` após o consentimento inicial,
 * a menos que desabilitado via `disableFloatingPreferencesButton={true}`.
 *
 * ### Funcionalidades
 * - **Posição fixa**: Permanece visível durante scroll
 * - **Z-index 1200**: Fica acima do conteúdo normal, abaixo de modais
 * - **Tooltip acessível**: ARIA label e tooltip ao hover
 * - **Responsivo**: Funciona em mobile e desktop
 * - **Transições suaves**: Animação de cor ao hover via tema MUI
 * - **Design tokens**: Respeita cores customizadas do contexto
 *
 * ### Customização
 * Você pode:
 * - Alterar posição e offset
 * - Trocar o ícone padrão (cookie)
 * - Modificar tooltip
 * - Ocultar quando já consentido
 * - Passar props customizadas para o Fab do MUI
 *
 * ### Substituição Completa
 * Para controle total, passe seu próprio componente:
 *
 * ```tsx
 * function MyCustomButton() {
 *   const { openPreferences } = useConsent()
 *   return <button onClick={openPreferences}>Preferências</button>
 * }
 *
 * <ConsentProvider
 *   FloatingPreferencesButtonComponent={MyCustomButton}
 * >
 *   <App />
 * </ConsentProvider>
 * ```
 *
 * @param props - Propriedades para customizar o botão (tipado via FloatingPreferencesButtonProps)
 * @returns Elemento JSX do botão flutuante ou null se oculto
 *
 * @throws {Error} Se usado fora do ConsentProvider (contexto não disponível)
 *
 * @example Uso básico (renderizado automaticamente)
 * ```tsx
 * // ConsentProvider já renderiza FloatingPreferencesButton automaticamente
 * <ConsentProvider categories={{ enabledCategories: ['analytics'] }}>
 *   <App />
 * </ConsentProvider>
 * ```
 *
 * @example Customização via props no Provider
 * ```tsx
 * <ConsentProvider
 *   categories={{ enabledCategories: ['analytics'] }}
 *   floatingPreferencesButtonProps={{
 *     position: 'bottom-left',
 *     offset: 16,
 *     hideWhenConsented: true
 *   }}
 * >
 *   <App />
 * </ConsentProvider>
 * ```
 *
 * @example Uso manual com ícone customizado
 * ```tsx
 * import SettingsIcon from '@mui/icons-material/Settings'
 *
 * function App() {
 *   return (
 *     <FloatingPreferencesButton
 *       position="top-right"
 *       icon={<SettingsIcon />}
 *       tooltip="Configurações de Privacidade"
 *       FabProps={{
 *         size: 'large',
 *         color: 'secondary'
 *       }}
 *     />
 *   )
 * }
 * ```
 *
 * @example Desabilitar completamente
 * ```tsx
 * <ConsentProvider
 *   categories={{ enabledCategories: ['analytics'] }}
 *   disableFloatingPreferencesButton={true}
 * >
 *   <App />
 * </ConsentProvider>
 * ```
 *
 * @see {@link ConsentProvider} - Provider que renderiza este componente automaticamente
 * @see {@link useConsent} - Hook para acessar função openPreferences
 * @see {@link FloatingPreferencesButtonProps} - Interface completa de propriedades
 * @see {@link PreferencesModal} - Modal aberto ao clicar no botão
 */
export const FloatingPreferencesButton = React.memo(FloatingPreferencesButtonComponent)
FloatingPreferencesButton.displayName = 'FloatingPreferencesButton'
