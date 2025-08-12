# Sistema de Orientações para Desenvolvedores - v0.2.2

## 🚨 Visão Geral - Sistema Inteligente de Orientações

A versão 0.2.2 implementa um sistema inteligente que **orienta developers sobre configuração adequada para compliance LGPD**, prevenindo problemas comuns e garantindo coerência entre configuração e UI.

## 🛡️ Configuração Padrão Inteligente

### Quando Nenhuma Categoria É Especificada

Se você usar o `ConsentProvider` sem especificar categorias:

```tsx
<ConsentProvider>
  <App />
</ConsentProvider>
```

**Comportamento automático (v0.2.2):**

- ✅ **necessary** (sempre ativo - essencial LGPD)
- ✅ **analytics** (categoria padrão mais comum baseada em casos reais)
- ⚠️ **Aviso no console**: "Configuração padrão aplicada. Considere especificar categorias explicitamente."

### 📋 Configuração Explícita (Recomendado para Compliance)

```tsx
<ConsentProvider
  categories={{
    enabledCategories: ['analytics'], // Apenas categorias que serão usadas
  }}
  // Textos ANPD para compliance completo
  texts={{
    bannerMessage: 'Utilizamos cookies conforme LGPD...',
    controllerInfo: 'Controlador: Empresa XYZ - CNPJ: 00.000.000/0001-00',
    dataTypes: 'Coletamos dados de navegação para análise estatística',
    userRights: 'Você pode acessar, corrigir ou excluir seus dados',
    contactInfo: 'DPO: dpo@empresa.com',
  }}
>
  <App />
</ConsentProvider>
```

## Sistema de Orientações

### Console de Desenvolvimento

Em modo de desenvolvimento, a biblioteca exibe automaticamente:

```
🟨 LGPD-CONSENT: Avisos de Configuração
⚠️ Nenhuma configuração de categorias especificada. Usando padrão...

💡 LGPD-CONSENT: Sugestões
💡 Para produção, recomenda-se especificar explicitamente as categorias

🔧 LGPD-CONSENT: Categorias Ativas (para UI customizada)
┌─────────────────┬──────────────────────────────┬─────────────┬─────────────┐
│ ID              │ Nome                         │ Toggle UI?  │ Essencial?  │
├─────────────────┼──────────────────────────────┼─────────────┼─────────────┤
│ necessary       │ Cookies Necessários          │ ❌ NÃO      │ 🔒 SIM      │
│ analytics       │ Cookies Analíticos           │ ✅ SIM      │ ⚙️ NÃO      │
└─────────────────┴──────────────────────────────┴─────────────┴─────────────┘
```

### Hooks para Componentes Customizados

#### useCategories()

Fornece informações completas sobre categorias ativas:

```tsx
import { useCategories } from 'react-lgpd-consent'

function CustomPreferencesModal() {
  const { toggleableCategories, guidance } = useCategories()

  return (
    <div>
      {/* Renderiza apenas categorias que precisam de toggle */}
      {toggleableCategories.map((category) => (
        <Switch
          key={category.id}
          label={`${category.name} - ${category.description}`}
          // ... lógica do switch
        />
      ))}
    </div>
  )
}
```

#### useCategoryStatus()

Verifica status de categoria específica:

```tsx
import { useCategoryStatus } from 'react-lgpd-consent'

function CustomAnalyticsToggle() {
  const analytics = useCategoryStatus('analytics')

  if (!analytics.isActive) {
    return null // Categoria não configurada no projeto
  }

  return (
    <Switch
      disabled={analytics.isEssential}
      label={analytics.name}
      // ... resto da lógica
    />
  )
}
```

## Validações Automáticas

### Avisos de Configuração

A biblioteca automaticamente detecta e avisa sobre:

1. **Muitas categorias** (>5): Pode prejudicar UX
2. **Descrições inadequadas**: < 10 caracteres em categorias customizadas
3. **Uso de padrão implícito**: Sugere configuração explícita

### Orientações de UI

Para componentes totalmente customizados, a biblioteca fornece:

- **Lista de categorias ativas**: Só as configuradas no projeto
- **Status de cada categoria**: Essencial vs. opcional
- **Necessidade de toggle**: Se precisa aparecer na UI
- **Informações descritivas**: Nome e descrição para UI

## Exemplo Completo de Integração

```tsx
import {
  ConsentProvider,
  useCategories,
  useCategoryStatus,
  useConsent,
} from 'react-lgpd-consent'

// 1. Configuração do Provider
function App() {
  return (
    <ConsentProvider
      categories={{
        enabledCategories: ['analytics', 'functional'],
        customCategories: [
          {
            id: 'gov-analytics',
            name: 'Análise Governamental',
            description: 'Métricas específicas do órgão público',
            essential: false,
          },
        ],
      }}
    >
      <MyApp />
      <CustomModal />
    </ConsentProvider>
  )
}

// 2. Componente customizado que usa orientações
function CustomModal() {
  const { toggleableCategories } = useCategories()
  const { preferences, setPreferences } = useConsent()

  return (
    <dialog>
      <h2>Personalize suas Preferências</h2>

      {/* Renderização dinâmica baseada na configuração */}
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

      {/* Necessary sempre ativo - apenas informativo */}
      <label>
        <input type="checkbox" checked disabled />
        <strong>Cookies Necessários</strong>
        <p>Sempre ativos para funcionamento básico</p>
      </label>
    </dialog>
  )
}

// 3. Verificação condicional de categoria
function AnalyticsFeature() {
  const analytics = useCategoryStatus('analytics')

  if (!analytics.isActive) {
    // Categoria não foi configurada no projeto
    return null
  }

  // Categoria está configurada, pode renderizar funcionalidade
  return <AnalyticsDashboard />
}
```

## Migração da API Antiga

### Compatibilidade Mantida

A API antiga ainda funciona:

```tsx
// LEGACY - ainda suportado
<ConsentProvider customCategories={[...]}>
  <App />
</ConsentProvider>
```

**Comportamento automático:**

- Migração automática para nova API
- `enabledCategories` padrão: `['analytics']`
- Aviso no console sobre depreciação

### Nova API Recomendada

```tsx
// NOVO - recomendado
<ConsentProvider
  categories={{
    enabledCategories: ['analytics', 'marketing'],
    customCategories: [...]
  }}
>
  <App />
</ConsentProvider>
```

## Benefícios

### Para Desenvolvedores

1. **Orientação clara**: Console mostra exatamente que categorias implementar
2. **Prevenção de erros**: Avisa sobre configurações inconsistentes
3. **Flexibilidade mantida**: APIs antigas continuam funcionando
4. **TypeScript**: Tipos completos para validação em tempo de desenvolvimento

### Para Compliance LGPD

1. **Minimização de dados**: Cookie só armazena categorias realmente usadas
2. **Configuração explícita**: Força reflexão sobre quais dados coletar
3. **Auditabilidade**: Logs claros de configuração e decisões
4. **Documentação automática**: Orientações baseadas na configuração real

### Para Usuários Finais

1. **Interface limpa**: Apenas opções relevantes para o projeto específico
2. **Menos confusão**: Não veem categorias irrelevantes
3. **Performance**: Menos categorias = UI mais rápida
4. **Transparência**: Descrições claras de cada categoria ativa
