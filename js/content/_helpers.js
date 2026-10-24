/* Base del contenido: unidades (parciales), módulos (temas), array de lecciones y ayudantes para escribir lecciones.
   Cada lección: { id, module, title, keywords, tldr, goals?, body, labs?, exercises?, quiz?, sources? }
   - body puede incluir lab(i) para ubicar el laboratorio i dentro de la teoría.
   - labs: [{ type, title, ...config }] (los tipos se registran en js/labs/*.js)
   - exercises: { title, official? ('3.1' = TP 3, ejercicio 1), level (1-3), prompt, hints?, solution: { explain } }
   - quiz: [{ q, o: [opciones], a: índice correcto, e: explicación }]
   - open: preguntas abiertas corregidas al instante (ver st.js, checkOpen):
       { t: 'num', q, a: número, u?: 'kg' (unidad que se muestra), tol?: 0.01 (relativa), e: desarrollo }
       { t: 'text', q, k: [['etiqueta', 'sinónimo', ...], ...] (conceptos que deben aparecer), need?: cuántos, e: respuesta modelo }
   - sources: [{ title, ref?, url?, points: [] }] (ref = cita de libro, url = fuente web) */
(() => {
  const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const table = (head, rows) => `<div class="table-wrap"><table><thead><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  // kind: '' (nota), 'tip', 'warn', 'exam' (lo que suele tomarse)
  const note = (html, kind = '') => `<div class="note ${kind}">${html.trim().startsWith('<') ? html : `<p>${html}</p>`}</div>`;
  const lab = (i) => `<div class="lab-mount" data-lab="${i}"></div>`;
  const flow = (...steps) => `<ol class="flow">${steps.map((s) => `<li><span>${s}</span></li>`).join('')}</ol>`;
  // Definición textual de la bibliografía
  const def = (term, text, source) => `<figure class="def"><figcaption>${term}</figcaption><blockquote><p>${text}</p></blockquote>${source ? `<p class="def-src">${source}</p>` : ''}</figure>`;
  // Diagrama SVG o HTML con epígrafe
  const fig = (inner, caption) => `<figure class="fig">${inner}${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`;
  // Fórmulas: fracción en línea y bloque destacado
  const frac = (a, b) => `<span class="frac"><span>${a}</span><span>${b}</span></span>`;
  const eq = (html, label) => `<div class="eq">${label ? `<span class="eq-l">${label}</span>` : ''}<span class="eq-m">${html}</span></div>`;
  // Número con formato argentino: 1.234,5
  const num = (v, d = 2) => (Math.abs(v) < 1e-9 ? 0 : v).toLocaleString('es-AR', { maximumFractionDigits: d });

  /* ---------- Gráficas en SVG ----------
     plot({ x: [x0, x1], y: [y0, y1], xl, yl, w?, h?, alt?, anim?,
            areas: [{ pts: [[x, y]], cls, label?, at?: [x, y] }],
            curves: [{ f?: x => y, pts?: [[x, y]], dom?: [a, b], cls, label?, at?: x, ghost?, dash? }],
            guides: [{ x, y, xt?, yt?, cls? }]   líneas punteadas hasta los ejes con rótulo en el eje
            hlines / vlines: [{ y | x, cls, label }]
            points: [{ x, y, label?, cls?, pos? ('ne'|'nw'|'se'|'sw'|'e'|'w'|'n'|'s') }],
            arrows: [{ from: [x, y], to: [x, y], cls? }],
            texts: [{ x, y, t, cls?, anchor? }],
            segs: [{ from: [x, y], to: [x, y], cls? }]   segmentos sin flecha (tangentes, secantes, telarañas)
            ticks: { x: [valores], y: [valores] } })
     Cada eje pasa por el 0 del otro si el rango lo incluye; si no, va en el borde. Las curvas se recortan al área del gráfico. */
  let uid = 0;
  const POS = { ne: [7, -8, 'start'], nw: [-7, -8, 'end'], se: [7, 15, 'start'], sw: [-7, 15, 'end'], e: [9, 4, 'start'], w: [-9, 4, 'end'], n: [0, -10, 'middle'], s: [0, 18, 'middle'] };
  function plot(s) {
    const W = s.w || 440, H = s.h || 300, m = { l: 44, r: 22, t: 18, b: 34 };
    const [x0, x1] = s.x, [y0, y1] = s.y;
    const X = (v) => m.l + ((v - x0) / (x1 - x0)) * (W - m.l - m.r);
    const Y = (v) => H - m.b - ((v - y0) / (y1 - y0)) * (H - m.t - m.b);
    const P = (arr) => arr.map(([a, b]) => `${X(a).toFixed(1)},${Y(b).toFixed(1)}`).join(' ');
    const id = `pl${++uid}`;
    const anim = s.anim !== false;
    const sample = (c) => {
      if (c.pts) return c.pts;
      const [a, b] = c.dom || s.x, n = c.n || 80, out = [];
      for (let i = 0; i <= n; i++) {
        const x = a + ((b - a) * i) / n, y = c.f(x);
        if (Number.isFinite(y) && y > y0 - (y1 - y0) * 2 && y < y1 + (y1 - y0) * 2) out.push([x, y]);
      }
      return out;
    };
    const inside = ([x, y]) => x >= x0 && x <= x1 && y >= y0 && y <= y1;
    // yAxisLeft: el eje vertical va en el borde izquierdo aunque el rango incluya el 0 (barras que empiezan en x = 0)
    const ax = Y(y0 < 0 && y1 > 0 ? 0 : y0), ay = X(!s.yAxisLeft && x0 < 0 && x1 > 0 ? 0 : x0);
    let g = `<defs><clipPath id="${id}c"><rect x="${m.l}" y="${m.t - 4}" width="${W - m.l - m.r + 4}" height="${H - m.t - m.b + 4}"/></clipPath>
      <marker id="${id}a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="pl-arrowhead"/></marker></defs>`;
    // Áreas sombreadas
    g += `<g clip-path="url(#${id}c)">${(s.areas || []).map((a) => `<polygon points="${P(a.pts)}" class="pl-area ${a.cls || ''}${anim ? ' pl-fade' : ''}"/>`).join('')}</g>`;
    // Ejes
    g += `<line x1="${m.l}" y1="${ax}" x2="${W - m.r + 6}" y2="${ax}" class="pl-axis" marker-end="url(#${id}a)"/>
      <line x1="${ay}" y1="${H - m.b}" x2="${ay}" y2="${m.t - 10}" class="pl-axis" marker-end="url(#${id}a)"/>
      <text x="${W - m.r + 4}" y="${ax + 20}" class="pl-axl" text-anchor="end">${s.xl || 'x'}</text>
      <text x="${ay - 8}" y="${m.t - 2}" class="pl-axl" text-anchor="end">${s.yl || 'y'}</text>
      ${!s.yAxisLeft && x0 <= 0 && x1 >= 0 && y0 <= 0 && y1 >= 0 ? `<text x="${ay - 6}" y="${ax + 14}" class="pl-tick" text-anchor="end">0</text>` : ''}`;
    const T = s.ticks || {};
    for (const v of T.x || []) if (v || s.yAxisLeft) g += `<line x1="${X(v)}" y1="${ax - 3}" x2="${X(v)}" y2="${ax + 3}" class="pl-axis"/><text x="${X(v)}" y="${ax + 15}" class="pl-tick" text-anchor="middle">${num(v)}</text>`;
    for (const v of T.y || []) if (v) g += `<line x1="${ay - 3}" y1="${Y(v)}" x2="${ay + 3}" y2="${Y(v)}" class="pl-axis"/><text x="${ay - 6}" y="${Y(v) + 4}" class="pl-tick" text-anchor="end">${num(v)}</text>`;
    // Guías punteadas desde un punto hacia los ejes
    for (const q of s.guides || []) {
 g += `<polyline points="${ay},${Y(q.y)} ${X(q.x)},${Y(q.y)} ${X(q.x)},${ax}" class="pl-guide ${q.cls || ''}"/>`;
      if (q.yt !== '') g += `<text x="${ay - 6}" y="${Y(q.y) + 4}" class="pl-tick ${q.cls || ''}" text-anchor="end">${q.yt ?? num(q.y)}</text>`;
      if (q.xt !== '') g += `<text x="${X(q.x)}" y="${ax + 15}" class="pl-tick ${q.cls || ''}" text-anchor="middle">${q.xt ?? num(q.x)}</text>`;
    }
    for (const l of s.hlines || []) g += `<line x1="${m.l}" y1="${Y(l.y)}" x2="${W - m.r}" y2="${Y(l.y)}" class="pl-line ${l.cls || ''}"/>${l.label ? `<text x="${W - m.r}" y="${Y(l.y) - 6}" class="pl-lbl ${l.cls || ''}" text-anchor="end">${l.label}</text>` : ''}`;
 for (const l of s.vlines || []) g += `<line x1="${X(l.x)}" y1="${H - m.b}" x2="${X(l.x)}" y2="${m.t}" class="pl-line ${l.cls || ''}"/>${l.label ? `<text x="${X(l.x) + 5}" y="${m.t + 10}" class="pl-lbl ${l.cls || ''}">${l.label}</text>` : ''}`;
    // Curvas
    let labels = '';
    g += `<g clip-path="url(#${id}c)">`;
    for (const c of s.curves || []) {
      const pts = sample(c);
      if (pts.length < 2) continue;
      g += `<path d="M${P(pts).replace(/ /g, 'L')}" class="pl-curve ${c.cls || ''}${c.ghost ? ' pl-ghost' : ''}${c.dash ? ' pl-dash' : ''}${anim && !c.ghost ? ' pl-draw' : ''}" pathLength="1"/>`;
      if (c.label) {
        let pt = c.at != null ? [c.at, c.f ? c.f(c.at) : pts.find((p) => p[0] >= c.at)?.[1]] : [...pts].reverse().find(inside);
        if (pt && Number.isFinite(pt[1])) labels += `<text x="${X(pt[0]) + 5}" y="${Y(pt[1]) - 6}" class="pl-lbl ${c.cls || ''}${c.ghost ? ' pl-ghost-t' : ''}">${c.label}</text>`;
      }
    }
    g += `</g>${labels}`;
    for (const a of s.areas || []) if (a.label) g += `<text x="${X(a.at[0])}" y="${Y(a.at[1])}" class="pl-lbl pl-alab ${a.cls || ''}" text-anchor="middle">${a.label}</text>`;
    g += `<g clip-path="url(#${id}c)">${(s.segs || []).map((q) => `<line x1="${X(q.from[0])}" y1="${Y(q.from[1])}" x2="${X(q.to[0])}" y2="${Y(q.to[1])}" class="pl-seg ${q.cls || ''}"/>`).join('')}</g>`;
    for (const a of s.arrows || []) g += `<line x1="${X(a.from[0])}" y1="${Y(a.from[1])}" x2="${X(a.to[0])}" y2="${Y(a.to[1])}" class="pl-arrow ${a.cls || ''}" marker-end="url(#${id}a)"/>`;
    for (const p of s.points || []) {
      const [dx, dy, an] = POS[p.pos || 'ne'];
      g += `<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="${p.r || 5}" class="pl-pt ${p.cls || ''}${anim ? ' pl-pop' : ''}"/>${p.label ? `<text x="${X(p.x) + dx}" y="${Y(p.y) + dy}" class="pl-lbl pl-ptl ${p.cls || ''}" text-anchor="${an}">${p.label}</text>` : ''}`;
    }
    for (const t of s.texts || []) g += `<text x="${X(t.x)}" y="${Y(t.y)}" class="pl-lbl ${t.cls || ''}" text-anchor="${t.anchor || 'middle'}">${t.t}</text>`;
    return `<svg class="plot" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="${esc(s.alt || 'Gráfico')}">${g}</svg>`;
  }
  // Gráfico con epígrafe, listo para el cuerpo de una lección
  const chart = (spec, caption) => fig(plot(spec), caption);

  // all: el simulacro toma preguntas de todos los módulos (el final integra la materia completa)
  const UNITS = [
    { id: 'p1', title: 'Primer parcial', name: 'Descriptiva, probabilidad y discretas' },
    { id: 'p2', title: 'Segundo parcial', name: 'Continuas, muestreo e inferencia' },
    { id: 'final', title: 'Final', name: 'Toda la materia', all: true },
  ];

  // stop = nombre corto para el recorrido de la portada; tema = orden del tema en la materia; tp = trabajo práctico (y parte)
  const MODULES = [
    { id: 'u1', unit: 'p1', tema: '1', tp: '1 (I)', title: 'Estadística descriptiva: datos y frecuencias', stop: 'f · fr', blurb: 'población y muestra, tipos de variables, tablas de frecuencias, intervalos de clase, barras e histogramas' },
    { id: 'u2', unit: 'p1', tema: '2', tp: '1 (II)', title: 'Medidas de posición y de dispersión', stop: 'x̄ · s', blurb: 'media, mediana y moda con datos sueltos y agrupados, varianza, desvío, rango y asimetría' },
    { id: 'u3', unit: 'p1', tema: '3', tp: '2', title: 'Introducción a la probabilidad', stop: 'P(A)', blurb: 'experimento aleatorio, espacio muestral, sucesos, Laplace, axiomas, conteo y combinatoria' },
    { id: 'u4', unit: 'p1', tema: '4', tp: '2', title: 'Probabilidad condicional y Bayes', stop: 'P(A|B)', blurb: 'probabilidad condicional, regla de la multiplicación, independencia, probabilidad total y Bayes' },
    { id: 'u5', unit: 'p1', tema: '5', tp: '3', title: 'Variables aleatorias discretas', stop: 'f(x)', blurb: 'variable aleatoria, función de probabilidad, acumulada, esperanza, varianza y desvío' },
    { id: 'u6', unit: 'p1', tema: '6', tp: '3', title: 'Distribuciones Binomial y Poisson', stop: 'B · Po', blurb: 'experimento binomial, proceso de Poisson, fórmulas, tablas acumuladas, media y varianza' },
    { id: 'u7', unit: 'p2', tema: '7', tp: '4', title: 'Variables aleatorias continuas', stop: '∫ f dx', blurb: 'función de densidad, área bajo la curva, acumulada F(x), esperanza, varianza y coeficiente de variación' },
    { id: 'u8', unit: 'p2', tema: '8', tp: '4', title: 'Distribuciones Normal y exponencial', stop: 'N(μ, σ)', blurb: 'campana de Gauss, tipificación, tabla de z, búsqueda inversa y tiempo de espera exponencial' },
    { id: 'u9', unit: 'p2', tema: '9', tp: '5', title: 'Muestreo e intervalos de confianza', stop: 'x̄ ± e', blurb: 'población y muestra, distribución de x̄, Teorema del Límite Central, t de Student e intervalos para μ' },
    { id: 'u10', unit: 'p2', tema: '10', tp: '6', title: 'Test de hipótesis', stop: 'H₀', blurb: 'hipótesis nula y alternativa, una y dos colas, región de rechazo, valor P y errores de tipo I y II' },
  ];

  window.GUIDE = { UNITS, MODULES, LESSONS: [], LABS: {}, h: { esc, table, note, lab, flow, def, fig, frac, eq, num, plot, chart } };
})();
