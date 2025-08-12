# Integrações Nativas - react-lgpd-consent

## 🚀 Visão Geral

A partir da versão 0.2.0, a biblioteca oferece **integrações nativas** para as ferramentas mais comuns, eliminando a necessidade de código manual para carregamento condicional.

## 🎯 Integrações Disponíveis

### 1. Google Analytics 4 (GA4)

```tsx
import {
  createGoogleAnalyticsIntegration,
  ConsentScriptLoader
} from 'react-lgpd-consent'

const integrations = [
  createGoogleAnalyticsIntegration({
    measurementId: 'GA_MEASUREMENT_ID',
    config: {
      anonymize_ip: true,
      allow_google_signals: false,
    }
  })
]

<ConsentScriptLoader integrations={integrations} />
```

**Funcionalidades:**

- ✅ Carregamento automático após consentimento `analytics`
- ✅ Inicialização do `gtag()` global
- ✅ Configuração customizável
- ✅ Suporte a Enhanced eCommerce

### 2. Google Tag Manager (GTM)

```tsx
import { createGoogleTagManagerIntegration } from 'react-lgpd-consent'

const integrations = [
  createGoogleTagManagerIntegration({
    containerId: 'GTM-XXXXXXX',
    dataLayerName: 'dataLayer', // Opcional
  }),
]
```

**Funcionalidades:**

- ✅ Carregamento automático após consentimento `analytics`
- ✅ Inicialização do Data Layer
- ✅ Nome customizável do Data Layer
- ✅ Integração com eventos personalizados

### 3. UserWay (Acessibilidade)

```tsx
import { createUserWayIntegration } from 'react-lgpd-consent'

const integrations = [
  createUserWayIntegration({
    accountId: 'USERWAY_ACCOUNT_ID',
  }),
]
```

**Funcionalidades:**

- ✅ Carregamento automático após consentimento `social` (ou categoria customizada)
- ✅ Widget de acessibilidade
- ✅ Configuração automática da conta

## 🔧 Uso Avançado

### Múltiplas Integrações

```tsx
import {
  createGoogleAnalyticsIntegration,
  createGoogleTagManagerIntegration,
  createUserWayIntegration,
  ConsentScriptLoader,
} from 'react-lgpd-consent'

const integrations = [
  createGoogleAnalyticsIntegration({
    measurementId: process.env.REACT_APP_GA_ID,
  }),
  createGoogleTagManagerIntegration({
    containerId: process.env.REACT_APP_GTM_ID,
  }),
  createUserWayIntegration({
    accountId: process.env.REACT_APP_USERWAY_ID,
  }),
]

function App() {
  return (
    <ConsentProvider>
      <ConsentScriptLoader integrations={integrations} />
      <CookieBanner policyLinkUrl="/privacy" />
      {/* Sua aplicação */}
    </ConsentProvider>
  )
}
```

### Integração Manual com Hook

```tsx
import { useConsentScriptLoader } from 'react-lgpd-consent'

function MyAnalytics() {
  const loadScript = useConsentScriptLoader()

  React.useEffect(() => {
    const integration = createGoogleAnalyticsIntegration({
      measurementId: 'GA_ID',
    })

    loadScript(integration)
  }, [loadScript])

  return null
}
```

## 🎨 Criando Integrações Customizadas

### Interface ScriptIntegration

```typescript
interface ScriptIntegration {
  id: string // ID único
  category: string // Categoria de consentimento
  src: string // URL do script
  init?: () => void // Função de inicialização
  attrs?: Record<string, string> // Atributos HTML
}
```

### Exemplo: Facebook Pixel

```tsx
function createFacebookPixelIntegration(pixelId: string): ScriptIntegration {
  return {
    id: 'facebook-pixel',
    category: 'marketing',
    src: 'https://connect.facebook.net/en_US/fbevents.js',
    init: () => {
      if (typeof window !== 'undefined') {
        // @ts-ignore
        window.fbq =
          window.fbq ||
          function () {
            // @ts-ignore
            ;(window.fbq.q = window.fbq.q || []).push(arguments)
          }
        // @ts-ignore
        window.fbq('init', pixelId)
        // @ts-ignore
        window.fbq('track', 'PageView')
      }
    },
  }
}
```

### Exemplo: Hotjar

```tsx
function createHotjarIntegration(hjid: string): ScriptIntegration {
  return {
    id: 'hotjar',
    category: 'analytics',
    src: `https://static.hotjar.com/c/hotjar-${hjid}.js?sv=6`,
    init: () => {
      if (typeof window !== 'undefined') {
        // @ts-ignore
        window.hj =
          window.hj ||
          function () {
            // @ts-ignore
            ;(window.hj.q = window.hj.q || []).push(arguments)
          }
        // @ts-ignore
        window._hjSettings = { hjid: parseInt(hjid), hjsv: 6 }
      }
    },
  }
}
```

## 📊 Categorias Recomendadas

| Ferramenta         | Categoria Recomendada | Justificativa                    |
| ------------------ | --------------------- | -------------------------------- |
| Google Analytics   | `analytics`           | Coleta estatísticas de uso       |
| Google Tag Manager | `analytics`           | Container de tags analíticas     |
| Facebook Pixel     | `marketing`           | Publicidade direcionada          |
| Hotjar/FullStory   | `analytics`           | Análise comportamental           |
| UserWay/AccessiBe  | `functional`          | Funcionalidade de acessibilidade |
| Live Chat          | `functional`          | Funcionalidade de suporte        |
| YouTube/Vimeo      | `social`              | Conteúdo de redes sociais        |

## 🔍 Debug e Monitoramento

### Logs Automáticos

O `ConsentScriptLoader` automaticamente loga o status dos scripts:

```
✅ Script loaded: google-analytics (analytics)
❌ Failed to load script: facebook-pixel Error: Network failed
⚠️ Cannot load script hotjar: Category 'analytics' not consented
```

### Monitoramento Manual

```tsx
import { useConsent } from 'react-lgpd-consent'

function ScriptStatus() {
  const { preferences, consented } = useConsent()

  return (
    <div>
      <h3>Status dos Scripts</h3>
      <ul>
        <li>Analytics: {preferences.analytics ? '✅' : '❌'}</li>
        <li>Marketing: {preferences.marketing ? '✅' : '❌'}</li>
        <li>Social: {preferences.social ? '✅' : '❌'}</li>
      </ul>
    </div>
  )
}
```

## 🚫 Limitações Atuais

- ⚠️ Scripts carregam apenas uma vez por sessão
- ⚠️ Sem suporte a recarregamento dinâmico (use `reloadOnChange: true`)
- ⚠️ Inicialização assíncrona pode ter delay de ~150ms

## 🗺️ Roadmap

### v0.3.0

- [ ] Mais integrações nativas (Hotjar, Intercom, Crisp)
- [ ] Suporte a condições múltiplas (`analytics AND functional`)
- [ ] Sistema de prioridades para carregamento
- [ ] Cache inteligente de scripts

### v0.4.0

- [ ] Plugin system para integrações de terceiros
- [ ] Integração com CSP (Content Security Policy)
- [ ] Lazy loading baseado em interação do usuário
- [ ] Métricas de performance dos scripts
