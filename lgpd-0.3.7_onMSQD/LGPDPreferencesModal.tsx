"use client"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import Image from "next/image"
import { useEffect, useState } from "react"

import { CookieCategory } from "./CookieCategory"

interface ConsentCategories {
  necessary: boolean
  analytics: boolean
}

interface LGPDPreferencesModalProps {
  isOpen: boolean
  onClose: () => void
  categories: ConsentCategories
  onUpdateCategories: (categories: Partial<ConsentCategories>) => void
  onSavePreferences: () => void
}

const COOKIE_CATEGORIES = [
  {
    key: "necessary" as const,
    title: "Cookies estritamente necessários",
    description:
      "Estes cookies são necessários para que o website funcione e não podem ser desligados nos nossos sistemas. Normalmente, eles só são configurados em resposta a ações levadas a cabo por si e que correspondem a uma solicitação de serviços, tais como definir as suas preferências de privacidade, iniciar sessão ou preencher formulários.",
    isRequired: true,
    details: {
      cookies: [
        {
          name: "cookieConsent",
          purpose: "Armazena as preferências de consentimento do usuário",
          duration: "1 ano",
        },
        {
          name: "cookieConsent-date",
          purpose: "Data do consentimento do usuário",
          duration: "1 ano",
        },
        {
          name: "cookieConsent-interacted",
          purpose: "Indica se o usuário já interagiu com o banner de cookies",
          duration: "1 ano",
        },
        {
          name: "jwt_gov_token",
          purpose: "Token JWT para autenticação GOV.BR",
          duration: "Sessão",
        },
        {
          name: "jwt_token",
          purpose: "Token JWT principal para autenticação do usuário",
          duration: "Sessão",
        },
        {
          name: "refresh_token",
          purpose: "Token para renovação da sessão do usuário",
          duration: "Sessão",
        },
        {
          name: "BIGipServerK8S_BARE_30080_pool",
          purpose: "Cookie de balanceamento de carga (Minio)",
          duration: "Sessão",
        },
        {
          name: "BIGipServerVS029_30080",
          purpose: "Cookie de balanceamento de carga do servidor",
          duration: "Sessão",
        },
      ],
    },
  },
  {
    key: "analytics" as const,
    title: "Cookies de desempenho e análise",
    description:
      "Estes cookies permitem-nos contar visitas e fontes de tráfego, para que possamos medir e melhorar o desempenho do nosso website. Eles ajudam-nos a saber quais são as páginas mais e menos populares e a ver como os visitantes se movimentam pelo website. Todos os dados recolhidos por estes cookies são agregados e, por conseguinte, anónimos.",
    isRequired: false,
    details: {
      cookies: [
        {
          name: "_ga",
          purpose:
            "Cookie principal do Google Analytics para análise de tráfego e comportamento dos usuários",
          duration: "2 anos",
        },
        {
          name: "_ga_M8BPKTDDD7",
          purpose: "Cookie específico do Google Analytics 4 para este site",
          duration: "2 anos",
        },
        {
          name: "_clck",
          purpose: "Cookie do Microsoft Clarity para análise de sessão e comportamento",
          duration: "1 ano",
        },
        {
          name: "_clsk",
          purpose: "Cookie do Microsoft Clarity para rastreamento de sessão",
          duration: "1 dia",
        },
      ],
    },
  },
]

export function LGPDPreferencesModal({
  isOpen,
  onClose,
  categories,
  onUpdateCategories,
  onSavePreferences,
}: Readonly<LGPDPreferencesModalProps>) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [tempCategories, setTempCategories] = useState(categories)

  // Sincroniza o estado temporário quando as categorias mudam (ex: modal abrindo)
  useEffect(() => {
    setTempCategories(categories)
  }, [categories])

  const handleCategoryToggle = (
    categoryKey: keyof ConsentCategories,
    enabled: boolean,
  ) => {
    const updated = { ...tempCategories, [categoryKey]: enabled }
    setTempCategories(updated)
    // Não atualiza imediatamente - apenas no save
  }

  const handleExpandToggle = (categoryKey: string) => {
    setExpandedCategory(expandedCategory === categoryKey ? null : categoryKey)
  }

  const handleRejectAll = () => {
    const onlyNecessary = { necessary: true, analytics: false }
    setTempCategories(onlyNecessary)
    onUpdateCategories(onlyNecessary)
    onSavePreferences()
  }

  const handleSavePreferences = () => {
    // Aplica todas as mudanças de uma vez
    onUpdateCategories(tempCategories)
    onSavePreferences()
  }

  if (!isOpen) return null

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth={false}
      disableEnforceFocus={true}
      disableAutoFocus={true}
      sx={{
        zIndex: 999999, // Z-index muito alto para ficar acima de tudo
        "& .MuiDialog-container": {
          alignItems: { xs: "stretch", sm: "flex-start" },
          paddingTop: { xs: 0, sm: "60px" },
        },
        "& .MuiDialog-paper": {
          background: "#000",
          maxWidth: { xs: "100%", sm: "600px" },
          width: "100%",
          height: { xs: "100vh", sm: "auto" },
          maxHeight: { xs: "100vh", sm: "600px" },
          borderRadius: { xs: 0, sm: "8px" },
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
          color: "#fff",
          margin: { xs: 0, sm: "20px" },
          fontFamily:
            "'Segoe UI', 'Segoe UI Symbol', 'Segoe UI Emoji', 'Apple Color Emoji', sans-serif, 'Noto Color Emoji'",
          zIndex: 1000000, // Z-index ainda maior para o conteúdo do modal
          position: "relative", // Garante que o z-index funcione
        },
        "& .MuiBackdrop-root": {
          background: "rgba(0, 0, 0, 0.8)", // Dark filter mais escuro para bloquear tudo
          pointerEvents: "auto", // Garante que o backdrop funcione normalmente
          // Removido z-index do backdrop - deixa o MUI gerenciar
        },
      }}
      aria-labelledby="preferences-title"
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #333",
          background: "#000",
          fontFamily: "inherit",
        }}
      >
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Box
            sx={{
              width: "60px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              src="/img/GOV-MS-2023-PRINCIPAL.png"
              alt="Governo de MS"
              width={60}
              height={40}
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </Box>
        </Stack>

        <IconButton
          onClick={onClose}
          sx={{
            color: "#fff",
            fontSize: "24px",
            padding: "4px 8px",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
          aria-label="Fechar"
        >
          ×
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent
        sx={{
          padding: "24px",
          color: "#fff",
          fontFamily: "inherit",
          overflowY: "auto",
          maxHeight: { xs: "calc(100vh - 70px)", sm: "calc(600px - 70px)" },
        }}
      >
        <Typography
          id="preferences-title"
          variant="h5"
          sx={{
            fontSize: "20px",
            marginBottom: "16px",
            color: "#fff",
            fontWeight: 600,
            fontFamily: "inherit",
          }}
        >
          Centro de preferências de privacidade
        </Typography>

        <Typography
          variant="body2"
          sx={{
            marginBottom: "24px",
            lineHeight: 1.5,
            fontSize: "14px",
            color: "#ccc",
            fontFamily: "inherit",
          }}
        >
          Quando visita um website, este pode armazenar ou recolher informações no seu
          navegador, principalmente na forma de cookies. Esta informação pode ser sobre
          si, as suas preferências ou o seu dispositivo e é utilizada principalmente para
          fazer o website funcionar conforme o esperado. A informação normalmente não o
          identifica diretamente, mas pode dar-lhe uma experiência web mais personalizada.
          Uma vez que respeitamos o seu direito à privacidade, pode optar por não permitir
          alguns tipos de cookies. Clique nos cabeçalhos das diferentes categorias para
          saber mais e alterar as nossas configurações predefinidas. No entanto, o
          bloqueio de alguns tipos de cookies pode afetar a sua experiência no website e
          os serviços que podemos oferecer.
        </Typography>

        <Typography
          variant="h6"
          sx={{
            fontSize: "16px",
            marginBottom: "16px",
            color: "#fff",
            fontFamily: "inherit",
          }}
        >
          Gerir preferências de cookies
        </Typography>

        {/* Categorias */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "2px",
            marginBottom: "24px",
          }}
        >
          {COOKIE_CATEGORIES.map((category) => (
            <CookieCategory
              key={category.key}
              title={category.title}
              description={category.description}
              isEnabled={tempCategories[category.key]}
              isRequired={category.isRequired}
              isExpanded={expandedCategory === category.key}
              onToggle={(enabled) => handleCategoryToggle(category.key, enabled)}
              onExpandToggle={() => handleExpandToggle(category.key)}
              details={category.details}
            />
          ))}
        </Box>

        {/* Botões */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{
            justifyContent: "flex-end",
            alignItems: "stretch",
          }}
        >
          <Button
            onClick={handleRejectAll}
            variant="contained"
            sx={{
              border: "1px solid",
              borderColor: "#ffffff",
              background: "#004F9F",
              color: "white",
              fontSize: "14px",
              fontWeight: "bold",
              fontFamily: "inherit",
              textTransform: "none",
              minWidth: { xs: "100%", sm: "auto" },
              padding: "8px 16px",
              "&:hover": {
                backgroundColor: "#003d7a",
              },
            }}
          >
            Rejeitar todos
          </Button>

          <Button
            onClick={handleSavePreferences}
            sx={{
              border: "1px solid",
              borderColor: "#ffffff",
              background: "#004F9F",
              color: "white",
              fontSize: "14px",
              fontWeight: "bold",
              fontFamily: "inherit",
              textTransform: "none",
              minWidth: { xs: "100%", sm: "auto" },
              padding: "8px 16px",
              "&:hover": {
                backgroundColor: "#003d7a",
              },
            }}
          >
            Confirmar as minhas escolhas
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
