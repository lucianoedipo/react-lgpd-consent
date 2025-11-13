# Guia de Versionamento e Release

Este projeto usa [Changesets](https://github.com/changesets/changesets) para gerenciar versões e publicações, e [Turborepo](https://turbo.build/) para otimizar builds e testes.

## 📦 Fluxo de Desenvolvimento

### 1. Fazendo alterações

Ao fazer alterações que devem ser publicadas:

```bash
# Criar um changeset
pnpm changeset
```

Isso irá:

- Perguntar quais pacotes foram alterados
- Perguntar o tipo de mudança (major/minor/patch)
- Solicitar uma descrição da mudança

### 2. Tipos de mudanças (Semver)

- **Patch** (0.0.x): Correções de bugs, ajustes menores
- **Minor** (0.x.0): Novas funcionalidades, mudanças não-breaking
- **Major** (x.0.0): Breaking changes

### 3. Commit

```bash
git add .
git commit -m "feat: sua feature"
git push
```

Os changesets criados devem ser commitados junto com o código.

## 🔄 Fluxo Completo de Release

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. DESENVOLVIMENTO                                              │
│    - Fazer mudanças no código                                   │
│    - pnpm changeset                                             │
│    - git commit + push                                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. PULL REQUEST                                                 │
│    - CI roda (lint, test, build)                                │
│    - Review de código                                           │
│    - Merge para main                                            │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. RELEASE WORKFLOW                                             │
│    - Detecta changesets                                         │
│    - Cria/atualiza PR "Version Packages"                        │
│    - Atualiza CHANGELOGs                                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. VERSION PR                                                   │
│    - Review automático das mudanças de versão                   │
│    - Merge quando pronto                                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. PUBLICAÇÃO AUTOMÁTICA                                        │
│    - ✅ Build de todos os pacotes                               │
│    - ✅ Publica no npm                                          │
│    - ✅ Cria tag Git (ex: v0.5.5)                               │
│    - ✅ Cria GitHub Release                                     │
│    - ✅ Notificações                                            │
└─────────────────────────────────────────────────────────────────┘
```

## 🚀 Processo de Release

### Automático (CI/CD) - RECOMENDADO

O projeto usa um workflow unificado de Release & Publish que:

**Quando mudanças são merged na branch `main`:**

1. **Workflow `release.yml` é acionado** automaticamente
2. **Changesets detecta mudanças**:
   - Se há changesets pendentes → cria/atualiza PR de release
   - Se não há changesets → nada acontece
3. **Ao fazer merge do PR de release**:
   - ✅ Versões são atualizadas (bump)
   - ✅ CHANGELOGs são gerados automaticamente
   - ✅ Pacotes são publicados no npm
   - ✅ Tag Git é criada
   - ✅ GitHub Release é criado

**Gatilhos do workflow:**

- Push na branch `main` (após merge)
- Push de tags `v*`
- Publicação manual de release
- Dispatch manual

### Manual (Desenvolvimento Local)

```bash
# 1. Atualizar versões
pnpm changeset:version

# 2. Build
pnpm build

# 3. Publicar
pnpm changeset:publish
```

## 🔧 Scripts Disponíveis

### Build e Testes (Turbo)

```bash
# Build todos os pacotes (com cache)
pnpm build

# Build um pacote específico
pnpm build:core
pnpm build:mui
pnpm build:main

# Testes (com cache)
pnpm test

# Lint (com cache)
pnpm lint

# Type check (com cache)
pnpm type-check
```

### Changesets

```bash
# Criar um novo changeset
pnpm changeset

# Ver status dos changesets
pnpm changeset status

# Aplicar changesets e bump versions
pnpm changeset:version

# Publicar pacotes
pnpm changeset:publish

# Release completo (build + lint + test + publish)
pnpm release
```

### Desenvolvimento

```bash
# Dev mode com watch
pnpm dev

# Limpar builds
pnpm clean

# Gerar docs
pnpm docs:generate

# Storybook
pnpm storybook
pnpm build-storybook
```

## 📝 Convenções

### Commits

Use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Mudanças na documentação
- `chore:` - Tarefas de manutenção
- `refactor:` - Refatoração de código
- `test:` - Adição/modificação de testes
- `ci:` - Mudanças no CI/CD

### Pacotes Linkados

Os três pacotes principais são versionados juntos (linked):

- `@react-lgpd-consent/core`
- `@react-lgpd-consent/mui`
- `react-lgpd-consent`

Quando um changeset afeta qualquer um deles, todos recebem bump de versão.

## 🏗️ Turborepo

### Cache

Turbo cacheia resultados de:

- `build`
- `lint`
- `type-check`
- `test` (quando determinístico)
- `docs:generate`

### Pipeline

O pipeline garante ordem correta:

```
build → lint, type-check, test → docs:generate
```

Dependências entre pacotes também são respeitadas (core → mui → main).

## 🔐 Secrets Necessários

Para CI/CD funcionar, configure no GitHub (`Settings → Secrets → Actions`):

### Obrigatórios

- **`NPM_TOKEN`** - Token do npm para publicação
  - Criar em: https://www.npmjs.com/settings/[seu-usuario]/tokens
  - Tipo: **Automation** (recomendado) ou **Publish**
  - Escopo: Read and write

### Já Configurados

- `GITHUB_TOKEN` - Gerado automaticamente pelo GitHub Actions
- `CODECOV_TOKEN` - Token para upload de coverage

### Como gerar NPM_TOKEN:

1. Login no [npmjs.com](https://www.npmjs.com)
2. Ir em **Account → Access Tokens**
3. Clicar em **Generate New Token**
4. Selecionar tipo **Automation**
5. Copiar o token
6. No GitHub: **Settings → Secrets → Actions → New repository secret**
7. Nome: `NPM_TOKEN`
8. Valor: colar o token
9. Salvar

## 🔄 Workflows GitHub Actions

### `release.yml` - Release & Publish Unificado

**Quando executa:**

- Push na `main`
- Tags `v*`
- Release publicado
- Manual dispatch

**O que faz:**

1. ✅ Instala dependências
2. ✅ Roda CI (lint, type-check, test)
3. ✅ Build com Turbo
4. ✅ Changesets version (se houver changesets)
5. ✅ Publica no npm (se versões mudaram)
6. ✅ Cria GitHub Release

### `ci.yml` - Continuous Integration

**Quando executa:**

- Pull requests
- Push na `main`

**O que faz:**

1. ✅ Lint
2. ✅ Type check
3. ✅ Tests com coverage
4. ✅ Build
5. ✅ Bundle size check
6. ✅ Upload coverage para Codecov

## 📚 Recursos

- [Changesets Docs](https://github.com/changesets/changesets/tree/main/docs)
- [Turborepo Docs](https://turbo.build/repo/docs)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)

## 🆘 Troubleshooting

### Changeset não está criando PR

**Possíveis causas:**

- Nenhum changeset foi criado (`.changeset/*.md`)
- PR de release já existe
- Não há permissões suficientes

**Solução:**

```bash
# Ver status
pnpm changeset status

# Verificar changesets pendentes
ls -la .changeset/
```

### Publicação no npm falhou

**Verificar:**

1. `NPM_TOKEN` está configurado no GitHub Secrets?
2. Token tem permissões de publicação?
3. Pacote já foi publicado nesta versão?
4. Você tem permissões no npm para os pacotes?

### Build falhou no workflow

**Debug:**

1. Verificar logs do workflow no GitHub Actions
2. Rodar localmente:
   ```bash
   pnpm run clean
   pnpm install
   pnpm run lint
   pnpm run type-check
   pnpm run test
   pnpm run build
   ```

### Versão não foi atualizada

**Causas comuns:**

- Changeset não foi commitado
- Changeset está vazio
- Pacotes não estão na lista do changeset

**Solução:**

```bash
# Criar novo changeset
pnpm changeset

# Verificar o arquivo gerado
cat .changeset/*.md
```
