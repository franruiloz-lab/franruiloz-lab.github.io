import { useState } from 'react';
type Material = 'asphalt_3tab' | 'asphalt_arch' | 'metal' | 'tile' | 'slate' | 'wood_shake';
const MATERIALS: Record<Material, { label: string; costLow: number; costHigh: number; lifespan: string }> = {
  asphalt_3tab: { label: 'Asphalt 3-Tab',       costLow: 90,  costHigh: 130, lifespan: '15–25 yrs' },
  asphalt_arch: { label: 'Architectural Shingle', costLow: 120, costHigh: 180, lifespan: '25–30 yrs' },
  metal:        { label: 'Metal Roofing',         costLow: 250, costHigh: 450, lifespan: '40–70 yrs' },
  tile:         { label: 'Concrete/Clay Tile',    costLow: 350, costHigh: 600, lifespan: '50+ yrs' },
  slate:        { label: 'Natural Slate',         costLow: 600, costHigh: 1500, lifespan: '75–150 yrs' },
  wood_shake:   { label: 'Wood Shake',            costLow: 350, costHigh: 550, lifespan: '25–30 yrs' },
};
const PITCH_FACTOR: Record<string, number> = {
  '2/12': 1.02, '3/12': 1.03, '4/12': 1.05, '5/12': 1.08,
  '6/12': 1.12, '7/12': 1.16, '8/12': 1.20, '9/12': 1.25,
  '10/12': 1.30, '12/12': 1.41,
};
export default function RoofingCalc() {
  const [footprint, setFootprint] = useState('');
  const [pitch, setPitch] = useState('6/12');
  const [material, setMaterial] = useState<Material>('asphalt_arch');
  const [result, setResult] = useState<any>(null);
  const calculate = () => {
    const fp = parseFloat(footprint) || 0;
    if (fp <= 0) { setResult(null); return; }
    const factor = PITCH_FACTOR[pitch] || 1.12;
    const roofArea = fp * factor;
    const squares = roofArea / 100; // 1 roofing square = 100 sq ft
    const mat = MATERIALS[material];
    setResult({
      roofArea: Math.round(roofArea),
      squares: squares.toFixed(2),
      squaresWithWaste: (squares * 1.15).toFixed(2),
      costLow:  Math.round(squares * mat.costLow),
      costHigh: Math.round(squares * mat.costHigh),
    });
  };
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4">
        <div className="flex items-center gap-2"><span className="text-2xl">🏚️</span><h2 className="text-white font-bold text-lg">Roofing Calculator</h2></div>
      </div>
      <div className="p-6 space-y-4">
        <div><label className="calc-label">House Footprint / Floor Plan Area (sq ft)</label>
          <input type="number" className="calc-input" placeholder="e.g. 1500" value={footprint} min="0" onChange={e=>setFootprint(e.target.value)}/>
          <p className="text-xs text-slate-400 mt-1">Measure the outer dimensions of the house from the ground</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="calc-label">Roof Pitch</label>
            <select value={pitch} onChange={e=>setPitch(e.target.value)} className="calc-select">
              {Object.keys(PITCH_FACTOR).map(p => <option key={p} value={p}>{p} pitch</option>)}
            </select>
          </div>
          <div><label className="calc-label">Roofing Material</label>
            <select value={material} onChange={e=>setMaterial(e.target.value as Material)} className="calc-select">
              {(Object.entries(MATERIALS) as [Material, typeof MATERIALS[Material]][]).map(([id, m]) => <option key={id} value={id}>{m.label}</option>)}
            </select>
          </div>
        </div>
        <button onClick={calculate} className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-colors">Calculate Roofing</button>
        {result && (
          <div className="result-card space-y-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Results — {MATERIALS[material].label}</p>
            <div className="grid grid-cols-2 gap-4">
              <div><div className="result-value">{result.roofArea.toLocaleString()}</div><div className="result-unit">Sq Ft of Roof</div></div>
              <div><div className="result-value">{result.squares}</div><div className="result-unit">Roofing Squares</div></div>
              <div><div className="result-value">{result.squaresWithWaste}</div><div className="result-unit">Squares (+15% waste)</div></div>
              <div><div className="result-value">{MATERIALS[material].lifespan}</div><div className="result-unit">Expected Lifespan</div></div>
            </div>
            <div className="border-t border-navy-700 pt-4 flex items-center justify-between">
              <span className="text-slate-400 text-sm">Installed Cost Estimate</span>
              <span className="text-brand-400 font-bold text-lg">${result.costLow.toLocaleString()} – ${result.costHigh.toLocaleString()}</span>
            </div>
            <p className="text-slate-500 text-xs">💡 Cost per square includes materials and labor. Steep pitches add 20–30%.</p>
          </div>
        )}
      </div>
    </div>
  );
}
