<!-- English README for the `react-lgpd-consent` aggregator package -->
# react-lgpd-consent 🍪

LGPD-compliant cookie consent management for React — this package is the aggregator that re-exports the MUI components for backwards compatibility. If you need a smaller bundle or headless API, prefer `@react-lgpd-consent/core` or `@react-lgpd-consent/mui`.

<!-- Badges -->
[![NPM Version](https://img.shields.io/npm/v/react-lgpd-consent?style=for-the-badge&logo=npm&color=cb3837&logoColor=white)](https://www.npmjs.com/package/react-lgpd-consent)
[![Downloads](https://img.shields.io/npm/dm/react-lgpd-consent?style=for-the-badge&logo=npm&color=ff6b35&logoColor=white)](https://www.npmjs.com/package/react-lgpd-consent)
[![License](https://img.shields.io/npm/l/react-lgpd-consent?style=for-the-badge&color=green&logoColor=white)](https://github.com/lucianoedipo/react-lgpd-consent/blob/main/LICENSE)

---

## Overview

`react-lgpd-consent` is the compatibility aggregator for the v0.5.x monorepo. It re-exports the ready-made MUI components and keeps the API compatible with previous releases. If you want to optimize your bundle, import only `@react-lgpd-consent/core` (headless) or `@react-lgpd-consent/mui/ui` (MUI components only).

Key features:

- Cookie banner, preferences modal and floating button (MUI)
- Conditional script loading based on consent
- SSR-safe (Next.js / Remix compatible)
- Auditable events (consent_initialized, consent_updated)

---

## Installation

Install the package and peer dependencies:

```powershell
npm install react-lgpd-consent
# ensure peer deps are present in the host app
npm install react react-dom @mui/material @emotion/react @emotion/styled js-cookie --save-peer
```

This package re-exports `@react-lgpd-consent/mui` for compatibility. Import only what you need to reduce bundle size.

---

## Quick Start

Minimal example (API compatible with v0.4.x):

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
  const { preferences, setPreference } = useConsent()

  return (
    <div>
      <button onClick={() => setPreference('marketing', true)}>Accept Marketing</button>
    </div>
  )
}
```

Load a script only if the user granted the related category:

```tsx
import { ConsentScriptLoader, COMMON_INTEGRATIONS } from 'react-lgpd-consent'

function Analytics() {
  return (
    <ConsentScriptLoader
      integrations={[
        COMMON_INTEGRATIONS.googleAnalytics({ measurementId: 'GA_MEASUREMENT_ID' }),
      ]}
    />
  )
}
```

---

## 🆕 What's New in v0.7.0

### Lifecycle Callbacks (#68)

```tsx
<ConsentProvider
  onConsentInit={(state) => console.log('Initialized:', state)}
  onConsentChange={(current, prev) => console.log('Changed:', current)}
  onAuditLog={(entry) => fetch('/api/audit', {
    method: 'POST',
    body: JSON.stringify(entry)
  })}
>
```

### ANPD Category Presets (#70)

```tsx
import { createAnpdCategoriesConfig } from 'react-lgpd-consent'

const categories = createAnpdCategoriesConfig({
  include: ['analytics', 'marketing']
})
```

### Consent Audit (#60)

```tsx
import { createConsentAuditEntry } from 'react-lgpd-consent'

const audit = createConsentAuditEntry(state, {
  action: 'update',
  consentVersion: '1'
})
```

📖 **Full documentation:** [API.md](./API.md) | [TROUBLESHOOTING.md](../../TROUBLESHOOTING.md)

---

## Packages (monorepo)

| Package | Description |
|---|---|
| `@react-lgpd-consent/core` | Headless logic (no UI) — build your own UI |
| `@react-lgpd-consent/mui` | Ready-to-use MUI components |
| `react-lgpd-consent` | Aggregator (re-exports MUI) — backward compatibility |

---

## Documentation & Examples

- **[🚀 Quickstart](../../QUICKSTART.en.md)** - Step-by-step tutorial
- **[📖 Recipes](../../RECIPES.md)** - Practical guide with common use cases (Next.js, CSP, Consent Mode v2)
- **[⚙️ Workflows](../../WORKFLOWS.md)** - CI/CD workflows documentation
- **[API Reference](./API.md)** - Complete API reference
- **[Integrations](./INTEGRACOES.md)** - GA4, GTM, Facebook Pixel
- **[Storybook](https://lucianoedipo.github.io/react-lgpd-consent/storybook/)** - Interactive components
- **[TypeDoc](https://lucianoedipo.github.io/react-lgpd-consent/docs/)** - Generated API docs

---

## Contributing

Follow `DEVELOPMENT.md` in the repo. Suggested flow:

1. Fork
2. Branch: `git checkout -b feat/my-feature`
3. Commit: `git commit -m "feat: description"`
4. Push and open a PR

Before opening PR run the local pipeline:

```powershell
npm run type-check
npm test
npm run lint
npm run build
npm run docs:generate
```

---

## License

MIT © Luciano Edipo — see the `LICENSE` file.

---

If you want the Portuguese README, see `README.md` in the same package.
