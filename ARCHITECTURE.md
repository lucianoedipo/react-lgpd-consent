# Arquitetura de Pacotes - react-lgpd-consent v0.5.0

## 📦 Visão Geral

A biblioteca está organizada como um **monorepo PNPM** com três pacotes independentes que podem ser instalados separadamente.

```
react-lgpd-consent/ (monorepo root)
│
├── packages/
│   ├── core/                      # @react-lgpd-consent/core
│   ├── mui/                       # @react-lgpd-consent/mui
│   └── react-lgpd-consent/        # Agregador (compatibilidade)
│
├── .storybook/                    # Configuração Storybook
├── docs/                          # TypeDoc gerado
├── storybook-static/              # Storybook build
└── examples/                      # Exemplos práticos
```

## 🎯 Pacotes

### 1. @react-lgpd-consent/core

**Localização:** `packages/core/`  
**Tamanho:** 86 KB ESM | 89 KB CJS | 126 KB DTS  
**NPM:** `npm install @react-lgpd-consent/core`

**Responsabilidades:**
- Lógica headless de consentimento
- Context providers (ConsentProvider, DesignProvider, CategoriesContext)
- Hooks (useConsent, useCategories, useConsentHydration)
- Utilitários (logger, cookieUtils, scriptLoader)
- Integrações (Google Analytics, GTM, UserWay)
- Tipos TypeScript

**Estrutura:**
```
packages/core/src/
├── context/
│   ├── ConsentContext.tsx       # Provider principal
│   ├── CategoriesContext.tsx    # Gerenciamento de categorias
│   └── DesignContext.tsx        # Design tokens
│
├── hooks/
│   ├── useConsent.ts            # Hook principal
│   ├── useCategories.ts         # Hook de categorias
│   └── useConsentHydration.ts   # SSR hydration
│
├── utils/
│   ├── scriptIntegrations.ts    # Fábricas de integração
│   ├── ConsentScriptLoader.tsx  # Carregador de scripts
│   ├── logger.ts                # Sistema de logs
│   ├── cookieUtils.ts           # Manipulação de cookies
│   └── scriptLoader.ts          # Carregamento dinâmico
│
├── types/
│   ├── types.ts                 # Tipos principais
│   └── advancedTexts.ts         # Sistema de textos
│
└── index.ts                     # Entry point público
```

**Dependências:**
- `react@>=18`
- `react-dom@>=18`
- `js-cookie@3`
- `zod@4`

**Sem UI:** ❌ Material-UI não é dependência

### 2. @react-lgpd-consent/mui

**Localização:** `packages/mui/`  
**Tamanho:** 18 KB ESM | 21 KB CJS | 12 KB DTS (+ core)  
**NPM:** `npm install @react-lgpd-consent/mui @mui/material`

**Responsabilidades:**
- Componentes UI usando Material-UI
- Re-exporta todo o core
- Temas e design system MUI

**Estrutura:**
```
packages/mui/src/
├── components/
│   ├── CookieBanner.tsx         # Banner de consentimento
│   ├── PreferencesModal.tsx     # Modal de preferências
│   ├── FloatingPreferencesButton.tsx # Botão flutuante
│   └── Branding.tsx             # Logo/branding
│
├── context/
│   └── ConsentContext.theme.test.tsx  # Testes de tema
│
├── utils/
│   ├── SafeThemeProvider.tsx    # ThemeProvider seguro
│   └── theme.ts                 # Tema padrão
│
└── index.ts                     # Re-exports core + UI
```

**Dependências:**
- `@react-lgpd-consent/core@workspace:*`
- `@mui/material@>=5` (peer)
- `@emotion/react` (peer)
- `@emotion/styled` (peer)
- `@mui/icons-material` (peer, opcional)

**Inclui UI:** ✅ Componentes prontos

### 3. react-lgpd-consent

**Localização:** `packages/react-lgpd-consent/`  
**Tamanho:** 104 KB ESM (agregador)  
**NPM:** `npm install react-lgpd-consent @mui/material`

**Responsabilidades:**
- Pacote agregador para compatibilidade v0.4.x
- Re-exporta `@react-lgpd-consent/mui`
- Mantido para evitar breaking changes

**Estrutura:**
```
packages/react-lgpd-consent/src/
├── core.ts    # Re-export de @react-lgpd-consent/core
├── mui.ts     # Re-export de @react-lgpd-consent/mui
└── index.ts   # Entry point (exporta mui)
```

**Dependências:**
- `@react-lgpd-consent/mui@workspace:*`

## 🔄 Fluxo de Dependências

```
react-lgpd-consent (agregador)
       │
       └──> @react-lgpd-consent/mui
                  │
                  └──> @react-lgpd-consent/core
                           │
                           ├──> React 18/19
                           ├──> js-cookie
                           └──> zod
```

## 🛠️ Build e Desenvolvimento

### Scripts Principais

```bash
# Build todos os pacotes
pnpm run build

# Build individual
pnpm run build:core
pnpm run build:mui
pnpm run build:main

# Testes
pnpm run test              # Todos os pacotes
pnpm test --filter core    # Apenas core
pnpm test --filter mui     # Apenas mui

# Type-check
pnpm run type-check        # Todos os pacotes

# Linting
pnpm run lint

# Documentação
pnpm run docs:generate     # TypeDoc
pnpm run storybook         # Dev server
pnpm run build-storybook   # Build estático
```

### Configuração TypeScript

Cada pacote tem seu próprio `tsconfig.json`:

**Core:**
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist"
  },
  "include": ["src/**/*"],
  "exclude": ["**/*.test.ts", "**/*.test.tsx", "**/*.stories.tsx"]
}
```

**MUI:**
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist",
    "paths": {
      "@react-lgpd-consent/core": ["../core/src"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["**/*.test.ts", "**/*.test.tsx", "**/*.stories.tsx"]
}
```

### Build Tool

Todos os pacotes usam **tsup** para build:

```typescript
// tsup.config.ts (exemplo)
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', '@mui/material'],
  treeshake: true,
})
```

## 📚 Documentação

### TypeDoc

Configurado para gerar docs de múltiplos entry points:

```json
{
  "entryPoints": [
    "packages/core/src/index.ts",
    "packages/mui/src/index.ts"
  ]
}
```

**Output:** `docs/`

### Storybook

Configurado para buscar stories no pacote MUI:

```typescript
// .storybook/main.ts
export default {
  stories: ['../packages/mui/src/**/*.stories.@(js|jsx|ts|tsx)']
}
```

**Output:** `storybook-static/`

### GitHub Pages

Workflow `deploy-docs.yml` cria estrutura integrada:

```
integrated-docs/
├── index.html           # Navegação principal
├── modules.html         # TypeDoc
├── storybook/           # Storybook
├── sitemap.xml          # SEO
└── robots.txt           # Crawlers
```

## 🚀 Publicação NPM

Cada pacote pode ser publicado independentemente:

```bash
# Publicar individualmente
pnpm run publish:core
pnpm run publish:mui
pnpm run publish:main

# Publicar todos (coordenado)
pnpm run publish:all
```

**Versioning:** Todos os pacotes usam mesma versão (0.5.0)

## 🧪 Testes

### Estrutura de Testes

- **Core:** 29 test suites, 207 testes
- **MUI:** 29 test suites, 207 testes (inclui testes do core)
- **React-lgpd-consent:** 29 test suites, 207 testes

### Configuração Jest

```typescript
// jest.config.ts
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/packages/core/src'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: '<rootDir>/packages/core/tsconfig.json'
    }]
  }
}
```

## 🌳 Tree-shaking

### Core Package

✅ **Otimizado para tree-shaking:**
- `sideEffects: false` em package.json
- Exports ESM puros
- Sem side effects no módulo top-level

### MUI Package

✅ **Tree-shaking suportado:**
- Imports nomeados do core
- Componentes independentes
- Re-exports seletivos

## 📊 Bundle Analysis

### Tamanhos por Formato

| Pacote | ESM | CJS | DTS |
|--------|-----|-----|-----|
| Core | 86.04 KB | 89.12 KB | 125.82 KB |
| MUI | 17.69 KB | 20.95 KB | 11.78 KB |
| Agregador | ~104 KB* | ~110 KB* | ~138 KB* |

\* Bundle final = core + mui

### Dependências Externas

**Core:**
- `react` (peer)
- `react-dom` (peer)
- `js-cookie@3.0.5`
- `zod@4.1.12`

**MUI:**
- Todo do core +
- `@mui/material@>=5` (peer)
- `@emotion/react` (peer)
- `@emotion/styled` (peer)

## 🔐 Segurança e Qualidade

### CI/CD

- ✅ Type-check em todos os pacotes
- ✅ Lint (ESLint flat config)
- ✅ Testes (207 testes passando)
- ✅ Build validation
- ✅ Coverage reports (Codecov)

### Node Version

- **Requerido:** Node >= 20.0.0 (`.nvmrc`)
- **Package manager:** PNPM >= 10

## 📖 Recursos

- [README Principal](./README.md)
- [Guia de Migração](./MIGRATION.md)
- [Quickstart](./QUICKSTART.md)
- [API Reference](./packages/react-lgpd-consent/API.md)
- [CHANGELOG](./packages/react-lgpd-consent/CHANGELOG.md)
- [Storybook](https://lucianoedipo.github.io/react-lgpd-consent/storybook/)
- [TypeDoc](https://lucianoedipo.github.io/react-lgpd-consent/)

---

**Mantido por:** [@lucianoedipo](https://github.com/lucianoedipo)  
**Licença:** MIT
