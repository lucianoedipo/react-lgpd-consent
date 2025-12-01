import * as React from 'react'
import type { DesignTokens } from '../types/types'

/**
 * Contexto React para fornecer tokens de design personalizáveis aos componentes da UI.
 *
 * @remarks
 * Este contexto permite que os componentes acessem tokens de design de forma defensiva,
 * garantindo consistência visual e suporte a customizações. Os tokens incluem cores,
 * layouts e outros elementos visuais usados em componentes como CookieBanner e PreferencesModal.
 * Se nenhum token for fornecido, os componentes usam fallbacks padrão.
 *
 * @category Context
 * @since 0.1.0
 */
const DesignContext = React.createContext<DesignTokens | undefined>(undefined)

/**
 * Provider que envolve a árvore de componentes para fornecer tokens de design via contexto.
 *
 * @remarks
 * Use este provider no topo da aplicação ou seção onde os componentes de consentimento
 * precisam acessar tokens de design. Permite overrides globais de design sem alterar
 * os componentes individuais, mantendo tree-shaking e performance.
 *
 * @param tokens - Tokens de design opcionais para customização (cores, layouts, etc.)
 * @param children - Componentes filhos que terão acesso aos tokens via contexto
 *
 * @example Uso básico com tokens padrão
 * ```tsx
 * import { DesignProvider } from './context/DesignContext';
 *
 * function App() {
 *   return (
 *     <DesignProvider>
 *       <CookieBanner />
 *     </DesignProvider>
 *   );
 * }
 * ```
 *
 * @example Customização de cores
 * ```tsx
 * const customTokens = {
 *   colors: {
 *     primary: '#ff0000',
 *     secondary: '#00ff00'
 *   }
 * };
 *
 * function App() {
 *   return (
 *     <DesignProvider tokens={customTokens}>
 *       <PreferencesModal />
 *     </DesignProvider>
 *   );
 * }
 * ```
 *
 *
 * @component
 * @category Context
 * @since 0.1.0
 */
export function DesignProvider({
  tokens,
  children,
}: Readonly<{ tokens?: DesignTokens; children: React.ReactNode }>) {
  return <DesignContext.Provider value={tokens}>{children}</DesignContext.Provider>
}

/**
 * Hook para acessar os tokens de design do contexto atual.
 *
 * @remarks
 * Retorna os tokens de design fornecidos pelo DesignProvider mais próximo na árvore de componentes.
 * Se nenhum provider for encontrado ou tokens não forem definidos, retorna undefined.
 * Os componentes usam este hook para aplicar estilos consistentes via MUI `sx` ou outros mecanismos.
 *
 * @returns Os tokens de design atuais ou undefined se não houver provider ou tokens
 *
 * @throws {Error} Se usado fora de um DesignProvider (embora não lance erro, retorna undefined)
 *
 * @example Acesso a tokens em componente
 * ```tsx
 * import { useDesignTokens } from './context/DesignContext';
 *
 * function CustomButton() {
 *   const tokens = useDesignTokens();
 *   const primaryColor = tokens?.colors?.primary || '#default';
 *
 *   return (
 *     <button style={{ backgroundColor: primaryColor }}>
 *       Botão Customizado
 *     </button>
 *   );
 * }
 * ```
 *
 * @example Uso defensivo com fallbacks
 * ```tsx
 * function ThemedComponent() {
 *   const tokens = useDesignTokens();
 *
 *   return (
 *     <div style={{
 *       color: tokens?.colors?.text || '#333',
 *       fontSize: tokens?.typography?.fontSize || '16px'
 *     }}>
 *       Conteúdo temático
 *     </div>
 *   );
 * }
 * ```
 *
 * @hook
 * @category Hooks
 * @since 0.1.0
 */
export function useDesignTokens(): DesignTokens | undefined {
  return React.useContext(DesignContext)
}
