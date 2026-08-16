"use client"

import { useState, useEffect, useRef } from "react"

export default function FeeLedgerPage() {
  const [classes, setClasses] = useState<any[]>([])
  const [terms, setTerms] = useState<any[]>([])
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedTerm, setSelectedTerm] = useState("")
  const [search, setSearch] = useState("")

  const [ledger, setLedger] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  // Payment modal state
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [amount, setAmount] = useState("")
  const [method, setMethod] = useState("CASH")
  const [reference, setReference] = useState("")
  const [isPaying, setIsPaying] = useState(false)

  // Print receipt state
  const [receiptData, setReceiptData] = useState<any>(null)
  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch("/api/academics/classes")
      .then(res => res.json())
      .then(setClasses)
      .catch(() => {})

    fetch("/api/academics/terms")
      .then(res => res.json())
      .then(data => {
        setTerms(data)
        const active = data.find((t: any) => t.isActive)
        if (active) setSelectedTerm(active.id)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetchLedger()
  }, [selectedClass, selectedTerm, search])

  const fetchLedger = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedClass) params.append("classId", selectedClass)
      if (selectedTerm) params.append("termId", selectedTerm)
      if (search) params.append("search", search)

      const res = await fetch(`/api/finance/ledger?${params.toString()}`)
      if (res.ok) {
        setLedger(await res.json())
      }
    } catch (e) {
      console.error(e)
    }
    setIsLoading(false)
  }

  const handleGenerateInvoices = async () => {
    if (!selectedClass || !selectedTerm) {
      alert("Please select a class and term first")
      return
    }

    setIsGenerating(true)
    try {
      const res = await fetch("/api/finance/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId: selectedClass, termId: selectedTerm })
      })
      const data = await res.json()
      if (res.ok) {
        alert(data.message)
        fetchLedger()
      } else {
        alert(data.error)
      }
    } catch (e) {
      alert("Failed to generate invoices")
    }
    setIsGenerating(false)
  }

  const openPaymentModal = (student: any) => {
    setSelectedStudent(student)
    setAmount(student.balance.toString())
    setMethod("CASH")
    setReference("")
    setPaymentModalOpen(true)
  }

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPaying(true)
    try {
      const res = await fetch("/api/finance/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: selectedStudent.invoiceId,
          amount,
          method,
          reference
        })
      })
      if (res.ok) {
        setPaymentModalOpen(false)
        fetchLedger()
        
        // Show receipt option
        const data = await res.json()
        if (confirm("Payment successful! Do you want to print the receipt?")) {
          setReceiptData({
            payment: data.payment,
            student: selectedStudent,
            date: new Date().toLocaleDateString()
          })
          setTimeout(() => window.print(), 200)
        }
      } else {
        const err = await res.json()
        alert(err.error)
      }
    } catch (error) {
      alert("Payment failed")
    }
    setIsPaying(false)
  }

  const handlePrintReceipt = (student: any) => {
    const latestPayment = student.payments[0]
    if (!latestPayment) return

    setReceiptData({
      payment: latestPayment,
      student,
      date: new Date(latestPayment.date).toLocaleDateString()
    })
    setTimeout(() => window.print(), 200)
  }

  const statusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800">PAID</span>
      case "PARTIAL":
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800">PARTIAL</span>
      case "PENDING":
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800">PENDING</span>
      default:
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-gray-100 text-gray-800">NO INVOICE</span>
    }
  }

  return (
    <>
      <style jsx global>{`
        @media print {
          body > * { display: none !important; }
          body > div[aria-hidden="true"] { display: block !important; }
        }
      `}</style>

      {/* Print Receipt Overlay */}
      {receiptData && (
        <div ref={printRef} className="hidden print:block fixed inset-0 z-[9999] bg-white p-8 font-sans" aria-hidden="true">
          <div className="max-w-2xl mx-auto border-2 border-dashed border-gray-300 p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-black text-[#000080] uppercase tracking-widest">STARLIGHT SCHOOL</h1>
              <h2 className="text-lg font-bold text-gray-600">OFFICIAL RECEIPT</h2>
            </div>

            <div className="flex justify-between items-start mb-8 text-sm">
              <div className="space-y-1">
                <p><span className="font-bold text-gray-500">Receipt No:</span> {receiptData.payment.id.slice(-8).toUpperCase()}</p>
                <p><span className="font-bold text-gray-500">Date:</span> {receiptData.date}</p>
              </div>
              <div className="space-y-1 text-right">
                <p><span className="font-bold text-gray-500">Admission No:</span> {receiptData.student.admissionNumber}</p>
                <p><span className="font-bold text-gray-500">Class:</span> {receiptData.student.class}</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm font-bold text-gray-500 mb-1">Received from:</p>
              <p className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-2">{receiptData.student.name}</p>
            </div>

            <table className="w-full mb-8 text-sm border border-gray-200">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="px-4 py-2 text-left font-bold text-gray-700">Description</th>
                  <th className="px-4 py-2 text-right font-bold text-gray-700">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-3 border-b border-gray-200">
                    School Fees Payment ({receiptData.payment.method})
                    {receiptData.payment.reference && <div className="text-xs text-gray-500 mt-1">Ref: {receiptData.payment.reference}</div>}
                  </td>
                  <td className="px-4 py-3 border-b border-gray-200 text-right font-mono font-bold">
                    ₦{receiptData.payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-between items-end">
              <div className="space-y-1 text-sm">
                <p><span className="font-bold text-gray-500">Total Billed:</span> ₦{receiptData.student.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                <p><span className="font-bold text-gray-500">Total Paid:</span> ₦{(receiptData.student.amountPaid).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                <p><span className="font-bold text-gray-500">Balance:</span> ₦{(receiptData.student.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="text-center w-48">
                <div className="border-b-2 border-gray-400 mb-2 h-8" />
                <p className="text-xs font-bold text-gray-500 uppercase">Bursar's Signature</p>
              </div>
            </div>

            {receiptData.student.balance <= 0 && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none rotate-[-30deg]">
                <span className="text-8xl font-black text-green-600 whitespace-nowrap border-8 border-green-600 rounded-3xl px-8 py-4">PAID IN FULL</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Page Content */}
      <div className="space-y-6 print:hidden">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Fee Ledger</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage student fee invoices, record payments, and print receipts.</p>
        </div>

        {/* Action Bar */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-bold text-gray-500 mb-1">Class</label>
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:border-[#000080]"
            >
              <option value="">All Classes</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-bold text-gray-500 mb-1">Term</label>
            <select
              value={selectedTerm}
              onChange={e => setSelectedTerm(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:border-[#000080]"
            >
              <option value="">All Terms</option>
              {terms.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-bold text-gray-500 mb-1">Search</label>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Name or admission no."
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:border-[#000080]"
            />
          </div>

          <button
            onClick={handleGenerateInvoices}
            disabled={isGenerating || !selectedClass || !selectedTerm}
            className="px-5 py-2 bg-[#FFA500] hover:bg-orange-600 text-white font-bold rounded-xl shadow-sm disabled:opacity-50 transition-colors text-sm"
          >
            {isGenerating ? "Generating..." : "Generate Invoices"}
          </button>
        </div>

        {/* Ledger Table */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          {isLoading ? (
            <div className="py-12 text-center text-gray-400">Loading ledger...</div>
          ) : ledger.length === 0 ? (
            <div className="py-12 text-center text-gray-400">No students found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500">Student</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500">Adm. No</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500">Class</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-gray-500">Total Fee</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-gray-500">Paid</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-gray-500">Balance</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-500">Status</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {ledger.map((row) => (
                    <tr key={row.studentId} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                      <td className="px-4 py-3 text-sm font-semibold">{row.name}</td>
                      <td className="px-4 py-3 text-sm font-mono text-gray-500">{row.admissionNumber}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{row.class}</td>
                      <td className="px-4 py-3 text-sm text-right font-mono font-medium">₦{row.totalAmount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-right font-mono font-medium text-green-600">₦{row.amountPaid.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-right font-mono font-medium text-red-600">₦{row.balance.toLocaleString()}</td>
                      <td className="px-4 py-3 text-center">{statusBadge(row.status)}</td>
                      <td className="px-4 py-3 text-center space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => openPaymentModal(row)}
                          disabled={row.status === "NO_INVOICE" || row.status === "PAID"}
                          className="px-3 py-1 bg-[#000080] hover:bg-[#000066] text-white text-xs font-bold rounded-lg disabled:opacity-30 transition-colors"
                        >
                          Pay
                        </button>
                        <button
                          onClick={() => handlePrintReceipt(row)}
                          disabled={!row.payments || row.payments.length === 0}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-lg disabled:opacity-30 transition-colors"
                        >
                          Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {paymentModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:hidden">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl p-6 border border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-black mb-1">Record Payment</h2>
            <p className="text-sm text-gray-500 mb-6">{selectedStudent.name} — {selectedStudent.admissionNumber}</p>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl mb-6 flex justify-between items-center">
              <span className="text-sm font-bold text-[#000080] dark:text-blue-400">Current Balance</span>
              <span className="text-xl font-black font-mono text-[#000080] dark:text-blue-400">₦{selectedStudent.balance.toLocaleString()}</span>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Payment Amount (₦)</label>
                <input
                  type="number"
                  required
                  min="1"
                  max={selectedStudent.balance}
                  step="0.01"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 font-mono focus:outline-none focus:border-[#000080]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Payment Method</label>
                <select
                  value={method}
                  onChange={e => setMethod(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#000080]"
                >
                  <option value="CASH">Cash</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="POS">POS / Card</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Reference (Optional)</label>
                <input
                  type="text"
                  value={reference}
                  onChange={e => setReference(e.target.value)}
                  placeholder="e.g. Teller No, Transfer Ref"
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#000080]"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentModalOpen(false)}
                  className="px-5 py-2 font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPaying}
                  className="px-5 py-2 font-bold text-white bg-[#000080] hover:bg-[#000066] rounded-xl disabled:opacity-50 transition-colors"
                >
                  {isPaying ? "Processing..." : "Confirm Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
