# Changelog

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
