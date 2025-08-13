# react-lgpd-consent 🍪

[![NPM Version](https://img.shields.io/npm/v/react-lgpd-consent?style=for-the-badge&color=blue)](https://www.npmjs.com/package/react-lgpd-consent)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/react-lgpd-consent?style=for-the-badge&color=green)](https://bundlephobia.com/package/react-lgpd-consent)
[![Downloads](https://img.shields.io/npm/dm/react-lgpd-consent?style=for-the-badge&color=orange)](https://www.npmjs.com/package/react-lgpd-consent)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/npm/l/react-lgpd-consent?style=for-the-badge&color=lightgrey)](https://github.com/lucianoedipo/react-lgpd-consent/blob/main/LICENSE)

> **Biblioteca completa de consentimento de cookies para React, em conformidade com a LGPD.**

Solução moderna, acessível e personalizável para gerenciar o consentimento de cookies em aplicações React, com suporte a SSR, Material-UI, e um sistema inteligente de orientações para desenvolvedores.

## ✨ Características Principais

- 🇧🇷 **Conformidade com a LGPD**: Desenvolvido seguindo as diretrizes da ANPD.
- 🧠 **Orientações para Desenvolvedores**: Avisos e sugestões automáticas no console para garantir uma configuração adequada.
- 🎯 **UI Dinâmica e Inteligente**: Os componentes se adaptam automaticamente às categorias de cookies que você realmente utiliza.
- 🛡️ **Minimização de Dados**: O cookie de consentimento armazena apenas as informações estritamente necessárias.
- 🚀 **Integrações Nativas**: Carregue scripts como Google Analytics e GTM automaticamente após o consentimento.
- ⏰ **Auditoria**: O cookie armazena metadados essenciais como data do consentimento, versão e origem.
- 🎨 **Customizável**: Personalize textos, tema (Material-UI) e componentes.
- ♿ **Acessibilidade**: Suporte para navegação por teclado e leitores de tela.
- 📦 **Leve e Otimizado**: Performance em foco, com lazy-loading e tree-shaking.

## 🚀 Instalação

```bash
npm install react-lgpd-consent
```

Você também precisará das dependências `peer`, caso ainda não as tenha:

```bash
npm install react react-dom @mui/material js-cookie
```

## 📖 Uso Básico

O exemplo abaixo mostra como implementar um banner de consentimento funcional com o mínimo de configuração.

```tsx
// Em seu componente principal, como App.tsx
import {
  ConsentProvider,
  CookieBanner,
  FloatingPreferencesButton,
} from 'react-lgpd-consent'

function App() {
  return (
    <ConsentProvider
      // 1. Especifique as categorias que seu site utiliza
      categories={{
        enabledCategories: ['analytics', 'marketing'],
      }}
      // 2. (Opcional) Adicione textos para total transparência
      texts={{
        controllerInfo: 'Controlado por: Sua Empresa LTDA',
        userRights: 'Você tem o direito de acessar e corrigir seus dados.',
      }}
      // 3. (Opcional) Adicione callbacks para auditoria
      onConsentGiven={(state) => console.log('Consentimento dado:', state)}
    >
      {/* O resto da sua aplicação */}
      <h1>Meu Site</h1>
      <p>Bem-vindo ao meu site.</p>

      {/* 4. Renderize o banner */}
      <CookieBanner policyLinkUrl="/politica-de-privacidade" />

      {/* 5. (Opcional) Renderize o botão flutuante para o usuário reabrir as preferências */}
      <FloatingPreferencesButton />
    </ConsentProvider>
  )
}

export default App
```

## 🔧 API e Funcionalidades

### Configuração Consciente

A prop `categories` no `ConsentProvider` é o ponto central da biblioteca. Ela força o desenvolvedor a declarar quais categorias de cookies são utilizadas, em linha com o princípio de minimização de dados da LGPD.

```tsx
<ConsentProvider
  categories={{
    // Habilita as categorias padrão 'analytics' e 'functional'
    enabledCategories: ['analytics', 'functional'],

    // Adiciona uma categoria específica para seu projeto
    customCategories: [
      {
        id: 'chat-support',
        name: 'Suporte via Chat',
        description: 'Permite o funcionamento do nosso chat de suporte.',
        essential: false,
      },
    ],
  }}
>
  {/*...*/}
</ConsentProvider>
```

### Carregamento de Scripts (`ConsentScriptLoader`)

Evite carregar scripts de rastreamento antes do consentimento. O `ConsentScriptLoader` faz isso automaticamente.

```tsx
import {
  ConsentProvider,
  ConsentScriptLoader,
  createGoogleAnalyticsIntegration,
} from 'react-lgpd-consent'

const integrations = [
  createGoogleAnalyticsIntegration({
    measurementId: 'G-XXXXXXXXXX',
  }),
]

function App() {
  return (
    <ConsentProvider categories={{ enabledCategories: ['analytics'] }}>
      {/* Este componente carrega os scripts para você quando o consentimento é dado */}
      <ConsentScriptLoader integrations={integrations} />

      {/* ... resto do app */}
    </ConsentProvider>
  )
}
```

### Renderização Condicional (`ConsentGate`)

Renderize componentes ou partes da sua UI apenas se o usuário consentiu com uma categoria específica.

```tsx
import { ConsentGate } from 'react-lgpd-consent'

function MarketingPixel() {
  return (
    <ConsentGate category="marketing">
      {/* Este componente só será renderizado se o usuário aceitar cookies de marketing */}
      <img src="/pixel.gif" alt="Marketing Pixel" />
    </ConsentGate>
  )
}
```

### Hooks

A biblioteca exporta hooks para controle total e criação de UIs customizadas:

- `useConsent()`: O hook principal para interagir com o estado de consentimento.
- `useCategories()`: Retorna a lista de todas as categorias ativas no projeto.
- `useCategoryStatus('id')`: Verifica se uma categoria específica está ativa e configurada.

## 🛡️ Conformidade e LGPD

Esta biblioteca foi projetada para auxiliar na conformidade com a LGPD, implementando princípios como:

- **Consentimento Granular**: O usuário pode escolher quais categorias aceitar.
- **Minimização de Dados**: Apenas as categorias declaradas são gerenciadas e armazenadas no cookie.
- **Transparência**: O sistema de textos e o cookie de auditoria fornecem informações claras.
- **Facilidade de Revogação**: O usuário pode alterar suas preferências a qualquer momento.

Para mais detalhes, consulte o nosso **[Guia de Conformidade](docs/CONFORMIDADE-LGPD.md)**.

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma *issue* ou um *pull request*.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.