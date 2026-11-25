// Recursos para el parcial: hoja de fórmulas, taller de gráficas y las tablas de la cátedra calculadas en la página.
import { $, irA } from '../nucleo/dom.js';
import { PARCIALES, MODULOS, LECCIONES, FORMULAS, modulo, leccionesDe } from '../temario/indice.js';
import { montarLaboratorio, DE_GRAFICAS } from '../laboratorios/indice.js';
import { S } from '../estadistica/calculos.js';

const titulo = (u) => `<h2>${u.title}<span>${u.name}</span></h2>`;
const saltos = (prefijo, lista) => `<nav class="filtro" aria-label="Ir a un parcial">${lista.map((u) => `<a class="btn sm" href="#${prefijo}-${u.id}" data-salto data-u="${u.id}">${u.title}</a>`).join('')}</nav>`;
// Los saltos dentro de la página no cambian la ruta
const activarSaltos = (main) => main.querySelectorAll('[data-salto]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); irA($(a.getAttribute('href'), main)); }));

export function vistaFormulas(main) {
  document.title = 'Fórmulas, Probando Ando';
  const conFichas = (u) => MODULOS.filter((m) => m.unit === u.id && FORMULAS.some((f) => f.m === m.id));
  const lista = PARCIALES.filter((u) => conFichas(u).length);
  main.innerHTML = `
    <article class="lesson formulas-page">
      <h1>Fórmulas</h1>
      <p class="tldr">Todo lo que hay que saber calcular, parcial por parcial. Tocá el nombre del tema para ir a la lección donde se explica cada fórmula.</p>
      ${saltos('f', lista)}
      ${lista.map((u) => `<section data-u="${u.id}" id="f-${u.id}">${titulo(u)}
        ${conFichas(u).map((m) => `<h3><a href="#/${leccionesDe(m.id)[0].id}">Tema ${m.tema}: ${m.title}</a></h3>
          <dl class="fichas">${FORMULAS.filter((f) => f.m === m.id).map((f) => `<div class="ficha"><dt>${f.n}</dt><dd><span class="f">${f.f}</span>${f.d ? `<small>${f.d}</small>` : ''}</dd></div>`).join('')}</dl>`).join('')}
      </section>`).join('')}
    </article>`;
  activarSaltos(main);
}

export function vistaGraficas(main) {
  document.title = 'Taller de gráficas, Probando Ando';
  const todos = LECCIONES.flatMap((l) => (l.labs || []).filter((c) => DE_GRAFICAS.includes(c.type)).map((c) => ({ c, l, m: modulo(l.module) })));
  const lista = PARCIALES.filter((u) => !u.all && todos.some((x) => x.m.unit === u.id));
  main.innerHTML = `
    <article class="lesson labs-page">
      <h1>Taller de gráficas</h1>
      <p class="tldr">Los ${todos.length} laboratorios gráficos de la guía en un solo lugar. Para cada uno: <mark>predecí</mark> el resultado (qué área queda sombreada, hacia dónde se mueve la campana, si se rechaza H₀), después mové el control y comprobá. Arriba de cada uno está la lección donde se explica.</p>
      ${saltos('g', lista)}
      ${lista.map((u) => `<section class="labs-parcial" data-u="${u.id}" id="g-${u.id}">${titulo(u)}
        ${todos.filter((x) => x.m.unit === u.id).map((x) => `<div class="labs-item"><p class="labs-de">Tema ${x.m.tema}, <a href="#/${x.l.id}">${x.l.title}</a></p><div class="lab-mount" data-g="${todos.indexOf(x)}"></div></div>`).join('')}
      </section>`).join('')}
    </article>`;
  main.querySelectorAll('[data-g]').forEach((el) => montarLaboratorio(el, todos[+el.dataset.g].c));
  activarSaltos(main);
}

// ---------- Tablas: las de la cátedra (Walpole), calculadas en la página ----------
const f4 = (v) => v.toFixed(4).replace('.', ',');
const tbl = (head, rows, cls = '') => `<div class="table-wrap st-table ${cls}"><table><thead><tr>${head.map((x) => `<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c, i) => (i ? `<td>${c}</td>` : `<th scope="row">${c}</th>`)).join('')}</tr>`).join('')}</tbody></table></div>`;
const BP = [0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
const PL = { a: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9], b: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5], c: [5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5], d: [10, 11, 12, 13, 14, 15, 16, 17, 18] };
const TA = [0.4, 0.3, 0.2, 0.15, 0.1, 0.05, 0.025, 0.02, 0.015, 0.01, 0.0075, 0.005, 0.0025, 0.0005];

export function vistaTablas(main) {
  document.title = 'Tablas, Probando Ando';
  const zRows = (neg) => Array.from({ length: 35 }, (_, i) => (neg ? -3.4 + i * 0.1 : i * 0.1)).map((z) => [(neg && z > -0.05 ? '−0,0' : z.toFixed(1).replace('.', ',').replace('-', '−')),
    ...Array.from({ length: 10 }, (_, j) => f4(S.phi(neg ? z - j / 100 : z + j / 100)))]);
  const tRows = [...Array.from({ length: 30 }, (_, i) => i + 1), 40, 60, 120, Infinity].map((v) => [v === Infinity ? '∞' : v, ...TA.map((a) => f4(v === Infinity ? S.zInv(a) : S.tInv(a, v)))]);
  main.innerHTML = `
    <article class="lesson tables-page">
      <h1>Tablas</h1>
      <p class="tldr">Las tablas del apéndice de Walpole que usa la cátedra, calculadas en la página: <mark>Binomial</mark> y <mark>Poisson</mark> acumuladas (P(X ≤ x)), <mark>Normal estándar</mark> (área a la izquierda de z) y <mark>t de Student</mark> (t que deja un área α a la derecha). Sirven para practicar la lectura igual que en el parcial.</p>
      <nav class="filtro" aria-label="Ir a una tabla"><a class="btn sm" href="#t-bin" data-salto>Binomial</a><a class="btn sm" href="#t-poi" data-salto>Poisson</a><a class="btn sm" href="#t-z" data-salto>Normal</a><a class="btn sm" href="#t-t" data-salto>t de Student</a></nav>
      <section id="t-bin"><h2>Binomial acumulada: B(x; n, p) = P(X ≤ x)</h2>
        <p>Para una probabilidad puntual: P(X = x) = B(x) − B(x − 1). Para “al menos”: P(X ≥ x) = 1 − B(x − 1). Si p &gt; 0,5 y la tabla no la tiene, contá los fracasos (q = 1 − p).</p>
        <label class="lab-sel"><span>n</span><select id="binN">${Array.from({ length: 20 }, (_, i) => `<option ${i + 1 === 10 ? 'selected' : ''}>${i + 1}</option>`).join('')}</select></label>
        <div id="binT"></div></section>
      <section id="t-poi"><h2>Poisson acumulada: P(X ≤ x; λ)</h2>
        <p>La tabla de Walpole usa μ en lugar de λ. Para un punto: P(X = x) = F(x) − F(x − 1).</p>
        <label class="lab-sel"><span>λ</span><select id="poiG"><option value="a">0,1 a 0,9</option><option value="b" selected>1 a 5</option><option value="c">5,5 a 9,5</option><option value="d">10 a 18</option></select></label>
        <div id="poiT"></div></section>
      <section id="t-z"><h2>Normal estándar: Φ(z) = P(Z ≤ z)</h2>
        <p>Entrada por fila (z con un decimal) y columna (segundo decimal). Para la derecha: P(Z &gt; z) = 1 − Φ(z). Para el valor crítico se busca el área dentro de la tabla: Φ(1,96) = 0,9750, Φ(1,645) ≈ 0,95, Φ(2,575) ≈ 0,995.</p>
        <h3>z negativos</h3>${tbl(['z', ...Array.from({ length: 10 }, (_, j) => `,0${j}`)], zRows(true), 'z')}
        <h3>z positivos</h3>${tbl(['z', ...Array.from({ length: 10 }, (_, j) => `,0${j}`)], zRows(false), 'z')}</section>
      <section id="t-t"><h2>t de Student: t<sub>α</sub> con P(T &gt; t<sub>α</sub>) = α</h2>
        <p>Filas: grados de libertad ν = n − 1. Columnas: área α a la derecha. Para un intervalo del 95 % se busca α/2 = 0,025; la última fila (∞) coincide con la normal.</p>
        ${tbl(['ν \\ α', ...TA.map((a) => String(a).replace('.', ','))], tRows, 't')}</section>
    </article>`;
  const drawBin = () => { const n = +$('#binN', main).value; $('#binT', main).innerHTML = tbl(['x', ...BP.map((p) => String(p).replace('.', ','))], Array.from({ length: n + 1 }, (_, x) => [x, ...BP.map((p) => f4(S.binomCdf(n, p, x)))])); };
  const drawPoi = () => {
    const L = PL[$('#poiG', main).value], top = Math.ceil(Math.max(...L) * 2.6 + 6);
    const rows = []; for (let x = 0; x <= top; x++) { const r = L.map((l) => S.poisCdf(l, x)); if (x > 0 && r.every((v) => v > 0.99995) && rows.at(-1).slice(1).every((v) => v === '1,0000')) break; rows.push([x, ...r.map(f4)]); }
    $('#poiT', main).innerHTML = tbl(['x', ...L.map((l) => String(l).replace('.', ','))], rows);
  };
  $('#binN', main).addEventListener('change', drawBin);
  $('#poiG', main).addEventListener('change', drawPoi);
  activarSaltos(main);
  drawBin(); drawPoi();
}
