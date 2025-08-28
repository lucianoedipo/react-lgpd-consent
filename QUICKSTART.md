# 🚀 Guia de Início Rápido

Este guia fornece tudo o que você precisa para integrar rapidamente a biblioteca `react-lgpd-consent` em seu projeto React.

## 📦 Instalação

```bash
npm install react-lgpd-consent
# ou
yarn add react-lgpd-consent
```

### Dependências Peer

```bash
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
```

## 🎯 Uso Básico (30 segundos)

````tsx
import React from 'react'
import { ConsentProvider } from 'react-lgpd-consent'

function App() {
  return (
    <ConsentProvider
      categories={{
        enabledCategories: ['analytics', 'marketing'],
      }}
    >
      <main>
        <h1>Minha Aplicação</h1>
        {/* Seu conteúdo aqui */}
      </main>
    </ConsentProvider>
  )

## 🧭 Storybook — quick note

This repository ships an interactive Storybook playground used for manual testing and visual exploration of components. Quick commands:

- Run locally (development):

```bash
npm run storybook
````

- Build static Storybook (for publishing to GitHub Pages):

```bash
npm run build-storybook
```

Notes:

- The Storybook preview (`.storybook/preview.tsx`) applies a clean environment between stories (removes consent cookie and performs defensive DOM cleanup). Check that file when creating stories that rely on a clean initial state.

}

export default App

````

## 📋 Tabela Completa de Props do ConsentProvider

| Prop                                 | Tipo                                                        | Obrigatória | Padrão              | Descrição                                      |
| ------------------------------------ | ----------------------------------------------------------- | ----------- | ------------------- | ---------------------------------------------- |
| `categories`                         | `ProjectCategoriesConfig`                                   | ✅ **Sim**  | -                   | Define as categorias de cookies do projeto     |
| `texts`                              | `Partial<ConsentTexts>`                                     | ❌ Não      | Textos padrão PT-BR | Customiza textos da interface                  |
| `theme`                              | `any`                                                       | ❌ Não      | Tema padrão         | Tema Material-UI para os componentes           |
| `designTokens`                       | `DesignTokens`                                              | ❌ Não      | Tokens padrão       | Tokens de design para customização avançada    |
| `blocking`                           | `boolean`                                                   | ❌ Não      | `false`             | Exibe overlay bloqueando interação até decisão |
| `blockingStrategy`                   | `'auto' \| 'provider'`                                      | ❌ Não      | `'auto'`            | Estratégia de renderização do overlay          |
| `hideBranding`                       | `boolean`                                                   | ❌ Não      | `false`             | Oculta branding "fornecido por"                |
| `onConsentGiven`                     | `(state: ConsentState) => void`                             | ❌ Não      | -                   | Callback na primeira vez que usuário consente  |
| `onPreferencesSaved`                 | `(prefs: ConsentPreferences) => void`                       | ❌ Não      | -                   | Callback quando preferências são salvas        |
| `disableDeveloperGuidance`           | `boolean`                                                   | ❌ Não      | `false`             | Desativa orientações no console                |
| `disableFloatingPreferencesButton`   | `boolean`                                                   | ❌ Não      | `false`             | Desabilita botão flutuante de preferências     |
| `CookieBannerComponent`              | `React.ComponentType<CustomCookieBannerProps>`              | ❌ Não      | Banner padrão       | Componente de banner customizado               |
| `PreferencesModalComponent`          | `React.ComponentType<CustomPreferencesModalProps>`          | ❌ Não      | Modal padrão        | Componente de modal customizado                |
| `FloatingPreferencesButtonComponent` | `React.ComponentType<CustomFloatingPreferencesButtonProps>` | ❌ Não      | Botão padrão        | Componente de botão flutuante customizado      |
| `cookieBannerProps`                  | `object`                                                    | ❌ Não      | `{}`                | Props adicionais para o banner                 |
| `preferencesModalProps`              | `object`                                                    | ❌ Não      | `{}`                | Props adicionais para o modal                  |
| `floatingPreferencesButtonProps`     | `object`                                                    | ❌ Não      | `{}`                | Props adicionais para o botão flutuante        |
| `initialState`                       | `ConsentState`                                              | ❌ Não      | -                   | Estado inicial para hidratação SSR             |
| `cookie`                             | `Partial<ConsentCookieOptions>`                             | ❌ Não      | Opções padrão       | Configurações do cookie de consentimento       |

## 🎨 Componentes Customizados com TypeScript

### Banner Personalizado

```tsx
import React from 'react'
import { ConsentProvider, type CustomCookieBannerProps } from 'react-lgpd-consent'

// Componente de banner customizado
const MeuBannerCustomizado: React.FC<CustomCookieBannerProps> = ({
  consented,
  acceptAll,
  rejectAll,
  openPreferences,
  texts,
  blocking,
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: blocking ? 'red' : 'blue',
        color: 'white',
        padding: '1rem',
        zIndex: 1000,
      }}
    >
      <p>{texts.bannerMessage}</p>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button onClick={acceptAll}>{texts.acceptAll}</button>
        <button onClick={rejectAll}>{texts.declineAll}</button>
        <button onClick={openPreferences}>{texts.preferences}</button>
      </div>
    </div>
  )
}

// Usando o banner customizado
function App() {
  return (
    <ConsentProvider
      categories={{ enabledCategories: ['analytics'] }}
      CookieBannerComponent={MeuBannerCustomizado}
      blocking={true}
    >
      <main>Minha App</main>
    </ConsentProvider>
  )
}
````

### Modal de Preferências Personalizado

---

## Nota sobre ThemeProvider

A biblioteca `react-lgpd-consent` não injeta um `ThemeProvider` global por conta própria. Ela foi projetada para herdar o tema do app quando um `ThemeProvider` do MUI está presente. Se você precisa garantir um tema de fallback apenas para os componentes da biblioteca, use a fábrica exportada `createDefaultConsentTheme()` e passe pelo prop `theme` do `ConsentProvider`:

```tsx
import { ConsentProvider, createDefaultConsentTheme } from 'react-lgpd-consent'

;<ConsentProvider
  theme={createDefaultConsentTheme()}
  categories={{ enabledCategories: ['analytics'] }}
>
  <App />
</ConsentProvider>
```

Isso evita alterações indesejadas no contexto do MUI do seu app e problemas de SSR.

```tsx
import React from 'react'
import { ConsentProvider, type CustomPreferencesModalProps } from 'react-lgpd-consent'

const MeuModalCustomizado: React.FC<CustomPreferencesModalProps> = ({
  preferences,
  setPreferences,
  closePreferences,
  isModalOpen,
  texts,
}) => {
  if (!isModalOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        border: '2px solid #ccc',
        borderRadius: '8px',
        padding: '2rem',
        zIndex: 2000,
        minWidth: '400px',
      }}
    >
      <h2>{texts.modalTitle}</h2>
      <p>{texts.modalIntro}</p>

      {/* Lista de categorias */}
      <div style={{ margin: '1rem 0' }}>
        {Object.entries(preferences).map(([category, enabled]) => (
          <label key={category} style={{ display: 'block', marginBottom: '0.5rem' }}>
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  [category]: e.target.checked,
                })
              }
              disabled={category === 'necessary'}
            />{' '}
            {category === 'necessary' ? texts.necessaryAlwaysOn : `Cookies ${category}`}
          </label>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
        <button onClick={closePreferences}>Cancelar</button>
        <button onClick={closePreferences}>{texts.save}</button>
      </div>
    </div>
  )
}

function App() {
  return (
    <ConsentProvider
      categories={{ enabledCategories: ['analytics', 'marketing'] }}
      PreferencesModalComponent={MeuModalCustomizado}
    >
      <main>Minha App</main>
    </ConsentProvider>
  )
}
```

## 🎮 Controle Programático

### Hook useOpenPreferencesModal (React)

```tsx
import React from 'react'
import { useOpenPreferencesModal, useConsent } from 'react-lgpd-consent'

function MeuComponente() {
  const openPreferences = useOpenPreferencesModal()
  const { preferences, acceptAll, rejectAll } = useConsent()

  return (
    <div>
      <h3>Status atual: {preferences.analytics ? 'Analytics ativo' : 'Analytics inativo'}</h3>

      <button onClick={openPreferences}>⚙️ Gerenciar Preferências</button>

      <button onClick={acceptAll}>✅ Aceitar Todos</button>

      <button onClick={rejectAll}>❌ Recusar Todos</button>
    </div>
  )
}
```

### window.openPreferencesModal (JavaScript Puro)

```html
<!-- Em templates HTML, emails ou widgets externos -->
<button onclick="window.openPreferencesModal?.()">Configurar Cookies</button>

<script>
  // Ou em JavaScript puro
  function abrirConfiguracoesCookies() {
    if (window.openPreferencesModal) {
      window.openPreferencesModal()
    } else {
      console.warn('Sistema de consentimento não carregado')
    }
  }

  // Verificar se função está disponível
  if (typeof window.openPreferencesModal === 'function') {
    console.log('✅ Sistema de consentimento disponível')
  }
</script>
```

## 🐛 Sistema de Debug

### Configuração de Debug

```tsx
import { setDebugLogging, LogLevel } from 'react-lgpd-consent'

// Ativar todos os logs (desenvolvimento)
setDebugLogging(true, LogLevel.DEBUG)

// Apenas logs importantes (staging)
setDebugLogging(true, LogLevel.INFO)

// Apenas erros (produção)
setDebugLogging(true, LogLevel.ERROR)

// Desativar completamente
setDebugLogging(false)
```

### Exemplo de Logs no Console

```jsx
// Em desenvolvimento, você verá logs como:
// [🍪 LGPD-CONSENT] 🔧 Categorias Ativas (para UI customizada)
// [🍪 LGPD-CONSENT] ℹ️ User accepted all cookies
// [🍪 LGPD-CONSENT] 🐛 Category preference changed: analytics = true
```

### Hook para Debug Runtime

```tsx
import { useConsent } from 'react-lgpd-consent'

function DebugPanel() {
  const { preferences, consented } = useConsent()

  // Apenas mostrar em desenvolvimento
  if (process.env.NODE_ENV !== 'development') return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '1rem',
        fontSize: '12px',
        fontFamily: 'monospace',
      }}
    >
      <h4>🍪 Debug LGPD</h4>
      <p>Consentimento: {consented ? '✅' : '❌'}</p>
      <pre>{JSON.stringify(preferences, null, 2)}</pre>
    </div>
  )
}
```

## 🎨 Integração com Material-UI ThemeProvider

### Configuração Completa

```tsx
import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { ConsentProvider } from 'react-lgpd-consent'

// Seu tema personalizado
const meuTema = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
})

// Tema específico para componentes de consentimento (opcional)
const temaConsentimento = createTheme({
  ...meuTema,
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={meuTema}>
      <CssBaseline />
      <ConsentProvider
        categories={{
          enabledCategories: ['analytics', 'marketing', 'advertising'],
        }}
        theme={temaConsentimento} // Tema específico para consentimento
        texts={{
          bannerMessage: 'Utilizamos cookies para personalizar sua experiência.',
          acceptAll: 'Aceitar Todos',
          declineAll: 'Apenas Necessários',
          preferences: 'Personalizar',
        }}
        onConsentGiven={(state) => {
          console.log('✅ Consentimento dado:', state.preferences)
        }}
      >
        <main>
          <h1>Minha Aplicação com Material-UI</h1>
          {/* Seus componentes aqui */}
        </main>
      </ConsentProvider>
    </ThemeProvider>
  )
}

export default App
```

## 🔧 Configurações Avançadas

### Personalização de Design Tokens

```tsx
import { ConsentProvider, type DesignTokens } from 'react-lgpd-consent'

const meusTokens: DesignTokens = {
  colors: {
    primary: '#6366f1',
    secondary: '#f59e0b',
    background: '#ffffff',
    text: '#1f2937',
    border: '#e5e7eb',
  },
  layout: {
    borderRadius: '12px',
    spacing: '1rem',
    backdrop: 'rgba(0, 0, 0, 0.6)', // ou false para transparente
  },
  typography: {
    fontFamily: '"Inter", system-ui, sans-serif',
    fontSize: '14px',
    fontWeight: '500',
  },
}

function App() {
  return (
    <ConsentProvider
      categories={{ enabledCategories: ['analytics'] }}
      designTokens={meusTokens}
      blocking={true}
      blockingStrategy="provider"
    >
      <main>Minha App</main>
    </ConsentProvider>
  )
}
```

### Configuração de Cookie Personalizada

```tsx
import { ConsentProvider } from 'react-lgpd-consent'

function App() {
  return (
    <ConsentProvider
      categories={{ enabledCategories: ['analytics'] }}
      cookie={{
        name: 'meu_app_consent', // Nome customizado
        maxAge: 365 * 24 * 60 * 60, // 1 ano em segundos
        domain: '.meudominio.com.br', // Cookie compartilhado entre subdomínios
        secure: true, // Apenas HTTPS
        sameSite: 'Lax', // Política SameSite
      }}
    >
      <main>Minha App</main>
    </ConsentProvider>
  )
}
```

## 🚀 Casos de Uso Comuns

### 1. E-commerce com Analytics + Marketing

```tsx
<ConsentProvider
  categories={{
    enabledCategories: ['analytics', 'marketing', 'advertising'],
  }}
  texts={{
    bannerMessage:
      'Usamos cookies para melhorar sua experiência de compra e exibir ofertas personalizadas.',
    acceptAll: 'Aceitar e continuar',
    declineAll: 'Apenas essenciais',
  }}
  onConsentGiven={(state) => {
    // Inicializar ferramentas baseado no consentimento
    if (state.preferences.analytics) {
      // gtag('config', 'GA_MEASUREMENT_ID')
    }
    if (state.preferences.marketing) {
      // fbq('init', 'FACEBOOK_PIXEL_ID')
    }
  }}
>
  {/* Sua loja */}
</ConsentProvider>
```

### 2. Blog/Site Institucional Simples

```tsx
<ConsentProvider
  categories={{
    enabledCategories: ['analytics'],
  }}
  disableFloatingPreferencesButton={false}
  hideBranding={true}
>
  {/* Seu conteúdo */}
</ConsentProvider>
```

### 3. Aplicação Corporativa com Controle Rigoroso

```tsx
<ConsentProvider
  categories={{
    enabledCategories: ['analytics', 'functional'],
  }}
  blocking={true}
  blockingStrategy="provider"
  disableDeveloperGuidance={false}
  onPreferencesSaved={(prefs) => {
    // Log de auditoria
    console.log('Audit: User preferences updated', prefs)
  }}
>
  {/* Sua app corporativa */}
</ConsentProvider>
```

## 🆘 Solução de Problemas Comuns

### "ConsentProvider must be used within ConsentProvider"

```tsx
// ❌ Errado - hook usado fora do provider
function MeuComponente() {
  const { preferences } = useConsent() // Erro!
  return <div>...</div>
}

function App() {
  return (
    <div>
      <MeuComponente /> {/* useConsent usado aqui falhará */}
      <ConsentProvider categories={{ enabledCategories: ['analytics'] }}>
        <main>App</main>
      </ConsentProvider>
    </div>
  )
}

// ✅ Correto - hook usado dentro do provider
function App() {
  return (
    <ConsentProvider categories={{ enabledCategories: ['analytics'] }}>
      <div>
        <MeuComponente /> {/* Agora funciona */}
        <main>App</main>
      </div>
    </ConsentProvider>
  )
}
```

### Banner não aparece

1. Verificar se não há consentimento salvo no cookie:

```js
// Limpar cookie para teste
document.cookie = 'cookieConsent=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
```

2. Verificar se `hideBranding` e outras configs estão corretas
3. Conferir se o `z-index` não está sendo sobrescrito por outros elementos

### TypeScript - tipos não encontrados

```ts
// Se você tiver problemas com tipos, adicione ao tsconfig.json:
{
  "compilerOptions": {
    "moduleResolution": "bundler", // ou "node"
    "skipLibCheck": true
  }
}
```

## 📚 Próximos Passos

- 📖 [Documentação Completa da API](./API.md)
- 🏗️ [Guia de Conformidade LGPD](./CONFORMIDADE.md)
- 🔌 [Integrações Nativas](./INTEGRACOES.md)
- 🧪 [Executar o Exemplo](./example/)

---

💡 **Dica**: Use `setDebugLogging(true, LogLevel.DEBUG)` durante o desenvolvimento para ver logs detalhados do comportamento da biblioteca.
