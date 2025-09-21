"use client"

import Accordion from "@mui/material/Accordion"
import AccordionDetails from "@mui/material/AccordionDetails"
import AccordionSummary from "@mui/material/AccordionSummary"
import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"
import Switch from "@mui/material/Switch"
import Typography from "@mui/material/Typography"

interface CookieCategoryProps {
  title: string
  description: string
  isEnabled: boolean
  isRequired?: boolean
  isExpanded: boolean
  onToggle: (enabled: boolean) => void
  onExpandToggle: () => void
  details?: {
    cookies: Array<{
      name: string
      purpose: string
      duration: string
    }>
  }
}

export function CookieCategory({
  title,
  description,
  isEnabled,
  isRequired = false,
  isExpanded,
  onToggle,
  onExpandToggle,
  details,
}: Readonly<CookieCategoryProps>) {
  return (
    <Accordion
      expanded={isExpanded}
      onChange={onExpandToggle}
      sx={{
        border: "1px solid #fff",
        borderRadius: 0,
        background: "#111",
        color: "#fff",
        "&:before": {
          display: "none",
        },
        "&.Mui-expanded": {
          margin: 0,
        },
        "& .MuiAccordionSummary-expandIconWrapper": {
          color: "#fff",
        },
      }}
    >
      <AccordionSummary
        sx={{
          padding: "16px 20px",
          minHeight: "auto",
          "&.Mui-expanded": {
            minHeight: "auto",
          },
          "& .MuiAccordionSummary-content": {
            margin: 0,
            "&.Mui-expanded": {
              margin: 0,
            },
          },
          "& .MuiAccordionSummary-expandIconWrapper": {
            order: -1,
            marginRight: "12px",
            marginLeft: 0,
          },
        }}
        expandIcon={
          <Box
            sx={{
              color: "#fff",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            {isExpanded ? "−" : "+"}
          </Box>
        }
      >
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            paddingRight: 1,
          }}
        >
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", flex: 1 }}>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#fff",
                fontFamily: "inherit",
              }}
            >
              {title}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            {isRequired && (
              <Chip
                label="Sempre ativo"
                size="small"
                sx={{
                  background: "transparent",
                  color: "#004F9F",
                  fontSize: "11px",
                  height: "20px",
                  fontFamily: "inherit",
                  fontWeight: "bold",
                  border: "none",
                }}
              />
            )}

            {!isRequired && (
              <Switch
                checked={isEnabled}
                onChange={(e) => {
                  e.stopPropagation()
                  onToggle(e.target.checked)
                }}
                size="small"
                sx={{
                  "& .MuiSwitch-switchBase": {
                    color: isEnabled ? "#fff" : "#666",
                    "&.Mui-checked": {
                      color: "#fff",
                      "& + .MuiSwitch-track": {
                        backgroundColor: "#004F9F",
                        opacity: 1,
                      },
                    },
                  },
                  "& .MuiSwitch-track": {
                    backgroundColor: isEnabled ? "#004F9F" : "#444",
                    opacity: 1,
                  },
                }}
              />
            )}
          </Stack>
        </Stack>
      </AccordionSummary>

      <AccordionDetails
        sx={{
          padding: "0 20px 16px 20px",
          borderTop: "1px solid #fff",
        }}
      >
        <Typography
          sx={{
            fontSize: ".812em",
            lineHeight: 1.5,
            color: "#fff",
            marginBottom: details?.cookies ? "16px" : 0,
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif",
            fontWeight: "normal",
            WebkitFontSmoothing: "auto",
            letterSpacing: "normal",
            textAlign: "left",
            textDecoration: "none",
            textIndent: 0,
            textShadow: "none",
            textTransform: "none",
            whiteSpace: "normal",
            background: "none",
            overflow: "visible",
            verticalAlign: "baseline",
            visibility: "visible",
            clear: "both",
            width: "100%",
            paddingTop: "12px",
          }}
        >
          {description}
        </Typography>

        {details?.cookies && details.cookies.length > 0 && (
          <Box>
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#fff",
                marginBottom: "8px",
                fontFamily: "inherit",
              }}
            >
              Cookies utilizados:
            </Typography>

            <Stack spacing={1}>
              {details.cookies.map((cookie) => (
                <Box
                  key={cookie.name}
                  sx={{
                    background: "rgba(255, 255, 255, 0.05)",
                    padding: "8px 12px",
                    borderRadius: "4px",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#fff",
                      marginBottom: "4px",
                      fontFamily: "inherit",
                    }}
                  >
                    {cookie.name}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "11px",
                      color: "#ccc",
                      marginBottom: "2px",
                      fontFamily: "inherit",
                    }}
                  >
                    {cookie.purpose}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "10px",
                      color: "#999",
                      fontFamily: "inherit",
                    }}
                  >
                    Duração: {cookie.duration}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  )
}
