# Workflows CI/CD - Arquitetura Otimizada

## 🎯 Estratégia de Reuso de Artefatos

Para evitar repetição de `install`, `lint`, `test` e `build`, os workflows seguem esta arquitetura:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. CI (Pull Request ou Push para Main)                     │
│    ✓ Install dependencies                                   │
│    ✓ Lint                                                    │
│    ✓ Type-check                                              │
│    ✓ Test com coverage                                       │
│    ✓ Build (gera dist/)                                      │
│    ✓ Size check                                              │
│    📦 Upload build artifacts (apenas em main)                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Version (Push para Main após PR merge)                  │
│    ✓ Changesets version                                     │
│    ✓ Sync versions                                           │
│    ✓ Create PR "Version Packages"                           │
│    ✓ (após merge do PR) Create tag vX.Y.Z                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
        ┌───────────────────┴───────────────────┐
        ↓                                       ↓
┌───────────────────────────┐   ┌───────────────────────────┐
│ 3. Publish (Tag vX.Y.Z)   │   │ 4. Docs (Tag vX.Y.Z)      │
│    ⏳ Wait for CI         │   │    ⏳ Wait for CI         │
│    📥 Download artifacts  │   │    📥 Download artifacts  │
│    ✓ Verify versions      │   │    ✓ TypeDoc generation   │
│    ✓ Publish to NPM       │   │    ✓ Storybook build      │
│    ✓ Create GitHub Release│   │    ✓ Deploy to Pages      │
└───────────────────────────┘   └───────────────────────────┘
```

## 📦 Artefatos Compartilhados

### O que é compartilhado?

```yaml
# CI faz upload (apenas em main):
build-artifacts-{SHA}:
  - packages/core/dist/
  - packages/mui/dist/
  - packages/react-lgpd-consent/dist/
  - packages/*/package.json
```

### Quem consome?

- **Publish**: Usa `dist/` pré-compilado, evita rebuild
- **Docs**: Usa `dist/` pré-compilado para gerar TypeDoc/Storybook

## ⏱️ Economia de Tempo

### Antes (sem reuso):

```
CI:      5min (install + lint + test + build)
Publish: 5min (install + build + test + publish)
Docs:    6min (install + build + typedoc + storybook)
────────────────────────────────────────────────
TOTAL:   16min por release
```

### Depois (com reuso):

```
CI:      5min (install + lint + test + build + upload)
Publish: 2min (wait + download + verify + publish)
Docs:    3min (wait + download + typedoc + storybook)
────────────────────────────────────────────────
TOTAL:   ~10min por release ✅ (37% mais rápido)
```

## 🔐 Segurança

### Por que é seguro reusar artefatos?

1. **SHA-específico**: Artefatos são nomeados com `${{ github.sha }}`
2. **Tag = Commit**: Tag aponta para commit específico que passou no CI
3. **CI obrigatório**: `wait-on-check-action` garante que CI passou
4. **Verificação de versão**: Publish valida versões antes de publicar
5. **Retenção curta**: Artefatos expiram em 1 dia (não acumulam)

### Fluxo de Segurança

```yaml
# Publish/Docs workflow:
1. Wait for CI to complete ✅
2. Download artifacts from EXACT commit (SHA)
3. Verify versions match tag
4. Proceed with publish/docs
```

## 🎮 Como Funciona

### CI (sempre roda completo)

```yaml
- name: Build packages
  run: pnpm run build

- name: Upload build artifacts
  if: github.ref == 'refs/heads/main'  # ← Apenas em main
  uses: actions/upload-artifact@v4
  with:
    name: build-artifacts-${{ github.sha }}
    path: |
      packages/*/dist
      packages/*/package.json
    retention-days: 1  # ← Limpa automaticamente
```

### Publish/Docs (reusa artefatos)

```yaml
- name: Wait for CI to complete
  uses: lewagon/wait-on-check-action@v1.3.4
  with:
    ref: ${{ steps.version.outputs.tag }}
    check-name: 'Lint, Type-check, Test & Build'

- name: Download build artifacts from CI
  uses: dawidd6/action-download-artifact@v3
  with:
    workflow: ci.yml
    commit: ${{ github.sha }}
    name: build-artifacts-${{ github.sha }}
```

## 📊 Comparação Detalhada

### Antes

| Workflow | Install | Lint | Test | Build | Docs | Publish | Total |
|----------|---------|------|------|-------|------|---------|-------|
| CI       | 1.5m    | 0.5m | 2m   | 1m    | -    | -       | 5m    |
| Publish  | 1.5m    | -    | 1m   | 1m    | -    | 1.5m    | 5m    |
| Docs     | 1.5m    | -    | -    | 1m    | 3.5m | -       | 6m    |
| **Total**| **4.5m**| 0.5m | 3m   | **3m**| 3.5m | 1.5m    | **16m**|

### Depois

| Workflow | Wait | Download | Verify | Build | Docs | Publish | Total |
|----------|------|----------|--------|-------|------|---------|-------|
| CI       | -    | -        | -      | 1m    | -    | -       | 5m    |
| Publish  | 0.3m | 0.2m     | 0.1m   | -     | -    | 1.4m    | 2m    |
| Docs     | 0.3m | 0.2m     | -      | -     | 2.5m | -       | 3m    |
| **Total**| 0.6m | 0.4m     | 0.1m   | **1m**| 2.5m | 1.4m    | **10m**|

**Economia**: 6 minutos (~37% mais rápido) + menos uso de runners GitHub

## 🚨 Troubleshooting

### Artefato não encontrado

```
Error: if_no_artifact_found: fail
```

**Causa**: CI não rodou ou falhou  
**Solução**: Verifique que CI completou com sucesso antes de publish/docs

### Versões desincronizadas

```
Error: Version mismatch! Main package is 0.6.3 but tag is v0.6.4
```

**Causa**: Tag não aponta para commit correto  
**Solução**: Delete tag e recrie: `git tag -d v0.6.4 && git push origin :v0.6.4`

### CI não fez upload

```
Error: Artifact build-artifacts-abc123 not found
```

**Causa**: Push não foi para `main` ou CI falhou antes do upload  
**Solução**: Confirme que CI rodou em `main` e chegou ao step de upload

## 📝 Manutenção

### Quando limpar artefatos manualmente?

Nunca necessário - expiram automaticamente em 1 dia (`retention-days: 1`)

### Como desabilitar reuso temporariamente?

Comente o step `Download build artifacts` e descomente os steps de build nos workflows `publish.yml` e `docs.yml`.

---

**Última atualização**: 01/12/2025
