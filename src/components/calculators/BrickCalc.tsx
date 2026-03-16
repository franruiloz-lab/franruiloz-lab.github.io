import { useState } from 'react';
type BrickSize = 'standard' | 'modular' | 'queen' | 'king' | 'jumbo';
const SIZES: Record<BrickSize, { label: string; dims: string; perSqFt: number }> = {
  standard: { label: 'Standard',  dims: '3⅝"×2¼"×7⅝"', perSqFt: 6.75 },
  modular:  { label: 'Modular',   dims: '3⅝"×2¼"×7⅝"', perSqFt: 6.75 },
  queen:    { label: 'Queen',     dims: '3"×2¾"×9⅝"',   perSqFt: 4.5  },
  king:     { label: 'King',      dims: '3"×2¾"×9⅝"',   perSqFt: 4.5  },
  jumbo:    { label: 'Jumbo',     dims: '3⅝"×2¾"×7⅝"', perSqFt: 5.76 },
};
export default function BrickCalc() {
  const [wallLength, setWallLength] = useState('');
  const [wallHeight, setWallHeight] = useState('');
  const [brickSize, setBrickSize] = useState<BrickSize>('standard');
  const [result, setResult] = useState<any>(null);
  const calculate = () => {
    const l = parseFloat(wallLength)||0, h = parseFloat(wallHeight)||0;
    if (l<=0||h<=0) { setResult(null); return; }
    const sqFt = l*h;
    const s = SIZES[brickSize];
    const bricksRaw = sqFt*s.perSqFt;
    const bricksNeeded = Math.ceil(bricksRaw*1.05);
    const mortarBags = Math.ceil(bricksNeeded/100*7); // ~7 bags per 100 bricks
    setResult({
      sqFt: Math.round(sqFt),
      bricksNeeded,
      mortarBags,
      costLow: Math.round(bricksNeeded*0.50),
      costHigh: Math.round(bricksNeeded*1.50),
    });
  };
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4">
        <div className="flex items-center gap-2"><span className="text-2xl">🧱</span><h2 className="text-white font-bold text-lg">Brick Calculator</h2></div>
      </div>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="calc-label">Wall Length (ft)</label><input type="number" className="calc-input" placeholder="0" value={wallLength} min="0" onChange={e=>setWallLength(e.target.value)}/></div>
          <div><label className="calc-label">Wall Height (ft)</label><input type="number" className="calc-input" placeholder="0" value={wallHeight} min="0" onChange={e=>setWallHeight(e.target.value)}/></div>
        </div>
        <div>
          <label className="calc-label">Brick Size</label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.entries(SIZES) as [BrickSize, typeof SIZES[BrickSize]][]).map(([id, s])=>(
              <button key={id} onClick={()=>setBrickSize(id)} className={`py-2 px-2 rounded-xl border-2 text-xs font-semibold transition-all text-center ${brickSize===id?'border-brand-500 bg-brand-50 text-brand-700':'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                <div>{s.label}</div><div className="text-slate-400 font-normal text-[10px]">{s.perSqFt}/sq ft</div>
              </button>
            ))}
          </div>
        </div>
        <button onClick={calculate} className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-colors">Calculate Bricks</button>
        {result && (
          <div className="result-card space-y-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Results — {SIZES[brickSize].label} ({SIZES[brickSize].dims})</p>
            <div className="grid grid-cols-2 gap-4">
              <div><div className="result-value">{result.bricksNeeded.toLocaleString()}</div><div className="result-unit">Bricks (w/ 5% waste)</div></div>
              <div><div className="result-value">{result.mortarBags}</div><div className="result-unit">Mortar Bags</div></div>
              <div><div className="result-value">{result.sqFt.toLocaleString()}</div><div className="result-unit">Wall Sq Ft</div></div>
            </div>
            <div className="border-t border-navy-700 pt-4 flex items-center justify-between">
              <span className="text-slate-400 text-sm">Brick Cost Estimate</span>
              <span className="text-brand-400 font-bold text-lg">${result.costLow.toLocaleString()} – ${result.costHigh.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
