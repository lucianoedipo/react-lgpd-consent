---
'@react-lgpd-consent/core': patch
'@react-lgpd-consent/mui': patch
'react-lgpd-consent': patch
---

### Correcoes

- 1d8718b fix: corrigir versao do pacote react-lgpd-consent

### Refactors e compatibilidade

- ed5fa36 refactor: aprimorar a documentacao e estrutura de validacao do ConsentProvider
- 709e977 refactor: melhorar a validacao e sanitizacao das categorias no ConsentProvider
- 6ee4d03 refactor: melhorar descoberta e validacao de cookies
- 6ee4d03 refactor: refinar helpers de integracao para maior clareza
- 6ee4d03 refactor: simplificar logica de sincronizacao de versoes no script sync-versions.mjs

### Funcionalidades

- 6ee4d03 feat: aprimorar acessibilidade e gerenciamento de consentimento
- 6ee4d03 feat: estender matchers Jest com jest-axe para acessibilidade
- 6ee4d03 feat: recalcular categorias no CategoriesContext ao adicionar novas entradas
- 6ee4d03 feat: revisar textos de consentimento para mais clareza
- 6ee4d03 feat: introduzir modos de bloqueio no ConsentProvider
- 6ee4d03 feat: adicionar testes para hard blocking no ConsentProvider

### Documentacao

- 6ee4d03 docs: atualizar README e exemplos com novos recursos
