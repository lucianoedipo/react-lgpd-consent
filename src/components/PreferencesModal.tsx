import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog, { DialogProps } from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import type { SxProps, Theme } from '@mui/material/styles'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { useCategories } from '../context/CategoriesContext'
import { useDesignTokens } from '../context/DesignContext'
import { useConsent, useConsentTexts } from '../hooks/useConsent'
import type { Category } from '../types/types'
import { ConsentPreferences } from '../types/types'
import { getCookiesInfoForCategory } from '../utils/cookieRegistry'
import { Branding } from './Branding'

declare global {
  var __LGPD_USED_INTEGRATIONS__: string[] | undefined
}

/**
 * @interface PreferencesModalProps
 * Propriedades para customizar o componente `PreferencesModal`.
 */
export interface PreferencesModalProps {
  /** Propriedades opcionais para customizar o componente `Dialog` do Material-UI. */
  DialogProps?: Partial<DialogProps>
  /** Se `true`, oculta a marca "fornecido por LÉdipO.eti.br" no modal. Padrão: `false`. */
  hideBranding?: boolean
}

/**
 * O `PreferencesModal` é o componente de UI que permite ao usuário ajustar suas preferências de consentimento.
 * @component
 * @category Components
 * @since 0.1.0
 * @remarks
 * Este modal é renderizado automaticamente pelo `ConsentProvider` quando o usuário clica para gerenciar as preferências.
 * Você pode substituí-lo passando seu próprio componente para a prop `PreferencesModalComponent`
 * no `ConsentProvider` para ter controle total sobre a aparência e o comportamento do modal.
 * @param {Readonly<PreferencesModalProps>} props As propriedades para customizar o modal.
 * @returns {JSX.Element} O componente do modal de preferências.
 * @example
 * ```tsx
 * <PreferencesModal DialogProps={{ maxWidth: 'md' }} hideBranding={true} />
 * ```
 */
export function PreferencesModal({
  DialogProps,
  hideBranding = false,
}: Readonly<PreferencesModalProps>) {
  const { preferences, setPreferences, closePreferences, isModalOpen } = useConsent()
  const texts = useConsentTexts()
  const designTokens = useDesignTokens()
  const { toggleableCategories, allCategories } = useCategories() // Categorias que precisam de toggle + metadados

  // Estado local para mudanças temporárias - INICIALIZADO com valores padrão
  const [tempPreferences, setTempPreferences] = useState<ConsentPreferences>(() => {
    // Inicializa com state atual ou valores padrão seguros
    const initialPrefs: ConsentPreferences = { necessary: true }

    // Para cada categoria que precisa de toggle, define valor inicial
    toggleableCategories.forEach((category) => {
      initialPrefs[category.id] = preferences[category.id] ?? false
    })

    return initialPrefs
  })

  // Sincroniza estado local com contexto quando modal abre ou preferences mudam
  useEffect(() => {
    if (isModalOpen) {
      const syncedPrefs: ConsentPreferences = { necessary: true }

      // Sincroniza apenas categorias ativas que precisam de toggle
      toggleableCategories.forEach((category) => {
        syncedPrefs[category.id] = preferences[category.id] ?? false
      })

      setTempPreferences(syncedPrefs)
    }
  }, [isModalOpen, preferences, toggleableCategories])

  // Se DialogProps.open for fornecido, usa ele. Senão, usa o estado do contexto
  const open = DialogProps?.open ?? isModalOpen ?? false

  const handleSave = () => {
    // Aplica as mudanças temporárias ao contexto definitivo
    setPreferences(tempPreferences)
    // closePreferences já é chamado automaticamente pela ação SET_PREFERENCES
  }

  const handleCancel = () => {
    // Descarta mudanças temporárias
    setTempPreferences(preferences)
    closePreferences()
  }

  const modalTitleSx: SxProps<Theme> = (theme) => ({
    fontSize: designTokens?.typography?.fontSize?.modal ?? undefined,
    color: designTokens?.colors?.text ?? theme.palette.text.primary,
  })

  const modalContentSx: SxProps<Theme> = (theme) => ({
    p: designTokens?.spacing?.padding?.modal ?? undefined,
    backgroundColor: designTokens?.colors?.background ?? theme.palette.background.paper,
    color: designTokens?.colors?.text ?? theme.palette.text.primary,
  })

  return (
    <Dialog aria-labelledby="cookie-pref-title" open={open} onClose={handleCancel} {...DialogProps}>
      <DialogTitle id="cookie-pref-title" sx={modalTitleSx}>
        {texts.modalTitle}
      </DialogTitle>
      <DialogContent dividers sx={modalContentSx}>
        <Typography
          variant="body2"
          sx={(theme) => ({
            mb: 2,
            fontSize: designTokens?.typography?.fontSize?.modal ?? undefined,
            color: designTokens?.colors?.text ?? theme.palette.text.primary,
          })}
        >
          {texts.modalIntro}
        </Typography>
        <FormGroup>
          {/* Renderiza dinamicamente apenas categorias que precisam de toggle */}
          {toggleableCategories.map((category) => {
            type CatInfo = {
              id: string
              cookies?: string[]
              name: string
              description: string
              essential: boolean
              uiRequired: boolean
            }
            const full = allCategories.find((c) => c.id === category.id) as CatInfo | undefined
            const namesFromGuidance = full?.cookies ?? []
            // Integrations used (global), SSR-safe
            const used: string[] = globalThis.__LGPD_USED_INTEGRATIONS__ || []
            const descriptors = getCookiesInfoForCategory(category.id as unknown as Category, used)
            
            // Buscar cookiesInfo das integrações ativas
            const enrichedDescriptors = descriptors.map(desc => {
              // Se já tem informações completas, retorna como está
              if (desc.purpose && desc.duration && desc.provider) {
                return desc
              }
              
              // Caso contrário, retorna apenas o que tem
              return {
                name: desc.name,
                purpose: desc.purpose || '-',
                duration: desc.duration || '-',
                provider: desc.provider || '-'
              }
            })
            
            // Merge names not in descriptors
            const merged = [
              ...enrichedDescriptors,
              ...namesFromGuidance
                .filter((n) => !enrichedDescriptors.find((d) => d.name === n))
                .map((n) => ({ name: n, purpose: '-', duration: '-', provider: '-' })),
            ]

            // Se ainda estiver vazio, tentar listar scripts ativos mapeados para esta categoria (experimental)
            let mergedFinal = merged
            try {
              if (merged.length === 0) {
                const gmap = (globalThis as unknown as { __LGPD_INTEGRATIONS_MAP__?: Record<string, string> })
                  .__LGPD_INTEGRATIONS_MAP__ || {}
                const scriptRows = Object.entries(gmap)
                  .filter(([, cat]) => cat === category.id)
                  .map(([id]) => ({
                    name: `(script) ${id}`,
                    purpose: 'Script de integração ativo',
                    duration: '-',
                    provider: '-',
                  }))
                if (scriptRows.length > 0) mergedFinal = scriptRows
              }
            } catch {
              // ignore
            }
            return (
              <Box key={category.id} sx={{ mb: 1 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={tempPreferences[category.id] ?? false}
                      onChange={(e) =>
                        setTempPreferences((prev) => ({
                          ...prev,
                          [category.id]: e.target.checked,
                        }))
                      }
                    />
                  }
                  label={`${category.name} - ${category.description}`}
                />
                <details style={{ marginLeft: 48 }}>
                  <summary>Ver detalhes</summary>
                  <Box sx={{ mt: 1 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th style={{ textAlign: 'left' }}>Cookie</th>
                          <th style={{ textAlign: 'left' }}>Finalidade</th>
                          <th style={{ textAlign: 'left' }}>Duração</th>
                          <th style={{ textAlign: 'left' }}>Fornecedor</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mergedFinal.map((d, idx) => (
                          <tr key={d.name + idx}>
                            <td>{d.name}</td>
                            <td>{d.purpose}</td>
                            <td>{d.duration}</td>
                            <td>{d.provider}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Box>
                </details>
              </Box>
            )
          })}

          {/* Categoria necessária sempre exibida por último (disabled) */}
          <FormControlLabel control={<Switch checked disabled />} label={texts.necessaryAlwaysOn} />

          {/* Detalhes da categoria Necessária, incluindo cookie de consentimento */}
          <details style={{ marginLeft: 48 }}>
            <summary>Ver detalhes</summary>
            <Box sx={{ mt: 1 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>Cookie</th>
                    <th style={{ textAlign: 'left' }}>Finalidade</th>
                    <th style={{ textAlign: 'left' }}>Duração</th>
                    <th style={{ textAlign: 'left' }}>Fornecedor</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const used: string[] = globalThis.__LGPD_USED_INTEGRATIONS__ || []
                    const necessaryCookies = getCookiesInfoForCategory('necessary' as unknown as Category, used)
                    return necessaryCookies.map((d, idx) => (
                      <tr key={d.name + idx}>
                        <td>{d.name}</td>
                        <td>{d.purpose || '-'}</td>
                        <td>{d.duration || '-'}</td>
                        <td>{d.provider || '-'}</td>
                      </tr>
                    ))
                  })()}
                </tbody>
              </table>
            </Box>
          </details>
        </FormGroup>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={handleCancel}>
          {texts.close}
        </Button>
        <Button variant="contained" onClick={handleSave}>
          {texts.save}
        </Button>
      </DialogActions>
      {/* Branding */}
      {!hideBranding && <Branding variant="modal" />}
    </Dialog>
  )
}
