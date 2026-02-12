import { useState, useEffect } from 'react'

const SECTIONS = ['Donor Info', 'Donation Details', 'Purpose', 'Generate Receipt']

function generateRef() {
  const d = new Date()
  const y = String(d.getFullYear()).slice(2)
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const r = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
  return `DON-${y}${m}-${r}`
}

export default function DonationReceipt() {
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [receipt, setReceipt] = useState(null)

  const [donor, setDonor] = useState({ name: '', address: '', city: '', state: '', zip: '', email: '', phone: '' })
  const [details, setDetails] = useState({ amount: '', date: new Date().toISOString().split('T')[0], method: '', referenceId: '' })
  const [purpose, setPurpose] = useState({ type: '', description: '' })

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [step])

  const updateDonor = (k, v) => setDonor(p => ({ ...p, [k]: v }))
  const updateDetails = (k, v) => setDetails(p => ({ ...p, [k]: v }))
  const updatePurpose = (k, v) => setPurpose(p => ({ ...p, [k]: v }))

  const inputCls = 'w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rust focus:border-transparent'
  const labelCls = 'block text-sm font-semibold text-gray-700 mb-1'
  const errCls = 'text-red-600 text-xs mt-1'
  const sectionTitle = 'text-xl font-bold text-white bg-rust px-4 py-2 rounded-md mb-6'

  function validate() {
    const e = {}
    if (step === 0) {
      if (!donor.name.trim()) e.name = 'Required'
      if (!donor.address.trim()) e.address = 'Required'
      if (!donor.city.trim()) e.city = 'Required'
      if (!donor.state.trim()) e.state = 'Required'
      if (!donor.zip.trim()) e.zip = 'Required'
      if (donor.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(donor.email)) e.email = 'Invalid email'
    }
    if (step === 1) {
      if (!details.amount || parseFloat(details.amount) <= 0) e.amount = 'Required'
      if (!details.date) e.date = 'Required'
      if (!details.method) e.method = 'Required'
    }
    if (step === 2) {
      if (!purpose.type) e.purposeType = 'Required'
      if (purpose.type === 'other' && !purpose.description.trim()) e.purposeDesc = 'Please describe'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function next() { if (validate()) setStep(s => Math.min(s + 1, 3)) }
  function prev() { setErrors({}); setStep(s => Math.max(s - 1, 0)) }

  function generateReceipt() {
    if (!validate()) return
    const ref = generateRef()
    const data = { ref, generatedDate: new Date().toISOString(), donor, details, purpose }
    const existing = JSON.parse(localStorage.getItem('tnr-donation-receipts') || '[]')
    existing.push(data)
    localStorage.setItem('tnr-donation-receipts', JSON.stringify(existing))
    setReceipt(data)
  }

  function handlePrint() {
    window.print()
  }

  const purposeLabels = { general: 'General Fund', cat: 'Specific Cat Care', trap: 'Trap Fund', other: 'Other' }
  const methodLabels = { cash: 'Cash', check: 'Check', paypal: 'PayPal', venmo: 'Venmo', other: 'Other' }

  if (receipt) {
    return (
      <div className="pt-24 pb-16 px-4 max-w-3xl mx-auto">
        {/* Print controls - hidden when printing */}
        <div className="print:hidden mb-6 text-center">
          <h1 className="text-2xl font-bold text-rust mb-4">Receipt Generated Successfully</h1>
          <div className="flex gap-4 justify-center">
            <button onClick={handlePrint} className="px-6 py-2 bg-rust text-white rounded-md font-medium hover:bg-rust-light transition-colors">
              🖨️ Print Receipt
            </button>
            <button onClick={() => { setReceipt(null); setStep(0); setDonor({ name: '', address: '', city: '', state: '', zip: '', email: '', phone: '' }); setDetails({ amount: '', date: new Date().toISOString().split('T')[0], method: '', referenceId: '' }); setPurpose({ type: '', description: '' }) }} className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Generate Another
            </button>
          </div>
        </div>

        {/* Printable Receipt */}
        <div id="printable-receipt" className="bg-white border border-gray-200 rounded-lg p-8 print:border-0 print:p-0 print:rounded-none">
          <div className="text-center mb-6 border-b-2 border-rust pb-4">
            <img src="/sams-tnr-logo.jpg" alt="Sam's TNR Logo" className="w-24 h-24 mx-auto mb-2 rounded-full object-cover" />
            <h2 className="text-2xl font-bold text-rust">Sam's TNR, Inc.</h2>
            <p className="text-sm text-gray-600">501(c)(3) Nonprofit Organization</p>
            <p className="text-sm text-gray-600">Barney & Northern Brooks County, Georgia</p>
            <p className="text-sm text-gray-600">EIN: [EIN NUMBER]</p>
          </div>

          <h3 className="text-xl font-bold text-center text-rust mb-6">Official Donation Receipt / Tax Letter</h3>

          <p className="text-sm text-gray-500 mb-6 text-right">Receipt #: {receipt.ref}<br />Date Issued: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-1">Donor:</p>
            <p className="text-sm text-gray-700">{receipt.donor.name}</p>
            <p className="text-sm text-gray-700">{receipt.donor.address}</p>
            <p className="text-sm text-gray-700">{receipt.donor.city}, {receipt.donor.state} {receipt.donor.zip}</p>
            {receipt.donor.email && <p className="text-sm text-gray-700">{receipt.donor.email}</p>}
            {receipt.donor.phone && <p className="text-sm text-gray-700">{receipt.donor.phone}</p>}
          </div>

          <div className="mb-6 text-center">
            <p className="text-lg font-semibold text-rust italic">"Thank you for your generous donation!"</p>
          </div>

          <div className="bg-gray-50 rounded-md p-4 mb-6">
            <h4 className="font-bold text-sm text-gray-700 mb-2">Donation Details</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="font-semibold">Amount:</span> ${parseFloat(receipt.details.amount).toFixed(2)}</div>
              <div><span className="font-semibold">Date:</span> {new Date(receipt.details.date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <div><span className="font-semibold">Method:</span> {methodLabels[receipt.details.method] || receipt.details.method}</div>
              {receipt.details.referenceId && <div><span className="font-semibold">Reference ID:</span> {receipt.details.referenceId}</div>}
              <div><span className="font-semibold">Purpose:</span> {purposeLabels[receipt.purpose.type] || receipt.purpose.type}{receipt.purpose.description ? ` — ${receipt.purpose.description}` : ''}</div>
            </div>
          </div>

          <div className="border border-gray-300 rounded-md p-4 mb-6 text-sm text-gray-700 leading-relaxed">
            <p>Sam's TNR, Inc. is a 501(c)(3) tax-exempt organization. No goods or services were provided in exchange for this contribution. This letter serves as your official tax receipt. Please retain for your records.</p>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-300 text-sm text-gray-600">
            <p className="font-semibold">Sam's TNR, Inc.</p>
            <p>Barney, GA 31625</p>
            <p>Email: info@samstnr.org</p>
            <p className="mt-2 text-xs text-gray-500">Tax ID (EIN): [EIN NUMBER]</p>
          </div>
        </div>

        <style>{`
          @media print {
            body * { visibility: hidden; }
            #printable-receipt, #printable-receipt * { visibility: visible; }
            #printable-receipt { position: absolute; left: 0; top: 0; width: 100%; }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-16 px-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-rust mb-2 text-center">Donation Receipt Generator</h1>
      <p className="text-gray-600 text-center mb-8">Internal tool — Generate tax receipts for donors</p>

      {/* Progress */}
      <div className="flex items-center mb-10 overflow-x-auto pb-2">
        {SECTIONS.map((s, i) => (
          <div key={i} className="flex items-center flex-shrink-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
              i < step ? 'bg-rust border-rust text-white' :
              i === step ? 'border-rust text-rust bg-white' :
              'border-gray-300 text-gray-400 bg-white'
            }`}>{i + 1}</div>
            <span className={`ml-1 mr-3 text-xs hidden sm:inline ${i === step ? 'text-rust font-semibold' : 'text-gray-400'}`}>{s}</span>
            {i < SECTIONS.length - 1 && <div className={`w-6 h-0.5 mr-1 ${i < step ? 'bg-rust' : 'bg-gray-300'}`} />}
          </div>
        ))}
      </div>

      {/* Step 0: Donor Info */}
      {step === 0 && (
        <div>
          <div className={sectionTitle}>Donor Information</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Donor Full Name *</label>
              <input className={inputCls} value={donor.name} onChange={e => updateDonor('name', e.target.value)} />
              {errors.name && <p className={errCls}>{errors.name}</p>}
            </div>
            <div>
              <label className={labelCls}>Phone</label>
              <input className={inputCls} type="tel" value={donor.phone} onChange={e => updateDonor('phone', e.target.value)} />
            </div>
          </div>
          <div className="mb-4">
            <label className={labelCls}>Email</label>
            <input className={inputCls} type="email" value={donor.email} onChange={e => updateDonor('email', e.target.value)} />
            {errors.email && <p className={errCls}>{errors.email}</p>}
          </div>
          <div className="mb-4">
            <label className={labelCls}>Mailing Address *</label>
            <input className={inputCls} value={donor.address} onChange={e => updateDonor('address', e.target.value)} />
            {errors.address && <p className={errCls}>{errors.address}</p>}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div className="col-span-2">
              <label className={labelCls}>City *</label>
              <input className={inputCls} value={donor.city} onChange={e => updateDonor('city', e.target.value)} />
              {errors.city && <p className={errCls}>{errors.city}</p>}
            </div>
            <div>
              <label className={labelCls}>State *</label>
              <input className={inputCls} value={donor.state} onChange={e => updateDonor('state', e.target.value)} />
              {errors.state && <p className={errCls}>{errors.state}</p>}
            </div>
            <div>
              <label className={labelCls}>ZIP *</label>
              <input className={inputCls} value={donor.zip} onChange={e => updateDonor('zip', e.target.value)} />
              {errors.zip && <p className={errCls}>{errors.zip}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Step 1: Donation Details */}
      {step === 1 && (
        <div>
          <div className={sectionTitle}>Donation Details</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Donation Amount ($) *</label>
              <input className={inputCls} type="number" min="0.01" step="0.01" value={details.amount} onChange={e => updateDetails('amount', e.target.value)} />
              {errors.amount && <p className={errCls}>{errors.amount}</p>}
            </div>
            <div>
              <label className={labelCls}>Donation Date *</label>
              <input className={inputCls} type="date" value={details.date} onChange={e => updateDetails('date', e.target.value)} />
              {errors.date && <p className={errCls}>{errors.date}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Payment Method *</label>
              <select className={inputCls} value={details.method} onChange={e => updateDetails('method', e.target.value)}>
                <option value="">Select method...</option>
                <option value="cash">Cash</option>
                <option value="check">Check</option>
                <option value="paypal">PayPal</option>
                <option value="venmo">Venmo</option>
                <option value="other">Other</option>
              </select>
              {errors.method && <p className={errCls}>{errors.method}</p>}
            </div>
            <div>
              <label className={labelCls}>Reference / Transaction ID</label>
              <input className={inputCls} value={details.referenceId} onChange={e => updateDetails('referenceId', e.target.value)} placeholder="Check #, transaction ID, etc." />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Purpose */}
      {step === 2 && (
        <div>
          <div className={sectionTitle}>Donation Purpose</div>
          <div className="space-y-3 mb-4">
            {[
              { val: 'general', label: 'General Fund' },
              { val: 'cat', label: 'Specific Cat Care' },
              { val: 'trap', label: 'Trap Fund' },
              { val: 'other', label: 'Other' },
            ].map(p => (
              <label key={p.val} className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer text-sm">
                <input type="radio" name="purpose" checked={purpose.type === p.val} onChange={() => updatePurpose('type', p.val)} className="accent-rust" />
                {p.label}
              </label>
            ))}
          </div>
          {errors.purposeType && <p className={errCls}>{errors.purposeType}</p>}
          {(purpose.type === 'cat' || purpose.type === 'other') && (
            <div className="mb-4">
              <label className={labelCls}>{purpose.type === 'cat' ? 'Which cat / details' : 'Description'} {purpose.type === 'other' ? '*' : ''}</label>
              <textarea className={inputCls} rows="3" value={purpose.description} onChange={e => updatePurpose('description', e.target.value)} />
              {errors.purposeDesc && <p className={errCls}>{errors.purposeDesc}</p>}
            </div>
          )}
        </div>
      )}

      {/* Step 3: Preview */}
      {step === 3 && (
        <div>
          <div className={sectionTitle}>Review & Generate</div>
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div><span className="font-semibold">Donor:</span> {donor.name}</div>
              <div><span className="font-semibold">Address:</span> {donor.city}, {donor.state} {donor.zip}</div>
              <div><span className="font-semibold">Amount:</span> ${parseFloat(details.amount || 0).toFixed(2)}</div>
              <div><span className="font-semibold">Date:</span> {details.date}</div>
              <div><span className="font-semibold">Method:</span> {methodLabels[details.method]}</div>
              <div><span className="font-semibold">Purpose:</span> {purposeLabels[purpose.type]}</div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        {step > 0 ? (
          <button onClick={prev} className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            ← Previous
          </button>
        ) : <div />}
        {step < 3 ? (
          <button onClick={next} className="px-6 py-2 bg-rust text-white rounded-md text-sm font-medium hover:bg-rust-light transition-colors">
            Next →
          </button>
        ) : (
          <button onClick={generateReceipt} className="px-8 py-3 bg-rust text-white rounded-md font-bold text-sm hover:bg-rust-light transition-colors">
            🧾 Generate Receipt
          </button>
        )}
      </div>
    </div>
  )
}
