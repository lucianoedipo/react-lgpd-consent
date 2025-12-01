---
'@react-lgpd-consent/core': patch
---

feat: Compatibilidade completa com React 19 StrictMode

- Implementado registro global `LOADING_SCRIPTS` em `scriptLoader.ts` para prevenir injeções duplicadas de scripts durante double-invoking de efeitos
- Adicionado `setTimeout` com cleanup adequado em `ConsentScriptLoader.tsx` para prevenir race conditions
- Scripts agora carregam apenas uma vez mesmo em desenvolvimento com StrictMode ativo
- Função `loadScript` é idempotente: múltiplas chamadas simultâneas retornam a mesma Promise
- **Correção crítica**: `loadScript` agora aguarda dinamicamente o consentimento em vez de rejeitar imediatamente, permitindo que scripts carreguem quando preferências mudarem
- Cleanup automático do registro ao completar/falhar carregamento
- Adicionados testes extensivos: `ConsentScriptLoader.strictmode.test.tsx` e `scriptLoader.strictmode.test.ts`
- Documentação completa em `docs/REACT19-STRICTMODE.md`
- Todos os 302 testes passando, incluindo 5 novos testes de StrictMode

**Breaking Changes:** Nenhuma - totalmente retrocompatível
