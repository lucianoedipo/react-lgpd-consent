# Migração v0.2.1 → v0.2.2: Sistema de Orientações

## 🆕 **O que mudou na v0.2.2**

A v0.2.2 **não contém breaking changes**, apenas adiciona funcionalidades que orientam desenvolvedores sobre configuração adequada.

### ✨ **Funcionalidades Adicionadas**

#### **🚨 Sistema Inteligente de Orientações**

- **Console automático**: Avisos, sugestões e tabelas informativas em desenvolvimento
- **Validação de configuração**: Detecta problemas e orienta correções
- **Prevenção de bugs**: Evita inconsistências entre configuração e UI

#### **🎨 UI Dinâmica**

- **PreferencesModal inteligente**: Renderiza apenas categorias configuradas no projeto
- **Hooks para validação**: `useCategories()` e `useCategoryStatus()`
- **Componentes adaptativos**: UI se ajusta automaticamente à configuração

#### **📋 Configuração Padrão Defensiva**

- **Padrão inteligente**: `necessary + analytics` quando nenhuma categoria especificada
- **Migração automática**: API antiga funciona perfeitamente

## 🔄 **Guia de Migração**

### **Sem Ação Necessária**

**✅ Seu código atual continua funcionando exatamente igual!**

```tsx
// ✅ FUNCIONANDO - API v0.2.1 (ainda suportada)
<ConsentProvider customCategories={[...]} />

// ✅ FUNCIONANDO - API v0.2.2 (recomendada)
<ConsentProvider categories={{ enabledCategories: [...], customCategories: [...] }} />
```

### **Migrações Opcionais (Recomendadas)**

#### **1. Migrar para Nova API de Configuração**

```tsx
// ANTES (v0.2.1) - ainda funciona
<ConsentProvider customCategories={customCategories} />

// DEPOIS (v0.2.2) - recomendado
<ConsentProvider
  categories={{
    enabledCategories: ['analytics', 'marketing'],
    customCategories: customCategories,
  }}
/>
```

#### **2. Atualizar Componentes Customizados**

```tsx
// ANTES (v0.2.1) - ainda funciona
import { useCustomCategories } from 'react-lgpd-consent'

function CustomModal() {
  const categories = useCustomCategories()
  // UI hardcoded para categorias específicas
}

// DEPOIS (v0.2.2) - recomendado
import { useCategories } from 'react-lgpd-consent'

function CustomModal() {
  const { toggleableCategories } = useCategories()

  // UI dinâmica baseada na configuração
  return (
    <div>
      {toggleableCategories.map((category) => (
        <Switch key={category.id} label={category.name} />
      ))}
    </div>
  )
}
```

#### **3. Usar Validação Condicional**

```tsx
// NOVO na v0.2.2
import { useCategoryStatus } from 'react-lgpd-consent'

function AnalyticsDashboard() {
  const analytics = useCategoryStatus('analytics')

  if (!analytics.isActive) {
    return null // Categoria não configurada - não renderiza
  }

  return <div>Dashboard Analytics</div>
}
```

## 🎯 **Benefícios da Migração**

### **Para Desenvolvedores**

- 🚨 **Orientação proativa**: Console mostra exatamente o que implementar
- 🐛 **Menos bugs**: Validação automática de consistência
- 🔧 **Flexibilidade**: Componentes se adaptam à configuração

### **Para Compliance**

- 🎯 **Configuração consciente**: Sistema força reflexão sobre dados coletados
- 📝 **Documentação automática**: Orientações baseadas na configuração real
- 🔍 **Auditabilidade**: Logs claros de decisões

### **Para Usuários Finais**

- ⚡ **Performance**: UI otimizada para categorias relevantes
- 🎯 **Experiência focada**: Apenas opções relevantes ao projeto
- 🔒 **Transparência**: Descrições claras de categorias utilizadas

## 📊 **Comparação de Versões**

| Recurso                    | v0.2.1                       | v0.2.2                        |
| -------------------------- | ---------------------------- | ----------------------------- |
| Configuração de categorias | ✅ customCategories          | ✅ categories (nova API)      |
| UI hardcoded               | ✅ analytics/marketing fixos | ✅ Dinâmica baseada em config |
| Orientação para developers | ❌ Manual                    | ✅ Console automático         |
| Validação de configuração  | ❌ Manual                    | ✅ Automática com sugestões   |
| Prevenção de bugs UI       | ❌ Manual                    | ✅ Hooks de validação         |
| Backward compatibility     | N/A                          | ✅ 100% compatível            |

## 🚀 **Exemplo Completo v0.2.2**

```tsx
import {
  ConsentProvider,
  useCategories,
  useCategoryStatus,
  useConsent,
} from 'react-lgpd-consent'

// 🔧 Nova configuração explícita
function App() {
  return (
    <ConsentProvider
      categories={{
        enabledCategories: ['analytics', 'functional'],
        customCategories: [
          {
            id: 'gov-integration',
            name: 'Integração Governamental',
            description: 'Conexão com sistemas gov.br',
            essential: false,
          },
        ],
      }}
    >
      <MyApp />
      <SmartCustomModal />
    </ConsentProvider>
  )
}

// 🎨 Modal inteligente que se adapta à configuração
function SmartCustomModal() {
  const { toggleableCategories } = useCategories()
  const { preferences, setPreferences } = useConsent()

  return (
    <dialog>
      {/* 🔄 Renderização dinâmica baseada na configuração */}
      {toggleableCategories.map((category) => (
        <label key={category.id}>
          <input
            type="checkbox"
            checked={preferences[category.id] ?? false}
            onChange={(e) =>
              setPreferences({
                ...preferences,
                [category.id]: e.target.checked,
              })
            }
          />
          <strong>{category.name}</strong>
          <p>{category.description}</p>
        </label>
      ))}
    </dialog>
  )
}

// 🎯 Feature condicional baseada em configuração
function GovernmentIntegration() {
  const govIntegration = useCategoryStatus('gov-integration')

  if (!govIntegration.isActive) {
    return null // Não configurada - não renderiza
  }

  return <div>Sistema de integração gov.br ativo</div>
}
```

## 🛠️ **Ferramentas de Debugging**

A v0.2.2 adiciona ferramentas úteis para debugging:

```tsx
import { analyzeDeveloperConfiguration } from 'react-lgpd-consent'

// 🔍 Análise manual da configuração
const guidance = analyzeDeveloperConfiguration({
  enabledCategories: ['analytics'],
  customCategories: [...]
})

console.log('Orientações:', guidance)
console.log('Categorias que precisam de toggle:', guidance.toggleableCategories)
```

## ❓ **FAQ de Migração**

### **Preciso migrar imediatamente?**

Não. Sua aplicação continua funcionando exatamente igual.

### **A nova API quebra algo?**

Não. A API antiga continua 100% funcional.

### **Vale a pena migrar?**

Sim, especialmente se você usa componentes customizados. Os novos hooks previnem bugs e melhoram a manutenibilidade.

### **Como sei se minha configuração está adequada?**

Abra o console do navegador em desenvolvimento. A v0.2.2 automaticamente exibe orientações e sugestões.

---

**🎯 Conclusão:** A v0.2.2 é uma evolução **não-breaking** que adiciona inteligência e orientação ao desenvolvimento, mantendo 100% de compatibilidade com código existente.
