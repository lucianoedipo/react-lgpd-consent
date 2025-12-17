<!-- Package README for the `react-lgpd-consent` aggregator package -->
# react-lgpd-consent 🍪

Gerenciamento de consentimento de cookies em conformidade com a LGPD — pacote agregador que re-exporta os componentes MUI por conveniência. Se você precisa só da lógica headless ou de um bundle menor, prefira `@react-lgpd-consent/core` ou `@react-lgpd-consent/mui` conforme o seu caso.

<!-- Badges (mantidos) -->
[![NPM Version](https://img.shields.io/npm/v/react-lgpd-consent?style=for-the-badge&logo=npm&color=cb3837&logoColor=white)](https://www.npmjs.com/package/react-lgpd-consent)
[![Downloads](https://img.shields.io/npm/dm/react-lgpd-consent?style=for-the-badge&logo=npm&color=ff6b35&logoColor=white)](https://www.npmjs.com/package/react-lgpd-consent)
[![License](https://img.shields.io/npm/l/react-lgpd-consent?style=for-the-badge&color=green&logoColor=white)](https://github.com/lucianoedipo/react-lgpd-consent/blob/main/LICENSE)
[![Coverage](https://img.shields.io/codecov/c/github/lucianoedipo/react-lgpd-consent?style=for-the-badge&logo=codecov&logoColor=white)](https://codecov.io/gh/lucianoedipo/react-lgpd-consent)

---

## Descrição

`react-lgpd-consent` é o pacote agregador compatível com versões anteriores (v0.4.x → v0.5.x). Ele re-exporta os componentes prontos em MUI e facilita a migração. Para projetos mais otimizados, considere importar diretamente `@react-lgpd-consent/core` (headless) ou `@react-lgpd-consent/mui/ui` (apenas UI, sem re-export do core).

Principais características:

- Banner de cookies, modal de preferências e botão flutuante prontos (MUI)
- Carregamento condicional de scripts com base no consentimento
- SSR-safe (compatível com Next.js / Remix)
- Eventos auditáveis (consent_initialized, consent_updated)

---

## Instalação

Instale o pacote e as peer-dependencies se necessário:

```powershell
npm install react-lgpd-consent
npm install react react-dom @mui/material @emotion/react @emotion/styled js-cookie --save-peer
```

Observação: `react-lgpd-consent` é o agregador (re-exporta `@react-lgpd-consent/mui`). Para otimizar bundle, importe apenas o pacote que você precisa.

---

## Início rápido

Exemplo mínimo (mantém compatibilidade com v0.4.x):

```tsx
import React from 'react'
import { ConsentProvider, useConsent } from 'react-lgpd-consent'

export default function App() {
  return (
    <ConsentProvider categories={{ enabledCategories: ['analytics', 'marketing'] }}>
      <YourApp />
    </ConsentProvider>
  )
}

function YourApp() {
  const { preferences, acceptCategory } = useConsent()

  return (
    <div>
      <button onClick={() => acceptCategory('marketing')}>Aceitar Marketing</button>
    </div>
  )
}
```

Para carregar scripts condicionados ao consentimento:

```tsx
import { ConsentScriptLoader } from 'react-lgpd-consent'

function Analytics() {
  return (
    <ConsentScriptLoader
      category="analytics"
      src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
      strategy="afterInteractive"
    >
      {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'GA_MEASUREMENT_ID');`}
    </ConsentScriptLoader>
  )
}
```

---

## 🆕 Novidades v0.7.0

### Callbacks de Lifecycle (#68)

```tsx
<ConsentProvider
  onConsentInit={(state) => console.log('Init:', state)}
  onConsentChange={(current, prev) => console.log('Changed:', current)}
  onAuditLog={(entry) => fetch('/api/audit', {
    method: 'POST',
    body: JSON.stringify(entry)
  })}
>
```

### Presets ANPD (#70)

```tsx
import { createAnpdCategories } from 'react-lgpd-consent'

const categories = createAnpdCategories({
  include: ['analytics', 'marketing']
})
```

### Auditoria (#60)

```tsx
import { createConsentAuditEntry } from 'react-lgpd-consent'

const audit = createConsentAuditEntry(state, {
  action: 'update',
  consentVersion: '1'
})
```

📖 **Documentação completa:** [API.md](./API.md) | [TROUBLESHOOTING.md](../../TROUBLESHOOTING.md)

---

## Pacotes (monorepo v0.5.x)

| Pacote | Descrição |
|---|---|
| `@react-lgpd-consent/core` | Lógica headless (sem UI) — recomendado para UI customizada |
| `@react-lgpd-consent/mui` | Componentes prontos em MUI |
| `react-lgpd-consent` | Agregador (re-exporta MUI) — compatibilidade retroativa |

---

## Documentação e exemplos

- Quickstart: `QUICKSTART.md` (tutoriais e exemplos) — veja no repositório
- API Reference: `API.md`
- Integrações: `INTEGRACOES.md`
- Storybook: https://lucianoedipo.github.io/react-lgpd-consent/storybook/
- TypeDoc: https://lucianoedipo.github.io/react-lgpd-consent/docs/

---

## Contribuindo

Leia `DEVELOPMENT.md` no repositório principal. Fluxo sugerido:

1. Fork
2. Branch: `git checkout -b feat/minha-feature`
3. Commit: `git commit -m "feat: descrição"`
4. Push e abra PR

Antes de criar PR execute a pipeline local sugerida:

```powershell
npm run type-check
npm test
npm run lint
npm run build
npm run docs:generate
```

---

## Licença

MIT © Luciano Edipo — veja o arquivo `LICENSE`.

---

If you prefer the English version of the README, consult `README.en.md` in the same package.
