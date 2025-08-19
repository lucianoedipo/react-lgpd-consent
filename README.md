<div align="center">
  <h1>react-lgpd-consent 🍪</h1>
  <p><strong>Uma biblioteca React para gerenciamento de consentimento de cookies em conformidade com a LGPD.</strong></p>

  <div>
    <a href="https://www.npmjs.com/package/react-lgpd-consent"><img src="https://img.shields.io/npm/v/react-lgpd-consent?style=for-the-badge&logo=npm&color=cb3837&logoColor=white" alt="NPM Version"></a>
     <a href="https://www.npmjs.com/package/react-lgpd-consent"><img src="https://img.shields.io/npm/dm/react-lgpd-consent?style=for-the-badge&logo=npm&color=ff6b35&logoColor=white" alt="Downloads"></a>
     <a href="https://github.com/lucianoedipo/react-lgpd-consent/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/react-lgpd-consent?style=for-the-badge&color=green&logoColor=white" alt="License"></a>
  </div>
  
  <div>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-Ready-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript Ready"></a>
    <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-18+-61dafb?style=for-the-badge&logo=react&logoColor=white" alt="React 18+"></a>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-Compatible-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js Compatible"></a>
  </div>

  <br>

  <p>
    <a href="#-instalação"><strong>Instalação</strong></a> •
    <a href="#-uso-básico"><strong>Uso Básico</strong></a> •
    <a href="#-documentação-completa"><strong>Documentação</strong></a> •
    <a href="#-como-contribuir"><strong>Contribuir</strong></a>
  </p>
</div>

---

## 🎯 Por que usar `react-lgpd-consent`?

Esta biblioteca oferece uma solução robusta e flexível para gerenciar o consentimento de cookies em aplicações React, com foco total na **Lei Geral de Proteção de Dados (LGPD)** do Brasil.

### Principais Funcionalidades

| Funcionalidade                      | Descrição                                                                                                     |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| 🇧🇷 **Foco na LGPD**                 | Implementação baseada nas diretrizes da ANPD, com textos e categorias alinhados à lei brasileira.             |
| 🎨 **UI Automática e Customizável** | Componentes de UI (Banner e Modal) prontos para uso, baseados em Material-UI, e totalmente substituíveis.     |
| ⚙️ **Configuração Consciente**      | A prop `categories` força a declaração explícita dos cookies utilizados, seguindo o princípio da minimização. |
| 🧠 **Guia para Desenvolvedores**    | Sistema que exibe avisos e sugestões no console (em ambiente de dev) para garantir a correta implementação.   |
| 🚀 **Integrações Nativas**          | Carregamento automático de scripts como Google Analytics e GTM, condicionado ao consentimento do usuário.     |
| 🔒 **Auditoria e Transparência**    | O cookie de consentimento armazena metadados como data, origem e versão para fins de auditoria.               |

---

## 🚀 Instalação

```bash
npm install react-lgpd-consent @mui/material @emotion/react @emotion/styled js-cookie
```

**Dependências Peer:**

A biblioteca requer `react`, `react-dom`, `@mui/material` e `js-cookie` como dependências peer.

---

## 📖 Uso Básico

Envolva sua aplicação com o `ConsentProvider` e configure as categorias de cookies que você utiliza.

```tsx
// Em seu arquivo principal (ex: App.tsx)
import { ConsentProvider } from 'react-lgpd-consent'

function App() {
  return (
    <ConsentProvider
      categories={{
        // É obrigatório especificar as categorias que seu site usa.
        // A categoria 'necessary' é sempre incluída.
        enabledCategories: ['analytics', 'marketing'],
      }}
    >
      {/* O banner e o botão de preferências aparecerão automaticamente */}
      <SuaAplicacao />
    </ConsentProvider>
  )
}
```

### Exemplo com Integração e Textos Customizados

```tsx
import {
  ConsentProvider,
  ConsentScriptLoader,
  createGoogleAnalyticsIntegration,
} from 'react-lgpd-consent'

// 1. Crie as integrações que você precisa
const integrations = [
  createGoogleAnalyticsIntegration({
    measurementId: 'G-XXXXXXXXXX', // Substitua pelo seu ID
  }),
]

function App() {
  return (
    <ConsentProvider
      categories={{ enabledCategories: ['analytics'] }}
      texts={{
        bannerMessage: 'Nós usamos cookies para analisar o tráfego e melhorar a sua experiência.',
        acceptAll: 'Aceitar',
        declineAll: 'Recusar',
        // Para conformidade com a ANPD, preencha os campos abaixo
        controllerInfo: 'Controlado por: Sua Empresa LTDA (CNPJ: XX.XXX.XXX/XXXX-XX)',
        contactInfo: 'Contato do DPO: dpo@suaempresa.com',
      }}
      onConsentGiven={(state) => {
        console.log('O usuário deu o primeiro consentimento!', state.preferences)
      }}
    >
      {/* 2. Adicione o loader de scripts para carregá-los após o consentimento */}
      <ConsentScriptLoader integrations={integrations} />

      <SuaAplicacao />
    </ConsentProvider>
  )
}
```

---

## 📚 Documentação Completa

Para mais detalhes sobre customização, hooks e funcionalidades, consulte os seguintes guias:

- **[Guia da API (`API.md`)](./API.md)**: Referência completa de todos os componentes, hooks e tipos.
- **[Guia de Conformidade (`CONFORMIDADE.md`)](./CONFORMIDADE.md)**: Detalhes sobre as funcionalidades de conformidade com a LGPD.
- **[Guia de Integrações (`INTEGRACOES.md`)](./INTEGRACOES.md)**: Como usar as integrações nativas e criar as suas.

---

## 🤝 Como Contribuir

Contribuições são muito bem-vindas! Este é um projeto open-source para a comunidade brasileira.

1.  **Reporte Bugs ou Sugira Melhorias**: Abra uma [Issue no GitHub](https://github.com/lucianoedipo/react-lgpd-consent/issues).
2.  **Envie um Pull Request**: Siga as instruções no nosso [Guia de Desenvolvimento (`DEVELOPMENT.md`)](./DEVELOPMENT.md).

> Observação: este repositório usa templates de issues e PR para padronizar contribuições. Use os templates ao abrir um bug/feature/PR para acelerar a triagem.

---

## 📄 Licença

Este projeto está licenciado sob a **MIT License**. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.
