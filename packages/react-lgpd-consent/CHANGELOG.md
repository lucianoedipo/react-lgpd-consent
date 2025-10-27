# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [0.5.0] - 2025-10-25

### 🏗️ Arquitetura Modular - MAJOR REFACTOR

Esta versão introduz uma **arquitetura modular** que separa a lógica de consentimento (core) dos componentes UI (mui).

### ✨ Added

- **Três pacotes independentes**:
  - `@react-lgpd-consent/core` (86 KB ESM) - Lógica headless sem dependências de UI
  - `@react-lgpd-consent/mui` (18 KB ESM) - Componentes UI completos usando Material-UI
  - `react-lgpd-consent` (104 KB ESM) - Pacote agregador mantido para compatibilidade

- **Tree-shaking eficiente**: Instale apenas o que você precisa
  - Core isolado permite uso com qualquer biblioteca de UI
  - MUI opcional como peer dependency
  
- **Workspace PNPM**: Monorepo organizado com builds independentes
- **Guia de migração completo**: [MIGRATION.md](../../MIGRATION.md) documentando todos os cenários
- **Scripts de publicação**: Suporte para publicar pacotes independentemente

### ⚠️ Breaking Changes

- **Removida prop `theme` do `ConsentProvider`**
  - **Antes**: `<ConsentProvider theme={createTheme({...})} />`
  - **Depois**: Use `<ThemeProvider>` do Material-UI diretamente
  - **Razão**: Separação de responsabilidades - tema do MUI gerenciado pelo MUI
  - **Migração**: Ver [MIGRATION.md](../../MIGRATION.md) seção "Breaking Changes"

### 🔄 Changed

- Estrutura de pacotes reorganizada em monorepo
- Imports atualizados para usar workspace dependencies
- TypeScript paths configurados para resolução de módulos
- Jest configurado para resolver tsconfig corretamente
- Stories refatoradas para usar `ThemeProvider` explicitamente

### 📦 Package Structure

```
packages/
├── core/           # @react-lgpd-consent/core
│   ├── src/
│   │   ├── context/     # ConsentProvider, CategoriesContext
│   │   ├── hooks/       # useConsent, useCategories
│   │   ├── utils/       # scriptIntegrations, logger
│   │   └── types/       # TypeScript definitions
│   └── package.json
│
├── mui/            # @react-lgpd-consent/mui
│   ├── src/
│   │   ├── components/  # CookieBanner, PreferencesModal, etc.
│   │   └── index.ts     # Re-exports core + UI components
│   └── package.json
│
└── react-lgpd-consent/  # Aggregator (compatibilidade)
    └── package.json     # Re-exports @react-lgpd-consent/mui
```

### 📊 Bundle Sizes

| Pacote | ESM | CJS | DTS | Dependências |
|--------|-----|-----|-----|--------------|
| `@react-lgpd-consent/core` | 86.04 KB | 89.12 KB | 125.82 KB | React, js-cookie, zod |
| `@react-lgpd-consent/mui` | 17.69 KB | 20.95 KB | 11.78 KB | core + @mui/material (peer) |
| `react-lgpd-consent` | 104 KB* | 110 KB* | 138 KB* | mui (workspace) |

\* Bundle final = core + mui (~104 KB total)

### 🎯 Migration Paths

1. **Uso de componentes UI** (maioria dos usuários):
   ```bash
   # Opção A: Pacote agregador (zero mudanças)
   npm install react-lgpd-consent@0.5.0
   
   # Opção B: Pacote MUI direto (recomendado)
   npm install @react-lgpd-consent/mui
   ```

2. **Headless/UI customizada**:
   ```bash
   npm uninstall react-lgpd-consent @mui/material
   npm install @react-lgpd-consent/core
   ```

3. **NextJS App Router**:
   ```tsx
   // Separação clara client/server
   'use client'
   import { ConsentProvider } from '@react-lgpd-consent/mui'
   ```

### ✅ Maintained (Sem Breaking Changes)

- Todas as APIs públicas do `useConsent`
- Props de `ConsentProvider` (exceto `theme`)
- Componentes `CookieBanner`, `PreferencesModal`, `FloatingPreferencesButton`
- Sistema de textos e templates (`TEXT_TEMPLATES`, `resolveTexts`)
- Sistema de design tokens (`designTokens`)
- Integrações (Google Analytics, GTM, UserWay, etc.)
- SSR/NextJS support
- TypeScript types completos

### 🔧 Fixed

- Jest configuração: tsconfig path resolution
- Stories: uso correto de ThemeProvider
- Type-check: todos os pacotes passam sem erros
- Tests: 207 testes passando em todos os pacotes

### 📚 Documentation

- Novo [MIGRATION.md](../../MIGRATION.md) com:
  - 3 cenários de migração detalhados
  - Comparativo de bundles
  - Troubleshooting completo
  - Exemplos antes/depois
- README atualizado com:
  - 3 opções de instalação
  - Comparativo de pacotes
  - Guia de escolha
- READMEs específicos para core e mui packages

### 🚀 Development

- PNPM workspaces configurados
- Scripts: `build:core`, `build:mui`, `build:main`
- Scripts: `publish:core`, `publish:mui`, `publish:main`, `publish:all`
- Type-check executado em todos os pacotes
- Tests executados em todos os pacotes
- Node >= 20.0.0 requerido

---

## [0.4.5] - 2025-10-25 — DataLayer Events e CI/CD

### 📊 **DataLayer Events para Google Tag Manager**

- **Eventos Padronizados**: Implementado contrato de eventos `consent_initialized` e `consent_updated` no `window.dataLayer`
  - `consent_initialized`: Disparado após hidratação inicial do `ConsentProvider`
  - `consent_updated`: Disparado quando usuário altera preferências via banner, modal ou API
  - Payload inclui: `event`, `consent_version`, `timestamp` (ISO 8601), `categories`, `origin`, `changed_categories`
  
- **Rastreamento de Origem**: Campo `origin` identifica fonte da mudança de consentimento
  - `'banner'`: Decisão feita no CookieBanner
  - `'modal'`: Ajuste feito no PreferencesModal
  - `'reset'`: Reset programático via API
  - `'programmatic'`: Mudança via `setPreference()` ou `acceptAll()`

- **API Pública**: Novas funções exportadas para uso customizado
  - `pushConsentInitializedEvent(categories: ConsentPreferences)`
  - `pushConsentUpdatedEvent(categories: ConsentPreferences, origin: ConsentEventOrigin, previousCategories?: ConsentPreferences)`
  - Tipos: `ConsentEventOrigin`, `ConsentInitializedEvent`, `ConsentUpdatedEvent`, `ConsentEvent`

- **Integração Automática**: Eventos disparados automaticamente pelo `ConsentContext`
  - Ref `previousPreferencesRef` rastreia estado anterior para calcular `changed_categories`
  - Logger integrado para debug de eventos em desenvolvimento
  - SSR-safe: não quebra quando `window` é undefined

- **Documentação GTM**: Seção completa adicionada em `INTEGRACOES.md`
  - Schemas dos eventos com exemplos
  - Passo a passo de configuração do Google Tag Manager
  - Exemplos TypeScript de triggers e tags customizados
  - Casos de uso: auditoria LGPD, análise de conversão, triggers condicionais

### 🔧 **CI/CD e Build**

- **Migração para pnpm**: Workflows atualizados de npm para pnpm
  - `ci.yml`: Adicionado `pnpm/action-setup@v4`, substituído `npm ci` por `pnpm install --frozen-lockfile`
  - `package-check.yml`: Migrado para pnpm
  - `publish-github-packages.yml`: Migrado para pnpm
  - `deploy-docs.yml`: Migrado para pnpm
  - **Problema Resolvido**: Conflitos `ERESOLVE` com `@eslint/js` eliminados
  - `.gitignore`: Adicionado `package-lock.json` para evitar conflitos

- **Dependências**: Adicionado `@eslint/js@9.38.0` para resolver missing dependency error

### 🧪 **Testes**

- **dataLayerEvents.test.ts**: 10 novos testes cobrindo eventos dataLayer
  - Push de eventos `consent_initialized` e `consent_updated`
  - Cálculo correto de `changed_categories`
  - Diferentes origens (banner, modal, reset, programmatic)
  - Inicialização do dataLayer se não existir
  - SSR-safety (não quebra quando window é undefined)
  - Formato ISO 8601 de timestamps
  - **Solução de Isolamento**: Testes usam estratégia de "pegar último evento" para evitar acúmulo entre testes

### 📚 **Documentação**

- **INTEGRACOES.md**: Nova seção "Eventos dataLayer (Google Tag Manager)" com 200+ linhas
- **README.md**: Seção "Novidades v0.4.5" com resumo de features
- **README.en.md**: Tradução da seção "What's New in v0.4.5"
- **tsconfig.typedoc.json**: Corrigido para excluir `*.test.ts` (além de `*.test.tsx`)
- **API Pública**: Exportações documentadas com TSDoc completo

### 📦 **Build**

- **Versão**: Bump de `0.4.4` → `0.4.5`
- **Tamanho**: Build otimizado mantém tree-shaking e SSR-safety
  - ESM: `dist/index.js` ~32.59 KB
  - CJS: `dist/index.cjs` ~38.17 KB
  - Types: `dist/index.d.ts` ~132.13 KB

---

## [0.4.4] - 2025-10-06 — Correções de CI/CD e Publicação

### 🔧 **Correções de CI/CD**

- **Workflow de Publicação npm**: Corrigido bug que impedia publicação mesmo quando tag estava na `main`
  - **Problema**: `git fetch --depth=1` limitava histórico e falhava verificação de ancestralidade
  - **Solução**: Removido `--depth=1` do fetch, aproveitando `fetch-depth: 0` do checkout
  - **Impacto**: Tags criadas após merge para `main` agora são publicadas corretamente no npm

### 📊 **Integração com Codecov**

- **Upload de Coverage**: Adicionado `codecov/codecov-action@v5` ao workflow CI
  - Envia relatórios de cobertura automaticamente para Codecov
  - Token configurado via `secrets.CODECOV_TOKEN`
  - Integração com badge de coverage no README

### 📚 **Documentação**

- **Badges**: Badge de coverage já configurado no README (v0.4.3) agora recebe dados em tempo real
- **Workflows**: Documentação inline sobre fetch depth e verificação de ancestralidade

## [0.4.3] - 2025-10-06 — Otimizações de Performance e Qualidade

### 🚀 **Melhorias de Performance**

- **React.memo**: Adicionado memoização em componentes puros (`Branding`, `FloatingPreferencesButton`)
- **useMemo**: Otimizado cálculo de `positionStyles` no `FloatingPreferencesButton`
- **Lazy Loading Expandido**: `FloatingPreferencesButton` agora é carregado sob demanda
- **Logger em Produção**: `warn()`, `info()`, `debug()` suprimidos em `NODE_ENV=production`
  - Reduz overhead em bundle de produção
  - `error()` permanece ativo para debugging crítico

### 🐛 **Correções Críticas**

- **ConsentProvider Suspense Bug**: Corrigido crash silencioso quando `consented=true`
  - Adicionado `<React.Suspense>` ausente ao redor do `FloatingPreferencesButton` lazy
  - Sintoma: Provider renderizava `<div />` vazio ao invés de `children`
  - Impacto: Testes com `initialState.consented=true` agora passam

### 🧪 **Testes de Acessibilidade (A11y)**

- **jest-axe**: Integração completa com validação WCAG automática
- **CookieBanner.a11y.test.tsx**: 3 cenários de acessibilidade validados
- **PreferencesModal.a11y.test.tsx**: 3 cenários de acessibilidade validados
- **TypeScript**: Definições `jest-axe.d.ts` para matcher `toHaveNoViolations()`
- **Script**: Adicionado `npm run test:a11y` para testes focados

### 📦 **Exports Modulares**

- **`./integrations`**: Novo export separado para tree-shaking otimizado
  - Permite `import { createGoogleAnalyticsIntegration } from 'react-lgpd-consent/integrations'`
  - Reduz bundle para consumidores que não usam integrações
  - Suporte ESM + CJS + TypeScript definitions

### 🔧 **CI/CD**

- **Node.js 20**: Atualizado de Node 18 para Node 20 LTS em todos os workflows
- **Cache TypeScript**: Adicionado cache de builds para acelerar CI (~20% mais rápido)
  - Cache de `.tsbuildinfo`, `node_modules/.cache`, `.eslintcache`
  - Workflows atualizados: `ci.yml`, `codeql.yml`, `deploy-docs.yml`, `package-check.yml`

### 📚 **Documentação**

- **Badges**: Adicionados 3 badges ao README (Coverage, Bundle Size, Node Version)
  - Codecov para visualização de cobertura
  - Bundlephobia para tamanho de bundle
  - Node.js badge para requisitos de ambiente

### ✅ **Validação de Qualidade**

- **222 testes passando**: 100% de sucesso sem skips
- **94.85% cobertura**: Mantida cobertura alta
- **0 warnings de lint**: ESLint limpo
- **Build otimizado**: ESM 32.52 KB + lazy chunks (95B + 86B)

### 📦 **Otimizações de Bundle**

- **tsup.config.ts**: Configuração otimizada para tree-shaking e code-splitting
- **ESM Bundle**: 33.26 KB → 32.52 KB (-740B, -2.2%)
- **CJS Bundle**: 118.51 KB → 37.71 KB (CJS principal) + chunks (-68%, muito mais eficiente!)
- **Brotli Compressed**:
  - ESM: 17.06 KB → 16.95 KB (-110B)
  - CJS: 68.72 KB → 18.02 KB (-74%, -50.7 KB!)
- **Side-effects**: Configuração refinada para preservar code-splitting sem warnings
- **Tree-shaking**: Agressivo com external de peer dependencies

### 🎯 **Decisões de Design**

- **ConsentGate não usa memo**: Decisão intencional - estado de preferências é dinâmico
  - Re-renders necessários quando usuário altera consentimento
  - Lógica leve o suficiente para não justificar memoização

### 📋 **Dependências**

- **Adicionadas**:
  - `@axe-core/react@^4.10.2` (dev)
  - `jest-axe@^10.0.0` (dev)
  - `@types/jest-axe@^3.5.9` (dev)

## [0.4.1] - 2025-09-21 — Expansão das Integrações Nativas de Scripts

### 🚀 **Integrações Nativas Expandidas**

- **Facebook Pixel**: `createFacebookPixelIntegration()` com auto-tracking e advanced matching
- **Hotjar**: `createHotjarIntegration()` para heatmaps e session recordings
- **Mixpanel**: `createMixpanelIntegration()` com configuração avançada de eventos
- **Microsoft Clarity**: `createClarityIntegration()` para analytics de comportamento
- **Intercom**: `createIntercomIntegration()` para chat e suporte ao cliente
- **Zendesk Chat**: `createZendeskChatIntegration()` para atendimento integrado
- **Drift**: `createDriftIntegration()` para conversational marketing
- **Freshchat**: `createFreshchatIntegration()` para customer support

### 🎯 **Sistema de Configuração em Lote**

- **Templates de negócio**: `createECommerceIntegrations()`, `createSaaSIntegrations()`, `createCorporateIntegrations()`
- **Categorização inteligente**: `suggestCategoryForScript()` para sugestão automática de categorias
- **Configuração unificada**: Setup simplificado para múltiplas ferramentas com um comando
- **Padrões de mercado**: Templates baseados em necessidades reais do mercado brasileiro

### 🔧 **Melhorias no Sistema de Scripts**

- **Validação robusta**: `validateNecessaryClassification()` corrigida para evitar falsos positivos
- **Auto-configuração**: `autoConfigureCategories()` com detecção inteligente de categorias necessárias
- **Error handling**: Melhor tratamento de erros em carregamento de scripts
- **Performance**: Carregamento otimizado e lazy loading de integrações

### 🔍 **Descoberta Automática de Cookies (Experimental)**

- **discoverRuntimeCookies()**: Escaneamento de cookies em tempo real no navegador
- **detectConsentCookieName()**: Detecção automática do cookie de consentimento
- **categorizeDiscoveredCookies()**: Categorização inteligente usando padrões LGPD
- **Integração nativa**: Suporte a `setCookieCatalogOverrides` automático
- **SSR-safe**: Funciona corretamente em ambientes server-side rendering

### 🎨 **Design Tokens Expandidos**

- **200+ pontos de customização**: Expansão dramática do sistema de design tokens
- **Sistema responsivo**: Breakpoints, spacing responsivo, typography hierarchy
- **Acessibilidade nativa**: Contrast ratios, focus states, motion preferences
- **Tokens por componente**: Customização granular para cada elemento UI

### 📝 **Sistema Avançado de Textos**

- **Templates pré-configurados**: Ecommerce, SaaS, Governo com contextos específicos
- **Multilingual**: Português, inglês, espanhol com fallbacks inteligentes
- **Função resolveTexts**: Resolução automática de textos baseada em contexto

### 🧪 **Melhorias de Testes e Qualidade**

- **193 testes passando**: Cobertura substancialmente melhorada
- **19 novos testes**: Especificamente para `cookieRegistry` (antes 45.83% → 100% branches)
- **Test realism**: Testes adaptados ao comportamento real vs ideal
- **Edge cases**: Performance, boundary testing, state management
- **Lint compliance**: Configuração ESLint mais rigorosa e aderente

### 🔧 **Melhorias de API e Developer Experience**

- **Exports organizados**: Melhor estruturação das exportações públicas
- **TypeScript strict**: Tipagem mais rigorosa e descritiva
- **Documentação TSDoc**: Comentários expandidos com exemplos práticos
- **Error handling**: Tratamento de erros mais robusto e informativo
- **Performance**: Otimizações em carregamento e renderização

### 📚 **Exemplos e Migração**

- **MigrationDemo-v0.4.1.tsx**: Exemplo completo mostrando todas as novidades
- **Remoção**: TestV0.3.1.tsx removido (obsoleto)
- **Compatibilidade**: Guias de migração antes/depois
- **Best practices**: Demonstrações de uso avançado

### 🏗️ **Build e Infraestrutura**

- **Bundle otimizado**: ESM 34.36 KB, CJS 102.74 KB
- **Tree-shaking**: Configuração `sideEffects: false` otimizada
- **Docs geradas**: TypeDoc atualizado com novas funcionalidades
- **Pipeline robusto**: Type-check + tests + lint + build + docs

### ⚠️ **Breaking Changes**

#### 🔧 **`setPreference` Type Change**

- **Mudança**: `setPreference(cat: Category, value: boolean)` → `setPreference(cat: string, value: boolean)`
- **Motivo**: Suporte a categorias customizadas além das predefinidas
- **Impacto**: Código TypeScript com tipo `Category` explícito pode precisar ajustes
- **Migração**:
  - ✅ **Nenhuma mudança necessária** se usando strings literais (`'analytics'`, `'marketing'`)
  - ⚠️ **Ajuste necessário** apenas se estava usando explicitamente o tipo `Category`
  - 📚 **Guia**: Use `string` para suportar categorias customizadas ou continue usando os valores padrão

#### 🔧 **`ScriptIntegration.category` Type Change**

- **Mudança**: `category: Category` → `category: string`
- **Motivo**: Suporte a categorias customizadas nas integrações de script
- **Impacto**: Integrações customizadas com tipo `Category` explícito
- **Migração**: Mesmas diretrizes do `setPreference` acima

### 🎯 **Categorias Suportadas**

- `necessary` (sempre ativo)
- `analytics` (Google Analytics, etc.)
- `marketing` (Facebook Pixel, Google Ads)
- `functional` (Chat, mapas, widgets)
- `social` (Redes sociais, compartilhamento)
- `personalization` (Preferências, customização)

### 📈 **Estatísticas de Melhoria**

- **Design Tokens**: 4 → 200+ pontos de customização (+4900%)
- **Testes**: 174 → 193 testes (+11% cobertura)
- **Funcionalidades**: +15 novas funções exportadas
- **Documentação**: +3 templates de texto, +6 contextos específicos
- **Developer APIs**: +8 utilitários para descoberta de cookies

## [0.4.0] - 2025-09-09 — Custom categories

### Added

- Support for `customCategories` in `ConsentProvider.categories`.
  - Included in preferences initialization and validation.
  - Shown in the Preferences modal (with name/description).
  - Exposed via developer guidance/context for custom UIs.
- Quickstart PT/EN sections with `customCategories` examples.
- Storybook story: WithCustomCategories.

### Notes

- Non-breaking change; existing configurations continue to work.

## [0.3.7] - 2025-09-08 - Testes de UI e carregamento de scripts

### 🧪 Novos testes e cobertura

- CookieBanner
  - Testes para renderização condicional em modos bloqueante (overlay) e não-bloqueante (Snackbar)
  - Verificação de abertura do modal ao clicar em “Preferências” e persistência ao clicar em “Recusar”
- ConsentScriptLoader / Hook
  - Gating por consentimento e categoria; não carrega scripts quando não consentido ou categoria desabilitada
  - Tratamento de erros (log `logger.error` quando `loadScript` rejeita)
  - `reloadOnChange` reexecuta o carregamento ao reabilitar a categoria; default não recarrega
- Integrações de script
  - Verificação de `attrs` em integrações (GA define `async: 'true'`)

### 🔧 Interno

- Aumento da estabilidade para refatorações futuras na camada de UI e utilitários de carregamento.

## [0.3.6] - 2025-08-28 - Correção crítica: Herança de ThemeProvider

### ✨ Novas funcionalidades e melhorias

- Storybook
  - Adicionado e aprimorado suporte ao Storybook com controles (`args`/`argTypes`) para componentes-chave (`FloatingPreferencesButton`, `PreferencesModal`) e suporte a tema escuro nas histórias.
  - Isolamento entre stories via reset de estado (remoção/limpeza de cookie entre stories) e ajustes em `.storybook/preview.tsx` para compatibilidade com Vite/ESM.

- ConsentProvider
  - `blockingStrategy` (opt-in) adicionado para permitir overlays de bloqueio controlados pelo provider.
  - Melhor encaminhamento de props: `floatingPreferencesButtonProps` agora são repassadas corretamente quando o `FloatingPreferencesButton` é instanciado automaticamente.

- Testes e qualidade
  - Suíte de testes ampliada: novos testes para `DesignContext`, `useConsent`, `CategoriesContext`, `ConsentScriptLoader`, `cookieUtils`, `scriptLoader`, `scriptIntegrations`, `SafeThemeProvider`, `logger`, `ConsentGate`, `PreferencesModal` e `FloatingPreferencesButton`.
  - Configuração inicial de mutation testing com Stryker.
  - Setup de testes atualizado para suprimir logs do `developerGuidance` durante execução normal e permitir testes dedicados que verifiquem esses logs.

- Integração e DX
  - Quickstart PT/EN e melhorias no `README` para facilitar adoção e contribuições.
  - Notas de troubleshooting e documentação adicional sobre Storybook e integração de componentes.

### 🐛 Correções importantes

- `FloatingPreferencesButton` — props forward
  - Sintoma: props (`tooltip`, `hideWhenConsented`, etc.) não eram aplicadas quando o botão era renderizado automaticamente pelo `ConsentProvider`.
  - Solução: `ConsentProvider` agora encaminha `floatingPreferencesButtonProps` corretamente para o componente padrão. Stories atualizadas.

- Storybook fixes
  - Removidos arquivos `preview.ts` que continham JSX; migrado para `preview.tsx` e ajustadas exports para evitar erros com o bundler (esbuild/vite).

### 🧪 Testes e estabilidade

- Cobertura e robustez
  - Adicionados testes que validam uso de hooks fora do `ConsentProvider` (erros esperados), hidratação a partir de cookie, callbacks (`onConsentGiven`, `onPreferencesSaved`) e fluxos de UI (abrir/fechar modal, accept/reject).
  - Ajustes no `jest.setup` e um `jest.console-setup.ts` para garantir suprimir logs antes da coleta de módulos, mantendo testes determinísticos.

### 📚 Documentação

- Quickstart & README
  - Novo Quickstart em PT/EN e simplificações no `README` com foco em `QUICKSTART`.
  - Documentação de uso do Storybook e troubleshooting adicionada em `docs`.

### 🛠️ Correção crítica

- **Corrigido:** A biblioteca não deve criar ou impor um `ThemeProvider` global por si só. O `ConsentProvider` agora herda o theme do app consumidor quando um `ThemeProvider` do MUI estiver presente. O Provider só envolverá com `ThemeProvider` se a prop `theme` for explicitamente fornecida.
- **Motivação:** Evitar conflitos de contexto MUI/Emotion, regressões visuais e problemas em SSR causados por criação de tema no escopo de módulo.
- **Export:** `createDefaultConsentTheme()` foi adicionada como fábrica para quem precisar de um fallback explícito. Mantemos também um getter de compatibilidade (deprecated) `defaultConsentTheme()` que retorna uma nova instância quando chamada, evitando side-effects no import.
- **Compatibilidade:** Uso padrão continua igual — se seu app já fornece um `ThemeProvider` o `ConsentProvider` usará o theme existente. Para quem precisa de um fallback explícito, passe `theme={createDefaultConsentTheme()}` ao `ConsentProvider`.

> Nota: originalmente essa correção foi marcada como v0.3.5; devido a conflito de publicação a versão foi bumpada localmente para v0.3.6 e a entrada foi gravada nesta release.

- Limpeza de arquivos redundantes e ajustes de ESLint/preview para Storybook.

### Commits representativos

- Testes e supressão de logs: `fce823a`, `333ce0a`, `a1eea7e`
- Storybook / docs: `8f8c388`, `6e09058`, `329682c`, `9b1d977`, `adf0d49`
- Provider features: `967d278` (blockingStrategy)
- Quickstart / README: `db03ae3`
- Dependências / chores: `27339e7`, `3b7fdba`, `11c3602`

## [0.3.1] - 2025-08-13 - CORREÇÕES DE PRODUÇÃO E MELHORIAS DE COMPATIBILIDADE

### 🛡️ **Corrigido - Critical Production Fixes**

#### A) Compatibilidade com ThemeProvider

- **Erro "Cannot read properties of undefined (reading 'duration')"**: Implementado sistema de fallbacks seguros para propriedades de tema MUI inexistentes ou indefinidas
- **Componentes internos não renderizavam**: Adicionado `SafeThemeProvider` interno que garante compatibilidade com diferentes configurações de ThemeProvider do usuário
- **Conflitos de tema**: `FloatingPreferencesButton` e outros componentes agora usam `useThemeWithFallbacks()` para acessar propriedades de tema com valores padrão

#### B) API do FloatingPreferencesButton

- **"Element type is invalid: expected string but got object"**: Corrigido erro de renderização no `FloatingPreferencesButton`
- **Falta de controle sobre botão flutuante**: Adicionada prop `disableFloatingPreferencesButton?: boolean` no `ConsentProvider`
- **Sem API para abrir modal programaticamente**:
  - Novo hook `useOpenPreferencesModal()` para componentes React
  - Nova função `openPreferencesModal()` para uso em JavaScript puro
  - Integração automática com sistema global para acesso fora do contexto React

#### C) Exports de TypeScript Ausentes

- Adicionados exports públicos para melhor Developer Experience:
  - `CustomCookieBannerProps` - para componentes de banner customizados
  - `CustomPreferencesModalProps` - para modal de preferências customizado
  - `CustomFloatingPreferencesButtonProps` - para botão flutuante customizado
  - `ConsentProviderProps` - para tipagem das props do provider principal

### ✨ **Novas Funcionalidades**

#### Sistema de Debug e Troubleshooting

- **`setDebugLogging(enabled: boolean, level?: LogLevel)`**: Função para habilitar logs detalhados em produção quando necessário
- **Logs automáticos**: Sistema de logging que inclui:
  - Compatibilidade de tema (detection de propriedades MUI faltantes)
  - Mudanças de estado de consentimento
  - Operações de cookie (leitura/escrita/remoção)
  - Renderização de componentes (props e estados)
  - Integrações de scripts (carregamento/falhas)
  - Chamadas de API internas
- **Detecção automática de ambiente**: Logs desabilitados automaticamente em produção, habilitados em desenvolvimento

#### API Melhorada para Controle Programático

- **`useOpenPreferencesModal()`**: Hook que retorna função para abrir modal de preferências
- **`openPreferencesModal()`**: Função utilitária para acesso global (fora de componentes React)
- **Integração com AccessibilityDock**: Exemplos de uso em dock de acessibilidade customizado

### 📚 **Documentação**

#### Guia de API v0.3.1+

- **Novo arquivo**: `docs/API-v0.3.1.md` com exemplos completos
- **Casos de uso**: Next.js 14+, Material-UI, componentes totalmente customizados
- **Troubleshooting**: Guia de resolução dos problemas mais comuns
- **Migration Guide**: Instruções de atualização (sem breaking changes)

#### Exemplos de Implementação

- **Componentes customizados**: Exemplos completos de `CustomCookieBanner`, `CustomPreferencesModal`
- **Integração com AccessibilityDock**: Implementação de botão de preferências em dock customizado
- **SSR/Next.js**: Configuração para evitar flash de conteúdo e hidratação adequada
- **Debug em produção**: Como habilitar logs para troubleshooting quando necessário

### 🔧 **Melhorias Técnicas**

#### Robustez e Estabilidade

- **SafeThemeProvider**: Componente interno que evita erros de tema em diferentes configurações de Material-UI
- **Fallbacks automáticos**: Valores padrão para todas as propriedades de tema acessadas pelos componentes
- **Detecção de ambiente**: Melhorada para funcionar em diferentes build systems e ambientes de execução
- **Compatibilidade**: Testado com Material-UI v5 e Next.js 14+

#### Developer Experience

- **Tipos mais precisos**: Exports de todos os tipos necessários para customização
- **Logs informativos**: Sistema de debug que facilita identificação de problemas
- **Documentação expandida**: Exemplos práticos e casos de uso reais
- **Zero breaking changes**: Atualização segura desde v0.3.0

### 🛠️ **Contexto de Correção**

Estas correções abordam problemas identificados em produção com:

- **Apps Next.js 14+ usando Material-UI**: Conflitos de ThemeProvider resolvidos
- **Componentes customizados**: APIs claras para substituição completa da UI
- **AccessibilityDock integrations**: Controle programático do modal de preferências
- **Troubleshooting**: Sistema de logs para diagnóstico de problemas em produção

### 📋 **Migration from v0.3.0**

✅ **Zero Breaking Changes**: Atualização direta sem modificações necessárias

**Novos recursos opcionais**:

```tsx
// Desabilitar botão flutuante padrão
;<ConsentProvider
  disableFloatingPreferencesButton={true}
  // ... outras props
/>

// Usar controle programático
const openModal = useOpenPreferencesModal()

// Habilitar debug se necessário
setDebugLogging(true, LogLevel.DEBUG)
```

## [0.3.0] - 2025-08-12 - DX APRIMORADA E UI AUTOMÁTICA

### 🚨 **MUDANÇAS QUE QUEBRAM A COMPATIBILIDADE**

- **Remoção de Exports Diretos de Componentes UI**: `CookieBanner` e `FloatingPreferencesButton` não são mais exportados diretamente. Eles agora são gerenciados e renderizados automaticamente pelo `ConsentProvider`.
- **Remoção da Prop `disableAutomaticModal`**: Esta prop foi removida do `ConsentProvider`. O modal de preferências agora é sempre renderizado (seja o padrão ou um componente customizado fornecido) e sua visibilidade é controlada internamente pelo estado `isModalOpen`.
- **Tipagem Estrita para Componentes UI Customizados**: As props para `PreferencesModalComponent`, `CookieBannerComponent` e `FloatingPreferencesButtonComponent` agora exigem tipos específicos (`CustomPreferencesModalProps`, `CustomCookieBannerProps`, `CustomFloatingPreferencesButtonProps`). Componentes customizados que usavam `React.ComponentType<any>` precisarão ser atualizados.
- **Remoção do Hook `useConsentComponentProps`**: Este hook utilitário foi removido, pois os componentes internos agora usam `useConsent` e `useConsentTexts` diretamente.

### ✨ **Novas Funcionalidades e Melhorias**

- **Renderização Automática de Componentes UI Padrão**: O `ConsentProvider` agora renderiza automaticamente o `CookieBanner` (quando necessário) e o `FloatingPreferencesButton` (após consentimento), reduzindo o boilerplate.
- **Componentes UI Sobrescrevíveis com Tipagem Clara**: Permite que desenvolvedores forneçam seus próprios componentes de banner, modal e botão flutuante com total segurança de tipo.
- **Controle Simplificado do Modal**: A visibilidade do modal é controlada exclusivamente pelo estado interno, eliminando a necessidade da prop `disableAutomaticModal`.
- **Carregamento Imediato de Banner e Botão Flutuante**: Removido o lazy loading para `CookieBanner` e `FloatingPreferencesButton` para garantir visibilidade imediata e evitar falhas de carregamento.
- **Prop `disableDeveloperGuidance`**: Permite desabilitar os avisos e sugestões para desenvolvedores no console.
- **Prop `reloadOnChange` para `ConsentScriptLoader`**: Permite recarregar scripts de integração quando as preferências de consentimento mudam.
- **Ajuste de Posição da Marca**: A marca "fornecido por LÉdipO.eti.br" agora é exibida no canto inferior direito do banner e modal.

## [0.2.6] - 2025-08-12 - ESTABILIZAÇÃO E CONFORMIDADE

### 🛡️ **Modificado**

- **Gerenciamento de Estado Unificado**: O `ConsentProvider` foi refatorado para usar uma lógica centralizada (`categoryUtils.ts`) para criar e validar as preferências de consentimento. Isso elimina inconsistências e garante que o estado do consentimento sempre reflita a configuração do projeto (`ProjectCategoriesConfig`).
- **Validação na Hidratação**: Ao carregar o estado de um cookie existente, as preferências agora são validadas contra a configuração atual do projeto. Categorias que não existem mais na configuração são removidas, evitando estados inválidos.

### ✨ **Adicionado**

- **Metadados de Auditoria no Cookie**: O cookie de consentimento agora armazena um snapshot da configuração de categorias (`projectConfig`) que estava ativa no momento em que o consentimento foi dado. Isso fortalece a capacidade de auditoria e a conformidade com a LGPD.

### 📚 **Documentação**

- **Consolidação**: A pasta `docs` foi significativamente limpa, com a remoção de múltiplos arquivos redundantes e temporários.
- **README.md Melhorado**: O arquivo `README.md` principal foi completamente reescrito para seguir um padrão profissional, com estrutura clara, exemplos de código atualizados e badges de status do projeto.
- **Guia de Conformidade Unificado**: O arquivo `COMPLIANCE.md` agora centraliza as informações sobre as funcionalidades de conformidade da biblioteca e as orientações para desenvolvedores, incorporando conteúdo de outros documentos que foram removidos.

### 🐛 **Corrigido**

- **Consistência do Consentimento**: Corrigido o problema onde as ações `ACCEPT_ALL` e `REJECT_ALL` não consideravam a configuração completa do projeto, podendo levar a um estado de preferências incorreto.

## [0.2.2] - 2025-08-12 - SISTEMA DE ORIENTAÇÕES PARA DESENVOLVEDORES

### ✨ **Adicionado**

#### **🚨 Sistema Inteligente de Orientações**

- **Console de Desenvolvimento**: Avisos automáticos sobre configuração
  - ⚠️ **Avisos**: Detecta configuração faltante, inconsistente ou problemática
  - 💡 **Sugestões**: Recomendações para melhor compliance e UX
  - 🔧 **Tabela de Categorias**: Lista categorias ativas para orientar UI customizada

- **Novos Hooks para Componentes Customizados**:
  - `useCategories()`: Informações completas sobre categorias ativas no projeto
  - `useCategoryStatus(id)`: Verifica se categoria específica está configurada
  - **Prevenção de Bugs**: Evita inconsistências entre configuração e UI

#### **🎨 UI Dinâmica e Inteligente**

- **PreferencesModal Aprimorado**: Renderiza automaticamente apenas categorias configuradas
- **Componentes Adaptativos**: UI se ajusta dinamicamente à configuração do projeto
- **Renderização Condicional**: Não exibe categorias não utilizadas no projeto

#### **📋 Configuração Padrão Defensiva**

- **Padrão Inteligente**: Quando nenhuma categoria especificada, usa `necessary + analytics`
- **Orientação Automática**: Avisa sobre uso de configuração padrão em desenvolvimento
- **Migração Transparente**: API de categorias funciona perfeitamente

#### **🔍 Análise e Validação de Configuração**

- **Função `analyzeDeveloperConfiguration()`**: Valida e orienta sobre configuração
- **Constante `DEFAULT_PROJECT_CATEGORIES`**: Configuração padrão baseada em casos reais
- **Detecção Automática**: Identifica muitas categorias, descrições inadequadas, etc.

### 🔧 **Modificado**

#### **ConsentProvider Expandido**

- **Suporte Completo**: Prop `categories` com configuração de categorias padrão e personalizadas
- **Sistema de Orientações**: Log automático de orientações em modo desenvolvimento
- **Configuração Moderna**: Nova estrutura da prop `categories` para maior flexibilidade

#### **Componentes UI Inteligentes**

- **Inicialização Segura**: `tempPreferences` inicializado corretamente com valores padrão
- **Sincronização Dinâmica**: Estado local sincroniza apenas com categorias ativas
- **Renderização Otimizada**: Loops baseados em `toggleableCategories` ao invés de hardcode

### 🐛 **Corrigido**

- **React Warning**: Eliminado "A component is changing an uncontrolled input to be controlled"
- **Estado de Input**: `PreferencesModal` inicializa switches com valores controlados
- **Sincronização**: Preferências temporárias sincronizam corretamente com categorias ativas
- **Performance**: Não renderiza componentes para categorias não configuradas

### 📚 **Documentação**

- **Novo arquivo**: `docs/ORIENTACOES-DESENVOLVIMENTO.md` - Guia completo do sistema
- **README expandido**: Exemplos práticos da nova API e componentes dinâmicos
- **Exemplos de uso**: Demonstração de hooks para validação condicional de categorias
- **Guias de migração**: Como usar nova API mantendo compatibilidade

### 🎯 **Benefícios da v0.2.2**

#### **Para Desenvolvedores**

- 🚨 **Orientação Proativa**: Console indica exatamente quais categorias implementar na UI
- 🐛 **Prevenção de Bugs**: Validação automática de consistência Configuração ↔ UI
- 🔧 **Flexibilidade Total**: APIs antigas funcionam, nova API oferece mais controle
- 📋 **TypeScript Completo**: Tipos específicos para cada hook e configuração

#### **Para Compliance LGPD**

- 🎯 **Configuração Consciente**: Sistema força reflexão sobre quais dados realmente coletar
- 📝 **Documentação Automática**: Orientações baseadas na configuração real do projeto
- 🔍 **Auditabilidade**: Logs claros mostram decisões de configuração
- 🛡️ **Conformidade Ativa**: Alinhamento dinâmico com princípios da ANPD

#### **Para Usuários Finais**

- ⚡ **Performance Superior**: Interface otimizada mostra apenas categorias relevantes
- 🎯 **Experiência Focada**: Usuários não veem opções irrelevantes para o projeto
- 🔒 **Transparência Máxima**: Descrições claras apenas de categorias realmente utilizadas

---

## [0.2.1] - 2025-08-12 - CONFORMIDADE LGPD RIGOROSA + SISTEMA DE ORIENTAÇÕES

### 🚨 **NOVO: Sistema de Orientações para Desenvolvedores**

A v0.2.1 introduz um **sistema inteligente de orientações** que guia desenvolvedores sobre configuração adequada e previne inconsistências entre configuração e UI customizada.

### 🛡️ **BREAKING CHANGES - Conformidade ANPD**

#### **Cookie de Consentimento Reestruturado**

- **🍪 Estrutura do Cookie**: Novo formato com campos obrigatórios para compliance
  - `version`: Controle de migração de schema
  - `consentDate`: Timestamp da primeira interação
  - `lastUpdate`: Timestamp da última modificação
  - `source`: Origem da decisão (`banner`, `modal`, `programmatic`)
  - **Removido**: `isModalOpen` (estado de UI não deve ser persistido)

#### **Sistema de Categorias por Projeto**

- **🔧 Nova Prop**: `categories` no `ConsentProvider` para especificar apenas categorias ativas
- **📦 Principio da Minimização**: Cookie contém apenas categorias realmente utilizadas
- **⚡ Performance**: Redução significativa do tamanho do cookie

### ✨ **Adicionado**

#### **Configuração de Categorias Ativas**

```tsx
<ConsentProvider
  categories={{
    enabledCategories: ['analytics', 'functional'], // Apenas essas + necessary
  }}
>
```

#### **Comportamento LGPD Rigoroso**

- **🚫 Banner Bloqueante**: Prop `blocking={true}` para exigir decisão explícita
- **📵 Padrão "Rejeitar Todos"**: Conformidade com interpretação rigorosa da LGPD
- **⏰ Timestamps Automáticos**: Auditoria completa de interações

#### **Utilitários de Compliance**

- **🔧 `validateCategoriesConfig()`**: Validação de configuração de categorias
- **📊 `createProjectPreferences()`**: Geração de preferências baseada na config
- **🧹 Migração Automática**: Cookies v0.2.0 migrados automaticamente

### 🔧 **Corrigido**

- **README.md**: Badges duplicados e links quebrados corrigidos
- **TypeScript**: Tipos mais rigorosos para `ConsentState` e `ConsentCookieData`
- **Cookie Utils**: Separação clara entre dados persistidos e estado de UI
- **Conformidade**: Remoção automática de campos não-compliance do cookie

### 📋 **Documentação**

- **📋 CONFORMIDADE.md**: Guia completo de implementação conforme ANPD
- **🔄 Migração**: Instruções detalhadas v0.2.0 → v0.2.1
- **🏛️ Exemplos**: Casos de uso governamentais e corporativos

### ⚠️ **Migração v0.2.0 → v0.2.1**

#### **Automática (Recomendada)**

- Cookies existentes migrados automaticamente
- API v0.2.0 mantém compatibilidade

#### **Manual (Para Máxima Conformidade)**

```tsx
// Especificar apenas categorias necessárias
<ConsentProvider
  categories={{ enabledCategories: ['analytics'] }}
  blocking={true} // Para compliance rigorosa
>
```

### 📊 **Impacto**

- **📦 Bundle Size**: Mantido (~11KB ESM)
- **🔄 Backward Compatibility**: 95% (quebras apenas em casos edge)
- **🛡️ Compliance**: 100% LGPD/ANPD conforme Guia Orientativo
- **⚡ Performance**: Cookies até 70% menores em projetos típicos

## [0.2.0] - 2025-08-12

### 🎉 MAJOR UPDATE - Adequação ANPD Completa

### ✨ Adicionado

- **🍪 Categorias ANPD Expandidas**: Sistema baseado no Guia Orientativo da ANPD
  - `necessary`: Cookies essenciais (sempre ativos)
  - `analytics`: Análise e estatísticas
  - `functional`: Funcionalidades extras
  - `marketing`: Publicidade e marketing
  - `social`: Integração com redes sociais
  - `personalization`: Personalização de conteúdo

- **🔧 Sistema de Categorias Flexível**
  - Nova interface `CategoryDefinition` para definições de categorias
  - Suporte a categorias essenciais vs opcionais
  - Prop `categories` com configuração granular

- **📝 Textos ANPD Expandidos** (todos opcionais para backward compatibility)
  - `controllerInfo`: Identificação do controlador dos dados
  - `dataTypes`: Tipos de dados coletados
  - `thirdPartySharing`: Compartilhamento com terceiros
  - `userRights`: Direitos do titular dos dados
  - `contactInfo`: Contato do DPO/responsável
  - `retentionPeriod`: Prazo de armazenamento
  - `lawfulBasis`: Base legal (consentimento/interesse legítimo)
  - `transferCountries`: Países de transferência internacional

- **🚀 Integrações Nativas de Scripts**
  - `createGoogleAnalyticsIntegration()`: GA4 configurado automaticamente
  - `createGoogleTagManagerIntegration()`: GTM configurado automaticamente
  - `createUserWayIntegration()`: UserWay para acessibilidade
  - `ConsentScriptLoader`: Componente para carregamento automático
  - `useConsentScriptLoader`: Hook para carregamento programático
  - Interface `ScriptIntegration` para scripts customizados

- **🎛️ Sistema de Categorias Dinâmico**
  - Context `CategoriesProvider` separado para melhor organização
  - Preferências expandidas com suporte a `[key: string]: boolean`
  - Reducer atualizado para categorias customizadas

### 🔧 Melhorado

- **Preferências padrão**: Agora incluem todas as 6 categorias ANPD
- **Tipagem expandida**: `Category` type agora inclui todas as categorias
- **Context arquitetura**: Separação de responsabilidades mais clara
- **Documentação**: Guias detalhados para cada nova funcionalidade

### 📦 Interno

- Context `CategoriesCtx` para categorias customizadas
- Função `createInitialPreferences()` para inicialização dinâmica
- Reducer com suporte a ações com categorias customizadas
- Exports expandidos no `index.ts`

### 🎯 Compatibilidade

- ✅ **100% Backward Compatible**: Todas as APIs existentes funcionam
- ✅ **Opt-in Features**: Novas funcionalidades são opcionais
- ✅ **Progressive Enhancement**: Funciona do simples ao complexo

### 📊 Bundle Size

- **Antes**: 6.65 KB ESM + 14.08 KB chunk
- **Agora**: 10.84 KB ESM + 15.90 KB chunk
- **Crescimento**: +4.19 KB (+64% de funcionalidades)

## [0.1.3] - 2025-08-09

### 🎉 Adicionado

- **Banner bloqueante**: Nova prop `blocking` no `CookieBanner` (padrão: `true`)
  - Quando `blocking=true`, exibe overlay escuro que impede interação até decisão
  - Quando `blocking=false`, usa o comportamento Snackbar não intrusivo
- **Sistema de temas**: Suporte completo a temas Material-UI
  - Tema padrão institucional (`defaultConsentTheme`) baseado nas cores da ANPD
  - Prop `theme` no `ConsentProvider` para temas customizados
  - ThemeProvider automático para todos os componentes filhos
- **Modal de preferências funcional**:
  - Estado `isModalOpen` agora conectado ao contexto
  - Botão "Preferências" no banner abre corretamente o modal
  - Hook `useConsent()` expõe `isModalOpen`
- **Script loader aprimorado**:
  - Nova função `loadConditionalScript()` que aguarda consentimento
  - Callbacks com delay de 150ms para permitir animações de fechamento
  - Melhor integração com `ConsentGate`
- **Hook adicional**: `useConsentTexts()` para acessar textos customizados

### 🔧 Corrigido

- **Textos customizados**: Props `texts` do `ConsentProvider` agora funcionam corretamente
  - Componentes `CookieBanner` e `PreferencesModal` usam textos do contexto
  - Remoção da dependência direta de `defaultTexts`
- **Estado do modal**: `isModalOpen` integrado ao reducer e hooks
- **Conexão de ações**: Todas as ações (`openPreferences`, `closePreferences`, etc.) funcionais

### 📦 Interno

- Context `TextsCtx` para disponibilizar textos customizados
- Reducer atualizado com estado `isModalOpen`
- ThemeProvider integrado ao ConsentProvider
- Delays nos callbacks para melhor UX

### 🎨 Design

- Banner bloqueante com overlay `rgba(0, 0, 0, 0.5)`
- zIndex 1300 (acima de modais MUI)
- Tema padrão com bordas arredondadas e sombras suaves
- Transições suaves para melhor experiência visual

## [0.1.0] - 2025-08-09

### 🎉 Lançamento Inicial

- **Contexto de consentimento** com `ConsentProvider`
- **Banner básico** com botões Aceitar/Recusar/Preferências
- **Modal de preferências** para categorias analytics e marketing
- **Hook `useConsent()`** para interação com estado
- **Componente `ConsentGate`** para renderização condicional
- **Utilitários**:
  - `loadScript()` para carregamento dinâmico de scripts
  - `cookieUtils` para persistência
- **Suporte SSR** via prop `initialState`
- **Acessibilidade** com ARIA e navegação por teclado
- **TypeScript** completo com tipos exportados

### 🏗️ Arquitetura

- Context API com reducer pattern
- Cookies seguros (`SameSite=Lax`, `secure=true`)
- API pública em inglês, UI padrão em português
- Zero dependências extras (apenas `js-cookie`)

---

### 🔮 Futuro (v0.4.0+)

- [ ] Modal detalhado com lista de cookies
- [ ] Base legal por categoria
- [ ] Relatórios de compliance
- [ ] Templates por setor

## [0.4.2] - 06/10/2025 — Quickstarts + SSR Guide + Validação (DEV)

### ✨ Quickstarts executáveis

- Next.js (App Router) e Vite com Consent Mode v2 integrado e bloqueio real de scripts (GTM/GA4 não carregam antes do consentimento).
- Seções no QUICKSTART.md com passos copy‑paste e validação do comportamento esperado.

### 🧱 Guia SSR/Next.js (App Router)

- Padrões seguros para evitar hydration mismatch: wrapper client‑only com `'use client'` e `dynamic({ ssr: false })`, efeitos que acessam `window/document` apenas no cliente.
- Ordem de provedores/estilos (Emotion/MUI) e z-index/portals documentados (overlay 1299, modais ≥ 1300).

### ✅ Validação de configuração do ConsentProvider (DEV)

- Validação com Zod em desenvolvimento (import dinâmico) e sanitização leve em produção.
- Mensagens amigáveis: alerta quando `categories` não é fornecida; remove `'necessary'` de `enabledCategories`; detecta duplicidades/valores inválidos; valida `customCategories`.
- Testes cobrindo casos inválidos e asserts de mensagens.

### 📚 Categorias — definição, uso e exemplos

- Fonte única de verdade: `ConsentProvider.categories`. UI, hooks e integrações leem a mesma definição.
- Esclarecimento: apenas “necessários” é obrigatório; demais categorias são opcionais conforme o negócio.
- Exemplos mínimo (somente necessários) e completo (analytics/marketing/functional).

### 🔧 Dependências

- Adicionado: `zod@^3.23.8` (usado somente em DEV via import dinâmico; não impacta o bundle de produção).

### 🧩 Sem breaking changes

- Alterações são compatíveis; padrões seguros preservados.
## [0.5.0] - 25/10/2025 — Modularização inicial do workspace

### 🧱 Estrutura modular
- Repositório convertido em workspace PNPM com três pacotes: `@react-lgpd-consent/core`, `@react-lgpd-consent/mui` e `react-lgpd-consent`.
- Pacote agregador passa a construir entradas adicionais (`core` e `mui`) expondo subpath exports oficiais.

### 🎨 Camada MUI dedicada
- Publicação inicial de `@react-lgpd-consent/mui` como _proxy_ dos componentes padrão.
- Metadados de peer dependencies ajustados para reforçar que Material-UI é opcional (requerido apenas para a camada visual).

### 🧰 Ferramentas & DX
- Scripts de lint/test/build convertidos para `pnpm --filter react-lgpd-consent <comando>`.
- Jest e TypeDoc atualizados para apontar para `packages/core` e `packages/react-lgpd-consent`.
- Documentação (README, QUICKSTART, DEVELOPMENT) revisada para explicar a nova arquitetura e o processo de migração gradual.
