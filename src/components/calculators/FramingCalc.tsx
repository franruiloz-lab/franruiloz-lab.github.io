import { useState } from 'react';
type Spacing = '12' | '16' | '24';
type StudSize = '2x4' | '2x6';
export default function FramingCalc() {
  const [wallLength, setWallLength] = useState('');
  const [wallHeight, setWallHeight] = useState('9');
  const [spacing, setSpacing] = useState<Spacing>('16');
  const [studSize, setStudSize] = useState<StudSize>('2x4');
  const [walls, setWalls] = useState('4');
  const [result, setResult] = useState<any>(null);
  const STUD_COST: Record<StudSize, { low: number; high: number }> = {
    '2x4': { low: 5, high: 9 },
    '2x6': { low: 9, high: 15 },
  };
  const calculate = () => {
    const l = parseFloat(wallLength)||0, h = parseFloat(wallHeight)||9;
    const w = parseInt(walls)||1;
    const sp = parseInt(spacing);
    if (l<=0) { setResult(null); return; }
    const totalLength = l*w;
    const spacingFt = sp/12;
    // studs along each wall + 1 extra stud per wall for corners
    const studsPerWall = Math.ceil(l/spacingFt) + 1 + 2; // +2 for corners/doubles
    const totalStuds = studsPerWall*w;
    const studsWaste = Math.ceil(totalStuds*1.1);
    // plates: 3 plates per wall (2 bottom, 1 top... simplified)
    const plateLf = totalLength*3;
    const plateBoards = Math.ceil(plateLf/16); // 16ft boards
    const cost = STUD_COST[studSize];
    setResult({
      totalStuds: studsWaste,
      plateBoards,
      plateLf: Math.round(plateLf),
      sqFtWall: Math.round(totalLength*h),
      costLow: Math.round(studsWaste*cost.low + plateBoards*cost.low),
      costHigh: Math.round(studsWaste*cost.high + plateBoards*cost.high),
    });
  };
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4">
        <div className="flex items-center gap-2"><span className="text-2xl">🔨</span><h2 className="text-white font-bold text-lg">Framing Calculator</h2></div>
      </div>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="calc-label">Wall Length (ft)</label><input type="number" className="calc-input" placeholder="0" value={wallLength} min="0" onChange={e=>setWallLength(e.target.value)}/></div>
          <div><label className="calc-label">Wall Height (ft)</label><input type="number" className="calc-input" placeholder="9" value={wallHeight} min="0" onChange={e=>setWallHeight(e.target.value)}/></div>
          <div><label className="calc-label">Number of Walls</label><input type="number" className="calc-input" placeholder="4" value={walls} min="1" onChange={e=>setWalls(e.target.value)}/></div>
        </div>
        <div>
          <label className="calc-label">Stud Spacing (OC)</label>
          <div className="grid grid-cols-3 gap-2">
            {(['12','16','24'] as Spacing[]).map(s=>(
              <button key={s} onClick={()=>setSpacing(s)} className={`py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${spacing===s?'border-brand-500 bg-brand-50 text-brand-700':'border-slate-200 text-slate-500 hover:border-slate-300'}`}>{s}" OC</button>
            ))}
          </div>
        </div>
        <div>
          <label className="calc-label">Stud Size</label>
          <div className="grid grid-cols-2 gap-2">
            {(['2x4','2x6'] as StudSize[]).map(s=>(
              <button key={s} onClick={()=>setStudSize(s)} className={`py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${studSize===s?'border-brand-500 bg-brand-50 text-brand-700':'border-slate-200 text-slate-500 hover:border-slate-300'}`}>{s}</button>
            ))}
          </div>
        </div>
        <button onClick={calculate} className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-colors">Calculate Framing</button>
        {result && (
          <div className="result-card space-y-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Results — {studSize} @ {spacing}" OC</p>
            <div className="grid grid-cols-2 gap-4">
              <div><div className="result-value">{result.totalStuds}</div><div className="result-unit">Studs (w/ 10% waste)</div></div>
              <div><div className="result-value">{result.plateBoards}</div><div className="result-unit">Plate Boards (16 ft)</div></div>
              <div><div className="result-value">{result.plateLf}</div><div className="result-unit">Plate Linear Feet</div></div>
              <div><div className="result-value">{result.sqFtWall.toLocaleString()}</div><div className="result-unit">Total Wall Sq Ft</div></div>
            </div>
            <div className="border-t border-navy-700 pt-4 flex items-center justify-between">
              <span className="text-slate-400 text-sm">Lumber Cost Estimate</span>
              <span className="text-brand-400 font-bold text-lg">${result.costLow.toLocaleString()} – ${result.costHigh.toLocaleString()}</span>
            </div>
            <p className="text-slate-500 text-xs">💡 Add headers, jack studs, and blocking for windows/doors to your actual order.</p>
          </div>
        )}
      </div>
    </div>
  );
}
