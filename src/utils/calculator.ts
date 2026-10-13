export const evaluateExpression = (expr: string): string => {
  try {
    let clean = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/π/g, 'Math.PI')
      .replace(/e/g, 'Math.E')
      .replace(/sqrt\(/g, 'Math.sqrt(')
      .replace(/sin\(/g, 'Math.sin(')
      .replace(/cos\(/g, 'Math.cos(')
      .replace(/tan\(/g, 'Math.tan(')
      .replace(/ln\(/g, 'Math.log(')
      .replace(/log\(/g, 'Math.log10(')
      .replace(/\^/g, '**');

    // Basic sanitization
    if (/[^0-9+\-*/().MathPIEsqrtlncosinta,\s]/.test(clean)) {
      return 'Error';
    }

    // Evaluate safely
    // eslint-disable-next-line no-new-func
    const result = Function(`'use strict'; return (${clean})`)();
    if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
      // Format nicely
      if (Math.abs(result) < 0.0001 && result !== 0) {
        return result.toExponential(4);
      }
      return Number(result.toFixed(6)).toString();
    }
    return 'Error';
  } catch (err) {
    return 'Error';
  }
};
