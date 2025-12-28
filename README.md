# react-lgpd-consent 🍪

> Biblioteca React modular para gerenciamento de consentimento LGPD/GDPR

[![npm version](https://img.shields.io/npm/v/react-lgpd-consent.svg)](https://www.npmjs.com/package/react-lgpd-consent)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![React 19 Ready](https://img.shields.io/badge/React%2019-StrictMode%20Ready-61dafb.svg)](./REACT19-STRICTMODE.md)
[![Coverage](https://img.shields.io/codecov/c/github/lucianoedipo/react-lgpd-consent?style=for-the-badge&logo=codecov&logoColor=white)](https://codecov.io/gh/lucianoedipo/react-lgpd-consent)

**Documentação**: https://lucianoedipo.github.io/react-lgpd-consent  
**Storybook**: https://lucianoedipo.github.io/react-lgpd-consent/storybook

---

## 📦 Pacotes

Este é um **monorepo** que contém 3 pacotes publicados no npm:

### [@react-lgpd-consent/core](packages/core/README.md)

[![npm](https://img.shields.io/npm/v/@react-lgpd-consent/core.svg)](https://www.npmjs.com/package/@react-lgpd-consent/core)

**Headless** (sem UI) - Context, hooks e lógica de consentimento.

```bash
npm install @react-lgpd-consent/core
```

**Para quem?** Desenvolvedores que querem **criar sua própria UI** personalizada.

- ✅ Gerenciamento de estado de consentimento
- ✅ Hooks React (`useConsent`, `useConsentCategory`)
- ✅ Utilidades de cookies e localStorage
- ✅ SSR-safe (Next.js, Remix)
- ✅ Tree-shakeable
- 📦 **~86 KB** (gzipped)

---

### [@react-lgpd-consent/mui](packages/mui/README.md)

[![npm](https://img.shields.io/npm/v/@react-lgpd-consent/mui.svg)](https://www.npmjs.com/package/@react-lgpd-consent/mui)

**Componentes Material-UI** prontos para uso.

```bash
npm install @react-lgpd-consent/mui @mui/material @emotion/react @emotion/styled
```

**Para quem?** Desenvolvedores que já usam **Material-UI** e querem UI pronta.

- ✅ `CookieBanner` - Banner de consentimento customizável
- ✅ `PreferencesModal` - Modal de preferências de cookies
- ✅ `FloatingPreferencesButton` - Botão flutuante para reabrir modal
- ✅ Suporte a temas MUI
- ✅ Totalmente acessível (ARIA, keyboard navigation)
- 📦 **~104 KB** (gzipped, inclui core)

---

### [react-lgpd-consent](packages/react-lgpd-consent/README.md) ⭐ **Recomendado**

[![npm](https://img.shields.io/npm/v/react-lgpd-consent.svg)](https://www.npmjs.com/package/react-lgpd-consent)

**Pacote agregador** - Re-exporta tudo do `@react-lgpd-consent/mui` (melhor DX).

```bash
npm install react-lgpd-consent @mui/material @emotion/react @emotion/styled
```

**Para quem?** Quem quer a **experiência completa** com setup mínimo.

- ✅ Tudo do `@react-lgpd-consent/mui` + `@react-lgpd-consent/core`
- ✅ Compatibilidade retroativa (v0.4.x → v0.5.x)
- ✅ Import único, sem config extra
- 📦 **~104 KB** (gzipped)

---

## 🚀 Início Rápido

### Instalação

```bash
npm install react-lgpd-consent @mui/material @emotion/react @emotion/styled
```

### Uso Básico

```tsx
import { ConsentProvider } from 'react-lgpd-consent'

function App() {
  return (
    <ConsentProvider
      categories={{
        enabledCategories: ['analytics', 'marketing']
      }}
    >
      <YourApp />
    </ConsentProvider>
  )
}
```

---

## 🧪 Testes (Jest/Vitest) e ESM/CJS

Este projeto publica **dual build** (ESM + CJS). Se o seu runner Jest estiver em CJS,
é necessário transformar os pacotes `react-lgpd-consent` e `@react-lgpd-consent/*`.

### Exemplo mínimo (Jest + babel-jest)

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

### Exemplo mínimo (Vitest)

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

Mais detalhes e variações em **[RECIPES.md](./RECIPES.md)**.

---

## 🆕 Novidades v0.7.0

### Callbacks de Lifecycle

Monitore eventos de consentimento para auditoria e compliance:

```tsx
<ConsentProvider
  categories={{ enabledCategories: ['analytics'] }}
  onConsentInit={(state) => console.log('Inicializado:', state)}
  onConsentChange={(current, previous) => {
    console.log('Mudança detectada:', { current, previous })
  }}
  onAuditLog={(entry) => {
    // Enviar para backend de compliance
    fetch('/api/audit', { method: 'POST', body: JSON.stringify(entry) })
  }}
>
  <YourApp />
</ConsentProvider>
```

### Presets ANPD de Categorias

Configurações pré-validadas conforme diretrizes da ANPD:

```tsx
import { createAnpdCategories } from 'react-lgpd-consent'

const categories = createAnpdCategories({
  include: ['analytics', 'marketing', 'functional']
})

<ConsentProvider categories={categories}>
  <YourApp />
</ConsentProvider>
```

### Auditoria de Consentimento

Crie entradas de auditoria para compliance:

```tsx
import { createConsentAuditEntry } from 'react-lgpd-consent'

const audit = createConsentAuditEntry(
  { consented: true, preferences: { analytics: true } },
  { action: 'update', consentVersion: '1' }
)
```

📖 **Veja mais:** [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) | [API.md](./packages/react-lgpd-consent/API.md)

---

## 📚 Documentação

- **[🚀 Quickstart](./QUICKSTART.md)**: Tutorial passo-a-passo
- **[📖 Receitas](./RECIPES.md)**: Guia prático com casos de uso comuns (Next.js, CSP, Consent Mode v2)
- **[🔧 Troubleshooting](./TROUBLESHOOTING.md)**: Soluções para problemas comuns
- **[⚙️ Workflows CI/CD](./WORKFLOWS.md)**: Documentação dos workflows de release e deploy
- **[React 19 StrictMode](./REACT19-STRICTMODE.md)**: Compatibilidade e idempotência de efeitos
- **[Versionamento e Release](./VERSIONING.md)**: Guia de Changesets e Turborepo
- **[API Reference](./packages/react-lgpd-consent/API.md)**: Referência completa
- **[Conformidade LGPD](./CONFORMIDADE.md)**: Compliance e auditoria
- **[Integrações](./packages/react-lgpd-consent/INTEGRACOES.md)**: GA4, GTM, Facebook Pixel
- **[Arquitetura](./ARCHITECTURE.md)**: Detalhes do monorepo v0.5.0
- **[Migração v0.4.x → v0.5.0](./MIGRATION.md)**: Guia de migração
- **[Changelog](./packages/react-lgpd-consent/CHANGELOG.md)**: Histórico de versões

### 🎨 Documentação Interativa (GitHub Pages)

- **[📖 Storybook](https://lucianoedipo.github.io/react-lgpd-consent/storybook/)**: Playground interativo
- **[⚙️ TypeDoc](https://lucianoedipo.github.io/react-lgpd-consent/docs/)**: API Reference
- **[🏠 Portal](https://lucianoedipo.github.io/react-lgpd-consent/)**: Navegação central

---

## 🤝 Como Contribuir

1. Abra uma [Issue](https://github.com/lucianoedipo/react-lgpd-consent/issues) para bugs ou melhorias.
2. Siga o Guia de Desenvolvimento em `DEVELOPMENT.md` para enviar um PR.

---

## 📝 Licença

MIT © [Luciano Edipo](https://github.com/lucianoedipo)

---

<div align="center">
  <p>Feito com ❤️ • Se ajudou, deixe uma ⭐ no <a href="https://github.com/lucianoedipo/react-lgpd-consent">GitHub</a>!</p>
</div>
