import { useState, useCallback } from 'react';

type Shape = 'slab' | 'footing' | 'column';
type Unit = 'ft' | 'm';

interface Result {
  cubicYards: number;
  cubicFeet: number;
  bags40: number;
  bags60: number;
  bags80: number;
  estimatedCost: { low: number; high: number };
}

export default function ConcreteCalc() {
  const [shape, setShape] = useState<Shape>('slab');
  const [unit, setUnit] = useState<Unit>('ft');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [depth, setDepth] = useState('4');
  const [diameter, setDiameter] = useState('');
  const [height, setHeight] = useState('');
  const [result, setResult] = useState<Result | null>(null);

  const toFeet = (val: string) => {
    const n = parseFloat(val) || 0;
    return unit === 'm' ? n * 3.28084 : n;
  };
  const toInches = (val: string) => {
    const n = parseFloat(val) || 0;
    return unit === 'm' ? n * 39.3701 : n;
  };

  const calculate = useCallback(() => {
    let cubicFeet = 0;

    if (shape === 'slab') {
      const l = toFeet(length);
      const w = toFeet(width);
      const d = toInches(depth) / 12;
      cubicFeet = l * w * d;
    } else if (shape === 'footing') {
      const l = toFeet(length);
      const w = toInches(width) / 12;
      const d = toInches(depth) / 12;
      cubicFeet = l * w * d;
    } else {
      const r = toInches(diameter) / 2 / 12;
      const h = toFeet(height);
      cubicFeet = Math.PI * r * r * h;
    }

    if (cubicFeet <= 0) { setResult(null); return; }

    const cubicYards = cubicFeet / 27;
    const bags40  = Math.ceil(cubicFeet / 0.306);
    const bags60  = Math.ceil(cubicFeet / 0.45);
    const bags80  = Math.ceil(cubicFeet / 0.60);
    const pricePerYard = { low: 110, high: 165 };

    setResult({
      cubicYards,
      cubicFeet,
      bags40, bags60, bags80,
      estimatedCost: {
        low:  Math.round(cubicYards * pricePerYard.low),
        high: Math.round(cubicYards * pricePerYard.high),
      },
    });
  }, [shape, unit, length, width, depth, diameter, height]);

  const fmt = (n: number, d = 2) => n.toFixed(d);
  const fmtInt = (n: number) => Math.ceil(n).toLocaleString();

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏗️</span>
          <h2 className="text-white font-bold text-lg">Concrete Calculator</h2>
        </div>
        <div className="flex bg-navy-700 rounded-lg p-0.5 text-xs font-semibold">
          {(['ft', 'm'] as Unit[]).map(u => (
            <button
              key={u}
              onClick={() => setUnit(u)}
              className={`px-3 py-1.5 rounded-md transition-all ${unit === u ? 'bg-brand-500 text-white' : 'text-slate-300 hover:text-white'}`}
            >
              {u === 'ft' ? 'Imperial' : 'Metric'}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Shape selector */}
        <div>
          <label className="calc-label">Shape</label>
          <div className="grid grid-cols-3 gap-2">
            {([
              { id: 'slab',    label: 'Slab',    icon: '▭' },
              { id: 'footing', label: 'Footing', icon: '▬' },
              { id: 'column',  label: 'Column',  icon: '⬛' },
            ] as { id: Shape; label: string; icon: string }[]).map(s => (
              <button
                key={s.id}
                onClick={() => setShape(s.id)}
                className={`flex flex-col items-center gap-1 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                  shape === s.id
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                <span className="text-lg">{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-4">
          {shape !== 'column' && (
            <div>
              <label className="calc-label">Length ({unit})</label>
              <input type="number" className="calc-input" placeholder="0" value={length} min="0"
                onChange={e => setLength(e.target.value)} />
            </div>
          )}
          {shape === 'slab' && (
            <div>
              <label className="calc-label">Width ({unit})</label>
              <input type="number" className="calc-input" placeholder="0" value={width} min="0"
                onChange={e => setWidth(e.target.value)} />
            </div>
          )}
          {shape === 'footing' && (
            <div>
              <label className="calc-label">Width ({unit === 'ft' ? 'in' : 'cm'})</label>
              <input type="number" className="calc-input" placeholder="0" value={width} min="0"
                onChange={e => setWidth(e.target.value)} />
            </div>
          )}
          {shape === 'column' && (
            <div>
              <label className="calc-label">Diameter ({unit === 'ft' ? 'in' : 'cm'})</label>
              <input type="number" className="calc-input" placeholder="0" value={diameter} min="0"
                onChange={e => setDiameter(e.target.value)} />
            </div>
          )}
          <div>
            <label className="calc-label">
              {shape === 'column' ? `Height (${unit})` : `Thickness (${unit === 'ft' ? 'in' : 'cm'})`}
            </label>
            <input type="number" className="calc-input" placeholder={shape === 'column' ? '8' : '4'} min="0"
              value={shape === 'column' ? height : depth}
              onChange={e => shape === 'column' ? setHeight(e.target.value) : setDepth(e.target.value)} />
          </div>
        </div>

        {/* CTA */}
        <button onClick={calculate}
          className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-colors text-base flex items-center justify-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/>
            <line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/>
          </svg>
          Calculate Concrete
        </button>

        {/* Results */}
        {result && (
          <div className="result-card space-y-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Results</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="result-value">{fmt(result.cubicYards)}</div>
                <div className="result-unit">Cubic Yards</div>
              </div>
              <div>
                <div className="result-value">{fmt(result.cubicFeet)}</div>
                <div className="result-unit">Cubic Feet</div>
              </div>
            </div>
            <div className="border-t border-navy-700 pt-4">
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Pre-mixed Bags Needed</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: '40 lb bags', val: result.bags40 },
                  { label: '60 lb bags', val: result.bags60 },
                  { label: '80 lb bags', val: result.bags80 },
                ].map(b => (
                  <div key={b.label} className="bg-navy-700 rounded-lg p-3 text-center">
                    <div className="text-brand-400 font-bold text-xl">{fmtInt(b.val)}</div>
                    <div className="text-slate-400 text-xs mt-0.5">{b.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-navy-700 pt-4 flex items-center justify-between">
              <span className="text-slate-400 text-sm">Estimated Cost (ready-mix)</span>
              <span className="text-brand-400 font-bold text-lg">
                ${result.estimatedCost.low.toLocaleString()} – ${result.estimatedCost.high.toLocaleString()}
              </span>
            </div>
            <p className="text-slate-500 text-xs">💡 Add 10% for waste and spillage</p>
          </div>
        )}
      </div>
    </div>
  );
}
