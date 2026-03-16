import { useState } from 'react';
type PaverType = 'concrete' | 'brick' | 'natural_stone' | 'travertine' | 'permeable';
type PaverSize = '4x8' | '6x6' | '6x9' | '12x12';
const TYPES: Record<PaverType, { label: string; costLow: number; costHigh: number }> = {
  concrete:     { label: 'Concrete Paver',   costLow: 3,  costHigh: 6  },
  brick:        { label: 'Brick Paver',      costLow: 4,  costHigh: 8  },
  natural_stone:{ label: 'Natural Stone',    costLow: 8,  costHigh: 20 },
  travertine:   { label: 'Travertine',       costLow: 10, costHigh: 25 },
  permeable:    { label: 'Permeable Paver',  costLow: 5,  costHigh: 10 },
};
const SIZES: Record<PaverSize, { label: string; sqFt: number }> = {
  '4x8':   { label: '4"×8"',   sqFt: 4*8/144 },
  '6x6':   { label: '6"×6"',   sqFt: 6*6/144 },
  '6x9':   { label: '6"×9"',   sqFt: 6*9/144 },
  '12x12': { label: '12"×12"', sqFt: 12*12/144 },
};
export default function PaverCalc() {
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [paverType, setPaverType] = useState<PaverType>('concrete');
  const [paverSize, setPaverSize] = useState<PaverSize>('4x8');
  const [result, setResult] = useState<any>(null);
  const calculate = () => {
    const l = parseFloat(length)||0, w = parseFloat(width)||0;
    if (l<=0||w<=0) { setResult(null); return; }
    const sqFt = l*w;
    const sqFtWaste = sqFt*1.1;
    const s = SIZES[paverSize];
    const paversNeeded = Math.ceil(sqFtWaste/s.sqFt);
    const t = TYPES[paverType];
    // Sand base: 1 inch deep = sqFt/27/12 * ... simplified: ~0.03 tons per sqft
    const sandTons = (sqFt*0.03).toFixed(1);
    setResult({
      sqFt: Math.round(sqFt),
      sqFtWaste: Math.round(sqFtWaste),
      paversNeeded,
      sandTons,
      costLow: Math.round(sqFt*t.costLow),
      costHigh: Math.round(sqFt*t.costHigh),
    });
  };
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4">
        <div className="flex items-center gap-2"><span className="text-2xl">🔲</span><h2 className="text-white font-bold text-lg">Paver Calculator</h2></div>
      </div>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="calc-label">Area Length (ft)</label><input type="number" className="calc-input" placeholder="0" value={length} min="0" onChange={e=>setLength(e.target.value)}/></div>
          <div><label className="calc-label">Area Width (ft)</label><input type="number" className="calc-input" placeholder="0" value={width} min="0" onChange={e=>setWidth(e.target.value)}/></div>
        </div>
        <div>
          <label className="calc-label">Paver Type</label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.entries(TYPES) as [PaverType, typeof TYPES[PaverType]][]).map(([id, t])=>(
              <button key={id} onClick={()=>setPaverType(id)} className={`py-2 px-2 rounded-xl border-2 text-xs font-semibold transition-all text-center ${paverType===id?'border-brand-500 bg-brand-50 text-brand-700':'border-slate-200 text-slate-500 hover:border-slate-300'}`}>{t.label}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="calc-label">Paver Size</label>
          <div className="grid grid-cols-4 gap-2">
            {(Object.entries(SIZES) as [PaverSize, typeof SIZES[PaverSize]][]).map(([id, s])=>(
              <button key={id} onClick={()=>setPaverSize(id)} className={`py-2.5 rounded-xl border-2 text-xs font-bold transition-all text-center ${paverSize===id?'border-brand-500 bg-brand-50 text-brand-700':'border-slate-200 text-slate-500 hover:border-slate-300'}`}>{s.label}</button>
            ))}
          </div>
        </div>
        <button onClick={calculate} className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-colors">Calculate Pavers</button>
        {result && (
          <div className="result-card space-y-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Results — {TYPES[paverType].label} ({SIZES[paverSize].label})</p>
            <div className="grid grid-cols-2 gap-4">
              <div><div className="result-value">{result.paversNeeded.toLocaleString()}</div><div className="result-unit">Pavers Needed</div></div>
              <div><div className="result-value">{result.sqFtWaste.toLocaleString()}</div><div className="result-unit">Sq Ft (w/ 10% waste)</div></div>
              <div><div className="result-value">{result.sandTons}</div><div className="result-unit">Sand Tons (1" base)</div></div>
            </div>
            <div className="border-t border-navy-700 pt-4 flex items-center justify-between">
              <span className="text-slate-400 text-sm">Material Cost Estimate</span>
              <span className="text-brand-400 font-bold text-lg">${result.costLow.toLocaleString()} – ${result.costHigh.toLocaleString()}</span>
            </div>
            <p className="text-slate-500 text-xs">💡 Also budget for gravel base (4"–6" deep), edging restraints, and polymeric sand for joints.</p>
          </div>
        )}
      </div>
    </div>
  );
}
