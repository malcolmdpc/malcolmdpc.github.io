/* Modelo independiente de la interfaz: distribución binomial completa. */
(function () {
  'use strict';
  function distribution(n, p) {
    if (!Number.isInteger(n) || n < 0 || n > 40 || !Number.isFinite(p) || p < 0 || p > 1) {
      throw new RangeError('Se requieren 0–40 remates enteros y una probabilidad entre 0 y 1.');
    }
    const values = Array(n + 1).fill(0);
    if (p === 0) { values[0] = 1; return values; }
    if (p === 1) { values[n] = 1; return values; }
    let combinations = 1;
    for (let k = 0; k <= n; k += 1) {
      if (k > 0) combinations *= (n - k + 1) / k;
      values[k] = combinations * Math.pow(p, k) * Math.pow(1 - p, n - k);
    }
    return values;
  }
  function tails(values) {
    const result = Array(values.length + 1).fill(0);
    for (let k = values.length - 1; k >= 0; k -= 1) result[k] = result[k + 1] + values[k];
    return result.map(value => Math.max(0, Math.min(1, value)));
  }
  function scoreMatrix(home, away) {
    function group(values) {
      const bins = Array(8).fill(0);
      values.forEach((value, k) => { bins[Math.min(k, 7)] += value; });
      return bins;
    }
    const a = group(home), b = group(away);
    return a.map(homeProbability => b.map(awayProbability => homeProbability * awayProbability));
  }
  function localityFactors(multiplier) {
    if (!Number.isFinite(multiplier) || multiplier <= 0) throw new RangeError('M debe ser positivo y finito.');
    // This form also avoids overflow for very large finite multipliers.
    const away = 2 / (1 + multiplier);
    return { home: 2 * (multiplier / (1 + multiplier)), away };
  }
  function effectiveDistribution(n, p, factor = 1) {
    const base = distribution(n, p); // Preserve the original validation and exact off-state.
    if (!Number.isFinite(factor) || factor < 0) throw new RangeError('Factor inválido.');
    const requested = n * factor;
    const shots = Math.min(40, requested);
    if (shots === n) return { pmf: base, shots, requested, limited: requested > 40 };
    const low = Math.floor(shots), high = Math.ceil(shots), weight = shots - low;
    const lower = distribution(low, p), upper = distribution(high, p);
    const pmf = upper.map((value, k) => (1 - weight) * (lower[k] || 0) + weight * value);
    return { pmf, shots, requested, limited: requested > 40 };
  }
  function outcomes(home, away) {
    const result = { home: 0, draw: 0, away: 0 };
    home.forEach((a, i) => away.forEach((b, j) => {
      result[i > j ? 'home' : i === j ? 'draw' : 'away'] += a * b;
    }));
    return result;
  }
  window.FootballModel = Object.freeze({ distribution, tails, scoreMatrix, localityFactors, effectiveDistribution, outcomes });
})();
