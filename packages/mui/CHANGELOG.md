# @react-lgpd-consent/mui

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
