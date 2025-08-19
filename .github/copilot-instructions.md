# Instruções rápidas para agentes (react-lgpd-consent)

Objetivo: permitir que um agente de codificação seja imediatamente produtivo neste repositório, entendendo arquitetura, fluxos de trabalho e padrões específicos.

- Arquitetura em alto nível
  - Biblioteca React/TypeScript para gerenciamento de consentimento (LGPD).
  - Entrypoint: `src/index.ts` exporta `ConsentProvider`, hooks (`useConsent`), componentes e utilitários.
  - UI: componentes em `src/components` (ex.: `CookieBanner.tsx`, `PreferencesModal.tsx`, `FloatingPreferencesButton.tsx`) usam MUI (`sx`), design tokens e são substituíveis.
  - Estado/contrato: `src/context/ConsentContext.tsx` e `src/context/CategoriesContext.tsx` mantêm o estado de consentimento; `hooks/useConsent.ts` é a API consumida pelos componentes.
  - Integrações/scripts: `src/utils/scriptIntegrations.ts` e `src/utils/ConsentScriptLoader.tsx` carregam scripts condicionados ao consentimento (ex.: Google Analytics factory em exemplos).

- Comandos essenciais (execute antes de abrir PR)
  - Checagem de tipos: `npm run type-check` (executa `tsc --noEmit`)
  - Testes: `npm run test` (Jest + ts-jest)
  - Lint: `npm run lint` (ESLint)
  - Build (produz `dist`): `npm run build` (usa `tsup` e gera d.ts)
  - Formatar: `npm run format` (Prettier)

  Exemplo (PowerShell):

  ```powershell
  npm run type-check
  npm run test
  npm run build
  ```

- Padrões e convenções específicos
  - Tipos e API pública: atualize `src/index.ts` quando adicionar/remover exports públicos; `package.json` aponta `types: dist/index.d.ts`.
  - Design tokens: componentes consultam `designTokens` (ex.: `designTokens.layout.backdrop`, `colors.primary`) de forma defensiva — prefira usar tokens em `sx` para consistência.
  - UI usa Material-UI (peer dependency) e `sx` shorthand; evitar classes CSS globais que quebrem tree-shaking.
  - `categories` é obrigatório no `ConsentProvider` — implanta validações e mensagens no console (consulte `DEVELOPMENT.md` / `CONFORMIDADE.md`).
  - Logging de desenvolvedor: use `src/utils/logger.ts` para mensagens de `componentRender` e `apiUsage` — preservar eventos utilizados por análises.
  - Integrações: criar fábricas em `src/utils/scriptIntegrations.ts` e carregar via `ConsentScriptLoader`.
  - Não introduza efeitos colaterais no topo de módulos: `package.json` configura `sideEffects: false` para tree-shaking.

- Arquivos de referência (exemplos práticos)
  - Estado e hooks: `src/context/ConsentContext.tsx`, `src/hooks/useConsent.ts`
  - Componentes: `src/components/CookieBanner.tsx` (backdrop, position), `PreferencesModal.tsx`, `Branding.tsx`
  - Integrações e loaders: `src/utils/scriptIntegrations.ts`, `src/utils/ConsentScriptLoader.tsx`
  - Utilitários: `src/utils/logger.ts`, `src/utils/cookieUtils.ts`, `src/utils/scriptLoader.ts`
  - Tipos: `src/types/types.ts`
  - Exemplos de uso: `example/` (App.tsx, CompleteExample.tsx)

- Observações de manutenção e CI
  - Antes do PR: executar `npm run type-check` e `npm run build` localmente; CI também executa estes passos.
  - Dependências peer devem ser preservadas — ao instalar localmente, use `npm install --legacy-peer-deps` se encontrar `ERESOLVE` (ex.: conflito `@typescript-eslint` visto localmente).

- Quando alterar comportamento visual/UX
  - Prefira mudanças em tokens/design para permitir overrides pelos consumidores.
  - Exemplo: ajuste do backdrop (ver `src/components/CookieBanner.tsx`) deve suportar: `false` (sem backdrop), string (cor customizada) e fallback seguro (preto translúcido).

- Testes e convenções de teste
  - Arquivos de teste usam Jest/ts-jest; existem testes de contexto em `src/context`.
  - Nome dos testes: `*.test.tsx` ou `*.test.ts`.

Se algo estiver ambíguo ou faltar contexto (ex.: contrato de tokens de design não documentado), peça para um mantenedor adicionar um exemplo em `example/` ou um trecho em `API.md`. Após revisar, me diga se quer que eu adicione um teste pequeno ou atualize a documentação com exemplos concretos.
