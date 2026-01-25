# 📖 Receitas e Casos de Uso

> Guia prático com receitas passo a passo para cenários comuns de implementação do `react-lgpd-consent`.

**Data Format**: DD/MM/YYYY | **Time Format**: HH:mm:ss (24h) | **Idioma**: pt-BR

---

## 📚 Índice

1. [Next.js App Router (SSR)](#1-nextjs-app-router-ssr)
2. [Configuração de Subdomínios](#2-configuração-de-subdomínios)
3. [Google Consent Mode v2](#3-google-consent-mode-v2)
4. [Bump de Versão de Consentimento](#4-bump-de-versão-de-consentimento)
5. [Content Security Policy (CSP) e Nonce](#5-content-security-policy-csp-e-nonce)
6. [Vite + React SPA](#6-vite--react-spa)
7. [UI Customizada sem MUI](#7-ui-customizada-sem-mui)
8. [Múltiplos Idiomas](#8-múltiplos-idiomas)
9. [Jest/Vitest (ESM + CJS)](#9-jestvitest-esm--cjs)

---

## 1. Next.js App Router (SSR)

### 🎯 Objetivo
Implementar consentimento LGPD em Next.js 14/15 com App Router, garantindo SSR-safe e bloqueio de scripts até consentimento.

### ✅ Pré-requisitos
- Next.js 14+ com App Router
- Node.js 20+
- Conta Google Analytics/GTM

### 📝 Passo a Passo

#### 1.1. Instalação

```bash
npm install react-lgpd-consent @mui/material @mui/icons-material @emotion/react @emotion/styled
```

#### 1.2. Variáveis de Ambiente

Crie `.env.local`:

```text
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

#### 1.3. Componente Client-Side

Crie `app/components/ClientConsent.tsx`:

```tsx
'use client'

import { ConsentProvider, ConsentScriptLoader, createGoogleAnalyticsIntegration, createGoogleTagManagerIntegration } from 'react-lgpd-consent'
import { useEffect } from 'react'

const integrations = [
  createGoogleAnalyticsIntegration({ measurementId: process.env.NEXT_PUBLIC_GA_ID! }),
  createGoogleTagManagerIntegration({ containerId: process.env.NEXT_PUBLIC_GTM_ID! })
]

export function ClientConsent({ children }: { children: React.ReactNode }) {
  return (
    <ConsentProvider
      categories={{
        enabledCategories: ['analytics', 'marketing', 'functional']
      }}
      cookieOptions={{
        domain: undefined, // ou '.seudominio.com.br' para subdomínios
        path: '/',
        maxAge: 365 * 24 * 60 * 60 // 1 ano
      }}
    >
      <ConsentScriptLoader integrations={integrations} />
      {children}
    </ConsentProvider>
  )
}
```

#### 1.4. Layout Root

Atualize `app/layout.tsx`:

```tsx
import { ClientConsent } from './components/ClientConsent'

export const metadata = {
  title: 'Minha App',
  description: 'Exemplo com Consent Mode v2'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <ClientConsent>
          {children}
        </ClientConsent>
      </body>
    </html>
  )
}
```

### ✨ Validação

```bash
npm run dev
```

1. Abra `http://localhost:3000`
2. Verifique se o banner aparece
3. Abra DevTools → Application → Cookies
4. Confirme que scripts GTM/GA4 **não carregam** antes do consentimento
5. Aceite cookies e verifique se scripts carregam

### 🔗 Referências
- [Exemplos completos](./examples/README.md)
- [QUICKSTART.md - Next.js App Router](./QUICKSTART.md#nextjs-1415-app-router-ssr-safe)

---

## 2. Configuração de Subdomínios

### 🎯 Objetivo
Compartilhar consentimento entre subdomínios (ex: `www.exemplo.com` e `blog.exemplo.com`).

### 📝 Passo a Passo

#### 2.1. Cookie Domain

Configure `cookieOptions.domain` com o domínio principal (prefixo `.`):

```tsx
<ConsentProvider
  categories={{ enabledCategories: ['analytics', 'marketing'] }}
  cookieOptions={{
    domain: '.exemplo.com.br', // ← Atenção ao ponto inicial
    path: '/',
    maxAge: 365 * 24 * 60 * 60
  }}
>
  {/* ... */}
</ConsentProvider>
```

#### 2.2. Cookie Name Consistente

Se usar nome customizado, garanta consistência:

```tsx
cookieOptions={{
  name: 'meu_consentimento_lgpd', // mesmo nome em todos os subdomínios
  domain: '.exemplo.com.br'
}}
```

#### 2.3. HTTPS Obrigatório

Para domínios em produção, sempre use `secure: true`:

```tsx
cookieOptions={{
  domain: '.exemplo.com.br',
  secure: true, // apenas HTTPS
  sameSite: 'Lax'
}}
```

### ✨ Validação

1. Acesse `www.exemplo.com.br` e aceite cookies
2. Abra DevTools → Application → Cookies
3. Confirme que o cookie tem `Domain=.exemplo.com.br`
4. Navegue para `blog.exemplo.com.br`
5. Verifique que o consentimento persiste (cookie compartilhado)

### ⚠️ Observações
- **Localhost**: não suporta subdomínios com `.` prefix; teste em staging
- **SameSite**: `Lax` é recomendado; evite `None` sem necessidade

### 🔗 Referências
- [MDN - Domain Cookie Attribute](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#define_where_cookies_are_sent)

---

## 3. Google Consent Mode v2

### 🎯 Objetivo
Implementar Google Consent Mode v2 para sincronizar sinais de consentimento com GTM/GA4.

### 📝 Passo a Passo

#### 3.1. Inicializar Consent Mode (Bootstrap)

Crie um componente para inicializar gtag **antes** de carregar scripts:

```tsx
'use client'

export function GtagConsentBootstrap() {
  useEffect(() => {
    if (globalThis.window) {
      globalThis.window.dataLayer = globalThis.window.dataLayer ?? []
      function gtag(...args: any[]) {
        if (typeof globalThis.window?.dataLayer?.push === 'function') {
          globalThis.window.dataLayer.push(args)
        }
      }

      // Inicializa Consent Mode v2 com tudo negado
      gtag('consent', 'default', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied',
        personalization_storage: 'denied',
        functionality_storage: 'denied',
        security_storage: 'granted' // sempre permitido
      })
    }
  }, [])

  return null
}
```

#### 3.2. Sincronizar com Preferências

Use `useConsent` para atualizar sinais quando o usuário consentir:

```tsx
'use client'

import { useConsent } from 'react-lgpd-consent'
import { useEffect } from 'react'

export function ConsentModeSync() {
  const { preferences, consented } = useConsent()

  useEffect(() => {
    if (!consented || !globalThis.window) return

    function gtag(...args: any[]) {
      globalThis.window.dataLayer = globalThis.window.dataLayer ?? []
      if (typeof globalThis.window.dataLayer?.push === 'function') {
        globalThis.window.dataLayer.push(args)
      }
    }

    gtag('consent', 'update', {
      ad_storage: preferences.marketing ? 'granted' : 'denied',
      ad_user_data: preferences.marketing ? 'granted' : 'denied',
      ad_personalization: preferences.marketing ? 'granted' : 'denied',
      analytics_storage: preferences.analytics ? 'granted' : 'denied',
      personalization_storage: preferences.functional ? 'granted' : 'denied',
      functionality_storage: preferences.functional ? 'granted' : 'denied'
    })
  }, [preferences, consented])

  return null
}
```

#### 3.3. Integração no Layout

```tsx
import { GtagConsentBootstrap } from './components/GtagConsentBootstrap'
import { ConsentModeSync } from './components/ConsentModeSync'
import { ClientConsent } from './components/ClientConsent'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <GtagConsentBootstrap /> {/* 1️⃣ Inicializa antes de tudo */}
      </head>
      <body>
        <ClientConsent>
          <ConsentModeSync /> {/* 2️⃣ Sincroniza updates */}
          {children}
        </ClientConsent>
      </body>
    </html>
  )
}
```

### ✨ Validação

1. Abra DevTools → Console
2. Execute: `globalThis.window?.dataLayer`
3. Verifique eventos `consent.default` e `consent.update`
4. No GTM Preview Mode, confirme que os sinais estão corretos

### 🔗 Referências
- [Google Consent Mode v2 Docs](https://developers.google.com/tag-platform/security/guides/consent)
- [Exemplo: examples/next-app-router/components/ClientConsent.tsx](./examples/next-app-router/components/ClientConsent.tsx)

---

## 4. Bump de Versão de Consentimento

### 🎯 Objetivo
Forçar usuários a reconsentir quando a política de privacidade mudar.

### 📝 Passo a Passo

#### 4.1. Versionar Cookie de Consentimento

Use a prop `cookieVersion` para versionar:

```tsx
<ConsentProvider
  categories={{ enabledCategories: ['analytics', 'marketing'] }}
  cookieVersion="2.0.0" // ← Incrementar quando política mudar
>
  {/* ... */}
</ConsentProvider>
```

#### 4.2. Lógica de Invalidação

A biblioteca automaticamente invalida cookies com versão diferente:

```tsx
// Versão atual no código: 2.0.0
// Cookie do usuário: version: "1.0.0"
// Resultado: banner reaparece solicitando novo consentimento
```

#### 4.3. Histórico de Versões

Mantenha um registro:

```tsx
// versions.ts
export const CONSENT_VERSIONS = {
  '1.0.0': '01/01/2024 - Política inicial',
  '1.1.0': '15/03/2024 - Adicionado Hotjar',
  '2.0.0': '01/12/2024 - Nova política LGPD' // ← Atual
}

export const CURRENT_VERSION = '2.0.0'
```

```tsx
import { CURRENT_VERSION } from './versions'

<ConsentProvider cookieVersion={CURRENT_VERSION} {...props}>
  {children}
</ConsentProvider>
```

#### 4.4. Avisar Usuário sobre Mudança

Customize o banner para informar sobre mudanças:

```tsx
<ConsentProvider
  categories={{ enabledCategories: ['analytics', 'marketing'] }}
  cookieVersion="2.0.0"
  customTexts={{
    banner: {
      title: '🔄 Política de Privacidade Atualizada',
      message: 'Atualizamos nossa política de privacidade. Por favor, revise suas preferências de cookies.',
      acceptButton: 'Aceitar nova política',
      rejectButton: 'Revisar opções'
    }
  }}
>
  {/* ... */}
</ConsentProvider>
```

### ✨ Validação

1. Defina `cookieVersion="1.0.0"` e aceite cookies
2. Abra DevTools → Application → Cookies
3. Confirme que `version` no cookie é `"1.0.0"`
4. Altere código para `cookieVersion="2.0.0"`
5. Recarregue página
6. Banner deve reaparecer solicitando novo consentimento

### ⚠️ Observações
- **SemVer**: use versionamento semântico (major.minor.patch)
- **Breaking Changes**: apenas major bumps (2.0.0 → 3.0.0) invalidam completamente
- **Auditoria**: o cookie mantém `consentDate` e `lastUpdate` para auditoria

### 🔗 Referências
- [CONFORMIDADE.md - Auditoria](./CONFORMIDADE.md)

---

## 5. Content Security Policy (CSP) e Nonce

### 🎯 Objetivo
Implementar CSP rigoroso permitindo apenas scripts autorizados via nonce.

### 📝 Passo a Passo

#### 5.1. Gerar Nonce no Servidor (Next.js)

Crie middleware para gerar nonce único por request:

```tsx
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import crypto from 'crypto'

export function middleware(request: NextRequest) {
  const nonce = crypto.randomBytes(16).toString('base64')
  const response = NextResponse.next()

  response.headers.set(
    'Content-Security-Policy',
    `script-src 'self' 'nonce-${nonce}' https://www.googletagmanager.com https://www.google-analytics.com; object-src 'none'; base-uri 'self';`
  )
  
  response.headers.set('x-nonce', nonce)
  
  return response
}
```

#### 5.2. Injetar Nonce no Layout

```tsx
// app/layout.tsx
import { headers } from 'next/headers'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers()
  const nonce = headersList.get('x-nonce') || ''

  return (
    <html lang="pt-BR">
      <body>
        <ClientConsent nonce={nonce}>
          {children}
        </ClientConsent>
      </body>
    </html>
  )
}
```

#### 5.3. Passar Nonce para Scripts

Atualize `ConsentScriptLoader` para aceitar nonce:

```tsx
'use client'

import { ConsentScriptLoader } from 'react-lgpd-consent'

export function ClientConsent({ nonce, children }: { nonce: string; children: React.ReactNode }) {
  return (
    <ConsentProvider {...}>
      <ConsentScriptLoader 
        integrations={integrations}
        scriptAttributes={{ nonce }} // ← Propaga nonce para scripts
      />
      {children}
    </ConsentProvider>
  )
}
```

#### 5.4. Validar CSP Header

Verifique se o header está correto:

```tsx
// app/api/csp-report/route.ts
export async function POST(request: Request) {
  const report = await request.json()
  console.error('CSP Violation:', report)
  return new Response('OK', { status: 200 })
}
```

Adicione ao CSP:

```
Content-Security-Policy: ... report-uri /api/csp-report
```

### ✨ Validação

1. Abra DevTools → Console
2. Verifique se **não há** erros de CSP
3. Confirme que scripts GTM/GA4 carregam com `nonce` attribute
4. Teste bloqueio: remova nonce de um script e confirme erro CSP

### ⚠️ Observações
- **Nonce**: deve ser único por request (não reutilizar)
- **SSR**: nonce deve ser gerado no servidor, nunca no client
- **Inline Scripts**: sempre use nonce para scripts inline
- **Hashes**: alternativa a nonce para scripts estáticos

### 🔗 Referências
- [MDN - Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Next.js - Nonce](https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy)

---

## 6. Vite + React SPA

### 🎯 Objetivo
Implementar consentimento LGPD em SPA Vite + React.

### 📝 Passo a Passo

#### 6.1. Instalação

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install react-lgpd-consent @mui/material @mui/icons-material @emotion/react @emotion/styled
```

#### 6.2. Variáveis de Ambiente

Crie `.env`:

```text
VITE_GA_ID=G-XXXXXXXXXX
VITE_GTM_ID=GTM-XXXXXXX
```

#### 6.3. Main Entry Point

Atualize `src/main.tsx`:

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ConsentProvider, ConsentScriptLoader, createGoogleAnalyticsIntegration } from 'react-lgpd-consent'

const integrations = [
  createGoogleAnalyticsIntegration({ 
    measurementId: import.meta.env.VITE_GA_ID 
  })
]

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConsentProvider
      categories={{ enabledCategories: ['analytics', 'marketing'] }}
    >
      <ConsentScriptLoader integrations={integrations} />
      <App />
    </ConsentProvider>
  </React.StrictMode>
)
```

#### 6.4. App Component

```tsx
// src/App.tsx
import { useConsent } from 'react-lgpd-consent'

function App() {
  const { consented, preferences, openPreferences } = useConsent()

  return (
    <div>
      <h1>Minha SPA com LGPD</h1>
      <p>Status: {consented ? '✅ Consentido' : '❌ Aguardando'}</p>
      <button onClick={openPreferences}>Preferências</button>
    </div>
  )
}

export default App
```

### ✨ Validação

```bash
npm run dev
```

1. Abra `http://localhost:5173`
2. Verifique banner de consentimento
3. Confirme que GA4 não carrega antes do consentimento
4. Aceite cookies e valide carga de scripts

### 🔗 Referências
- [Exemplos completos](./examples/README.md)

---

## 7. UI Customizada sem MUI

### 🎯 Objetivo
Criar UI de consentimento personalizada usando apenas `@react-lgpd-consent/core` (headless).

### 📝 Passo a Passo

#### 7.1. Instalação (Core Only)

```bash
npm install @react-lgpd-consent/core
```

#### 7.2. Provider Headless

```tsx
import { ConsentProvider } from '@react-lgpd-consent/core'

function App() {
  return (
    <ConsentProvider
      categories={{ enabledCategories: ['analytics', 'marketing'] }}
      disableDefaultUI={true} // ← Desabilita UI padrão
    >
      <CustomBanner />
      <YourApp />
    </ConsentProvider>
  )
}
```

#### 7.3. Banner Customizado

```tsx
import { useConsent } from '@react-lgpd-consent/core'
import './CustomBanner.css'

export function CustomBanner() {
  const { consented, acceptAll, rejectAll, openPreferences } = useConsent()

  if (consented) return null

  return (
    <div className="custom-banner">
      <p>🍪 Este site usa cookies. Aceita?</p>
      <button onClick={acceptAll}>Aceitar Tudo</button>
      <button onClick={rejectAll}>Recusar</button>
      <button onClick={openPreferences}>Personalizar</button>
    </div>
  )
}
```

#### 7.4. Modal de Preferências

```tsx
import { useConsent, useCategories } from '@react-lgpd-consent/core'

export function CustomPreferencesModal() {
  const { isPreferencesOpen, closePreferences, updatePreferences, preferences } = useConsent()
  const categories = useCategories()

  if (!isPreferencesOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Preferências de Cookies</h2>
        {categories.map(cat => (
          <label key={cat.id}>
            <input
              type="checkbox"
              checked={preferences[cat.id] || false}
              disabled={cat.essential}
              onChange={(e) => updatePreferences({ [cat.id]: e.target.checked })}
            />
            {cat.name}
          </label>
        ))}
        <button onClick={closePreferences}>Salvar</button>
      </div>
    </div>
  )
}
```

### ✨ Validação

1. Verifique que nenhum componente MUI é carregado
2. Confirme bundle size menor (~86KB vs ~104KB)
3. Teste todos os fluxos (aceitar/recusar/personalizar)

### 🔗 Referências
- [packages/core/README.md](../packages/core/README.md)
- [ARCHITECTURE.md - Headless Core](./ARCHITECTURE.md)

---

## 8. Múltiplos Idiomas

### 🎯 Objetivo
Implementar consentimento com suporte a múltiplos idiomas (pt-BR, en-US, es-ES).

### 📝 Passo a Passo

#### 8.1. Criar Traduções

```tsx
// translations.ts
export const translations = {
  'pt-BR': {
    banner: {
      title: 'Este site usa cookies',
      message: 'Usamos cookies para melhorar sua experiência. Aceita?',
      acceptButton: 'Aceitar Tudo',
      rejectButton: 'Recusar'
    },
    categories: {
      necessary: { name: 'Necessários', description: 'Essenciais para funcionamento' },
      analytics: { name: 'Analíticos', description: 'Análise de uso' },
      marketing: { name: 'Marketing', description: 'Publicidade personalizada' }
    }
  },
  'en-US': {
    banner: {
      title: 'This website uses cookies',
      message: 'We use cookies to improve your experience. Accept?',
      acceptButton: 'Accept All',
      rejectButton: 'Reject'
    },
    categories: {
      necessary: { name: 'Necessary', description: 'Essential for operation' },
      analytics: { name: 'Analytics', description: 'Usage analysis' },
      marketing: { name: 'Marketing', description: 'Personalized advertising' }
    }
  }
}
```

#### 8.2. Hook de Idioma

```tsx
// useLocale.ts
import { useState, useEffect } from 'react'

export function useLocale() {
  const [locale, setLocale] = useState<'pt-BR' | 'en-US'>('pt-BR')

  useEffect(() => {
    const browserLang = navigator.language
    if (browserLang.startsWith('en')) setLocale('en-US')
    else if (browserLang.startsWith('pt')) setLocale('pt-BR')
  }, [])

  return { locale, setLocale }
}
```

#### 8.3. Provider com i18n

```tsx
import { ConsentProvider } from 'react-lgpd-consent'
import { translations } from './translations'
import { useLocale } from './useLocale'

export function App() {
  const { locale, setLocale } = useLocale()
  const texts = translations[locale]

  return (
    <ConsentProvider
      categories={{
        enabledCategories: ['analytics', 'marketing'],
        customCategories: [
          { id: 'analytics', ...texts.categories.analytics },
          { id: 'marketing', ...texts.categories.marketing }
        ]
      }}
      texts={texts}
    >
      <button onClick={() => setLocale(locale === 'pt-BR' ? 'en-US' : 'pt-BR')}>
        {locale === 'pt-BR' ? '🇺🇸 English' : '🇧🇷 Português'}
      </button>
      {/* App */}
    </ConsentProvider>
  )
}
```

#### 8.4. Troca de idioma em runtime (Provider)

```tsx
import { ConsentProvider, EXPANDED_DEFAULT_TEXTS } from 'react-lgpd-consent'

<ConsentProvider
  categories={{ enabledCategories: ['analytics'] }}
  texts={EXPANDED_DEFAULT_TEXTS}
  language={locale === 'en-US' ? 'en' : 'pt'}
>
  {/* App */}
</ConsentProvider>
```

#### 8.5. Override local por componente

```tsx
<CookieBanner
  debug
  texts={{ bannerMessage: 'We use cookies', policyLink: 'Learn more' }}
  language="en"
/>
```

### ✨ Validação

1. Acesse app e verifique idioma inicial (detecção automática)
2. Troque idioma via botão
3. Confirme que textos do banner/modal mudam
4. Verifique que nomes de categorias são traduzidos

### 🔗 Referências
- [API.md - Textos Customizados](./packages/react-lgpd-consent/API.md)

---

## 9. Jest/Vitest (ESM + CJS)

### 🎯 Objetivo
Evitar falhas em Jest CJS ao importar pacotes ESM publicados como dual build.

### ✅ Pré-requisitos
- Jest 29+ ou Vitest 1+
- Babel ou ts-jest configurado

### 🧪 Jest com babel-jest (CJS)

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

### 🧪 Jest com ts-jest (CJS)

```js
// jest.config.cjs
module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(t|j)sx?$': ['ts-jest', { tsconfig: 'tsconfig.json', useESM: false }],
  },
  transformIgnorePatterns: ['/node_modules/(?!react-lgpd-consent|@react-lgpd-consent)/'],
}
```

### ⚡ Vitest (Vite)

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

### ✅ Importações recomendadas

```ts
import { ConsentProvider } from 'react-lgpd-consent'
import { createGoogleAnalyticsIntegration } from 'react-lgpd-consent/integrations'
import { ConsentProvider as ConsentProviderHeadless } from 'react-lgpd-consent/core'
```

### 🔗 Referências
- [API.md - Exports](./packages/react-lgpd-consent/API.md)

---

## 🔗 Links Úteis

- [QUICKSTART.md](./QUICKSTART.md) - Início rápido geral
- [INTEGRACOES.md](./packages/react-lgpd-consent/INTEGRACOES.md) - Integrações nativas
- [CONFORMIDADE.md](./CONFORMIDADE.md) - Conformidade LGPD
- [API.md](./packages/react-lgpd-consent/API.md) - Referência completa da API
- [Examples](./examples/README.md) - Projetos completos

---

## 🆘 Problemas?

Se encontrar dificuldades, consulte:

- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- [Issues no GitHub](https://github.com/lucianoedipo/react-lgpd-consent/issues)

---

**Última atualização**: 01/12/2025
