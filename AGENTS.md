# Guia para Agentes de IA (react-lgpd-consent)

Este guia fornece o contexto essencial para que um agente de IA seja imediatamente produtivo neste repositório.

**Preferências Globais:**
- **Idioma:** Interações em `pt-BR`.
- **Formatos:** Data `DD/MM/YYYY`, Hora `HH:mm:ss` (24h).

**Arquivos de Contexto Primários:**
- `GEMINI.md`
- `AGENTS.md`
- `.github/copilot-instructions.md`

---

## 1. Visão Geral do Projeto

`react-lgpd-consent` é uma biblioteca modular em React/TypeScript para gerenciamento de consentimento de cookies (LGPD/GDPR).

- **Arquitetura:** Monorepo gerenciado com `pnpm` e `Turborepo`.
- **Modularidade:**
  - `@react-lgpd-consent/core`: Lógica headless (hooks, context).
  - `@react-lgpd-consent/mui`: Componentes de UI com Material-UI.
  - `react-lgpd-consent`: Pacote agregador principal.
- **Tecnologias:** React 18/19, TypeScript, Material-UI, Jest, Storybook.

---

## 2. Arquitetura do Monorepo

- `packages/core`: Lógica de negócio, hooks, contextos e utilitários. Sem dependências de UI.
- `packages/mui`: Componentes de UI (`CookieBanner`, `PreferencesModal`) que dependem do pacote `core`.
- `packages/react-lgpd-consent`: Pacote agregador que re-exporta tudo para fácil consumo.
- `example/` & `examples/`: Exemplos de uso e projetos completos (Next.js, Vite).
- `.storybook/`: Configuração do Storybook para desenvolvimento interativo de UI.

---

## 3. Comandos Essenciais

Todos os comandos devem ser executados a partir da raiz do projeto.

- **Instalar Dependências:**
  ```bash
  pnpm install
  ```
- **Build (todos os pacotes):**
  ```bash
  pnpm build
  ```
- **Testes (todos os pacotes):**
  ```bash
  pnpm test
  ```
- **Lint (todos os pacotes):**
  ```bash
  pnpm lint
  ```
- **Type-Check (todos os pacotes):**
  ```bash
  pnpm type-check
  ```
- **Formatação:**
  ```bash
  pnpm format
  ```
- **Storybook (desenvolvimento de UI):**
  ```bash
  pnpm storybook
  ```
- **Gerar Documentação (TypeDoc):**
  ```bash
  pnpm docs:generate
  ```

### Pipeline Completo (Pré-PR)

```bash
pnpm type-check && pnpm test && pnpm lint && pnpm build && pnpm docs:generate
```

### Comandos Específicos de Pacote

Use `pnpm --filter <nome-do-pacote>` para executar um script em um único pacote.
```bash
# Testar apenas o pacote core
pnpm --filter @react-lgpd-consent/core test

# Fazer build apenas do pacote mui
pnpm --filter @react-lgpd-consent/mui build
```

---

## 4. Padrões e Convenções

- **API Pública:** Ao adicionar/remover exports, atualize o `index.ts` do respectivo pacote (`packages/*/src/index.ts`).
- **Estilo de Código:** Siga as regras do ESLint e Prettier (sem ponto e vírgula, aspas simples, largura 100).
- **Commits:** Use [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, etc.).
- **Design Tokens:** Componentes em `packages/mui` devem usar `designTokens` do contexto para consistência.
- **LGPD (Core Logic):** A prop `categories` é obrigatória no `ConsentProvider`. Validações e logs estão em `packages/core`.
- **Logging:** Use o utilitário de logger em `packages/core/src/utils/logger.ts`.
- **Integrações:** Fábricas de scripts estão em `packages/core/src/utils/scriptIntegrations.ts` e são carregadas via `ConsentScriptLoader`.
- **Posicionamento:** Componentes MUI (`CookieBanner`, `FloatingPreferencesButton`) suportam props `position`, `anchor` e `offset` para controle preciso de layout e evitar colisões com elementos fixos.
- **Qualidade de Código:**
  - **Tree-shaking:** Módulos são `sideEffects: false`. Não introduza efeitos colaterais no nível superior dos arquivos.
  - **SSR-Safe:** Efeitos devem ser executados apenas no cliente. Verifique a existência de `window`.
  - **React 19:** Efeitos devem ser idempotentes e ter cleanup adequado para o `StrictMode`.

---

## 5. Testes

- **Framework:** Jest + React Testing Library. Configurações em `jest.config.mjs` e `jest.setup.ts`.
- **Localização:** Testes são co-localizados com os arquivos de origem (`*.test.tsx`) dentro de cada pacote.
- **Foco:** Testar comportamento do usuário e acessibilidade, evitando detalhes de implementação.
- **Testes Específicos de LGPD:**
  - Gerenciamento de estado de consentimento.
  - Validação de categorias de cookies.
  - Mock de integrações de scripts (GA, GTM).
  - Comportamento SSR-safe.
  - Overrides de `designTokens`.

---

## 6. Documentação (TSDoc)

- **Tags de Categoria:** Use `@category` para agrupar (ex: `Components`, `Hooks`, `Utils`).
- **Tags Essenciais:** `@example`, `@param`, `@returns` para APIs públicas.
- **Componentes:** Use `@component`, `@since` (SemVer), e `@see` para links relacionados.
- **Decisões de Design:** Use `@remarks` para explicar decisões de arquitetura, performance ou SSR.
- **Erros:** Use `@throws` para documentar erros previsíveis.

---

## 7. Arquivos de Referência

- **Estado e Hooks:** `packages/core/src/context/ConsentContext.tsx`, `packages/core/src/hooks/useConsent.ts`
- **Componentes:** `packages/mui/src/components/CookieBanner.tsx`, `PreferencesModal.tsx`
- **Integrações:** `packages/core/src/utils/scriptIntegrations.ts`, `ConsentScriptLoader.tsx`
- **Tipos:** `packages/core/src/types/types.ts`
- **Exemplos:** `example/` e `examples/`

Se algo estiver ambíguo, peça para um mantenedor adicionar um exemplo ou documentação.
