# Scripts de Build e CI

Esta pasta contém scripts auxiliares para build, CI/CD e monitoramento de qualidade.

## 📋 Scripts Disponíveis

### `changeset-interactive.ts`

**Propósito**: Assistente interativo para criar changesets em monorepos.

**Uso**:

```bash
pnpm exec tsx scripts/changeset-interactive.ts
```

**Opções**:

- `--prefix @react-lgpd-consent/` (default) para filtrar pacotes do workspace.
- `--include-private` para incluir pacotes privados na lista.
- `SCOPE_PREFIX` pode ser usado via env para substituir o prefixo.

**Observações**:

- Sugere mensagens baseadas em commits convencionais.
- Gera arquivo `.changeset/interactive-<tipo>-<timestamp>.md`.

### `coverage-check.cjs`

**Propósito**: Verificar se a cobertura de testes atende aos thresholds configurados.

**Uso**:

```bash
# Executar após gerar coverage
npm run test:coverage
node scripts/coverage-check.cjs
```

**Funcionalidades**:

- ✅ Verifica thresholds de cobertura (statements: 85%, branches: 80%, functions: 70%, lines: 85%)
- 📊 Gera relatório formatado com status visual
- 📈 Calcula Bundle Quality Score baseado nas métricas
- ❌ Falha (exit code 1) se algum threshold não for atendido
- 🔍 Usado no CI para enforcement de qualidade

**Exemplo de Output**:

```
📊 Coverage Report:
==================
✅ statements  : 94.85% (threshold: 85%)
✅ branches    : 82.24% (threshold: 80%)
✅ functions   : 81.92% (threshold: 70%)
✅ lines       : 95.55% (threshold: 85%)
==================

✅ All coverage thresholds met!

📈 Bundle Quality Score: 89 %
```

### `coverage-analysis.sh`

**Propósito**: Análise completa de coverage com relatórios visuais e múltiplos formatos.

**Uso**:

```bash
# Via npm script (recomendado)
pnpm coverage:analyze

# Ou diretamente
./scripts/coverage-analysis.sh
```

**Funcionalidades**:

- 🧪 Executa `pnpm test:coverage` automaticamente
- 📊 Extrai métricas do `coverage-summary.json` com `jq`
- 📁 Lista todos os formatos de coverage gerados:
  - LCOV (Codecov, Coveralls, SonarQube)
  - Cobertura XML (Azure DevOps, GitLab)
  - Clover XML (Jenkins, Atlassian)
  - JSON completo e summary
  - HTML interativo
- 🌐 Abre automaticamente o relatório HTML no navegador padrão
- ✅ Fornece resumo visual no terminal

**Exemplo de Output**:

```
🧪 Executando testes com coverage...
...
📊 Resumo de Coverage:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Statements: 94.85%
✓ Branches:   82.24%
✓ Functions:  81.92%
✓ Lines:      95.55%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 Arquivos de coverage gerados:
  • LCOV:      coverage/lcov.info
  • Cobertura: coverage/cobertura-coverage.xml
  • Clover:    coverage/clover.xml
  • JSON:      coverage/coverage-final.json
  • Summary:   coverage/coverage-summary.json
  • HTML:      coverage/lcov-report/index.html

🌐 Abrindo relatório HTML no navegador...
✅ Análise concluída!
```

**Requisitos**:

- `jq` instalado (para parsing JSON)
- Navegador padrão configurado

## 🔧 Configurações

### ESLint

- Scripts estão configurados no `eslint.config.js` com regras específicas para Node.js
- Permite `console.log`, `require()` e outras funcionalidades de scripts

### TypeScript

- Scripts são excluídos do `tsconfig.json` principal
- Não são tipados pelo TypeScript do projeto

### VS Code

- Arquivo `.cjs` é associado com linguagem JavaScript
- Configurado no `.vscode/settings.json`

## 🚀 Integração com CI

Estes scripts são executados automaticamente no GitHub Actions:

```yaml
- name: Coverage Report & Check
  run: |
    npm run test:coverage
    node scripts/coverage-check.cjs
```

## 📦 Dependências

- **Node.js**: Scripts requerem Node.js 20+ (ver `.nvmrc`)
- **Jest**: `coverage-check.cjs` lê arquivos gerados pelo Jest
- **fs/path**: Módulos nativos do Node.js - sem dependências externas
