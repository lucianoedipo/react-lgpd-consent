import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import {
  categorizeDiscoveredCookies,
  ConsentGate,
  ConsentProvider,
  ConsentScriptLoader,
  createGoogleAnalyticsIntegration,
  // Novas funcionalidades v0.4.1
  discoverRuntimeCookies,
  resolveTexts,
  TEXT_TEMPLATES,
  useConsent,
} from 'react-lgpd-consent'

// ===== CONFIGURAÇÕES AVANÇADAS v0.4.1 =====

// Textos personalizados usando templates avançados
const customTexts = resolveTexts(TEXT_TEMPLATES.ecommerce, {
  variant: 'casual',
  language: 'pt',
})

// Integrações de scripts
const scriptIntegrations = [
  createGoogleAnalyticsIntegration({
    measurementId: 'GA_MEASUREMENT_ID',
  }),
]

// ===== COMPONENTES =====

function ConsentStatus() {
  const { consented, preferences, acceptAll, rejectAll, openPreferences } = useConsent()

  return (
    <div
      style={{
        padding: '20px',
        background: '#f5f5f5',
        borderRadius: '8px',
        margin: '20px 0',
        border: '1px solid #ddd',
      }}
    >
      <h3>📊 Status do Consentimento</h3>

      <div style={{ marginBottom: '15px' }}>
        <span
          style={{
            padding: '4px 12px',
            borderRadius: '16px',
            fontSize: '14px',
            backgroundColor: consented ? '#4CAF50' : '#f44336',
            color: 'white',
          }}
        >
          {consented ? '✅ Consentido' : '❌ Não consentido'}
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          marginBottom: '15px',
        }}
      >
        <div>
          <strong>Analytics:</strong> {preferences.analytics ? '✅ Aceito' : '❌ Recusado'}
        </div>
        <div>
          <strong>Marketing:</strong> {preferences.marketing ? '✅ Aceito' : '❌ Recusado'}
        </div>
        <div>
          <strong>Functional:</strong> {preferences.functional ? '✅ Aceito' : '❌ Recusado'}
        </div>
        <div>
          <strong>Social:</strong> {preferences.social ? '✅ Aceito' : '❌ Recusado'}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={acceptAll}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Aceitar Tudo
        </button>
        <button
          onClick={rejectAll}
          style={{
            padding: '8px 16px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Recusar Tudo
        </button>
        <button
          onClick={openPreferences}
          style={{
            padding: '8px 16px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Preferências
        </button>
      </div>
    </div>
  )
}

function CookieDiscoveryDemo() {
  const [discoveredCookies, setDiscoveredCookies] = useState<any[]>([])
  const [categorizedCookies, setCategorizedCookies] = useState<any>({})

  const handleDiscoverCookies = () => {
    const cookies = discoverRuntimeCookies()
    setDiscoveredCookies(cookies)

    const categorized = categorizeDiscoveredCookies(cookies, false)
    setCategorizedCookies(categorized)
  }

  useEffect(() => {
    handleDiscoverCookies()
  }, [])

  return (
    <div
      style={{
        padding: '20px',
        background: '#e3f2fd',
        borderRadius: '8px',
        margin: '20px 0',
        border: '1px solid #2196F3',
      }}
    >
      <h3>🔍 Descoberta de Cookies v0.4.1</h3>

      <button
        onClick={handleDiscoverCookies}
        style={{
          padding: '8px 16px',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '15px',
        }}
      >
        Descobrir Cookies
      </button>

      <div style={{ marginBottom: '15px' }}>
        <h4>Cookies Descobertos ({discoveredCookies.length}):</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          {discoveredCookies.map((cookie, index) => (
            <span
              key={`cookie-${cookie.name}-${index}`}
              style={{
                padding: '2px 8px',
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '12px',
                fontSize: '12px',
              }}
            >
              {cookie.name}
            </span>
          ))}
          {discoveredCookies.length === 0 && <em>Nenhum cookie encontrado</em>}
        </div>
      </div>

      <div>
        <h4>Categorização Automática:</h4>
        {Object.entries(categorizedCookies).map(([category, cookies]: [string, any]) => (
          <div key={category} style={{ marginBottom: '5px' }}>
            <strong>{category}:</strong> {cookies.length} cookies
          </div>
        ))}
      </div>
    </div>
  )
}

function AdvancedTextDemo() {
  return (
    <div
      style={{
        padding: '20px',
        background: '#f3e5f5',
        borderRadius: '8px',
        margin: '20px 0',
        border: '1px solid #9C27B0',
      }}
    >
      <h3>📝 Sistema Avançado de Textos v0.4.1</h3>

      <p>Usando template "ecommerce" com variação "casual" em português:</p>

      <div
        style={{
          padding: '15px',
          backgroundColor: '#fafafa',
          borderRadius: '4px',
          border: '1px solid #ddd',
        }}
      >
        <div>
          <strong>Banner Message:</strong> {customTexts.bannerMessage}
        </div>
        <div>
          <strong>Accept All:</strong> {customTexts.acceptAll}
        </div>
      </div>
    </div>
  )
}

// Componente principal da aplicação
function App() {
  return (
    <ConsentProvider
      categories={{
        enabledCategories: ['analytics', 'marketing', 'functional', 'social', 'personalization'],
      }}
      texts={customTexts}
      onConsentGiven={(state) => {
        console.log('✅ Consentimento dado:', state)
      }}
      onPreferencesSaved={(preferences) => {
        console.log('💾 Preferências salvas:', preferences)
      }}
      hideBranding={false}
    >
      <div
        style={{
          fontFamily: 'Arial, sans-serif',
          maxWidth: '900px',
          margin: '0 auto',
          padding: '20px',
        }}
      >
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1>🍪 React LGPD Consent v0.4.1</h1>
          <h2 style={{ color: '#666', fontWeight: 400 }}>Demonstração das Novas Funcionalidades</h2>
        </header>

        <main>
          <ConsentStatus />

          <CookieDiscoveryDemo />

          <AdvancedTextDemo />

          <div
            style={{
              padding: '20px',
              background: '#e8f5e8',
              borderRadius: '8px',
              margin: '20px 0',
              border: '1px solid #4CAF50',
            }}
          >
            <h3>🎯 Renderização Condicional</h3>

            <ConsentGate category="analytics">
              <div
                style={{
                  padding: '15px',
                  background: '#4CAF50',
                  color: 'white',
                  borderRadius: '6px',
                  margin: '10px 0',
                }}
              >
                ✅ <strong>Analytics aceito!</strong> Este conteúdo só aparece quando analytics está
                habilitado.
              </div>
            </ConsentGate>

            <ConsentGate category="marketing">
              <div
                style={{
                  padding: '15px',
                  background: '#2196F3',
                  color: 'white',
                  borderRadius: '6px',
                  margin: '10px 0',
                }}
              >
                📈 <strong>Marketing aceito!</strong> Este conteúdo só aparece quando marketing está
                habilitado.
              </div>
            </ConsentGate>

            <ConsentGate category="functional">
              <div
                style={{
                  padding: '15px',
                  background: '#FF9800',
                  color: 'white',
                  borderRadius: '6px',
                  margin: '10px 0',
                }}
              >
                ⚙️ <strong>Funcional aceito!</strong> Este conteúdo só aparece quando funcional está
                habilitado.
              </div>
            </ConsentGate>
          </div>

          <div
            style={{
              padding: '20px',
              background: '#fff3e0',
              borderRadius: '8px',
              margin: '20px 0',
              border: '1px solid #FF9800',
            }}
          >
            <h3>📋 Novidades v0.4.1</h3>

            <ul style={{ lineHeight: '1.6' }}>
              <li>
                <strong>Design Tokens Expandidos:</strong> 200+ pontos de customização
              </li>
              <li>
                <strong>Sistema Avançado de Textos:</strong> i18n, contexts, variants
              </li>
              <li>
                <strong>Descoberta de Cookies:</strong> Detecção automática em runtime
              </li>
              <li>
                <strong>Melhor Cobertura de Testes:</strong> 193 testes passando
              </li>
              <li>
                <strong>Suporte a Múltiplas Categorias:</strong> necessary, analytics, marketing,
                functional, social, personalization
              </li>
              <li>
                <strong>API Mais Flexível:</strong> Configurações granulares e hooks avançados
              </li>
            </ul>
          </div>

          <div
            style={{
              padding: '20px',
              background: '#f5f5f5',
              borderRadius: '8px',
              margin: '20px 0',
              border: '1px solid #666',
            }}
          >
            <h3>🧑‍💻 Migração para v0.4.1</h3>

            <h4>Antes (v0.3.x):</h4>
            <pre
              style={{
                background: '#fff',
                padding: '15px',
                borderRadius: '6px',
                overflow: 'auto',
                fontSize: '14px',
              }}
            >
              {`// Configuração básica
<ConsentProvider
  categories={['analytics', 'marketing']}
  texts={{ bannerMessage: '...' }}
>
  <App />
</ConsentProvider>`}
            </pre>

            <h4>Agora (v0.4.1):</h4>
            <pre
              style={{
                background: '#fff',
                padding: '15px',
                borderRadius: '6px',
                overflow: 'auto',
                fontSize: '14px',
              }}
            >
              {`// Configuração avançada
const customTexts = resolveTexts(TEXT_TEMPLATES.ecommerce, {
  variant: 'casual',
  language: 'pt'
})

<ConsentProvider
  categories={{
    necessary: { name: 'Necessários', required: true },
    analytics: { name: 'Analytics', required: false }
  }}
  texts={customTexts}
  designTokens={customDesignTokens}
  scriptIntegrations={scriptIntegrations}
>
  <App />
</ConsentProvider>`}
            </pre>
          </div>

          {/* Script Loader para demonstrar integrações */}
          <ConsentScriptLoader integrations={scriptIntegrations} />
        </main>
      </div>
    </ConsentProvider>
  )
}

// Renderização da aplicação
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
