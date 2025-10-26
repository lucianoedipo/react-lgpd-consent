import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { ConsentProvider, ConsentScriptLoader, useConsent } from '@react-lgpd-consent/core'
import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

const meta: Meta = {
  title: 'Internal/DeveloperGuidance',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Demonstra o sistema de DeveloperGuidance em diferentes cenários de configuração.
Abra o **Console do Browser** para ver os avisos e sugestões em tempo real.

**Funcionalidades demonstradas:**
- ✅ Configurações problemáticas e seus avisos
- 💡 Sugestões contextuais baseadas no uso
- 📊 Tabelas de categorias ativas
- 🔄 Sistema de cache (cada config é logada apenas 1x)
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj

// Componente para demonstrar logs no console
const GuidanceConsoleDemo = ({
  title,
  description,
  expectedLogs,
}: {
  title: string
  description: string
  expectedLogs: string[]
}) => {
  const { preferences, consented } = useConsent()

  return (
    <Card elevation={3} sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom color="primary.main" fontWeight="bold">
          {title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>

        {/* Status atual */}
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
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

        {/* Logs esperados */}
        <Paper elevation={1} sx={{ p: 2, bgcolor: 'grey.50' }}>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
            🖥️ Logs Esperados no Console:
          </Typography>
          {expectedLogs.map((log) => (
            <Typography
              key={log}
              variant="body2"
              component="code"
              sx={{
                display: 'block',
                fontFamily: 'monospace',
                color: 'text.secondary',
                mb: 0.5,
              }}
            >
              {log}
            </Typography>
          ))}
        </Paper>

        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            💡 <strong>Dica:</strong> Abra o Console do Browser (F12 → Console) para ver os logs em
            tempo real. Cada configuração é logada apenas uma vez por sessão (sistema de cache).
          </Typography>
        </Alert>
      </CardContent>
    </Card>
  )
}

// Cache Component para evitar problema com useState no render
const CacheDemo: React.FC = () => {
  const [renderCount, setRenderCount] = React.useState(1)

  return (
    <Box sx={{ p: 3, bgcolor: 'grey.50', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom color="info.main" fontWeight="bold">
        🔄 Sistema de Cache - Logs Únicos
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Demonstra que cada configuração é logada apenas uma vez por sessão, mesmo com re-renders.
      </Typography>

      <Stack spacing={2} sx={{ mb: 3 }}>
        <Button variant="contained" onClick={() => setRenderCount((c) => c + 1)} color="primary">
          🔄 Forçar Re-render #{renderCount}
        </Button>

        <Alert severity="info">
          <Typography variant="body2">
            <strong>Teste:</strong> Clique no botão acima várias vezes. Note que os logs aparecem
            apenas na primeira vez (sistema de cache).
          </Typography>
        </Alert>
      </Stack>

      <GuidanceConsoleDemo
        title="Demonstração de Cache"
        description={`Re-render #${renderCount} - Logs aparecem só na primeira execução`}
        expectedLogs={[
          `Render #1: 🍪 LGPD-CONSENT - Sistema de Consentimento Ativo`,
          `Render #1: 🍪 Avisos de Configuração (primeira vez)`,
          `Render #${renderCount}: (sem logs - cache ativo)`,
        ]}
      />
    </Box>
  )
}

// Story 1: Configuração padrão (com avisos)
export const DefaultConfiguration: Story = {
  render: () => (
    <ConsentProvider>
      <Box sx={{ p: 3, bgcolor: 'grey.50', minHeight: '100vh' }}>
        <Typography variant="h4" gutterBottom color="primary.main" fontWeight="bold">
          🚨 Configuração Padrão - Avisos Esperados
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Nenhuma configuração de categorias especificada. O sistema usa defaults e emite avisos.
        </Typography>

        <GuidanceConsoleDemo
          title="Sem Configuração de Categorias"
          description="ConsentProvider sem prop 'categories' - usa configuração padrão"
          expectedLogs={[
            '🍪 LGPD-CONSENT - Sistema de Consentimento Ativo',
            '🍪 Avisos de Configuração',
            '  ⚠️ LGPD-CONSENT: Nenhuma configuração de categorias especificada...',
            '🍪 Configuração Ativa',
            '  [Tabela com necessary + analytics]',
          ]}
        />
      </Box>
    </ConsentProvider>
  ),
}

// Story 2: Apenas cookies necessários (com sugestões)
export const OnlyNecessaryCookies: Story = {
  render: () => (
    <ConsentProvider
      categories={{
        enabledCategories: ['necessary'],
      }}
    >
      <Box sx={{ p: 3, bgcolor: 'grey.50', minHeight: '100vh' }}>
        <Typography variant="h4" gutterBottom color="warning.main" fontWeight="bold">
          💡 Apenas Necessary - Sugestões LGPD
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Configuração minimalista. Sistema sugere categorias adicionais para compliance.
        </Typography>

        <GuidanceConsoleDemo
          title="Configuração Minimalista"
          description="Apenas categoria 'necessary' configurada"
          expectedLogs={[
            '🍪 LGPD-CONSENT - Sistema de Consentimento Ativo',
            '🍪 Sugestões',
            '  💡 Apenas cookies necessários estão configurados...',
            '🍪 Configuração Ativa',
            '  [Tabela apenas com necessary]',
            '🍪 LGPD - Boas Práticas',
            '  📜 Necessary: sempre ativo • Demais: opt-out por padrão',
          ]}
        />
      </Box>
    </ConsentProvider>
  ),
}

// Story 3: Integrações sem categorias correspondentes
export const MismatchedIntegrations: Story = {
  render: () => (
    <ConsentProvider
      categories={{
        enabledCategories: ['necessary', 'analytics'],
      }}
    >
      <Box sx={{ p: 3, bgcolor: 'grey.50', minHeight: '100vh' }}>
        <Typography variant="h4" gutterBottom color="error.main" fontWeight="bold">
          ⚠️ Integrações Incompatíveis - Avisos Críticos
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Scripts carregados requerem categorias não configuradas. Sistema emite avisos críticos.
        </Typography>

        <GuidanceConsoleDemo
          title="Facebook Pixel sem Categoria Marketing"
          description="Tentativa de carregar Facebook Pixel sem categoria 'marketing' configurada"
          expectedLogs={[
            '🍪 LGPD-CONSENT - Sistema de Consentimento Ativo',
            '🍪 Avisos de Configuração',
            '  ⚠️ Integrações detectadas requerem categoria marketing...',
            '🍪 Sugestões',
            '  💡 Adicione marketing em categories.enabledCategories',
            '🍪 Configuração Ativa',
            '  [Tabela com necessary + analytics]',
          ]}
        />

        {/* Simular carregamento de Facebook Pixel */}
        <ConsentScriptLoader
          integrations={[
            {
              id: 'ga-mock',
              src: 'data:text/javascript,/* GA Mock */',
              category: 'analytics',
              name: 'Google Analytics Mock',
              cookies: ['_ga', '_gid'],
            },
            {
              id: 'fb-pixel-mock',
              src: 'data:text/javascript,/* FB Pixel Mock */',
              category: 'marketing',
              name: 'Facebook Pixel',
              cookies: ['_fbp', '_fbc'],
            },
          ]}
        />
      </Box>
    </ConsentProvider>
  ),
}

// Story 4: Configuração completa (sem logs)
export const OptimalConfiguration: Story = {
  render: () => (
    <ConsentProvider
      categories={{
        enabledCategories: ['necessary', 'analytics', 'marketing', 'functional'],
      }}
    >
      <Box sx={{ p: 3, bgcolor: 'grey.50', minHeight: '100vh' }}>
        <Typography variant="h4" gutterBottom color="success.main" fontWeight="bold">
          ✅ Configuração Ótima - Sem Avisos
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Configuração completa e bem estruturada. Sistema funciona silenciosamente.
        </Typography>

        <GuidanceConsoleDemo
          title="Configuração LGPD Completa"
          description="Todas as categorias necessárias configuradas adequadamente"
          expectedLogs={[
            '🍪 LGPD-CONSENT - Sistema de Consentimento Ativo',
            '(Sem avisos ou sugestões - configuração ótima)',
            '(Logs de boas práticas não exibidos - não há problemas)',
          ]}
        />

        <ConsentScriptLoader
          integrations={[
            {
              id: 'ga-complete',
              src: 'data:text/javascript,/* GA Mock */',
              category: 'analytics',
              name: 'Google Analytics',
              cookies: ['_ga', '_gid'],
            },
            {
              id: 'gtm-complete',
              src: 'data:text/javascript,/* GTM Mock */',
              category: 'marketing',
              name: 'Google Tag Manager',
              cookies: ['_gtm', '_gtag'],
            },
          ]}
        />
      </Box>
    </ConsentProvider>
  ),
}

// Story 5: Cache do sistema (demonstra logs únicos)
export const CachingSystem: Story = {
  render: () => (
    <ConsentProvider>
      <CacheDemo />
    </ConsentProvider>
  ),
}
