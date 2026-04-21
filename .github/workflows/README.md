# Workflows CI/CD

## Estratégia Atual

Os workflows priorizam previsibilidade em release. O CI continua validando PRs e `main`, mas `publish.yml` e `docs.yml` fazem instalação e build próprios quando rodam por tag. Isso evita acoplamento frágil com artefatos temporários do CI.

## Fluxo

1. `ci.yml`
   - Roda em `pull_request` e em push para `main`.
   - Executa lint, type-check, coverage, build e size check.
   - Publica relatório de cobertura como artefato.
   - Comenta cobertura apenas em PRs do próprio repositório para não falhar em forks.

2. `version.yml`
   - Roda em push para `main`.
   - Cria/atualiza o PR de versionamento do Changesets.
   - Ao detectar o commit `chore(release): version packages`, cria a tag `vX.Y.Z`.
   - Exige `PAT_TOKEN` para criar tag de release, porque tags criadas apenas com `GITHUB_TOKEN` não disparam `publish.yml` e `docs.yml`.

3. `publish.yml`
   - Roda em tags `v*` ou manualmente.
   - Reinstala dependências, valida que `core`, `mui` e agregador têm a mesma versão da tag, roda lint/type-check/test, faz build e publica no npm com provenance.

4. `docs.yml`
   - Roda em tags `v*` ou manualmente.
   - Reinstala dependências, faz build local, gera TypeDoc, builda Storybook e publica no GitHub Pages.

5. `codeql.yml`
   - Roda em PRs, push para `main` e semanalmente.
   - Faz build antes da análise para melhorar precisão.

## Princípios

- Use `.nvmrc` como fonte única da versão Node dos workflows.
- Prefira rebuild em jobs de release a depender de artefatos efêmeros do CI.
- Mantenha `timeout-minutes` em todos os jobs para evitar runners presos.
- Não exija escrita em PRs de forks.
- Valide todas as versões dos pacotes antes de publicar.

## Troubleshooting

- Publish/docs não rodaram após tag: confirme que `PAT_TOKEN` está configurado e tem permissão para criar tags que disparam workflows.
- Version mismatch no publish: confira se o PR de versionamento rodou `scripts/sync-versions.mjs` e se a tag aponta para o commit versionado.
- Falha de cobertura em PR de fork: o comentário é ignorado por design; consulte o artefato `coverage-reports-*`.

**Última atualização**: 20/04/2026
