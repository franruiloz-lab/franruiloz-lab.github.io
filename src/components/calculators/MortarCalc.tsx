import { useState } from 'react';

type BrickType = 'standard' | 'modular' | 'cmu' | 'thin';

interface BrickSpec {
  name: string;
  height: number;  // inches
  length: number;  // inches
  depth: number;   // inches
  jointThickness: number; // inches (standard 3/8")
}

const BRICK_TYPES: Record<BrickType, BrickSpec> = {
  standard: { name: 'Standard Brick (3.75"×2.25"×8")',  height: 2.25, length: 8,      depth: 3.75,  jointThickness: 0.375 },
  modular:  { name: 'Modular Brick (3.625"×2.25"×7.625")', height: 2.25, length: 7.625, depth: 3.625, jointThickness: 0.375 },
  cmu:      { name: 'CMU Block (7.625"×7.625"×15.625")', height: 7.625, length: 15.625, depth: 7.625, jointThickness: 0.375 },
  thin:     { name: 'Thin Brick (0.75"×2.25"×7.625")',   height: 2.25, length: 7.625, depth: 0.75,  jointThickness: 0.375 },
};

// One 80lb bag covers ~35–40 sq ft of wall at 3/8" joints (industry standard)
const COVERAGE_PER_BAG_SQFT = 37.5; // midpoint
const BAG_PRICE = { low: 8, high: 12 };

export default function MortarCalc() {
  const [length, setLength] = useState('');
  const [height, setHeight] = useState('');
  const [brickType, setBrickType] = useState<BrickType>('standard');
  const [result, setResult] = useState<{
    wallArea: number;
    mortarCuFt: number;
    bags: number;
    costLow: number;
    costHigh: number;
  } | null>(null);

  const calculate = () => {
    const l = parseFloat(length) || 0;
    const h = parseFloat(height) || 0;
    if (l <= 0 || h <= 0) { setResult(null); return; }

    const spec = BRICK_TYPES[brickType];
    const wallArea = l * h; // sq ft

    // Calculate joint volume per sq ft of wall
    // For each sq ft of wall:
    //   - Horizontal joints: (12 / (spec.height + spec.jointThickness)) joints per ft height
    //     each joint: 12 in wide × 3/8 in thick × spec.depth in deep (per foot of wall length)
    //   - Vertical joints: (12 / (spec.length + spec.jointThickness)) joints per ft length
    //     each joint: spec.height in tall × 3/8 in thick × spec.depth in deep (per foot of wall height)
    const j = spec.jointThickness;
    const bH = spec.height;
    const bL = spec.length;
    const bD = spec.depth;

    // Horizontal joints per sq ft of wall
    const horizJointsPerFtHeight = 12 / (bH + j);
    const horizJointVolPerSqFt = horizJointsPerFtHeight * (12 * j * bD) / 1728; // cu ft

    // Vertical joints per sq ft of wall
    const vertJointsPerFtLength = 12 / (bL + j);
    const vertJointVolPerSqFt = vertJointsPerFtLength * (bH * j * bD) / 1728; // cu ft

    const mortarPerSqFt = horizJointVolPerSqFt + vertJointVolPerSqFt;
    const mortarCuFtRaw = wallArea * mortarPerSqFt;
    const mortarCuFt = mortarCuFtRaw * 1.10; // 10% waste

    // Bags: 80lb bag covers ~35-40 sq ft → use coverage-based method
    const bagsRaw = wallArea / COVERAGE_PER_BAG_SQFT * 1.10;
    const bags = Math.ceil(bagsRaw);

    setResult({
      wallArea: Math.round(wallArea * 10) / 10,
      mortarCuFt: Math.round(mortarCuFt * 100) / 100,
      bags,
      costLow: Math.round(bags * BAG_PRICE.low),
      costHigh: Math.round(bags * BAG_PRICE.high),
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧱</span>
          <h2 className="text-white font-bold text-lg">Mortar Calculator</h2>
        </div>
      </div>

      <div className="p-6 space-y-5">
        <div>
          <label className="calc-label">Brick / Block Type</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(Object.entries(BRICK_TYPES) as [BrickType, BrickSpec][]).map(([id, spec]) => (
              <button
                key={id}
                onClick={() => setBrickType(id)}
                className={`py-2.5 px-3 rounded-xl border-2 text-sm font-semibold transition-all text-left ${
                  brickType === id
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                {spec.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="calc-label">Wall Length (ft)</label>
            <input
              type="number"
              className="calc-input"
              placeholder="0"
              value={length}
              min="0"
              onChange={e => setLength(e.target.value)}
            />
          </div>
          <div>
            <label className="calc-label">Wall Height (ft)</label>
            <input
              type="number"
              className="calc-input"
              placeholder="0"
              value={height}
              min="0"
              onChange={e => setHeight(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={calculate}
          className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-colors text-base"
        >
          Calculate Mortar
        </button>

        {result && (
          <div className="result-card space-y-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
              Results — {BRICK_TYPES[brickType].name.split(' (')[0]}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="result-value">{result.bags}</div>
                <div className="result-unit">80lb Bags (incl. 10% waste)</div>
              </div>
              <div>
                <div className="result-value">{result.mortarCuFt}</div>
                <div className="result-unit">Cubic Feet of Mortar</div>
              </div>
              <div>
                <div className="result-value">{result.wallArea}</div>
                <div className="result-unit">Wall Area (sq ft)</div>
              </div>
            </div>
            <div className="border-t border-navy-700 pt-4 flex items-center justify-between">
              <span className="text-slate-400 text-sm">Estimated Cost (bags)</span>
              <span className="text-brand-400 font-bold text-lg">
                ${result.costLow.toLocaleString()} – ${result.costHigh.toLocaleString()}
              </span>
            </div>
            <p className="text-slate-500 text-xs">💡 Includes 10% waste factor. Prices based on $8–$12 per 80lb bag.</p>
          </div>
        )}
      </div>
    </div>
  );
}
