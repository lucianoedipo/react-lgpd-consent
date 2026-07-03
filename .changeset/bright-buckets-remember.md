---
'@react-lgpd-consent/core': patch
'@react-lgpd-consent/mui': patch
'react-lgpd-consent': patch
---

Atualiza compatibilidade das integrações externas e estabiliza a configuração TypeScript/CI.

- GTM passa a incluir `&l=<dataLayerName>` quando um data layer customizado é usado.
- Clarity passa a sincronizar consentimento com `clarity('consentv2', ...)`, mantendo `upload` apenas como compatibilidade legada.
- Intercom passa a aceitar `api_base`, `settings` e sincronizar `update`/`shutdown` conforme revogação de consentimento.
- Zendesk Messaging passa a sincronizar cookies via `zE('messenger:set', 'cookies', ...)`.
- Remove usos diretos de `process` no código de produção em favor de leitura SSR-safe via `globalThis`.
- Ajusta `rootDir` dos pacotes que resolvem fontes internas por `paths`, evitando diagnósticos TS6059 no monorepo.
- Corrige `lint:ci` no Turbo e atualiza o workflow de CI para validar changesets em PRs.
