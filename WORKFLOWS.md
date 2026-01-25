# Workflows CI/CD

Este documento explica a estrutura otimizada e resiliente dos workflows de CI/CD do projeto.

## 🎯 Filosofia

- **Sincronização automática**: `react-lgpd-consent` sempre reflete a versão dos pacotes internos
- **Publish apenas em tags**: Publicação no NPM ocorre apenas quando há tag versionada
- **Docs vinculados à tag**: Documentação publicada sempre corresponde à versão do NPM
- **Zero erros**: Validações rigorosas em cada etapa
- **Cache otimizado**: Turbo + TypeScript + ESLint para builds rápidos

---

## 📋 Workflows

### 1. **CI** (`.github/workflows/ci.yml`)

**Trigger**: Todo push em `main` e PRs

**Objetivo**: Validar código antes do merge

**Steps**:

1. Lint (ESLint)
2. Type-check (TypeScript)
3. Tests com coverage
4. Coverage threshold check
5. Upload de artefatos de coverage (30 dias de retenção)
6. Build de todos os pacotes
7. Bundle size check
8. Upload de build artifacts (apenas main, 1 dia)
9. Upload para Codecov (com múltiplos formatos)
10. Comentário automático de coverage em PRs

**Artefatos Gerados**:

- **coverage-reports-{sha}**: Relatórios completos de coverage em múltiplos formatos
  - LCOV (`lcov.info`) - Para Codecov, Coveralls, SonarQube
  - Cobertura XML (`cobertura-coverage.xml`) - Para Azure DevOps, GitLab
  - Clover XML (`clover.xml`) - Para Jenkins, Atlassian
  - JSON (`coverage-final.json`) - Para análise programática
  - JSON Summary (`coverage-summary.json`) - Para badges e dashboards
  - HTML (`lcov-report/`) - Para visualização local
  - Retenção: 30 dias
  
- **build-artifacts-{sha}**: Pacotes compilados (apenas em `main`)
  - Todos os `dist/` de cada pacote
  - Retenção: 1 dia

**Comentários em PRs**:

Em cada Pull Request, o CI adiciona automaticamente um comentário com:
- Resumo visual de coverage
- Comparação com a branch base
- Badge de status (✅/⚠️/❌)
- Breakdown detalhado por métrica
- Indicadores visuais de progresso

**Otimizações**:

- Concurrency group com cancel-in-progress
- Cache de Turbo, TypeScript e ESLint
- Execução paralela via Turbo

---

### 2. **Version Bump & Tag** (`.github/workflows/version.yml`)

**Trigger**: Push em `main` após merge de PR

**Objetivo**: Criar PR de versão ou tag de release

**Steps**:

1. Executar `changeset version` (gera novos package.json)
2. Executar `scripts/sync-versions.mjs` (sincroniza versões)
3. Atualizar pnpm-lock.yaml
4. Criar PR de version (se houver changesets pendentes)
5. **OU** criar tag `vX.Y.Z` se PR de version foi mergeado

**Lógica de Sincronização**:

```javascript
// scripts/sync-versions.mjs
// Detecta bumps nos pacotes internos e aplica o mesmo tipo ao agregador

// Cenários:
// 1. core: 0.6.2 → 0.6.3 (patch)
//    main: 0.6.1 → 0.6.2 (patch também)

// 2. mui: 0.6.1 → 0.7.0 (minor)
//    main: 0.6.8 → 0.7.0 (minor também)

// 3. core: 0.6.8 (sem mudança), mui: 0.6.2 → 0.6.3 (patch)
//    main: 0.6.7 → 0.6.8 (patch)

// 4. core: 0.6.8 → 0.7.0 (minor), mui: 0.6.2 → 0.6.3 (patch)
//    main: 0.6.7 → 0.7.0 (minor - usa o maior tipo de bump)

// IMPORTANTE: Compara com git HEAD para detectar mudanças
function detectBumps() {
  const coreOldVersion = getGitVersion('packages/core/package.json')
  const muiOldVersion = getGitVersion('packages/mui/package.json')
  const coreBump = getBumpType(coreOldVersion, coreVersion)
  const muiBump = getBumpType(muiOldVersion, muiVersion)

  // Aplicar o maior tipo de bump ao agregador
  if (coreBump === 'major' || muiBump === 'major') return 'major'
  if (coreBump === 'minor' || muiBump === 'minor') return 'minor'
  if (coreBump === 'patch' || muiBump === 'patch') return 'patch'
  return null
}
```

**Output**:

- PR de version (se changesets pendentes)
- Tag `vX.Y.Z` (após merge do PR de version)

---

### 3. **Publish to NPM** (`.github/workflows/publish.yml`)

**Trigger**: Push de tag `v*` (criada pelo workflow de version)

**Objetivo**: Publicar pacotes no NPM

**Steps**:

1. Checkout da tag específica
2. Verificar que versões dos package.json correspondem à tag
3. Build de todos os pacotes
4. Run tests (validação final)
5. Publish no NPM (`changeset publish`)
6. Criar GitHub Release

**Segurança**:

- Verifica versão antes de publicar
- Usa `NODE_AUTH_TOKEN` para autenticação
- Provenance via `id-token: write`

---

### 4. **Deploy Docs** (`.github/workflows/docs.yml`)

**Trigger**: Push de tag `v*` (mesma que publish)

**Objetivo**: Publicar documentação no GitHub Pages

**Steps**:

1. Checkout da tag específica
2. Build de pacotes
3. Gerar TypeDoc (`pnpm run docs:generate`)
4. Build Storybook (`pnpm run build-storybook`)
5. Criar estrutura integrada:
   - `/` → index.html com versões corretas
   - `/modules.html` → TypeDoc
   - `/storybook/` → Storybook
6. Deploy no GitHub Pages

**Versões Corretas**:

```bash
# Extrai versões dos package.json da tag
VERSION_CORE=$(node -p "require('./packages/core/package.json').version")
VERSION_MUI=$(node -p "require('./packages/mui/package.json').version")
VERSION_MAIN=$(node -p "require('./packages/react-lgpd-consent/package.json').version")

# Injeta no HTML
cat > integrated-docs/index.html <<EOF
<li><span class="badge">react-lgpd-consent</span> v${VERSION_MAIN}</li>
<li><span class="badge">@react-lgpd-consent/mui</span> v${VERSION_MUI}</li>
<li><span class="badge">@react-lgpd-consent/core</span> v${VERSION_CORE}</li>
EOF
```

---

## 🔄 Fluxo Completo de Release

### Passo 1: Desenvolver feature

```bash
git checkout -b feature/nova-feature
# ... desenvolver ...
git add .
git commit -m "feat: nova feature incrível"
```

### Passo 2: Criar changeset

```bash
pnpm changeset
# Selecionar pacotes afetados: core, mui, react-lgpd-consent
# Escolher tipo: patch, minor ou major
# Descrever mudanças
```

### Passo 3: Abrir PR

```bash
git push origin feature/nova-feature
# Abrir PR no GitHub
```

### Passo 4: CI valida

- ✅ Lint
- ✅ Type-check
- ✅ Tests
- ✅ Build
- ✅ Size check

### Passo 5: Merge para main

```bash
# Após aprovação e merge:
# Workflow "Version Bump & Tag" é acionado automaticamente
```

### Passo 6: PR de Version criado

- Changeset gera novos package.json
- Script `sync-versions.mjs` sincroniza versões
- PR automático é criado: `chore(release): version packages`

### Passo 7: Merge do PR de Version

```bash
# Ao mergear PR de version:
# - Tag vX.Y.Z é criada automaticamente
# - Workflow "Publish to NPM" é acionado
# - Workflow "Deploy Docs" é acionado
```

### Passo 8: Publicação Automática

1. **NPM**: Pacotes publicados em https://www.npmjs.com/package/react-lgpd-consent
2. **GitHub Release**: Criada em https://github.com/lucianoedipo/react-lgpd-consent/releases
3. **Docs**: Atualizadas em https://lucianoedipo.github.io/react-lgpd-consent/

---

## 🔧 Scripts Personalizados

### `scripts/sync-versions.mjs`

**Propósito**: Sincronizar versões dos pacotes para que o agregador sempre reflita mudanças internas.

**Execução**: Automática após `changeset version` via hook em `package.json`

**Lógica**:

```javascript
1. Ler versões de core, mui e main
2. Pegar maior versão entre core e mui
3. Se main < maior_interna: main = maior_interna
4. Se main > maior_interna: core = mui = main
5. Atualizar dependências internas (mui depende de core)
```

**Garantias**:

- Se core ou mui recebem bump, agregador recebe bump do mesmo tipo
- Bumps intercalados são rastreados corretamente via git
- O agregador sempre reflete mudanças de qualquer pacote interno
- Tipo de bump segue precedência: major > minor > patch

**Exemplos Práticos**:

```bash
# Cenário 1: Apenas core muda
# Estado atual: core=0.6.7, mui=0.6.1, main=0.6.6
# Changeset: core patch (0.6.7 → 0.6.8)
# Resultado: core=0.6.8, mui=0.6.1, main=0.6.7

# Cenário 2: Apenas mui muda
# Estado atual: core=0.6.8, mui=0.6.1, main=0.6.7
# Changeset: mui patch (0.6.1 → 0.6.2)
# Resultado: core=0.6.8, mui=0.6.2, main=0.6.8

# Cenário 3: Ambos mudam com tipos diferentes
# Estado atual: core=0.6.8, mui=0.6.2, main=0.6.8
# Changeset: core minor (0.6.8 → 0.7.0) + mui patch (0.6.2 → 0.6.3)
# Resultado: core=0.7.0, mui=0.6.3, main=0.7.0 (usa minor, o maior)
```

---

## 🛡️ Validações de Segurança

### No Publish

```bash
# Verifica se versão do package.json == tag
EXPECTED="0.6.2"
MAIN_VERSION=$(node -p "require('./packages/react-lgpd-consent/package.json').version")

if [ "${MAIN_VERSION}" != "${EXPECTED}" ]; then
  echo "❌ Version mismatch!"
  exit 1
fi
```

### No Deploy Docs

```bash
# Extrai versões reais dos package.json da tag
# Injeta no HTML (não usa variáveis hardcoded)
VERSION_CORE=$(node -p "require('./packages/core/package.json').version")
```

---

## 📊 Otimizações de Performance

### Cache Strategy

```yaml
# 1. Turbo cache (builds incrementais)
- path: .turbo
  key: ${{ runner.os }}-turbo-${{ github.sha }}

# 2. TypeScript + ESLint cache
- path: |
    .tsbuildinfo
    node_modules/.cache
    **/.eslintcache
  key: ${{ runner.os }}-build-cache-${{ hashFiles('**/tsconfig.json', '**/*.ts') }}
```

### Concurrency Control

```yaml
# CI: cancela builds antigos de PRs
concurrency:
  group: ci-${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

# Publish/Docs: nunca cancela
concurrency:
  group: publish-${{ github.ref }}
  cancel-in-progress: false
```

---

## � Acesso a Artefatos de CI

### Via GitHub UI

1. Acesse a aba **Actions** no repositório
2. Clique no workflow run desejado (ex: CI #123)
3. Role até a seção **Artifacts** no final da página
4. Clique no artefato desejado para download:
   - `coverage-reports-{sha}` - Relatórios de coverage completos
   - `build-artifacts-{sha}` - Pacotes compilados (apenas main)

### Via GitHub CLI

```bash
# Listar runs recentes
gh run list --workflow=ci.yml

# Ver detalhes de um run específico
gh run view <run-id>

# Baixar artefato de coverage
gh run download <run-id> -n coverage-reports-<sha>

# Baixar todos os artefatos de um run
gh run download <run-id>
```

### Via API do GitHub

```bash
# Listar artefatos de um workflow run
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/lucianoedipo/react-lgpd-consent/actions/runs/<run-id>/artifacts

# Download direto de um artefato
curl -L -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/lucianoedipo/react-lgpd-consent/actions/artifacts/<artifact-id>/zip \
  -o coverage.zip
```

### Formatos de Coverage Disponíveis

Para detalhes completos sobre os formatos exportados, consulte [COVERAGE.md](COVERAGE.md).

**Resumo**:
- `lcov.info` - Codecov, Coveralls, SonarQube, IDE extensions
- `cobertura-coverage.xml` - Azure DevOps, GitLab CI
- `clover.xml` - Jenkins, Atlassian Bamboo
- `coverage-final.json` - Análise programática
- `coverage-summary.json` - Badges e dashboards
- `lcov-report/index.html` - Visualização interativa

---

## �🚨 Troubleshooting

### Versões desincronizadas

```bash
# Execute manualmente:
node scripts/sync-versions.mjs
pnpm install --lockfile-only
```

### Tag não criada após merge

```bash
# Verifique se PR de version foi criado primeiro
# Se não, execute manualmente:
pnpm run changeset:version
git add .
git commit -m "chore(release): version packages"
git push

# Workflow criará tag automaticamente
```

### Docs com versão errada

```bash
# Certifique-se de que está fazendo deploy da TAG, não de main
# Workflow extrai versões do package.json da tag
```

### Publish falhou

```bash
# Verifique se NPM_TOKEN está configurado nos secrets
# Verifique se versão não foi publicada antes
npm view react-lgpd-consent versions
```

---

## 📝 Convenções

### Commits

```
feat: nova feature
fix: correção de bug
docs: atualização de documentação
chore: tarefas de manutenção
test: adição/correção de testes
refactor: refatoração de código
```

### Tags

- Formato: `vX.Y.Z` (ex: `v0.6.2`)
- Criadas automaticamente pelo workflow
- Baseadas na versão do `react-lgpd-consent` (agregador)

### Branches

- `main`: branch principal (protegida)
- `feature/*`: features
- `fix/*`: correções
- `docs/*`: documentação
- `chore/*`: manutenção

---

## 🔗 Links Úteis

- [Changesets Documentation](https://github.com/changesets/changesets)
- [Turbo Documentation](https://turbo.build/repo/docs)
- [GitHub Actions](https://docs.github.com/en/actions)

---

**Última atualização**: 01/12/2025
