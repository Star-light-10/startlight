"use client"

import { useState } from "react"

const BANK_DETAILS = {
  bankName: "First Bank of Nigeria",
  accountName: "YAKUB KHADIJAT TITILOPE",
  accountNumber: "3056744562",
}

const SCHOOL_WHATSAPP = "2348000000000" // Replace with school WhatsApp number

const PURPOSE_OPTIONS = [
  { value: "school_fees", label: "School Fees" },
  { value: "registration_fee", label: "Registration Fee" },
  { value: "exam_fee", label: "Examination Fee" },
  { value: "transport_fee", label: "Transport Fee" },
  { value: "library_fee", label: "Library Fee" },
  { value: "other", label: "Other" },
]

export default function ManualPaymentPage() {
  const [form, setForm] = useState({
    studentId: "",
    studentName: "",
    matricNumber: "",
    amountPaid: "",
    purpose: "school_fees",
    receiptUrl: "",
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [paymentId, setPaymentId] = useState("")
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/payments/submit-manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Submission failed. Please try again.")
        return
      }
      setPaymentId(data.paymentId)
      setSubmitted(true)
    } catch {
      setError("Network error. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Hello, I have made a payment to Starlight Model School.\nName: ${form.studentName}\nMatric No: ${form.matricNumber}\nAmount: ₦${Number(form.amountPaid).toLocaleString()}\nPurpose: ${form.purpose.replace(/_/g, " ")}\nPlease verify my payment. Thank you.`
    )
    window.open(`https://wa.me/${SCHOOL_WHATSAPP}?text=${msg}`, "_blank")
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a0a1a 0%, #0d1b2a 100%)", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h1 style={{ color: "#FFA500", fontSize: "1.8rem", fontWeight: 800, textAlign: "center", marginBottom: "0.25rem" }}>
          💳 Manual Bank Transfer Payment
        </h1>
        <p style={{ color: "#94a3b8", textAlign: "center", marginBottom: "2rem" }}>
          Transfer to the school account, then declare your payment below.
        </p>

        {/* Bank Details Card */}
        <div style={{
          background: "linear-gradient(135deg, #1e293b, #0f172a)",
          border: "2px solid #FFA500",
          borderRadius: "1rem",
          padding: "1.5rem",
          marginBottom: "2rem",
          boxShadow: "0 0 30px rgba(255,165,0,0.15)",
        }}>
          <h2 style={{ color: "#FFA500", fontWeight: 700, marginBottom: "1rem", fontSize: "1.1rem" }}>
            🏦 School Bank Account Details
          </h2>
          <div style={{ display: "grid", gap: "0.75rem" }}>
            {[
              { label: "Bank Name", value: BANK_DETAILS.bankName },
              { label: "Account Name", value: BANK_DETAILS.accountName },
              { label: "Account Number", value: BANK_DETAILS.accountNumber },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,165,0,0.05)", padding: "0.75rem 1rem", borderRadius: "0.5rem" }}>
                <span style={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 600 }}>{label}</span>
                <span style={{ color: "#f1f5f9", fontWeight: 700, letterSpacing: value === BANK_DETAILS.accountNumber ? "0.1em" : undefined }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
          <p style={{ color: "#64748b", fontSize: "0.8rem", marginTop: "1rem", textAlign: "center" }}>
            ⚠️ Transfer the exact amount, then fill the form below to declare your payment.
          </p>
        </div>

        {/* Success Banner */}
        {submitted ? (
          <div style={{
            background: "linear-gradient(135deg, #064e3b, #065f46)",
            border: "2px solid #10b981",
            borderRadius: "1rem",
            padding: "2rem",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
            <h2 style={{ color: "#10b981", fontWeight: 800, fontSize: "1.4rem", marginBottom: "0.5rem" }}>
              Payment Declaration Submitted!
            </h2>
            <p style={{ color: "#a7f3d0", marginBottom: "0.5rem" }}>
              Your payment is <strong>pending verification</strong> by the school admin.
            </p>
            <p style={{ color: "#6ee7b7", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
              Reference ID: <strong>{paymentId}</strong>
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={handleWhatsApp}
                style={{
                  background: "#25D366",
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  padding: "0.75rem 1.5rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                📱 Share on WhatsApp
              </button>
              <button
                onClick={() => { setSubmitted(false); setForm({ studentId: "", studentName: "", matricNumber: "", amountPaid: "", purpose: "school_fees", receiptUrl: "" }) }}
                style={{
                  background: "transparent",
                  color: "#a7f3d0",
                  border: "1px solid #10b981",
                  borderRadius: "0.5rem",
                  padding: "0.75rem 1.5rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                Submit Another
              </button>
            </div>
          </div>
        ) : (
          /* Submission Form */
          <form onSubmit={handleSubmit} style={{
            background: "#1e293b",
            borderRadius: "1rem",
            padding: "2rem",
            border: "1px solid #334155",
          }}>
            <h2 style={{ color: "#f1f5f9", fontWeight: 700, marginBottom: "1.5rem", fontSize: "1.1rem" }}>
              📋 Declare Your Payment
            </h2>

            {error && (
              <div style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid #ef4444",
                borderRadius: "0.5rem",
                padding: "0.75rem 1rem",
                color: "#fca5a5",
                marginBottom: "1rem",
                fontSize: "0.9rem",
              }}>
                ⚠️ {error}
              </div>
            )}

            <div style={{ display: "grid", gap: "1rem" }}>
              {[
                { id: "studentName", label: "Full Name *", type: "text", placeholder: "e.g. Lawal Akinlabi Mohammed" },
                { id: "matricNumber", label: "Matric / Admission Number *", type: "text", placeholder: "e.g. SML/2026/001" },
                { id: "studentId", label: "Student ID (from profile)", type: "text", placeholder: "Your internal student ID" },
                { id: "amountPaid", label: "Amount Paid (₦) *", type: "number", placeholder: "e.g. 50000" },
                { id: "receiptUrl", label: "Receipt Link (optional)", type: "url", placeholder: "Paste Google Drive or photo URL" },
              ].map(({ id, label, type, placeholder }) => (
                <div key={id}>
                  <label htmlFor={id} style={{ display: "block", color: "#94a3b8", fontSize: "0.85rem", marginBottom: "0.4rem", fontWeight: 600 }}>
                    {label}
                  </label>
                  <input
                    id={id}
                    name={id}
                    type={type}
                    value={form[id as keyof typeof form]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    required={!["receiptUrl", "studentId"].includes(id)}
                    min={id === "amountPaid" ? "1" : undefined}
                    style={{
                      width: "100%",
                      background: "#0f172a",
                      border: "1px solid #334155",
                      borderRadius: "0.5rem",
                      padding: "0.75rem 1rem",
                      color: "#f1f5f9",
                      fontSize: "0.95rem",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              ))}

              <div>
                <label htmlFor="purpose" style={{ display: "block", color: "#94a3b8", fontSize: "0.85rem", marginBottom: "0.4rem", fontWeight: 600 }}>
                  Purpose *
                </label>
                <select
                  id="purpose"
                  name="purpose"
                  value={form.purpose}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    background: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "0.5rem",
                    padding: "0.75rem 1rem",
                    color: "#f1f5f9",
                    fontSize: "0.95rem",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                >
                  {PURPOSE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  background: loading ? "#475569" : "linear-gradient(135deg, #FFA500, #FF6B00)",
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  padding: "0.9rem",
                  fontWeight: 800,
                  fontSize: "1rem",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                }}
              >
                {loading ? "Submitting..." : "✅ Submit Payment Declaration"}
              </button>
              <button
                type="button"
                onClick={handleWhatsApp}
                disabled={!form.studentName || !form.matricNumber}
                style={{
                  background: "#25D366",
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  padding: "0.9rem 1.2rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "0.95rem",
                  opacity: !form.studentName || !form.matricNumber ? 0.5 : 1,
                }}
              >
                📱 WhatsApp
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
