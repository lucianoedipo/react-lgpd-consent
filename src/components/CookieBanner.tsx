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

export interface CookieBannerProps {
  policyLinkUrl?: string
  debug?: boolean
  blocking?: boolean
  hideBranding?: boolean
  SnackbarProps?: Partial<SnackbarProps>
  PaperProps?: Partial<PaperProps>
}

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
            onClick={rejectAll}
            sx={{ color: designTokens?.colors?.secondary }}
          >
            {texts.declineAll}
          </Button>
          <Button
            variant="contained"
            onClick={acceptAll}
            sx={{ backgroundColor: designTokens?.colors?.primary }}
          >
            {texts.acceptAll}
          </Button>
          <Button
            variant="text"
            onClick={openPreferences}
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
    ...(designTokens?.layout?.position === 'top'
      ? { top: 0 }
      : { bottom: 0 }),
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