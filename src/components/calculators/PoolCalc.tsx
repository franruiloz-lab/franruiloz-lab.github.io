import { useState } from 'react';
type Shape = 'rectangle' | 'circle' | 'oval' | 'kidney';
export default function PoolCalc() {
  const [shape, setShape] = useState<Shape>('rectangle');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [shallowDepth, setShallowDepth] = useState('3.5');
  const [deepDepth, setDeepDepth] = useState('8');
  const [result, setResult] = useState<any>(null);
  const calculate = () => {
    const l = parseFloat(length)||0, w = parseFloat(width)||0;
    const shallow = parseFloat(shallowDepth)||3.5, deep = parseFloat(deepDepth)||8;
    if (l<=0||w<=0) { setResult(null); return; }
    const avgDepth = (shallow+deep)/2;
    let cubicFt = 0;
    if (shape==='rectangle') cubicFt = l*w*avgDepth;
    else if (shape==='circle') cubicFt = Math.PI*(l/2)*(l/2)*avgDepth;
    else if (shape==='oval') cubicFt = Math.PI*(l/2)*(w/2)*avgDepth;
    else cubicFt = 0.85*l*w*avgDepth; // kidney approximation
    const gallons = cubicFt*7.481;
    const litersAmt = gallons*3.785;
    setResult({
      cubicFt: Math.round(cubicFt), gallons: Math.round(gallons),
      liters: Math.round(litersAmt),
      chlorineLbs: (gallons/10000*3).toFixed(1),
      sandLbs: Math.round(gallons/10000*200),
      fillTimeHours: (gallons/1000).toFixed(1),
    });
  };
  const shapes: { id: Shape; label: string; icon: string }[] = [
    { id:'rectangle', label:'Rectangle', icon:'▭' },
    { id:'circle',    label:'Circle',    icon:'○' },
    { id:'oval',      label:'Oval',      icon:'⬭' },
    { id:'kidney',    label:'Kidney',    icon:'🫘' },
  ];
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4">
        <div className="flex items-center gap-2"><span className="text-2xl">🏊</span><h2 className="text-white font-bold text-lg">Pool Volume Calculator</h2></div>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <label className="calc-label">Pool Shape</label>
          <div className="grid grid-cols-4 gap-2">
            {shapes.map(s=>(
              <button key={s.id} onClick={()=>setShape(s.id)} className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border-2 text-xs font-semibold transition-all ${shape===s.id?'border-brand-500 bg-brand-50 text-brand-700':'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                <span className="text-base">{s.icon}</span>{s.label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="calc-label">{shape==='circle'?'Diameter (ft)':'Length (ft)'}</label><input type="number" className="calc-input" placeholder="0" value={length} min="0" onChange={e=>setLength(e.target.value)}/></div>
          {shape!=='circle' && <div><label className="calc-label">Width (ft)</label><input type="number" className="calc-input" placeholder="0" value={width} min="0" onChange={e=>setWidth(e.target.value)}/></div>}
          <div><label className="calc-label">Shallow Depth (ft)</label><input type="number" className="calc-input" placeholder="3.5" value={shallowDepth} min="0" onChange={e=>setShallowDepth(e.target.value)}/></div>
          <div><label className="calc-label">Deep Depth (ft)</label><input type="number" className="calc-input" placeholder="8" value={deepDepth} min="0" onChange={e=>setDeepDepth(e.target.value)}/></div>
        </div>
        <button onClick={calculate} className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-colors">Calculate Pool Volume</button>
        {result && (
          <div className="result-card space-y-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Results</p>
            <div className="grid grid-cols-2 gap-4">
              <div><div className="result-value">{result.gallons.toLocaleString()}</div><div className="result-unit">US Gallons</div></div>
              <div><div className="result-value">{result.liters.toLocaleString()}</div><div className="result-unit">Liters</div></div>
              <div><div className="result-value">{result.cubicFt.toLocaleString()}</div><div className="result-unit">Cubic Feet</div></div>
              <div><div className="result-value">{result.fillTimeHours} hrs</div><div className="result-unit">Fill Time (~1000 GPH)</div></div>
            </div>
            <div className="border-t border-navy-700 pt-4">
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Chemical Estimate (initial fill)</p>
              <div className="grid grid-cols-2 gap-3">
                {[{ label: 'Chlorine (lbs)', val: result.chlorineLbs }, { label: 'Filter Sand (lbs)', val: result.sandLbs }].map(b=>(
                  <div key={b.label} className="bg-navy-700 rounded-lg p-3 text-center">
                    <div className="text-brand-400 font-bold text-xl">{b.val}</div>
                    <div className="text-slate-400 text-xs mt-0.5">{b.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
