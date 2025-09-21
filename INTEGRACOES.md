# Guia de Integrações

## 🚀 Visão Geral

A biblioteca oferece integrações nativas para as ferramentas mais comuns, eliminando a necessidade de código manual para o carregamento condicional de scripts de terceiros.

O componente `ConsentScriptLoader` gerencia o carregamento desses scripts automaticamente, disparando-os apenas quando o usuário concede consentimento para a categoria correspondente.

## 🎯 Integrações Nativas Disponíveis

A biblioteca oferece integrações nativas para as ferramentas mais comuns, eliminando a necessidade de código manual para o carregamento condicional de scripts de terceiros.

O componente `ConsentScriptLoader` gerencia o carregamento desses scripts automaticamente, disparando-os apenas quando o usuário concede consentimento para a categoria correspondente.

### 1. Google Analytics 4 (GA4)

- **Categoria**: `analytics`
- **Função**: `createGoogleAnalyticsIntegration(config)`
- **Descrição**: Integração completa com o Google Analytics 4. Suporta `measurementId` e configurações adicionais para o `gtag`.

```tsx
import { createGoogleAnalyticsIntegration, ConsentScriptLoader } from 'react-lgpd-consent'

const integrations = [
  createGoogleAnalyticsIntegration({
    measurementId: 'G-XXXXXXXXXX',
    config: { anonymize_ip: true },
  })
]

<ConsentScriptLoader integrations={integrations} />
```

### 2. Google Tag Manager (GTM)

- **Categoria**: `analytics`
- **Função**: `createGoogleTagManagerIntegration(config)`
- **Descrição**: Carrega o container do Google Tag Manager. Suporta `gtmId` e `dataLayerName`.

```tsx
import { createGoogleTagManagerIntegration } from 'react-lgpd-consent'

const integrations = [
  createGoogleTagManagerIntegration({ gtmId: 'GTM-XXXXXXX' })
]
```

### 3. Facebook Pixel

- **Categoria**: `marketing`
- **Função**: `createFacebookPixelIntegration(config)`
- **Descrição**: Integração com o Facebook Pixel. Suporta `pixelId` e `autoTrack` para `PageView`.

```tsx
import { createFacebookPixelIntegration } from 'react-lgpd-consent'

const integrations = [
  createFacebookPixelIntegration({ pixelId: 'YOUR_PIXEL_ID', autoTrack: true })
]
```

### 4. Hotjar

- **Categoria**: `analytics`
- **Função**: `createHotjarIntegration(config)`
- **Descrição**: Carrega o script do Hotjar para análise de comportamento. Suporta `siteId`, `version` e modo `debug`.

```tsx
import { createHotjarIntegration } from 'react-lgpd-consent'

const integrations = [createHotjarIntegration({ siteId: '123456', version: 6 })]
```

### 5. Mixpanel

- **Categoria**: `analytics`
- **Função**: `createMixpanelIntegration(config)`
- **Descrição**: Integração com o Mixpanel para análise de produtos. Suporta `token` e configurações customizadas.

```tsx
import { createMixpanelIntegration } from 'react-lgpd-consent'

const integrations = [createMixpanelIntegration({ token: 'YOUR_TOKEN' })]
```

### 6. Microsoft Clarity

- **Categoria**: `analytics`
- **Função**: `createClarityIntegration(config)`
- **Descrição**: Integração com o Microsoft Clarity. Suporta `projectId`.

```tsx
import { createClarityIntegration } from 'react-lgpd-consent'

const integrations = [createClarityIntegration({ projectId: 'abcdef' })]
```

### 7. Intercom

- **Categoria**: `functional`
- **Função**: `createIntercomIntegration(config)`
- **Descrição**: Adiciona o widget de chat do Intercom. Suporta `app_id`.

```tsx
import { createIntercomIntegration } from 'react-lgpd-consent'

const integrations = [createIntercomIntegration({ app_id: 'your_app_id' })]
```

### 8. Zendesk Chat

- **Categoria**: `functional`
- **Função**: `createZendeskChatIntegration(config)`
- **Descrição**: Adiciona o widget do Zendesk Chat. Suporta `key`.

```tsx
import { createZendeskChatIntegration } from 'react-lgpd-consent'

const integrations = [createZendeskChatIntegration({ key: 'your_zendesk_key' })]
```

### 9. UserWay (Acessibilidade)

- **Categoria**: `functional`
- **Função**: `createUserWayIntegration(config)`
- **Descrição**: Adiciona o widget de acessibilidade do UserWay. Suporta `accountId`.

```tsx
import { createUserWayIntegration } from 'react-lgpd-consent'

const integrations = [createUserWayIntegration({ accountId: 'USERWAY_ACCOUNT_ID' })]
```

---

## 🧠 Helpers e Templates (v0.4.1)

Para simplificar a configuração de múltiplas integrações, a biblioteca oferece templates e funções de ajuda.

- `suggestCategoryForScript(name: string)`: Sugere a categoria LGPD apropriada para um nome de script conhecido.
- `createECommerceIntegrations`, `createSaaSIntegrations`, `createCorporateIntegrations`: Templates de negócio que agrupam as integrações mais comuns para cada setor.
- `INTEGRATION_TEMPLATES`: Constante com presets de IDs e categorias para cada template.

### Exemplo de Template (E-commerce)

```tsx
import { ConsentProvider, ConsentScriptLoader, createECommerceIntegrations } from 'react-lgpd-consent'

function App() {
  const integrations = createECommerceIntegrations({
    googleAnalytics: { measurementId: 'G-XXXX' },
    facebookPixel: { pixelId: '1234567890' },
    hotjar: { siteId: '999999' },
  })

  return (
    <ConsentProvider categories={{ enabledCategories: ['analytics', 'marketing', 'functional'] }}>
      <ConsentScriptLoader integrations={integrations} />
      {/* Seu app */}
    </ConsentProvider>
  )
}
```

---

## 🔎 Descoberta Automática de Cookies (Experimental v0.4.1)

A biblioteca inclui funcionalidades experimentais para facilitar a auditoria e o mapeamento de cookies.

- **Detecção em Runtime**: Em modo de desenvolvimento, a biblioteca escaneia e loga os cookies encontrados no console.
- **Categorização Automática**: A função `categorizeDiscoveredCookies` usa heurísticas para sugerir a categoria de um cookie.
- **Uso Programático**:

```ts
import { discoverRuntimeCookies, categorizeDiscoveredCookies } from 'react-lgpd-consent'

// 1. Descobre cookies em tempo de execução
const discovered = discoverRuntimeCookies()

// 2. Categoriza e registra no catálogo de cookies do modal
categorizeDiscoveredCookies(discovered, true)
```

---

## 🎨 Criando Integrações Customizadas

Se precisar de uma integração que não é oferecida nativamente, você pode criar a sua implementando a interface `ScriptIntegration`.

```typescript
interface ScriptIntegration {
  id: string // ID único para o script
  category: string // Categoria de consentimento que habilita o script
  src: string // URL do script
  init?: () => void // Função opcional para executar após o carregamento
  attrs?: Record<string, string> // Atributos HTML para a tag <script>
}
```

---

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
