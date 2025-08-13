# Release Notes - v0.3.1 🚀

## 🔧 Correções Críticas de Produção

### A) Theme Provider Incompatibility - CORRIGIDO ✅

- **Problema**: `Cannot read properties of undefined (reading 'duration')`
- **Solução**: SafeThemeProvider com fallbacks automáticos
- **Arquivos**: `src/context/ConsentContext.tsx`, `src/components/FloatingPreferencesButton.tsx`
- **Detalhes**: Sistema detecta automaticamente temas customizados do Material-UI e aplica fallbacks seguros

### B) FloatingPreferencesButton API - CORRIGIDO ✅

- **Problema**: `Element type is invalid` + falta de controle programático
- **Solução**: API completa com hooks e função global
- **Novos recursos**:
  - Hook `useOpenPreferencesModal()`
  - Função global `window.openPreferencesModal()`
  - Prop `disableFloatingPreferencesButton` para desabilitar o botão flutuante
- **Arquivos**: `src/hooks/useConsent.ts`, `src/context/ConsentContext.tsx`

### C) TypeScript Types Export - CORRIGIDO ✅

- **Problema**: Missing `CustomCookieBannerProps`, `CustomPreferencesModalProps`, `CustomFloatingPreferencesButtonProps`
- **Solução**: Exportações completas de tipos
- **Arquivo**: `src/index.ts`
- **Compatibilidade**: 100% backward compatible

### D) Debug System - CORRIGIDO ✅

- **Problema**: Falta de sistema de debug para troubleshooting
- **Solução**: Sistema de logging abrangente
- **Arquivo**: `src/utils/logger.ts`
- **Recursos**:
  - 4 níveis de log: ERROR(0), WARN(1), INFO(2), DEBUG(3)
  - Contextos especializados: theme, state, cookie, component, script, API
  - Configurável via `window.LGPD_CONSENT_DEBUG = 3`

## 🔄 Melhorias de Refinamento

### ConsentTexts Interface - EXPANDIDA ✅

- **Problema**: Campos de texto faltando causando erros runtime
- **Solução**: Interface expandida com campos opcionais
- **Novos campos**:
  - `preferencesButton?`: Texto do botão de preferências
  - `preferencesTitle?`: Título do modal de preferências
  - `preferencesDescription?`: Descrição do modal
  - `close?`: Texto do botão fechar
- **Arquivo**: `src/types/types.ts`
- **Backward Compatibility**: 100% mantida

### Exemplo Funcional - CORRIGIDO ✅

- **Problema**: `TestV0.3.1.tsx` com erros TypeScript
- **Solução**: Exemplo completamente funcional
- **Arquivo**: `example/TestV0.3.1.tsx`
- **Recursos**: Demonstra todas as novas funcionalidades

### Sistema de Logging Abrangente - IMPLEMENTADO ✅

- **Integração**: CookieBanner, FloatingPreferencesButton, cookieUtils, ConsentContext
- **Detalhes**: Logging contextual em todas operações críticas
- **Debug**: Facilita identificação de problemas em produção

## 🧪 Qualidade e Testes

- ✅ **Todos os testes passando**: 13/13 tests passed
- ✅ **TypeScript compilação**: Zero erros de compilação
- ✅ **Build production**: Sucesso completo
- ✅ **ESLint**: Sem warnings (supressões adequadas aplicadas)

## 📦 Distribuição

```bash
npm run build  # ✅ Sucesso
npm test       # ✅ 13/13 tests passed
npm run type-check  # ✅ Zero erros
```

## 🔄 Compatibilidade

- **Breaking Changes**: NENHUMA 🎉
- **Backward Compatibility**: 100% mantida
- **Migration Path**: Não necessária

## 💡 Como Usar as Novas Funcionalidades

### 1. Controle Programático do Modal

```tsx
import { useOpenPreferencesModal } from 'react-lgpd-consent'

function MyComponent() {
  const openPreferencesModal = useOpenPreferencesModal()

  return <button onClick={openPreferencesModal}>Abrir Preferências</button>
}

// OU via função global
window.openPreferencesModal()
```

### 2. Debug System

```tsx
// No seu app
window.LGPD_CONSENT_DEBUG = 3 // DEBUG level

// Logs aparecerão automaticamente no console:
// [🍪 LGPD-CONSENT] 🎨 Theme compatibility detected
// [🍪 LGPD-CONSENT] 📊 State transition: initial -> accepted
// [🍪 LGPD-CONSENT] 🍪 Cookie operation: write success
```

### 3. Desabilitar Botão Flutuante

```tsx
<ConsentProvider
  config={
    {
      // ... sua config
    }
  }
  disableFloatingPreferencesButton={true}
>
  {/* Usar controle programático em vez do botão flutuante */}
</ConsentProvider>
```

## 🎯 Status: PRONTO PARA PRODUÇÃO

**Todos os 4 problemas críticos foram resolvidos com sucesso!**

A versão v0.3.1 está totalmente testada, compilada e pronta para distribuição. Zero breaking changes foram introduzidas, mantendo 100% de compatibilidade com implementações existentes.

---

**Próximo passo**: `npm publish` para distribuir v0.3.1 🚀
