# @react-lgpd-consent/mui

> Componentes Material-UI para react-lgpd-consent - UI pronta para usar

[![NPM Version](https://img.shields.io/npm/v/@react-lgpd-consent/mui)](https://www.npmjs.com/package/@react-lgpd-consent/mui)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## 📦 Sobre

O pacote `@react-lgpd-consent/mui` fornece **componentes visuais prontos para uso** baseados em Material-UI para a biblioteca `react-lgpd-consent`.

### Ideal para:
- ✅ Aplicações que já usam Material-UI
- ✅ Desenvolvimento rápido com componentes prontos
- ✅ Customização via theme do Material-UI
- ✅ Experiência consistente com Material Design

## 📥 Instalação

```bash
npm install @react-lgpd-consent/mui @mui/material @mui/icons-material
# ou
pnpm add @react-lgpd-consent/mui @mui/material @mui/icons-material
```

**Peer Dependencies:**
- `@mui/material@^7.0.0 || ^6.0.0 || ^5.15.0`
- `@mui/icons-material@^7.0.0 || ^6.0.0 || ^5.15.0` (opcional)
- `react@^18.2.0 || ^19.0.0`, `react-dom@^18.2.0 || ^19.0.0`

### Entradas de importação (evite ambiguidades)

- `@react-lgpd-consent/mui/ui`: **apenas UI** (ConsentProvider MUI + componentes). Ideal para bundles menores e sem re-export do core.
- `@react-lgpd-consent/mui`: compatibilidade total (re-exporta o core); use `headless` ou `ConsentProviderHeadless` daqui se precisar da lógica.
- `@react-lgpd-consent/core`: headless puro, recomendado para hooks/utils na sua própria UI.

## 🚀 Uso Básico

```tsx
import { 
  ConsentProvider, 
  CookieBanner, 
  FloatingPreferencesButton 
} from '@react-lgpd-consent/mui'

function App() {
  return (
    <ConsentProvider categories={{ enabledCategories: ['analytics', 'marketing'] }}>
      <CookieBanner policyLinkUrl="/privacy-policy" />
      <FloatingPreferencesButton />
      {/* O PreferencesModal é injetado automaticamente! */}
      <YourApp />
    </ConsentProvider>
  )
}
```

> ✨ **Nota:** O `ConsentProvider` deste pacote automaticamente renderiza o `PreferencesModal`. Você não precisa incluí-lo manualmente!

### Customizando o Modal de Preferências

```tsx
import { ConsentProvider, PreferencesModal } from '@react-lgpd-consent/mui'

function App() {
  return (
    <ConsentProvider
      categories={{ enabledCategories: ['analytics'] }}
      PreferencesModalComponent={(props) => (
        <PreferencesModal {...props} hideBranding={true} />
      )}
    >
      <YourApp />
    </ConsentProvider>
  )
}
```

## 🆕 Novidades v0.7.0

### Callbacks de Lifecycle

Monitore eventos para auditoria:

```tsx
import { ConsentProvider } from '@react-lgpd-consent/mui'

<ConsentProvider
  onConsentInit={(state) => console.log('Inicializado:', state)}
  onConsentChange={(current, prev) => console.log('Mudou:', current)}
  onAuditLog={(entry) => {
    fetch('/api/audit', { method: 'POST', body: JSON.stringify(entry) })
  }}
>
```

### Presets ANPD

```tsx
import { createAnpdCategoriesConfig } from '@react-lgpd-consent/mui'

const categories = createAnpdCategoriesConfig({
  include: ['analytics', 'marketing']
})

<ConsentProvider categories={categories}>
```

📖 **Documentação completa:** [API.md](../react-lgpd-consent/API.md) | [TROUBLESHOOTING.md](../../TROUBLESHOOTING.md)

---

### Uso Headless (Avançado)

Se você quiser controle total sobre a UI:

```tsx
import { ConsentProviderHeadless, useConsent } from '@react-lgpd-consent/mui'

function App() {
  return (
    <ConsentProviderHeadless categories={{ enabledCategories: ['analytics'] }}>
      <CustomUI />
    </ConsentProviderHeadless>
  )
}

function CustomUI() {
  const { acceptAll, rejectAll } = useConsent()
  return (
    <div>
      <button onClick={acceptAll}>Aceitar</button>
      <button onClick={rejectAll}>Rejeitar</button>
    </div>
  )
}
```

## 🎯 Componentes Incluídos

- **`CookieBanner`** - Banner de consentimento (modal ou snackbar)
- **`PreferencesModal`** - Modal de preferências detalhadas
- **`FloatingPreferencesButton`** - Botão flutuante para reabrir preferências
- **`Branding`** - Componente de marca/logo customizável

**Nota:** Este pacote **re-exporta todo o `@react-lgpd-consent/core`**, então você tem acesso a todos os hooks, contextos, utilitários e tipos.

## 🎨 Customização

```tsx
<CookieBanner
  blocking={true}
  policyLinkUrl="/privacy"
  position="bottom"
  anchor="center"
  offset={64}
  SnackbarProps={{ autoHideDuration: null }}
/>

<FloatingPreferencesButton
  position="bottom-right"
  offset={24}
  icon={<CustomIcon />}
/>
```

Para bloquear navegação até a decisão, use `blockingMode="hard"` no provider:

```tsx
<ConsentProvider
  categories={{ enabledCategories: ['analytics'] }}
  blocking
  blockingMode="hard"
  blockingStrategy="provider"
/>
```

## 📚 Documentação

- [Documentação Principal](https://lucianoedipo.github.io/react-lgpd-consent/)
- [Storybook (Componentes Interativos)](https://lucianoedipo.github.io/react-lgpd-consent/storybook/)
- [Guia de Início Rápido](../../QUICKSTART.md)

## 🔗 Pacotes Relacionados

- [`@react-lgpd-consent/core`](../core/README.md) - Núcleo sem dependências de UI
- [`react-lgpd-consent`](../react-lgpd-consent/README.md) - Pacote agregador (core + mui)

## 📄 Licença

MIT © [Luciano Édipo](https://github.com/lucianoedipo)
