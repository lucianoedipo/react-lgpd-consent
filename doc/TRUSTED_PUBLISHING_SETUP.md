# Configuração do Trusted Publishing no npm

Este guia explica como configurar o **Trusted Publishing** (OIDC) para publicação automática sem tokens.

## 🔒 O que é Trusted Publishing?

É um método de autenticação que usa **OpenID Connect (OIDC)** para verificar a identidade do GitHub Actions diretamente com o npm, eliminando a necessidade de tokens de longa duração.

**Vantagens:**

- ✅ Sem tokens para gerenciar ou renovar
- ✅ Máxima segurança (sem risco de vazamento de tokens)
- ✅ Provenance automático (assinatura criptográfica dos pacotes)
- ✅ Recomendação oficial do npm

## 📝 Passo a Passo

### 1. Configurar cada pacote no npm

Você precisa configurar o Trusted Publishing para **cada pacote** individualmente:

#### Pacote 1: `@react-lgpd-consent/core`

1. Acesse: https://www.npmjs.com/package/@react-lgpd-consent/core
2. Clique em **"Settings"** (canto superior direito)
3. Na aba lateral, clique em **"Publishing Access"**
4. Role até **"Automation tokens and granular access tokens"**
5. Clique em **"Configure trusted publishers"**
6. Adicione um novo publisher:
   - **Provider:** GitHub Actions
   - **Repository:** `lucianoedipo/react-lgpd-consent`
   - **Workflow:** `publish.yml`
   - **Environment:** (deixe em branco ou use `production` se quiser)
7. Clique em **"Add"**

#### Pacote 2: `@react-lgpd-consent/mui`

1. Acesse: https://www.npmjs.com/package/@react-lgpd-consent/mui
2. Repita os mesmos passos acima

#### Pacote 3: `react-lgpd-consent`

1. Acesse: https://www.npmjs.com/package/react-lgpd-consent
2. Repita os mesmos passos acima

### 2. Remover o NPM_TOKEN do GitHub (Opcional)

Como agora você não precisa mais do token, pode removê-lo:

1. Acesse: https://github.com/lucianoedipo/react-lgpd-consent/settings/secrets/actions
2. Encontre `NPM_TOKEN`
3. Clique em **"Remove"**

**Nota:** Você pode mantê-lo inicialmente como fallback durante os testes.

### 3. Testar a Publicação

Após configurar, faça um teste:

1. **Crie um PR de version** (se ainda não existir):

   ```bash
   pnpm changeset
   # ... escolha tipo patch para teste
   git add .
   git commit -m "test: changeset for trusted publishing"
   git push
   ```

2. **O workflow criará automaticamente um PR de version**

3. **Faça merge do PR**

4. **O workflow de publish será executado automaticamente**
   - Ele usará OIDC para autenticar
   - Publicará com provenance
   - Criará a GitHub Release

## 🔍 Verificando o Provenance

Após a publicação bem-sucedida, você pode verificar o provenance:

```bash
npm view @react-lgpd-consent/core
npm view @react-lgpd-consent/mui
npm view react-lgpd-consent
```

Procure pela seção `publishConfig` ou acesse a página do pacote no npm - verá um badge de provenance verificado! 🎉

## ⚠️ Troubleshooting

### Erro: "Need authentication"

**Causa:** O Trusted Publishing não foi configurado ainda nos pacotes do npm.

**Solução:** Complete o item 1 (configurar cada pacote).

### Erro: "Repository mismatch"

**Causa:** O repositório configurado no npm não corresponde ao que está rodando o workflow.

**Solução:** Verifique se configurou `lucianoedipo/react-lgpd-consent` corretamente.

### Erro: "Workflow mismatch"

**Causa:** O nome do workflow não corresponde.

**Solução:** Certifique-se de que configurou `publish.yml` (não `.github/workflows/publish.yml`).

### Workflow não está sendo executado

**Causa:** O workflow só executa quando há uma tag `v*` ou quando executado manualmente.

**Solução:**

1. Verifique se o commit é o merge do PR de version
2. Ou execute manualmente: `Actions → Publish to NPM → Run workflow`

## 📚 Referências

- [npm Trusted Publishing (Provenance)](https://docs.npmjs.com/generating-provenance-statements)
- [GitHub Actions OIDC](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect)
- [Changesets Documentation](https://github.com/changesets/changesets)

## 🎯 Status da Configuração

- [ ] `@react-lgpd-consent/core` configurado no npm
- [ ] `@react-lgpd-consent/mui` configurado no npm
- [ ] `react-lgpd-consent` configurado no npm
- [x] Workflow atualizado (já feito!)
- [ ] Teste de publicação realizado
- [ ] NPM_TOKEN removido do GitHub (opcional)

---

**Data de criação:** 16/03/2026
**Última atualização:** 16/03/2026
