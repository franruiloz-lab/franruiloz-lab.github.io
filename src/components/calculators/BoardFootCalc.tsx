import { useState } from 'react';

interface Board {
  thickness: string;
  width: string;
  length: string;
  qty: string;
}

const SPECIES_PRICES: Record<string, number> = {
  'Pine (common)': 3.5,
  'Oak (red)': 9.0,
  'Oak (white)': 10.5,
  'Maple': 9.5,
  'Cherry': 12.0,
  'Walnut': 18.0,
  'Cedar': 6.0,
  'Douglas Fir': 4.5,
};

export default function BoardFootCalc() {
  const [boards, setBoards] = useState<Board[]>([{ thickness: '1', width: '6', length: '8', qty: '1' }]);
  const [species, setSpecies] = useState('Pine (common)');
  const [result, setResult] = useState<{ totalBF: number; cost: number } | null>(null);

  const addBoard = () => setBoards(b => [...b, { thickness: '1', width: '6', length: '8', qty: '1' }]);
  const removeBoard = (i: number) => setBoards(b => b.filter((_, idx) => idx !== i));
  const updateBoard = (i: number, field: keyof Board, val: string) =>
    setBoards(b => b.map((bd, idx) => idx === i ? { ...bd, [field]: val } : bd));

  const calculate = () => {
    const totalBF = boards.reduce((acc, b) => {
      const t = parseFloat(b.thickness) || 0;
      const w = parseFloat(b.width) || 0;
      const l = parseFloat(b.length) || 0;
      const q = parseInt(b.qty) || 1;
      return acc + ((t * w * l) / 12) * q;
    }, 0);
    if (totalBF <= 0) { setResult(null); return; }
    setResult({ totalBF, cost: totalBF * SPECIES_PRICES[species] });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🪵</span>
          <h2 className="text-white font-bold text-lg">Board Foot Calculator</h2>
        </div>
        <p className="text-slate-400 text-xs mt-1">1 board foot = 1" × 12" × 12"</p>
      </div>

      <div className="p-6 space-y-5">
        {/* Species selector */}
        <div>
          <label className="calc-label">Wood Species (for cost estimate)</label>
          <select value={species} onChange={e => setSpecies(e.target.value)} className="calc-select">
            {Object.keys(SPECIES_PRICES).map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Board rows */}
        <div>
          <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider px-1 mb-1">
            <span className="col-span-2">Thick (in)</span>
            <span className="col-span-3">Width (in)</span>
            <span className="col-span-3">Length (ft)</span>
            <span className="col-span-2">Qty</span>
            <span className="col-span-2"></span>
          </div>
          <div className="space-y-2">
            {boards.map((board, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center">
                <input type="number" className="calc-input col-span-2" value={board.thickness} min="0" step="0.25"
                  onChange={e => updateBoard(i, 'thickness', e.target.value)} />
                <input type="number" className="calc-input col-span-3" value={board.width} min="0"
                  onChange={e => updateBoard(i, 'width', e.target.value)} />
                <input type="number" className="calc-input col-span-3" value={board.length} min="0"
                  onChange={e => updateBoard(i, 'length', e.target.value)} />
                <input type="number" className="calc-input col-span-2" value={board.qty} min="1"
                  onChange={e => updateBoard(i, 'qty', e.target.value)} />
                <button onClick={() => removeBoard(i)} disabled={boards.length === 1}
                  className="col-span-2 text-slate-400 hover:text-red-500 transition-colors disabled:opacity-30 text-lg font-bold">
                  ×
                </button>
              </div>
            ))}
          </div>
          <button onClick={addBoard}
            className="mt-3 text-brand-600 hover:text-brand-700 text-sm font-semibold flex items-center gap-1.5 transition-colors">
            <span className="text-lg">+</span> Add another board
          </button>
        </div>

        <button onClick={calculate}
          className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-colors text-base">
          Calculate Board Feet
        </button>

        {result && (
          <div className="result-card space-y-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Results</p>
            <div>
              <div className="result-value">{result.totalBF.toFixed(2)}</div>
              <div className="result-unit">Board Feet (BF)</div>
            </div>
            <div className="border-t border-navy-700 pt-4 flex items-center justify-between">
              <span className="text-slate-400 text-sm">Est. Cost — {species}</span>
              <span className="text-brand-400 font-bold text-lg">${result.cost.toFixed(2)}</span>
            </div>
            <p className="text-slate-500 text-xs">💡 Price per BF: ${SPECIES_PRICES[species].toFixed(2)} (national avg)</p>
          </div>
        )}
      </div>
    </div>
  );
}
