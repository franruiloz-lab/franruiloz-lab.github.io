import { useState } from 'react';
type Pitch = '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '12';
type Spacing = '12' | '16' | '24';
type LumberSize = '2x6' | '2x8' | '2x10' | '2x12';
const PITCH_MULTIPLIER: Record<Pitch, number> = {
  '3':  Math.sqrt(1 + (3/12) ** 2),
  '4':  Math.sqrt(1 + (4/12) ** 2),
  '5':  Math.sqrt(1 + (5/12) ** 2),
  '6':  Math.sqrt(1 + (6/12) ** 2),
  '7':  Math.sqrt(1 + (7/12) ** 2),
  '8':  Math.sqrt(1 + (8/12) ** 2),
  '9':  Math.sqrt(1 + (9/12) ** 2),
  '10': Math.sqrt(1 + (10/12) ** 2),
  '12': Math.sqrt(1 + (12/12) ** 2),
};
const LUMBER_DIMS: Record<LumberSize, { w: number; h: number }> = {
  '2x6':  { w: 2, h: 6  },
  '2x8':  { w: 2, h: 8  },
  '2x10': { w: 2, h: 10 },
  '2x12': { w: 2, h: 12 },
};
export default function RafterCalc() {
  const [width, setWidth] = useState('');
  const [length, setLength] = useState('');
  const [overhang, setOverhang] = useState('12');
  const [pitch, setPitch] = useState<Pitch>('6');
  const [spacing, setSpacing] = useState<Spacing>('16');
  const [lumberSize, setLumberSize] = useState<LumberSize>('2x8');
  const [result, setResult] = useState<any>(null);
  const calculate = () => {
    const w = parseFloat(width) || 0;
    const l = parseFloat(length) || 0;
    const overhangFt = (parseFloat(overhang) || 0) / 12;
    if (w <= 0 || l <= 0) { setResult(null); return; }
    const run = (w / 2) + overhangFt;
    const multiplier = PITCH_MULTIPLIER[pitch];
    const rafterLength = parseFloat((run * multiplier).toFixed(2));
    const spacingFt = parseFloat(spacing) / 12;
    const numRafters = Math.ceil(l / spacingFt) * 2 + 2;
    const ridgeBoard = l;
    const totalLinearFt = Math.round(numRafters * rafterLength + ridgeBoard);
    const dims = LUMBER_DIMS[lumberSize];
    const boardFt = Math.round((dims.w * dims.h / 12) * totalLinearFt);
    const costLow = Math.round(boardFt * 0.70);
    const costHigh = Math.round(boardFt * 1.20);
    setResult({ rafterLength, numRafters, ridgeBoard, totalLinearFt, boardFt, costLow, costHigh });
  };
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4">
        <div className="flex items-center gap-2"><span className="text-2xl">🏚️</span><h2 className="text-white font-bold text-lg">Rafter Calculator</h2></div>
      </div>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="calc-label">Building Width (ft)</label>
            <input type="number" className="calc-input" placeholder="28" value={width} min="0" onChange={e => setWidth(e.target.value)} />
          </div>
          <div>
            <label className="calc-label">Building Length (ft)</label>
            <input type="number" className="calc-input" placeholder="40" value={length} min="0" onChange={e => setLength(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="calc-label">Overhang (inches)</label>
            <input type="number" className="calc-input" placeholder="12" value={overhang} min="0" max="24" onChange={e => setOverhang(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="calc-label">Roof Pitch (X/12)</label>
          <div className="grid grid-cols-5 gap-2">
            {(['3','4','5','6','7','8','9','10','12'] as Pitch[]).map(p => (
              <button key={p} onClick={() => setPitch(p)} className={`py-2.5 px-3 rounded-xl border-2 text-sm font-semibold transition-all ${pitch === p ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                {p}/12
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="calc-label">Rafter Spacing (OC)</label>
          <div className="grid grid-cols-3 gap-2">
            {(['12','16','24'] as Spacing[]).map(s => (
              <button key={s} onClick={() => setSpacing(s)} className={`py-2.5 px-3 rounded-xl border-2 text-sm font-semibold transition-all ${spacing === s ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                {s}" OC
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="calc-label">Lumber Size</label>
          <div className="grid grid-cols-4 gap-2">
            {(['2x6','2x8','2x10','2x12'] as LumberSize[]).map(s => (
              <button key={s} onClick={() => setLumberSize(s)} className={`py-2.5 px-3 rounded-xl border-2 text-sm font-semibold transition-all ${lumberSize === s ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <button onClick={calculate} className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-colors">Calculate Rafters</button>
        {result && (
          <div className="result-card space-y-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Results — {pitch}/12 Pitch, {spacing}" OC, {lumberSize}</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Rafter Length', val: `${result.rafterLength} ft` },
                { label: 'Number of Rafters', val: result.numRafters },
                { label: 'Ridge Board (ft)', val: result.ridgeBoard },
                { label: 'Total Linear Ft', val: result.totalLinearFt },
              ].map(b => (
                <div key={b.label} className="bg-navy-700 rounded-lg p-3 text-center">
                  <div className="text-brand-400 font-bold text-xl">{b.val}</div>
                  <div className="text-slate-400 text-xs mt-0.5">{b.label}</div>
                </div>
              ))}
            </div>
            <div className="bg-navy-700 rounded-lg p-3 text-center">
              <div className="text-brand-400 font-bold text-2xl">{result.boardFt.toLocaleString()} BF</div>
              <div className="text-slate-400 text-xs mt-0.5">Total Board Feet</div>
            </div>
            <div className="border-t border-navy-700 pt-4 flex items-center justify-between">
              <span className="text-slate-400 text-sm">Lumber Cost Estimate</span>
              <span className="text-brand-400 font-bold text-lg">${result.costLow.toLocaleString()} – ${result.costHigh.toLocaleString()}</span>
            </div>
            <p className="text-slate-500 text-xs">💡 Add 15% for waste and cuts. Ridge board is {result.ridgeBoard} ft long.</p>
          </div>
        )}
      </div>
    </div>
  );
}
