// Arquivo criado para ajudar o TypeScript do editor a resolver imports de teste
// Algumas versões do pacote expõem tipos de forma que o tsserver com "moduleResolution: bundler"
// pode não enxergar. Essa declaração mínima evita o erro TS2307 no editor.
declare module '@testing-library/react' {
  // Reexporta os símbolos públicos do testing-library/dom para permitir usos básicos em testes.
  export * from '@testing-library/dom'
  // Funções utilitárias com any para evitar necessidade de tipagens detalhadas aqui.
  export const render: any
  export const waitFor: any
  export const screen: any
  export const fireEvent: any
  export const within: any
  export const act: any
}
