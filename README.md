# react-lgpd-consent 🍪

[![NPM Version](https://img.shields.io/npm/v/react-lgpd-consent?style=for-the-badge&color=blue)](https://www.npmjs.com/package/react-lgpd-consent)
[![License](https://img.shields.io/npm/l/react-lgpd-consent?style=for-the-badge)](https://github.com/lucianoedipo/react-lgpd-consent/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18%2B-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Material-UI](https://img.shields.io/badge/MUI-Ready-007FFF?style=for-the-badge&logo=mui)](https://mui.com/)

> **Biblioteca completa de consentimento de cookies para React e Next.js em conformidade com a LGPD**

Solução moderna, acessível e personalizável para gerenciar consentimento de cookies em aplicações React, com suporte completo a SSR, Material-UI e TypeScript.

## ✨ Características Principais

- 🇧🇷 **Conformidade LGPD**: Respeita totalmente a legislação brasileira de proteção de dados
- ⚡ **SSR/Next.js Ready**: Suporte nativo a Server-Side Rendering sem flash de conteúdo
- 🎨 **Material-UI Integration**: Componentes prontos e customizáveis com MUI
- ♿ **Acessibilidade**: Navegação por teclado e leitores de tela nativamente suportados
- 🌐 **Internacionalização**: Textos totalmente customizáveis (padrão pt-BR)
- 🚀 **TypeScript**: API completamente tipada para melhor DX
- 📦 **Zero Config**: Funciona out-of-the-box com configurações sensatas
- 🎯 **Granular Control**: Controle individual de categorias (analytics, marketing, etc.)

## 🚀 Instalação

```bash
npm install react-lgpd-consent
# ou
yarn add react-lgpd-consent
# ou
pnpm add react-lgpd-consent
```

### Dependências

```bash
npm install @mui/material js-cookie
```

## 📖 Uso Básico

### 1. Setup do Provider

```tsx
import { ConsentProvider } from 'react-lgpd-consent'

function App() {
  return (
    <ConsentProvider>
      <YourApp />
    </ConsentProvider>
  )
}
```

### 2. Banner de Consentimento

```tsx
import { CookieBanner } from 'react-lgpd-consent'

function Layout() {
  return (
    <>
      <YourContent />
      <CookieBanner policyLinkUrl="/politica-privacidade" />
    </>
  )
}
```

### 3. Uso do Hook

```tsx
import { useConsent } from 'react-lgpd-consent'

function MyComponent() {
  const { consented, preferences, acceptAll, openPreferences } = useConsent()

  return (
    <div>
      <p>Consentimento: {consented ? 'Dado' : 'Pendente'}</p>
      <button onClick={acceptAll}>Aceitar Todos</button>
      <button onClick={openPreferences}>Gerenciar Preferências</button>
    </div>
  )
}
```

### 4. Carregamento Condicional de Scripts

```tsx
import { ConsentGate, loadScript } from 'react-lgpd-consent'

function Analytics() {
  return (
    <ConsentGate category="analytics">
      <GoogleAnalytics />
    </ConsentGate>
  )
}

// Ou carregando scripts dinamicamente
function MyComponent() {
  const { preferences } = useConsent()

  useEffect(() => {
    if (preferences.analytics) {
      loadScript('ga', 'https://www.googletagmanager.com/gtag/js?id=GA_ID')
    }
  }, [preferences.analytics])
}
```

## 🎨 Customização

### Textos Personalizados

```tsx
<ConsentProvider
  texts={{
    bannerMessage: "Utilizamos cookies para melhorar sua experiência.",
    acceptAll: "Aceitar Todos",
    declineAll: "Recusar Opcionais",
    preferences: "Configurar"
  }}
>
```

### Configuração do Cookie

```tsx
<ConsentProvider
  cookie={{
    name: 'meuSiteConsent',
    maxAgeDays: 180,
    sameSite: 'Strict'
  }}
>
```

### Callbacks

```tsx
<ConsentProvider
  onConsentGiven={(state) => {
    console.log('Consentimento dado:', state)
    // Inicializar analytics, etc.
  }}
  onPreferencesSaved={(prefs) => {
    console.log('Preferências salvas:', prefs)
  }}
>
```

## 🔧 API Completa

### Components

| Componente         | Descrição                              | Props Principais                                 |
| ------------------ | -------------------------------------- | ------------------------------------------------ |
| `ConsentProvider`  | Provider principal do contexto         | `initialState`, `texts`, `cookie`, callbacks     |
| `CookieBanner`     | Banner de consentimento                | `policyLinkUrl`, `debug`, pass-through MUI props |
| `PreferencesModal` | Modal de preferências detalhadas       | `DialogProps` (MUI pass-through)                 |
| `ConsentGate`      | Renderização condicional por categoria | `category`, `children`                           |

### Hook `useConsent()`

```typescript
interface ConsentContextValue {
  consented: boolean // usuário já consentiu?
  preferences: ConsentPreferences // preferências atuais
  acceptAll(): void // aceitar todas as categorias
  rejectAll(): void // recusar opcionais
  setPreference(cat: Category, value: boolean): void // definir categoria específica
  openPreferences(): void // abrir modal de preferências
  closePreferences(): void // fechar modal
  resetConsent(): void // resetar tudo
}
```

### Utilitários

- `loadScript(id, src, attrs?)` - Carrega scripts dinamicamente
- Tipos TypeScript completos exportados

## 🌐 SSR / Next.js

Para evitar flash de conteúdo em SSR:

```tsx
// pages/_app.tsx (Next.js)
function MyApp({ Component, pageProps }) {
  return (
    <ConsentProvider
      initialState={{
        consented: false,
        preferences: { analytics: false, marketing: false },
      }}
    >
      <Component {...pageProps} />
    </ConsentProvider>
  )
}
```

## ♿ Acessibilidade

A biblioteca segue as melhores práticas de acessibilidade:

- ✅ Navegação por teclado (Tab, Enter, Escape)
- ✅ Leitores de tela (`aria-labelledby`, `aria-describedby`)
- ✅ Foco gerenciado automaticamente
- ✅ Contrastes adequados
- ✅ Estrutura semântica correta

## 📚 Exemplos

Confira exemplos completos no repositório:

- [Básico com React](./examples/basic)
- [Next.js com SSR](./examples/nextjs)
- [Customização avançada](./examples/advanced)
- [Integração com analytics](./examples/analytics)

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor:

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🙋‍♀️ Suporte

- 📖 [Documentação](./docs)
- 🐛 [Issues](https://github.com/lucianoedipo/react-lgpd-consent/issues)
- 💬 [Discussões](https://github.com/lucianoedipo/react-lgpd-consent/discussions)

---

<div align="center">

**Feito com ❤️ para a comunidade React brasileira**

</div>
