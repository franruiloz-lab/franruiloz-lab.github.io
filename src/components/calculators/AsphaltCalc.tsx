import { useState } from 'react';
type Unit = 'ft' | 'm';
const ASPHALT_DENSITY = 145; // lbs per cubic foot
export default function AsphaltCalc() {
  const [unit, setUnit] = useState<Unit>('ft');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [depth, setDepth] = useState('3');
  const [result, setResult] = useState<{ tons: number; cubicYards: number; costLow: number; costHigh: number } | null>(null);
  const toFt = (v: string) => (parseFloat(v) || 0) * (unit === 'm' ? 3.28084 : 1);
  const toIn = (v: string) => (parseFloat(v) || 0) * (unit === 'm' ? 39.3701 : 1);
  const calculate = () => {
    const l = toFt(length), w = toFt(width), d = toIn(depth) / 12;
    const cubicFt = l * w * d;
    if (cubicFt <= 0) { setResult(null); return; }
    const tons = (cubicFt * ASPHALT_DENSITY) / 2000;
    const cubicYards = cubicFt / 27;
    setResult({ tons, cubicYards, costLow: Math.round(tons * 80), costHigh: Math.round(tons * 130) });
  };
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2"><span className="text-2xl">🛣️</span><h2 className="text-white font-bold text-lg">Asphalt Calculator</h2></div>
        <div className="flex bg-navy-700 rounded-lg p-0.5 text-xs font-semibold">
          {(['ft','m'] as Unit[]).map(u => <button key={u} onClick={() => setUnit(u)} className={`px-3 py-1.5 rounded-md transition-all ${unit===u?'bg-brand-500 text-white':'text-slate-300 hover:text-white'}`}>{u==='ft'?'Imperial':'Metric'}</button>)}
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="calc-label">Length ({unit})</label><input type="number" className="calc-input" placeholder="0" value={length} min="0" onChange={e=>setLength(e.target.value)}/></div>
          <div><label className="calc-label">Width ({unit})</label><input type="number" className="calc-input" placeholder="0" value={width} min="0" onChange={e=>setWidth(e.target.value)}/></div>
          <div className="col-span-2"><label className="calc-label">Thickness ({unit==='ft'?'inches':'cm'})</label>
            <input type="number" className="calc-input" placeholder="3" value={depth} min="0" onChange={e=>setDepth(e.target.value)}/>
            <p className="text-xs text-slate-400 mt-1">Standard driveway: 2–3 in. Parking lot: 3–4 in. Road: 4–6 in.</p>
          </div>
        </div>
        <button onClick={calculate} className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-colors">Calculate Asphalt</button>
        {result && (
          <div className="result-card space-y-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Results</p>
            <div className="grid grid-cols-2 gap-4">
              <div><div className="result-value">{result.tons.toFixed(2)}</div><div className="result-unit">Tons of Asphalt</div></div>
              <div><div className="result-value">{result.cubicYards.toFixed(2)}</div><div className="result-unit">Cubic Yards</div></div>
            </div>
            <div className="border-t border-navy-700 pt-4 flex items-center justify-between">
              <span className="text-slate-400 text-sm">Estimated Material Cost</span>
              <span className="text-brand-400 font-bold text-lg">${result.costLow.toLocaleString()} – ${result.costHigh.toLocaleString()}</span>
            </div>
            <p className="text-slate-500 text-xs">💡 Add 10% for waste. Installation labor is separate (~$2–5/sq ft).</p>
          </div>
        )}
      </div>
    </div>
  );
}
