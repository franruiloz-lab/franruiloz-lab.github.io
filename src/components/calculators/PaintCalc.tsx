import { useState } from 'react';
type Finish = 'flat' | 'eggshell' | 'satin' | 'semi_gloss' | 'gloss';
const COVERAGE = 350; // sq ft per gallon
const FINISHES: Record<Finish, { label: string; use: string }> = {
  flat:       { label: 'Flat / Matte',  use: 'Ceilings, low-traffic walls' },
  eggshell:   { label: 'Eggshell',      use: 'Living rooms, bedrooms' },
  satin:      { label: 'Satin',         use: 'Kitchens, bathrooms, hallways' },
  semi_gloss: { label: 'Semi-Gloss',    use: 'Trim, doors, cabinets' },
  gloss:      { label: 'Gloss',         use: 'Doors, furniture, highlights' },
};
const PRICES: Record<Finish, { low: number; high: number }> = {
  flat:       { low: 25, high: 55 },
  eggshell:   { low: 30, high: 60 },
  satin:      { low: 35, high: 65 },
  semi_gloss: { low: 35, high: 70 },
  gloss:      { low: 40, high: 80 },
};
export default function PaintCalc() {
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('9');
  const [doors, setDoors] = useState('2');
  const [windows, setWindows] = useState('2');
  const [coats, setCoats] = useState('2');
  const [finish, setFinish] = useState<Finish>('eggshell');
  const [result, setResult] = useState<any>(null);
  const calculate = () => {
    const l = parseFloat(length) || 0, w = parseFloat(width) || 0;
    const h = parseFloat(height) || 9;
    const d = parseInt(doors) || 0, wi = parseInt(windows) || 0;
    const c = parseInt(coats) || 2;
    if (l <= 0 || w <= 0) { setResult(null); return; }
    const wallArea = 2 * (l + w) * h;
    const doorArea = d * 21; // 3x7 ft doors
    const windowArea = wi * 15; // avg window
    const netArea = Math.max(0, wallArea - doorArea - windowArea);
    const totalArea = netArea * c;
    const gallons = totalArea / COVERAGE;
    const gallonsNeeded = Math.ceil(gallons);
    const price = PRICES[finish];
    setResult({
      wallArea: Math.round(wallArea),
      netArea: Math.round(netArea),
      gallons: gallons.toFixed(2),
      gallonsNeeded,
      costLow:  Math.round(gallonsNeeded * price.low),
      costHigh: Math.round(gallonsNeeded * price.high),
    });
  };
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4">
        <div className="flex items-center gap-2"><span className="text-2xl">🎨</span><h2 className="text-white font-bold text-lg">Paint Calculator</h2></div>
      </div>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div><label className="calc-label">Length (ft)</label><input type="number" className="calc-input" placeholder="0" value={length} min="0" onChange={e=>setLength(e.target.value)}/></div>
          <div><label className="calc-label">Width (ft)</label><input type="number" className="calc-input" placeholder="0" value={width} min="0" onChange={e=>setWidth(e.target.value)}/></div>
          <div><label className="calc-label">Ceiling Height (ft)</label><input type="number" className="calc-input" placeholder="9" value={height} min="0" onChange={e=>setHeight(e.target.value)}/></div>
          <div><label className="calc-label">Doors</label><input type="number" className="calc-input" placeholder="2" value={doors} min="0" onChange={e=>setDoors(e.target.value)}/></div>
          <div><label className="calc-label">Windows</label><input type="number" className="calc-input" placeholder="2" value={windows} min="0" onChange={e=>setWindows(e.target.value)}/></div>
          <div><label className="calc-label">Coats</label><input type="number" className="calc-input" placeholder="2" value={coats} min="1" max="4" onChange={e=>setCoats(e.target.value)}/></div>
        </div>
        <div><label className="calc-label">Paint Finish</label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.entries(FINISHES) as [Finish, typeof FINISHES[Finish]][]).map(([id, f]) => (
              <button key={id} onClick={()=>setFinish(id)} className={`text-xs py-2 px-2 rounded-xl border-2 font-semibold transition-all ${finish===id?'border-brand-500 bg-brand-50 text-brand-700':'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                {f.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-1.5">Best for: {FINISHES[finish].use}</p>
        </div>
        <button onClick={calculate} className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-colors">Calculate Paint</button>
        {result && (
          <div className="result-card space-y-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Results ({coats} coats)</p>
            <div className="grid grid-cols-2 gap-4">
              <div><div className="result-value">{result.gallons}</div><div className="result-unit">Gallons needed</div></div>
              <div><div className="result-value">{result.gallonsNeeded}</div><div className="result-unit">Gallons to buy</div></div>
              <div><div className="result-value">{result.netArea.toLocaleString()}</div><div className="result-unit">Net paintable sq ft</div></div>
            </div>
            <div className="border-t border-navy-700 pt-4 flex items-center justify-between">
              <span className="text-slate-400 text-sm">Paint Cost Estimate ({FINISHES[finish].label})</span>
              <span className="text-brand-400 font-bold text-lg">${result.costLow} – ${result.costHigh}</span>
            </div>
            <p className="text-slate-500 text-xs">💡 Coverage: ~{COVERAGE} sq ft/gallon. Dark colors may need 3 coats.</p>
          </div>
        )}
      </div>
    </div>
  );
}
