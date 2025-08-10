import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

interface BrandingProps {
  variant: 'banner' | 'modal'
  hidden?: boolean
}

const brandingStyles = {
  banner: {
    fontSize: '0.65rem',
    textAlign: 'center' as const,
    mt: 1,
    opacity: 0.7,
    fontStyle: 'italic',
  },
  modal: {
    fontSize: '0.65rem',
    textAlign: 'center' as const,
    px: 3,
    pb: 1,
    opacity: 0.7,
    fontStyle: 'italic',
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
  if (hidden) return null

  return (
    <Typography
      variant="caption"
      sx={(theme) => ({
        ...brandingStyles[variant],
        color: theme.palette.text.secondary,
      })}
    >
      fornecido por{' '}
      <Link
        href="https://ledipo.eti.br"
        target="_blank"
        rel="noopener noreferrer"
        sx={(theme) => ({
          ...linkStyles,
          color: theme.palette.primary.main,
        })}
      >
        LÉdipO.eti.br
      </Link>
    </Typography>
  )
}
