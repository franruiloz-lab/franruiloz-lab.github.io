import { useState } from 'react';
type Style = 'wood_privacy' | 'chain_link' | 'vinyl' | 'split_rail' | 'aluminum';
const STYLES: Record<Style, { label: string; icon: string; postSpacing: number; railsPerSection: number; boardsPerFoot: number; costLow: number; costHigh: number }> = {
  wood_privacy: { label: 'Wood Privacy', icon: '🌲', postSpacing: 8, railsPerSection: 2, boardsPerFoot: 1.5, costLow: 15, costHigh: 30 },
  chain_link:   { label: 'Chain Link',   icon: '⛓️', postSpacing: 10, railsPerSection: 1, boardsPerFoot: 0, costLow: 8, costHigh: 18 },
  vinyl:        { label: 'Vinyl',        icon: '🏠', postSpacing: 8, railsPerSection: 2, boardsPerFoot: 1.5, costLow: 25, costHigh: 45 },
  split_rail:   { label: 'Split Rail',   icon: '🪵', postSpacing: 8, railsPerSection: 2, boardsPerFoot: 0, costLow: 12, costHigh: 22 },
  aluminum:     { label: 'Aluminum',     icon: '🔩', postSpacing: 6, railsPerSection: 2, boardsPerFoot: 1, costLow: 20, costHigh: 35 },
};
export default function FenceCalc() {
  const [style, setStyle] = useState<Style>('wood_privacy');
  const [linearFt, setLinearFt] = useState('');
  const [height, setHeight] = useState('6');
  const [gates, setGates] = useState('1');
  const [result, setResult] = useState<any>(null);
  const calculate = () => {
    const lf = parseFloat(linearFt) || 0;
    if (lf <= 0) { setResult(null); return; }
    const s = STYLES[style];
    const posts = Math.ceil(lf / s.postSpacing) + 1;
    const sections = posts - 1;
    const rails = sections * s.railsPerSection;
    const boards = s.boardsPerFoot > 0 ? Math.ceil(lf * s.boardsPerFoot) : 0;
    const costLow = Math.round(lf * s.costLow);
    const costHigh = Math.round(lf * s.costHigh);
    setResult({ posts, rails, boards, costLow, costHigh, lf });
  };
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4">
        <div className="flex items-center gap-2"><span className="text-2xl">🏡</span><h2 className="text-white font-bold text-lg">Fence Calculator</h2></div>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <label className="calc-label">Fence Style</label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.entries(STYLES) as [Style, typeof STYLES[Style]][]).map(([id, s]) => (
              <button key={id} onClick={() => setStyle(id)} className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border-2 text-xs font-semibold transition-all ${style===id?'border-brand-500 bg-brand-50 text-brand-700':'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                <span className="text-lg">{s.icon}</span>{s.label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2"><label className="calc-label">Total Linear Feet</label><input type="number" className="calc-input" placeholder="100" value={linearFt} min="0" onChange={e=>setLinearFt(e.target.value)}/></div>
          <div><label className="calc-label">Height (ft)</label><input type="number" className="calc-input" placeholder="6" value={height} min="0" onChange={e=>setHeight(e.target.value)}/></div>
        </div>
        <div><label className="calc-label">Number of Gates</label><input type="number" className="calc-input" placeholder="1" value={gates} min="0" onChange={e=>setGates(e.target.value)}/></div>
        <button onClick={calculate} className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-colors">Calculate Fence</button>
        {result && (
          <div className="result-card space-y-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Results — {STYLES[style].label}</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Posts', val: result.posts },
                { label: 'Rails', val: result.rails },
                ...(result.boards > 0 ? [{ label: 'Boards', val: result.boards }] : [{ label: 'Linear Ft', val: result.lf }]),
              ].map(b => (
                <div key={b.label} className="bg-navy-700 rounded-lg p-3 text-center">
                  <div className="text-brand-400 font-bold text-2xl">{b.val}</div>
                  <div className="text-slate-400 text-xs mt-0.5">{b.label}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-navy-700 pt-4 flex items-center justify-between">
              <span className="text-slate-400 text-sm">Estimated Cost (materials)</span>
              <span className="text-brand-400 font-bold text-lg">${result.costLow.toLocaleString()} – ${result.costHigh.toLocaleString()}</span>
            </div>
            <p className="text-slate-500 text-xs">💡 Add 10% for waste. Gates cost $150–800+ each installed.</p>
          </div>
        )}
      </div>
    </div>
  );
}
