import { useState, useEffect } from 'react'

const SECTIONS = [
  'Requestor Info',
  'Cat & Location',
  'TNR Services',
  'Acknowledgments',
  'Liability Waiver',
  'Donation',
  'Signature',
]

const emptyCat = { color: '', sex: 'Unknown', age: '', earTipped: 'No', health: '', temperament: 'Feral' }

const acknowledgments = [
  'I understand that Sam\'s TNR, Inc. provides TNR services for feral and community cats only. Owned pets should be taken to a private veterinarian.',
  'I understand that the cat(s) will be ear-tipped (removal of ~¼ inch from the tip of one ear while under anesthesia) as the universal indicator of a spayed/neutered community cat.',
  'I understand that the cat(s) will be returned to their original outdoor location following recovery. This is not an adoption or rehoming service, though friendly cats may be referred to partner rescues when possible.',
  'I understand that Sam\'s TNR, Inc. does not provide ongoing veterinary care beyond the TNR procedure.',
  'I confirm that, to the best of my knowledge, the cat(s) listed are not owned pets. If a cat is found to have a microchip or ID indicating ownership, the owner will be contacted before proceeding.',
  'I agree to withhold food from the cat(s) for 12 hours before scheduled surgery (water is okay) for safe anesthesia.',
]

const waiverText = [
  { num: '1. Assumption of Risk.', text: 'I understand that spay/neuter surgery, while routine, is a medical procedure that carries inherent risks, including but not limited to: adverse reactions to anesthesia, infection, bleeding, complications during or after surgery, and in rare cases, death. I understand these risks exist even when procedures are performed with reasonable care and skill.' },
  { num: '2. No Guarantee of Outcome.', text: 'Sam\'s TNR, Inc. and its affiliated veterinarians make no guarantees regarding the outcome of any surgical procedure or medical treatment. While every effort will be made to provide competent and humane care, results cannot be guaranteed.' },
  { num: '3. Feral Cat Limitations.', text: 'I understand that feral and community cats may have unknown pre-existing medical conditions that cannot be detected prior to surgery. A full veterinary examination may not be possible due to the temperament of feral cats. The attending veterinarian will use their professional judgment to determine if a cat is healthy enough for surgery.' },
  { num: '4. Emergency Medical Decisions.', text: 'I authorize Sam\'s TNR, Inc. and its affiliated veterinary professionals to make emergency medical decisions on behalf of the cat(s) if I cannot be reached in a timely manner. This includes, but is not limited to, emergency treatment, modified surgical procedures, or humane euthanasia if the cat is found to be suffering from a terminal or untreatable condition.' },
  { num: '5. Release of Liability.', text: 'To the fullest extent permitted by law, I hereby release, waive, and discharge Sam\'s TNR, Inc., its officers, directors, employees, volunteers, agents, and affiliated veterinary professionals from any and all liability, claims, demands, actions, or causes of action arising out of or related to any loss, damage, or injury (including death of the animal) that may be sustained as a result of participation in the TNR program, except in cases of gross negligence or willful misconduct.' },
  { num: '6. Indemnification.', text: 'I agree to indemnify, defend, and hold harmless Sam\'s TNR, Inc. and its affiliates from any claims, lawsuits, or demands made by any third party arising from my participation in this program or my representations on this form.' },
  { num: '7. Property Access.', text: 'If I have authorized trapping on my property or a property for which I have permission, I grant Sam\'s TNR, Inc. volunteers permission to access said property for the purpose of setting and retrieving humane traps at mutually agreed-upon times.' },
  { num: '8. Accurate Information.', text: 'I certify that all information provided on this form is true and accurate to the best of my knowledge. I understand that providing false information may result in removal from the program.' },
  { num: '9. Photo/Media Release.', text: 'I grant Sam\'s TNR, Inc. permission to photograph the cat(s) during the TNR process and use such images for educational, promotional, and social media purposes. No personal information will be shared without additional written consent.' },
]

function generateRef() {
  const d = new Date()
  const prefix = 'TNR'
  const y = String(d.getFullYear()).slice(2)
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const r = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
  return `${prefix}-${y}${m}-${r}`
}

export default function IntakeForm() {
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(null)

  // Form state
  const [requestor, setRequestor] = useState({
    fullName: '', phone: '', email: '', contactTime: [],
    address: '', city: '', state: '', zip: '',
  })
  const [catInfo, setCatInfo] = useState({
    numCats: '', location: '', onProperty: '', propertyPermission: '',
    ownerNamePhone: '', howLong: '',
    cats: [{ ...emptyCat }],
    feeding: '', kittensPresent: '', kittenAge: '',
    sickInjured: '', sickDesc: '', previouslyFixed: '',
    commitPostCare: '', caretakerInfo: '',
  })
  const [acks, setAcks] = useState(new Array(6).fill(false))
  const [waiverAgreed, setWaiverAgreed] = useState(false)
  const [declinePhoto, setDeclinePhoto] = useState(false)
  const [donation, setDonation] = useState('')
  const [donationOther, setDonationOther] = useState('')
  const [sigName, setSigName] = useState('')
  const [sigDate] = useState(new Date().toLocaleDateString('en-US'))

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [step])

  const updateRequestor = (k, v) => setRequestor(p => ({ ...p, [k]: v }))
  const updateCatInfo = (k, v) => setCatInfo(p => ({ ...p, [k]: v }))
  const toggleContactTime = (t) => setRequestor(p => ({
    ...p, contactTime: p.contactTime.includes(t) ? p.contactTime.filter(x => x !== t) : [...p.contactTime, t]
  }))
  const updateCat = (i, k, v) => setCatInfo(p => {
    const cats = [...p.cats]; cats[i] = { ...cats[i], [k]: v }; return { ...p, cats }
  })
  const addCat = () => setCatInfo(p => ({ ...p, cats: [...p.cats, { ...emptyCat }] }))
  const removeCat = (i) => setCatInfo(p => ({ ...p, cats: p.cats.filter((_, j) => j !== i) }))

  function validate() {
    const e = {}
    if (step === 0) {
      if (!requestor.fullName.trim()) e.fullName = 'Required'
      if (!requestor.phone.trim()) e.phone = 'Required'
      if (!requestor.email.trim()) e.email = 'Required'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(requestor.email)) e.email = 'Invalid email'
      if (!requestor.address.trim()) e.address = 'Required'
      if (!requestor.city.trim()) e.city = 'Required'
      if (!requestor.state.trim()) e.state = 'Required'
      if (!requestor.zip.trim()) e.zip = 'Required'
    }
    if (step === 1) {
      if (!catInfo.numCats) e.numCats = 'Required'
      if (!catInfo.location.trim()) e.location = 'Required'
      if (!catInfo.onProperty) e.onProperty = 'Required'
    }
    if (step === 3) {
      if (!acks.every(Boolean)) e.acks = 'All acknowledgments must be checked'
    }
    if (step === 4) {
      if (!waiverAgreed) e.waiver = 'You must agree to the waiver'
    }
    if (step === 6) {
      if (!sigName.trim()) e.sigName = 'Required'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function next() { if (validate()) setStep(s => Math.min(s + 1, 6)) }
  function prev() { setErrors({}); setStep(s => Math.max(s - 1, 0)) }

  function handleSubmit() {
    if (!validate()) return
    const ref = generateRef()
    const submission = {
      ref, date: new Date().toISOString(),
      requestor, catInfo, acks, waiverAgreed, declinePhoto,
      donation: donation === 'other' ? `Other: $${donationOther}` : donation,
      sigName, sigDate,
    }
    const existing = JSON.parse(localStorage.getItem('tnr-submissions') || '[]')
    existing.push(submission)
    localStorage.setItem('tnr-submissions', JSON.stringify(existing))
    setSubmitted(submission)
  }

  if (submitted) return <Confirmation data={submitted} />

  const inputCls = 'w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rust focus:border-transparent'
  const labelCls = 'block text-sm font-semibold text-gray-700 mb-1'
  const errCls = 'text-red-600 text-xs mt-1'
  const sectionTitle = 'text-xl font-bold text-white bg-rust px-4 py-2 rounded-md mb-6'

  return (
    <div className="pt-24 pb-16 px-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-rust mb-2 text-center">Community Cat TNR Intake Form</h1>
      <p className="text-gray-600 text-center mb-8">501(c)(3) Nonprofit — Barney & Northern Brooks County, Georgia</p>

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

      {/* Step 0: Requestor Info */}
      {step === 0 && (
        <div>
          <div className={sectionTitle}>Section 1 — Requestor Information</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Full Name *</label>
              <input className={inputCls} value={requestor.fullName} onChange={e => updateRequestor('fullName', e.target.value)} />
              {errors.fullName && <p className={errCls}>{errors.fullName}</p>}
            </div>
            <div>
              <label className={labelCls}>Phone Number *</label>
              <input className={inputCls} type="tel" value={requestor.phone} onChange={e => updateRequestor('phone', e.target.value)} />
              {errors.phone && <p className={errCls}>{errors.phone}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Email Address *</label>
              <input className={inputCls} type="email" value={requestor.email} onChange={e => updateRequestor('email', e.target.value)} />
              {errors.email && <p className={errCls}>{errors.email}</p>}
            </div>
            <div>
              <label className={labelCls}>Best Time to Contact</label>
              <div className="flex gap-4 mt-2">
                {['Morning', 'Afternoon', 'Evening'].map(t => (
                  <label key={t} className="flex items-center gap-1 text-sm cursor-pointer">
                    <input type="checkbox" checked={requestor.contactTime.includes(t)} onChange={() => toggleContactTime(t)} className="accent-rust" />
                    {t}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label className={labelCls}>Mailing Address *</label>
            <input className={inputCls} value={requestor.address} onChange={e => updateRequestor('address', e.target.value)} />
            {errors.address && <p className={errCls}>{errors.address}</p>}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div className="col-span-2 sm:col-span-2">
              <label className={labelCls}>City *</label>
              <input className={inputCls} value={requestor.city} onChange={e => updateRequestor('city', e.target.value)} />
              {errors.city && <p className={errCls}>{errors.city}</p>}
            </div>
            <div>
              <label className={labelCls}>State *</label>
              <input className={inputCls} value={requestor.state} onChange={e => updateRequestor('state', e.target.value)} />
              {errors.state && <p className={errCls}>{errors.state}</p>}
            </div>
            <div>
              <label className={labelCls}>ZIP *</label>
              <input className={inputCls} value={requestor.zip} onChange={e => updateRequestor('zip', e.target.value)} />
              {errors.zip && <p className={errCls}>{errors.zip}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Step 1: Cat & Location */}
      {step === 1 && (
        <div>
          <div className={sectionTitle}>Section 2 — Cat & Location Information</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Number of Cats *</label>
              <input className={inputCls} type="number" min="1" value={catInfo.numCats} onChange={e => updateCatInfo('numCats', e.target.value)} />
              {errors.numCats && <p className={errCls}>{errors.numCats}</p>}
            </div>
            <div>
              <label className={labelCls}>Location of Cat(s) *</label>
              <input className={inputCls} placeholder="Address or description" value={catInfo.location} onChange={e => updateCatInfo('location', e.target.value)} />
              {errors.location && <p className={errCls}>{errors.location}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>On Your Property? *</label>
              <div className="flex gap-4 mt-1">
                {['Yes', 'No'].map(v => (
                  <label key={v} className="flex items-center gap-1 text-sm cursor-pointer">
                    <input type="radio" name="onProperty" checked={catInfo.onProperty === v} onChange={() => updateCatInfo('onProperty', v)} className="accent-rust" /> {v}
                  </label>
                ))}
              </div>
              {errors.onProperty && <p className={errCls}>{errors.onProperty}</p>}
            </div>
            {catInfo.onProperty === 'No' && (
              <div>
                <label className={labelCls}>Property Owner Permission?</label>
                <div className="flex gap-4 mt-1">
                  {['Yes', 'No', 'N/A'].map(v => (
                    <label key={v} className="flex items-center gap-1 text-sm cursor-pointer">
                      <input type="radio" name="permission" checked={catInfo.propertyPermission === v} onChange={() => updateCatInfo('propertyPermission', v)} className="accent-rust" /> {v}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className={labelCls}>Property Owner Name & Phone (if not you)</label>
              <input className={inputCls} value={catInfo.ownerNamePhone} onChange={e => updateCatInfo('ownerNamePhone', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>How Long Have Cats Been Here?</label>
              <input className={inputCls} value={catInfo.howLong} onChange={e => updateCatInfo('howLong', e.target.value)} />
            </div>
          </div>

          {/* Cat details table */}
          <h3 className="font-bold text-sm text-gray-700 mb-2">Individual Cat Details</h3>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-2 py-1 text-left">#</th>
                  <th className="border border-gray-300 px-2 py-1 text-left">Color/Description</th>
                  <th className="border border-gray-300 px-2 py-1 text-left">Sex</th>
                  <th className="border border-gray-300 px-2 py-1 text-left">Est. Age</th>
                  <th className="border border-gray-300 px-2 py-1 text-left">Ear-Tipped?</th>
                  <th className="border border-gray-300 px-2 py-1 text-left">Health Issues</th>
                  <th className="border border-gray-300 px-2 py-1 text-left">Temperament</th>
                  <th className="border border-gray-300 px-2 py-1"></th>
                </tr>
              </thead>
              <tbody>
                {catInfo.cats.map((cat, i) => (
                  <tr key={i}>
                    <td className="border border-gray-300 px-2 py-1 text-center">{i + 1}</td>
                    <td className="border border-gray-300 px-1 py-1"><input className="w-full px-1 py-0.5 text-sm border-0 focus:outline-none" value={cat.color} onChange={e => updateCat(i, 'color', e.target.value)} /></td>
                    <td className="border border-gray-300 px-1 py-1">
                      <select className="text-sm border-0 focus:outline-none bg-transparent" value={cat.sex} onChange={e => updateCat(i, 'sex', e.target.value)}>
                        <option>Male</option><option>Female</option><option>Unknown</option>
                      </select>
                    </td>
                    <td className="border border-gray-300 px-1 py-1"><input className="w-full px-1 py-0.5 text-sm border-0 focus:outline-none" placeholder="e.g. 2yr" value={cat.age} onChange={e => updateCat(i, 'age', e.target.value)} /></td>
                    <td className="border border-gray-300 px-1 py-1">
                      <select className="text-sm border-0 focus:outline-none bg-transparent" value={cat.earTipped} onChange={e => updateCat(i, 'earTipped', e.target.value)}>
                        <option>Yes</option><option>No</option>
                      </select>
                    </td>
                    <td className="border border-gray-300 px-1 py-1"><input className="w-full px-1 py-0.5 text-sm border-0 focus:outline-none" value={cat.health} onChange={e => updateCat(i, 'health', e.target.value)} /></td>
                    <td className="border border-gray-300 px-1 py-1">
                      <select className="text-sm border-0 focus:outline-none bg-transparent" value={cat.temperament} onChange={e => updateCat(i, 'temperament', e.target.value)}>
                        <option>Friendly</option><option>Feral</option>
                      </select>
                    </td>
                    <td className="border border-gray-300 px-1 py-1 text-center">
                      {catInfo.cats.length > 1 && (
                        <button onClick={() => removeCat(i)} className="text-red-500 hover:text-red-700 text-lg leading-none" title="Remove">×</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={addCat} className="text-sm text-rust font-semibold hover:underline mb-6">+ Add Another Cat</button>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className={labelCls}>Currently Feeding?</label>
              <div className="flex gap-4 mt-1">
                {['Yes', 'No'].map(v => (
                  <label key={v} className="flex items-center gap-1 text-sm cursor-pointer">
                    <input type="radio" name="feeding" checked={catInfo.feeding === v} onChange={() => updateCatInfo('feeding', v)} className="accent-rust" /> {v}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className={labelCls}>Kittens Present?</label>
              <div className="flex gap-4 mt-1">
                {['Yes', 'No'].map(v => (
                  <label key={v} className="flex items-center gap-1 text-sm cursor-pointer">
                    <input type="radio" name="kittens" checked={catInfo.kittensPresent === v} onChange={() => updateCatInfo('kittensPresent', v)} className="accent-rust" /> {v}
                  </label>
                ))}
              </div>
            </div>
            {catInfo.kittensPresent === 'Yes' && (
              <div>
                <label className={labelCls}>Estimated Kitten Age</label>
                <input className={inputCls} value={catInfo.kittenAge} onChange={e => updateCatInfo('kittenAge', e.target.value)} />
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Any Cats Visibly Sick or Injured?</label>
              <div className="flex gap-4 mt-1">
                {['Yes', 'No'].map(v => (
                  <label key={v} className="flex items-center gap-1 text-sm cursor-pointer">
                    <input type="radio" name="sick" checked={catInfo.sickInjured === v} onChange={() => updateCatInfo('sickInjured', v)} className="accent-rust" /> {v}
                  </label>
                ))}
              </div>
            </div>
            {catInfo.sickInjured === 'Yes' && (
              <div>
                <label className={labelCls}>Describe</label>
                <input className={inputCls} value={catInfo.sickDesc} onChange={e => updateCatInfo('sickDesc', e.target.value)} />
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Any Cats Previously Spayed/Neutered?</label>
              <div className="flex gap-4 mt-1">
                {['Yes', 'No', 'Unknown'].map(v => (
                  <label key={v} className="flex items-center gap-1 text-sm cursor-pointer">
                    <input type="radio" name="prevFixed" checked={catInfo.previouslyFixed === v} onChange={() => updateCatInfo('previouslyFixed', v)} className="accent-rust" /> {v}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Commit to Feeding/Monitoring After TNR?</label>
              <div className="flex gap-4 mt-1">
                {['Yes', 'No'].map(v => (
                  <label key={v} className="flex items-center gap-1 text-sm cursor-pointer">
                    <input type="radio" name="commitCare" checked={catInfo.commitPostCare === v} onChange={() => updateCatInfo('commitPostCare', v)} className="accent-rust" /> {v}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className={labelCls}>Colony Caretaker Name & Phone (if any)</label>
              <input className={inputCls} value={catInfo.caretakerInfo} onChange={e => updateCatInfo('caretakerInfo', e.target.value)} />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: TNR Services */}
      {step === 2 && (
        <div>
          <div className={sectionTitle}>Section 3 — TNR Services Provided (Free of Charge)</div>
          <p className="text-gray-600 mb-4">All of the following services are provided at <strong>no cost</strong> to you:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {[
              'Humane trapping (traps provided)',
              'Spay or neuter surgery',
              'Rabies vaccination',
              'FVRCP vaccination',
              'Ear-tipping (universal TNR indicator)',
              'Flea/parasite treatment',
              'Return to original location',
              'Microchipping (when available)',
            ].map(s => (
              <div key={s} className="flex items-center gap-2 text-sm">
                <span className="text-green-600 text-lg">✅</span> {s}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Acknowledgments */}
      {step === 3 && (
        <div>
          <div className={sectionTitle}>Section 4 — Acknowledgments</div>
          <p className="text-gray-600 text-sm mb-4">Please read each statement carefully and check to confirm your understanding.</p>
          <div className="space-y-4 mb-4">
            {acknowledgments.map((a, i) => (
              <label key={i} className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                <input type="checkbox" checked={acks[i]} onChange={() => { const n = [...acks]; n[i] = !n[i]; setAcks(n) }} className="mt-1 accent-rust flex-shrink-0" />
                <span className="text-sm text-gray-700">{a}</span>
              </label>
            ))}
          </div>
          {errors.acks && <p className={errCls}>{errors.acks}</p>}
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
            {waiverText.map((w, i) => (
              <p key={i} className="mb-3"><strong>{w.num}</strong> {w.text}</p>
            ))}
            <p className="text-xs text-gray-500 mt-4">This waiver is governed by the laws of the State of Georgia. If any provision is found to be unenforceable, the remaining provisions shall remain in full force and effect.</p>
          </div>
          <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-gray-50 mb-2">
            <input type="checkbox" checked={waiverAgreed} onChange={() => setWaiverAgreed(!waiverAgreed)} className="mt-1 accent-rust" />
            <span className="text-sm font-semibold text-gray-700">I have read, understand, and agree to the Liability Waiver & Release of Claims</span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
            <input type="checkbox" checked={declinePhoto} onChange={() => setDeclinePhoto(!declinePhoto)} className="mt-1 accent-rust" />
            <span className="text-sm text-gray-700">I <strong>decline</strong> the photo/media release (Section 9)</span>
          </label>
          {errors.waiver && <p className={errCls + ' mt-2'}>{errors.waiver}</p>}
        </div>
      )}

      {/* Step 5: Donation */}
      {step === 5 && (
        <div>
          <div className={sectionTitle}>Section 6 — Voluntary Donation</div>
          <p className="text-gray-600 text-sm mb-4">Sam's TNR provides all services at <strong>no cost</strong>. We are funded entirely by donations. The average cost per cat is <strong>$50–75</strong> (surgery, vaccines, meds, traps, transport). If you are able, any amount helps us serve more cats.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {[
              { val: '$25', label: '$25 — Vaccines & meds for one cat' },
              { val: '$50', label: '$50 — Half the cost of one TNR' },
              { val: '$75', label: '$75 — Full cost of one TNR' },
              { val: '$100+', label: '$100+ — Sponsors one TNR & funds the next' },
              { val: 'other', label: 'Other amount' },
              { val: 'unable', label: 'I am unable to donate at this time (that\'s okay!)' },
            ].map(d => (
              <label key={d.val} className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer text-sm">
                <input type="radio" name="donation" checked={donation === d.val} onChange={() => setDonation(d.val)} className="accent-rust" />
                {d.label}
              </label>
            ))}
          </div>
          {donation === 'other' && (
            <div className="mb-4">
              <label className={labelCls}>Amount ($)</label>
              <input className={inputCls + ' max-w-xs'} type="number" min="1" value={donationOther} onChange={e => setDonationOther(e.target.value)} />
            </div>
          )}
          <div className="bg-gray-50 rounded-md p-4 text-sm text-gray-600">
            <p className="font-semibold mb-1">Donation Methods:</p>
            <p>PayPal: donate@samstnr.org | Venmo: @SamsTNR</p>
            <p>Check payable to "Sam's TNR, Inc." — Barney, GA 31625</p>
            <p className="text-xs text-gray-500 mt-2">Sam's TNR, Inc. is a registered 501(c)(3) nonprofit. All donations are tax-deductible.</p>
          </div>
        </div>
      )}

      {/* Step 6: Signature */}
      {step === 6 && (
        <div>
          <div className={sectionTitle}>Signature</div>
          <p className="text-gray-600 text-sm mb-6">By typing your name below, you acknowledge that you have read, understand, and agree to all terms, acknowledgments, and the liability waiver set forth in this form.</p>
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
        {step < 6 ? (
          <button onClick={next} className="px-6 py-2 bg-rust text-white rounded-md text-sm font-medium hover:bg-rust-light transition-colors">
            Next →
          </button>
        ) : (
          <button onClick={handleSubmit} className="px-8 py-3 bg-rust text-white rounded-md font-bold text-sm hover:bg-rust-light transition-colors">
            🐾 Submit Intake Form
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
        <div className="text-6xl mb-4">🐾</div>
        <h1 className="text-3xl font-bold text-rust mb-2">Form Submitted!</h1>
        <p className="text-gray-600">Thank you for requesting TNR services from Sam's TNR, Inc.</p>
        <div className="inline-block mt-4 bg-rust text-white px-6 py-2 rounded-md font-mono text-lg font-bold">
          Ref: {data.ref}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h2 className="font-bold text-lg text-rust mb-3">Submission Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <div><span className="font-semibold">Name:</span> {data.requestor.fullName}</div>
          <div><span className="font-semibold">Phone:</span> {data.requestor.phone}</div>
          <div><span className="font-semibold">Email:</span> {data.requestor.email}</div>
          <div><span className="font-semibold">Location:</span> {data.requestor.city}, {data.requestor.state}</div>
          <div><span className="font-semibold"># of Cats:</span> {data.catInfo.numCats}</div>
          <div><span className="font-semibold">Cat Location:</span> {data.catInfo.location}</div>
          <div><span className="font-semibold">Donation:</span> {data.donation || 'None selected'}</div>
          <div><span className="font-semibold">Signed By:</span> {data.sigName}</div>
          <div><span className="font-semibold">Date:</span> {data.sigDate}</div>
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 text-sm text-yellow-800 mb-6">
        <p className="font-semibold">What happens next?</p>
        <p>A Sam's TNR volunteer will review your intake form and contact you to schedule trapping. Please save your reference number for your records.</p>
      </div>

      <div className="text-center">
        <a href="/" className="inline-block px-6 py-2 bg-rust text-white rounded-md font-medium hover:bg-rust-light transition-colors">
          ← Back to Home
        </a>
      </div>
    </div>
  )
}
