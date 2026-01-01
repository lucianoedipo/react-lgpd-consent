---
'@react-lgpd-consent/core': minor
'@react-lgpd-consent/mui': minor
'react-lgpd-consent': minor
---

feat: adiciona posicionamento configurável do banner e aprimora textos de consentimento

### Melhorias de UX e Posicionamento

- **Posicionamento do banner**: novas props `position`, `anchor` e `offset` em `cookieBannerProps` permitem ajustar a posição do banner para evitar colisões com footers fixos, chat widgets e outros elementos flutuantes
- **Posicionamento do FAB**: prop `offset` em `floatingPreferencesButtonProps` possibilita afastar o botão flutuante de outros elementos da UI
- **Textos de consentimento**: aprimorados os textos padrão para comunicar claramente o uso de cookies necessários e categorias opcionais, melhorando a transparência LGPD/ANPD

### Melhorias Técnicas

- **Storybook**: removidas stories MDX e adicionada configuração Vite para avisos de tamanho de chunks
- **TypeDoc**: removida execução shell em `run-typedoc.mjs` para compatibilidade multiplataforma
- **Bundle**: ajustados limites de tamanho no `react-lgpd-consent/package.json`
- **MUI Patch**: aplicado patch em `@mui/icons-material@7.3.6` para resolver problemas de compatibilidade com exports

### Documentação

- Adicionada seção de posicionamento em `QUICKSTART.md` e `API.md`
- Atualizada `CONFORMIDADE.md` com ênfase na comunicação clara de categorias
- Aprimorada documentação de props em `DesignContext.tsx`
- Consolidados links entre pacotes em READMEs

### Limpeza e Refinamentos

- Ajustados testes de parsing de cookies legados em `cookieUtils.test.ts`
- Removidos comentários desnecessários em `cookieDiscovery.ts`
- Refinado guidance para desenvolvedores em `developerGuidance.ts`
