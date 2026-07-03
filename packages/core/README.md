# @react-lgpd-consent/core

> Núcleo da biblioteca de consentimento LGPD para React - Estado, hooks e utilitários sem dependências de UI

[![NPM Version](https://img.shields.io/npm/v/@react-lgpd-consent/core)](https://www.npmjs.com/package/@react-lgpd-consent/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## 📦 Sobre

O pacote `@react-lgpd-consent/core` contém toda a lógica de negócio e gerenciamento de estado da biblioteca `react-lgpd-consent`, **sem dependências de componentes UI**.

### Ideal para:

- ✅ Criar sua própria camada de UI customizada
- ✅ Integrar com outras bibliotecas de componentes (não-MUI)
- ✅ Aplicações headless que precisam apenas da lógica de consentimento
- ✅ Reduzir o tamanho do bundle removendo dependências do Material-UI

## 📥 Instalação

```bash
npm install @react-lgpd-consent/core
# ou
pnpm add @react-lgpd-consent/core
```

**Peer Dependencies:** `react@^18.2.0 || ^19.0.0`, `react-dom@^18.2.0 || ^19.0.0`

## 🚀 Uso Básico

```tsx
import { ConsentProvider, useConsent } from '@react-lgpd-consent/core'

function App() {
  return (
    <ConsentProvider categories={{ enabledCategories: ['analytics'] }}>
      <MyCustomBanner />
      <YourApp />
    </ConsentProvider>
  )
}

function MyCustomBanner() {
  const { consented, acceptAll, rejectAll } = useConsent()

  if (consented) return null

  return (
    <div>
      <p>Usamos cookies para melhorar sua experiência</p>
      <button onClick={acceptAll}>Aceitar</button>
      <button onClick={rejectAll}>Rejeitar</button>
    </div>
  )
}
```

## 🎯 O que está incluído

- **Contextos:** `ConsentProvider`, `CategoriesContext`, `DesignContext`
- **Hooks:** `useConsent`, `useCategories`, `useConsentHydration`, e mais
- **Utilitários:** `ConsentScriptLoader`, `ConsentGate`, logging, cookies
- **Integrações:** Google Analytics, GTM, UserWay, Facebook Pixel, Hotjar, etc.
- **Tipos TypeScript:** Tipagem completa para toda a API

## 🧩 Scripts, Fila e Consent Mode v2

- **ConsentScriptLoader** agora mantém uma fila interna por categoria e prioridade. Scripts `necessary` rodam imediatamente; os demais só executam após consentimento explícito.
- **API programática `registerScript`**: registre callbacks inline ou integrações que não usam `<script src>` e deixe a fila disparar no momento correto. Estados da fila: `pending` → `running` → `executed` (recarrega apenas se `allowReload=true`).
  ```ts
  const cleanup = registerScript({
    id: 'ga-consent-mode',
    category: 'analytics',
    priority: 10, // maior roda antes dentro da categoria
    execute: bootstrapConsentMode,
    onConsentUpdate: ({ preferences }) => pushConsentSignals(preferences),
  })
  ```
- **Consent Mode v2 nativo**: `createGoogleAnalyticsIntegration` e `createGoogleTagManagerIntegration` inicializam `consent=default` (denied) e enviam `consent=update` conforme as preferências do usuário, sem snippet manual.
- **Compatibilidade com APIs atuais de terceiros**: GTM propaga `dataLayerName` na URL do container, Clarity usa Consent API v2, Intercom sincroniza `update`/`shutdown` e Zendesk Messaging sincroniza o intervalo de cookies.
- **Observabilidade dev-only**: logs ordenados de execução para depurar a fila (silenciados em produção).

## 🆕 Novidades v0.7.0

### Callbacks de Lifecycle

```tsx
import { ConsentProvider } from '@react-lgpd-consent/core'

<ConsentProvider
  onConsentInit={(state) => console.log('Init:', state)}
  onConsentChange={(current, previous) => {
    console.log('Mudou:', { current, previous })
  }}
  onAuditLog={(entry) => {
    // Enviar para backend
    fetch('/api/audit', { method: 'POST', body: JSON.stringify(entry) })
  }}
>
```

### Presets ANPD

```tsx
import { createAnpdCategoriesConfig, ANPD_CATEGORY_PRESETS } from '@react-lgpd-consent/core'

// Preset BÁSICO
const basic = createAnpdCategoriesConfig({ include: ['analytics'] })

// Preset COMPLETO
const full = createAnpdCategoriesConfig({
  include: ['analytics', 'marketing', 'functional', 'social', 'personalization'],
})
```

### Auditoria de Consentimento

```tsx
import { createConsentAuditEntry } from '@react-lgpd-consent/core'

const audit = createConsentAuditEntry(
  { consented: true, preferences: { analytics: true } },
  { action: 'update', storageKey: 'lgpd-consent__v1' },
)
```

📖 **Saiba mais:** [TROUBLESHOOTING.md](../../doc/TROUBLESHOOTING.md)

## 📚 Documentação

Para documentação completa, exemplos e API reference:

- [Documentação Principal](https://lucianoedipo.github.io/react-lgpd-consent/)
- [Guia de Início Rápido](../../doc/QUICKSTART.md)
- [Conformidade LGPD](../../doc/CONFORMIDADE.md)

## 🔗 Pacotes Relacionados

- [`@react-lgpd-consent/mui`](../mui/README.md) - Componentes prontos usando Material-UI
- [`react-lgpd-consent`](../react-lgpd-consent/README.md) - Pacote agregador (core + mui)

## 📄 Licença

MIT © [Luciano Édipo](https://github.com/lucianoedipo)
