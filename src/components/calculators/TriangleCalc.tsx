import { useState } from 'react';

type Method = 'base-height' | 'three-sides' | 'two-sides-angle';

const METHODS: { id: Method; label: string; description: string }[] = [
  { id: 'base-height',      label: 'Base & Height',       description: 'Most common method' },
  { id: 'three-sides',      label: 'Three Sides',         description: "Heron's formula" },
  { id: 'two-sides-angle',  label: 'Two Sides & Angle',   description: 'SAS formula' },
];

function toRad(deg: number) { return (deg * Math.PI) / 180; }

export default function TriangleCalc() {
  const [method, setMethod] = useState<Method>('base-height');
  const [a, setA] = useState(''); // base or side a
  const [b, setB] = useState(''); // height or side b
  const [c, setC] = useState(''); // side c or angle C (degrees)
  const [result, setResult] = useState<{
    area: number;
    perimeter: number | null;
    hypotenuse: number | null;
    isRight: boolean;
  } | null>(null);

  const calculate = () => {
    const av = parseFloat(a) || 0;
    const bv = parseFloat(b) || 0;
    const cv = parseFloat(c) || 0;

    if (av <= 0 || bv <= 0) { setResult(null); return; }

    let area = 0;
    let perimeter: number | null = null;
    let hypotenuse: number | null = null;
    let isRight = false;

    if (method === 'base-height') {
      area = 0.5 * av * bv;
      // Cannot determine perimeter from base+height alone without more info
      perimeter = null;
    } else if (method === 'three-sides') {
      if (cv <= 0) { setResult(null); return; }
      const s = (av + bv + cv) / 2; // semi-perimeter
      const discriminant = s * (s - av) * (s - bv) * (s - cv);
      if (discriminant < 0) { setResult(null); return; }
      area = Math.sqrt(discriminant);
      perimeter = av + bv + cv;

      // Check if right triangle: largest side^2 ≈ sum of other two sides^2
      const sides = [av, bv, cv].sort((x, y) => x - y);
      if (Math.abs(sides[2] * sides[2] - (sides[0] * sides[0] + sides[1] * sides[1])) < 0.0001) {
        isRight = true;
        hypotenuse = sides[2];
      }
    } else if (method === 'two-sides-angle') {
      if (cv <= 0 || cv >= 180) { setResult(null); return; }
      area = 0.5 * av * bv * Math.sin(toRad(cv));
      // Compute third side via law of cosines: c² = a² + b² - 2ab·cos(C)
      const thirdSide = Math.sqrt(av * av + bv * bv - 2 * av * bv * Math.cos(toRad(cv)));
      perimeter = av + bv + thirdSide;

      // Check for right angle
      const sides = [av, bv, thirdSide].sort((x, y) => x - y);
      if (Math.abs(sides[2] * sides[2] - (sides[0] * sides[0] + sides[1] * sides[1])) < 0.001) {
        isRight = true;
        hypotenuse = sides[2];
      }
    }

    if (area <= 0) { setResult(null); return; }

    setResult({
      area:       Math.round(area * 10000) / 10000,
      perimeter:  perimeter !== null ? Math.round(perimeter * 10000) / 10000 : null,
      hypotenuse: hypotenuse !== null ? Math.round(hypotenuse * 10000) / 10000 : null,
      isRight,
    });
  };

  const inputLabels: Record<Method, [string, string, string]> = {
    'base-height':     ['Base', 'Height', ''],
    'three-sides':     ['Side A', 'Side B', 'Side C'],
    'two-sides-angle': ['Side A', 'Side B', 'Angle C (degrees)'],
  };

  const labels = inputLabels[method];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📐</span>
          <h2 className="text-white font-bold text-lg">Triangle Calculator</h2>
        </div>
      </div>

      <div className="p-6 space-y-5">
        <div>
          <label className="calc-label">Calculation Method</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {METHODS.map(m => (
              <button
                key={m.id}
                onClick={() => { setMethod(m.id); setResult(null); setA(''); setB(''); setC(''); }}
                className={`py-2.5 px-3 rounded-xl border-2 text-sm font-semibold transition-all text-left ${
                  method === m.id
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                <div>{m.label}</div>
                <div className="text-xs font-normal opacity-70 mt-0.5">{m.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="calc-label">{labels[0]}</label>
            <input
              type="number"
              className="calc-input"
              placeholder="0"
              value={a}
              min="0"
              onChange={e => setA(e.target.value)}
            />
          </div>
          <div>
            <label className="calc-label">{labels[1]}</label>
            <input
              type="number"
              className="calc-input"
              placeholder="0"
              value={b}
              min="0"
              onChange={e => setB(e.target.value)}
            />
          </div>
          {labels[2] && (
            <div className="col-span-2">
              <label className="calc-label">{labels[2]}</label>
              <input
                type="number"
                className="calc-input"
                placeholder={method === 'two-sides-angle' ? '90' : '0'}
                value={c}
                min="0"
                max={method === 'two-sides-angle' ? '179' : undefined}
                onChange={e => setC(e.target.value)}
              />
            </div>
          )}
        </div>

        <button
          onClick={calculate}
          className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-colors text-base"
        >
          Calculate Triangle
        </button>

        {result && (
          <div className="result-card space-y-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
              Results{result.isRight ? ' — Right Triangle Detected ✓' : ''}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="result-value">{result.area.toLocaleString()}</div>
                <div className="result-unit">Area (square units)</div>
              </div>
              {result.perimeter !== null && (
                <div>
                  <div className="result-value">{result.perimeter.toLocaleString()}</div>
                  <div className="result-unit">Perimeter</div>
                </div>
              )}
              {result.hypotenuse !== null && (
                <div>
                  <div className="result-value">{result.hypotenuse.toLocaleString()}</div>
                  <div className="result-unit">Hypotenuse</div>
                </div>
              )}
            </div>
            {result.isRight && (
              <p className="text-slate-500 text-xs">💡 This is a right triangle. The hypotenuse is the longest side.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
