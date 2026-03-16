import { useState } from 'react';
export default function TileCalc() {
  const [roomLength, setRoomLength] = useState('');
  const [roomWidth, setRoomWidth] = useState('');
  const [tileLength, setTileLength] = useState('12');
  const [tileWidth, setTileWidth] = useState('12');
  const [tileUnit, setTileUnit] = useState<'in'|'cm'>('in');
  const [waste, setWaste] = useState('10');
  const [result, setResult] = useState<any>(null);
  const calculate = () => {
    const roomSqFt = (parseFloat(roomLength)||0)*(parseFloat(roomWidth)||0);
    if (roomSqFt<=0) { setResult(null); return; }
    const tl = parseFloat(tileLength)||12, tw = parseFloat(tileWidth)||12;
    const tileSqFt = tileUnit==='in' ? (tl/12)*(tw/12) : (tl*0.0328084)*(tw*0.0328084);
    const wasteMultiplier = 1 + (parseFloat(waste)||10)/100;
    const totalSqFt = roomSqFt * wasteMultiplier;
    const tilesNeeded = Math.ceil(totalSqFt/tileSqFt);
    const boxesOf10 = Math.ceil(tilesNeeded/10);
    const boxesOf15 = Math.ceil(tilesNeeded/15);
    setResult({
      roomSqFt: Math.round(roomSqFt), totalSqFt: Math.round(totalSqFt),
      tilesNeeded, boxesOf10, boxesOf15,
      tileSqFt: tileSqFt.toFixed(3),
      costLow: Math.round(totalSqFt*2), costHigh: Math.round(totalSqFt*12),
    });
  };
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4">
        <div className="flex items-center gap-2"><span className="text-2xl">⬜</span><h2 className="text-white font-bold text-lg">Tile Calculator</h2></div>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <p className="calc-label">Room Dimensions (ft)</p>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="calc-label">Length</label><input type="number" className="calc-input" placeholder="0" value={roomLength} min="0" onChange={e=>setRoomLength(e.target.value)}/></div>
            <div><label className="calc-label">Width</label><input type="number" className="calc-input" placeholder="0" value={roomWidth} min="0" onChange={e=>setRoomWidth(e.target.value)}/></div>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="calc-label mb-0">Tile Size</label>
            <div className="flex bg-slate-100 rounded-lg p-0.5 text-xs font-semibold">
              {(['in','cm'] as const).map(u=><button key={u} onClick={()=>setTileUnit(u)} className={`px-3 py-1 rounded-md transition-all ${tileUnit===u?'bg-white text-navy-900 shadow':'text-slate-500'}`}>{u}</button>)}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="calc-label">Length ({tileUnit})</label><input type="number" className="calc-input" placeholder="12" value={tileLength} min="0" onChange={e=>setTileLength(e.target.value)}/></div>
            <div><label className="calc-label">Width ({tileUnit})</label><input type="number" className="calc-input" placeholder="12" value={tileWidth} min="0" onChange={e=>setTileWidth(e.target.value)}/></div>
          </div>
        </div>
        <div><label className="calc-label">Waste Factor (%)</label>
          <select value={waste} onChange={e=>setWaste(e.target.value)} className="calc-select">
            <option value="5">5% — Simple rectangular room, no cuts</option>
            <option value="10">10% — Standard rooms (recommended)</option>
            <option value="15">15% — Diagonal layout or complex shapes</option>
            <option value="20">20% — Herringbone or intricate patterns</option>
          </select>
        </div>
        <button onClick={calculate} className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-colors">Calculate Tiles</button>
        {result && (
          <div className="result-card space-y-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Results</p>
            <div className="grid grid-cols-2 gap-4">
              <div><div className="result-value">{result.tilesNeeded.toLocaleString()}</div><div className="result-unit">Tiles needed</div></div>
              <div><div className="result-value">{result.totalSqFt.toLocaleString()}</div><div className="result-unit">Sq ft to order</div></div>
              <div><div className="result-value">{result.boxesOf10}</div><div className="result-unit">Boxes of 10</div></div>
              <div><div className="result-value">{result.boxesOf15}</div><div className="result-unit">Boxes of 15</div></div>
            </div>
            <div className="border-t border-navy-700 pt-4 flex items-center justify-between">
              <span className="text-slate-400 text-sm">Material Cost Estimate</span>
              <span className="text-brand-400 font-bold text-lg">${result.costLow} – ${result.costHigh}</span>
            </div>
            <p className="text-slate-500 text-xs">💡 Cost varies widely by tile type ($2–$50+/sq ft). Labor adds $4–10/sq ft.</p>
          </div>
        )}
      </div>
    </div>
  );
}
