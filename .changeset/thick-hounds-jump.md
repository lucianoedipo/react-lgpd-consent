---
'@react-lgpd-consent/core': patch
'@react-lgpd-consent/mui': patch
'react-lgpd-consent': patch
---

Restaura os limiares de cobertura de testes no CI e corrige a detecção de tags no workflow de release.

- Adiciona testes cobrindo os trechos do refactor de integrações que ficaram sem cobertura (Hotjar, Intercom, Zendesk Chat/Messaging, Facebook Pixel, GTM, combinações de `createSaaSIntegrations`, guardas de SSR e o hook `useConsentScriptLoader`), restaurando os limiares de 98%/91%/98%/99% (statements/branches/functions/lines).
- Corrige o workflow `Version Bump & Tag`, que verificava a existência da tag de release apenas no repositório local do runner (`git rev-parse`); isso causava falso positivo de "tag já existe" e impedia a criação/push da tag e, consequentemente, a publicação no NPM. Agora a verificação usa `git ls-remote` contra o repositório remoto.
