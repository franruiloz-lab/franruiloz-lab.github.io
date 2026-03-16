import { useState } from 'react';
type WallMaterial = 'concrete_block' | 'natural_stone' | 'timber' | 'boulder' | 'brick';
const MATERIALS: Record<WallMaterial, { label: string; costLow: number; costHigh: number }> = {
  concrete_block: { label: 'Concrete Block', costLow: 25, costHigh: 45 },
  natural_stone:  { label: 'Natural Stone',  costLow: 35, costHigh: 65 },
  timber:         { label: 'Timber/Railroad', costLow: 20, costHigh: 35 },
  boulder:        { label: 'Boulders',        costLow: 40, costHigh: 80 },
  brick:          { label: 'Brick',           costLow: 30, costHigh: 55 },
};
export default function RetainingWallCalc() {
  const [length, setLength] = useState('');
  const [height, setHeight] = useState('');
  const [material, setMaterial] = useState<WallMaterial>('concrete_block');
  const [result, setResult] = useState<any>(null);
  const calculate = () => {
    const l = parseFloat(length)||0, h = parseFloat(height)||0;
    if (l<=0||h<=0) { setResult(null); return; }
    const sqFt = l*h;
    const m = MATERIALS[material];
    // Gravel drainage: 1 ft wide, same length and height, cubic yards
    const drainGravel = (l*h*1)/27; // 1 ft thick gravel drain
    // Deadman anchors every 6 ft for concrete block walls
    const deadmen = material==='concrete_block' ? Math.ceil(l/6)*Math.ceil(h/2) : 0;
    setResult({
      sqFt: Math.round(sqFt),
      drainGravel: drainGravel.toFixed(1),
      deadmen,
      costLow: Math.round(sqFt*m.costLow),
      costHigh: Math.round(sqFt*m.costHigh),
    });
  };
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4">
        <div className="flex items-center gap-2"><span className="text-2xl">🪨</span><h2 className="text-white font-bold text-lg">Retaining Wall Calculator</h2></div>
      </div>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="calc-label">Wall Length (ft)</label><input type="number" className="calc-input" placeholder="0" value={length} min="0" onChange={e=>setLength(e.target.value)}/></div>
          <div><label className="calc-label">Wall Height (ft)</label><input type="number" className="calc-input" placeholder="0" value={height} min="0" onChange={e=>setHeight(e.target.value)}/></div>
        </div>
        <div>
          <label className="calc-label">Wall Material</label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.entries(MATERIALS) as [WallMaterial, typeof MATERIALS[WallMaterial]][]).map(([id, m])=>(
              <button key={id} onClick={()=>setMaterial(id)} className={`py-2 px-2 rounded-xl border-2 text-xs font-semibold transition-all text-center ${material===id?'border-brand-500 bg-brand-50 text-brand-700':'border-slate-200 text-slate-500 hover:border-slate-300'}`}>{m.label}</button>
            ))}
          </div>
        </div>
        <button onClick={calculate} className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-colors">Calculate Retaining Wall</button>
        {result && (
          <div className="result-card space-y-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Results — {MATERIALS[material].label}</p>
            <div className="grid grid-cols-2 gap-4">
              <div><div className="result-value">{result.sqFt.toLocaleString()}</div><div className="result-unit">Wall Face Sq Ft</div></div>
              <div><div className="result-value">{result.drainGravel}</div><div className="result-unit">Drain Gravel (cu yd)</div></div>
              {result.deadmen > 0 && <div><div className="result-value">{result.deadmen}</div><div className="result-unit">Deadman Anchors</div></div>}
            </div>
            <div className="border-t border-navy-700 pt-4 flex items-center justify-between">
              <span className="text-slate-400 text-sm">Installed Cost Estimate</span>
              <span className="text-brand-400 font-bold text-lg">${result.costLow.toLocaleString()} – ${result.costHigh.toLocaleString()}</span>
            </div>
            <p className="text-slate-500 text-xs">💡 Walls over 4 ft typically require an engineer and permits. Always add drainage pipe behind the wall.</p>
          </div>
        )}
      </div>
    </div>
  );
}
