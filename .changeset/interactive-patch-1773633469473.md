---
'@react-lgpd-consent/core': patch
'@react-lgpd-consent/mui': patch
'react-lgpd-consent': patch
---

## 🔒 Segurança e CI/CD

### Trusted Publishing (npm)

- Implementado suporte para **Trusted Publishing** com provenance nos workflows de publicação
- Remoção da dependência de `NPM_TOKEN` para publicação (maior segurança via OIDC)
- Adicionada flag `--provenance` para assinatura criptográfica dos pacotes
- Criado guia completo de configuração em `doc/TRUSTED_PUBLISHING_SETUP.md`

### Workflows

- Adicionado suporte a `PAT_TOKEN` no workflow de versionamento para bypass de repository rules
- Melhorias na verificação de versão antes da publicação
- Aprimoramento das mensagens de log e feedback nos workflows
- Remoção de opções desnecessárias no checkout do workflow de version

### 📚 Documentação

- Novo guia detalhado: `TRUSTED_PUBLISHING_SETUP.md` com instruções passo-a-passo
- Documentação de troubleshooting para configuração de Trusted Publishing
- Adicionadas referências oficiais do npm e GitHub Actions
