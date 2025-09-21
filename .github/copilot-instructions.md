# Instruções rápidas para agentes (react-lgpd-consent)

Interações em pt-BR, Date Format em BR: DD/MM/YYYY, Time Format em BR: HH:mm:ss 24h

Objetivo: permitir que um agente de codificação seja imediatamente produtivo neste repositório, entendendo arquitetura, fluxos de trabalho e padrões específicos.

- Arquitetura em alto nível
  - Biblioteca React/TypeScript para gerenciamento de consentimento (LGPD).
  - Entrypoint: `src/index.ts` exporta `ConsentProvider`, hooks (`useConsent`), componentes e utilitários.
  - UI: componentes em `src/components` (ex.: `CookieBanner.tsx`, `PreferencesModal.tsx`, `FloatingPreferencesButton.tsx`) usam MUI (`sx`), design tokens e são substituíveis.
  - Estado/contrato: `src/context/ConsentContext.tsx` e `src/context/CategoriesContext.tsx` mantêm o estado de consentimento; `hooks/useConsent.ts` é a API consumida pelos componentes.
  - Integrações/scripts: `src/utils/scriptIntegrations.ts` e `src/utils/ConsentScriptLoader.tsx` carregam scripts condicionados ao consentimento (ex.: Google Analytics factory em exemplos).

- Comandos essenciais (execute antes de abrir PR)
  - Checagem de tipos: `npm run type-check` (executa `tsc --noEmit`)
  - Testes: `npm run test` (Jest + ts-jest + Testing Library)
  - Lint: `npm run lint` (ESLint flat config)
  - Build (produz `dist`): `npm run build` (usa `tsup` e gera d.ts)
  - Formatar: `npm run format` (Prettier - no semicolons, single quotes, width 100)
  - Documentação: `npm run docs:generate` (TypeDoc - gera `docs/`)
  - Storybook: `npm run storybook` (UI components em http://localhost:6006)
  - Mutation testing: `npm run mutation` (Stryker - opcional, slower)

  Pipeline completo (PowerShell):

  ```powershell
  npm run type-check
  npm run test  
  npm run lint
  npm run build
  npm run docs:generate
  ```

- Padrões e convenções específicos
  - **Tipos e API pública**: atualize `src/index.ts` quando adicionar/remover exports públicos; `package.json` aponta `types: dist/index.d.ts`.
  - **Design tokens**: componentes consultam `designTokens` (ex.: `designTokens.layout.backdrop`, `colors.primary`) de forma defensiva — prefira usar tokens em `sx` para consistência.
  - **UI**: usa Material-UI (peer dependency) e `sx` shorthand; evitar classes CSS globais que quebrem tree-shaking.
  - **LGPD obrigatório**: `categories` é obrigatório no `ConsentProvider` — implanta validações e mensagens no console (consulte `DEVELOPMENT.md` / `CONFORMIDADE.md`).
  - **Logging de desenvolvedor**: use `src/utils/logger.ts` para mensagens de `componentRender` e `apiUsage` — preservar eventos utilizados por análises.
  - **Integrações**: criar fábricas em `src/utils/scriptIntegrations.ts` e carregar via `ConsentScriptLoader`.
  - **Tree-shaking**: não introduza efeitos colaterais no topo de módulos: `package.json` configura `sideEffects: false`.
  - **SSR-Safe**: efeitos só rodam no client; compatível NextJS.
  - **Testes**: co-localizados como `*.test.ts(x)` ou `*.behavior.test.tsx`; focus em comportamento e acessibilidade.
  - **Documentação TSDoc**: usar `@category`, `@component`, `@example`, `@param`, `@returns`, `@remarks`, `@since`, `@throws` conforme aplicável.

- Arquivos de referência (exemplos práticos)
  - Estado e hooks: `src/context/ConsentContext.tsx`, `src/hooks/useConsent.ts`
  - Componentes: `src/components/CookieBanner.tsx` (backdrop, position), `PreferencesModal.tsx`, `Branding.tsx`
  - Integrações e loaders: `src/utils/scriptIntegrations.ts`, `src/utils/ConsentScriptLoader.tsx`
  - Utilitários: `src/utils/logger.ts`, `src/utils/cookieUtils.ts`, `src/utils/scriptLoader.ts`
  - Tipos: `src/types/types.ts`
  - Exemplos de uso: `example/` (App.tsx, CompleteExample.tsx)

- **Observações de manutenção e CI**
  - **Antes do PR**: executar pipeline completo (`npm run type-check && npm run test && npm run lint && npm run build && npm run docs:generate`).
  - **Dependências peer**: devem ser preservadas — ao instalar localmente, use `npm install --legacy-peer-deps` se encontrar `ERESOLVE` (ex.: conflito `@typescript-eslint`).
  - **Commits convencionais**: use `feat:`, `fix:`, `docs:`, `test:`, `chore:`, `refactor:`, `ci:`.
  - **Formatação**: Prettier (no semicolons, single quotes, width 100, 2 spaces indent).
  - **Linting**: ESLint flat config; evitar `any`, documentar `// @ts-ignore`, React Hooks rules enforced.

- **Quando alterar comportamento visual/UX**
  - Prefira mudanças em tokens/design para permitir overrides pelos consumidores.
  - Exemplo: ajuste do backdrop (ver `src/components/CookieBanner.tsx`) deve suportar: `false` (sem backdrop), string (cor customizada) e fallback seguro (preto translúcido).

- **Testes e convenções de teste**
  - **Framework**: Jest + Testing Library (`jest.config.ts`, `jest.setup.ts`).
  - **Localização**: arquivos de teste co-localizados; nome: `*.test.tsx` ou `*.test.ts`; use `*.behavior.test.tsx` para fluxos UI.
  - **Foco**: evitar detalhes de implementação; assert behavior e accessibility roles/labels.
  - **LGPD-específico**: testar gerenciamento de estado de consentimento, validações de categoria, mock de integrações de scripts, verificar behavior SSR-safe, testar overrides de design tokens e integração MUI `sx`.

- **Documentação e TypeDoc**
  - **Categorias**: `Components`, `Hooks`, `Context`, `Utils`, `Types`.
  - **Tags obrigatórias**: `@category`, `@example` para APIs públicas, `@param`, `@returns`.
  - **Componentes**: `@component`, `@since` (SemVer), `@see` para links.
  - **Notas de design**: `@remarks` para decisões SSR/performance/design (pt-BR).
  - **Tratamento de erros**: `@throws` para erros previsíveis.

## Full Contexts use
- GEMINI.md
- .github\copilot-instructions.md

Se algo ainda estiver ambíguo ou faltar contexto (ex.: contrato de tokens de design não documentado), peça para um mantenedor adicionar um exemplo em `example/` ou um trecho em `API.md`. Após revisar, me diga se quer que eu adicione um teste pequeno ou atualize a documentação com exemplos concretos.
