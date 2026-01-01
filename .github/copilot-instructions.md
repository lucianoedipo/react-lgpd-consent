# Instruções para agentes (react-lgpd-consent)

Interações em pt-BR. Data `DD/MM/YYYY`, hora `HH:mm:ss` (24h).

**REGRA CRÍTICA:** nunca gerar código para exibir avisos/resumos visuais. Apenas execute comandos diretos quando necessário.

## Contexto obrigatório

- `GEMINI.md` (não encontrado no repositório)
- `AGENTS.md`
- `.github/copilot-instructions.md`

## Visão geral

- Monorepo com `packages/core`, `packages/mui`, `packages/react-lgpd-consent`
- React/TypeScript para gestão de consentimento LGPD
- SSR-safe, client-only effects
- `sideEffects: false` (tree-shaking)
- UI em pt-BR; API pública em inglês; JSDoc pt-BR OK
- Peer deps: React 18/19, MUI 5–7

## Estrutura

- `packages/core/src`: lógica headless (context/hooks/utils/types)
- `packages/mui/src`: componentes UI (MUI + design tokens)
- `packages/react-lgpd-consent/src`: agregador
- `example/` e `examples/`: exemplos
- `docs/`: TypeDoc

## Comandos

```bash
npm run type-check
npm run test
npm run lint
npm run build
npm run docs:generate
```

## Padrões

- Sem efeitos no topo de módulo; preferir guards e efeitos (tree-shaking)
- SSR-safe: use `globalThis.window`/`globalThis.document` com guard
- Tokens de design via `designTokens` e `sx`
- Posicionamento configurável: `CookieBanner` e `FloatingPreferencesButton` suportam `position`, `anchor`, `offset`
- Integrações via `packages/core/src/utils/scriptIntegrations.ts` + `ConsentScriptLoader.tsx`
- Logging via `packages/core/src/utils/logger.ts`
- Atualize `packages/*/src/index.ts` ao expor APIs públicas
- Evite tocar em `dist/`, `docs/`, `storybook-static/`

## Testes & docs

- Jest + Testing Library; testes co-localizados em `packages/*/src/**`
- Preferir asserts comportamentais e acessibilidade
- TSDoc: `@category`, `@example`, `@param`, `@returns`, `@remarks`, `@since`, `@throws`

## Arquivos-chave

- `packages/core/src/context/ConsentContext.tsx`
- `packages/core/src/context/CategoriesContext.tsx`
- `packages/core/src/hooks/useConsent.ts`
- `packages/core/src/utils/ConsentScriptLoader.tsx`
- `packages/core/src/utils/scriptIntegrations.ts`
- `packages/mui/src/components/CookieBanner.tsx`
- `packages/mui/src/components/PreferencesModal.tsx`
