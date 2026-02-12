import { useState, useEffect } from 'react'

const SECTIONS = [
  'Foster Parent',
  'Housing & Household',
  'Cat Info',
  'Foster Type',
  'Responsibilities',
  'Waiver & Signature',
]

const fosterResponsibilities = [
  'Provide safe indoor space (separate room for initial quarantine)',
  'Provide food, water, clean litter daily',
  'Administer medications as prescribed',
  'Keep cat indoors at all times',
  'Transport to/from vet appointments as needed',
  'Socialize cat through gentle, regular interaction',
  'Send weekly photo/video updates to Sam\'s TNR',
  'Allow home visit by Sam\'s TNR if requested',
  'Return cat to Sam\'s TNR upon request or when foster period ends',
  'Do NOT rehome, give away, or claim ownership of the cat',
  'Notify Sam\'s TNR immediately of illness, injury, escape, or behavioral concerns',
]

const samsProvides = [
  'All veterinary care (pre-approved)',
  'Food/litter if needed (just ask!)',
  'Behavioral guidance and support',
  'Adoption posting and screening',
]

const fosterTypes = [
  { val: 'short-term', label: 'Short-term recovery (< 2 weeks)' },
  { val: 'socialization', label: 'Socialization (2–8 weeks)' },
  { val: 'long-term', label: 'Long-term / medical' },
  { val: 'kitten', label: 'Kitten fostering' },
  { val: 'nursing', label: 'Nursing mother + kittens' },
]

const liabilityText = 'The foster parent assumes full responsibility for the cat(s) placed in their care by Sam\'s TNR, Inc. The foster parent hereby releases, waives, and discharges Sam\'s TNR, Inc., its officers, directors, employees, volunteers, and agents from any and all liability, claims, demands, or causes of action arising out of or related to property damage, injury to household members or other pets, or any other loss occurring while the cat(s) are in foster care. This release does not apply in cases of gross negligence or willful misconduct by Sam\'s TNR, Inc.'

function generateRef() {
  const d = new Date()
  const y = String(d.getFullYear()).slice(2)
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const r = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
  return `FA-${y}${m}-${r}`
}

const emptyPet = { type: '', breed: '', spayedNeutered: '', vaccinated: '' }

export default function FosterForm() {
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(null)

  const [foster, setFoster] = useState({ name: '', phone: '', email: '', address: '' })
  const [housing, setHousing] = useState({
    type: '', ownRent: '', landlordPermission: '', landlordName: '', landlordPhone: '',
  })
  const [household, setHousehold] = useState({
    numAdults: '', numChildren: '', childrenAges: '', pets: [{ ...emptyPet }],
  })
  const [catInfo, setCatInfo] = useState({
    description: '', name: '', sex: '', age: '', colonyLocation: '',
    medicalNotes: '', temperament: '',
  })
  const [fosterType, setFosterType] = useState([])
  const [emergencyVetLimit, setEmergencyVetLimit] = useState('')
  const [waiverAgreed, setWaiverAgreed] = useState(false)
  const [sigName, setSigName] = useState('')
  const [sigDate] = useState(new Date().toLocaleDateString('en-US'))

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [step])

  const updateFoster = (k, v) => setFoster(p => ({ ...p, [k]: v }))
  const updateHousing = (k, v) => setHousing(p => ({ ...p, [k]: v }))
  const updateHousehold = (k, v) => setHousehold(p => ({ ...p, [k]: v }))
  const updateCat = (k, v) => setCatInfo(p => ({ ...p, [k]: v }))
  const updatePet = (i, k, v) => setHousehold(p => {
    const pets = [...p.pets]; pets[i] = { ...pets[i], [k]: v }; return { ...p, pets }
  })
  const addPet = () => setHousehold(p => ({ ...p, pets: [...p.pets, { ...emptyPet }] }))
  const removePet = (i) => setHousehold(p => ({ ...p, pets: p.pets.filter((_, j) => j !== i) }))
  const toggleFosterType = (t) => setFosterType(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t])

  function validate() {
    const e = {}
    if (step === 0) {
      if (!foster.name.trim()) e.fosterName = 'Required'
      if (!foster.phone.trim()) e.fosterPhone = 'Required'
      if (!foster.email.trim()) e.fosterEmail = 'Required'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(foster.email)) e.fosterEmail = 'Invalid email'
      if (!foster.address.trim()) e.fosterAddress = 'Required'
    }
    if (step === 1) {
      if (!housing.type) e.housingType = 'Required'
      if (!housing.ownRent) e.ownRent = 'Required'
      if (housing.ownRent === 'Rent' && !housing.landlordPermission) e.landlordPermission = 'Required'
    }
    if (step === 2) {
      if (!catInfo.description.trim()) e.catDesc = 'Required'
      if (!catInfo.sex) e.catSex = 'Required'
    }
    if (step === 3) {
      if (fosterType.length === 0) e.fosterType = 'Select at least one foster type'
    }
    if (step === 5) {
      if (!waiverAgreed) e.waiver = 'You must agree to the liability waiver'
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
      foster, housing, household, catInfo, fosterType, emergencyVetLimit,
      waiverAgreed, sigName, sigDate,
    }
    const existing = JSON.parse(localStorage.getItem('tnr-foster-agreements') || '[]')
    existing.push(submission)
    localStorage.setItem('tnr-foster-agreements', JSON.stringify(existing))
    setSubmitted(submission)
  }

  if (submitted) return <Confirmation data={submitted} />

  const inputCls = 'w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rust focus:border-transparent'
  const labelCls = 'block text-sm font-semibold text-gray-700 mb-1'
  const errCls = 'text-red-600 text-xs mt-1'
  const sectionTitle = 'text-xl font-bold text-white bg-rust px-4 py-2 rounded-md mb-6'

  return (
    <div className="pt-24 pb-16 px-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-rust mb-2 text-center">Foster Agreement</h1>
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

      {/* Step 0: Foster Parent Info */}
      {step === 0 && (
        <div>
          <div className={sectionTitle}>Section 1 — Foster Parent Information</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Full Name *</label>
              <input className={inputCls} value={foster.name} onChange={e => updateFoster('name', e.target.value)} />
              {errors.fosterName && <p className={errCls}>{errors.fosterName}</p>}
            </div>
            <div>
              <label className={labelCls}>Phone Number *</label>
              <input className={inputCls} type="tel" value={foster.phone} onChange={e => updateFoster('phone', e.target.value)} />
              {errors.fosterPhone && <p className={errCls}>{errors.fosterPhone}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Email Address *</label>
              <input className={inputCls} type="email" value={foster.email} onChange={e => updateFoster('email', e.target.value)} />
              {errors.fosterEmail && <p className={errCls}>{errors.fosterEmail}</p>}
            </div>
          </div>
          <div className="mb-4">
            <label className={labelCls}>Full Address *</label>
            <input className={inputCls} value={foster.address} onChange={e => updateFoster('address', e.target.value)} placeholder="Street, City, State, ZIP" />
            {errors.fosterAddress && <p className={errCls}>{errors.fosterAddress}</p>}
          </div>
        </div>
      )}

      {/* Step 1: Housing & Household */}
      {step === 1 && (
        <div>
          <div className={sectionTitle}>Section 2 — Housing & Household Information</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Housing Type *</label>
              <div className="flex gap-4 mt-2 flex-wrap">
                {['House', 'Apartment', 'Condo'].map(v => (
                  <label key={v} className="flex items-center gap-1 text-sm cursor-pointer">
                    <input type="radio" name="housingType" checked={housing.type === v} onChange={() => updateHousing('type', v)} className="accent-rust" /> {v}
                  </label>
                ))}
              </div>
              {errors.housingType && <p className={errCls}>{errors.housingType}</p>}
            </div>
            <div>
              <label className={labelCls}>Own or Rent? *</label>
              <div className="flex gap-4 mt-2">
                {['Own', 'Rent'].map(v => (
                  <label key={v} className="flex items-center gap-1 text-sm cursor-pointer">
                    <input type="radio" name="ownRent" checked={housing.ownRent === v} onChange={() => updateHousing('ownRent', v)} className="accent-rust" /> {v}
                  </label>
                ))}
              </div>
              {errors.ownRent && <p className={errCls}>{errors.ownRent}</p>}
            </div>
          </div>
          {housing.ownRent === 'Rent' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className={labelCls}>Landlord Permission for Cats? *</label>
                <div className="flex gap-4 mt-2">
                  {['Yes', 'No'].map(v => (
                    <label key={v} className="flex items-center gap-1 text-sm cursor-pointer">
                      <input type="radio" name="landlordPerm" checked={housing.landlordPermission === v} onChange={() => updateHousing('landlordPermission', v)} className="accent-rust" /> {v}
                    </label>
                  ))}
                </div>
                {errors.landlordPermission && <p className={errCls}>{errors.landlordPermission}</p>}
              </div>
              <div>
                <label className={labelCls}>Landlord Name</label>
                <input className={inputCls} value={housing.landlordName} onChange={e => updateHousing('landlordName', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Landlord Phone</label>
                <input className={inputCls} type="tel" value={housing.landlordPhone} onChange={e => updateHousing('landlordPhone', e.target.value)} />
              </div>
            </div>
          )}

          <hr className="my-6 border-gray-300" />
          <h3 className="font-bold text-rust mb-4">Household</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className={labelCls}>Number of Adults</label>
              <input className={inputCls} type="number" min="1" value={household.numAdults} onChange={e => updateHousehold('numAdults', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Number of Children</label>
              <input className={inputCls} type="number" min="0" value={household.numChildren} onChange={e => updateHousehold('numChildren', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Children's Ages</label>
              <input className={inputCls} value={household.childrenAges} onChange={e => updateHousehold('childrenAges', e.target.value)} placeholder="e.g. 5, 8, 12" />
            </div>
          </div>

          <h4 className="font-semibold text-sm text-gray-700 mb-2">Current Pets</h4>
          {household.pets.map((pet, i) => (
            <div key={i} className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-2 items-end">
              <div>
                <label className="text-xs text-gray-500">Type</label>
                <input className={inputCls} value={pet.type} onChange={e => updatePet(i, 'type', e.target.value)} placeholder="Dog, Cat..." />
              </div>
              <div>
                <label className="text-xs text-gray-500">Breed</label>
                <input className={inputCls} value={pet.breed} onChange={e => updatePet(i, 'breed', e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-gray-500">Spayed/Neutered?</label>
                <select className={inputCls} value={pet.spayedNeutered} onChange={e => updatePet(i, 'spayedNeutered', e.target.value)}>
                  <option value="">—</option><option>Yes</option><option>No</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500">Vaccinated?</label>
                <select className={inputCls} value={pet.vaccinated} onChange={e => updatePet(i, 'vaccinated', e.target.value)}>
                  <option value="">—</option><option>Yes</option><option>No</option>
                </select>
              </div>
              <div>
                {household.pets.length > 1 && (
                  <button onClick={() => removePet(i)} className="text-red-500 hover:text-red-700 text-lg" title="Remove">×</button>
                )}
              </div>
            </div>
          ))}
          <button onClick={addPet} className="text-sm text-rust font-semibold hover:underline mt-1">+ Add Another Pet</button>
        </div>
      )}

      {/* Step 2: Cat Info */}
      {step === 2 && (
        <div>
          <div className={sectionTitle}>Section 3 — Cat Information</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Cat Description (color, markings) *</label>
              <input className={inputCls} value={catInfo.description} onChange={e => updateCat('description', e.target.value)} />
              {errors.catDesc && <p className={errCls}>{errors.catDesc}</p>}
            </div>
            <div>
              <label className={labelCls}>Name (if given)</label>
              <input className={inputCls} value={catInfo.name} onChange={e => updateCat('name', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className={labelCls}>Sex *</label>
              <div className="flex gap-4 mt-2">
                {['Male', 'Female', 'Unknown'].map(v => (
                  <label key={v} className="flex items-center gap-1 text-sm cursor-pointer">
                    <input type="radio" name="catSex" checked={catInfo.sex === v} onChange={() => updateCat('sex', v)} className="accent-rust" /> {v}
                  </label>
                ))}
              </div>
              {errors.catSex && <p className={errCls}>{errors.catSex}</p>}
            </div>
            <div>
              <label className={labelCls}>Estimated Age</label>
              <input className={inputCls} value={catInfo.age} onChange={e => updateCat('age', e.target.value)} placeholder="e.g. 6 months, 2 years" />
            </div>
            <div>
              <label className={labelCls}>Temperament</label>
              <select className={inputCls} value={catInfo.temperament} onChange={e => updateCat('temperament', e.target.value)}>
                <option value="">Select...</option>
                <option>Friendly</option>
                <option>Shy</option>
                <option>Needs socialization</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Source / Colony Location</label>
              <input className={inputCls} value={catInfo.colonyLocation} onChange={e => updateCat('colonyLocation', e.target.value)} />
            </div>
          </div>
          <div className="mb-4">
            <label className={labelCls}>Medical History / Notes</label>
            <textarea className={inputCls} rows="3" value={catInfo.medicalNotes} onChange={e => updateCat('medicalNotes', e.target.value)} placeholder="Known medical conditions, medications, special needs..." />
          </div>
        </div>
      )}

      {/* Step 3: Foster Type */}
      {step === 3 && (
        <div>
          <div className={sectionTitle}>Section 4 — Foster Type</div>
          <p className="text-gray-600 text-sm mb-4">Select all that apply:</p>
          <div className="space-y-3 mb-4">
            {fosterTypes.map(ft => (
              <label key={ft.val} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                <input type="checkbox" checked={fosterType.includes(ft.val)} onChange={() => toggleFosterType(ft.val)} className="accent-rust flex-shrink-0" />
                <span className="text-sm text-gray-700">{ft.label}</span>
              </label>
            ))}
          </div>
          {errors.fosterType && <p className={errCls}>{errors.fosterType}</p>}
        </div>
      )}

      {/* Step 4: Responsibilities */}
      {step === 4 && (
        <div>
          <div className={sectionTitle}>Section 5 — Responsibilities & What We Provide</div>

          <h3 className="font-bold text-rust mb-3">Foster Parent Responsibilities</h3>
          <div className="space-y-2 mb-6">
            {fosterResponsibilities.map((r, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-rust font-bold flex-shrink-0">{i + 1}.</span>
                <span className="text-sm text-gray-700">{r}</span>
              </div>
            ))}
          </div>

          <h3 className="font-bold text-rust mb-3">Sam's TNR Provides</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
            {samsProvides.map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="text-green-600">✅</span> {s}
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-800 mb-6">
            <p className="font-semibold">Adoption Process</p>
            <p>If you want to adopt your foster cat, please discuss with Sam's TNR first. An adoption fee may apply. Foster parents get first consideration!</p>
          </div>
        </div>
      )}

      {/* Step 5: Waiver & Signature */}
      {step === 5 && (
        <div>
          <div className={sectionTitle}>Section 6 — Liability Waiver, Emergency Auth & Signature</div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 mb-4">
            <p className="text-sm font-bold text-yellow-800">PLEASE READ CAREFULLY. This is a legal document.</p>
          </div>
          <div className="border border-gray-300 rounded-md p-4 mb-4 bg-white text-sm text-gray-700 leading-relaxed">
            <p>{liabilityText}</p>
            <p className="text-xs text-gray-500 mt-4">This waiver is governed by the laws of the State of Georgia.</p>
          </div>

          <h3 className="font-bold text-rust mb-3">Emergency Veterinary Authorization</h3>
          <div className="bg-gray-50 rounded-lg p-4 mb-4 text-sm text-gray-700">
            <p className="mb-2">Sam's TNR, Inc. authorizes emergency veterinary care for the foster cat. The foster parent will contact Sam's TNR first when possible.</p>
            <div className="flex items-center gap-2">
              <label className={labelCls + ' mb-0'}>Emergency vet care authorized up to: $</label>
              <input className={inputCls + ' max-w-[120px]'} type="number" min="0" value={emergencyVetLimit} onChange={e => setEmergencyVetLimit(e.target.value)} placeholder="Amount" />
            </div>
          </div>

          <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-gray-50 mb-6">
            <input type="checkbox" checked={waiverAgreed} onChange={() => setWaiverAgreed(!waiverAgreed)} className="mt-1 accent-rust" />
            <span className="text-sm font-semibold text-gray-700">I have read, understand, and agree to the Liability Waiver, Foster Responsibilities, and Emergency Vet Authorization</span>
          </label>
          {errors.waiver && <p className={errCls + ' mb-4'}>{errors.waiver}</p>}

          <hr className="my-6 border-gray-300" />
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
            🐾 Submit Foster Agreement
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
        <div className="text-6xl mb-4">🏠</div>
        <h1 className="text-3xl font-bold text-rust mb-2">Foster Agreement Submitted!</h1>
        <p className="text-gray-600">Thank you for opening your home to a cat in need!</p>
        <div className="inline-block mt-4 bg-rust text-white px-6 py-2 rounded-md font-mono text-lg font-bold">
          Ref: {data.ref}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h2 className="font-bold text-lg text-rust mb-3">Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <div><span className="font-semibold">Foster Parent:</span> {data.foster.name}</div>
          <div><span className="font-semibold">Phone:</span> {data.foster.phone}</div>
          <div><span className="font-semibold">Email:</span> {data.foster.email}</div>
          <div><span className="font-semibold">Housing:</span> {data.housing.type} ({data.housing.ownRent})</div>
          <div><span className="font-semibold">Cat:</span> {data.catInfo.description}</div>
          <div><span className="font-semibold">Foster Type:</span> {data.fosterType.join(', ')}</div>
          <div><span className="font-semibold">Signed By:</span> {data.sigName}</div>
          <div><span className="font-semibold">Date:</span> {data.sigDate}</div>
        </div>
      </div>

      <div className="bg-green-50 border-l-4 border-green-500 p-4 text-sm text-green-800 mb-6">
        <p className="font-semibold">What happens next?</p>
        <p>A Sam's TNR volunteer will review your application and contact you to arrange the foster placement. Please save your reference number!</p>
      </div>

      <div className="text-center">
        <a href="/" className="inline-block px-6 py-2 bg-rust text-white rounded-md font-medium hover:bg-rust-light transition-colors">
          ← Back to Home
        </a>
      </div>
    </div>
  )
}
