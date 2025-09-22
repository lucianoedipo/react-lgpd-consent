<div align="center">
  <h1>react-lgpd-consent 🍪</h1>
  <p><strong>A React library for cookie consent management compliant with Brazil's LGPD.</strong></p>

  <div>
    <a href="https://www.npmjs.com/package/react-lgpd-consent"><img src="https://img.shields.io/npm/v/react-lgpd-consent?style=for-the-badge&logo=npm&color=cb3837&logoColor=white" alt="NPM Version"></a>
    <a href="https://www.npmjs.com/package/react-lgpd-consent"><img src="https://img.shields.io/npm/dm/react-lgpd-consent?style=for-the-badge&logo=npm&color=ff6b35&logoColor=white" alt="Downloads"></a>
    <a href="https://github.com/lucianoedipo/react-lgpd-consent/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/react-lgpd-consent?style=for-the-badge&color=green&logoColor=white" alt="License"></a>
  <a href="https://lucianoedipo.github.io/react-lgpd-consent/storybook/"><img src="https://img.shields.io/badge/Storybook-Playground-ff4785?style=for-the-badge&logo=storybook&logoColor=white" alt="Storybook"></a>
  </div>

  <div>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-Ready-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript Ready"></a>
    <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-18+-61dafb?style=for-the-badge&logo=react&logoColor=white" alt="React 18+"></a>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-Compatible-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js Compatible"></a>
  </div>

  <br />

  <p>
    <a href="#installation"><strong>Installation</strong></a> •
    <a href="#basic-usage"><strong>Basic Usage</strong></a> •
    <a href="./QUICKSTART.md"><strong>📚 Quickstart</strong></a> •
    <a href="#documentation"><strong>Documentation</strong></a> •
    <a href="#contributing"><strong>Contributing</strong></a>
  </p>

  <p align="center">
  <a href="./QUICKSTART.en.md"><img src="https://img.shields.io/badge/Quickstart-Get%20Started-blue?style=for-the-badge&logo=book" alt="Quickstart"></a>
  </p>

  <p align="center"><strong>Start here:</strong> follow the <a href="./QUICKSTART.en.md">Quickstart guide (QUICKSTART.en.md)</a> for step-by-step setup, TypeScript examples, props summary and MUI integration — recommended for new users.</p>
</div>

---

## 🚀 Installation

```bash
npm install react-lgpd-consent @mui/material @emotion/react @emotion/styled js-cookie
```

**Peer dependencies:** `react`, `react-dom`, `@mui/material` and `js-cookie`.

---

## 📖 Basic Usage

Wrap your app with `ConsentProvider` (minimal example):

```tsx
import { ConsentProvider } from 'react-lgpd-consent'

export default function App() {
  return (
    <ConsentProvider categories={{ enabledCategories: ['analytics'] }}>
      <YourApp />
    </ConsentProvider>
  )
}
```

- For full guides, TypeScript examples, props table and integrations see:
-
- **[QUICKSTART.en.md](./QUICKSTART.en.md)** (recommended)
  - New in v0.4.0: `customCategories` support — see the “Custom categories (customCategories)” section in the Quickstart.
  - New in v0.4.1: native integrations for Facebook Pixel, Hotjar, Mixpanel, Clarity, Intercom, and Zendesk — see [INTEGRACOES.md](./INTEGRACOES.md).
  - Tip: set `designTokens.layout.backdrop: 'auto'` for a theme-aware blocking banner backdrop.
  - Auto-config of categories: the library detects required categories from integrations and surfaces toggles even if you forgot to enable them (initial value is always rejected). We still recommend explicitly listing them in `categories.enabledCategories` for clarity.
  - Non-blocked Policy/Terms pages: if `policyLinkUrl` and/or `termsLinkUrl` point to the current page, the blocking overlay is not applied — ensuring readability of these pages.
- **[Docs / API](./API.md)**
- **[LGPD Compliance](./CONFORMIDADE.md)**
- **[Integrations](./INTEGRACOES.md)**

### 🎨 Interactive Documentation (GitHub Pages)
- **[📖 Storybook - Interactive Playground](https://lucianoedipo.github.io/react-lgpd-consent/storybook/)**: Explore and test all components live with interactive controls.
- **[⚙️ TypeDoc - API Reference](https://lucianoedipo.github.io/react-lgpd-consent/docs/)**: Automatically generated complete API documentation.
- **[🏠 Documentation Portal](https://lucianoedipo.github.io/react-lgpd-consent/)**: Home page that navigates between all docs sites.

### 🧑‍🏫 Developer Guidance (dev-only)

In development, the library prints a guidance panel in the console to help you configure correctly:
- Warns when using default categories; suggests making them explicit
- Lists active categories and which ones require a UI toggle
- Detects integrations that require categories and suggests enabling them
- Flags excessive number of categories (UX)
- Highlights Brazilian LGPD best practices: opt-out by default, clear policy, consent logging, retention
- Silenced in production; SSR-safe

### ⚠️ Breaking Changes v0.4.1
- **Custom categories support**: `setPreference` and `ScriptIntegration.category` now use `string` instead of `Category`
- **Minimal impact**: Code using literal strings continues working without changes
- **Migration guide**: See [CHANGELOG.md](./CHANGELOG.md) for complete details

---

## 🤝 Contributing

1. Open an Issue for bugs or feature requests.
2. Follow `DEVELOPMENT.md` to submit a PR.

---

## 📄 License

MIT — see the `LICENSE` file.
