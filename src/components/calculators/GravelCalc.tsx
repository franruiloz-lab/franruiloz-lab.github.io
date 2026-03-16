import { useState } from 'react';

type Material = 'gravel' | 'crushed_stone' | 'sand' | 'dirt' | 'mulch';
type Unit = 'ft' | 'm';

const DENSITIES: Record<Material, { name: string; tonPerYard: number; icon: string }> = {
  gravel:        { name: 'Gravel (pea/river)', tonPerYard: 1.4, icon: '🪨' },
  crushed_stone: { name: 'Crushed Stone',      tonPerYard: 1.5, icon: '🪨' },
  sand:          { name: 'Sand',               tonPerYard: 1.35, icon: '🏖️' },
  dirt:          { name: 'Fill Dirt',          tonPerYard: 1.1, icon: '🌱' },
  mulch:         { name: 'Mulch',              tonPerYard: 0.4, icon: '🍂' },
};

const PRICE_PER_TON = { low: 28, high: 55 };

export default function GravelCalc() {
  const [unit, setUnit] = useState<Unit>('ft');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [depth, setDepth] = useState('3');
  const [material, setMaterial] = useState<Material>('gravel');
  const [result, setResult] = useState<{ yards: number; tons: number; costLow: number; costHigh: number } | null>(null);

  const toFt = (v: string) => (parseFloat(v) || 0) * (unit === 'm' ? 3.28084 : 1);
  const toInches = (v: string) => (parseFloat(v) || 0) * (unit === 'm' ? 39.3701 : 1);

  const calculate = () => {
    const l = toFt(length);
    const w = toFt(width);
    const d = toInches(depth) / 12;
    const cubicFt = l * w * d;
    if (cubicFt <= 0) { setResult(null); return; }
    const yards = cubicFt / 27;
    const tons  = yards * DENSITIES[material].tonPerYard;
    setResult({
      yards,
      tons,
      costLow:  Math.round(tons * PRICE_PER_TON.low),
      costHigh: Math.round(tons * PRICE_PER_TON.high),
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🪨</span>
          <h2 className="text-white font-bold text-lg">Gravel Calculator</h2>
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
        <div>
          <label className="calc-label">Material</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(Object.entries(DENSITIES) as [Material, typeof DENSITIES[Material]][]).map(([id, mat]) => (
              <button key={id} onClick={() => setMaterial(id)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                  material === id ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}>
                <span>{mat.icon}</span>
                <span className="truncate text-xs">{mat.name.split(' (')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div><label className="calc-label">Length ({unit})</label>
            <input type="number" className="calc-input" placeholder="0" value={length} min="0" onChange={e => setLength(e.target.value)} /></div>
          <div><label className="calc-label">Width ({unit})</label>
            <input type="number" className="calc-input" placeholder="0" value={width} min="0" onChange={e => setWidth(e.target.value)} /></div>
          <div className="col-span-2">
            <label className="calc-label">Depth ({unit === 'ft' ? 'inches' : 'cm'})</label>
            <input type="number" className="calc-input" placeholder="3" value={depth} min="0" onChange={e => setDepth(e.target.value)} />
          </div>
        </div>

        <button onClick={calculate}
          className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-colors text-base">
          Calculate Gravel
        </button>

        {result && (
          <div className="result-card space-y-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Results — {DENSITIES[material].name}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="result-value">{result.yards.toFixed(2)}</div>
                <div className="result-unit">Cubic Yards</div>
              </div>
              <div>
                <div className="result-value">{result.tons.toFixed(2)}</div>
                <div className="result-unit">Tons</div>
              </div>
            </div>
            <div className="border-t border-navy-700 pt-4 flex items-center justify-between">
              <span className="text-slate-400 text-sm">Estimated Cost</span>
              <span className="text-brand-400 font-bold text-lg">
                ${result.costLow.toLocaleString()} – ${result.costHigh.toLocaleString()}
              </span>
            </div>
            <p className="text-slate-500 text-xs">💡 Prices vary by region. Get local quotes for accuracy.</p>
          </div>
        )}
      </div>
    </div>
  );
}
