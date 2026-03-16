import { useState } from 'react';
export default function RebarCalc() {
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [spacing, setSpacing] = useState('12');
  const [barSize, setBarSize] = useState<'3'|'4'|'5'|'6'>('4');
  const [result, setResult] = useState<any>(null);
  const BAR_WEIGHT: Record<string, number> = { '3': 0.376, '4': 0.668, '5': 1.043, '6': 1.502 }; // lbs/ft
  const calculate = () => {
    const l=parseFloat(length)||0, w=parseFloat(width)||0, sp=parseFloat(spacing)||12;
    if(l<=0||w<=0){setResult(null);return;}
    const spFt=sp/12;
    const rowsAlongLength=Math.ceil(l/spFt)+1;
    const rowsAlongWidth=Math.ceil(w/spFt)+1;
    const linearFt=rowsAlongLength*w + rowsAlongWidth*l;
    const linearFtWaste=linearFt*1.1;
    const barsOf20=Math.ceil(linearFtWaste/20);
    const weightLbs=linearFtWaste*BAR_WEIGHT[barSize];
    setResult({
      linearFt:Math.round(linearFt), linearFtWaste:Math.round(linearFtWaste),
      barsOf20, weightLbs:weightLbs.toFixed(0),
      costLow:Math.round(linearFtWaste*0.40), costHigh:Math.round(linearFtWaste*0.70),
    });
  };
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4">
        <div className="flex items-center gap-2"><span className="text-2xl">⚙️</span><h2 className="text-white font-bold text-lg">Rebar Calculator</h2></div>
      </div>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="calc-label">Slab Length (ft)</label><input type="number" className="calc-input" placeholder="0" value={length} min="0" onChange={e=>setLength(e.target.value)}/></div>
          <div><label className="calc-label">Slab Width (ft)</label><input type="number" className="calc-input" placeholder="0" value={width} min="0" onChange={e=>setWidth(e.target.value)}/></div>
          <div><label className="calc-label">Rebar Spacing (in)</label>
            <select value={spacing} onChange={e=>setSpacing(e.target.value)} className="calc-select">
              {['6','8','12','16','18','24'].map(s=><option key={s} value={s}>{s}" on center</option>)}
            </select>
          </div>
          <div><label className="calc-label">Bar Size (#)</label>
            <div className="grid grid-cols-4 gap-1">
              {(['3','4','5','6'] as const).map(b=>(
                <button key={b} onClick={()=>setBarSize(b)} className={`py-2 rounded-lg border-2 text-sm font-bold transition-all ${barSize===b?'border-brand-500 bg-brand-50 text-brand-700':'border-slate-200 text-slate-500 hover:border-slate-300'}`}>#{b}</button>
              ))}
            </div>
          </div>
        </div>
        <button onClick={calculate} className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-colors">Calculate Rebar</button>
        {result && (
          <div className="result-card space-y-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Results — #{barSize} Rebar @ {spacing}" OC</p>
            <div className="grid grid-cols-2 gap-4">
              <div><div className="result-value">{result.linearFtWaste.toLocaleString()}</div><div className="result-unit">Linear Feet (w/ 10% waste)</div></div>
              <div><div className="result-value">{result.barsOf20}</div><div className="result-unit">20-ft bars to buy</div></div>
              <div><div className="result-value">{result.weightLbs}</div><div className="result-unit">Total Weight (lbs)</div></div>
            </div>
            <div className="border-t border-navy-700 pt-4 flex items-center justify-between">
              <span className="text-slate-400 text-sm">Material Cost Estimate</span>
              <span className="text-brand-400 font-bold text-lg">${result.costLow} – ${result.costHigh}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
