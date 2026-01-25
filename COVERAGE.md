# Relatórios de Coverage

Este documento descreve os artefatos de coverage gerados pelo projeto e como utilizá-los.

## Formatos Exportados

O projeto está configurado para exportar coverage em múltiplos formatos para máxima compatibilidade com ferramentas de CI/CD:

### 1. **LCOV** (`coverage/lcov.info`)
- **Uso:** Codecov, Coveralls, SonarQube, VSCode extensions
- **Padrão de facto** para ferramentas de análise de código
- Formato textual detalhado com informações linha por linha

### 2. **Cobertura** (`coverage/cobertura-coverage.xml`)
- **Uso:** Azure DevOps, GitLab CI, Jenkins
- Formato XML baseado no padrão Python Coverage
- Amplamente suportado por ferramentas de CI/CD

### 3. **Clover** (`coverage/clover.xml`)
- **Uso:** Jenkins, Atlassian Bamboo, PHPUnit
- Formato XML popular em ecossistemas Java/PHP
- Bom suporte em ferramentas enterprise

### 4. **JSON** (`coverage/coverage-final.json`)
- **Uso:** Análise programática, ferramentas customizadas
- Dados completos e estruturados
- Ideal para scripts e automações

### 5. **JSON Summary** (`coverage/coverage-summary.json`)
- **Uso:** Badges, dashboards, quick stats
- Resumo compacto com totais agregados
- Perfeito para visualizações rápidas

### 6. **HTML** (`coverage/lcov-report/index.html`)
- **Uso:** Revisão visual local ou em artefatos de CI
- Interface navegável com drill-down
- Destaque visual de código não coberto

### 7. **Text** (console output)
- **Uso:** Feedback imediato no terminal
- Sumário de coverage durante execução de testes

## GitHub Actions

### Artefatos Disponíveis

Após cada execução de CI, os seguintes artefatos são disponibilizados:

1. **coverage-reports-{sha}** (30 dias)
   - Todos os formatos de coverage listados acima
   - Disponível em: `Actions → CI → Run → Artifacts`

2. **build-artifacts-{sha}** (1 dia)
   - Pacotes compilados (`dist/`)
   - Apenas em commits na branch `main`

### Download de Artefatos

```bash
# Via GitHub CLI
gh run download <run-id> -n coverage-reports-<sha>

# Via UI
# 1. Acesse a aba Actions no GitHub
# 2. Clique no workflow run desejado
# 3. Vá até a seção "Artifacts"
# 4. Clique no artefato para download
```

## Integração com Codecov

O projeto usa o Codecov para tracking histórico de coverage.

### Configuração
- Arquivo: `codecov.yml`
- Token: `CODECOV_TOKEN` (GitHub Secret)
- Upload automático em PRs e commits na `main`

### Recursos Ativos

- **Comentários em PRs:** Coverage diff automático
- **Status Checks:** Validação de thresholds
- **Badges:** Disponíveis para README
- **Trending:** Histórico de evolução

## Integração com PRs

Em cada Pull Request, o CI gera automaticamente:

1. **Comentário de Coverage** (via sticky-pull-request-comment)
   - Resumo de coverage total
   - Comparação com a branch base
   - Badge visual de status
   - Breakdown por arquivo modificado

2. **Status Check do Codecov**
   - ✅ Pass: Coverage mantido ou melhorado
   - ❌ Fail: Queda significativa de coverage

## Thresholds Configurados

### Jest (Local + CI)
```javascript
global: {
  statements: 85%,
  branches: 80%,
  functions: 70%,
  lines: 85%
}
```

### Codecov
- **Project coverage:** Auto (threshold: 1%)
- **Patch coverage:** 85% (threshold: 5%)

## Comandos Úteis

### Gerar Coverage Localmente
```bash
pnpm test:coverage
```

### Verificar Thresholds
```bash
pnpm coverage-check
```

### Visualizar Relatório HTML
```bash
pnpm test:coverage
open coverage/lcov-report/index.html
```

### Análise Programática
```bash
# Ver sumário JSON
cat coverage/coverage-summary.json | jq

# Extrair percentage total
cat coverage/coverage-summary.json | jq '.total.lines.pct'
```

## Troubleshooting

### Coverage não está sendo gerado

1. Verifique se os testes estão passando:
   ```bash
   pnpm test
   ```

2. Execute com debug:
   ```bash
   pnpm test:coverage --verbose
   ```

3. Limpe cache do Jest:
   ```bash
   pnpm test --clearCache
   ```

### Codecov upload falha

1. Verifique se o token está configurado no GitHub Secrets
2. Confirme que o arquivo `lcov.info` foi gerado
3. Revise logs do action step "Upload coverage to Codecov"

### Artefatos não disponíveis no GitHub

1. Verifique se o workflow completou com sucesso
2. Confirme que o step "Upload coverage reports" não foi pulado
3. Artefatos expiram após 30 dias (coverage) ou 1 dia (build)

## Referências

- [Jest Coverage](https://jestjs.io/docs/configuration#collectcoverage-boolean)
- [Codecov Docs](https://docs.codecov.com/)
- [LCOV Format](http://ltp.sourceforge.net/coverage/lcov/geninfo.1.php)
- [Cobertura Format](https://cobertura.github.io/cobertura/)
- [GitHub Actions Artifacts](https://docs.github.com/en/actions/using-workflows/storing-workflow-data-as-artifacts)
