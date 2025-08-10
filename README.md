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
- 🚫 **Banner Bloqueante**: Modo opcional para exigir interação antes de continuar
- 🎨 **Sistema de Temas**: Temas customizáveis para integração visual perfeita
- ⚡ **Carregamento Condicional**: Scripts só executam após consentimento explícito

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
      <CookieBanner
        policyLinkUrl="/politica-privacidade"
        blocking={true} // Padrão: bloqueia até decisão
      />
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
import { ConsentGate, loadConditionalScript } from 'react-lgpd-consent'

function Analytics() {
  return (
    <ConsentGate category="analytics">
      <GoogleAnalytics />
    </ConsentGate>
  )
}

// Ou carregando scripts que aguardam consentimento
function MyComponent() {
  const { preferences, consented } = useConsent()

  useEffect(() => {
    if (consented && preferences.analytics) {
      loadConditionalScript(
        'ga',
        'https://www.googletagmanager.com/gtag/js?id=GA_ID',
        () => preferences.analytics, // Condição que aguarda
      )
    }
  }, [preferences, consented])
}
```

## 🎨 Customização

### Banner Bloqueante vs Não-bloqueante

```tsx
// Banner bloqueante (padrão) - impede interação até decisão
<CookieBanner blocking={true} />

// Banner não-intrusivo - permite navegação
<CookieBanner blocking={false} />
```

### Tema Personalizado

```tsx
import { ConsentProvider, defaultConsentTheme } from 'react-lgpd-consent'
import { createTheme } from '@mui/material/styles'

const meuTema = createTheme({
  ...defaultConsentTheme,
  palette: {
    ...defaultConsentTheme.palette,
    primary: {
      main: '#1976d2', // Sua cor principal
    },
  },
})

<ConsentProvider theme={meuTema}>
  <App />
</ConsentProvider>
```

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

## � Banner Bloqueante

Para cenários onde é necessário bloquear o acesso até obter consentimento explícito:

```tsx
<CookieBanner blocking />
```

Com `blocking={true}`, o banner:

- Cria um overlay escuro sobre todo o conteúdo
- Impede interação com o resto da página
- É útil para casos críticos onde consentimento é obrigatório

## 🎨 Sistema de Temas

### Tema Personalizado

```tsx
import { createTheme } from '@mui/material/styles'

const meuTema = createTheme({
  palette: {
    primary: { main: '#2196f3' },
    secondary: { main: '#f50057' },
  },
})

<ConsentProvider theme={meuTema}>
  <App />
</ConsentProvider>
```

### Tema Padrão

O tema padrão do react-lgpd-consent está disponível para customização:

```tsx
import { defaultConsentTheme } from 'react-lgpd-consent'

const temaCustomizado = createTheme({
  ...defaultConsentTheme,
  palette: {
    ...defaultConsentTheme.palette,
    primary: { main: '#your-color' },
  },
})
```

## ⚡ Carregamento Condicional

### Função loadConditionalScript

Para scripts que devem aguardar consentimento específico:

```tsx
import { loadConditionalScript } from 'react-lgpd-consent'

// Carrega script apenas quando analytics for aceito
await loadConditionalScript(
  'gtag',
  'https://www.googletagmanager.com/gtag/js?id=GA_ID',
  () => preferences.analytics,
  { timeout: 10000 }, // timeout opcional
)
```

### Parâmetros

- `id`: Identificador único para o script
- `src`: URL do script a ser carregado
- `condition`: Função que retorna boolean indicando se deve carregar
- `options`: Configurações opcionais (timeout, etc.)

## �🔧 API Completa

### Components

| Componente         | Descrição                              | Props Principais                                             |
| ------------------ | -------------------------------------- | ------------------------------------------------------------ |
| `ConsentProvider`  | Provider principal do contexto         | `initialState`, `texts`, `theme`, `cookie`, callbacks        |
| `CookieBanner`     | Banner de consentimento                | `policyLinkUrl`, `blocking`, `debug`, pass-through MUI props |
| `PreferencesModal` | Modal de preferências detalhadas       | `DialogProps` (MUI pass-through)                             |
| `ConsentGate`      | Renderização condicional por categoria | `category`, `children`                                       |

### Hook `useConsent()`

```typescript
interface ConsentContextValue {
  consented: boolean // usuário já consentiu?
  preferences: ConsentPreferences // preferências atuais
  isModalOpen: boolean // estado do modal de preferências
  acceptAll(): void // aceitar todas as categorias
  rejectAll(): void // recusar opcionais
  setPreference(cat: Category, value: boolean): void // definir categoria específica
  openPreferences(): void // abrir modal de preferências
  closePreferences(): void // fechar modal
  resetConsent(): void // resetar tudo
}
```

### Hook `useConsentTexts()`

```typescript
// Acesso aos textos contextuais
const texts = useConsentTexts()
console.log(texts.banner.title) // "Política de Cookies"
```

### Utilitários

- `loadScript(id, src, attrs?)` - Carrega scripts dinamicamente
- `loadConditionalScript(id, src, condition, options?)` - Carrega scripts condicionalmente
- `defaultConsentTheme` - Tema padrão do Material-UI
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
