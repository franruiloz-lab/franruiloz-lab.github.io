import { useState } from 'react';

type LUnit = 'ft' | 'in' | 'yd' | 'm' | 'cm';
const TO_FT: Record<LUnit, number> = { ft: 1, in: 1/12, yd: 3, m: 3.28084, cm: 0.0328084 };

export default function CubicFeetCalc() {
  const [unit, setUnit] = useState<LUnit>('ft');
  const [l, setL] = useState('');
  const [w, setW] = useState('');
  const [h, setH] = useState('');
  const [result, setResult] = useState<{ ft3: number; yd3: number; m3: number; in3: number } | null>(null);

  const toFt = (v: string) => (parseFloat(v) || 0) * TO_FT[unit];

  const calculate = () => {
    const ft3 = toFt(l) * toFt(w) * toFt(h);
    if (ft3 <= 0) { setResult(null); return; }
    setResult({ ft3, yd3: ft3 / 27, m3: ft3 * 0.0283168, in3: ft3 * 1728 });
  };

  const units: LUnit[] = ['ft', 'in', 'yd', 'm', 'cm'];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📦</span>
          <h2 className="text-white font-bold text-lg">Cubic Feet Calculator</h2>
        </div>
        <select value={unit} onChange={e => setUnit(e.target.value as LUnit)}
          className="bg-navy-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border-0 focus:outline-none cursor-pointer">
          {units.map(u => <option key={u} value={u}>{u.toUpperCase()}</option>)}
        </select>
      </div>

      <div className="p-6 space-y-5">
        {/* Visual box diagram */}
        <div className="flex items-center justify-center py-4">
          <svg viewBox="0 0 200 140" className="w-48 h-32 text-slate-300" fill="none">
            {/* 3D box */}
            <polygon points="20,100 130,100 130,30 20,30" stroke="currentColor" strokeWidth="2" fill="white"/>
            <polygon points="130,100 170,70 170,0 130,30" stroke="currentColor" strokeWidth="2" fill="#f8fafc"/>
            <polygon points="20,30 60,0 170,0 130,30" stroke="currentColor" strokeWidth="2" fill="#f1f5f9"/>
            {/* Labels */}
            <text x="75" y="118" className="text-xs" fill="#f97316" fontSize="11" fontWeight="bold" textAnchor="middle">Length</text>
            <text x="158" y="90" fill="#f97316" fontSize="11" fontWeight="bold">Width</text>
            <text x="8" y="65" fill="#f97316" fontSize="11" fontWeight="bold">H</text>
            {/* Arrows */}
            <line x1="20" y1="108" x2="130" y2="108" stroke="#f97316" strokeWidth="1.5" markerEnd="url(#arr)"/>
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="calc-label">Length ({unit})</label>
            <input type="number" className="calc-input" placeholder="0" value={l} min="0" onChange={e => setL(e.target.value)} />
          </div>
          <div>
            <label className="calc-label">Width ({unit})</label>
            <input type="number" className="calc-input" placeholder="0" value={w} min="0" onChange={e => setW(e.target.value)} />
          </div>
          <div>
            <label className="calc-label">Height ({unit})</label>
            <input type="number" className="calc-input" placeholder="0" value={h} min="0" onChange={e => setH(e.target.value)} />
          </div>
        </div>

        <button onClick={calculate}
          className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-colors text-base">
          Calculate Volume
        </button>

        {result && (
          <div className="result-card space-y-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Results</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="result-value">{result.ft3.toFixed(3)}</div>
                <div className="result-unit">Cubic Feet (ft³)</div>
              </div>
              <div>
                <div className="result-value">{result.yd3.toFixed(4)}</div>
                <div className="result-unit">Cubic Yards (yd³)</div>
              </div>
              <div>
                <div className="result-value">{result.m3.toFixed(4)}</div>
                <div className="result-unit">Cubic Meters (m³)</div>
              </div>
              <div>
                <div className="result-value">{Math.round(result.in3).toLocaleString()}</div>
                <div className="result-unit">Cubic Inches (in³)</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
