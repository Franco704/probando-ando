/* Laboratorios de Probabilidad y Estadística. Cada uno redibuja al mover un control; la primera vista se anima y los redibujos no.
   Los cálculos vienen de st.js (los mismos que usan las soluciones, la página de tablas y las pruebas). */
(() => {
  const L = window.GUIDE.LABS;
  const { plot, num, esc } = window.GUIDE.h;
  const S = window.GUIDE.st;
  const f4 = (v) => num(v, 4);

  // ---------- Controles (los mismos que en las guías hermanas) ----------
  // Deslizadores: defs = [{ id, label, min, max, step, value, fmt? }]
  function sliders(el, defs, onChange) {
    const v = Object.fromEntries(defs.map((d) => [d.id, d.value]));
    el.insertAdjacentHTML('beforeend', `<div class="sl-grid">${defs.map((d) => `
      <label class="sl"><span class="sl-l">${d.label}</span>
        <input type="range" data-id="${d.id}" min="${d.min}" max="${d.max}" step="${d.step || 1}" value="${d.value}">
        <output data-o="${d.id}">${d.fmt ? d.fmt(d.value) : num(d.value)}</output></label>`).join('')}</div>`);
    const box = [...el.querySelectorAll('.sl-grid')].at(-1);
    box.querySelectorAll('.sl input').forEach((inp) => {
      const d = defs.find((x) => x.id === inp.dataset.id);
      inp.addEventListener('input', () => {
        v[d.id] = +inp.value;
        box.querySelector(`[data-o="${d.id}"]`).textContent = d.fmt ? d.fmt(v[d.id]) : num(v[d.id]);
        onChange(v, d.id);
      });
    });
    return v;
  }
  // Fija el valor de un deslizador desde el código (cuando cambia el rango)
  const setSlider = (el, v, id, val, max) => {
    const inp = el.querySelector(`[data-id="${id}"]`);
    if (max != null) inp.max = max;
    inp.value = val; v[id] = +inp.value;
    el.querySelector(`[data-o="${id}"]`).textContent = num(v[id]);
  };
  // Grupo de botones excluyentes: opts = [[valor, texto]]
  function toggle(el, label, opts, val, onChange) {
    el.insertAdjacentHTML('beforeend', `<div class="toggle" role="group" aria-label="${label}">${opts.map(([k, t]) => `<button type="button" data-k="${k}" aria-pressed="${k === val}">${t}</button>`).join('')}</div>`);
    const box = [...el.querySelectorAll('.toggle')].at(-1);
    box.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
      box.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', x === b));
      onChange(b.dataset.k);
    }));
    return box;
  }
  // Campos numéricos: defs = [{ id, label, value, step? }]
  function inputs(el, defs, onChange) {
    const v = Object.fromEntries(defs.map((d) => [d.id, d.value]));
    el.insertAdjacentHTML('beforeend', `<div class="calc-grid">${defs.map((d) => `<label>${d.label}<input type="number" data-n="${d.id}" value="${d.value}" step="${d.step || 'any'}"></label>`).join('')}</div>`);
    const box = [...el.querySelectorAll('.calc-grid')].at(-1);
    box.addEventListener('input', (e) => { const k = e.target.dataset.n; if (!k) return; const x = parseFloat(e.target.value); if (Number.isFinite(x)) { v[k] = x; onChange(v, k); } });
    return v;
  }
  const chips = (arr) => `<div class="rd">${arr.filter(Boolean).map(([k, val, cls]) => `<span class="chip ${cls || ''}"><b>${k}</b> <span>${val}</span></span>`).join('')}</div>`;
  const shell = (el) => { el.insertAdjacentHTML('beforeend', '<div class="pl-host"></div><div class="lab-read" aria-live="polite"></div>'); return [[...el.querySelectorAll('.pl-host')].at(-1), [...el.querySelectorAll('.lab-read')].at(-1)]; };
  const niceTicks = ([a, b], n = 5) => {
    const raw = (b - a) / n, mag = 10 ** Math.floor(Math.log10(raw)), step = [1, 2, 2.5, 5, 10].map((k) => k * mag).find((s) => s >= raw);
    const out = [];
    for (let v = Math.ceil(a / step - 1e-9) * step; v <= b + 1e-9; v += step) out.push(+v.toFixed(10));
    return out;
  };
  const rect = (a, b, y, cls) => ({ pts: [[a, 0], [a, y], [b, y], [b, 0]], cls });
  // Área bajo una curva entre a y b como polígono para plot
  const under = (f, a, b, cls, n = 60) => ({ pts: [[a, 0], ...Array.from({ length: n + 1 }, (_, i) => { const x = a + ((b - a) * i) / n; return [x, f(x)]; }), [b, 0]], cls });
  window.GUIDE.labUtil = { sliders, toggle, inputs, chips, shell, niceTicks };

  // ---------- Gráficos estáticos para el cuerpo de las lecciones ----------
  // Barras separadas (discreta): pts = [[x, y]]; hi = valores de x resaltados
  function bars(s) {
    const xs = s.pts.map((p) => p[0]), ymax = s.ymax || Math.max(...s.pts.map((p) => p[1])) * 1.18;
    const w = s.bw || 0.6;
    return plot({ x: [Math.min(...xs) - 1, Math.max(...xs) + 1], y: [0, ymax], w: s.w || 440, h: s.h || 240, xl: s.xl || 'x', yl: s.yl || 'f', alt: s.alt, anim: s.anim, yAxisLeft: true,
      ticks: { x: s.xt || xs, y: s.yt || niceTicks([0, ymax], 4) },
      areas: s.pts.map(([x, y]) => rect(x - w / 2, x + w / 2, y, (s.hi || []).includes(x) ? 'a-hi' : 'a-bar')),
      texts: s.labels ? s.pts.map(([x, y]) => ({ x, y: y + ymax * 0.035, t: s.labels === true ? num(y, 3) : s.labels(x, y), cls: 'pl-small' })) : [] });
  }
  // Histograma (continua): cls = [[a, b, y]] contiguos; poly = true agrega el polígono de frecuencias
  function histo(s) {
    const a0 = s.cls[0][0], b1 = s.cls.at(-1)[1], ymax = s.ymax || Math.max(...s.cls.map((c) => c[2])) * 1.18, w = b1 - a0;
    return plot({ x: [a0 - w * 0.06, b1 + w * 0.06], y: [0, ymax], w: s.w || 440, h: s.h || 240, xl: s.xl || 'x', yl: s.yl || 'fr', alt: s.alt, anim: s.anim,
      ticks: { x: s.xt || [...s.cls.map((c) => c[0]), b1], y: s.yt || niceTicks([0, ymax], 4) },
      areas: s.cls.map(([a, b, y]) => rect(a, b, y, 'a-bar')),
      curves: s.poly ? [{ pts: [[a0 - (s.cls[0][1] - a0) / 2, 0], ...s.cls.map(([a, b, y]) => [(a + b) / 2, y]), [b1 + (b1 - s.cls.at(-1)[0]) / 2, 0]], cls: 'c-res' }] : [],
      texts: s.labels ? s.cls.map(([a, b, y]) => ({ x: (a + b) / 2, y: y + ymax * 0.035, t: num(y, 3), cls: 'pl-small' })) : [] });
  }
  // Escalera de la acumulada de una discreta: pts = [[x, F(x)]]
  function steps(s) {
    const xs = s.pts.map((p) => p[0]), lo = Math.min(...xs) - 1.5, hi = Math.max(...xs) + 1.5;
    const segs = [{ from: [lo, 0], to: [xs[0], 0], cls: 'c-sig' }, ...s.pts.map(([x, F], i) => ({ from: [x, F], to: [i < xs.length - 1 ? xs[i + 1] : hi, F], cls: 'c-sig' }))];
    return plot({ x: [lo, hi], y: [0, 1.12], w: s.w || 440, h: s.h || 220, xl: s.xl || 'x', yl: 'F(x)', alt: s.alt, anim: s.anim, yAxisLeft: true, ticks: { x: xs, y: s.yt || [0.25, 0.5, 0.75, 1] },
      segs, points: s.pts.map(([x, F]) => ({ x, y: F, r: 3.5, cls: 'c-sig' })) });
  }
  // Densidad con área sombreada entre a y b
  function area(s) {
    const [x0, x1] = s.x, ymax = s.ymax || 1;
    return plot({ x: [x0, x1], y: [0, ymax], w: s.w || 440, h: s.h || 230, xl: s.xl || 'x', yl: s.yl || 'f(x)', alt: s.alt, anim: s.anim, ticks: s.ticks || { x: niceTicks(s.x, 6), y: niceTicks([0, ymax], 3) },
      areas: (s.shade || []).map(([a, b, cls]) => under(s.f, Math.max(a, x0), Math.min(b, x1), cls || 'a-res')),
      curves: [{ f: s.f, n: 200, cls: 'c-f', dom: s.dom }], vlines: s.vlines, texts: s.texts, points: s.points });
  }
  Object.assign(window.GUIDE.h, { bars, histo, steps, area });

  // ---------- Datos: tabla de frecuencias, barras e histograma ----------
  // cfg: { data, kind: 'disc'|'cont', start?, w?, xl? }
  L.freq = (el, cfg) => {
    let kind = cfg.kind || 'disc', ogive = false;
    el.insertAdjacentHTML('beforeend', `<label class="lab-txt"><span>Datos (separados por espacios; coma o punto decimal)</span><textarea rows="2" data-t="d" spellcheck="false">${esc(cfg.data.join(' '))}</textarea></label>`);
    toggle(el, 'Tipo de tabla', [['disc', 'Sin agrupar (discreta)'], ['cont', 'Agrupada en clases']], kind, (k) => { kind = k; draw(); });
    toggle(el, 'Gráfico', [['f', 'Frecuencia relativa'], ['F', 'Relativa acumulada']], 'f', (k) => { ogive = k === 'F'; draw(); });
    const v = inputs(el, [{ id: 'start', label: 'Límite inferior de la 1.ª clase', value: cfg.start ?? Math.min(...cfg.data) }, { id: 'w', label: 'Amplitud de clase', value: cfg.w || 1 }], () => draw());
    const [host, read] = shell(el);
    let first = true;
    const draw = () => {
      const data = S.parseList(el.querySelector('[data-t="d"]').value);
      el.querySelector('.calc-grid').hidden = kind !== 'cont';
      if (data.length < 2) { read.innerHTML = '<p class="lab-note">Escribí al menos dos datos.</p>'; host.innerHTML = ''; return; }
      const n = data.length, mn = Math.min(...data), mx = Math.max(...data), k = S.sturges(n);
      let rows, svg;
      if (kind === 'disc') {
        const t = S.freqTable(data);
        rows = window.GUIDE.h.table(['x', 'f', 'fr', 'F', 'Fr'], t.map((r) => [num(r.x, 3), r.f, num(r.fr, 4), r.F, num(r.Fr, 4)]).concat([['Total', n, '1', '', '']]));
        svg = ogive ? steps({ pts: t.map((r) => [r.x, r.Fr]), anim: first, xl: cfg.xl || 'x' }) : bars({ pts: t.map((r) => [r.x, r.fr]), yl: 'fr', anim: first, xl: cfg.xl || 'x', bw: t.length > 1 ? Math.min(0.6, (t[1].x - t[0].x) * 0.6) : 0.6 });
      } else {
        if (!(v.w > 0) || v.start > mn) { read.innerHTML = `<p class="lab-note">La primera clase tiene que empezar en el mínimo (${num(mn, 3)}) o antes, con amplitud positiva.</p>`; host.innerHTML = ''; return; }
        const cl = S.makeClasses(data, v.start, v.w);
        if (cl.length > 40) { read.innerHTML = '<p class="lab-note">Con esa amplitud salen demasiadas clases: agrandala.</p>'; host.innerHTML = ''; return; }
        const g = S.grouped(cl);
        rows = window.GUIDE.h.table(['Clase [a; b)', 'Marca m', 'f', 'fr', 'F', 'Fr'], g.rows.map((r) => [`[${num(r.a, 3)}; ${num(r.b, 3)})`, num(r.m, 3), r.f, num(r.fr, 4), r.F, num(r.Fr, 4)]).concat([['Total', '', n, '1', '', '']]));
        svg = ogive
          ? plot({ x: [g.rows[0].a - v.w, g.rows.at(-1).b + v.w], y: [0, 1.12], w: 440, h: 230, xl: cfg.xl || 'x', yl: 'Fr', anim: first, ticks: { x: [...g.rows.map((r) => r.a), g.rows.at(-1).b].filter((_, i, a) => a.length < 12 || i % 2 === 0), y: [0.25, 0.5, 0.75, 1] },
            curves: [{ pts: [[g.rows[0].a, 0], ...g.rows.map((r) => [r.b, r.Fr])], cls: 'c-sig' }], points: g.rows.map((r) => ({ x: r.b, y: r.Fr, r: 3.5, cls: 'c-sig' })) })
          : histo({ cls: g.rows.map((r) => [r.a, r.b, r.fr]), anim: first, xl: cfg.xl || 'x', poly: true, xt: [...g.rows.map((r) => r.a), g.rows.at(-1).b].filter((_, i, a) => a.length < 12 || i % 2 === 0) });
      }
      host.innerHTML = svg;
      first = false;
      read.innerHTML = chips([['n', n, 'acc'], ['Mínimo', num(mn, 3)], ['Máximo', num(mx, 3)], ['Rango R', num(mx - mn, 3)], ['Sturges k = 1 + 3,322·log n', num(k, 2)], ['Amplitud sugerida R/k', num((mx - mn) / Math.round(k), 3)]])
        + rows + `<p class="lab-note">${kind === 'disc' ? 'Datos discretos o pocos valores distintos: barras separadas, una por valor.' : 'Datos continuos o muchos valores: clases [a; b) contiguas, histograma sin espacios entre barras. La línea une las marcas de clase (polígono de frecuencias).'} La suma de fr da 1 y la última Fr también.</p>`;
    };
    el.querySelector('[data-t="d"]').addEventListener('input', draw);
    draw();
  };

  // ---------- Medidas de posición y dispersión sobre un diagrama de puntos ----------
  // cfg: { data }
  L.measures = (el, cfg) => {
    el.insertAdjacentHTML('beforeend', `<label class="lab-txt"><span>Datos</span><textarea rows="2" data-t="d" spellcheck="false">${esc(cfg.data.join(' '))}</textarea></label>
      <div class="lab-row"><button class="btn sm" type="button" data-act="out">Agregar un dato atípico</button><button class="btn sm" type="button" data-act="reset">Volver a los datos originales</button></div>`);
    const [host, read] = shell(el);
    let first = true;
    const draw = () => {
      const data = S.parseList(el.querySelector('[data-t="d"]').value);
      if (data.length < 2) { read.innerHTML = '<p class="lab-note">Escribí al menos dos datos.</p>'; host.innerHTML = ''; return; }
      const m = S.mean(data), me = S.median(data), mo = S.modes(data), s = S.sd(data);
      const lo = Math.min(...data, m - s), hi = Math.max(...data, m + s), pad = (hi - lo) * 0.08 || 1;
      const count = new Map(), pts = [];
      for (const x of S.sorted(data)) { const k = (count.get(x) || 0) + 1; count.set(x, k); pts.push({ x, y: k, r: 5, cls: 'c-sig' }); }
      const top = Math.max(...count.values()) + 2.4;
      host.innerHTML = plot({ x: [lo - pad, hi + pad], y: [0, top], w: 460, h: 230, xl: 'x', yl: ' ', anim: first, ticks: { x: niceTicks([lo - pad, hi + pad], 6), y: [] },
        areas: [{ pts: [[m - s, 0], [m - s, top - 0.6], [m + s, top - 0.6], [m + s, 0]], cls: 'a-res' }],
        points: pts, vlines: [{ x: m, cls: 'c-res' }, { x: me, cls: 'c-mod' }],
        segs: [{ from: [m - s, top - 0.6], to: [m + s, top - 0.6], cls: 'c-res' }],
        texts: [{ x: m + s, y: top - 0.25, t: 'x̄ ± s', cls: 'c-res', anchor: 'end' }, { x: m, y: top * 0.72, t: ` x̄ = ${num(m, 2)}`, cls: 'c-res', anchor: m >= me ? 'start' : 'end' }, { x: me, y: top * 0.58, t: `Me = ${num(me, 2)} `, cls: 'c-mod', anchor: m >= me ? 'end' : 'start' }] });
      first = false;
      const dev = data.map((x) => x - m);
      read.innerHTML = chips([['n', data.length], ['Media x̄', num(m, 4), 'acc'], ['Mediana Me', num(me, 4)], ['Moda', mo.length ? `${mo.map((x) => num(x, 3)).join(' y ')} (${S.modeName(mo)})` : 'no tiene (amodal)'], ['s²', num(S.variance(data), 4)], ['s', num(s, 4)], ['Rango', num(S.range(data), 3)], ['Σ(x − x̄)', num(S.sum(dev), 6)]])
        + `<p class="lab-note">${Math.abs(m - me) < 1e-9 ? 'Media y mediana coinciden: los datos están balanceados.' : m > me ? 'La media quedó a la derecha de la mediana: hay datos grandes que la “tiran” (asimetría positiva).' : 'La media quedó a la izquierda de la mediana: hay datos chicos que la “tiran” (asimetría negativa).'} La suma de los desvíos respecto de la media siempre da 0: la media es el punto de equilibrio.</p>`;
    };
    el.querySelector('[data-t="d"]').addEventListener('input', draw);
    el.querySelector('[data-act="out"]').addEventListener('click', () => { const t = el.querySelector('[data-t="d"]'), d = S.parseList(t.value); t.value += ` ${num(Math.max(...d) + 4 * S.sd(d), 1).replace('.', '')}`; draw(); });
    el.querySelector('[data-act="reset"]').addEventListener('click', () => { el.querySelector('[data-t="d"]').value = cfg.data.join(' '); draw(); });
    draw();
  };

  // ---------- Asimetría: dónde quedan media, mediana y moda ----------
  L.skew = (el) => {
    const v = sliders(el, [{ id: 'a', label: 'Asimetría (izquierda ← 0 → derecha)', min: -8, max: 8, step: 1, value: 4 }], () => draw());
    const [host, read] = shell(el);
    let first = true;
    const draw = () => {
      // Normal asimétrica: f(x) = 2·φ(x)·Φ(αx); medidas por integración en una grilla
      const a = v.a, f = (x) => 2 * S.normPdf(x) * S.phi(a * x);
      const N = 1200, xs = Array.from({ length: N + 1 }, (_, i) => -4 + (8 * i) / N), dx = 8 / N, ys = xs.map(f);
      const mean = S.sum(xs.map((x, i) => x * ys[i])) * dx;
      let acc = 0, med = 0; for (let i = 0; i <= N; i++) { acc += ys[i] * dx; if (acc >= 0.5) { med = xs[i]; break; } }
      const mode = xs[ys.indexOf(Math.max(...ys))];
      host.innerHTML = plot({ x: [-4, 4], y: [0, 0.82], w: 440, h: 230, xl: 'x', yl: 'f', anim: first, ticks: { x: [-3, -2, -1, 1, 2, 3], y: [] },
        areas: [under(f, -4, 4, 'a-sig', 120)], curves: [{ f, n: 200, cls: 'c-f' }],
        vlines: [{ x: mode, cls: 'c-mod' }, { x: med, cls: 'c-sig' }, { x: mean, cls: 'c-res' }],
        texts: [[mode, 'Mo', 'c-mod', 0.78], [med, 'Me', 'c-sig', 0.7], [mean, 'x̄', 'c-res', 0.62]].map(([x, t, cls, y]) => ({ x, y, t, cls, anchor: a >= 0 ? 'start' : 'end' })) });
      first = false;
      read.innerHTML = chips([['Moda', num(mode, 2)], ['Mediana', num(med, 2)], ['Media', num(mean, 2), 'acc'], ['Orden', a > 0 ? 'Mo < Me < x̄' : a < 0 ? 'x̄ < Me < Mo' : 'x̄ = Me = Mo']])
        + `<p class="lab-note">${a === 0 ? 'Simétrica: las tres medidas coinciden.' : a > 0 ? 'Asimetría positiva (cola a la derecha): la media se va hacia la cola, x̄ > Me.' : 'Asimetría negativa (cola a la izquierda): x̄ < Me.'} La mediana siempre queda entre la moda y la media.</p>`;
    };
    draw();
  };

  // ---------- Sucesos en un espacio muestral: unión, intersección, complemento, independencia ----------
  // cfg: { S: [elementos], A: [...], B: [...], label? }
  L.venn = (el, cfg) => {
    const U = cfg.S || [1, 2, 3, 4, 5, 6];
    const A = new Set(cfg.A || [2, 4, 6]), B = new Set(cfg.B || [4, 5, 6]);
    el.insertAdjacentHTML('beforeend', `<p class="lab-note">${cfg.label || 'Espacio muestral de tirar un dado'}. Tocá cada elemento para ponerlo o sacarlo de A y de B.</p>
      <div class="venn-pick"><p><b>A</b> ${U.map((x) => `<button type="button" class="vp" data-s="A" data-x="${x}">${x}</button>`).join('')}</p>
      <p><b>B</b> ${U.map((x) => `<button type="button" class="vp" data-s="B" data-x="${x}">${x}</button>`).join('')}</p></div>`);
    const [host, read] = shell(el);
    const fmt = (set) => `{${[...set].join(', ')}}`;
    const draw = () => {
      el.querySelectorAll('.vp').forEach((b) => b.setAttribute('aria-pressed', (b.dataset.s === 'A' ? A : B).has(String(b.dataset.x)) || (b.dataset.s === 'A' ? A : B).has(+b.dataset.x)));
      const has = (s, x) => s.has(x) || s.has(String(x));
      const only = (p) => U.filter(p);
      const r = { a: only((x) => has(A, x) && !has(B, x)), ab: only((x) => has(A, x) && has(B, x)), b: only((x) => !has(A, x) && has(B, x)), out: only((x) => !has(A, x) && !has(B, x)) };
      const place = (arr, cx, cy, per = 3) => arr.map((x, i) => `<text x="${cx + ((i % per) - (per - 1) / 2) * 24}" y="${cy + Math.floor(i / per) * 20 - 4}" class="vn-el">${x}</text>`).join('');
      host.innerHTML = `<svg class="venn" viewBox="0 0 440 220" role="img" aria-label="Diagrama de Venn de A y B">
        <rect x="6" y="6" width="428" height="208" rx="10" class="vn-s"/><text x="20" y="28" class="vn-l">S</text>
        <circle cx="170" cy="112" r="80" class="vn-a"/><circle cx="270" cy="112" r="80" class="vn-b"/>
        <text x="120" y="44" class="vn-l">A</text><text x="320" y="44" class="vn-l">B</text>
        ${place(r.a, 130, 112)}${place(r.ab, 220, 112)}${place(r.b, 310, 112)}${place(r.out, 384, 170, 3)}</svg>`;
      const n = U.length, P = (k) => `${k}/${n} = ${num(k / n, 4)}`;
      const nA = r.a.length + r.ab.length, nB = r.b.length + r.ab.length, nAB = r.ab.length;
      const indep = Math.abs(nAB / n - (nA / n) * (nB / n)) < 1e-12;
      read.innerHTML = chips([['A ∪ B', fmt([...r.a, ...r.ab, ...r.b].sort((p, q) => (p > q ? 1 : -1)))], ['A ∩ B', nAB ? fmt(r.ab) : '∅'], ['Ā', fmt(U.filter((x) => !has(A, x)))], ['A − B', fmt(r.a)]])
        + chips([['P(A)', P(nA)], ['P(B)', P(nB)], ['P(A ∩ B)', P(nAB), 'acc'], ['P(A ∪ B) = P(A) + P(B) − P(A ∩ B)', P(nA + nB - nAB)], ['P(Ā) = 1 − P(A)', P(n - nA)]])
        + chips([['¿Mutuamente excluyentes?', nAB ? 'no (A ∩ B ≠ ∅)' : 'sí (A ∩ B = ∅)', nAB ? '' : 'ok'], ['¿Independientes?', `${indep ? 'sí' : 'no'}: P(A)·P(B) = ${num((nA / n) * (nB / n), 4)} ${indep ? '=' : '≠'} P(A ∩ B)`, indep ? 'ok' : ''], nB ? ['P(A | B) = P(A ∩ B)/P(B)', `${nAB}/${nB} = ${num(nAB / nB, 4)}`] : null]);
    };
    el.querySelector('.venn-pick').addEventListener('click', (e) => {
      const b = e.target.closest('.vp'); if (!b) return;
      const set = b.dataset.s === 'A' ? A : B, x = U.find((u) => String(u) === b.dataset.x);
      set.has(x) ? set.delete(x) : set.add(x);
      draw();
    });
    draw();
  };

  // ---------- Frecuencia relativa y probabilidad: la ley de los grandes números ----------
  const EXPS = {
    coin: { l: 'Moneda: sale cara', p: 0.5, hit: (r) => r() < 0.5 },
    die6: { l: 'Dado: sale un 6', p: 1 / 6, hit: (r) => Math.floor(r() * 6) === 5 },
    even: { l: 'Dado: sale par', p: 0.5, hit: (r) => Math.floor(r() * 6) % 2 === 1 },
    sum7: { l: 'Dos dados: suman 7', p: 1 / 6, hit: (r) => Math.floor(r() * 6) + Math.floor(r() * 6) + 2 === 7 },
  };
  L.lln = (el, cfg) => {
    let key = cfg.exp || 'die6', seed = 3;
    el.insertAdjacentHTML('beforeend', `<div class="lab-row"><label class="lab-sel"><span>Experimento</span><select data-s="e">${Object.entries(EXPS).map(([k, o]) => `<option value="${k}" ${k === key ? 'selected' : ''}>${o.l}</option>`).join('')}</select></label>
      <button class="btn sm" type="button" data-act="again">Repetir con otra suerte</button></div>`);
    const v = sliders(el, [{ id: 'n', label: 'Cantidad de repeticiones', min: 10, max: 3000, step: 10, value: 200 }], () => draw());
    const [host, read] = shell(el);
    let first = true;
    const draw = () => {
      const E = EXPS[key], r = S.rng(seed), pts = [];
      let k = 0;
      for (let i = 1; i <= v.n; i++) { k += E.hit(r); if (i % Math.max(1, Math.floor(v.n / 200)) === 0 || i === v.n) pts.push([i, k / i]); }
      host.innerHTML = plot({ x: [0, v.n], y: [0, Math.min(1, E.p * 2.6)], w: 440, h: 230, xl: 'n', yl: 'fr', anim: first, ticks: { x: niceTicks([0, v.n], 5), y: [E.p] },
        curves: [{ pts, cls: 'c-sig' }], hlines: [{ y: E.p, cls: 'c-res', label: `P = ${num(E.p, 4)}` }] });
      first = false;
      read.innerHTML = chips([['Veces que ocurrió', `${k} de ${v.n}`], ['Frecuencia relativa k/n', num(k / v.n, 4), 'acc'], ['Probabilidad (Laplace)', num(E.p, 4)], ['Diferencia', num(Math.abs(k / v.n - E.p), 4)]])
        + '<p class="lab-note">Con pocas repeticiones la frecuencia relativa salta mucho; al aumentar n se estabiliza cerca de la probabilidad. Esa es la relación entre frecuencia y probabilidad (ley de los grandes números): la probabilidad es el valor al que tiende la frecuencia relativa.</p>';
    };
    el.querySelector('[data-s="e"]').addEventListener('change', (e) => { key = e.target.value; draw(); });
    el.querySelector('[data-act="again"]').addEventListener('click', () => { seed += 17; draw(); });
    draw();
  };

  // ---------- Árbol de probabilidades: probabilidad total y Bayes ----------
  // cfg: { names: ['A', 'B', 'C'], priors: [0.3, 0.5, 0.2], likes: [0.1, 0.3, 0.25], ev: 'defectuoso' }
  L.bayes = (el, cfg) => {
    const k = cfg.names.length;
    const defs = [];
    cfg.names.forEach((nm, i) => {
      if (i < k - 1) defs.push({ id: `p${i}`, label: `P(${nm}) a priori`, min: 0, max: 1, step: 0.01, value: cfg.priors[i] });
      defs.push({ id: `l${i}`, label: `P(${cfg.ev} | ${nm})`, min: 0, max: 1, step: 0.001, value: cfg.likes[i], fmt: (x) => num(x, 3) });
    });
    const v = sliders(el, defs, () => draw());
    const [host, read] = shell(el);
    const draw = () => {
      const pr = cfg.names.map((_, i) => (i < k - 1 ? v[`p${i}`] : 0));
      pr[k - 1] = 1 - S.sum(pr);
      if (pr[k - 1] < -1e-9) { read.innerHTML = '<p class="lab-note">Las probabilidades a priori suman más que 1: bajá alguna.</p>'; host.innerHTML = ''; return; }
      pr[k - 1] = Math.max(0, pr[k - 1]);
      const lk = cfg.names.map((_, i) => v[`l${i}`]);
      const joint = pr.map((p, i) => p * lk[i]), PE = S.sum(joint), post = joint.map((j) => (PE ? j / PE : 0));
      const H = 60 + k * 64, y = (i) => 40 + i * 64 + 20;
      host.innerHTML = `<svg class="tree" viewBox="0 0 460 ${H}" role="img" aria-label="Árbol de probabilidades">
        <circle cx="20" cy="${H / 2}" r="6" class="tr-n"/>
        ${cfg.names.map((nm, i) => `<path d="M26 ${H / 2}L150 ${y(i)}" class="tr-e"/><text x="${80}" y="${(H / 2 + y(i)) / 2 - 6}" class="tr-p">${num(pr[i], 3)}</text>
          <circle cx="156" cy="${y(i)}" r="6" class="tr-n"/><text x="156" y="${y(i) - 12}" class="tr-l">${nm}</text>
          <path d="M162 ${y(i)}L290 ${y(i) - 16}" class="tr-e tr-hit"/><path d="M162 ${y(i)}L290 ${y(i) + 16}" class="tr-e"/>
          <text x="226" y="${y(i) - 16}" class="tr-p">${num(lk[i], 3)}</text><text x="226" y="${y(i) + 26}" class="tr-p tr-dim">${num(1 - lk[i], 3)}</text>
          <text x="298" y="${y(i) - 12}" class="tr-l tr-hit-t">${esc(cfg.ev)}: ${num(joint[i], 4)}</text><text x="298" y="${y(i) + 20}" class="tr-l tr-dim">no: ${num(pr[i] - joint[i], 4)}</text>`).join('')}
      </svg>`;
      read.innerHTML = `<p class="lab-formula">P(${esc(cfg.ev)}) = ${cfg.names.map((nm, i) => `P(${nm})·P(${esc(cfg.ev)}|${nm})`).join(' + ')} = ${joint.map((j) => num(j, 4)).join(' + ')} = <b>${num(PE, 4)}</b></p>`
        + chips(cfg.names.map((nm, i) => [`P(${nm} | ${esc(cfg.ev)})`, `${num(joint[i], 4)} / ${num(PE, 4)} = ${num(post[i], 4)}`, i === post.indexOf(Math.max(...post)) ? 'acc' : '']))
        + `<p class="lab-note">Probabilidad total: se suman las ramas que terminan en “${esc(cfg.ev)}”. Bayes: cada rama dividida por esa suma. Las a posteriori suman 1 (${num(S.sum(post), 4)}).</p>`;
    };
    draw();
  };

  // ---------- Distribuciones discretas: f(x), F(x), E, V y P(a ≤ X ≤ b) ----------
  // cfg: { dist: 'bin'|'pois'|'custom', n?, p?, lambda?, pmf?: [[x, p]], a?, b?, lock? }
  L.discrete = (el, cfg) => {
    let dist = cfg.dist || 'bin', view = 'f';
    if (!cfg.lock) toggle(el, 'Distribución', [['bin', 'Binomial'], ['pois', 'Poisson'], ...(cfg.pmf ? [['custom', 'La del ejercicio']] : [])], dist, (k) => { dist = k; sync(); draw(); });
    toggle(el, 'Función', [['f', 'f(x) = P(X = x)'], ['F', 'F(x) = P(X ≤ x)']], view, (k) => { view = k; draw(); });
    const v = sliders(el, [
      { id: 'n', label: 'n (ensayos)', min: 1, max: 40, step: 1, value: cfg.n || 10 },
      { id: 'p', label: 'p (éxito)', min: 0.01, max: 0.99, step: 0.01, value: cfg.p || 0.4 },
      { id: 'l', label: 'λ (promedio)', min: 0.1, max: 15, step: 0.1, value: cfg.lambda || 3 },
      { id: 'a', label: 'a (desde)', min: 0, max: 40, step: 1, value: cfg.a ?? 2 },
      { id: 'b', label: 'b (hasta)', min: 0, max: 40, step: 1, value: cfg.b ?? 5 },
    ], () => draw());
    const show = (id, on) => { el.querySelector(`[data-id="${id}"]`).closest('.sl').hidden = !on; };
    const [host, read] = shell(el);
    let first = true;
    const pairs = () => {
      if (dist === 'bin') return Array.from({ length: v.n + 1 }, (_, x) => [x, S.binomPmf(v.n, v.p, x)]);
      if (dist === 'pois') { const top = Math.max(8, Math.ceil(v.l + 4 * Math.sqrt(v.l))); return Array.from({ length: top + 1 }, (_, x) => [x, S.poisPmf(v.l, x)]); }
      return cfg.pmf;
    };
    const sync = () => { show('n', dist === 'bin'); show('p', dist === 'bin'); show('l', dist === 'pois'); };
    const draw = () => {
      const pr = pairs(), xs = pr.map((q) => q[0]), mx = Math.max(...xs);
      ['a', 'b'].forEach((id) => { const inp = el.querySelector(`[data-id="${id}"]`); inp.min = Math.min(...xs); inp.max = mx; if (v[id] > mx) setSlider(el, v, id, mx); if (v[id] < Math.min(...xs)) setSlider(el, v, id, Math.min(...xs)); });
      const a = Math.min(v.a, v.b), b = Math.max(v.a, v.b);
      const hi = xs.filter((x) => x >= a && x <= b);
      const F = (x) => S.sum(pr.filter((q) => q[0] <= x).map((q) => q[1]));
      const pAB = S.sum(pr.filter((q) => q[0] >= a && q[0] <= b).map((q) => q[1]));
      const mo = S.moments(pr);
      const thin = xs.length > 16 ? xs.filter((x) => x % Math.ceil(xs.length / 12) === 0) : xs;
      host.innerHTML = view === 'f'
        ? bars({ pts: pr, hi, yl: 'f(x)', anim: first, xt: thin, labels: xs.length <= 11 ? true : undefined })
        : steps({ pts: pr.map(([x]) => [x, F(x)]), anim: first });
      first = false;
      const name = dist === 'bin' ? `X ~ B(${v.n}; ${num(v.p, 2)})` : dist === 'pois' ? `X ~ Poisson(λ = ${num(v.l, 1)})` : 'X del ejercicio';
      const formula = dist === 'bin' ? `E = n·p = ${num(v.n * v.p, 4)} · V = n·p·q = ${num(v.n * v.p * (1 - v.p), 4)}` : dist === 'pois' ? `E = V = λ = ${num(v.l, 2)}` : '';
      read.innerHTML = chips([[name, '', 'acc'], [`P(${a} ≤ X ≤ ${b})`, `F(${b}) − F(${a - 1}) = ${f4(F(b))} − ${f4(F(a - 1))} = ${f4(pAB)}`, 'acc'], [`P(X ≤ ${b})`, f4(F(b))], [`P(X ≥ ${a})`, `1 − F(${a - 1}) = ${f4(1 - F(a - 1))}`], [`P(X = ${a})`, f4(F(a) - F(a - 1))]])
        + chips([['E(X) = Σ x·f(x)', num(mo.E, 4)], ['V(X) = E(X²) − E(X)²', num(mo.V, 4)], ['σ', num(mo.sd, 4)], formula ? ['Atajo', formula] : null])
        + '<p class="lab-note">Con enteros, “menor que” y “menor o igual” no son lo mismo: P(X &lt; b) = F(b − 1). Las barras resaltadas son las que entran en la probabilidad.</p>';
    };
    sync();
    draw();
  };

  // ---------- Variables continuas: área bajo la densidad ----------
  // Densidades de los TP y de la clase: f, soporte y etiqueta
  const PDFS = {
    tp41: { l: 'f(x) = (3/2)x² en [−1; 1] (TP 4, ej. 1 y 9)', f: (x) => 1.5 * x * x, s: [-1, 1] },
    tp42: { l: 'f(x) = 6x(1 − x) en (0; 1) (TP 4, ej. 2)', f: (x) => 6 * x * (1 - x), s: [0, 1] },
    tp43: { l: 'f(x) = 1/(4√x) en (0; 4] (TP 4, ej. 3)', f: (x) => 1 / (4 * Math.sqrt(x)), s: [0.0004, 4] },
    c1: { l: 'f(x) = x²/3 en (−1; 2) (clase, error de la IA)', f: (x) => (x * x) / 3, s: [-1, 2] },
    c3: { l: 'f(x) = x²/9 en (0; 3) (clase, metales)', f: (x) => (x * x) / 9, s: [0, 3] },
    c5: { l: 'f(x) = 1/8 + 3x/8 en [0; 2] (clase)', f: (x) => 1 / 8 + (3 * x) / 8, s: [0, 2] },
    c6: { l: 'f(x) = (3/2)(1 − x²) en [0; 1] (clase, plomo)', f: (x) => 1.5 * (1 - x * x), s: [0, 1] },
    unif: { l: 'Uniforme en [−2; 2] (TP 4, ej. 5)', f: () => 0.25, s: [-2, 2] },
    exp: { l: 'Exponencial f(x) = 3e^(−3x) (TP 4, ej. 20)', f: (x) => 3 * Math.exp(-3 * x), s: [0, 2.5] },
  };
  const simpson = (f, a, b, n = 400) => { if (b <= a) return 0; const h = (b - a) / n; let s = f(a) + f(b); for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(a + i * h); return (s * h) / 3; };
  L.density = (el, cfg) => {
    let key = cfg.fn || 'tp42';
    el.insertAdjacentHTML('beforeend', `<div class="lab-row"><label class="lab-sel"><span>Densidad</span><select data-s="f">${Object.entries(PDFS).map(([k, o]) => `<option value="${k}" ${k === key ? 'selected' : ''}>${o.l}</option>`).join('')}</select></label></div>`);
    const v = sliders(el, [{ id: 'a', label: 'a', min: 0, max: 100, step: 1, value: 25, fmt: () => '' }, { id: 'b', label: 'b', min: 0, max: 100, step: 1, value: 60, fmt: () => '' }], () => draw());
    const [host, read] = shell(el);
    let first = true;
    const draw = () => {
      const P = PDFS[key], [s0, s1] = P.s, w = s1 - s0;
      const at = (t) => s0 + (w * t) / 100;
      const a = Math.min(at(v.a), at(v.b)), b = Math.max(at(v.a), at(v.b));
      el.querySelector('[data-o="a"]').textContent = num(at(v.a), 2); el.querySelector('[data-o="b"]').textContent = num(at(v.b), 2);
      const f = (x) => (x >= s0 && x <= s1 ? P.f(x) : 0);
      const lo = s0 - w * 0.15, hi = s1 + w * 0.15;
      const ymax = Math.min(4, Math.max(...Array.from({ length: 101 }, (_, i) => P.f(s0 + (w * i) / 100))) * 1.2);
      const F = (x) => simpson(P.f, s0, Math.min(Math.max(x, s0), s1));
      const total = F(s1), pab = F(b) - F(a);
      const E = simpson((x) => x * P.f(x), s0, s1), E2 = simpson((x) => x * x * P.f(x), s0, s1), V = E2 - E * E;
      const dens = area({ x: [lo, hi], ymax, f, shade: [[a, b]], anim: first, dom: [lo, hi], texts: [{ x: (a + b) / 2, y: ymax * 0.06, t: num(pab, 4), cls: 'c-res' }] });
      const cum = plot({ x: [lo, hi], y: [0, 1.1], w: 440, h: 170, xl: 'x', yl: 'F(x)', anim: first, ticks: { x: niceTicks([lo, hi], 6), y: [0.5, 1] },
        curves: [{ f: (x) => (x < s0 ? 0 : x > s1 ? 1 : F(x)), n: 120, cls: 'c-sig' }], guides: [{ x: a, y: F(a), xt: '', yt: num(F(a), 3) }, { x: b, y: F(b), xt: '', yt: num(F(b), 3) }] });
      host.innerHTML = dens + `<div class="pl-host-2">${cum}</div>`;
      first = false;
      read.innerHTML = chips([['∫ f(x) dx sobre el soporte', num(total, 4), Math.abs(total - 1) < 1e-3 ? 'ok' : 'warn'], [`P(${num(a, 2)} < X < ${num(b, 2)})`, `F(b) − F(a) = ${f4(F(b))} − ${f4(F(a))} = ${f4(pab)}`, 'acc']])
        + chips([['E(X) = ∫ x f(x) dx', num(E, 4)], ['E(X²)', num(E2, 4)], ['V(X) = E(X²) − E(X)²', num(V, 4)], ['σ', num(Math.sqrt(V), 4)], Math.abs(E) > 1e-6 ? ['CV = σ/μ', `${num((Math.sqrt(V) / Math.abs(E)) * 100, 1)} %`] : null])
        + '<p class="lab-note">La probabilidad es el área sombreada; en un punto el área es 0, así que da igual usar &lt; o ≤. Abajo, la acumulada F(x) sube de 0 a 1: la diferencia de alturas entre b y a es la misma área.</p>';
    };
    el.querySelector('[data-s="f"]').addEventListener('change', (e) => { key = e.target.value; draw(); });
    draw();
  };

  // ---------- Normal: tipificar y leer la tabla (directa e inversa) ----------
  // cfg: { mu, sigma, a, b, mode: 'left'|'right'|'between', inv? }
  L.normal = (el, cfg) => {
    let mode = cfg.mode || 'between', inv = false;
    toggle(el, 'Tipo de pregunta', [['left', 'P(X ≤ b)'], ['right', 'P(X ≥ a)'], ['between', 'P(a ≤ X ≤ b)'], ['inv', 'Inversa: ¿qué x deja un área?']], mode, (k) => { inv = k === 'inv'; if (!inv) mode = k; draw(); });
    const v = inputs(el, [{ id: 'mu', label: 'Media μ', value: cfg.mu ?? 0 }, { id: 'sigma', label: 'Desvío σ', value: cfg.sigma ?? 1 }, { id: 'a', label: 'a', value: cfg.a ?? -1 }, { id: 'b', label: 'b', value: cfg.b ?? 1 }, { id: 'p', label: 'Área a la izquierda (inversa)', value: cfg.p ?? 0.85 }], () => draw());
    const [host, read] = shell(el);
    let first = true;
    const draw = () => {
      const { mu, sigma: s } = v;
      if (!(s > 0)) { read.innerHTML = '<p class="lab-note">σ tiene que ser positivo.</p>'; return; }
      const f = (x) => S.normPdf(x, mu, s), lo = mu - 3.8 * s, hi = mu + 3.8 * s, ymax = f(mu) * 1.25;
      let shade, chipsHtml;
      const z = (x) => S.z2((x - mu) / s);
      if (inv) {
        const p = Math.min(Math.max(v.p, 0.0001), 0.9999), zz = S.phiInv(p), x = mu + zz * s;
        shade = [[lo, x]];
        chipsHtml = chips([['Área pedida a la izquierda', f4(p)], ['z con Φ(z) = área', `${num(zz, 4)} (en la tabla ≈ ${num(S.z2(zz), 2)})`, 'acc'], ['x = μ + z·σ', `${num(mu, 4)} + (${num(zz, 3)})·${num(s, 4)} = ${num(x, 4)}`, 'acc']])
          + '<p class="lab-note">Para la inversa se busca el área <b>dentro</b> de la tabla y se lee el z del borde. Si te dan el área a la derecha, primero pasala a la izquierda: 1 − área.</p>';
      } else {
        const za = z(v.a), zb = z(v.b), Pa = S.phi(za), Pb = S.phi(zb);
        if (mode === 'left') { shade = [[lo, v.b]]; chipsHtml = chips([['z = (b − μ)/σ', `(${num(v.b, 4)} − ${num(mu, 4)})/${num(s, 4)} = ${num(zb, 2)}`], [`P(X ≤ ${num(v.b, 3)}) = Φ(${num(zb, 2)})`, f4(Pb), 'acc']]); }
        if (mode === 'right') { shade = [[v.a, hi]]; chipsHtml = chips([['z = (a − μ)/σ', `(${num(v.a, 4)} − ${num(mu, 4)})/${num(s, 4)} = ${num(za, 2)}`], [`P(X ≥ ${num(v.a, 3)}) = 1 − Φ(${num(za, 2)})`, `1 − ${f4(Pa)} = ${f4(1 - Pa)}`, 'acc']]); }
        if (mode === 'between') { shade = [[Math.min(v.a, v.b), Math.max(v.a, v.b)]]; chipsHtml = chips([['z₁', num(za, 2)], ['z₂', num(zb, 2)], [`P(${num(v.a, 3)} ≤ X ≤ ${num(v.b, 3)})`, `Φ(${num(zb, 2)}) − Φ(${num(za, 2)}) = ${f4(Pb)} − ${f4(Pa)} = ${f4(Math.abs(Pb - Pa))}`, 'acc']]); }
        chipsHtml += '<p class="lab-note">Se tipifica con z = (x − μ)/σ, redondeado a dos decimales como en la tabla. La tabla da el área a la izquierda de z.</p>';
      }
      host.innerHTML = area({ x: [lo, hi], ymax, f, shade, anim: first, ticks: { x: [-3, -2, -1, 0, 1, 2, 3].map((k) => mu + k * s), y: [] },
        texts: [-3, -2, -1, 0, 1, 2, 3].map((k) => ({ x: mu + k * s, y: ymax * 0.93, t: k ? `${k > 0 ? '+' : '−'}${Math.abs(k)}σ` : 'μ', cls: 'pl-small' })) });
      first = false;
      read.innerHTML = chipsHtml;
    };
    draw();
  };

  // ---------- Teorema del Límite Central: distribución de las medias muestrales ----------
  const POPS = {
    dado: { l: 'Dado (uniforme discreta 1 a 6)', mu: 3.5, sd: Math.sqrt(35 / 12), draw: (r) => 1 + Math.floor(r() * 6), x: [0.5, 6.5] },
    exp: { l: 'Exponencial (muy asimétrica, β = 2)', mu: 2, sd: 2, draw: (r) => -2 * Math.log(1 - r()), x: [0, 10] },
    bim: { l: 'Bimodal (dos grupos)', mu: 5, sd: Math.sqrt(1 + 9), draw: (r) => (r() < 0.5 ? 2 : 8) + S.gauss(r), x: [-1, 11] },
    tiro: { l: 'Tiro libre: 1 si encesta (p = 0,7)', mu: 0.7, sd: Math.sqrt(0.21), draw: (r) => (r() < 0.7 ? 1 : 0), x: [-0.1, 1.1] },
  };
  L.clt = (el, cfg) => {
    let pop = cfg.pop || 'dado', seed = 11;
    el.insertAdjacentHTML('beforeend', `<div class="lab-row"><label class="lab-sel"><span>Población</span><select data-s="p">${Object.entries(POPS).map(([k, o]) => `<option value="${k}" ${k === pop ? 'selected' : ''}>${o.l}</option>`).join('')}</select></label>
      <button class="btn sm" type="button" data-act="again">Otras 600 muestras</button></div>`);
    const v = sliders(el, [{ id: 'n', label: 'Tamaño de cada muestra n', min: 1, max: 50, step: 1, value: cfg.n || 2 }], () => draw());
    const [host, read] = shell(el);
    let first = true;
    const draw = () => {
      const P = POPS[pop], r = S.rng(seed), M = 600;
      const means = Array.from({ length: M }, () => { let s = 0; for (let i = 0; i < v.n; i++) s += P.draw(r); return s / v.n; });
      const [x0, x1] = P.x, nb = 30, bw = (x1 - x0) / nb, cnt = Array(nb).fill(0);
      means.forEach((m) => { const k = Math.min(nb - 1, Math.max(0, Math.floor((m - x0) / bw))); cnt[k]++; });
      const se = P.sd / Math.sqrt(v.n), dens = cnt.map((c) => c / M / bw), ymax = Math.max(...dens, S.normPdf(P.mu, P.mu, se)) * 1.15;
      host.innerHTML = plot({ x: [x0, x1], y: [0, ymax], w: 440, h: 240, xl: 'x̄', yl: '', anim: first, ticks: { x: niceTicks([x0, x1], 6), y: [] },
        areas: cnt.map((c, k) => rect(x0 + k * bw, x0 + (k + 1) * bw, dens[k], 'a-bar')),
        curves: [{ f: (x) => S.normPdf(x, P.mu, se), n: 200, cls: 'c-res', label: 'N(μ, σ/√n)' }], vlines: [{ x: P.mu, cls: 'c-res', label: 'μ' }] });
      first = false;
      read.innerHTML = chips([['μ población', num(P.mu, 3)], ['σ población', num(P.sd, 3)], ['σ/√n (teórico)', num(se, 4), 'acc'], ['media de las x̄', num(S.mean(means), 4)], ['desvío de las x̄', num(S.sd(means), 4)]])
        + `<p class="lab-note">${v.n === 1 ? 'Con n = 1 cada “media” es un dato suelto: se ve la forma de la población.' : v.n >= 30 ? 'Con n ≥ 30 las medias ya forman una campana aunque la población no sea normal: es el Teorema del Límite Central.' : 'A medida que n crece, las medias se juntan alrededor de μ (el desvío cae como σ/√n) y la forma se acerca a la normal.'}</p>`;
    };
    el.querySelector('[data-s="p"]').addEventListener('change', (e) => { pop = e.target.value; draw(); });
    el.querySelector('[data-act="again"]').addEventListener('click', () => { seed += 101; draw(); });
    draw();
  };

  // ---------- t de Student contra la normal ----------
  L.tdist = (el, cfg) => {
    const v = sliders(el, [{ id: 'v', label: 'Grados de libertad ν = n − 1', min: 1, max: 40, step: 1, value: cfg.v || 4 },
      { id: 'a', label: 'α (área a la derecha)', min: 0.005, max: 0.2, step: 0.005, value: cfg.alpha || 0.025, fmt: (x) => num(x, 3) }], () => draw());
    const [host, read] = shell(el);
    let first = true;
    const draw = () => {
      const t = S.tInv(v.a, v.v), z = S.zInv(v.a), f = (x) => S.tPdf(x, v.v);
      host.innerHTML = plot({ x: [-4.5, 4.5], y: [0, 0.46], w: 440, h: 230, xl: 't', yl: '', anim: first, ticks: { x: [-4, -3, -2, -1, 1, 2, 3, 4], y: [] },
        areas: [under(f, Math.min(t, 4.5), 4.5, 'a-rej')], curves: [{ f: (x) => S.normPdf(x), n: 160, cls: 'c-mod pl-dash', label: 'Normal' }, { f, n: 160, cls: 'c-f', label: `t (ν = ${v.v})`, at: -2.4 }],
        vlines: [{ x: t, cls: 'c-stop', label: `t = ${num(t, 3)}` }] });
      first = false;
      read.innerHTML = chips([[`t(α = ${num(v.a, 3)}; ν = ${v.v})`, num(t, 4), 'acc'], [`z(α = ${num(v.a, 3)})`, num(z, 4)], ['Diferencia', num(t - z, 4)]])
        + '<p class="lab-note">La t tiene colas más pesadas que la normal: para la misma área α el valor crítico es más grande, y el intervalo sale más ancho. Al crecer ν se parece cada vez más a la normal.</p>';
    };
    draw();
  };

  // ---------- Intervalos de confianza: cuántos atrapan a μ ----------
  L.ci = (el, cfg) => {
    let known = cfg.known !== false, seed = 5;
    toggle(el, 'σ de la población', [['k', 'Conocido (z)'], ['u', 'Desconocido (t con s)']], known ? 'k' : 'u', (k) => { known = k === 'k'; draw(); });
    el.insertAdjacentHTML('beforeend', '<div class="lab-row"><button class="btn sm" type="button" data-act="again">Otras 40 muestras</button></div>');
    const v = sliders(el, [{ id: 'n', label: 'Tamaño de muestra n', min: 4, max: 100, step: 1, value: cfg.n || 16 },
      { id: 'c', label: 'Nivel de confianza 1 − α', min: 0.8, max: 0.99, step: 0.01, value: cfg.conf || 0.95, fmt: (x) => `${num(x * 100, 0)} %` }], () => draw());
    const [host, read] = shell(el);
    const MU = 50, SD = 10, K = 40;
    const draw = () => {
      const r = S.rng(seed);
      const ivs = Array.from({ length: K }, () => {
        const xs = Array.from({ length: v.n }, () => MU + SD * S.gauss(r)), m = S.mean(xs);
        return S.ci(m, known ? SD : S.sd(xs), v.n, v.c, known);
      });
      const hit = ivs.filter((c) => c.lo <= MU && MU <= c.hi).length;
      const span = Math.max(...ivs.map((c) => Math.max(MU - c.lo, c.hi - MU))) * 1.1;
      host.innerHTML = plot({ x: [MU - span, MU + span], y: [0, K + 1], w: 440, h: 300, xl: 'μ', yl: '', anim: false, ticks: { x: niceTicks([MU - span, MU + span], 6), y: [] },
        segs: ivs.map((c, i) => ({ from: [c.lo, i + 1], to: [c.hi, i + 1], cls: c.lo <= MU && MU <= c.hi ? 'c-sig' : 'c-stop' })),
        points: ivs.map((c, i) => ({ x: (c.lo + c.hi) / 2, y: i + 1, r: 2, cls: 'c-sig' })), vlines: [{ x: MU, cls: 'c-res', label: 'μ = 50' }] });
      read.innerHTML = chips([['Atrapan a μ', `${hit} de ${K} (${num((hit / K) * 100, 0)} %)`, 'acc'], ['Esperado', `${num(v.c * 100, 0)} %`], [known ? 'z crítico' : `t crítico (ν = ${v.n - 1})`, num(ivs[0].crit, 3)], ['Ancho medio', num(S.mean(ivs.map((c) => c.hi - c.lo)), 3)]])
        + '<p class="lab-note">Cada barra es el intervalo de una muestra distinta. “95 % de confianza” quiere decir que el método atrapa a μ en el 95 % de las muestras, no que μ cambie. Más confianza ⇒ intervalo más ancho; más n ⇒ más angosto.</p>';
    };
    el.querySelector('[data-act="again"]').addEventListener('click', () => { seed += 37; draw(); });
    draw();
  };

  // ---------- Test de hipótesis para μ: región de rechazo y valor P ----------
  // cfg: { mu0, xbar, s, n, alpha, tail, known }
  L.htest = (el, cfg) => {
    let tail = cfg.tail || 'two', known = cfg.known !== false;
    toggle(el, 'Hipótesis alternativa', [['left', 'Ha: μ < μ₀'], ['two', 'Ha: μ ≠ μ₀'], ['right', 'Ha: μ > μ₀']], tail, (k) => { tail = k; draw(); });
    toggle(el, 'Estadístico', [['k', 'σ conocido: z'], ['u', 'σ desconocido: t']], known ? 'k' : 'u', (k) => { known = k === 'k'; draw(); });
    const v = inputs(el, [{ id: 'mu0', label: 'μ₀', value: cfg.mu0 ?? 8 }, { id: 'xbar', label: 'x̄', value: cfg.xbar ?? 7.8 }, { id: 's', label: 'σ o s', value: cfg.s ?? 0.5 }, { id: 'n', label: 'n', value: cfg.n ?? 50, step: 1 }, { id: 'alpha', label: 'α', value: cfg.alpha ?? 0.01 }], () => draw());
    const [host, read] = shell(el);
    let first = true;
    const draw = () => {
      if (!(v.s > 0 && v.n >= 2 && v.alpha > 0 && v.alpha < 1)) { read.innerHTML = '<p class="lab-note">Revisá los datos: σ > 0, n ≥ 2 y 0 &lt; α &lt; 1.</p>'; return; }
      const T = S.test(v.xbar, v.mu0, v.s, Math.round(v.n), v.alpha, tail, known);
      const f = known ? (x) => S.normPdf(x) : (x) => S.tPdf(x, T.df), lim = Math.max(4, Math.abs(T.stat) + 0.6);
      const rej = tail === 'left' ? [[-lim, -T.crit, 'a-rej']] : tail === 'right' ? [[T.crit, lim, 'a-rej']] : [[-lim, -T.crit, 'a-rej'], [T.crit, lim, 'a-rej']];
      host.innerHTML = area({ x: [-lim, lim], ymax: 0.46, f, shade: rej, anim: first, ticks: { x: niceTicks([-lim, lim], 8), y: [] },
        vlines: [{ x: T.stat, cls: T.reject ? 'c-stop' : 'c-pass', label: `${known ? 'z' : 't'} = ${num(T.stat, 2)}` }],
        texts: [{ x: 0, y: 0.2, t: 'no se rechaza H₀', cls: 'pl-small' }] });
      first = false;
      const sym = { left: '<', right: '>', two: '≠' }[tail];
      read.innerHTML = `<p class="lab-formula">H₀: μ = ${num(v.mu0, 4)} &nbsp; Ha: μ ${sym} ${num(v.mu0, 4)} &nbsp; · &nbsp; ${known ? 'z' : 't'} = (x̄ − μ₀)/(${known ? 'σ' : 's'}/√n) = (${num(v.xbar, 4)} − ${num(v.mu0, 4)})/(${num(v.s, 4)}/√${Math.round(v.n)}) = <b>${num(T.stat, 3)}</b></p>`
        + chips([['Valor crítico', `${tail === 'two' ? '±' : tail === 'left' ? '−' : ''}${num(T.crit, 3)}${known ? '' : ` (ν = ${T.df})`}`], ['Valor P', f4(T.p), 'acc'], ['α', num(v.alpha, 4)], ['Decisión', T.reject ? 'se rechaza H₀' : 'no se rechaza H₀', T.reject ? 'warn' : 'ok']])
        + `<p class="lab-note">${T.reject ? `El estadístico cae en la región de rechazo y P = ${f4(T.p)} &lt; α.` : `El estadístico no llega a la región de rechazo y P = ${f4(T.p)} ≥ α.`} Las dos formas (región o valor P) siempre dan la misma decisión.</p>`;
    };
    draw();
  };

  // ---------- Errores de tipo I y II: α, β y potencia ----------
  L.errors = (el, cfg) => {
    const v = sliders(el, [{ id: 'a', label: 'α (nivel de significación)', min: 0.01, max: 0.2, step: 0.01, value: cfg.alpha || 0.05, fmt: (x) => num(x, 2) },
      { id: 'n', label: 'n', min: 4, max: 100, step: 1, value: cfg.n || 25 },
      { id: 'd', label: 'μ verdadera − μ₀', min: 0, max: 6, step: 0.25, value: cfg.d ?? 2 }], () => draw());
    const [host, read] = shell(el);
    let first = true;
    const SD = 10, MU0 = 50;
    const draw = () => {
      const se = SD / Math.sqrt(v.n), c = MU0 + S.zInv(v.a) * se, mu1 = MU0 + v.d;
      const f0 = (x) => S.normPdf(x, MU0, se), f1 = (x) => S.normPdf(x, mu1, se);
      const beta = S.normCdf(c, mu1, se), lo = MU0 - 4 * se, hi = Math.max(mu1, MU0) + 4 * se, ymax = f0(MU0) * 1.2;
      host.innerHTML = plot({ x: [lo, hi], y: [0, ymax], w: 440, h: 240, xl: 'x̄', yl: '', anim: first, ticks: { x: niceTicks([lo, hi], 6), y: [] },
        areas: [under(f1, lo, c, 'a-beta'), under(f0, c, hi, 'a-rej')],
        curves: [{ f: f0, n: 160, cls: 'c-f', label: 'si H₀ es cierta', at: MU0 - 2.2 * se }, { f: f1, n: 160, cls: 'c-mod', label: 'si Ha es cierta', at: mu1 + 1.2 * se }],
        vlines: [{ x: c, cls: 'c-stop', label: 'valor crítico' }] });
      first = false;
      read.innerHTML = chips([['α = P(error tipo I)', num(v.a, 3), 'warn'], ['β = P(error tipo II)', f4(beta), 'acc'], ['Potencia 1 − β', f4(1 - beta), 'ok'], ['x̄ crítico', num(c, 3)]])
        + '<p class="lab-note">Rojo: rechazar H₀ siendo cierta (tipo I, α). Ámbar: no rechazar H₀ siendo falsa (tipo II, β). Bajar α corre el valor crítico a la derecha y sube β; aumentar n angosta las dos campanas y baja los dos errores a la vez.</p>';
    };
    draw();
  };
})();
