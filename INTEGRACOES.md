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
