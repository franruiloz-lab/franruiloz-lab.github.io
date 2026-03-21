import { useState } from 'react';
type GutterStyle = 'kstyle5' | 'kstyle6' | 'halfround5' | 'halfround6';
type Material = 'aluminum' | 'vinyl' | 'steel' | 'copper';
const STYLES: Record<GutterStyle, { label: string }> = {
  kstyle5:    { label: 'K-Style 5"' },
  kstyle6:    { label: 'K-Style 6"' },
  halfround5: { label: 'Half-Round 5"' },
  halfround6: { label: 'Half-Round 6"' },
};
const MATERIALS: Record<Material, { label: string; costLow: number; costHigh: number }> = {
  aluminum: { label: 'Aluminum',  costLow: 3,  costHigh: 8  },
  vinyl:    { label: 'Vinyl',     costLow: 1,  costHigh: 3  },
  steel:    { label: 'Steel',     costLow: 4,  costHigh: 9  },
  copper:   { label: 'Copper',   costLow: 15, costHigh: 25 },
};
export default function GutterCalc() {
  const [perimeter, setPerimeter] = useState('');
  const [corners, setCorners] = useState('4');
  const [style, setStyle] = useState<GutterStyle>('kstyle5');
  const [material, setMaterial] = useState<Material>('aluminum');
  const [stories, setStories] = useState<'1' | '1.5' | '2' | '2.5'>('1');
  const [result, setResult] = useState<any>(null);
  const calculate = () => {
    const perim = parseFloat(perimeter) || 0;
    const cornersN = parseFloat(corners) || 4;
    if (perim <= 0) { setResult(null); return; }
    const linearFt = perim;
    const downspouts = Math.ceil(perim / 25);
    const elbows = downspouts * 2 + Math.round(cornersN);
    const hangers = Math.ceil(linearFt / 3);
    const endCaps = cornersN * 2;
    const mat = MATERIALS[material];
    const storiesMultiplier = parseFloat(stories);
    const laborRate = 1.4 * storiesMultiplier;
    const matCostLow = Math.round(linearFt * mat.costLow);
    const matCostHigh = Math.round(linearFt * mat.costHigh);
    const totalLow = Math.round(matCostLow * laborRate);
    const totalHigh = Math.round(matCostHigh * laborRate);
    setResult({ linearFt, downspouts, elbows, hangers, endCaps: Math.round(endCaps), matCostLow, matCostHigh, totalLow, totalHigh });
  };
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4">
        <div className="flex items-center gap-2"><span className="text-2xl">🏠</span><h2 className="text-white font-bold text-lg">Gutter Calculator</h2></div>
      </div>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="calc-label">House Perimeter (ft)</label>
            <input type="number" className="calc-input" placeholder="200" value={perimeter} min="0" onChange={e => setPerimeter(e.target.value)} />
          </div>
          <div>
            <label className="calc-label">Number of Corners</label>
            <input type="number" className="calc-input" placeholder="4" value={corners} min="2" onChange={e => setCorners(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="calc-label">Gutter Style</label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.entries(STYLES) as [GutterStyle, typeof STYLES[GutterStyle]][]).map(([id, s]) => (
              <button key={id} onClick={() => setStyle(id)} className={`py-2.5 px-3 rounded-xl border-2 text-sm font-semibold transition-all ${style === id ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="calc-label">Material</label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.entries(MATERIALS) as [Material, typeof MATERIALS[Material]][]).map(([id, m]) => (
              <button key={id} onClick={() => setMaterial(id)} className={`py-2.5 px-3 rounded-xl border-2 text-sm font-semibold transition-all ${material === id ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                {m.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="calc-label">Stories</label>
          <div className="grid grid-cols-4 gap-2">
            {(['1', '1.5', '2', '2.5'] as const).map(s => (
              <button key={s} onClick={() => setStories(s)} className={`py-2.5 px-3 rounded-xl border-2 text-sm font-semibold transition-all ${stories === s ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <button onClick={calculate} className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-colors">Calculate Gutters</button>
        {result && (
          <div className="result-card space-y-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Results — {STYLES[style].label} {MATERIALS[material].label}</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Linear Ft', val: result.linearFt },
                { label: 'Downspouts', val: result.downspouts },
                { label: 'Elbows', val: result.elbows },
                { label: 'Hangers', val: result.hangers },
                { label: 'End Caps', val: result.endCaps },
              ].map(b => (
                <div key={b.label} className="bg-navy-700 rounded-lg p-3 text-center">
                  <div className="text-brand-400 font-bold text-2xl">{b.val}</div>
                  <div className="text-slate-400 text-xs mt-0.5">{b.label}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-navy-700 pt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Materials Only</span>
                <span className="text-slate-300 font-semibold">${result.matCostLow.toLocaleString()} – ${result.matCostHigh.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Installed Estimate (incl. labor)</span>
                <span className="text-brand-400 font-bold text-lg">${result.totalLow.toLocaleString()} – ${result.totalHigh.toLocaleString()}</span>
              </div>
            </div>
            <p className="text-slate-500 text-xs">💡 One downspout per 25 ft of gutter. Add 10% for waste on material orders.</p>
          </div>
        )}
      </div>
    </div>
  );
}
