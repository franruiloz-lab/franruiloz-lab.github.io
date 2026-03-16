import { useState } from 'react';

type ProjectType = 'house' | 'addition' | 'garage' | 'deck' | 'basement' | 'bathroom' | 'kitchen';
type Quality = 'basic' | 'mid' | 'premium';
type Region = 'low' | 'avg' | 'high';

const COSTS: Record<ProjectType, Record<Quality, [number, number]>> = {
  house:    { basic: [100, 150], mid: [150, 250], premium: [250, 500] },
  addition: { basic: [80,  140], mid: [140, 220], premium: [220, 400] },
  garage:   { basic: [35,  60],  mid: [60,  100], premium: [100, 200] },
  deck:     { basic: [15,  30],  mid: [30,  50],  premium: [50,  100] },
  basement: { basic: [25,  50],  mid: [50,  90],  premium: [90,  200] },
  bathroom: { basic: [70,  120], mid: [120, 200], premium: [200, 500] },
  kitchen:  { basic: [100, 175], mid: [175, 300], premium: [300, 800] },
};
const REGION_MULT: Record<Region, number> = { low: 0.8, avg: 1.0, high: 1.4 };
const PROJECT_LABELS: Record<ProjectType, string> = {
  house: '🏠 New Home', addition: '🧱 Addition', garage: '🚗 Garage',
  deck: '🪵 Deck', basement: '🏚️ Basement', bathroom: '🚿 Bathroom', kitchen: '🍳 Kitchen',
};

export default function BuildingCostCalc() {
  const [type, setType] = useState<ProjectType>('house');
  const [sqft, setSqft] = useState('');
  const [quality, setQuality] = useState<Quality>('mid');
  const [region, setRegion] = useState<Region>('avg');
  const [result, setResult] = useState<{ low: number; high: number; perSqft: [number, number] } | null>(null);

  const calculate = () => {
    const area = parseFloat(sqft) || 0;
    if (area <= 0) { setResult(null); return; }
    const [baseL, baseH] = COSTS[type][quality];
    const mult = REGION_MULT[region];
    const low  = Math.round(area * baseL * mult);
    const high = Math.round(area * baseH * mult);
    setResult({ low, high, perSqft: [Math.round(baseL * mult), Math.round(baseH * mult)] });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏗️</span>
          <h2 className="text-white font-bold text-lg">Construction Cost Calculator</h2>
        </div>
        <p className="text-slate-400 text-xs mt-1">Budget estimates based on national averages</p>
      </div>

      <div className="p-6 space-y-5">
        {/* Project type */}
        <div>
          <label className="calc-label">Project Type</label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {(Object.entries(PROJECT_LABELS) as [ProjectType, string][]).map(([id, label]) => (
              <button key={id} onClick={() => setType(id)}
                className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl border-2 text-xs font-semibold transition-all text-center ${
                  type === id ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'
                }`}>
                <span className="text-xl">{label.split(' ')[0]}</span>
                <span>{label.split(' ').slice(1).join(' ')}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="calc-label">Area (square feet)</label>
          <input type="number" className="calc-input" placeholder="e.g. 1500" value={sqft} min="0"
            onChange={e => setSqft(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="calc-label">Build Quality</label>
            <div className="space-y-1.5">
              {(['basic', 'mid', 'premium'] as Quality[]).map(q => (
                <button key={q} onClick={() => setQuality(q)}
                  className={`w-full text-left px-3 py-2 rounded-lg border text-sm font-medium transition-all capitalize ${
                    quality === q ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}>
                  {q === 'basic' ? '🔧 Basic' : q === 'mid' ? '⭐ Mid-Range' : '💎 Premium'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="calc-label">Region (labor costs)</label>
            <div className="space-y-1.5">
              {(['low', 'avg', 'high'] as Region[]).map(r => (
                <button key={r} onClick={() => setRegion(r)}
                  className={`w-full text-left px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                    region === r ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}>
                  {r === 'low' ? '📍 Rural/Low' : r === 'avg' ? '🏙️ Average' : '🌆 Urban/High'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={calculate}
          className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-colors text-base">
          Estimate Cost
        </button>

        {result && (
          <div className="result-card space-y-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Estimated Total Cost</p>
            <div>
              <div className="text-4xl font-extrabold text-brand-400">
                ${result.low.toLocaleString()} – ${result.high.toLocaleString()}
              </div>
              <div className="text-slate-400 text-sm mt-1">
                ${result.perSqft[0]}–${result.perSqft[1]} per sq ft
              </div>
            </div>
            <div className="bg-navy-700 rounded-xl p-4 text-xs text-slate-400 leading-relaxed">
              ⚠️ These are rough estimates only. Actual costs vary significantly based on location, contractor, materials, and project complexity. Always get at least 3 quotes from licensed contractors.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
