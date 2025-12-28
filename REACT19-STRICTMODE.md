# React 19 StrictMode

Este documento descreve como a biblioteca lida com o double-invoking de efeitos do React 19 em
desenvolvimento e quais praticas recomendadas para integrações e scripts.

## O que muda no StrictMode

Em React 18/19, o StrictMode em desenvolvimento pode executar efeitos duas vezes para ajudar a
detectar efeitos colaterais não idempotentes. Isso impacta carregadores de scripts e integrações
que não são preparados para reexecução.

## Garantias na biblioteca

- **Carregamento idempotente de scripts**: `scriptLoader` mantém um registro global para evitar
  injeções duplicadas e lida com reexecuções.
- **ConsentScriptLoader**: a fila de scripts considera múltiplas execuções e não duplica cargas.
- **SSR-safe**: acessos ao `window` e `document` são protegidos para evitar erros em import-time.

## Boas práticas para consumidores

- Evite side effects em topo de módulo; faça inicializações em efeitos ou callbacks.
- Não dependa de efeitos que assumem execução única.
- Para integrações customizadas, garanta que `init` e `onConsentUpdate` sejam idempotentes.

## Como testar

Você pode envolver seus exemplos com StrictMode:

```tsx
import React from 'react'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

Se notar scripts duplicados ou eventos repetidos, reveja as integrações e o uso de efeitos.
