/* Cálculos de Probabilidad y Estadística: descriptiva, conteo, distribuciones (binomial, Poisson, normal, t, exponencial),
   intervalos de confianza, tests y corrección de preguntas abiertas.
   Funciones puras (sin DOM): las usan los laboratorios, las soluciones, la página de tablas y las pruebas (node tests/st.test.js). */
(() => {
  const sum = (a) => a.reduce((s, x) => s + x, 0);
  const sorted = (a) => [...a].sort((x, y) => x - y);
  const round = (v, d = 4) => Math.round(v * 10 ** d) / 10 ** d;

  // ---------- Descriptiva: datos sin agrupar ----------
  const mean = (a) => sum(a) / a.length;
  function median(a) {
    const s = sorted(a), n = s.length;
    return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
  }
  // Modas: [] si es amodal (todos los valores con la misma frecuencia)
  function modes(a) {
    const t = freqTable(a), mx = Math.max(...t.map((r) => r.f));
    return t.every((r) => r.f === mx) && t.length > 1 ? [] : t.filter((r) => r.f === mx).map((r) => r.x);
  }
  const modeName = (m) => ['amodal', 'unimodal', 'bimodal'][m.length] || 'multimodal';
  // Varianza muestral (divide por n − 1, como la cátedra)
  const variance = (a) => { const m = mean(a); return sum(a.map((x) => (x - m) ** 2)) / (a.length - 1); };
  const sd = (a) => Math.sqrt(variance(a));
  const range = (a) => Math.max(...a) - Math.min(...a);
  // Tabla de frecuencias de datos discretos: [{ x, f, fr, F, Fr }]
  function freqTable(a) {
    const m = new Map();
    for (const x of a) m.set(x, (m.get(x) || 0) + 1);
    let F = 0;
    return [...m].sort((p, q) => p[0] - q[0]).map(([x, f]) => ({ x, f, fr: f / a.length, F: (F += f), Fr: F / a.length }));
  }
  // Regla de Sturges: k = 1 + 3,322·log n
  const sturges = (n) => 1 + 3.322 * Math.log10(n);

  // ---------- Descriptiva: datos agrupados ----------
  // Arma clases [a, b) de ancho w desde start; la última incluye el máximo
  function makeClasses(data, start, w) {
    const mx = Math.max(...data), out = [];
    for (let a = start; a <= mx + 1e-9; a += w) {
      const b = a + w;
      out.push([round(a, 6), round(b, 6), data.filter((x) => x >= a - 1e-9 && x < b - 1e-9).length]);
    }
    return out;
  }
  /* Estadísticos de una tabla de clases [[a, b, f]]. Moda: Mo = Li + A·f(i+1)/(f(i−1) + f(i+1)).
     Devuelve { n, rows: [{ a, b, m, f, F, fr, Fr }], mean, var, sd, median, medIdx, mode, modeIdx } */
  function grouped(classes) {
    const n = sum(classes.map((c) => c[2]));
    let F = 0;
    const rows = classes.map(([a, b, f]) => ({ a, b, m: (a + b) / 2, f, F: (F += f), fr: f / n, Fr: F / n }));
    const mn = sum(rows.map((r) => r.m * r.f)) / n;
    const v = sum(rows.map((r) => (r.m - mn) ** 2 * r.f)) / (n - 1);
    const medIdx = rows.findIndex((r) => r.F >= n / 2);
    const R = rows[medIdx], Fprev = medIdx ? rows[medIdx - 1].F : 0;
    const median = R.a + ((n / 2 - Fprev) / R.f) * (R.b - R.a);
    const fmax = Math.max(...rows.map((r) => r.f));
    const modeIdx = rows.findIndex((r) => r.f === fmax);
    const M = rows[modeIdx], fp = modeIdx ? rows[modeIdx - 1].f : 0, fn = rows[modeIdx + 1]?.f || 0;
    const mode = M.a + (fp + fn ? fn / (fp + fn) : 0.5) * (M.b - M.a);
    return { n, rows, mean: mn, var: v, sd: Math.sqrt(v), median, medIdx, mode, modeIdx, Fprev, fp, fn };
  }

  // ---------- Conteo ----------
  function fact(n) { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; }
  function comb(n, r) {
    if (r < 0 || r > n) return 0;
    r = Math.min(r, n - r);
    let c = 1;
    for (let i = 1; i <= r; i++) c = (c * (n - r + i)) / i;
    return Math.round(c);
  }
  const perm = (n, r) => { let p = 1; for (let i = 0; i < r; i++) p *= n - i; return p; };   // variaciones: n!/(n−r)!

  // ---------- Discretas ----------
  const binomPmf = (n, p, x) => (x < 0 || x > n ? 0 : comb(n, x) * p ** x * (1 - p) ** (n - x));
  const binomCdf = (n, p, x) => { let s = 0; for (let k = 0; k <= Math.min(x, n); k++) s += binomPmf(n, p, k); return Math.min(1, s); };
  const poisPmf = (l, x) => { if (x < 0) return 0; let t = Math.exp(-l); for (let k = 1; k <= x; k++) t *= l / k; return t; };
  const poisCdf = (l, x) => { let s = 0; for (let k = 0; k <= x; k++) s += poisPmf(l, k); return Math.min(1, s); };
  // E y V de una distribución discreta dada como [[x, p]]
  function moments(pairs) {
    const E = sum(pairs.map(([x, p]) => x * p)), E2 = sum(pairs.map(([x, p]) => x * x * p));
    return { E, E2, V: E2 - E * E, sd: Math.sqrt(E2 - E * E) };
  }

  // ---------- Normal ----------
  // Φ(z) con la aproximación de Zelen y Severo (A&S 26.2.17), error < 7,5·10⁻⁸
  function phi(z) {
    if (z < -8) return 0;
    if (z > 8) return 1;
    const t = 1 / (1 + 0.2316419 * Math.abs(z));
    const d = 0.3989422804014327 * Math.exp((-z * z) / 2);
    const q = d * t * (0.31938153 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
    return z >= 0 ? 1 - q : q;
  }
  const normPdf = (x, mu = 0, s = 1) => Math.exp(-(((x - mu) / s) ** 2) / 2) / (s * Math.sqrt(2 * Math.PI));
  const normCdf = (x, mu = 0, s = 1) => phi((x - mu) / s);
  // Inversa de Φ (algoritmo de Acklam, error relativo ≈ 1,15·10⁻⁹)
  function phiInv(p) {
    if (p <= 0) return -Infinity;
    if (p >= 1) return Infinity;
    const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239];
    const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
    const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
    const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
    const lo = 0.02425;
    if (p < lo) { const q = Math.sqrt(-2 * Math.log(p)); return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
    if (p > 1 - lo) return -phiInv(1 - p);
    const q = p - 0.5, r = q * q;
    return ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  }
  // Como en la tabla: z con dos decimales y área con cuatro
  const z2 = (z) => round(z, 2);
  const phiT = (z) => round(phi(z2(z)), 4);

  // ---------- t de Student ----------
  function lgamma(x) {
    const g = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
    let y = x, t = x + 5.5;
    t -= (x + 0.5) * Math.log(t);
    let s = 1.000000000190015;
    for (const k of g) s += k / ++y;
    return -t + Math.log((2.5066282746310005 * s) / x);
  }
  // Beta incompleta regularizada I_x(a, b) por fracción continua (Numerical Recipes)
  function betacf(a, b, x) {
    let qab = a + b, qap = a + 1, qam = a - 1, c = 1, d = 1 - (qab * x) / qap;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    d = 1 / d;
    let h = d;
    for (let m = 1; m <= 200; m++) {
      const m2 = 2 * m;
      let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
      d = 1 + aa * d; if (Math.abs(d) < 1e-30) d = 1e-30; c = 1 + aa / c; if (Math.abs(c) < 1e-30) c = 1e-30; d = 1 / d; h *= d * c;
      aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
      d = 1 + aa * d; if (Math.abs(d) < 1e-30) d = 1e-30; c = 1 + aa / c; if (Math.abs(c) < 1e-30) c = 1e-30; d = 1 / d;
      const del = d * c;
      h *= del;
      if (Math.abs(del - 1) < 3e-12) break;
    }
    return h;
  }
  function ibeta(x, a, b) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    const bt = Math.exp(lgamma(a + b) - lgamma(a) - lgamma(b) + a * Math.log(x) + b * Math.log(1 - x));
    return x < (a + 1) / (a + b + 2) ? (bt * betacf(a, b, x)) / a : 1 - (bt * betacf(b, a, 1 - x)) / b;
  }
  const tPdf = (t, v) => Math.exp(lgamma((v + 1) / 2) - lgamma(v / 2)) / Math.sqrt(v * Math.PI) * (1 + (t * t) / v) ** (-(v + 1) / 2);
  function tCdf(t, v) {
    const tail = 0.5 * ibeta(v / (v + t * t), v / 2, 0.5);
    return t >= 0 ? 1 - tail : tail;
  }
  // t que deja un área `right` a la derecha (como la tabla de la cátedra: P(T > t) = α)
  function tInv(right, v) {
    let lo = -60, hi = 60;
    for (let i = 0; i < 120; i++) { const mid = (lo + hi) / 2; if (1 - tCdf(mid, v) > right) lo = mid; else hi = mid; }
    return (lo + hi) / 2;
  }
  const zInv = (right) => phiInv(1 - right);   // z que deja `right` a la derecha

  // ---------- Exponencial (parámetro β = media, como la cátedra) ----------
  const expPdf = (x, beta) => (x < 0 ? 0 : Math.exp(-x / beta) / beta);
  const expCdf = (x, beta) => (x < 0 ? 0 : 1 - Math.exp(-x / beta));

  // ---------- Inferencia ----------
  /* Intervalo de confianza para μ. known: σ conocido (z); si no, t con n − 1 grados de libertad.
     Devuelve { crit, se, err, lo, hi, df } */
  function ci(xbar, s, n, conf, known = true) {
    const a2 = (1 - conf) / 2, df = n - 1;
    const crit = known ? zInv(a2) : tInv(a2, df);
    const se = s / Math.sqrt(n), err = crit * se;
    return { crit, se, err, lo: xbar - err, hi: xbar + err, df };
  }
  /* Test para μ: tail 'left' (Ha: μ < μ0), 'right' (μ > μ0) o 'two' (μ ≠ μ0).
     Devuelve { stat, crit, p, reject, df } (crit positivo; en 'left' la región es stat < −crit) */
  function test(xbar, mu0, s, n, alpha, tail, known = true) {
    const df = n - 1, se = s / Math.sqrt(n), stat = (xbar - mu0) / se;
    const cdf = (x) => (known ? phi(x) : tCdf(x, df));
    const crit = known ? zInv(tail === 'two' ? alpha / 2 : alpha) : tInv(tail === 'two' ? alpha / 2 : alpha, df);
    const p = tail === 'left' ? cdf(stat) : tail === 'right' ? 1 - cdf(stat) : 2 * (1 - cdf(Math.abs(stat)));
    const reject = tail === 'left' ? stat < -crit : tail === 'right' ? stat > crit : Math.abs(stat) > crit;
    return { stat, crit, p, reject, df, se };
  }

  // Generador pseudoaleatorio con semilla (las simulaciones se repiten igual al redibujar)
  const rng = (seed) => () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const gauss = (r) => Math.sqrt(-2 * Math.log(r() + 1e-12)) * Math.cos(2 * Math.PI * r());
  // Lee una lista de números escrita a mano: "2 9 11", "2; 9; 11", "3,1 4,2" (coma decimal) o "3.1, 4.2"
  function parseList(txt) {
    const s = String(txt).replace(/[−–]/g, '-');
    const parts = /;|\s/.test(s.trim()) && /\d,\d/.test(s) ? s.replace(/,/g, '.').split(/[\s;]+/) : s.split(/[\s;,]+/);
    return parts.map(Number).filter((x) => Number.isFinite(x) && String(x) !== '');
  }

  // ---------- Corrección de preguntas abiertas ----------
  /* Lee un número escrito a mano: "0,1536", "1/6", "15 %", "2e-4", "1.234,5", "79,6 (llamadas)²".
     Devuelve los candidatos posibles (un porcentaje vale también como proporción). */
  function parseNum(raw) {
    let s = String(raw).trim().replace(/[−–]/g, '-').replace(/\s+/g, ' ');
    if (!s) return [];
    s = s.replace(/×\s*10\^?/g, 'e').replace(/x\s*10\^/gi, 'e').replace(/\*\s*10\^/g, 'e');
    const one = (t) => {
      const m = t.match(/^[-+]?[\d.,]+(e[-+]?\d+)?/);
      if (!m) return NaN;
      let n = m[0].replace(/e.*/, '');
      if (n.includes(',') && n.includes('.')) n = n.replace(/\./g, '').replace(',', '.');
      else if (n.includes(',')) n = n.replace(',', '.');
      else if (/^[-+]?\d{1,3}(\.\d{3})+$/.test(n)) n = n.replace(/\./g, '');
      return parseFloat(n + (m[1] || ''));
    };
    const fr = s.match(/^([-+]?[\d.,]+)\s*\/\s*([\d.,]+)/);
    const v = fr ? one(fr[1]) / one(fr[2]) : one(s);
    if (!Number.isFinite(v)) return [];
    return /%/.test(s) ? [v / 100, v] : [v];
  }
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  // Corrige una respuesta abierta: { ok, empty?, html }
  function checkOpen(q, raw) {
    const txt = String(raw || '').trim();
    if (!txt) return { ok: false, empty: true, html: '<p><strong>Sin responder.</strong></p>' };
    const fmt = window.GUIDE.h.num;
    if (q.t === 'num') {
      const cands = parseNum(txt);
      if (!cands.length) return { ok: false, html: '<p><strong>No pude leer un número.</strong> Escribilo así: 0,1536 · 1/6 · 15 % · 2e-4.</p>' };
      const tol = q.tol ?? 0.01;
      const good = (v) => (q.a === 0 ? Math.abs(v) < 5e-4 : Math.abs(v - q.a) <= Math.abs(q.a) * tol + 5e-5);
      const ok = cands.some(good);
      const near = !ok && cands.some((v) => q.a !== 0 && Math.abs(v - q.a) <= Math.abs(q.a) * 0.06);
      return { ok, html: `<p><strong>${ok ? 'Correcto.' : near ? 'Cerca, pero no: revisá el redondeo, la tabla o un paso intermedio.' : 'Incorrecto.'}</strong> La respuesta es <b>${fmt(q.a, 4)}${q.u ? ` ${q.u}` : ''}</b>.</p>` };
    }
    // Texto: cuenta cuántos conceptos aparecen (cualquiera de sus sinónimos, sin tildes ni mayúsculas)
    const t = norm(txt);
    const hits = q.k.map((g) => g.some((w) => t.includes(norm(w))));
    const n = hits.filter(Boolean).length;
    const need = q.need ?? (q.k.length <= 2 ? q.k.length : q.k.length - 1);
    const ok = n >= need && txt.length >= 12;
    return { ok, html: `<p><strong>${ok ? 'Bien: están los conceptos clave.' : `Faltan conceptos: encontré ${n} de los ${need} necesarios.`}</strong></p>
      <ul class="oq-keys">${q.k.map((g, i) => `<li class="${hits[i] ? 'hit' : 'miss'}">${hits[i] ? '✓' : '✗'} ${g[0]}</li>`).join('')}</ul>` };
  }

  window.GUIDE.st = {
    sum, sorted, round, mean, median, modes, modeName, variance, sd, range, freqTable, sturges, makeClasses, grouped,
    fact, comb, perm, binomPmf, binomCdf, poisPmf, poisCdf, moments,
    phi, phiT, z2, phiInv, normPdf, normCdf, zInv, tPdf, tCdf, tInv, expPdf, expCdf,
    ci, test, rng, gauss, parseList, parseNum, checkOpen,
  };
})();
