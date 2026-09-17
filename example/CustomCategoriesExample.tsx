/**
 * @fileoverview
 * Exemplo demonstrando uso de categorias customizadas no react-lgpd-consent.
 *
 * Este exemplo mostra como:
 * - Definir categorias customizadas além das padrão
 * - Usar o ConsentGate com categorias customizadas
 * - Criar integrações específicas para categorias customizadas
 * - Verificar estado de consentimento para categorias customizadas
 *
 * @author Luciano Édipo
 * @since 0.4.1
 */

import {
  ConsentGate,
  ConsentProvider,
  ConsentScriptLoader,
  createGoogleAnalyticsIntegration,
  createUserWayIntegration,
  useCategories,
  useConsent,
  type CategoryDefinition,
  type ScriptIntegration,
} from 'react-lgpd-consent'

// 🎯 Definição de categorias customizadas específicas do projeto
const customCategories: CategoryDefinition[] = [
  {
    id: 'government-integration',
    name: 'Integração Governamental',
    description: 'Cookies para integração com sistemas governamentais (ex: Login GOV.BR)',
    essential: false,
    cookies: ['gov_session_*', '_login_gov_br', '_certificate_*'],
  },
  {
    id: 'accessibility-enhanced',
    name: 'Acessibilidade Avançada',
    description: 'Recursos avançados de acessibilidade e adaptação para deficiências',
    essential: false,
    cookies: ['_accessibility_*', '_voice_*', '_contrast_*'],
  },
  {
    id: 'document-processing',
    name: 'Processamento de Documentos',
    description: 'Cookies para upload, assinatura digital e processamento de documentos',
    essential: false,
    cookies: ['_doc_session_*', '_signature_*', '_upload_progress_*'],
  },
  {
    id: 'citizen-chat',
    name: 'Chat do Cidadão',
    description: 'Sistema de chat para atendimento direto ao cidadão',
    essential: false,
    cookies: ['_citizen_chat_*', '_support_session_*'],
  },
]

// 🔧 Integrações customizadas para categorias específicas
const customIntegrations: ScriptIntegration[] = [
  // Analytics padrão
  createGoogleAnalyticsIntegration({
    measurementId: 'G-GOVERNMENT123',
    config: {
      send_page_view: false,
      allow_google_signals: false,
    },
  }),

  // Acessibilidade padrão
  createUserWayIntegration({
    accountId: 'USERWAY_GOV_123',
  }),

  // 🏛️ Integração customizada: Login GOV.BR
  {
    id: 'login-gov-br',
    name: 'Login GOV.BR',
    category: 'government-integration',
    src: 'https://sso.gov.br/govbr-sso.js',
    async: true,
    defer: false,
    config: {
      client_id: 'YOUR_CLIENT_ID',
      redirect_uri: 'https://your-portal.gov.br/callback',
      scope: 'openid profile email',
    },
  },

  // 📄 Integração customizada: Sistema de Assinatura Digital
  {
    id: 'digital-signature',
    name: 'Assinatura Digital ICP-Brasil',
    category: 'document-processing',
    src: 'https://cdn.iti.gov.br/digital-signature.js',
    async: true,
    config: {
      certificate_validation: true,
      timestamp_server: 'https://timestamp.iti.gov.br/',
    },
  },

  // 💬 Integração customizada: Chat do Cidadão
  {
    id: 'citizen-chat',
    name: 'Chat do Cidadão',
    category: 'citizen-chat',
    src: 'https://chat.your-portal.gov.br/widget.js',
    async: true,
    config: {
      department: 'atendimento-cidadao',
      language: 'pt-BR',
      business_hours: '08:00-18:00',
    },
  },

  // ♿ Integração customizada: Leitor de Tela Avançado
  {
    id: 'advanced-screen-reader',
    name: 'Leitor de Tela Avançado',
    category: 'accessibility-enhanced',
    src: 'https://accessibility.your-portal.gov.br/reader.js',
    async: true,
    config: {
      voice_speed: 'medium',
      auto_read: false,
      high_contrast: true,
    },
  },
]

// 📊 Componente para exibir status das categorias customizadas
function CustomCategoriesStatus() {
  const { preferences, consented } = useConsent()
  const { allCategories } = useCategories()

  if (!consented) {
    return (
      <div style={{ padding: '20px', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
        ⚠️ <strong>Consentimento pendente.</strong> Configure suas preferências de cookies.
      </div>
    )
  }

  const customCats = allCategories.filter(
    (cat) =>
      !['necessary', 'analytics', 'functional', 'marketing', 'social', 'personalization'].includes(
        cat.id,
      ),
  )

  return (
    <div style={{ padding: '20px', backgroundColor: '#d4edda', borderRadius: '8px' }}>
      <h3>✅ Status das Categorias Customizadas</h3>
      {customCats.length === 0 ? (
        <p>Nenhuma categoria customizada encontrada.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {customCats.map((category) => (
            <li
              key={category.id}
              style={{
                margin: '12px 0',
                padding: '10px',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                <span style={{ fontSize: '18px', marginRight: '8px' }}>
                  {preferences[category.id] ? '✅' : '❌'}
                </span>
                <strong>{category.name}</strong>
                {category.essential && (
                  <span style={{ marginLeft: '8px', fontSize: '12px', color: '#dc3545' }}>
                    (obrigatório)
                  </span>
                )}
              </div>
              <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
                {category.description}
              </p>
              {category.cookies && (
                <details style={{ marginTop: '5px' }}>
                  <summary style={{ cursor: 'pointer', fontSize: '12px', color: '#007bff' }}>
                    Ver cookies utilizados ({category.cookies.length})
                  </summary>
                  <ul style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>
                    {category.cookies.map((cookie) => (
                      <li key={cookie}>
                        <code>{cookie}</code>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// 🎯 Componente principal do exemplo
function CustomCategoriesDemo() {
  const { preferences, setPreference } = useConsent()

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      <header>
        <h1>🏛️ Portal do Cidadão - Categorias Customizadas</h1>
        <p>
          Exemplo demonstrando uso de categorias customizadas específicas para um portal
          governamental.
        </p>
      </header>

      <main>
        <section style={{ margin: '30px 0' }}>
          <h2>📊 Status das Categorias Customizadas</h2>
          <CustomCategoriesStatus />
        </section>

        <section style={{ margin: '30px 0' }}>
          <h2>🎯 Recursos Condicionais por Categoria</h2>

          {/* Login GOV.BR */}
          <div
            style={{
              margin: '20px 0',
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '8px',
            }}
          >
            <h3>🏛️ Login GOV.BR</h3>
            <ConsentGate category="government-integration">
              <div style={{ padding: '10px', backgroundColor: '#e8f5e8', borderRadius: '4px' }}>
                ✅ <strong>Login GOV.BR ativo!</strong>
                <br />
                <small>Sistema de autenticação único do governo federal disponível.</small>
                <br />
                <button
                  style={{
                    marginTop: '10px',
                    padding: '8px 16px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                  }}
                >
                  Fazer Login com GOV.BR
                </button>
              </div>
            </ConsentGate>
            {!preferences['government-integration'] && (
              <div style={{ padding: '10px', backgroundColor: '#f8d7da', borderRadius: '4px' }}>
                ❌ Login GOV.BR desabilitado.
                <button
                  onClick={() => setPreference('government-integration', true)}
                  style={{ margin: '0 10px', padding: '4px 8px', fontSize: '12px' }}
                >
                  Habilitar
                </button>
              </div>
            )}
          </div>

          {/* Assinatura Digital */}
          <div
            style={{
              margin: '20px 0',
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '8px',
            }}
          >
            <h3>📄 Assinatura Digital ICP-Brasil</h3>
            <ConsentGate category="document-processing">
              <div style={{ padding: '10px', backgroundColor: '#e8f5e8', borderRadius: '4px' }}>
                ✅ <strong>Sistema de Assinatura Digital ativo!</strong>
                <br />
                <small>Você pode assinar documentos digitalmente com certificado ICP-Brasil.</small>
                <br />
                <button
                  style={{
                    marginTop: '10px',
                    padding: '8px 16px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                  }}
                >
                  Assinar Documento
                </button>
              </div>
            </ConsentGate>
            {!preferences['document-processing'] && (
              <div style={{ padding: '10px', backgroundColor: '#f8d7da', borderRadius: '4px' }}>
                ❌ Assinatura digital desabilitada.
                <button
                  onClick={() => setPreference('document-processing', true)}
                  style={{ margin: '0 10px', padding: '4px 8px', fontSize: '12px' }}
                >
                  Habilitar
                </button>
              </div>
            )}
          </div>

          {/* Chat do Cidadão */}
          <div
            style={{
              margin: '20px 0',
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '8px',
            }}
          >
            <h3>💬 Chat do Cidadão</h3>
            <ConsentGate category="citizen-chat">
              <div style={{ padding: '10px', backgroundColor: '#e8f5e8', borderRadius: '4px' }}>
                ✅ <strong>Chat do Cidadão ativo!</strong>
                <br />
                <small>Atendimento direto para dúvidas e suporte (08:00-18:00).</small>
                <br />
                <button
                  style={{
                    marginTop: '10px',
                    padding: '8px 16px',
                    backgroundColor: '#6f42c1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                  }}
                >
                  Iniciar Chat
                </button>
              </div>
            </ConsentGate>
            {!preferences['citizen-chat'] && (
              <div style={{ padding: '10px', backgroundColor: '#f8d7da', borderRadius: '4px' }}>
                ❌ Chat do cidadão desabilitado.
                <button
                  onClick={() => setPreference('citizen-chat', true)}
                  style={{ margin: '0 10px', padding: '4px 8px', fontSize: '12px' }}
                >
                  Habilitar
                </button>
              </div>
            )}
          </div>

          {/* Acessibilidade Avançada */}
          <div
            style={{
              margin: '20px 0',
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '8px',
            }}
          >
            <h3>♿ Acessibilidade Avançada</h3>
            <ConsentGate category="accessibility-enhanced">
              <div style={{ padding: '10px', backgroundColor: '#e8f5e8', borderRadius: '4px' }}>
                ✅ <strong>Recursos avançados de acessibilidade ativos!</strong>
                <br />
                <small>
                  Leitor de tela avançado, alto contraste e navegação por voz disponíveis.
                </small>
                <br />
                <button
                  style={{
                    marginTop: '10px',
                    padding: '8px 16px',
                    backgroundColor: '#fd7e14',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                  }}
                >
                  Configurar Acessibilidade
                </button>
              </div>
            </ConsentGate>
            {!preferences['accessibility-enhanced'] && (
              <div style={{ padding: '10px', backgroundColor: '#f8d7da', borderRadius: '4px' }}>
                ❌ Recursos avançados de acessibilidade desabilitados.
                <button
                  onClick={() => setPreference('accessibility-enhanced', true)}
                  style={{ margin: '0 10px', padding: '4px 8px', fontSize: '12px' }}
                >
                  Habilitar
                </button>
              </div>
            )}
          </div>
        </section>

        <section style={{ margin: '30px 0' }}>
          <h2>⚙️ Controles Avançados</h2>
          <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <h4>Controle Granular das Categorias Customizadas</h4>
            {customCategories.map((category) => (
              <label key={category.id} style={{ display: 'block', margin: '10px 0' }}>
                <input
                  type="checkbox"
                  checked={preferences[category.id] || false}
                  onChange={(e) => setPreference(category.id, e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                <strong>{category.name}</strong>
                <br />
                <small style={{ color: '#666', marginLeft: '20px' }}>{category.description}</small>
              </label>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

// 🚀 Componente principal exportado
export function CustomCategoriesExample() {
  return (
    <ConsentProvider
      // Combina categorias padrão com categorias customizadas
      categories={{
        enabledCategories: ['analytics', 'functional'], // Categorias padrão
        customCategories, // Categorias customizadas definidas acima
      }}
      texts={{
        bannerMessage:
          'Este portal governamental utiliza cookies para funcionalidades essenciais e serviços ao cidadão.',
        acceptAll: 'Aceitar Todos os Cookies',
        declineAll: 'Apenas Essenciais',
        preferences: 'Configurar Preferências',
        modalTitle: 'Configurações de Privacidade - Portal do Cidadão',
        modalIntro:
          'Configure suas preferências de cookies. Você pode alterá-las a qualquer momento.',
        save: 'Salvar Preferências',
        close: 'Fechar',
        controllerInfo: 'Controlador: Governo do Estado (CNPJ: 03.512.256/0001-48)',
        userRights:
          'Seus direitos: acessar, corrigir, excluir, portar dados e revogar consentimento.',
        contactInfo: 'DPO: dpo@governo.ms.gov.br | Tel: (67) 3318-1000',
      }}
      onConsentGiven={(state) => {
        console.log('🎉 Consentimento dado - Categorias customizadas:', state)
      }}
      onPreferencesSaved={(prefs) => {
        console.log('💾 Preferências salvas - Categorias customizadas:', prefs)
      }}
      blocking={true}
    >
      {/* Scripts carregam automaticamente baseado no consentimento */}
      <ConsentScriptLoader integrations={customIntegrations} />
      <CustomCategoriesDemo />
    </ConsentProvider>
  )
}

export default CustomCategoriesExample
