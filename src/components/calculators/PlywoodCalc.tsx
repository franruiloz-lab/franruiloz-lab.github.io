import { useState } from 'react';
type Grade = '3/4' | '1/2' | '3/8' | '1/4';
type Use = 'subfloor' | 'sheathing' | 'cabinet' | 'concrete_form';
const GRADES: Record<Grade, { label: string; costLow: number; costHigh: number }> = {
  '3/4': { label: '3/4" (19mm)', costLow: 55, costHigh: 85 },
  '1/2': { label: '1/2" (12mm)', costLow: 38, costHigh: 60 },
  '3/8': { label: '3/8" (9mm)',  costLow: 30, costHigh: 50 },
  '1/4': { label: '1/4" (6mm)',  costLow: 22, costHigh: 38 },
};
const USES: Record<Use, string> = {
  subfloor: 'Subfloor',
  sheathing: 'Wall/Roof Sheathing',
  cabinet: 'Cabinetry/Furniture',
  concrete_form: 'Concrete Forming',
};
export default function PlywoodCalc() {
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [grade, setGrade] = useState<Grade>('3/4');
  const [use, setUse] = useState<Use>('subfloor');
  const [result, setResult] = useState<any>(null);
  const calculate = () => {
    const l = parseFloat(length)||0, w = parseFloat(width)||0;
    if (l<=0||w<=0) { setResult(null); return; }
    const sqFt = l*w;
    const sqFtWaste = sqFt*1.1;
    const sheets = Math.ceil(sqFtWaste/32); // 4x8 = 32 sq ft
    const g = GRADES[grade];
    setResult({
      sqFt: Math.round(sqFt),
      sqFtWaste: Math.round(sqFtWaste),
      sheets,
      costLow: Math.round(sheets*g.costLow),
      costHigh: Math.round(sheets*g.costHigh),
    });
  };
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4">
        <div className="flex items-center gap-2"><span className="text-2xl">🪵</span><h2 className="text-white font-bold text-lg">Plywood Calculator</h2></div>
      </div>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="calc-label">Area Length (ft)</label><input type="number" className="calc-input" placeholder="0" value={length} min="0" onChange={e=>setLength(e.target.value)}/></div>
          <div><label className="calc-label">Area Width (ft)</label><input type="number" className="calc-input" placeholder="0" value={width} min="0" onChange={e=>setWidth(e.target.value)}/></div>
        </div>
        <div>
          <label className="calc-label">Plywood Thickness</label>
          <div className="grid grid-cols-4 gap-2">
            {(Object.entries(GRADES) as [Grade, typeof GRADES[Grade]][]).map(([id, g])=>(
              <button key={id} onClick={()=>setGrade(id)} className={`py-2 rounded-xl border-2 text-xs font-semibold transition-all text-center ${grade===id?'border-brand-500 bg-brand-50 text-brand-700':'border-slate-200 text-slate-500 hover:border-slate-300'}`}>{g.label}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="calc-label">Intended Use</label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.entries(USES) as [Use, string][]).map(([id, label])=>(
              <button key={id} onClick={()=>setUse(id)} className={`py-2 px-3 rounded-xl border-2 text-xs font-semibold transition-all text-center ${use===id?'border-brand-500 bg-brand-50 text-brand-700':'border-slate-200 text-slate-500 hover:border-slate-300'}`}>{label}</button>
            ))}
          </div>
        </div>
        <button onClick={calculate} className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-colors">Calculate Plywood</button>
        {result && (
          <div className="result-card space-y-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Results — {GRADES[grade].label} for {USES[use]}</p>
            <div className="grid grid-cols-2 gap-4">
              <div><div className="result-value">{result.sheets}</div><div className="result-unit">4×8 Sheets to Buy</div></div>
              <div><div className="result-value">{result.sqFtWaste.toLocaleString()}</div><div className="result-unit">Sq Ft (w/ 10% waste)</div></div>
            </div>
            <div className="border-t border-navy-700 pt-4 flex items-center justify-between">
              <span className="text-slate-400 text-sm">Material Cost Estimate</span>
              <span className="text-brand-400 font-bold text-lg">${result.costLow.toLocaleString()} – ${result.costHigh.toLocaleString()}</span>
            </div>
            <p className="text-slate-500 text-xs">💡 Based on standard 4×8 sheets (32 sq ft each). Includes 10% waste for cuts.</p>
          </div>
        )}
      </div>
    </div>
  );
}
