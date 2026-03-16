# Changelog

## 0.9.5

### Patch Changes

- [`e303bbf`](https://github.com/lucianoedipo/react-lgpd-consent/commit/e303bbfd6d6c87a3096f53d934211bd20d66d7f7) Thanks [@lucianoedipo](https://github.com/lucianoedipo)! - refactor: improve version workflow steps and messages for clarity

- [`bdb687b`](https://github.com/lucianoedipo/react-lgpd-consent/commit/bdb687b27db03bd8ec2ec3d7fc63b3f7df4fbc71) Thanks [@lucianoedipo](https://github.com/lucianoedipo)! - ## 🔒 Segurança e CI/CD

  ### Trusted Publishing (npm)
  - Implementado suporte para **Trusted Publishing** com provenance nos workflows de publicação
  - Remoção da dependência de `NPM_TOKEN` para publicação (maior segurança via OIDC)
  - Adicionada flag `--provenance` para assinatura criptográfica dos pacotes
  - Criado guia completo de configuração em `doc/TRUSTED_PUBLISHING_SETUP.md`

  ### Workflows
  - Adicionado suporte a `PAT_TOKEN` no workflow de versionamento para bypass de repository rules
  - Melhorias na verificação de versão antes da publicação
  - Aprimoramento das mensagens de log e feedback nos workflows
  - Remoção de opções desnecessárias no checkout do workflow de version

  ### 📚 Documentação
  - Novo guia detalhado: `TRUSTED_PUBLISHING_SETUP.md` com instruções passo-a-passo
  - Documentação de troubleshooting para configuração de Trusted Publishing
  - Adicionadas referências oficiais do npm e GitHub Actions

- Updated dependencies [[`e303bbf`](https://github.com/lucianoedipo/react-lgpd-consent/commit/e303bbfd6d6c87a3096f53d934211bd20d66d7f7), [`bdb687b`](https://github.com/lucianoedipo/react-lgpd-consent/commit/bdb687b27db03bd8ec2ec3d7fc63b3f7df4fbc71)]:
  - @react-lgpd-consent/core@0.9.5
  - @react-lgpd-consent/mui@0.9.5

## 0.9.4

### Patch Changes

- [`e85a8c9`](https://github.com/lucianoedipo/react-lgpd-consent/commit/e85a8c936895af2c38ff2842f892058be4fc9ec7) Thanks [@lucianoedipo](https://github.com/lucianoedipo)! - ## Manutenção e Melhorias

  ### 🔧 Refatorações
  - Melhoria na clareza das etapas e mensagens do workflow de versionamento
  - Reestruturação do código para melhor legibilidade e manutenibilidade
  - Remoção da especificação de versão na instalação do pnpm

  ### 📦 Atualizações de Dependências
  - Atualização do typescript-eslint (8.54.0 → 8.55.0)
  - Atualização do typedoc (0.28.16 → 0.28.17)
  - Atualização do @mui/material (7.3.7 → 7.3.8)
  - Atualização do storybook (10.2.7 → 10.2.8)
  - Atualização do @types/node (25.2.2 → 25.2.3)
  - Atualização do @chromatic-com/storybook (5.0.0 → 5.0.1)
  - Atualização do eslint-plugin-jest (29.12.2 → 29.13.0)

- Updated dependencies [[`e85a8c9`](https://github.com/lucianoedipo/react-lgpd-consent/commit/e85a8c936895af2c38ff2842f892058be4fc9ec7)]:
  - @react-lgpd-consent/core@0.9.4
  - @react-lgpd-consent/mui@0.9.4

## 0.9.3

### Patch Changes

- [`e567094`](https://github.com/lucianoedipo/react-lgpd-consent/commit/e567094c999a9727cdbf6c31362d14759f7eba2e) Thanks [@lucianoedipo](https://github.com/lucianoedipo)! - chore: atualização de dependências

- Updated dependencies [[`e567094`](https://github.com/lucianoedipo/react-lgpd-consent/commit/e567094c999a9727cdbf6c31362d14759f7eba2e)]:
  - @react-lgpd-consent/core@0.9.3
  - @react-lgpd-consent/mui@0.9.3

## 0.9.2

### Patch Changes

- [#161](https://github.com/lucianoedipo/react-lgpd-consent/pull/161) [`f1888ef`](https://github.com/lucianoedipo/react-lgpd-consent/commit/f1888ef2e7d8ea86653f155027f6d5ed270ac90c) Thanks [@lucianoedipo](https://github.com/lucianoedipo)! - # Changelog

  ## ✨ Added

  ### Coverage Analysis
  - Added `coverage-analysis.sh` to perform comprehensive test coverage analysis.
  - Automated execution of tests with coverage enabled and extraction of metrics from `coverage-summary.json`.
  - Added support for multiple coverage output formats:
    - LCOV
    - Cobertura XML
    - Clover XML
    - JSON
    - HTML
  - Automatic opening of the HTML coverage report in the default browser.
  - Updated `README.md` with documentation for the new coverage analysis script and usage instructions.

  ### Versioning & Releases
  - Added `VERSIONING.md` describing the versioning strategy based on **Changesets** and **Turborepo**.
  - Documented the full release workflow, including automated CI/CD steps for versioning, publishing, and tagging.

  ### CI/CD Documentation
  - Added `WORKFLOWS.md` detailing the CI/CD architecture and guiding principles.
  - Documented CI steps, automated version bumps, NPM publishing, and documentation deployment processes.

  ### Dependency & CI Improvements
  - Updated peer dependencies to improve React version compatibility.
  - Enhanced CI permissions to support the updated release and publishing workflows.

  ## 📝 Documentation
  - Updated example documentation links in `examples/README.md` to reflect the new documentation structure.
  - Corrected troubleshooting links in the following package READMEs:
    - `core`
    - `mui`
    - `react-lgpd-consent`
  - Updated Quickstart documentation links to point to the new documentation paths.
  - Updated `INTEGRACOES.md` to reflect the new locations for recipes and troubleshooting documentation.

  ## 🐛 Fixed

  ### Coverage Configuration
  - Updated Jest coverage thresholds in `jest.config.mjs`:
    - Statements: **98%**
    - Lines: **98%**
    - Functions: **98%**
    - Branches: **91%**
  - Updated coverage thresholds in `coverage-check.cjs` and related scripts to align with the new coverage standards.

- Updated dependencies [[`f1888ef`](https://github.com/lucianoedipo/react-lgpd-consent/commit/f1888ef2e7d8ea86653f155027f6d5ed270ac90c)]:
  - @react-lgpd-consent/core@0.9.2
  - @react-lgpd-consent/mui@0.9.2

## 0.9.1

### Patch Changes

- [#154](https://github.com/lucianoedipo/react-lgpd-consent/pull/154) [`2be8e18`](https://github.com/lucianoedipo/react-lgpd-consent/commit/2be8e18c456bdf2b19db611711e2a32517a1f18a) Thanks [@lucianoedipo](https://github.com/lucianoedipo)! - - feat: adiciona suporte a posicionamento e offset configuráveis no banner de consentimento
  - feat: adiciona posicionamento configurável do banner de consentimento e aprimora textos de comunicação
- Updated dependencies [[`2be8e18`](https://github.com/lucianoedipo/react-lgpd-consent/commit/2be8e18c456bdf2b19db611711e2a32517a1f18a)]:
  - @react-lgpd-consent/core@0.9.1
  - @react-lgpd-consent/mui@0.9.1

## 0.9.0

### Minor Changes

- [#145](https://github.com/lucianoedipo/react-lgpd-consent/pull/145) [`2d772bc`](https://github.com/lucianoedipo/react-lgpd-consent/commit/2d772bcf72d16ead7faace93f2e71d11c7bfec12) Thanks [@lucianoedipo](https://github.com/lucianoedipo)! - feat: adiciona posicionamento configurável do banner e aprimora textos de consentimento

  ### Melhorias de UX e Posicionamento
  - **Posicionamento do banner**: novas props `position`, `anchor` e `offset` em `cookieBannerProps` permitem ajustar a posição do banner para evitar colisões com footers fixos, chat widgets e outros elementos flutuantes
  - **Posicionamento do FAB**: prop `offset` em `floatingPreferencesButtonProps` possibilita afastar o botão flutuante de outros elementos da UI
  - **Textos de consentimento**: aprimorados os textos padrão para comunicar claramente o uso de cookies necessários e categorias opcionais, melhorando a transparência LGPD/ANPD

  ### Melhorias Técnicas
  - **Storybook**: removidas stories MDX e adicionada configuração Vite para avisos de tamanho de chunks
  - **TypeDoc**: removida execução shell em `run-typedoc.mjs` para compatibilidade multiplataforma
  - **Bundle**: ajustados limites de tamanho no `react-lgpd-consent/package.json`
  - **MUI Patch**: aplicado patch em `@mui/icons-material@7.3.7` para resolver problemas de compatibilidade com exports

  ### Documentação
  - Adicionada seção de posicionamento em `QUICKSTART.md` e `API.md`
  - Atualizada `CONFORMIDADE.md` com ênfase na comunicação clara de categorias
  - Aprimorada documentação de props em `DesignContext.tsx`
  - Consolidados links entre pacotes em READMEs

  ### Limpeza e Refinamentos
  - Ajustados testes de parsing de cookies legados em `cookieUtils.test.ts`
  - Removidos comentários desnecessários em `cookieDiscovery.ts`
  - Refinado guidance para desenvolvedores em `developerGuidance.ts`

### Patch Changes

- Updated dependencies [[`2d772bc`](https://github.com/lucianoedipo/react-lgpd-consent/commit/2d772bcf72d16ead7faace93f2e71d11c7bfec12)]:
  - @react-lgpd-consent/core@0.9.0
  - @react-lgpd-consent/mui@0.9.0

## 0.8.0

### Minor Changes

- [#142](https://github.com/lucianoedipo/react-lgpd-consent/pull/142) [`29b4464`](https://github.com/lucianoedipo/react-lgpd-consent/commit/29b4464bd0ea878a21573a0752aca3adc31743d9) Thanks [@lucianoedipo](https://github.com/lucianoedipo)! - ### Correcoes
  - 1d15920 fix: corrigir formatacao da verificacao de multiplas versoes do React

  ### Refactors e compatibilidade
  - ed5fa36 refactor: aprimorar documentacao e estrutura de validacao do ConsentProvider
  - 709e977 refactor: melhorar validacao e sanitizacao das categorias no ConsentProvider
  - 6ee4d03 feat: recalcular categorias no CategoriesContext ao adicionar novas entradas
  - 6ee4d03 refactor: melhorar descoberta e validacao de cookies
  - 6ee4d03 refactor: refinar helpers de integracao para maior clareza
  - 6ee4d03 refactor: simplificar logica de sincronizacao de versoes no script sync-versions.mjs
  - ef2968a refactor: trocar acessos diretos a window/document por globalThis em loaders, utils e testes
  - 3af2fcb fix: ajustar path resolution no tsconfig para melhor import de modulos

  ### Funcionalidades
  - 6ee4d03 feat: aprimorar acessibilidade e gerenciamento de consentimento
  - 6ee4d03 feat: estender matchers Jest com jest-axe para acessibilidade
  - 6ee4d03 feat: revisar textos de consentimento para mais clareza
  - 6ee4d03 feat: introduzir modos de bloqueio no ConsentProvider
  - 6ee4d03 feat: adicionar testes para hard blocking no ConsentProvider
  - d641639 feat: adicionar gerenciamento de eventos para categorias obrigatorias no CategoriesProvider

  ### Testes
  - b04c00b feat: adicionar testes para CookieBanner, FloatingPreferencesButton e PreferencesModal
  - b04c00b testes: validar renderizacao do CookieBanner por consentimento e modo debug
  - b04c00b testes: verificar textos localizados no FloatingPreferencesButton via props
  - b04c00b testes: cobrir reset temporario, scripts ativos e textos customizados no PreferencesModal
  - testes: cobrir fluxo SSR de leitura/remoção/escrita de cookie consent

  ### Ferramentas
  - b04c00b feat: script interativo de changeset para versionamento em monorepos
  - b04c00b refactor: coverage-check usando node imports
  - b04c00b refactor: ajustar script do TypeDoc para compatibilidade ESM

  ### Documentacao
  - 6ee4d03 docs: atualizar README e exemplos com novos recursos
  - d430eef docs: atualizar instrucoes para agentes com comandos essenciais
  - d430eef docs: refletir uso de globalThis na documentacao
  - d430eef docs: atualizar API com novas integracoes e configuracoes de testes ESM/CJS
  - docs: quickstart com comentarios e nota sobre injecao automatica de UI MUI

  ### A11y
  - a11y: PreferencesModal com aria-describedby
  - a11y: testes de teclado (Escape + retorno de foco)

### Patch Changes

- Updated dependencies [[`29b4464`](https://github.com/lucianoedipo/react-lgpd-consent/commit/29b4464bd0ea878a21573a0752aca3adc31743d9)]:
  - @react-lgpd-consent/core@0.8.0
  - @react-lgpd-consent/mui@0.8.0

## 0.7.1

### Patch Changes

- [#133](https://github.com/lucianoedipo/react-lgpd-consent/pull/133) [`33bc0eb`](https://github.com/lucianoedipo/react-lgpd-consent/commit/33bc0ebcb40ce65c70b02668d3c0a97efb1854f1) Thanks [@lucianoedipo](https://github.com/lucianoedipo)! - # 🧩 Fundamento Crítico de Consentimento — SUPER TASK v0.7.1

  **Persistência + Loader + Consent Mode v2**

  Esta release estabelece o **núcleo legal, técnico e funcional** da biblioteca react-lgpd-consent, garantindo um contrato sólido, seguro e auditável para uso institucional e governamental.

  ***

  ## 🔹 Bloco A — Persistência de Consentimento por Cookie

  ### ✨ API Consolidada de Persistência

  Nova API completa no `ConsentProvider`:

  ```typescript
  <ConsentProvider
    cookie={{
      name: 'lgpd-consent',
      domain: '.example.com',  // Compartilha entre subdomínios
      path: '/',
      sameSite: 'Lax',        // Default seguro
      secure: true,            // Auto em HTTPS
      maxAge: 31536000,       // Segundos (substitui maxAgeDays)
    }}
  >
  ```

  **Regras Implementadas:**
  - ✅ Defaults seguros: `SameSite=Lax`, `Secure=true` em HTTPS
  - ✅ Categoria `necessary` **sempre forçada como true**
  - ✅ Nenhuma gravação de cookie durante SSR
  - ✅ Suporte completo a subdomínios via `domain`
  - ✅ Nova opção `maxAge` (segundos, padrão moderno)
  - ✅ Opção `maxAgeDays` deprecated mas mantida para compatibilidade

  **Ambientes Suportados:**
  - ✅ `localhost` (desenvolvimento)
  - ✅ `dev` / `staging` (domínios customizados)
  - ✅ `production` (HTTPS obrigatório)
  - ✅ Comportamento **independente de NODE_ENV**

  ***

  ## 🔹 Bloco B — ConsentScriptLoader com Bloqueio Real

  ### 🚫 Contrato de Bloqueio Garantido

  > **Nenhum script não necessário executa antes do consentimento correspondente.**

  ### ✨ Sistema de Fila e Priorização

  Implementado `ConsentScriptLoader` com:

  ```typescript
  registerScript({
    id: 'google-analytics',
    category: 'analytics',
    priority: 1, // Ordem de execução
    execute: () => {
      // Seu script aqui
    },
    onConsentUpdate: (granted) => {
      // Reagir a mudanças de consentimento
    },
  })
  ```

  **Recursos Implementados:**
  - ✅ **Fila interna de execução** com ordenação por:
    - 1. Categoria (`necessary` → `analytics` → `marketing`, etc.)
    - 2. Prioridade (numérica)
    - 3. Timestamp (ordem de registro)
  - ✅ Scripts `necessary` executam **imediatamente**
  - ✅ Scripts de outras categorias aguardam **consentimento explícito**
  - ✅ Suporte a `onConsentUpdate` para reconfiguração dinâmica
  - ✅ Snapshot de consentimento para scripts que precisam do estado atual
  - ✅ **Otimização anti-duplicação**: integrações não são reexecutadas a cada render quando criadas inline (ex.: `integrations={[createGoogleAnalyticsIntegration(...)]}`). Sistema mantém hash estrutural para detectar mudanças reais e prevenir múltiplas inicializações do mesmo script.

  **Observabilidade em DEV:**
  - ✅ Logs detalhados de ordem de execução
  - ✅ Indicação clara de categoria liberada
  - ✅ Rastreamento de status de cada script
  - ⚠️ **Silencioso em produção** (performance otimizada)

  ***

  ## 🔹 Bloco C — Integração Nativa Google Consent Mode v2

  ### 🎯 Implementação Automática

  **Zero configuração manual necessária!**

  ```typescript
  import { createGoogleAnalyticsIntegration } from '@react-lgpd-consent/core'

  const ga4 = createGoogleAnalyticsIntegration({
    measurementId: 'G-XXXXXXXXXX'
  })

  <ConsentScriptLoader integrations={[ga4]} />
  ```

  **O que a biblioteca faz automaticamente:**
  1. ✅ Inicializa `dataLayer` se não existir
  2. ✅ Define `gtag('consent', 'default', denied)` **antes** de qualquer tag
  3. ✅ Mapeia categorias corretamente:
     - `analytics` → `analytics_storage`
     - `marketing` → `ad_storage`, `ad_user_data`, `ad_personalization`
  4. ✅ Envia `gtag('consent', 'update')` quando usuário escolhe preferências
  5. ✅ Dispara eventos de ciclo de vida:
     ```javascript
     { event: 'consent_initialized' }
     { event: 'consent_updated', preferences: {...} }
     ```

  **Factories Implementadas:**
  - ✅ `createGoogleAnalyticsIntegration` (GA4)
  - ✅ `createGoogleTagManagerIntegration` (GTM)
  - ✅ Suporte a `bootstrap()` para inicialização pré-consentimento
  - ✅ Suporte a `onConsentUpdate()` para reconfiguração dinâmica

  ### 🔒 Ordem de Inicialização Segura

  Fluxo garantido pela implementação:

  ```
  1. dataLayer criado
  2. gtag('consent', 'default', denied)
  3. Loader bloqueia tags
  4. Usuário consente
  5. gtag('consent', 'update', granted/denied)
  6. Tags disparam conforme consentimento
  ```

  ### ⚡ Compatibilidade Next.js (SSR)
  - ✅ Nenhum acesso a `window` fora de `useEffect`
  - ✅ App Router (Next.js 13+)
  - ✅ Pages Router (Next.js 12+)
  - ✅ **Zero hydration mismatch**
  - ✅ Estratégia de renderização: `client-only` quando necessário

  ***

  ## 🆕 Novas APIs Públicas

  ### Core Package (`@react-lgpd-consent/core`):

  ```typescript
  // Registro de scripts
  registerScript(config: RegisteredScript): void

  // Factories de integrações
  createGoogleAnalyticsIntegration(config): ScriptIntegration
  createGoogleTagManagerIntegration(config): ScriptIntegration

  // Utilitários de cookie
  readConsentCookie(name?: string): ConsentState | null
  writeConsentCookie(state: ConsentState, options?: CookieOptions): void

  // Novos tipos
  type RegisteredScript = { ... }
  type ScriptIntegration = { ... }
  interface LoadScriptOptions = { ... }
  ```

  ***

  ## 📚 Documentação Atualizada
  - ✅ **API.md** - Novas APIs de `registerScript` e Consent Mode v2
  - ✅ **INTEGRACOES.md** - Guias completos de GA4, GTM, Facebook Pixel
  - ✅ **MIGRATION.md** - Guia de migração v0.7.0 → v0.7.1
  - ✅ **SUPER_TASK_VALIDATION.md** - Relatório técnico de validação completo

  ***

  ## 🔄 Breaking Changes

  **Nenhum!** Esta release é 100% backward-compatible:
  - ✅ Opção `maxAgeDays` deprecated mas funcional
  - ✅ Comportamento padrão preservado
  - ✅ APIs antigas continuam funcionando
  - ✅ Migração gradual suportada

  ***

  ## 🎯 Melhorias Complementares

  ### Sistema de i18n para Diagnósticos

  Sistema básico de internacionalização para mensagens de peer dependencies:
  - ✅ Suporte a pt-BR (padrão) e en
  - ✅ API para customização: `setPeerDepsLocale()`, `setPeerDepsMessages()`
  - ✅ Mensagens extraídas para constantes (melhor manutenibilidade)

  ### Refatorações e Otimizações
  - ✅ Strings de mensagens extraídas para constantes
  - ✅ Separação de concerns (lógica vs conteúdo)
  - ✅ Type safety aprimorado em toda API
  - ✅ Performance otimizada (sem logs em produção)
  - ✅ **Fix crítico**: Prevenção de reexecução de integrações a cada render quando `integrations` prop muda referência (inline array). Sistema agora usa hash estrutural para detectar mudanças reais e manter scripts já registrados estáveis.

- Updated dependencies [[`33bc0eb`](https://github.com/lucianoedipo/react-lgpd-consent/commit/33bc0ebcb40ce65c70b02668d3c0a97efb1854f1)]:
  - @react-lgpd-consent/core@0.7.1
  - @react-lgpd-consent/mui@0.7.1

## 0.7.0

### Minor Changes

- [#124](https://github.com/lucianoedipo/react-lgpd-consent/pull/124) [`7669c4f`](https://github.com/lucianoedipo/react-lgpd-consent/commit/7669c4fba84b5cfea8f7da8ab65468110d3e77f7) Thanks [@lucianoedipo](https://github.com/lucianoedipo)! - # v0.7.0 - Código Limpo, Testes Aprimorados e Qualidade de Código

  Esta release é parte do trabalho nas issues: [#60](https://github.com/lucianoedipo/react-lgpd-consent/issues/60), [#63](https://github.com/lucianoedipo/react-lgpd-consent/issues/63), [#64](https://github.com/lucianoedipo/react-lgpd-consent/issues/64), [#65](https://github.com/lucianoedipo/react-lgpd-consent/issues/65), [#68](https://github.com/lucianoedipo/react-lgpd-consent/issues/68), [#70](https://github.com/lucianoedipo/react-lgpd-consent/issues/70), [#71](https://github.com/lucianoedipo/react-lgpd-consent/issues/71), [#72](https://github.com/lucianoedipo/react-lgpd-consent/issues/72)

  ## 🧹 Correções de Lint e Code Quality

  ### Migração para APIs Modernas
  - **globalThis**: Convertidos ~50+ usos de `window` e `global` para `globalThis.window` e `globalThis` (compatibilidade SSR/universal)
  - **String.replaceAll()**: Migrado de `replace()` com regex global para `replaceAll()` (ES2021)
  - **Object.hasOwn()**: Migrado de `Object.prototype.hasOwnProperty.call()` para `Object.hasOwn()` (ES2022)
  - **Number.parseInt()**: Padronizado uso de `Number.parseInt()` em vez de `parseInt()` global

  ### TypeScript Configuration
  - Adicionado `ES2021.String` ao lib do tsconfig para suportar `String.replaceAll()`
  - Adicionado `ES2022.Object` ao lib do tsconfig para suportar `Object.hasOwn()`
  - Mantida compatibilidade com target `ES2020`

  > **ℹ️ Atenção à Compatibilidade com Browsers**
  >
  > Esta versão faz uso de recursos ES2021/ES2022 (`String.replaceAll()`, `Object.hasOwn()`, etc.), que não estão disponíveis em todos os navegadores (especialmente versões antigas do Safari, Edge ou Firefox). Se você utiliza este pacote em aplicações web que precisam suportar navegadores legados, é recomendado configurar um transpiler (como Babel) e/ou polyfills apropriados para garantir compatibilidade.

  ### Melhorias de Código
  - **cookieDiscovery.ts**: Função `matchPattern` movida para outer scope (evita recriação)
  - **validation.ts**: Adicionado warning quando prop `categories` não é fornecida
  - **Condições**: Invertidas condições negadas para melhor legibilidade
  - **Type Safety**: Correções de type assertions em testes

  ## 🧪 Aumento Significativo de Cobertura de Testes

  ### Cobertura Geral: 94.82% → 95.46% (+0.64%)

  | Arquivo                | Antes  | Depois      | Melhoria |
  | ---------------------- | ------ | ----------- | -------- |
  | **theme.ts**           | 83.33% | **100%** ✅ | +16.67%  |
  | **cookieDiscovery.ts** | 88.13% | **96.61%**  | +8.48%   |
  | **peerDepsCheck.ts**   | 74.19% | **80.64%**  | +6.45%   |
  | **validation.ts**      | 96.87% | **98.24%**  | +1.37%   |

  ### Novos Testes Adicionados (+33 testes: 318 → 351)

  #### peerDepsCheck.ts
  - Testes para detecção de múltiplas instâncias React via DevTools hook
  - Testes para verificação de versões React no limite inferior/superior do range
  - Testes para logging de erros e warnings quando `logWarnings=true`
  - Cobertura de edge cases de versão semver complexa

  #### dataLayerEvents.ts
  - Testes para `ensureDataLayer` criar dataLayer quando undefined
  - Testes para preservação de eventos existentes no dataLayer
  - Testes para origins programmatic/reset
  - Testes para previousCategories vazias/undefined
  - Testes de SSR safety (window parcialmente definido)
  - Testes para falha silenciosa de dataLayer.push

  #### cookieDiscovery.ts
  - Testes para uso de cookies descobertos globalmente (`__LGPD_DISCOVERED_COOKIES__`)
  - Testes para `registerOverrides=true` chamando `setCookieCatalogOverrides`
  - Testes para cookies sem nome ou duplicados
  - Testes para match de padrões wildcard

  #### cookieUtils.ts
  - Testes para JSON malformado e objetos vazios
  - Testes para `buildConsentStorageKey` com caracteres especiais
  - Testes para `createConsentAuditEntry` com estado mínimo
  - Testes para uso de nomes customizados em `removeConsentCookie`

  #### theme.ts (100% coverage)
  - Testes completos para palette, typography e component overrides
  - Testes para button contained hover shadows
  - Testes para Paper e Dialog border radius
  - Testes para função deprecada `defaultConsentTheme()`
  - Verificação de novas instâncias a cada chamada

  ## 📚 Documentação

  ### DEVELOPMENT.md
  - Adicionada seção **"Cobertura de Testes"** com tabela de métricas por módulo
  - Comando para rodar testes com cobertura: `pnpm test:coverage`
  - Tabela detalhada mostrando Statements/Branches/Functions/Lines por pacote

  ### TypeDoc
  - Documentação regenerada com todas as APIs atualizadas
  - 15 warnings aceitáveis sobre links relativos para pacotes do monorepo

  ## ✅ Validação
  - ✅ **type-check**: Todos os tipos válidos (ES2021/ES2022 APIs suportadas)
  - ✅ **lint**: Código limpo sem erros
  - ✅ **test**: 351/351 testes passando (100%)
  - ✅ **build**: Build limpo de todos os pacotes
  - ✅ **docs**: TypeDoc gerado com sucesso

  ## 🔧 Arquivos Modificados

  ### Core Package
  - `src/utils/scriptIntegrations.ts`: globalThis, Date.now()
  - `src/utils/peerDepsCheck.ts`: globalThis, Number.parseInt()
  - `src/utils/dataLayerEvents.ts`: globalThis, ??= operator
  - `src/utils/cookieUtils.ts`: replaceAll(), globalThis, condição invertida
  - `src/utils/cookieDiscovery.ts`: matchPattern outer scope
  - `src/utils/validation.ts`: warning categories undefined
  - `src/context/ConsentContext.tsx`: Object.hasOwn(), state deps
  - `src/context/__tests__/CategoriesContext.test.tsx`: globalThis
  - `__tests__/*`: +25 novos testes

  ### MUI Package
  - `src/utils/theme.ts`: 100% coverage
  - `src/utils/__tests__/theme.test.ts`: +8 novos testes

  ### Configuration
  - `tsconfig.base.json`: ES2021.String, ES2022.Object no lib

  ### Documentation
  - `DEVELOPMENT.md`: seção de cobertura de testes

  ***

  **Breaking Changes:** Nenhuma
  **Migration Required:** Não

  Esta release foca em qualidade de código, testes robustos e aderência a padrões modernos do JavaScript/TypeScript.

### Patch Changes

- Updated dependencies [[`7669c4f`](https://github.com/lucianoedipo/react-lgpd-consent/commit/7669c4fba84b5cfea8f7da8ab65468110d3e77f7)]:
  - @react-lgpd-consent/core@0.7.0
  - @react-lgpd-consent/mui@0.7.0

## 0.6.3

### Patch Changes

- [#115](https://github.com/lucianoedipo/react-lgpd-consent/pull/115) [`2a54bae`](https://github.com/lucianoedipo/react-lgpd-consent/commit/2a54bae6bbbe068b75e489eae72aa77705353d1e) Thanks [@lucianoedipo](https://github.com/lucianoedipo)! - Adiciona RECIPES.md com 8 receitas práticas, WORKFLOWS.md documentando CI/CD completo, novos workflows de versionamento/publicação/docs, correção de versão do TypeDoc e atualização da documentação em inglês.

- Updated dependencies [[`2a54bae`](https://github.com/lucianoedipo/react-lgpd-consent/commit/2a54bae6bbbe068b75e489eae72aa77705353d1e)]:
  - @react-lgpd-consent/core@0.6.3
  - @react-lgpd-consent/mui@0.6.3

## 0.6.2

### Patch Changes

- [#113](https://github.com/lucianoedipo/react-lgpd-consent/pull/113) [`b51e1f8`](https://github.com/lucianoedipo/react-lgpd-consent/commit/b51e1f8dcac35907e3a30471135da14160c95213) Thanks [@lucianoedipo](https://github.com/lucianoedipo)! - feat: Compatibilidade completa com React 19 StrictMode
  - Implementado registro global `LOADING_SCRIPTS` em `scriptLoader.ts` para prevenir injeções duplicadas de scripts durante double-invoking de efeitos
  - Adicionado `setTimeout` com cleanup adequado em `ConsentScriptLoader.tsx` para prevenir race conditions
  - Scripts agora carregam apenas uma vez mesmo em desenvolvimento com StrictMode ativo
  - Função `loadScript` é idempotente: múltiplas chamadas simultâneas retornam a mesma Promise
  - **Correção crítica**: `loadScript` agora aguarda dinamicamente o consentimento em vez de rejeitar imediatamente, permitindo que scripts carreguem quando preferências mudarem
  - Cleanup automático do registro ao completar/falhar carregamento
  - Adicionados testes extensivos: `ConsentScriptLoader.strictmode.test.tsx` e `scriptLoader.strictmode.test.ts`
  - Documentação completa em `REACT19-STRICTMODE.md`
  - Todos os 302 testes passando, incluindo 5 novos testes de StrictMode

  **Breaking Changes:** Nenhuma - totalmente retrocompatível

- Updated dependencies [[`b51e1f8`](https://github.com/lucianoedipo/react-lgpd-consent/commit/b51e1f8dcac35907e3a30471135da14160c95213)]:
  - @react-lgpd-consent/core@0.6.2
  - @react-lgpd-consent/mui@0.6.1

## 0.6.1

### Patch Changes

- [#105](https://github.com/lucianoedipo/react-lgpd-consent/pull/105) [`1deb3bb`](https://github.com/lucianoedipo/react-lgpd-consent/commit/1deb3bb56853165f7ec231e73d7b1d271e51b8f1) Thanks [@lucianoedipo](https://github.com/lucianoedipo)! - chore: sincronizar pnpm-lock.yaml com versões bumpeadas

- Updated dependencies [[`1deb3bb`](https://github.com/lucianoedipo/react-lgpd-consent/commit/1deb3bb56853165f7ec231e73d7b1d271e51b8f1)]:
  - @react-lgpd-consent/core@0.6.1
  - @react-lgpd-consent/mui@0.6.1

## 0.6.0

### Minor Changes

- [#103](https://github.com/lucianoedipo/react-lgpd-consent/pull/103) [`4c9ebf2`](https://github.com/lucianoedipo/react-lgpd-consent/commit/4c9ebf231ff58168294f2fde405298b7087016ca) Thanks [@lucianoedipo](https://github.com/lucianoedipo)! - feat: adicionar diagnósticos de peer dependencies e sistema de troubleshooting
  - ✨ Novo sistema de diagnóstico automático para peer deps
  - 🔍 Detecta múltiplas instâncias de React (causa "Invalid hook call")
  - 📋 Verifica versões de React (18-19) e MUI (5-7)
  - 📖 Nova página TROUBLESHOOTING.md com soluções detalhadas
  - 🔧 Mensagens acionáveis no console em modo desenvolvimento
  - 🚀 Configuração de Turborepo para builds otimizados
  - 📦 Configuração de Changesets para versionamento automatizado

### Patch Changes

- Updated dependencies [[`4c9ebf2`](https://github.com/lucianoedipo/react-lgpd-consent/commit/4c9ebf231ff58168294f2fde405298b7087016ca)]:
  - @react-lgpd-consent/core@0.6.0
  - @react-lgpd-consent/mui@0.6.0

---

## Versões Anteriores (< 0.6.0)

Para histórico completo detalhado de todas as versões, consulte:

- [Releases no GitHub](https://github.com/lucianoedipo/react-lgpd-consent/releases)
- [Git tags](https://github.com/lucianoedipo/react-lgpd-consent/tags)

### Resumo de Marcos Importantes:

**v0.5.0** (25/10/2025) - **Arquitetura Modular**

- Separação em 3 pacotes: `@react-lgpd-consent/core`, `@react-lgpd-consent/mui`, `react-lgpd-consent`
- Tree-shaking eficiente e suporte headless
- **Breaking Change**: Removida prop `theme` do ConsentProvider

**v0.4.5** (25/10/2025) - **DataLayer Events**

- Eventos padronizados para Google Tag Manager (`consent_initialized`, `consent_updated`)
- API pública para eventos customizados
- Rastreamento de origem de mudanças de consentimento

**v0.4.4** (06/10/2025) - **CI/CD e Codecov**

- Correção de workflow de publicação npm
- Integração com Codecov para coverage reports

**v0.4.3** (06/10/2025) - **Performance**

- React.memo em componentes puros
- Logger otimizado para produção
- Lazy loading de FloatingPreferencesButton
- Testes de acessibilidade com jest-axe

**v0.4.2** (06/10/2025) - **SSR e Validação**

- Quickstarts executáveis (Next.js App Router, Vite)
- Guia completo SSR/Next.js
- Validação de configuração com Zod (desenvolvimento)

**v0.4.1** (21/09/2025) - **Expansão de Integrações**

- 9 integrações nativas: GA4, GTM, UserWay, Facebook Pixel, Hotjar, Mixpanel, Clarity, Intercom, Zendesk
- Sistema completo de design tokens (200+ pontos de customização)
- Templates de texto: eCommerce, SaaS, Governo, Multilingual
- **Breaking Change**: `setPreference` e `ScriptIntegration.category` aceitam `string` (suporte a categorias customizadas)

**v0.4.0** (09/09/2025) - **Categorias Customizadas**

- Suporte a `customCategories` no ConsentProvider
- Integração completa com UI (modal de preferências)

**v0.3.7** (08/09/2025) - **Testes de UI**

- Cobertura de testes para CookieBanner (bloqueante/não-bloqueante)
- Testes de gating e lifecycle de scripts

**v0.3.6** (28/08/2025) - **Correção Crítica**

- Herança correta de ThemeProvider do Material-UI
- Previne redefinição de tema em composição de provedores

**v0.3.1** (13/08/2025) - **Compatibilidade**

- Correções de produção e compatibilidade com diferentes setups

**v0.3.0** (12/08/2025) - **DX Aprimorada**

- UI automática com CookieBanner e PreferencesModal
- Sistema de orientações para desenvolvedores

**v0.2.x** (12/08/2025) - **Conformidade LGPD**

- Sistema de orientações rigoroso
- Documentação de compliance

**v0.1.x** (09/08/2025) - **Lançamento Inicial**

- ConsentProvider, hooks, componentes básicos
- Modal de preferências
- Utilitários de cookie e script loading
- Suporte SSR inicial

---

O formato deste changelog é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).
