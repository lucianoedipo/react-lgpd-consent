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
import type { Category, ConsentPreferences } from '@react-lgpd-consent/core'
import {
  getCookiesInfoForCategory,
  resolveTexts,
  useCategories,
  useConsent,
  useConsentTexts,
  useDesignTokens,
  type AdvancedConsentTexts,
} from '@react-lgpd-consent/core'
import * as React from 'react'
import { Branding } from './Branding'

// Declaração global movida para evitar conflitos entre arquivos
declare global {
  /**
   * @internal
   * Variável global para rastrear integrações usadas.
   * Usado internamente para logging e análise de performance.
   */
  var __LGPD_USED_INTEGRATIONS__: string[] | undefined
}

/**
 * Propriedades para customizar o comportamento e aparência do componente PreferencesModal.
 *
 * @remarks
 * Esta interface permite controle total sobre o modal de preferências de consentimento LGPD.
 * O modal pode ser usado de duas formas:
 * - **Automático**: Renderizado pelo ConsentProvider quando usuário clica em "Preferências"
 * - **Manual**: Controlado externamente via props `isModalOpen`, `preferences`, etc.
 *
 * ### Integração com Material-UI
 * - Suporte completo a theming via `ThemeProvider`
 * - Props diretas para Dialog do MUI via `DialogProps`
 * - Compatibilidade com design tokens customizados
 *
 * @category Components
 * @public
 * @since 0.1.0
 *
 * @example Uso automático (renderizado pelo Provider)
 * ```tsx
 * <ConsentProvider
 *   categories={{ enabledCategories: ['analytics'] }}
 *   preferencesModalProps={{ hideBranding: true }}
 * >
 *   <App />
 * </ConsentProvider>
 * ```
 *
 * @example Uso manual com controle externo
 * ```tsx
 * function CustomPreferencesModal() {
 *   const [open, setOpen] = useState(false)
 *   const { preferences, setPreferences } = useConsent()
 *
 *   return (
 *     <PreferencesModal
 *       isModalOpen={open}
 *       preferences={preferences}
 *       setPreferences={setPreferences}
 *       closePreferences={() => setOpen(false)}
 *       DialogProps={{ maxWidth: 'md' }}
 *     />
 *   )
 * }
 * ```
 */
export interface PreferencesModalProps {
  /**
   * Propriedades opcionais para customizar o componente `Dialog` do Material-UI.
   *
   * @remarks
   * Permite customização avançada do comportamento do modal: posição, transição,
   * largura máxima, e outros atributos do Dialog do MUI.
   *
   * @defaultValue undefined
   *
   * @example
   * ```tsx
   * <PreferencesModal
   *   DialogProps={{
   *     maxWidth: 'md',
   *     fullWidth: true,
   *     TransitionComponent: Slide
   *   }}
   * />
   * ```
   */
  DialogProps?: Partial<DialogProps>

  /**
   * Se `true`, oculta a marca "fornecido por LÉdipO.eti.br" no modal.
   *
   * @remarks
   * A biblioteca é open-source e gratuita. O branding é uma forma de apoiar
   * o projeto, mas pode ser removido se necessário para sua marca.
   *
   * @defaultValue false
   */
  hideBranding?: boolean

  /**
   * Estado de abertura do modal passado pelo Provider.
   *
   * @remarks
   * Quando fornecido via `PreferencesModalComponent` no ConsentProvider,
   * substitui o valor do hook `useConsent`. Permite controle externo do estado.
   *
   * @defaultValue undefined (usa valor do contexto)
   */
  isModalOpen?: boolean

  /**
   * Preferências de consentimento passadas pelo Provider.
   *
   * @remarks
   * Quando fornecido via `PreferencesModalComponent`, permite sincronização
   * externa do estado de preferências. Se omitido, usa o contexto interno.
   *
   * @defaultValue undefined (usa valor do contexto)
   */
  preferences?: ConsentPreferences

  /**
   * Função para atualizar preferências passada pelo Provider.
   *
   * @remarks
   * Permite override da função de atualização de preferências.
   * Útil para integração com gerenciadores de estado externos.
   *
   * @param preferences - Novas preferências de consentimento a serem aplicadas
   * @defaultValue undefined (usa função do contexto)
   */
  setPreferences?: (preferences: ConsentPreferences) => void

  /**
   * Função para fechar o modal passada pelo Provider.
   *
   * @remarks
   * Callback invocado quando usuário cancela ou após salvar preferências.
   * Se omitido, usa a função do contexto.
   *
   * @defaultValue undefined (usa função do contexto)
   */
  closePreferences?: () => void

  /**
   * Textos customizados para o modal.
   * Permite sobrescrever textos do contexto e aplicar i18n localmente.
   */
  texts?: Partial<AdvancedConsentTexts>

  /**
   * Idioma local para resolver `texts.i18n`.
   */
  language?: 'pt' | 'en' | 'es' | 'fr' | 'de' | 'it'

  /**
   * Variação de tom local para resolver `texts.variants`.
   */
  textVariant?: 'formal' | 'casual' | 'concise' | 'detailed'
}

/**
 * Modal de preferências de consentimento LGPD que permite ao usuário ajustar suas escolhas.
 *
 * @component
 * @category Components
 * @public
 * @since 0.1.0
 *
 * @remarks
 * O `PreferencesModal` é o componente de UI que apresenta uma interface detalhada
 * para o usuário gerenciar suas preferências de consentimento categoria por categoria.
 *
 * ### Funcionalidades Principais
 * - **Toggles por categoria**: Switch para cada categoria não-essencial configurada
 * - **Categoria necessária bloqueada**: Sempre marcada e desabilitada (required by LGPD)
 * - **Detalhes de cookies**: Accordion expansível mostrando cookies por categoria
 * - **Mudanças temporárias**: Edições salvas localmente até confirmar com botão "Salvar"
 * - **Sincronização automática**: Recarrega estado ao abrir o modal
 * - **Acessibilidade**: ARIA labels, keyboard navigation, screen reader support
 *
 * ### Renderização Automática
 * Este modal é renderizado automaticamente pelo `ConsentProvider` quando o usuário
 * clica para gerenciar preferências. Não é necessário renderizá-lo manualmente,
 * a menos que deseje controle total sobre o comportamento.
 *
 * ### Customização
 * Você pode substituir este componente passando seu próprio para a prop
 * `PreferencesModalComponent` no `ConsentProvider`:
 *
 * ```tsx
 * function MyCustomModal() {
 *   const { preferences, setPreferences, closePreferences } = useConsent()
 *   return <div>Meu modal customizado</div>
 * }
 *
 * <ConsentProvider
 *   PreferencesModalComponent={MyCustomModal}
 *   categories={{ enabledCategories: ['analytics'] }}
 * >
 *   <App />
 * </ConsentProvider>
 * ```
 *
 * ### Informações de Cookies
 * O modal exibe automaticamente:
 * - **Nome do cookie**: Identificador único
 * - **Finalidade**: Para que serve (Analytics, Marketing, etc.)
 * - **Duração**: Tempo de vida (sessão, 1 ano, etc.)
 * - **Fornecedor**: Quem criou/gerencia (Google, Facebook, próprio site)
 *
 * Estas informações vêm das integrações ativas (via `getCookiesInfoForCategory`)
 * e das categorias configuradas no Provider.
 *
 * @param props - Propriedades para customizar o modal (tipado via PreferencesModalProps)
 * @returns Elemento JSX do modal de preferências ou null se não deve ser exibido
 *
 * @throws {Error} Se usado fora do ConsentProvider (contexto não disponível)
 *
 * @example Uso básico (renderizado automaticamente)
 * ```tsx
 * // ConsentProvider já renderiza PreferencesModal automaticamente
 * function App() {
 *   return (
 *     <ConsentProvider categories={{ enabledCategories: ['analytics'] }}>
 *       <YourApp />
 *     </ConsentProvider>
 *   )
 * }
 * ```
 *
 * @example Customização via props
 * ```tsx
 * <ConsentProvider
 *   categories={{ enabledCategories: ['analytics', 'marketing'] }}
 *   preferencesModalProps={{
 *     hideBranding: true,
 *     DialogProps: {
 *       maxWidth: 'md',
 *       fullWidth: true
 *     }
 *   }}
 * >
 *   <App />
 * </ConsentProvider>
 * ```
 *
 * @example Controle manual completo
 * ```tsx
 * function CustomApp() {
 *   const [open, setOpen] = useState(false)
 *   const { preferences, setPreferences } = useConsent()
 *
 *   return (
 *     <>
 *       <button onClick={() => setOpen(true)}>Abrir Preferências</button>
 *       <PreferencesModal
 *         isModalOpen={open}
 *         preferences={preferences}
 *         setPreferences={setPreferences}
 *         closePreferences={() => setOpen(false)}
 *         DialogProps={{ maxWidth: 'lg' }}
 *       />
 *     </>
 *   )
 * }
 * ```
 *
 * @see {@link ConsentProvider} - Provider que renderiza este componente automaticamente
 * @see {@link useConsent} - Hook para acessar funções de consentimento
 * @see {@link PreferencesModalProps} - Interface completa de propriedades
 * @see {@link getCookiesInfoForCategory} - Função que retorna informações de cookies
 */
export function PreferencesModal({
  DialogProps,
  hideBranding = false,
  isModalOpen: isModalOpenProp,
  preferences: preferencesProp,
  setPreferences: setPreferencesProp,
  closePreferences: closePreferencesProp,
  texts: textsProp,
  language,
  textVariant,
}: Readonly<PreferencesModalProps>) {
  const hookValue = useConsent()
  const preferences = preferencesProp ?? hookValue.preferences
  const setPreferences = setPreferencesProp ?? hookValue.setPreferences
  const closePreferences = closePreferencesProp ?? hookValue.closePreferences
  const isModalOpen = isModalOpenProp ?? hookValue.isModalOpen

  const baseTexts = useConsentTexts()
  const mergedTexts = React.useMemo(
    () => ({ ...baseTexts, ...(textsProp ?? {}) }),
    [baseTexts, textsProp],
  )
  const texts = React.useMemo(
    () => resolveTexts(mergedTexts, { language, variant: textVariant }),
    [mergedTexts, language, textVariant],
  )
  const designTokens = useDesignTokens()
  const { toggleableCategories, allCategories } = useCategories() // Categorias que precisam de toggle + metadados

  // Função para gerar preferências sincronizadas com o contexto
  const getInitialPreferences = React.useCallback((): ConsentPreferences => {
    const syncedPrefs: ConsentPreferences = { necessary: true }
    toggleableCategories.forEach((category) => {
      syncedPrefs[category.id] = preferences[category.id] ?? false
    })
    return syncedPrefs
  }, [preferences, toggleableCategories])

  // Estado local para mudanças temporárias
  const [tempPreferences, setTempPreferences] =
    React.useState<ConsentPreferences>(getInitialPreferences)

  // Resincroniza quando modal abre (transição de fechado para aberto)
  const wasOpenRef = React.useRef(isModalOpen)
  React.useEffect(() => {
    const justOpened = isModalOpen && !wasOpenRef.current
    wasOpenRef.current = isModalOpen

    if (justOpened) {
      // Usar queueMicrotask para adiar setState e evitar execução síncrona durante o effect
      queueMicrotask(() => {
        setTempPreferences(getInitialPreferences())
      })
    }
  }, [isModalOpen, getInitialPreferences])

  // Se DialogProps.open for fornecido, usa ele. Senão, usa o estado do contexto
  const { open: dialogOpenProp, ...dialogRest } = DialogProps ?? {}
  const open = dialogOpenProp ?? isModalOpen ?? false

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

  const resolveModalZIndex = React.useCallback(
    (theme: Theme) => designTokens?.layout?.zIndex?.modal ?? (theme?.zIndex?.modal ?? 1300) + 10,
    [designTokens?.layout?.zIndex?.modal],
  )

  const modalZIndexToken = designTokens?.layout?.zIndex?.modal

  const rootSx = [
    DialogProps?.slotProps?.root && (DialogProps.slotProps.root as { sx?: SxProps<Theme> }).sx,
    (theme: Theme) => ({ zIndex: resolveModalZIndex(theme) }),
  ].filter(Boolean) as SxProps<Theme> | undefined

  const rootSlotProps = {
    ...dialogRest?.slotProps?.root,
    sx: rootSx,
    ...(modalZIndexToken ? { style: { zIndex: modalZIndexToken } } : {}),
    'data-testid':
      (dialogRest?.slotProps?.root as { ['data-testid']?: string })?.['data-testid'] ??
      'lgpd-preferences-modal-root',
  }

  const mergedDialogProps: DialogProps = {
    open,
    fullWidth: true,
    maxWidth: 'sm',
    ...dialogRest,
    slotProps: {
      ...dialogRest?.slotProps,
      root: rootSlotProps,
    },
  }

  return (
    <Dialog aria-labelledby="cookie-pref-title" onClose={handleCancel} {...mergedDialogProps}>
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
            const tableHeaders = texts.cookieDetails?.tableHeaders
            const toggleDetailsText = texts.cookieDetails?.toggleDetails?.expand ?? 'Ver detalhes'
            const scriptLabelPrefix = texts.cookieDetails?.scriptLabelPrefix ?? '(script) '
            const scriptPurpose = texts.cookieDetails?.scriptPurpose ?? 'Script de integração ativo'

            // Buscar cookiesInfo das integrações ativas
            const enrichedDescriptors = descriptors.map((desc) => {
              // Se já tem informações completas, retorna como está
              if (desc.purpose && desc.duration && desc.provider) {
                return desc
              }

              // Caso contrário, retorna apenas o que tem
              return {
                name: desc.name,
                purpose: desc.purpose || '-',
                duration: desc.duration || '-',
                provider: desc.provider || '-',
              }
            })

            // Merge names not in descriptors
            const merged = [
              ...enrichedDescriptors,
              ...namesFromGuidance
                .filter((n) => !enrichedDescriptors.some((d) => d.name === n))
                .map((n) => ({ name: n, purpose: '-', duration: '-', provider: '-' })),
            ]

            // Se ainda estiver vazio, tentar listar scripts ativos mapeados para esta categoria (experimental)
            let mergedFinal = merged
            try {
              if (merged.length === 0) {
                const gmap =
                  (globalThis as unknown as { __LGPD_INTEGRATIONS_MAP__?: Record<string, string> })
                    .__LGPD_INTEGRATIONS_MAP__ || {}
                const scriptRows = Object.entries(gmap)
                  .filter(([, cat]) => cat === category.id)
                  .map(([id]) => ({
                    name: `${scriptLabelPrefix}${id}`,
                    purpose: scriptPurpose,
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
                  <summary>{toggleDetailsText}</summary>
                  <Box sx={{ mt: 1 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th style={{ textAlign: 'left' }}>{tableHeaders?.name ?? 'Cookie'}</th>
                          <th style={{ textAlign: 'left' }}>
                            {tableHeaders?.purpose ?? 'Finalidade'}
                          </th>
                          <th style={{ textAlign: 'left' }}>
                            {tableHeaders?.duration ?? 'Duração'}
                          </th>
                          <th style={{ textAlign: 'left' }}>
                            {tableHeaders?.provider ?? 'Fornecedor'}
                          </th>
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
            <summary>{texts.cookieDetails?.toggleDetails?.expand ?? 'Ver detalhes'}</summary>
            <Box sx={{ mt: 1 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>
                      {texts.cookieDetails?.tableHeaders?.name ?? 'Cookie'}
                    </th>
                    <th style={{ textAlign: 'left' }}>
                      {texts.cookieDetails?.tableHeaders?.purpose ?? 'Finalidade'}
                    </th>
                    <th style={{ textAlign: 'left' }}>
                      {texts.cookieDetails?.tableHeaders?.duration ?? 'Duração'}
                    </th>
                    <th style={{ textAlign: 'left' }}>
                      {texts.cookieDetails?.tableHeaders?.provider ?? 'Fornecedor'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const used: string[] = globalThis.__LGPD_USED_INTEGRATIONS__ || []
                    const necessaryCookies = getCookiesInfoForCategory(
                      'necessary' as unknown as Category,
                      used,
                    )
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
      {!hideBranding && (
        <Branding variant="modal" texts={textsProp} language={language} textVariant={textVariant} />
      )}
    </Dialog>
  )
}
