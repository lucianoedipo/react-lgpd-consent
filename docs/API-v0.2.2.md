# Contrato de API - react-lgpd-consent v0.2.2

Este documento define a API pública da biblioteca `react-lgpd-consent` versão 0.2.2, destacando as **correções e melhorias** em relação à v0.2.1.

## ⚡ **Resumo das Correções v0.2.2**

### ✅ **100% Backward Compatible**

- Toda API v0.2.1 e v0.2.0 continua funcionando
- Apenas **correções** e **melhorias de DX**
- Zero breaking changes

### 🔧 **Sistema de Orientações Corrigido (BUG FIX)**

- **v0.2.1**: Sistema de orientações não funcionava (não integrado)
- **v0.2.2**: Sistema totalmente funcional com detecção de ambiente aprimorada

### 📚 **Documentação TSDoc Expandida**

- **v0.2.1**: Documentação básica dos tipos
- **v0.2.2**: TSDoc completa com exemplos para melhor autocompletar nas IDEs

---

## Exports Principais (Mantidos)

### `ConsentProvider` ✅ **MESMO COMPORTAMENTO**

Nenhuma mudança na interface, apenas correções internas:

```typescript
interface ConsentProviderProps {
  // Todas as props v0.2.1 mantidas idênticas
  initialState?: ConsentState
  categories?: ProjectCategoriesConfig
  texts?: Partial<ConsentTexts>
  theme?: any
  customCategories?: CategoryDefinition[] // deprecated mas funciona
  scriptIntegrations?: ScriptIntegration[]
  PreferencesModalComponent?: React.ComponentType<any>
  preferencesModalProps?: Record<string, any>
  disableAutomaticModal?: boolean
  blocking?: boolean
  hideBranding?: boolean
  onConsentGiven?: (state: ConsentState) => void
  onPreferencesSaved?: (prefs: ConsentPreferences) => void
  cookie?: Partial<ConsentCookieOptions>
  disableDeveloperGuidance?: boolean // NOVO: desabilita avisos de dev
  children: React.ReactNode
}
```

**🔧 Correções Internas v0.2.2:**

- ✅ Sistema de orientações agora funciona corretamente
- ✅ Detecção de ambiente de desenvolvimento aprimorada
- ✅ Console logs agora aparecem em desenvolvimento
- ✅ TSDoc completa para melhor autocompletar

### `useConsent()` ✅ **INTERFACE IDÊNTICA**

```typescript
interface ConsentContextValue {
  consented: boolean
  preferences: ConsentPreferences
  isModalOpen?: boolean
  acceptAll(): void
  rejectAll(): void
  setPreference(cat: Category, value: boolean): void
  setPreferences(preferences: ConsentPreferences): void
  openPreferences(): void
  closePreferences(): void
  resetConsent(): void
}
```

### `useCategories()` ✅ **MANTIDO**

```typescript
const categories = useCategories() // Lista de categorias ativas no projeto
```

### `useCategoryStatus()` ✅ **MANTIDO**

```typescript
const hasMarketing = useCategoryStatus('marketing') // boolean
```

### `ConsentGate` ✅ **MANTIDO**

```typescript
<ConsentGate category="analytics">
  <GoogleAnalytics />
</ConsentGate>
```

### `ConsentScriptLoader` ✅ **MANTIDO**

```typescript
<ConsentScriptLoader integrations={[...]} />
```

## 📚 Melhorias na Documentação TSDoc v0.2.2

### Antes (v0.2.1) - Documentação Básica

```typescript
interface ConsentProviderProps {
  /** Estado inicial do consentimento (para SSR). */
  initialState?: ConsentState
  /** Configuração de categorias ativas no projeto. */
  categories?: ProjectCategoriesConfig
  // ...
}
```

### Depois (v0.2.2) - Documentação Completa com Exemplos

````typescript
/**
 * Propriedades do componente ConsentProvider - configuração principal da biblioteca.
 *
 * @example Uso básico (configuração mínima):
 * ```tsx
 * <ConsentProvider
 *   categories={{ enabledCategories: ['analytics'] }}
 * >
 *   <App />
 * </ConsentProvider>
 * ```
 */
export interface ConsentProviderProps {
  /**
   * Estado inicial do consentimento para hidratação SSR.
   *
   * @example
   * ```tsx
   * // Em Next.js para evitar flash do banner
   * <ConsentProvider initialState={{ consented: true, preferences: {...} }}>
   * ```
   */
  initialState?: ConsentState

  /**
   * Configuração das categorias de cookies utilizadas no projeto.
   *
   * @example Apenas analytics:
   * ```tsx
   * categories={{ enabledCategories: ['analytics'] }}
   * ```
   *
   * @example Com categoria customizada:
   * ```tsx
   * categories={{
   *   enabledCategories: ['analytics', 'marketing'],
   *   customCategories: [{
   *     id: 'pesquisa',
   *     name: 'Cookies de Pesquisa',
   *     description: 'Coleta feedback dos usuários'
   *   }]
   * }}
   * ```
   */
  categories?: ProjectCategoriesConfig

  // ... continua com exemplos para cada prop
}
````

## 🚨 Sistema de Orientações Corrigido

### Problema v0.2.1

O sistema foi criado mas nunca integrado no `ConsentProvider`:

```tsx
// ❌ v0.2.1 - Orientações não funcionavam
<ConsentProvider>
  {' '}
  {/* Sem avisos no console */}
  <App />
</ConsentProvider>
```

### Solução v0.2.2

Sistema agora totalmente integrado e funcional:

```tsx
// ✅ v0.2.2 - Orientações funcionam
<ConsentProvider>
  {' '}
  {/* Avisos automáticos no console */}
  <App />
</ConsentProvider>
```

**Console Output v0.2.2:**

```
[🍪 LGPD-CONSENT] ⚠️  Avisos de Configuração
  [🍪 LGPD-CONSENT] Nenhuma configuração de categorias especificada.
  Usando padrão: necessary + analytics.

[🍪 LGPD-CONSENT] 💡 Sugestões
  [🍪 LGPD-CONSENT] Para produção, recomenda-se especificar explicitamente
  as categorias via prop "categories".

[🍪 LGPD-CONSENT] 🔧 Categorias Ativas (para UI customizada)
┌─────────────┬──────────────────────────┬─────────────┬─────────────┐
│     ID      │          Nome            │  Toggle UI? │ Essencial?  │
├─────────────┼──────────────────────────┼─────────────┼─────────────┤
│ necessary   │ Cookies Necessários      │ ❌ NÃO       │ 🔒 SIM      │
│ analytics   │ Cookies Analíticos       │ ✅ SIM       │ ⚙️ NÃO       │
└─────────────┴──────────────────────────┴─────────────┴─────────────┘
```

### Detecção de Ambiente Aprimorada v0.2.2

```typescript
// ✅ v0.2.2 - Detecta múltiplas formas de produção
const isProduction =
  // Vite/bundlers modernos
  (typeof import.meta !== 'undefined' && import.meta.env?.PROD === true) ||
  // NODE_ENV tradicional
  (typeof globalThis.process !== 'undefined' &&
    globalThis.process.env?.NODE_ENV === 'production') ||
  // Flags customizadas
  (typeof globalThis !== 'undefined' && globalThis.__LGPD_PRODUCTION__) ||
  (typeof window !== 'undefined' && window.__LGPD_DISABLE_GUIDANCE__)
```

## 🛠️ Melhorias no Autocompletar das IDEs

### Antes (v0.2.1) - Autocompletar Limitado

IDEs mostravam apenas nomes dos tipos sem contexto:

```
ConsentProviderProps
├── categories?: ProjectCategoriesConfig
├── texts?: Partial<ConsentTexts>
└── onConsentGiven?: (state: ConsentState) => void
```

### Depois (v0.2.2) - Autocompletar Rico

IDEs agora mostram documentação completa com exemplos:

```
ConsentProviderProps
├── categories?: ProjectCategoriesConfig
│   📝 "Configuração das categorias de cookies utilizadas no projeto..."
│   💡 Exemplo: categories={{ enabledCategories: ['analytics'] }}
├── texts?: Partial<ConsentTexts>
│   📝 "Textos customizados da interface (banner e modal)..."
│   💡 Exemplo: texts={{ bannerMessage: 'We use cookies...' }}
└── onConsentGiven?: (state: ConsentState) => void
    📝 "Callback executado quando usuário dá consentimento pela primeira vez..."
    💡 Exemplo: onConsentGiven={(state) => console.log('Consent:', state)}
```

## 🔍 Como Testar as Correções

### 1. Verificar Orientações no Console

```tsx
import { ConsentProvider, CookieBanner } from 'react-lgpd-consent'

// Deve mostrar avisos no console de desenvolvimento
function App() {
  return (
    <ConsentProvider>
      {' '}
      {/* ← Sem configuração explícita */}
      <CookieBanner />
      <YourApp />
    </ConsentProvider>
  )
}
```

### 2. Verificar Autocompletar na IDE

```tsx
// Ao digitar, IDE deve mostrar documentação rica com exemplos
<ConsentProvider
  categories={/* IDE mostra exemplos aqui */}
  texts={/* IDE mostra exemplos aqui */}
  onConsentGiven={/* IDE mostra assinatura completa */}
>
```

### 3. Configuração Recomendada (Sem Avisos)

```tsx
<ConsentProvider
  categories={{
    enabledCategories: ['analytics'], // ← Configuração explícita
  }}
  texts={{
    bannerMessage: 'Utilizamos cookies conforme LGPD...',
    controllerInfo: 'Controlado por: Sua Empresa - CNPJ: XX.XXX.XXX/0001-XX',
  }}
>
  <App />
</ConsentProvider>
```

## 📋 Checklist de Migração v0.2.1 → v0.2.2

### ✅ **Sem Ação Necessária**

- ✅ Todo código v0.2.1 funciona idêntico em v0.2.2
- ✅ Apenas instalar `npm update react-lgpd-consent`
- ✅ Orientações aparecerão automaticamente em desenvolvimento

### 🔧 **Melhorias Opcionais**

- 🔧 Verificar console para orientações sobre configuração
- 🔧 Configurar categorias explicitamente se usando padrões
- 🔧 Aproveitar nova documentação TSDoc nas IDEs

### 🚨 **Para Desabilitar Orientações (Opcional)**

Para desabilitar os avisos e sugestões para desenvolvedores, a forma **preferencial e mais idiomática** é usar a prop `disableDeveloperGuidance` no `ConsentProvider`:

```tsx
<ConsentProvider disableDeveloperGuidance={true}>
  {/* Sua aplicação */}
</ConsentProvider>
```

A forma anterior via `window.__LGPD_DISABLE_GUIDANCE__ = true` ou `globalThis.__LGPD_PRODUCTION__ = true` ainda funciona, mas é considerada legada.


---

## 🎯 Resumo de Valor v0.2.2

### **Para Desenvolvedores Existentes (v0.2.1):**

- ✅ **Zero refatoração** - upgrade transparente
- ✅ **Orientações funcionais** - não mais silêncio sobre problemas
- ✅ **Melhor DX** - autocompletar rico nas IDEs

### **Para Novos Desenvolvedores:**

- ✅ **Onboarding orientado** - sistema avisa sobre configuração inadequada
- ✅ **Documentação integrada** - exemplos direto na IDE
- ✅ **Menos bugs** - detecção proativa de problemas

### **Para Projetos Enterprise:**

- ✅ **Compliance assistida** - orientações sobre adequação LGPD
- ✅ **Configuração validada** - verificação automática de adequação
- ✅ **Produção limpa** - logs apenas em desenvolvimento

**🚀 Conclusão:** v0.2.2 é uma **correção importante** que torna o sistema de orientações funcional, melhorando significativamente a experiência do desenvolvedor sem quebrar nada.

---

**Versão**: 0.2.2  
**Tipo**: Bug Fix + Developer Experience  
**Compatibilidade**: 100% backward compatible  
**Data**: Agosto 2025
