// Este arquivo existe apenas para compatibilidade com ferramentas que tentam importar
// `.storybook/preview.ts` — o conteúdo real do preview (com JSX) está em `preview.tsx`.
// Re-exportamos o módulo TSX para evitar que o bundler tente transformar JSX em um arquivo .ts.
// Aponta explicitamente para o arquivo TSX para evitar resolução ambígua que criava
// um ciclo (./preview -> ./preview.ts) em algumas ferramentas.
export { default } from './preview.tsx'
