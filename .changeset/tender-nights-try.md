---
'react-lgpd-consent': patch
'@react-lgpd-consent/core': patch
'@react-lgpd-consent/mui': patch
---

# 🧩 Fundamento Crítico de Consentimento — SUPER TASK v0.7.1

**Persistência + Loader + Consent Mode v2**

Esta release estabelece o **núcleo legal, técnico e funcional** da biblioteca react-lgpd-consent, garantindo um contrato sólido, seguro e auditável para uso institucional e governamental.

---

## 🔹 Bloco A — Persistência de Consentimento por Cookie

### ✨ API Consolidada de Persistência

Nova API completa no `ConsentProvider`:

```typescript
<ConsentProvider
  cookie={{
    name: 'lgpd-consent',
    domain: '.example.com',  // Compartilha entre subdomínios
    path: '/',
    sameSite: 'Lax',        // Default seguro
    secure: true,            // Auto em HTTPS
    maxAge: 31536000,       // Segundos (substitui maxAgeDays)
  }}
>
```

**Regras Implementadas:**

- ✅ Defaults seguros: `SameSite=Lax`, `Secure=true` em HTTPS
- ✅ Categoria `necessary` **sempre forçada como true**
- ✅ Nenhuma gravação de cookie durante SSR
- ✅ Suporte completo a subdomínios via `domain`
- ✅ Nova opção `maxAge` (segundos, padrão moderno)
- ✅ Opção `maxAgeDays` deprecated mas mantida para compatibilidade

**Ambientes Suportados:**

- ✅ `localhost` (desenvolvimento)
- ✅ `dev` / `staging` (domínios customizados)
- ✅ `production` (HTTPS obrigatório)
- ✅ Comportamento **independente de NODE_ENV**

---

## 🔹 Bloco B — ConsentScriptLoader com Bloqueio Real

### 🚫 Contrato de Bloqueio Garantido

> **Nenhum script não necessário executa antes do consentimento correspondente.**

### ✨ Sistema de Fila e Priorização

Implementado `ConsentScriptLoader` com:

```typescript
registerScript({
  id: 'google-analytics',
  category: 'analytics',
  priority: 1, // Ordem de execução
  execute: () => {
    // Seu script aqui
  },
  onConsentUpdate: (granted) => {
    // Reagir a mudanças de consentimento
  },
})
```

**Recursos Implementados:**

- ✅ **Fila interna de execução** com ordenação por:
  - 1. Categoria (`necessary` → `analytics` → `marketing`, etc.)
  - 2. Prioridade (numérica)
  - 3. Timestamp (ordem de registro)
- ✅ Scripts `necessary` executam **imediatamente**
- ✅ Scripts de outras categorias aguardam **consentimento explícito**
- ✅ Suporte a `onConsentUpdate` para reconfiguração dinâmica
- ✅ Snapshot de consentimento para scripts que precisam do estado atual
- ✅ **Otimização anti-duplicação**: integrações não são reexecutadas a cada render quando criadas inline (ex.: `integrations={[createGoogleAnalyticsIntegration(...)]}`). Sistema mantém hash estrutural para detectar mudanças reais e prevenir múltiplas inicializações do mesmo script.

**Observabilidade em DEV:**

- ✅ Logs detalhados de ordem de execução
- ✅ Indicação clara de categoria liberada
- ✅ Rastreamento de status de cada script
- ⚠️ **Silencioso em produção** (performance otimizada)

---

## 🔹 Bloco C — Integração Nativa Google Consent Mode v2

### 🎯 Implementação Automática

**Zero configuração manual necessária!**

```typescript
import { createGoogleAnalyticsIntegration } from '@react-lgpd-consent/core'

const ga4 = createGoogleAnalyticsIntegration({
  measurementId: 'G-XXXXXXXXXX'
})

<ConsentScriptLoader integrations={[ga4]} />
```

**O que a biblioteca faz automaticamente:**

1. ✅ Inicializa `dataLayer` se não existir
2. ✅ Define `gtag('consent', 'default', denied)` **antes** de qualquer tag
3. ✅ Mapeia categorias corretamente:
   - `analytics` → `analytics_storage`
   - `marketing` → `ad_storage`, `ad_user_data`, `ad_personalization`
4. ✅ Envia `gtag('consent', 'update')` quando usuário escolhe preferências
5. ✅ Dispara eventos de ciclo de vida:
   ```javascript
   { event: 'consent_initialized' }
   { event: 'consent_updated', preferences: {...} }
   ```

**Factories Implementadas:**

- ✅ `createGoogleAnalyticsIntegration` (GA4)
- ✅ `createGoogleTagManagerIntegration` (GTM)
- ✅ Suporte a `bootstrap()` para inicialização pré-consentimento
- ✅ Suporte a `onConsentUpdate()` para reconfiguração dinâmica

### 🔒 Ordem de Inicialização Segura

Fluxo garantido pela implementação:

```
1. dataLayer criado
2. gtag('consent', 'default', denied)
3. Loader bloqueia tags
4. Usuário consente
5. gtag('consent', 'update', granted/denied)
6. Tags disparam conforme consentimento
```

### ⚡ Compatibilidade Next.js (SSR)

- ✅ Nenhum acesso a `window` fora de `useEffect`
- ✅ App Router (Next.js 13+)
- ✅ Pages Router (Next.js 12+)
- ✅ **Zero hydration mismatch**
- ✅ Estratégia de renderização: `client-only` quando necessário

---

## 🆕 Novas APIs Públicas

### Core Package (`@react-lgpd-consent/core`):

```typescript
// Registro de scripts
registerScript(config: RegisteredScript): void

// Factories de integrações
createGoogleAnalyticsIntegration(config): ScriptIntegration
createGoogleTagManagerIntegration(config): ScriptIntegration

// Utilitários de cookie
readConsentCookie(name?: string): ConsentState | null
writeConsentCookie(state: ConsentState, options?: CookieOptions): void

// Novos tipos
type RegisteredScript = { ... }
type ScriptIntegration = { ... }
interface LoadScriptOptions = { ... }
```

---

## 📚 Documentação Atualizada

- ✅ **API.md** - Novas APIs de `registerScript` e Consent Mode v2
- ✅ **INTEGRACOES.md** - Guias completos de GA4, GTM, Facebook Pixel
- ✅ **MIGRATION.md** - Guia de migração v0.7.0 → v0.7.1
- ✅ **SUPER_TASK_VALIDATION.md** - Relatório técnico de validação completo

---

## 🔄 Breaking Changes

**Nenhum!** Esta release é 100% backward-compatible:

- ✅ Opção `maxAgeDays` deprecated mas funcional
- ✅ Comportamento padrão preservado
- ✅ APIs antigas continuam funcionando
- ✅ Migração gradual suportada

---

## 🎯 Melhorias Complementares

### Sistema de i18n para Diagnósticos

Sistema básico de internacionalização para mensagens de peer dependencies:

- ✅ Suporte a pt-BR (padrão) e en
- ✅ API para customização: `setPeerDepsLocale()`, `setPeerDepsMessages()`
- ✅ Mensagens extraídas para constantes (melhor manutenibilidade)

### Refatorações e Otimizações

- ✅ Strings de mensagens extraídas para constantes
- ✅ Separação de concerns (lógica vs conteúdo)
- ✅ Type safety aprimorado em toda API
- ✅ Performance otimizada (sem logs em produção)
- ✅ **Fix crítico**: Prevenção de reexecução de integrações a cada render quando `integrations` prop muda referência (inline array). Sistema agora usa hash estrutural para detectar mudanças reais e manter scripts já registrados estáveis.
