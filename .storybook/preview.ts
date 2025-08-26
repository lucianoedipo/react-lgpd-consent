// Este arquivo existe apenas para compatibilidade com ferramentas que tentam importar
// `.storybook/preview.ts` — o conteúdo real do preview (com JSX) está em `preview.tsx`.
// Re-exportamos o módulo TSX para evitar que o bundler tente transformar JSX em um arquivo .ts.
export { default } from './preview'