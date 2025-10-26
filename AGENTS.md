# Repository Guidelines

Interações em pt-BR, Date Format em BR: DD/MM/YYYY, Time Format em BR: HH:mm:ss 24h

## Full Contexts use

- GEMINI.md
- .github\copilot-instructions.md

## Project Overview

- **Package**: `react-lgpd-consent` - React/TypeScript library for LGPD consent management
- **License**: MIT by @lucianoedipo
- **Language Policy**: UI in pt-BR; public API/names in English; JSDoc in pt-BR is OK
- **NextJS-friendly**: SSR-safe, client-only effects
- **Peer Dependencies**: React 18/19, MUI 5–7

## Project Structure & Modules

- **Source**: `src/` organized by feature and concern:
  - `components/` - UI components (CookieBanner, PreferencesModal, FloatingPreferencesButton) using MUI `sx` and design tokens
  - `context/` - ConsentContext and CategoriesContext for state management
  - `hooks/` - useConsent and other React hooks (primary consumer API)
  - `utils/` - scriptIntegrations, ConsentScriptLoader, logger, cookieUtils, scriptLoader
  - `types/` - TypeScript type definitions
  - `@types/` - Additional type declarations
- **Tests**: co-located in `src/**` as `*.test.ts(x)` or `*.spec.ts(x)`; some behavior tests use `*.behavior.test.tsx`
- **Stories**: `src/components/*.stories.tsx` (Storybook)
- **Build output**: `dist/` (ESM/CJS + types)
- **Docs**: `docs/` (generated via TypeDoc)
- **Examples**: `example/` (App.tsx, CompleteExample.tsx)

## Architecture Key Points

- **Entry Point**: `src/index.ts` exports ConsentProvider, hooks (useConsent), components and utilities
- **State Management**: ConsentContext.tsx and CategoriesContext.tsx maintain consent state
- **Script Loading**: scriptIntegrations.ts and ConsentScriptLoader.tsx load scripts based on consent
- **Design System**: Components use design tokens defensively (designTokens.layout.backdrop, colors.primary)
- **LGPD Focus**: `categories` is mandatory in ConsentProvider - includes validations and console messages
- **Tree-shaking Ready**: `package.json` configures `sideEffects: false`

## Build, Test, and Dev Commands

- `npm run build` – Build library with tsup (ESM/CJS + d.ts)
- `npm run dev` – Watch build for local development
- `npm test` – Run Jest (jsdom) test suite
- `npm run lint` / `npm run format` – ESLint and Prettier
- `npm run type-check` – TypeScript compile checks only (`tsc --noEmit`)
- `npm run storybook` – Run Storybook at `http://localhost:6006`
- `npm run docs:generate` – Generate API docs into `docs/` (TypeDoc)
- `npm run mutation` – Run Stryker mutation tests (optional, slower)

### Essential Pre-PR Pipeline

```powershell
npm run type-check
npm run test
npm run lint
npm run build
npm run docs:generate
```

## Coding Style & Naming

- Language: TypeScript (ESM). Node >= 20 (see `.nvmrc`)
- Formatting: Prettier (no semicolons, single quotes, width 100)
- Linting: ESLint flat config; key rules: no `any` (tests/stories allowed),
  require described `// @ts-ignore`, React Hooks rules enforced
- Indentation: 2 spaces; filenames in `camelCase` or `PascalCase` for components
- Exports: prefer named exports from index modules

### Documentation Standards (TSDoc/TypeDoc)

- **API Categories**: `Components`, `Hooks`, `Context`, `Utils`, `Types`
- **Required Tags**: `@category`, `@example` for public APIs, `@param`, `@returns`
- **Component Tags**: `@component`, `@since` (SemVer), `@see` for external links
- **Design Notes**: `@remarks` for SSR/performance/design decisions (pt-BR)
- **Error Handling**: `@throws` for predictable errors
- Update `src/index.ts` when adding/removing public exports; `package.json` points `types: dist/index.d.ts`

## Testing Guidelines

- Framework: Jest + Testing Library (`jest.config.mjs`, `jest.setup.ts`)
- Location: tests near code; name as `*.test.ts(x)`; use `*.behavior.test.tsx` for UI flows
- Avoid implementation details; assert behavior and accessibility roles/labels
- Run `npm test` locally; consider `npm run mutation` for critical logic

### LGPD-Specific Testing

- Test consent state management and category validation
- Mock script integrations (Google Analytics, GTM, UserWay)
- Verify SSR-safe behavior (client-only effects)
- Test design token overrides and MUI `sx` integration

## Commit & Pull Requests

- Use Conventional Commits: `feat:`, `fix:`, `docs:`, `test:`, `chore:`, `refactor:`, `ci:`
- PRs must include: clear description, linked issues, rationale, before/after notes;
  add/adjust tests and stories for UI changes; update docs where applicable
- Keep changes focused; do not reformat unrelated files

## LGPD & Design System Guidelines

- **Design Tokens**: Components use design tokens defensively; prefer tokens in `sx` for consistency
- **Script Loading**: Create factories in `src/utils/scriptIntegrations.ts` and load via `ConsentScriptLoader`
- **State Management**: `categories` is mandatory in ConsentProvider; includes validations and console messages
- **Logging**: Use `src/utils/logger.ts` for `componentRender` and `apiUsage` events
- **Tree-shaking**: Do not introduce side effects at module top level; `package.json` configures `sideEffects: false`

## Security & Config Tips

- Respect peer deps: React 18/19, MUI 5–7. Do not commit `dist/`
- Never include secrets in tests or stories; prefer environment-safe mocks

## Agent-Specific Notes

- Follow these rules for any edits within `src/**` and tests. Avoid touching generated folders (`dist/`, `docs/`, `storybook-static/`).

### Key Architecture Files

- **State & Hooks**: `src/context/ConsentContext.tsx`, `src/hooks/useConsent.ts`
- **Components**: `src/components/CookieBanner.tsx`, `PreferencesModal.tsx`, `FloatingPreferencesButton.tsx`
- **Integrations**: `src/utils/scriptIntegrations.ts`, `src/utils/ConsentScriptLoader.tsx`
- **Utils**: `src/utils/logger.ts`, `src/utils/cookieUtils.ts`, `src/utils/scriptLoader.ts`
- **Types**: `src/types/types.ts`
- **Examples**: `example/App.tsx`, `example/CompleteExample.tsx`
