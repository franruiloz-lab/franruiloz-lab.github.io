import { useState } from 'react';

type InputMode = 'radius' | 'diameter' | 'circumference' | 'area';
type Unit = 'in' | 'ft' | 'yd' | 'm' | 'cm';

const INPUT_MODES: { id: InputMode; label: string }[] = [
  { id: 'radius',        label: 'Radius' },
  { id: 'diameter',      label: 'Diameter' },
  { id: 'circumference', label: 'Circumference' },
  { id: 'area',          label: 'Area' },
];

const UNITS: { id: Unit; label: string }[] = [
  { id: 'in', label: 'Inches' },
  { id: 'ft', label: 'Feet' },
  { id: 'yd', label: 'Yards' },
  { id: 'm',  label: 'Meters' },
  { id: 'cm', label: 'Centimeters' },
];

export default function CircleCalc() {
  const [inputMode, setInputMode] = useState<InputMode>('radius');
  const [unit, setUnit] = useState<Unit>('ft');
  const [value, setValue] = useState('');
  const [result, setResult] = useState<{
    radius: number;
    diameter: number;
    circumference: number;
    area: number;
  } | null>(null);

  const calculate = () => {
    const v = parseFloat(value) || 0;
    if (v <= 0) { setResult(null); return; }

    let r = 0;
    if (inputMode === 'radius')        r = v;
    else if (inputMode === 'diameter') r = v / 2;
    else if (inputMode === 'circumference') r = v / (2 * Math.PI);
    else if (inputMode === 'area')     r = Math.sqrt(v / Math.PI);

    if (r <= 0) { setResult(null); return; }

    setResult({
      radius:        Math.round(r * 10000) / 10000,
      diameter:      Math.round(r * 2 * 10000) / 10000,
      circumference: Math.round(2 * Math.PI * r * 10000) / 10000,
      area:          Math.round(Math.PI * r * r * 10000) / 10000,
    });
  };

  const inputLabel: Record<InputMode, string> = {
    radius:        `Radius (${unit})`,
    diameter:      `Diameter (${unit})`,
    circumference: `Circumference (${unit})`,
    area:          `Area (${unit}²)`,
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⭕</span>
          <h2 className="text-white font-bold text-lg">Circle Calculator</h2>
        </div>
      </div>

      <div className="p-6 space-y-5">
        <div>
          <label className="calc-label">Known Value</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {INPUT_MODES.map(m => (
              <button
                key={m.id}
                onClick={() => { setInputMode(m.id); setResult(null); setValue(''); }}
                className={`py-2.5 px-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                  inputMode === m.id
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="calc-label">Unit</label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {UNITS.map(u => (
              <button
                key={u.id}
                onClick={() => setUnit(u.id)}
                className={`py-2.5 px-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                  unit === u.id
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                {u.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="calc-label">{inputLabel[inputMode]}</label>
          <input
            type="number"
            className="calc-input"
            placeholder="0"
            value={value}
            min="0"
            onChange={e => setValue(e.target.value)}
          />
        </div>

        <button
          onClick={calculate}
          className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-colors text-base"
        >
          Calculate Circle
        </button>

        {result && (
          <div className="result-card space-y-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
              Results ({unit})
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="result-value">{result.area.toLocaleString()}</div>
                <div className="result-unit">Area ({unit}²)</div>
              </div>
              <div>
                <div className="result-value">{result.circumference.toLocaleString()}</div>
                <div className="result-unit">Circumference ({unit})</div>
              </div>
              <div>
                <div className="result-value">{result.diameter.toLocaleString()}</div>
                <div className="result-unit">Diameter ({unit})</div>
              </div>
              <div>
                <div className="result-value">{result.radius.toLocaleString()}</div>
                <div className="result-unit">Radius ({unit})</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
