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

## 🧩 Categorias customizadas (customCategories)
Disponível a partir da v0.4.0.

## 🎨 Dica de estilo: Backdrop sensível ao tema

No modo bloqueante, o banner usa um backdrop para focar a atenção do usuário. Você pode controlar via design tokens:

```tsx
<ConsentProvider
  categories={{ enabledCategories: ['analytics'] }}
  designTokens={{
    layout: {
      // false: transparente | 'auto': ajusta ao tema | string: cor custom (ex.: '#00000088')
      backdrop: 'auto',
    },
    colors: {
      // Se omitido, usa o palette do tema MUI (background.paper, text.primary)
      // background: '#1e1e1e',
      // text: '#ffffff',
    },
  }}
>
  <App />
</ConsentProvider>
```

Se `colors.background` ou `colors.text` não forem fornecidos, a lib usa automaticamente `theme.palette.background.paper` e `theme.palette.text.primary` do MUI, garantindo compatibilidade com dark mode.

## 🧑‍🏫 Guia do Dev (console)

Durante o desenvolvimento, o console exibe um guia com:
- Avisos quando a configuração padrão é usada; sugestões para explicitar categorias
- Lista de categorias ativas e quais exigem toggle
- Detecção de integrações que requerem categorias, com sugestão para habilitá-las
- Boas práticas LGPD (Brasil) e alertas de UX (categorias demais)
- Silenciado automaticamente em produção; SSR-safe

Adicione categorias específicas do seu projeto (ex.: chat de suporte, players de vídeo, AB testing):

```tsx
<ConsentProvider
  categories={{
    enabledCategories: ['analytics'],
    customCategories: [
      { id: 'chat', name: 'Chat de Suporte', description: 'Widget de chat' },
      { id: 'video', name: 'Vídeo', description: 'Players incorporados' },
      { id: 'abTesting', name: 'A/B Testing', description: 'Experimentos de interface' },
    ],
  }}
>
  <App />
</ConsentProvider>
```

### Usando categorias customizadas no seu código

```tsx
import { useConsent } from 'react-lgpd-consent'

function MyComponent() {
  const { consent } = useConsent()

  // Verificar se o usuário consentiu com categorias específicas
  const canShowChat = consent?.preferences?.chat === true
  const canLoadVideos = consent?.preferences?.video === true
  const canRunABTests = consent?.preferences?.abTesting === true

  return (
    <div>
      {canShowChat && <ChatWidget />}
      {canLoadVideos && <VideoPlayer src="..." />}
      {canRunABTests && <ABTestVariant />}
    </div>
  )
}
```

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

### 🍪 Modal Personalizado com Detalhes dos Cookies

Para casos mais avançados onde você precisa exibir informações detalhadas sobre cada cookie (nome, finalidade, duração, provedor), use `getCookiesInfoForCategory` junto com `useCategories`:

```tsx
import React from 'react'
import {
  ConsentProvider,
  useCategories,
  getCookiesInfoForCategory,
  type CustomPreferencesModalProps,
  type CookieDescriptor,
} from 'react-lgpd-consent'

const ModalComDetalhesCookies: React.FC<CustomPreferencesModalProps> = ({
  preferences,
  setPreferences,
  closePreferences,
  isModalOpen,
  texts,
}) => {
  const { allCategories } = useCategories()

  if (!isModalOpen) return null

  // Simula integrações usadas no projeto (normalmente você teria isso em contexto)
  const integracoesUsadas = ['google-analytics', 'google-tag-manager', 'mixpanel']

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000,
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          maxWidth: '800px',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25)',
        }}
      >
        <h2 style={{ marginBottom: '1rem', color: '#333' }}>{texts.modalTitle}</h2>
        <p style={{ marginBottom: '2rem', color: '#666' }}>{texts.modalIntro}</p>

        {/* Lista de categorias com detalhes dos cookies */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {allCategories.map((categoria) => {
            const cookiesDetalhados: CookieDescriptor[] = getCookiesInfoForCategory(
              categoria.id as any,
              integracoesUsadas,
            )

            return (
              <div
                key={categoria.id}
                style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  backgroundColor: '#fafafa',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <input
                    type="checkbox"
                    id={`categoria-${categoria.id}`}
                    checked={preferences[categoria.id] || false}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        [categoria.id]: e.target.checked,
                      })
                    }
                    disabled={categoria.essential}
                    style={{ marginRight: '0.75rem', transform: 'scale(1.2)' }}
                  />
                  <label
                    htmlFor={`categoria-${categoria.id}`}
                    style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#333' }}
                  >
                    {categoria.name}
                    {categoria.essential && (
                      <span style={{ fontSize: '0.8rem', color: '#888', marginLeft: '0.5rem' }}>
                        (sempre ativo)
                      </span>
                    )}
                  </label>
                </div>

                <p style={{ marginBottom: '1rem', color: '#666', fontSize: '0.95rem' }}>
                  {categoria.description}
                </p>

                {/* Lista de cookies desta categoria */}
                {cookiesDetalhados.length > 0 && (
                  <details style={{ marginTop: '1rem' }}>
                    <summary
                      style={{
                        cursor: 'pointer',
                        fontWeight: '500',
                        color: '#4f46e5',
                        marginBottom: '0.5rem',
                      }}
                    >
                      Ver cookies desta categoria ({cookiesDetalhados.length})
                    </summary>
                    <div style={{ marginTop: '0.75rem', paddingLeft: '1rem' }}>
                      {cookiesDetalhados.map((cookie, index) => (
                        <div
                          key={`${cookie.name}-${index}`}
                          style={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e5e5',
                            borderRadius: '6px',
                            padding: '1rem',
                            marginBottom: '0.75rem',
                          }}
                        >
                          <h4
                            style={{ margin: '0 0 0.5rem 0', color: '#333', fontSize: '0.95rem' }}
                          >
                            <code
                              style={{
                                backgroundColor: '#f3f4f6',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontFamily: 'monospace',
                              }}
                            >
                              {cookie.name}
                            </code>
                          </h4>
                          {cookie.purpose && (
                            <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#555' }}>
                              <strong>Finalidade:</strong> {cookie.purpose}
                            </p>
                          )}
                          {cookie.duration && (
                            <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#555' }}>
                              <strong>Duração:</strong> {cookie.duration}
                            </p>
                          )}
                          {cookie.provider && (
                            <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#555' }}>
                              <strong>Provedor:</strong> {cookie.provider}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </details>
                )}

                {/* Fallback para categorias sem cookies catalogados */}
                {cookiesDetalhados.length === 0 &&
                  categoria.cookies &&
                  categoria.cookies.length > 0 && (
                    <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
                      <strong>Padrões de cookies:</strong>{' '}
                      {categoria.cookies.map((pattern, i) => (
                        <code
                          key={i}
                          style={{
                            backgroundColor: '#f3f4f6',
                            padding: '2px 4px',
                            borderRadius: '3px',
                            marginRight: '0.5rem',
                            fontFamily: 'monospace',
                            fontSize: '0.8rem',
                          }}
                        >
                          {pattern}
                        </code>
                      ))}
                    </div>
                  )}
              </div>
            )
          })}
        </div>

        {/* Botões de ação */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end',
            marginTop: '2rem',
            paddingTop: '1rem',
            borderTop: '1px solid #e0e0e0',
          }}
        >
          <button
            onClick={closePreferences}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.95rem',
            }}
          >
            Cancelar
          </button>
          <button
            onClick={closePreferences}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.95rem',
            }}
          >
            {texts.save}
          </button>
        </div>
      </div>
    </div>
  )
}

function AppComModalAvancado() {
  return (
    <ConsentProvider
      categories={{
        enabledCategories: ['analytics', 'marketing', 'functional'],
      }}
      PreferencesModalComponent={ModalComDetalhesCookies}
      // Especifique as integrações para obter informações detalhadas dos cookies
      scriptIntegrations={[
        { id: 'google-analytics', config: { measurementId: 'GA_MEASUREMENT_ID' } },
        { id: 'google-tag-manager', config: { containerId: 'GTM-XXXXXXX' } },
        { id: 'mixpanel', config: { token: 'MIXPANEL_TOKEN' } },
      ]}
    >
      <main>Minha App com Modal Avançado</main>
    </ConsentProvider>
  )
}
```

#### 🔧 APIs Utilizadas no Exemplo Avançado

- **`useCategories()`**: Hook que retorna informações sobre todas as categorias ativas
- **`getCookiesInfoForCategory(categoryId, integrations)`**: Função que retorna detalhes completos dos cookies
- **`CookieDescriptor`**: Interface TypeScript com `name`, `purpose`, `duration`, `provider`

#### 💡 Principais Funcionalidades

1. **Informações Detalhadas**: Cada cookie mostra nome, finalidade, duração e provedor
2. **Organização por Categoria**: Cookies agrupados logicamente
3. **Interface Expansível**: Detalhes dos cookies ficam em `<details>` expansível
4. **Fallback Inteligente**: Mostra padrões básicos quando detalhes não estão disponíveis
5. **Acessibilidade**: Labels apropriados e navegação por teclado
6. **Design Responsivo**: Layout que se adapta a diferentes tamanhos de tela

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
