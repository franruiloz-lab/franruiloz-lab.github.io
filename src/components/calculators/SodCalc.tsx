import { useState } from 'react';
type Unit = 'ft' | 'm';
const PALLET_SQFT = 450; // standard pallet
const ROLL_SQFT = 9;     // standard roll (2x4.5 ft or 1.5x6 ft)
export default function SodCalc() {
  const [unit, setUnit] = useState<Unit>('ft');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [result, setResult] = useState<any>(null);
  const toFt = (v: string) => (parseFloat(v)||0)*(unit==='m'?3.28084:1);
  const calculate = () => {
    const sqFt = toFt(length)*toFt(width);
    if (sqFt<=0) { setResult(null); return; }
    const sqFtWaste = sqFt*1.05;
    const pallets = sqFtWaste/PALLET_SQFT;
    const rolls = Math.ceil(sqFtWaste/ROLL_SQFT);
    setResult({
      sqFt: Math.round(sqFt), sqFtWaste: Math.round(sqFtWaste),
      pallets: pallets.toFixed(2), palletsNeeded: Math.ceil(pallets), rolls,
      costLow: Math.round(sqFtWaste*0.35), costHigh: Math.round(sqFtWaste*0.70),
    });
  };
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2"><span className="text-2xl">🌾</span><h2 className="text-white font-bold text-lg">Sod Calculator</h2></div>
        <div className="flex bg-navy-700 rounded-lg p-0.5 text-xs font-semibold">
          {(['ft','m'] as Unit[]).map(u=><button key={u} onClick={()=>setUnit(u)} className={`px-3 py-1.5 rounded-md transition-all ${unit===u?'bg-brand-500 text-white':'text-slate-300 hover:text-white'}`}>{u==='ft'?'Imperial':'Metric'}</button>)}
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="calc-label">Length ({unit})</label><input type="number" className="calc-input" placeholder="0" value={length} min="0" onChange={e=>setLength(e.target.value)}/></div>
          <div><label className="calc-label">Width ({unit})</label><input type="number" className="calc-input" placeholder="0" value={width} min="0" onChange={e=>setWidth(e.target.value)}/></div>
        </div>
        <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-500">
          <p className="font-semibold text-slate-700 mb-1">Standard sizes:</p>
          <p>Pallet = ~{PALLET_SQFT} sq ft &nbsp;|&nbsp; Roll = ~{ROLL_SQFT} sq ft (2×4.5 ft)</p>
        </div>
        <button onClick={calculate} className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-colors">Calculate Sod</button>
        {result && (
          <div className="result-card space-y-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Results (+5% waste)</p>
            <div className="grid grid-cols-2 gap-4">
              <div><div className="result-value">{result.palletsNeeded}</div><div className="result-unit">Pallets needed</div></div>
              <div><div className="result-value">{result.rolls}</div><div className="result-unit">Individual rolls</div></div>
              <div><div className="result-value">{result.sqFt.toLocaleString()}</div><div className="result-unit">Square feet</div></div>
              <div><div className="result-value">{result.sqFtWaste.toLocaleString()}</div><div className="result-unit">Sq ft to order</div></div>
            </div>
            <div className="border-t border-navy-700 pt-4 flex items-center justify-between">
              <span className="text-slate-400 text-sm">Estimated Cost (installed)</span>
              <span className="text-brand-400 font-bold text-lg">${result.costLow.toLocaleString()} – ${result.costHigh.toLocaleString()}</span>
            </div>
            <p className="text-slate-500 text-xs">💡 Water daily for 2 weeks after installation. Don't walk on it for 2–3 weeks.</p>
          </div>
        )}
      </div>
    </div>
  );
}
