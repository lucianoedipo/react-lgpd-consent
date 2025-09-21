import ReactDOM from 'react-dom/client'
import {
  ConsentGate,
  ConsentProvider,
  ConsentScriptLoader,
  createGoogleAnalyticsIntegration,
  useConsent,
} from 'react-lgpd-consent'

// Integrações de scripts
const scriptIntegrations = [
  createGoogleAnalyticsIntegration({
    measurementId: 'GA_MEASUREMENT_ID', // Substitua pelo seu ID de GA
  }),
]

// Exemplo de componente que mostra status
function ConsentStatus() {
  const { consented, preferences, acceptAll, rejectAll, openPreferences } = useConsent()

  return (
    <div
      style={{
        padding: '20px',
        background: '#f5f5f5',
        borderRadius: '8px',
        margin: '20px 0',
      }}
    >
      <h3>Status do Consentimento</h3>
      <p>
        <strong>Consentido:</strong> {consented ? '✅ Sim' : '❌ Não'}
      </p>
      <p>
        <strong>Analytics:</strong> {preferences.analytics ? '✅ Aceito' : '❌ Recusado'}
      </p>
      <p>
        <strong>Marketing:</strong> {preferences.marketing ? '✅ Aceito' : '❌ Recusado'}
      </p>

      <div style={{ marginTop: '15px' }}>
        <button onClick={acceptAll} style={{ marginRight: '10px' }}>
          Aceitar Todos
        </button>
        <button onClick={rejectAll} style={{ marginRight: '10px' }}>
          Rejeitar Todos
        </button>
        <button onClick={openPreferences}>Preferências</button>
      </div>
    </div>
  )
}

// Textos customizados (opcional)
const textosCustomizados = {
  bannerMessage: 'Este site utiliza cookies para análise e personalização da experiência.',
  acceptAll: 'Aceitar Todos os Cookies',
  declineAll: 'Recusar Todos',
  preferences: 'Gerenciar Preferências',
  policyLink: 'Nossa Política de Cookies',
  modalTitle: 'Configurações de Cookies',
  modalIntro:
    'Escolha quais tipos de cookies você deseja permitir. Cookies essenciais são sempre ativos.',
  save: 'Salvar Minhas Preferências',
  necessaryAlwaysOn: 'Cookies essenciais (sempre ativos)',
}

// Configurações do cookie (opcional)
const cookieConfig = {
  name: 'meuSiteConsent',
  maxAgeDays: 365,
  sameSite: 'Lax' as const,
  secure: true, // Auto-detectado baseado no protocolo
  path: '/',
}

function App() {
  return (
    <ConsentProvider
      texts={textosCustomizados}
      cookie={cookieConfig}
      onConsentGiven={(state) => {
        console.log('Consentimento dado:', state)
        // Analytics, tracking, etc.
      }}
      onPreferencesSaved={(preferences) => {
        console.log('Preferências salvas:', preferences)
        // Recarregar scripts baseado nas novas preferências
      }}
      hideBranding={false} // Mostrar "fornecido por LÉdipO.eti.br"
    >
      <div
        style={{
          fontFamily: 'Arial, sans-serif',
          maxWidth: '800px',
          margin: '0 auto',
          padding: '20px',
        }}
      >
        <header>
          <h1>🍪 Exemplo react-lgpd-consent</h1>
          <p>
            Esta é uma aplicação React de exemplo mostrando como usar a biblioteca{' '}
            <code>react-lgpd-consent</code> para gerenciar consentimento de cookies em conformidade
            com a LGPD.
          </p>
        </header>

        <main>
          <section>
            <h2>📊 Status Atual</h2>
            <ConsentStatus />
          </section>

          <section>
            <h2>🎯 Renderização Condicional</h2>

            <ConsentGate category="analytics">
              <div
                style={{
                  padding: '15px',
                  background: '#e8f5e8',
                  borderRadius: '6px',
                  margin: '10px 0',
                }}
              >
                ✅ <strong>Analytics aceito!</strong> Este conteúdo só aparece se analytics estiver
                habilitado.
              </div>
            </ConsentGate>

            <ConsentGate category="marketing">
              <div
                style={{
                  padding: '15px',
                  background: '#e8f5e8',
                  borderRadius: '6px',
                  margin: '10px 0',
                }}
              >
                ✅ <strong>Marketing aceito!</strong> Este conteúdo só aparece se marketing estiver
                habilitado.
              </div>
            </ConsentGate>

            <div
              style={{
                padding: '15px',
                background: '#f8f9fa',
                borderRadius: '6px',
                margin: '10px 0',
              }}
            >
              ℹ️ <em>ConsentGate aceita apenas uma categoria por vez na API atual</em>
            </div>
          </section>

          <section>
            <h2>📋 Instruções de Teste</h2>
            <ol>
              <li>
                🔄 <strong>Refresh a página</strong> - Banner não deve aparecer se já há
                consentimento.
              </li>
              <li>
                ✅ <strong>Aceite/Recuse</strong> - Interaja com o banner para ver os blocos
                condicionais aparecerem/sumirem.
              </li>
              <li>
                🎛️ <strong>Use o botão flutuante</strong> - Para reconfigurar após decisão inicial.
              </li>
              <li>
                🔍 <strong>Abra DevTools</strong> - Veja os logs de cookie e estado.
              </li>
              <li>
                🗑️ <strong>Limpe cookies</strong> - Para simular primeira visita novamente.
              </li>
            </ol>
          </section>

          <section>
            <h2>🧑‍💻 Para Desenvolvedores</h2>
            <pre
              style={{
                background: '#f8f9fa',
                padding: '15px',
                borderRadius: '6px',
                overflow: 'auto',
              }}
            >
              {`npm install react-lgpd-consent

import {
  ConsentProvider,
  useConsent,
  ConsentGate,
} from 'react-lgpd-consent'`}
            </pre>
          </section>
        </main>

        {/* Componente para carregamento condicional de scripts */}
        <ConsentScriptLoader integrations={scriptIntegrations} />
      </div>
    </ConsentProvider>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(<App />)
