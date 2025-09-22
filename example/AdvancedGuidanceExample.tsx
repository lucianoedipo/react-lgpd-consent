// example/AdvancedGuidanceExample.tsx
import React from 'react'
import {
  analyzeDeveloperConfiguration,
  ConsentProvider,
  GUIDANCE_PRESETS,
  logDeveloperGuidance,
  type GuidanceConfig,
  type ProjectCategoriesConfig,
} from 'react-lgpd-consent'

// Exemplo 1: Usando presets de configuração
function ExampleWithPresets() {
  return (
    <ConsentProvider
      categories={{
        enabledCategories: ['analytics', 'marketing'],
      }}
      // Use preset de desenvolvimento com todos os recursos
      guidanceConfig={GUIDANCE_PRESETS.development}
    >
      <div>App com guidance completo</div>
    </ConsentProvider>
  )
}

// Exemplo 2: Configuração personalizada
function ExampleWithCustomConfig() {
  const customGuidanceConfig: GuidanceConfig = {
    showWarnings: true,
    showSuggestions: true,
    showCategoriesTable: true,
    showBestPractices: false, // Desabilitar dicas de boas práticas
    showComplianceScore: true,
    minimumSeverity: 'warning', // Só mostrar warnings e errors
    messageProcessor: (messages) => {
      // Processar mensagens customizadamente
      console.log('🔍 Custom guidance processor:', messages)

      // Exemplo: enviar métricas para analytics
      const criticalIssues = messages.filter((m) => m.severity === 'error').length
      if (criticalIssues > 0) {
        // analytics.track('lgpd_critical_issues', { count: criticalIssues })
      }
    },
  }

  return (
    <ConsentProvider
      categories={{
        enabledCategories: ['analytics'],
        customCategories: [
          {
            id: 'social',
            name: 'Redes Sociais',
            description: 'Integração com plataformas sociais',
            essential: false,
          },
        ],
      }}
      guidanceConfig={customGuidanceConfig}
    >
      <div>App com guidance personalizado</div>
    </ConsentProvider>
  )
}

// Exemplo 3: Análise programática da configuração
function ConfigurationAnalyzer() {
  const projectConfig: ProjectCategoriesConfig = {
    enabledCategories: ['analytics', 'marketing', 'functional'],
    customCategories: [
      {
        id: 'surveys',
        name: 'Pesquisas',
        description: 'Cookies para pesquisas de satisfação',
        essential: false,
      },
    ],
  }

  // Analisar configuração programaticamente
  const guidance = analyzeDeveloperConfiguration(projectConfig)

  React.useEffect(() => {
    console.log('📊 Análise da configuração:')
    console.log('Score de conformidade:', guidance.complianceScore)
    console.log('Usando padrões:', guidance.usingDefaults)
    console.log('Categorias ativas:', guidance.activeCategoriesInfo.length)
    console.log('Mensagens de guidance:', guidance.messages)

    // Log manual com configuração específica
    logDeveloperGuidance(guidance, false, {
      showWarnings: true,
      showSuggestions: false,
      showCategoriesTable: true,
      showBestPractices: false,
      showComplianceScore: true,
      minimumSeverity: 'info',
    })
  }, [guidance])

  return (
    <div>
      <h3>Análise de Configuração</h3>
      <p>Score LGPD: {guidance.complianceScore}/100</p>
      <p>Categorias: {guidance.activeCategoriesInfo.length}</p>
      <p>Avisos: {guidance.warnings.length}</p>
      <p>Sugestões: {guidance.suggestions.length}</p>
    </div>
  )
}

// Exemplo 4: Diferentes ambientes
function EnvironmentSpecificGuidance() {
  const isDevelopment = process.env.NODE_ENV === 'development'
  const isStaging = process.env.NODE_ENV === 'staging'

  const getGuidanceConfig = (): GuidanceConfig => {
    if (isDevelopment) {
      return GUIDANCE_PRESETS.development // Tudo habilitado
    }
    if (isStaging) {
      return GUIDANCE_PRESETS.compliance // Foco em conformidade
    }
    return GUIDANCE_PRESETS.production // Silencioso em produção
  }

  return (
    <ConsentProvider
      categories={{
        enabledCategories: ['analytics', 'functional'],
      }}
      guidanceConfig={getGuidanceConfig()}
    >
      <div>App com guidance adaptado ao ambiente</div>
    </ConsentProvider>
  )
}

// Exemplo principal que demonstra todos os casos
export default function AdvancedGuidanceExample() {
  const [activeExample, setActiveExample] = React.useState<string>('presets')

  const examples = {
    presets: <ExampleWithPresets />,
    custom: <ExampleWithCustomConfig />,
    analyzer: <ConfigurationAnalyzer />,
    environment: <EnvironmentSpecificGuidance />,
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🔧 Sistema Avançado de Developer Guidance</h1>

      <div style={{ marginBottom: '2rem' }}>
        <h3>Escolha um exemplo:</h3>
        {Object.keys(examples).map((key) => (
          <button
            key={key}
            onClick={() => setActiveExample(key)}
            style={{
              margin: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: activeExample === key ? '#4caf50' : '#f5f5f5',
              color: activeExample === key ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {key}
          </button>
        ))}
      </div>

      <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px' }}>
        {examples[activeExample as keyof typeof examples]}
      </div>

      <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#666' }}>
        <h4>💡 Recursos do Sistema de Guidance:</h4>
        <ul>
          <li>✅ Presets para diferentes ambientes (development, production, compliance)</li>
          <li>✅ Configuração granular (warnings, suggestions, tabelas, score)</li>
          <li>✅ Sistema de severidade (info, warning, error)</li>
          <li>✅ Processamento personalizado de mensagens</li>
          <li>✅ Score de conformidade LGPD (0-100)</li>
          <li>✅ Análise programática da configuração</li>
        </ul>
      </div>
    </div>
  )
}
