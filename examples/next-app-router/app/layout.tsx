export const metadata = {
  title: 'react-lgpd-consent — Next.js App Router Quickstart',
  description: 'Exemplo com Consent Mode v2 e bloqueio de scripts até consentir',
}

// Layout pode ser Server Component. O provedor de consentimento será client-only.
import dynamic from 'next/dynamic'
import React from 'react'

// Carrega o provedor de consentimento apenas no cliente para evitar SSR/hydration mismatch
const ClientConsent = dynamic(() => import('../components/ClientConsent'), { ssr: false })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <ClientConsent>{children}</ClientConsent>
      </body>
    </html>
  )
}

