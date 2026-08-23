"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

export default function ParentFeesPage() {
  const { data: session } = useSession()
  const [invoices, setInvoices] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
  const [amountPaid, setAmountPaid] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const fetchInvoices = async () => {
    try {
      const res = await fetch("/api/finance/invoices")
      if (res.ok) {
        setInvoices(await res.json())
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchInvoices()
  }, [])

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSuccessMessage("")

    try {
      const res = await fetch("/api/finance/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountPaid,
          purpose: `School Fees - ${selectedInvoice?.term?.name || 'Term'}`,
          invoiceId: selectedInvoice?.id
        })
      })

      if (res.ok) {
        setSuccessMessage("Payment verification submitted successfully! Please send your receipt to WhatsApp now.")
        
        // Open WhatsApp
        const whatsappMessage = encodeURIComponent(`Hello Admin, I have just paid ₦${amountPaid} for School Fees (${selectedInvoice?.term?.name}). My name is ${session?.user?.name}. Please verify my payment.`);
        const whatsappUrl = `https://wa.me/2348056809200?text=${whatsappMessage}`;
        window.open(whatsappUrl, "_blank");

        setSelectedInvoice(null)
        setAmountPaid("")
      } else {
        alert("Failed to submit payment. Please try again.")
      }
    } catch (error) {
      console.error(error)
      alert("An error occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">School Fees</h1>
        <p className="text-gray-500 dark:text-gray-400">View your termly invoices and record your payments.</p>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-gray-500">Loading your invoices...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Invoices List */}
          <div className="lg:col-span-2 space-y-4">
            {invoices.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 text-center border border-gray-100 dark:border-gray-800 shadow-sm">
                <span className="text-4xl mb-4 block">🎉</span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Outstanding Invoices</h3>
                <p className="text-gray-500 text-sm">You do not have any fee invoices at the moment.</p>
              </div>
            ) : (
              invoices.map((inv) => {
                const balance = inv.totalAmount - inv.amountPaid;
                return (
                  <div key={inv.id} className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900 dark:text-white">{inv.term?.name || 'Academic Term'}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          inv.status === 'PAID' ? 'bg-green-100 text-green-800' : 
                          inv.status === 'PARTIAL' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {inv.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">Total Bill: <strong>₦{inv.totalAmount.toLocaleString()}</strong></p>
                      
                      {/* Progress Bar */}
                      <div className="w-full sm:w-64 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${inv.status === 'PAID' ? 'bg-green-500' : 'bg-blue-500'}`} 
                          style={{ width: `${Math.min((inv.amountPaid / inv.totalAmount) * 100, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between w-full sm:w-64 mt-1 text-xs text-gray-500 font-medium">
                        <span>Paid: ₦{inv.amountPaid.toLocaleString()}</span>
                        <span className="text-red-500">Bal: ₦{balance.toLocaleString()}</span>
                      </div>
                    </div>

                    {inv.status !== 'PAID' && (
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="w-full sm:w-auto px-6 py-3 bg-[#000080] hover:bg-[#000066] text-white font-bold rounded-xl transition-colors text-sm shadow-md"
                      >
                        Make Payment
                      </button>
                    )}
                  </div>
                )
              })
            )}
          </div>

          {/* Payment Panel */}
          <div className="lg:col-span-1">
            {successMessage && (
              <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 text-sm font-bold border border-green-200">
                ✓ {successMessage}
              </div>
            )}

            {selectedInvoice ? (
              <div className="bg-blue-50 dark:bg-blue-900/10 rounded-3xl p-6 border border-blue-100 dark:border-blue-900/30 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-black text-[#000080] dark:text-blue-400">Record Payment</h3>
                  <button onClick={() => setSelectedInvoice(null)} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-6 shadow-sm border border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Bank Details</p>
                  <p className="font-bold text-gray-900 dark:text-white text-lg">FIRST BANK</p>
                  <p className="font-mono font-black text-[#000080] dark:text-blue-400 text-xl tracking-wider my-1">3056744562</p>
                  <p className="font-bold text-gray-700 dark:text-gray-300">YAKUB KHADIJAT TITILOPE</p>
                </div>

                <form onSubmit={handleSubmitPayment} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Amount Transferred (₦)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max={selectedInvoice.totalAmount - selectedInvoice.amountPaid}
                      value={amountPaid}
                      onChange={e => setAmountPaid(e.target.value)}
                      placeholder="e.g. 45000"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#000080]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting || !amountPaid}
                    className="w-full py-4 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-xl transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2 shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    {isSubmitting ? "Submitting..." : "I Have Paid - Send Receipt"}
                  </button>
                  <p className="text-[10px] text-center text-gray-500">
                    Clicking this will record your payment and open WhatsApp to send your receipt to the Admin for verification.
                  </p>
                </form>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-8 border border-dashed border-gray-200 dark:border-gray-700 text-center flex flex-col items-center justify-center h-full min-h-[300px]">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-400">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Select an Invoice</h3>
                <p className="text-sm text-gray-500">Click "Make Payment" on an outstanding invoice to view bank details and upload your receipt.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
