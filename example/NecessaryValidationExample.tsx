/**
 * @file NecessaryValidationExample.tsx
 * @description Exemplo demonstrando a validação de proteção contra classificação incorreta como "necessary"
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
 * ⚠️ EXEMPLO DE CONFIGURAÇÃO PERIGOSA ⚠️
 *
 * Este exemplo demonstra uma configuração INCORRETA onde a categoria 'necessary'
 * está habilitada mas scripts de analytics/marketing estão sendo usados.
 *
 * O sistema detectará automaticamente este problema e mostrará avisos detalhados
 * no console em modo development.
 */
export function NecessaryValidationExample() {
  // ⚠️ INTEGRAÇÕES PROBLEMÁTICAS - Scripts que NUNCA devem ser "necessary"
  const integrations = [
    // ❌ Google Analytics NUNCA é necessário - requer consentimento explícito
    createGoogleAnalyticsIntegration({
      measurementId: 'G-DANGEROUS123',
    }),

    // ❌ Facebook Pixel NUNCA é necessário - marketing/advertising sempre requer consentimento
    createFacebookPixelIntegration({
      pixelId: '123456789',
    }),

    // ❌ Hotjar NUNCA é necessário - analytics/performance sempre requer consentimento
    createHotjarIntegration({
      siteId: '987654',
    }),
  ]

  return (
    <ConsentProvider
      // ⚠️ CONFIGURAÇÃO PERIGOSA: incluindo 'necessary' com scripts de analytics/marketing
      // Esta configuração pode resultar em violações de GDPR/LGPD!
      categories={{
        enabledCategories: [
          'necessary', // ⚠️ PERIGO: Scripts "necessary" executam SEM consentimento
          'analytics',
          'marketing',
        ],
      }}
      texts={{
        bannerMessage:
          '⚠️ EXEMPLO PERIGOSO: Este exemplo demonstra configuração incorreta de scripts "necessary". Veja o console!',
        acceptAll: 'Aceitar Tudo',
        declineAll: 'Rejeitar Tudo',
        preferences: 'Personalizar',
        modalTitle: 'Validação de Proteção - Scripts Necessary',
        modalIntro:
          'Este exemplo mostra como a biblioteca protege contra classificações incorretas.',
        save: 'Salvar Preferências',
        necessaryAlwaysOn: 'Sempre ativo (PERIGOSO!)',
      }}
    >
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>🚨 Sistema de Proteção - Scripts "Necessary"</h1>

        <NecessaryValidationInfo />

        <div
          style={{
            background: '#f8d7da',
            color: '#721c24',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid #f5c6cb',
            marginTop: '20px',
          }}
        >
          <h3>⚠️ ATENÇÃO: Configuração Perigosa Detectada!</h3>
          <ol>
            <li>
              <strong>Problema:</strong> Categoria 'necessary' habilitada com scripts de
              analytics/marketing
            </li>
            <li>
              <strong>Risco:</strong> Violação de GDPR/LGPD - multas potenciais
            </li>
            <li>
              <strong>Scripts afetados:</strong> Google Analytics, Facebook Pixel, Hotjar
            </li>
            <li>
              <strong>Proteção ativa:</strong> Avisos automáticos no console (F12)
            </li>
          </ol>

          <div
            style={{
              background: '#d1ecf1',
              color: '#0c5460',
              padding: '10px',
              borderRadius: '4px',
              marginTop: '10px',
              border: '1px solid #bee5eb',
            }}
          >
            <strong>🛡️ Abra o Console (F12) para ver as validações automáticas de proteção!</strong>
          </div>
        </div>

        <div
          style={{
            background: '#fff3cd',
            color: '#856404',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid #ffeaa7',
            marginTop: '15px',
          }}
        >
          <h4>📋 Scripts Verdadeiramente "Necessary" (Raros):</h4>
          <ul>
            <li>
              🔐 <strong>Segurança:</strong> Autenticação, proteção CSRF, detecção de fraude
            </li>
            <li>
              🛒 <strong>Core do site:</strong> Carrinho de compras, preferências de acessibilidade
            </li>
            <li>
              ⚖️ <strong>Compliance:</strong> Logs de auditoria obrigatórios por lei
            </li>
          </ul>

          <h4>❌ Scripts NUNCA "Necessary":</h4>
          <ul>
            <li>📊 Analytics (Google Analytics, Hotjar, Mixpanel)</li>
            <li>📈 Marketing (Facebook Pixel, Google Ads, Twitter Pixel)</li>
            <li>💬 Communication (Intercom, Zendesk Chat)</li>
            <li>🧪 A/B Testing (Optimizely, VWO)</li>
          </ul>
        </div>

        {/* O ConsentScriptLoader detectará automaticamente a configuração perigosa */}
        <ConsentScriptLoader integrations={integrations} reloadOnChange={true} />

        <CookieBanner />
      </div>
    </ConsentProvider>
  )
}

/**
 * Componente para mostrar informações sobre o estado atual
 */
function NecessaryValidationInfo() {
  const { preferences, consented } = useConsent()

  return (
    <div
      style={{
        background: '#d4edda',
        color: '#155724',
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid #c3e6cb',
        marginBottom: '20px',
      }}
    >
      <h3>🔍 Estado Atual da Validação:</h3>
      <ul>
        <li>
          <strong>Consentimento dado:</strong> {consented ? '✅ Sim' : '❌ Não'}
        </li>
        <li>
          <strong>Sistema de proteção:</strong> 🛡️ ATIVO (modo development)
        </li>
        <li>
          <strong>Validações executadas:</strong>
        </li>
        <ul>
          <li>✅ Detecção de categorias em falta</li>
          <li>🚨 Validação de scripts "necessary" perigosos</li>
          <li>📋 Sugestões de correção automáticas</li>
        </ul>
        <li>
          <strong>Preferências atuais:</strong>
        </li>
        <ul>
          <li>
            Necessary: {preferences.necessary ? '⚠️ HABILITADO (PERIGOSO!)' : '✅ Desabilitado'}
          </li>
          <li>Analytics: {preferences.analytics ? '✅ Aceito' : '❌ Rejeitado'}</li>
          <li>Marketing: {preferences.marketing ? '✅ Aceito' : '❌ Rejeitado'}</li>
        </ul>
      </ul>

      <div
        style={{
          background: '#b3d4fc',
          color: '#004085',
          padding: '8px',
          borderRadius: '4px',
          marginTop: '10px',
          fontSize: '14px',
        }}
      >
        💡 <strong>Dica:</strong> Em produção, essas validações são silenciosas. Scripts "necessary"
        executariam automaticamente SEM consentimento - daí o perigo!
      </div>
    </div>
  )
}

export default NecessaryValidationExample
