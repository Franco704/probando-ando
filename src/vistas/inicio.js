// Portada: Newton Raphson real sobre x³ − 100 (calculado con src/metodos/numericos.js), con las cifras correctas de cada iterado;
// después, los parciales y el final con sus temas y su avance, y las otras guías.
import { $ } from '../nucleo/dom.js';
import { num } from '../nucleo/formato.js';
import { plot } from '../temario/redaccion.js';
import { S } from '../estadistica/calculos.js';
import { PARCIALES, MODULOS, LECCIONES, PREGUNTAS, ABIERTAS, EJERCICIOS, leccionesDe, modulosDe, etiqueta } from '../temario/indice.js';
import { hechas, hechasDe, aciertos, paraRepasar, siguienteLeccion } from '../estudio/progreso.js';
import { OTRAS_GUIAS } from '../estudio/otras-guias.js';
import { icono } from '../ui/iconos.js';

const REPO = 'https://github.com/Franco704/probando-ando';
const P = 0.3, NS = [5, 10, 20, 40];
const f4 = (v) => v.toFixed(4).replace('.', ',');

// De la moneda a la campana: la Binomial B(n; 0,3) en barras y la Normal N(np, √(npq)) encima.
// Al crecer n la aproximación mejora: se compara P(X ≤ k) exacta con la normal con corrección por continuidad.
function campana(n) {
  const mu = n * P, s = Math.sqrt(n * P * (1 - P)), k = Math.round(mu);
  const xs = Array.from({ length: n + 1 }, (_, x) => x).filter((x) => x <= mu + 4.2 * s);
  const ymax = Math.max(...xs.map((x) => S.binomPmf(n, P, x))) * 1.2;
  const bw = 0.82;
  const grafico = plot({ x: [-0.8, xs.at(-1) + 0.8], y: [0, ymax], w: 440, h: 240, xl: 'x', yl: 'P(X = x)', alt: `Binomial con n = ${n} y p = 0,3, con la normal de media ${num(mu, 2)} y desvío ${num(s, 3)} encima`,
    ticks: { x: xs.filter((x) => xs.length <= 12 || x % 5 === 0) },
    areas: xs.map((x) => { const y = S.binomPmf(n, P, x); return { pts: [[x - bw / 2, 0], [x - bw / 2, y], [x + bw / 2, y], [x + bw / 2, 0]], cls: x <= k ? 'a-hi' : 'a-bar' }; }),
    curves: [{ f: (x) => S.normPdf(x, mu, s), n: 160, cls: 'c-f', label: 'Normal', dom: [-0.8, xs.at(-1) + 0.8] }] });
  const exacta = S.binomCdf(n, P, k), aprox = S.normCdf(k + 0.5, mu, s);
  return { grafico, k, mu, s, exacta, aprox };
}

function moneda(fig) {
  const dibujar = (n) => {
    const c = campana(n);
    fig.querySelector('.campana-grafico').innerHTML = c.grafico;
    fig.querySelector('.campana-lectura').innerHTML = `
      <div><dt>Binomial exacta</dt><dd>P(X ≤ ${c.k}) = ${f4(c.exacta)}</dd></div>
      <div><dt>Normal con corrección</dt><dd>Φ((${c.k},5 − ${num(c.mu, 1)}) / ${num(c.s, 3)}) = ${f4(c.aprox)}</dd></div>
      <div><dt>Diferencia</dt><dd>${f4(Math.abs(c.exacta - c.aprox))}</dd></div>`;
  };
  fig.addEventListener('click', (e) => {
    const b = e.target.closest('[data-n]');
    if (!b) return;
    fig.querySelectorAll('[data-n]').forEach((x) => x.setAttribute('aria-pressed', x === b));
    dibujar(+b.dataset.n);
  });
  dibujar(20);
}

function filaModulo(m) {
  const total = leccionesDe(m.id).length, h = hechasDe(m.id), a = aciertos(m.id);
  return `<li><a class="mod" href="#/${leccionesDe(m.id)[0].id}">
    <span class="mod-tag">${etiqueta(m)}</span>
    <span class="mod-tit">${m.title}</span>
    <span class="mod-blurb">${m.blurb[0].toUpperCase()}${m.blurb.slice(1)}.</span>
    <span class="mod-estado"><span class="mod-medidor" aria-hidden="true"><span style="width:${(h / total) * 100}%"></span></span><small>${h === total ? 'Completa' : h ? `${h} de ${total} lecciones` : `${total} lecciones`}${a != null ? `, ${a} % de aciertos` : ''}</small></span>
  </a></li>`;
}

export function vistaInicio(main) {
  document.title = 'Probando Ando, guía de Probabilidad y Estadística';
  const sigue = siguienteLeccion();
  const nLabs = LECCIONES.reduce((n, l) => n + (l.labs?.length || 0), 0);
  const nTP = EJERCICIOS.filter(({ ex }) => ex.official).length;
  const repasar = paraRepasar().length;
  const flojo = MODULOS.map((m) => ({ m, s: aciertos(m.id) })).filter((x) => x.s != null && x.s < 70).sort((a, b) => a.s - b.s)[0];
  const cuantas = (u, lista, max) => Math.min(max, modulosDe(u.id).reduce((n, m) => n + lista.filter((q) => q.module === m.id).length, 0));
  const tps = (u) => [...new Set(modulosDe(u.id).map((m) => m.tp.replace(/ \(.*\)/, '')))];

  main.innerHTML = `
    <article class="inicio">
      <section class="hero">
        <div class="hero-texto">
          <p class="hero-materia">Probabilidad y Estadística 2026, UTN-FRT</p>
          <h1>De la moneda a la campana</h1>
          <p class="lede">La teoría de la cátedra, laboratorios que se mueven y las tablas calculadas en la página: ${LECCIONES.length} lecciones, ${nLabs} laboratorios, ${PREGUNTAS.length} preguntas de opción múltiple, ${ABIERTAS.length} abiertas que se corrigen al instante y ${EJERCICIOS.length} ejercicios resueltos, ${nTP} de ellos de los TP.</p>
          <div class="hero-acciones">
            <a class="btn primary" href="#/${sigue.id}">${hechas.size ? 'Seguir con' : 'Empezar con'} “${sigue.title}”</a>
            ${repasar ? `<a class="btn" href="#/repaso">Repasar ${repasar} ${repasar === 1 ? 'pregunta fallada' : 'preguntas falladas'}</a>` : '<a class="btn" href="#/tablas">Ver las tablas</a>'}
          </div>
          ${flojo ? `<p class="flojo">Tu punto más flojo por ahora es <a href="#/quiz/${flojo.m.id}">${flojo.m.title}</a>, con ${flojo.s} % de aciertos.</p>` : ''}
        </div>
        <figure class="campana">
          <div class="toggle" role="group" aria-label="Cantidad de ensayos n">${NS.map((n) => `<button type="button" data-n="${n}" aria-pressed="${n === 20}">n = ${n}</button>`).join('')}</div>
          <div class="campana-grafico"></div>
          <dl class="campana-lectura" aria-live="polite"></dl>
          <figcaption>Binomial con p = 0,3 y la Normal de igual media y desvío, calculadas con el mismo código que los laboratorios y las tablas. En ámbar, P(X ≤ k) con k = np redondeado: cuanto más grande es n, más se parecen. <a href="#/poblacion-muestra-tlc">Por qué pasa: el Teorema del Límite Central</a></figcaption>
        </figure>
      </section>

      ${PARCIALES.map((u) => `
        <section class="parcial" data-u="${u.id}" aria-labelledby="t-${u.id}">
          <header class="parcial-cabeza">
            <h2 id="t-${u.id}">${u.title}<span>${u.name}</span></h2>
            <p>${u.all ? 'Toda la materia, del primer tema al último. Su simulacro mezcla preguntas de toda la guía.' : `Trabajos prácticos ${tps(u).join(', ').replace(/, (\d+)$/, ' y $1')}.`}</p>
            <a class="btn sm" href="#/simulacro/${u.id}">Simulacro: ${cuantas(u, PREGUNTAS, 20)} preguntas y ${cuantas(u, ABIERTAS, 5)} abiertas</a>
          </header>
          ${u.all ? '' : `<ul class="mods">${modulosDe(u.id).map(filaModulo).join('')}</ul>`}
        </section>`).join('')}

      <section class="practica" aria-labelledby="t-practica">
        <h2 id="t-practica">Para practicar</h2>
        <ul>
          ${[
            ['#/tablas', 'tablas', 'Tablas', 'Binomial, Poisson, Normal estándar y t de Student, como las de Walpole.'],
            ['#/abiertas', 'abiertas', 'Preguntas abiertas', 'Cálculos con tolerancia de redondeo y teóricas por conceptos.'],
            ['#/graficas', 'graficas', 'Taller de gráficas', 'Histogramas, Venn, Bayes, densidades, el Límite Central y los tests.'],
            ['#/formulas', 'formulas', 'Fórmulas', 'Todo lo que hay que saber calcular, tema por tema.'],
            ['#/apuntes', 'apuntes', 'Apuntes de Juana Vicente', 'Apuntes de clase en PDF de la cursada 2026.'],
            ['#/repaso', 'repasar', 'Repasar', 'Las preguntas que fallaste, hasta que las aciertes.'],
          ].map(([h, i, t, d]) => `<li><a href="${h}">${icono(i, 22)}<span><b>${t}</b>${d}</span></a></li>`).join('')}
        </ul>
      </section>

      <section class="como" aria-labelledby="t-como">
        <h2 id="t-como">Cómo estudiar con esta guía</h2>
        <ol>
          <li>Leé la teoría de cada lección en orden: cada tema se apoya en el anterior.</li>
          <li>En cada laboratorio, anticipá qué va a pasar antes de mover el control. Así se entrena el parcial.</li>
          <li>Respondé las de opción múltiple y las <a href="#/abiertas">preguntas abiertas</a>: los cálculos se corrigen con tolerancia de redondeo (podés escribir “0,1536”, “1/6” o “15 %”), las teóricas por conceptos clave.</li>
          <li>Resolvé los ejercicios de los TP con lápiz, papel, calculadora y las <a href="#/tablas">tablas</a> antes de abrir la solución.</li>
          <li>Antes de cada parcial: su simulacro, la hoja de <a href="#/formulas">fórmulas</a> y lo que falles va a <a href="#/repaso">Repasar</a>.</li>
        </ol>
        <p class="atajos">Atajos de teclado: <kbd>←</kbd> y <kbd>→</kbd> para moverte entre lecciones, <kbd>/</kbd> para buscar.</p>
      </section>

      <section class="otras" aria-labelledby="t-otras">
        <div class="repo">
          <div><h2>El código está abierto</h2><p>Si encontrás un error o querés proponer una pregunta, abrí un issue en el repositorio.</p></div>
          <a class="btn" href="${REPO}" target="_blank" rel="noopener">Ver el repositorio en GitHub</a>
        </div>
        <h2 id="t-otras">Otras guías de la UTN</h2>
        ${OTRAS_GUIAS.map((g) => `<h3>${g.anio}</h3><ul class="guias">${g.guias.map(([n, d, slug]) => `<li><a href="https://franco704.github.io/${slug}/" target="_blank" rel="noopener"><b>${n}</b><span>${d}</span></a><a class="guia-repo" href="https://github.com/Franco704/${slug}" target="_blank" rel="noopener" aria-label="Repositorio de ${n}">Repositorio</a></li>`).join('')}</ul>`).join('')}
      </section>
    </article>`;
  moneda($('.campana', main));
  return null;
}
