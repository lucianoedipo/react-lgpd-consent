---
'@react-lgpd-consent/core': patch
'@react-lgpd-consent/mui': patch
'react-lgpd-consent': patch
---

### Correções

- 1d15920 fix: corrigir formatação da verificação de múltiplas versões do React

### Funcionalidades

- d641639 feat: adicionar gerenciamento de eventos para categorias obrigatórias no CategoriesProvider
- b04c00b feat: add tests for CookieBanner, FloatingPreferencesButton, and PreferencesModal components
- b04c00b Introduce interactive changeset script for easier versioning in monorepos.

### Refactors e compatibilidade

- ef2968a refactor: replace direct document and window references with globalThis for better compatibility
- ef2968a Updated scriptLoader, cookieDiscovery, cookieUtils, dataLayerEvents, developerGuidance, peerDepsCheck, scriptIntegrations, and scriptLoader files to use globalThis.document and globalThis.window.
- ef2968a Improved cookie handling functions to check for document and window availability using globalThis.
- ef2968a Enhanced tests to reference globalThis for consistency.
- ef2968a Cleaned up code formatting and comments for clarity.
- b04c00b Refactor coverage check script to use node imports.
- b04c00b Adjust TypeDoc script for ESM compatibility.
- 3af2fcb Fix path resolution in tsconfig for better module imports.

### Testes

- b04c00b Implement tests for CookieBanner to verify rendering based on consent and debug mode.
- b04c00b Enhance FloatingPreferencesButton tests to check for localized text via props.
- b04c00b Extend PreferencesModal tests to cover temporary preference resets, active scripts rendering, and custom text application.

### Documentação

- d430eef docs: atualizar instruções para agentes com visão geral do projeto e comandos essenciais
- d430eef Updated documentation to reflect changes in globalThis usage.
- d430eef Update API documentation to include new integration functions and ESM/CJS testing configurations.
