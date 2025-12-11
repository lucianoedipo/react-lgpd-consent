# @react-lgpd-consent/mui

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

## 0.6.3

### Patch Changes

- [#115](https://github.com/lucianoedipo/react-lgpd-consent/pull/115) [`2a54bae`](https://github.com/lucianoedipo/react-lgpd-consent/commit/2a54bae6bbbe068b75e489eae72aa77705353d1e) Thanks [@lucianoedipo](https://github.com/lucianoedipo)! - Adiciona RECIPES.md com 8 receitas práticas, WORKFLOWS.md documentando CI/CD completo, novos workflows de versionamento/publicação/docs, correção de versão do TypeDoc e atualização da documentação em inglês.

- Updated dependencies [[`2a54bae`](https://github.com/lucianoedipo/react-lgpd-consent/commit/2a54bae6bbbe068b75e489eae72aa77705353d1e)]:
  - @react-lgpd-consent/core@0.6.3

## 0.6.1

### Patch Changes

- [#105](https://github.com/lucianoedipo/react-lgpd-consent/pull/105) [`1deb3bb`](https://github.com/lucianoedipo/react-lgpd-consent/commit/1deb3bb56853165f7ec231e73d7b1d271e51b8f1) Thanks [@lucianoedipo](https://github.com/lucianoedipo)! - chore: sincronizar pnpm-lock.yaml com versões bumpeadas

- Updated dependencies [[`1deb3bb`](https://github.com/lucianoedipo/react-lgpd-consent/commit/1deb3bb56853165f7ec231e73d7b1d271e51b8f1)]:
  - @react-lgpd-consent/core@0.6.1

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

---

## Versões Anteriores (< 0.6.0)

Para histórico completo de versões 0.5.x e anteriores, consulte:

- [CHANGELOG.md do pacote principal](../react-lgpd-consent/CHANGELOG.md)
- [Releases no GitHub](https://github.com/lucianoedipo/react-lgpd-consent/releases)

**Resumo de marcos importantes:**

- **v0.5.0** (25/10/2025): Criação do pacote `@react-lgpd-consent/mui` separando componentes UI
- **v0.4.3** (06/10/2025): Otimizações de performance (React.memo, useMemo, lazy loading)
- **v0.4.1** (21/09/2025): Sistema completo de design tokens (200+ pontos de customização)
- **v0.3.6** (28/08/2025): Correção de herança de ThemeProvider
- **v0.3.0-v0.3.7**: Componentes CookieBanner, PreferencesModal, FloatingPreferencesButton com testes de acessibilidade
