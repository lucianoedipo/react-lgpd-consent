"use client"

import { useLGPDConsent } from "./LGPDWithLibrary"

function CategoryStatus({ name, value }: Readonly<{ name: string; value: boolean }>) {
  return (
    <div>
      • {name}:{" "}
      <span style={{ color: value ? "#4CAF50" : "#f44336" }}>{value ? "✅" : "❌"}</span>
    </div>
  )
}

export function LGPDDebugPanel() {
  const { categories, hasConsent, getConsentString } = useLGPDConsent()
  const consentString = getConsentString ? getConsentString() : null

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        background: "#000",
        color: "#fff",
        padding: "12px",
        borderRadius: "8px",
        fontSize: "11px",
        zIndex: 999999,
        fontFamily: "monospace",
        maxWidth: "300px",
        border: "1px solid #333",
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: "8px", color: "#4CAF50" }}>
        🍪 LGPD Debug Panel v0.3.0
      </div>

      <div style={{ marginBottom: "6px" }}>
        <strong>Categorias ANPD:</strong>
      </div>

      <div style={{ marginLeft: "8px", marginBottom: "8px" }}>
        <CategoryStatus name="Necessary" value={categories.necessary} />
        <CategoryStatus name="Analytics" value={categories.analytics} />
        <CategoryStatus name="Functional" value={categories.functional} />
        <CategoryStatus name="Marketing" value={categories.marketing} />
        <CategoryStatus name="Personalization" value={categories.personalization} />
        <CategoryStatus name="Social" value={categories.social} />
      </div>

      <div style={{ marginBottom: "6px" }}>
        <strong>Testes hasConsent():</strong>
      </div>

      <div style={{ marginLeft: "8px", marginBottom: "8px" }}>
        <div>
          hasConsent(&apos;analytics&apos;):{" "}
          <span style={{ color: hasConsent("analytics") ? "#4CAF50" : "#f44336" }}>
            {hasConsent("analytics") ? "✅" : "❌"}
          </span>
        </div>
        <div>
          hasConsent(&apos;necessary&apos;):{" "}
          <span style={{ color: hasConsent("necessary") ? "#4CAF50" : "#f44336" }}>
            {hasConsent("necessary") ? "✅" : "❌"}
          </span>
        </div>
      </div>

      {consentString && (
        <div style={{ marginBottom: "6px" }}>
          <strong>Consent String:</strong>
          <div style={{ fontSize: "9px", marginTop: "2px", wordBreak: "break-all" }}>
            {consentString}
          </div>
        </div>
      )}

      <div
        style={{
          fontSize: "9px",
          color: "#666",
          marginTop: "8px",
          borderTop: "1px solid #333",
          paddingTop: "4px",
        }}
      >
        📝 Debug apenas em desenvolvimento
        <br />
        🚀 Biblioteca react-lgpd-consent v0.3.0
      </div>
    </div>
  )
}
