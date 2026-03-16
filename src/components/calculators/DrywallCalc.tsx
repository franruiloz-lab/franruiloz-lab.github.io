import { useState } from 'react';
type SheetSize = '4x8' | '4x9' | '4x12';
const SHEET_AREA: Record<SheetSize, number> = { '4x8': 32, '4x9': 36, '4x12': 48 };
export default function DrywallCalc() {
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('9');
  const [doors, setDoors] = useState('2');
  const [windows, setWindows] = useState('2');
  const [sheetSize, setSheetSize] = useState<SheetSize>('4x8');
  const [includeCeiling, setIncludeCeiling] = useState(true);
  const [result, setResult] = useState<any>(null);
  const calculate = () => {
    const l = parseFloat(length)||0, w = parseFloat(width)||0, h = parseFloat(height)||9;
    const d = parseInt(doors)||0, wi = parseInt(windows)||0;
    if (l<=0||w<=0) { setResult(null); return; }
    const wallArea = 2*(l+w)*h;
    const ceilingArea = includeCeiling ? l*w : 0;
    const doorArea = d*21, windowArea = wi*15;
    const netArea = wallArea + ceilingArea - doorArea - windowArea;
    const sheetsRaw = netArea / SHEET_AREA[sheetSize];
    const sheetsNeeded = Math.ceil(sheetsRaw * 1.1); // +10% waste
    const screws = Math.ceil(sheetsNeeded * 28);
    const jointCompound = Math.ceil(sheetsNeeded * 0.1); // gallons
    setResult({ netArea: Math.round(netArea), sheetsNeeded, screws, jointCompound,
      costLow: Math.round(sheetsNeeded * 12), costHigh: Math.round(sheetsNeeded * 20) });
  };
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4">
        <div className="flex items-center gap-2"><span className="text-2xl">🧱</span><h2 className="text-white font-bold text-lg">Drywall Calculator</h2></div>
      </div>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div><label className="calc-label">Length (ft)</label><input type="number" className="calc-input" placeholder="0" value={length} min="0" onChange={e=>setLength(e.target.value)}/></div>
          <div><label className="calc-label">Width (ft)</label><input type="number" className="calc-input" placeholder="0" value={width} min="0" onChange={e=>setWidth(e.target.value)}/></div>
          <div><label className="calc-label">Ceiling Height (ft)</label><input type="number" className="calc-input" placeholder="9" value={height} min="0" onChange={e=>setHeight(e.target.value)}/></div>
          <div><label className="calc-label">Doors</label><input type="number" className="calc-input" placeholder="2" value={doors} min="0" onChange={e=>setDoors(e.target.value)}/></div>
          <div><label className="calc-label">Windows</label><input type="number" className="calc-input" placeholder="2" value={windows} min="0" onChange={e=>setWindows(e.target.value)}/></div>
          <div><label className="calc-label">Sheet Size</label>
            <select value={sheetSize} onChange={e=>setSheetSize(e.target.value as SheetSize)} className="calc-select">
              {(['4x8','4x9','4x12'] as SheetSize[]).map(s => <option key={s} value={s}>{s} ft ({SHEET_AREA[s]} sq ft)</option>)}
            </select>
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={includeCeiling} onChange={e=>setIncludeCeiling(e.target.checked)} className="w-4 h-4 accent-brand-500"/>
          <span className="text-sm font-medium text-navy-800">Include ceiling</span>
        </label>
        <button onClick={calculate} className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-colors">Calculate Drywall</button>
        {result && (
          <div className="result-card space-y-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Results</p>
            <div className="grid grid-cols-3 gap-3">
              {[{ label: `${sheetSize} Sheets`, val: result.sheetsNeeded }, { label: 'Screws (1⅝")', val: result.screws }, { label: 'Joint Compound (gal)', val: result.jointCompound }].map(b => (
                <div key={b.label} className="bg-navy-700 rounded-lg p-3 text-center">
                  <div className="text-brand-400 font-bold text-2xl">{b.val}</div>
                  <div className="text-slate-400 text-xs mt-0.5">{b.label}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-navy-700 pt-4 flex items-center justify-between">
              <span className="text-slate-400 text-sm">Material Cost Estimate</span>
              <span className="text-brand-400 font-bold text-lg">${result.costLow} – ${result.costHigh}</span>
            </div>
            <p className="text-slate-500 text-xs">💡 Already includes 10% waste. Labor adds ~$1.50–2.50/sq ft.</p>
          </div>
        )}
      </div>
    </div>
  );
}
