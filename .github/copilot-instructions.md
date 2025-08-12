# Instruções para GitHub Copilot - react-lgpd-consent

## 🎯 Contexto do Projeto

Você está trabalhando na biblioteca **react-lgpd-consent**, uma solução completa para gerenciamento de consentimento de cookies em conformidade com a LGPD (Lei Geral de Proteção de Dados) brasileira. A versão atual é a **v0.2.x**, que foca em **compliance rigoroso, minimização de dados e excelente experiência para o desenvolvedor (DX)**.

### Tecnologias Principais

- **React 18+** com TypeScript
- **Material-UI (MUI)** para componentes
- **js-cookie** para persistência
- **SSR/Next.js** compatível

## 🏗️ Arquitetura e Padrões (v0.2.x)

### Estrutura de Diretórios

```
src/
├── components/         # Componentes UI (CookieBanner, PreferencesModal, etc.)
├── context/            # Contextos React (ConsentContext, CategoriesContext)
├── hooks/              # Hooks públicos (useConsent, useCategories, etc.)
├── types/              # Definições TypeScript
├── utils/              # Utilitários
│   ├── cookieUtils.ts        # Manipulação de cookies (com versionamento)
│   ├── developerGuidance.ts  # Sistema de orientações para dev
│   ├── scriptIntegrations.ts # Integrações (GA, GTM, etc.)
│   └── ConsentGate.tsx       # Renderização condicional
└── index.ts            # Ponto de entrada da API pública
```

### Convenções de Código

#### Nomeação (CRÍTICO)

- **API pública**: SEMPRE em inglês (`consented`, `preferences`, `acceptAll`, `categories`).
- **Textos de UI**: Padrão em pt-BR, customizável via prop `texts`.
- **Interfaces**: `PascalCase` em inglês (ex: `ConsentProviderProps`).
- **Props**: Sempre `Readonly<T>`.

#### Configuração (CRÍTICO)

- **Princípio da Minimização**: A configuração de categorias deve ser feita via prop `categories` no `ConsentProvider`, especificando **apenas** as categorias realmente utilizadas no projeto.

```tsx
// ✅ Correto: Apenas as categorias 'analytics' e 'marketing' serão usadas.
<ConsentProvider
  categories={{
    enabledCategories: ['analytics', 'marketing'],
  }}
>
```

## 🚀 Estado Atual (v0.2.x)

### Já Implementado ✅

- **Sistema de Orientações para Desenvolvedores**:
  - **Console automático** com avisos, sugestões e tabela de categorias ativas em ambiente de desenvolvimento.
  - **UI Dinâmica**: Componentes como `PreferencesModal` se adaptam automaticamente à configuração do projeto.
  - **Hooks de Validação**: `useCategories()` para obter a lista de categorias ativas e `useCategoryStatus('id')` para verificar o status de uma categoria específica.
- **Compliance LGPD/ANPD Rigorosa**:
  - **Cookie Inteligente**: Estrutura com versionamento, timestamps (`consentDate`, `lastUpdate`) e origem (`source`) para auditoria.
  - **Minimização de Dados**: O cookie de consentimento armazena **apenas** as preferências para as categorias ativas no projeto, reduzindo o tamanho e a superfície de dados.
  - **Banner Bloqueante**: Opção `blocking={true}` para exigir interação explícita.
- **API de Categorias Flexível**:
  - **6 Categorias ANPD**: `necessary`, `analytics`, `functional`, `marketing`, `social`, `personalization`.
  - **Categorias Customizadas**: Sistema extensível para necessidades específicas do projeto.
- **Integrações Nativas**:
  - Carregamento automático de scripts com `ConsentScriptLoader`.
  - Funções prontas: `createGoogleAnalyticsIntegration`, `createGoogleTagManagerIntegration`, `createUserWayIntegration`.
- **Textos ANPD Expandidos**: Campos opcionais na prop `texts` para máxima transparência (`controllerInfo`, `dataTypes`, `userRights`, etc.).

### Em Desenvolvimento (Próximos Passos) 🔄

Foco na **v0.2.7 - Compliance Avançado**:

- **Modal Detalhado de Cookies**: Exibição de informações técnicas sobre cada cookie (nome, duração, provedor).
- **Logs de Auditoria**: Sistema de log client-side para registrar todas as interações de consentimento do usuário.
- **Templates Setoriais**: Configurações e textos pré-definidos para setores específicos (governo, saúde, e-commerce).

## 🎨 Guidelines de UI/UX

- **Consistência**: A UI deve ser consistente com a configuração. Use `useCategories()` para garantir que apenas categorias ativas sejam exibidas.
- **Clareza**: As descrições das categorias devem ser claras e informativas para o usuário final.
- **Acessibilidade**: Manter conformidade com WCAG, garantindo navegação por teclado e suporte a leitores de tela.

## 🔒 Segurança e Compliance

- **Minimização é Chave**: Sempre configure o `ConsentProvider` com o mínimo de categorias necessárias. Isso é um princípio fundamental da LGPD.
- **Transparência**: Use os textos expandidos da ANPD (`controllerInfo`, `dataTypes`, etc.) para fornecer informação completa ao usuário.
- **Não coletar dados pessoais**: A biblioteca não deve coletar ou armazenar dados que identifiquem o usuário.

## 🚨 NUNCA Fazer

❌ **Breaking changes** em versões minor/patch.
❌ Usar a prop `customCategories` (legada). **Prefira a nova API `categories`**.
❌ Deixar a configuração de categorias vazia em produção (o sistema usará um padrão e emitirá um aviso em dev).
❌ Adicionar lógica de UI para uma categoria sem antes verificar seu status com `useCategoryStatus()`.

## ✅ Sempre Fazer

✅ **Usar a prop `categories`** para configurar explicitamente as categorias ativas.
✅ **Utilizar `useCategories()` e `useCategoryStatus()`** para construir UIs customizadas que sejam dinâmicas e consistentes com a configuração.
✅ **Manter backward compatibility** em minor versions.
✅ **Adicionar JSDoc** em português para novas funções ou componentes.
✅ **Priorizar segurança, acessibilidade e transparência**.

## 📋 Checklist para PRs

- [ ] A configuração `categories` foi usada para definir apenas as categorias necessárias?
- [ ] A UI customizada usa `useCategories()` para se adaptar dinamicamente?
- [ ] Os novos textos (se houver) foram adicionados à prop `texts` e não estão hardcoded?
- [ ] Acessibilidade testada (Tab, Enter, Escape).
- [ ] SSR funciona (sem `window`/`document` no render inicial).
- [ ] Tipos TypeScript corretos e `Readonly<>` para props.
- [ ] JSDoc atualizado.
- [ ] Testes passando.

## 🎯 Próximos Marcos

### v0.2.7 - Compliance Avançado

- 📋 Sistema de Logs de Auditoria.
- 📜 Templates Setoriais (governo, saúde, educação).
- 🎨 Presets Visuais por setor (WCAG AAA).

### v0.3.0 - Multi-Regulamentação

- 🌍 Suporte GDPR/CCPA.
- 🏗️ Sistema de Plugins.

---

**Lembre-se**: Este é um projeto de compliance/LGPD. Priorize **segurança, acessibilidade e transparência** em todas as decisões de código.
