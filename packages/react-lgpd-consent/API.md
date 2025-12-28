# Guia da API - react-lgpd-consent

Este documento é a referência técnica oficial para a API da biblioteca `react-lgpd-consent` (v0.5.0+), publicada como conjunto de pacotes:

- `react-lgpd-consent`: agregador com a API pública original.
- `react-lgpd-consent/core`: subpath export do pacote principal (delegando para `@react-lgpd-consent/core`).
- `react-lgpd-consent/mui`: subpath export que expõe a camada Material-UI (`@react-lgpd-consent/mui`).

## Exports Principais

| Nome                                | Tipo       | Descrição                                                                       |
| ----------------------------------- | ---------- | ------------------------------------------------------------------------------- |
| `ConsentProvider`                   | Componente | O provedor de contexto principal que gerencia todo o estado e a UI.             |
| `useConsent`                        | Hook       | Hook principal para interagir com o estado de consentimento.                    |
| `useCategories`                     | Hook       | Retorna a lista de categorias ativas no projeto.                                |
| `useCategoryStatus`                 | Hook       | Verifica o status de uma categoria específica.                                  |
| `useOpenPreferencesModal`           | Hook       | Retorna uma função para abrir o modal de preferências de forma programática.    |
| `openPreferencesModal`              | Função     | Versão da função acima para ser usada fora do contexto React.                   |
| `ConsentGate`                       | Componente | Renderiza componentes filhos apenas se uma categoria de cookie for consentida.  |
| `ConsentScriptLoader`               | Componente | Carrega scripts de terceiros (como Google Analytics) com base no consentimento. Suporta Consent Mode v2 automático. |
| `registerScript()`                  | Função     | Registra um script na fila global para execução condicional ao consentimento. Retorna função de cleanup. |
| `RegisteredScript`                  | Tipo       | Interface para scripts registrados programaticamente (id, category, execute, priority, onConsentUpdate). |
| `buildConsentStorageKey`            | Função     | (v0.5.2) Gera nomes de cookies `namespace__vX` a partir de namespace/versão.     |
| `createGoogleAnalyticsIntegration`  | Função     | Factory para integração nativa com o Google Analytics.                           |
| `createGoogleTagManagerIntegration` | Função     | Factory para integração nativa com o Google Tag Manager.                         |
| `createUserWayIntegration`          | Função     | Factory para integração nativa com o UserWay.                                    |
| `createFacebookPixelIntegration`    | Função     | (v0.4.1) Integração nativa com Facebook Pixel.                                   |
| `createHotjarIntegration`           | Função     | (v0.4.1) Integração nativa com Hotjar.                                           |
| `createMixpanelIntegration`         | Função     | (v0.4.1) Integração nativa com Mixpanel.                                         |
| `createClarityIntegration`          | Função     | (v0.4.1) Integração nativa com Microsoft Clarity.                                |
| `createIntercomIntegration`         | Função     | (v0.4.1) Integração nativa com Intercom (chat).                                  |
| `createZendeskChatIntegration`      | Função     | (v0.4.1) Integração nativa com Zendesk Chat.                                     |
| `createSuggestedIntegration`        | Função     | (v0.7.2) Cria integração customizada com categoria sugerida automaticamente.    |
| `suggestCategoryForScript`          | Função     | (v0.4.1) Sugere categoria(s) LGPD para um script conhecido.                      |
| `discoverRuntimeCookies`            | Função     | (v0.4.1) Descobre cookies em tempo real no navegador.                            |
| `categorizeDiscoveredCookies`       | Função     | (v0.4.1) Categoriza cookies descobertos usando padrões LGPD.                     |
| `getCookiesInfoForCategory`         | Função     | Retorna informações detalhadas dos cookies de uma categoria específica.          |
| `resolveTexts`                      | Função     | (v0.4.1) Resolve textos baseados em templates e contexto.                        |
| `createConsentAuditEntry`           | Função     | **(v0.7.0)** Cria entrada de auditoria de consentimento para logs.                |
| `ANPD_CATEGORY_PRESETS`             | Constante  | **(v0.7.0)** Presets de categorias conforme diretrizes LGPD/ANPD.                 |
| `createAnpdCategories`              | Função     | **(v0.7.0)** Helper para gerar configurações tipadas com presets ANPD.            |
| `TEXT_TEMPLATES`                    | Constante  | (v0.4.1) Templates pré-configurados (ecommerce, saas, governo).                  |
| `AdvancedConsentTexts`              | Tipo       | (v0.4.1) Interface expandida com i18n e contextos.                               |
| `DesignTokens`                      | Tipo       | (v0.4.1) Sistema completo com 200+ pontos de customização.                       |
| `createECommerceIntegrations`       | Função     | (v0.4.1) Cria integrações comuns para e-commerce.                                |
| `createSaaSIntegrations`            | Função     | (v0.4.1) Cria integrações comuns para SaaS.                                      |
| `createCorporateIntegrations`       | Função     | (v0.4.1) Cria integrações comuns para ambientes corporativos.                    |
| `INTEGRATION_TEMPLATES`             | Constante  | (v0.4.1) Presets com IDs essenciais/opcionais e categorias por tipo de negócio.  |
| `SuggestedIntegrationConfig`        | Tipo       | (v0.7.2) Configuração para integração customizada com categoria sugerida.        |
| `setDebugLogging`                   | Função     | Habilita/desabilita o logging de debug da biblioteca.                           |

---

## ESM/CJS e Testes (Jest/Vitest)

O pacote publica **dual build** (ESM + CJS) via `exports`:

```json
{
  ".": { "import": "./dist/index.js", "require": "./dist/index.cjs" },
  "./core": { "import": "./dist/core.js", "require": "./dist/core.cjs" },
  "./mui": { "import": "./dist/mui.js", "require": "./dist/mui.cjs" },
  "./integrations": { "import": "./dist/integrations.js", "require": "./dist/integrations.cjs" }
}
```

### Jest (CJS) com babel-jest

```js
// jest.config.cjs
module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(t|j)sx?$': ['babel-jest', { presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'] }],
  },
  transformIgnorePatterns: ['/node_modules/(?!react-lgpd-consent|@react-lgpd-consent)/'],
}
```

### Vitest (Vite)

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    deps: {
      inline: ['react-lgpd-consent', '@react-lgpd-consent/core', '@react-lgpd-consent/mui'],
    },
  },
})
```

### Importações recomendadas

```ts
import { ConsentProvider } from 'react-lgpd-consent'
import { ConsentProvider as ConsentProviderHeadless } from 'react-lgpd-consent/core'
import { createGoogleAnalyticsIntegration } from 'react-lgpd-consent/integrations'
```

---

## Componentes

### `<ConsentProvider />`

O componente principal que deve envolver sua aplicação. Ele gerencia o estado, renderiza a UI (banner, modal) e fornece o contexto para os hooks.

**Props Mínimas:**

```tsx
import { ConsentProvider } from 'react-lgpd-consent'

function App() {
  return (
    <ConsentProvider
      categories={{ enabledCategories: ['analytics', 'marketing'] }}
    >
      {/* Seu aplicativo aqui */}
    </ConsentProvider>
  )
}
```

**Todas as Props:**

| Prop | Tipo | Descrição |
| --- | --- | --- |
| `categories` | `ProjectCategoriesConfig` | **Obrigatório.** Fonte única de verdade sobre as categorias habilitadas; usada por UI, hooks e integrações. |
| `texts` | `Partial<AdvancedConsentTexts>` | Customiza todos os textos exibidos (banner, modal, botão). |
| `language` | `'pt' \| 'en' \| 'es' \| 'fr' \| 'de' \| 'it'` | Resolve textos via i18n no Provider. |
| `textVariant` | `'formal' \| 'casual' \| 'concise' \| 'detailed'` | Aplica variação de tom sobre os textos base. |
| `designTokens` | `DesignTokens` | Ajuste visual granular (cores, spacing, tipografia, overlays). |
| `blocking` | `boolean` | Ativa overlay bloqueante até o usuário decidir. Padrão: `false`. |
| `blockingStrategy` | `'auto' \| 'provider' \| 'component'` | Controla quem desenha o overlay quando `blocking` está ativo. |
| `hideBranding` | `boolean` | Oculta o selo “fornecido por”. |
| `disableDeveloperGuidance` | `boolean` | Suprime avisos/sugestões no console em desenvolvimento. |
| `disableFloatingPreferencesButton` | `boolean` | Remove o botão flutuante padrão. |
| `onConsentGiven` | `(state: ConsentState) => void` | Dispara na primeira vez que o usuário aceita/rejeita. Útil para inicializar analytics. |
| `onPreferencesSaved` | `(prefs: ConsentPreferences) => void` | Executa toda vez que o usuário salva preferências no modal. |
| `onConsentInit` | `(state: ConsentState) => void` | **(v0.7.0)** Callback executado após hidratação inicial do consentimento. |
| `onConsentChange` | `(state: ConsentState, previous: ConsentState) => void` | **(v0.7.0)** Callback executado sempre que o estado de consentimento muda. |
| `onAuditLog` | `(entry: ConsentAuditEntry) => void` | **(v0.7.0)** Callback para registrar eventos de auditoria (init, update, reset). |
| `cookie` | `Partial<ConsentCookieOptions>` | Override fino das opções de cookie (nome, expiração, sameSite, secure, path, domain). Se `name` não for informado, o valor deriva de `storage`. |
| `storage` | `ConsentStorageConfig` | Define namespace, versão e domínio compartilhado. Gera automaticamente o nome da chave (`namespace__vX`). Alterar `version` força re-consentimento. |
| `onConsentVersionChange` | `(context: ConsentVersionChangeContext) => void` | Notificado após mudança da chave de storage. O reset já é automático; use o hook para limpar caches externos ou registrar eventos. |
| `CookieBannerComponent` | `React.ComponentType<CustomCookieBannerProps>` | Substitui o banner padrão. |
| `PreferencesModalComponent` | `React.ComponentType<CustomPreferencesModalProps>` | Substitui o modal padrão. |
| `FloatingPreferencesButtonComponent` | `React.ComponentType<CustomFloatingPreferencesButtonProps>` | Substitui o botão flutuante padrão. |
| `cookieBannerProps` | `Record<string, unknown>` | Props adicionais repassadas ao banner (padrão `{}`). |
| `preferencesModalProps` | `Record<string, unknown>` | Props adicionais repassadas ao modal (padrão `{}`). |
| `floatingPreferencesButtonProps` | `Record<string, unknown>` | Props adicionais para o botão flutuante (padrão `{}`). |
| `theme` | `any` (Tema MUI) | Aplica um `ThemeProvider` local aos componentes padrão (apenas no pacote MUI). |
| `initialState` | `ConsentState` | Hidratação SSR para evitar flash do banner. |

#### Versionamento de consentimento (namespace + versão)

- `storage.namespace` e `storage.version` utilizam `buildConsentStorageKey` para gerar o nome do cookie no formato `namespace__v<versão>`. Os valores padrão são `lgpd-consent` e `1`.
- Alterar `storage.version` (ou `storage.namespace`) remove o cookie anterior, reseta o estado do provider e dispara `onConsentVersionChange`.
- `storage.domain` injeta o domínio do cookie (ex.: `.example.com`) sem precisar duplicar o valor em `cookie.domain`.
- `onConsentVersionChange` recebe `{ previousKey, nextKey, resetConsent }`. O `resetConsent` já é executado internamente, mas é exposto para cenários onde você precisa repetir a operação após limpar caches externos.
- Breaking change? **Não** — projetos que não configurarem `storage` continuam usando `lgpd-consent__v1`; alterar a versão apenas força um novo consentimento.

```tsx
import {
  ConsentProvider,
  buildConsentStorageKey,
  type ConsentVersionChangeContext,
} from 'react-lgpd-consent'

function ConsentBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ConsentProvider
      categories={{ enabledCategories: ['analytics', 'marketing'] }}
      storage={{ namespace: 'acme-suite', version: '2025-Q4', domain: '.acme.com' }}
      cookie={{
        // Opcional: persistir um nome de auditoria específico
        name: buildConsentStorageKey({ namespace: 'acme-suite', version: '2025-Q4' }),
      }}
      onConsentVersionChange={({ previousKey, nextKey, resetConsent }: ConsentVersionChangeContext) => {
        audit.log('consent:bump', { previousKey, nextKey })
        localStorage.removeItem('marketingOverrides')
        resetConsent()
      }}
    >
      {children}
    </ConsentProvider>
  )
}
```

#### Cookies necessários sempre ativos

- A categoria `necessary` é adicionada automaticamente pelo `ConsentProvider` e é sempre persistida como `true`.
- Chamadas a `setPreference('necessary', false)` ou `setPreferences({ necessary: false, ... })` são ignoradas com log de aviso — a biblioteca garante que o estado interno continue válido.
- O `PreferencesModal` padrão mostra o switch desabilitado com a legenda `Cookies necessários (sempre ativos)`.
- `writeConsentCookie` força `necessary=true` antes de serializar; mesmo que o estado seja adulterado, a persistência permanece conforme a LGPD.
- Hooks (`useConsent`, `useCategoryStatus`) e integrações (`ConsentScriptLoader`, eventos do dataLayer) sempre retornam `necessary=true`, assegurando consistência entre UI, lógica e auditoria.

### `designTokens.layout.backdrop`

O token `designTokens.layout.backdrop` agora aceita `boolean | string`:

- `false`: indica que não haverá escurecimento visível; o overlay pode ainda bloquear cliques (útil quando a aplicação já fornece um dark-filter visual próprio).
- `string`: qualquer valor CSS válido de cor (ex.: `'rgba(0,0,0,0.4)'`) será usado como cor do backdrop.
- quando ausente, a biblioteca utiliza um fallback seguro `'rgba(0, 0, 0, 0.4)'`.

Consulte `types/DesignTokens` para a tipagem completa.

---

### `<ConsentGate />`

Renderiza componentes filhos apenas se o usuário deu consentimento para uma categoria específica.

```tsx
import { ConsentGate } from 'react-lgpd-consent'

function MyComponent() {
  return (
    <ConsentGate category="marketing">
      {/* Este componente só será renderizado se o usuário consentiu com cookies de marketing */}
      <FacebookPixelScript />
    </ConsentGate>
  )
}
```

### `<ConsentScriptLoader />`

Gerencia o carregamento de scripts de terceiros (ex: Google Analytics) com base no consentimento do usuário. Veja o guia `INTEGRACOES.md` para mais detalhes.

**Novidades v0.7.1:**
- ✨ **Google Consent Mode v2 automático**: GA4 e GTM agora enviam `consent('default', 'denied')` no bootstrap e `consent('update', 'granted')` após consentimento
- 🎯 **Sistema de fila com prioridade**: Scripts são executados ordenadamente (necessary → categoria → prioridade → timestamp)
- 🔄 **Callbacks de atualização**: `onConsentUpdate` dispara quando preferências mudam

```tsx
import { ConsentScriptLoader, createGoogleAnalyticsIntegration, registerScript } from 'react-lgpd-consent'

// Uso padrão (Consent Mode v2 automático)
const integrations = [createGoogleAnalyticsIntegration({ measurementId: 'G-XXXXXXXXXX' })]
<ConsentScriptLoader integrations={integrations} />

// Uso avançado: registro programático com prioridade
const cleanup = registerScript({
  id: 'custom-analytics',
  category: 'analytics',
  priority: 10, // Maior = executa primeiro
  execute: async () => {
    console.log('Script carregado!')
  },
  onConsentUpdate: ({ consented, preferences }) => {
    if (preferences.analytics) {
      console.log('Analytics habilitado via update!')
    }
  }
})

// ℹ️ Estados da fila: pending → running → executed.
// Scripts só reexecutam se allowReload=true; sempre use o cleanup ao desmontar.
```

---

## Hooks

### `useConsent()`

O hook principal para interagir com o estado de consentimento.

**Retorno:**

| Chave             | Tipo                                  | Descrição                                                                                |
| ----------------- | ------------------------------------- | ---------------------------------------------------------------------------------------- |
| `consented`       | `boolean`                             | `true` se o usuário já interagiu com o banner/modal.                                     |
| `preferences`     | `ConsentPreferences`                  | Um objeto com o estado de consentimento para cada categoria (ex: `{ analytics: true }`). |
| `isModalOpen`     | `boolean`                             | `true` se o modal de preferências estiver aberto.                                        |
| `acceptAll`       | `() => void`                          | Aceita todas as categorias de cookies.                                                   |
| `rejectAll`       | `() => void`                          | Rejeita todas as categorias não essenciais.                                              |
| `setPreference`   | `(cat: string, value: boolean) => void` | Define consentimento para uma categoria específica (predefinida ou customizada).      |
| `setPreferences`  | `(prefs: ConsentPreferences) => void` | Salva um novo conjunto de preferências.                                                  |
| `openPreferences` | `() => void`                          | Abre o modal de preferências.                                                            |
| `resetConsent`    | `() => void`                          | Reseta o consentimento, fazendo o banner aparecer novamente.                             |

### `useCategories()`

Retorna um array com as definições de todas as categorias ativas no projeto. Útil para construir UIs de preferência customizadas.

### `useCategoryStatus()`

Verifica se uma categoria específica está ativa e consentida.

```tsx
const analyticsStatus = useCategoryStatus('analytics')
// Retorna um objeto: { isActive: boolean, isEssential: boolean, ... }

if (analyticsStatus.isActive && preferences.analytics) {
  // ...
}
```

### `useOpenPreferencesModal()` e `openPreferencesModal()`

Permitem abrir o modal de preferências de forma programática, seja de dentro de um componente React (`useOpenPreferencesModal`) ou de um script JavaScript comum (`openPreferencesModal`).

```tsx
// Em um componente React
const openModal = useOpenPreferencesModal()
return <button onClick={openModal}>Abrir Preferências</button>

// Em JavaScript puro
document.getElementById('meu-botao').addEventListener('click', openPreferencesModal)
```

---

## 🎨 Guia de Customização Avançada

A biblioteca foi projetada para ser flexível. Aqui estão as duas principais formas de customização:

### 1. Customização de Estilo com a Prop `theme`

Se você já usa Material-UI, pode passar seu próprio objeto de tema para a prop `theme` do `ConsentProvider`. Os componentes internos da biblioteca (banner, modal) herdarão suas definições de cores, tipografia, bordas, etc.

````tsx
import { ConsentProvider } from 'react-lgpd-consent';

> Nota importante sobre temas MUI
>
> A partir da versão 0.3.5 a biblioteca NÃO cria um `ThemeProvider` global automaticamente. O `ConsentProvider` foi refatorado para herdar o tema do aplicativo quando um `ThemeProvider` do MUI estiver presente. Se precisar de um fallback explícito, use `createDefaultConsentTheme()`:
>
> ```tsx
> import { ConsentProvider, createDefaultConsentTheme } from 'react-lgpd-consent'
>
> <ConsentProvider theme={createDefaultConsentTheme()} categories={{ enabledCategories: ['analytics'] }}>
>   <App />
> </ConsentProvider>
> ```
>
> Há também um getter compatível `defaultConsentTheme()` (deprecated) que retorna uma nova instância quando chamada — evite importar um tema já instanciado no nível do módulo para prevenir side-effects em SSR.

import { createTheme, ThemeProvider } from '@mui/material/styles';

// 1. Crie seu tema customizado
const meuTema = createTheme({
  palette: {
    primary: {
      main: '#673ab7', // Roxo
    },
    background: {
      paper: '#f3e5f5', // Um roxo bem claro para o fundo do banner
    },
  },
  typography: {
    fontFamily: ''Georgia', serif',
  },
});

function App() {
  return (
    // 2. Passe o tema para o ThemeProvider do MUI
    <ThemeProvider theme={meuTema}>
      {/* 3. Passe o mesmo tema para o ConsentProvider */}
      <ConsentProvider
        categories={{ enabledCategories: ['analytics'] }}
        theme={meuTema}
      >
        <SuaAplicacao />
      </ConsentProvider>
    </ThemeProvider>
  );
}
````

### 2. Substituição Completa da UI

Para controle total, você pode substituir os componentes padrão da biblioteca pelos seus.

Use as props `CookieBannerComponent` e `PreferencesModalComponent` para passar seus próprios componentes. A biblioteca cuidará da lógica de quando exibi-los e passará todas as props necessárias para que eles funcionem.

**Exemplo: Criando um Banner Totalmente Customizado**

```tsx
import { ConsentProvider, type CustomCookieBannerProps } from 'react-lgpd-consent'

// 1. Crie seu componente de banner. Ele receberá as props definidas em CustomCookieBannerProps.
function MeuBannerCustomizado({
  acceptAll,
  rejectAll,
  openPreferences,
  texts,
}: CustomCookieBannerProps) {
  // Estilos CSS-in-JS ou classes CSS normais
  const style = {
    position: 'fixed',
    bottom: '20px',
    left: '20px',
    backgroundColor: '#222',
    color: 'white',
    padding: '15px',
    borderRadius: '8px',
    zIndex: 1000,
  }

  return (
    <div style={style}>
      <h4>{texts.modalTitle}</h4>
      <p>{texts.bannerMessage}</p>
      <div>
        <button onClick={acceptAll}>✅ {texts.acceptAll}</button>
        <button onClick={rejectAll} style={{ marginLeft: '10px' }}>
          ❌ {texts.declineAll}
        </button>
        <button onClick={openPreferences} style={{ marginLeft: '10px' }}>
          ⚙️ {texts.preferences}
        </button>
      </div>
    </div>
  )
}

function App() {
  return (
    <ConsentProvider
      categories={{ enabledCategories: ['analytics'] }}
      // 2. Passe seu componente para a prop correspondente
      CookieBannerComponent={MeuBannerCustomizado}
    >
      <SuaAplicacao />
    </ConsentProvider>
  )
}
```

---

## 🆕 Novidades v0.4.1

### Descoberta Automática de Cookies

```tsx
import { discoverRuntimeCookies, categorizeDiscoveredCookies } from 'react-lgpd-consent'

// Descobrir cookies no navegador
const cookies = discoverRuntimeCookies()
console.log('Cookies encontrados:', cookies)

// Categorizar automaticamente
const categorized = categorizeDiscoveredCookies(cookies, true) // true = registra automaticamente
```

### Sistema Avançado de Textos

```tsx
import { resolveTexts, TEXT_TEMPLATES } from 'react-lgpd-consent'

// Usar template pré-configurado
const customTexts = resolveTexts(TEXT_TEMPLATES.ecommerce, {
  variant: 'casual',    // 'formal' | 'casual' | 'technical'
  language: 'pt'        // 'pt' | 'en' | 'es'
})

<ConsentProvider
  texts={customTexts}
  // ... outras props
/>
```

### Design Tokens Expandidos

```tsx
import type { DesignTokens } from 'react-lgpd-consent'

const customTokens: DesignTokens = {
  colors: {
    primary: {
      main: '#2E7D32',
      light: '#4CAF50',
      dark: '#1B5E20'
    },
    background: {
      paper: '#FFFFFF',
      backdrop: 'rgba(46, 125, 50, 0.4)'
    }
  },
  typography: {
    h1: { fontSize: '2.5rem', fontWeight: 700 },
    body1: { fontSize: '1rem', lineHeight: 1.6 }
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  },
  layout: {
    borderRadius: '12px',
    maxWidth: '1200px'
  }
}

<ConsentProvider
  designTokens={customTokens}
  // ... outras props
/>
```

---

## `getCookiesInfoForCategory(categoryId, integrations)`

Função utilitária que retorna informações detalhadas sobre os cookies de uma categoria específica.

### Parâmetros

- **`categoryId`** (`Category`): ID da categoria ('necessary', 'analytics', 'marketing', etc.)
- **`integrations`** (`string[]`): Array com IDs das integrações usadas no projeto

### Retorno

- **`CookieDescriptor[]`**: Array com informações detalhadas de cada cookie

### Interface `CookieDescriptor`

```typescript
interface CookieDescriptor {
  name: string        // Nome ou padrão do cookie (ex: '_ga', '_ga_*')
  purpose?: string    // Finalidade do cookie
  duration?: string   // Tempo de retenção (ex: '2 anos', '24 horas')
  domain?: string     // Domínio associado (ex: '.example.com')
  provider?: string   // Provedor ou serviço (ex: 'Google Analytics')
}
```

### Exemplo de Uso

```tsx
import { getCookiesInfoForCategory, useCategories } from 'react-lgpd-consent'

function DetalhesCookies() {
  const { allCategories } = useCategories()
  const integracoesUsadas = ['google-analytics', 'mixpanel', 'hotjar']

  return (
    <div>
      {allCategories.map((categoria) => {
        const cookiesDetalhados = getCookiesInfoForCategory(
          categoria.id as any,
          integracoesUsadas
        )

        return (
          <div key={categoria.id}>
            <h3>{categoria.name}</h3>
            <p>{categoria.description}</p>
            
            {cookiesDetalhados.map((cookie) => (
              <div key={cookie.name}>
                <strong>{cookie.name}</strong>
                {cookie.purpose && <p>Finalidade: {cookie.purpose}</p>}
                {cookie.duration && <p>Duração: {cookie.duration}</p>}
                {cookie.provider && <p>Provedor: {cookie.provider}</p>}
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
```

### Integração com Modal Personalizado

Esta função é especialmente útil em modais personalizados de preferências:

```tsx
const ModalPersonalizado: React.FC<CustomPreferencesModalProps> = ({
  preferences,
  setPreferences,
  // ... outras props
}) => {
  const { allCategories } = useCategories()
  const integracoes = ['google-analytics', 'facebook-pixel'] // suas integrações

  return (
    <div>
      {allCategories.map((categoria) => {
        const cookies = getCookiesInfoForCategory(categoria.id as any, integracoes)
        
        return (
          <div key={categoria.id}>
            <label>
              <input
                type="checkbox"
                checked={preferences[categoria.id] || false}
                onChange={(e) => setPreferences({
                  ...preferences,
                  [categoria.id]: e.target.checked
                })}
                disabled={categoria.essential}
              />
              {categoria.name}
            </label>
            
            {/* Detalhes expandíveis dos cookies */}
            <details>
              <summary>Ver cookies ({cookies.length})</summary>
              {cookies.map(cookie => (
                <div key={cookie.name}>
                  <code>{cookie.name}</code>: {cookie.purpose}
                </div>
              ))}
            </details>
          </div>
        )
      })}
    </div>
  )
}
```

---

## Tipos Principais

Para customizações avançadas e tipagem, você pode importar os seguintes tipos:

- `ConsentProviderProps`: Interface com todas as props aceitas pelo componente `ConsentProvider`.
- `DesignTokens`: Objeto para customização profunda da aparência, com mais de 200 tokens para cores, fontes, etc.
- `AdvancedConsentTexts`: Objeto para internacionalização e textos contextuais, com suporte a múltiplos idiomas e variações.
- `CookieDescriptor`: Interface que descreve a estrutura de um cookie descoberto.
- `ConsentCookieOptions`: Estrutura com todas as opções suportadas pelo cookie de consentimento.
- `ConsentStorageConfig`: Define namespace, versão e domínio compartilhado da chave de armazenamento.
- `ConsentVersionChangeContext`: Payload recebido em `onConsentVersionChange`.
- `CustomCookieBannerProps`: Props passadas para um componente de banner customizado.
- `CustomPreferencesModalProps`: Props passadas para um modal de preferências customizado.
- `ConsentState`: Objeto que representa o estado completo do consentimento do usuário.
- `ConsentPreferences`: Objeto com as preferências de consentimento para cada categoria.
- `ConsentTexts`: Tipo base com textos essenciais da UI (pt-BR).
- `Category`: Objeto que representa a definição de uma categoria de cookie.
### Exemplos de categorias (mínimo e completo)

Somente necessários (mínimo):

```tsx
<ConsentProvider categories={{ enabledCategories: [] }}>
  <App />
</ConsentProvider>
```

Conjunto completo (site com analytics/marketing):

```tsx
<ConsentProvider categories={{ enabledCategories: ['analytics', 'marketing', 'functional'] }}>
  <App />
</ConsentProvider>
```

---

## 🆕 Novidades v0.7.0

### Callbacks de Lifecycle (#68)

Monitore eventos de consentimento para integração com sistemas de auditoria:

```tsx
import { ConsentProvider, createConsentAuditEntry } from 'react-lgpd-consent'

function App() {
  return (
    <ConsentProvider
      categories={{ enabledCategories: ['analytics', 'marketing'] }}
      onConsentInit={(state) => {
        console.log('Consentimento inicializado:', state)
        // Útil para analytics iniciais
      }}
      onConsentChange={(current, previous) => {
        console.log('Consentimento alterado:', { current, previous })
        // Dispara em toda mudança de preferências
      }}
      onAuditLog={(entry) => {
        // Registrar no backend para compliance
        fetch('/api/consent-audit', {
          method: 'POST',
          body: JSON.stringify(entry),
        })
      }}
    >
      <YourApp />
    </ConsentProvider>
  )
}
```

**Tipos disponíveis:**

```typescript
interface ConsentAuditEntry {
  timestamp: string // ISO 8601
  action: 'init' | 'update' | 'reset'
  state: ConsentState
  metadata?: {
    storageKey?: string
    consentVersion?: string
    userAgent?: string
  }
}
```

### Presets de Categorias ANPD (#70)

Use presets conformes com diretrizes da ANPD:

```tsx
import { ConsentProvider, createAnpdCategories, ANPD_CATEGORY_PRESETS } from 'react-lgpd-consent'

// Preset BÁSICO (necessary + analytics)
const basicConfig = createAnpdCategories({ include: ['analytics'] })

// Preset COMPLETO (todas as categorias)
const fullConfig = createAnpdCategories({
  include: ['analytics', 'marketing', 'functional', 'social', 'personalization']
})

// Preset MÍNIMO (apenas necessary)
const minimalConfig = createAnpdCategories({ include: [] })

// Com customizações
const customConfig = createAnpdCategories({
  include: ['analytics', 'marketing'],
  names: { analytics: 'Análises' },
  descriptions: { marketing: 'Anúncios personalizados baseados no seu perfil.' }
})

function App() {
  return (
    <ConsentProvider categories={fullConfig}>
      <YourApp />
    </ConsentProvider>
  )
}
```

**Preset disponível:**

```typescript
export const ANPD_CATEGORY_PRESETS: Record<Category, CategoryDefinition> = {
  necessary: { /* ... */ },
  analytics: { /* ... */ },
  functional: { /* ... */ },
  marketing: { /* ... */ },
  social: { /* ... */ },
  personalization: { /* ... */ }
}
```

### Mensagens de Erro Melhoradas (#71)

Hooks agora lançam erros claros em pt-BR quando usados fora do `<ConsentProvider>`:

```tsx
import { useConsent } from 'react-lgpd-consent'

function MyComponent() {
  const consent = useConsent() // ❌ Erro claro!
  // Error: [react-lgpd-consent] useConsent deve ser usado dentro de <ConsentProvider>.
  // Envolva seu componente com o provider ou use o wrapper @react-lgpd-consent/mui.
}
```

### Auditoria e Compliance (#60)

Crie entradas de auditoria manualmente:

```typescript
import { createConsentAuditEntry } from 'react-lgpd-consent'

const auditEntry = createConsentAuditEntry(
  { consented: true, preferences: { analytics: true } },
  {
    action: 'update',
    storageKey: 'lgpd-consent__v1',
    consentVersion: '1'
  }
)

// Enviar para backend
await fetch('/api/audit', {
  method: 'POST',
  body: JSON.stringify(auditEntry)
})
```

Consulte [TROUBLESHOOTING.md - Auditoria e log de consentimento](../../TROUBLESHOOTING.md#auditoria-e-log-de-consentimento) para exemplos completos de integração com backend.
