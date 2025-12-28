---
'@react-lgpd-consent/core': minor
'@react-lgpd-consent/mui': minor
'react-lgpd-consent': minor
---

### Correcoes

- 1d15920 fix: corrigir formatacao da verificacao de multiplas versoes do React

### Refactors e compatibilidade

- ed5fa36 refactor: aprimorar documentacao e estrutura de validacao do ConsentProvider
- 709e977 refactor: melhorar validacao e sanitizacao das categorias no ConsentProvider
- 6ee4d03 feat: recalcular categorias no CategoriesContext ao adicionar novas entradas
- 6ee4d03 refactor: melhorar descoberta e validacao de cookies
- 6ee4d03 refactor: refinar helpers de integracao para maior clareza
- 6ee4d03 refactor: simplificar logica de sincronizacao de versoes no script sync-versions.mjs
- ef2968a refactor: trocar acessos diretos a window/document por globalThis em loaders, utils e testes
- 3af2fcb fix: ajustar path resolution no tsconfig para melhor import de modulos

### Funcionalidades

- 6ee4d03 feat: aprimorar acessibilidade e gerenciamento de consentimento
- 6ee4d03 feat: estender matchers Jest com jest-axe para acessibilidade
- 6ee4d03 feat: revisar textos de consentimento para mais clareza
- 6ee4d03 feat: introduzir modos de bloqueio no ConsentProvider
- 6ee4d03 feat: adicionar testes para hard blocking no ConsentProvider
- d641639 feat: adicionar gerenciamento de eventos para categorias obrigatorias no CategoriesProvider

### Testes

- b04c00b feat: adicionar testes para CookieBanner, FloatingPreferencesButton e PreferencesModal
- b04c00b testes: validar renderizacao do CookieBanner por consentimento e modo debug
- b04c00b testes: verificar textos localizados no FloatingPreferencesButton via props
- b04c00b testes: cobrir reset temporario, scripts ativos e textos customizados no PreferencesModal

### Ferramentas

- b04c00b feat: script interativo de changeset para versionamento em monorepos
- b04c00b refactor: coverage-check usando node imports
- b04c00b refactor: ajustar script do TypeDoc para compatibilidade ESM

### Documentacao

- 6ee4d03 docs: atualizar README e exemplos com novos recursos
- d430eef docs: atualizar instrucoes para agentes com comandos essenciais
- d430eef docs: refletir uso de globalThis na documentacao
- d430eef docs: atualizar API com novas integracoes e configuracoes de testes ESM/CJS
- docs: quickstart com comentarios e nota sobre injecao automatica de UI MUI

### A11y

- a11y: PreferencesModal com aria-describedby
- a11y: testes de teclado (Escape + retorno de foco)
