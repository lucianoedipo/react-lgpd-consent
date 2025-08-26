import { useConsentTexts } from '../hooks/useConsent'
import { useDesignTokens } from '../context/DesignContext'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

interface BrandingProps {
  variant: 'banner' | 'modal'
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

export function Branding({ variant, hidden = false }: Readonly<BrandingProps>) {
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
}
