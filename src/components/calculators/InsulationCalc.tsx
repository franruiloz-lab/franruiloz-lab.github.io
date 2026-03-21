import { useState } from 'react';

type Application = 'attic' | 'wall' | 'crawl' | 'basement';
type InsulationType = 'batts_r13' | 'batts_r19' | 'batts_r30' | 'blown_r38' | 'spray_open' | 'spray_closed';
type ClimateZone = '1-2' | '3-4' | '5-6' | '7-8';

const INSULATION_TYPES: Record<InsulationType, {
  label: string;
  rValue: number;
  rPerInch?: number;
  unitLabel: string;
  costLow: number;
  costHigh: number;
  type: 'batts' | 'blown' | 'spray';
  coverageSqFt: number; // sq ft per roll/bag at stated R-value
}> = {
  batts_r13:    { label: 'Fiberglass Batts R-13',         rValue: 13,  unitLabel: 'Rolls',  costLow: 0.30, costHigh: 0.65, type: 'batts',  coverageSqFt: 40 },
  batts_r19:    { label: 'Fiberglass Batts R-19',         rValue: 19,  unitLabel: 'Rolls',  costLow: 0.30, costHigh: 0.65, type: 'batts',  coverageSqFt: 32 },
  batts_r30:    { label: 'Fiberglass Batts R-30',         rValue: 30,  unitLabel: 'Rolls',  costLow: 0.30, costHigh: 0.65, type: 'batts',  coverageSqFt: 24 },
  blown_r38:    { label: 'Blown Fiberglass R-38',         rValue: 38,  unitLabel: 'Bags',   costLow: 0.50, costHigh: 1.00, type: 'blown',  coverageSqFt: 1000 / 21 }, // ~47.6 sq ft per bag
  spray_open:   { label: 'Spray Foam Open-Cell R-3.7/in', rValue: 3.7, rPerInch: 3.7, unitLabel: 'Board-ft', costLow: 0.44, costHigh: 0.65, type: 'spray', coverageSqFt: 0 },
  spray_closed: { label: 'Spray Foam Closed-Cell R-6.5/in', rValue: 6.5, rPerInch: 6.5, unitLabel: 'Board-ft', costLow: 1.00, costHigh: 2.00, type: 'spray', coverageSqFt: 0 },
};

// Minimum recommended R-values by application and climate zone
const MIN_R: Record<Application, Record<ClimateZone, number>> = {
  attic:    { '1-2': 30, '3-4': 38, '5-6': 49, '7-8': 60 },
  wall:     { '1-2': 13, '3-4': 13, '5-6': 15, '7-8': 21 },
  crawl:    { '1-2': 13, '3-4': 19, '5-6': 25, '7-8': 25 },
  basement: { '1-2': 10, '3-4': 10, '5-6': 15, '7-8': 20 },
};

const APPLICATION_LABELS: Record<Application, string> = {
  attic:    'Attic Floor',
  wall:     'Wall Cavity',
  crawl:    'Crawl Space',
  basement: 'Basement Wall',
};

const CLIMATE_LABELS: Record<ClimateZone, string> = {
  '1-2': 'Zone 1–2 (Warm: FL, HI, Southern TX)',
  '3-4': 'Zone 3–4 (Mixed: VA, TN, NM)',
  '5-6': 'Zone 5–6 (Cold: IL, CO, PA)',
  '7-8': 'Zone 7–8 (Very Cold: MN, MT, AK)',
};

export default function InsulationCalc() {
  const [area, setArea] = useState('');
  const [application, setApplication] = useState<Application>('attic');
  const [insulationType, setInsulationType] = useState<InsulationType>('batts_r30');
  const [climateZone, setClimateZone] = useState<ClimateZone>('3-4');
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const sqFt = parseFloat(area) || 0;
    if (sqFt <= 0) { setResult(null); return; }

    const ins = INSULATION_TYPES[insulationType];
    const minR = MIN_R[application][climateZone];
    const meetsCode = ins.rValue >= minR;

    let unitsNeeded = 0;
    let unitLabel = ins.unitLabel;
    let costLow = 0, costHigh = 0;
    let rAchieved = ins.rValue;
    let inchesNeeded = 0;

    if (ins.type === 'batts') {
      const rawUnits = sqFt / ins.coverageSqFt;
      unitsNeeded = Math.ceil(rawUnits * 1.10); // +10% waste
      costLow = Math.round(sqFt * ins.costLow);
      costHigh = Math.round(sqFt * ins.costHigh);
    } else if (ins.type === 'blown') {
      // bags per 1000 sqft = 21 bags; so bags = sqFt/1000 * 21
      const rawBags = (sqFt / 1000) * 21;
      unitsNeeded = Math.ceil(rawBags * 1.10);
      costLow = Math.round(sqFt * ins.costLow);
      costHigh = Math.round(sqFt * ins.costHigh);
    } else {
      // spray foam: calculate inches needed to meet minR, then board-feet
      inchesNeeded = Math.ceil(minR / ins.rPerInch!);
      rAchieved = inchesNeeded * ins.rPerInch!;
      const boardFeet = sqFt * inchesNeeded; // 1 board-ft = 1 sq ft × 1 inch
      unitsNeeded = Math.ceil(boardFeet * 1.05);
      costLow = Math.round(sqFt * inchesNeeded * ins.costLow);
      costHigh = Math.round(sqFt * inchesNeeded * ins.costHigh);
    }

    setResult({
      sqFt: Math.round(sqFt),
      unitsNeeded,
      unitLabel,
      rAchieved: ins.type === 'spray' ? rAchieved.toFixed(1) : ins.rValue,
      meetsCode,
      minR,
      inchesNeeded: ins.type === 'spray' ? inchesNeeded : null,
      costLow,
      costHigh,
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏠</span>
          <h2 className="text-white font-bold text-lg">Insulation Calculator</h2>
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <label className="calc-label">Area to Insulate (sq ft)</label>
          <input
            type="number"
            className="calc-input"
            placeholder="e.g. 1200"
            value={area}
            min="0"
            onChange={e => setArea(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="calc-label">Application</label>
            <select value={application} onChange={e => setApplication(e.target.value as Application)} className="calc-select">
              {(Object.entries(APPLICATION_LABELS) as [Application, string][]).map(([id, label]) => (
                <option key={id} value={id}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="calc-label">Climate Zone</label>
            <select value={climateZone} onChange={e => setClimateZone(e.target.value as ClimateZone)} className="calc-select">
              {(Object.entries(CLIMATE_LABELS) as [ClimateZone, string][]).map(([id, label]) => (
                <option key={id} value={id}>{label}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="calc-label">Insulation Type</label>
          <select value={insulationType} onChange={e => setInsulationType(e.target.value as InsulationType)} className="calc-select">
            {(Object.entries(INSULATION_TYPES) as [InsulationType, typeof INSULATION_TYPES[InsulationType]][]).map(([id, ins]) => (
              <option key={id} value={id}>{ins.label}</option>
            ))}
          </select>
        </div>
        <button onClick={calculate} className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-colors">
          Calculate Insulation
        </button>
        {result && (
          <div className="result-card space-y-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Results</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="result-value">{result.sqFt.toLocaleString()}</div>
                <div className="result-unit">Sq Ft Coverage</div>
              </div>
              <div>
                <div className="result-value">{result.unitsNeeded}</div>
                <div className="result-unit">{result.unitLabel} Needed</div>
              </div>
              <div>
                <div className="result-value">R-{result.rAchieved}</div>
                <div className="result-unit">R-Value Achieved</div>
              </div>
              {result.inchesNeeded && (
                <div>
                  <div className="result-value">{result.inchesNeeded}"</div>
                  <div className="result-unit">Inches Required</div>
                </div>
              )}
            </div>
            <div className={`rounded-lg px-4 py-3 text-sm font-semibold flex items-center gap-2 ${result.meetsCode ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'}`}>
              <span>{result.meetsCode ? '✓' : '⚠'}</span>
              <span>
                {result.meetsCode
                  ? `Meets Zone ${climateZone} code (min R-${result.minR})`
                  : `Below Zone ${climateZone} code — minimum R-${result.minR} required`}
              </span>
            </div>
            <div className="border-t border-navy-700 pt-4 flex items-center justify-between">
              <span className="text-slate-400 text-sm">Material Cost Estimate</span>
              <span className="text-brand-400 font-bold text-lg">${result.costLow.toLocaleString()} – ${result.costHigh.toLocaleString()}</span>
            </div>
            <p className="text-slate-500 text-xs">💡 Includes 10% waste factor. Professional installation adds $0.50–2.00/sq ft.</p>
          </div>
        )}
      </div>
    </div>
  );
}
