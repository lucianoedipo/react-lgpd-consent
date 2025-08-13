# Contrato de API - react-lgpd-consent v0.3.0

> **📢 ATENÇÃO**: Esta documentação é para a versão **v0.3.0**.
> Esta versão contém **MUDANÇAS QUE QUEBRAM A COMPATIBILIDADE** em relação às versões `v0.2.x`.
> Por favor, leia o guia de migração abaixo.

---

## ⚡ Resumo das Mudanças v0.3.0

### 🚨 **MUDANÇAS QUE QUEBRAM A COMPATIBILIDADE**

- **Remoção de Exports Diretos de Componentes UI**: `CookieBanner` e `FloatingPreferencesButton` não são mais exportados diretamente. Eles agora são gerenciados e renderizados automaticamente pelo `ConsentProvider`.
- **Remoção da Prop `disableAutomaticModal`**: Esta prop foi removida do `ConsentProvider`. O modal de preferências agora é sempre renderizado (seja o padrão ou um componente customizado fornecido) e sua visibilidade é controlada internamente pelo estado `isModalOpen`.
- **Tipagem Estrita para Componentes UI Customizados**: As props para `PreferencesModalComponent`, `CookieBannerComponent` e `FloatingPreferencesButtonComponent` agora exigem tipos específicos (`CustomPreferencesModalProps`, `CustomCookieBannerProps`, `CustomFloatingPreferencesButtonProps`). Componentes customizados que usavam `React.ComponentType<any>` precisarão ser atualizados.
- **Remoção do Hook `useConsentComponentProps`**: Este hook utilitário foi removido, pois os componentes internos agora usam `useConsent` e `useConsentTexts` diretamente.

### ✨ **Novas Funcionalidades e Melhorias**

- **Renderização Automática de Componentes UI Padrão**: O `ConsentProvider` agora renderiza automaticamente o `CookieBanner` (quando necessário) e o `FloatingPreferencesButton` (após consentimento), reduzindo o boilerplate.
- **Componentes UI Sobrescrevíveis com Tipagem Clara**: Permite que desenvolvedores forneçam seus próprios componentes de banner, modal e botão flutuante com total segurança de tipo.
- **Controle Simplificado do Modal**: A visibilidade do modal é controlada exclusivamente pelo estado interno, eliminando a necessidade da prop `disableAutomaticModal`.
- **Carregamento Imediato de Banner e Botão Flutuante**: Removido o lazy loading para `CookieBanner` e `FloatingPreferencesButton` para garantir visibilidade imediata e evitar falhas de carregamento.
- **Prop `disableDeveloperGuidance`**: Permite desabilitar os avisos e sugestões para desenvolvedores no console.
- **Prop `reloadOnChange` para `ConsentScriptLoader`**: Permite recarregar scripts de integração quando as preferências de consentimento mudam.
- **Ajuste de Posição da Marca**: A marca "fornecido por LÉdipO.eti.br" agora é exibida no canto inferior direito do banner e modal.

---

## 📖 Guia de Migração de `v0.2.x` para `v0.3.0`

### 1. Atualize suas Dependências

```bash
npm install react-lgpd-consent@latest
# ou
yarn add react-lgpd-consent@latest
```

### 2. Remova Imports Diretos de Componentes UI

Se você importava `CookieBanner` ou `FloatingPreferencesButton` diretamente, remova essas linhas. O `ConsentProvider` agora os gerencia.

**❌ Antes:**

```tsx
import { ConsentProvider, CookieBanner, FloatingPreferencesButton } from 'react-lgpd-consent';
// ...
<CookieBanner />
<FloatingPreferencesButton />
```

**✅ Depois:**

```tsx
import { ConsentProvider } from 'react-lgpd-consent'
// ...
// O ConsentProvider renderiza automaticamente
```

### 3. Remova a Prop `disableAutomaticModal`

Esta prop não existe mais. O modal de preferências agora é sempre renderizado e sua visibilidade é controlada internamente.

**❌ Antes:**

```tsx
<ConsentProvider disableAutomaticModal={true}>{/* ... */}</ConsentProvider>
```

**✅ Depois:**

```tsx
<ConsentProvider>{/* ... */}</ConsentProvider>
```

### 4. Atualize Componentes UI Customizados (se aplicável)

Se você fornecia componentes customizados para `PreferencesModalComponent`, `CookieBannerComponent` ou `FloatingPreferencesButtonComponent`, você precisará atualizar suas interfaces de props.

**❌ Antes (exemplo para Modal):**

```tsx
// Seu componente customizado
const MyCustomModal: React.FC<any> = (props) => {
  /* ... */
}

// No ConsentProvider
;<ConsentProvider PreferencesModalComponent={MyCustomModal} />
```

**✅ Depois (exemplo para Modal):**

```tsx
import { CustomPreferencesModalProps } from 'react-lgpd-consent'

// Seu componente customizado
const MyCustomModal: React.FC<CustomPreferencesModalProps> = (props) => {
  // Agora você tem acesso tipado a props como preferences, setPreferences, isModalOpen, texts
  const { preferences, setPreferences, closePreferences, isModalOpen, texts } =
    props
  /* ... */
}

// No ConsentProvider
;<ConsentProvider PreferencesModalComponent={MyCustomModal} />
```

Faça o mesmo para `CookieBannerComponent` (usando `CustomCookieBannerProps`) e `FloatingPreferencesButtonComponent` (usando `CustomFloatingPreferencesButtonProps`).

### 5. Remova o Hook `useConsentComponentProps` (se aplicável)

Se você estava usando este hook, ele foi removido. Use `useConsent()` e `useConsentTexts()` diretamente para acessar o estado e as ações de consentimento.

---

## Exports Principais (v0.3.0)

### `ConsentProvider`

**Descrição**: Provedor de contexto que gerencia o estado de consentimento de cookies e renderiza os componentes UI padrão ou customizados.

**Props (Interface Completa)**:

````typescript
export interface ConsentProviderProps {
  /**
   * Estado inicial do consentimento para hidratação SSR.
   * @example
   * ```tsx
   * // Em Next.js para evitar flash do banner
   * <ConsentProvider initialState={{ consented: true, preferences: {...} }}>
   * ```
   */
  initialState?: ConsentState

  /**
   * Configuração das categorias de cookies utilizadas no projeto.
   * Define quais categorias padrão serão habilitadas e categorias customizadas.
   * @example Apenas analytics:
   * ```tsx
   * categories={{ enabledCategories: ['analytics'] }}
   * ```
   * @example Apenas categorias padrão:
   * ```tsx
   * categories={{
   *   enabledCategories: ['analytics', 'marketing']
   * }}
   * ```
   */
  categories?: ProjectCategoriesConfig

  /**
   * Textos customizados da interface (banner e modal).
   * Todos os campos são opcionais - valores não fornecidos usam o padrão em português.
   * @example Textos básicos:
   * ```tsx
   * texts={{
   *   bannerMessage: 'We use cookies...',
   *   acceptAll: 'Accept All',
   *   declineAll: 'Reject'
   * }}
   * ```
   * @example Textos ANPD para compliance:
   * ```tsx
   * texts={{
   *   controllerInfo: 'Controlado por: Empresa XYZ - CNPJ: 12.345.678/0001-90',
   *   dataTypes: 'Coletamos: endereço IP, preferências de navegação',
   *   userRights: 'Você pode solicitar acesso, correção ou exclusão dos dados',
   * }}
   * ```
   */
  texts?: Partial<ConsentTexts>

  /**
   * Tema customizado Material-UI aplicado aos componentes.
   * Aceita qualquer objeto que será passado para ThemeProvider.
   * @example
   * ```tsx
   * theme={{
   *   palette: { primary: { main: '#1976d2' } },
   *   components: { MuiButton: { styleOverrides: { root: { borderRadius: 8 } } } }
   * }}
   * ```
   */
  theme?: any

  /**
   * Tokens de design para customização visual avançada.
   * Oferece controle direto sobre cores, fontes, espaçamento e layout.
   * @example
   * ```tsx
   * designTokens={{
   *   colors: { background: '#000', text: '#fff' },
   *   typography: { fontFamily: ''Inter', sans-serif' },
   *   spacing: { borderRadius: { banner: 0 } }
   * }}
   * ```
   */
  designTokens?: DesignTokens

  /**
   * Integrações nativas de scripts terceiros (Google Analytics, etc.).
   * Scripts são carregados automaticamente baseado no consentimento.
   * @example
   * ```tsx
   * import { createGoogleAnalyticsIntegration } from 'react-lgpd-consent'
   *
   * scriptIntegrations={[
   *   createGoogleAnalyticsIntegration('GA_MEASUREMENT_ID')
   * ]}
   * ```
   */
  scriptIntegrations?: import('../utils/scriptIntegrations').ScriptIntegration[]

  /**
   * Componente customizado para substituir o modal padrão de preferências.
   * Deve implementar a lógica de consentimento usando as props definidas em `CustomPreferencesModalProps`.
   */
  PreferencesModalComponent?: React.ComponentType<CustomPreferencesModalProps>

  /** Props adicionais passadas para o modal customizado. */
  preferencesModalProps?: Record<string, any>

  /**
   * Componente customizado para substituir o banner padrão de cookies.
   * Se não fornecido, o `CookieBanner` padrão será renderizado.
   * Deve implementar a lógica de consentimento usando as props definidas em `CustomCookieBannerProps`.
   */
  CookieBannerComponent?: React.ComponentType<CustomCookieBannerProps>

  /** Props adicionais passadas para o banner customizado. */
  cookieBannerProps?: Record<string, any>

  /**
   * Componente customizado para substituir o botão flutuante de preferências.
   * Se não fornecido, o `FloatingPreferencesButton` padrão será renderizado.
   * Deve implementar a lógica de consentimento usando as props definidas em `CustomFloatingPreferencesButtonProps`.
   */
  FloatingPreferencesButtonComponent?: React.ComponentType<CustomFloatingPreferencesButtonProps>

  /** Props adicionais passadas para o botão flutuante customizado. */
  floatingPreferencesButtonProps?: Record<string, any>

  /**
   * Desabilita o botão flutuante de preferências.
   * Útil quando o usuário da lib quer ter controle total sobre o acesso às preferências.
   */
  disableFloatingPreferencesButton?: boolean

  /**
   * Comportamento do banner de consentimento:
   * - `false` (padrão): Banner não-intrusivo, usuário pode navegar livremente
   * - `true`: Banner bloqueia interação até decisão (compliance rigorosa)
   */
  blocking?: boolean

  /** Oculta o branding "fornecido por LÉdipO.eti.br" dos componentes. */
  hideBranding?: boolean

  /**
   * Callback executado quando usuário dá consentimento pela primeira vez.
   * Útil para inicializar analytics, registrar evento, etc.
   * @example
   * ```tsx
   * onConsentGiven={(state) => {
   *   console.log('Consentimento registrado:', state)
   *   // Inicializar Google Analytics, etc.
   * }}
   * ```
   */
  onConsentGiven?: (state: ConsentState) => void

  /**
   * Callback executado quando usuário modifica preferências.
   * Executado após salvar as mudanças.
   * @example
   * ```tsx
   * onPreferencesSaved={(prefs) => {
   *   console.log('Novas preferências:', prefs)
   *   // Reconfigurar scripts baseado nas preferências
   * }}
   * ```
   */
  onPreferencesSaved?: (prefs: ConsentPreferences) => void

  /**
   * Configurações do cookie de consentimento.
   * Valores não fornecidos usam padrões seguros para LGPD.
   * @example
   * ```tsx
   * cookie={{
   *   name: 'meuAppConsent',
   *   maxAgeDays: 180,
   *   sameSite: 'Strict'
   * }}
   * ```
   */
  cookie?: Partial<ConsentCookieOptions>

  /**
   * Desabilita os avisos e sugestões para desenvolvedores no console.
   * Útil para ambientes de produção ou quando os avisos não são desejados.
   * Por padrão, os avisos já são desabilitados em builds de produção.
   */
  disableDeveloperGuidance?: boolean

  /** Elementos filhos - toda a aplicação que precisa de contexto de consentimento. */
  children: React.ReactNode
}
````

### `useConsent()`

**Descrição**: Hook principal para acessar e manipular o estado de consentimento de cookies.

**Retorno (Interface Completa)**:

```typescript
export interface ConsentContextValue {
  /** Indica se o usuário consentiu. */
  consented: boolean
  /** Preferências atuais do usuário. */
  preferences: ConsentPreferences
  /** Indica se o modal de preferências está aberto. */
  isModalOpen?: boolean
  /** Aceita todas as categorias de consentimento. */
  acceptAll: () => void
  /** Rejeita todas as categorias de consentimento. */
  rejectAll: () => void
  /** Define a preferência para uma categoria específica. */
  setPreference: (cat: Category, value: boolean) => void
  /** Define múltiplas preferências de uma vez e salva. */
  setPreferences: (preferences: ConsentPreferences) => void
  /** Abre o modal de preferências. */
  openPreferences: () => void
  /** Fecha o modal de preferências. */
  closePreferences: () => void
  /** Reseta o consentimento do usuário. */
  resetConsent: () => void
}
```

### `useConsentTexts()`

**Descrição**: Hook para acessar textos customizados do ConsentProvider. Útil para componentes personalizados que precisam dos textos configurados.

### `useConsentHydration()`

**Descrição**: Hook para verificar se a hidratação do cookie foi concluída. Útil para evitar flash do banner antes de verificar cookies existentes.

### `useCategories()`

**Descrição**: Hook para obter a lista de categorias ativas no projeto.

### `useCategoryStatus()`

**Descrição**: Hook para verificar o status de uma categoria específica.

### `ConsentGate`

**Descrição**: Componente para renderização condicional de conteúdo baseado no consentimento de uma categoria específica.

**Uso**:

```tsx
<ConsentGate category="analytics">
  {/* Este conteúdo só será renderizado se a categoria 'analytics' for consentida */}
  <GoogleAnalyticsComponent />
</ConsentGate>
```

### `ConsentScriptLoader`

**Descrição**: Componente que carrega scripts automaticamente baseado no consentimento.

**Props**:

```typescript
interface ConsentScriptLoaderProps {
  /** Lista de integrações de scripts para carregar baseado no consentimento */
  integrations: ScriptIntegration[]
  /** Se true, força recarregamento se consentimento mudar */
  reloadOnChange?: boolean
}
```

**Uso**:

```tsx
import {
  ConsentScriptLoader,
  createGoogleAnalyticsIntegration,
} from 'react-lgpd-consent'

const integrations = [
  createGoogleAnalyticsIntegration({ measurementId: 'GA_MEASUREMENT_ID' }),
]

function App() {
  return (
    <ConsentProvider categories={{ enabledCategories: ['analytics'] }}>
      <ConsentScriptLoader integrations={integrations} reloadOnChange={true} />
      {/* ... */}
    </ConsentProvider>
  )
}
```

### `useConsentScriptLoader()`

**Descrição**: Hook para carregamento manual de scripts baseado no consentimento.

### Tipos Públicos (v0.3.0)

```typescript
// Categorias ANPD
export type Category =
  | 'necessary'
  | 'analytics'
  | 'functional'
  | 'marketing'
  | 'social'
  | 'personalization'

// Definição de Categoria
export interface CategoryDefinition {
  id: string
  name: string
  description: string
  essential?: boolean
  cookies?: string[]
}

// Configuração de Categorias do Projeto
export interface ProjectCategoriesConfig {
  enabledCategories?: Category[]
}

// Preferências de Consentimento
export interface ConsentPreferences {
  necessary: boolean
  [key: string]: boolean
}

// Dados do Cookie de Consentimento
export interface ConsentCookieData {
  version: string
  consented: boolean
  preferences: ConsentPreferences
  consentDate: string
  lastUpdate: string
  source: 'banner' | 'modal' | 'programmatic'
  projectConfig?: ProjectCategoriesConfig
}

// Estado Interno de Consentimento
export interface ConsentState extends ConsentCookieData {
  isModalOpen?: boolean
}

// Textos da Interface
export interface ConsentTexts {
  bannerMessage: string
  acceptAll: string
  declineAll: string
  preferences: string
  policyLink?: string
  modalTitle: string
  modalIntro: string
  save: string
  necessaryAlwaysOn: string
  controllerInfo?: string
  dataTypes?: string
  thirdPartySharing?: string
  userRights?: string
  contactInfo?: string
  retentionPeriod?: string
  lawfulBasis?: string
  transferCountries?: string
}

// Opções de Cookie
export interface ConsentCookieOptions {
  name: string
  maxAgeDays: number
  sameSite: 'Lax' | 'Strict'
  secure: boolean
  path: string
}

// Tokens de Design
export interface DesignTokens {
  colors?: {
    background?: string
    text?: string
    primary?: string
    secondary?: string
  }
  typography?: {
    fontFamily?: string
    fontSize?: {
      banner?: string
      modal?: string
    }
    fontWeight?: {
      normal?: number
      bold?: number
    }
  }
  spacing?: {
    padding?: {
      banner?: string | number
      modal?: string | number
    }
    borderRadius?: {
      banner?: string | number
      modal?: string | number
    }
  }
  layout?: {
    position?: 'bottom' | 'top' | 'floating'
    width?: {
      mobile?: string
      desktop?: string
    }
    backdrop?: boolean
  }
}

// Props para Componentes UI Customizados
export interface CustomCookieBannerProps {
  consented: boolean
  acceptAll: () => void
  rejectAll: () => void
  openPreferences: () => void
  texts: ConsentTexts
}

export interface CustomPreferencesModalProps {
  preferences: ConsentPreferences
  setPreferences: (preferences: ConsentPreferences) => void
  closePreferences: () => void
  isModalOpen?: boolean
  texts: ConsentTexts
}

export interface CustomFloatingPreferencesButtonProps {
  openPreferences: () => void
  consented: boolean
}

// Integração de Script
export interface ScriptIntegration {
  id: string
  name: string
  category: string
  scripts: ScriptConfig[]
  test?: () => boolean
}
```

```typescript
// Factory Functions (para integrações pré-construídas)
// Exemplo: createGoogleAnalyticsIntegration, createGoogleTagManagerIntegration, createUserWayIntegration
```

---

## 🚀 Conclusão v0.3.0

A versão `v0.3.0` representa um avanço significativo na arquitetura e na experiência do desenvolvedor da biblioteca `react-lgpd-consent`. Apesar das mudanças que quebram a compatibilidade, elas foram implementadas para simplificar o uso, aumentar a segurança de tipo e preparar a biblioteca para futuras expansões focadas em multi-regulamentação e conformidade avançada.

---
