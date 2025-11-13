# react-lgpd-consent 🍪

> Biblioteca React modular para gerenciamento de consentimento LGPD/GDPR

[![npm version](https://img.shields.io/npm/v/react-lgpd-consent.svg)](https://www.npmjs.com/package/react-lgpd-consent)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Coverage](https://img.shields.io/codecov/c/github/lucianoedipo/react-lgpd-consent?style=for-the-badge&logo=codecov&logoColor=white)](https://codecov.io/gh/lucianoedipo/react-lgpd-consent)

**Documentação**: https://lucianoedipo.github.io/react-lgpd-consent  
**Storybook**: https://lucianoedipo.github.io/react-lgpd-consent/storybook

---

## 📦 Pacotes

Este é um **monorepo** que contém 3 pacotes publicados no npm:

### [@react-lgpd-consent/core](packages/core)

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

### [@react-lgpd-consent/mui](packages/mui)

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

### [react-lgpd-consent](packages/react-lgpd-consent) ⭐ **Recomendado**

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

## 📚 Documentação

- **[Quickstart](./QUICKSTART.md)**: Tutorial passo-a-passo
- **[Troubleshooting](./TROUBLESHOOTING.md)**: Soluções para problemas comuns
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
