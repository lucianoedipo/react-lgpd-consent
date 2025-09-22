/**
 * @file AutoConfigExample.tsx
 * @description Exemplo demonstrando o sistema inteligente de auto-configuração de categorias
 * @since 0.4.1
 */

import {
  ConsentProvider,
  ConsentScriptLoader,
  CookieBanner,
  createFacebookPixelIntegration,
  createGoogleAnalyticsIntegration,
  createHotjarIntegration,
  useConsent,
} from '../src'

/**
 * Exemplo de uso do sistema inteligente de auto-configuração.
 *
 * Neste exemplo:
 * 1. Definimos apenas a categoria 'analytics' como habilitada
 * 2. Usamos integrações que requerem diferentes categorias (analytics e marketing)
 * 3. O sistema automaticamente detecta e avisa sobre categorias em falta no modo development
 */
export function AutoConfigExample() {
  // Integrações que requerem diferentes categorias
  const integrations = [
    // Requer categoria 'analytics' ✅ (já habilitada)
    createGoogleAnalyticsIntegration({
      measurementId: 'G-EXAMPLE123',
    }),

    // Requer categoria 'analytics' ✅ (já habilitada)
    createHotjarIntegration({
      siteId: '123456',
      debug: true,
    }),

    // Requer categoria 'marketing' ❌ (não habilitada - será detectada automaticamente)
    createFacebookPixelIntegration({
      pixelId: '123456789',
      autoTrack: true,
    }),
  ]

  return (
    <ConsentProvider
      // Configuramos apenas 'analytics', mas as integrações requerem também 'marketing'
      // O sistema detectará automaticamente e avisará no console em modo development
      categories={{
        enabledCategories: ['analytics'], // 'marketing' está faltando!
      }}
      texts={{
        bannerMessage:
          'Este exemplo demonstra como o sistema detecta automaticamente categorias em falta.',
        acceptAll: 'Aceitar Tudo',
        declineAll: 'Rejeitar Tudo',
        preferences: 'Personalizar',
        modalTitle: 'Exemplo de Auto-Configuração',
        modalIntro:
          'Configure suas preferências de cookies. O sistema detectará automaticamente categorias necessárias.',
        save: 'Salvar Preferências',
        necessaryAlwaysOn: 'Sempre ativo',
      }}
    >
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>🍪 Sistema Inteligente de Categorias</h1>

        <AutoConfigDebugInfo />

        <div
          style={{
            background: '#f5f5f5',
            padding: '15px',
            borderRadius: '8px',
            marginTop: '20px',
          }}
        >
          <h3>📋 O que acontece neste exemplo:</h3>
          <ol>
            <li>
              <strong>Categorias configuradas:</strong> apenas 'analytics'
            </li>
            <li>
              <strong>Integrações usadas:</strong> Google Analytics, Hotjar (analytics) + Facebook
              Pixel (marketing)
            </li>
            <li>
              <strong>Sistema detecta:</strong> categoria 'marketing' em falta
            </li>
            <li>
              <strong>Em modo development:</strong> aviso detalhado no console
            </li>
            <li>
              <strong>Solução sugerida:</strong> adicionar 'marketing' às categorias habilitadas
            </li>
          </ol>

          <div
            style={{
              background: '#e8f4fd',
              padding: '10px',
              borderRadius: '4px',
              marginTop: '10px',
              border: '1px solid #bee5eb',
            }}
          >
            <strong>💡 Abra o console do navegador para ver os avisos automáticos!</strong>
          </div>
        </div>

        {/* O ConsentScriptLoader automaticamente valida as categorias em desenvolvimento */}
        <ConsentScriptLoader integrations={integrations} reloadOnChange={true} />

        <CookieBanner />
      </div>
    </ConsentProvider>
  )
}

/**
 * Componente para mostrar informações de debug sobre o estado do consentimento
 */
function AutoConfigDebugInfo() {
  const { preferences, consented } = useConsent()

  return (
    <div
      style={{
        background: '#fff3cd',
        border: '1px solid #ffeaa7',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
      }}
    >
      <h3>🔍 Estado Atual do Consentimento:</h3>
      <ul>
        <li>
          <strong>Consentimento dado:</strong> {consented ? '✅ Sim' : '❌ Não'}
        </li>
        <li>
          <strong>Preferências atuais:</strong>
        </li>
        <ul>
          <li>Analytics: {preferences.analytics ? '✅ Aceito' : '❌ Rejeitado'}</li>
          <li>Marketing: {preferences.marketing ? '✅ Aceito' : '❌ Rejeitado'}</li>
          <li>Functional: {preferences.functional ? '✅ Aceito' : '❌ Rejeitado'}</li>
        </ul>
      </ul>

      {!consented && (
        <p style={{ color: '#856404', fontSize: '14px', marginTop: '10px' }}>
          ℹ️ Scripts só são carregados após o consentimento. As validações de categoria acontecem
          independentemente do consentimento.
        </p>
      )}
    </div>
  )
}

export default AutoConfigExample
