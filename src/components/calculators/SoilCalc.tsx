import { useState } from 'react';
type Unit = 'ft' | 'm';
type SoilType = 'topsoil' | 'fill' | 'sand' | 'compost' | 'raised_bed';
const SOILS: Record<SoilType, { label: string; icon: string; tonPerYard: number; costLow: number; costHigh: number }> = {
  topsoil:    { label: 'Topsoil',        icon: '🌱', tonPerYard: 1.1, costLow: 25, costHigh: 55 },
  fill:       { label: 'Fill Dirt',      icon: '⛏️', tonPerYard: 1.2, costLow: 10, costHigh: 25 },
  sand:       { label: 'Sand',           icon: '🏖️', tonPerYard: 1.35, costLow: 25, costHigh: 50 },
  compost:    { label: 'Compost',        icon: '♻️', tonPerYard: 0.9, costLow: 30, costHigh: 65 },
  raised_bed: { label: 'Raised Bed Mix', icon: '🪴', tonPerYard: 0.85, costLow: 40, costHigh: 80 },
};
export default function SoilCalc() {
  const [unit, setUnit] = useState<Unit>('ft');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [depth, setDepth] = useState('6');
  const [soilType, setSoilType] = useState<SoilType>('topsoil');
  const [result, setResult] = useState<any>(null);
  const toFt = (v: string) => (parseFloat(v)||0)*(unit==='m'?3.28084:1);
  const toIn = (v: string) => (parseFloat(v)||0)*(unit==='m'?39.3701:1);
  const calculate = () => {
    const cubicFt = toFt(length)*toFt(width)*(toIn(depth)/12);
    if (cubicFt<=0) { setResult(null); return; }
    const yards = cubicFt/27;
    const s = SOILS[soilType];
    const tons = yards*s.tonPerYard;
    const bags = Math.ceil(cubicFt/1.5); // standard 40qt bag ≈ 1.5 cu ft
    setResult({ yards, tons, bags, costLow: Math.round(yards*s.costLow), costHigh: Math.round(yards*s.costHigh) });
  };
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2"><span className="text-2xl">🌿</span><h2 className="text-white font-bold text-lg">Soil Calculator</h2></div>
        <div className="flex bg-navy-700 rounded-lg p-0.5 text-xs font-semibold">
          {(['ft','m'] as Unit[]).map(u=><button key={u} onClick={()=>setUnit(u)} className={`px-3 py-1.5 rounded-md transition-all ${unit===u?'bg-brand-500 text-white':'text-slate-300 hover:text-white'}`}>{u==='ft'?'Imperial':'Metric'}</button>)}
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <label className="calc-label">Soil Type</label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.entries(SOILS) as [SoilType, typeof SOILS[SoilType]][]).map(([id, s]) => (
              <button key={id} onClick={()=>setSoilType(id)} className={`flex flex-col items-center gap-1 py-2 rounded-xl border-2 text-xs font-semibold transition-all ${soilType===id?'border-brand-500 bg-brand-50 text-brand-700':'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                <span className="text-lg">{s.icon}</span>{s.label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="calc-label">Length ({unit})</label><input type="number" className="calc-input" placeholder="0" value={length} min="0" onChange={e=>setLength(e.target.value)}/></div>
          <div><label className="calc-label">Width ({unit})</label><input type="number" className="calc-input" placeholder="0" value={width} min="0" onChange={e=>setWidth(e.target.value)}/></div>
          <div className="col-span-2"><label className="calc-label">Depth ({unit==='ft'?'inches':'cm'})</label><input type="number" className="calc-input" placeholder="6" value={depth} min="0" onChange={e=>setDepth(e.target.value)}/></div>
        </div>
        <button onClick={calculate} className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-colors">Calculate Soil</button>
        {result && (
          <div className="result-card space-y-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Results — {SOILS[soilType].label}</p>
            <div className="grid grid-cols-3 gap-3">
              {[{ label: 'Cubic Yards', val: result.yards.toFixed(2) }, { label: 'Tons', val: result.tons.toFixed(2) }, { label: 'Bags (40qt)', val: result.bags }].map(b=>(
                <div key={b.label} className="bg-navy-700 rounded-lg p-3 text-center">
                  <div className="text-brand-400 font-bold text-xl">{b.val}</div>
                  <div className="text-slate-400 text-xs mt-0.5">{b.label}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-navy-700 pt-4 flex items-center justify-between">
              <span className="text-slate-400 text-sm">Estimated Cost (bulk delivery)</span>
              <span className="text-brand-400 font-bold text-lg">${result.costLow} – ${result.costHigh}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
