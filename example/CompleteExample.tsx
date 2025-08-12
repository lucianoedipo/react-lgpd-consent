import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  ConsentProvider,
  CookieBanner,
  FloatingPreferencesButton,
  ConsentScriptLoader,
  useConsent,
  useCategories, // NOVO: hook atualizado
  ConsentGate,
  createGoogleAnalyticsIntegration,
  createUserWayIntegration,
  type CategoryDefinition,
} from 'react-lgpd-consent'

// 🏛️ Categorias customizadas para projeto governamental
const customCategories: CategoryDefinition[] = [
  {
    id: 'governo',
    name: 'Integração Governamental',
    description:
      'Cookies necessários para integração com sistemas do Governo MS.',
    essential: false,
    cookies: ['gov.ms_session', 'cpf_hash', 'protocolo_*'],
  },
  {
    id: 'acessibilidade',
    name: 'Ferramentas de Acessibilidade',
    description:
      'Cookies para funcionalidades de acessibilidade como leitores de tela e navegação por voz.',
    essential: false,
    cookies: ['userway_*', 'voice_navigation', 'high_contrast'],
  },
]

// 🚀 Integrações automáticas
const scriptIntegrations = [
  createGoogleAnalyticsIntegration({
    measurementId: 'GA_MEASUREMENT_ID',
    config: {
      anonymize_ip: true,
      allow_google_signals: false,
    },
  }),
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

  // ✅ Textos ANPD expandidos (v0.2.0)
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
  const { allCategories } = useCategories() // NOVO: hook atualizado

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
      categories={{
        enabledCategories: ['analytics', 'functional'],
        customCategories: customCategories,
      }}
      texts={anpdTexts}
      onConsentGiven={(state) => {
        console.log('🎉 Consentimento dado:', state)
      }}
      onPreferencesSaved={(prefs) => {
        console.log('💾 Preferências salvas:', prefs)
      }}
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
            v0.2.0
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

            <ConsentGate category="acessibilidade">
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
            <h2>📋 Funcionalidades Demonstradas</h2>
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
                <h3>🍪 6 Categorias ANPD</h3>
                <ul>
                  <li>✅ Necessary (essencial)</li>
                  <li>📊 Analytics</li>
                  <li>⚙️ Functional</li>
                  <li>📢 Marketing</li>
                  <li>👥 Social</li>
                  <li>🎨 Personalization</li>
                </ul>
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
                  <li>♿ Acessibilidade</li>
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
              Este exemplo demonstra todas as funcionalidades da versão 0.2.0:
            </p>
            <ul>
              <li>
                <strong>Categorias ANPD:</strong> 6 categorias baseadas no Guia
                Orientativo
              </li>
              <li>
                <strong>Extensibilidade:</strong> Categorias customizadas para
                casos específicos
              </li>
              <li>
                <strong>Integrações:</strong> Scripts carregam automaticamente
              </li>
              <li>
                <strong>Compliance:</strong> Textos ANPD completos e opcionais
              </li>
              <li>
                <strong>UX:</strong> Zero-flash, acessível, responsivo
              </li>
            </ul>
          </section>
        </main>

        {/* 🍪 Banner de cookies com modo não-bloqueante */}
        <CookieBanner
          policyLinkUrl="/politica-privacidade"
          blocking={false}
          debug={false}
        />

        {/* 🎛️ Botão flutuante para fácil acesso */}
        <FloatingPreferencesButton
          position="bottom-right"
          hideWhenConsented={false}
          tooltip="Configurar Cookies"
        />
      </div>
    </ConsentProvider>
  )
}

// 🚀 Renderização
const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(<ExampleApp />)
