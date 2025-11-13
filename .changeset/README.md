# Changesets - react-lgpd-consent

Esta pasta contém os changesets que documentam mudanças nos pacotes do monorepo.

## 🚀 Como criar um changeset

```bash
pnpm changeset
```

Siga o prompt interativo:

1. Selecione os pacotes afetados (space para selecionar, enter para confirmar)
2. Escolha o tipo de bump (major/minor/patch)
3. Descreva a mudança

## 📝 Estrutura do changeset

```markdown
---
'@react-lgpd-consent/core': minor
'@react-lgpd-consent/mui': minor
'react-lgpd-consent': minor
---

feat: descrição curta da mudança

- Detalhes da mudança
- Outra mudança relacionada
```

## 📦 Tipos de bump (Semver)

- **patch** (0.0.x): Correções de bugs, ajustes menores
- **minor** (0.x.0): Novas funcionalidades, mudanças não-breaking
- **major** (x.0.0): Breaking changes

## 🔗 Pacotes linkados

Os três pacotes principais são versionados juntos:

- `@react-lgpd-consent/core`
- `@react-lgpd-consent/mui`
- `react-lgpd-consent`

Quando um changeset afeta qualquer um deles, todos recebem o mesmo bump de versão.

## 📊 Status dos changesets

Ver changesets pendentes:

```bash
pnpm changeset status
```

## 🤖 Processo automático

Após merge na `main`:

1. Workflow detecta changesets
2. Cria/atualiza PR "Version Packages"
3. Ao mergear PR:
   - ✅ Versões são atualizadas
   - ✅ CHANGELOGs são gerados com links para GitHub
   - ✅ Pacotes são publicados no npm
   - ✅ Release é criado no GitHub

## 📚 Documentação

- [VERSIONING.md](../VERSIONING.md) - Guia completo de versionamento
- [Changesets Docs](https://github.com/changesets/changesets)
- [Common Questions](https://github.com/changesets/changesets/blob/main/docs/common-questions.md)
