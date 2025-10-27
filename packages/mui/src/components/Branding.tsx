import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { useConsentTexts, useDesignTokens } from '@react-lgpd-consent/core'
import * as React from 'react'

/**
 * Propriedades para o componente Branding.
 *
 * @remarks
 * Define como o branding da biblioteca ("fornecido por LÉdipO.eti.br")
 * será exibido em diferentes contextos (banner ou modal).
 *
 * @category Components
 * @public
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * <Branding variant="banner" />
 * <Branding variant="modal" hidden={true} />
 * ```
 */
export interface BrandingProps {
  /**
   * Variante de exibição do branding.
   *
   * @remarks
   * - `banner`: Estilo otimizado para o CookieBanner (menor, alinhado à direita)
   * - `modal`: Estilo otimizado para o PreferencesModal (com padding lateral)
   *
   * Cada variante aplica estilos específicos de tamanho, alinhamento e espaçamento.
   */
  variant: 'banner' | 'modal'

  /**
   * Se `true`, oculta completamente o componente.
   *
   * @remarks
   * Útil para controlar a visibilidade do branding dinamicamente sem
   * remover o componente da árvore React.
   *
   * @defaultValue false
   */
  hidden?: boolean
}

const brandingStyles = {
  banner: {
    fontSize: '0.65rem',
    textAlign: 'right' as const,
    mt: 1,
    opacity: 0.7,
    fontStyle: 'italic',
    width: '100%',
  },
  modal: {
    fontSize: '0.65rem',
    textAlign: 'right' as const,
    px: 3,
    pb: 1,
    opacity: 0.7,
    fontStyle: 'italic',
    width: '100%',
  },
}

const linkStyles = {
  textDecoration: 'none',
  fontWeight: 500,
  '&:hover': {
    textDecoration: 'underline',
  },
}

/**
 * Componente de branding que exibe crédito "fornecido por LÉdipO.eti.br".
 *
 * @component
 * @category Components
 * @public
 * @since 1.0.0
 *
 * @remarks
 * Este componente exibe uma assinatura discreta da biblioteca em banners e modais.
 * É open-source e gratuito - o branding é uma forma de apoiar o projeto.
 *
 * ### Características
 * - **Memoizado**: Evita re-renders desnecessários (props são estáveis)
 * - **Design tokens**: Respeita cores customizadas do contexto
 * - **Responsivo**: Adapta-se ao tema light/dark automaticamente
 * - **SSR-safe**: Compatível com Server-Side Rendering
 * - **Acessibilidade**: Link com `rel="noopener noreferrer"` para segurança
 *
 * ### Estilos por Variante
 * - **Banner**: Menor (0.65rem), alinhado à direita, margem superior
 * - **Modal**: Menor (0.65rem), alinhado à direita, padding lateral e inferior
 *
 * ### Visibilidade
 * Pode ser ocultado via:
 * - Prop `hidden={true}` (controle direto)
 * - Prop `hideBranding={true}` no ConsentProvider (afeta todos os componentes)
 *
 * @param props - Propriedades do componente (tipado via BrandingProps)
 * @returns Elemento JSX do branding ou null se oculto
 *
 * @example Uso no banner
 * ```tsx
 * <Branding variant="banner" />
 * ```
 *
 * @example Uso no modal
 * ```tsx
 * <Branding variant="modal" />
 * ```
 *
 * @example Oculto dinamicamente
 * ```tsx
 * const [showBranding, setShowBranding] = useState(true)
 * <Branding variant="banner" hidden={!showBranding} />
 * ```
 *
 * @example Ocultar via Provider
 * ```tsx
 * <ConsentProvider
 *   categories={{ enabledCategories: ['analytics'] }}
 *   hideBranding={true}
 * >
 *   <App />
 * </ConsentProvider>
 * ```
 *
 * @see {@link BrandingProps} - Interface de propriedades
 * @see {@link CookieBanner} - Usa este componente internamente
 * @see {@link PreferencesModal} - Usa este componente internamente
 */
export const Branding = React.memo(function Branding({
  variant,
  hidden = false,
}: Readonly<BrandingProps>) {
  const texts = useConsentTexts()
  const designTokens = useDesignTokens()
  if (hidden) return null

  return (
    <Typography
      variant="caption"
      sx={(theme) => ({
        ...brandingStyles[variant],
        color: designTokens?.colors?.text ?? theme.palette.text.secondary,
      })}
    >
      {texts.brandingPoweredBy || 'fornecido por'}{' '}
      <Link
        href="https://www.ledipo.eti.br"
        target="_blank"
        rel="noopener noreferrer"
        sx={(theme) => ({
          ...linkStyles,
          color: designTokens?.colors?.primary ?? theme.palette.primary.main,
        })}
      >
        LÉdipO.eti.br
      </Link>
    </Typography>
  )
})
