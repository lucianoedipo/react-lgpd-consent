# Demos e Exemplos Internos

Este diretório contém **exemplos simples** usados para:

- 🔧 **Desenvolvimento da biblioteca**
- 📖 **Demos do Storybook**
- 🧪 **Testes rápidos de funcionalidades**
- 🎨 **Protótipos de novos componentes**

## 📂 Arquivos

- `App.tsx` - Exemplo básico mínimo
- `CompleteExample.tsx` - Exemplo completo com todas as features
- `CustomCategoriesExample.tsx` - Exemplo de categorias customizadas
- `AutoConfigExample.tsx` - Exemplo de auto-configuração
- `AdvancedGuidanceExample.tsx` - Exemplo de developer guidance
- `DataLayerEventsExample.tsx` - Exemplo de eventos dataLayer
- `MigrationDemo-v0.4.1.tsx` - Demo de migração de versão
- E outros...

## 🎯 Para Usuários da Biblioteca

**⚠️ Estes exemplos são para desenvolvimento interno da lib.**

**Para projetos completos prontos para usar, veja:**

- 📁 **[../examples/](../examples/)** - Projetos completos (Next.js, Vite)

## 🚀 Como Usar (Desenvolvimento)

Os arquivos deste diretório são importados pelo Storybook e usados em desenvolvimento:

```tsx
// Exemplo de uso no Storybook
import CompleteExample from '../../example/CompleteExample'

export const Complete: Story = {
  render: () => <CompleteExample />,
}
```

## 📝 Adicionar Novo Exemplo

1. Crie arquivo `SeuExemplo.tsx` neste diretório
2. Importe dependências do pacote principal:
   ```tsx
   import { ConsentProvider, useConsent } from 'react-lgpd-consent'
   ```
3. Use no Storybook ou para testes locais

---

**Mantido por:** @lucianoedipo  
**Para:** Desenvolvimento interno da biblioteca
