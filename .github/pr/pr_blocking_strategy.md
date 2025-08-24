Resumo
- Adiciona estratégia de bloqueio no Provider via prop opt‑in `blockingStrategy`.
- Mantém o comportamento atual por padrão (`auto`).
- Atualiza documentação (README/API), adiciona RFC e testes.

Mudanças Principais
- Provider overlay (opt‑in):
  - Novo comportamento quando `blockingStrategy='provider'` e `blocking=true`:
    - Provider renderiza overlay de bloqueio acima do app e abaixo do banner (padrão/custom).
    - Respeita `designTokens.layout.backdrop`:
      - `false`: overlay transparente (bloqueia cliques sem escurecer).
      - `string` (ex.: `'rgba(0,0,0,0.4)'`): cor custom do overlay.
      - fallback: `'rgba(0,0,0,0.4)'`.
- API e Tipos:
  - `ConsentProviderProps`: adicionada prop opcional `blockingStrategy: 'auto' | 'provider' | 'component'`.
  - `CustomCookieBannerProps`: adicionada prop informativa `blocking?: boolean`.
  - `DesignTokens.layout.backdrop`: agora aceita `boolean | string` (para RGBA).
- Componente padrão:
  - Continua respeitando `blocking` no próprio `CookieBanner` (comportamento atual).
  - Branding não é repassado a banners customizados.
- Documentação:
  - README: seção “Bloqueio (opt‑in) e integração com dark‑filter” com exemplos.
  - API.md: nova linha na tabela de props do `ConsentProvider` sobre `blockingStrategy`.
- RFC:
  - `rfcs/0001-provider-blocking-strategy.md` com objetivos, API, exemplos, integração com dark‑filter e plano de implementação.
- Testes:
  - `src/context/ProviderBlockingStrategy.test.tsx`:
    - Overlay aparece quando `blockingStrategy='provider'`.
    - Não aparece em `'auto'` e quando `blocking=false`.
    - Respeita `designTokens.layout.backdrop` (`false`, `string`, fallback).
    - Overlay some após consentimento (`acceptAll`).
    - Banner custom recebe prop informativa `blocking`; overlay só aparece com `'provider'`.

Motivação
- Garantir um modo de bloqueio consistente sem depender da implementação do banner custom.
- Evitar impactos: opt‑in (padrão `'auto'` mantém a compatibilidade).
- Melhor DX com dark‑filter próprio (controle do visual via tokens e bloqueio funcional garantido quando desejado).

Compatibilidade
- Backwards‑compatible:
  - Padrão: `blockingStrategy='auto'` (sem overlay do Provider com banner custom).
  - `'provider'` é opt‑in.
  - `'component'` mantém o modelo tradicional.
- Tipos ampliados sem breaking changes.

Notas
- Refs: #2
- Após merge: atualizar CHANGELOG e reforçar recomendações A11y (role="dialog", aria‑modal, focus‑trap) para banners custom.
