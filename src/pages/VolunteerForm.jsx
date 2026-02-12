import { useState, useEffect } from 'react'

const SECTIONS = [
  'Personal Info',
  'Availability',
  'Skills & Experience',
  'Emergency & References',
  'Waiver & Consent',
  'Signature',
]

const SKILLS = [
  'Trapping', 'Transport', 'Colony Feeding', 'Fostering',
  'Fundraising', 'Social Media', 'Admin/Data Entry',
  'Event Planning', 'Education/Outreach',
]

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const waiverText = [
  { num: '1. Assumption of Risk.', text: 'I understand that volunteer activities with Sam\'s TNR, Inc. involve inherent risks including, but not limited to: animal bites or scratches, exposure to zoonotic diseases, physical injuries from lifting traps or equipment (30+ lbs), slips and falls, exposure to extreme weather conditions, and injuries related to transportation of animals.' },
  { num: '2. Release of Liability.', text: 'To the fullest extent permitted by Georgia law, I hereby release, waive, and discharge Sam\'s TNR, Inc., its officers, directors, employees, volunteers, agents, and affiliated veterinary professionals from any and all liability, claims, demands, actions, or causes of action arising out of or related to any loss, damage, or personal injury (including death) that may be sustained during my volunteer activities, except in cases of gross negligence or willful misconduct.' },
  { num: '3. Medical Authorization.', text: 'In the event of an emergency, I authorize Sam\'s TNR, Inc. to seek emergency medical treatment on my behalf. I understand that any medical expenses incurred are my sole responsibility.' },
  { num: '4. Indemnification.', text: 'I agree to indemnify, defend, and hold harmless Sam\'s TNR, Inc. and its affiliates from any claims, lawsuits, or demands made by any third party arising from my volunteer activities.' },
  { num: '5. Governing Law.', text: 'This waiver is governed by the laws of the State of Georgia. If any provision is found to be unenforceable, the remaining provisions shall remain in full force and effect.' },
]

function generateRef() {
  const d = new Date()
  const y = String(d.getFullYear()).slice(2)
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const r = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
  return `VOL-${y}${m}-${r}`
}

export default function VolunteerForm() {
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(null)

  const [personal, setPersonal] = useState({
    fullName: '', phone: '', email: '', address: '', city: '', state: '', zip: '', dob: '', occupation: '',
  })
  const [availability, setAvailability] = useState({
    days: [], times: [], hoursPerWeek: '',
  })
  const [skills, setSkills] = useState([])
  const [experience, setExperience] = useState({
    priorExperience: '', description: '', comfortableTraps: '', ownVehicle: '', canTransport: '',
  })
  const [physicalAck, setPhysicalAck] = useState(false)
  const [emergency, setEmergency] = useState({ name: '', phone: '', relationship: '' })
  const [ref1, setRef1] = useState({ name: '', phone: '', relationship: '' })
  const [ref2, setRef2] = useState({ name: '', phone: '', relationship: '' })
  const [backgroundConsent, setBackgroundConsent] = useState(false)
  const [waiverAgreed, setWaiverAgreed] = useState(false)
  const [sigName, setSigName] = useState('')
  const [sigDate] = useState(new Date().toLocaleDateString('en-US'))

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [step])

  const updatePersonal = (k, v) => setPersonal(p => ({ ...p, [k]: v }))
  const updateExperience = (k, v) => setExperience(p => ({ ...p, [k]: v }))
  const updateEmergency = (k, v) => setEmergency(p => ({ ...p, [k]: v }))

  const toggleArray = (arr, setArr, val, key) => {
    if (key) {
      setArr(p => ({ ...p, [key]: p[key].includes(val) ? p[key].filter(x => x !== val) : [...p[key], val] }))
    } else {
      setArr(p => p.includes(val) ? p.filter(x => x !== val) : [...p, val])
    }
  }

  function validate() {
    const e = {}
    if (step === 0) {
      if (!personal.fullName.trim()) e.fullName = 'Required'
      if (!personal.phone.trim()) e.phone = 'Required'
      if (!personal.email.trim()) e.email = 'Required'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personal.email)) e.email = 'Invalid email'
      if (!personal.address.trim()) e.address = 'Required'
      if (!personal.city.trim()) e.city = 'Required'
      if (!personal.state.trim()) e.state = 'Required'
      if (!personal.zip.trim()) e.zip = 'Required'
      if (!personal.dob.trim()) e.dob = 'Required'
    }
    if (step === 1) {
      if (availability.days.length === 0) e.days = 'Select at least one day'
      if (availability.times.length === 0) e.times = 'Select at least one time'
    }
    if (step === 2) {
      if (!physicalAck) e.physicalAck = 'You must acknowledge the physical requirements'
    }
    if (step === 3) {
      if (!emergency.name.trim()) e.emergName = 'Required'
      if (!emergency.phone.trim()) e.emergPhone = 'Required'
      if (!emergency.relationship.trim()) e.emergRel = 'Required'
      if (!ref1.name.trim()) e.ref1Name = 'Required'
      if (!ref1.phone.trim()) e.ref1Phone = 'Required'
      if (!ref2.name.trim()) e.ref2Name = 'Required'
      if (!ref2.phone.trim()) e.ref2Phone = 'Required'
    }
    if (step === 4) {
      if (!backgroundConsent) e.bgConsent = 'Required'
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
      personal, availability, skills, experience, physicalAck,
      emergency, references: [ref1, ref2], backgroundConsent, waiverAgreed,
      sigName, sigDate,
    }
    const existing = JSON.parse(localStorage.getItem('tnr-volunteer-apps') || '[]')
    existing.push(submission)
    localStorage.setItem('tnr-volunteer-apps', JSON.stringify(existing))
    setSubmitted(submission)
  }

  if (submitted) return <Confirmation data={submitted} />

  const inputCls = 'w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rust focus:border-transparent'
  const labelCls = 'block text-sm font-semibold text-gray-700 mb-1'
  const errCls = 'text-red-600 text-xs mt-1'
  const sectionTitle = 'text-xl font-bold text-white bg-rust px-4 py-2 rounded-md mb-6'

  return (
    <div className="pt-24 pb-16 px-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-rust mb-2 text-center">Volunteer Application</h1>
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

      {/* Step 0: Personal Info */}
      {step === 0 && (
        <div>
          <div className={sectionTitle}>Section 1 — Personal Information</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Full Name *</label>
              <input className={inputCls} value={personal.fullName} onChange={e => updatePersonal('fullName', e.target.value)} />
              {errors.fullName && <p className={errCls}>{errors.fullName}</p>}
            </div>
            <div>
              <label className={labelCls}>Phone Number *</label>
              <input className={inputCls} type="tel" value={personal.phone} onChange={e => updatePersonal('phone', e.target.value)} />
              {errors.phone && <p className={errCls}>{errors.phone}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Email Address *</label>
              <input className={inputCls} type="email" value={personal.email} onChange={e => updatePersonal('email', e.target.value)} />
              {errors.email && <p className={errCls}>{errors.email}</p>}
            </div>
            <div>
              <label className={labelCls}>Date of Birth *</label>
              <input className={inputCls} type="date" value={personal.dob} onChange={e => updatePersonal('dob', e.target.value)} />
              {errors.dob && <p className={errCls}>{errors.dob}</p>}
            </div>
          </div>
          <div className="mb-4">
            <label className={labelCls}>Mailing Address *</label>
            <input className={inputCls} value={personal.address} onChange={e => updatePersonal('address', e.target.value)} />
            {errors.address && <p className={errCls}>{errors.address}</p>}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div className="col-span-2">
              <label className={labelCls}>City *</label>
              <input className={inputCls} value={personal.city} onChange={e => updatePersonal('city', e.target.value)} />
              {errors.city && <p className={errCls}>{errors.city}</p>}
            </div>
            <div>
              <label className={labelCls}>State *</label>
              <input className={inputCls} value={personal.state} onChange={e => updatePersonal('state', e.target.value)} />
              {errors.state && <p className={errCls}>{errors.state}</p>}
            </div>
            <div>
              <label className={labelCls}>ZIP *</label>
              <input className={inputCls} value={personal.zip} onChange={e => updatePersonal('zip', e.target.value)} />
              {errors.zip && <p className={errCls}>{errors.zip}</p>}
            </div>
          </div>
          <div className="mb-4">
            <label className={labelCls}>Occupation</label>
            <input className={inputCls} value={personal.occupation} onChange={e => updatePersonal('occupation', e.target.value)} />
          </div>
        </div>
      )}

      {/* Step 1: Availability */}
      {step === 1 && (
        <div>
          <div className={sectionTitle}>Section 2 — Availability</div>
          <div className="mb-6">
            <label className={labelCls}>Days Available *</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
              {DAYS.map(d => (
                <label key={d} className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded border border-gray-200 hover:bg-gray-50">
                  <input type="checkbox" checked={availability.days.includes(d)} onChange={() => toggleArray(null, setAvailability, d, 'days')} className="accent-rust" />
                  {d}
                </label>
              ))}
            </div>
            {errors.days && <p className={errCls}>{errors.days}</p>}
          </div>
          <div className="mb-6">
            <label className={labelCls}>Preferred Times *</label>
            <div className="flex gap-4 mt-2">
              {['Morning', 'Afternoon', 'Evening'].map(t => (
                <label key={t} className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded border border-gray-200 hover:bg-gray-50">
                  <input type="checkbox" checked={availability.times.includes(t)} onChange={() => toggleArray(null, setAvailability, t, 'times')} className="accent-rust" />
                  {t}
                </label>
              ))}
            </div>
            {errors.times && <p className={errCls}>{errors.times}</p>}
          </div>
          <div className="mb-4">
            <label className={labelCls}>Estimated Hours Per Week</label>
            <input className={inputCls + ' max-w-xs'} type="number" min="1" value={availability.hoursPerWeek} onChange={e => setAvailability(p => ({ ...p, hoursPerWeek: e.target.value }))} placeholder="e.g. 5" />
          </div>
        </div>
      )}

      {/* Step 2: Skills & Experience */}
      {step === 2 && (
        <div>
          <div className={sectionTitle}>Section 3 — Skills, Interests & Experience</div>
          <div className="mb-6">
            <label className={labelCls}>Areas of Interest (check all that apply)</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              {SKILLS.map(s => (
                <label key={s} className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded border border-gray-200 hover:bg-gray-50">
                  <input type="checkbox" checked={skills.includes(s)} onChange={() => toggleArray(skills, setSkills, s)} className="accent-rust" />
                  {s}
                </label>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Prior TNR / Animal Rescue Experience?</label>
              <div className="flex gap-4 mt-1">
                {['Yes', 'No'].map(v => (
                  <label key={v} className="flex items-center gap-1 text-sm cursor-pointer">
                    <input type="radio" name="priorExp" checked={experience.priorExperience === v} onChange={() => updateExperience('priorExperience', v)} className="accent-rust" /> {v}
                  </label>
                ))}
              </div>
            </div>
            {experience.priorExperience === 'Yes' && (
              <div>
                <label className={labelCls}>Please Describe</label>
                <textarea className={inputCls} rows="2" value={experience.description} onChange={e => updateExperience('description', e.target.value)} />
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div>
              <label className={labelCls}>Comfortable Handling Traps?</label>
              <div className="flex gap-4 mt-1">
                {['Yes', 'No'].map(v => (
                  <label key={v} className="flex items-center gap-1 text-sm cursor-pointer">
                    <input type="radio" name="traps" checked={experience.comfortableTraps === v} onChange={() => updateExperience('comfortableTraps', v)} className="accent-rust" /> {v}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className={labelCls}>Own Vehicle?</label>
              <div className="flex gap-4 mt-1">
                {['Yes', 'No'].map(v => (
                  <label key={v} className="flex items-center gap-1 text-sm cursor-pointer">
                    <input type="radio" name="vehicle" checked={experience.ownVehicle === v} onChange={() => updateExperience('ownVehicle', v)} className="accent-rust" /> {v}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className={labelCls}>Can Transport Cats?</label>
              <div className="flex gap-4 mt-1">
                {['Yes', 'No'].map(v => (
                  <label key={v} className="flex items-center gap-1 text-sm cursor-pointer">
                    <input type="radio" name="transport" checked={experience.canTransport === v} onChange={() => updateExperience('canTransport', v)} className="accent-rust" /> {v}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
            <p className="text-sm font-bold text-yellow-800 mb-2">Physical Requirements Acknowledgment</p>
            <p className="text-sm text-yellow-800 mb-3">Volunteer trapping activities may involve lifting traps weighing 30+ pounds, outdoor work in all weather conditions, early morning or late evening hours, and exposure to feral animals.</p>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={physicalAck} onChange={() => setPhysicalAck(!physicalAck)} className="mt-1 accent-rust" />
              <span className="text-sm font-semibold text-yellow-800">I understand and acknowledge the physical requirements of volunteer activities *</span>
            </label>
            {errors.physicalAck && <p className={errCls}>{errors.physicalAck}</p>}
          </div>
        </div>
      )}

      {/* Step 3: Emergency Contact & References */}
      {step === 3 && (
        <div>
          <div className={sectionTitle}>Section 4 — Emergency Contact & References</div>
          <h3 className="font-bold text-sm text-gray-700 mb-3">Emergency Contact *</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div>
              <label className={labelCls}>Name *</label>
              <input className={inputCls} value={emergency.name} onChange={e => updateEmergency('name', e.target.value)} />
              {errors.emergName && <p className={errCls}>{errors.emergName}</p>}
            </div>
            <div>
              <label className={labelCls}>Phone *</label>
              <input className={inputCls} type="tel" value={emergency.phone} onChange={e => updateEmergency('phone', e.target.value)} />
              {errors.emergPhone && <p className={errCls}>{errors.emergPhone}</p>}
            </div>
            <div>
              <label className={labelCls}>Relationship *</label>
              <input className={inputCls} value={emergency.relationship} onChange={e => updateEmergency('relationship', e.target.value)} />
              {errors.emergRel && <p className={errCls}>{errors.emergRel}</p>}
            </div>
          </div>

          <h3 className="font-bold text-sm text-gray-700 mb-3">Reference 1 *</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div>
              <label className={labelCls}>Name *</label>
              <input className={inputCls} value={ref1.name} onChange={e => setRef1(p => ({ ...p, name: e.target.value }))} />
              {errors.ref1Name && <p className={errCls}>{errors.ref1Name}</p>}
            </div>
            <div>
              <label className={labelCls}>Phone *</label>
              <input className={inputCls} type="tel" value={ref1.phone} onChange={e => setRef1(p => ({ ...p, phone: e.target.value }))} />
              {errors.ref1Phone && <p className={errCls}>{errors.ref1Phone}</p>}
            </div>
            <div>
              <label className={labelCls}>Relationship</label>
              <input className={inputCls} value={ref1.relationship} onChange={e => setRef1(p => ({ ...p, relationship: e.target.value }))} />
            </div>
          </div>

          <h3 className="font-bold text-sm text-gray-700 mb-3">Reference 2 *</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div>
              <label className={labelCls}>Name *</label>
              <input className={inputCls} value={ref2.name} onChange={e => setRef2(p => ({ ...p, name: e.target.value }))} />
              {errors.ref2Name && <p className={errCls}>{errors.ref2Name}</p>}
            </div>
            <div>
              <label className={labelCls}>Phone *</label>
              <input className={inputCls} type="tel" value={ref2.phone} onChange={e => setRef2(p => ({ ...p, phone: e.target.value }))} />
              {errors.ref2Phone && <p className={errCls}>{errors.ref2Phone}</p>}
            </div>
            <div>
              <label className={labelCls}>Relationship</label>
              <input className={inputCls} value={ref2.relationship} onChange={e => setRef2(p => ({ ...p, relationship: e.target.value }))} />
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Waiver & Consent */}
      {step === 4 && (
        <div>
          <div className={sectionTitle}>Section 5 — Background Check & Liability Waiver</div>
          <div className="mb-6">
            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
              <input type="checkbox" checked={backgroundConsent} onChange={() => setBackgroundConsent(!backgroundConsent)} className="mt-1 accent-rust" />
              <span className="text-sm text-gray-700"><strong>Background Check Consent:</strong> I consent to a background check as part of my volunteer application. I understand this is standard practice for organizations working with animals and the community. *</span>
            </label>
            {errors.bgConsent && <p className={errCls}>{errors.bgConsent}</p>}
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 mb-4">
            <p className="text-sm font-bold text-yellow-800">PLEASE READ CAREFULLY. This is a legal document that affects your rights.</p>
          </div>
          <div className="max-h-80 overflow-y-auto border border-gray-300 rounded-md p-4 mb-4 bg-white text-sm text-gray-700 leading-relaxed">
            <p className="font-bold mb-3">VOLUNTEER LIABILITY WAIVER AND RELEASE OF CLAIMS</p>
            <p className="mb-3">Sam's TNR, Inc. — Barney, Georgia</p>
            {waiverText.map((w, i) => (
              <p key={i} className="mb-3"><strong>{w.num}</strong> {w.text}</p>
            ))}
            <p className="text-xs text-gray-500 mt-4">This waiver is governed by the laws of the State of Georgia. If any provision is found to be unenforceable, the remaining provisions shall remain in full force and effect.</p>
          </div>
          <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
            <input type="checkbox" checked={waiverAgreed} onChange={() => setWaiverAgreed(!waiverAgreed)} className="mt-1 accent-rust" />
            <span className="text-sm font-semibold text-gray-700">I have read, understand, and agree to the Volunteer Liability Waiver & Release of Claims *</span>
          </label>
          {errors.waiver && <p className={errCls + ' mt-2'}>{errors.waiver}</p>}
        </div>
      )}

      {/* Step 5: Signature */}
      {step === 5 && (
        <div>
          <div className={sectionTitle}>Signature</div>
          <p className="text-gray-600 text-sm mb-6">By typing your name below, you acknowledge that you have read, understand, and agree to all terms, acknowledgments, and the liability waiver set forth in this application.</p>
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
          <button onClick={handleSubmit} className="px-8 py-3 bg-rust text-white rounded-md font-bold text-sm hover:bg-rust-light transition-colors">🐾 Submit Application</button>
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
        <h1 className="text-3xl font-bold text-rust mb-2">Application Submitted!</h1>
        <p className="text-gray-600">Thank you for volunteering with Sam's TNR, Inc.</p>
        <div className="inline-block mt-4 bg-rust text-white px-6 py-2 rounded-md font-mono text-lg font-bold">
          Ref: {data.ref}
        </div>
      </div>
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h2 className="font-bold text-lg text-rust mb-3">Submission Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <div><span className="font-semibold">Name:</span> {data.personal.fullName}</div>
          <div><span className="font-semibold">Phone:</span> {data.personal.phone}</div>
          <div><span className="font-semibold">Email:</span> {data.personal.email}</div>
          <div><span className="font-semibold">Location:</span> {data.personal.city}, {data.personal.state}</div>
          <div><span className="font-semibold">Skills:</span> {data.skills.join(', ') || 'None selected'}</div>
          <div><span className="font-semibold">Signed By:</span> {data.sigName}</div>
          <div><span className="font-semibold">Date:</span> {data.sigDate}</div>
        </div>
      </div>
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 text-sm text-yellow-800 mb-6">
        <p className="font-semibold">What happens next?</p>
        <p>A Sam's TNR coordinator will review your application and contact you about orientation and next steps. Please save your reference number for your records.</p>
      </div>
      <div className="text-center">
        <a href="/" className="inline-block px-6 py-2 bg-rust text-white rounded-md font-medium hover:bg-rust-light transition-colors">← Back to Home</a>
      </div>
    </div>
  )
}
