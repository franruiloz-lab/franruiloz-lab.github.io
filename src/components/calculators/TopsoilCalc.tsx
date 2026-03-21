import { useState } from 'react';

type CoverageType = 'topdress' | 'garden' | 'newlawn' | 'fill';
type DepthPreset = '2' | '3' | '4' | '6' | 'custom';

const COVERAGE_TYPES: Record<CoverageType, { name: string; recommended: DepthPreset }> = {
  topdress: { name: 'Lawn Topdressing',  recommended: '2' },
  garden:   { name: 'Garden Bed',        recommended: '4' },
  newlawn:  { name: 'New Lawn',          recommended: '4' },
  fill:     { name: 'Fill & Grade',      recommended: '6' },
};

const DEPTH_PRESETS: DepthPreset[] = ['2', '3', '4', '6', 'custom'];

const BULK_PRICE  = { low: 35, high: 50 };  // per cubic yard
const BAG_PRICE   = { low: 4,  high: 6  };  // per 40lb bag (0.75 cu ft)
const BAG_CU_FT   = 0.75; // 40lb bag covers 0.75 cu ft

export default function TopsoilCalc() {
  const [area, setArea] = useState('');
  const [depthPreset, setDepthPreset] = useState<DepthPreset>('4');
  const [customDepth, setCustomDepth] = useState('');
  const [coverageType, setCoverageType] = useState<CoverageType>('newlawn');
  const [result, setResult] = useState<{
    cuYards: number;
    cuFeet: number;
    bags40lb: number;
    bulkYards: number;
    truckLoads: number;
    costBulkLow: number;
    costBulkHigh: number;
    costBagLow: number;
    costBagHigh: number;
  } | null>(null);

  const getDepthInches = () => {
    if (depthPreset === 'custom') return parseFloat(customDepth) || 0;
    return parseFloat(depthPreset);
  };

  const calculate = () => {
    const sqFt = parseFloat(area) || 0;
    const depthIn = getDepthInches();
    if (sqFt <= 0 || depthIn <= 0) { setResult(null); return; }

    const cuFeet  = sqFt * (depthIn / 12);
    const cuYards = cuFeet / 27;

    const bags40lb  = Math.ceil(cuFeet / BAG_CU_FT);
    const bulkYards = Math.ceil(cuYards * 10) / 10; // round to nearest 0.1 yard
    const truckLoads = Math.ceil(cuYards / 10 * 10) / 10; // 10-yard standard load

    setResult({
      cuYards:      Math.round(cuYards * 100) / 100,
      cuFeet:       Math.round(cuFeet * 10) / 10,
      bags40lb,
      bulkYards,
      truckLoads:   Math.round(truckLoads * 10) / 10,
      costBulkLow:  Math.round(cuYards * BULK_PRICE.low),
      costBulkHigh: Math.round(cuYards * BULK_PRICE.high),
      costBagLow:   Math.round(bags40lb * BAG_PRICE.low),
      costBagHigh:  Math.round(bags40lb * BAG_PRICE.high),
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌱</span>
          <h2 className="text-white font-bold text-lg">Topsoil Calculator</h2>
        </div>
      </div>

      <div className="p-6 space-y-5">
        <div>
          <label className="calc-label">Coverage Type</label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.entries(COVERAGE_TYPES) as [CoverageType, typeof COVERAGE_TYPES[CoverageType]][]).map(([id, ct]) => (
              <button
                key={id}
                onClick={() => { setCoverageType(id); setDepthPreset(ct.recommended); }}
                className={`py-2.5 px-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                  coverageType === id
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                {ct.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="calc-label">Area (sq ft)</label>
          <input
            type="number"
            className="calc-input"
            placeholder="0"
            value={area}
            min="0"
            onChange={e => setArea(e.target.value)}
          />
        </div>

        <div>
          <label className="calc-label">Depth (inches)</label>
          <div className="grid grid-cols-5 gap-2">
            {DEPTH_PRESETS.map(d => (
              <button
                key={d}
                onClick={() => setDepthPreset(d)}
                className={`py-2.5 px-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                  depthPreset === d
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                {d === 'custom' ? 'Custom' : `${d}"`}
              </button>
            ))}
          </div>
          {depthPreset === 'custom' && (
            <input
              type="number"
              className="calc-input mt-2"
              placeholder="Enter depth in inches"
              value={customDepth}
              min="0"
              onChange={e => setCustomDepth(e.target.value)}
            />
          )}
        </div>

        <button
          onClick={calculate}
          className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-colors text-base"
        >
          Calculate Topsoil
        </button>

        {result && (
          <div className="result-card space-y-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Results</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="result-value">{result.cuYards}</div>
                <div className="result-unit">Cubic Yards</div>
              </div>
              <div>
                <div className="result-value">{result.cuFeet}</div>
                <div className="result-unit">Cubic Feet</div>
              </div>
              <div>
                <div className="result-value">{result.bags40lb}</div>
                <div className="result-unit">40lb Bags (0.75 cu ft ea)</div>
              </div>
              <div>
                <div className="result-value">{result.truckLoads}</div>
                <div className="result-unit">10-Yard Truck Loads</div>
              </div>
            </div>
            <div className="border-t border-navy-700 pt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Bulk Cost (per yard)</span>
                <span className="text-brand-400 font-bold">
                  ${result.costBulkLow.toLocaleString()} – ${result.costBulkHigh.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Bagged Cost</span>
                <span className="text-brand-400 font-bold">
                  ${result.costBagLow.toLocaleString()} – ${result.costBagHigh.toLocaleString()}
                </span>
              </div>
            </div>
            <p className="text-slate-500 text-xs">💡 Bulk delivery is typically sold in 10-yard minimum loads. Bagged topsoil is more expensive per yard but convenient for small areas.</p>
          </div>
        )}
      </div>
    </div>
  );
}
