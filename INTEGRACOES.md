# Guia de Integrações

## 🚀 Visão Geral

A biblioteca oferece integrações nativas para as ferramentas mais comuns, eliminando a necessidade de código manual para o carregamento condicional de scripts de terceiros.

O componente `ConsentScriptLoader` gerencia o carregamento desses scripts automaticamente, disparando-os apenas quando o usuário concede consentimento para a categoria correspondente.

## 🎯 Integrações Disponíveis

### 1. Google Analytics 4 (GA4)

- **Categoria**: `analytics`
- **Função**: `createGoogleAnalyticsIntegration(config)`

```tsx
import {
  createGoogleAnalyticsIntegration,
  ConsentScriptLoader
} from 'react-lgpd-consent'

const integrations = [
  createGoogleAnalyticsIntegration({
    measurementId: 'G-XXXXXXXXXX',
    // Você pode passar configurações adicionais para o GA4 aqui
    config: {
      anonymize_ip: true,
    }
  })
]

<ConsentScriptLoader integrations={integrations} />
```

### 2. Google Tag Manager (GTM)

- **Categoria**: `analytics`
- **Função**: `createGoogleTagManagerIntegration(config)`

```tsx
import { createGoogleTagManagerIntegration } from 'react-lgpd-consent'

const integrations = [
  createGoogleTagManagerIntegration({
    gtmId: 'GTM-XXXXXXX',
    dataLayerName: 'dataLayer', // Opcional
  }),
]
```

### 3. UserWay (Acessibilidade)

- **Categoria**: `functional`
- **Função**: `createUserWayIntegration(config)`

```tsx
import { createUserWayIntegration } from 'react-lgpd-consent'

const integrations = [
  createUserWayIntegration({
    accountId: 'USERWAY_ACCOUNT_ID',
  }),
]
```

## 🔧 Uso Avançado

### Múltiplas Integrações

Você pode combinar múltiplas integrações em um único `ConsentScriptLoader`.

```tsx
import {
  createGoogleAnalyticsIntegration,
  createUserWayIntegration,
  ConsentScriptLoader,
} from 'react-lgpd-consent'

const integrations = [
  createGoogleAnalyticsIntegration({ measurementId: 'G-XXXXXXXXXX' }),
  createUserWayIntegration({ accountId: 'USERWAY_ACCOUNT_ID' }),
]

function App() {
  return (
    <ConsentProvider categories={{ enabledCategories: ['analytics', 'functional'] }}>
      <ConsentScriptLoader integrations={integrations} />
      {/* Sua aplicação */}
    </ConsentProvider>
  )
}
```

## 🎨 Criando Integrações Customizadas

Você pode criar sua própria lógica de integração para qualquer script de terceiros implementando a interface `ScriptIntegration`.

### Interface `ScriptIntegration`

```typescript
interface ScriptIntegration {
  id: string // ID único para o script
  category: string // Categoria de consentimento que habilita o script
  src: string // URL do script
  init?: () => void // Função opcional para executar após o carregamento
  attrs?: Record<string, string> // Atributos HTML para a tag <script>
}
```

### Exemplo: Facebook Pixel

```tsx
function createFacebookPixelIntegration(pixelId: string): ScriptIntegration {
  return {
    id: 'facebook-pixel',
    category: 'marketing', // Requer consentimento de marketing
    src: 'https://connect.facebook.net/en_US/fbevents.js',
    init: () => {
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('init', pixelId)
        window.fbq('track', 'PageView')
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

---

## ✨ Novas Integrações (v0.4.1)

### 4. Facebook Pixel

- Categoria: `marketing`
- Função: `createFacebookPixelIntegration(config)`

```tsx
import { createFacebookPixelIntegration, ConsentScriptLoader } from 'react-lgpd-consent'

const integrations = [
  createFacebookPixelIntegration({ pixelId: 'YOUR_PIXEL_ID', autoTrack: true })
]

<ConsentScriptLoader integrations={integrations} />
```

### 5. Hotjar

- Categoria: `analytics`
- Função: `createHotjarIntegration(config)`

```tsx
import { createHotjarIntegration } from 'react-lgpd-consent'

const integrations = [createHotjarIntegration({ siteId: '123456', version: 6 })]
```

### 6. Mixpanel

- Categoria: `analytics`
- Função: `createMixpanelIntegration(config)`

```tsx
import { createMixpanelIntegration } from 'react-lgpd-consent'

const integrations = [createMixpanelIntegration({ token: 'YOUR_TOKEN' })]
```

### 7. Microsoft Clarity

- Categoria: `analytics`
- Função: `createClarityIntegration(config)`

```tsx
import { createClarityIntegration } from 'react-lgpd-consent'

const integrations = [createClarityIntegration({ projectId: 'abcdef' })]
```

### 8. Intercom / Zendesk Chat

- Categoria: `functional`
- Funções: `createIntercomIntegration`, `createZendeskChatIntegration`

```tsx
import { createIntercomIntegration, createZendeskChatIntegration } from 'react-lgpd-consent'

const integrations = [
  createIntercomIntegration({ app_id: 'your_app_id' }),
  createZendeskChatIntegration({ key: 'your_zendesk_key' }),
]
```

## 🧠 Helpers & Templates (v0.4.1)

- `suggestCategoryForScript(name: string)`: sugere a categoria recomendada
- Templates de negócio:
  - `createECommerceIntegrations`
  - `createSaaSIntegrations`
  - `createCorporateIntegrations`
  - `INTEGRATION_TEMPLATES` com IDs e categorias recomendadas

```tsx
import { createECommerceIntegrations, INTEGRATION_TEMPLATES } from 'react-lgpd-consent'

const integrations = createECommerceIntegrations({
  googleAnalytics: { measurementId: 'G-XYZ' },
  facebookPixel: { pixelId: '123' },
})

// INTEGRATION_TEMPLATES.ecommerce.categories -> ['analytics','marketing','functional']
```

### Exemplos detalhados por template

#### E-commerce

```tsx
import React from 'react'
import { ConsentProvider, ConsentScriptLoader } from 'react-lgpd-consent'
import { createECommerceIntegrations } from 'react-lgpd-consent'

function App() {
  const integrations = createECommerceIntegrations({
    googleAnalytics: { measurementId: 'G-XXXX' },
    facebookPixel: { pixelId: '1234567890' },
    hotjar: { siteId: '999999', version: 6 },
    // userway opcional
  })

  return (
    <ConsentProvider categories={{ enabledCategories: ['analytics', 'marketing', 'functional'] }}>
      <ConsentScriptLoader integrations={integrations} />
      {/* Seu app */}
    </ConsentProvider>
  )
}
```

#### SaaS

```tsx
import React from 'react'
import { ConsentProvider, ConsentScriptLoader } from 'react-lgpd-consent'
import { createSaaSIntegrations } from 'react-lgpd-consent'

function App() {
  const integrations = createSaaSIntegrations({
    googleAnalytics: { measurementId: 'G-YYYY' },
    mixpanel: { token: 'mixpanel-token' },
    intercom: { app_id: 'your-intercom-app-id' },
    hotjar: { siteId: '888888' },
  })

  return (
    <ConsentProvider categories={{ enabledCategories: ['analytics', 'functional'] }}>
      <ConsentScriptLoader integrations={integrations} />
      {/* Seu app */}
    </ConsentProvider>
  )
}
```

#### Corporate

```tsx
import React from 'react'
import { ConsentProvider, ConsentScriptLoader } from 'react-lgpd-consent'
import { createCorporateIntegrations } from 'react-lgpd-consent'

function App() {
  const integrations = createCorporateIntegrations({
    googleAnalytics: { measurementId: 'G-ZZZZ' },
    clarity: { projectId: 'clarity-project-id' },
    zendesk: { key: 'your-zendesk-key' },
    userway: { accountId: 'userway-account' },
  })

  return (
    <ConsentProvider categories={{ enabledCategories: ['analytics', 'functional'] }}>
      <ConsentScriptLoader integrations={integrations} />
      {/* Seu app */}
    </ConsentProvider>
  )
}
```

Notas:
- Garanta que `enabledCategories` contemplem as categorias necessárias para as integrações escolhidas.
- Integrações só serão carregadas após consentimento explícito e quando a categoria correspondente estiver `true` nas preferências.
- Em modo bloqueante, o backdrop do banner pode ser configurado via `designTokens.layout.backdrop`:
  - `false` (transparente), `'auto'` (sensível ao tema) ou string (ex.: `'#00000088'`).
