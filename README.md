# react-lgpd-consent 🍪

[![NPM Version](https://img.shields.io/npm/v/react-lgpd-consent?style=for-the-badge&color=blue)](http### 🚨 Sistema de Orientações para Desenvolvedores (v0.2.2)

A v0.2.2 inclui sistema inteligente que **orienta developers sobre configuração adequada para compliance LGPD**:

- 🧠 **Console Automático**: Avisos e sugestões sobre configuração
- 🎯 **UI Dinâmica**: Componentes se adaptam à configuração do projeto
- 🛡️ **Compliance por Design**: Previne problemas de conformidade LGPD
- 🔧 **Hooks Avançados**: `useCategories()` e `useCategoryStatus()` para controle total

**Desativando os Avisos:**

Por padrão, os avisos são desativados automaticamente em builds de produção (`process.env.NODE_ENV === 'production'`). Para desativá-los explicitamente em desenvolvimento, você pode usar a prop `disableDeveloperGuidance` no `ConsentProvider`:

```tsx
<ConsentProvider disableDeveloperGuidance={true}>
  {/* Sua aplicação */}
</ConsentProvider>
```

A forma anterior de desativar os avisos via `window.__LGPD_DISABLE_GUIDANCE__ = true` ainda funciona, mas o uso da prop é a forma **preferencial e mais idiomática** em React.


## 📖 Uso Básico - Configuração Consciente (v0.2.2)

### 1. Setup Básico (Compliance LGPD Automática)

````tsx
import { ConsentProvider, CookieBanner } from 'react-lgpd-consent'

function App() {
  return (
    <ConsentProvider
      // 🛡️ Especificar apenas categorias necessárias (Minimização de Dados LGPD)
      categories={{
        enabledCategories: ['analytics'], // Apenas analytics + necessary
      }}

      // � Textos ANPD para compliance (opcionais)
      texts={{
        bannerMessage: "Utilizamos cookies conforme LGPD...",
        controllerInfo: "Controlado por: Empresa XYZ - CNPJ: 00.000.000/0001-00",
        dataTypes: "Coletamos: dados de navegação para análise estatística",
        userRights: "Direitos: acessar, corrigir, excluir dados (dpo@empresa.com)"
      }}

      // 🔔 Callbacks para auditoria (opcionais)
      onConsentGiven={(state) => console.log('Consentimento registrado:', state)}
    >
      <CookieBanner policyLinkUrl="/politica-de-privacidade" />
      <YourApp />
    </ConsentProvider>
  )
}
```eact-lgpd-consent?style=for-the-badge)](https://github.com/lucianoedipo/react-lgpd-consent/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18%2B-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Material-UI](https://img.shields.io/badge/MUI-Ready-007FFF?style=for-the-badge&logo=mui)](https://mui.com/)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/react-lgpd-consent?style=for-the-badge&color=green)](https://bundlephobia.com/package/react-lgpd-consent)
[![Downloads](https://img.shields.io/npm/dm/react-lgpd-consent?style=for-the-badge&color=orange)](https://www.npmjs.com/package/react-lgpd-consent)

[![React](https://img.shields.io/badge/React-18%2B-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Material-UI](https://img.shields.io/badge/MUI-Ready-007FFF?style=for-the-badge&logo=mui)](https://mui.com/)

> **Biblioteca completa de consentimento de cookies para React e Next.js em conformidade com a LGPD**

Solução moderna, acessível e personalizável para gerenciar consentimento de cookies em aplicações React, com suporte completo a SSR, Material-UI e TypeScript.

## ✨ Características Principais

- 🇧🇷 **Conformidade LGPD + ANPD**: Cookie otimizado conforme Guia Orientativo da ANPD
- 🍪 **Categorias Configuráveis**: Sistema dinâmico - apenas categorias necessárias ao projeto
- 🛡️ **Princípio da Minimização**: Cookie contém apenas dados essenciais para compliance
- 🚀 **Integrações Nativas**: Google Analytics, Tag Manager, UserWay automatizados
- ⏰ **Auditoria Completa**: Timestamps e rastreabilidade para prestação de contas
- ⚡ **Client-Side First**: Arquitetura otimizada para SPA com zero-flash
- 🎨 **Material-UI Integration**: Componentes prontos e customizáveis com MUI
- ♿ **Acessibilidade**: Navegação por teclado e leitores de tela nativamente suportados
- 🌐 **Internacionalização**: Textos totalmente customizáveis (padrão pt-BR)
- 🚀 **TypeScript**: API completamente tipada para melhor DX
- 📦 **Zero Config**: Funciona out-of-the-box com configurações sensatas
- 🎯 **Granular Control**: Controle individual por categoria ativa
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
````

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

### 🛡️ Conformidade LGPD Rigorosa (v0.2.1)

**Princípio da Minimização**: Cookie contém apenas categorias realmente utilizadas:

```tsx
<ConsentProvider
  categories={{
    enabledCategories: ['analytics'], // Apenas analytics + necessary
    customCategories: [{
      id: 'governo',
      name: 'Integração Governamental',
      description: 'Cookies para sistemas gov.br',
      essential: false
    }]
  }}
  blocking={true} // Banner bloqueia até decisão explícita
>
```

**Cookie resultante** (apenas dados essenciais):

```json
{
  "version": "1.0",
  "consented": true,
  "preferences": { "necessary": true, "analytics": false, "governo": true },
  "consentDate": "2025-08-12T14:30:00.000Z",
  "lastUpdate": "2025-08-12T14:30:00.000Z",
  "source": "banner"
}
```

> 📋 **[Guia Completo de Conformidade LGPD](./docs/CONFORMIDADE-LGPD.md)**

### � Sistema de Orientações para Desenvolvedores

A v0.2.1 inclui sistema inteligente que **orienta developers sobre configuração adequada**:

```tsx
// ⚠️ Sem configuração - usa padrão e avisa
<ConsentProvider>
  <App />
</ConsentProvider>
// Console: "Usando padrão: necessary + analytics. Especificar para produção."

// ✅ Configuração explícita - recomendado
<ConsentProvider
  categories={{
    enabledCategories: ['analytics', 'marketing'],
    customCategories: [...]
  }}
>
  <App />
</ConsentProvider>
```

**Console de desenvolvimento** mostra automaticamente:

- 🟨 **Avisos**: Configuração faltante ou inconsistente
- 💡 **Sugestões**: Melhorias para compliance
- 🔧 **Tabela de categorias ativas**: Para UI customizada

> 📋 **[Sistema de Orientações Completo](./docs/ORIENTACOES-DESENVOLVIMENTO.md)**

### 🔧 Categorias Customizadas (API Legacy)

```tsx
// LEGACY: ainda suportado, mas deprecated
const customCategories = [
  {
    id: 'governo',
    name: 'Integração Governo',
    description: 'Cookies para integração com sistemas governamentais.',
    essential: false,
    cookies: ['gov_session', 'cpf_hash']
  }
]

<ConsentProvider customCategories={customCategories}>
  {/* Sua aplicação */}
</ConsentProvider>
```

### 🎨 Componentes UI Dinâmicos (v0.2.2)

Os componentes agora **renderizam automaticamente** baseado na configuração:

```tsx
import { useCategories, useCategoryStatus } from 'react-lgpd-consent'

// ✅ Modal customizado que se adapta às categorias ativas
function CustomPreferencesModal() {
  const { toggleableCategories } = useCategories()
  const { preferences, setPreferences } = useConsent()

  return (
    <dialog>
      {/* Renderiza APENAS categorias configuradas no projeto */}
      {toggleableCategories.map((category) => (
        <label key={category.id}>
          <input
            type="checkbox"
            checked={preferences[category.id] ?? false} // ✅ Controlado
            onChange={(e) =>
              setPreferences({
                ...preferences,
                [category.id]: e.target.checked,
              })
            }
          />
          <strong>{category.name}</strong>
          <p>{category.description}</p>
        </label>
      ))}
    </dialog>
  )
}

// ✅ Feature condicional baseada em configuração
function AnalyticsDashboard() {
  const analytics = useCategoryStatus('analytics')

  if (!analytics.isActive) {
    return null // Categoria não configurada - não renderiza
  }

  return <div>Dashboard só aparece se analytics estiver configurado!</div>
}
```

**Benefícios:**

- ✅ **Zero bugs**: UI sempre consistente com configuração
- ✅ **Performance**: Não renderiza categorias não utilizadas
- ✅ **Manutenibilidade**: Mudou configuração? UI atualiza automaticamente
- ✅ **Orientação**: Console avisa sobre inconsistências

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
| `ConsentProvider`           | Provider principal do contexto                   | `initialState`, `texts`, `theme`, `hideBranding`, `PreferencesModalComponent`, `disableDeveloperGuidance`, callbacks |
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

### ✅ v0.2.2 - Sistema de Orientações (Lançado!)

**Implementado: Sistema inteligente de orientação para desenvolvedores**

- ✅ **Console de Desenvolvimento**: Avisos automáticos e orientações
- ✅ **UI Dinâmica**: Componentes se adaptam à configuração do projeto
- ✅ **Hooks Avançados**: `useCategories()` e `useCategoryStatus()`
- ✅ **Validação Automática**: Prevenção de bugs de configuração vs UI

### v0.2.3 - Compliance Avançado (Próxima Release)

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

> 📋 **Implementado na v0.2.2**: Sistema de orientações para developers e UI dinâmica

---

<div align="center">

**Feito com ❤️ para a comunidade React brasileira**

</div>
