import React from 'react'
import {
  ConsentProvider,
  useCategories,
  useCategoryStatus,
  useConsent,
} from '../src'

// Exemplo de uso das novas funcionalidades
function TestComponent() {
  return (
    <ConsentProvider
      categories={{
        enabledCategories: ['analytics'],
        customCategories: [
          {
            id: 'custom-tracking',
            name: 'Custom Tracking',
            description: 'Rastreamento personalizado do projeto',
            essential: false,
          },
        ],
      }}
    >
      <TestDynamicUI />
      <TestCategoryStatus />
    </ConsentProvider>
  )
}

// Testa UI dinâmica
function TestDynamicUI() {
  const { toggleableCategories, guidance } = useCategories()
  const { preferences } = useConsent()

  console.log('Categorias que precisam de toggle:', toggleableCategories)
  console.log('Orientações:', guidance)
  console.log('Preferências atuais:', preferences)

  return (
    <div>
      <h3>Categorias Ativas Que Precisam de Toggle:</h3>
      <ul>
        {toggleableCategories.map((cat) => (
          <li key={cat.id}>
            <strong>{cat.name}</strong>: {cat.description}
          </li>
        ))}
      </ul>
    </div>
  )
}

// Testa status condicional
function TestCategoryStatus() {
  const analytics = useCategoryStatus('analytics')
  const marketing = useCategoryStatus('marketing')
  const custom = useCategoryStatus('custom-tracking')

  return (
    <div>
      <h3>Status das Categorias:</h3>
      <p>Analytics ativo: {analytics.isActive ? '✅' : '❌'}</p>
      <p>Marketing ativo: {marketing.isActive ? '✅' : '❌'}</p>
      <p>Custom Tracking ativo: {custom.isActive ? '✅' : '❌'}</p>
    </div>
  )
}

export default TestComponent
