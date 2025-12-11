# Guia de Troubleshooting - react-lgpd-consent

Este guia documenta problemas comuns e suas soluções ao usar o `react-lgpd-consent`.

## Índice

- [Erro: Invalid hook call](#erro-invalid-hook-call)
- [Múltiplas instâncias de React detectadas](#múltiplas-instâncias-de-react)
- [Versão do React não suportada](#versão-do-react-não-suportada)
- [Versão do MUI fora do range](#versão-do-mui-fora-do-range)
- [Problemas com pnpm](#problemas-com-pnpm)
- [Problemas com Yarn PnP](#problemas-com-yarn-pnp)
- [SSR / Next.js](#ssr--nextjs)
- [Banner não aparece](#banner-não-aparece)
- [Como desabilitar diagnósticos](#como-desabilitar-diagnósticos)
- [🆕 Hooks fora do Provider](#hooks-fora-do-provider)
- [🆕 Configurar z-index de banner/modal](#configurar-z-index-de-bannermodal)
- [🆕 CSP estrita (Content Security Policy)](#csp-estrita-content-security-policy)
- [🆕 Callbacks de lifecycle de consentimento](#callbacks-de-lifecycle-de-consentimento)
- [🆕 Presets de categorias LGPD/ANPD](#presets-de-categorias-lgpdanpd)
- [🆕 Auditoria e log de consentimento](#auditoria-e-log-de-consentimento)
- [🆕 Props blocking e hideBranding](#props-blocking-e-hidebranding)

---

## Erro: Invalid hook call

### Sintoma

```
Error: Invalid hook call. Hooks can only be called inside of the body of a function component.
```

### Causa

Este erro quase sempre indica que existem **múltiplas instâncias de React** carregadas no seu projeto. Isso quebra as regras dos hooks do React.

### Diagnóstico automático

A partir da v0.5.4, o `react-lgpd-consent` detecta automaticamente este problema em modo desenvolvimento e exibe uma mensagem detalhada no console com instruções específicas para o seu gerenciador de pacotes.

### Solução

<details>
<summary><strong>📦 PNPM (RECOMENDADO)</strong></summary>

Adicione ao `package.json` raiz do seu projeto:

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

Execute:

```bash
pnpm install
```

**Explicação**: `$react` e `$react-dom` forçam o pnpm a usar a mesma versão instalada na raiz, evitando duplicação.

</details>

<details>
<summary><strong>📦 NPM / Yarn clássico</strong></summary>

Adicione ao `package.json` raiz:

```json
{
  "overrides": {
    "react": "^18.2.0 || ^19.0.0",
    "react-dom": "^18.2.0 || ^19.0.0"
  }
}
```

Execute:

```bash
npm install
# ou
yarn install
```

</details>

<details>
<summary><strong>🔧 Webpack</strong></summary>

Adicione ao `webpack.config.js`:

```javascript
const path = require('path')

module.exports = {
  resolve: {
    alias: {
      react: path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
    },
  },
}
```

</details>

<details>
<summary><strong>⚡ Vite</strong></summary>

Adicione ao `vite.config.js`:

```javascript
export default {
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
}
```

</details>

---

## Múltiplas instâncias de React

### Como verificar manualmente

Execute no console do browser (DevTools):

```javascript
// Verificar quantas instâncias de React existem
Object.keys(window).filter((key) => key.includes('React'))
```

Se retornar mais de um resultado, você tem múltiplas instâncias.

### Verificação programática

```typescript
import { checkPeerDeps } from 'react-lgpd-consent'

const result = checkPeerDeps()
if (!result.ok) {
  console.log('Problemas detectados:', result.errors)
}
```

---

## Versão do React não suportada

### Versões suportadas

- **React 18.2.0+** (recomendado)
- **React 19.x** (suportado)

### Solução

Atualize o React:

```bash
# React 18
npm install react@^18.2.0 react-dom@^18.2.0

# React 19
npm install react@^19.0.0 react-dom@^19.0.0
```

---

## Versão do MUI fora do range

### Versões suportadas

- **@mui/material 5.15.0+**
- **@mui/material 6.x**
- **@mui/material 7.x** (recomendado)

### Sintoma

Componentes de UI não renderizam corretamente ou apresentam erros de estilo.

### Solução

Atualize o MUI:

```bash
# MUI 7 (recomendado)
npm install @mui/material@^7.0.0 @emotion/react @emotion/styled

# MUI 5.15+ (mínimo)
npm install @mui/material@^5.15.0 @emotion/react @emotion/styled
```

### Nota

Se você usa apenas o pacote `@react-lgpd-consent/core` (headless, sem UI), pode ignorar esta verificação.

---

## Problemas com pnpm

### Erro: ERESOLVE unable to resolve dependency tree

Comum ao instalar em projetos existentes com pnpm.

**Solução rápida**:

```bash
pnpm install --legacy-peer-deps
```

**Solução permanente**:

Adicione ao `.npmrc` na raiz:

```
auto-install-peers=true
strict-peer-dependencies=false
```

Execute:

```bash
pnpm install
```

### Hoisting de peer dependencies

Para garantir que peer deps sejam compartilhadas corretamente:

```json
{
  "pnpm": {
    "overrides": {
      "react": "$react",
      "react-dom": "$react-dom",
      "@mui/material": "$@mui/material"
    }
  }
}
```

---

## Problemas com Yarn PnP

Yarn Plug'n'Play pode causar problemas de resolução de módulos.

### Solução

Adicione ao `.yarnrc.yml`:

```yaml
nodeLinker: node-modules
```

Execute:

```bash
yarn install
```

**Ou**, se quiser manter PnP, use `packageExtensions`:

```yaml
packageExtensions:
  'react-lgpd-consent@*':
    peerDependencies:
      react: '*'
      react-dom: '*'
```

---

## SSR / Next.js

### Banner aparece brevemente (flash) mesmo com consentimento

**Causa**: Hidratação do estado após o mount.

**Solução**: Use `initialState` prop para SSR:

```tsx
import { ConsentProvider } from 'react-lgpd-consent'
import { cookies } from 'next/headers'

export default function RootLayout({ children }) {
  // Server-side: ler cookie
  const consentCookie = cookies().get('lgpd_consent')
  const initialState = consentCookie?.value ? JSON.parse(consentCookie.value) : undefined

  return (
    <html>
      <body>
        <ConsentProvider
          categories={{ enabledCategories: ['analytics'] }}
          initialState={initialState}
        >
          {children}
        </ConsentProvider>
      </body>
    </html>
  )
}
```

### useConsent causa erro em componentes Server

**Causa**: `useConsent` só funciona em Client Components.

**Solução**: Adicione `"use client"` no topo do arquivo:

```tsx
'use client'

import { useConsent } from 'react-lgpd-consent'

export default function MyComponent() {
  const { preferences } = useConsent()
  // ...
}
```

---

## Banner não aparece

### Checklist

1. **Você está usando o pacote correto?**
   - `@react-lgpd-consent/core` é **headless** (sem UI)
   - Use `@react-lgpd-consent/mui` para componentes prontos

2. **ConsentProvider está no nível correto?**
   - Deve envolver toda a aplicação
   - Componentes que usam `useConsent` devem estar dentro do Provider

3. **O usuário já deu consentimento?**
   - O banner só aparece se `consented === false`
   - Limpe o cookie para testar: `document.cookie = "lgpd_consent=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"`

4. **hideBranding está habilitado sem licença?**
   - Componentes podem não renderizar se `hideBranding={true}` for usado incorretamente

### Debugar

```typescript
import { useConsent } from 'react-lgpd-consent'

function Debug() {
  const { consented, preferences } = useConsent()

  console.log('Consentimento:', { consented, preferences })

  return null
}
```

---

## Hooks fora do Provider

### Sintoma

```
⚠️ useConsent hook chamado fora do ConsentProvider
```

Ou erro genérico no console quando hooks são chamados sem o Provider.

### Causa

Os hooks `useConsent`, `useCategories`, `useConsentScriptLoader` exigem que haja um `<ConsentProvider>` acima no componente tree.

### Solução

**✅ Correto:**

```tsx
import { ConsentProvider, useConsent } from 'react-lgpd-consent'

function MyComponent() {
  const { preferences, updatePreferences } = useConsent()
  return <div>Status: {preferences.analytics ? 'Aceito' : 'Negado'}</div>
}

function App() {
  return (
    <ConsentProvider categories={{ enabledCategories: ['analytics', 'marketing'] }}>
      <MyComponent />
    </ConsentProvider>
  )
}
```

**❌ Incorreto:**

```tsx
function App() {
  const { preferences } = useConsent() // ❌ Sem Provider acima!
  return <div>...</div>
}
```

### Notas

- A partir da v0.7.0, mensagens de erro são exibidas em **pt-BR** com links para a documentação
- Verifique que o Provider está no componente raiz da sua aplicação
- Em Next.js App Router, use `dynamic()` para carregar o Provider no client-side (veja [SSR / Next.js](#ssr--nextjs))

---

## Configurar z-index de banner/modal

### Problema

O banner ou modal aparece **atrás** de outros elementos (ex.: navbar, sidebar, tooltips).

### Solução 1: Design Tokens (v0.7.0+)

Use `designTokens` para customizar o z-index:

```tsx
<ConsentProvider
  categories={{ enabledCategories: ['analytics'] }}
  designTokens={{
    zIndex: {
      banner: 2000, // z-index do banner
      modal: 2100, // z-index do modal
      backdrop: 1999, // z-index do backdrop (se blocking=true)
    },
  }}
>
  {children}
</ConsentProvider>
```

### Solução 2: Sobrescrever via Theme MUI

Se usar Material-UI, ajuste o `theme.zIndex`:

```tsx
import { createTheme, ThemeProvider } from '@mui/material/styles'

const theme = createTheme({
  zIndex: {
    modal: 2100,
    snackbar: 2000,
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ConsentProvider categories={{ enabledCategories: ['analytics'] }}>
        {children}
      </ConsentProvider>
    </ThemeProvider>
  )
}
```

### Solução 3: CSS customizado

Se usar componentes customizados, sobrescreva via CSS:

```css
[data-testid='lgpd-cookie-banner'] {
  z-index: 2000 !important;
}

[data-testid='lgpd-preferences-modal-root'] {
  z-index: 2100 !important;
}
```

### SSR/Next.js: Ordem de injeção de estilos

No Next.js App Router com Material-UI/Emotion, garanta a ordem correta:

```tsx
// app/layout.tsx (Server Component)
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
      </body>
    </html>
  )
}
```

```tsx
// app/ClientConsent.tsx (Client Component)
'use client'
import { ConsentProvider } from 'react-lgpd-consent'

export function ClientConsent({ children }) {
  return (
    <ConsentProvider
      categories={{ enabledCategories: ['analytics'] }}
      designTokens={{ zIndex: { banner: 2000, modal: 2100 } }}
    >
      {children}
    </ConsentProvider>
  )
}
```

**Referência:** [RECIPES.md - Next.js App Router](./RECIPES.md#nextjs-app-router)

---

## CSP estrita (Content Security Policy)

### Problema

Scripts de terceiros (GA4, GTM, Hotjar) são bloqueados por `Content-Security-Policy: script-src 'self'`.

### Solução: nonce (v0.7.0+)

A biblioteca suporta propagação de `nonce` para scripts condicionais.

#### 1. Gerar nonce no servidor (Next.js exemplo)

```tsx
// middleware.ts (Next.js 15+)
import { NextResponse } from 'next/server'
import { randomBytes } from 'crypto'

export function middleware(request: Request) {
  const nonce = randomBytes(16).toString('base64')
  const response = NextResponse.next()

  response.headers.set(
    'Content-Security-Policy',
    `script-src 'self' 'nonce-${nonce}' https://www.googletagmanager.com; ...`
  )

  // Passar nonce via header customizado
  response.headers.set('x-nonce', nonce)

  return response
}
```

#### 2. Propagar nonce para ConsentScriptLoader

```tsx
'use client'
import { ConsentProvider, ConsentScriptLoader, createGoogleAnalyticsIntegration } from 'react-lgpd-consent'
import { useHeaders } from 'next/headers'

export function ClientConsent({ nonce }: { nonce: string }) {
  const integrations = [
    createGoogleAnalyticsIntegration({
      measurementId: 'G-XXXXXXXXXX',
    }),
  ]

  return (
    <ConsentProvider categories={{ enabledCategories: ['analytics'] }}>
      <ConsentScriptLoader integrations={integrations} nonce={nonce} />
    </ConsentProvider>
  )
}
```

#### 3. Passar nonce do Server Component

```tsx
// app/layout.tsx
import { headers } from 'next/headers'
import { ClientConsent } from './ClientConsent'

export default function RootLayout({ children }) {
  const nonce = headers().get('x-nonce') || ''

  return (
    <html>
      <body>
        <ClientConsent nonce={nonce}>{children}</ClientConsent>
      </body>
    </html>
  )
}
```

### Notas CSP

- O `nonce` é automaticamente aplicado a **todos** os `<script>` injetados por integrações
- Certifique-se de incluir domínios de terceiros no `script-src` além do nonce:
  - `https://www.googletagmanager.com` (GA4/GTM)
  - `https://static.hotjar.com` (Hotjar)
  - `https://connect.facebook.net` (Facebook Pixel)
- **Não** reutilize o mesmo nonce entre requests (gere um novo por request)

**Referência completa:** [RECIPES.md - CSP com nonce](./RECIPES.md#csp-com-nonce)

---

## Callbacks de lifecycle de consentimento

### Disponível desde: v0.7.0

Use callbacks para reagir a mudanças no consentimento.

#### onConsentInit

Disparado quando o sistema de consentimento é **inicializado** (primeira renderização após hidratação SSR).

```tsx
<ConsentProvider
  categories={{ enabledCategories: ['analytics', 'marketing'] }}
  onConsentInit={(preferences) => {
    console.log('Consentimento inicializado:', preferences)
    // Exemplo: carregar scripts customizados
    if (preferences.analytics) {
      loadCustomAnalytics()
    }
  }}
>
  {children}
</ConsentProvider>
```

#### onConsentChange

Disparado quando o usuário **atualiza** preferências (aceitar/negar categorias).

```tsx
<ConsentProvider
  categories={{ enabledCategories: ['analytics', 'marketing'] }}
  onConsentChange={(preferences, origin) => {
    console.log('Consentimento alterado:', preferences, 'origem:', origin)
    // origin: 'banner' | 'modal' | 'programmatic' | 'reset'

    // Exemplo: enviar para backend
    fetch('/api/consent-log', {
      method: 'POST',
      body: JSON.stringify({ preferences, origin, timestamp: new Date() }),
    })
  }}
>
  {children}
</ConsentProvider>
```

#### onConsentVersionChange

Disparado quando a **versão do termo** muda (novo consentimento necessário).

```tsx
<ConsentProvider
  categories={{ enabledCategories: ['analytics', 'marketing'] }}
  version="2.0"
  onConsentVersionChange={(oldVersion, newVersion) => {
    console.log(`Versão alterada de ${oldVersion} para ${newVersion}`)
    // Exemplo: notificar usuário que precisa reconsentir
    alert('Nossos termos foram atualizados. Por favor, revise suas preferências.')
  }}
>
  {children}
</ConsentProvider>
```

### Integração com Google Tag Manager

Os callbacks podem ser usados para enviar eventos customizados ao `dataLayer`:

```tsx
<ConsentProvider
  categories={{ enabledCategories: ['analytics', 'marketing'] }}
  onConsentChange={(preferences, origin) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'custom_consent_update',
        consent_preferences: preferences,
        consent_origin: origin,
      })
    }
  }}
>
  {children}
</ConsentProvider>
```

**Referência:** [API.md - Callbacks](./packages/react-lgpd-consent/API.md#callbacks-de-lifecycle)

---

## Presets de categorias LGPD/ANPD

### Disponível desde: v0.7.0

Use presets tipados para configurar categorias conforme a ANPD (Autoridade Nacional de Proteção de Dados).

#### Preset Básico

```tsx
import { ConsentProvider, ANPD_CATEGORY_PRESETS } from 'react-lgpd-consent'

<ConsentProvider categories={ANPD_CATEGORY_PRESETS.BASIC}>
  {children}
</ConsentProvider>
```

**Categorias incluídas:**
- `necessary` (Necessários)
- `analytics` (Analytics)
- `marketing` (Marketing)

#### Preset Completo

```tsx
<ConsentProvider categories={ANPD_CATEGORY_PRESETS.FULL}>
  {children}
</ConsentProvider>
```

**Categorias incluídas:**
- `necessary` (Necessários)
- `analytics` (Analytics)
- `marketing` (Marketing)
- `functional` (Funcionais)

#### Preset Mínimo (apenas necessários)

```tsx
<ConsentProvider categories={ANPD_CATEGORY_PRESETS.MINIMAL}>
  {children}
</ConsentProvider>
```

**Categorias incluídas:**
- `necessary` (Necessários)

#### Helper tipado: createAnpdCategoriesConfig

Para maior flexibilidade, use o helper:

```tsx
import { createAnpdCategoriesConfig } from 'react-lgpd-consent'

const categories = createAnpdCategoriesConfig({
  includeAnalytics: true,
  includeMarketing: true,
  includeFunctional: false,
  customCategories: [
    {
      id: 'preferences',
      title: 'Preferências',
      description: 'Armazena suas configurações personalizadas',
      necessary: false,
    },
  ],
})

<ConsentProvider categories={categories}>
  {children}
</ConsentProvider>
```

### Benefícios

- ✅ Conformidade automática com terminologia ANPD
- ✅ Tipos TypeScript garantem estrutura correta
- ✅ Facilita auditoria (nomes/descrições padronizadas)

**Referência:** [RECIPES.md - Presets ANPD](./RECIPES.md#presets-de-categorias-anpd)

---

## Auditoria e log de consentimento

### Disponível desde: v0.7.0

A biblioteca oferece APIs para registrar e auditar consentimentos conforme LGPD.

#### onAuditLog (callback)

Recebe eventos de auditoria quando consentimento é inicializado ou alterado:

```tsx
import { createConsentAuditEntry } from 'react-lgpd-consent'

<ConsentProvider
  categories={{ enabledCategories: ['analytics', 'marketing'] }}
  onAuditLog={(auditEntry) => {
    console.log('Evento de auditoria:', auditEntry)

    // Exemplo: enviar para backend
    fetch('/api/consent-audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(auditEntry),
    })
  }}
>
  {children}
</ConsentProvider>
```

**Estrutura do `auditEntry`:**

```typescript
{
  timestamp: '2025-12-11T15:30:00.000Z', // ISO 8601
  version: '1.0', // Versão do termo de consentimento
  preferences: {
    necessary: true,
    analytics: true,
    marketing: false
  },
  origin: 'banner', // 'banner' | 'modal' | 'programmatic' | 'reset'
  userAgent: 'Mozilla/5.0...',
  ipAddress: undefined // (opcional, adicione via backend)
}
```

#### createConsentAuditEntry (helper)

Crie entradas de auditoria manualmente:

```typescript
import { createConsentAuditEntry, useConsent } from 'react-lgpd-consent'

function AuditButton() {
  const { preferences } = useConsent()

  const handleExport = () => {
    const auditEntry = createConsentAuditEntry(preferences, 'manual-export', '1.0')

    // Baixar como JSON
    const blob = new Blob([JSON.stringify(auditEntry, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `consent-audit-${Date.now()}.json`
    a.click()
  }

  return <button onClick={handleExport}>Exportar Consentimento</button>
}
```

### Integração com Backend (exemplo Node.js/Express)

```typescript
// backend/routes/consent.ts
app.post('/api/consent-audit', async (req, res) => {
  const auditEntry = req.body

  // Enriquecer com dados do servidor
  const enrichedEntry = {
    ...auditEntry,
    ipAddress: req.ip,
    userId: req.user?.id, // se autenticado
  }

  // Salvar no banco de dados
  await db.consentLogs.insert(enrichedEntry)

  res.status(201).json({ ok: true })
})
```

### Conformidade LGPD

Para conformidade completa, armazene:

- ✅ **timestamp** (data/hora do consentimento)
- ✅ **version** (versão do termo aceito)
- ✅ **preferences** (categorias aceitas/negadas)
- ✅ **origin** (como o consentimento foi dado)
- ✅ **userAgent** (navegador/dispositivo)
- ⚠️ **ipAddress** (adicione via backend, não disponível no client)
- ⚠️ **userId** (se aplicável, adicione via backend)

**Referência:** [RECIPES.md - Auditoria de consentimento](./RECIPES.md#auditoria-de-consentimento)

---

## Props blocking e hideBranding

### blocking (modo bloqueante)

Quando `blocking={true}`, o banner impede a interação com o site até o usuário consentir:

```tsx
<ConsentProvider categories={{ enabledCategories: ['analytics'] }} blocking={true}>
  {children}
</ConsentProvider>
```

**Efeito:**
- ✅ Backdrop escuro cobrindo toda a tela
- ✅ Conteúdo do site visível mas **não interativo**
- ✅ z-index alto garante que banner fica acima de tudo

**Casos de uso:**
- Sites com requisitos legais estritos (GDPR wall)
- Conformidade em mercados com regulamentação rígida

### hideBranding (remover marca)

Quando `hideBranding={true}`, remove o rodapé "Powered by react-lgpd-consent":

```tsx
<ConsentProvider categories={{ enabledCategories: ['analytics'] }} hideBranding={true}>
  {children}
</ConsentProvider>
```

⚠️ **Nota:** A prop `hideBranding` é respeitada em ambientes de desenvolvimento. Para uso em produção, considere [patrocinar o projeto](https://github.com/sponsors/lucianoedipo) ou contribuir com melhorias.

### Testando propagação de props

Se `blocking` ou `hideBranding` não estiverem funcionando:

1. **Verifique que está passando as props para o `ConsentProvider`** (não para componentes filhos)
2. **Limpe o cookie de consentimento** para forçar re-renderização do banner:
   ```javascript
   document.cookie = 'lgpd_consent=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
   ```
3. **Verifique que usa o pacote MUI** (`@react-lgpd-consent/mui`), não o core headless

#### Debugar propagação

```tsx
import { CookieBanner } from '@react-lgpd-consent/mui'

function App() {
  return (
    <ConsentProvider categories={{ enabledCategories: ['analytics'] }} blocking={true}>
      <CookieBanner
        onAcceptAll={(e) => console.log('Props recebidas:', e)}
        onReject={(e) => console.log('Props recebidas:', e)}
      />
    </ConsentProvider>
  )
}
```

Verifique no console se `blocking` chega até o `CookieBanner`.

**Referência:** [CookieBanner.tsx](./packages/mui/src/components/CookieBanner.tsx)

---

## Como desabilitar diagnósticos

Os diagnósticos automáticos são executados apenas em **desenvolvimento** e podem ser desabilitados.

### Desabilitar todos os avisos de desenvolvimento

```tsx
<ConsentProvider categories={{ enabledCategories: ['analytics'] }} disableDeveloperGuidance={true}>
  {children}
</ConsentProvider>
```

### Verificar peer deps programaticamente (sem logs)

```typescript
import { checkPeerDeps } from 'react-lgpd-consent'

const result = checkPeerDeps({ logWarnings: false })

if (!result.ok) {
  // Tratar erros de forma customizada
  result.errors.forEach((err) => {
    // Seu handler customizado
  })
}
```

---

## Recursos adicionais

- **Documentação principal**: [README.md](./README.md)
- **Quickstart**: [QUICKSTART.md](./QUICKSTART.md)
- **API Reference**: [API.md](./packages/react-lgpd-consent/API.md)
- **Guia de desenvolvimento**: [DEVELOPMENT.md](./DEVELOPMENT.md)
- **Issues no GitHub**: https://github.com/lucianoedipo/react-lgpd-consent/issues

---

## Ainda com problemas?

Se nenhuma solução acima resolver, por favor:

1. Ative o logging de debug:

   ```typescript
   import { setDebugLogging, LogLevel } from 'react-lgpd-consent'
   setDebugLogging(true, LogLevel.DEBUG)
   ```

2. Capture os logs do console

3. Abra uma issue com:
   - Versões: Node, React, MUI, react-lgpd-consent
   - Gerenciador de pacotes: npm/yarn/pnpm
   - Logs completos do erro
   - Reprodução mínima se possível

**GitHub Issues**: https://github.com/lucianoedipo/react-lgpd-consent/issues
