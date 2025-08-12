# Contrato de API - react-lgpd-consent (MVP) - ⚠️ LEGACY

> **📢 ATENÇÃO**: Esta documentação é para versão **v0.1.x (LEGACY)**  
> **Para v0.2.0+** → veja [API-v0.2.0.md](./API-v0.2.0.md)

Este documento define a API pública estável da biblioteca `react-lgpd-consent` versão 0.1.x.

**✅ Compatibilidade**: Toda API v0.1.x continua funcionando em v0.2.0+ sem mudanças.

---

## Exports Principais

### `ConsentProvider`

**Descrição**: Provedor de contexto que gerencia o estado de consentimento de cookies.

**Props (Interface Estável)**:

```typescript
interface ConsentProviderProps {
  initialState?: ConsentState // SSR/hidratação opcional
  texts?: Partial<ConsentTexts> // i18n simples via props
  onConsentGiven?: (state: ConsentState) => void
  onPreferencesSaved?: (prefs: ConsentPreferences) => void
  cookie?: Partial<ConsentCookieOptions> // ex.: name, maxAgeDays, sameSite, secure
  children: React.ReactNode
}
```

**Comportamento Garantido**:

- ✅ Lê/escreve apenas após interação do usuário (sem pre-check)
- ✅ Persiste em cookie client-side, sem necessidade de backend
- ✅ Suporte SSR via `initialState` (evita flash de conteúdo)

### `CookieBanner`

**Descrição**: Componente de banner de consentimento de cookies.

**Props (Interface Estável)**:

```typescript
interface CookieBannerProps {
  policyLinkUrl?: string // URL da política de privacidade
  debug?: boolean // força exibição para QA
  SnackbarProps?: Partial<SnackbarProps> // pass-through para MUI
  PaperProps?: Partial<PaperProps> // pass-through para MUI
}
```

### `PreferencesModal`

**Descrição**: Modal para configuração detalhada de preferências de cookies.

**Props (Interface Estável)**:

```typescript
interface PreferencesModalProps {
  DialogProps?: Partial<DialogProps> // pass-through para MUI Dialog
}
```

### `useConsent()`

**Descrição**: Hook principal para interação com o contexto de consentimento.

**Retorno (Interface Estável)**:

```typescript
interface ConsentContextValue {
  consented: boolean // estado de consentimento geral
  preferences: ConsentPreferences // preferências por categoria
  acceptAll(): void // aceita todas as categorias
  rejectAll(): void // rejeita categorias não essenciais
  setPreference(cat: Category, value: boolean): void // define preferência específica
  openPreferences(): void // abre modal de preferências
  closePreferences(): void // fecha modal de preferências
  resetConsent(): void // reseta todo o consentimento
}
```

## Tipos Públicos (Estáveis)

### Categorias

```typescript
type Category = 'analytics' | 'marketing' // MVP: 2 categorias
```

### Interfaces Principais

```typescript
interface ConsentPreferences {
  analytics: boolean
  marketing: boolean
}

interface ConsentState {
  consented: boolean
  preferences: ConsentPreferences
  isModalOpen?: boolean
}

interface ConsentTexts {
  bannerMessage: string
  acceptAll: string
  declineAll: string
  preferences: string
  policyLink?: string
  modalTitle: string
  modalIntro: string
  save: string
  necessaryAlwaysOn: string
}

interface ConsentCookieOptions {
  name: string // padrão: 'cookieConsent'
  maxAgeDays: number // padrão: 365 dias
  sameSite: 'Lax' | 'Strict'
  secure: boolean // padrão: true
  path: string // padrão: '/'
}
```

## Utilitários

### `loadScript()`

```typescript
function loadScript(
  id: string,
  src: string,
  attrs?: Record<string, string>,
): void
```

**Descrição**: Carrega scripts dinamicamente com proteção contra duplicação.

### `ConsentGate`

```typescript
function ConsentGate(props: {
  category: Category
  children: React.ReactNode
}): JSX.Element | null
```

**Uso**: Renderiza filhos apenas se a categoria específica foi aceita.

```tsx
<ConsentGate category="analytics">
  <GoogleAnalytics />
</ConsentGate>
```

## Subpath Exports (Reservados)

Funcionalidades futuras planejadas:

- `react-lgpd-consent/mui` - temas e overrides prontos
- `react-lgpd-consent/utils` - utilitários isolados

## Regras Funcionais (Comportamento Fixo)

### Consentimento

- ❌ **Sem pre-check**: Categorias não essenciais desabilitadas por padrão
- ✅ **Banner não bloqueador**: A menos que o integrador force via props/CSS
- ✅ **Revogação**: `resetConsent()` e `openPreferences()` sempre disponíveis

### Acessibilidade

- ✅ Foco gerenciado no banner e modal
- ✅ Dialog com `aria-labelledby` e `aria-describedby`
- ✅ Navegação por teclado suportada

### SSR / Next.js

- ✅ `initialState` suportado (evita flash)
- ✅ Banner renderiza apenas quando `!consented`
- ✅ Sem uso de `window`/`document` durante SSR

## Política de Idiomas

### Interface do Usuário

- **Padrão**: Português brasileiro (pt-BR)
- **Customização**: Totalmente sobrescrevível via prop `texts`

### API e Código

- **Nomes de tipos/props/funções**: Inglês (padrão internacional)
- **Chaves de objetos**: Inglês
- **Documentação**: JSDoc em português brasileiro

### Exemplo de Customização

```tsx
<ConsentProvider
  texts={{
    bannerMessage: "We use cookies to enhance your experience.",
    acceptAll: "Accept All",
    declineAll: "Decline"
  }}
>
```

## Regras Técnicas

### Material-UI Integration

- ✅ Imports sempre individuais: `import Button from '@mui/material/Button'`
- ✅ Props sempre com `Readonly<T>`
- ✅ Pass-through props para componentes MUI

### Versionamento

- **0.x**: API pode ter mudanças breaking, mas seguindo este contrato
- **1.x**: API estável, apenas adições compatíveis
- **Major**: Mudanças breaking ou remoção de funcionalidades

## Garantias de Compatibilidade

Até a versão 1.0:

- ✅ Nomes de exports principais mantidos
- ✅ Interfaces públicas estáveis (apenas adições)
- ✅ Comportamento funcional consistente
- ⚠️ Implementação interna pode mudar
- ⚠️ Styling e CSS podem ser ajustados
