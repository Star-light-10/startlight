"use client"

import { useState, useEffect } from "react"

export default function FinanceDashboard() {
  const [activeTab, setActiveTab] = useState<"FEES" | "INVOICES" | "MANUAL_PAYMENTS">("FEES")
  const [classes, setClasses] = useState<any[]>([])
  const [terms, setTerms] = useState<any[]>([])
  const [fees, setFees] = useState<any[]>([])
  const [invoices, setInvoices] = useState<any[]>([])
  const [manualPayments, setManualPayments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fee Form State
  const [feeForm, setFeeForm] = useState({ name: "", amount: "", classId: "", termId: "" })
  
  // Invoice Gen State
  const [invoiceGen, setInvoiceGen] = useState({ classId: "", termId: "" })

  // Payment Form State
  const [payForm, setPayForm] = useState({ invoiceId: "", amount: "", method: "Transfer", reference: "" })

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [clsRes, termRes, feeRes, invRes, mpRes] = await Promise.all([
        fetch("/api/academics/classes"),
        fetch("/api/academics/terms"),
        fetch("/api/finance/fees"),
        fetch("/api/finance/invoices"),
        fetch("/api/finance/manual")
      ])
      if (clsRes.ok) setClasses(await clsRes.json())
      if (termRes.ok) setTerms(await termRes.json())
      if (feeRes.ok) setFees(await feeRes.json())
      if (invRes.ok) setInvoices(await invRes.json())
      if (mpRes.ok) setManualPayments(await mpRes.json())
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCreateFee = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/finance/fees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...feeForm, amount: parseFloat(feeForm.amount) })
      })
      if (res.ok) {
        setFeeForm({ name: "", amount: "", classId: "", termId: "" })
        fetchData()
        alert("Fee structure created!")
      } else {
        alert("Error creating fee structure.")
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleVerifyManualPayment = async (id: string, action: "VERIFY" | "REJECT") => {
    if (!confirm(`Are you sure you want to ${action.toLowerCase()} this payment?`)) return;
    try {
      const res = await fetch(`/api/finance/manual/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action })
      })
      if (res.ok) {
        alert(`Payment ${action.toLowerCase()}ed successfully!`)
        fetchData()
      } else {
        alert("Failed to process payment.")
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleGenerateInvoices = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/finance/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoiceGen),
      })
      const data = await res.json()
      if (res.ok) {
        alert(data.message)
        fetchData()
      } else {
        alert(data.error)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/finance/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payForm),
      })
      if (res.ok) {
        setPayForm({ invoiceId: "", amount: "", method: "Transfer", reference: "" })
        fetchData()
        alert("Payment recorded successfully!")
      } else {
        const err = await res.json()
        alert(err.error)
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Finance Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage fee structures, invoices, and payments.</p>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {["FEES", "INVOICES", "MANUAL_PAYMENTS"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? "border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              {tab === "FEES" ? "Fee Structures" : tab === "INVOICES" ? "Invoices" : "Manual Payments"}
            </button>
          ))}
        </nav>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading finance data...</div>
      ) : activeTab === "FEES" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 md:col-span-1 h-fit">
            <h3 className="text-lg font-bold mb-4">Create Fee Structure</h3>
            <form onSubmit={handleCreateFee} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Fee Name (e.g. Tuition)</label>
                <input required value={feeForm.name} onChange={e => setFeeForm({...feeForm, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Amount (₦)</label>
                <input required type="number" min="0" value={feeForm.amount} onChange={e => setFeeForm({...feeForm, amount: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Class</label>
                <select required value={feeForm.classId} onChange={e => setFeeForm({...feeForm, classId: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700">
                  <option value="">Select Class</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Academic Term</label>
                <select required value={feeForm.termId} onChange={e => setFeeForm({...feeForm, termId: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700">
                  <option value="">Select Term</option>
                  {terms.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg">Save Fee</button>
            </form>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 md:col-span-2">
            <h3 className="text-lg font-bold mb-4">Active Fee Structures</h3>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
              <thead>
                <tr>
                  <th className="text-left py-2 font-medium">Fee Name</th>
                  <th className="text-left py-2 font-medium">Class</th>
                  <th className="text-left py-2 font-medium">Term</th>
                  <th className="text-right py-2 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {fees.map(f => (
                  <tr key={f.id}>
                    <td className="py-2">{f.name}</td>
                    <td className="py-2">{f.class?.name}</td>
                    <td className="py-2">{f.term?.name}</td>
                    <td className="py-2 text-right">₦{f.amount.toLocaleString()}</td>
                  </tr>
                ))}
                {fees.length === 0 && <tr><td colSpan={4} className="py-4 text-center text-gray-500">No fee structures found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === "INVOICES" ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold mb-4">Generate Invoices</h3>
              <p className="text-sm text-gray-500 mb-4">Automatically generate invoices for all enrolled students in a specific class and term based on active fee structures.</p>
              <form onSubmit={handleGenerateInvoices} className="flex gap-4">
                <select required value={invoiceGen.classId} onChange={e => setInvoiceGen({...invoiceGen, classId: e.target.value})} className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700">
                  <option value="">Select Class</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select required value={invoiceGen.termId} onChange={e => setInvoiceGen({...invoiceGen, termId: e.target.value})} className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700">
                  <option value="">Select Term</option>
                  {terms.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg">Generate</button>
              </form>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold mb-4">Record Payment</h3>
              <form onSubmit={handleRecordPayment} className="space-y-4">
                <div className="flex gap-4">
                  <select required value={payForm.invoiceId} onChange={e => setPayForm({...payForm, invoiceId: e.target.value})} className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700">
                    <option value="">Select Invoice</option>
                    {invoices.filter(i => i.status !== "PAID").map(i => (
                      <option key={i.id} value={i.id}>{i.student?.user?.name} - {i.term?.name} (Due: ₦{i.totalAmount - i.amountPaid})</option>
                    ))}
                  </select>
                  <input required type="number" min="1" placeholder="Amount" value={payForm.amount} onChange={e => setPayForm({...payForm, amount: e.target.value})} className="w-32 px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700" />
                </div>
                <div className="flex gap-4">
                  <select value={payForm.method} onChange={e => setPayForm({...payForm, method: e.target.value})} className="w-32 px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700">
                    <option>Transfer</option>
                    <option>Cash</option>
                    <option>POS</option>
                  </select>
                  <input placeholder="Reference (Optional)" value={payForm.reference} onChange={e => setPayForm({...payForm, reference: e.target.value})} className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700" />
                  <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg">Submit Payment</button>
                </div>
              </form>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-x-auto">
            <h3 className="text-lg font-bold mb-4">Student Invoices</h3>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
              <thead>
                <tr>
                  <th className="text-left py-2 font-medium">Student</th>
                  <th className="text-left py-2 font-medium">Class</th>
                  <th className="text-left py-2 font-medium">Term</th>
                  <th className="text-right py-2 font-medium">Total Bill</th>
                  <th className="text-right py-2 font-medium">Amount Paid</th>
                  <th className="text-right py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {invoices.map(i => (
                  <tr key={i.id}>
                    <td className="py-3 font-medium">{i.student?.user?.name}</td>
                    <td className="py-3">{i.student?.class?.name}</td>
                    <td className="py-3">{i.term?.name}</td>
                    <td className="py-3 text-right">₦{i.totalAmount.toLocaleString()}</td>
                    <td className="py-3 text-right text-green-600">₦{i.amountPaid.toLocaleString()}</td>
                    <td className="py-3 text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        i.status === 'PAID' ? 'bg-green-100 text-green-800' : 
                        i.status === 'PARTIAL' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>{i.status}</span>
                    </td>
                  </tr>
                ))}
                {invoices.length === 0 && <tr><td colSpan={6} className="py-4 text-center text-gray-500">No invoices generated yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Manual Payments Verification</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {manualPayments.map(p => (
                  <tr key={p.id}>
                    <td className="py-3 px-4">{new Date(p.submittedAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4 font-medium">{p.studentName}</td>
                    <td className="py-3 px-4">{p.student?.class?.name}</td>
                    <td className="py-3 px-4 font-bold text-green-600">₦{Number(p.amountPaid).toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${
                        p.status === 'verified' ? 'bg-green-100 text-green-800' :
                        p.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>{p.status.replace("_", " ")}</span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      {p.status === 'pending_verification' && (
                        <>
                          <button
                            onClick={() => handleVerifyManualPayment(p.id, "VERIFY")}
                            className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md text-xs font-bold"
                          >
                            Verify
                          </button>
                          <button
                            onClick={() => handleVerifyManualPayment(p.id, "REJECT")}
                            className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-xs font-bold"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {manualPayments.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-gray-500">No manual payments to verify.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
