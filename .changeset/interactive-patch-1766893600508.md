---
'@react-lgpd-consent/core': patch
'@react-lgpd-consent/mui': patch
'react-lgpd-consent': patch
---

- fix: corrigir formatação da verificação de múltiplas versões do React
- docs: atualizar instruções para agentes com visão geral do projeto e comandos essenciais
- feat: adicionar gerenciamento de eventos para categorias obrigatórias no CategoriesProvider
- refactor: replace direct document and window references with globalThis for better compatibility
- Updated scriptLoader, cookieDiscovery, cookieUtils, dataLayerEvents, developerGuidance, peerDepsCheck, scriptIntegrations, and scriptLoader files to use globalThis.document and globalThis.window.
- Improved cookie handling functions to check for document and window availability using globalThis.
- Enhanced tests to reference globalThis for consistency.
- Cleaned up code formatting and comments for clarity.
- Updated documentation to reflect changes in globalThis usage.
- feat: add tests for CookieBanner, FloatingPreferencesButton, and PreferencesModal components
- Implement tests for CookieBanner to verify rendering based on consent and debug mode.
- Enhance FloatingPreferencesButton tests to check for localized text via props.
- Extend PreferencesModal tests to cover temporary preference resets, active scripts rendering, and custom text application.
- Update API documentation to include new integration functions and ESM/CJS testing configurations.
- Introduce interactive changeset script for easier versioning in monorepos.
- Refactor coverage check script to use node imports.
- Adjust TypeDoc script for ESM compatibility.
- Fix path resolution in tsconfig for better module imports.
