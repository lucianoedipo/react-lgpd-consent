# Guia de Troubleshooting - react-lgpd-consent

Este guia documenta problemas comuns e suas soluções ao usar o `react-lgpd-consent`.

## Índice

- [Erro: Invalid hook call](#erro-invalid-hook-call)
- [Múltiplas instâncias de React detectadas](#múltiplas-instâncias-de-react)
- [Versão do React não suportada](#versão-do-react-não-suportada)
- [Versão do MUI fora do range](#versão-do-mui-fora-do-range)
- [Problemas com pnpm](#problemas-com-pnpm)
- [Problemas com Yarn PnP](#problemas-com-yarn-pnp)
- [SSR / Next.js](#ssr--nextjs)
- [Banner não aparece](#banner-não-aparece)
- [Como desabilitar diagnósticos](#como-desabilitar-diagnósticos)

---

## Erro: Invalid hook call

### Sintoma

```
Error: Invalid hook call. Hooks can only be called inside of the body of a function component.
```

### Causa

Este erro quase sempre indica que existem **múltiplas instâncias de React** carregadas no seu projeto. Isso quebra as regras dos hooks do React.

### Diagnóstico automático

A partir da v0.5.4, o `react-lgpd-consent` detecta automaticamente este problema em modo desenvolvimento e exibe uma mensagem detalhada no console com instruções específicas para o seu gerenciador de pacotes.

### Solução

<details>
<summary><strong>📦 PNPM (RECOMENDADO)</strong></summary>

Adicione ao `package.json` raiz do seu projeto:

```json
{
  "pnpm": {
    "overrides": {
      "react": "$react",
      "react-dom": "$react-dom"
    }
  }
}
```

Execute:

```bash
pnpm install
```

**Explicação**: `$react` e `$react-dom` forçam o pnpm a usar a mesma versão instalada na raiz, evitando duplicação.

</details>

<details>
<summary><strong>📦 NPM / Yarn clássico</strong></summary>

Adicione ao `package.json` raiz:

```json
{
  "overrides": {
    "react": "^18.2.0 || ^19.0.0",
    "react-dom": "^18.2.0 || ^19.0.0"
  }
}
```

Execute:

```bash
npm install
# ou
yarn install
```

</details>

<details>
<summary><strong>🔧 Webpack</strong></summary>

Adicione ao `webpack.config.js`:

```javascript
const path = require('path')

module.exports = {
  resolve: {
    alias: {
      react: path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
    },
  },
}
```

</details>

<details>
<summary><strong>⚡ Vite</strong></summary>

Adicione ao `vite.config.js`:

```javascript
export default {
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
}
```

</details>

---

## Múltiplas instâncias de React

### Como verificar manualmente

Execute no console do browser (DevTools):

```javascript
// Verificar quantas instâncias de React existem
Object.keys(window).filter((key) => key.includes('React'))
```

Se retornar mais de um resultado, você tem múltiplas instâncias.

### Verificação programática

```typescript
import { checkPeerDeps } from 'react-lgpd-consent'

const result = checkPeerDeps()
if (!result.ok) {
  console.log('Problemas detectados:', result.errors)
}
```

---

## Versão do React não suportada

### Versões suportadas

- **React 18.2.0+** (recomendado)
- **React 19.x** (suportado)

### Solução

Atualize o React:

```bash
# React 18
npm install react@^18.2.0 react-dom@^18.2.0

# React 19
npm install react@^19.0.0 react-dom@^19.0.0
```

---

## Versão do MUI fora do range

### Versões suportadas

- **@mui/material 5.15.0+**
- **@mui/material 6.x**
- **@mui/material 7.x** (recomendado)

### Sintoma

Componentes de UI não renderizam corretamente ou apresentam erros de estilo.

### Solução

Atualize o MUI:

```bash
# MUI 7 (recomendado)
npm install @mui/material@^7.0.0 @emotion/react @emotion/styled

# MUI 5.15+ (mínimo)
npm install @mui/material@^5.15.0 @emotion/react @emotion/styled
```

### Nota

Se você usa apenas o pacote `@react-lgpd-consent/core` (headless, sem UI), pode ignorar esta verificação.

---

## Problemas com pnpm

### Erro: ERESOLVE unable to resolve dependency tree

Comum ao instalar em projetos existentes com pnpm.

**Solução rápida**:

```bash
pnpm install --legacy-peer-deps
```

**Solução permanente**:

Adicione ao `.npmrc` na raiz:

```
auto-install-peers=true
strict-peer-dependencies=false
```

Execute:

```bash
pnpm install
```

### Hoisting de peer dependencies

Para garantir que peer deps sejam compartilhadas corretamente:

```json
{
  "pnpm": {
    "overrides": {
      "react": "$react",
      "react-dom": "$react-dom",
      "@mui/material": "$@mui/material"
    }
  }
}
```

---

## Problemas com Yarn PnP

Yarn Plug'n'Play pode causar problemas de resolução de módulos.

### Solução

Adicione ao `.yarnrc.yml`:

```yaml
nodeLinker: node-modules
```

Execute:

```bash
yarn install
```

**Ou**, se quiser manter PnP, use `packageExtensions`:

```yaml
packageExtensions:
  'react-lgpd-consent@*':
    peerDependencies:
      react: '*'
      react-dom: '*'
```

---

## SSR / Next.js

### Banner aparece brevemente (flash) mesmo com consentimento

**Causa**: Hidratação do estado após o mount.

**Solução**: Use `initialState` prop para SSR:

```tsx
import { ConsentProvider } from 'react-lgpd-consent'
import { cookies } from 'next/headers'

export default function RootLayout({ children }) {
  // Server-side: ler cookie
  const consentCookie = cookies().get('lgpd_consent')
  const initialState = consentCookie?.value ? JSON.parse(consentCookie.value) : undefined

  return (
    <html>
      <body>
        <ConsentProvider
          categories={{ enabledCategories: ['analytics'] }}
          initialState={initialState}
        >
          {children}
        </ConsentProvider>
      </body>
    </html>
  )
}
```

### useConsent causa erro em componentes Server

**Causa**: `useConsent` só funciona em Client Components.

**Solução**: Adicione `"use client"` no topo do arquivo:

```tsx
'use client'

import { useConsent } from 'react-lgpd-consent'

export default function MyComponent() {
  const { preferences } = useConsent()
  // ...
}
```

---

## Banner não aparece

### Checklist

1. **Você está usando o pacote correto?**
   - `@react-lgpd-consent/core` é **headless** (sem UI)
   - Use `@react-lgpd-consent/mui` para componentes prontos

2. **ConsentProvider está no nível correto?**
   - Deve envolver toda a aplicação
   - Componentes que usam `useConsent` devem estar dentro do Provider

3. **O usuário já deu consentimento?**
   - O banner só aparece se `consented === false`
   - Limpe o cookie para testar: `document.cookie = "lgpd_consent=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"`

4. **hideBranding está habilitado sem licença?**
   - Componentes podem não renderizar se `hideBranding={true}` for usado incorretamente

### Debugar

```typescript
import { useConsent } from 'react-lgpd-consent'

function Debug() {
  const { consented, preferences } = useConsent()

  console.log('Consentimento:', { consented, preferences })

  return null
}
```

---

## Como desabilitar diagnósticos

Os diagnósticos automáticos são executados apenas em **desenvolvimento** e podem ser desabilitados.

### Desabilitar todos os avisos de desenvolvimento

```tsx
<ConsentProvider categories={{ enabledCategories: ['analytics'] }} disableDeveloperGuidance={true}>
  {children}
</ConsentProvider>
```

### Verificar peer deps programaticamente (sem logs)

```typescript
import { checkPeerDeps } from 'react-lgpd-consent'

const result = checkPeerDeps({ logWarnings: false })

if (!result.ok) {
  // Tratar erros de forma customizada
  result.errors.forEach((err) => {
    // Seu handler customizado
  })
}
```

---

## Recursos adicionais

- **Documentação principal**: [README.md](./README.md)
- **Quickstart**: [QUICKSTART.md](./QUICKSTART.md)
- **API Reference**: [API.md](./packages/react-lgpd-consent/API.md)
- **Guia de desenvolvimento**: [DEVELOPMENT.md](./DEVELOPMENT.md)
- **Issues no GitHub**: https://github.com/lucianoedipo/react-lgpd-consent/issues

---

## Ainda com problemas?

Se nenhuma solução acima resolver, por favor:

1. Ative o logging de debug:

   ```typescript
   import { setDebugLogging, LogLevel } from 'react-lgpd-consent'
   setDebugLogging(true, LogLevel.DEBUG)
   ```

2. Capture os logs do console

3. Abra uma issue com:
   - Versões: Node, React, MUI, react-lgpd-consent
   - Gerenciador de pacotes: npm/yarn/pnpm
   - Logs completos do erro
   - Reprodução mínima se possível

**GitHub Issues**: https://github.com/lucianoedipo/react-lgpd-consent/issues
