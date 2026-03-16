import { useState } from 'react';
type Unit = 'ft' | 'm';
type SandType = 'play' | 'masonry' | 'fill' | 'paver_base' | 'river';
const TYPES: Record<SandType, { label: string; tonPerYard: number; costLow: number; costHigh: number }> = {
  play:       { label: 'Play Sand',       tonPerYard: 1.3,  costLow: 30, costHigh: 60 },
  masonry:    { label: 'Masonry Sand',    tonPerYard: 1.35, costLow: 25, costHigh: 50 },
  fill:       { label: 'Fill Sand',       tonPerYard: 1.4,  costLow: 15, costHigh: 30 },
  paver_base: { label: 'Paver Base Sand', tonPerYard: 1.35, costLow: 25, costHigh: 45 },
  river:      { label: 'River Sand',      tonPerYard: 1.3,  costLow: 30, costHigh: 55 },
};
export default function SandCalc() {
  const [unit, setUnit] = useState<Unit>('ft');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [depth, setDepth] = useState('2');
  const [sandType, setSandType] = useState<SandType>('paver_base');
  const [result, setResult] = useState<any>(null);
  const toFt=(v:string)=>(parseFloat(v)||0)*(unit==='m'?3.28084:1);
  const toIn=(v:string)=>(parseFloat(v)||0)*(unit==='m'?39.3701:1);
  const calculate = () => {
    const cubicFt=toFt(length)*toFt(width)*(toIn(depth)/12);
    if(cubicFt<=0){setResult(null);return;}
    const yards=cubicFt/27;
    const t=TYPES[sandType];
    const tons=yards*t.tonPerYard;
    const bags50lb=Math.ceil((tons*2000)/50);
    setResult({yards:yards.toFixed(2),tons:tons.toFixed(2),bags50lb,costLow:Math.round(yards*t.costLow),costHigh:Math.round(yards*t.costHigh)});
  };
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2"><span className="text-2xl">🏖️</span><h2 className="text-white font-bold text-lg">Sand Calculator</h2></div>
        <div className="flex bg-navy-700 rounded-lg p-0.5 text-xs font-semibold">
          {(['ft','m'] as Unit[]).map(u=><button key={u} onClick={()=>setUnit(u)} className={`px-3 py-1.5 rounded-md transition-all ${unit===u?'bg-brand-500 text-white':'text-slate-300 hover:text-white'}`}>{u==='ft'?'Imperial':'Metric'}</button>)}
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <label className="calc-label">Sand Type</label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.entries(TYPES) as [SandType, typeof TYPES[SandType]][]).map(([id,t])=>(
              <button key={id} onClick={()=>setSandType(id)} className={`py-2 px-2 rounded-xl border-2 text-xs font-semibold transition-all text-center ${sandType===id?'border-brand-500 bg-brand-50 text-brand-700':'border-slate-200 text-slate-500 hover:border-slate-300'}`}>{t.label}</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="calc-label">Length ({unit})</label><input type="number" className="calc-input" placeholder="0" value={length} min="0" onChange={e=>setLength(e.target.value)}/></div>
          <div><label className="calc-label">Width ({unit})</label><input type="number" className="calc-input" placeholder="0" value={width} min="0" onChange={e=>setWidth(e.target.value)}/></div>
          <div className="col-span-2"><label className="calc-label">Depth ({unit==='ft'?'in':'cm'})</label><input type="number" className="calc-input" placeholder="2" value={depth} min="0" onChange={e=>setDepth(e.target.value)}/></div>
        </div>
        <button onClick={calculate} className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-colors">Calculate Sand</button>
        {result && (
          <div className="result-card space-y-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Results — {TYPES[sandType].label}</p>
            <div className="grid grid-cols-3 gap-3">
              {[{label:'Cubic Yards',val:result.yards},{label:'Tons',val:result.tons},{label:'50 lb Bags',val:result.bags50lb}].map(b=>(
                <div key={b.label} className="bg-navy-700 rounded-lg p-3 text-center"><div className="text-brand-400 font-bold text-xl">{b.val}</div><div className="text-slate-400 text-xs mt-0.5">{b.label}</div></div>
              ))}
            </div>
            <div className="border-t border-navy-700 pt-4 flex items-center justify-between">
              <span className="text-slate-400 text-sm">Estimated Cost (bulk)</span>
              <span className="text-brand-400 font-bold text-lg">${result.costLow} – ${result.costHigh}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
