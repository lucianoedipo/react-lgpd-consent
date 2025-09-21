# Scripts de Build e CI

Esta pasta contém scripts auxiliares para build, CI/CD e monitoramento de qualidade.

## 📋 Scripts Disponíveis

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
