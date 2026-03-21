import { useState } from 'react';
type Species = 'spf' | 'syp' | 'cedar' | 'redwood' | 'pt';
const SPECIES: Record<Species, { label: string; costPerBf: number; weightPerBf: number }> = {
  spf:     { label: 'SPF / Douglas Fir',   costPerBf: 0.50, weightPerBf: 2.5 },
  syp:     { label: 'Southern Yellow Pine', costPerBf: 0.55, weightPerBf: 2.7 },
  cedar:   { label: 'Cedar',               costPerBf: 2.50, weightPerBf: 1.8 },
  redwood: { label: 'Redwood',             costPerBf: 4.00, weightPerBf: 1.9 },
  pt:      { label: 'Pressure Treated',    costPerBf: 0.70, weightPerBf: 3.0 },
};
const WIDTHS  = [2,3,4,6,8,10,12];
const HEIGHTS = [2,3,4,6,8,10,12];
export default function LumberCalc() {
  const [widthIn, setWidthIn] = useState('2');
  const [heightIn, setHeightIn] = useState('4');
  const [lengthFt, setLengthFt] = useState('');
  const [pieces, setPieces] = useState('');
  const [species, setSpecies] = useState<Species>('spf');
  const [result, setResult] = useState<any>(null);
  const calculate = () => {
    const w = parseFloat(widthIn) || 0;
    const h = parseFloat(heightIn) || 0;
    const l = parseFloat(lengthFt) || 0;
    const p = parseFloat(pieces) || 0;
    if (l <= 0 || p <= 0) { setResult(null); return; }
    const bfPerPiece = parseFloat(((w * h * l) / 12).toFixed(2));
    const totalBf = parseFloat((bfPerPiece * p).toFixed(1));
    const totalLinearFt = l * p;
    const sp = SPECIES[species];
    const weightLbs = Math.round(totalBf * sp.weightPerBf);
    const costLow  = Math.round(totalBf * sp.costPerBf * 0.90);
    const costHigh = Math.round(totalBf * sp.costPerBf * 1.10);
    setResult({ bfPerPiece, totalBf, totalLinearFt, weightLbs, costLow, costHigh });
  };
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4">
        <div className="flex items-center gap-2"><span className="text-2xl">🪵</span><h2 className="text-white font-bold text-lg">Lumber Calculator</h2></div>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <label className="calc-label">Nominal Width (inches)</label>
          <div className="flex flex-wrap gap-2">
            {WIDTHS.map(w => (
              <button key={w} onClick={() => setWidthIn(String(w))} className={`py-2 px-3 rounded-xl border-2 text-sm font-semibold transition-all ${widthIn === String(w) ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                {w}"
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="calc-label">Nominal Height / Thickness (inches)</label>
          <div className="flex flex-wrap gap-2">
            {HEIGHTS.map(h => (
              <button key={h} onClick={() => setHeightIn(String(h))} className={`py-2 px-3 rounded-xl border-2 text-sm font-semibold transition-all ${heightIn === String(h) ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                {h}"
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="calc-label">Length per Piece (ft)</label>
            <input type="number" className="calc-input" placeholder="8" value={lengthFt} min="0" onChange={e => setLengthFt(e.target.value)} />
          </div>
          <div>
            <label className="calc-label">Number of Pieces</label>
            <input type="number" className="calc-input" placeholder="10" value={pieces} min="1" onChange={e => setPieces(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="calc-label">Wood Species</label>
          <div className="grid grid-cols-1 gap-2">
            {(Object.entries(SPECIES) as [Species, typeof SPECIES[Species]][]).map(([id, s]) => (
              <button key={id} onClick={() => setSpecies(id)} className={`py-2.5 px-3 rounded-xl border-2 text-sm font-semibold transition-all text-left ${species === id ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                {s.label} — ~${s.costPerBf.toFixed(2)}/BF
              </button>
            ))}
          </div>
        </div>
        <button onClick={calculate} className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-colors">Calculate Lumber</button>
        {result && (
          <div className="result-card space-y-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Results — {widthIn}×{heightIn}, {lengthFt} ft, {SPECIES[species].label}</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'BF per Piece', val: result.bfPerPiece },
                { label: 'Total Board Feet', val: result.totalBf },
                { label: 'Total Linear Ft', val: result.totalLinearFt },
                { label: 'Approx Weight (lbs)', val: result.weightLbs.toLocaleString() },
              ].map(b => (
                <div key={b.label} className="bg-navy-700 rounded-lg p-3 text-center">
                  <div className="text-brand-400 font-bold text-2xl">{b.val}</div>
                  <div className="text-slate-400 text-xs mt-0.5">{b.label}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-navy-700 pt-4 flex items-center justify-between">
              <span className="text-slate-400 text-sm">Lumber Cost Estimate</span>
              <span className="text-brand-400 font-bold text-lg">${result.costLow.toLocaleString()} – ${result.costHigh.toLocaleString()}</span>
            </div>
            <p className="text-slate-500 text-xs">💡 Nominal dimensions differ from actual: a 2×4 measures 1.5"×3.5" actual.</p>
          </div>
        )}
      </div>
    </div>
  );
}
