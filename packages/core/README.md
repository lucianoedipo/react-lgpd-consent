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

## 📚 Documentação

Para documentação completa, exemplos e API reference:
- [Documentação Principal](https://lucianoedipo.github.io/react-lgpd-consent/)
- [Guia de Início Rápido](../../QUICKSTART.md)
- [Conformidade LGPD](../../CONFORMIDADE.md)

## 🔗 Pacotes Relacionados

- [`@react-lgpd-consent/mui`](../mui) - Componentes prontos usando Material-UI
- [`react-lgpd-consent`](../react-lgpd-consent) - Pacote agregador (core + mui)

## 📄 Licença

MIT © [Luciano Édipo](https://github.com/lucianoedipo)

