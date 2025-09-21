"use client"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

import { LGPDConfig } from "./LGPDConfig"

interface LGPDConsentBannerProps {
  onAcceptAll: () => void
  onOpenPreferences: () => void
  onClose: () => void
  onRejectAll: () => void
  isVisible: boolean
}

export function LGPDConsentBanner({
  onAcceptAll,
  onOpenPreferences,
  onClose,
  onRejectAll,
  isVisible,
}: Readonly<LGPDConsentBannerProps>) {
  if (!isVisible) return null

  const { banner, texts } = LGPDConfig

  const handleClose = () => {
    onRejectAll()
    onClose()
  }

  return (
    <>
      {/* Dark overlay - filtro escuro bloqueante */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          zIndex: banner.zIndex - 1,
          backdropFilter: "blur(2px)",
        }}
      />

      {/* Banner LGPD */}
      <Box
        component="section"
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: banner.backgroundColor,
          color: banner.textColor,
          minHeight: "88px",
          zIndex: banner.zIndex,
          fontFamily:
            "'Segoe UI', 'Segoe UI Symbol', 'Segoe UI Emoji', 'Apple Color Emoji', sans-serif, 'Noto Color Emoji'",
        }}
        aria-label="Cookie banner"
        tabIndex={0}
      >
        <Container maxWidth="xl" sx={{ position: "relative", height: "100%" }}>
          <Grid
            container
            sx={{
              alignItems: "center",
              minHeight: "88px",
              padding: "16px 0",
              paddingRight: 2,
            }}
          >
            {/* Texto - 60% da largura */}
            <Grid item xs={12} lg={8}>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "14px",
                  lineHeight: 1.5,
                  margin: 0,
                  fontFamily: "inherit",
                  color: "#fff",
                  paddingRight: { xs: "40px", lg: "24px" },
                }}
              >
                {texts.banner.description}
              </Typography>
            </Grid>

            {/* Botões - 40% da largura */}
            <Grid item xs={12} lg={4}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                sx={{
                  justifyContent: { xs: "stretch", lg: "flex-end" },
                  alignItems: "stretch",
                }}
              >
                <Button
                  onClick={onOpenPreferences}
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
                    borderTopLeftRadius: "4px",
                    borderTopRightRadius: "4px",
                    borderBottomLeftRadius: "24px",
                    borderBottomRightRadius: "24px",
                    "&:hover": {
                      backgroundColor: "#003d7a",
                    },
                  }}
                >
                  {texts.banner.customizeButton}
                </Button>

                <Button
                  onClick={onAcceptAll}
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
                    borderTopLeftRadius: "4px",
                    borderTopRightRadius: "4px",
                    borderBottomLeftRadius: "24px",
                    borderBottomRightRadius: "24px",
                    "&:hover": {
                      backgroundColor: "#003d7a",
                    },
                  }}
                >
                  {texts.banner.acceptAllButton}
                </Button>
              </Stack>
            </Grid>
          </Grid>

          {/* Botão X para fechar - canto superior direito */}
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: "8px",
              right: "8px",
              color: "#fff",
              fontSize: "20px",
              padding: "4px",
              minWidth: "24px",
              minHeight: "24px",
              borderRadius: "16px",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
            aria-label="Fechar"
          >
            ×
          </IconButton>
        </Container>
      </Box>
    </>
  )
}
