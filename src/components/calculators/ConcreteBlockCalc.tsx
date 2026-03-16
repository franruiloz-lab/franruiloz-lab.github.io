import { useState } from 'react';
type BlockType = 'standard' | 'half' | 'corner' | 'bond_beam';
const BLOCKS: Record<BlockType, { label: string; size: string; sqFtPer: number; costEa: number }> = {
  standard:   { label: 'Standard (8×8×16)',  size: '8"×8"×16"', sqFtPer: 0.889, costEa: 2.5 },
  half:       { label: 'Half Block (8×8×8)', size: '8"×8"×8"',  sqFtPer: 0.444, costEa: 1.8 },
  corner:     { label: 'Corner Block',        size: '8"×8"×16"', sqFtPer: 0.889, costEa: 3.2 },
  bond_beam:  { label: 'Bond Beam',           size: '8"×8"×16"', sqFtPer: 0.889, costEa: 3.5 },
};
export default function ConcreteBlockCalc() {
  const [wallLength, setWallLength] = useState('');
  const [wallHeight, setWallHeight] = useState('');
  const [blockType, setBlockType] = useState<BlockType>('standard');
  const [result, setResult] = useState<any>(null);
  const calculate = () => {
    const l = parseFloat(wallLength)||0, h = parseFloat(wallHeight)||0;
    if (l<=0||h<=0) { setResult(null); return; }
    const wallSqFt = l*h;
    const b = BLOCKS[blockType];
    const blocksRaw = wallSqFt / b.sqFtPer;
    const blocksNeeded = Math.ceil(blocksRaw * 1.05); // 5% waste
    const mortarBags = Math.ceil(blocksNeeded / 35); // ~35 blocks per 60lb bag
    setResult({
      wallSqFt: Math.round(wallSqFt),
      blocksNeeded,
      mortarBags,
      costLow: Math.round(blocksNeeded * b.costEa * 0.9),
      costHigh: Math.round(blocksNeeded * b.costEa * 1.2),
    });
  };
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4">
        <div className="flex items-center gap-2"><span className="text-2xl">🧱</span><h2 className="text-white font-bold text-lg">Concrete Block Calculator</h2></div>
      </div>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="calc-label">Wall Length (ft)</label><input type="number" className="calc-input" placeholder="0" value={wallLength} min="0" onChange={e=>setWallLength(e.target.value)}/></div>
          <div><label className="calc-label">Wall Height (ft)</label><input type="number" className="calc-input" placeholder="0" value={wallHeight} min="0" onChange={e=>setWallHeight(e.target.value)}/></div>
        </div>
        <div>
          <label className="calc-label">Block Type</label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.entries(BLOCKS) as [BlockType, typeof BLOCKS[BlockType]][]).map(([id, b])=>(
              <button key={id} onClick={()=>setBlockType(id)} className={`py-2.5 px-2 rounded-xl border-2 text-xs font-semibold transition-all text-center ${blockType===id?'border-brand-500 bg-brand-50 text-brand-700':'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                <div>{b.label}</div><div className="text-slate-400 font-normal">{b.size}</div>
              </button>
            ))}
          </div>
        </div>
        <button onClick={calculate} className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-colors">Calculate Blocks</button>
        {result && (
          <div className="result-card space-y-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Results — {BLOCKS[blockType].label}</p>
            <div className="grid grid-cols-2 gap-4">
              <div><div className="result-value">{result.blocksNeeded.toLocaleString()}</div><div className="result-unit">Blocks (w/ 5% waste)</div></div>
              <div><div className="result-value">{result.mortarBags}</div><div className="result-unit">60 lb Mortar Bags</div></div>
              <div><div className="result-value">{result.wallSqFt.toLocaleString()}</div><div className="result-unit">Wall Sq Ft</div></div>
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
