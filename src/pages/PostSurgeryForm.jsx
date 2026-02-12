import { useState, useEffect } from 'react'

const SECTIONS = [
  'Cat Info',
  'Caretaker',
  'Recovery Instructions',
  'Emergency Info',
  'Acknowledgments',
  'Pickup & Signature',
]

const recoveryInstructions = [
  { icon: '🏠', text: 'Keep cat in trap/carrier for minimum 24 hours after surgery' },
  { icon: '🌡️', text: 'Keep in warm, dry, quiet area (garage, covered porch)' },
  { icon: '📰', text: 'Place newspaper under trap for easy cleanup' },
  { icon: '💧', text: 'Offer small amount of water 4 hours after surgery' },
  { icon: '🍽️', text: 'Offer small amount of food 8 hours after surgery' },
  { icon: '🚫', text: 'Do NOT open the trap door or attempt to handle the cat' },
]

const monitorSigns = [
  'Excessive bleeding',
  'Labored breathing',
  'Not eating after 24 hours',
  'Lethargy beyond 24 hours',
]

const normalSigns = [
  'Grogginess for several hours after surgery',
  'Slight swelling at incision site',
  'Reduced appetite for first 12 hours',
]

const releaseGuidelines = [
  'Males can be released after 24 hours; females after 48 hours preferred',
  'Release at original trap location',
  'Release at dusk or dawn preferred',
  'Do NOT release in rain, extreme cold, or storms',
]

const warningSigns = [
  'Bleeding that does not stop within 10 minutes of gentle pressure',
  'Open or gaping incision',
  'Severe swelling, redness, or discharge at incision site',
  'Cat not breathing normally or gasping',
  'Cat completely unresponsive or unable to stand after 24 hours',
  'Vomiting repeatedly',
  'Pale gums (sign of internal bleeding)',
  'Cat crying/vocalizing in apparent pain beyond mild discomfort',
]

const ackTexts = [
  'I have read and understand the recovery instructions',
  'I will keep the cat confined for the minimum recovery period',
  'I will monitor the cat and contact Sam\'s TNR if concerns arise',
  'I will release the cat at its original location',
  'I understand Sam\'s TNR is not responsible for post-release outcomes',
]

function generateRef() {
  const d = new Date()
  const y = String(d.getFullYear()).slice(2)
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const r = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
  return `PSR-${y}${m}-${r}`
}

export default function PostSurgeryForm() {
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(null)

  const [catInfo, setCatInfo] = useState({
    description: '', sex: '', earTipConfirmed: '', surgeryDate: '',
    surgeryType: '', vetClinic: '',
  })
  const [caretaker, setCaretaker] = useState({ name: '', phone: '' })
  const [emergencyContacts, setEmergencyContacts] = useState({
    samsPhone: '(229) 555-0TNR', emergencyVet: '', afterHoursVet: '',
  })
  const [acks, setAcks] = useState(new Array(5).fill(false))
  const [pickup, setPickup] = useState({ date: '', time: '', pickedUpBy: '' })
  const [sigName, setSigName] = useState('')
  const [sigDate] = useState(new Date().toLocaleDateString('en-US'))

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [step])

  const updateCat = (k, v) => setCatInfo(p => ({ ...p, [k]: v }))
  const updateCaretaker = (k, v) => setCaretaker(p => ({ ...p, [k]: v }))
  const updateEmergency = (k, v) => setEmergencyContacts(p => ({ ...p, [k]: v }))
  const updatePickup = (k, v) => setPickup(p => ({ ...p, [k]: v }))

  function validate() {
    const e = {}
    if (step === 0) {
      if (!catInfo.description.trim()) e.description = 'Required'
      if (!catInfo.sex) e.sex = 'Required'
      if (!catInfo.earTipConfirmed) e.earTipConfirmed = 'Required'
      if (!catInfo.surgeryDate) e.surgeryDate = 'Required'
      if (!catInfo.surgeryType) e.surgeryType = 'Required'
      if (!catInfo.vetClinic.trim()) e.vetClinic = 'Required'
    }
    if (step === 1) {
      if (!caretaker.name.trim()) e.caretakerName = 'Required'
      if (!caretaker.phone.trim()) e.caretakerPhone = 'Required'
    }
    if (step === 4) {
      if (!acks.every(Boolean)) e.acks = 'All acknowledgments must be checked'
    }
    if (step === 5) {
      if (!pickup.date) e.pickupDate = 'Required'
      if (!pickup.time) e.pickupTime = 'Required'
      if (!pickup.pickedUpBy.trim()) e.pickedUpBy = 'Required'
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
      catInfo, caretaker, emergencyContacts, acks, pickup, sigName, sigDate,
    }
    const existing = JSON.parse(localStorage.getItem('tnr-post-surgery') || '[]')
    existing.push(submission)
    localStorage.setItem('tnr-post-surgery', JSON.stringify(existing))
    setSubmitted(submission)
  }

  if (submitted) return <Confirmation data={submitted} />

  const inputCls = 'w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rust focus:border-transparent'
  const labelCls = 'block text-sm font-semibold text-gray-700 mb-1'
  const errCls = 'text-red-600 text-xs mt-1'
  const sectionTitle = 'text-xl font-bold text-white bg-rust px-4 py-2 rounded-md mb-6'

  return (
    <div className="pt-24 pb-16 px-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-rust mb-2 text-center">Post-Surgery Release & Care Instructions</h1>
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

      {/* Step 0: Cat Info */}
      {step === 0 && (
        <div>
          <div className={sectionTitle}>Section 1 — Cat Information</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Cat Description (color, markings) *</label>
              <input className={inputCls} value={catInfo.description} onChange={e => updateCat('description', e.target.value)} placeholder="e.g. Orange tabby, white paws" />
              {errors.description && <p className={errCls}>{errors.description}</p>}
            </div>
            <div>
              <label className={labelCls}>Sex *</label>
              <div className="flex gap-4 mt-2">
                {['Male', 'Female'].map(v => (
                  <label key={v} className="flex items-center gap-1 text-sm cursor-pointer">
                    <input type="radio" name="sex" checked={catInfo.sex === v} onChange={() => updateCat('sex', v)} className="accent-rust" /> {v}
                  </label>
                ))}
              </div>
              {errors.sex && <p className={errCls}>{errors.sex}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Ear-Tip Confirmed? *</label>
              <div className="flex gap-4 mt-2">
                {['Yes', 'No'].map(v => (
                  <label key={v} className="flex items-center gap-1 text-sm cursor-pointer">
                    <input type="radio" name="earTip" checked={catInfo.earTipConfirmed === v} onChange={() => updateCat('earTipConfirmed', v)} className="accent-rust" /> {v}
                  </label>
                ))}
              </div>
              {errors.earTipConfirmed && <p className={errCls}>{errors.earTipConfirmed}</p>}
            </div>
            <div>
              <label className={labelCls}>Surgery Date *</label>
              <input className={inputCls} type="date" value={catInfo.surgeryDate} onChange={e => updateCat('surgeryDate', e.target.value)} />
              {errors.surgeryDate && <p className={errCls}>{errors.surgeryDate}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Surgery Type *</label>
              <div className="flex gap-4 mt-2">
                {['Spay', 'Neuter'].map(v => (
                  <label key={v} className="flex items-center gap-1 text-sm cursor-pointer">
                    <input type="radio" name="surgeryType" checked={catInfo.surgeryType === v} onChange={() => updateCat('surgeryType', v)} className="accent-rust" /> {v}
                  </label>
                ))}
              </div>
              {errors.surgeryType && <p className={errCls}>{errors.surgeryType}</p>}
            </div>
            <div>
              <label className={labelCls}>Vet Clinic *</label>
              <input className={inputCls} value={catInfo.vetClinic} onChange={e => updateCat('vetClinic', e.target.value)} placeholder="Name of veterinary clinic" />
              {errors.vetClinic && <p className={errCls}>{errors.vetClinic}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Step 1: Caretaker */}
      {step === 1 && (
        <div>
          <div className={sectionTitle}>Section 2 — Requestor / Caretaker Information</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Full Name *</label>
              <input className={inputCls} value={caretaker.name} onChange={e => updateCaretaker('name', e.target.value)} />
              {errors.caretakerName && <p className={errCls}>{errors.caretakerName}</p>}
            </div>
            <div>
              <label className={labelCls}>Phone Number *</label>
              <input className={inputCls} type="tel" value={caretaker.phone} onChange={e => updateCaretaker('phone', e.target.value)} />
              {errors.caretakerPhone && <p className={errCls}>{errors.caretakerPhone}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Recovery Instructions (display only) */}
      {step === 2 && (
        <div>
          <div className={sectionTitle}>Section 3 — Recovery Instructions</div>
          <div className="bg-amber-50 border-l-4 border-amber-500 p-3 mb-6">
            <p className="text-sm font-bold text-amber-800">⚠️ IMPORTANT: Please read all instructions carefully before pickup.</p>
          </div>

          <h3 className="font-bold text-rust mb-3">Post-Surgery Care</h3>
          <div className="space-y-3 mb-6">
            {recoveryInstructions.map((r, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-xl flex-shrink-0">{r.icon}</span>
                <span className="text-sm text-gray-700">{r.text}</span>
              </div>
            ))}
          </div>

          <h3 className="font-bold text-rust mb-3">Monitor For (Warning Signs)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
            {monitorSigns.map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="text-red-500">⚠️</span> {s}
              </div>
            ))}
          </div>

          <h3 className="font-bold text-rust mb-3">Normal After Surgery</h3>
          <div className="grid grid-cols-1 gap-2 mb-6">
            {normalSigns.map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="text-green-600">✅</span> {s}
              </div>
            ))}
          </div>

          <h3 className="font-bold text-rust mb-3">Release Guidelines</h3>
          <div className="grid grid-cols-1 gap-2 mb-4">
            {releaseGuidelines.map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="text-blue-500">📍</span> {s}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Emergency Info */}
      {step === 3 && (
        <div>
          <div className={sectionTitle}>Section 4 — Emergency Contacts</div>
          <div className="grid grid-cols-1 gap-4 mb-6">
            <div>
              <label className={labelCls}>Sam's TNR Phone</label>
              <input className={inputCls} value={emergencyContacts.samsPhone} onChange={e => updateEmergency('samsPhone', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Emergency Vet Phone</label>
              <input className={inputCls} value={emergencyContacts.emergencyVet} onChange={e => updateEmergency('emergencyVet', e.target.value)} placeholder="Local emergency vet number" />
            </div>
            <div>
              <label className={labelCls}>After-Hours Vet Phone</label>
              <input className={inputCls} value={emergencyContacts.afterHoursVet} onChange={e => updateEmergency('afterHoursVet', e.target.value)} placeholder="After-hours vet number" />
            </div>
          </div>

          <h3 className="font-bold text-rust mb-3">⚠️ Warning Signs Requiring Immediate Vet Attention</h3>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <ul className="space-y-2">
              {warningSigns.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-red-800">
                  <span className="text-red-600 font-bold mt-0.5">•</span> {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Step 4: Acknowledgments */}
      {step === 4 && (
        <div>
          <div className={sectionTitle}>Section 5 — Acknowledgments</div>
          <p className="text-gray-600 text-sm mb-4">Please read each statement carefully and check to confirm your understanding.</p>
          <div className="space-y-4 mb-4">
            {ackTexts.map((a, i) => (
              <label key={i} className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                <input type="checkbox" checked={acks[i]} onChange={() => { const n = [...acks]; n[i] = !n[i]; setAcks(n) }} className="mt-1 accent-rust flex-shrink-0" />
                <span className="text-sm text-gray-700">{a}</span>
              </label>
            ))}
          </div>
          {errors.acks && <p className={errCls}>{errors.acks}</p>}
        </div>
      )}

      {/* Step 5: Pickup & Signature */}
      {step === 5 && (
        <div>
          <div className={sectionTitle}>Section 6 — Pickup Information & Signature</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div>
              <label className={labelCls}>Pickup Date *</label>
              <input className={inputCls} type="date" value={pickup.date} onChange={e => updatePickup('date', e.target.value)} />
              {errors.pickupDate && <p className={errCls}>{errors.pickupDate}</p>}
            </div>
            <div>
              <label className={labelCls}>Pickup Time *</label>
              <input className={inputCls} type="time" value={pickup.time} onChange={e => updatePickup('time', e.target.value)} />
              {errors.pickupTime && <p className={errCls}>{errors.pickupTime}</p>}
            </div>
            <div>
              <label className={labelCls}>Picked Up By *</label>
              <input className={inputCls} value={pickup.pickedUpBy} onChange={e => updatePickup('pickedUpBy', e.target.value)} placeholder="Name of person picking up" />
              {errors.pickedUpBy && <p className={errCls}>{errors.pickedUpBy}</p>}
            </div>
          </div>

          <hr className="my-6 border-gray-300" />

          <p className="text-gray-600 text-sm mb-6">By typing your name below, you acknowledge that you have received the cat, read the recovery instructions, and agree to the acknowledgments above.</p>
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
            🐾 Submit Post-Surgery Form
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
        <h1 className="text-3xl font-bold text-rust mb-2">Post-Surgery Form Submitted!</h1>
        <p className="text-gray-600">Thank you. Please follow all recovery instructions carefully.</p>
        <div className="inline-block mt-4 bg-rust text-white px-6 py-2 rounded-md font-mono text-lg font-bold">
          Ref: {data.ref}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h2 className="font-bold text-lg text-rust mb-3">Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <div><span className="font-semibold">Cat:</span> {data.catInfo.description}</div>
          <div><span className="font-semibold">Sex:</span> {data.catInfo.sex}</div>
          <div><span className="font-semibold">Surgery:</span> {data.catInfo.surgeryType} on {data.catInfo.surgeryDate}</div>
          <div><span className="font-semibold">Vet:</span> {data.catInfo.vetClinic}</div>
          <div><span className="font-semibold">Caretaker:</span> {data.caretaker.name}</div>
          <div><span className="font-semibold">Phone:</span> {data.caretaker.phone}</div>
          <div><span className="font-semibold">Pickup:</span> {data.pickup.date} at {data.pickup.time}</div>
          <div><span className="font-semibold">Signed By:</span> {data.sigName}</div>
        </div>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 text-sm text-amber-800 mb-6">
        <p className="font-semibold">Reminders:</p>
        <ul className="list-disc ml-4 mt-1 space-y-1">
          <li>Males: release after 24 hours. Females: release after 48 hours.</li>
          <li>Release at the original trap location, at dusk or dawn.</li>
          <li>Contact Sam's TNR immediately if you notice any warning signs.</li>
        </ul>
      </div>

      <div className="text-center">
        <a href="/" className="inline-block px-6 py-2 bg-rust text-white rounded-md font-medium hover:bg-rust-light transition-colors">
          ← Back to Home
        </a>
      </div>
    </div>
  )
}
