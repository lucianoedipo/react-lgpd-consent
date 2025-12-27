# Changelog

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
  - Documentação completa em `docs/REACT19-STRICTMODE.md`
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
