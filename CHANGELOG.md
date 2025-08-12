# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto segue [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [0.2.0] - 2025-08-12

### 🎉 MAJOR UPDATE - Adequação ANPD Completa

### ✨ Adicionado

- **🍪 Categorias ANPD Expandidas**: Sistema baseado no Guia Orientativo da ANPD
  - `necessary`: Cookies essenciais (sempre ativos)
  - `analytics`: Análise e estatísticas
  - `functional`: Funcionalidades extras
  - `marketing`: Publicidade e marketing
  - `social`: Integração com redes sociais
  - `personalization`: Personalização de conteúdo

- **🔧 Sistema de Categorias Extensíveis**
  - Nova interface `CategoryDefinition` para categorias customizadas
  - Prop `customCategories` no `ConsentProvider`
  - Hooks `useCustomCategories()` e `useAllCategories()`
  - Suporte a categorias essenciais vs opcionais

- **📝 Textos ANPD Expandidos** (todos opcionais para backward compatibility)
  - `controllerInfo`: Identificação do controlador dos dados
  - `dataTypes`: Tipos de dados coletados
  - `thirdPartySharing`: Compartilhamento com terceiros
  - `userRights`: Direitos do titular dos dados
  - `contactInfo`: Contato do DPO/responsável
  - `retentionPeriod`: Prazo de armazenamento
  - `lawfulBasis`: Base legal (consentimento/interesse legítimo)
  - `transferCountries`: Países de transferência internacional

- **🚀 Integrações Nativas de Scripts**
  - `createGoogleAnalyticsIntegration()`: GA4 configurado automaticamente
  - `createGoogleTagManagerIntegration()`: GTM configurado automaticamente
  - `createUserWayIntegration()`: UserWay para acessibilidade
  - `ConsentScriptLoader`: Componente para carregamento automático
  - `useConsentScriptLoader`: Hook para carregamento programático
  - Interface `ScriptIntegration` para scripts customizados

- **🎛️ Sistema de Categorias Dinâmico**
  - Context `CategoriesProvider` separado para melhor organização
  - Preferências expandidas com suporte a `[key: string]: boolean`
  - Reducer atualizado para categorias customizadas

### 🔧 Melhorado

- **Preferências padrão**: Agora incluem todas as 6 categorias ANPD
- **Tipagem expandida**: `Category` type agora inclui todas as categorias
- **Context arquitetura**: Separação de responsabilidades mais clara
- **Documentação**: Guias detalhados para cada nova funcionalidade

### 📦 Interno

- Context `CategoriesCtx` para categorias customizadas
- Função `createInitialPreferences()` para inicialização dinâmica
- Reducer com suporte a ações com categorias customizadas
- Exports expandidos no `index.ts`

### 🎯 Compatibilidade

- ✅ **100% Backward Compatible**: Todas as APIs existentes funcionam
- ✅ **Opt-in Features**: Novas funcionalidades são opcionais
- ✅ **Progressive Enhancement**: Funciona do simples ao complexo

### 📊 Bundle Size

- **Antes**: 6.65 KB ESM + 14.08 KB chunk
- **Agora**: 10.84 KB ESM + 15.90 KB chunk
- **Crescimento**: +4.19 KB (+64% de funcionalidades)

## [0.1.3] - 2025-08-09

### 🎉 Adicionado

- **Banner bloqueante**: Nova prop `blocking` no `CookieBanner` (padrão: `true`)
  - Quando `blocking=true`, exibe overlay escuro que impede interação até decisão
  - Quando `blocking=false`, usa o comportamento Snackbar não intrusivo
- **Sistema de temas**: Suporte completo a temas Material-UI
  - Tema padrão institucional (`defaultConsentTheme`) baseado nas cores da ANPD
  - Prop `theme` no `ConsentProvider` para temas customizados
  - ThemeProvider automático para todos os componentes filhos
- **Modal de preferências funcional**:
  - Estado `isModalOpen` agora conectado ao contexto
  - Botão "Preferências" no banner abre corretamente o modal
  - Hook `useConsent()` expõe `isModalOpen`
- **Script loader aprimorado**:
  - Nova função `loadConditionalScript()` que aguarda consentimento
  - Callbacks com delay de 150ms para permitir animações de fechamento
  - Melhor integração com `ConsentGate`
- **Hook adicional**: `useConsentTexts()` para acessar textos customizados

### 🔧 Corrigido

- **Textos customizados**: Props `texts` do `ConsentProvider` agora funcionam corretamente
  - Componentes `CookieBanner` e `PreferencesModal` usam textos do contexto
  - Remoção da dependência direta de `defaultTexts`
- **Estado do modal**: `isModalOpen` integrado ao reducer e hooks
- **Conexão de ações**: Todas as ações (`openPreferences`, `closePreferences`, etc.) funcionais

### 📦 Interno

- Context `TextsCtx` para disponibilizar textos customizados
- Reducer atualizado com estado `isModalOpen`
- ThemeProvider integrado ao ConsentProvider
- Delays nos callbacks para melhor UX

### 🎨 Design

- Banner bloqueante com overlay `rgba(0, 0, 0, 0.5)`
- zIndex 1300 (acima de modais MUI)
- Tema padrão com bordas arredondadas e sombras suaves
- Transições suaves para melhor experiência visual

## [0.1.0] - 2025-08-09

### 🎉 Lançamento Inicial

- **Contexto de consentimento** com `ConsentProvider`
- **Banner básico** com botões Aceitar/Recusar/Preferências
- **Modal de preferências** para categorias analytics e marketing
- **Hook `useConsent()`** para interação com estado
- **Componente `ConsentGate`** para renderização condicional
- **Utilitários**:
  - `loadScript()` para carregamento dinâmico de scripts
  - `cookieUtils` para persistência
- **Suporte SSR** via prop `initialState`
- **Acessibilidade** com ARIA e navegação por teclado
- **TypeScript** completo com tipos exportados

### 🏗️ Arquitetura

- Context API com reducer pattern
- Cookies seguros (`SameSite=Lax`, `secure=true`)
- API pública em inglês, UI padrão em português
- Zero dependências extras (apenas `js-cookie`)

---

## [Unreleased]

### 🚀 Planejado para v0.2.0

- [ ] Textos ANPD expandidos (campos opcionais)
- [ ] Validação robusta de cookies com versioning
- [ ] Logs de consentimento básicos
- [ ] Mais categorias de cookies

### 🔮 Futuro (v0.3.0+)

- [ ] Modal detalhado com lista de cookies
- [ ] Base legal por categoria
- [ ] Relatórios de compliance
- [ ] Templates por setor
