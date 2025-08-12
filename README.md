# react-lgpd-consent 🍪

[![NPM Version](https://img.shields.io/npm/v/react-lgpd-consent?style=for-the-badge&color=blue)](https://www.npmjs.com/package/react-lgpd-consent)
[![License](https://img.shields.io/npm/l/react-lgpd-consent?style=for-the-badge)](https://github.com/lucianoedipo/react-lgpd-consent/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge&logo=typescript)](https://## 🔧 API Completa

> **📖 Documentação Detalhada**: [API v0.2.0](./docs/API-v0.2.0.md) | [API v0.1.x (Legacy)](./docs/API-0.1.x.md)

### Components.typescriptlang.org/)

[![React](https://img.shields.io/badge/React-18%2B-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Material-UI](https://img.shields.io/badge/MUI-Ready-007FFF?style=for-the-badge&logo=mui)](https://mui.com/)

> **Biblioteca completa de consentimento de cookies para React e Next.js em conformidade com a LGPD**

Solução moderna, acessível e personalizável para gerenciar consentimento de cookies em aplicações React, com suporte completo a SSR, Material-UI e TypeScript.

## ✨ Características Principais

- 🇧🇷 **Conformidade LGPD + ANPD**: 6 categorias baseadas no Guia Orientativo da ANPD
- 🍪 **Categorias Extensíveis**: Sistema dinâmico para categorias customizadas
- 🚀 **Integrações Nativas**: Google Analytics, Tag Manager, UserWay automatizados
- ⚡ **Client-Side First**: Arquitetura otimizada para SPA com zero-flash
- 🎨 **Material-UI Integration**: Componentes prontos e customizáveis com MUI
- ♿ **Acessibilidade**: Navegação por teclado e leitores de tela nativamente suportados
- 🌐 **Internacionalização**: Textos totalmente customizáveis (padrão pt-BR)
- 🚀 **TypeScript**: API completamente tipada para melhor DX
- 📦 **Zero Config**: Funciona out-of-the-box com configurações sensatas
- 🎯 **Granular Control**: Controle individual de 6+ categorias de cookies
- 🚫 **Banner Bloqueante**: Modo opcional para exigir interação antes de continuar
- 🎨 **Sistema de Temas**: Temas customizáveis para integração visual perfeita
- ⚡ **Carregamento Automático**: Scripts só executam após consentimento explícito
- 🔌 **Modal Automático**: Modal de preferências incluído automaticamente com lazy loading
- 🎛️ **Botão Flutuante**: Componente opcional para acesso fácil às preferências

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

## 🆕 Novidades v0.2.0 - Adequação ANPD Completa

### 🍪 Categorias Baseadas no Guia da ANPD

A biblioteca agora inclui **6 categorias** baseadas no Guia Orientativo da ANPD:

- **`necessary`**: Cookies essenciais (sempre ativos)
- **`analytics`**: Análise e estatísticas de uso
- **`functional`**: Funcionalidades extras (preferências, idioma)
- **`marketing`**: Publicidade e marketing direcionado
- **`social`**: Integração com redes sociais
- **`personalization`**: Personalização de conteúdo

### 🔧 Categorias Customizadas

```tsx
const customCategories = [
  {
    id: 'governo',
    name: 'Integração Governo',
    description: 'Cookies para integração com sistemas governamentais.',
    essential: false,
    cookies: ['gov_session', 'cpf_hash']
  },
  {
    id: 'acessibilidade',
    name: 'Acessibilidade',
    description: 'Ferramentas para melhorar acessibilidade.',
    essential: false,
    cookies: ['userway_*', 'voice_*']
  }
]

<ConsentProvider customCategories={customCategories}>
  {/* Sua aplicação */}
</ConsentProvider>
```

### 🚀 Integrações Automáticas

```tsx
import {
  ConsentScriptLoader,
  createGoogleAnalyticsIntegration,
  createUserWayIntegration,
} from 'react-lgpd-consent'

const integrations = [
  createGoogleAnalyticsIntegration({
    measurementId: 'GA_MEASUREMENT_ID',
  }),
  createUserWayIntegration({
    accountId: 'USERWAY_ACCOUNT_ID',
  }),
]

function App() {
  return (
    <ConsentProvider>
      {/* Scripts carregam automaticamente quando categoria é aceita */}
      <ConsentScriptLoader integrations={integrations} />

      <CookieBanner policyLinkUrl="/privacy-policy" />
    </ConsentProvider>
  )
}
```

### 📝 Textos ANPD Expandidos

```tsx
<ConsentProvider
  texts={{
    bannerMessage: 'Utilizamos cookies para melhorar sua experiência.',
    // Textos ANPD opcionais
    controllerInfo: 'Controlado por Empresa LTDA (CNPJ: 00.000.000/0001-00)',
    dataTypes: 'Coletamos dados de navegação, preferências e interações.',
    thirdPartySharing: 'Compartilhamos com: Google Analytics, Facebook Pixel',
    userRights: 'Você tem direito a acesso, correção e exclusão dos dados.',
    contactInfo: 'Contato DPO: dpo@empresa.com.br | (11) 9999-9999',
    retentionPeriod: 'Dados armazenados por até 12 meses.',
    lawfulBasis: 'Base legal: consentimento do titular dos dados.',
    transferCountries: 'Dados podem ser transferidos para: EUA, Irlanda.',
  }}
>
  {/* Os textos são exibidos condicionalmente apenas se definidos */}
</ConsentProvider>
```

## � Exemplo Completo

```tsx
import {
  ConsentProvider,
  CookieBanner,
  FloatingPreferencesButton,
} from 'react-lgpd-consent'

function App() {
  return (
    <ConsentProvider>
      <div>
        <h1>Meu Site</h1>
        <p>Conteúdo do site...</p>

        {/* Banner de cookies - Modal incluído automaticamente! */}
        <CookieBanner policyLinkUrl="/privacy-policy" blocking={true} />

        {/* Botão flutuante opcional para acesso às preferências */}
        <FloatingPreferencesButton position="bottom-right" />
      </div>
    </ConsentProvider>
  )
}
```

## �📖 Uso Básico

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
      {/* Modal de preferências incluído automaticamente! */}
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

> ✅ **O modal de preferências é incluído automaticamente pelo ConsentProvider!** Não é mais necessário renderizá-lo manualmente.

````

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
````

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

## ⚡ Carregamento Inteligente de Scripts

### Função loadScript

Scripts aguardam automaticamente o **consentimento finalizado** (banner fechado ou preferências salvas):

```tsx
import { loadScript } from 'react-lgpd-consent'

// Carrega script apenas após consentimento para analytics
await loadScript(
  'gtag',
  'https://www.googletagmanager.com/gtag/js?id=GA_ID',
  'analytics', // Categoria obrigatória
)

// Script geral (sempre carrega após consentimento)
await loadScript('custom-script', 'https://example.com/script.js')
```

### Comportamento Inteligente

- **Aguarda decisão final**: Não executa durante mudanças no modal de preferências
- **Só executa após salvar**: Scripts só rodam quando o usuário finaliza as preferências
- **Baseado em categoria**: Respeita as permissões por categoria

## 🎨 Personalização Total

### Modal de Preferências Customizado

Substitua completamente o modal padrão com seu próprio componente:

```tsx
import { ConsentProvider, useConsent } from 'react-lgpd-consent'
import MeuModalCustomizado from './MeuModalCustomizado'

function App() {
  return (
    <ConsentProvider
      PreferencesModalComponent={MeuModalCustomizado}
      preferencesModalProps={{ variant: 'custom' }}
    >
      <MeuApp />
    </ConsentProvider>
  )
}

// Seu componente customizado
function MeuModalCustomizado({ variant }) {
  const { isModalOpen, closePreferences, setPreference } = useConsent()

  return (
    <MyCustomDialog open={isModalOpen} onClose={closePreferences}>
      {/* Seu design personalizado aqui */}
    </MyCustomDialog>
  )
}
```

### Desabilitar Modal Automático

Para controle total, desabilite o modal automático:

```tsx
<ConsentProvider disableAutomaticModal>
  <MeuApp />
  {/* Renderize seus componentes customizados onde quiser */}
  <MeuModalTotalmenteCustomizado />
</ConsentProvider>
```

## �🔧 API Completa

### Components

| Componente                  | Descrição                                        | Props Principais                                                                         |
| --------------------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| `ConsentProvider`           | Provider principal do contexto                   | `initialState`, `texts`, `theme`, `hideBranding`, `PreferencesModalComponent`, callbacks |
| `CookieBanner`              | Banner de consentimento                          | `policyLinkUrl`, `blocking`, `hideBranding`, `debug`, pass-through MUI props             |
| `PreferencesModal`          | Modal de preferências (incluído automaticamente) | `DialogProps`, `hideBranding` - **Opcional**                                             |
| `FloatingPreferencesButton` | Botão flutuante para abrir preferências          | `position`, `hideWhenConsented`, `tooltip`, `icon`, `FabProps`                           |
| `ConsentGate`               | Renderização condicional por categoria           | `category`, `children`                                                                   |

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

- `loadScript(id, src, category?, attrs?)` - Carrega scripts com consentimento inteligente
- `defaultConsentTheme` - Tema padrão do Material-UI
- Tipos TypeScript completos exportados## 🌐 SSR / Next.js

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

## 🔮 Roadmap

### v0.2.1 - Compliance Avançado (Próxima Release)

**Baseado em feedback de uso real em projetos governamentais:**

- 📋 **Sistema de Logs de Auditoria**: Rastreamento completo para prestação de contas
- 📜 **Templates Setoriais**: Textos pré-configurados (governo, saúde, educação)
- 🎨 **Presets Visuais**: Identidade visual por setor (acessibilidade WCAG AAA)
- 📊 **Dashboard para DPOs**: Relatórios automáticos de compliance
- 🔌 **Mais Integrações**: Microsoft Clarity, Hotjar, Intercom, LinkedIn

### v0.3.0 - Multi-Regulamentação

- 🌍 **Suporte GDPR/CCPA**: Detecção automática por geolocalização
- 🏗️ **Sistema de Plugins**: Extensões de terceiros
- 🎭 **Temas Avançados**: Design system tokens

### v0.4.0 - Enterprise

- 📈 **Analytics Avançadas**: Dashboards completos
- 🔄 **Sync Multi-Domínio**: Consentimento compartilhado
- 🛡️ **Segurança Empresarial**: Criptografia, audit logs remotos

[📋 Ver plano detalhado v0.2.1](./docs/v0.2.1-PLAN.md)

---

<div align="center">

**Feito com ❤️ para a comunidade React brasileira**

</div>
