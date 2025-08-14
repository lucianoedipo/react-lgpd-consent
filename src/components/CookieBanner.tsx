import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import type { PaperProps } from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import type { SnackbarProps } from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import React from 'react'
import {
  useConsent,
  useConsentTexts,
  useConsentHydration,
} from '../hooks/useConsent'
import { useDesignTokens } from '../context/DesignContext'
import { Branding } from './Branding'
import { logger } from '../utils/logger'

/**
 * @interface CookieBannerProps
 * Propriedades para customizar o componente `CookieBanner`.
 */
export interface CookieBannerProps {
  /** URL para a política de privacidade ou cookies do seu site. */
  policyLinkUrl?: string
  /** Se `true`, o banner será exibido em modo de depuração, independentemente do estado de consentimento. */
  debug?: boolean
  /** Se `true`, o banner bloqueia a interação com o restante da página até que o usuário tome uma decisão. Padrão: `true`. */
  blocking?: boolean
  /** Se `true`, oculta a marca "fornecido por LÉdipO.eti.br" no banner. Padrão: `false`. */
  hideBranding?: boolean
  /** Propriedades adicionais para o componente `Snackbar` do Material-UI, quando o banner não é bloqueante. */
  SnackbarProps?: Partial<SnackbarProps>
  /** Propriedades adicionais para o componente `Paper` do Material-UI que envolve o conteúdo do banner. */
  PaperProps?: Partial<PaperProps>
}

/**
 * @component
 * O `CookieBanner` é o componente de UI que solicita o consentimento inicial do usuário.
 * Ele é renderizado automaticamente pelo `ConsentProvider` quando o consentimento ainda não foi dado.
 *
 * @remarks
 * Você pode substituir este componente padrão passando seu próprio componente para a prop `CookieBannerComponent`
 * no `ConsentProvider` para ter controle total sobre a aparência e o comportamento do banner.
 *
 * @param {Readonly<CookieBannerProps>} props As propriedades para customizar o banner.
 * @returns {JSX.Element | null} O componente do banner ou `null` se não for necessário exibi-lo.
 */
export function CookieBanner({
  policyLinkUrl,
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
  const bannerStyle = {
    p: designTokens?.spacing?.padding?.banner ?? 2,
    maxWidth: 720,
    mx: 'auto',
    backgroundColor: designTokens?.colors?.background,
    color: designTokens?.colors?.text,
    borderRadius: designTokens?.spacing?.borderRadius?.banner,
    fontFamily: designTokens?.typography?.fontFamily,
  }

  const bannerContent = (
    <Paper elevation={3} sx={bannerStyle} {...PaperProps}>
      <Stack spacing={1}>
        <Typography
          variant="body2"
          sx={{ fontSize: designTokens?.typography?.fontSize?.banner }}
        >
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
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          justifyContent="flex-end"
        >
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

  const positionStyle = {
    position: 'fixed',
    zIndex: 1300,
    ...(designTokens?.layout?.position === 'top' ? { top: 0 } : { bottom: 0 }),
    left: 0,
    right: 0,
    width: designTokens?.layout?.width?.desktop ?? '100%',
    p: 2,
  }

  if (blocking) {
    return (
      <>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: designTokens?.layout?.backdrop
              ? 'rgba(0, 0, 0, 0.5)'
              : 'transparent',
            zIndex: 1299,
          }}
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
