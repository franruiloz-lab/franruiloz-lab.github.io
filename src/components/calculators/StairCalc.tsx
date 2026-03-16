import { useState } from 'react';

type Unit = 'in' | 'cm';

export default function StairCalc() {
  const [unit, setUnit] = useState<Unit>('in');
  const [totalRise, setTotalRise] = useState('');
  const [preferredRiser, setPreferredRiser] = useState('7');
  const [stairWidth, setStairWidth] = useState('36');
  const [result, setResult] = useState<{
    steps: number; riserHeight: number; runDepth: number; totalRun: number;
    stringerLength: number; isCompliant: boolean;
  } | null>(null);

  const toCm = (v: string) => (parseFloat(v) || 0) * (unit === 'in' ? 2.54 : 1);
  const toIn = (v: string) => (parseFloat(v) || 0) * (unit === 'cm' ? 0.3937 : 1);

  const calculate = () => {
    const riseIn = toIn(totalRise);
    const prefRiserIn = toIn(preferredRiser);
    if (riseIn <= 0 || prefRiserIn <= 0) { setResult(null); return; }

    const steps = Math.round(riseIn / prefRiserIn);
    const riserHeight = riseIn / steps;
    // IRC code: riser max 7.75", min 4"; run min 10" (nosing); typical run = 10"
    const runDepth = Math.max(10, 12 - riserHeight);
    const totalRun = runDepth * steps;
    // Stringer = sqrt(rise² + run²)
    const stringerLength = Math.sqrt(riseIn ** 2 + totalRun ** 2);
    const isCompliant = riserHeight >= 4 && riserHeight <= 7.75 && runDepth >= 10;

    setResult({
      steps,
      riserHeight: unit === 'in' ? riserHeight : riserHeight * 2.54,
      runDepth: unit === 'in' ? runDepth : runDepth * 2.54,
      totalRun: unit === 'in' ? totalRun : totalRun * 2.54,
      stringerLength: unit === 'in' ? stringerLength : stringerLength * 2.54,
      isCompliant,
    });
  };

  const unitLabel = unit === 'in' ? '"' : 'cm';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🪜</span>
          <h2 className="text-white font-bold text-lg">Stair Calculator</h2>
        </div>
        <div className="flex bg-navy-700 rounded-lg p-0.5 text-xs font-semibold">
          {(['in', 'cm'] as Unit[]).map(u => (
            <button key={u} onClick={() => setUnit(u)}
              className={`px-3 py-1.5 rounded-md transition-all ${unit === u ? 'bg-brand-500 text-white' : 'text-slate-300 hover:text-white'}`}>
              {u.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Stair diagram */}
        <div className="flex justify-center">
          <svg viewBox="0 0 200 120" className="w-44 h-28" fill="none">
            {[0,1,2,3,4].map(i => (
              <g key={i}>
                <rect x={i*30+10} y={90-i*15} width="30" height="15" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5"/>
              </g>
            ))}
            {/* Rise label */}
            <line x1="170" y1="15" x2="170" y2="90" stroke="#f97316" strokeWidth="1.5" strokeDasharray="4,2"/>
            <text x="175" y="55" fill="#f97316" fontSize="9" fontWeight="bold">Rise</text>
            {/* Run label */}
            <line x1="10" y1="100" x2="160" y2="100" stroke="#f97316" strokeWidth="1.5" strokeDasharray="4,2"/>
            <text x="75" y="112" fill="#f97316" fontSize="9" fontWeight="bold">Total Run</text>
          </svg>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="calc-label">Total Rise — floor to floor ({unit})</label>
            <input type="number" className="calc-input" placeholder={unit === 'in' ? '108' : '274'} value={totalRise} min="0"
              onChange={e => setTotalRise(e.target.value)} />
          </div>
          <div>
            <label className="calc-label">Preferred Riser Height ({unit})</label>
            <input type="number" className="calc-input" placeholder={unit === 'in' ? '7' : '18'} value={preferredRiser} min="0"
              onChange={e => setPreferredRiser(e.target.value)} />
          </div>
          <div>
            <label className="calc-label">Stair Width ({unit})</label>
            <input type="number" className="calc-input" placeholder={unit === 'in' ? '36' : '91'} value={stairWidth} min="0"
              onChange={e => setStairWidth(e.target.value)} />
          </div>
        </div>

        <button onClick={calculate}
          className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-colors text-base">
          Calculate Stairs
        </button>

        {result && (
          <div className="result-card space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Results</p>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${result.isCompliant ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'}`}>
                {result.isCompliant ? '✓ IRC Compliant' : '⚠ Check Code'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="result-value">{result.steps}</div>
                <div className="result-unit">Number of Steps</div>
              </div>
              <div>
                <div className="result-value">{result.riserHeight.toFixed(2)}{unitLabel}</div>
                <div className="result-unit">Riser Height</div>
              </div>
              <div>
                <div className="result-value">{result.runDepth.toFixed(2)}{unitLabel}</div>
                <div className="result-unit">Run Depth (tread)</div>
              </div>
              <div>
                <div className="result-value">{result.totalRun.toFixed(1)}{unitLabel}</div>
                <div className="result-unit">Total Run</div>
              </div>
            </div>
            <div className="border-t border-navy-700 pt-3 flex items-center justify-between">
              <span className="text-slate-400 text-sm">Stringer Length</span>
              <span className="text-brand-400 font-bold">{result.stringerLength.toFixed(1)}{unitLabel}</span>
            </div>
            <p className="text-slate-500 text-xs">💡 IRC 2021: max riser 7¾", min tread 10", min width 36"</p>
          </div>
        )}
      </div>
    </div>
  );
}
