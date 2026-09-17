---
'@react-lgpd-consent/core': minor
'@react-lgpd-consent/mui': minor
'react-lgpd-consent': minor
---

Unifica o ciclo de vida de carregamento de scripts entre `ConsentScriptLoader` e `useConsentScriptLoader` e atualiza as integrações nativas.

- Extrai o runtime compartilhado de bootstrap/beforeLoad/init/onConsentUpdate (`integrationRuntime.ts`), garantindo que os caminhos automático e manual nunca inicializem com consentimento obsoleto e que downloads simultâneos sejam deduplicados.
- Adiciona `createZendeskMessagingIntegration` como fábrica recomendada para o widget Zendesk Messaging; `createZendeskChatIntegration` permanece disponível como alias legado.
- Exporta `GoogleConsentConfig` e `IntegrationConsent` para permitir tipagem de integrações customizadas com Google Consent Mode v2.
- Clarity emite aviso de depreciação para `upload` em vez de usá-lo como controle de coleta.
- Documenta em `INTEGRACOES.md` o ciclo de vida completo das integrações, incluindo comportamento de revogação, `reloadOnChange` e particularidades de GA4/GTM, Meta Pixel, Mixpanel, Hotjar, Clarity, Intercom e Zendesk.
- Atualiza dependências de desenvolvimento (pnpm 12, ESLint, Jest, Storybook, TypeScript-ESLint, React 19.3, entre outras) e adiciona overrides de segurança para `esbuild` e `qs` no `pnpm-workspace.yaml`.
