# Resumo das Configurações - Turbo + Changesets

## ✅ Implementado

### 1. Registry NPM (`.npmrc`)

- ✅ Registry padrão: `https://registry.npmjs.org/`
- ✅ SSL desabilitado (`strict-ssl=false`) para ambientes com certificados corporativos
- ✅ Auto-install peers habilitado
- ✅ Shamefully hoist para garantir compartilhamento de peer deps

### 2. Turborepo (`turbo.json`)

- ✅ Pipeline configurado com dependências corretas
- ✅ Cache habilitado para: `build`, `lint`, `type-check`, `docs:generate`, `build-storybook`
- ✅ Tasks `test` e `dev` sem cache (não-determinísticos)
- ✅ Build ordenado: core → mui → react-lgpd-consent
- ✅ **Performance**: Build de 8s → 66ms (cache hit) 🚀

### 3. Changesets (`.changeset/config.json`)

- ✅ Pacotes linkados (versionados juntos):
  - `@react-lgpd-consent/core`
  - `@react-lgpd-consent/mui`
  - `react-lgpd-consent`
- ✅ Access público (`public`)
- ✅ Base branch: `main`
- ✅ Update internal deps: `patch`
- ✅ Changelog com GitHub integration (`@changesets/changelog-github`)

### 4. Scripts Atualizados (`package.json`)

```json
{
  "packageManager": "pnpm@10.20.0",
  "scripts": {
    "clean": "turbo run clean",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check",
    "test": "turbo run test",
    "docs:generate": "turbo run docs:generate",
    "changeset": "changeset",
    "changeset:version": "changeset version",
    "changeset:publish": "changeset publish",
    "release": "turbo run build lint test && changeset publish"
  }
}
```

### 5. GitHub Actions

#### `.github/workflows/ci.yml`

- ✅ Cache do Turbo adicionado
- ✅ Scripts usando Turbo
- ✅ Executa: lint, type-check, test, build, coverage

#### `.github/workflows/release.yml` (UNIFICADO)

- ✅ Workflow **unificado** de release e publicação
- ✅ Substitui o antigo `publish-github-packages.yml`
- ✅ Cria PR de release quando changesets são merged
- ✅ Publica automaticamente no npm quando PR é merged
- ✅ Cria GitHub Release e tags automaticamente
- ✅ Roda CI completo antes de publicar
- ✅ Changelog gerado automaticamente com links para GitHub
- ✅ Requer secrets: `NPM_TOKEN`

**Gatilhos:**

- Push na `main`
- Tags `v*`
- Release publicado
- Workflow dispatch (manual)

### 6. Documentação

#### `VERSIONING.md` (NOVO)

- ✅ Guia completo de versionamento
- ✅ Como criar changesets
- ✅ Fluxo de release automático
- ✅ Scripts disponíveis
- ✅ Convenções de commits

#### `TROUBLESHOOTING.md` (da task anterior)

- ✅ Soluções para erros comuns
- ✅ Múltiplas instâncias de React
- ✅ Versões incompatíveis
- ✅ SSR/Next.js
- ✅ Configuração de gerenciadores de pacotes

## 📋 Próximos Passos

### Para usar o sistema:

1. **Fazer mudanças no código**

   ```bash
   # Editar arquivos...
   ```

2. **Criar changeset**

   ```bash
   pnpm changeset
   ```

   - Selecionar pacotes afetados
   - Escolher tipo (major/minor/patch)
   - Descrever mudança

3. **Commit**

   ```bash
   git add .
   git commit -m "feat: nova funcionalidade"
   git push
   ```

4. **Após merge na main**
   - Bot do Changesets cria/atualiza PR de release
   - Merge do PR de release → publica no npm

### Secrets necessários no GitHub:

```bash
# Adicionar em Settings → Secrets → Actions
NPM_TOKEN=npm_xxxxxxxxxxxxxxxx
```

Para obter NPM_TOKEN:

1. Login no npmjs.com
2. Account → Access Tokens → Generate New Token
3. Tipo: Automation
4. Copiar e adicionar ao GitHub

## 🔍 Verificação

### Build com cache

```bash
pnpm run build  # Primeira vez: ~8s
pnpm run build  # Cache hit: ~66ms (120x mais rápido!)
```

### Changesets

```bash
pnpm changeset status  # Ver changesets pendentes
```

### Turbo

```bash
turbo run build --dry-run  # Ver o que seria executado
```

## 📚 Recursos

- [Turborepo](https://turbo.build/repo/docs)
- [Changesets](https://github.com/changesets/changesets)
- [Conventional Commits](https://www.conventionalcommits.org/)
