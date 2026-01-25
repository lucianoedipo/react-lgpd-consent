# 🚀 Quickstart

This quickstart gives everything you need to integrate `react-lgpd-consent` into a React project fast.

> 💡 **Looking for practical recipes?** See [RECIPES.md](./RECIPES.md) for specific use cases like Next.js App Router, CSP/nonce, Consent Mode v2, and subdomains.

## 🆕 What's New in v0.7.0

- ✅ **Lifecycle Callbacks** - Monitor consent events with `onConsentInit`, `onConsentChange`, `onAuditLog`
- ✅ **ANPD Presets** - Pre-validated category configurations with `createAnpdCategoriesConfig()`
- ✅ **Audit Logging** - Compliance tracking with `createConsentAuditEntry()`
- ✅ **Improved Error Messages** - Clear error messages in pt-BR when hooks are used outside Provider

📖 **Full details:** [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) | [API.md](../packages/react-lgpd-consent/API.md)

---

## 📦 Installation

```bash
npm install react-lgpd-consent
# or
yarn add react-lgpd-consent
```

### Peer dependencies

```bash
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
```

> ℹ️ **Modularization (v0.5.0+)**
>
> - `react-lgpd-consent` remains the main npm package.
> - `@react-lgpd-consent/core` exposes contexts, hooks and utilities only.
> - `@react-lgpd-consent/mui` ships the MUI components and re-exports the core.
> - For UI-only (smaller bundle), use `@react-lgpd-consent/mui/ui`.
> - Subpath imports (`react-lgpd-consent/core`, `react-lgpd-consent/mui`) are available for advanced setups.

## 🎯 Basic Usage (30 seconds)

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
        <h1>My Application</h1>
      </main>
    </ConsentProvider>
  )
}

export default App
```

## 🧩 Custom categories (customCategories)
Available since v0.4.0.

## 🎨 Style tip: Theme-aware backdrop

In blocking mode, the banner uses a backdrop to focus user attention. You can control it via design tokens:

```tsx
<ConsentProvider
  categories={{ enabledCategories: ['analytics'] }}
  designTokens={{
    layout: {
      // false: transparent | 'auto': adapts to theme | string: custom color (e.g., '#00000088')
      backdrop: 'auto',
    },
    colors: {
      // If omitted, MUI theme palette is used (background.paper, text.primary)
      // background: '#1e1e1e',
      // text: '#ffffff',
    },
  }}
>
  <App />
</ConsentProvider>
```

If `colors.background` or `colors.text` are omitted, the library falls back to `theme.palette.background.paper` and `theme.palette.text.primary`, ensuring dark mode compatibility.

## 🧑‍🏫 Developer Guidance (console)

In development, the console shows a helpful guidance panel:
- Warns when using defaults; suggests making categories explicit
- Lists active categories and which require UI toggles
- Detects integrations that require categories and suggests enabling them
- Shares Brazilian LGPD best practices and flags UX issues (too many categories)
- Silenced automatically in production; SSR-safe

Add project-specific categories (e.g., support chat, video players, A/B testing):

```tsx
<ConsentProvider
  categories={{
    enabledCategories: ['analytics'],
    customCategories: [
      { id: 'chat', name: 'Support Chat', description: 'Chat widget' },
      { id: 'video', name: 'Video', description: 'Embedded players' },
      { id: 'abTesting', name: 'A/B Testing', description: 'Interface experiments' },
    ],
  }}
>
  <App />
</ConsentProvider>
```

### Using custom categories in your code

```tsx
import { useConsent } from 'react-lgpd-consent'

function MyComponent() {
  const { preferences } = useConsent()

  // Check if user consented to specific categories
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

## 🧭 Storybook — quick note

This repository ships an interactive Storybook playground used for manual testing and visual exploration of components. Quick commands:

- Run locally (development):

```bash
npm run storybook
```

- Build static Storybook (for publishing to GitHub Pages):

```bash
npm run build-storybook
```

Notes:
- The Storybook preview (`.storybook/preview.tsx`) applies a clean environment between stories (it removes the consent cookie and performs defensive DOM cleanup). Check that file when creating stories that rely on a clean initial state.


## 📋 ConsentProvider props (summary)

This is a condensed reference of the most commonly-used props. For a full typed table, see the TypeScript API docs.

- `categories` (required) — Project categories configuration (e.g. enabledCategories: ["analytics"]).
- `texts` — Partial object to override UI texts.
- `theme` — Material-UI theme for consent components.
- `designTokens` — Advanced visual tokens (colors, spacing, backdrop).
- `blocking` (boolean) — If true, provider will block interaction until user acts.
- `blockingMode` (`"soft" | "hard"`) — Blocking intensity; `hard` makes the app content inert (no focus/keyboard).
- `blockingStrategy` (`"auto" | "provider" | "component"`) — How overlay is managed.
- `hideBranding` (boolean) — Hide library branding.
- `onConsentGiven` — Callback when user gives consent for the first time.
- `onPreferencesSaved` — Callback when preferences are saved.
- `CookieBannerComponent`, `PreferencesModalComponent`, `FloatingPreferencesButtonComponent` — Replace UI components.
- `cookie` — Customize cookie name, maxAge, domain, secure, sameSite.

## 🎨 Custom components (TypeScript)

### Custom Cookie Banner

```tsx
import React from 'react'
import { ConsentProvider, type CustomCookieBannerProps } from 'react-lgpd-consent'

const MyBanner: React.FC<CustomCookieBannerProps> = ({
  consented,
  acceptAll,
  rejectAll,
  openPreferences,
  texts,
  blocking,
}) => {
  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#222', color: 'white', padding: '1rem' }}>
      <p>{texts.bannerMessage}</p>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button onClick={acceptAll}>{texts.acceptAll}</button>
        <button onClick={rejectAll}>{texts.declineAll}</button>
        <button onClick={openPreferences}>{texts.preferences}</button>
      </div>
    </div>
  )
}

function App() {
  return (
    <ConsentProvider categories={{ enabledCategories: ['analytics'] }} CookieBannerComponent={MyBanner} blocking>
      <main>My App</main>
    </ConsentProvider>
  )
}
```

### Custom Preferences Modal

```tsx
import React from 'react'
import { ConsentProvider, type CustomPreferencesModalProps } from 'react-lgpd-consent'

const MyModal: React.FC<CustomPreferencesModalProps> = ({ preferences, setPreferences, closePreferences, isModalOpen, texts }) => {
  if (!isModalOpen) return null

  return (
    <div style={{ position: 'fixed', inset: '20% 25%', background: 'white', borderRadius: 8, padding: '1.5rem', zIndex: 2000 }}>
      <h2>{texts.modalTitle}</h2>
      <p>{texts.modalIntro}</p>

      {Object.entries(preferences).map(([category, enabled]) => (
        <label key={category} style={{ display: 'block', margin: '0.5rem 0' }}>
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setPreferences({ ...preferences, [category]: e.target.checked })}
            disabled={category === 'necessary'}
          />{' '}
          {category === 'necessary' ? texts.necessaryAlwaysOn : `Cookies ${category}`}
        </label>
      ))}

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <button onClick={closePreferences}>Cancel</button>
        <button onClick={closePreferences}>{texts.save}</button>
      </div>
    </div>
  )
}

function App() {
  return (
    <ConsentProvider categories={{ enabledCategories: ['analytics', 'marketing'] }} PreferencesModalComponent={MyModal}>
      <main>My App</main>
    </ConsentProvider>
  )
}
```

## 🎮 Programmatic control

### React hook: `useOpenPreferencesModal`

```tsx
import React from 'react'
import { useOpenPreferencesModal, useConsent } from 'react-lgpd-consent'

function MyComponent() {
  const openPreferences = useOpenPreferencesModal()
  const { preferences, acceptAll, rejectAll } = useConsent()

  return (
    <div>
      <h3>Analytics: {preferences.analytics ? 'enabled' : 'disabled'}</h3>
      <button onClick={openPreferences}>⚙️ Manage preferences</button>
      <button onClick={acceptAll}>✅ Accept all</button>
      <button onClick={rejectAll}>❌ Reject all</button>
    </div>
  )
}
```

### Global: `globalThis.window.openPreferencesModal` (for plain JS)

```html
<button onclick="globalThis.window?.openPreferencesModal?.()">Configure cookies</button>

<script>
  if (typeof globalThis.window?.openPreferencesModal === 'function') {
    console.log('Consent system available')
  }
</script>
```

## 🐛 Debug system

```tsx
import { setDebugLogging, LogLevel } from 'react-lgpd-consent'

// enable verbose debug locally
setDebugLogging(true, LogLevel.DEBUG)

// quieter in staging
setDebugLogging(true, LogLevel.INFO)

// errors only
setDebugLogging(true, LogLevel.ERROR)

// disable
setDebugLogging(false)
```

Use the `useConsent` hook to inspect runtime state (preferences, consented) and optionally render a small debug panel in dev mode.

## 🎨 Material-UI Theme integration

Wrap your app with MUI `ThemeProvider` and optionally pass a `theme` prop to `ConsentProvider` to style consent components.

## 🔧 Advanced

- `designTokens` for low-level visual control (colors, spacing, backdrop)
- `cookie` to customize name, maxAge, domain, secure, sameSite
- `blocking` + `blockingStrategy` to control overlay behavior

## 🚀 Common use cases

- E-commerce: analytics + marketing integrations
- Blog: only analytics
- Enterprise: strict blocking and auditing via `onPreferencesSaved`

## 🆘 Troubleshooting

- "ConsentProvider must be used within ConsentProvider": ensure hooks are called inside provider tree.
- Banner not showing: clear consent cookie, check z-index and config.
- TypeScript types: set `moduleResolution` or `skipLibCheck` in `tsconfig` if needed.

## 📚 Next steps

- API docs: `API.md`
- LGPD compliance guide: `CONFORMIDADE.md`
- Integrations: `INTEGRACOES.md`
- Example app: `example/`


---

Tip: enable debug logs during development with `setDebugLogging(true, LogLevel.DEBUG)` to see runtime behavior.
