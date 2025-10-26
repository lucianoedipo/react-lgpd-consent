<div align="center">
  <h1>react-lgpd-consent 🍪</h1>
  <p><strong>Uma biblioteca React para gerenciamento de consentimento de cookies em conformidade com a LGPD.</strong></p>

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

  <div>
    <a href="https://codecov.io/gh/lucianoedipo/react-lgpd-consent"><img src="https://img.shields.io/codecov/c/github/lucianoedipo/react-lgpd-consent?style=for-the-badge&logo=codecov&logoColor=white" alt="Coverage"></a>
    <a href="https://bundlephobia.com/package/react-lgpd-consent"><img src="https://img.shields.io/bundlephobia/minzip/react-lgpd-consent?style=for-the-badge&logo=webpack&logoColor=white" alt="Bundle Size"></a>
    <a href="https://nodejs.org"><img src="https://img.shields.io/node/v/react-lgpd-consent?style=for-the-badge&logo=node.js&logoColor=white" alt="Node Version"></a>
  </div>

  <br />

  <p>
    <a href="#-instalação"><strong>Instalação</strong></a> •
    <a href="#-uso-básico"><strong>Uso Básico</strong></a> •
  <a href="./QUICKSTART.md"><strong>📚 Guia de Início Rápido</strong></a> •
  <a href="#-documentação-completa"><strong>Documentação</strong></a> •
  <a href="./README.en.md">🇺🇸 🇬🇧 English</a> •
    <a href="#-como-contribuir"><strong>Contribuir</strong></a>
  </p>

  <!-- Quickstart callout (mantido) -->
  <p align="center">
    <a href="./QUICKSTART.md"><img src="https://img.shields.io/badge/Quickstart-Iniciar%20R%C3%A1pido-blue?style=for-the-badge&logo=book" alt="Quickstart"></a>
  </p>

  <p align="center"><strong>Comece por aqui:</strong> siga o <a href="./QUICKSTART.md">Guia de Início Rápido (QUICKSTART.md)</a> para um tutorial passo-a-passo, exemplos TypeScript, tabela de props e integração com MUI — recomendado para usuários novos.</p>
</div>

---

## 🚀 Instalação

### Opção 1: Pacote Completo (UI + Lógica)

```bash
npm install @react-lgpd-consent/mui @mui/material @emotion/react @emotion/styled
```

### Opção 2: Core Apenas (Headless - sem UI)

```bash
npm install @react-lgpd-consent/core
```

### Opção 3: Pacote Agregador (Compatibilidade v0.4.x)

```bash
npm install react-lgpd-consent @mui/material @emotion/react @emotion/styled
```

**Dependências:**
- **Core**: `react@>=18`, `react-dom@>=18`, `js-cookie@3`, `zod@4`
- **MUI (apenas se usar UI)**: `@mui/material@>=5`, `@emotion/react`, `@emotion/styled`
- **Opcional**: `@mui/icons-material` (para ícones customizados)

**Qual escolher?**
- 🎨 **Use `@react-lgpd-consent/mui`** se quer componentes prontos com Material-UI (~104 KB)
- ⚡ **Use `@react-lgpd-consent/core`** se vai criar UI customizada ou usar outra lib de componentes (~86 KB)
- 🔄 **Use `react-lgpd-consent`** para manter compatibilidade com v0.4.x (~104 KB)

> 📖 **Migrando de v0.4.x?** Consulte o [Guia de Migração](./MIGRATION.md)

---

## ✨ Novidades v0.5.0

### 🏗️ Arquitetura Modular

- **Três pacotes independentes**:
  - `@react-lgpd-consent/core` — Lógica headless de consentimento (sem dependências de UI)
  - `@react-lgpd-consent/mui` — Componentes UI completos usando Material-UI
  - `react-lgpd-consent` — Pacote agregador (mantido para compatibilidade)

- **Tree-shaking eficiente**: Instale apenas o que você precisa
  - Core: 86 KB ESM (lógica pura)
  - MUI: +18 KB (componentes UI)
  
- **Flexibilidade total**:
  - Use core com sua própria biblioteca de componentes
  - Use mui para componentes prontos
  - Use react-lgpd-consent para compatibilidade

- **Breaking Changes**:
  - ❌ Removida prop `theme` do `ConsentProvider`
  - ✅ Use `ThemeProvider` do Material-UI diretamente
  - 📖 Ver [MIGRATION.md](./MIGRATION.md) para detalhes completos

### 📦 Workspace PNPM
- Monorepo organizado com workspaces
- Scripts unificados com filtros
- Build independente por pacote
- Publicação npm separada

### 🔄 Migração Simplificada
- Pacote `react-lgpd-consent` mantido para compatibilidade
- Guia de migração completo disponível
- Zero breaking changes para usuários do pacote agregador

---

## ✨ Novidades v0.4.5

### 📊 DataLayer Events para Google Tag Manager
- **Eventos Padronizados**: `consent_initialized` e `consent_updated` disparados automaticamente
- **Rastreamento de Origem**: Identifica se decisão veio do banner, modal, reset ou API programática
- **Auditoria LGPD**: Histórico completo de mudanças com `changed_categories` e timestamps ISO 8601
- **Integração GTM**: Documentação completa com exemplos de triggers e tags
- **API Pública**: Funções `pushConsentInitializedEvent` e `pushConsentUpdatedEvent` exportadas

### 🔧 Melhorias de CI/CD
- **Migração para pnpm**: Workflows atualizados de npm para pnpm, resolvendo conflitos de dependências
- **Build Otimizado**: Pipeline mais rápido e confiável

---

## ✨ Novidades v0.4.4

### 🔧 CI/CD e Publicação
- **Workflow de Publicação**: Corrigido bug que impedia publicação automática no npm quando tags eram criadas após merge para `main`
- **Codecov Integration**: Adicionado upload automático de coverage reports para melhor visualização de cobertura de testes
- **Badge de Coverage**: Agora atualizado em tempo real via Codecov

### 📊 Qualidade e Confiabilidade
- **Publicação Confiável**: Tags agora são publicadas corretamente quando commit está no histórico da `main`
- **Visibilidade de Cobertura**: Integração completa com Codecov para tracking de qualidade

---

## ✨ Novidades v0.4.1

### 🎨 Design Tokens Expandidos
- **200+ pontos de customização** (cores, tipografia, espaçamento, layout)
- **Sistema responsivo** com breakpoints e variações
- **Acessibilidade nativa** com contrast ratios e focus states
- **Temas light/dark/auto** com transições suaves

### 📝 Sistema Avançado de Textos
- **Templates pré-configurados** para ecommerce, SaaS e governo
- **Internacionalização completa** (pt, en, es)
- **Variações de tom** (formal, casual, técnico)
- **Resolução automática** baseada em contexto

### 🔍 Descoberta de Cookies (Experimental)
- **Detecção automática** de cookies em runtime
- **Categorização inteligente** usando padrões LGPD
- **Integração nativa** com sistema de override

### ⚠️ Breaking Changes
- **Suporte a categorias customizadas**: `setPreference` e `ScriptIntegration.category` agora usam `string` ao invés de `Category`  
- **Impacto mínimo**: Código usando strings literais continua funcionando sem alterações
- **Consulte**: [CHANGELOG.md](./CHANGELOG.md) para guia de migração completo

---

## 🏗️ Arquitetura de Pacotes

A biblioteca está organizada em três pacotes independentes para máxima flexibilidade:

```
react-lgpd-consent/
├── @react-lgpd-consent/core      # Lógica headless (86 KB)
│   ├── ConsentProvider           # Context provider
│   ├── useConsent                # Hook principal
│   ├── scriptIntegrations        # GA, GTM, UserWay
│   └── utilities                 # Logger, cookies, scripts
│
├── @react-lgpd-consent/mui       # Componentes UI (18 KB + core)
│   ├── CookieBanner             # Banner de consentimento
│   ├── PreferencesModal         # Modal de preferências
│   ├── FloatingPreferencesButton # Botão flutuante
│   └── Branding                 # Logo/branding
│
└── react-lgpd-consent            # Agregador (compatibilidade)
    └── Re-exports @react-lgpd-consent/mui
```

### Comparativo de Pacotes

| Aspecto | Core | MUI | Agregador |
|---------|------|-----|-----------|
| **Tamanho** | 86 KB ESM | 104 KB (core + mui) | 104 KB |
| **UI Incluída** | ❌ | ✅ | ✅ |
| **Dep. MUI** | ❌ | ✅ (peer) | ✅ (peer) |
| **Customização** | ✅✅✅ Total | ✅✅ Alta | ✅✅ Alta |
| **Setup** | Manual UI | Plug & Play | Plug & Play |
| **Tree-shaking** | ✅✅✅ Ótimo | ✅✅ Bom | ✅✅ Bom |
| **Recomendado para** | UI própria | Maioria dos casos | Migração v0.4.x |

---

## 🎯 Casos de Uso

### Quando usar `@react-lgpd-consent/core`

✅ Você já tem um design system próprio  
✅ Está usando Tailwind, Chakra, shadcn/ui, etc.  
✅ Quer máximo controle sobre a UI  
✅ Precisa minimizar bundle size  
✅ Projeto não usa Material-UI  

**Exemplo:**
```tsx
import { ConsentProvider, useConsent } from '@react-lgpd-consent/core'

function MyBanner() {
  const { acceptAll, declineAll } = useConsent()
  return <div className="my-design">{/* Sua UI */}</div>
}
```

### Quando usar `@react-lgpd-consent/mui`

✅ Quer começar rápido com componentes prontos  
✅ Já usa Material-UI no projeto  
✅ Precisa de LGPD compliance out-of-the-box  
✅ Quer acessibilidade nativa (WCAG 2.1)  
✅ Aceita customização via design tokens  

**Exemplo:**
```tsx
import { ConsentProvider, CookieBanner } from '@react-lgpd-consent/mui'

function App() {
  return (
    <ConsentProvider categories={{ enabledCategories: ['analytics'] }}>
      <CookieBanner /> {/* Pronto para usar! */}
    </ConsentProvider>
  )
}
```

### Quando usar `react-lgpd-consent`

✅ Está migrando de v0.4.x  
✅ Quer compatibilidade máxima  
✅ Prefere pacote único tradicional  

---

## 🚦 Início Rápido

### Setup Mínimo (30 segundos)

```tsx
// 1. Instale
// npm install @react-lgpd-consent/mui @mui/material @emotion/react @emotion/styled

// 2. Importe
import { ConsentProvider, CookieBanner } from '@react-lgpd-consent/mui'

// 3. Use
function App() {
  return (
    <ConsentProvider categories={{ enabledCategories: ['analytics'] }}>
      <CookieBanner />
      <YourApp />
    </ConsentProvider>
  )
}
```

### Setup com Google Analytics

```tsx
import { ConsentProvider, CookieBanner, createGoogleAnalyticsIntegration } from '@react-lgpd-consent/mui'

const ga = createGoogleAnalyticsIntegration('G-XXXXXXXXXX')

function App() {
  return (
    <ConsentProvider
      categories={{ enabledCategories: ['analytics'] }}
      integrations={[ga]}
    >
      <CookieBanner />
      <YourApp />
    </ConsentProvider>
  )
}
```

### Setup Headless (Core)

```tsx
import { ConsentProvider, useConsent } from '@react-lgpd-consent/core'

function CustomBanner() {
  const { acceptAll, declineAll, consented } = useConsent()
  if (consented) return null
  
  return (
    <div className="fixed bottom-0 bg-gray-900 text-white p-4">
      <button onClick={acceptAll}>Aceitar Cookies</button>
      <button onClick={declineAll}>Apenas Necessários</button>
    </div>
  )
}

function App() {
  return (
    <ConsentProvider categories={{ enabledCategories: ['analytics'] }}>
      <CustomBanner />
      <YourApp />
    </ConsentProvider>
  )
}
```

---

## 📖 Uso Básico

Envolva sua aplicação com o `ConsentProvider` (exemplo mínimo):

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

## Nota sobre ThemeProvider e tema padrão

A biblioteca não cria um `ThemeProvider` global automaticamente. Ela tenta herdar o tema do seu app quando você já possui um `ThemeProvider` do MUI. Se você quiser aplicar explicitamente um tema de fallback para os componentes de consentimento, use a fábrica exportada `createDefaultConsentTheme()` e passe via prop `theme`:

```tsx
import { ConsentProvider, createDefaultConsentTheme } from 'react-lgpd-consent'

// Aplica um tema de fallback somente para os componentes da lib
;<ConsentProvider
  theme={createDefaultConsentTheme()}
  categories={{ enabledCategories: ['analytics'] }}
>
  <App />
</ConsentProvider>
```

Evite depender de criação de tema no import (isso evita side-effects e problemas em SSR). Se você precisar de compatibilidade retroativa com quem importava `defaultConsentTheme`, entre em contato para adicionarmos um export compatível com deprecação documentada.

## 📚 Documentação Completa

Para mais detalhes sobre customização, hooks e funcionalidades, consulte os seguintes guias:

### 📋 Documentação Principal

- **[📚 Guia de Início Rápido (`QUICKSTART.md`)](./QUICKSTART.md)**: Tutorial passo a passo com exemplos práticos, tabela completa de props, debugging e integrações.
  - Seção recomendada: “SSR/Next.js (App Router) — Padrões seguros” com boas práticas de `'use client'`, `dynamic({ ssr: false })` e ordem dos provedores/estilos (MUI/Emotion) para evitar hydration mismatch.
  - Novo na v0.4.0: suporte a `customCategories` — veja a seção “Categorias customizadas (customCategories)” no Quickstart.
  - Novo na v0.4.1: integrações nativas para Facebook Pixel, Hotjar, Mixpanel, Clarity, Intercom e Zendesk — veja o guia [INTEGRACOES.md](./INTEGRACOES.md).
  - Dica: use `designTokens.layout.backdrop: 'auto'` para backdrop sensível ao tema no banner bloqueante.
  - Auto-config de categorias: a biblioteca detecta categorias requeridas pelas integrações e exibe os toggles mesmo se você esquecer de habilitar (valor inicial sempre rejeitado). Recomendamos explicitar em `categories.enabledCategories` para clareza.
  - Páginas de Política/Termos não bloqueadas: se `policyLinkUrl` e/ou `termsLinkUrl` apontarem para a página atual, o overlay bloqueante não é aplicado — garantindo legibilidade destas páginas.
- **[Guia da API (`API.md`)](./API.md)**: Referência completa de todos os componentes, hooks e tipos.
- **[Guia de Conformidade (`CONFORMIDADE.md`)](./CONFORMIDADE.md)**: Detalhes sobre as funcionalidades de conformidade com a LGPD.
- **[Guia de Integrações (`INTEGRACOES.md`)](./INTEGRACOES.md)**: Como usar as integrações nativas e criar as suas.

### 🎨 Documentação Interativa (GitHub Pages)

- **[📖 Storybook - Playground Interativo](https://lucianoedipo.github.io/react-lgpd-consent/storybook/)**: Explore e teste todos os componentes em tempo real com controles interativos.
- **[⚙️ TypeDoc - Referência de API](https://lucianoedipo.github.io/react-lgpd-consent/docs/)**: Documentação completa da API gerada automaticamente.
- **[🏠 Portal de Documentação](https://lucianoedipo.github.io/react-lgpd-consent/)**: Página inicial com navegação entre todas as documentações.

---

## 🤝 Como Contribuir

1. Abra uma [Issue](https://github.com/lucianoedipo/react-lgpd-consent/issues) para bugs ou melhorias.
2. Siga o Guia de Desenvolvimento em `DEVELOPMENT.md` para enviar um PR.

---

## 📄 Licença

MIT — veja o arquivo `LICENSE`.
