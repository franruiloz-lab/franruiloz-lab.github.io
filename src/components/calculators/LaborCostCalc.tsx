import { useState } from 'react';

type ProjectType =
  | 'concrete' | 'framing' | 'roofing' | 'drywall' | 'flooring'
  | 'painting' | 'tile' | 'electrical' | 'plumbing' | 'landscaping';

type Region = 'rural' | 'suburban' | 'urban' | 'major_city';
type SkillLevel = 'general' | 'journeyman' | 'master';

const PROJECTS: Record<ProjectType, {
  label: string;
  unit: string;
  rateLow: number;
  rateHigh: number;
  hoursPerUnit: number; // labor hours per sq ft
}> = {
  concrete:    { label: 'Concrete Pouring',      unit: 'sq ft', rateLow: 1.50, rateHigh: 3.00, hoursPerUnit: 0.05 },
  framing:     { label: 'Framing',               unit: 'sq ft', rateLow: 1.00, rateHigh: 2.00, hoursPerUnit: 0.04 },
  roofing:     { label: 'Roofing',               unit: 'sq ft', rateLow: 1.50, rateHigh: 3.00, hoursPerUnit: 0.05 },
  drywall:     { label: 'Drywall',               unit: 'sq ft', rateLow: 1.00, rateHigh: 2.00, hoursPerUnit: 0.035 },
  flooring:    { label: 'Flooring',              unit: 'sq ft', rateLow: 2.00, rateHigh: 5.00, hoursPerUnit: 0.06 },
  painting:    { label: 'Painting',              unit: 'sq ft', rateLow: 0.50, rateHigh: 1.50, hoursPerUnit: 0.02 },
  tile:        { label: 'Tile Work',             unit: 'sq ft', rateLow: 4.00, rateHigh: 8.00, hoursPerUnit: 0.12 },
  electrical:  { label: 'Electrical Rough-In',   unit: 'sq ft', rateLow: 2.00, rateHigh: 4.00, hoursPerUnit: 0.07 },
  plumbing:    { label: 'Plumbing Rough-In',     unit: 'sq ft', rateLow: 2.00, rateHigh: 5.00, hoursPerUnit: 0.08 },
  landscaping: { label: 'Landscaping',           unit: 'sq ft', rateLow: 0.50, rateHigh: 2.00, hoursPerUnit: 0.03 },
};

const REGION_MODIFIERS: Record<Region, { label: string; modifier: number }> = {
  rural:       { label: 'Rural (-20%)',       modifier: 0.80 },
  suburban:    { label: 'Suburban (baseline)', modifier: 1.00 },
  urban:       { label: 'Urban (+25%)',        modifier: 1.25 },
  major_city:  { label: 'Major City (+50%)',   modifier: 1.50 },
};

const SKILL_MODIFIERS: Record<SkillLevel, { label: string; modifier: number }> = {
  general:    { label: 'General Labor',      modifier: 0.80 },
  journeyman: { label: 'Journeyman',         modifier: 1.00 },
  master:     { label: 'Master / Licensed',  modifier: 1.35 },
};

export default function LaborCostCalc() {
  const [projectType, setProjectType] = useState<ProjectType>('framing');
  const [quantity, setQuantity] = useState('');
  const [region, setRegion] = useState<Region>('suburban');
  const [skillLevel, setSkillLevel] = useState<SkillLevel>('journeyman');
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const qty = parseFloat(quantity) || 0;
    if (qty <= 0) { setResult(null); return; }

    const proj = PROJECTS[projectType];
    const regionMod = REGION_MODIFIERS[region].modifier;
    const skillMod = SKILL_MODIFIERS[skillLevel].modifier;

    const adjustedRateLow  = proj.rateLow  * regionMod * skillMod;
    const adjustedRateHigh = proj.rateHigh * regionMod * skillMod;

    const laborCostLow  = Math.round(qty * adjustedRateLow);
    const laborCostHigh = Math.round(qty * adjustedRateHigh);

    const estimatedHours = Math.round(qty * proj.hoursPerUnit * skillMod);
    // Rough material estimates as % of labor (varies by trade)
    const materialMultiplier = 1.4; // materials typically 40–60% on top of labor
    const totalLow  = Math.round(laborCostLow  * materialMultiplier);
    const totalHigh = Math.round(laborCostHigh * materialMultiplier);

    setResult({
      qty: Math.round(qty),
      unit: proj.unit,
      laborCostLow,
      laborCostHigh,
      estimatedHours,
      totalLow,
      totalHigh,
      adjustedRateLow: adjustedRateLow.toFixed(2),
      adjustedRateHigh: adjustedRateHigh.toFixed(2),
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💰</span>
          <h2 className="text-white font-bold text-lg">Labor Cost Calculator</h2>
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <label className="calc-label">Project Type</label>
          <select value={projectType} onChange={e => setProjectType(e.target.value as ProjectType)} className="calc-select">
            {(Object.entries(PROJECTS) as [ProjectType, typeof PROJECTS[ProjectType]][]).map(([id, p]) => (
              <option key={id} value={id}>{p.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="calc-label">Area / Quantity ({PROJECTS[projectType].unit})</label>
          <input
            type="number"
            className="calc-input"
            placeholder={`e.g. ${projectType === 'roofing' ? '2000' : '1500'}`}
            value={quantity}
            min="0"
            onChange={e => setQuantity(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="calc-label">Region</label>
            <select value={region} onChange={e => setRegion(e.target.value as Region)} className="calc-select">
              {(Object.entries(REGION_MODIFIERS) as [Region, typeof REGION_MODIFIERS[Region]][]).map(([id, r]) => (
                <option key={id} value={id}>{r.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="calc-label">Skill Level</label>
            <select value={skillLevel} onChange={e => setSkillLevel(e.target.value as SkillLevel)} className="calc-select">
              {(Object.entries(SKILL_MODIFIERS) as [SkillLevel, typeof SKILL_MODIFIERS[SkillLevel]][]).map(([id, s]) => (
                <option key={id} value={id}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>
        <button onClick={calculate} className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-colors">
          Estimate Labor Cost
        </button>
        {result && (
          <div className="result-card space-y-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
              Results — {PROJECTS[projectType].label}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="result-value">{result.qty.toLocaleString()}</div>
                <div className="result-unit">{result.unit}</div>
              </div>
              <div>
                <div className="result-value">{result.estimatedHours}</div>
                <div className="result-unit">Est. Labor Hours</div>
              </div>
              <div>
                <div className="result-value">${result.adjustedRateLow}–${result.adjustedRateHigh}</div>
                <div className="result-unit">Adjusted Rate / {result.unit}</div>
              </div>
            </div>
            <div className="space-y-2 border-t border-navy-700 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Labor Only</span>
                <span className="text-brand-400 font-bold text-lg">${result.laborCostLow.toLocaleString()} – ${result.laborCostHigh.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Total w/ Materials (est.)</span>
                <span className="text-white font-semibold">${result.totalLow.toLocaleString()} – ${result.totalHigh.toLocaleString()}</span>
              </div>
            </div>
            <p className="text-slate-500 text-xs">💡 Materials are estimated at ~40% above labor. Get a formal quote for accurate material costs.</p>
          </div>
        )}
      </div>
    </div>
  );
}
