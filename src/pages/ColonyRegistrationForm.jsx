import { useState, useEffect } from 'react'

const SECTIONS = [
  'Caretaker Info',
  'Colony Location',
  'Colony Details',
  'Cat Log & Feeding',
  'Environment & Photos',
  'Commitment & Signature',
]

const CONCERNS = [
  'Busy road nearby',
  'Predators (coyotes, dogs, etc.)',
  'Hostile neighbors',
  'Poison or traps set by others',
  'Construction or demolition planned',
]

const emptyCatRow = { description: '', sex: 'Unknown', earTipped: 'No', temperament: 'Feral', age: '', health: '' }

function generateRef() {
  const d = new Date()
  const y = String(d.getFullYear()).slice(2)
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const r = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
  return `COL-${y}${m}-${r}`
}

export default function ColonyRegistrationForm() {
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(null)

  const [caretaker, setCaretaker] = useState({
    fullName: '', phone: '', email: '', address: '', city: '', state: '', zip: '',
  })
  const [colony, setColony] = useState({
    locationAddress: '', locationDesc: '', gps: '',
    areaType: '', propertyType: '',
  })
  const [owner, setOwner] = useState({
    isCaretaker: '', ownerName: '', ownerPhone: '', permissionObtained: '',
  })
  const [details, setDetails] = useState({
    totalCats: '', spayedNeutered: '', unaltered: '', kittens: '',
    howLong: '', trend: '',
  })
  const [catLog, setCatLog] = useState([{ ...emptyCatRow }])
  const [feeding, setFeeding] = useState({
    whoFeeds: '', howOften: '', whatFood: '', feedingTime: '', stationLocation: '',
  })
  const [shelter, setShelter] = useState({ provided: '', description: '' })
  const [concerns, setConcerns] = useState([])
  const [concernOther, setConcernOther] = useState('')
  const [photos, setPhotos] = useState([])
  const [commitment, setCommitment] = useState(false)
  const [sigName, setSigName] = useState('')
  const [sigDate] = useState(new Date().toLocaleDateString('en-US'))

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [step])

  const updateCaretaker = (k, v) => setCaretaker(p => ({ ...p, [k]: v }))
  const updateColony = (k, v) => setColony(p => ({ ...p, [k]: v }))
  const updateOwner = (k, v) => setOwner(p => ({ ...p, [k]: v }))
  const updateDetails = (k, v) => setDetails(p => ({ ...p, [k]: v }))
  const updateFeeding = (k, v) => setFeeding(p => ({ ...p, [k]: v }))
  const updateCatRow = (i, k, v) => setCatLog(p => { const n = [...p]; n[i] = { ...n[i], [k]: v }; return n })
  const addCatRow = () => setCatLog(p => [...p, { ...emptyCatRow }])
  const removeCatRow = (i) => setCatLog(p => p.filter((_, j) => j !== i))

  function validate() {
    const e = {}
    if (step === 0) {
      if (!caretaker.fullName.trim()) e.fullName = 'Required'
      if (!caretaker.phone.trim()) e.phone = 'Required'
      if (!caretaker.email.trim()) e.email = 'Required'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(caretaker.email)) e.email = 'Invalid email'
      if (!caretaker.address.trim()) e.address = 'Required'
      if (!caretaker.city.trim()) e.city = 'Required'
      if (!caretaker.state.trim()) e.state = 'Required'
      if (!caretaker.zip.trim()) e.zip = 'Required'
    }
    if (step === 1) {
      if (!colony.locationAddress.trim() && !colony.locationDesc.trim()) e.location = 'Address or description required'
      if (!colony.areaType) e.areaType = 'Required'
      if (!colony.propertyType) e.propertyType = 'Required'
      if (owner.isCaretaker === 'No' && !owner.permissionObtained) e.permission = 'Required'
    }
    if (step === 2) {
      if (!details.totalCats) e.totalCats = 'Required'
    }
    if (step === 5) {
      if (!commitment) e.commitment = 'You must agree to the caretaker commitment'
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
      caretaker, colony, owner, details, catLog, feeding, shelter, concerns, concernOther,
      photos: photos.map(f => f.name),
      commitment, sigName, sigDate,
    }
    const existing = JSON.parse(localStorage.getItem('tnr-colony-registrations') || '[]')
    existing.push(submission)
    localStorage.setItem('tnr-colony-registrations', JSON.stringify(existing))
    setSubmitted(submission)
  }

  if (submitted) return <Confirmation data={submitted} />

  const inputCls = 'w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rust focus:border-transparent'
  const labelCls = 'block text-sm font-semibold text-gray-700 mb-1'
  const errCls = 'text-red-600 text-xs mt-1'
  const sectionTitle = 'text-xl font-bold text-white bg-rust px-4 py-2 rounded-md mb-6'

  return (
    <div className="pt-24 pb-16 px-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-rust mb-2 text-center">Colony Registration Form</h1>
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

      {/* Step 0: Caretaker Info */}
      {step === 0 && (
        <div>
          <div className={sectionTitle}>Section 1 — Caretaker Information</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Full Name *</label>
              <input className={inputCls} value={caretaker.fullName} onChange={e => updateCaretaker('fullName', e.target.value)} />
              {errors.fullName && <p className={errCls}>{errors.fullName}</p>}
            </div>
            <div>
              <label className={labelCls}>Phone Number *</label>
              <input className={inputCls} type="tel" value={caretaker.phone} onChange={e => updateCaretaker('phone', e.target.value)} />
              {errors.phone && <p className={errCls}>{errors.phone}</p>}
            </div>
          </div>
          <div className="mb-4">
            <label className={labelCls}>Email Address *</label>
            <input className={inputCls + ' max-w-md'} type="email" value={caretaker.email} onChange={e => updateCaretaker('email', e.target.value)} />
            {errors.email && <p className={errCls}>{errors.email}</p>}
          </div>
          <div className="mb-4">
            <label className={labelCls}>Mailing Address *</label>
            <input className={inputCls} value={caretaker.address} onChange={e => updateCaretaker('address', e.target.value)} />
            {errors.address && <p className={errCls}>{errors.address}</p>}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div className="col-span-2">
              <label className={labelCls}>City *</label>
              <input className={inputCls} value={caretaker.city} onChange={e => updateCaretaker('city', e.target.value)} />
              {errors.city && <p className={errCls}>{errors.city}</p>}
            </div>
            <div>
              <label className={labelCls}>State *</label>
              <input className={inputCls} value={caretaker.state} onChange={e => updateCaretaker('state', e.target.value)} />
              {errors.state && <p className={errCls}>{errors.state}</p>}
            </div>
            <div>
              <label className={labelCls}>ZIP *</label>
              <input className={inputCls} value={caretaker.zip} onChange={e => updateCaretaker('zip', e.target.value)} />
              {errors.zip && <p className={errCls}>{errors.zip}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Step 1: Colony Location */}
      {step === 1 && (
        <div>
          <div className={sectionTitle}>Section 2 — Colony Location & Property</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Colony Address *</label>
              <input className={inputCls} value={colony.locationAddress} onChange={e => updateColony('locationAddress', e.target.value)} placeholder="Street address if known" />
            </div>
            <div>
              <label className={labelCls}>Location Description</label>
              <input className={inputCls} value={colony.locationDesc} onChange={e => updateColony('locationDesc', e.target.value)} placeholder="e.g. Behind the old warehouse on Elm St" />
            </div>
          </div>
          {errors.location && <p className={errCls + ' mb-4'}>{errors.location}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className={labelCls}>GPS Coordinates (if known)</label>
              <input className={inputCls} value={colony.gps} onChange={e => updateColony('gps', e.target.value)} placeholder="e.g. 30.8456, -83.5327" />
            </div>
            <div>
              <label className={labelCls}>Area Type *</label>
              <select className={inputCls} value={colony.areaType} onChange={e => updateColony('areaType', e.target.value)}>
                <option value="">Select...</option>
                <option>Urban</option>
                <option>Suburban</option>
                <option>Rural</option>
              </select>
              {errors.areaType && <p className={errCls}>{errors.areaType}</p>}
            </div>
            <div>
              <label className={labelCls}>Property Type *</label>
              <select className={inputCls} value={colony.propertyType} onChange={e => updateColony('propertyType', e.target.value)}>
                <option value="">Select...</option>
                <option>Residential</option>
                <option>Commercial</option>
                <option>Public</option>
                <option>Farm</option>
              </select>
              {errors.propertyType && <p className={errCls}>{errors.propertyType}</p>}
            </div>
          </div>

          <h3 className="font-bold text-sm text-gray-700 mb-3 mt-6">Property Owner Information</h3>
          <div className="mb-4">
            <label className={labelCls}>Are you the property owner?</label>
            <div className="flex gap-4 mt-1">
              {['Yes', 'No'].map(v => (
                <label key={v} className="flex items-center gap-1 text-sm cursor-pointer">
                  <input type="radio" name="isOwner" checked={owner.isCaretaker === v} onChange={() => updateOwner('isCaretaker', v)} className="accent-rust" /> {v}
                </label>
              ))}
            </div>
          </div>
          {owner.isCaretaker === 'No' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className={labelCls}>Owner Name</label>
                <input className={inputCls} value={owner.ownerName} onChange={e => updateOwner('ownerName', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Owner Phone</label>
                <input className={inputCls} type="tel" value={owner.ownerPhone} onChange={e => updateOwner('ownerPhone', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Permission Obtained? *</label>
                <div className="flex gap-4 mt-1">
                  {['Yes', 'No'].map(v => (
                    <label key={v} className="flex items-center gap-1 text-sm cursor-pointer">
                      <input type="radio" name="permission" checked={owner.permissionObtained === v} onChange={() => updateOwner('permissionObtained', v)} className="accent-rust" /> {v}
                    </label>
                  ))}
                </div>
                {errors.permission && <p className={errCls}>{errors.permission}</p>}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Colony Details */}
      {step === 2 && (
        <div>
          <div className={sectionTitle}>Section 3 — Colony Details</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div>
              <label className={labelCls}>Total Cats *</label>
              <input className={inputCls} type="number" min="0" value={details.totalCats} onChange={e => updateDetails('totalCats', e.target.value)} />
              {errors.totalCats && <p className={errCls}>{errors.totalCats}</p>}
            </div>
            <div>
              <label className={labelCls}>Already Fixed (ear-tipped)</label>
              <input className={inputCls} type="number" min="0" value={details.spayedNeutered} onChange={e => updateDetails('spayedNeutered', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Unaltered</label>
              <input className={inputCls} type="number" min="0" value={details.unaltered} onChange={e => updateDetails('unaltered', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Kittens</label>
              <input className={inputCls} type="number" min="0" value={details.kittens} onChange={e => updateDetails('kittens', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>How Long Has Colony Existed?</label>
              <input className={inputCls} value={details.howLong} onChange={e => updateDetails('howLong', e.target.value)} placeholder="e.g. 2 years, unknown" />
            </div>
            <div>
              <label className={labelCls}>Colony Trend</label>
              <div className="flex gap-4 mt-2">
                {['Growing', 'Stable', 'Shrinking'].map(v => (
                  <label key={v} className="flex items-center gap-1 text-sm cursor-pointer">
                    <input type="radio" name="trend" checked={details.trend === v} onChange={() => updateDetails('trend', v)} className="accent-rust" /> {v}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Cat Log & Feeding */}
      {step === 3 && (
        <div>
          <div className={sectionTitle}>Section 4 — Individual Cat Log & Feeding</div>
          <h3 className="font-bold text-sm text-gray-700 mb-2">Individual Cat Log</h3>
          <p className="text-gray-500 text-xs mb-3">Document individual cats you can identify. Add or remove rows as needed.</p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-2 py-1 text-left">#</th>
                  <th className="border border-gray-300 px-2 py-1 text-left">Description</th>
                  <th className="border border-gray-300 px-2 py-1 text-left">Sex</th>
                  <th className="border border-gray-300 px-2 py-1 text-left">Ear-Tipped?</th>
                  <th className="border border-gray-300 px-2 py-1 text-left">Temperament</th>
                  <th className="border border-gray-300 px-2 py-1 text-left">Age</th>
                  <th className="border border-gray-300 px-2 py-1 text-left">Health Notes</th>
                  <th className="border border-gray-300 px-2 py-1"></th>
                </tr>
              </thead>
              <tbody>
                {catLog.map((cat, i) => (
                  <tr key={i}>
                    <td className="border border-gray-300 px-2 py-1 text-center">{i + 1}</td>
                    <td className="border border-gray-300 px-1 py-1"><input className="w-full px-1 py-0.5 text-sm border-0 focus:outline-none" placeholder="e.g. Orange tabby" value={cat.description} onChange={e => updateCatRow(i, 'description', e.target.value)} /></td>
                    <td className="border border-gray-300 px-1 py-1">
                      <select className="text-sm border-0 focus:outline-none bg-transparent" value={cat.sex} onChange={e => updateCatRow(i, 'sex', e.target.value)}>
                        <option>Male</option><option>Female</option><option>Unknown</option>
                      </select>
                    </td>
                    <td className="border border-gray-300 px-1 py-1">
                      <select className="text-sm border-0 focus:outline-none bg-transparent" value={cat.earTipped} onChange={e => updateCatRow(i, 'earTipped', e.target.value)}>
                        <option>Yes</option><option>No</option>
                      </select>
                    </td>
                    <td className="border border-gray-300 px-1 py-1">
                      <select className="text-sm border-0 focus:outline-none bg-transparent" value={cat.temperament} onChange={e => updateCatRow(i, 'temperament', e.target.value)}>
                        <option>Friendly</option><option>Feral</option>
                      </select>
                    </td>
                    <td className="border border-gray-300 px-1 py-1"><input className="w-full px-1 py-0.5 text-sm border-0 focus:outline-none" placeholder="e.g. 2yr" value={cat.age} onChange={e => updateCatRow(i, 'age', e.target.value)} /></td>
                    <td className="border border-gray-300 px-1 py-1"><input className="w-full px-1 py-0.5 text-sm border-0 focus:outline-none" value={cat.health} onChange={e => updateCatRow(i, 'health', e.target.value)} /></td>
                    <td className="border border-gray-300 px-1 py-1 text-center">
                      {catLog.length > 1 && (
                        <button onClick={() => removeCatRow(i)} className="text-red-500 hover:text-red-700 text-lg leading-none" title="Remove">×</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={addCatRow} className="text-sm text-rust font-semibold hover:underline mb-8">+ Add Another Cat</button>

          <h3 className="font-bold text-sm text-gray-700 mb-3">Feeding Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Who Feeds the Colony?</label>
              <input className={inputCls} value={feeding.whoFeeds} onChange={e => updateFeeding('whoFeeds', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>How Often?</label>
              <input className={inputCls} value={feeding.howOften} onChange={e => updateFeeding('howOften', e.target.value)} placeholder="e.g. Twice daily" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className={labelCls}>What Food?</label>
              <input className={inputCls} value={feeding.whatFood} onChange={e => updateFeeding('whatFood', e.target.value)} placeholder="e.g. Dry kibble, wet food" />
            </div>
            <div>
              <label className={labelCls}>Feeding Time</label>
              <input className={inputCls} value={feeding.feedingTime} onChange={e => updateFeeding('feedingTime', e.target.value)} placeholder="e.g. 7am and 5pm" />
            </div>
            <div>
              <label className={labelCls}>Feeding Station Location</label>
              <input className={inputCls} value={feeding.stationLocation} onChange={e => updateFeeding('stationLocation', e.target.value)} placeholder="e.g. Back porch" />
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Environment & Photos */}
      {step === 4 && (
        <div>
          <div className={sectionTitle}>Section 5 — Shelter, Environment & Photos</div>
          <div className="mb-6">
            <label className={labelCls}>Shelters Provided?</label>
            <div className="flex gap-4 mt-1 mb-2">
              {['Yes', 'No'].map(v => (
                <label key={v} className="flex items-center gap-1 text-sm cursor-pointer">
                  <input type="radio" name="shelter" checked={shelter.provided === v} onChange={() => setShelter(p => ({ ...p, provided: v }))} className="accent-rust" /> {v}
                </label>
              ))}
            </div>
            {shelter.provided === 'Yes' && (
              <div>
                <label className={labelCls}>Describe Shelters</label>
                <textarea className={inputCls} rows="2" value={shelter.description} onChange={e => setShelter(p => ({ ...p, description: e.target.value }))} placeholder="e.g. Insulated feral cat houses, straw-lined" />
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className={labelCls}>Environmental Concerns (check all that apply)</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              {CONCERNS.map(c => (
                <label key={c} className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded border border-gray-200 hover:bg-gray-50">
                  <input type="checkbox" checked={concerns.includes(c)} onChange={() => setConcerns(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c])} className="accent-rust" />
                  {c}
                </label>
              ))}
            </div>
            <div className="mt-3">
              <label className={labelCls}>Other Concerns</label>
              <input className={inputCls} value={concernOther} onChange={e => setConcernOther(e.target.value)} placeholder="Describe any other environmental concerns" />
            </div>
          </div>

          <div className="mb-4">
            <label className={labelCls}>Colony Photos</label>
            <p className="text-gray-500 text-xs mb-2">Upload photos of the colony, feeding stations, or shelters (optional).</p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={e => setPhotos(Array.from(e.target.files))}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-rust file:text-white hover:file:bg-rust-light"
            />
            {photos.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">{photos.length} file(s) selected</p>
            )}
          </div>
        </div>
      )}

      {/* Step 5: Commitment & Signature */}
      {step === 5 && (
        <div>
          <div className={sectionTitle}>Section 6 — Caretaker Commitment & Signature</div>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
            <p className="text-sm font-bold text-yellow-800 mb-2">Caretaker Commitment</p>
            <p className="text-sm text-yellow-800 mb-3">By registering this colony, you are committing to the ongoing care and monitoring of these community cats.</p>
          </div>
          <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-gray-50 mb-4">
            <input type="checkbox" checked={commitment} onChange={() => setCommitment(!commitment)} className="mt-1 accent-rust" />
            <span className="text-sm text-gray-700">
              <strong>I agree to:</strong> ongoing feeding of the colony on a regular schedule, monitoring the colony for new arrivals and health issues, reporting new or unaltered cats to Sam's TNR for trapping/scheduling, and maintaining shelters and feeding stations in good condition. *
            </span>
          </label>
          {errors.commitment && <p className={errCls}>{errors.commitment}</p>}

          <p className="text-gray-600 text-sm mb-6 mt-8">By typing your name below, you certify that all information provided is true and accurate to the best of your knowledge.</p>
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
          <button onClick={prev} className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">← Previous</button>
        ) : <div />}
        {step < 5 ? (
          <button onClick={next} className="px-6 py-2 bg-rust text-white rounded-md text-sm font-medium hover:bg-rust-light transition-colors">Next →</button>
        ) : (
          <button onClick={handleSubmit} className="px-8 py-3 bg-rust text-white rounded-md font-bold text-sm hover:bg-rust-light transition-colors">🐾 Register Colony</button>
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
        <h1 className="text-3xl font-bold text-rust mb-2">Colony Registered!</h1>
        <p className="text-gray-600">Thank you for registering your colony with Sam's TNR, Inc.</p>
        <div className="inline-block mt-4 bg-rust text-white px-6 py-2 rounded-md font-mono text-lg font-bold">
          Ref: {data.ref}
        </div>
      </div>
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h2 className="font-bold text-lg text-rust mb-3">Registration Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <div><span className="font-semibold">Caretaker:</span> {data.caretaker.fullName}</div>
          <div><span className="font-semibold">Phone:</span> {data.caretaker.phone}</div>
          <div><span className="font-semibold">Colony Location:</span> {data.colony.locationAddress || data.colony.locationDesc}</div>
          <div><span className="font-semibold">Area:</span> {data.colony.areaType} / {data.colony.propertyType}</div>
          <div><span className="font-semibold">Total Cats:</span> {data.details.totalCats}</div>
          <div><span className="font-semibold">Already Fixed:</span> {data.details.spayedNeutered || '0'}</div>
          <div><span className="font-semibold">Unaltered:</span> {data.details.unaltered || 'Unknown'}</div>
          <div><span className="font-semibold">Trend:</span> {data.details.trend || 'Not specified'}</div>
          <div><span className="font-semibold">Signed By:</span> {data.sigName}</div>
          <div><span className="font-semibold">Date:</span> {data.sigDate}</div>
        </div>
      </div>
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 text-sm text-yellow-800 mb-6">
        <p className="font-semibold">What happens next?</p>
        <p>A Sam's TNR coordinator will review your colony registration and contact you to discuss a TNR plan for your colony. Please save your reference number for your records.</p>
      </div>
      <div className="text-center">
        <a href="/" className="inline-block px-6 py-2 bg-rust text-white rounded-md font-medium hover:bg-rust-light transition-colors">← Back to Home</a>
      </div>
    </div>
  )
}
