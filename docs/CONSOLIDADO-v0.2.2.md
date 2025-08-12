# React LGPD Consent - Documentação Consolidada v0.2.2

## 🎯 Visão Geral

**react-lgpd-consent v0.2.2** é uma solução completa de gerenciamento de consentimento de cookies para React, com **sistema inteligente de orientações** que garante compliance LGPD automaticamente.

### 🚨 Novidades v0.2.2 - Sistema de Orientações

- ✅ **Console Automático**: Avisos e sugestões sobre configuração inadequada
- ✅ **UI Dinâmica**: Componentes se adaptam à configuração do projeto
- ✅ **Compliance por Design**: Previne problemas de conformidade LGPD
- ✅ **Cookie Inteligente**: Armazena apenas categorias realmente utilizadas
- ✅ **Hooks Avançados**: `useCategories()` e `useCategoryStatus()` para controle total

## 📋 Status de Conformidade LGPD/ANPD

### ✅ Implementado e Funcional

- **Consentimento granular**: 6 categorias ANPD + categorias customizadas
- **Sem pre-check**: cookies não essenciais desativados por padrão
- **Revogação**: funções `resetConsent()` e `openPreferences()` sempre disponíveis
- **Base legal clara**: Consentimento explícito para cookies não essenciais
- **Banner não intrusivo**: não bloqueia navegação (modo padrão)
- **Suporte SSR**: via prop `initialState` (evita flash)
- **Acessibilidade**: foco gerenciado, navegação por teclado, ARIA adequado
- **Segurança**: `SameSite=Lax`, `secure=true`, validação de cookies
- **Minimização de dados**: Cookie contém apenas categorias utilizadas no projeto

## 🚀 Uso Básico

### Configuração Recomendada (Compliance LGPD)

```tsx
import { ConsentProvider, CookieBanner } from 'react-lgpd-consent'

function App() {
  return (
    <ConsentProvider
      // 🛡️ Especificar apenas categorias necessárias (LGPD Art. 6º)
      categories={{
        enabledCategories: ['analytics'], // Apenas necessárias
      }}
      // 📝 Textos ANPD para compliance completo
      texts={{
        bannerMessage:
          'Utilizamos cookies conforme LGPD para melhorar sua experiência',
        controllerInfo:
          'Controlado por: Empresa XYZ - CNPJ: 00.000.000/0001-00',
        dataTypes: 'Coletamos: dados de navegação para análise estatística',
        userRights: 'Direitos: acessar, corrigir, excluir dados',
        contactInfo: 'DPO: dpo@empresa.com',
      }}
      // 🔔 Callbacks para auditoria
      onConsentGiven={(state) => {
        console.log('Consentimento registrado:', state)
        // Enviar para sistema de auditoria
      }}
    >
      <CookieBanner policyLinkUrl="/politica-de-privacidade" />
      <YourApp />
    </ConsentProvider>
  )
}
```

### Usando Hooks Avançados

```tsx
import {
  useConsent,
  useCategories,
  useCategoryStatus,
} from 'react-lgpd-consent'

function CustomComponent() {
  const { consented, preferences, acceptAll } = useConsent()
  const categories = useCategories() // Lista de categorias ativas no projeto
  const hasMarketing = useCategoryStatus('marketing') // true/false se marketing está configurado

  return (
    <div>
      <h3>Status de Consentimento</h3>
      <p>Consentimento geral: {consented ? '✅' : '❌'}</p>

      <h4>Categorias Ativas no Projeto:</h4>
      {categories.map((cat) => (
        <div key={cat.id}>
          {cat.name}: {preferences[cat.id] ? '✅' : '❌'}
        </div>
      ))}

      {hasMarketing && <p>Marketing está configurado no projeto</p>}
    </div>
  )
}
```

## 📊 Sistema de Orientações Automáticas

O sistema detecta e orienta sobre:

### ⚠️ Configuração Inadequada

```
🚨 [react-lgpd-consent] AVISO: Nenhuma categoria especificada.
   Usando padrão: ['necessary', 'analytics']

   👉 Recomendação: Especificar explicitamente via prop 'categories'

   📋 Para compliance rigorosa:
   <ConsentProvider categories={{enabledCategories: ['analytics']}} />
```

### 🎯 UI Dinâmica

```
📋 [react-lgpd-consent] Categorias ativas no projeto:
   ┌─────────────────┬─────────────┬──────────────────┐
   │ Categoria       │ Status      │ Essencial        │
   ├─────────────────┼─────────────┼──────────────────┤
   │ necessary       │ ✅ Ativo    │ Sim              │
   │ analytics       │ ✅ Ativo    │ Não              │
   └─────────────────┴─────────────┴──────────────────┘

   💡 PreferencesModal mostrará apenas estas categorias
```

## 🛡️ Cookie Inteligente (Minimização LGPD)

### Antes (v0.2.0) - Todas as Categorias

```json
{
  "consented": true,
  "preferences": {
    "necessary": true,
    "analytics": true,
    "functional": true, // ❌ Não usado no projeto
    "marketing": true, // ❌ Não usado no projeto
    "social": true, // ❌ Não usado no projeto
    "personalization": true // ❌ Não usado no projeto
  }
}
```

### Depois (v0.2.2) - Apenas Necessárias

```json
{
  "version": "1.0",
  "consented": true,
  "preferences": {
    "necessary": true,
    "analytics": false // ✅ Apenas categorias configuradas
  },
  "consentDate": "2025-08-12T14:30:00.000Z",
  "lastUpdate": "2025-08-12T14:30:00.000Z",
  "source": "banner",
  "projectConfig": {
    "enabledCategories": ["analytics"]
  }
}
```

## 🔧 Migração v0.2.1 → v0.2.2

### ✅ 100% Backward Compatible

```tsx
// v0.2.1 - Continua funcionando idêntico
<ConsentProvider
  customCategories={[...]} // ✅ API antiga funciona
  texts={{...}}
>

// v0.2.2 - Nova API (recomendada)
<ConsentProvider
  categories={{
    enabledCategories: ['analytics'],
    customCategories: [...]
  }}
  texts={{...}}
>
```

### ❌ APIs Removidas/Deprecadas

```tsx
// ❌ REMOVIDO em v0.2.2
import { useAllCategories } from 'react-lgpd-consent'

// ✅ NOVO em v0.2.2
import { useCategories } from 'react-lgpd-consent'
```

## 📚 Documentação Completa

### Para Desenvolvedores

- 📖 [README.md](./README.md) - Guia principal
- 🔧 [DEVELOPMENT.md](./DEVELOPMENT.md) - Arquitetura e desenvolvimento
- 🚨 [docs/ORIENTACOES-DESENVOLVIMENTO.md](./docs/ORIENTACOES-DESENVOLVIMENTO.md) - Sistema de orientações
- 🔄 [docs/MIGRACAO-v0.2.2.md](./docs/MIGRACAO-v0.2.2.md) - Guia de migração

### Para Compliance/Legal

- 🛡️ [COMPLIANCE.md](./COMPLIANCE.md) - Conformidade consolidada
- 📋 [docs/CONFORMIDADE-LGPD.md](./docs/CONFORMIDADE-LGPD.md) - Guia LGPD específico
- 📊 [docs/adequacao-anpd.md](./docs/adequacao-anpd.md) - Adequação ANPD

### APIs e Referências

- 🔌 [docs/API-v0.2.0.md](./docs/API-v0.2.0.md) - Contrato de API atual
- 🔌 [docs/API-0.1.x.md](./docs/API-0.1.x.md) - API legacy
- 🔗 [docs/integracoes-nativas.md](./docs/integracoes-nativas.md) - Integrações (GA, GTM, UserWay)

## 🎯 Roadmap

### ✅ v0.2.2 - Sistema de Orientações (IMPLEMENTADO)

- Console automático com avisos e sugestões
- UI dinâmica baseada na configuração
- Hooks avançados para componentes customizados
- Cookie inteligente com minimização de dados

### 📋 v0.2.3 - Compliance Avançado (Próximo)

- Modal detalhado de cookies com informações técnicas
- Logs de consentimento para auditoria
- Templates setoriais (governo, saúde, educação)
- Base legal específica por categoria

### 📊 v0.2.4 - Ferramentas DPO (Futuro)

- Relatórios de compliance automáticos
- Dashboard de métricas de consentimento
- Exportação de dados para auditoria ANPD
- Integração com sistemas de compliance

## 📞 Suporte

- 🐛 **Issues**: [GitHub Issues](https://github.com/lucianoedipo/react-lgpd-consent/issues)
- 💬 **Discussões**: GitHub Discussions
- 📧 **Email**: luciano.psilva@anpd.gov.br

---

**Versão**: 0.2.2  
**Última atualização**: 12 de agosto de 2025  
**Status**: Produção - Compliance LGPD/ANPD completa
