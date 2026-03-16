import { useState } from 'react';
export default function GroutCalc() {
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [tileLength, setTileLength] = useState('12');
  const [tileWidth, setTileWidth] = useState('12');
  const [jointWidth, setJointWidth] = useState('0.125');
  const [tileDepth, setTileDepth] = useState('0.375');
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const areaSqFt = (parseFloat(length)||0) * (parseFloat(width)||0);
    if (areaSqFt <= 0) { setResult(null); return; }
    const tl = parseFloat(tileLength) || 12;
    const tw = parseFloat(tileWidth) || 12;
    const jw = parseFloat(jointWidth) || 0.125;
    const td = parseFloat(tileDepth) || 0.375;
    // Grout volume formula: Area × (jw / (tl + jw)) × (td / (tw + jw)) × (...)
    // Standard industry formula: cubic inches per sq ft = [2×jw×td × (tl+tw) / (tl×tw)] in inch units
    const areaSqIn = areaSqFt * 144;
    const groutCuIn = areaSqIn * (2 * jw * td * (tl + tw)) / (tl * tw * (tl + jw) * (tw + jw) / (jw * td));
    // Simplified accepted formula: volume = area_sqft × (jw/(tl+jw) + jw/(tw+jw)) × td/12 × 144
    const factor = (jw / (tl + jw)) + (jw / (tw + jw));
    const groutCuFt = areaSqFt * factor * (td / 12);
    const groutCuIn2 = groutCuFt * 1728;
    // 1 lb of unsanded grout covers ~20 cu in; 1 lb sanded ~25 cu in
    const unsandedLbs = Math.ceil((groutCuIn2 / 20) * 1.1);
    const sandedLbs = Math.ceil((groutCuIn2 / 25) * 1.1);
    // 25-lb bag recommended for big areas
    const bags10 = Math.ceil(sandedLbs / 10);
    const bags25 = Math.ceil(sandedLbs / 25);

    setResult({
      areaSqFt: Math.round(areaSqFt),
      groutCuIn: Math.round(groutCuIn2),
      unsandedLbs,
      sandedLbs,
      bags10,
      bags25,
      costLow: Math.round(sandedLbs * 0.6),
      costHigh: Math.round(sandedLbs * 1.2),
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4">
        <div className="flex items-center gap-2"><span className="text-2xl">🔲</span><h2 className="text-white font-bold text-lg">Grout Calculator</h2></div>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <p className="calc-label">Tiled Area (ft)</p>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="calc-label">Length</label><input type="number" className="calc-input" placeholder="0" value={length} min="0" onChange={e=>setLength(e.target.value)}/></div>
            <div><label className="calc-label">Width</label><input type="number" className="calc-input" placeholder="0" value={width} min="0" onChange={e=>setWidth(e.target.value)}/></div>
          </div>
        </div>
        <div>
          <p className="calc-label">Tile Size (inches)</p>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="calc-label">Tile Length</label><input type="number" className="calc-input" placeholder="12" value={tileLength} min="0" onChange={e=>setTileLength(e.target.value)}/></div>
            <div><label className="calc-label">Tile Width</label><input type="number" className="calc-input" placeholder="12" value={tileWidth} min="0" onChange={e=>setTileWidth(e.target.value)}/></div>
          </div>
        </div>
        <div><label className="calc-label">Grout Joint Width</label>
          <select value={jointWidth} onChange={e=>setJointWidth(e.target.value)} className="calc-select">
            <option value="0.0625">1/16" — Rectified / large format tile</option>
            <option value="0.125">1/8" — Standard floor tile</option>
            <option value="0.1875">3/16" — Wall tile</option>
            <option value="0.25">1/4" — Rustic / uneven tile</option>
            <option value="0.375">3/8" — Tumbled stone</option>
            <option value="0.5">1/2" — Large gaps</option>
          </select>
        </div>
        <div><label className="calc-label">Tile Thickness (inches)</label>
          <select value={tileDepth} onChange={e=>setTileDepth(e.target.value)} className="calc-select">
            <option value="0.25">1/4" — Thin mosaic</option>
            <option value="0.375">3/8" — Standard ceramic</option>
            <option value="0.5">1/2" — Porcelain / stone</option>
            <option value="0.625">5/8" — Heavy stone</option>
          </select>
        </div>
        <button onClick={calculate} className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-colors">Calculate Grout</button>
        {result && (
          <div className="result-card space-y-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Results</p>
            <div className="grid grid-cols-2 gap-4">
              <div><div className="result-value">{result.sandedLbs}</div><div className="result-unit">Lbs sanded grout</div></div>
              <div><div className="result-value">{result.unsandedLbs}</div><div className="result-unit">Lbs unsanded grout</div></div>
              <div><div className="result-value">{result.bags10}</div><div className="result-unit">10-lb bags</div></div>
              <div><div className="result-value">{result.bags25}</div><div className="result-unit">25-lb bags</div></div>
            </div>
            <div className="border-t border-navy-700 pt-4 flex items-center justify-between">
              <span className="text-slate-400 text-sm">Material Cost Estimate</span>
              <span className="text-brand-400 font-bold text-lg">${result.costLow} – ${result.costHigh}</span>
            </div>
            <p className="text-slate-500 text-xs">💡 Use sanded grout for joints 1/8" or wider. Unsanded for narrower joints or polished stone.</p>
          </div>
        )}
      </div>
    </div>
  );
}
