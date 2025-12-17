# Guia de Migração

## 🆕 v0.7.0 → v0.7.1 (16/12/2025)

### 📋 Mudanças Principais

#### ✨ **Novas Features**

1. **Google Consent Mode v2 Automático**
   - GA4 e GTM agora implementam Consent Mode v2 sem configuração manual
   - `bootstrap`: Seta consent padrão antes do carregamento
   - `onConsentUpdate`: Atualiza consent quando preferências mudam

2. **Sistema de Fila de Scripts com Prioridade**
   - Nova API `registerScript()` para registro programático
   - Scripts executam em ordem: necessary → categoria → prioridade → timestamp
   - Interface `RegisteredScript` com `priority`, `allowReload`, `onConsentUpdate`

3. **Cookie Options Modernizadas**
   - **NOVO**: `maxAge` em segundos (padrão moderno)
   - **DEPRECATED**: `maxAgeDays` (mantido por compatibilidade)
   - **NOVO**: Suporte a `sameSite: 'None'` para contextos cross-site
   - Detecção automática de HTTPS para `secure: true`
4. **Entrypoint UI-only (`@react-lgpd-consent/mui/ui`)**
   - Exporta apenas a camada MUI, sem re-exportar o core
   - Reduz ambiguidade de nomes (`ConsentProvider` headless vs. MUI) e melhora tree-shaking

#### 🔄 **Migrações Recomendadas**

**Cookie Options (Opcional, backward compatible):**

```diff
<ConsentProvider
  cookie={{
    name: 'myConsent',
-   maxAgeDays: 365,
+   maxAge: 365 * 24 * 60 * 60, // 365 dias em segundos
    sameSite: 'Lax',
    secure: true // Detectado automaticamente em HTTPS
  }}
>
```

**Google Consent Mode v2 (Automático, nenhuma mudança necessária!):**

```tsx
// Antes v0.7.1: Configuração manual complexa
function GtagConsentBootstrap() {
  React.useEffect(() => {
    gtag('consent', 'default', { analytics_storage: 'denied' })
  }, [])
}

// Depois v0.7.1: Automático!
const integrations = [
  createGoogleAnalyticsIntegration({ measurementId: 'G-XXX' })
]
<ConsentScriptLoader integrations={integrations} />
// ✅ Consent Mode v2 implementado automaticamente
```

**Registro Programático de Scripts (Nova feature):**

```tsx
import { registerScript } from 'react-lgpd-consent'

// Registre scripts fora do JSX com prioridade e callbacks
const cleanup = registerScript({
  id: 'custom-script',
  category: 'analytics',
  priority: 10, // Maior = executa primeiro
  execute: async () => {
    await loadMyScript()
  },
  onConsentUpdate: ({ consented, preferences }) => {
    if (preferences.analytics) {
      updateMyScriptConsent('granted')
    }
  }
})

// Cleanup quando componente desmontar
React.useEffect(() => cleanup, [])
```

**UI-only (reduzir bundle e evitar ambiguidade):**

```diff
-import { ConsentProvider, CookieBanner } from '@react-lgpd-consent/mui'
+import { ConsentProvider, CookieBanner } from '@react-lgpd-consent/mui/ui'
```

Precisa da lógica headless? Importe direto do `@react-lgpd-consent/core` ou use `headless.ConsentProvider` do entrypoint principal.

#### ⚠️ **Breaking Changes**

Nenhum! Todas as mudanças são backward compatible.

- `maxAgeDays` continua funcionando (mas deprecated)
- Comportamento padrão preservado
- APIs existentes mantidas

---

## v0.4.x → v0.5.0

### 📋 Visão Geral

A versão **0.5.0** introduz uma **arquitetura modular** que permite escolher entre diferentes níveis de dependência:

- **`@react-lgpd-consent/core`**: Lógica headless de consentimento (sem UI, sem Material-UI)
- **`@react-lgpd-consent/mui`**: Componentes UI completos usando Material-UI
- **`react-lgpd-consent`**: Pacote agregador (mantido para compatibilidade, inclui core + mui)

## 🎯 Motivação

### Por que a separação?

1. **Tree-shaking eficiente**: Instale apenas o que você precisa
2. **Flexibilidade de UI**: Use core com sua própria biblioteca de componentes
3. **Redução de bundle**: Core tem ~86 KB vs pacote completo ~104 KB
4. **Independência de MUI**: Core não depende do Material-UI

### Quando usar cada pacote?

| Pacote | Quando Usar | Tamanho Bundle | Dependências |
|--------|-------------|----------------|--------------|
| `@react-lgpd-consent/core` | Criar UI customizada ou usar outra biblioteca de componentes | ~86 KB | React, js-cookie, zod |
| `@react-lgpd-consent/mui` | Usar componentes prontos com Material-UI | ~104 KB (core + mui) | Core + @mui/material |
| `react-lgpd-consent` | Manter compatibilidade ou preferir pacote único | ~104 KB | Core + MUI |

## 🔄 Cenários de Migração

### Cenário 1: Usando Componentes UI (Recomendado para maioria)

**Antes (v0.4.x):**
```bash
npm install react-lgpd-consent @mui/material @emotion/react @emotion/styled
```

**Depois (v0.5.0 - Opção A: Pacote agregador):**
```bash
# Mantém compatibilidade total, sem mudanças no código
npm install react-lgpd-consent @mui/material @emotion/react @emotion/styled
```

**Depois (v0.5.0 - Opção B: Pacote MUI direto - RECOMENDADO):**
```bash
# Mesma funcionalidade, pacote mais explícito
npm install @react-lgpd-consent/mui @mui/material @emotion/react @emotion/styled
```

**Mudanças no código:**
```diff
-import { ConsentProvider, CookieBanner } from 'react-lgpd-consent'
+import { ConsentProvider, CookieBanner, FloatingPreferencesButton } from '@react-lgpd-consent/mui'

 function App() {
   return (
     <ConsentProvider categories={{ enabledCategories: ['analytics'] }}>
       <CookieBanner />
-      <PreferencesModal />
       <FloatingPreferencesButton />
+      {/* O PreferencesModal é injetado automaticamente! */}
     </ConsentProvider>
   )
 }
```

> ✨ **Novidade v0.5.0:** O `ConsentProvider` do pacote MUI automaticamente renderiza o `PreferencesModal`. Você não precisa incluí-lo manualmente!

**Customizando o modal:**
```tsx
import { ConsentProvider, PreferencesModal } from '@react-lgpd-consent/mui'

<ConsentProvider
  categories={{ enabledCategories: ['analytics'] }}
  PreferencesModalComponent={(props) => (
    <PreferencesModal {...props} hideBranding={true} />
  )}
>
  <YourApp />
</ConsentProvider>
```

### Cenário 2: Headless/UI Customizada (Novo uso)

**Antes (v0.4.x):**
```bash
# Instalava Material-UI mesmo sem usar componentes UI
npm install react-lgpd-consent @mui/material @emotion/react @emotion/styled
```

**Depois (v0.5.0 - Core apenas):**
```bash
# Zero dependências de UI!
npm install @react-lgpd-consent/core
```

**Exemplo de uso:**
```tsx
import { ConsentProvider, useConsent } from '@react-lgpd-consent/core'

// Crie seus próprios componentes UI
function CustomBanner() {
  const { acceptAll, declineAll } = useConsent()
  return (
    <div className="my-custom-banner">
      <button onClick={acceptAll}>Aceitar</button>
      <button onClick={declineAll}>Recusar</button>
    </div>
  )
}

function App() {
  return (
    <ConsentProvider categories={{ enabledCategories: ['analytics'] }}>
      <CustomBanner />
      {/* Seu app */}
    </ConsentProvider>
  )
}
```

**Alternativa: Usar ConsentProviderHeadless do MUI:**
```tsx
import { ConsentProviderHeadless, useConsent } from '@react-lgpd-consent/mui'

function App() {
  return (
    <ConsentProviderHeadless categories={{ enabledCategories: ['analytics'] }}>
      <CustomBanner />
    </ConsentProviderHeadless>
  )
}
```

### Cenário 3: NextJS App Router

**v0.5.0 - Separação clara client/server:**
```tsx
// app/providers.tsx (Client Component)
'use client'
import { ConsentProvider } from '@react-lgpd-consent/mui'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConsentProvider categories={{ enabledCategories: ['analytics'] }}>
      {children}
    </ConsentProvider>
  )
}

// app/layout.tsx (Server Component)
import { Providers } from './providers'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

## ⚠️ Breaking Changes

### 1. Remoção da prop `theme` do ConsentProvider

**Antes (v0.4.x):**
```tsx
import { createTheme } from '@mui/material/styles'

<ConsentProvider
  theme={createTheme({ palette: { mode: 'dark' } })}
  categories={{ enabledCategories: ['analytics'] }}
>
  {/* ... */}
</ConsentProvider>
```

**Depois (v0.5.0):**
```tsx
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { ConsentProvider } from '@react-lgpd-consent/mui'

<ThemeProvider theme={createTheme({ palette: { mode: 'dark' } })}>
  <ConsentProvider categories={{ enabledCategories: ['analytics'] }}>
    {/* ... */}
  </ConsentProvider>
</ThemeProvider>
```

**Razão:** Separação de responsabilidades - tema do MUI deve ser gerenciado pelo MUI.

### 2. Estrutura de Pacotes

**Antes (v0.4.x):**
```
react-lgpd-consent (tudo junto)
```

**Depois (v0.5.0):**
```
@react-lgpd-consent/core (lógica)
@react-lgpd-consent/mui (UI)
react-lgpd-consent (agregador, mantido para compatibilidade)
```

## ✅ Mantido (Sem Breaking Changes)

- ✅ Todas as APIs públicas do `useConsent`
- ✅ Props de `ConsentProvider` (exceto `theme`)
- ✅ Componentes `CookieBanner`, `PreferencesModal`, `FloatingPreferencesButton`
- ✅ Sistema de textos e templates (`TEXT_TEMPLATES`, `resolveTexts`)
- ✅ Sistema de design tokens (`designTokens`)
- ✅ Integrações (`createGoogleAnalyticsIntegration`, `createGoogleTagManagerIntegration`, etc.)
- ✅ SSR/NextJS support
- ✅ TypeScript types

## 📦 Estratégia de Migração Recomendada

### Passo 1: Avaliar Uso Atual

**Pergunta-chave:** Você usa os componentes UI da biblioteca?

- ✅ **Sim, uso `CookieBanner`, `PreferencesModal`, etc.**
  - → Migre para `@react-lgpd-consent/mui` OU mantenha `react-lgpd-consent`
  
- ❌ **Não, criei meus próprios componentes**
  - → Migre para `@react-lgpd-consent/core` (reduz bundle em ~18 KB)

### Passo 2: Escolher Estratégia

#### Estratégia A: Compatibilidade Total (Zero mudanças)
```bash
# Mantém tudo como está
npm install react-lgpd-consent@0.5.0
```
✅ Nenhuma mudança de código necessária  
✅ Funciona imediatamente  
⚠️ Instala core + mui (mesmo se não usar UI)

#### Estratégia B: Migração Gradual
```bash
# Fase 1: Instale o novo pacote ao lado do antigo
npm install @react-lgpd-consent/mui

# Fase 2: Atualize imports gradualmente
# (pode misturar imports durante transição)

# Fase 3: Remova o pacote antigo quando estiver pronto
npm uninstall react-lgpd-consent
```

#### Estratégia C: Core Apenas (Headless)
```bash
# Para quem não usa componentes UI
npm uninstall react-lgpd-consent @mui/material
npm install @react-lgpd-consent/core
```

### Passo 3: Atualizar Imports

**Buscar e substituir:**
```diff
-import { ... } from 'react-lgpd-consent'
+import { ... } from '@react-lgpd-consent/mui'  // Se usa UI
+import { ... } from '@react-lgpd-consent/core' // Se não usa UI
```

### Passo 4: Remover prop `theme` (se usava)

```diff
+import { ThemeProvider } from '@mui/material/styles'

-<ConsentProvider theme={myTheme}>
+<ThemeProvider theme={myTheme}>
+  <ConsentProvider>
     {/* ... */}
+  </ConsentProvider>
+</ThemeProvider>
-</ConsentProvider>
```

### Passo 5: Testar

```bash
# Executar type-check
npm run type-check

# Executar testes
npm test

# Executar build
npm run build
```

## 🔍 Troubleshooting

### Erro: `Cannot find module '@react-lgpd-consent/core'`

**Causa:** Tentando importar do core mas instalou `react-lgpd-consent`.

**Solução:**
```bash
npm install @react-lgpd-consent/core
# OU
npm install @react-lgpd-consent/mui
```

### Erro: `Property 'theme' does not exist on ConsentProvider`

**Causa:** Usando prop `theme` removida na v0.5.0.

**Solução:** Use `ThemeProvider` do Material-UI:
```tsx
import { ThemeProvider } from '@mui/material/styles'

<ThemeProvider theme={myTheme}>
  <ConsentProvider {...props}>
    {children}
  </ConsentProvider>
</ThemeProvider>
```

### Bundle muito grande

**Causa:** Instalou `react-lgpd-consent` mas não usa componentes UI.

**Solução:** Migre para `@react-lgpd-consent/core`:
```bash
npm uninstall react-lgpd-consent
npm install @react-lgpd-consent/core
```

### TypeScript: Import paths não resolvem

**Causa:** Paths do TypeScript podem precisar de ajuste.

**Solução:** Adicione em `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@react-lgpd-consent/core": ["./node_modules/@react-lgpd-consent/core"],
      "@react-lgpd-consent/mui": ["./node_modules/@react-lgpd-consent/mui"]
    }
  }
}
```

## 📊 Comparativo de Bundles

| Versão | Pacote | ESM | CJS | DTS |
|--------|--------|-----|-----|-----|
| 0.4.x | `react-lgpd-consent` | ~105 KB | ~110 KB | ~130 KB |
| 0.5.0 | `@react-lgpd-consent/core` | 86 KB | 89 KB | 126 KB |
| 0.5.0 | `@react-lgpd-consent/mui` | 18 KB* | 21 KB* | 12 KB* |
| 0.5.0 | `react-lgpd-consent` | 104 KB | 110 KB | 138 KB |

\* MUI pacote importa core, bundle final = core + mui (~104 KB)

## 🎓 Exemplos de Migração

### Exemplo 1: E-commerce com Material-UI

**Antes:**
```tsx
import { ConsentProvider, CookieBanner } from 'react-lgpd-consent'
import { createTheme, ThemeProvider } from '@mui/material/styles'

const theme = createTheme({ palette: { mode: 'dark' } })

function App() {
  return (
    <ConsentProvider
      theme={theme}
      categories={{ enabledCategories: ['analytics', 'marketing'] }}
    >
      <CookieBanner />
      {/* app */}
    </ConsentProvider>
  )
}
```

**Depois:**
```tsx
import { ConsentProvider, CookieBanner } from '@react-lgpd-consent/mui'
import { createTheme, ThemeProvider } from '@mui/material/styles'

const theme = createTheme({ palette: { mode: 'dark' } })

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ConsentProvider
        categories={{ enabledCategories: ['analytics', 'marketing'] }}
      >
        <CookieBanner />
        {/* app */}
      </ConsentProvider>
    </ThemeProvider>
  )
}
```

### Exemplo 2: Blog com UI customizada

**Antes:**
```tsx
import { ConsentProvider, useConsent } from 'react-lgpd-consent'
// Instalava @mui/material mesmo sem usar
```

**Depois:**
```tsx
import { ConsentProvider, useConsent } from '@react-lgpd-consent/core'
// Sem dependências de @mui/material!

function MyCustomBanner() {
  const { acceptAll, declineAll, preferences } = useConsent()
  return (
    <div className="my-banner">
      <p>Usamos cookies para analytics</p>
      <button onClick={acceptAll}>Aceitar</button>
      <button onClick={declineAll}>Recusar</button>
    </div>
  )
}
```

### Exemplo 3: Vite + React com Tailwind CSS

**Instalação:**
```bash
npm install @react-lgpd-consent/core
```

**Uso:**
```tsx
// src/main.tsx
import { ConsentProvider } from '@react-lgpd-consent/core'
import { MyCustomBanner } from './components/MyCustomBanner'

function App() {
  return (
    <ConsentProvider categories={{ enabledCategories: ['analytics', 'marketing'] }}>
      <MyCustomBanner />
      <YourApp />
    </ConsentProvider>
  )
}

// src/components/MyCustomBanner.tsx
import { useConsent } from '@react-lgpd-consent/core'

export function MyCustomBanner() {
  const { acceptAll, declineAll, consented } = useConsent()
  
  if (consented) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <p className="text-sm">
          🍪 Usamos cookies para melhorar sua experiência
        </p>
        <div className="flex gap-2">
          <button
            onClick={declineAll}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
          >
            Recusar
          </button>
          <button
            onClick={acceptAll}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  )
}
```

### Exemplo 4: NextJS 14 App Router + Material-UI

**Instalação:**
```bash
npm install @react-lgpd-consent/mui @mui/material @emotion/react @emotion/styled
```

**Estrutura:**
```tsx
// app/providers.tsx
'use client'

import { ConsentProvider } from '@react-lgpd-consent/mui'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ConsentProvider
        categories={{
          enabledCategories: ['analytics', 'marketing', 'functional'],
        }}
      >
        {children}
      </ConsentProvider>
    </ThemeProvider>
  )
}

// app/layout.tsx
import { Providers } from './providers'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

// app/page.tsx
export default function Home() {
  return <main>Seu conteúdo</main>
}
```

### Exemplo 5: Create React App com Chakra UI

**Instalação:**
```bash
npm install @react-lgpd-consent/core @chakra-ui/react @emotion/react @emotion/styled
```

**Uso:**
```tsx
// src/index.tsx
import { ChakraProvider } from '@chakra-ui/react'
import { ConsentProvider } from '@react-lgpd-consent/core'
import { CustomConsentBanner } from './components/CustomConsentBanner'

function App() {
  return (
    <ChakraProvider>
      <ConsentProvider categories={{ enabledCategories: ['analytics'] }}>
        <CustomConsentBanner />
        <YourApp />
      </ConsentProvider>
    </ChakraProvider>
  )
}

// src/components/CustomConsentBanner.tsx
import { Box, Button, Text, Flex } from '@chakra-ui/react'
import { useConsent } from '@react-lgpd-consent/core'

export function CustomConsentBanner() {
  const { acceptAll, declineAll, consented } = useConsent()

  if (consented) return null

  return (
    <Box
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      bg="gray.800"
      color="white"
      p={4}
      shadow="lg"
    >
      <Flex maxW="container.xl" mx="auto" align="center" justify="space-between">
        <Text fontSize="sm">
          🍪 Usamos cookies para análise e personalização
        </Text>
        <Flex gap={2}>
          <Button size="sm" variant="ghost" onClick={declineAll}>
            Recusar
          </Button>
          <Button size="sm" colorScheme="blue" onClick={acceptAll}>
            Aceitar
          </Button>
        </Flex>
      </Flex>
    </Box>
  )
}
```

### Exemplo 6: Remix + Material-UI

**Instalação:**
```bash
npm install @react-lgpd-consent/mui @mui/material @emotion/react @emotion/styled
```

**Uso:**
```tsx
// app/root.tsx
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react'
import { ConsentProvider, CookieBanner } from '@react-lgpd-consent/mui'
import { ThemeProvider, createTheme } from '@mui/material/styles'

const theme = createTheme()

export default function App() {
  return (
    <html lang="pt-BR">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <ConsentProvider categories={{ enabledCategories: ['analytics', 'marketing'] }}>
            <CookieBanner />
            <Outlet />
          </ConsentProvider>
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
```

## 🔌 Integrações com Analytics

### Google Analytics 4 (GA4)

```tsx
import { ConsentProvider, createGoogleAnalyticsIntegration } from '@react-lgpd-consent/core'

const ga4Integration = createGoogleAnalyticsIntegration('G-XXXXXXXXXX')

function App() {
  return (
    <ConsentProvider
      categories={{ enabledCategories: ['analytics'] }}
      integrations={[ga4Integration]}
    >
      <YourApp />
    </ConsentProvider>
  )
}
```

### Google Tag Manager

```tsx
import { ConsentProvider, createGoogleTagManagerIntegration } from '@react-lgpd-consent/core'

const gtmIntegration = createGoogleTagManagerIntegration('GTM-XXXXXXX')

function App() {
  return (
    <ConsentProvider
      categories={{ enabledCategories: ['analytics', 'marketing'] }}
      integrations={[gtmIntegration]}
    >
      <YourApp />
    </ConsentProvider>
  )
}
```

### Múltiplas Integrações

```tsx
import {
  ConsentProvider,
  createGoogleAnalyticsIntegration,
  createGoogleTagManagerIntegration,
  createUserWayIntegration,
} from '@react-lgpd-consent/core'

const integrations = [
  createGoogleAnalyticsIntegration('G-XXXXXXXXXX'),
  createGoogleTagManagerIntegration('GTM-XXXXXXX'),
  createUserWayIntegration('your-userway-account-id'),
]

function App() {
  return (
    <ConsentProvider
      categories={{
        enabledCategories: ['necessary', 'analytics', 'marketing', 'functional'],
      }}
      integrations={integrations}
    >
      <YourApp />
    </ConsentProvider>
  )
}
```

## 📚 Recursos Adicionais

- [README Principal](./README.md) - Documentação geral
- [API Reference](./packages/react-lgpd-consent/API.md) - API completa
- [Exemplos](./examples/) - Exemplos práticos
- [CHANGELOG](./packages/react-lgpd-consent/CHANGELOG.md) - Histórico de mudanças

## ❓ Perguntas Frequentes

### 1. Preciso migrar imediatamente?

**Não.** O pacote `react-lgpd-consent` continua funcionando e será mantido. Migre quando fizer sentido para seu projeto.

### 2. Posso misturar imports dos pacotes?

**Sim, temporariamente.** Durante a migração, você pode importar de `react-lgpd-consent` e `@react-lgpd-consent/mui` simultaneamente. Mas a longo prazo, escolha um.

### 3. A v0.5.0 tem novas features?

Não. A v0.5.0 é **refatoração de arquitetura** sem novas funcionalidades. O foco é modularidade e tree-shaking.

### 4. Devo usar core ou mui?

- **Use `@react-lgpd-consent/mui`** se você quer os componentes prontos
- **Use `@react-lgpd-consent/core`** se você vai criar sua própria UI

### 5. O que acontece com `react-lgpd-consent`?

Continua existindo como **pacote agregador** (importa core + mui). Mantido para compatibilidade, mas recomendamos usar os pacotes específicos.

## 🚀 Próximos Passos

Após migrar:

1. ✅ Execute `npm run type-check` e `npm test`
2. ✅ Verifique o tamanho do bundle (`npm run build`)
3. ✅ Teste em staging antes de produção
4. ✅ Atualize documentação interna do projeto
5. ✅ Considere contribuir com feedback ou issues no GitHub

---

**Precisa de ajuda?** Abra uma [issue no GitHub](https://github.com/lucianoedipo/react-lgpd-consent/issues) ou consulte a [documentação completa](./README.md).
