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

## 📚 Documentação Completa

Para mais detalhes sobre customização, hooks e funcionalidades, consulte os seguintes guias:

- **[📚 Guia de Início Rápido (`QUICKSTART.md`)](./QUICKSTART.md)**: Tutorial passo a passo com exemplos práticos, tabela completa de props, debugging e integrações.
- **[Guia da API (`API.md`)](./API.md)**: Referência completa de todos os componentes, hooks e tipos.
- **[Guia de Conformidade (`CONFORMIDADE.md`)](./CONFORMIDADE.md)**: Detalhes sobre as funcionalidades de conformidade com a LGPD.
- **[Guia de Integrações (`INTEGRACOES.md`)](./INTEGRACOES.md)**: Como usar as integrações nativas e criar as suas.
---

## 🤝 Como Contribuir
1. Abra uma [Issue](https://github.com/lucianoedipo/react-lgpd-consent/issues) para bugs ou melhorias.
2. Siga o Guia de Desenvolvimento em `DEVELOPMENT.md` para enviar um PR.

---
## 📄 Licença

MIT — veja o arquivo `LICENSE`.
