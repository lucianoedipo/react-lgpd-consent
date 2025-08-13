import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  ConsentProvider,
  ConsentScriptLoader,
  useConsent,
  useCategories,
  ConsentGate,
  createGoogleAnalyticsIntegration,
  createUserWayIntegration,
} from 'react-lgpd-consent'

// 🚀 Integrações automáticas
const scriptIntegrations = [
  createGoogleAnalyticsIntegration({
    measurementId: 'GA_MEASUREMENT_ID',
    config: {
      anonymize_ip: true,
      allow_google_signals: false,
    },
  }),
  // A integração do UserWay está ligada à categoria 'functional'
  createUserWayIntegration({
    accountId: 'USERWAY_ACCOUNT_ID',
  }),
]

// 📝 Textos ANPD completos
const anpdTexts = {
  bannerMessage:
    'Utilizamos cookies para melhorar sua experiência e cumprir obrigações legais.',
  acceptAll: 'Aceitar Todos os Cookies',
  declineAll: 'Rejeitar Opcionais',
  preferences: 'Configurar Preferências',
  policyLink: 'Política de Privacidade',
  modalTitle: 'Configurações de Privacidade',
  modalIntro:
    'Configure suas preferências de cookies. Você pode alterá-las a qualquer momento.',
  save: 'Salvar Minhas Preferências',
  necessaryAlwaysOn: 'Cookies Essenciais (sempre ativos)',

  // ✅ Textos ANPD expandidos
  controllerInfo:
    'Dados controlados por: Governo do Estado de Mato Grosso do Sul (CNPJ: 03.512.256/0001-48)',
  dataTypes:
    'Coletamos: endereço IP, dados de navegação, preferências de usuário e informações de interação.',
  thirdPartySharing:
    'Compartilhamos dados com: Google Analytics (estatísticas), UserWay (acessibilidade).',
  userRights:
    'Seus direitos: acessar, corrigir, excluir, portar dados e revogar consentimento a qualquer momento.',
  contactInfo: 'Contato DPO: privacidade@ms.gov.br | Ouvidoria: 0800-647-0001',
  retentionPeriod:
    'Dados de navegação armazenados por até 12 meses. Preferências mantidas indefinidamente.',
  lawfulBasis:
    'Base legal: consentimento do titular (cookies opcionais) e cumprimento de obrigação legal (essenciais).',
  transferCountries:
    'Dados podem ser transferidos para: Estados Unidos (Google), Irlanda (servidores UE).',
}

// 📊 Componente para exibir status detalhado
function ConsentStatus() {
  const { preferences, consented } = useConsent()
  const { allCategories } = useCategories()

  if (!consented) {
    return (
      <div
        style={{
          padding: '20px',
          backgroundColor: '#fff3cd',
          borderRadius: '8px',
        }}
      >
        ⚠️ <strong>Consentimento pendente.</strong> Configure suas preferências
        de cookies.
      </div>
    )
  }

  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: '#d4edda',
        borderRadius: '8px',
      }}
    >
      <h3>✅ Status das Categorias de Cookies</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {allCategories.map((category) => (
          <li key={category.id} style={{ margin: '8px 0' }}>
            <strong>{preferences[category.id] ? '✅' : '❌'}</strong>{' '}
            <strong>{category.name}</strong>
            {category.essential && ' (obrigatório)'}
            <br />
            <small style={{ color: '#666' }}>{category.description}</small>
          </li>
        ))}
      </ul>
    </div>
  )
}

// 🎯 Componente de exemplo principal
function ExampleApp() {
  return (
    <ConsentProvider
      // Habilita as categorias 'analytics' e 'functional' (para UserWay)
      // e adiciona a categoria customizada 'governo'
      categories={{
        enabledCategories: ['analytics', 'functional'],
      }}
      texts={anpdTexts}
      onConsentGiven={(state) => {
        console.log('🎉 Consentimento dado:', state)
      }}
      onPreferencesSaved={(prefs) => {
        console.log('💾 Preferências salvas:', prefs)
      }}
      // O banner será bloqueante para compliance rigorosa
      blocking={true}
    >
      {/* 🚀 Scripts carregam automaticamente baseado no consentimento */}
      <ConsentScriptLoader integrations={scriptIntegrations} />

      <div
        style={{
          fontFamily: 'Arial, sans-serif',
          padding: '20px',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <header>
          <h1>🏛️ Portal do Cidadão - MS</h1>
          <p>
            Exemplo completo de implementação LGPD/ANPD com react-lgpd-consent
            v0.3.0
          </p>
        </header>

        <main>
          <section style={{ margin: '30px 0' }}>
            <h2>📊 Status do Consentimento</h2>
            <ConsentStatus />
          </section>

          <section style={{ margin: '30px 0' }}>
            <h2>🎯 Conteúdo Condicional</h2>

            <ConsentGate category="analytics">
              <div
                style={{
                  padding: '15px',
                  background: '#e8f5e8',
                  borderRadius: '6px',
                  margin: '10px 0',
                }}
              >
                ✅ <strong>Google Analytics Ativo!</strong> Estatísticas de uso
                sendo coletadas.
              </div>
            </ConsentGate>

            <ConsentGate category="governo">
              <div
                style={{
                  padding: '15px',
                  background: '#e3f2fd',
                  borderRadius: '6px',
                  margin: '10px 0',
                }}
              >
                🏛️ <strong>Integração Governamental Ativa!</strong> Acesso a
                sistemas internos liberado.
              </div>
            </ConsentGate>

            <ConsentGate category="functional">
              <div
                style={{
                  padding: '15px',
                  background: '#f3e5f5',
                  borderRadius: '6px',
                  margin: '10px 0',
                }}
              >
                ♿ <strong>Ferramentas de Acessibilidade Ativas!</strong> Widget
                UserWay carregado.
              </div>
            </ConsentGate>
          </section>

          <section style={{ margin: '30px 0' }}>
            <h2>📋 Funcionalidades Demonstradas na v0.3.0</h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px',
              }}
            >
              <div
                style={{
                  padding: '20px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                }}
              >
                <h3>✅ UI Automática</h3>
                <p>
                  O <strong>CookieBanner</strong> e o{' '}
                  <strong>FloatingPreferencesButton</strong> são renderizados
                  automaticamente pelo <strong>ConsentProvider</strong>. Menos
                  código, mais simplicidade.
                </p>
              </div>

              <div
                style={{
                  padding: '20px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                }}
              >
                <h3>🔧 Categorias Customizadas</h3>
                <ul>
                  <li>🏛️ Governo MS</li>
                  <li>
                    ⚙️ A categoria <strong>functional</strong> agora controla o
                    widget de acessibilidade.
                  </li>
                  <li>➕ Facilmente extensível</li>
                </ul>
              </div>

              <div
                style={{
                  padding: '20px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                }}
              >
                <h3>🚀 Integrações Nativas</h3>
                <ul>
                  <li>📈 Google Analytics 4</li>
                  <li>♿ UserWay Widget</li>
                  <li>🔄 Carregamento automático</li>
                </ul>
              </div>

              <div
                style={{
                  padding: '20px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                }}
              >
                <h3>📝 Textos ANPD</h3>
                <ul>
                  <li>📋 Controlador identificado</li>
                  <li>📞 Contato DPO</li>
                  <li>⚖️ Base legal clara</li>
                  <li>🌍 Transferências internacionais</li>
                </ul>
              </div>
            </div>
          </section>

          <section style={{ margin: '30px 0' }}>
            <h2>📚 Documentação</h2>
            <p>
              Este exemplo demonstra as principais funcionalidades da versão
              0.3.0:
            </p>
            <ul>
              <li>
                <strong>Renderização Automática:</strong> O Provider gerencia a
                UI padrão.
              </li>
              <li>
                <strong>Configuração Explícita:</strong> A prop `categories`
                define o comportamento.
              </li>
              <li>
                <strong>Integrações:</strong> Scripts carregam automaticamente
                após o consentimento.
              </li>
              <li>
                <strong>Compliance:</strong> Textos ANPD completos e opcionais.
              </li>
            </ul>
          </section>
        </main>

        {/*
          Na v0.3.0, não é mais necessário renderizar o CookieBanner
          ou o FloatingPreferencesButton manualmente. O ConsentProvider
          faz isso automaticamente para você!
        */}
      </div>
    </ConsentProvider>
  )
}

// 🚀 Renderização
const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(<ExampleApp />)
