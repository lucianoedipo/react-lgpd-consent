<div align="center">
  <h1>react-lgpd-consent 🍪</h1>
  <p><strong>Uma biblioteca React para gerenciamento de consentimento de cookies em conformidade com a LGPD.</strong></p>

  <div>
    <a href="https://www.npmjs.com/package/react-lgpd-consent"><img src="https://img.shields.io/npm/v/react-lgpd-consent?style=for-the-badge&logo=npm&color=cb3837&logoColor=white" alt="NPM Version"></a>
    <a href="https://www.npmjs.com/package/react-lgpd-consent"><img src="https://img.shields.io/npm/dm/react-lgpd-consent?style=for-the-badge&logo=npm&color=ff6b35&logoColor=white" alt="Downloads"></a>
    <a href="https://github.com/lucianoedipo/react-lgpd-consent/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/react-lgpd-consent?style=for-the-badge&color=green&logoColor=white" alt="License"></a>
  <a href="https://lucianoedipo.github.io/react-lgpd-consent/storybook/"><img src="https://img.shields.io/badge/Storybook-Playground-ff4785?style=for-the-badge&logo=storybook&logoColor=white" alt="Storybook"></a>
  </div>

  <div>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-Ready-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript Ready"></a>
    <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-18+-61dafb?style=for-the-badge&logo=react&logoColor=white" alt="React 18+"></a>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-Compatible-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js Compatible"></a>
  </div>

  <br />

  <p>
    <a href="#-instalação"><strong>Instalação</strong></a> •
    <a href="#-uso-básico"><strong>Uso Básico</strong></a> •
  <a href="./QUICKSTART.md"><strong>📚 Guia de Início Rápido</strong></a> •
  <a href="#-documentação-completa"><strong>Documentação</strong></a> •
  <a href="./README.en.md">🇺🇸 🇬🇧 English</a> •
    <a href="#-como-contribuir"><strong>Contribuir</strong></a>
  </p>

  <!-- Quickstart callout (mantido) -->
  <p align="center">
    <a href="./QUICKSTART.md"><img src="https://img.shields.io/badge/Quickstart-Iniciar%20R%C3%A1pido-blue?style=for-the-badge&logo=book" alt="Quickstart"></a>
  </p>

  <p align="center"><strong>Comece por aqui:</strong> siga o <a href="./QUICKSTART.md">Guia de Início Rápido (QUICKSTART.md)</a> para um tutorial passo-a-passo, exemplos TypeScript, tabela de props e integração com MUI — recomendado para usuários novos.</p>
</div>

---

## 🚀 Instalação

```bash
npm install react-lgpd-consent @mui/material @emotion/react @emotion/styled js-cookie
```

**Dependências peer:** `react`, `react-dom`, `@mui/material` e `js-cookie`.

---

## 📖 Uso Básico

Envolva sua aplicação com o `ConsentProvider` (exemplo mínimo):

```tsx
import { ConsentProvider } from 'react-lgpd-consent'

export default function App() {
  return (
    <ConsentProvider categories={{ enabledCategories: ['analytics'] }}>
      <YourApp />
    </ConsentProvider>
  )
}
```

## Nota sobre ThemeProvider e tema padrão

A biblioteca não cria um `ThemeProvider` global automaticamente. Ela tenta herdar o tema do seu app quando você já possui um `ThemeProvider` do MUI. Se você quiser aplicar explicitamente um tema de fallback para os componentes de consentimento, use a fábrica exportada `createDefaultConsentTheme()` e passe via prop `theme`:

```tsx
import { ConsentProvider, createDefaultConsentTheme } from 'react-lgpd-consent'

// Aplica um tema de fallback somente para os componentes da lib
;<ConsentProvider
  theme={createDefaultConsentTheme()}
  categories={{ enabledCategories: ['analytics'] }}
>
  <App />
</ConsentProvider>
```

Evite depender de criação de tema no import (isso evita side-effects e problemas em SSR). Se você precisar de compatibilidade retroativa com quem importava `defaultConsentTheme`, entre em contato para adicionarmos um export compatível com deprecação documentada.

## 📚 Documentação Completa

Para mais detalhes sobre customização, hooks e funcionalidades, consulte os seguintes guias:

### 📋 Documentação Principal

- **[📚 Guia de Início Rápido (`QUICKSTART.md`)](./QUICKSTART.md)**: Tutorial passo a passo com exemplos práticos, tabela completa de props, debugging e integrações.
  - Novo na v0.4.0: suporte a `customCategories` — veja a seção “Categorias customizadas (customCategories)” no Quickstart.
  - Novo na v0.4.1: integrações nativas para Facebook Pixel, Hotjar, Mixpanel, Clarity, Intercom e Zendesk — veja o guia [INTEGRACOES.md](./INTEGRACOES.md).
  - Dica: use `designTokens.layout.backdrop: 'auto'` para backdrop sensível ao tema no banner bloqueante.
  - Auto-config de categorias: a biblioteca detecta categorias requeridas pelas integrações e exibe os toggles mesmo se você esquecer de habilitar (valor inicial sempre rejeitado). Recomendamos explicitar em `categories.enabledCategories` para clareza.
  - Páginas de Política/Termos não bloqueadas: se `policyLinkUrl` e/ou `termsLinkUrl` apontarem para a página atual, o overlay bloqueante não é aplicado — garantindo legibilidade destas páginas.
- **[Guia da API (`API.md`)](./API.md)**: Referência completa de todos os componentes, hooks e tipos.
- **[Guia de Conformidade (`CONFORMIDADE.md`)](./CONFORMIDADE.md)**: Detalhes sobre as funcionalidades de conformidade com a LGPD.
- **[Guia de Integrações (`INTEGRACOES.md`)](./INTEGRACOES.md)**: Como usar as integrações nativas e criar as suas.

### 🎨 Documentação Interativa (GitHub Pages)

- **[📖 Storybook - Playground Interativo](https://lucianoedipo.github.io/react-lgpd-consent/storybook/)**: Explore e teste todos os componentes em tempo real com controles interativos.
- **[⚙️ TypeDoc - Referência de API](https://lucianoedipo.github.io/react-lgpd-consent/docs/)**: Documentação completa da API gerada automaticamente.
- **[🏠 Portal de Documentação](https://lucianoedipo.github.io/react-lgpd-consent/)**: Página inicial com navegação entre todas as documentações.

---

## 🤝 Como Contribuir

1. Abra uma [Issue](https://github.com/lucianoedipo/react-lgpd-consent/issues) para bugs ou melhorias.
2. Siga o Guia de Desenvolvimento em `DEVELOPMENT.md` para enviar um PR.

---

## 📄 Licença

MIT — veja o arquivo `LICENSE`.
