import * as React from 'react'
import type { CategoryDefinition } from '../types/types'

// Context para categorias customizadas
const CategoriesCtx = React.createContext<CategoryDefinition[]>([])

// Provider para as categorias customizadas
export function CategoriesProvider({
  categories,
  children,
}: Readonly<{
  categories?: CategoryDefinition[]
  children: React.ReactNode
}>) {
  const value = React.useMemo(() => categories || [], [categories])

  return (
    <CategoriesCtx.Provider value={value}>{children}</CategoriesCtx.Provider>
  )
}

/**
 * Hook para acessar as categorias customizadas.
 * Retorna apenas as categorias customizadas (não as padrão analytics/marketing).
 */
export function useCustomCategories() {
  return React.useContext(CategoriesCtx)
}

/**
 * Hook para obter todas as categorias (padrão + customizadas).
 */
export function useAllCategories() {
  const customCategories = useCustomCategories()

  return React.useMemo(() => {
    // Categorias baseadas no Guia Orientativo da ANPD sobre Cookies
    const defaultCategories: CategoryDefinition[] = [
      {
        id: 'necessary',
        name: 'Cookies Necessários',
        description:
          'Essenciais para o funcionamento básico do site. Incluem cookies de sessão, autenticação e segurança.',
        essential: true,
        cookies: ['PHPSESSID', 'JSESSIONID', 'cookieConsent', 'csrf_token'],
      },
      {
        id: 'analytics',
        name: 'Analytics e Estatísticas',
        description:
          'Permitem medir audiência e desempenho, gerando estatísticas anônimas de uso.',
        essential: false,
        cookies: ['_ga', '_ga_*', '_gid', '_gat', 'gtag'],
      },
      {
        id: 'functional',
        name: 'Cookies Funcionais',
        description:
          'Melhoram a experiência do usuário, lembrando preferências e configurações.',
        essential: false,
        cookies: ['language', 'theme', 'timezone', 'preferences'],
      },
      {
        id: 'marketing',
        name: 'Marketing e Publicidade',
        description:
          'Utilizados para publicidade direcionada e medição de campanhas publicitárias.',
        essential: false,
        cookies: ['_fbp', 'fr', 'tr', 'ads_*', 'doubleclick'],
      },
      {
        id: 'social',
        name: 'Redes Sociais',
        description:
          'Permitem compartilhamento e integração com redes sociais como Facebook, YouTube, etc.',
        essential: false,
        cookies: ['__Secure-*', 'sb', 'datr', 'c_user', 'social_*'],
      },
      {
        id: 'personalization',
        name: 'Personalização',
        description:
          'Adaptam o conteúdo e interface às preferências individuais do usuário.',
        essential: false,
        cookies: ['personalization_*', 'content_*', 'layout_*'],
      },
    ]

    return [...defaultCategories, ...customCategories]
  }, [customCategories])
}
