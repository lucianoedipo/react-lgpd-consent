import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import type { PaperProps } from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import type { SnackbarProps } from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useConsent, useConsentTexts } from '../hooks/useConsent'

export interface CookieBannerProps {
  policyLinkUrl?: string
  debug?: boolean
  SnackbarProps?: Partial<SnackbarProps>
  PaperProps?: Partial<PaperProps>
}

export function CookieBanner({
  policyLinkUrl,
  debug,
  SnackbarProps,
  PaperProps,
}: Readonly<CookieBannerProps>) {
  const { consented, acceptAll, rejectAll, openPreferences } = useConsent()
  const texts = useConsentTexts()

  const open = debug ? true : !consented

  if (!open) return null

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      {...SnackbarProps}
    >
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
        </Stack>
      </Paper>
    </Snackbar>
  )
}
