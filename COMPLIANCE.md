# Guia de Conformidade e Funcionalidades - react-lgpd-consent v0.3.0

## 📜 Objetivo

Este documento descreve as medidas de conformidade da biblioteca **react-lgpd-consent** com a Lei Geral de Proteção de Dados (LGPD) e o Guia Orientativo da ANPD, além de detalhar as ferramentas que auxiliam os desenvolvedores a manter essa conformidade.

## ✅ Conformidade com a LGPD

A biblioteca implementa os seguintes princípios e requisitos da LGPD:

- **Consentimento Granular**: O usuário tem controle sobre cada categoria de cookie não essencial.
- **Minimização de Dados**: Apenas as categorias de cookies ativas no projeto são armazenadas no cookie de consentimento.
- **Transparência**: O cookie de consentimento armazena metadados de auditoria, como data, versão e origem da decisão.
- **Facilidade de Revogação**: O usuário pode alterar suas preferências a qualquer momento através do modal.
- **Segurança**: O cookie é configurado com `SameSite=Lax` e `secure=true` (em HTTPS) por padrão.

## 🧠 Sistema de Orientações para Desenvolvedores

A biblioteca inclui um sistema inteligente que **orienta os desenvolvedores sobre a configuração adequada**, garantindo que a implementação final esteja em conformidade com a LGPD.

### Console de Desenvolvimento

Em ambiente de desenvolvimento, a biblioteca exibe automaticamente no console:

- **⚠️ Avisos**: Sobre configurações ausentes ou inconsistentes.
- **💡 Sugestões**: Recomendações para melhorar a conformidade e a experiência do usuário.
- **🔧 Tabela de Categorias Ativas**: Uma lista clara de quais categorias estão em uso, para auxiliar na construção de UIs customizadas.

```
[🍪 LGPD-CONSENT] ⚠️  Avisos de Configuração
  [🍪 LGPD-CONSENT] Nenhuma configuração de categorias especificada. Usando padrão: necessary + analytics.

[🍪 LGPD-CONSENT] 🔧 Categorias Ativas (para UI customizada)
┌─────────────┬──────────────────────┬─────────────┬─────────────┐
│     ID      │         Nome         │ Toggle UI?  │ Essencial?  │
├─────────────┼──────────────────────┼─────────────┼─────────────┤
│ necessary   │ Cookies Necessários  │ ❌ NÃO      │ 🔒 SIM      │
│ analytics   │ Cookies Analíticos   │ ✅ SIM      │ ⚙️ NÃO      │
└─────────────┴──────────────────────┴─────────────┴─────────────┘
```

**Para desabilitar estas mensagens**, use a prop `disableDeveloperGuidance={true}` no `ConsentProvider`.

### Configuração Consciente

Para evitar avisos e garantir a conformidade, especifique explicitamente as categorias de cookies que seu projeto utiliza através da prop `categories`:

```tsx
<ConsentProvider
  categories={{
    // Habilita apenas as categorias padrão que você realmente usa
    enabledCategories: ['analytics'],
  }}
>
  <App />
</ConsentProvider>
```

### Hooks de Validação

Para construir componentes de UI customizados que reagem à configuração, utilize os hooks:

- `useCategories()`: Fornece uma lista completa das categorias ativas no projeto.
- `useCategoryStatus('id')`: Verifica o status de uma categoria específica (se está ativa, se é essencial, etc.).

```tsx
import { useCategoryStatus } from 'react-lgpd-consent'

function AnalyticsFeature() {
  const analytics = useCategoryStatus('analytics')

  // Não renderiza o componente se a categoria 'analytics' não estiver configurada no ConsentProvider
  if (!analytics.isActive) {
    return null
  }

  return <AnalyticsDashboard />
}
```

## 🚀 Roadmap de Funcionalidades

O foco da biblioteca é estabilidade e conformidade.

### v0.3.0 (Atual)

- **Foco**: Refatoração da arquitetura, melhoria da experiência do desenvolvedor (DX) e quebra de compatibilidade para simplificação.
- **Status**: Implementado.

### Próximas Versões (Pseudo-Versioning)

- **v0.+1.0 (Multi-Regulamentação e Conformidade Avançada)**:
  - **Geolocalização-based Consent**: Detecção automática da região do usuário para aplicar a regulamentação relevante (LGPD, GDPR, CCPA).
  - **Configurable Regulation Profiles**: Definição de perfis de regulamentação com requisitos específicos.
  - **Dynamic Text Adaptation**: Textos adaptáveis com base na regulamentação ativa.
  - **Modal Detalhado de Cookies**: Exibição de informações técnicas sobre cada cookie (nome, duração, provedor).
  - **Logs de Auditoria**: Sistema de log client-side para registrar todas as interações de consentimento do usuário.
  - **Templates Setoriais**: Configurações e textos pré-definidos para setores específicos (governo, saúde, e-commerce).
  - **Plugin System**: Sistema de plugins para extensibilidade de integrações e lógica customizada.
  - **Improved `ConsentGate`**: Controle mais granular (e.g., `analytics AND functional`).
  - **Enhanced Developer Guidance**: Mais avisos e sugestões detalhadas.

## 🔒 Segurança e Privacidade

- **Armazenamento**: O consentimento é armazenado exclusivamente no cliente (`localStorage` ou `cookie`).
- **Minimização**: O cookie de consentimento contém apenas as preferências para as categorias ativas no projeto, a versão da configuração e os timestamps necessários para auditoria.
- **Sem Coleta de Dados Pessoais**: A biblioteca em si não coleta ou transmite dados pessoais.
