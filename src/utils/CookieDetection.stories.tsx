import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import { ConsentProvider } from '../context/ConsentContext'
import { useConsent } from '../hooks/useConsent'
import { ConsentScriptLoader } from './ConsentScriptLoader'

const meta: Meta = {
  title: 'Internal/CookieDetection',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Demonstra o sistema de detecção e identificação de cookies em tempo real.
Simula diferentes integrações carregando e como a biblioteca detecta novos cookies.

**Funcionalidades demonstradas:**
- 🍪 Detecção automática de cookies criados pelos scripts
- 📊 Monitoramento em tempo real do document.cookie
- 🔄 Simulação de diferentes integrações (GA, GTM, Facebook, etc.)
- ⚡ Performance de detecção e categorização automática
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj

// Hook para monitorar cookies em tempo real
const useCookieMonitor = () => {
  const [cookies, setCookies] = React.useState<Record<string, string>>({})
  const [newCookies, setNewCookies] = React.useState<Set<string>>(new Set())

  React.useEffect(() => {
    const parseCookies = () => {
      const cookieString = document.cookie
      const parsed: Record<string, string> = {}

      if (cookieString) {
        cookieString.split(';').forEach((cookie) => {
          const [name, ...valueParts] = cookie.trim().split('=')
          if (name) {
            parsed[name] = valueParts.join('=') || ''
          }
        })
      }

      return parsed
    }

    const updateCookies = () => {
      const currentCookies = parseCookies()
      const currentKeys = Object.keys(currentCookies)
      const previousKeys = Object.keys(cookies)

      // Detectar novos cookies
      const newKeys = currentKeys.filter((key) => !previousKeys.includes(key))
      if (newKeys.length > 0) {
        setNewCookies((prev) => new Set([...prev, ...newKeys]))

        // Remover da lista de "novos" após 3 segundos
        const clearNewCookies = () => {
          setNewCookies((prev) => {
            const updated = new Set(prev)
            newKeys.forEach((key) => updated.delete(key))
            return updated
          })
        }
        setTimeout(clearNewCookies, 3000)
      }

      setCookies(currentCookies)
    }

    // Atualizar imediatamente
    updateCookies()

    // Monitorar mudanças a cada 500ms
    const interval = setInterval(updateCookies, 500)

    return () => clearInterval(interval)
  }, [cookies])

  return { cookies, newCookies }
}

// Componente para exibir tabela de cookies
const CookieTable: React.FC<{
  cookies: Record<string, string>
  newCookies: Set<string>
  integrations: Array<{ name: string; cookies: string[]; category: string }>
}> = ({ cookies, newCookies, integrations }) => {
  const getCookieCategory = (cookieName: string) => {
    for (const integration of integrations) {
      if (integration.cookies.includes(cookieName)) {
        return {
          category: integration.category,
          source: integration.name,
        }
      }
    }
    return { category: 'unknown', source: 'Desconhecido' }
  }

  const getCategoryColor = (category: string) => {
    if (category === 'necessary') return 'success'
    if (category === 'analytics') return 'info'
    if (category === 'marketing') return 'warning'
    if (category === 'functional') return 'secondary'
    return 'default'
  }

  const cookieEntries = Object.entries(cookies)

  if (cookieEntries.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="body2">
          📭 Nenhum cookie detectado ainda. Aguarde o carregamento das integrações...
        </Typography>
      </Alert>
    )
  }

  return (
    <TableContainer component={Paper} elevation={2} sx={{ mt: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.100' }}>
            <TableCell>
              <strong>🍪 Cookie</strong>
            </TableCell>
            <TableCell>
              <strong>📊 Categoria</strong>
            </TableCell>
            <TableCell>
              <strong>🏷️ Origem</strong>
            </TableCell>
            <TableCell>
              <strong>📄 Valor</strong>
            </TableCell>
            <TableCell>
              <strong>⏰ Status</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cookieEntries.map(([name, value]) => {
            const { category, source } = getCookieCategory(name)
            const isNew = newCookies.has(name)

            return (
              <TableRow
                key={name}
                sx={{
                  bgcolor: isNew ? 'success.50' : 'transparent',
                  '&:hover': { bgcolor: 'grey.50' },
                }}
              >
                <TableCell>
                  <Typography variant="body2" fontFamily="monospace" fontWeight="medium">
                    {name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={category} size="small" color={getCategoryColor(category)} />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {source}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    fontFamily="monospace"
                    sx={{
                      maxWidth: 200,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {value || '(vazio)'}
                  </Typography>
                </TableCell>
                <TableCell>
                  {isNew && <Chip label="🆕 NOVO" size="small" color="success" variant="filled" />}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

// Componente principal de demonstração
const CookieDetectionDemo: React.FC<{
  title: string
  description: string
  integrations: Array<{
    id: string
    src: string
    category: string
    name: string
    cookies: string[]
  }>
}> = ({ title, description, integrations }) => {
  const { preferences, consented } = useConsent()
  const { cookies, newCookies } = useCookieMonitor()
  const [loadingProgress, setLoadingProgress] = React.useState(0)

  // Simular progresso de carregamento
  React.useEffect(() => {
    const timer = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          return 100
        }
        return prev + 10
      })
    }, 200)

    return () => clearInterval(timer)
  }, [])

  const totalCookies = Object.keys(cookies).length
  const newCookiesCount = newCookies.size

  return (
    <Box sx={{ p: 3, bgcolor: 'grey.50', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom color="primary.main" fontWeight="bold">
        {title}
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {description}
      </Typography>

      {/* Status Cards */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <Card elevation={2} sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" color="primary.main" fontWeight="bold">
              🔍 Detecção em Tempo Real
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
              <Chip label={`${totalCookies} cookies`} color="info" variant="filled" />
              {newCookiesCount > 0 && (
                <Chip label={`${newCookiesCount} novos`} color="success" variant="filled" />
              )}
            </Stack>
          </CardContent>
        </Card>

        <Card elevation={2} sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" color="success.main" fontWeight="bold">
              ✅ Status do Consentimento
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 1 }}>
              <Chip
                label={consented ? 'Consentimento Dado' : 'Aguardando'}
                color={consented ? 'success' : 'warning'}
                size="small"
              />
              {Object.entries(preferences).map(([cat, enabled]) => (
                <Chip
                  key={cat}
                  label={`${cat}: ${enabled ? 'ON' : 'OFF'}`}
                  size="small"
                  color={enabled ? 'success' : 'default'}
                  variant={enabled ? 'filled' : 'outlined'}
                />
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      {/* Progress Bar */}
      {loadingProgress < 100 && (
        <Card elevation={2} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle2" gutterBottom>
              ⚡ Carregando Integrações... {loadingProgress}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={loadingProgress}
              color="primary"
              sx={{ height: 8, borderRadius: 4 }}
            />
          </CardContent>
        </Card>
      )}

      {/* Script Loader */}
      <ConsentScriptLoader integrations={integrations} />

      {/* Tabela de Cookies */}
      <Card elevation={2}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary.main" fontWeight="bold">
            🍪 Cookies Detectados ({totalCookies})
          </Typography>

          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>💡 Como funciona:</strong> O sistema monitora document.cookie a cada 500ms,
              detecta novos cookies automaticamente e os categoriza com base nas integrações
              carregadas. Cookies novos ficam destacados em verde por 3 segundos.
            </Typography>
          </Alert>

          <CookieTable
            cookies={cookies}
            newCookies={newCookies}
            integrations={integrations.map((i) => ({
              name: i.name,
              cookies: i.cookies,
              category: i.category,
            }))}
          />
        </CardContent>
      </Card>
    </Box>
  )
}

// Story 1: Google Analytics Detection
export const GoogleAnalyticsDetection: Story = {
  render: () => (
    <ConsentProvider
      categories={{
        enabledCategories: ['necessary', 'analytics'],
      }}
    >
      <CookieDetectionDemo
        title="🔍 Google Analytics - Detecção de Cookies"
        description="Simula carregamento do Google Analytics e detecta cookies _ga, _gid, _gat em tempo real"
        integrations={[
          {
            id: 'ga-detection',
            src: `data:text/javascript,
              // Simular criação de cookies do Google Analytics
              setTimeout(() => {
                document.cookie = '_ga=GA1.1.123456789.1234567890; path=/; max-age=63072000';
                document.cookie = '_gid=GA1.1.987654321.0987654321; path=/; max-age=86400';
                document.cookie = '_gat_gtag_UA_123456_1=1; path=/; max-age=60';
              }, 1000);
              
              setTimeout(() => {
                document.cookie = '_ga_MEASUREMENT_ID=GS1.1.123.456; path=/; max-age=63072000';
              }, 2000);
            `,
            category: 'analytics',
            name: 'Google Analytics',
            cookies: ['_ga', '_gid', '_gat', '_ga_MEASUREMENT_ID', '_gat_gtag_UA_123456_1'],
          },
        ]}
      />
    </ConsentProvider>
  ),
}

// Story 2: Multi-Integration Detection
export const MultiIntegrationDetection: Story = {
  render: () => (
    <ConsentProvider
      categories={{
        enabledCategories: ['necessary', 'analytics', 'marketing', 'functional'],
      }}
    >
      <CookieDetectionDemo
        title="🚀 Multi-Integrações - Detecção Simultânea"
        description="Simula múltiplas integrações (GA, Facebook, Hotjar) carregando simultaneamente"
        integrations={[
          {
            id: 'ga-multi',
            src: `data:text/javascript,
              setTimeout(() => {
                document.cookie = '_ga=GA1.1.111111111.1111111111; path=/';
                document.cookie = '_gid=GA1.1.222222222.2222222222; path=/';
              }, 800);
            `,
            category: 'analytics',
            name: 'Google Analytics',
            cookies: ['_ga', '_gid'],
          },
          {
            id: 'fb-multi',
            src: `data:text/javascript,
              setTimeout(() => {
                document.cookie = '_fbp=fb.1.123456789.987654321; path=/; max-age=7776000';
                document.cookie = '_fbc=fb.1.123456789.abcdef123; path=/; max-age=7776000';
              }, 1200);
            `,
            category: 'marketing',
            name: 'Facebook Pixel',
            cookies: ['_fbp', '_fbc'],
          },
          {
            id: 'hotjar-multi',
            src: `data:text/javascript,
              setTimeout(() => {
                document.cookie = '_hjSessionUser_123456=eyJpZCI6ImFiYzEyMyJ9; path=/';
                document.cookie = '_hjSession_123456=eyJpZCI6ImRlZjQ1NiJ9; path=/';
              }, 1600);
            `,
            category: 'functional',
            name: 'Hotjar',
            cookies: [
              '_hjSessionUser_123456',
              '_hjSession_123456',
              '_hjIncludedInPageviewSample',
              '_hjIncludedInSessionSample',
            ],
          },
        ]}
      />
    </ConsentProvider>
  ),
}

// Story 3: E-commerce Tracking Detection
export const ECommerceDetection: Story = {
  render: () => (
    <ConsentProvider
      categories={{
        enabledCategories: ['necessary', 'analytics', 'marketing'],
      }}
    >
      <CookieDetectionDemo
        title="🛒 E-commerce - Tracking Completo"
        description="Simula ambiente de e-commerce com GA Enhanced E-commerce, Facebook Pixel e remarketing"
        integrations={[
          {
            id: 'ga-ecommerce',
            src: `data:text/javascript,
              setTimeout(() => {
                document.cookie = '_ga=GA1.1.ecom123.ecom456; path=/';
                document.cookie = '_gid=GA1.1.shop789.shop012; path=/';
              }, 500);
              setTimeout(() => {
                document.cookie = '_dc_gtm_UA-12345678-1=1; path=/; max-age=60';
              }, 1500);
            `,
            category: 'analytics',
            name: 'GA Enhanced E-commerce',
            cookies: ['_ga', '_gid', '_dc_gtm_UA-12345678-1'],
          },
          {
            id: 'fb-ecommerce',
            src: `data:text/javascript,
              setTimeout(() => {
                document.cookie = '_fbp=fb.1.ecom.pixel123; path=/';
                document.cookie = '_fbc=fb.1.ecom.conv456; path=/';
              }, 1000);
            `,
            category: 'marketing',
            name: 'Facebook Pixel + Conversions API',
            cookies: ['_fbp', '_fbc'],
          },
          {
            id: 'custom-ecommerce',
            src: `data:text/javascript,
              setTimeout(() => {
                document.cookie = 'cart_session=sess_789abc; path=/; max-age=3600';
                document.cookie = 'user_segment=returning_customer; path=/; max-age=2592000';
              }, 1800);
            `,
            category: 'functional',
            name: 'Custom E-commerce Tracking',
            cookies: ['cart_session', 'user_segment', 'last_viewed_products'],
          },
        ]}
      />
    </ConsentProvider>
  ),
}

// Story 4: Performance Monitoring
export const PerformanceMonitoring: Story = {
  render: () => (
    <ConsentProvider
      categories={{
        enabledCategories: ['necessary', 'analytics'],
      }}
    >
      <CookieDetectionDemo
        title="⚡ Performance - Monitoramento Intensivo"
        description="Testa a detecção com muitos cookies sendo criados rapidamente"
        integrations={[
          {
            id: 'performance-test',
            src: `data:text/javascript,
              // Criar muitos cookies rapidamente para testar performance
              let counter = 0;
              const createCookies = () => {
                for (let i = 0; i < 5; i++) {
                  counter++;
                  setTimeout(() => {
                    document.cookie = \`perf_cookie_\${counter}=value_\${counter}_\${Date.now()}; path=/; max-age=3600\`;
                  }, i * 100);
                }
              };
              
              // Criar lotes a cada 2 segundos
              createCookies();
              setTimeout(createCookies, 2000);
              setTimeout(createCookies, 4000);
              setTimeout(createCookies, 6000);
            `,
            category: 'analytics',
            name: 'Performance Test Suite',
            cookies: Array.from({ length: 20 }, (_, i) => `perf_cookie_${i + 1}`),
          },
        ]}
      />
    </ConsentProvider>
  ),
}
