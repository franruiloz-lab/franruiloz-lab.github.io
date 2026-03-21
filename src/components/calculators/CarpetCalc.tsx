import { useState } from 'react';
type CarpetStyle = 'plush' | 'berber' | 'frieze' | 'commercial';
type Shape = 'rectangle' | 'lshape';
const STYLES: Record<CarpetStyle, { label: string; costLow: number; costHigh: number }> = {
  plush:      { label: 'Plush',      costLow: 3, costHigh: 6 },
  berber:     { label: 'Berber',     costLow: 2, costHigh: 5 },
  frieze:     { label: 'Frieze',     costLow: 4, costHigh: 8 },
  commercial: { label: 'Commercial', costLow: 1, costHigh: 3 },
};
export default function CarpetCalc() {
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [shape, setShape] = useState<Shape>('rectangle');
  const [length2, setLength2] = useState('');
  const [width2, setWidth2] = useState('');
  const [carpetStyle, setCarpetStyle] = useState<CarpetStyle>('plush');
  const [includePadding, setIncludePadding] = useState(true);
  const [result, setResult] = useState<any>(null);
  const calculate = () => {
    const l = parseFloat(length) || 0;
    const w = parseFloat(width) || 0;
    if (l <= 0 || w <= 0) { setResult(null); return; }
    let areaSqFt = l * w;
    if (shape === 'lshape') {
      const l2 = parseFloat(length2) || 0;
      const w2 = parseFloat(width2) || 0;
      areaSqFt += l2 * w2;
    }
    const areaWithWaste = areaSqFt * 1.10;
    const areaSqYards = areaWithWaste / 9;
    const s = STYLES[carpetStyle];
    const carpetCostLow = Math.round(areaWithWaste * s.costLow);
    const carpetCostHigh = Math.round(areaWithWaste * s.costHigh);
    const paddingCostLow = includePadding ? Math.round(areaWithWaste * 0.50) : 0;
    const paddingCostHigh = includePadding ? Math.round(areaWithWaste * 1.50) : 0;
    const totalLow = carpetCostLow + paddingCostLow;
    const totalHigh = carpetCostHigh + paddingCostHigh;
    setResult({
      areaSqFt: Math.round(areaSqFt),
      areaWithWaste: Math.round(areaWithWaste),
      areaSqYards: parseFloat(areaSqYards.toFixed(1)),
      carpetCostLow, carpetCostHigh, paddingCostLow, paddingCostHigh, totalLow, totalHigh,
    });
  };
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4">
        <div className="flex items-center gap-2"><span className="text-2xl">🏠</span><h2 className="text-white font-bold text-lg">Carpet Calculator</h2></div>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <label className="calc-label">Room Shape</label>
          <div className="grid grid-cols-2 gap-2">
            {(['rectangle','lshape'] as Shape[]).map(s => (
              <button key={s} onClick={() => setShape(s)} className={`py-2.5 px-3 rounded-xl border-2 text-sm font-semibold transition-all ${shape === s ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                {s === 'rectangle' ? 'Rectangle' : 'L-Shape'}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="calc-label">{shape === 'lshape' ? 'Section 1 — ' : ''}Length × Width (ft)</label>
          <div className="grid grid-cols-2 gap-3">
            <input type="number" className="calc-input" placeholder="Length" value={length} min="0" onChange={e => setLength(e.target.value)} />
            <input type="number" className="calc-input" placeholder="Width" value={width} min="0" onChange={e => setWidth(e.target.value)} />
          </div>
        </div>
        {shape === 'lshape' && (
          <div>
            <label className="calc-label">Section 2 — Length × Width (ft)</label>
            <div className="grid grid-cols-2 gap-3">
              <input type="number" className="calc-input" placeholder="Length" value={length2} min="0" onChange={e => setLength2(e.target.value)} />
              <input type="number" className="calc-input" placeholder="Width" value={width2} min="0" onChange={e => setWidth2(e.target.value)} />
            </div>
          </div>
        )}
        <div>
          <label className="calc-label">Carpet Style</label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.entries(STYLES) as [CarpetStyle, typeof STYLES[CarpetStyle]][]).map(([id, s]) => (
              <button key={id} onClick={() => setCarpetStyle(id)} className={`py-2.5 px-3 rounded-xl border-2 text-sm font-semibold transition-all ${carpetStyle === id ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="calc-label">Include Carpet Padding?</label>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setIncludePadding(true)} className={`py-2.5 px-3 rounded-xl border-2 text-sm font-semibold transition-all ${includePadding ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
              Yes, include padding
            </button>
            <button onClick={() => setIncludePadding(false)} className={`py-2.5 px-3 rounded-xl border-2 text-sm font-semibold transition-all ${!includePadding ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
              No padding
            </button>
          </div>
        </div>
        <button onClick={calculate} className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-colors">Calculate Carpet</button>
        {result && (
          <div className="result-card space-y-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Results — {STYLES[carpetStyle].label}</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-navy-700 rounded-lg p-3 text-center">
                <div className="text-brand-400 font-bold text-2xl">{result.areaSqFt}</div>
                <div className="text-slate-400 text-xs mt-0.5">Base Sq Ft</div>
              </div>
              <div className="bg-navy-700 rounded-lg p-3 text-center">
                <div className="text-brand-400 font-bold text-2xl">{result.areaWithWaste}</div>
                <div className="text-slate-400 text-xs mt-0.5">Sq Ft +10% Waste</div>
              </div>
              <div className="bg-navy-700 rounded-lg p-3 text-center">
                <div className="text-brand-400 font-bold text-2xl">{result.areaSqYards}</div>
                <div className="text-slate-400 text-xs mt-0.5">Square Yards</div>
              </div>
            </div>
            <div className="border-t border-navy-700 pt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Carpet Cost</span>
                <span className="text-slate-300 font-semibold">${result.carpetCostLow.toLocaleString()} – ${result.carpetCostHigh.toLocaleString()}</span>
              </div>
              {includePadding && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Padding Cost</span>
                  <span className="text-slate-300 font-semibold">${result.paddingCostLow.toLocaleString()} – ${result.paddingCostHigh.toLocaleString()}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Total Estimate (materials)</span>
                <span className="text-brand-400 font-bold text-lg">${result.totalLow.toLocaleString()} – ${result.totalHigh.toLocaleString()}</span>
              </div>
            </div>
            <p className="text-slate-500 text-xs">💡 Add $1–3/sq ft for professional installation. Carpet rolls are 12 ft wide standard.</p>
          </div>
        )}
      </div>
    </div>
  );
}
