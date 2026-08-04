"use client"

import { useEffect, useState } from "react"

interface ManualPayment {
  id: string
  studentName: string
  matricNumber: string
  amountPaid: string | number
  purpose: string
  receiptUrl?: string
  status: string
  submittedAt: string
  verifiedBy?: string
  verifiedAt?: string
  rejectionReason?: string
}

const STATUS_BADGE: Record<string, { bg: string; color: string; label: string }> = {
  pending_verification: { bg: "rgba(234,179,8,0.15)", color: "#fbbf24", label: "⏳ Pending" },
  verified: { bg: "rgba(16,185,129,0.15)", color: "#10b981", label: "✅ Verified" },
  rejected: { bg: "rgba(239,68,68,0.15)", color: "#ef4444", label: "❌ Rejected" },
}

export default function AdminManualPaymentsPage() {
  const [payments, setPayments] = useState<ManualPayment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "pending_verification" | "verified" | "rejected">("pending_verification")
  const [processing, setProcessing] = useState<string | null>(null)
  const [rejectModal, setRejectModal] = useState<{ id: string; name: string } | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null)

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 4000)
  }

  const fetchPayments = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/payments/submit-manual")
      const data = await res.json()
      setPayments(Array.isArray(data) ? data : [])
    } catch {
      showToast("Failed to load payments.", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPayments() }, [])

  const handleAction = async (paymentId: string, action: "approve" | "reject", reason?: string) => {
    setProcessing(paymentId)
    try {
      const res = await fetch("/api/payments/verify-manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId, action, rejectionReason: reason, adminName: "Admin" }),
      })
      const data = await res.json()
      if (!res.ok) {
        showToast(data.error || "Action failed.", "error")
        return
      }
      showToast(action === "approve" ? "Payment approved successfully! ✅" : "Payment rejected. ❌")
      setRejectModal(null)
      setRejectionReason("")
      fetchPayments()
    } catch {
      showToast("Network error. Please try again.", "error")
    } finally {
      setProcessing(null)
    }
  }

  const filtered = payments.filter((p) => filter === "all" || p.status === filter)
  const counts = {
    all: payments.length,
    pending_verification: payments.filter((p) => p.status === "pending_verification").length,
    verified: payments.filter((p) => p.status === "verified").length,
    rejected: payments.filter((p) => p.status === "rejected").length,
  }

  return (
    <div style={{ padding: "2rem", background: "#0f172a", minHeight: "100vh" }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: "1.5rem", right: "1.5rem", zIndex: 9999,
          background: toast.type === "success" ? "#065f46" : "#7f1d1d",
          border: `1px solid ${toast.type === "success" ? "#10b981" : "#ef4444"}`,
          color: toast.type === "success" ? "#a7f3d0" : "#fca5a5",
          padding: "0.85rem 1.5rem", borderRadius: "0.75rem", fontWeight: 600,
          boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
        }}>
          {toast.msg}
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 999,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            background: "#1e293b", borderRadius: "1rem", padding: "2rem",
            border: "1px solid #475569", maxWidth: 420, width: "90%",
          }}>
            <h3 style={{ color: "#ef4444", fontWeight: 700, marginBottom: "1rem" }}>
              ❌ Reject Payment
            </h3>
            <p style={{ color: "#94a3b8", marginBottom: "1rem", fontSize: "0.9rem" }}>
              Rejecting payment for <strong style={{ color: "#f1f5f9" }}>{rejectModal.name}</strong>.
              Please provide a reason:
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Receipt unclear, amount does not match, wrong account..."
              rows={4}
              style={{
                width: "100%", background: "#0f172a", border: "1px solid #334155",
                borderRadius: "0.5rem", padding: "0.75rem", color: "#f1f5f9",
                fontSize: "0.9rem", outline: "none", resize: "vertical", boxSizing: "border-box",
              }}
            />
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
              <button
                onClick={() => handleAction(rejectModal.id, "reject", rejectionReason)}
                disabled={!rejectionReason.trim() || processing === rejectModal.id}
                style={{
                  flex: 1, background: "#ef4444", color: "white", border: "none",
                  borderRadius: "0.5rem", padding: "0.75rem", fontWeight: 700,
                  cursor: !rejectionReason.trim() ? "not-allowed" : "pointer",
                  opacity: !rejectionReason.trim() ? 0.5 : 1,
                }}
              >
                {processing === rejectModal.id ? "Processing..." : "Confirm Rejection"}
              </button>
              <button
                onClick={() => { setRejectModal(null); setRejectionReason("") }}
                style={{
                  flex: 1, background: "transparent", color: "#94a3b8",
                  border: "1px solid #334155", borderRadius: "0.5rem",
                  padding: "0.75rem", fontWeight: 700, cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ color: "#FFA500", fontSize: "1.6rem", fontWeight: 800, marginBottom: "0.25rem" }}>
          🏦 Manual Payment Verification
        </h1>
        <p style={{ color: "#64748b" }}>Review and approve student bank transfer declarations.</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { key: "all", label: "Total", color: "#94a3b8" },
          { key: "pending_verification", label: "Pending", color: "#fbbf24" },
          { key: "verified", label: "Verified", color: "#10b981" },
          { key: "rejected", label: "Rejected", color: "#ef4444" },
        ].map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => setFilter(key as typeof filter)}
            style={{
              background: filter === key ? "rgba(255,165,0,0.1)" : "#1e293b",
              border: `2px solid ${filter === key ? "#FFA500" : "#334155"}`,
              borderRadius: "0.75rem", padding: "1rem", cursor: "pointer", textAlign: "center",
            }}
          >
            <div style={{ color, fontSize: "1.8rem", fontWeight: 800 }}>{counts[key as keyof typeof counts]}</div>
            <div style={{ color: "#64748b", fontSize: "0.8rem", fontWeight: 600 }}>{label}</div>
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: "#1e293b", borderRadius: "1rem", border: "1px solid #334155", overflow: "hidden" }}>
        <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #334155", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ color: "#f1f5f9", fontWeight: 700, fontSize: "1rem" }}>
            {filter === "all" ? "All Payments" : filter.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            {" "}({filtered.length})
          </h2>
          <button
            onClick={fetchPayments}
            style={{ background: "#334155", color: "#94a3b8", border: "none", borderRadius: "0.5rem", padding: "0.5rem 1rem", cursor: "pointer", fontSize: "0.85rem" }}
          >
            🔄 Refresh
          </button>
        </div>

        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>Loading payments...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
            No {filter === "all" ? "" : filter.replace(/_/g, " ")} payments found.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #334155" }}>
                  {["Student Name", "Matric No.", "Amount (₦)", "Purpose", "Receipt", "Submitted", "Status", "Actions"].map((h) => (
                    <th key={h} style={{ padding: "0.75rem 1rem", color: "#64748b", fontSize: "0.8rem", fontWeight: 700, textAlign: "left", whiteSpace: "nowrap" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((payment) => {
                  const badge = STATUS_BADGE[payment.status] || STATUS_BADGE.pending_verification
                  return (
                    <tr key={payment.id} style={{ borderBottom: "1px solid #1e293b", transition: "background 0.15s" }}>
                      <td style={{ padding: "1rem", color: "#f1f5f9", fontWeight: 600 }}>{payment.studentName}</td>
                      <td style={{ padding: "1rem", color: "#94a3b8", fontSize: "0.85rem" }}>{payment.matricNumber}</td>
                      <td style={{ padding: "1rem", color: "#FFA500", fontWeight: 700 }}>
                        ₦{Number(payment.amountPaid).toLocaleString()}
                      </td>
                      <td style={{ padding: "1rem", color: "#94a3b8", fontSize: "0.85rem" }}>
                        {payment.purpose.replace(/_/g, " ")}
                      </td>
                      <td style={{ padding: "1rem" }}>
                        {payment.receiptUrl ? (
                          <a href={payment.receiptUrl} target="_blank" rel="noopener noreferrer"
                            style={{ color: "#60a5fa", fontSize: "0.85rem", textDecoration: "underline" }}>
                            View Receipt
                          </a>
                        ) : (
                          <span style={{ color: "#475569", fontSize: "0.8rem" }}>None</span>
                        )}
                      </td>
                      <td style={{ padding: "1rem", color: "#64748b", fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                        {new Date(payment.submittedAt).toLocaleDateString("en-NG", {
                          day: "2-digit", month: "short", year: "numeric",
                        })}
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <span style={{
                          background: badge.bg, color: badge.color,
                          padding: "0.3rem 0.7rem", borderRadius: "2rem",
                          fontSize: "0.75rem", fontWeight: 700, whiteSpace: "nowrap",
                        }}>
                          {badge.label}
                        </span>
                        {payment.status === "rejected" && payment.rejectionReason && (
                          <div style={{ color: "#94a3b8", fontSize: "0.7rem", marginTop: "0.25rem", maxWidth: 150 }}>
                            {payment.rejectionReason}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: "1rem" }}>
                        {payment.status === "pending_verification" ? (
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button
                              onClick={() => handleAction(payment.id, "approve")}
                              disabled={processing === payment.id}
                              style={{
                                background: "rgba(16,185,129,0.15)", color: "#10b981",
                                border: "1px solid #10b981", borderRadius: "0.4rem",
                                padding: "0.4rem 0.75rem", fontWeight: 700, cursor: "pointer",
                                fontSize: "0.8rem", whiteSpace: "nowrap",
                              }}
                            >
                              {processing === payment.id ? "..." : "✅ Approve"}
                            </button>
                            <button
                              onClick={() => setRejectModal({ id: payment.id, name: payment.studentName })}
                              disabled={processing === payment.id}
                              style={{
                                background: "rgba(239,68,68,0.15)", color: "#ef4444",
                                border: "1px solid #ef4444", borderRadius: "0.4rem",
                                padding: "0.4rem 0.75rem", fontWeight: 700, cursor: "pointer",
                                fontSize: "0.8rem", whiteSpace: "nowrap",
                              }}
                            >
                              ❌ Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ color: "#475569", fontSize: "0.8rem" }}>
                            {payment.status === "verified" ? `✅ by ${payment.verifiedBy}` : `❌ by ${payment.verifiedBy}`}
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
