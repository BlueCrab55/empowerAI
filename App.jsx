import exerciseData from "./exercise_sample.json";
import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Download, Printer, Brain, Activity, ClipboardList, ShieldCheck, HeartPulse } from 'lucide-react'

const TRIAGE = [
  { key: 'A', label: 'Clinical: fix a specific pain' },
  { key: 'B', label: 'Performance: specific fitness goal' },
  { key: 'C', label: 'Both: goal + an ache in the way' },
  { key: 'D', label: 'Mobility / flexibility focus' },
  { key: 'E', label: 'Longevity / healthspan' },
]

const CONDITIONS = [
  { id: 'pf', name: 'Plantar Fasciitis', area: 'Foot' },
  { id: 'las', name: 'Lateral Ankle Sprain', area: 'Ankle' },
  { id: 'hs', name: 'Hamstring Strain', area: 'Hamstring' },
  { id: 'pfps', name: 'Patellofemoral Pain (PFPS)', area: 'Knee' },
  { id: 'nsLBP', name: 'Low Back Pain (Non-specific)', area: 'Spine' },
  { id: 'saps', name: 'Shoulder Pain (Subacromial)', area: 'Shoulder' },
  { id: 'le', name: 'Tennis Elbow (Lateral Epicondylopathy)', area: 'Elbow/Wrist' },
]

const PERFORMANCE_TRACKS = [
  { id: 'endurance', name: 'Endurance Athlete (80/20)' },
  { id: 'general', name: 'General Health & Fitness' },
  { id: 'hybrid', name: 'Hybrid: Strength + Endurance' },
  { id: 'longevity', name: 'Longevity Protocol' },
]

const clamp = (n, min = 1, max = 5) => Math.max(min, Math.min(max, n || 1))

function computeReadinessScore({ sleep, stress, energy, soreness }) {
  const vals = [sleep, stress, energy, soreness].map(v => clamp(v))
  const avg = vals.reduce((a,b)=>a+b,0) / vals.length
  const score = Math.round((avg - 1) / 4 * 60 + 40) // 1-5 → 40-100
  let band, guidance
  if (score > 85) { band = 'Green'; guidance = 'Execute as planned; optional top set if it feels great.' }
  else if (score >= 60) { band = 'Yellow'; guidance = 'Trim volume ~15–20%, keep intensity similar.' }
  else { band = 'Red'; guidance = 'Swap to low-intensity recovery: mobility + easy cardio.' }
  return { score, band, guidance }
}

function Bullets({ items }) {
  return <ul className="list-disc ml-5 space-y-1 text-sm">{items.map((t,i)=><li key={i}>{t}</li>)}</ul>
}

function buildClinicalPlan(conditionId, readiness) {
  const base = {
    headline: 'Personalized clinical plan',
    summary: 'Criteria-based phases with clear targets. Some discomfort (≤4–5/10) is OK if it settles within 24h.',
    readiness,
    phases: [],
  }
  const greenCue = "You're clear to follow the plan as written today."
  const yellowCue = 'We\'ll shave a bit of volume but keep the intent of the session.'
  const redCue = 'Today we pivot to recovery to protect long‑term progress.'
  const readinessLine = readiness.band === 'Green' ? greenCue : readiness.band === 'Yellow' ? yellowCue : redCue
  switch (conditionId) {
    case 'pf':
      base.headline = 'Plantar Fasciitis • Strength-first approach'
      base.phases = [
        { title: 'Phase 1A — Calm pain', bullets: ['Isometric calf/plantar holds: 30–45s × 3–5, pain ≤4–5/10.', 'Gentle foot mobility.', readinessLine] },
        { title: 'Phase 1B — Heavy slow work', bullets: ['Slow-tempo calf raises, progress load as tolerated.', 'Walking pain returns to baseline by next morning.'] },
        { title: 'Phase 2 — Kinetic chain', bullets: ['Unilateral hip hinge + glute strength to offload foot.'] },
        { title: 'Phase 3 — Return to impact', bullets: ['Intro plyometrics: small hops → pogo series.'] },
      ]
      base.education = { title: 'Why strength beats stretching', bullets: ['Stretching feels good short term; loading builds durable capacity.','We\'ll use both—load drives adaptation.']}
      break
    case 'las':
      base.headline = 'Ankle Sprain • Mobilize → Balance → Agility'
      base.phases = [
        { title: 'Phase 1 — Mobility & activation', bullets: ['Active ankle ABCs and pain-free ROM.', readinessLine] },
        { title: 'Phase 2 — Strength & proprioception', bullets: ['Eversion strengthening.', 'Static balance (eyes open → closed).', 'Add hip abduction strength if instability persists.']},
        { title: 'Phase 3 — Dynamic control', bullets: ['Planned agility drills → small hops → cutting.'] },
      ]
      break
    case 'hs':
      base.headline = 'Hamstring Strain • Isometrics → Eccentrics → Speed'
      base.phases = [
        { title: 'Phase 1 — Early rehab', bullets: ['Isometric hamstring loading in pain-free ranges.', 'Gentle core anti-extension + glute activation.', readinessLine] },
        { title: 'Phase 2 — Eccentric focus', bullets: ['Slow-tempo hinges (4s down).', 'Progress ROM + load as symptoms allow.'] },
        { title: 'Phase 3 — Return to sport', bullets: ['Fast hinge work.', 'Unilateral jump prep and accelerations.'] },
      ]
      break
    case 'pfps':
      base.headline = 'PFPS • Quads + Hips capacity and control'
      base.phases = [
        { title: 'Phase 1A — Reduce pain', bullets: ['Isometric quad work (e.g., wall sits, terminal quads).', readinessLine] },
        { title: 'Phase 1B — Activation', bullets: ['Hip ER and abduction work with perfect control.'] },
        { title: 'Phase 2 — Progressive loading', bullets: ['Beginner squat pattern.', 'Unilateral strength (split squat/step-down).'] },
      ]
      break
    case 'nsLBP':
      base.headline = 'Low Back Pain • Directional preference first'
      base.phases = [
        { title: 'Phase 1 — Find your relieving direction', bullets: ['If flexion-intolerant: gentle extensions + posterior chain.', 'If extension-intolerant: gentle flexion + anti-extension core.', readinessLine] },
        { title: 'Phase 2 — Global resilience', bullets: ['Carries (suitcase/farmer).', 'Add hinge or anti-extension based on tolerance.'] },
      ]
      base.education = { title: 'Hurt ≠ harm', bullets: ['We calm symptoms first, then build strength.'] }
      break
    case 'saps':
      base.headline = 'Shoulder Pain • Cuff capacity + scap control'
      base.phases = [
        { title: 'Phase 1 — Calm & activate', bullets: ['Pain-relieving isometrics.', 'Serratus anterior activation cues.', readinessLine] },
        { title: 'Phase 2 — Cuff strength', bullets: ['External rotation strength endurance in tolerable ranges.'] },
        { title: 'Phase 3 — Return overhead', bullets: ['Light vertical push pattern with pristine rhythm.'] },
      ]
      break
    case 'le':
      base.headline = 'Tennis Elbow • Specific load → Forearm strength'
      base.phases = [
        { title: 'Phase 1 — Analgesic isometrics', bullets: ['Wrist-extensor holds for pain relief.', readinessLine] },
        { title: 'Phase 2 — Isotonic forearm', bullets: ['Wrist extension strength endurance.'] },
        { title: 'Phase 3 — Functional/eccentric', bullets: ['Grip progression and twisting tasks.'] },
      ]
      break
  }
  const volumeNote = readiness.band === 'Green' ? 'Full volume' : readiness.band === 'Yellow' ? '~80–85% of usual sets' : 'Recovery only'
  base.sessionExample = {
    title: `Today’s session (${volumeNote})`,
    bullets: [
      'Warm‑up: local mobility + activation 5–8 min.',
      'Main lift or tissue-focused load (2–4 sets).',
      readiness.band === 'Red' ? 'Swap main lift for easy cardio 15–20 min + mobility flow' : 'Accessory (1–2 moves) to support weak links.',
      'Cool‑down: 2–3 mins breathing + range you want to keep.',
    ],
  }
  return base
}

function buildPerformancePlan(trackId, readiness) {
  const base = { headline: 'Performance plan', summary: 'Balanced weekly structure with autoregulation.', readiness, phases: [] }
  const r = readiness.band
  if (trackId === 'endurance') {
    base.headline = 'Endurance (Polarized 80/20)'
    base.phases = [
      { title: 'Weekly shape', bullets: ['4× Zone 2 easy sessions', '1× VO₂max session', r === 'Yellow' ? 'Trim one easy session by 20%' : r === 'Red' ? 'Convert week to recovery aerobic only' : 'Proceed as planned'] },
      { title: 'VO₂ example', bullets: ['4×4′ hard with 3′ easy between', 'Keep last reps controlled, not all‑out'] },
    ]
    base.education = { title: 'Why polarized?', bullets: ['Most work easy for mitochondrial gains; a little hard to push the ceiling.'] }
  } else if (trackId === 'general') {
    base.headline = 'General Fitness (A/B/C templates)'
    base.phases = [
      { title: 'Workout A', bullets: ['Squat • Horizontal Push • Horizontal Pull'] },
      { title: 'Workout B', bullets: ['Hinge • Vertical Push • Vertical Pull'] },
      { title: 'Workout C', bullets: ['Frontal‑plane unilateral • Loaded Carry'] },
    ]
  } else if (trackId === 'hybrid') {
    base.headline = 'Hybrid Athlete (interference management)'
    base.phases = [{ title: 'Rules', bullets: ['Do the primary goal first in a session.', 'Separate heavy lower-body and hard running by ~48h.', 'Stack similar stressors to earn fuller recovery days.'] }]
  } else if (trackId === 'longevity') {
    base.headline = 'Longevity: 4 pillars'
    base.phases = [
      { title: 'Stability/Mobility', bullets: ['1–2×/wk balance & coordination focus.'] },
      { title: 'Strength (anti‑sarcopenia)', bullets: ['2–3×/wk big patterns with progressive overload.'] },
      { title: 'Aerobic efficiency', bullets: ['2–4×/wk Zone 2, 30–75′ conversational pace.'] },
      { title: 'VO₂max touch', bullets: ['1×/wk intervals.'] },
    ]
  }
  base.sessionExample = {
    title: `Today’s session (${r === 'Green' ? 'full' : r === 'Yellow' ? '~85%' : 'recovery'})`,
    bullets: [
      'Prep: 5–8′ mobility + primer',
      r === 'Red' ? 'Easy aerobic 20–30′ + mobility' : 'Primary block (2–4 sets) at target RPE',
      r === 'Red' ? 'Optional: light core/carries' : 'Optional accessories (1–2 lifts)',
    ],
  }
  return base
}

export default function App() {
  const [triage, setTriage] = useState('A')
  const [condition, setCondition] = useState('pf')
  const [track, setTrack] = useState('endurance')
  const [notes, setNotes] = useState('')
  const [persona, setPersona] = useState('Analyst')
  const [showDisclaimer, setShowDisclaimer] = useState(true)
  const [readinessInputs, setReadinessInputs] = useState({ sleep: 4, stress: 4, energy: 4, soreness: 4 })
  const readiness = useMemo(()=> computeReadinessScore(readinessInputs), [readinessInputs])

  const plan = useMemo(()=> {
    if (triage === 'A' || triage === 'C') return buildClinicalPlan(condition, readiness)
    if (triage === 'B' || triage === 'D' || triage === 'E') {
      const t = triage === 'B' ? track : triage === 'D' ? 'general' : 'longevity'
      return buildPerformancePlan(t, readiness)
    }
    return buildClinicalPlan('pf', readiness)
  }, [triage, condition, track, readiness])

  const [library, setLibrary] = useState([])
  useEffect(()=> {
    fetch('/exercise_sample.json')
      .then(r => r.json())
      .then(setLibrary)
      .catch(()=> setLibrary([]))
  }, [])

  const recs = useMemo(()=> {
    if (!Array.isArray(library) || library.length === 0) return []
    const key = (row, k) => (row[k] || row[k.toLowerCase()] || '').toString().toLowerCase()
    let filtered = library
    if (triage === 'A' || triage === 'C') {
      filtered = library.filter(r => key(r,'Application').includes('clinical') or key(r,'PrimaryGoal').includes('rehab') or key(r,'PrimaryGoal').includes('pain'))
    } else {
      if (track === 'endurance') filtered = library.filter(r => key(r,'PrimaryGoal').includes('conditioning') or key(r,'Application').includes('conditioning'))
      else if (track === 'general') filtered = library.filter(r => key(r,'PrimaryGoal').includes('strength') or key(r,'MovementPattern'))
      else if (track === 'hybrid') filtered = library.filter(r => key(r,'PrimaryGoal').includes('strength') or key(r,'PrimaryGoal').includes('power') or key(r,'PrimaryGoal').includes('conditioning'))
      else if (track === 'longevity') filtered = library.filter(r => key(r,'PrimaryGoal').includes('mobility') or key(r,'SkillLevel').includes('beginner'))
    }
    if (filtered.length < 6) filtered = library // fallback
    return filtered.slice(0, 10)
  }, [library, triage, track])

  function downloadJSON() {
    const payload = { triage, condition, track, persona, notes, readiness, plan }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'clinical_demo_plan.json'; a.click()
    URL.revokeObjectURL(url)
  }

  const Badge = ({ children }) => <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs bg-white">{children}</span>
  const Card = ({ children, className='' }) => <div className={`rounded-2xl border bg-white ${className}`}>{children}</div>
  const CardHeader = ({ title, subtitle, icon }) => (
    <div className="p-4 border-b bg-slate-50/50 rounded-t-2xl">
      <div className="flex items-center gap-2 text-slate-800">
        {icon}{title && <h3 className="font-semibold">{title}</h3>}
      </div>
      {subtitle && <div className="text-sm text-slate-500 mt-1">{subtitle}</div>}
    </div>
  )
  const CardBody = ({ children }) => <div className="p-4">{children}</div>

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight flex items-center gap-2">
            <Sparkles className="h-7 w-7"/> Clinical Reasoning Demo
          </h1>
          <p className="text-slate-600 mt-1">Criteria‑based rehab & performance with autoregulation.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 rounded-lg border bg-white hover:bg-slate-50" onClick={()=>window.print()}><Printer className="inline h-4 w-4 mr-1"/>Print</button>
          <button className="px-3 py-2 rounded-lg border bg-slate-900 text-white hover:bg-slate-800" onClick={downloadJSON}><Download className="inline h-4 w-4 mr-1"/>Export JSON</button>
        </div>
      </div>

      {showDisclaimer && (
        <Card className="my-4 border-amber-300/50">
          <CardHeader title="Safety first" subtitle="This demo is educational and not a substitute for medical care. Seek a professional for red‑flag symptoms." icon={<ShieldCheck className="h-5 w-5"/>}/>
          <CardBody><button className="px-3 py-2 rounded-lg border" onClick={()=>setShowDisclaimer(false)}>Got it</button></CardBody>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-6 mt-4">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader title="Triage" subtitle="Pick the path that best fits right now." icon={<ClipboardList className="h-5 w-5"/>}/>
            <CardBody>
              <label className="block text-sm font-medium mb-1">Path</label>
              <select className="w-full border rounded-lg px-3 py-2" value={triage} onChange={e=>setTriage(e.target.value)}>
                {TRIAGE.map(t => <option key={t.key} value={t.key}>{t.key}. {t.label}</option>)}
              </select>
              {(triage === 'A' || triage === 'C') && (
                <div className="mt-3">
                  <label className="block text-sm font-medium mb-1">Condition</label>
                  <select className="w-full border rounded-lg px-3 py-2" value={condition} onChange={e=>setCondition(e.target.value)}>
                    {CONDITIONS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              )}
              {triage === 'B' && (
                <div className="mt-3">
                  <label className="block text-sm font-medium mb-1">Performance focus</label>
                  <select className="w-full border rounded-lg px-3 py-2" value={track} onChange={e=>setTrack(e.target.value)}>
                    {PERFORMANCE_TRACKS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              )}
              <div className="mt-3">
                <label className="block text-sm font-medium mb-1">Coaching persona</label>
                <select className="w-full border rounded-lg px-3 py-2" value={persona} onChange={e=>setPersona(e.target.value)}>
                  {['Nurturer','Analyst','Motivator','Pragmatist'].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="mt-3">
                <label className="block text-sm font-medium mb-1">Notes / context</label>
                <textarea className="w-full border rounded-lg px-3 py-2" rows="4" value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Key details (e.g., recent surgery, equipment, schedule)"/>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Readiness check‑in" subtitle="Quick 1–5 ratings (5 = great)." icon={<Activity className="h-5 w-5"/>}/>
            <CardBody>
              {[
                { key: 'sleep', label: 'Sleep quality (last night)' },
                { key: 'stress', label: 'Life stress (now) — 5 means low stress' },
                { key: 'energy', label: 'Energy level (today)' },
                { key: 'soreness', label: 'Muscle soreness — 5 means not sore' },
              ].map(f => (
                <div className="mb-3" key={f.key}>
                  <label className="block text-sm font-medium mb-1">{f.label}</label>
                  <input type="number" min="1" max="5" className="w-24 border rounded-lg px-3 py-2" value={readinessInputs[f.key]} onChange={e=> setReadinessInputs(s => ({...s, [f.key]: Number(e.target.value)}))}/>
                  <div className="h-2 bg-slate-200 rounded mt-1"><div className="h-2 bg-slate-900 rounded" style={{width: `${((clamp(readinessInputs[f.key])-1)/4)*100}%`}}/></div>
                </div>
              ))}
              <div className="rounded-xl bg-slate-100 p-3 text-sm flex items-center justify-between">
                <div>
                  <div className="font-medium">Readiness score: {readiness.score}</div>
                  <div className="text-slate-600">Band: {readiness.band} — {readiness.guidance}</div>
                </div>
                <Badge>{readiness.band}</Badge>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader title="Generated plan" subtitle="Built from first principles with criteria‑based phases." icon={<Brain className="h-5 w-5"/>}/>
            <CardBody>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge>Path: {TRIAGE.find(t=>t.key===triage)?.label}</Badge>
                {(triage === 'A' || triage === 'C') && <Badge>Condition: {CONDITIONS.find(c=>c.id===condition)?.name}</Badge>}
                {triage === 'B' && <Badge>Track: {PERFORMANCE_TRACKS.find(p=>p.id===track)?.name}</Badge>}
                <Badge>Persona: {persona}</Badge>
              </div>
              <div className="rounded-2xl border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-semibold">{plan.headline}</h3>
                </div>
                <p className="text-slate-600 mb-3">{plan.summary}</p>
                <div className="grid md:grid-cols-2 gap-4">
                  {plan.phases.map((p, idx) => (
                    <div key={idx} className="rounded-xl p-3 border">
                      <div className="font-semibold mb-1">{p.title}</div>
                      <Bullets items={p.bullets}/>
                    </div>
                  ))}
                </div>
              </div>
              {plan.sessionExample && (
                <div className="rounded-2xl border p-4 mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <HeartPulse className="h-5 w-5"/><h3 className="text-lg font-semibold">{plan.sessionExample.title}</h3>
                  </div>
                  <Bullets items={plan.sessionExample.bullets}/>
                </div>
              )}
              {plan.education && (
                <div className="rounded-2xl border p-4 mt-4">
                  <div className="font-semibold mb-2">{plan.education.title}</div>
                  <Bullets items={plan.education.bullets}/>
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Suggested exercises (auto from library)" subtitle="Top matches for today’s path; swap as you like."/>
            <CardBody>
              {recs.length === 0 ? (
                <div className="text-sm text-slate-600">Library not loaded yet.</div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {recs.map((r, i) => (
                    <div key={i} className="rounded-xl border p-3 bg-white">
                      <div className="font-medium">{r.ExerciseName || r.name}</div>
                      <div className="text-xs text-slate-600 mt-1">
                        {(r.MovementPattern || r.Pattern || '')} {(r.PrimaryGoal ? '• '+r.PrimaryGoal : '')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          <div className="flex items-center justify-between bg-slate-100 rounded-xl p-3 text-sm">
            <div>Autoregulation: <span className="font-medium">{readiness.band}</span> day — {readiness.guidance}</div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 rounded-lg border" onClick={downloadJSON}><Download className="inline h-4 w-4 mr-1"/>Export Plan</button>
              <button className="px-3 py-2 rounded-lg border" onClick={()=>window.print()}><Printer className="inline h-4 w-4 mr-1"/>Print</button>
            </div>
          </div>

          <div className="text-xs text-slate-500">© {new Date().getFullYear()} Clinical Reasoning Demo. Educational use only.</div>
        </div>
      </div>
    </div>
  )
}
