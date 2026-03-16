import { useState } from 'react';
type Material = 'pressure_treated' | 'cedar' | 'redwood' | 'composite' | 'ipe';
const MATERIALS: Record<Material, { label: string; costLow: number; costHigh: number; lifespan: string }> = {
  pressure_treated: { label: 'Pressure Treated', costLow: 15, costHigh: 25, lifespan: '15–20 yrs' },
  cedar:            { label: 'Cedar',             costLow: 20, costHigh: 35, lifespan: '15–20 yrs' },
  redwood:          { label: 'Redwood',           costLow: 30, costHigh: 50, lifespan: '20–30 yrs' },
  composite:        { label: 'Composite',         costLow: 35, costHigh: 60, lifespan: '25–30 yrs' },
  ipe:              { label: 'Ipe (Hardwood)',     costLow: 50, costHigh: 90, lifespan: '40–75 yrs' },
};
export default function DeckCalc() {
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [material, setMaterial] = useState<Material>('pressure_treated');
  const [boardWidth, setBoardWidth] = useState<'4'|'6'>('6');
  const [result, setResult] = useState<any>(null);
  const calculate = () => {
    const l = parseFloat(length)||0, w = parseFloat(width)||0;
    if (l<=0||w<=0) { setResult(null); return; }
    const sqFt = l*w;
    const sqFtWaste = sqFt*1.1;
    const boardLf = sqFtWaste/(parseFloat(boardWidth)/12); // linear feet of decking
    const mat = MATERIALS[material];
    setResult({
      sqFt: Math.round(sqFt), sqFtWaste: Math.round(sqFtWaste),
      boardLf: Math.round(boardLf),
      joists: Math.ceil(w/16*l) + Math.ceil(l/4), // approx joist count
      costLow: Math.round(sqFt*mat.costLow), costHigh: Math.round(sqFt*mat.costHigh),
      lifespan: mat.lifespan,
    });
  };
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4">
        <div className="flex items-center gap-2"><span className="text-2xl">🏡</span><h2 className="text-white font-bold text-lg">Deck Calculator</h2></div>
      </div>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="calc-label">Deck Length (ft)</label><input type="number" className="calc-input" placeholder="0" value={length} min="0" onChange={e=>setLength(e.target.value)}/></div>
          <div><label className="calc-label">Deck Width (ft)</label><input type="number" className="calc-input" placeholder="0" value={width} min="0" onChange={e=>setWidth(e.target.value)}/></div>
        </div>
        <div>
          <label className="calc-label">Decking Material</label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.entries(MATERIALS) as [Material, typeof MATERIALS[Material]][]).map(([id, m]) => (
              <button key={id} onClick={()=>setMaterial(id)} className={`text-xs py-2.5 px-2 rounded-xl border-2 font-semibold transition-all text-center ${material===id?'border-brand-500 bg-brand-50 text-brand-700':'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                {m.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="calc-label">Board Width</label>
          <div className="grid grid-cols-2 gap-2">
            {(['4','6'] as const).map(bw => (
              <button key={bw} onClick={()=>setBoardWidth(bw)} className={`py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${boardWidth===bw?'border-brand-500 bg-brand-50 text-brand-700':'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                {bw}" width (1×{bw})
              </button>
            ))}
          </div>
        </div>
        <button onClick={calculate} className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-colors">Calculate Deck</button>
        {result && (
          <div className="result-card space-y-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Results — {MATERIALS[material].label}</p>
            <div className="grid grid-cols-2 gap-4">
              <div><div className="result-value">{result.sqFt.toLocaleString()}</div><div className="result-unit">Square Feet</div></div>
              <div><div className="result-value">{result.boardLf.toLocaleString()}</div><div className="result-unit">Linear Ft of Boards</div></div>
              <div><div className="result-value">{result.lifespan}</div><div className="result-unit">Expected Lifespan</div></div>
            </div>
            <div className="border-t border-navy-700 pt-4 flex items-center justify-between">
              <span className="text-slate-400 text-sm">Total Installed Cost</span>
              <span className="text-brand-400 font-bold text-lg">${result.costLow.toLocaleString()} – ${result.costHigh.toLocaleString()}</span>
            </div>
            <p className="text-slate-500 text-xs">💡 Already includes 10% waste. Add framing, fasteners, and stain to budget.</p>
          </div>
        )}
      </div>
    </div>
  );
}
