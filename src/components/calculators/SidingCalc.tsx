import { useState } from 'react';
type SidingType = 'vinyl' | 'hardie' | 'wood_lap' | 'smart_side' | 'stucco';
const TYPES: Record<SidingType, { label: string; coverageSqFtPer100: number; costLow: number; costHigh: number; lifespan: string }> = {
  vinyl:      { label: 'Vinyl Siding',       coverageSqFtPer100: 100, costLow: 3,  costHigh: 7,  lifespan: '20–40 yrs' },
  hardie:     { label: 'Fiber Cement',       coverageSqFtPer100: 100, costLow: 6,  costHigh: 12, lifespan: '30–50 yrs' },
  wood_lap:   { label: 'Wood Lap',           coverageSqFtPer100: 100, costLow: 5,  costHigh: 10, lifespan: '15–30 yrs' },
  smart_side: { label: 'Engineered Wood',    coverageSqFtPer100: 100, costLow: 4,  costHigh: 8,  lifespan: '25–35 yrs' },
  stucco:     { label: 'Stucco',             coverageSqFtPer100: 100, costLow: 6,  costHigh: 9,  lifespan: '50–80 yrs' },
};
export default function SidingCalc() {
  const [wallHeight, setWallHeight] = useState('9');
  const [perimeterOrArea, setPerimeterOrArea] = useState<'perimeter'|'area'>('perimeter');
  const [perimeter, setPerimeter] = useState('');
  const [area, setArea] = useState('');
  const [doors, setDoors] = useState('2');
  const [windows, setWindows] = useState('8');
  const [sidingType, setSidingType] = useState<SidingType>('vinyl');
  const [result, setResult] = useState<any>(null);
  const calculate = () => {
    const h = parseFloat(wallHeight)||9;
    const d = parseInt(doors)||0, w = parseInt(windows)||0;
    let wallArea = 0;
    if (perimeterOrArea==='perimeter') {
      const p = parseFloat(perimeter)||0;
      if (p<=0) { setResult(null); return; }
      wallArea = p*h;
    } else {
      const a = parseFloat(area)||0;
      if (a<=0) { setResult(null); return; }
      wallArea = a;
    }
    wallArea -= d*21 + w*15; // subtract openings
    const sqFtWaste = wallArea*1.1;
    const squaresRaw = sqFtWaste/100; // 1 square = 100 sq ft
    const squares = squaresRaw.toFixed(1);
    const t = TYPES[sidingType];
    setResult({
      wallArea: Math.round(wallArea),
      sqFtWaste: Math.round(sqFtWaste),
      squares,
      costLow: Math.round(wallArea*t.costLow),
      costHigh: Math.round(wallArea*t.costHigh),
      lifespan: t.lifespan,
    });
  };
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4">
        <div className="flex items-center gap-2"><span className="text-2xl">🏠</span><h2 className="text-white font-bold text-lg">Siding Calculator</h2></div>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <label className="calc-label">Siding Type</label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.entries(TYPES) as [SidingType, typeof TYPES[SidingType]][]).map(([id, t])=>(
              <button key={id} onClick={()=>setSidingType(id)} className={`py-2 px-2 rounded-xl border-2 text-xs font-semibold transition-all text-center ${sidingType===id?'border-brand-500 bg-brand-50 text-brand-700':'border-slate-200 text-slate-500 hover:border-slate-300'}`}>{t.label}</button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          {(['perimeter','area'] as const).map(opt=>(
            <button key={opt} onClick={()=>setPerimeterOrArea(opt)} className={`flex-1 py-2 rounded-lg border-2 text-sm font-semibold transition-all ${perimeterOrArea===opt?'border-brand-500 bg-brand-50 text-brand-700':'border-slate-200 text-slate-500'}`}>
              {opt==='perimeter'?'Enter Perimeter':'Enter Wall Area'}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {perimeterOrArea==='perimeter'
            ? <div className="col-span-2"><label className="calc-label">House Perimeter (ft)</label><input type="number" className="calc-input" placeholder="0" value={perimeter} min="0" onChange={e=>setPerimeter(e.target.value)}/></div>
            : <div className="col-span-2"><label className="calc-label">Total Wall Area (sq ft)</label><input type="number" className="calc-input" placeholder="0" value={area} min="0" onChange={e=>setArea(e.target.value)}/></div>
          }
          {perimeterOrArea==='perimeter' && <div className="col-span-2"><label className="calc-label">Wall Height (ft)</label><input type="number" className="calc-input" placeholder="9" value={wallHeight} min="0" onChange={e=>setWallHeight(e.target.value)}/></div>}
          <div><label className="calc-label">Doors</label><input type="number" className="calc-input" placeholder="2" value={doors} min="0" onChange={e=>setDoors(e.target.value)}/></div>
          <div><label className="calc-label">Windows</label><input type="number" className="calc-input" placeholder="8" value={windows} min="0" onChange={e=>setWindows(e.target.value)}/></div>
        </div>
        <button onClick={calculate} className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-colors">Calculate Siding</button>
        {result && (
          <div className="result-card space-y-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Results — {TYPES[sidingType].label}</p>
            <div className="grid grid-cols-2 gap-4">
              <div><div className="result-value">{result.sqFtWaste.toLocaleString()}</div><div className="result-unit">Sq Ft (w/ 10% waste)</div></div>
              <div><div className="result-value">{result.squares}</div><div className="result-unit">Squares (100 sq ft ea)</div></div>
              <div><div className="result-value">{result.lifespan}</div><div className="result-unit">Expected Lifespan</div></div>
            </div>
            <div className="border-t border-navy-700 pt-4 flex items-center justify-between">
              <span className="text-slate-400 text-sm">Material Cost Estimate</span>
              <span className="text-brand-400 font-bold text-lg">${result.costLow.toLocaleString()} – ${result.costHigh.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
