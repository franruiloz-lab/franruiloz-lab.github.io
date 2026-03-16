import { useState } from 'react';

type Shape = 'rectangle' | 'circle' | 'triangle' | 'trapezoid';
type Unit = 'ft' | 'm' | 'yd' | 'in';

const UNIT_TO_FEET: Record<Unit, number> = {
  ft: 1, m: 3.28084, yd: 3, in: 1 / 12,
};

interface Result {
  sqFt: number;
  sqM: number;
  sqYd: number;
  sqIn: number;
}

export default function SquareFootageCalc() {
  const [shape, setShape] = useState<Shape>('rectangle');
  const [unit, setUnit] = useState<Unit>('ft');
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [c, setC] = useState('');
  const [result, setResult] = useState<Result | null>(null);

  const toFt = (v: string) => (parseFloat(v) || 0) * UNIT_TO_FEET[unit];

  const calculate = () => {
    let sqFt = 0;
    if (shape === 'rectangle') sqFt = toFt(a) * toFt(b);
    else if (shape === 'circle')    sqFt = Math.PI * Math.pow(toFt(a), 2);
    else if (shape === 'triangle')  sqFt = 0.5 * toFt(a) * toFt(b);
    else if (shape === 'trapezoid') sqFt = 0.5 * (toFt(a) + toFt(b)) * toFt(c);
    if (sqFt <= 0) { setResult(null); return; }
    setResult({
      sqFt,
      sqM:  sqFt * 0.092903,
      sqYd: sqFt * 0.111111,
      sqIn: sqFt * 144,
    });
  };

  const shapes: { id: Shape; label: string; icon: string }[] = [
    { id: 'rectangle', label: 'Rectangle', icon: '▭' },
    { id: 'circle',    label: 'Circle',    icon: '○' },
    { id: 'triangle',  label: 'Triangle',  icon: '△' },
    { id: 'trapezoid', label: 'Trapezoid', icon: '⏢' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📐</span>
          <h2 className="text-white font-bold text-lg">Square Footage Calculator</h2>
        </div>
        <select value={unit} onChange={e => setUnit(e.target.value as Unit)}
          className="bg-navy-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border-0 focus:outline-none cursor-pointer">
          <option value="ft">Feet (ft)</option>
          <option value="m">Meters (m)</option>
          <option value="yd">Yards (yd)</option>
          <option value="in">Inches (in)</option>
        </select>
      </div>

      <div className="p-6 space-y-5">
        <div>
          <label className="calc-label">Shape</label>
          <div className="grid grid-cols-4 gap-2">
            {shapes.map(s => (
              <button key={s.id} onClick={() => setShape(s.id)}
                className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border-2 text-xs font-semibold transition-all ${
                  shape === s.id ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'
                }`}>
                <span className="text-base">{s.icon}</span>{s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {shape === 'rectangle' && (
            <>
              <div><label className="calc-label">Length ({unit})</label>
                <input type="number" className="calc-input" placeholder="0" value={a} min="0" onChange={e => setA(e.target.value)} /></div>
              <div><label className="calc-label">Width ({unit})</label>
                <input type="number" className="calc-input" placeholder="0" value={b} min="0" onChange={e => setB(e.target.value)} /></div>
            </>
          )}
          {shape === 'circle' && (
            <div className="col-span-2"><label className="calc-label">Radius ({unit})</label>
              <input type="number" className="calc-input" placeholder="0" value={a} min="0" onChange={e => setA(e.target.value)} /></div>
          )}
          {shape === 'triangle' && (
            <>
              <div><label className="calc-label">Base ({unit})</label>
                <input type="number" className="calc-input" placeholder="0" value={a} min="0" onChange={e => setA(e.target.value)} /></div>
              <div><label className="calc-label">Height ({unit})</label>
                <input type="number" className="calc-input" placeholder="0" value={b} min="0" onChange={e => setB(e.target.value)} /></div>
            </>
          )}
          {shape === 'trapezoid' && (
            <>
              <div><label className="calc-label">Base 1 ({unit})</label>
                <input type="number" className="calc-input" placeholder="0" value={a} min="0" onChange={e => setA(e.target.value)} /></div>
              <div><label className="calc-label">Base 2 ({unit})</label>
                <input type="number" className="calc-input" placeholder="0" value={b} min="0" onChange={e => setB(e.target.value)} /></div>
              <div className="col-span-2"><label className="calc-label">Height ({unit})</label>
                <input type="number" className="calc-input" placeholder="0" value={c} min="0" onChange={e => setC(e.target.value)} /></div>
            </>
          )}
        </div>

        <button onClick={calculate}
          className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-colors text-base">
          Calculate Area
        </button>

        {result && (
          <div className="result-card space-y-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Results</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="result-value">{result.sqFt.toFixed(2)}</div>
                <div className="result-unit">Square Feet (ft²)</div>
              </div>
              <div>
                <div className="result-value">{result.sqM.toFixed(2)}</div>
                <div className="result-unit">Square Meters (m²)</div>
              </div>
              <div>
                <div className="result-value">{result.sqYd.toFixed(2)}</div>
                <div className="result-unit">Square Yards (yd²)</div>
              </div>
              <div>
                <div className="result-value">{result.sqIn.toFixed(0)}</div>
                <div className="result-unit">Square Inches (in²)</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
