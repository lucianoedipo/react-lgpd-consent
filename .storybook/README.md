# 📚 Storybook - Playground Interativo

O Storybook do `react-lgpd-consent` fornece uma documentação visual e interativa de todos os componentes da biblioteca, permitindo que você explore diferentes configurações, teste casos de uso e veja exemplos práticos em tempo real.

## 🌐 Acesso Online

O Storybook está publicado automaticamente no GitHub Pages a cada push na branch `main`:

**🔗 [Acesse o Storybook Online](https://lucianoedipo.github.io/react-lgpd-consent/storybook/)**

## 🚀 Executar Localmente

Para rodar o Storybook em sua máquina local:

```bash
# Clonar o repositório
git clone https://github.com/lucianoedipo/react-lgpd-consent.git
cd react-lgpd-consent

# Instalar dependências
npm install

# Executar Storybook
npm run storybook
```

O Storybook será aberto automaticamente em `http://localhost:6006`.

## 📖 Componentes Disponíveis

### 🍪 ConsentProvider

- **Casos de Uso**: E-commerce, Corporativo, Blog, Configurações customizadas
- **Configurações**: Blocking, categorias, textos personalizados
- **Demonstrações**: Diferentes estratégias de bloqueio, callbacks, temas

### 🎯 CookieBanner

- **Variações**: Banner padrão, modo bloqueante, textos customizados
- **Temas**: Claro, escuro, cores personalizadas
- **Posicionamento**: Diferentes posições e estilos

### ⚙️ PreferencesModal

- **Funcionalidades**: Gerenciamento por categoria, textos dinâmicos
- **Contextos**: E-commerce, corporativo, pessoal
- **Interatividade**: Demonstrações em tempo real

### 🎈 FloatingPreferencesButton

- **Posicionamento**: Diferentes cantos da tela
- **Responsividade**: Comportamento em diferentes tamanhos de tela
- **Personalização**: Cores e estilos customizados

## 🎨 Recursos do Storybook

### Controls (Controles)

Cada componente possui controles interativos que permitem:

- Modificar props em tempo real
- Testar diferentes configurações
- Ver o impacto imediato das mudanças

### Docs (Documentação)

- Documentação automática extraída do TypeScript
- Exemplos de código para cada variação
- Descrições detalhadas de props e comportamentos

### Accessibility (Acessibilidade)

- Teste automático de acessibilidade
- Verificação de contraste e navegação por teclado
- Relatórios de conformidade com WCAG

### Viewport (Responsividade)

- Teste em diferentes tamanhos de tela
- Simulação de dispositivos móveis e desktop
- Verificação de comportamento responsivo

## 🔧 Stories Organizadas

### Por Componente

```
Components/
├── ConsentProvider/
│   ├── Default
│   ├── WithBlocking
│   ├── CustomTexts
│   ├── ECommerce
│   └── Corporate
├── CookieBanner/
│   ├── Default
│   ├── WithBlocking
│   ├── WithPolicyLink
│   └── CustomTexts
├── PreferencesModal/
│   ├── Default
│   ├── WithAllCategories
│   ├── CustomTexts
│   └── InteractiveDemo
└── FloatingPreferencesButton/
    ├── Default
    ├── WithLongContent
    └── Disabled
```

### Por Caso de Uso

- **E-commerce**: Exemplos específicos para lojas online
- **Corporativo**: Configurações para ambiente empresarial
- **Blog/Site Pessoal**: Setup minimalista
- **Desenvolvimento**: Configurações para debug e teste

## 💡 Como Usar o Storybook

### 1. Exploração Básica

1. Navegue pelas stories na sidebar esquerda
2. Use os controles na aba "Controls" para modificar props
3. Veja o código gerado na aba "Docs"

### 2. Teste de Configurações

1. Escolha uma story similar ao seu caso de uso
2. Ajuste os controles para suas necessidades
3. Copie o código resultante para sua aplicação

### 3. Debug e Desenvolvimento

1. Use as stories para reproduzir bugs
2. Teste edge cases com diferentes combinações
3. Valide comportamentos antes de implementar

### 4. Documentação Visual

1. Use as stories como documentação viva
2. Compartilhe links específicos com sua equipe
3. Referência para design e UX

## 🔗 Integração com Outras Ferramentas

### TypeDoc

- Link direto para a documentação da API
- Referência técnica detalhada
- Tipos TypeScript completos

### GitHub Repository

- Código fonte e exemplos
- Issues e discussions
- Releases e changelog

### GitHub Pages

- Hospedagem automática
- Sempre atualizado com a versão mais recente
- Acessível publicamente

## 📝 Contribuindo com Stories

Para adicionar novas stories ou melhorar as existentes:

1. **Estrutura de Arquivos**:

   ```
   src/components/
   ├── ComponentName.tsx
   └── ComponentName.stories.tsx
   ```

2. **Template de Story**:

   ```typescript
   import type { Meta, StoryObj } from '@storybook/react'
   import { ComponentName } from './ComponentName'

   const meta: Meta<typeof ComponentName> = {
     title: 'Components/ComponentName',
     component: ComponentName,
     parameters: {
       docs: {
         description: {
           component: 'Descrição do componente...',
         },
       },
     },
   }

   export default meta
   type Story = StoryObj<typeof meta>

   export const Default: Story = {
     args: {
       // props padrão
     },
   }
   ```

3. **Boas Práticas**:
   - Use nomes descritivos para as stories
   - Inclua documentação em português
   - Teste diferentes cenários
   - Adicione controles úteis
   - Mantenha exemplos realistas

## 🚀 Build e Deploy

O Storybook é automaticamente construído e publicado via GitHub Actions:

```bash
# Build local para teste
npm run build-storybook

# Resultado em ./storybook-static
```

## 📞 Suporte

- **GitHub Issues**: Para bugs e melhorias
- **GitHub Discussions**: Para dúvidas e sugestões
- **Storybook**: Para explorar componentes interativamente

---

O Storybook é uma ferramenta poderosa que acelera o desenvolvimento, facilita a documentação e melhora a colaboração entre desenvolvedores e designers. Use-o para explorar todas as possibilidades da biblioteca `react-lgpd-consent`!
