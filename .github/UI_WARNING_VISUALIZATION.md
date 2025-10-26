# 🎨 Aviso de Componentes UI - Visualização

## Console Output em DEV

Quando você usa `@react-lgpd-consent/core` sem fornecer componentes UI:

```
[@react-lgpd-consent/core] Aviso: Nenhum componente UI fornecido

⚠️  O ConsentProvider do core é HEADLESS (sem interface visual).
    Usuários não verão banner de consentimento nem conseguirão gerenciar preferências.

📦 Componentes UI ausentes:
   • CookieBanner - Banner de consentimento inicial
   • PreferencesModal - Modal de gerenciamento de preferências
   • FloatingPreferencesButton - Botão para reabrir preferências

✅ Soluções:

   1️⃣  Usar pacote MUI (RECOMENDADO - componentes prontos):
       import { ConsentProvider } from '@react-lgpd-consent/mui'
       // Modal, banner e botão injetados automaticamente!

   2️⃣  Fornecer seus próprios componentes:
       <ConsentProvider
         CookieBannerComponent={YourBanner}
         PreferencesModalComponent={YourModal}
         FloatingPreferencesButtonComponent={YourButton}
       />

   3️⃣  Usar headless (sem UI - intencional):
       // Use hooks como useConsent() para criar UI customizada
       // Ignore este aviso se for intencional

📚 Docs: https://github.com/lucianoedipo/react-lgpd-consent#usage
```

## Quando o Aviso APARECE

### ✅ Exibe Aviso (nenhum componente fornecido)

```tsx
import { ConsentProvider } from '@react-lgpd-consent/core'

;<ConsentProvider categories={{ enabledCategories: ['analytics'] }}>
  <App />
</ConsentProvider>
```

## Quando o Aviso NÃO Aparece

### ❌ Não exibe (pelo menos 1 componente fornecido)

```tsx
import { ConsentProvider } from '@react-lgpd-consent/core'

// Exemplo 1: Só Banner
<ConsentProvider
  categories={{ enabledCategories: ['analytics'] }}
  CookieBannerComponent={CustomBanner}
>
  <App />
</ConsentProvider>

// Exemplo 2: Só Modal
<ConsentProvider
  categories={{ enabledCategories: ['analytics'] }}
  PreferencesModalComponent={CustomModal}
>
  <App />
</ConsentProvider>

// Exemplo 3: Todos os 3
<ConsentProvider
  categories={{ enabledCategories: ['analytics'] }}
  CookieBannerComponent={CustomBanner}
  PreferencesModalComponent={CustomModal}
  FloatingPreferencesButtonComponent={CustomButton}
>
  <App />
</ConsentProvider>
```

### ❌ Não exibe (usando pacote MUI)

```tsx
import { ConsentProvider } from '@react-lgpd-consent/mui'

;<ConsentProvider categories={{ enabledCategories: ['analytics'] }}>
  <App />
  {/* Componentes injetados automaticamente pelo wrapper MUI */}
</ConsentProvider>
```

### ❌ Não exibe (produção)

```tsx
// NODE_ENV=production
import { ConsentProvider } from '@react-lgpd-consent/core'

;<ConsentProvider categories={{ enabledCategories: ['analytics'] }}>
  <App />
</ConsentProvider>
// Sem aviso em produção (performance)
```

## Lógica do Aviso

```tsx
// Aviso exibido SOMENTE quando TODAS as condições são verdadeiras:
const shouldWarn =
  process.env.NODE_ENV === 'development' && // 1. Modo DEV
  typeof window !== 'undefined' && // 2. Client-side
  !didWarnAboutMissingUI.current && // 3. Primeira vez
  !PreferencesModalComponent && // 4. Sem modal
  !CookieBannerComponent && // 5. Sem banner
  !FloatingPreferencesButtonComponent // 6. Sem botão
```

## Benefícios

1. **Descoberta Rápida**: Desenvolvedor sabe imediatamente que precisa adicionar UI
2. **Soluções Claras**: 3 opções bem explicadas
3. **Performance**: Verificação única (useRef), sem overhead
4. **Produção Segura**: Aviso apenas em DEV
5. **SSR-Safe**: Verifica `typeof window` antes
6. **Inteligente**: Não avisa se você forneceu pelo menos 1 componente (uso parcial válido)

## Casos de Uso Válidos (Sem Aviso)

### 1. UI Parcial (Banner customizado + hooks para modal)

```tsx
<ConsentProvider
  CookieBannerComponent={CustomBanner}
  // Sem modal - usuário vai usar useConsent() para abrir modal customizado
>
  <App />
</ConsentProvider>
```

### 2. Apenas Modal (sem banner inicial)

```tsx
<ConsentProvider
  PreferencesModalComponent={CustomModal}
  // Banner mostrado em outro lugar da app via useConsent()
>
  <App />
</ConsentProvider>
```

### 3. Headless Completo (intencional)

```tsx
;<ConsentProvider categories={{ enabledCategories: ['analytics'] }}>
  {/* Usa apenas hooks: useConsent(), useCategoryStatus(), etc. */}
  <CustomConsentUI />
</ConsentProvider>

function CustomConsentUI() {
  const { acceptAll, rejectAll } = useConsent()
  return (
    <div>
      <button onClick={acceptAll}>Aceitar</button>
      <button onClick={rejectAll}>Rejeitar</button>
    </div>
  )
}
// Aviso aparece, mas você pode ignorar (uso intencional)
```

---

**Styling do Aviso:**

- `color: #ff9800` (laranja warning)
- `font-weight: bold`
- `font-size: 14px`
- Usa emojis para melhor visualização (⚠️, 📦, ✅, 1️⃣, etc.)
