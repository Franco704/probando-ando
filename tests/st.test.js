// Autocomprobación de js/labs/st.js contra los ejemplos de clase y de los apuntes. Uso: node tests/st.test.js
const assert = require('assert');
global.window = {};
require('../js/content/_helpers.js'); require('../js/labs/st.js');
const S = window.GUIDE.st, near = (a, b, t = 1e-4) => assert(Math.abs(a - b) < t, `${a} ≠ ${b}`);
const calls = [84, 91, 72, 68, 87, 78];                                   // clase 2: llamadas por minuto
near(S.mean(calls), 80); near(S.variance(calls), 79.6); near(S.sd(calls), 8.9219);
assert.deepStrictEqual(S.modes([1, 2, 3, 4, 5, 6, 7]), []);               // amodal
assert.deepStrictEqual(S.modes([2, 5, 3, 5, 6, 3, 8]), [3, 5]);           // bimodal
near(S.median([2, 9, 11, 5, 6, 13, 15, 8]), 8.5);
const g = S.grouped([[0, 10, 3], [10, 20, 6], [20, 30, 7], [30, 40, 12], [40, 50, 3]]);   // apunte: edades
near(g.mean, 26.9355); near(g.median, 29.2857); near(g.mode, 33);
near(S.sturges(20), 5.322, 1e-3);
assert.strictEqual(S.comb(52, 5), 2598960); assert.strictEqual(S.perm(52, 5), 311875200);
near(S.comb(4, 2) * S.comb(196, 3) / S.comb(200, 5), 0.0029242, 1e-6);    // apunte: 2 defectuosos de 5 (el apunte escribe 0,0292 por error)
near(S.binomPmf(4, 0.8, 2), 0.1536);
near(S.binomCdf(15, 0.2, 8), 0.9992); near(S.binomCdf(15, 0.2, 7), 0.9958); near(S.binomCdf(15, 0.2, 3), 0.6482);
near(S.binomCdf(9, 0.4, 5), 0.9006); near(S.binomCdf(12, 0.2, 4), 0.9274);
near(S.poisPmf(4, 6), 0.1042); near(S.poisCdf(10, 15), 0.9513); near(S.poisPmf(5, 3), 0.1404);
near(S.phi(-1.4), 0.0808); near(S.phi(1.2) - S.phi(-0.5), 0.5764); near(S.phiT(0.23), 0.591);
near(S.phiInv(0.975), 1.96, 1e-3); near(S.zInv(0.05), 1.645, 1e-3);
near(S.tInv(0.15, 9), 1.0997, 2e-3); near(S.tInv(0.005, 15), 2.947, 1e-3); near(1 - S.tCdf(2.44, 35), 0.010, 1e-3);
near(S.tCdf(0, 7), 0.5); near(S.tCdf(2.947, 15) - S.tCdf(-2.947, 15), 0.99, 1e-3);
const zinc = S.ci(2.6, 0.3, 36, 0.95);                                    // clase 9: zinc
near(zinc.lo, 2.502, 1e-3); near(zinc.hi, 2.698, 1e-3);
const sedal = S.test(7.8, 8, 0.5, 50, 0.01, 'two');                       // clase 10: sedal
near(sedal.stat, -2.8284); assert(sedal.reject); near(sedal.p, 0.0047, 2e-4);
const vida = S.test(71.8, 70, 8.9, 100, 0.05, 'right');
near(vida.stat, 2.0225); near(vida.p, 0.0216, 2e-4); assert(vida.reject);
near(1 - S.expCdf(7, 4), 0.1738); near(1 - S.expCdf(3, 0.5), 0.0025);
assert.deepStrictEqual(S.parseNum('1/6').map((v) => +v.toFixed(4)), [0.1667]);
assert.deepStrictEqual(S.parseNum('15 %'), [0.15, 15]);
near(S.parseNum('0,1536')[0], 0.1536); near(S.parseNum('1.234,5')[0], 1234.5); near(S.parseNum('2e-4')[0], 0.0002);
assert.deepStrictEqual(S.parseList('3,1 4,2 2,3'), [3.1, 4.2, 2.3]);
assert.deepStrictEqual(S.parseList('2, 9, 11'), [2, 9, 11]);
assert(S.checkOpen({ t: 'num', a: 0.1536 }, '0,154').ok);
assert(!S.checkOpen({ t: 'num', a: 0.1536 }, '0,16').ok);
console.log('st.js: todo OK');
