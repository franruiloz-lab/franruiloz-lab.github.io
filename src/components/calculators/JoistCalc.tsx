import { useState } from 'react';
type Spacing = '12' | '16' | '24';
type JoistSize = '2x6' | '2x8' | '2x10' | '2x12';
type JoistType = 'floor' | 'ceiling' | 'deck';
const JOIST_DIMS: Record<JoistSize, { w: number; h: number }> = {
  '2x6':  { w: 2, h: 6  },
  '2x8':  { w: 2, h: 8  },
  '2x10': { w: 2, h: 10 },
  '2x12': { w: 2, h: 12 },
};
const JOIST_TYPES: Record<JoistType, { label: string }> = {
  floor:   { label: 'Floor Joist'   },
  ceiling: { label: 'Ceiling Joist' },
  deck:    { label: 'Deck Joist'    },
};
export default function JoistCalc() {
  const [roomLength, setRoomLength] = useState('');
  const [roomWidth, setRoomWidth] = useState('');
  const [spacing, setSpacing] = useState<Spacing>('16');
  const [joistSize, setJoistSize] = useState<JoistSize>('2x10');
  const [joistType, setJoistType] = useState<JoistType>('floor');
  const [result, setResult] = useState<any>(null);
  const calculate = () => {
    const l = parseFloat(roomLength) || 0;
    const w = parseFloat(roomWidth) || 0;
    if (l <= 0 || w <= 0) { setResult(null); return; }
    const span = Math.min(l, w);
    const perpDim = Math.max(l, w);
    const spacingFt = parseFloat(spacing) / 12;
    const joistCount = Math.ceil(perpDim / spacingFt) + 1;
    const totalLinearFt = joistCount * span;
    const dims = JOIST_DIMS[joistSize];
    const boardFt = Math.round((dims.w * dims.h / 12) * totalLinearFt);
    const blockingRows = Math.floor(span / 8);
    const blockingPieces = blockingRows * (joistCount - 1);
    const costLow = Math.round(boardFt * 0.60);
    const costHigh = Math.round(boardFt * 1.10);
    setResult({ joistCount, totalLinearFt: Math.round(totalLinearFt), boardFt, blockingPieces, costLow, costHigh, span });
  };
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4">
        <div className="flex items-center gap-2"><span className="text-2xl">🔨</span><h2 className="text-white font-bold text-lg">Floor Joist Calculator</h2></div>
      </div>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="calc-label">Room Length (ft)</label>
            <input type="number" className="calc-input" placeholder="20" value={roomLength} min="0" onChange={e => setRoomLength(e.target.value)} />
          </div>
          <div>
            <label className="calc-label">Room Width (ft)</label>
            <input type="number" className="calc-input" placeholder="15" value={roomWidth} min="0" onChange={e => setRoomWidth(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="calc-label">Joist Type</label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.entries(JOIST_TYPES) as [JoistType, typeof JOIST_TYPES[JoistType]][]).map(([id, t]) => (
              <button key={id} onClick={() => setJoistType(id)} className={`py-2.5 px-3 rounded-xl border-2 text-sm font-semibold transition-all ${joistType === id ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="calc-label">Joist Spacing (OC)</label>
          <div className="grid grid-cols-3 gap-2">
            {(['12','16','24'] as Spacing[]).map(s => (
              <button key={s} onClick={() => setSpacing(s)} className={`py-2.5 px-3 rounded-xl border-2 text-sm font-semibold transition-all ${spacing === s ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                {s}" OC
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="calc-label">Joist Size</label>
          <div className="grid grid-cols-4 gap-2">
            {(['2x6','2x8','2x10','2x12'] as JoistSize[]).map(s => (
              <button key={s} onClick={() => setJoistSize(s)} className={`py-2.5 px-3 rounded-xl border-2 text-sm font-semibold transition-all ${joistSize === s ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <button onClick={calculate} className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-colors">Calculate Joists</button>
        {result && (
          <div className="result-card space-y-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Results — {JOIST_TYPES[joistType].label}, {joistSize} @ {spacing}" OC</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Number of Joists', val: result.joistCount },
                { label: 'Total Linear Ft', val: result.totalLinearFt },
                { label: 'Board Feet', val: result.boardFt.toLocaleString() },
                { label: 'Blocking Pieces', val: result.blockingPieces },
              ].map(b => (
                <div key={b.label} className="bg-navy-700 rounded-lg p-3 text-center">
                  <div className="text-brand-400 font-bold text-2xl">{b.val}</div>
                  <div className="text-slate-400 text-xs mt-0.5">{b.label}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-navy-700 pt-4 flex items-center justify-between">
              <span className="text-slate-400 text-sm">Lumber Cost Estimate</span>
              <span className="text-brand-400 font-bold text-lg">${result.costLow.toLocaleString()} – ${result.costHigh.toLocaleString()}</span>
            </div>
            <p className="text-slate-500 text-xs">💡 Joists span the {result.span} ft direction. Add 10% for waste and end joists.</p>
          </div>
        )}
      </div>
    </div>
  );
}
