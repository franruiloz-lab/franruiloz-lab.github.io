import { useState } from 'react';
type InputUnit = 'ft' | 'in' | 'm' | 'cm' | 'yd';
const UNIT_TO_FT: Record<InputUnit, number> = { ft: 1, in: 1/12, m: 3.28084, cm: 0.0328084, yd: 3 };
const UNIT_LABELS: Record<InputUnit, string> = { ft: 'Feet', in: 'Inches', m: 'Meters', cm: 'Centimeters', yd: 'Yards' };
export default function CubicYardsCalc() {
  const [unit, setUnit] = useState<InputUnit>('ft');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [depth, setDepth] = useState('');
  const [result, setResult] = useState<any>(null);
  const convert = (v: string) => (parseFloat(v)||0)*UNIT_TO_FT[unit];
  const calculate = () => {
    const l = convert(length), w = convert(width), d = convert(depth);
    if (l<=0||w<=0||d<=0) { setResult(null); return; }
    const cubicFt = l*w*d;
    const cubicYards = cubicFt/27;
    const cubicMeters = cubicFt*0.0283168;
    const cubicInches = cubicFt*1728;
    setResult({
      cubicYards: cubicYards.toFixed(2),
      cubicFt: cubicFt.toFixed(2),
      cubicMeters: cubicMeters.toFixed(3),
      cubicInches: Math.round(cubicInches).toLocaleString(),
    });
  };
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4">
        <div className="flex items-center gap-2"><span className="text-2xl">📐</span><h2 className="text-white font-bold text-lg">Cubic Yards Calculator</h2></div>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <label className="calc-label">Input Units</label>
          <div className="grid grid-cols-5 gap-1.5">
            {(Object.entries(UNIT_LABELS) as [InputUnit, string][]).map(([id, label])=>(
              <button key={id} onClick={()=>setUnit(id)} className={`py-2 rounded-lg border-2 text-xs font-bold transition-all ${unit===id?'border-brand-500 bg-brand-50 text-brand-700':'border-slate-200 text-slate-500 hover:border-slate-300'}`}>{label}</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div><label className="calc-label">Length ({unit})</label><input type="number" className="calc-input" placeholder="0" value={length} min="0" onChange={e=>setLength(e.target.value)}/></div>
          <div><label className="calc-label">Width ({unit})</label><input type="number" className="calc-input" placeholder="0" value={width} min="0" onChange={e=>setWidth(e.target.value)}/></div>
          <div><label className="calc-label">Depth ({unit})</label><input type="number" className="calc-input" placeholder="0" value={depth} min="0" onChange={e=>setDepth(e.target.value)}/></div>
        </div>
        <button onClick={calculate} className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-colors">Calculate Cubic Yards</button>
        {result && (
          <div className="result-card space-y-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Results</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 bg-brand-500/10 rounded-xl p-4 text-center">
                <div className="text-brand-400 font-bold text-4xl">{result.cubicYards}</div>
                <div className="text-slate-300 text-sm mt-1">Cubic Yards</div>
              </div>
              <div><div className="result-value">{result.cubicFt}</div><div className="result-unit">Cubic Feet</div></div>
              <div><div className="result-value">{result.cubicMeters}</div><div className="result-unit">Cubic Meters</div></div>
              <div><div className="result-value">{result.cubicInches}</div><div className="result-unit">Cubic Inches</div></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
