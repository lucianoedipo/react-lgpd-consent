# API v0.3.1 - Guia de Uso com Componentes Customizados

## Problemas Corrigidos na v0.3.1

### 1. Compatibilidade com ThemeProvider

✅ **Corrigido**: Componentes internos agora possuem fallbacks seguros para propriedades de tema
✅ **Corrigido**: Erro "Cannot read properties of undefined (reading 'duration')" no MUI Dialog

### 2. API do FloatingPreferencesButton

✅ **Adicionado**: `disableFloatingPreferencesButton` prop no ConsentProvider  
✅ **Adicionado**: `useOpenPreferencesModal()` hook para controle programático  
✅ **Adicionado**: `openPreferencesModal()` função para uso fora do React  
✅ **Corrigido**: Erro "Element type is invalid" em FloatingPreferencesButton

### 3. Exports de TypeScript

✅ **Adicionado**: `CustomCookieBannerProps` export  
✅ **Adicionado**: `CustomPreferencesModalProps` export  
✅ **Adicionado**: `CustomFloatingPreferencesButtonProps` export  
✅ **Adicionado**: `ConsentProviderProps` export

### 4. Sistema de Debug

✅ **Adicionado**: Sistema de logging para troubleshooting  
✅ **Adicionado**: `setDebugLogging()` para ativar logs em produção

## Exemplos de Uso

### Básico com Material-UI e Componentes Customizados

```tsx
import { ThemeProvider, createTheme } from '@mui/material/styles'
import {
  ConsentProvider,
  useConsent,
  useOpenPreferencesModal,
  type CustomCookieBannerProps,
  type CustomPreferencesModalProps,
  type ConsentProviderProps,
} from 'react-lgpd-consent'

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
  },
})

// Componente de banner customizado
function CustomCookieBanner({
  consented,
  acceptAll,
  rejectAll,
  openPreferences,
  texts,
}: CustomCookieBannerProps) {
  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, p: 2 }}>
      <Typography>{texts.bannerMessage}</Typography>
      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
        <Button onClick={acceptAll} variant="contained">
          {texts.acceptAll}
        </Button>
        <Button onClick={rejectAll} variant="outlined">
          {texts.declineAll}
        </Button>
        <Button onClick={openPreferences}>{texts.preferencesButton}</Button>
      </Stack>
    </Paper>
  )
}

// Modal de preferências customizado
function CustomPreferencesModal({
  preferences,
  setPreferences,
  closePreferences,
  isModalOpen,
  texts,
}: CustomPreferencesModalProps) {
  return (
    <Dialog open={isModalOpen} onClose={closePreferences}>
      <DialogTitle>{texts.preferencesTitle}</DialogTitle>
      <DialogContent>{/* Sua implementação customizada aqui */}</DialogContent>
      <DialogActions>
        <Button onClick={closePreferences}>Fechar</Button>
      </DialogActions>
    </Dialog>
  )
}

// Componente do AccessibilityDock
function AccessibilityDock() {
  const openPreferencesModal = useOpenPreferencesModal()

  return (
    <Fab
      sx={{ position: 'fixed', bottom: 16, right: 16 }}
      onClick={openPreferencesModal}
    >
      ⚙️
    </Fab>
  )
}

// Configuração principal
function App() {
  return (
    <ThemeProvider theme={theme}>
      <ConsentProvider
        categories={{
          enabledCategories: ['analytics'],
        }}
        // Desabilita botão flutuante padrão
        disableFloatingPreferencesButton={true}
        // Componentes customizados
        CookieBannerComponent={CustomCookieBanner}
        PreferencesModalComponent={CustomPreferencesModal}
        texts={{
          bannerMessage: 'Utilizamos cookies para melhorar sua experiência.',
          acceptAll: 'Aceitar Todos',
          declineAll: 'Recusar',
          preferencesButton: 'Configurar',
        }}
        onConsentGiven={(state) => {
          console.log('Consentimento dado:', state)
        }}
      >
        <YourApp />
        <AccessibilityDock />
      </ConsentProvider>
    </ThemeProvider>
  )
}
```

### Uso com Next.js 14+ e SSR

```tsx
// pages/_app.tsx ou app/layout.tsx
import {
  ConsentProvider,
  type ConsentState,
  setDebugLogging,
  LogLevel,
} from 'react-lgpd-consent'

// Habilitar debug em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  setDebugLogging(true, LogLevel.DEBUG)
}

function MyApp({ Component, pageProps }: AppProps) {
  // Hidratação SSR para evitar flash
  const [initialState, setInitialState] = useState<ConsentState | undefined>()

  useEffect(() => {
    // Ler cookie no cliente para hidratação
    const saved = document.cookie
      .split(';')
      .find((row) => row.trim().startsWith('consent='))

    if (saved) {
      try {
        const data = JSON.parse(decodeURIComponent(saved.split('=')[1]))
        setInitialState(data)
      } catch (e) {
        console.warn('Erro ao ler cookie de consentimento:', e)
      }
    }
  }, [])

  return (
    <ConsentProvider
      initialState={initialState}
      categories={{ enabledCategories: ['analytics'] }}
      disableFloatingPreferencesButton={true}
      scriptIntegrations={[
        createGoogleAnalyticsIntegration('GA_MEASUREMENT_ID'),
      ]}
    >
      <Component {...pageProps} />
    </ConsentProvider>
  )
}
```

### Controle Programático de Preferências

```tsx
import {
  useConsent,
  useOpenPreferencesModal,
  openPreferencesModal, // Para uso fora do React
} from 'react-lgpd-consent'

// Dentro de um componente React
function MyComponent() {
  const { consented, preferences, setPreference } = useConsent()
  const openModal = useOpenPreferencesModal()

  return (
    <div>
      <button onClick={openModal}>Abrir Preferências</button>

      <button onClick={() => setPreference('analytics', true)}>
        Aceitar Analytics
      </button>
    </div>
  )
}

// Fora do contexto React (JavaScript puro)
document.getElementById('cookie-settings')?.addEventListener('click', () => {
  openPreferencesModal()
})
```

### Debug e Troubleshooting

```tsx
import { setDebugLogging, LogLevel } from 'react-lgpd-consent'

// Habilitar logs detalhados para debug
setDebugLogging(true, LogLevel.DEBUG)

// Os logs incluem:
// - Compatibilidade de tema
// - Mudanças de estado
// - Operações de cookie
// - Renderização de componentes
// - Carregamento de scripts
// - Chamadas de API
```

## Migration Guide v0.3.0 → v0.3.1

### Breaking Changes

❌ **Nenhum breaking change** - Totalmente compatível com v0.3.0

### Novos Resources

1. **`disableFloatingPreferencesButton`**: Prop para desabilitar botão flutuante
2. **`useOpenPreferencesModal()`**: Hook para abrir modal programaticamente
3. **`openPreferencesModal()`**: Função para uso fora do React
4. **Novos exports de tipos**: `CustomCookieBannerProps`, etc.
5. **Sistema de debug**: `setDebugLogging()` e `LogLevel`

### Melhorias

1. **Compatibilidade de tema**: Fallbacks automáticos para propriedades MUI
2. **Logs de debug**: Sistema completo de troubleshooting
3. **Documentação**: Exemplos mais claros e detalhados

## Problemas Conhecidos Corrigidos

1. ✅ **"Cannot read properties of undefined (reading 'duration')"** - Resolvido com fallbacks de tema
2. ✅ **"Element type is invalid"** no FloatingPreferencesButton - Corrigido
3. ✅ **Falta de controle do botão flutuante** - Adicionada prop `disableFloatingPreferencesButton`
4. ✅ **Falta de API para abrir modal** - Adicionados hooks e função utilitária
5. ✅ **Types não exportados** - Corrigido com exports completos
