import React from 'react'
import { ConsentProvider } from '../src'

export default function OnlyNecessaryMinimal() {
  return (
    <ConsentProvider
      categories={{ enabledCategories: [] }}
      texts={{ bannerMessage: 'Usamos apenas cookies necessários para funcionamento.' }}
      blocking={false}
    >
      <main style={{ padding: 24 }}>
        <h1>Exemplo: Somente Necessários</h1>
        <p>Nenhuma categoria opcional está habilitada. A UI mostra apenas “necessários”.</p>
      </main>
    </ConsentProvider>
  )
}

