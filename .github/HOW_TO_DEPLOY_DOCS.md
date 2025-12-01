# Como Rodar Deploy de Docs Manualmente

## ⚠️ Configuração Inicial Necessária

Antes de rodar pela primeira vez, configure o ambiente GitHub Pages:

1. Vá em: https://github.com/lucianoedipo/react-lgpd-consent/settings/environments
2. Clique em **github-pages**
3. Em **Deployment branches and tags**:
   - Clique em **Add deployment branch or tag rule**
   - **Ref type**: `Tag`
   - **Name pattern**: `v*`
   - Clique em **Add rule**
4. **Salve** as mudanças

Isso permite que tags `v*` façam deploy no GitHub Pages.

---

## 🚀 Método 1: Via GitHub UI (Recomendado)

1. Vá em: https://github.com/lucianoedipo/react-lgpd-consent/actions/workflows/docs.yml
2. Clique em **Run workflow** (botão azul no canto direito)
3. Configure:
   - **Use workflow from**: `Branch: main` (ou tag específica como `v0.6.4`)
   - **Tag to deploy docs from**: Deixe vazio para usar branch atual OU digite tag (ex: `v0.6.4`)
   - **Skip waiting for CI**: ✅ Marque se quiser build completo sem esperar CI
4. Clique em **Run workflow**

## 📋 Opções Explicadas

### Tag to deploy docs from

- **Vazio**: Usa branch/tag atual selecionada em "Use workflow from"
- **v0.6.4**: Faz checkout dessa tag específica e gera docs dela

### Skip waiting for CI

- **❌ Desmarcado** (padrão): 
  - Espera CI completar
  - Baixa artefatos do CI
  - Mais rápido (~3min)
  - Usa código já testado

- **✅ Marcado**:
  - Não espera CI
  - Faz build completo
  - Mais lento (~6min)
  - Útil se CI falhou ou não rodou

## 🎯 Cenários Comuns

### Cenário 1: Deploy da main atual (após push)

```
Use workflow from: Branch: main
Tag to deploy docs from: (vazio)
Skip waiting for CI: ✅ (se quiser build fresh)
```

**Resultado**: Docs da versão atual em main

### Cenário 2: Deploy de tag específica (release)

```
Use workflow from: Tag: v0.6.4
Tag to deploy docs from: (vazio ou v0.6.4)
Skip waiting for CI: ❌ (usa artefatos do CI)
```

**Resultado**: Docs da versão v0.6.4

### Cenário 3: Deploy rápido sem esperar CI

```
Use workflow from: Branch: main
Tag to deploy docs from: (vazio)
Skip waiting for CI: ✅
```

**Resultado**: Build completo e deploy imediato

## 🔧 Método 2: Via GitHub CLI

```bash
# Deploy da branch main atual (com build completo)
gh workflow run docs.yml --ref main -f skip_ci_check=true

# Deploy de tag específica (reusa artefatos do CI)
gh workflow run docs.yml --ref v0.6.4

# Deploy de tag com build completo
gh workflow run docs.yml --ref v0.6.4 -f tag=v0.6.4 -f skip_ci_check=true
```

## 📊 Monitorar Progresso

```bash
# Via CLI
gh run watch

# Via UI
https://github.com/lucianoedipo/react-lgpd-consent/actions
```

## ✅ Verificar Deploy

Após workflow completar:

1. **GitHub Pages**: https://lucianoedipo.github.io/react-lgpd-consent/
2. **TypeDoc**: https://lucianoedipo.github.io/react-lgpd-consent/modules.html
3. **Storybook**: https://lucianoedipo.github.io/react-lgpd-consent/storybook/

## 🐛 Troubleshooting

### Erro: "Artifact not found"

**Solução**: Marque ✅ "Skip waiting for CI" para fazer build completo

### Erro: "GitHub Pages not enabled"

**Solução**: 
1. Settings → Pages
2. Source: Deploy from a branch
3. Branch: `gh-pages` / `/(root)`

### Workflow não aparece em "Run workflow"

**Solução**: Certifique-se que está na branch `main` ou em uma tag

---

**Última atualização**: 01/12/2025
