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
import { Branding } from './Branding'

export interface CookieBannerProps {
  policyLinkUrl?: string
  debug?: boolean
  blocking?: boolean // Se true, bloqueia interação até escolher uma opção
  hideBranding?: boolean // Se true, esconde "fornecido por LÉdipO.eti.br"
  SnackbarProps?: Partial<SnackbarProps>
  PaperProps?: Partial<PaperProps>
}

export function CookieBanner({
  policyLinkUrl,
  debug,
  blocking = true, // Por padrão, bloqueia até decisão
  hideBranding = false,
  SnackbarProps,
  PaperProps,
}: Readonly<CookieBannerProps>) {
  const { consented, acceptAll, rejectAll, openPreferences } = useConsent()
  const texts = useConsentTexts()
  const isHydrated = useConsentHydration()

  // Só mostra o banner após hidratação E se não há consentimento (ou debug ativo)
  const open = debug ? true : isHydrated && !consented

  if (!open) return null

  const bannerContent = (
    <Paper
      elevation={3}
      sx={{ p: 2, maxWidth: 720, mx: 'auto' }}
      {...PaperProps}
    >
      <Stack spacing={1}>
        <Typography variant="body2">
          {texts.bannerMessage}{' '}
          {policyLinkUrl && (
            <Link
              href={policyLinkUrl}
              underline="hover"
              target="_blank"
              rel="noopener noreferrer"
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
          <Button variant="outlined" onClick={rejectAll}>
            {texts.declineAll}
          </Button>
          <Button variant="contained" onClick={acceptAll}>
            {texts.acceptAll}
          </Button>
          <Button variant="text" onClick={openPreferences}>
            {texts.preferences}
          </Button>
        </Stack>

        {/* Branding */}
        {!hideBranding && <Branding variant="banner" />}
      </Stack>
    </Paper>
  )

  if (blocking) {
    // Modo bloqueante com overlay escuro, mas banner na parte inferior
    return (
      <>
        {/* Overlay que bloqueia interação */}
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1299, // Abaixo do banner mas acima do conteúdo
          }}
        />
        {/* Banner na parte inferior */}
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1300, // Acima do overlay
            p: 2,
          }}
        >
          {bannerContent}
        </Box>
      </>
    )
  }

  // Modo não bloqueante (Snackbar padrão)
  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      {...SnackbarProps}
    >
      {bannerContent}
    </Snackbar>
  )
}
