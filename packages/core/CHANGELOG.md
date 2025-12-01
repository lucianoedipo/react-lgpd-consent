# Changelog - @react-lgpd-consent/core

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

## 0.6.1

### Patch Changes

- [#105](https://github.com/lucianoedipo/react-lgpd-consent/pull/105) [`1deb3bb`](https://github.com/lucianoedipo/react-lgpd-consent/commit/1deb3bb56853165f7ec231e73d7b1d271e51b8f1) Thanks [@lucianoedipo](https://github.com/lucianoedipo)! - chore: sincronizar pnpm-lock.yaml com versões bumpeadas

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

As notas de versão completas são mantidas no arquivo `CHANGELOG.md` da raiz do repositório.  
Este pacote segue a numeração conjunta da biblioteca `react-lgpd-consent`.
