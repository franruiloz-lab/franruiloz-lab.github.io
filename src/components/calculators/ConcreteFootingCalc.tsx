import { useState } from 'react';

type Shape = 'round' | 'square';
type ConcreteType = 'bag60' | 'bag80' | 'readymix';

const CONCRETE_OPTIONS: Record<ConcreteType, { name: string; cuFtPerUnit: number; unit: string }> = {
  bag60:    { name: '60lb Bags',      cuFtPerUnit: 0.45, unit: 'bags' },
  bag80:    { name: '80lb Bags',      cuFtPerUnit: 0.60, unit: 'bags' },
  readymix: { name: 'Ready-Mix',      cuFtPerUnit: 27,   unit: 'yards' },
};

const COST = {
  bag60:    { low: 5,   high: 6   }, // per bag
  bag80:    { low: 7,   high: 9   }, // per bag
  readymix: { low: 125, high: 145 }, // per cubic yard
};

export default function ConcreteFootingCalc() {
  const [numFootings, setNumFootings] = useState('');
  const [shape, setShape] = useState<Shape>('round');
  const [sizePrimary, setSizePrimary] = useState(''); // diameter or width
  const [depth, setDepth] = useState('');
  const [concreteType, setConcreteType] = useState<ConcreteType>('bag80');
  const [result, setResult] = useState<{
    cuFtEach: number;
    cuFtTotal: number;
    cuYards: number;
    unitsNeeded: number;
    unitLabel: string;
    costLow: number;
    costHigh: number;
  } | null>(null);

  const calculate = () => {
    const n = parseInt(numFootings) || 0;
    const size = parseFloat(sizePrimary) || 0;
    const d = parseFloat(depth) || 0;
    if (n <= 0 || size <= 0 || d <= 0) { setResult(null); return; }

    // Convert inches to feet
    const sizeFt = size / 12;
    const depthFt = d / 12;

    let cuFtEach = 0;
    if (shape === 'round') {
      const r = sizeFt / 2;
      cuFtEach = Math.PI * r * r * depthFt;
    } else {
      cuFtEach = sizeFt * sizeFt * depthFt;
    }

    const cuFtTotal = cuFtEach * n;
    const cuYards = cuFtTotal / 27;

    const opt = CONCRETE_OPTIONS[concreteType];
    const unitsRaw = cuFtTotal / opt.cuFtPerUnit;
    const unitsNeeded = concreteType === 'readymix'
      ? Math.ceil(unitsRaw * 100) / 100  // yards to 2 decimals
      : Math.ceil(unitsRaw);             // bags round up

    const costPer = COST[concreteType];
    const costLow  = Math.round(unitsNeeded * costPer.low);
    const costHigh = Math.round(unitsNeeded * costPer.high);

    setResult({
      cuFtEach: Math.round(cuFtEach * 1000) / 1000,
      cuFtTotal: Math.round(cuFtTotal * 100) / 100,
      cuYards: Math.round(cuYards * 100) / 100,
      unitsNeeded,
      unitLabel: opt.unit,
      costLow,
      costHigh,
    });
  };

  const sizeLabel = shape === 'round' ? 'Diameter (inches)' : 'Width (inches)';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏗️</span>
          <h2 className="text-white font-bold text-lg">Concrete Footing Calculator</h2>
        </div>
      </div>

      <div className="p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="calc-label">Number of Footings</label>
            <input
              type="number"
              className="calc-input"
              placeholder="1"
              value={numFootings}
              min="1"
              onChange={e => setNumFootings(e.target.value)}
            />
          </div>
          <div>
            <label className="calc-label">Footing Shape</label>
            <div className="flex gap-2 mt-1">
              {(['round', 'square'] as Shape[]).map(s => (
                <button
                  key={s}
                  onClick={() => setShape(s)}
                  className={`flex-1 py-2.5 px-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                    shape === s
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="calc-label">{sizeLabel}</label>
            <input
              type="number"
              className="calc-input"
              placeholder="12"
              value={sizePrimary}
              min="0"
              onChange={e => setSizePrimary(e.target.value)}
            />
          </div>
          <div>
            <label className="calc-label">Depth (inches)</label>
            <input
              type="number"
              className="calc-input"
              placeholder="12"
              value={depth}
              min="0"
              onChange={e => setDepth(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="calc-label">Concrete Type</label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.entries(CONCRETE_OPTIONS) as [ConcreteType, typeof CONCRETE_OPTIONS[ConcreteType]][]).map(([id, opt]) => (
              <button
                key={id}
                onClick={() => setConcreteType(id)}
                className={`py-2.5 px-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                  concreteType === id
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                {opt.name}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={calculate}
          className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-colors text-base"
        >
          Calculate Footings
        </button>

        {result && (
          <div className="result-card space-y-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Results</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="result-value">{result.cuYards}</div>
                <div className="result-unit">Total Cubic Yards</div>
              </div>
              <div>
                <div className="result-value">{result.cuFtTotal}</div>
                <div className="result-unit">Total Cubic Feet</div>
              </div>
              <div>
                <div className="result-value">{result.cuFtEach}</div>
                <div className="result-unit">Cu Ft per Footing</div>
              </div>
              <div>
                <div className="result-value">{result.unitsNeeded}</div>
                <div className="result-unit">{result.unitLabel.charAt(0).toUpperCase() + result.unitLabel.slice(1)} Needed</div>
              </div>
            </div>
            <div className="border-t border-navy-700 pt-4 flex items-center justify-between">
              <span className="text-slate-400 text-sm">Estimated Cost</span>
              <span className="text-brand-400 font-bold text-lg">
                ${result.costLow.toLocaleString()} – ${result.costHigh.toLocaleString()}
              </span>
            </div>
            <p className="text-slate-500 text-xs">💡 Add 10% extra when ordering ready-mix to account for spillage.</p>
          </div>
        )}
      </div>
    </div>
  );
}
