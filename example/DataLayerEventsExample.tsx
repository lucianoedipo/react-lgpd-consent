/**
 * @fileoverview
 * Exemplo demonstrando eventos dataLayer para integração com Google Tag Manager.
 *
 * Este exemplo mostra como os eventos de consentimento são automaticamente
 * disparados no dataLayer e como podem ser usados para auditoria e GTM.
 *
 * @author Luciano Édipo
 * @since 0.4.5
 */

import { Box, Paper, Typography } from '@mui/material'
import * as React from 'react'
import { ConsentProvider, useConsent } from '../src'

// Componente para monitorar e exibir eventos do dataLayer
function DataLayerMonitor() {
  const [events, setEvents] = React.useState<Array<Record<string, unknown>>>([])

  React.useEffect(() => {
    // Interceptar window.dataLayer.push
    const originalPush = window.dataLayer?.push

    window.dataLayer = window.dataLayer || []

    window.dataLayer.push = function (...args: Array<Record<string, unknown>>) {
      // Capturar apenas eventos de consentimento
      const consentEvents = args.filter(
        (item) =>
          typeof item === 'object' &&
          (item.event === 'consent_initialized' || item.event === 'consent_updated'),
      )

      if (consentEvents.length > 0) {
        setEvents((prev) => [...prev, ...consentEvents])
      }

      // Chamar o push original
      return originalPush ? originalPush.apply(this, args) : args.length
    }

    return () => {
      // Restaurar o push original
      if (originalPush && window.dataLayer) {
        window.dataLayer.push = originalPush
      }
    }
  }, [])

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        📡 Monitor de Eventos dataLayer
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Eventos de consentimento capturados do window.dataLayer
      </Typography>

      {events.length === 0 ? (
        <Typography variant="body2" color="text.disabled" sx={{ mt: 2 }}>
          Aguardando eventos...
        </Typography>
      ) : (
        <Box sx={{ mt: 2 }}>
          {events.map((event, index) => (
            <Paper
              key={index}
              variant="outlined"
              sx={{
                p: 2,
                mb: 1,
                bgcolor: event.event === 'consent_initialized' ? '#e3f2fd' : '#fff3e0',
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold">
                {index + 1}. {event.event as string}
              </Typography>
              <pre style={{ margin: '8px 0 0', fontSize: '12px', overflow: 'auto' }}>
                {JSON.stringify(event, null, 2)}
              </pre>
            </Paper>
          ))}
        </Box>
      )}
    </Paper>
  )
}

// Componente com controles de consentimento
function ConsentControls() {
  const { preferences, acceptAll, rejectAll, setPreference, resetConsent } = useConsent()

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        🎮 Controles de Consentimento
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
        <Box>
          <Typography variant="body2" gutterBottom>
            Estado atual das categorias:
          </Typography>
          <pre style={{ fontSize: '12px' }}>{JSON.stringify(preferences, null, 2)}</pre>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <button onClick={acceptAll}>Aceitar Todas</button>
          <button onClick={rejectAll}>Recusar Não-Essenciais</button>
          <button onClick={() => setPreference('analytics', !preferences.analytics)}>
            Toggle Analytics
          </button>
          <button onClick={() => setPreference('marketing', !preferences.marketing)}>
            Toggle Marketing
          </button>
          <button onClick={resetConsent}>Resetar Consentimento</button>
        </Box>
      </Box>
    </Paper>
  )
}

// Componente principal do exemplo
export function DataLayerEventsExample() {
  return (
    <ConsentProvider
      categories={{
        enabledCategories: ['analytics', 'marketing'],
      }}
    >
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Exemplo: Eventos DataLayer (GTM)
        </Typography>

        <Typography variant="body1" paragraph>
          Este exemplo demonstra como a biblioteca dispara automaticamente eventos padronizados no{' '}
          <code>window.dataLayer</code> para integração com Google Tag Manager e auditoria LGPD.
        </Typography>

        <DataLayerMonitor />
        <ConsentControls />

        <Paper elevation={3} sx={{ p: 2, mt: 2, bgcolor: '#f5f5f5' }}>
          <Typography variant="h6" gutterBottom>
            📖 Como usar no GTM
          </Typography>
          <Typography variant="body2" component="div">
            <ol>
              <li>
                <strong>Criar variáveis de camada de dados:</strong>
                <ul>
                  <li>
                    <code>categories</code> - Estado das categorias
                  </li>
                  <li>
                    <code>origin</code> - Origem da ação (banner, modal, reset)
                  </li>
                  <li>
                    <code>changed_categories</code> - Categorias alteradas
                  </li>
                </ul>
              </li>
              <li>
                <strong>Criar acionadores:</strong>
                <ul>
                  <li>
                    Evento personalizado: <code>consent_initialized</code>
                  </li>
                  <li>
                    Evento personalizado: <code>consent_updated</code>
                  </li>
                </ul>
              </li>
              <li>
                <strong>Criar tags condicionadas ao consentimento:</strong>
                <ul>
                  <li>
                    Google Analytics 4 - Acionador: <code>consent_updated</code> +{' '}
                    <code>{'{{categories.analytics}} = true'}</code>
                  </li>
                  <li>
                    Facebook Pixel - Acionador: <code>consent_updated</code> +{' '}
                    <code>{'{{categories.marketing}} = true'}</code>
                  </li>
                </ul>
              </li>
            </ol>
          </Typography>
        </Paper>
      </Box>
    </ConsentProvider>
  )
}

export default DataLayerEventsExample
