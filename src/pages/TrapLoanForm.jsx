import { useState, useEffect } from 'react'

const SECTIONS = [
  'Borrower Info',
  'Trap Details',
  'Loan Period & Deposit',
  'Terms & Conditions',
  'Liability Waiver',
  'Signature',
]

const termsItems = [
  'Traps must be returned clean and in working condition.',
  'Borrower is responsible for lost or damaged traps (replacement cost $40–60 per trap).',
  'Traps may only be used for humane TNR (Trap-Neuter-Return) purposes.',
  'Traps may not be loaned or transferred to any third party.',
  'Traps must be checked at a minimum of every 12 hours while set.',
  'Borrower must provide food, water, and shelter from elements for any trapped cat until the cat is transported or released.',
  'Late returns: $5/day fee applies after a 48-hour grace period past the agreed return date.',
  'Deposit will be forfeited if traps are not returned within 30 days of the agreed return date.',
]

const waiverText = [
  { num: '1. Assumption of Risk.', text: 'I understand that the use of humane traps involves inherent risks including, but not limited to: animal bites or scratches, pinching or injury from trap mechanisms, lifting injuries, and exposure to wildlife or feral animals. I voluntarily assume all such risks.' },
  { num: '2. Release of Liability.', text: 'To the fullest extent permitted by Georgia law, I hereby release, waive, and discharge Sam\'s TNR, Inc., its officers, directors, employees, volunteers, and agents from any and all liability, claims, demands, actions, or causes of action arising out of or related to any loss, damage, or personal injury (including death) that may be sustained during my use of borrowed traps, except in cases of gross negligence or willful misconduct.' },
  { num: '3. Indemnification.', text: 'I agree to indemnify, defend, and hold harmless Sam\'s TNR, Inc. from any claims, lawsuits, or demands made by any third party arising from my use of the borrowed traps.' },
  { num: '4. Property Damage.', text: 'I accept full responsibility for any property damage caused by or related to my use of the borrowed traps.' },
  { num: '5. Governing Law.', text: 'This agreement is governed by the laws of the State of Georgia. If any provision is found to be unenforceable, the remaining provisions shall remain in full force and effect.' },
]

function generateRef() {
  const d = new Date()
  const y = String(d.getFullYear()).slice(2)
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const r = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
  return `TRP-${y}${m}-${r}`
}

function defaultReturn() {
  const d = new Date()
  d.setDate(d.getDate() + 7)
  return d.toISOString().split('T')[0]
}

export default function TrapLoanForm() {
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(null)

  const [borrower, setBorrower] = useState({
    fullName: '', phone: '', email: '', address: '', city: '', state: '', zip: '',
    idType: '', idNumber: '',
  })
  const [trapDetails, setTrapDetails] = useState({
    numTraps: '', trapIds: '', condition: 'Good',
  })
  const [loan, setLoan] = useState({
    checkoutDate: new Date().toISOString().split('T')[0],
    returnDate: defaultReturn(),
  })
  const [purpose, setPurpose] = useState({
    address: '', relatedIntake: '', intakeRef: '',
  })
  const [termsAgreed, setTermsAgreed] = useState(new Array(termsItems.length).fill(false))
  const [depositAck, setDepositAck] = useState(false)
  const [waiverAgreed, setWaiverAgreed] = useState(false)
  const [sigName, setSigName] = useState('')
  const [sigDate] = useState(new Date().toLocaleDateString('en-US'))

  // Internal use
  const [internal, setInternal] = useState({
    checkedOutBy: '', conditionReturn: '', depositReturned: '',
  })

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [step])

  const updateBorrower = (k, v) => setBorrower(p => ({ ...p, [k]: v }))
  const updateTrap = (k, v) => setTrapDetails(p => ({ ...p, [k]: v }))
  const updateLoan = (k, v) => setLoan(p => ({ ...p, [k]: v }))
  const updatePurpose = (k, v) => setPurpose(p => ({ ...p, [k]: v }))

  function validate() {
    const e = {}
    if (step === 0) {
      if (!borrower.fullName.trim()) e.fullName = 'Required'
      if (!borrower.phone.trim()) e.phone = 'Required'
      if (!borrower.email.trim()) e.email = 'Required'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(borrower.email)) e.email = 'Invalid email'
      if (!borrower.address.trim()) e.address = 'Required'
      if (!borrower.city.trim()) e.city = 'Required'
      if (!borrower.state.trim()) e.state = 'Required'
      if (!borrower.zip.trim()) e.zip = 'Required'
      if (!borrower.idType.trim()) e.idType = 'Required'
      if (!borrower.idNumber.trim()) e.idNumber = 'Required'
    }
    if (step === 1) {
      if (!trapDetails.numTraps) e.numTraps = 'Required'
      if (!purpose.address.trim()) e.purposeAddr = 'Required'
    }
    if (step === 2) {
      if (!depositAck) e.deposit = 'You must acknowledge the deposit terms'
    }
    if (step === 3) {
      if (!termsAgreed.every(Boolean)) e.terms = 'All terms must be acknowledged'
    }
    if (step === 4) {
      if (!waiverAgreed) e.waiver = 'You must agree to the waiver'
    }
    if (step === 5) {
      if (!sigName.trim()) e.sigName = 'Required'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function next() { if (validate()) setStep(s => Math.min(s + 1, 5)) }
  function prev() { setErrors({}); setStep(s => Math.max(s - 1, 0)) }

  function handleSubmit() {
    if (!validate()) return
    const ref = generateRef()
    const submission = {
      ref, date: new Date().toISOString(),
      borrower, trapDetails, loan, purpose, termsAgreed, depositAck, waiverAgreed,
      sigName, sigDate, internal,
    }
    const existing = JSON.parse(localStorage.getItem('tnr-trap-loans') || '[]')
    existing.push(submission)
    localStorage.setItem('tnr-trap-loans', JSON.stringify(existing))
    setSubmitted(submission)
  }

  if (submitted) return <Confirmation data={submitted} />

  const inputCls = 'w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rust focus:border-transparent'
  const labelCls = 'block text-sm font-semibold text-gray-700 mb-1'
  const errCls = 'text-red-600 text-xs mt-1'
  const sectionTitle = 'text-xl font-bold text-white bg-rust px-4 py-2 rounded-md mb-6'

  return (
    <div className="pt-24 pb-16 px-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-rust mb-2 text-center">Trap Loan Agreement</h1>
      <p className="text-gray-600 text-center mb-8">Sam's TNR, Inc. — 501(c)(3) Nonprofit — Barney & Northern Brooks County, Georgia</p>

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

      {/* Step 0: Borrower Info */}
      {step === 0 && (
        <div>
          <div className={sectionTitle}>Section 1 — Borrower Information</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Full Name *</label>
              <input className={inputCls} value={borrower.fullName} onChange={e => updateBorrower('fullName', e.target.value)} />
              {errors.fullName && <p className={errCls}>{errors.fullName}</p>}
            </div>
            <div>
              <label className={labelCls}>Phone Number *</label>
              <input className={inputCls} type="tel" value={borrower.phone} onChange={e => updateBorrower('phone', e.target.value)} />
              {errors.phone && <p className={errCls}>{errors.phone}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Email Address *</label>
              <input className={inputCls} type="email" value={borrower.email} onChange={e => updateBorrower('email', e.target.value)} />
              {errors.email && <p className={errCls}>{errors.email}</p>}
            </div>
          </div>
          <div className="mb-4">
            <label className={labelCls}>Mailing Address *</label>
            <input className={inputCls} value={borrower.address} onChange={e => updateBorrower('address', e.target.value)} />
            {errors.address && <p className={errCls}>{errors.address}</p>}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div className="col-span-2">
              <label className={labelCls}>City *</label>
              <input className={inputCls} value={borrower.city} onChange={e => updateBorrower('city', e.target.value)} />
              {errors.city && <p className={errCls}>{errors.city}</p>}
            </div>
            <div>
              <label className={labelCls}>State *</label>
              <input className={inputCls} value={borrower.state} onChange={e => updateBorrower('state', e.target.value)} />
              {errors.state && <p className={errCls}>{errors.state}</p>}
            </div>
            <div>
              <label className={labelCls}>ZIP *</label>
              <input className={inputCls} value={borrower.zip} onChange={e => updateBorrower('zip', e.target.value)} />
              {errors.zip && <p className={errCls}>{errors.zip}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>ID Type *</label>
              <select className={inputCls} value={borrower.idType} onChange={e => updateBorrower('idType', e.target.value)}>
                <option value="">Select...</option>
                <option>Driver's License</option>
                <option>State ID</option>
                <option>Passport</option>
                <option>Other</option>
              </select>
              {errors.idType && <p className={errCls}>{errors.idType}</p>}
            </div>
            <div>
              <label className={labelCls}>ID Number *</label>
              <input className={inputCls} value={borrower.idNumber} onChange={e => updateBorrower('idNumber', e.target.value)} />
              {errors.idNumber && <p className={errCls}>{errors.idNumber}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Step 1: Trap Details & Purpose */}
      {step === 1 && (
        <div>
          <div className={sectionTitle}>Section 2 — Trap Details & Purpose</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Number of Traps *</label>
              <input className={inputCls} type="number" min="1" value={trapDetails.numTraps} onChange={e => updateTrap('numTraps', e.target.value)} />
              {errors.numTraps && <p className={errCls}>{errors.numTraps}</p>}
            </div>
            <div>
              <label className={labelCls}>Trap ID Numbers</label>
              <input className={inputCls} placeholder="e.g. T-001, T-002" value={trapDetails.trapIds} onChange={e => updateTrap('trapIds', e.target.value)} />
            </div>
          </div>
          <div className="mb-6">
            <label className={labelCls}>Condition at Checkout</label>
            <select className={inputCls + ' max-w-xs'} value={trapDetails.condition} onChange={e => updateTrap('condition', e.target.value)}>
              <option>Excellent</option>
              <option>Good</option>
              <option>Fair</option>
            </select>
          </div>

          <h3 className="font-bold text-sm text-gray-700 mb-3">Purpose of Loan</h3>
          <div className="mb-4">
            <label className={labelCls}>Address Where Traps Will Be Used *</label>
            <input className={inputCls} value={purpose.address} onChange={e => updatePurpose('address', e.target.value)} />
            {errors.purposeAddr && <p className={errCls}>{errors.purposeAddr}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Related to an Intake Form?</label>
              <div className="flex gap-4 mt-1">
                {['Yes', 'No'].map(v => (
                  <label key={v} className="flex items-center gap-1 text-sm cursor-pointer">
                    <input type="radio" name="relatedIntake" checked={purpose.relatedIntake === v} onChange={() => updatePurpose('relatedIntake', v)} className="accent-rust" /> {v}
                  </label>
                ))}
              </div>
            </div>
            {purpose.relatedIntake === 'Yes' && (
              <div>
                <label className={labelCls}>Intake Reference #</label>
                <input className={inputCls} placeholder="e.g. TNR-2602-1234" value={purpose.intakeRef} onChange={e => updatePurpose('intakeRef', e.target.value)} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Loan Period & Deposit */}
      {step === 2 && (
        <div>
          <div className={sectionTitle}>Section 3 — Loan Period & Deposit</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className={labelCls}>Checkout Date</label>
              <input className={inputCls} type="date" value={loan.checkoutDate} onChange={e => updateLoan('checkoutDate', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Return Date (default: 7 days)</label>
              <input className={inputCls} type="date" value={loan.returnDate} onChange={e => updateLoan('returnDate', e.target.value)} />
            </div>
          </div>
          <div className="bg-gray-50 rounded-md p-4 mb-4 text-sm text-gray-700">
            <p className="font-semibold mb-2">Extension Process:</p>
            <p>If you need traps for longer than 7 days, contact Sam's TNR at least 24 hours before the return date to request an extension. Extensions are granted on a case-by-case basis depending on trap availability.</p>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
            <p className="text-sm font-bold text-yellow-800 mb-2">Deposit Information</p>
            <p className="text-sm text-yellow-800 mb-1"><strong>$50.00 deposit per trap</strong>, refundable upon return in good condition.</p>
            <p className="text-sm text-yellow-800 mb-1">Total deposit: <strong>${trapDetails.numTraps ? Number(trapDetails.numTraps) * 50 : 0}.00</strong></p>
            <p className="text-sm text-yellow-800">Deposit will be forfeited if traps are not returned within 30 days.</p>
          </div>
          <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
            <input type="checkbox" checked={depositAck} onChange={() => setDepositAck(!depositAck)} className="mt-1 accent-rust" />
            <span className="text-sm font-semibold text-gray-700">I understand and agree to the deposit terms ($50/trap, refundable upon return in good condition) *</span>
          </label>
          {errors.deposit && <p className={errCls}>{errors.deposit}</p>}
        </div>
      )}

      {/* Step 3: Terms & Conditions */}
      {step === 3 && (
        <div>
          <div className={sectionTitle}>Section 4 — Terms & Conditions</div>
          <p className="text-gray-600 text-sm mb-4">Please read each term carefully and check to confirm your agreement.</p>
          <div className="space-y-3 mb-4">
            {termsItems.map((t, i) => (
              <label key={i} className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                <input type="checkbox" checked={termsAgreed[i]} onChange={() => { const n = [...termsAgreed]; n[i] = !n[i]; setTermsAgreed(n) }} className="mt-1 accent-rust flex-shrink-0" />
                <span className="text-sm text-gray-700">{t}</span>
              </label>
            ))}
          </div>
          {errors.terms && <p className={errCls}>{errors.terms}</p>}
        </div>
      )}

      {/* Step 4: Liability Waiver */}
      {step === 4 && (
        <div>
          <div className={sectionTitle}>Section 5 — Liability Waiver & Release of Claims</div>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 mb-4">
            <p className="text-sm font-bold text-yellow-800">PLEASE READ CAREFULLY. This is a legal document that affects your rights.</p>
          </div>
          <div className="max-h-80 overflow-y-auto border border-gray-300 rounded-md p-4 mb-4 bg-white text-sm text-gray-700 leading-relaxed">
            <p className="font-bold mb-3">TRAP LOAN LIABILITY WAIVER AND RELEASE OF CLAIMS</p>
            <p className="mb-3">Sam's TNR, Inc. — Barney, Georgia</p>
            {waiverText.map((w, i) => (
              <p key={i} className="mb-3"><strong>{w.num}</strong> {w.text}</p>
            ))}
            <p className="text-xs text-gray-500 mt-4">This waiver is governed by the laws of the State of Georgia.</p>
          </div>
          <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
            <input type="checkbox" checked={waiverAgreed} onChange={() => setWaiverAgreed(!waiverAgreed)} className="mt-1 accent-rust" />
            <span className="text-sm font-semibold text-gray-700">I have read, understand, and agree to the Liability Waiver & Release of Claims *</span>
          </label>
          {errors.waiver && <p className={errCls + ' mt-2'}>{errors.waiver}</p>}
        </div>
      )}

      {/* Step 5: Signature */}
      {step === 5 && (
        <div>
          <div className={sectionTitle}>Signature</div>
          <p className="text-gray-600 text-sm mb-6">By typing your name below, you acknowledge that you have read, understand, and agree to all terms and conditions of this Trap Loan Agreement.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className={labelCls}>Full Name (Digital Signature) *</label>
              <input className={inputCls + ' font-cursive text-lg'} style={{ fontFamily: 'cursive' }} value={sigName} onChange={e => setSigName(e.target.value)} placeholder="Type your full name" />
              {errors.sigName && <p className={errCls}>{errors.sigName}</p>}
            </div>
            <div>
              <label className={labelCls}>Date</label>
              <input className={inputCls + ' bg-gray-100'} value={sigDate} readOnly />
            </div>
          </div>

          {/* Internal Use Section */}
          <div className="mt-8 border-t-2 border-dashed border-gray-300 pt-6">
            <div className="bg-gray-100 rounded-md p-4">
              <h3 className="font-bold text-sm text-gray-500 mb-3 uppercase tracking-wide">Internal Use Only</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>Checked Out By</label>
                  <input className={inputCls} value={internal.checkedOutBy} onChange={e => setInternal(p => ({ ...p, checkedOutBy: e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>Trap Condition at Return</label>
                  <select className={inputCls} value={internal.conditionReturn} onChange={e => setInternal(p => ({ ...p, conditionReturn: e.target.value }))}>
                    <option value="">N/A</option>
                    <option>Excellent</option>
                    <option>Good</option>
                    <option>Fair</option>
                    <option>Damaged</option>
                    <option>Not Returned</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Deposit Returned?</label>
                  <select className={inputCls} value={internal.depositReturned} onChange={e => setInternal(p => ({ ...p, depositReturned: e.target.value }))}>
                    <option value="">N/A</option>
                    <option>Yes — Full</option>
                    <option>Yes — Partial</option>
                    <option>No — Forfeited</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        {step > 0 ? (
          <button onClick={prev} className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">← Previous</button>
        ) : <div />}
        {step < 5 ? (
          <button onClick={next} className="px-6 py-2 bg-rust text-white rounded-md text-sm font-medium hover:bg-rust-light transition-colors">Next →</button>
        ) : (
          <button onClick={handleSubmit} className="px-8 py-3 bg-rust text-white rounded-md font-bold text-sm hover:bg-rust-light transition-colors">🐾 Submit Agreement</button>
        )}
      </div>
    </div>
  )
}

function Confirmation({ data }) {
  return (
    <div className="pt-24 pb-16 px-4 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🐾</div>
        <h1 className="text-3xl font-bold text-rust mb-2">Agreement Submitted!</h1>
        <p className="text-gray-600">Thank you — your trap loan agreement has been recorded.</p>
        <div className="inline-block mt-4 bg-rust text-white px-6 py-2 rounded-md font-mono text-lg font-bold">
          Ref: {data.ref}
        </div>
      </div>
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h2 className="font-bold text-lg text-rust mb-3">Loan Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <div><span className="font-semibold">Name:</span> {data.borrower.fullName}</div>
          <div><span className="font-semibold">Phone:</span> {data.borrower.phone}</div>
          <div><span className="font-semibold">Traps:</span> {data.trapDetails.numTraps}</div>
          <div><span className="font-semibold">Trap IDs:</span> {data.trapDetails.trapIds || 'TBD'}</div>
          <div><span className="font-semibold">Checkout:</span> {data.loan.checkoutDate}</div>
          <div><span className="font-semibold">Return By:</span> {data.loan.returnDate}</div>
          <div><span className="font-semibold">Deposit:</span> ${Number(data.trapDetails.numTraps) * 50}.00</div>
          <div><span className="font-semibold">Signed By:</span> {data.sigName}</div>
        </div>
      </div>
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 text-sm text-yellow-800 mb-6">
        <p className="font-semibold">Reminders:</p>
        <p>• Check traps every 12 hours minimum</p>
        <p>• Return traps clean and in working condition by {data.loan.returnDate}</p>
        <p>• Contact us if you need an extension</p>
      </div>
      <div className="text-center">
        <a href="/" className="inline-block px-6 py-2 bg-rust text-white rounded-md font-medium hover:bg-rust-light transition-colors">← Back to Home</a>
      </div>
    </div>
  )
}
