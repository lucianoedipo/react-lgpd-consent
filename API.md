# Guia da API - react-lgpd-consent

Este documento é a referência técnica oficial para a API da biblioteca `react-lgpd-consent` (v0.3.3+).

## Exports Principais

| Nome                                | Tipo       | Descrição                                                                       |
| ----------------------------------- | ---------- | ------------------------------------------------------------------------------- |
| `ConsentProvider`                   | Componente | O provedor de contexto principal que gerencia todo o estado e a UI.             |
| `useConsent`                        | Hook       | Hook principal para interagir com o estado de consentimento.                    |
| `useCategories`                     | Hook       | Retorna a lista de categorias ativas no projeto.                                |
| `useCategoryStatus`                 | Hook       | Verifica o status de uma categoria específica.                                  |
| `useOpenPreferencesModal`           | Hook       | Retorna uma função para abrir o modal de preferências de forma programática.    |
| `openPreferencesModal`              | Função     | Versão da função acima para ser usada fora do contexto React.                   |
| `ConsentGate`                       | Componente | Renderiza componentes filhos apenas se uma categoria de cookie for consentida.  |
| `ConsentScriptLoader`               | Componente | Carrega scripts de terceiros (como Google Analytics) com base no consentimento. |
| `createGoogleAnalyticsIntegration`  | Função     | Factory para integração nativa com o Google Analytics.                           |
| `createGoogleTagManagerIntegration` | Função     | Factory para integração nativa com o Google Tag Manager.                         |
| `createUserWayIntegration`          | Função     | Factory para integração nativa com o UserWay.                                    |
| `createFacebookPixelIntegration`    | Função     | (v0.4.1) Integração nativa com Facebook Pixel.                                   |
| `createHotjarIntegration`           | Função     | (v0.4.1) Integração nativa com Hotjar.                                           |
| `createMixpanelIntegration`         | Função     | (v0.4.1) Integração nativa com Mixpanel.                                         |
| `createClarityIntegration`          | Função     | (v0.4.1) Integração nativa com Microsoft Clarity.                                |
| `createIntercomIntegration`         | Função     | (v0.4.1) Integração nativa com Intercom (chat).                                  |
| `createZendeskChatIntegration`      | Função     | (v0.4.1) Integração nativa com Zendesk Chat.                                     |
| `suggestCategoryForScript`          | Função     | (v0.4.1) Sugere categoria(s) LGPD para um script conhecido.                      |
| `createECommerceIntegrations`       | Função     | (v0.4.1) Cria integrações comuns para e-commerce.                                |
| `createSaaSIntegrations`            | Função     | (v0.4.1) Cria integrações comuns para SaaS.                                      |
| `createCorporateIntegrations`       | Função     | (v0.4.1) Cria integrações comuns para ambientes corporativos.                    |
| `INTEGRATION_TEMPLATES`             | Constante  | (v0.4.1) Presets com IDs essenciais/opcionais e categorias por tipo de negócio.  |
| `setDebugLogging`                   | Função     | Habilita/desabilita o logging de debug da biblioteca.                           |

---

## Componentes

### `<ConsentProvider />`

O componente principal que deve envolver sua aplicação. Ele gerencia o estado, renderiza a UI (banner, modal) e fornece o contexto para os hooks.

**Props Mínimas:**

```tsx
import { ConsentProvider } from 'react-lgpd-consent'

function App() {
  return (
    <ConsentProvider
      categories={{
        // Especifique apenas as categorias que seu site utiliza
        enabledCategories: ['analytics', 'marketing'],
      }}
    >
      {/* Seu aplicativo aqui */}
    </ConsentProvider>
  )
}
```

**Todas as Props:**

| Prop                               | Tipo                                               | Descrição                                                                                                          |
| ---------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `categories`                       | `ProjectCategoriesConfig`                          | **Obrigatório**. Define as categorias de cookies ativas no seu projeto.                                            |
| `texts`                            | `Partial<ConsentTexts>`                            | Objeto com textos customizados para a UI (banner, modal, etc.).                                                    |
| `onConsentGiven`                   | `(state: ConsentState) => void`                    | Callback executado na primeira vez que o usuário dá o consentimento.                                               |
| `onPreferencesSaved`               | `(prefs: ConsentPreferences) => void`              | Callback executado sempre que o usuário salva novas preferências no modal.                                         |
| `blocking`                         | `boolean`                                          | Se `true`, exibe um overlay que impede a interação com o site até que o usuário tome uma decisão. Padrão: `false`. |
| `blockingStrategy`                 | `'auto'                                            | 'provider'                                                                                                         | 'component'` | Estratégia de bloqueio quando `blocking` estiver ativo. `'auto'` (padrão) mantém o comportamento atual (banner padrão bloqueia; custom decide). `'provider'` cria overlay de bloqueio no Provider (opt‑in). `'component'` delega bloqueio ao banner. Veja a seção "Bloqueio (opt-in) e integração com dark-filter" no `README.md` para exemplos e recomendações de A11y. |
| `disableDeveloperGuidance`         | `boolean`                                          | Se `true`, desativa as mensagens de orientação no console, mesmo em ambiente de desenvolvimento.                   |
| `disableFloatingPreferencesButton` | `boolean`                                          | Se `true`, desabilita o botão flutuante que permite ao usuário reabrir o modal de preferências. Padrão: `false`.   |
| `hideBranding`                     | `boolean`                                          | Se `true`, oculta a marca "fornecido por LÉdipO.eti.br" dos componentes.                                           |
| `cookie`                           | `Partial<ConsentCookieOptions>`                    | Permite customizar as opções do cookie (nome, tempo de expiração, etc.).                                           |
| `CookieBannerComponent`            | `React.ComponentType<CustomCookieBannerProps>`     | Permite substituir o banner padrão por um componente React customizado.                                            |
| `PreferencesModalComponent`        | `React.ComponentType<CustomPreferencesModalProps>` | Permite substituir o modal de preferências padrão por um componente React customizado.                             |
| `theme`                            | `any` (Tema MUI)                                   | Permite passar um tema customizado do Material-UI para os componentes da biblioteca.                               |
| `initialState`                     | `ConsentState`                                     | Estado inicial para hidratação em cenários de Server-Side Rendering (SSR) para evitar o "flash" do banner.         |

### `designTokens.layout.backdrop`

O token `designTokens.layout.backdrop` agora aceita `boolean | string`:

- `false`: indica que não haverá escurecimento visível; o overlay pode ainda bloquear cliques (útil quando a aplicação já fornece um dark-filter visual próprio).
- `string`: qualquer valor CSS válido de cor (ex.: `'rgba(0,0,0,0.4)'`) será usado como cor do backdrop.
- quando ausente, a biblioteca utiliza um fallback seguro `'rgba(0, 0, 0, 0.4)'`.

Consulte `types/DesignTokens` para a tipagem completa.

---

### `<ConsentGate />`

Renderiza componentes filhos apenas se o usuário deu consentimento para uma categoria específica.

```tsx
import { ConsentGate } from 'react-lgpd-consent'

function MyComponent() {
  return (
    <ConsentGate category="marketing">
      {/* Este componente só será renderizado se o usuário consentiu com cookies de marketing */}
      <FacebookPixelScript />
    </ConsentGate>
  )
}
```

### `<ConsentScriptLoader />`

Gerencia o carregamento de scripts de terceiros (ex: Google Analytics) com base no consentimento do usuário. Veja o guia `INTEGRACOES.md` para mais detalhes.

```tsx
import { ConsentScriptLoader, createGoogleAnalyticsIntegration } from 'react-lgpd-consent'

const integrations = [createGoogleAnalyticsIntegration({ measurementId: 'G-XXXXXXXXXX' })]

;<ConsentScriptLoader integrations={integrations} />
```

---

## Hooks

### `useConsent()`

O hook principal para interagir com o estado de consentimento.

**Retorno:**

| Chave             | Tipo                                  | Descrição                                                                                |
| ----------------- | ------------------------------------- | ---------------------------------------------------------------------------------------- |
| `consented`       | `boolean`                             | `true` se o usuário já interagiu com o banner/modal.                                     |
| `preferences`     | `ConsentPreferences`                  | Um objeto com o estado de consentimento para cada categoria (ex: `{ analytics: true }`). |
| `isModalOpen`     | `boolean`                             | `true` se o modal de preferências estiver aberto.                                        |
| `acceptAll`       | `() => void`                          | Aceita todas as categorias de cookies.                                                   |
| `rejectAll`       | `() => void`                          | Rejeita todas as categorias não essenciais.                                              |
| `setPreferences`  | `(prefs: ConsentPreferences) => void` | Salva um novo conjunto de preferências.                                                  |
| `openPreferences` | `() => void`                          | Abre o modal de preferências.                                                            |
| `resetConsent`    | `() => void`                          | Reseta o consentimento, fazendo o banner aparecer novamente.                             |

### `useCategories()`

Retorna um array com as definições de todas as categorias ativas no projeto. Útil para construir UIs de preferência customizadas.

### `useCategoryStatus()`

Verifica se uma categoria específica está ativa e consentida.

```tsx
const analyticsStatus = useCategoryStatus('analytics')
// Retorna um objeto: { isActive: boolean, isEssential: boolean, ... }

if (analyticsStatus.isActive && preferences.analytics) {
  // ...
}
```

### `useOpenPreferencesModal()` e `openPreferencesModal()`

Permitem abrir o modal de preferências de forma programática, seja de dentro de um componente React (`useOpenPreferencesModal`) ou de um script JavaScript comum (`openPreferencesModal`).

```tsx
// Em um componente React
const openModal = useOpenPreferencesModal()
return <button onClick={openModal}>Abrir Preferências</button>

// Em JavaScript puro
document.getElementById('meu-botao').addEventListener('click', openPreferencesModal)
```

---

## 🎨 Guia de Customização Avançada

A biblioteca foi projetada para ser flexível. Aqui estão as duas principais formas de customização:

### 1. Customização de Estilo com a Prop `theme`

Se você já usa Material-UI, pode passar seu próprio objeto de tema para a prop `theme` do `ConsentProvider`. Os componentes internos da biblioteca (banner, modal) herdarão suas definições de cores, tipografia, bordas, etc.

````tsx
import { ConsentProvider } from 'react-lgpd-consent';

> Nota importante sobre temas MUI
>
> A partir da versão 0.3.5 a biblioteca NÃO cria um `ThemeProvider` global automaticamente. O `ConsentProvider` foi refatorado para herdar o tema do aplicativo quando um `ThemeProvider` do MUI estiver presente. Se precisar de um fallback explícito, use `createDefaultConsentTheme()`:
>
> ```tsx
> import { ConsentProvider, createDefaultConsentTheme } from 'react-lgpd-consent'
>
> <ConsentProvider theme={createDefaultConsentTheme()} categories={{ enabledCategories: ['analytics'] }}>
>   <App />
> </ConsentProvider>
> ```
>
> Há também um getter compatível `defaultConsentTheme()` (deprecated) que retorna uma nova instância quando chamada — evite importar um tema já instanciado no nível do módulo para prevenir side-effects em SSR.

import { createTheme, ThemeProvider } from '@mui/material/styles';

// 1. Crie seu tema customizado
const meuTema = createTheme({
  palette: {
    primary: {
      main: '#673ab7', // Roxo
    },
    background: {
      paper: '#f3e5f5', // Um roxo bem claro para o fundo do banner
    },
  },
  typography: {
    fontFamily: ''Georgia', serif',
  },
});

function App() {
  return (
    // 2. Passe o tema para o ThemeProvider do MUI
    <ThemeProvider theme={meuTema}>
      {/* 3. Passe o mesmo tema para o ConsentProvider */}
      <ConsentProvider
        categories={{ enabledCategories: ['analytics'] }}
        theme={meuTema}
      >
        <SuaAplicacao />
      </ConsentProvider>
    </ThemeProvider>
  );
}
````

### 2. Substituição Completa da UI

Para controle total, você pode substituir os componentes padrão da biblioteca pelos seus.

Use as props `CookieBannerComponent` e `PreferencesModalComponent` para passar seus próprios componentes. A biblioteca cuidará da lógica de quando exibi-los e passará todas as props necessárias para que eles funcionem.

**Exemplo: Criando um Banner Totalmente Customizado**

```tsx
import { ConsentProvider, type CustomCookieBannerProps } from 'react-lgpd-consent'

// 1. Crie seu componente de banner. Ele receberá as props definidas em CustomCookieBannerProps.
function MeuBannerCustomizado({
  acceptAll,
  rejectAll,
  openPreferences,
  texts,
}: CustomCookieBannerProps) {
  // Estilos CSS-in-JS ou classes CSS normais
  const style = {
    position: 'fixed',
    bottom: '20px',
    left: '20px',
    backgroundColor: '#222',
    color: 'white',
    padding: '15px',
    borderRadius: '8px',
    zIndex: 1000,
  }

  return (
    <div style={style}>
      <h4>{texts.modalTitle}</h4>
      <p>{texts.bannerMessage}</p>
      <div>
        <button onClick={acceptAll}>✅ {texts.acceptAll}</button>
        <button onClick={rejectAll} style={{ marginLeft: '10px' }}>
          ❌ {texts.declineAll}
        </button>
        <button onClick={openPreferences} style={{ marginLeft: '10px' }}>
          ⚙️ {texts.preferences}
        </button>
      </div>
    </div>
  )
}

function App() {
  return (
    <ConsentProvider
      categories={{ enabledCategories: ['analytics'] }}
      // 2. Passe seu componente para a prop correspondente
      CookieBannerComponent={MeuBannerCustomizado}
    >
      <SuaAplicacao />
    </ConsentProvider>
  )
}
```

---

## Tipos Principais

Para customizações avançadas e tipagem, você pode importar os seguintes tipos:

- `ConsentProviderProps`
- `CustomCookieBannerProps`
- `CustomPreferencesModalProps`
- `ConsentState`
- `ConsentPreferences`
- `ConsentTexts`
- `Category`
