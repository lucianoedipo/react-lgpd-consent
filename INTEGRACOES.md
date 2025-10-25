# Guia de Integrações

## 🚀 Visão Geral

A biblioteca oferece integrações nativas para as ferramentas mais comuns, eliminando a necessidade de código manual para o carregamento condicional de scripts de terceiros. As categorias usadas pelas integrações são sempre lidas da prop `categories` do `ConsentProvider` (fonte única de verdade).

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

## 🧱 Nota SSR/Next.js (App Router)

Para evitar hydration mismatch e vazamento de scripts:
- Coloque o `ConsentProvider` dentro de um Client Component e carregue-o com `dynamic(..., { ssr: false })` a partir do `RootLayout` (Server Component).
- Use o `ConsentScriptLoader` para carregar GTM/GA4 somente após consentimento e inicialize o Consent Mode v2 com `gtag('consent','default', denied)` antes de qualquer script.
- Consulte a seção “SSR/Next.js (App Router) — Padrões seguros” em `QUICKSTART.md` para ordem dos provedores/estilos (MUI/Emotion) e checklist SSR.

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

## � Eventos DataLayer (Google Tag Manager)

A partir da versão **0.4.5**, a biblioteca dispara automaticamente eventos padronizados no `dataLayer` para facilitar rastreamento, auditoria LGPD e integrações com o Google Tag Manager.

### Eventos Disponíveis

#### 1. `consent_initialized`

Disparado quando o sistema de consentimento é inicializado (após hidratação).

**Payload:**
```typescript
{
  event: 'consent_initialized',
  consent_version: '0.4.5',
  timestamp: '2025-10-25T13:52:33.729Z',
  categories: {
    necessary: true,
    analytics: false,
    marketing: false
  }
}
```

**Exemplo de uso no GTM:**
- **Tipo de acionador**: Evento personalizado
- **Nome do evento**: `consent_initialized`
- **Variáveis**: `{{categories.analytics}}`, `{{categories.marketing}}`, etc.

#### 2. `consent_updated`

Disparado sempre que o usuário atualiza suas preferências de consentimento.

**Payload:**
```typescript
{
  event: 'consent_updated',
  consent_version: '0.4.5',
  timestamp: '2025-10-25T13:52:33.729Z',
  origin: 'modal', // 'banner' | 'modal' | 'reset' | 'programmatic'
  categories: {
    necessary: true,
    analytics: true,
    marketing: false
  },
  changed_categories: ['analytics']
}
```

**Exemplo de uso no GTM:**
- **Tipo de acionador**: Evento personalizado
- **Nome do evento**: `consent_updated`
- **Condição**: `{{changed_categories}}` contém `analytics`
- **Ação**: Disparar Google Analytics 4

### Configuração no Google Tag Manager

#### Passo 1: Criar Variáveis de DataLayer

No GTM, crie as seguintes variáveis de camada de dados:

1. **DLV - Consent Categories**
   - Tipo: Variável da camada de dados
   - Nome: `categories`

2. **DLV - Consent Origin**
   - Tipo: Variável da camada de dados
   - Nome: `origin`

3. **DLV - Changed Categories**
   - Tipo: Variável da camada de dados
   - Nome: `changed_categories`

#### Passo 2: Criar Acionadores

1. **Acionador: Consent Initialized**
   - Tipo: Evento personalizado
   - Nome do evento: `consent_initialized`

2. **Acionador: Consent Updated - Analytics Accepted**
   - Tipo: Evento personalizado
   - Nome do evento: `consent_updated`
   - Este acionador é acionado em: Alguns eventos personalizados
   - Condição: `{{DLV - Consent Categories}}.analytics` igual a `true`

#### Passo 3: Criar Tags

1. **Tag: Google Analytics 4 (condicionada ao consentimento)**
   - Tipo: Google Analytics: Configuração do GA4
   - ID de medição: `G-XXXXXXXXXX`
   - Acionador: `Consent Updated - Analytics Accepted`

### Exemplo: Auditoria LGPD

Crie uma tag para registrar mudanças de consentimento em um sistema de auditoria:

```javascript
// Tag HTML customizada no GTM
<script>
(function() {
  var auditData = {
    timestamp: {{DLV - timestamp}},
    origin: {{DLV - Consent Origin}},
    categories: {{DLV - Consent Categories}},
    changed: {{DLV - Changed Categories}}
  };
  
  // Enviar para seu sistema de auditoria
  fetch('/api/consent-audit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(auditData)
  });
})();
</script>
```

### API Programática

Para casos avançados, você pode disparar eventos manualmente:

```typescript
import { pushConsentUpdatedEvent } from 'react-lgpd-consent'

// Disparar evento após mudança programática
const handleCustomUpdate = () => {
  const newPreferences = {
    necessary: true,
    analytics: true,
    marketing: false
  }
  
  pushConsentUpdatedEvent(newPreferences, 'programmatic')
}
```

### Tipos TypeScript

```typescript
import type {
  ConsentEvent,
  ConsentEventOrigin,
  ConsentInitializedEvent,
  ConsentUpdatedEvent
} from 'react-lgpd-consent'

// Origem da ação
type ConsentEventOrigin = 'banner' | 'modal' | 'reset' | 'programmatic'

// Evento de inicialização
interface ConsentInitializedEvent {
  event: 'consent_initialized'
  consent_version: string
  timestamp: string
  categories: Record<string, boolean>
}

// Evento de atualização
interface ConsentUpdatedEvent {
  event: 'consent_updated'
  consent_version: string
  timestamp: string
  origin: ConsentEventOrigin
  categories: Record<string, boolean>
  changed_categories: string[]
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

