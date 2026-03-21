import { useState } from 'react';

type TrimType = 'baseboard' | 'baseboard_door' | 'baseboard_door_window';
type BoardLength = 8 | 12 | 16;

const TRIM_LABELS: Record<TrimType, string> = {
  baseboard:             'Baseboard Only',
  baseboard_door:        'Baseboard + Door Casing',
  baseboard_door_window: 'Baseboard + Door + Window Casing',
};

export default function BaseboardCalc() {
  const [inputMode, setInputMode] = useState<'perimeter' | 'dimensions'>('dimensions');
  const [perimeter, setPerimeter] = useState('');
  const [roomLength, setRoomLength] = useState('');
  const [roomWidth, setRoomWidth] = useState('');
  const [doors, setDoors] = useState('2');
  const [windows, setWindows] = useState('2');
  const [trimType, setTrimType] = useState<TrimType>('baseboard_door');
  const [boardLength, setBoardLength] = useState<BoardLength>(12);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    let roomPerimeter = 0;
    if (inputMode === 'perimeter') {
      roomPerimeter = parseFloat(perimeter) || 0;
    } else {
      const l = parseFloat(roomLength) || 0;
      const w = parseFloat(roomWidth) || 0;
      if (l <= 0 || w <= 0) { setResult(null); return; }
      roomPerimeter = 2 * (l + w);
    }
    if (roomPerimeter <= 0) { setResult(null); return; }

    const numDoors = parseInt(doors) || 0;
    const numWindows = parseInt(windows) || 0;

    // Net baseboard linear feet: perimeter minus door openings (3 ft each)
    const netBaseboardLF = roomPerimeter - numDoors * 3;
    const baseboardWithWaste = netBaseboardLF * 1.10;
    const baseboardBoards = Math.ceil(baseboardWithWaste / boardLength);

    // Door casing: each door = 2 sides × 7 ft + top 3 ft = ~17 lf
    const doorCasingLF = trimType !== 'baseboard' ? numDoors * 17 : 0;
    // Window casing: each window = 2 sides × 4 ft + top ~3 ft = ~11 lf (use 10 per spec)
    const windowCasingLF = trimType === 'baseboard_door_window' ? numWindows * 10 : 0;

    const totalTrimLF = Math.round(baseboardWithWaste + doorCasingLF + windowCasingLF);
    const totalBoards = Math.ceil(totalTrimLF / boardLength);

    const costMdfLow  = Math.round(totalTrimLF * 1);
    const costMdfHigh = Math.round(totalTrimLF * 4);
    const costWoodLow  = Math.round(totalTrimLF * 2);
    const costWoodHigh = Math.round(totalTrimLF * 6);
    const costInstalledLow  = Math.round(totalTrimLF * 3);
    const costInstalledHigh = Math.round(totalTrimLF * 8);

    setResult({
      roomPerimeter: Math.round(roomPerimeter),
      netBaseboardLF: Math.round(netBaseboardLF),
      baseboardWithWaste: Math.round(baseboardWithWaste),
      baseboardBoards,
      doorCasingLF: Math.round(doorCasingLF),
      windowCasingLF: Math.round(windowCasingLF),
      totalTrimLF,
      totalBoards,
      costMdfLow, costMdfHigh,
      costWoodLow, costWoodHigh,
      costInstalledLow, costInstalledHigh,
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏠</span>
          <h2 className="text-white font-bold text-lg">Baseboard & Trim Calculator</h2>
        </div>
      </div>
      <div className="p-6 space-y-4">
        {/* Input mode toggle */}
        <div>
          <label className="calc-label">Room Measurement</label>
          <div className="grid grid-cols-2 gap-2">
            {(['dimensions', 'perimeter'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setInputMode(mode)}
                className={`py-2 px-3 rounded-xl border-2 text-sm font-semibold transition-all ${inputMode === mode ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
              >
                {mode === 'dimensions' ? 'Length × Width' : 'Total Perimeter'}
              </button>
            ))}
          </div>
        </div>

        {inputMode === 'dimensions' ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="calc-label">Room Length (ft)</label>
              <input type="number" className="calc-input" placeholder="e.g. 14" value={roomLength} min="0" onChange={e => setRoomLength(e.target.value)} />
            </div>
            <div>
              <label className="calc-label">Room Width (ft)</label>
              <input type="number" className="calc-input" placeholder="e.g. 12" value={roomWidth} min="0" onChange={e => setRoomWidth(e.target.value)} />
            </div>
          </div>
        ) : (
          <div>
            <label className="calc-label">Room Perimeter (linear ft)</label>
            <input type="number" className="calc-input" placeholder="e.g. 52" value={perimeter} min="0" onChange={e => setPerimeter(e.target.value)} />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="calc-label">Number of Doors</label>
            <input type="number" className="calc-input" placeholder="2" value={doors} min="0" onChange={e => setDoors(e.target.value)} />
            <p className="text-xs text-slate-400 mt-1">Each deducts 3 ft from baseboard</p>
          </div>
          <div>
            <label className="calc-label">Number of Windows</label>
            <input type="number" className="calc-input" placeholder="2" value={windows} min="0" onChange={e => setWindows(e.target.value)} />
            <p className="text-xs text-slate-400 mt-1">No baseboard deduction</p>
          </div>
        </div>

        <div>
          <label className="calc-label">Trim Package</label>
          <select value={trimType} onChange={e => setTrimType(e.target.value as TrimType)} className="calc-select">
            {(Object.entries(TRIM_LABELS) as [TrimType, string][]).map(([id, label]) => (
              <option key={id} value={id}>{label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="calc-label">Board Length</label>
          <div className="grid grid-cols-3 gap-2">
            {([8, 12, 16] as BoardLength[]).map(len => (
              <button
                key={len}
                onClick={() => setBoardLength(len)}
                className={`py-2 rounded-xl border-2 text-sm font-semibold transition-all ${boardLength === len ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
              >
                {len} ft
              </button>
            ))}
          </div>
        </div>

        <button onClick={calculate} className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-colors">
          Calculate Trim
        </button>

        {result && (
          <div className="result-card space-y-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Results</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="result-value">{result.baseboardWithWaste}</div>
                <div className="result-unit">Baseboard LF (+10% waste)</div>
              </div>
              <div>
                <div className="result-value">{result.baseboardBoards}</div>
                <div className="result-unit">Baseboard Boards ({boardLength} ft)</div>
              </div>
              {result.doorCasingLF > 0 && (
                <div>
                  <div className="result-value">{result.doorCasingLF}</div>
                  <div className="result-unit">Door Casing LF</div>
                </div>
              )}
              {result.windowCasingLF > 0 && (
                <div>
                  <div className="result-value">{result.windowCasingLF}</div>
                  <div className="result-unit">Window Casing LF</div>
                </div>
              )}
              <div>
                <div className="result-value">{result.totalTrimLF}</div>
                <div className="result-unit">Total LF All Trim</div>
              </div>
              <div>
                <div className="result-value">{result.totalBoards}</div>
                <div className="result-unit">Total Boards Needed</div>
              </div>
            </div>
            <div className="space-y-2 border-t border-navy-700 pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">MDF Trim (material only)</span>
                <span className="text-brand-400 font-semibold">${result.costMdfLow.toLocaleString()} – ${result.costMdfHigh.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Wood Trim (material only)</span>
                <span className="text-brand-400 font-semibold">${result.costWoodLow.toLocaleString()} – ${result.costWoodHigh.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Installed (labor + material)</span>
                <span className="text-brand-400 font-bold">${result.costInstalledLow.toLocaleString()} – ${result.costInstalledHigh.toLocaleString()}</span>
              </div>
            </div>
            <p className="text-slate-500 text-xs">💡 Add 10–15% extra for inside corners, splices, and complex rooms.</p>
          </div>
        )}
      </div>
    </div>
  );
}
