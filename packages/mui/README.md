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

## 🚀 Uso Básico

```tsx
import { 
  ConsentProvider, 
  CookieBanner, 
  PreferencesModal,
  FloatingPreferencesButton 
} from '@react-lgpd-consent/mui'

function App() {
  return (
    <ConsentProvider categories={{ enabledCategories: ['analytics', 'marketing'] }}>
      <CookieBanner policyLinkUrl="/privacy-policy" />
      <PreferencesModal />
      <FloatingPreferencesButton />
      <YourApp />
    </ConsentProvider>
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
  SnackbarProps={{ anchorOrigin: { vertical: 'top', horizontal: 'center' } }}
/>

<FloatingPreferencesButton
  position="bottom-right"
  offset={24}
  icon={<CustomIcon />}
/>
```

## 📚 Documentação

- [Documentação Principal](https://lucianoedipo.github.io/react-lgpd-consent/)
- [Storybook (Componentes Interativos)](https://lucianoedipo.github.io/react-lgpd-consent/storybook/)
- [Guia de Início Rápido](../../QUICKSTART.md)

## 🔗 Pacotes Relacionados

- [`@react-lgpd-consent/core`](../core) - Núcleo sem dependências de UI
- [`react-lgpd-consent`](../react-lgpd-consent) - Pacote agregador (core + mui)

## 📄 Licença

MIT © [Luciano Édipo](https://github.com/lucianoedipo)

