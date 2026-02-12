import { useState, useEffect } from 'react'

const SECTIONS = ['Report Info', 'Incident Details', 'People & Description', 'Outcome & Follow-up', 'Review & Sign']

const INCIDENT_TYPES = [
  'Surgical complication', 'Cat death', 'Cat escape', 'Cat injury', 'Human injury',
  'Trap malfunction', 'Property damage', 'Complaint from public', 'Volunteer incident', 'Other'
]

const LOCATION_TYPES = ['Vet clinic', 'Trap site', 'Transport', 'Foster home', 'Colony', 'Other']

const FOLLOWUP_OPTIONS = [
  'Vet follow-up', 'Contact requestor', 'Contact property owner', 'Insurance claim',
  'Policy review', 'Training needed', 'None'
]

function generateRef() {
  const d = new Date()
  const y = String(d.getFullYear()).slice(2)
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const r = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
  return `INC-${y}${m}-${r}`
}

const emptyPerson = { name: '', role: '', contact: '' }

export default function IncidentReportForm() {
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(null)

  const [reportInfo, setReportInfo] = useState({
    incidentDate: '', incidentTime: '', reportDate: new Date().toISOString().split('T')[0],
    filedByName: '', filedByRole: ''
  })
  const [incidentTypes, setIncidentTypes] = useState([])
  const [incidentOther, setIncidentOther] = useState('')
  const [location, setLocation] = useState({ type: '', otherType: '', address: '' })
  const [catInfo, setCatInfo] = useState({ description: '', intakeRef: '', colony: '' })
  const [people, setPeople] = useState([{ ...emptyPerson }])
  const [description, setDescription] = useState('')
  const [actionsTaken, setActionsTaken] = useState('')
  const [outcome, setOutcome] = useState({ catStatus: '', humanStatus: '' })
  const [followUp, setFollowUp] = useState([])
  const [followUpNotes, setFollowUpNotes] = useState('')
  const [lessonsLearned, setLessonsLearned] = useState('')
  const [reviewedBy, setReviewedBy] = useState({ name: '', date: '' })
  const [sigName, setSigName] = useState('')
  const [sigDate] = useState(new Date().toLocaleDateString('en-US'))

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [step])

  const inputCls = 'w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rust focus:border-transparent'
  const labelCls = 'block text-sm font-semibold text-gray-700 mb-1'
  const errCls = 'text-red-600 text-xs mt-1'
  const sectionTitle = 'text-xl font-bold text-white bg-rust px-4 py-2 rounded-md mb-6'

  const toggleType = (t) => setIncidentTypes(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t])
  const toggleFollowUp = (t) => setFollowUp(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t])
  const updatePerson = (i, k, v) => setPeople(p => { const n = [...p]; n[i] = { ...n[i], [k]: v }; return n })
  const addPerson = () => { if (people.length < 3) setPeople(p => [...p, { ...emptyPerson }]) }
  const removePerson = (i) => setPeople(p => p.filter((_, j) => j !== i))

  function validate() {
    const e = {}
    if (step === 0) {
      if (!reportInfo.incidentDate) e.incidentDate = 'Required'
      if (!reportInfo.filedByName.trim()) e.filedByName = 'Required'
      if (incidentTypes.length === 0) e.incidentTypes = 'Select at least one'
      if (!location.type) e.locationType = 'Required'
    }
    if (step === 1) {
      if (!description.trim()) e.description = 'Required'
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
      reportInfo, incidentTypes, incidentOther, location, catInfo,
      people, description, actionsTaken, outcome, followUp, followUpNotes,
      lessonsLearned, reviewedBy, sigName, sigDate
    }
    const existing = JSON.parse(localStorage.getItem('tnr-incident-reports') || '[]')
    existing.push(submission)
    localStorage.setItem('tnr-incident-reports', JSON.stringify(existing))
    setSubmitted(submission)
  }

  if (submitted) {
    return (
      <div className="pt-24 pb-16 px-4 max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">📋</div>
          <h1 className="text-3xl font-bold text-rust mb-2">Incident Report Filed</h1>
          <p className="text-gray-600">The incident report has been recorded.</p>
          <div className="inline-block mt-4 bg-rust text-white px-6 py-2 rounded-md font-mono text-lg font-bold">
            Ref: {submitted.ref}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h2 className="font-bold text-lg text-rust mb-3">Report Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div><span className="font-semibold">Incident Date:</span> {submitted.reportInfo.incidentDate}</div>
            <div><span className="font-semibold">Filed By:</span> {submitted.reportInfo.filedByName}</div>
            <div><span className="font-semibold">Type(s):</span> {submitted.incidentTypes.join(', ')}</div>
            <div><span className="font-semibold">Location:</span> {submitted.location.type}{submitted.location.address ? ` — ${submitted.location.address}` : ''}</div>
            <div><span className="font-semibold">Cat Status:</span> {submitted.outcome.catStatus || 'N/A'}</div>
            <div><span className="font-semibold">Signed By:</span> {submitted.sigName}</div>
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

  return (
    <div className="pt-24 pb-16 px-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-rust mb-2 text-center">Incident Report Form</h1>
      <p className="text-gray-600 text-center mb-8">Sam's TNR, Inc. — Internal Documentation</p>

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

      {/* Step 0: Report Info + Incident Type + Location + Cat */}
      {step === 0 && (
        <div>
          <div className={sectionTitle}>Report Information</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Date of Incident *</label>
              <input className={inputCls} type="date" value={reportInfo.incidentDate} onChange={e => setReportInfo(p => ({ ...p, incidentDate: e.target.value }))} />
              {errors.incidentDate && <p className={errCls}>{errors.incidentDate}</p>}
            </div>
            <div>
              <label className={labelCls}>Time of Incident</label>
              <input className={inputCls} type="time" value={reportInfo.incidentTime} onChange={e => setReportInfo(p => ({ ...p, incidentTime: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className={labelCls}>Report Filed By (Name) *</label>
              <input className={inputCls} value={reportInfo.filedByName} onChange={e => setReportInfo(p => ({ ...p, filedByName: e.target.value }))} />
              {errors.filedByName && <p className={errCls}>{errors.filedByName}</p>}
            </div>
            <div>
              <label className={labelCls}>Role</label>
              <input className={inputCls} value={reportInfo.filedByRole} onChange={e => setReportInfo(p => ({ ...p, filedByRole: e.target.value }))} placeholder="e.g. Volunteer, Board Member" />
            </div>
          </div>

          <div className={sectionTitle}>Incident Type *</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {INCIDENT_TYPES.map(t => (
              <label key={t} className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer text-sm">
                <input type="checkbox" checked={incidentTypes.includes(t)} onChange={() => toggleType(t)} className="accent-rust" />
                {t}
              </label>
            ))}
          </div>
          {incidentTypes.includes('Other') && (
            <div className="mb-4">
              <label className={labelCls}>Describe Other</label>
              <input className={inputCls} value={incidentOther} onChange={e => setIncidentOther(e.target.value)} />
            </div>
          )}
          {errors.incidentTypes && <p className={errCls + ' mb-4'}>{errors.incidentTypes}</p>}

          <div className={sectionTitle}>Location</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Location Type *</label>
              <select className={inputCls} value={location.type} onChange={e => setLocation(p => ({ ...p, type: e.target.value }))}>
                <option value="">Select...</option>
                {LOCATION_TYPES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              {errors.locationType && <p className={errCls}>{errors.locationType}</p>}
            </div>
            <div>
              <label className={labelCls}>Address / Details</label>
              <input className={inputCls} value={location.address} onChange={e => setLocation(p => ({ ...p, address: e.target.value }))} />
            </div>
          </div>

          <div className={sectionTitle}>Cat Involved</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className={labelCls}>Description</label>
              <input className={inputCls} value={catInfo.description} onChange={e => setCatInfo(p => ({ ...p, description: e.target.value }))} placeholder="Color, markings, etc." />
            </div>
            <div>
              <label className={labelCls}>Intake Ref #</label>
              <input className={inputCls} value={catInfo.intakeRef} onChange={e => setCatInfo(p => ({ ...p, intakeRef: e.target.value }))} />
            </div>
            <div>
              <label className={labelCls}>Colony / Location</label>
              <input className={inputCls} value={catInfo.colony} onChange={e => setCatInfo(p => ({ ...p, colony: e.target.value }))} />
            </div>
          </div>
        </div>
      )}

      {/* Step 1: People & Description */}
      {step === 1 && (
        <div>
          <div className={sectionTitle}>People Involved</div>
          {people.map((p, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
              <div>
                <label className={labelCls}>Name</label>
                <input className={inputCls} value={p.name} onChange={e => updatePerson(i, 'name', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Role</label>
                <input className={inputCls} value={p.role} onChange={e => updatePerson(i, 'role', e.target.value)} />
              </div>
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className={labelCls}>Contact Info</label>
                  <input className={inputCls} value={p.contact} onChange={e => updatePerson(i, 'contact', e.target.value)} />
                </div>
                {people.length > 1 && (
                  <button onClick={() => removePerson(i)} className="text-red-500 hover:text-red-700 text-lg leading-none mb-2" title="Remove">×</button>
                )}
              </div>
            </div>
          ))}
          {people.length < 3 && (
            <button onClick={addPerson} className="text-sm text-rust font-semibold hover:underline mb-6">+ Add Another Person</button>
          )}

          <div className={sectionTitle}>Description of Incident *</div>
          <div className="mb-4">
            <label className={labelCls}>What happened? (Chronological order)</label>
            <textarea className={inputCls} rows="6" value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the incident in detail..." />
            {errors.description && <p className={errCls}>{errors.description}</p>}
          </div>

          <div className="mb-4">
            <label className={labelCls}>Immediate Actions Taken</label>
            <textarea className={inputCls} rows="4" value={actionsTaken} onChange={e => setActionsTaken(e.target.value)} placeholder="What was done in response?" />
          </div>
        </div>
      )}

      {/* Step 2: Outcome & Follow-up (was step 3, shifting for 5-step) */}
      {step === 2 && (
        <div>
          <div className={sectionTitle}>Outcome</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className={labelCls}>Cat Status</label>
              <select className={inputCls} value={outcome.catStatus} onChange={e => setOutcome(p => ({ ...p, catStatus: e.target.value }))}>
                <option value="">Select...</option>
                <option value="Recovered">Recovered</option>
                <option value="Deceased">Deceased</option>
                <option value="Unknown">Unknown</option>
                <option value="Ongoing treatment">Ongoing treatment</option>
                <option value="N/A">N/A</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Human Status (if applicable)</label>
              <input className={inputCls} value={outcome.humanStatus} onChange={e => setOutcome(p => ({ ...p, humanStatus: e.target.value }))} />
            </div>
          </div>

          <div className={sectionTitle}>Follow-up Needed</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {FOLLOWUP_OPTIONS.map(f => (
              <label key={f} className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer text-sm">
                <input type="checkbox" checked={followUp.includes(f)} onChange={() => toggleFollowUp(f)} className="accent-rust" />
                {f}
              </label>
            ))}
          </div>

          <div className="mb-4">
            <label className={labelCls}>Follow-up Notes</label>
            <textarea className={inputCls} rows="3" value={followUpNotes} onChange={e => setFollowUpNotes(e.target.value)} />
          </div>
        </div>
      )}

      {/* Step 3: Lessons & Photos */}
      {step === 3 && (
        <div>
          <div className={sectionTitle}>Documentation & Lessons Learned</div>
          <div className="mb-4">
            <label className={labelCls}>Photos / Documentation</label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center text-sm text-gray-500">
              <p>📷 Photo upload functionality coming soon</p>
              <p className="text-xs mt-1">For now, please attach photos via email to info@samstnr.org referencing the report number</p>
            </div>
          </div>
          <div className="mb-4">
            <label className={labelCls}>Lessons Learned / Prevention</label>
            <textarea className={inputCls} rows="4" value={lessonsLearned} onChange={e => setLessonsLearned(e.target.value)} placeholder="What can be done to prevent this in the future?" />
          </div>

          <div className={sectionTitle}>Internal Review</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Reviewed By (Name)</label>
              <input className={inputCls} value={reviewedBy.name} onChange={e => setReviewedBy(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label className={labelCls}>Review Date</label>
              <input className={inputCls} type="date" value={reviewedBy.date} onChange={e => setReviewedBy(p => ({ ...p, date: e.target.value }))} />
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Signature */}
      {step === 4 && (
        <div>
          <div className={sectionTitle}>Signature</div>
          <p className="text-gray-600 text-sm mb-6">By signing below, I certify that the information in this report is accurate to the best of my knowledge.</p>
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
        {step < 4 ? (
          <button onClick={next} className="px-6 py-2 bg-rust text-white rounded-md text-sm font-medium hover:bg-rust-light transition-colors">
            Next →
          </button>
        ) : (
          <button onClick={handleSubmit} className="px-8 py-3 bg-rust text-white rounded-md font-bold text-sm hover:bg-rust-light transition-colors">
            📋 Submit Incident Report
          </button>
        )}
      </div>
    </div>
  )
}
