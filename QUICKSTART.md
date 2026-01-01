# 🚀 Guia de Início Rápido

Este guia fornece tudo o que você precisa para integrar rapidamente a biblioteca `react-lgpd-consent` em seu projeto React.

> 💡 **Procurando por receitas práticas?** Veja [RECIPES.md](./RECIPES.md) para casos de uso específicos como Next.js App Router, CSP/nonce, Consent Mode v2 e subdomínios.

## 📦 Instalação

```bash
npm install react-lgpd-consent
# ou
yarn add react-lgpd-consent
```

### Dependências Peer

```bash
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
```

> ℹ️ **Modularização (v0.5.0+)**
>
> - `react-lgpd-consent` continua sendo o pacote principal publicado.
> - `@react-lgpd-consent/core` expõe apenas contextos, hooks e utilitários (sem UI).
> - `@react-lgpd-consent/mui` publica os componentes MUI e re-exporta o core.
> - Para UI-only (bundle menor), use `@react-lgpd-consent/mui/ui`.
> - Subpaths do agregador: `react-lgpd-consent/core` e `react-lgpd-consent/mui`.

## 🎯 Uso Básico (30 segundos)

```tsx
import React from 'react'
import { ConsentProvider } from 'react-lgpd-consent'

function App() {
  return (
    <ConsentProvider
      categories={{
        enabledCategories: ['analytics', 'marketing'],
      }}
    >
      <main>
        <h1>Minha Aplicação</h1>
        {/* Seu conteúdo aqui */}
      </main>
    </ConsentProvider>
  )
```

## 🧭 Storybook — nota rápida

Este repositório possui um Storybook interativo para testes manuais e exploração visual dos componentes. Comandos rápidos:

- Rodar localmente (desenvolvimento):

```bash
npm run storybook
```

- Build do Storybook estático (para publicar no GitHub Pages):

```bash
npm run build-storybook
```

Notes:

- The Storybook preview (`.storybook/preview.tsx`) applies a clean environment between stories (removes consent cookie and performs defensive DOM cleanup). Check that file when creating stories that rely on a clean initial state.


## ⚡ Quickstarts: Next.js (App Router) e Vite

Os exemplos a seguir integram GTM/GA4 com Consent Mode v2 e garantem que nenhum script de tracking rode antes do consentimento. Eles também mostram como usar `ConsentScriptLoader` e sincronizar os sinais do Consent Mode via `gtag('consent', ...)`.

- Exemplos completos: `examples/next-app-router/*`, `examples/vite/*`

### Next.js 14/15 — App Router (SSR-safe)

1) Criar app Next e instalar deps

```bash
npm create next-app@latest my-app --ts --eslint --src-dir --app --no-tailwind --no-experimental-app
cd my-app
npm i react-lgpd-consent @mui/material @mui/icons-material @emotion/react @emotion/styled
```

2) Variáveis públicas no `.env.local`

```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

3) Copiar os arquivos do exemplo e ajustar imports

- De `examples/next-app-router/app/layout.tsx` → `app/layout.tsx`
- De `examples/next-app-router/app/page.tsx` → `app/page.tsx`
- De `examples/next-app-router/components/ClientConsent.tsx` → `app/components/ClientConsent.tsx`

Observação: nos arquivos copiados, troque imports relativos para `import { ConsentProvider, ConsentScriptLoader } from 'react-lgpd-consent'`.

4) O que esse setup faz

- `ClientConsent` é um componente client-only (via `dynamic(..., { ssr: false })` no layout) que:
  - Injeta um stub de `dataLayer/gtag` e define `consent default = denied` para todos os sinais (ad_storage, ad_user_data, ad_personalization, analytics_storage).
  - Sincroniza as mudanças do consentimento com `gtag('consent','update', ...)` mapeando as categorias: `analytics → analytics_storage`, `marketing → ad_*`.
  - Usa `ConsentScriptLoader` para carregar GTM/GA4 somente quando as categorias permitirem. Antes disso, nenhum script de tracking é carregado.

5) Rodar

```bash
npm run dev
```

Validação rápida:
- Acesse em aba anônima: a rede não carrega `gtm.js`/`gtag/js` até aceitar preferências.
- Ao aceitar `analytics`, o GA4 é carregado; ao aceitar `marketing`, os sinais `ad_*` são atualizados como granted.

### Vite (CSR)

1) Criar app Vite e instalar deps

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm i react-lgpd-consent @mui/material @mui/icons-material @emotion/react @emotion/styled
```

2) Variáveis no `.env`

```
VITE_GA_ID=G-XXXXXXXXXX
VITE_GTM_ID=GTM-XXXXXXX
```

3) Copiar os arquivos do exemplo e ajustar imports

- De `examples/vite/index.html` → `index.html` (não adicione scripts do GA/GTM aqui)
- De `examples/vite/src/main.tsx` → `src/main.tsx`
- De `examples/vite/src/App.tsx` → `src/App.tsx`
- De `examples/vite/src/consent/GtagConsent.tsx` → `src/consent/GtagConsent.tsx`

Observação: nos arquivos copiados, troque imports relativos para `import { ... } from 'react-lgpd-consent'`.

4) Rodar

```bash
npm run dev
```

Validação rápida:
- Ao abrir a app (em nova sessão), nenhum script de tracking é baixado até que o usuário consinta.
- Preferências atualizam `gtag('consent','update', ...)` corretamente por categoria.

## 🧩 Categorias customizadas (customCategories)
Disponível a partir da v0.4.0.

## 🍪 Categorias: definição, uso e exemplos

Fonte única de verdade
- Defina as categorias do seu projeto SOMENTE na prop `categories` do `ConsentProvider`.
- A UI (Banner/Modal), os hooks (`useConsent`, `useCategories`) e as integrações (`ConsentScriptLoader`) leem a mesma definição. Não declare categorias em outros lugares.

O que é obrigatório?
- Apenas a categoria `necessary` é obrigatória (e já é sempre incluída automaticamente).
- Todas as demais (`analytics`, `marketing`, `functional`, etc.) são opcionais e dependem do seu caso de negócio. Se você não usa analytics/ads/chat, simplesmente não habilite essas categorias.

Como “esconder” categorias que não uso?
- Basta não incluí-las em `enabledCategories` e não declará-las em `customCategories`. A UI não exibirá toggles para categorias ausentes.

Exemplo A — Somente necessários (mínimo, comum para apps internos/governo sem tracking)
```tsx
import { ConsentProvider } from 'react-lgpd-consent'

export default function App() {
  return (
    <ConsentProvider
      categories={{ enabledCategories: [] }}
      texts={{ bannerMessage: 'Usamos apenas cookies necessários para funcionamento.' }}
    >
      <YourApp />
    </ConsentProvider>
  )
}
```

Exemplo B — Conjunto completo (site com analytics e marketing)
```tsx
import { ConsentProvider } from 'react-lgpd-consent'

export default function App() {
  return (
    <ConsentProvider
      categories={{ enabledCategories: ['analytics', 'marketing', 'functional'] }}
    >
      <YourApp />
    </ConsentProvider>
  )
}
```

Boas práticas
- Sempre passe `categories` explicitamente. Em DEV, a biblioteca avisa quando `categories` não foi configurado para evitar ambiguidades.
- Não classifique scripts de analytics/ads como “necessary” — use `ConsentScriptLoader` e categorias adequadas.
- Em dúvidas, comece com “somente necessários” e evolua quando o negócio exigir outras categorias.

### 🔎 Validação de configuração (DEV)

Em desenvolvimento, a biblioteca valida a configuração e mostra mensagens amigáveis no console. Nada disso impacta produção (onde só ocorre uma sanitização leve).

Avisos comuns e como corrigir:
- `Prop 'categories' não fornecida...` — defina `categories.enabledCategories` de forma explícita; exemplo mínimo: `categories={{ enabledCategories: [] }}`.
- `'necessary' é sempre incluída automaticamente` — remova `'necessary'` de `enabledCategories` (ela já é incluída por padrão).
- `IDs de categoria duplicados detectados` — revise `enabledCategories` e `customCategories` para garantir que não há IDs repetidos.
- `enabledCategories contém valores inválidos` — verifique se todos os itens são strings não vazias (IDs de categoria).
- `customCategories: ... — ... deve ser uma string não vazia` — preencha `id`, `name` e `description` das categorias customizadas.

Notas:
- Validação detalhada roda apenas em `NODE_ENV !== 'production'`.
- Em produção, a lib não carrega o validador; somente remove `'necessary'` se vier por engano, mantendo o comportamento seguro.

## 🧱 SSR/Next.js (App Router) — Padrões seguros

Objetivo: evitar hydration mismatch, hooks em Server Components e vazamento de scripts.

Padrões recomendados
- Envolva o app com o `ConsentProvider` apenas no cliente.
- Use `dynamic(() => import('./ClientConsent'), { ssr: false })` no `RootLayout` (Server Component) e mova hooks e efeitos para o componente cliente.
- Nenhum acesso a `window`/`document` no topo de módulo; use apenas dentro de `useEffect`.
- Inicialize Consent Mode v2 com `gtag('consent','default', denied)` antes de carregar GTM/GA4; depois, atualize sinais na mudança de preferências.

Exemplo de RootLayout (Server) + Client wrapper

```tsx
// app/layout.tsx (Server Component)
import dynamic from 'next/dynamic'

const ClientConsent = dynamic(() => import('./components/ClientConsent'), { ssr: false })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <ClientConsent>{children}</ClientConsent>
      </body>
    </html>
  )
}
```

```tsx
// app/components/ClientConsent.tsx (Client Component)
'use client'
import React from 'react'
import { ConsentProvider, ConsentScriptLoader } from 'react-lgpd-consent'
import { COMMON_INTEGRATIONS } from 'react-lgpd-consent'
import { useConsent } from 'react-lgpd-consent'

function BootstrapConsentMode() {
  React.useEffect(() => {
    const w = window as any
    w.dataLayer = w.dataLayer ?? []
    w.gtag =
      w.gtag ??
      ((...args: any[]) => {
        if (typeof w.dataLayer?.push === 'function') {
          w.dataLayer.push(args)
        }
      })
    w.gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
    })
  }, [])
  return null
}

function SyncConsentMode() {
  const { consented, preferences } = useConsent()
  React.useEffect(() => {
    if (!consented) return
    const w = window as any
    w.gtag?.('consent', 'update', {
      analytics_storage: preferences.analytics ? 'granted' : 'denied',
      ad_storage: preferences.marketing ? 'granted' : 'denied',
      ad_user_data: preferences.marketing ? 'granted' : 'denied',
      ad_personalization: preferences.marketing ? 'granted' : 'denied',
    })
  }, [consented, preferences])
  return null
}

export default function ClientConsent({ children }: { children: React.ReactNode }) {
  const GA = process.env.NEXT_PUBLIC_GA_ID!
  const GTM = process.env.NEXT_PUBLIC_GTM_ID!
  return (
    <ConsentProvider categories={{ enabledCategories: ['analytics', 'marketing', 'functional'] }} blocking>
      <BootstrapConsentMode />
      <SyncConsentMode />
      <ConsentScriptLoader
        integrations={[
          COMMON_INTEGRATIONS.googleAnalytics({ measurementId: GA }),
          COMMON_INTEGRATIONS.googleTagManager({ containerId: GTM }),
        ]}
      />
      {children}
    </ConsentProvider>
  )
}
```

Ordem de provedores e estilos (MUI/Emotion)
- Preferência de ordem recomendada:
  - `CacheProvider` (Emotion) ou `StyledEngineProvider` com `injectFirst`
  - `ThemeProvider` (MUI)
  - `CssBaseline`
  - `ConsentProvider` (sem criar tema por padrão)
- Motivo: garante injeção de estilos do MUI antes de CSS da app e evita desalinhamento visual; os componentes da lib herdam o tema quando presente.

Z-index e Portals
- Componentes MUI usam o `zIndex` do tema; modals/portals padrão usam `zIndex.modal = 1300`.
- O overlay bloqueante do Provider usa `z-index: 1299`; o Modal/Banner usa camadas ≥ 1300.
- Em caso de conflito com headers fixos, ajuste o `theme.zIndex` (ex.: `appBar: 1200`, `modal: 1300+`) ou os `designTokens` conforme a necessidade.

Bloqueio “hard” (sem foco no app)
- Use `blockingMode="hard"` quando precisar impedir navegação por teclado fora do banner/modal.
- Nesse modo, o Provider aplica `inert` e `aria-hidden` no conteúdo da aplicação até a decisão do usuário.

Checklist SSR (evite hydration mismatch)
- [ ] Hooks somente em Client Components (`'use client'` no topo).
- [ ] Nada de `window`/`document`/`localStorage` no topo de módulo (apenas em `useEffect`).
- [ ] `dynamic(..., { ssr: false })` para wrappers que usam hooks e efeitos do consentimento.
- [ ] GTM/GA4 carregados apenas após consentimento (via `ConsentScriptLoader`).
- [ ] Sem `<script>` de GTM/GA4 em `head`/`body`; todo carregamento vem do loader.

## 🎨 Dica de estilo: Backdrop sensível ao tema

No modo bloqueante, o banner usa um backdrop para focar a atenção do usuário. Você pode controlar via design tokens:

```tsx
<ConsentProvider
  categories={{ enabledCategories: ['analytics'] }}
  designTokens={{
    layout: {
      // false: transparente | 'auto': ajusta ao tema | string: cor custom (ex.: '#00000088')
      backdrop: 'auto',
    },
    colors: {
      // Se omitido, usa o palette do tema MUI (background.paper, text.primary)
      // background: '#1e1e1e',
      // text: '#ffffff',
    },
  }}
>
  <App />
</ConsentProvider>
```

Se `colors.background` ou `colors.text` não forem fornecidos, a lib usa automaticamente `theme.palette.background.paper` e `theme.palette.text.primary` do MUI, garantindo compatibilidade com dark mode.

## 🧑‍🏫 Guia do Dev (console)

Durante o desenvolvimento, o console exibe um guia com:
- Avisos quando a configuração padrão é usada; sugestões para explicitar categorias
- Lista de categorias ativas e quais exigem toggle
- Detecção de integrações que requerem categorias, com sugestão para habilitá-las
- Boas práticas LGPD (Brasil) e alertas de UX (categorias demais)
- Silenciado automaticamente em produção; SSR-safe

Adicione categorias específicas do seu projeto (ex.: chat de suporte, players de vídeo, AB testing):

```tsx
<ConsentProvider
  categories={{
    enabledCategories: ['analytics'],
    customCategories: [
      { id: 'chat', name: 'Chat de Suporte', description: 'Widget de chat' },
      { id: 'video', name: 'Vídeo', description: 'Players incorporados' },
      { id: 'abTesting', name: 'A/B Testing', description: 'Experimentos de interface' },
    ],
  }}
>
  <App />
</ConsentProvider>
```

### Usando categorias customizadas no seu código

```tsx
import { useConsent } from 'react-lgpd-consent'

function MyComponent() {
  const { preferences } = useConsent()

  // Verificar se o usuário consentiu com categorias específicas
  const canShowChat = preferences?.chat === true
  const canLoadVideos = preferences?.video === true
  const canRunABTests = preferences?.abTesting === true

  return (
    <div>
      {canShowChat && <ChatWidget />}
      {canLoadVideos && <VideoPlayer src="..." />}
      {canRunABTests && <ABTestVariant />}
    </div>
  )
}
```

## 📋 Tabela Completa de Props do ConsentProvider

| Prop              | Tipo                                             | Obrigatória | Padrão         | Descrição                               |
| ----------------- | ------------------------------------------------ | ----------- | -------------- | --------------------------------------- |
| `categories`                         | `ProjectCategoriesConfig`                                   | ✅ **Sim**  | -                   | Define as categorias de cookies do projeto     |
| `texts`                              | `Partial<AdvancedConsentTexts>`                             | ❌ Não      | Textos padrão PT-BR | Customiza textos da interface                  |
| `language`                           | `'pt' \| 'en' \| 'es' \| 'fr' \| 'de' \| 'it'`               | ❌ Não      | `'pt'`              | Resolve textos via i18n do Provider            |
| `textVariant`                        | `'formal' \| 'casual' \| 'concise' \| 'detailed'`           | ❌ Não      | -                   | Aplica variação de tom nos textos              |
| `theme`                              | `any`                                                       | ❌ Não      | Tema padrão         | Tema Material-UI para os componentes           |
| `designTokens`                       | `DesignTokens`                                              | ❌ Não      | Tokens padrão       | Tokens de design para customização avançada    |
| `blocking`                           | `boolean`                                                   | ❌ Não      | `false`             | Exibe overlay bloqueando interação até decisão |
| `blockingMode`                       | `'soft' \| 'hard'`                                          | ❌ Não      | `'soft'`            | Intensidade do bloqueio (`hard` deixa app inerte) |
| `blockingStrategy`                   | `'auto' \| 'provider' \| 'component'`                       | ❌ Não      | `'auto'`            | Estratégia de renderização do overlay          |
| `hideBranding`                       | `boolean`                                                   | ❌ Não      | `false`             | Oculta branding "fornecido por"                |
| `onConsentGiven`                     | `(state: ConsentState) => void`                             | ❌ Não      | -                   | Callback na primeira vez que usuário consente  |
| `onPreferencesSaved`                 | `(prefs: ConsentPreferences) => void`                       | ❌ Não      | -                   | Callback quando preferências são salvas        |
| `disableDeveloperGuidance`           | `boolean`                                                   | ❌ Não      | `false`             | Desativa orientações no console                |
| `disableFloatingPreferencesButton`   | `boolean`                                                   | ❌ Não      | `false`             | Desabilita botão flutuante de preferências     |
| `CookieBannerComponent`              | `React.ComponentType<CustomCookieBannerProps>`              | ❌ Não      | Banner padrão       | Componente de banner customizado               |
| `PreferencesModalComponent`          | `React.ComponentType<CustomPreferencesModalProps>`          | ❌ Não      | Modal padrão        | Componente de modal customizado                |
| `FloatingPreferencesButtonComponent` | `React.ComponentType<CustomFloatingPreferencesButtonProps>` | ❌ Não      | Botão padrão        | Componente de botão flutuante customizado      |
| `cookieBannerProps`                  | `object`                                                    | ❌ Não      | `{}`                | Props adicionais para o banner                 |
| `preferencesModalProps`              | `object`                                                    | ❌ Não      | `{}`                | Props adicionais para o modal                  |
| `floatingPreferencesButtonProps`     | `object`                                                    | ❌ Não      | `{}`                | Props adicionais para o botão flutuante        |
| `initialState`                       | `ConsentState`                                              | ❌ Não      | -                   | Estado inicial para hidratação SSR             |
| `cookie`                             | `Partial<ConsentCookieOptions>`                             | ❌ Não      | Opções padrão       | Configurações do cookie (override fino de `name`, `domain`, `sameSite` etc.) |
| `storage`                            | `ConsentStorageConfig`                                      | ❌ Não      | `{ namespace: 'lgpd-consent', version: '1' }` | Namespace, versão e domínio compartilhado da chave de consentimento |
| `onConsentVersionChange`             | `(context: ConsentVersionChangeContext) => void`            | ❌ Não      | Reset automático    | Hook disparado após bump da chave; use para limpar caches adicionais |

## 📐 Posicionamento do banner e botão flutuante

Use `cookieBannerProps` e `floatingPreferencesButtonProps` para evitar colisões com footers,
chat widgets ou barras fixas:

```tsx
<ConsentProvider
  categories={{ enabledCategories: ['analytics', 'marketing'] }}
  cookieBannerProps={{
    position: 'bottom',
    anchor: 'center',
    offset: 72, // afasta o banner do footer fixo
  }}
  floatingPreferencesButtonProps={{
    position: 'bottom-right',
    offset: 96, // evita colisão com o banner/footer
  }}
/>
```

## 🌐 Internacionalização via Provider

Use `language` para resolver `texts.i18n` em runtime sem rebuilds:

```tsx
import { ConsentProvider, EXPANDED_DEFAULT_TEXTS } from 'react-lgpd-consent'

<ConsentProvider
  categories={{ enabledCategories: ['analytics'] }}
  texts={EXPANDED_DEFAULT_TEXTS}
  language="en"
>
  <YourApp />
</ConsentProvider>
```

## 🔄 Versionamento de Consentimento (0.5.x)

- **Resumo da solicitação**: namespace + versão para a chave de consentimento e estratégia de migração entre releases, garantindo compartilhamento entre subdomínios.
- **Caso de uso — problema que resolve**: quando o escopo de dados muda (novas categorias, integrações etc.), usuários precisam reafirmar consentimento. Sem um identificador de versão, o estado antigo permanece ativo e quebra conformidade.

### Solução proposta
- `storage.namespace` e `storage.version` geram automaticamente o nome do cookie via `buildConsentStorageKey`, mantendo o schema `namespace__v<versão>` (`lgpd-consent__v1` por padrão).
- `storage.domain` centraliza o domínio compartilhado (ex.: `.gov.br`) para que um único banner sirva múltiplos subdomínios.
- `onConsentVersionChange` é chamado sempre que a chave muda. O reset do estado é automático, mas o hook permite limpar caches customizados (ex.: localStorage, indexedDB) antes de liberar a nova experiência.
- Guia de migração: documente no seu changelog interno quando e por que o valor de `storage.version` mudou. O bump NÃO é breaking change porque a API pública permanece compatível—apenas força o fluxo de re-consent.
- Breaking change? **Não** — quem não configurar `storage` continua usando `lgpd-consent__v1`; ao aumentar a versão apenas ocorre re-consentimento.

### Critérios de aceitação
- Trocar `storage.version` força o fluxo completo: cookie antigo removido, `ConsentProvider` volta ao estado sem consentimento e o usuário vê o banner novamente.
- Subdomínios compartilham o mesmo consentimento quando `storage.domain` usa um domínio com ponto (`.example.com`).
- `onConsentVersionChange` entrega `previousKey`, `nextKey` e `resetConsent` para coordenar invalidação de caches externos.

## 🔒 Cookies necessários sempre ativos

- **Resumo da solicitação**: implementar a política de “necessários sempre ativos” tanto na UI quanto na persistência.
- **Caso de uso — problema resolvido**: atende ao requisito LGPD/ANPD de que cookies estritamente necessários não podem ser desativados; evita confusão na interface e garante consistência nos hooks.

### Como a biblioteca reforça a regra
- A categoria `necessary` é adicionada automaticamente pelo `ConsentProvider` e sempre persistida como `true`.
- `setPreference('necessary', false)` e `setPreferences({ necessary: false, ... })` são ignorados com logs de aviso — o estado permanece com `necessary=true`.
- O `PreferencesModal` padrão exibe a categoria com switch desabilitado e o texto `Cookies necessários (sempre ativos)`.
- `writeConsentCookie` garante `necessary=true` mesmo que o estado enviado esteja corrompido.
- Hooks (`useConsent`, `useCategoryStatus`) e integrações (`ConsentScriptLoader`, dataLayer) sempre recebem `necessary=true`.

### Exemplo (apenas cookies necessários)

```tsx
import { ConsentProvider } from '@react-lgpd-consent/core'

export function MinimalBoundary({ children }: { children: React.ReactNode }) {
  return <ConsentProvider categories={{ enabledCategories: [] }}>{children}</ConsentProvider>
}
```

### Critérios de aceitação
- UI, hooks, persistência e dataLayer mantêm `necessary=true` em todos os caminhos.
- Testes automatizados cobrem tentativas de toggle/programmatic override e serialização.
- Breaking change? **Não** — o comportamento já era esperado; agora é reforçado pelo runtime com avisos para cenários indevidos.

### Exemplo completo (namespace + versão + subdomínio)

```tsx
import { buildConsentStorageKey, ConsentProvider } from 'react-lgpd-consent'

function ComplianceWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ConsentProvider
      categories={{ enabledCategories: ['analytics', 'marketing'] }}
      storage={{
        namespace: 'portal.gov.br',
        version: '2025-Q4',
        domain: '.gov.br',
      }}
      cookie={{
        // Opcional: sobrescreva o nome explicitamente (útil para auditoria legada)
        name: buildConsentStorageKey({ namespace: 'portal.gov.br', version: '2025-Q4' }),
      }}
      onConsentVersionChange={({ previousKey, nextKey, resetConsent }) => {
        console.info('[consent] versão atualizada', { previousKey, nextKey })
        globalThis.window?.dataLayer?.push({
          event: 'consent_version_bumped',
          previousKey,
          nextKey,
        })
        localStorage.removeItem('marketing-optins')
        resetConsent()
      }}
    >
      {children}
    </ConsentProvider>
  )
}
```

### Alternativas consideradas
- **Invalidar sempre** (reset em toda visita) prejudica a UX e reduz taxas de aceitação.
- **Nunca invalidar** mantém consentimentos fora de escopo e compromete a conformidade.
  - A solução de namespace + versão expõe explicitamente quando o reconsentimento é necessário.

## 🎨 Componentes Customizados com TypeScript

### Banner Personalizado

```tsx
import React from 'react'
import { ConsentProvider, type CustomCookieBannerProps } from 'react-lgpd-consent'

// Componente de banner customizado
const MeuBannerCustomizado: React.FC<CustomCookieBannerProps> = ({
  consented,
  acceptAll,
  rejectAll,
  openPreferences,
  texts,
  blocking,
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: blocking ? 'red' : 'blue',
        color: 'white',
        padding: '1rem',
        zIndex: 1000,
      }}
    >
      <p>{texts.bannerMessage}</p>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button onClick={acceptAll}>{texts.acceptAll}</button>
        <button onClick={rejectAll}>{texts.declineAll}</button>
        <button onClick={openPreferences}>{texts.preferences}</button>
      </div>
    </div>
  )
}

// Usando o banner customizado
function App() {
  return (
    <ConsentProvider
      categories={{ enabledCategories: ['analytics'] }}
      CookieBannerComponent={MeuBannerCustomizado}
      blocking={true}
    >
      <main>Minha App</main>
    </ConsentProvider>
  )
}
````

### Modal de Preferências Personalizado

---

## Nota sobre ThemeProvider

A biblioteca `react-lgpd-consent` não injeta um `ThemeProvider` global por conta própria. Ela foi projetada para herdar o tema do app quando um `ThemeProvider` do MUI está presente. Se você precisa garantir um tema de fallback apenas para os componentes da biblioteca, use a fábrica exportada `createDefaultConsentTheme()` e passe pelo prop `theme` do `ConsentProvider`:

```tsx
import { ConsentProvider, createDefaultConsentTheme } from 'react-lgpd-consent'
<ConsentProvider
  theme={createDefaultConsentTheme()}
  categories={{ enabledCategories: ['analytics'] }}
>
  <App />
</ConsentProvider>
```


Isso evita alterações indesejadas no contexto do MUI do seu app e problemas de SSR.

```tsx
import React from 'react'
import { ConsentProvider, type CustomPreferencesModalProps } from 'react-lgpd-consent'

const MeuModalCustomizado: React.FC<CustomPreferencesModalProps> = ({
  preferences,
  setPreferences,
  closePreferences,
  isModalOpen,
  texts,
}) => {
  if (!isModalOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        border: '2px solid #ccc',
        borderRadius: '8px',
        padding: '2rem',
        zIndex: 2000,
        minWidth: '400px',
      }}
    >
      <h2>{texts.modalTitle}</h2>
      <p>{texts.modalIntro}</p>

      {/* Lista de categorias */}
      <div style={{ margin: '1rem 0' }}>
        {Object.entries(preferences).map(([category, enabled]) => (
          <label key={category} style={{ display: 'block', marginBottom: '0.5rem' }}>
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  [category]: e.target.checked,
                })
              }
              disabled={category === 'necessary'}
            />{' '}
            {category === 'necessary' ? texts.necessaryAlwaysOn : `Cookies ${category}`}
          </label>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
        <button onClick={closePreferences}>Cancelar</button>
        <button onClick={closePreferences}>{texts.save}</button>
      </div>
    </div>
  )
}

function App() {
  return (
    <ConsentProvider
      categories={{ enabledCategories: ['analytics', 'marketing'] }}
      PreferencesModalComponent={MeuModalCustomizado}
    >
      <main>Minha App</main>
    </ConsentProvider>
  )
}
```

### 🍪 Modal Personalizado com Detalhes dos Cookies

Para casos mais avançados onde você precisa exibir informações detalhadas sobre cada cookie (nome, finalidade, duração, provedor), use `getCookiesInfoForCategory` junto com `useCategories`:

```tsx
import React from 'react'
import {
  ConsentProvider,
  useCategories,
  getCookiesInfoForCategory,
  type CustomPreferencesModalProps,
  type CookieDescriptor,
} from 'react-lgpd-consent'

const ModalComDetalhesCookies: React.FC<CustomPreferencesModalProps> = ({
  preferences,
  setPreferences,
  closePreferences,
  isModalOpen,
  texts,
}) => {
  const { allCategories } = useCategories()

  if (!isModalOpen) return null

  // Simula integrações usadas no projeto (normalmente você teria isso em contexto)
  const integracoesUsadas = ['google-analytics', 'google-tag-manager', 'mixpanel']

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000,
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          maxWidth: '800px',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25)',
        }}
      >
        <h2 style={{ marginBottom: '1rem', color: '#333' }}>{texts.modalTitle}</h2>
        <p style={{ marginBottom: '2rem', color: '#666' }}>{texts.modalIntro}</p>

        {/* Lista de categorias com detalhes dos cookies */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {allCategories.map((categoria) => {
            const cookiesDetalhados: CookieDescriptor[] = getCookiesInfoForCategory(
              categoria.id as any,
              integracoesUsadas,
            )

            return (
              <div
                key={categoria.id}
                style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  backgroundColor: '#fafafa',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <input
                    type="checkbox"
                    id={`categoria-${categoria.id}`}
                    checked={preferences[categoria.id] || false}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        [categoria.id]: e.target.checked,
                      })
                    }
                    disabled={categoria.essential}
                    style={{ marginRight: '0.75rem', transform: 'scale(1.2)' }}
                  />
                  <label
                    htmlFor={`categoria-${categoria.id}`}
                    style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#333' }}
                  >
                    {categoria.name}
                    {categoria.essential && (
                      <span style={{ fontSize: '0.8rem', color: '#888', marginLeft: '0.5rem' }}>
                        (sempre ativo)
                      </span>
                    )}
                  </label>
                </div>

                <p style={{ marginBottom: '1rem', color: '#666', fontSize: '0.95rem' }}>
                  {categoria.description}
                </p>

                {/* Lista de cookies desta categoria */}
                {cookiesDetalhados.length > 0 && (
                  <details style={{ marginTop: '1rem' }}>
                    <summary
                      style={{
                        cursor: 'pointer',
                        fontWeight: '500',
                        color: '#4f46e5',
                        marginBottom: '0.5rem',
                      }}
                    >
                      Ver cookies desta categoria ({cookiesDetalhados.length})
                    </summary>
                    <div style={{ marginTop: '0.75rem', paddingLeft: '1rem' }}>
                      {cookiesDetalhados.map((cookie, index) => (
                        <div
                          key={`${cookie.name}-${index}`}
                          style={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e5e5',
                            borderRadius: '6px',
                            padding: '1rem',
                            marginBottom: '0.75rem',
                          }}
                        >
                          <h4
                            style={{ margin: '0 0 0.5rem 0', color: '#333', fontSize: '0.95rem' }}
                          >
                            <code
                              style={{
                                backgroundColor: '#f3f4f6',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontFamily: 'monospace',
                              }}
                            >
                              {cookie.name}
                            </code>
                          </h4>
                          {cookie.purpose && (
                            <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#555' }}>
                              <strong>Finalidade:</strong> {cookie.purpose}
                            </p>
                          )}
                          {cookie.duration && (
                            <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#555' }}>
                              <strong>Duração:</strong> {cookie.duration}
                            </p>
                          )}
                          {cookie.provider && (
                            <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#555' }}>
                              <strong>Provedor:</strong> {cookie.provider}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </details>
                )}

                {/* Fallback para categorias sem cookies catalogados */}
                {cookiesDetalhados.length === 0 &&
                  categoria.cookies &&
                  categoria.cookies.length > 0 && (
                    <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
                      <strong>Padrões de cookies:</strong>{' '}
                      {categoria.cookies.map((pattern, i) => (
                        <code
                          key={i}
                          style={{
                            backgroundColor: '#f3f4f6',
                            padding: '2px 4px',
                            borderRadius: '3px',
                            marginRight: '0.5rem',
                            fontFamily: 'monospace',
                            fontSize: '0.8rem',
                          }}
                        >
                          {pattern}
                        </code>
                      ))}
                    </div>
                  )}
              </div>
            )
          })}
        </div>

        {/* Botões de ação */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end',
            marginTop: '2rem',
            paddingTop: '1rem',
            borderTop: '1px solid #e0e0e0',
          }}
        >
          <button
            onClick={closePreferences}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.95rem',
            }}
          >
            Cancelar
          </button>
          <button
            onClick={closePreferences}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.95rem',
            }}
          >
            {texts.save}
          </button>
        </div>
      </div>
    </div>
  )
}

function AppComModalAvancado() {
  return (
    <ConsentProvider
      categories={{
        enabledCategories: ['analytics', 'marketing', 'functional'],
      }}
      PreferencesModalComponent={ModalComDetalhesCookies}
      // Especifique as integrações para obter informações detalhadas dos cookies
      scriptIntegrations={[
        { id: 'google-analytics', config: { measurementId: 'GA_MEASUREMENT_ID' } },
        { id: 'google-tag-manager', config: { containerId: 'GTM-XXXXXXX' } },
        { id: 'mixpanel', config: { token: 'MIXPANEL_TOKEN' } },
      ]}
    >
      <main>Minha App com Modal Avançado</main>
    </ConsentProvider>
  )
}
```

#### 🔧 APIs Utilizadas no Exemplo Avançado

- **`useCategories()`**: Hook que retorna informações sobre todas as categorias ativas
- **`getCookiesInfoForCategory(categoryId, integrations)`**: Função que retorna detalhes completos dos cookies
- **`CookieDescriptor`**: Interface TypeScript com `name`, `purpose`, `duration`, `provider`

#### 💡 Principais Funcionalidades

1. **Informações Detalhadas**: Cada cookie mostra nome, finalidade, duração e provedor
2. **Organização por Categoria**: Cookies agrupados logicamente
3. **Interface Expansível**: Detalhes dos cookies ficam em `<details>` expansível
4. **Fallback Inteligente**: Mostra padrões básicos quando detalhes não estão disponíveis
5. **Acessibilidade**: Labels apropriados e navegação por teclado
6. **Design Responsivo**: Layout que se adapta a diferentes tamanhos de tela

## 🎮 Controle Programático

### Hook useOpenPreferencesModal (React)

```tsx
import React from 'react'
import { useOpenPreferencesModal, useConsent } from 'react-lgpd-consent'

function MeuComponente() {
  const openPreferences = useOpenPreferencesModal()
  const { preferences, acceptAll, rejectAll } = useConsent()

  return (
    <div>
      <h3>Status atual: {preferences.analytics ? 'Analytics ativo' : 'Analytics inativo'}</h3>

      <button onClick={openPreferences}>⚙️ Gerenciar Preferências</button>

      <button onClick={acceptAll}>✅ Aceitar Todos</button>

      <button onClick={rejectAll}>❌ Recusar Todos</button>
    </div>
  )
}
```

### globalThis.window.openPreferencesModal (JavaScript Puro)

```html
<!-- Em templates HTML, emails ou widgets externos -->
<button onclick="globalThis.window?.openPreferencesModal?.()">Configurar Cookies</button>

<script>
  // Ou em JavaScript puro
  function abrirConfiguracoesCookies() {
    if (globalThis.window?.openPreferencesModal) {
      globalThis.window.openPreferencesModal()
    } else {
      console.warn('Sistema de consentimento não carregado')
    }
  }

  // Verificar se função está disponível
  if (typeof globalThis.window?.openPreferencesModal === 'function') {
    console.log('✅ Sistema de consentimento disponível')
  }
</script>
```

## 🐛 Sistema de Debug

### Configuração de Debug

```tsx
import { setDebugLogging, LogLevel } from 'react-lgpd-consent'

// Ativar todos os logs (desenvolvimento)
setDebugLogging(true, LogLevel.DEBUG)

// Apenas logs importantes (staging)
setDebugLogging(true, LogLevel.INFO)

// Apenas erros (produção)
setDebugLogging(true, LogLevel.ERROR)

// Desativar completamente
setDebugLogging(false)
```

### Exemplo de Logs no Console

```jsx
// Em desenvolvimento, você verá logs como:
// [🍪 LGPD-CONSENT] 🔧 Categorias Ativas (para UI customizada)
// [🍪 LGPD-CONSENT] ℹ️ User accepted all cookies
// [🍪 LGPD-CONSENT] 🐛 Category preference changed: analytics = true
```

### Hook para Debug Runtime

```tsx
import { useConsent } from 'react-lgpd-consent'

function DebugPanel() {
  const { preferences, consented } = useConsent()

  // Apenas mostrar em desenvolvimento
  if (process.env.NODE_ENV !== 'development') return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '1rem',
        fontSize: '12px',
        fontFamily: 'monospace',
      }}
    >
      <h4>🍪 Debug LGPD</h4>
      <p>Consentimento: {consented ? '✅' : '❌'}</p>
      <pre>{JSON.stringify(preferences, null, 2)}</pre>
    </div>
  )
}
```

## 🎨 Integração com Material-UI ThemeProvider

### Configuração Completa

```tsx
import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { ConsentProvider } from 'react-lgpd-consent'

// Seu tema personalizado
const meuTema = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
})

// Tema específico para componentes de consentimento (opcional)
const temaConsentimento = createTheme({
  ...meuTema,
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={meuTema}>
      <CssBaseline />
      <ConsentProvider
        categories={{
          enabledCategories: ['analytics', 'marketing', 'advertising'],
        }}
        theme={temaConsentimento} // Tema específico para consentimento
        texts={{
          bannerMessage: 'Utilizamos cookies para personalizar sua experiência.',
          acceptAll: 'Aceitar Todos',
          declineAll: 'Apenas Necessários',
          preferences: 'Personalizar',
        }}
        onConsentGiven={(state) => {
          console.log('✅ Consentimento dado:', state.preferences)
        }}
      >
        <main>
          <h1>Minha Aplicação com Material-UI</h1>
          {/* Seus componentes aqui */}
        </main>
      </ConsentProvider>
    </ThemeProvider>
  )
}

export default App
```

## 🔧 Configurações Avançadas

### Personalização de Design Tokens

```tsx
import { ConsentProvider, type DesignTokens } from 'react-lgpd-consent'

const meusTokens: DesignTokens = {
  colors: {
    primary: '#6366f1',
    secondary: '#f59e0b',
    background: '#ffffff',
    text: '#1f2937',
    border: '#e5e7eb',
  },
  layout: {
    borderRadius: '12px',
    spacing: '1rem',
    backdrop: 'rgba(0, 0, 0, 0.6)', // ou false para transparente
  },
  typography: {
    fontFamily: '"Inter", system-ui, sans-serif',
    fontSize: '14px',
    fontWeight: '500',
  },
}

function App() {
  return (
    <ConsentProvider
      categories={{ enabledCategories: ['analytics'] }}
      designTokens={meusTokens}
      blocking={true}
      blockingStrategy="provider"
    >
      <main>Minha App</main>
    </ConsentProvider>
  )
}
```

Você também pode complementar com overrides pontuais via `sx`/tema MUI:

```tsx
<ConsentProvider
  categories={{ enabledCategories: ['analytics'] }}
  cookieBannerProps={{ PaperProps: { sx: { borderRadius: 3 } } }}
  preferencesModalProps={{ DialogProps: { sx: { '& .MuiDialog-paper': { borderRadius: 4 } } } }}
/>
```

### Configuração de Cookie Personalizada

```tsx
import { ConsentProvider } from 'react-lgpd-consent'

function App() {
  return (
    <ConsentProvider
      categories={{ enabledCategories: ['analytics'] }}
      cookie={{
        name: 'meu_app_consent', // Nome customizado
        maxAge: 365 * 24 * 60 * 60, // 1 ano em segundos
        domain: '.meudominio.com.br', // Cookie compartilhado entre subdomínios
        secure: true, // Apenas HTTPS
        sameSite: 'Lax', // Política SameSite
      }}
    >
      <main>Minha App</main>
    </ConsentProvider>
  )
}
```

## 🚀 Casos de Uso Comuns

### 1. E-commerce com Analytics + Marketing

```tsx
<ConsentProvider
  categories={{
    enabledCategories: ['analytics', 'marketing', 'advertising'],
  }}
  texts={{
    bannerMessage:
      'Usamos cookies para melhorar sua experiência de compra e exibir ofertas personalizadas.',
    acceptAll: 'Aceitar e continuar',
    declineAll: 'Apenas essenciais',
  }}
  onConsentGiven={(state) => {
    // Inicializar ferramentas baseado no consentimento
    if (state.preferences.analytics) {
      // gtag('config', 'GA_MEASUREMENT_ID')
    }
    if (state.preferences.marketing) {
      // fbq('init', 'FACEBOOK_PIXEL_ID')
    }
  }}
>
  {/* Sua loja */}
</ConsentProvider>
```

### 2. Blog/Site Institucional Simples

```tsx
<ConsentProvider
  categories={{
    enabledCategories: ['analytics'],
  }}
  disableFloatingPreferencesButton={false}
  hideBranding={true}
>
  {/* Seu conteúdo */}
</ConsentProvider>
```

### 3. Aplicação Corporativa com Controle Rigoroso

```tsx
<ConsentProvider
  categories={{
    enabledCategories: ['analytics', 'functional'],
  }}
  blocking={true}
  blockingStrategy="provider"
  disableDeveloperGuidance={false}
  onPreferencesSaved={(prefs) => {
    // Log de auditoria
    console.log('Audit: User preferences updated', prefs)
  }}
>
  {/* Sua app corporativa */}
</ConsentProvider>
```

## 🆘 Solução de Problemas Comuns

> 💡 **Diagnósticos automáticos**: A partir da v0.5.4, o react-lgpd-consent detecta automaticamente problemas comuns (múltiplas instâncias de React, versões incompatíveis) e exibe mensagens detalhadas no console em modo desenvolvimento.

Para problemas mais complexos, consulte o **[Guia Completo de Troubleshooting](../../TROUBLESHOOTING.md)**.

### Erros mais comuns

#### "Invalid hook call" / Múltiplas instâncias de React

Se você vê este erro, provavelmente tem múltiplas versões de React carregadas. O diagnóstico automático exibirá instruções específicas para o seu gerenciador de pacotes.

**Solução rápida (pnpm)**:
```json
{
  "pnpm": {
    "overrides": {
      "react": "$react",
      "react-dom": "$react-dom"
    }
  }
}
```

**Mais detalhes**: [TROUBLESHOOTING.md - Invalid hook call](../../TROUBLESHOOTING.md#erro-invalid-hook-call)

#### "ConsentProvider must be used within ConsentProvider"

```tsx
// ❌ Errado - hook usado fora do provider
function MeuComponente() {
  const { preferences } = useConsent() // Erro!
  return <div>...</div>
}

function App() {
  return (
    <div>
      <MeuComponente /> {/* useConsent usado aqui falhará */}
      <ConsentProvider categories={{ enabledCategories: ['analytics'] }}>
        <main>App</main>
      </ConsentProvider>
    </div>
  )
}

// ✅ Correto - hook usado dentro do provider
function App() {
  return (
    <ConsentProvider categories={{ enabledCategories: ['analytics'] }}>
      <div>
        <MeuComponente /> {/* Agora funciona */}
        <main>App</main>
      </div>
    </ConsentProvider>
  )
}
```

### Banner não aparece

1. Verificar se não há consentimento salvo no cookie:

```js
// Limpar cookie para teste
document.cookie = 'cookieConsent=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
```

2. Verificar se `hideBranding` e outras configs estão corretas
3. Conferir se o `z-index` não está sendo sobrescrito por outros elementos

### TypeScript - tipos não encontrados

```ts
// Se você tiver problemas com tipos, adicione ao tsconfig.json:
{
  "compilerOptions": {
    "moduleResolution": "bundler", // ou "node"
    "skipLibCheck": true
  }
}
```

## 📚 Próximos Passos

- 📖 [Documentação Completa da API](./API.md)
- 🔧 [Guia de Troubleshooting](../../TROUBLESHOOTING.md)
- 🏗️ [Guia de Conformidade LGPD](../../CONFORMIDADE.md)
- 🔌 [Integrações Nativas](./INTEGRACOES.md)
- 🧪 [Executar o Exemplo](../../example/)

---

💡 **Dica**: Use `setDebugLogging(true, LogLevel.DEBUG)` durante o desenvolvimento para ver logs detalhados do comportamento da biblioteca.
