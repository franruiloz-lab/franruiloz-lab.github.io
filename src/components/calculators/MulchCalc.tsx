import { useState } from 'react';

type Unit = 'ft' | 'm';
const BAG_2CUFT = 2;
const BAG_3CUFT = 3;

export default function MulchCalc() {
  const [unit, setUnit] = useState<Unit>('ft');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [depth, setDepth] = useState('3');
  const [result, setResult] = useState<{
    cubicFt: number; cubicYd: number; bags2: number; bags3: number; costLow: number; costHigh: number;
  } | null>(null);

  const toFt  = (v: string) => (parseFloat(v) || 0) * (unit === 'm' ? 3.28084 : 1);
  const toIn  = (v: string) => (parseFloat(v) || 0) * (unit === 'm' ? 39.3701 : 1);

  const calculate = () => {
    const l = toFt(length);
    const w = toFt(width);
    const d = toIn(depth) / 12;
    const cubicFt = l * w * d;
    if (cubicFt <= 0) { setResult(null); return; }
    const cubicYd = cubicFt / 27;
    const bags2 = Math.ceil(cubicFt / BAG_2CUFT);
    const bags3 = Math.ceil(cubicFt / BAG_3CUFT);
    setResult({ cubicFt, cubicYd, bags2, bags3, costLow: Math.round(bags2 * 4), costHigh: Math.round(bags2 * 8) });
  };

  const depthGuide = [
    { use: 'Weed prevention', depth: '2–3 inches' },
    { use: 'Moisture retention', depth: '3–4 inches' },
    { use: 'Insulation', depth: '4–6 inches' },
    { use: 'Playgrounds', depth: '6–12 inches' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🍂</span>
          <h2 className="text-white font-bold text-lg">Mulch Calculator</h2>
        </div>
        <div className="flex bg-navy-700 rounded-lg p-0.5 text-xs font-semibold">
          {(['ft', 'm'] as Unit[]).map(u => (
            <button key={u} onClick={() => setUnit(u)}
              className={`px-3 py-1.5 rounded-md transition-all ${unit === u ? 'bg-brand-500 text-white' : 'text-slate-300 hover:text-white'}`}>
              {u === 'ft' ? 'Imperial' : 'Metric'}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="calc-label">Length ({unit})</label>
            <input type="number" className="calc-input" placeholder="0" value={length} min="0" onChange={e => setLength(e.target.value)} /></div>
          <div><label className="calc-label">Width ({unit})</label>
            <input type="number" className="calc-input" placeholder="0" value={width} min="0" onChange={e => setWidth(e.target.value)} /></div>
          <div className="col-span-2">
            <label className="calc-label">Depth ({unit === 'ft' ? 'inches' : 'cm'})</label>
            <input type="number" className="calc-input" placeholder="3" value={depth} min="0" onChange={e => setDepth(e.target.value)} />
            <p className="text-xs text-slate-400 mt-1">Recommended: 2–4 inches for most uses</p>
          </div>
        </div>

        {/* Depth guide */}
        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Depth Guide</p>
          <div className="grid grid-cols-2 gap-1.5">
            {depthGuide.map(row => (
              <div key={row.use} className="flex items-center justify-between text-xs">
                <span className="text-slate-500">{row.use}</span>
                <span className="font-semibold text-navy-700">{row.depth}</span>
              </div>
            ))}
          </div>
        </div>

        <button onClick={calculate}
          className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-colors text-base">
          Calculate Mulch
        </button>

        {result && (
          <div className="result-card space-y-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Results</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="result-value">{result.cubicYd.toFixed(2)}</div>
                <div className="result-unit">Cubic Yards (bulk)</div>
              </div>
              <div>
                <div className="result-value">{result.cubicFt.toFixed(1)}</div>
                <div className="result-unit">Cubic Feet</div>
              </div>
            </div>
            <div className="border-t border-navy-700 pt-4">
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Bags Needed</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: '2 cu ft bags', val: result.bags2 },
                  { label: '3 cu ft bags', val: result.bags3 },
                ].map(b => (
                  <div key={b.label} className="bg-navy-700 rounded-lg p-3 text-center">
                    <div className="text-brand-400 font-bold text-2xl">{b.val}</div>
                    <div className="text-slate-400 text-xs mt-0.5">{b.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-navy-700 pt-4 flex items-center justify-between">
              <span className="text-slate-400 text-sm">Estimated Cost (bags)</span>
              <span className="text-brand-400 font-bold text-lg">
                ${result.costLow} – ${result.costHigh}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
