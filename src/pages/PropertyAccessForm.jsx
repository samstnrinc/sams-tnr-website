import { useState, useEffect } from 'react'

const SECTIONS = ['Property Owner', 'Property Info', 'Authorization', 'Conditions', 'Signature']

const PROPERTY_TYPES = ['Residential', 'Commercial', 'Apartment complex', 'Farm', 'Public land', 'HOA common area']
const ROLE_OPTIONS = ['Owner', 'Property manager', 'HOA board member', 'Tenant with owner permission', 'Business owner', 'Other']
const ACTIVITIES = ['Setting humane traps', 'Retrieving traps', 'Feeding/monitoring colony', 'Assessing colony']
const DURATION_OPTIONS = ['One-time access', 'Recurring access', 'Ongoing until revoked in writing']

const CONDITIONS = [
  "Sam's TNR will notify property owner/manager before each visit when possible.",
  "Sam's TNR volunteers will carry identification.",
  "Sam's TNR will leave the property in the same condition as found.",
  "Sam's TNR is not responsible for pre-existing property conditions.",
  "Permission may be revoked at any time with written or verbal notice.",
  "Property owner is not liable for injuries to Sam's TNR volunteers on property (mutual release).",
]

function generateRef() {
  const d = new Date()
  const y = String(d.getFullYear()).slice(2)
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const r = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
  return `PAP-${y}${m}-${r}`
}

export default function PropertyAccessForm() {
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(null)

  const [owner, setOwner] = useState({ name: '', phone: '', email: '', address: '', city: '', state: '', zip: '' })
  const [property, setProperty] = useState({ address: '', type: '', unitNumbers: '' })
  const [ownerRole, setOwnerRole] = useState('')
  const [ownerRoleOther, setOwnerRoleOther] = useState('')
  const [activities, setActivities] = useState([...ACTIVITIES])
  const [accessDates, setAccessDates] = useState({ from: '', to: '', ongoing: false })
  const [accessTimes, setAccessTimes] = useState('daylight')
  const [accessTimesSpecific, setAccessTimesSpecific] = useState('')
  const [accessInstructions, setAccessInstructions] = useState('')
  const [areasAuthorized, setAreasAuthorized] = useState('entire')
  const [areasAuthorizedDesc, setAreasAuthorizedDesc] = useState('')
  const [areasRestricted, setAreasRestricted] = useState('')
  const [conditionsAgreed, setConditionsAgreed] = useState(new Array(CONDITIONS.length).fill(false))
  const [tenantNotified, setTenantNotified] = useState('')
  const [duration, setDuration] = useState('')
  const [durationMonths, setDurationMonths] = useState('')
  const [sigName, setSigName] = useState('')
  const [sigDate] = useState(new Date().toLocaleDateString('en-US'))
  const [witnessName, setWitnessName] = useState('')
  const [witnessDate, setWitnessDate] = useState('')

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [step])

  const updateOwner = (k, v) => setOwner(p => ({ ...p, [k]: v }))
  const updateProperty = (k, v) => setProperty(p => ({ ...p, [k]: v }))
  const toggleActivity = (a) => setActivities(p => p.includes(a) ? p.filter(x => x !== a) : [...p, a])

  const inputCls = 'w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rust focus:border-transparent'
  const labelCls = 'block text-sm font-semibold text-gray-700 mb-1'
  const errCls = 'text-red-600 text-xs mt-1'
  const sectionTitle = 'text-xl font-bold text-white bg-rust px-4 py-2 rounded-md mb-6'

  function validate() {
    const e = {}
    if (step === 0) {
      if (!owner.name.trim()) e.ownerName = 'Required'
      if (!owner.phone.trim()) e.ownerPhone = 'Required'
      if (!owner.address.trim()) e.ownerAddress = 'Required'
      if (!owner.city.trim()) e.ownerCity = 'Required'
      if (!owner.state.trim()) e.ownerState = 'Required'
      if (!owner.zip.trim()) e.ownerZip = 'Required'
      if (owner.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(owner.email)) e.ownerEmail = 'Invalid email'
    }
    if (step === 1) {
      if (!property.address.trim()) e.propAddress = 'Required'
      if (!property.type) e.propType = 'Required'
      if (!ownerRole) e.ownerRole = 'Required'
    }
    if (step === 2) {
      if (activities.length === 0) e.activities = 'Select at least one'
      if (!accessDates.ongoing && !accessDates.from) e.accessFrom = 'Required'
    }
    if (step === 3) {
      if (!conditionsAgreed.every(Boolean)) e.conditions = 'All conditions must be acknowledged'
      if (!duration) e.duration = 'Required'
    }
    if (step === 4) {
      if (!sigName.trim()) e.sigName = 'Required'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function next() { if (validate()) setStep(s => Math.min(s + 1, 4)) }
  function prev() { setErrors({}); setStep(s => Math.max(s - 1, 0)) }

  function handleSubmit() {
    if (!validate()) return
    const ref = generateRef()
    const submission = {
      ref, date: new Date().toISOString(),
      owner, property, ownerRole, ownerRoleOther, activities,
      accessDates, accessTimes, accessTimesSpecific, accessInstructions,
      areasAuthorized, areasAuthorizedDesc, areasRestricted,
      conditionsAgreed, tenantNotified, duration, durationMonths,
      sigName, sigDate, witnessName, witnessDate
    }
    const existing = JSON.parse(localStorage.getItem('tnr-property-access') || '[]')
    existing.push(submission)
    localStorage.setItem('tnr-property-access', JSON.stringify(existing))
    setSubmitted(submission)
  }

  if (submitted) {
    return (
      <div className="pt-24 pb-16 px-4 max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏠</div>
          <h1 className="text-3xl font-bold text-rust mb-2">Permission Form Submitted!</h1>
          <p className="text-gray-600">Thank you for granting property access for TNR services.</p>
          <div className="inline-block mt-4 bg-rust text-white px-6 py-2 rounded-md font-mono text-lg font-bold">
            Ref: {submitted.ref}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h2 className="font-bold text-lg text-rust mb-3">Submission Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div><span className="font-semibold">Property Owner:</span> {submitted.owner.name}</div>
            <div><span className="font-semibold">Property:</span> {submitted.property.address}</div>
            <div><span className="font-semibold">Type:</span> {submitted.property.type}</div>
            <div><span className="font-semibold">Role:</span> {submitted.ownerRole}</div>
            <div><span className="font-semibold">Activities:</span> {submitted.activities.join(', ')}</div>
            <div><span className="font-semibold">Duration:</span> {submitted.duration}{submitted.durationMonths ? ` (${submitted.durationMonths} months)` : ''}</div>
            <div><span className="font-semibold">Signed By:</span> {submitted.sigName}</div>
            <div><span className="font-semibold">Date:</span> {submitted.sigDate}</div>
          </div>
        </div>
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 text-sm text-yellow-800 mb-6">
          <p className="font-semibold">What happens next?</p>
          <p>A Sam's TNR volunteer will contact you to coordinate trapping activities. Please save your reference number for your records.</p>
        </div>
        <div className="text-center">
          <a href="/" className="inline-block px-6 py-2 bg-rust text-white rounded-md font-medium hover:bg-rust-light transition-colors">
            ← Back to Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-16 px-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-rust mb-2 text-center">Property Access Permission Form</h1>
      <p className="text-gray-600 text-center mb-8">Authorization for Sam's TNR, Inc. to access property for TNR purposes</p>

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

      {/* Step 0: Property Owner Info */}
      {step === 0 && (
        <div>
          <div className={sectionTitle}>Property Owner / Manager Information</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Full Name *</label>
              <input className={inputCls} value={owner.name} onChange={e => updateOwner('name', e.target.value)} />
              {errors.ownerName && <p className={errCls}>{errors.ownerName}</p>}
            </div>
            <div>
              <label className={labelCls}>Phone *</label>
              <input className={inputCls} type="tel" value={owner.phone} onChange={e => updateOwner('phone', e.target.value)} />
              {errors.ownerPhone && <p className={errCls}>{errors.ownerPhone}</p>}
            </div>
          </div>
          <div className="mb-4">
            <label className={labelCls}>Email</label>
            <input className={inputCls} type="email" value={owner.email} onChange={e => updateOwner('email', e.target.value)} />
            {errors.ownerEmail && <p className={errCls}>{errors.ownerEmail}</p>}
          </div>
          <div className="mb-4">
            <label className={labelCls}>Mailing Address *</label>
            <input className={inputCls} value={owner.address} onChange={e => updateOwner('address', e.target.value)} />
            {errors.ownerAddress && <p className={errCls}>{errors.ownerAddress}</p>}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div className="col-span-2">
              <label className={labelCls}>City *</label>
              <input className={inputCls} value={owner.city} onChange={e => updateOwner('city', e.target.value)} />
              {errors.ownerCity && <p className={errCls}>{errors.ownerCity}</p>}
            </div>
            <div>
              <label className={labelCls}>State *</label>
              <input className={inputCls} value={owner.state} onChange={e => updateOwner('state', e.target.value)} />
              {errors.ownerState && <p className={errCls}>{errors.ownerState}</p>}
            </div>
            <div>
              <label className={labelCls}>ZIP *</label>
              <input className={inputCls} value={owner.zip} onChange={e => updateOwner('zip', e.target.value)} />
              {errors.ownerZip && <p className={errCls}>{errors.ownerZip}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Step 1: Property Info + Role */}
      {step === 1 && (
        <div>
          <div className={sectionTitle}>Property Information</div>
          <div className="mb-4">
            <label className={labelCls}>Property Address (where trapping will occur) *</label>
            <input className={inputCls} value={property.address} onChange={e => updateProperty('address', e.target.value)} />
            {errors.propAddress && <p className={errCls}>{errors.propAddress}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Property Type *</label>
              <select className={inputCls} value={property.type} onChange={e => updateProperty('type', e.target.value)}>
                <option value="">Select...</option>
                {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.propType && <p className={errCls}>{errors.propType}</p>}
            </div>
            <div>
              <label className={labelCls}>Unit Numbers (if applicable)</label>
              <input className={inputCls} value={property.unitNumbers} onChange={e => updateProperty('unitNumbers', e.target.value)} />
            </div>
          </div>

          <div className={sectionTitle}>Your Role</div>
          <p className="text-sm text-gray-600 mb-3">I am the:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {ROLE_OPTIONS.map(r => (
              <label key={r} className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer text-sm">
                <input type="radio" name="ownerRole" checked={ownerRole === r} onChange={() => setOwnerRole(r)} className="accent-rust" />
                {r}
              </label>
            ))}
          </div>
          {ownerRole === 'Other' && (
            <div className="mb-4">
              <label className={labelCls}>Describe Role</label>
              <input className={inputCls} value={ownerRoleOther} onChange={e => setOwnerRoleOther(e.target.value)} />
            </div>
          )}
          {errors.ownerRole && <p className={errCls}>{errors.ownerRole}</p>}
        </div>
      )}

      {/* Step 2: Authorization */}
      {step === 2 && (
        <div>
          <div className={sectionTitle}>Authorization Details</div>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 mb-6">
            <p className="text-sm text-yellow-800 font-semibold">I authorize Sam's TNR, Inc. to access the above property for Trap-Neuter-Return (TNR) purposes.</p>
          </div>

          <div className="mb-6">
            <label className={labelCls}>Authorized Activities</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ACTIVITIES.map(a => (
                <label key={a} className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer text-sm">
                  <input type="checkbox" checked={activities.includes(a)} onChange={() => toggleActivity(a)} className="accent-rust" />
                  {a}
                </label>
              ))}
            </div>
            {errors.activities && <p className={errCls}>{errors.activities}</p>}
          </div>

          <div className="mb-4">
            <label className={labelCls}>Access Dates</label>
            <label className="flex items-center gap-2 text-sm mb-3 cursor-pointer">
              <input type="checkbox" checked={accessDates.ongoing} onChange={() => setAccessDates(p => ({ ...p, ongoing: !p.ongoing }))} className="accent-rust" />
              Ongoing until revoked
            </label>
            {!accessDates.ongoing && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>From *</label>
                  <input className={inputCls} type="date" value={accessDates.from} onChange={e => setAccessDates(p => ({ ...p, from: e.target.value }))} />
                  {errors.accessFrom && <p className={errCls}>{errors.accessFrom}</p>}
                </div>
                <div>
                  <label className={labelCls}>To</label>
                  <input className={inputCls} type="date" value={accessDates.to} onChange={e => setAccessDates(p => ({ ...p, to: e.target.value }))} />
                </div>
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className={labelCls}>Access Times</label>
            <div className="flex gap-4 mb-2">
              {[['daylight', 'Reasonable daylight hours'], ['specific', 'Specific hours']].map(([v, l]) => (
                <label key={v} className="flex items-center gap-1 text-sm cursor-pointer">
                  <input type="radio" name="accessTimes" checked={accessTimes === v} onChange={() => setAccessTimes(v)} className="accent-rust" /> {l}
                </label>
              ))}
            </div>
            {accessTimes === 'specific' && (
              <input className={inputCls} value={accessTimesSpecific} onChange={e => setAccessTimesSpecific(e.target.value)} placeholder="e.g. 8:00 AM - 6:00 PM" />
            )}
          </div>

          <div className="mb-4">
            <label className={labelCls}>Specific Access Instructions</label>
            <textarea className={inputCls} rows="3" value={accessInstructions} onChange={e => setAccessInstructions(e.target.value)} placeholder="Gate codes, which entrance, who to contact on-site, parking instructions..." />
          </div>

          <div className="mb-4">
            <label className={labelCls}>Areas of Property Authorized</label>
            <div className="flex gap-4 mb-2">
              {[['entire', 'Entire property'], ['specific', 'Specific areas only']].map(([v, l]) => (
                <label key={v} className="flex items-center gap-1 text-sm cursor-pointer">
                  <input type="radio" name="areasAuth" checked={areasAuthorized === v} onChange={() => setAreasAuthorized(v)} className="accent-rust" /> {l}
                </label>
              ))}
            </div>
            {areasAuthorized === 'specific' && (
              <textarea className={inputCls} rows="2" value={areasAuthorizedDesc} onChange={e => setAreasAuthorizedDesc(e.target.value)} placeholder="Describe authorized areas..." />
            )}
          </div>

          <div className="mb-4">
            <label className={labelCls}>Areas Restricted / Off-Limits</label>
            <textarea className={inputCls} rows="2" value={areasRestricted} onChange={e => setAreasRestricted(e.target.value)} placeholder="Describe any restricted areas..." />
          </div>
        </div>
      )}

      {/* Step 3: Conditions */}
      {step === 3 && (
        <div>
          <div className={sectionTitle}>Terms & Conditions</div>
          <p className="text-gray-600 text-sm mb-4">Please read and acknowledge each condition:</p>
          <div className="space-y-3 mb-6">
            {CONDITIONS.map((c, i) => (
              <label key={i} className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                <input type="checkbox" checked={conditionsAgreed[i]} onChange={() => { const n = [...conditionsAgreed]; n[i] = !n[i]; setConditionsAgreed(n) }} className="mt-1 accent-rust flex-shrink-0" />
                <span className="text-sm text-gray-700">{c}</span>
              </label>
            ))}
          </div>
          {errors.conditions && <p className={errCls + ' mb-4'}>{errors.conditions}</p>}

          {(property.type === 'Apartment complex' || property.type === 'HOA common area') && (
            <div className="mb-6">
              <label className={labelCls}>Have tenants been notified?</label>
              <div className="flex gap-4 mt-1">
                {['Yes', 'No'].map(v => (
                  <label key={v} className="flex items-center gap-1 text-sm cursor-pointer">
                    <input type="radio" name="tenantNotified" checked={tenantNotified === v} onChange={() => setTenantNotified(v)} className="accent-rust" /> {v}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className={sectionTitle}>Duration</div>
          <div className="space-y-3 mb-4">
            {DURATION_OPTIONS.map(d => (
              <label key={d} className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer text-sm">
                <input type="radio" name="duration" checked={duration === d} onChange={() => setDuration(d)} className="accent-rust" />
                {d}
              </label>
            ))}
          </div>
          {duration === 'Recurring access' && (
            <div className="mb-4">
              <label className={labelCls}>Number of Months</label>
              <input className={inputCls + ' max-w-xs'} type="number" min="1" value={durationMonths} onChange={e => setDurationMonths(e.target.value)} />
            </div>
          )}
          {errors.duration && <p className={errCls}>{errors.duration}</p>}
        </div>
      )}

      {/* Step 4: Signature */}
      {step === 4 && (
        <div>
          <div className={sectionTitle}>Property Owner / Manager Signature</div>
          <p className="text-gray-600 text-sm mb-6">By signing below, I confirm that I have the authority to grant access to the property described above and agree to the terms and conditions of this permission form.</p>
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

          <div className={sectionTitle}>Witness (Optional)</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className={labelCls}>Witness Name</label>
              <input className={inputCls} style={{ fontFamily: 'cursive' }} value={witnessName} onChange={e => setWitnessName(e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Witness Date</label>
              <input className={inputCls} type="date" value={witnessDate} onChange={e => setWitnessDate(e.target.value)} />
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
        {step < 4 ? (
          <button onClick={next} className="px-6 py-2 bg-rust text-white rounded-md text-sm font-medium hover:bg-rust-light transition-colors">
            Next →
          </button>
        ) : (
          <button onClick={handleSubmit} className="px-8 py-3 bg-rust text-white rounded-md font-bold text-sm hover:bg-rust-light transition-colors">
            🏠 Submit Permission Form
          </button>
        )}
      </div>
    </div>
  )
}
