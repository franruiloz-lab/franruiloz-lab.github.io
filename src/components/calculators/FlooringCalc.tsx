import { useState } from 'react';
type FloorType = 'hardwood' | 'laminate' | 'lvp' | 'carpet' | 'tile' | 'engineered';
const TYPES: Record<FloorType, { label: string; costLow: number; costHigh: number; installLow: number; installHigh: number }> = {
  hardwood:   { label: 'Solid Hardwood',   costLow: 6,  costHigh: 15, installLow: 4, installHigh: 8 },
  engineered: { label: 'Engineered Wood',  costLow: 4,  costHigh: 10, installLow: 3, installHigh: 7 },
  laminate:   { label: 'Laminate',         costLow: 1,  costHigh: 5,  installLow: 2, installHigh: 5 },
  lvp:        { label: 'LVP / LVT',        costLow: 2,  costHigh: 7,  installLow: 2, installHigh: 4 },
  carpet:     { label: 'Carpet',           costLow: 2,  costHigh: 6,  installLow: 1, installHigh: 3 },
  tile:       { label: 'Ceramic / Porcelain', costLow: 2, costHigh: 10, installLow: 4, installHigh: 9 },
};
export default function FlooringCalc() {
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [floorType, setFloorType] = useState<FloorType>('lvp');
  const [includeInstall, setIncludeInstall] = useState(false);
  const [result, setResult] = useState<any>(null);
  const calculate = () => {
    const l = parseFloat(length)||0, w = parseFloat(width)||0;
    if (l<=0||w<=0) { setResult(null); return; }
    const sqFt = l*w;
    const sqFtWaste = sqFt*1.1;
    const t = TYPES[floorType];
    const matLow = Math.round(sqFt*t.costLow);
    const matHigh = Math.round(sqFt*t.costHigh);
    const instLow = Math.round(sqFt*t.installLow);
    const instHigh = Math.round(sqFt*t.installHigh);
    setResult({
      sqFt: Math.round(sqFt),
      sqFtWaste: Math.round(sqFtWaste),
      matLow, matHigh, instLow, instHigh,
      totalLow: matLow + (includeInstall?instLow:0),
      totalHigh: matHigh + (includeInstall?instHigh:0),
    });
  };
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4">
        <div className="flex items-center gap-2"><span className="text-2xl">🏠</span><h2 className="text-white font-bold text-lg">Flooring Calculator</h2></div>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <label className="calc-label">Flooring Type</label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.entries(TYPES) as [FloorType, typeof TYPES[FloorType]][]).map(([id, t])=>(
              <button key={id} onClick={()=>setFloorType(id)} className={`py-2 px-2 rounded-xl border-2 text-xs font-semibold transition-all text-center ${floorType===id?'border-brand-500 bg-brand-50 text-brand-700':'border-slate-200 text-slate-500 hover:border-slate-300'}`}>{t.label}</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="calc-label">Room Length (ft)</label><input type="number" className="calc-input" placeholder="0" value={length} min="0" onChange={e=>setLength(e.target.value)}/></div>
          <div><label className="calc-label">Room Width (ft)</label><input type="number" className="calc-input" placeholder="0" value={width} min="0" onChange={e=>setWidth(e.target.value)}/></div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={includeInstall} onChange={e=>setIncludeInstall(e.target.checked)} className="w-4 h-4 rounded accent-brand-500"/>
          <span className="text-sm text-slate-600 font-medium">Include installation cost</span>
        </label>
        <button onClick={calculate} className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-colors">Calculate Flooring</button>
        {result && (
          <div className="result-card space-y-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Results — {TYPES[floorType].label}</p>
            <div className="grid grid-cols-2 gap-4">
              <div><div className="result-value">{result.sqFtWaste.toLocaleString()}</div><div className="result-unit">Sq Ft (w/ 10% waste)</div></div>
              <div><div className="result-value">${result.matLow.toLocaleString()} – ${result.matHigh.toLocaleString()}</div><div className="result-unit">Material Cost</div></div>
              {includeInstall && <div><div className="result-value">${result.instLow.toLocaleString()} – ${result.instHigh.toLocaleString()}</div><div className="result-unit">Installation Cost</div></div>}
            </div>
            <div className="border-t border-navy-700 pt-4 flex items-center justify-between">
              <span className="text-slate-400 text-sm">{includeInstall?'Total (Material + Install)':'Material Cost Estimate'}</span>
              <span className="text-brand-400 font-bold text-lg">${result.totalLow.toLocaleString()} – ${result.totalHigh.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
