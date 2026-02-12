import { useState, useEffect } from 'react'

const SECTIONS = [
  'Requestor Info',
  'Transporter Info',
  'Cat & Transport',
  'Chain of Custody',
  'Responsibilities',
  'Waiver & Signatures',
]

const transporterResponsibilities = [
  'Cats must remain in secure traps/carriers at all times during transport',
  'Vehicle must be climate-controlled (no extreme heat/cold)',
  'Traps must be covered with towel/sheet to reduce stress',
  'Do not open traps during transport',
  'Drive carefully — avoid sudden stops/turns',
  'Go directly to destination — no unnecessary stops',
  'Contact Sam\'s TNR immediately if any escape or emergency',
]

const liabilityText = 'The authorized transporter assumes full responsibility for the safety and well-being of the cat(s) during transit from pickup to delivery. The transporter hereby releases, waives, and discharges Sam\'s TNR, Inc., its officers, directors, employees, volunteers, and agents from any and all liability, claims, demands, or causes of action arising out of or related to the transport of said cat(s), including but not limited to escape, injury, death, property damage, or vehicle accidents occurring during transport. This release does not apply in cases of gross negligence or willful misconduct by Sam\'s TNR, Inc.'

function generateRef() {
  const d = new Date()
  const y = String(d.getFullYear()).slice(2)
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const r = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
  return `TA-${y}${m}-${r}`
}

export default function TransportAuthForm() {
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(null)

  const [requestor, setRequestor] = useState({ name: '', phone: '', email: '', intakeRef: '' })
  const [transporter, setTransporter] = useState({
    name: '', phone: '', email: '', driversLicense: '',
    vehicleDesc: '', licensePlate: '',
  })
  const [catDetails, setCatDetails] = useState({
    numCats: '', descriptions: '', pickupLocation: '', dropoffLocation: '',
  })
  const [transport, setTransport] = useState({ date: '', pickupTime: '', dropoffTime: '' })
  const [custody, setCustody] = useState({
    pickedUpFrom: '', deliveredTo: '', returnSamePerson: '', returnPersonName: '',
  })
  const [waiverAgreed, setWaiverAgreed] = useState(false)
  const [requestorSig, setRequestorSig] = useState('')
  const [transporterSig, setTransporterSig] = useState('')
  const [sigDate] = useState(new Date().toLocaleDateString('en-US'))

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [step])

  const updateRequestor = (k, v) => setRequestor(p => ({ ...p, [k]: v }))
  const updateTransporter = (k, v) => setTransporter(p => ({ ...p, [k]: v }))
  const updateCatDetails = (k, v) => setCatDetails(p => ({ ...p, [k]: v }))
  const updateTransport = (k, v) => setTransport(p => ({ ...p, [k]: v }))
  const updateCustody = (k, v) => setCustody(p => ({ ...p, [k]: v }))

  function validate() {
    const e = {}
    if (step === 0) {
      if (!requestor.name.trim()) e.reqName = 'Required'
      if (!requestor.phone.trim()) e.reqPhone = 'Required'
      if (requestor.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(requestor.email)) e.reqEmail = 'Invalid email'
    }
    if (step === 1) {
      if (!transporter.name.trim()) e.transName = 'Required'
      if (!transporter.phone.trim()) e.transPhone = 'Required'
      if (transporter.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(transporter.email)) e.transEmail = 'Invalid email'
    }
    if (step === 2) {
      if (!catDetails.numCats) e.numCats = 'Required'
      if (!catDetails.pickupLocation.trim()) e.pickupLocation = 'Required'
      if (!catDetails.dropoffLocation.trim()) e.dropoffLocation = 'Required'
      if (!transport.date) e.transDate = 'Required'
    }
    if (step === 3) {
      if (!custody.pickedUpFrom.trim()) e.pickedUpFrom = 'Required'
      if (!custody.deliveredTo.trim()) e.deliveredTo = 'Required'
      if (!custody.returnSamePerson) e.returnSamePerson = 'Required'
    }
    if (step === 5) {
      if (!waiverAgreed) e.waiver = 'You must agree to the liability waiver'
      if (!requestorSig.trim()) e.reqSig = 'Required'
      if (!transporterSig.trim()) e.transSig = 'Required'
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
      requestor, transporter, catDetails, transport, custody,
      waiverAgreed, requestorSig, transporterSig, sigDate,
    }
    const existing = JSON.parse(localStorage.getItem('tnr-transport-auth') || '[]')
    existing.push(submission)
    localStorage.setItem('tnr-transport-auth', JSON.stringify(existing))
    setSubmitted(submission)
  }

  if (submitted) return <Confirmation data={submitted} />

  const inputCls = 'w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rust focus:border-transparent'
  const labelCls = 'block text-sm font-semibold text-gray-700 mb-1'
  const errCls = 'text-red-600 text-xs mt-1'
  const sectionTitle = 'text-xl font-bold text-white bg-rust px-4 py-2 rounded-md mb-6'

  return (
    <div className="pt-24 pb-16 px-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-rust mb-2 text-center">Transport Authorization Form</h1>
      <p className="text-gray-600 text-center mb-8">Sam's TNR, Inc. — 501(c)(3) Nonprofit — Barney, Georgia</p>

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

      {/* Step 0: Requestor */}
      {step === 0 && (
        <div>
          <div className={sectionTitle}>Section 1 — Original Requestor Information</div>
          <p className="text-gray-500 text-sm mb-4">The person who filed the original TNR intake request.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Full Name *</label>
              <input className={inputCls} value={requestor.name} onChange={e => updateRequestor('name', e.target.value)} />
              {errors.reqName && <p className={errCls}>{errors.reqName}</p>}
            </div>
            <div>
              <label className={labelCls}>Phone Number *</label>
              <input className={inputCls} type="tel" value={requestor.phone} onChange={e => updateRequestor('phone', e.target.value)} />
              {errors.reqPhone && <p className={errCls}>{errors.reqPhone}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Email Address</label>
              <input className={inputCls} type="email" value={requestor.email} onChange={e => updateRequestor('email', e.target.value)} />
              {errors.reqEmail && <p className={errCls}>{errors.reqEmail}</p>}
            </div>
            <div>
              <label className={labelCls}>Intake Reference # (if applicable)</label>
              <input className={inputCls} value={requestor.intakeRef} onChange={e => updateRequestor('intakeRef', e.target.value)} placeholder="e.g. TNR-2602-1234" />
            </div>
          </div>
        </div>
      )}

      {/* Step 1: Transporter */}
      {step === 1 && (
        <div>
          <div className={sectionTitle}>Section 2 — Authorized Transporter Information</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Full Name *</label>
              <input className={inputCls} value={transporter.name} onChange={e => updateTransporter('name', e.target.value)} />
              {errors.transName && <p className={errCls}>{errors.transName}</p>}
            </div>
            <div>
              <label className={labelCls}>Phone Number *</label>
              <input className={inputCls} type="tel" value={transporter.phone} onChange={e => updateTransporter('phone', e.target.value)} />
              {errors.transPhone && <p className={errCls}>{errors.transPhone}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Email Address</label>
              <input className={inputCls} type="email" value={transporter.email} onChange={e => updateTransporter('email', e.target.value)} />
              {errors.transEmail && <p className={errCls}>{errors.transEmail}</p>}
            </div>
            <div>
              <label className={labelCls}>Driver's License #</label>
              <input className={inputCls} value={transporter.driversLicense} onChange={e => updateTransporter('driversLicense', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Vehicle Description</label>
              <input className={inputCls} value={transporter.vehicleDesc} onChange={e => updateTransporter('vehicleDesc', e.target.value)} placeholder="e.g. White 2020 Honda CR-V" />
            </div>
            <div>
              <label className={labelCls}>License Plate</label>
              <input className={inputCls} value={transporter.licensePlate} onChange={e => updateTransporter('licensePlate', e.target.value)} />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Cat & Transport Details */}
      {step === 2 && (
        <div>
          <div className={sectionTitle}>Section 3 — Cat & Transport Details</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Number of Cats *</label>
              <input className={inputCls} type="number" min="1" value={catDetails.numCats} onChange={e => updateCatDetails('numCats', e.target.value)} />
              {errors.numCats && <p className={errCls}>{errors.numCats}</p>}
            </div>
            <div>
              <label className={labelCls}>Transport Date *</label>
              <input className={inputCls} type="date" value={transport.date} onChange={e => updateTransport('date', e.target.value)} />
              {errors.transDate && <p className={errCls}>{errors.transDate}</p>}
            </div>
          </div>
          <div className="mb-4">
            <label className={labelCls}>Cat Descriptions</label>
            <textarea className={inputCls} rows="3" value={catDetails.descriptions} onChange={e => updateCatDetails('descriptions', e.target.value)} placeholder="Color, markings, trap numbers, etc." />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Pickup Location *</label>
              <input className={inputCls} value={catDetails.pickupLocation} onChange={e => updateCatDetails('pickupLocation', e.target.value)} />
              {errors.pickupLocation && <p className={errCls}>{errors.pickupLocation}</p>}
            </div>
            <div>
              <label className={labelCls}>Drop-off Location *</label>
              <input className={inputCls} value={catDetails.dropoffLocation} onChange={e => updateCatDetails('dropoffLocation', e.target.value)} />
              {errors.dropoffLocation && <p className={errCls}>{errors.dropoffLocation}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Estimated Pickup Time</label>
              <input className={inputCls} type="time" value={transport.pickupTime} onChange={e => updateTransport('pickupTime', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Estimated Drop-off Time</label>
              <input className={inputCls} type="time" value={transport.dropoffTime} onChange={e => updateTransport('dropoffTime', e.target.value)} />
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Chain of Custody */}
      {step === 3 && (
        <div>
          <div className={sectionTitle}>Section 4 — Chain of Custody</div>
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
              <label className={labelCls}>Cats Picked Up From (location/person) *</label>
              <input className={inputCls} value={custody.pickedUpFrom} onChange={e => updateCustody('pickedUpFrom', e.target.value)} placeholder="e.g. Jane Doe, 123 Main St" />
              {errors.pickedUpFrom && <p className={errCls}>{errors.pickedUpFrom}</p>}
            </div>
            <div>
              <label className={labelCls}>Cats Delivered To (location/person) *</label>
              <input className={inputCls} value={custody.deliveredTo} onChange={e => updateCustody('deliveredTo', e.target.value)} placeholder="e.g. ABC Vet Clinic, 456 Oak Ave" />
              {errors.deliveredTo && <p className={errCls}>{errors.deliveredTo}</p>}
            </div>
          </div>
          <div className="mb-4">
            <label className={labelCls}>Return Transport: Same Person? *</label>
            <div className="flex gap-4 mt-2">
              {['Yes', 'No'].map(v => (
                <label key={v} className="flex items-center gap-1 text-sm cursor-pointer">
                  <input type="radio" name="returnSame" checked={custody.returnSamePerson === v} onChange={() => updateCustody('returnSamePerson', v)} className="accent-rust" /> {v}
                </label>
              ))}
            </div>
            {errors.returnSamePerson && <p className={errCls}>{errors.returnSamePerson}</p>}
          </div>
          {custody.returnSamePerson === 'No' && (
            <div className="mb-4">
              <label className={labelCls}>Return Transport Person Name & Phone</label>
              <input className={inputCls} value={custody.returnPersonName} onChange={e => updateCustody('returnPersonName', e.target.value)} />
            </div>
          )}
        </div>
      )}

      {/* Step 4: Responsibilities */}
      {step === 4 && (
        <div>
          <div className={sectionTitle}>Section 5 — Transporter Responsibilities</div>
          <div className="bg-amber-50 border-l-4 border-amber-500 p-3 mb-6">
            <p className="text-sm font-bold text-amber-800">The authorized transporter agrees to the following:</p>
          </div>
          <div className="space-y-3 mb-4">
            {transporterResponsibilities.map((r, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-rust font-bold flex-shrink-0">{i + 1}.</span>
                <span className="text-sm text-gray-700">{r}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 5: Waiver & Signatures */}
      {step === 5 && (
        <div>
          <div className={sectionTitle}>Section 6 — Liability Waiver & Signatures</div>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 mb-4">
            <p className="text-sm font-bold text-yellow-800">PLEASE READ CAREFULLY. This is a legal document.</p>
          </div>
          <div className="border border-gray-300 rounded-md p-4 mb-4 bg-white text-sm text-gray-700 leading-relaxed">
            <p>{liabilityText}</p>
            <p className="text-xs text-gray-500 mt-4">This waiver is governed by the laws of the State of Georgia.</p>
          </div>
          <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-gray-50 mb-6">
            <input type="checkbox" checked={waiverAgreed} onChange={() => setWaiverAgreed(!waiverAgreed)} className="mt-1 accent-rust" />
            <span className="text-sm font-semibold text-gray-700">I have read, understand, and agree to the Liability Waiver</span>
          </label>
          {errors.waiver && <p className={errCls + ' mb-4'}>{errors.waiver}</p>}

          <h3 className="font-bold text-rust mb-4">Signatures</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Requestor Signature *</label>
              <input className={inputCls + ' font-cursive text-lg'} style={{ fontFamily: 'cursive' }} value={requestorSig} onChange={e => setRequestorSig(e.target.value)} placeholder="Requestor full name" />
              {errors.reqSig && <p className={errCls}>{errors.reqSig}</p>}
            </div>
            <div>
              <label className={labelCls}>Transporter Signature *</label>
              <input className={inputCls + ' font-cursive text-lg'} style={{ fontFamily: 'cursive' }} value={transporterSig} onChange={e => setTransporterSig(e.target.value)} placeholder="Transporter full name" />
              {errors.transSig && <p className={errCls}>{errors.transSig}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Date</label>
              <input className={inputCls + ' bg-gray-100'} value={sigDate} readOnly />
            </div>
            <div>
              <label className={labelCls}>Date</label>
              <input className={inputCls + ' bg-gray-100'} value={sigDate} readOnly />
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
        {step < 5 ? (
          <button onClick={next} className="px-6 py-2 bg-rust text-white rounded-md text-sm font-medium hover:bg-rust-light transition-colors">
            Next →
          </button>
        ) : (
          <button onClick={handleSubmit} className="px-8 py-3 bg-rust text-white rounded-md font-bold text-sm hover:bg-rust-light transition-colors">
            🐾 Submit Transport Authorization
          </button>
        )}
      </div>
    </div>
  )
}

function Confirmation({ data }) {
  return (
    <div className="pt-24 pb-16 px-4 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🚗</div>
        <h1 className="text-3xl font-bold text-rust mb-2">Transport Authorization Submitted!</h1>
        <p className="text-gray-600">The transport has been authorized and documented.</p>
        <div className="inline-block mt-4 bg-rust text-white px-6 py-2 rounded-md font-mono text-lg font-bold">
          Ref: {data.ref}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h2 className="font-bold text-lg text-rust mb-3">Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <div><span className="font-semibold">Requestor:</span> {data.requestor.name}</div>
          <div><span className="font-semibold">Transporter:</span> {data.transporter.name}</div>
          <div><span className="font-semibold"># Cats:</span> {data.catDetails.numCats}</div>
          <div><span className="font-semibold">Date:</span> {data.transport.date}</div>
          <div><span className="font-semibold">From:</span> {data.catDetails.pickupLocation}</div>
          <div><span className="font-semibold">To:</span> {data.catDetails.dropoffLocation}</div>
          <div><span className="font-semibold">Requestor Signed:</span> {data.requestorSig}</div>
          <div><span className="font-semibold">Transporter Signed:</span> {data.transporterSig}</div>
        </div>
      </div>

      <div className="text-center">
        <a href="/" className="inline-block px-6 py-2 bg-rust text-white rounded-md font-medium hover:bg-rust-light transition-colors">
          ← Back to Home
        </a>
      </div>
    </div>
  )
}
