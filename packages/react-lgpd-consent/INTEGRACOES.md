# Guia de Integrações

## 🚀 Visão Geral

A biblioteca oferece integrações nativas para as ferramentas mais comuns, eliminando a necessidade de código manual para o carregamento condicional de scripts de terceiros. As categorias usadas pelas integrações são sempre lidas da prop `categories` do `ConsentProvider` (fonte única de verdade).

O componente `ConsentScriptLoader` gerencia o carregamento desses scripts automaticamente, disparando-os apenas quando o usuário concede consentimento para a categoria correspondente.

### ✅ Regras de Configuração (RN)

- **Categoria padrão com override**: cada integração define uma categoria padrão, mas o consumidor pode sobrescrever via `category` no config.
- **Config obrigatória**: se um campo obrigatório estiver vazio (ex.: `measurementId`, `containerId`, `pixelId`), a integração **não executa**. Em **dev** é logado erro; em **prod** não há log.
- **DataLayer**: se `globalThis.window.dataLayer` não existir, a biblioteca cria `[]`; se existir e tiver `push`, usa como está; se existir sem `push`, não sobrescreve e avisa em dev.

### ✨ Novidades v0.7.1

- **🎯 Google Consent Mode v2 Automático**: GA4 e GTM agora implementam Consent Mode v2 automaticamente:
  - `bootstrap`: Seta `consent('default', 'denied')` antes de qualquer carregamento
  - `onConsentUpdate`: Envia `consent('update', 'granted')` quando usuário consente
  - Zero configuração manual necessária!

- **🔄 Sistema de Fila com Prioridade**: Scripts são executados ordenadamente:
  1. Categoria `necessary` sempre primeiro
  2. Dentro da mesma categoria: maior `priority` primeiro
  3. Mesmo priority: ordem de registro (timestamp)

- **📝 API `registerScript()`**: Registre scripts programaticamente fora do JSX:

  ```tsx
  import { registerScript } from 'react-lgpd-consent'

  const cleanup = registerScript({
    id: 'my-script',
    category: 'analytics',
    priority: 5,
    execute: async () => {
      /* carrega script */
    },
    onConsentUpdate: ({ preferences }) => {
      /* reage a mudanças */
    },
  })
  ```

> 💡 **Procurando exemplos práticos?** Veja [RECIPES.md](../../doc/RECIPES.md) para receitas passo a passo de Google Consent Mode v2, Next.js App Router e CSP/nonce.

### Atualização de compatibilidade externa (02/07/2026)

As integrações nativas foram revisadas contra a documentação oficial dos provedores:

- **GTM com `dataLayerName` customizado**: a URL agora inclui `&l=<dataLayerName>`, como no snippet oficial do Google Tag Manager.
- **Microsoft Clarity**: a integração envia `clarity('consentv2', ...)` automaticamente em `onConsentUpdate`, preservando `upload` apenas como compatibilidade legada.
- **Intercom**: suporta `api_base`, `settings`, `Intercom('update')` quando o consentimento segue válido e `Intercom('shutdown')` quando a categoria é revogada.
- **Zendesk Messaging**: usa `zE('messenger:set', 'cookies', range)` para sincronizar `all`, `functional` ou `none`.
- **Mixpanel**: mantém `api_host` para projetos com residência regional de dados.

## 🎯 Integrações Nativas Disponíveis

### 1. Google Analytics 4 (GA4)

- **Categoria**: `analytics`
- **Função**: `createGoogleAnalyticsIntegration(config)`
- **Descrição**: Integração completa com o Google Analytics 4. Suporta `measurementId` e configurações adicionais para o `gtag`.
- **✨ Novo v0.7.1**: Google Consent Mode v2 automático (sem configuração manual)

```tsx
import { createGoogleAnalyticsIntegration, ConsentScriptLoader } from 'react-lgpd-consent'

const integrations = [
  createGoogleAnalyticsIntegration({
    measurementId: 'G-XXXXXXXXXX',
    config: { anonymize_ip: true },
  })
]

<ConsentScriptLoader integrations={integrations} />
// ✅ Consent Mode v2 implementado automaticamente:
// - bootstrap: consent('default', 'denied') antes do script
// - onConsentUpdate: consent('update', 'granted') após consentimento
```

### 2. Google Tag Manager (GTM)

- **Categoria**: `analytics`
- **Função**: `createGoogleTagManagerIntegration(config)`
- **Descrição**: Carrega o container do Google Tag Manager. Suporta `containerId` (ou `gtmId` legado) e `dataLayerName`.
- **✨ Novo v0.7.1**: Google Consent Mode v2 automático com dataLayer customizado

```tsx
import { createGoogleTagManagerIntegration } from 'react-lgpd-consent'

const integrations = [
  createGoogleTagManagerIntegration({
    containerId: 'GTM-XXXXXXX',
    dataLayerName: 'customLayer', // opcional; gera &l=customLayer na URL do gtm.js
  }),
]
// ✅ Consent Mode v2 no dataLayer customizado automaticamente
```

### 3. Facebook Pixel

- **Categoria**: `marketing`
- **Função**: `createFacebookPixelIntegration(config)`
- **Descrição**: Integração com o Facebook Pixel. Suporta `pixelId` e `autoTrack` para `PageView`.

```tsx
import { createFacebookPixelIntegration } from 'react-lgpd-consent'

const integrations = [createFacebookPixelIntegration({ pixelId: 'YOUR_PIXEL_ID', autoTrack: true })]
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
- **Descrição**: Integração com o Mixpanel para análise de produtos. Suporta `token`, configurações customizadas e `api_host` para residência regional de dados.

```tsx
import { createMixpanelIntegration } from 'react-lgpd-consent'

const integrations = [
  createMixpanelIntegration({
    token: 'YOUR_TOKEN',
    api_host: 'https://api-eu.mixpanel.com', // use quando seu projeto exigir endpoint regional
  }),
]
```

### 6. Microsoft Clarity

- **Categoria**: `analytics`
- **Função**: `createClarityIntegration(config)`
- **Descrição**: Integração com o Microsoft Clarity. Suporta `projectId` e sincroniza a Consent API v2 (`consentv2`) quando as preferências mudam.

```tsx
import { createClarityIntegration } from 'react-lgpd-consent'

const integrations = [
  createClarityIntegration({
    projectId: 'abcdef',
    analyticsStorageCategory: 'analytics', // padrão
    adStorageCategory: 'marketing', // padrão
  }),
]
```

> A partir de 31/10/2025, a Microsoft exige sinal de consentimento válido para funcionalidade completa do Clarity em visitas originadas de EEA/UK/CH. A integração envia `ad_Storage` e `analytics_Storage` conforme as categorias configuradas.

### 7. Intercom

- **Categoria**: `functional`
- **Função**: `createIntercomIntegration(config)`
- **Descrição**: Adiciona o widget de chat do Intercom. Suporta `app_id`, `api_base`, `settings`, atualização em SPA e encerramento de sessão na revogação de consentimento.

```tsx
import { createIntercomIntegration } from 'react-lgpd-consent'

const integrations = [
  createIntercomIntegration({
    app_id: 'your_app_id',
    api_base: 'https://api-iam.eu.intercom.io', // opcional: US/EU/Australia
    settings: { custom_launcher_selector: '#help' },
  }),
]
```

### 8. Zendesk Chat

- **Categoria**: `functional`
- **Função**: `createZendeskChatIntegration(config)`
- **Descrição**: Adiciona o widget do Zendesk Messaging. Suporta `key` e sincronização de cookies via `messenger:set`.

```tsx
import { createZendeskChatIntegration } from 'react-lgpd-consent'

const integrations = [
  createZendeskChatIntegration({
    key: 'your_zendesk_key',
    cookieRange: 'functional', // opcional: all | functional | none
  }),
]
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
- `createSuggestedIntegration(config)`: Cria integração customizada com categoria sugerida automaticamente (pode sobrescrever com `category`).
- `createECommerceIntegrations`, `createSaaSIntegrations`, `createCorporateIntegrations`: Templates de negócio que agrupam as integrações mais comuns para cada setor.
- `INTEGRATION_TEMPLATES`: Constante com presets de IDs e categorias para cada template.

### Exemplo de Template (E-commerce)

```tsx
import {
  ConsentProvider,
  ConsentScriptLoader,
  createECommerceIntegrations,
} from 'react-lgpd-consent'

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

### Exemplo de integração sugerida (custom)

```tsx
import { createSuggestedIntegration } from 'react-lgpd-consent'

const integrations = [
  createSuggestedIntegration({
    id: 'custom-chat',
    src: 'https://example.com/chat.js',
  }),
]
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

## 📊 Eventos DataLayer (Google Tag Manager)

A partir da versão **0.4.5**, a biblioteca dispara automaticamente eventos padronizados no `dataLayer` para facilitar rastreamento, auditoria LGPD e integrações com o Google Tag Manager.

### Comportamento do `dataLayer`

- Se `globalThis.window.dataLayer` não existir, a biblioteca cria `[]`.
- Se existir e tiver `push`, o array/objeto é usado como está.
- Se existir sem `push`, a biblioteca não sobrescreve e avisa em dev.

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
    marketing: false,
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
  ConsentUpdatedEvent,
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

---

## 🔗 Fontes Oficiais Consultadas

- Google tag (`gtag.js`): https://developers.google.com/tag-platform/gtagjs
- Google Consent Mode: https://developers.google.com/tag-platform/security/guides/consent
- Google Tag Manager web container: https://support.google.com/tagmanager/answer/14842164
- Microsoft Clarity setup: https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-setup
- Microsoft Clarity Consent Mode: https://learn.microsoft.com/en-us/clarity/setup-and-installation/consent-mode
- Microsoft Clarity Consent API v2: https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v2
- Intercom Web installation: https://developers.intercom.com/installing-intercom/web/installation
- Intercom SPA guidance: https://www.intercom.com/help/en/articles/170-integrate-intercom-in-a-single-page-app
- Mixpanel JavaScript SDK: https://docs.mixpanel.com/docs/tracking-methods/sdks/javascript
- Zendesk Web Widget Messaging API: https://developer.zendesk.com/api-reference/widget-messaging/web/core/

---

## 🆕 Recursos Avançados v0.7.0

### Monitoramento com Callbacks de Lifecycle

Integre sistemas de auditoria monitorando eventos de consentimento:

```tsx
import { ConsentProvider, ConsentScriptLoader } from 'react-lgpd-consent'
import { googleAnalytics4Integration } from './integrations'

;<ConsentProvider
  categories={{ enabledCategories: ['analytics', 'marketing'] }}
  onConsentInit={(state) => {
    // Disparado na inicialização (útil para analytics)
    console.log('Consentimento inicial:', state)
  }}
  onConsentChange={(current, previous) => {
    // Disparado em toda mudança de preferências
    console.log('Mudança:', { current, previous })

    // Exemplo: disparar evento no dataLayer
    globalThis.window?.dataLayer?.push({
      event: 'consent_preferences_updated',
      consent_analytics: current.preferences.analytics,
      consent_marketing: current.preferences.marketing,
    })
  }}
  onAuditLog={(entry) => {
    // Enviar para backend de compliance
    fetch('/api/consent-audit', {
      method: 'POST',
      body: JSON.stringify(entry),
    })
  }}
>
  <ConsentScriptLoader integrations={[googleAnalytics4Integration]} />
  <YourApp />
</ConsentProvider>
```

### Presets de Categorias ANPD

Use configurações pré-validadas pela ANPD:

```tsx
import { ConsentProvider, createAnpdCategoriesConfig } from 'react-lgpd-consent'

// Preset BÁSICO (necessary + analytics)
const basicConfig = createAnpdCategoriesConfig({ include: ['analytics'] })

// Preset COMPLETO (todas as 6 categorias)
const fullConfig = createAnpdCategoriesConfig({
  include: ['analytics', 'marketing', 'functional', 'social', 'personalization']
})

// Com customizações
const customConfig = createAnpdCategoriesConfig({
  include: ['analytics', 'marketing'],
  names: { analytics: 'Análises' },
  descriptions: { marketing: 'Anúncios personalizados' }
})

<ConsentProvider categories={fullConfig}>
  <ConsentScriptLoader integrations={myIntegrations} />
</ConsentProvider>
```

**Vantagens dos presets:**

- ✅ Conformidade com diretrizes ANPD
- ✅ Nomes e descrições em pt-BR revisadas
- ✅ Tipagem forte para evitar erros
- ✅ Reduz código boilerplate em 60%

---

## 📚 Recursos Adicionais

- [API.md](./API.md) – Documentação completa da API pública
- [RECIPES.md](../../doc/RECIPES.md) – Receitas práticas com Next.js, CSP, Google Consent Mode v2
- [TROUBLESHOOTING.md](../../doc/TROUBLESHOOTING.md) – Solução de problemas comuns
- [CONFORMIDADE.md](../../doc/CONFORMIDADE.md) – Conformidade LGPD e ANPD

**Problemas de integração?** Consulte [TROUBLESHOOTING.md - Seção de Integrations](../../doc/TROUBLESHOOTING.md#integrações-de-terceiros).
