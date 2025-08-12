# Contrato de API - react-lgpd-consent v0.2.0

Este documento define a API pública da biblioteca `react-lgpd-consent` versão 0.2.0, destacando as **mudanças e adições** em relação à v0.1.x.

## ⚡ **Resumo das Mudanças v0.2.0**

### ✅ **100% Backward Compatible**

- Toda API v0.1.x continua funcionando
- Apenas **adições** e **expansões** de funcionalidades
- Zero breaking changes

### 🍪 **Categorias Expandidas (BREAKING VISUAL)**

- **v0.1.x**: `analytics`, `marketing` (2 categorias)
- **v0.2.0**: `necessary`, `analytics`, `functional`, `marketing`, `social`, `personalization` (6 categorias ANPD)

### 🔧 **Novas Funcionalidades**

- Sistema extensível de categorias customizadas
- Integrações nativas (Google Analytics, GTM, UserWay)
- Textos ANPD expandidos (8 campos opcionais)
- Carregamento automático de scripts

---

## Exports Principais (Atualizados)

### `ConsentProvider` ✨ **EXPANDIDO**

**Props Adicionadas v0.2.0**:

```typescript
interface ConsentProviderProps {
  // Props v0.1.x (MANTIDAS)
  initialState?: ConsentState
  texts?: Partial<ConsentTexts>
  onConsentGiven?: (state: ConsentState) => void
  onPreferencesSaved?: (prefs: ConsentPreferences) => void
  cookie?: Partial<ConsentCookieOptions>
  children: React.ReactNode

  // 🆕 NOVAS v0.2.0
  customCategories?: CategoryDefinition[] // Categorias personalizadas
  scriptIntegrations?: ScriptIntegration[] // Integrações nativas
  theme?: any // Tema flexível (aceita props customizadas)
  PreferencesModalComponent?: React.ComponentType<any>
  preferencesModalProps?: Record<string, any>
  disableAutomaticModal?: boolean
  hideBranding?: boolean
}
```

### `useConsent()` ✨ **EXPANDIDO**

**Métodos Adicionados v0.2.0**:

```typescript
interface ConsentContextValue {
  // Métodos v0.1.x (MANTIDOS)
  consented: boolean
  preferences: ConsentPreferences
  acceptAll(): void
  rejectAll(): void
  setPreference(cat: Category, value: boolean): void
  openPreferences(): void
  closePreferences(): void
  resetConsent(): void

  // 🆕 NOVOS v0.2.0
  setPreferences(preferences: ConsentPreferences): void // Definir múltiplas preferências
  isModalOpen?: boolean // Estado do modal
}
```

### `ConsentGate` ✨ **MELHORADO**

**Suporte a Categorias Customizadas v0.2.0**:

```typescript
// v0.1.x - Apenas categorias fixas
<ConsentGate category="analytics"> // analytics | marketing

// v0.2.0 - Categorias padrão + customizadas
<ConsentGate category="analytics"> // 6 categorias padrão
<ConsentGate category="governo"> // Categoria customizada (string)
```

## 🆕 Novos Exports v0.2.0

### `ConsentScriptLoader` ⭐ **NOVO**

**Descrição**: Carregamento automático de scripts baseado em consentimento.

```typescript
interface ConsentScriptLoaderProps {
  integrations: ScriptIntegration[]
}

// Uso
<ConsentScriptLoader
  integrations={[
    createGoogleAnalyticsIntegration('GA_ID'),
    createGoogleTagManagerIntegration('GTM_ID'),
    createUserWayIntegration('USERWAY_ID'),
  ]}
/>
```

### `useConsentScriptLoader()` ⭐ **NOVO**

**Descrição**: Hook para carregamento programático de scripts.

```typescript
const { loadScript, scriptsLoaded } = useConsentScriptLoader(integrations)
```

### `CategoriesProvider` ⭐ **NOVO**

**Descrição**: Provider para categorias customizadas (usado internamente).

### Hooks de Categorias ⭐ **NOVOS**

```typescript
const customCategories = useCustomCategories() // Categorias personalizadas
const allCategories = useAllCategories() // Todas as categorias (padrão + custom)
```

### Factory Functions ⭐ **NOVAS**

```typescript
// Integrações pré-construídas
createGoogleAnalyticsIntegration(measurementId: string): ScriptIntegration
createGoogleTagManagerIntegration(containerId: string): ScriptIntegration
createUserWayIntegration(accountId: string): ScriptIntegration

// Factory genérica para integrações customizadas
createCustomIntegration(config: IntegrationConfig): ScriptIntegration
```

## Tipos Atualizados

### `Category` ✨ **EXPANDIDO**

```typescript
// v0.1.x
type Category = 'analytics' | 'marketing'

// v0.2.0 - 6 categorias ANPD
type Category =
  | 'necessary' // 🆕 Essencial
  | 'analytics' // ✅ Mantido
  | 'functional' // 🆕 Funcionalidades
  | 'marketing' // ✅ Mantido
  | 'social' // 🆕 Redes sociais
  | 'personalization' // 🆕 Personalização
```

### `ConsentPreferences` ✨ **EXPANDIDO**

```typescript
// v0.1.x
interface ConsentPreferences {
  analytics: boolean
  marketing: boolean
}

// v0.2.0 - 6 categorias + extensível
interface ConsentPreferences {
  necessary: boolean // 🆕 Sempre true
  analytics: boolean
  functional: boolean // 🆕
  marketing: boolean
  social: boolean // 🆕
  personalization: boolean // 🆕
  [key: string]: boolean // 🆕 Categorias customizadas
}
```

### `ConsentTexts` ✨ **EXPANDIDO**

```typescript
interface ConsentTexts {
  // Textos v0.1.x (MANTIDOS)
  bannerMessage: string
  acceptAll: string
  declineAll: string
  preferences: string
  policyLink?: string
  modalTitle: string
  modalIntro: string
  save: string
  necessaryAlwaysOn: string

  // 🆕 Textos ANPD v0.2.0 (todos opcionais)
  controllerInfo?: string // "Controlado por [Empresa/CNPJ]"
  dataTypes?: string // "Coletamos: navegação, preferências..."
  thirdPartySharing?: string // "Compartilhamos com: Google Analytics..."
  userRights?: string // "Direitos: acesso, correção, exclusão..."
  contactInfo?: string // "Contato DPO: dpo@empresa.com"
  retentionPeriod?: string // "Prazo de armazenamento: 12 meses"
  lawfulBasis?: string // "Base legal: consentimento/interesse legítimo"
  transferCountries?: string // "Transferência para: EUA, Irlanda"
}
```

## 🆕 Novos Tipos v0.2.0

### `CategoryDefinition`

```typescript
interface CategoryDefinition {
  id: string // ID único
  name: string // Nome amigável
  description: string // Descrição detalhada
  essential?: boolean // Se é essencial (não pode desabilitar)
  cookies?: string[] // Cookies específicos
}
```

### `ScriptIntegration`

```typescript
interface ScriptIntegration {
  id: string // ID único da integração
  name: string // Nome amigável
  category: string // Categoria de consentimento
  scripts: ScriptConfig[] // Configurações de scripts
  test?: () => boolean // Função de teste (opcional)
}
```

## Migração v0.1.x → v0.2.0

### ✅ **Sem Mudanças Necessárias**

```tsx
// v0.1.x - Continua funcionando idêntico em v0.2.0
<ConsentProvider
  texts={{
    bannerMessage: "Usamos cookies...",
    acceptAll: "Aceitar",
    declineAll: "Recusar"
  }}
  onConsentGiven={(state) => console.log(state)}
>
  <App />
  <CookieBanner />
</ConsentProvider>

<ConsentGate category="analytics">
  <GoogleAnalytics />
</ConsentGate>
```

### 🆕 **Novas Funcionalidades Opcionais**

```tsx
// v0.2.0 - Funcionalidades adicionais
;<ConsentProvider
  // ✅ Props v0.1.x mantidas
  texts={oldTexts}
  onConsentGiven={oldCallback}
  // 🆕 Novas funcionalidades opcionais
  customCategories={[
    { id: 'governo', name: 'Governo', description: '...', essential: false },
  ]}
  scriptIntegrations={[createGoogleAnalyticsIntegration('GA_ID')]}
>
  <App />
  <CookieBanner />
  {/* 🆕 Carregamento automático */}
  <ConsentScriptLoader integrations={scriptIntegrations} />
</ConsentProvider>

{
  /* 🆕 Categoria customizada */
}
;<ConsentGate category="governo">
  <GovIntegration />
</ConsentGate>
```

### ⚠️ **Mudança Visual (Não-Breaking)**

**Impacto**: Modal agora mostra 6 categorias por padrão (vs 2 em v0.1.x)

**Solução**: Para manter apenas 2 categorias:

```tsx
// Desabilitar categorias extras via texto vazio
<ConsentProvider
  texts={{
    // Manter apenas analytics e marketing visíveis
    functionalName: '', // Esconde categoria
    socialName: '', // Esconde categoria
    personalizationName: '', // Esconde categoria
  }}
/>
```

## Compatibilidade e Garantias

### ✅ **Garantido**

- API v0.1.x funciona 100% em v0.2.0
- Mesmo comportamento de cookies e estado
- Props e callbacks mantidos
- SSR funciona idêntico

### ⚠️ **Mudanças Visuais**

- Modal mostra mais categorias por padrão
- Textos expandidos se fornecidos via props
- Design visual pode ter pequenos ajustes

### 🔄 **Comportamento Aprimorado**

- `ConsentGate` aceita strings (categorias customizadas)
- Carregamento de scripts mais eficiente
- Melhor acessibilidade e navegação por teclado

---

## 🎯 Resumo de Valor v0.2.0

### **Para Projetos Existentes (v0.1.x):**

- ✅ **Zero refatoração** necessária
- ✅ **Mesmo comportamento** garantido
- ✅ **Mais categorias** disponíveis automaticamente

### **Para Novos Projetos:**

- ✅ **6 categorias ANPD** out-of-the-box
- ✅ **Integrações nativas** (GA, GTM, UserWay)
- ✅ **Sistema extensível** para necessidades específicas
- ✅ **Compliance completa** com textos ANPD

### **Para Projetos Corporativos/Governamentais:**

- ✅ **Categorias customizadas** ilimitadas
- ✅ **Textos ANPD** para adequação legal
- ✅ **Flexibilidade total** sem perder simplicidade

**🚀 Conclusão:** v0.2.0 é um **upgrade sem dor** que adiciona funcionalidades enterprise mantendo 100% de compatibilidade.
