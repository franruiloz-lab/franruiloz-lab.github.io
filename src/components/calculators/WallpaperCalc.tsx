import { useState } from 'react';
export default function WallpaperCalc() {
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('9');
  const [doors, setDoors] = useState('1');
  const [windows, setWindows] = useState('2');
  const [rollLength, setRollLength] = useState('33');
  const [rollWidth, setRollWidth] = useState('21');
  const [result, setResult] = useState<any>(null);
  const calculate = () => {
    const l=parseFloat(length)||0, w=parseFloat(width)||0, h=parseFloat(height)||9;
    const d=parseInt(doors)||0, wi=parseInt(windows)||0;
    const rl=parseFloat(rollLength)||33, rw=parseFloat(rollWidth)||21;
    if (l<=0||w<=0) { setResult(null); return; }
    const wallArea = 2*(l+w)*h - d*21 - wi*15;
    const rollSqFt = (rl*rw)/144;
    const rollsRaw = wallArea/rollSqFt;
    const rollsNeeded = Math.ceil(rollsRaw*1.15); // 15% waste for pattern matching
    setResult({
      wallArea: Math.round(wallArea), rollsNeeded,
      rollsDouble: Math.ceil(rollsNeeded/2),
      costLow: Math.round(rollsNeeded*25), costHigh: Math.round(rollsNeeded*80),
    });
  };
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4">
        <div className="flex items-center gap-2"><span className="text-2xl">🖼️</span><h2 className="text-white font-bold text-lg">Wallpaper Calculator</h2></div>
      </div>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div><label className="calc-label">Length (ft)</label><input type="number" className="calc-input" placeholder="0" value={length} min="0" onChange={e=>setLength(e.target.value)}/></div>
          <div><label className="calc-label">Width (ft)</label><input type="number" className="calc-input" placeholder="0" value={width} min="0" onChange={e=>setWidth(e.target.value)}/></div>
          <div><label className="calc-label">Height (ft)</label><input type="number" className="calc-input" placeholder="9" value={height} min="0" onChange={e=>setHeight(e.target.value)}/></div>
          <div><label className="calc-label">Doors</label><input type="number" className="calc-input" placeholder="1" value={doors} min="0" onChange={e=>setDoors(e.target.value)}/></div>
          <div><label className="calc-label">Windows</label><input type="number" className="calc-input" placeholder="2" value={windows} min="0" onChange={e=>setWindows(e.target.value)}/></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="calc-label">Roll Length (in)</label><input type="number" className="calc-input" placeholder="33" value={rollLength} min="0" onChange={e=>setRollLength(e.target.value)}/></div>
          <div><label className="calc-label">Roll Width (in)</label><input type="number" className="calc-input" placeholder="21" value={rollWidth} min="0" onChange={e=>setRollWidth(e.target.value)}/></div>
        </div>
        <button onClick={calculate} className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-colors">Calculate Wallpaper</button>
        {result && (
          <div className="result-card space-y-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Results (+15% pattern waste)</p>
            <div className="grid grid-cols-2 gap-4">
              <div><div className="result-value">{result.rollsNeeded}</div><div className="result-unit">Single Rolls</div></div>
              <div><div className="result-value">{result.rollsDouble}</div><div className="result-unit">Double Rolls</div></div>
              <div><div className="result-value">{result.wallArea.toLocaleString()}</div><div className="result-unit">Net Wall Sq Ft</div></div>
            </div>
            <div className="border-t border-navy-700 pt-4 flex items-center justify-between">
              <span className="text-slate-400 text-sm">Material Cost Estimate</span>
              <span className="text-brand-400 font-bold text-lg">${result.costLow} – ${result.costHigh}</span>
            </div>
            <p className="text-slate-500 text-xs">💡 Standard US single roll: 21" × 33 ft. European rolls are often longer.</p>
          </div>
        )}
      </div>
    </div>
  );
}
