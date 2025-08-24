# RFC-0001 — Estratégia de Bloqueio no Provider (opt‑in condicionado)

Status: Proposta
Autor: Luciano/Codex
Data: 2025-08-23
Versão alvo: v0.3.x (minor)

## Contexto

Hoje o bloqueio “bloqueante” (impedir interação com a página até decisão) é feito pelo componente `CookieBanner` padrão quando `blocking` está ativo. Para quem substitui o banner por um componente customizado, esse comportamento depende da implementação do usuário, o que pode gerar inconsistências de compliance.

## Objetivos

- Oferecer uma forma de o Provider garantir o bloqueio, independentemente do banner customizado.
- Manter comportamento atual para não quebrar integrações existentes.
- Tornar o bloqueio no Provider opt‑in e condicionado ao tipo de banner utilizado.
- Integrar com tokens de design para controlar o efeito visual do backdrop.

## Proposta de API

Adicionar prop opcional em `ConsentProvider`:

```ts
/**
 * Estratégia de bloqueio quando `blocking` estiver habilitado.
 * - 'auto' (padrão): se usar banner padrão => bloqueio feito pelo banner;
 *   se usar banner custom => bloqueio fica a cargo do componente (sem overlay do provider).
 * - 'provider': o Provider cria um overlay de bloqueio na página, acima do app e abaixo do banner.
 * - 'component': nenhum overlay do Provider; espera-se que o banner (padrão ou custom) trate o bloqueio.
 *
 * Observações:
 * - Visual do overlay do Provider controlado por `designTokens.layout.backdrop`:
 *   - `false`: overlay transparente (bloqueia cliques sem escurecer);
 *   - `string` (ex.: 'rgba(0,0,0,0.4)'): overlay com escurecimento;
 *   - ausente: fallback seguro 'rgba(0,0,0,0.4)'.
 * - A11y: recomenda-se que o banner (padrão/custom) use semântica de diálogo (role="dialog", aria-modal="true"), com focus-trap.
 */
blockingStrategy?: 'auto' | 'provider' | 'component'
```

Comportamento proposto:

- `blockingStrategy = 'auto'` (padrão):
  - Banner padrão: segue como hoje (o próprio banner trata bloqueio visual e funcional).
  - Banner custom: Provider NÃO cria overlay; bloqueio a cargo do componente custom (compatibilidade atual).
- `blockingStrategy = 'provider'`:
  - Provider sempre cria overlay de bloqueio quando `blocking === true`, `!state.consented` e `isHydrated`.
  - Banner (padrão ou custom) só cuida da UI; overlay garante bloqueio.
- `blockingStrategy = 'component'`:
  - Provider nunca cria overlay; banner é responsável pelo bloqueio.

Opcional (sugestão de DX): manter `blocking?: boolean` como prop informativa em `CustomCookieBannerProps` (dica para o banner custom ajustar sua UI), sem impacto no overlay do Provider.

## Integração com dark‑filter existente

Para apps que já usam um “dark‑filter” próprio:

- Usar `blockingStrategy='provider'` com `designTokens.layout.backdrop = false` para bloquear cliques sem escurecer; o dark‑filter do app permanece apenas visual (`pointer-events: none`).
- Garantir ordem/z‑index: overlay do Provider < banner; dark‑filter do app < banner e sem capturar eventos.

## Migração / Backwards Compatibility

- Prop nova é opcional; valor padrão `'auto'` mantém comportamento atual.
- Sem breaking changes: usuários com banner custom continuam no modelo atual até optarem por `'provider'` conscientemente.

## Exemplos

```tsx
// 1) Projeto com banner custom e dark-filter próprio (somente visual)
<ConsentProvider
  blocking
  blockingStrategy="provider"
  designTokens={{ layout: { backdrop: false } }}
  CookieBannerComponent={MeuBannerCustom}
>
  <App />
</ConsentProvider>

// 2) Projeto usando somente a lib para bloqueio visual e funcional
<ConsentProvider
  blocking
  blockingStrategy="provider"
  designTokens={{ layout: { backdrop: 'rgba(0,0,0,0.4)' } }}
>
  <App />
</ConsentProvider>

// 3) Comportamento atual (auto): banner custom decide o bloqueio
<ConsentProvider blocking CookieBannerComponent={MeuBannerCustom}>
  <App />
</ConsentProvider>
```

## Implementação (etapas)

1. Tipos e TSDoc: adicionar `blockingStrategy` a `ConsentProviderProps` e documentar com detalhes (esta RFC).
2. Provider: implementar overlay condicional somente quando `blockingStrategy === 'provider'` (e condições de consentimento/hidratação), respeitando `designTokens.layout.backdrop`.
3. Documentação: atualizar README/API (seção “Bloqueio”), com recomendações de integração com dark‑filter e A11y.
4. Testes: adicionar testes para overlay do Provider (render/estilos básicos) e regressão do fluxo atual.

## Riscos e Mitigações

- Sobreposição de overlays (lib + app): mitigado por `backdrop: false` e docs de integração.
- Quebra de UX no custom: default `'auto'` preserva a experiência atual; `'provider'` é opt‑in.

---

Comentários são bem-vindos antes de implementar a etapa 2 (overlay no Provider).
