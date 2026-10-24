/* Animaciones: pantalla de entrada al cambiar de tema y glifo animado en la cabecera de cada lección.
   Adaptadas del "Laboratorio Frontend DSW" de Mateo Rusconi. Expone window.ANIM; app.js lo usa en route() y renderLesson(). */
(() => {
  const { LESSONS, MODULES, UNITS } = window.GUIDE;
  const RM = matchMedia('(prefers-reduced-motion: reduce)');

  // Cadena de pasos que se enciende etapa por etapa en la pantalla de entrada
  const PIPES = {
    u1: ['Datos crudos', 'Ordenar', 'Contar f', 'fr = f/n', 'Barras o histograma'],
    u2: ['Datos', 'x̄, Me, Mo', 'x − x̄', 's² = Σ(x − x̄)²/(n − 1)', 's'],
    u3: ['Experimento', 'Espacio S', 'Suceso A', 'Contar casos', 'P(A)'],
    u4: ['Dato conocido B', 'Espacio reducido', 'P(A ∩ B)/P(B)', 'Probabilidad total', 'Bayes'],
    u5: ['Resultado', 'X = número', 'f(x) = P(X = x)', 'F(x) = P(X ≤ x)', 'E(X), V(X)'],
    u6: ['¿n ensayos o un intervalo?', 'Binomial (n, p)', 'Poisson (λ)', 'Tabla acumulada', 'P'],
    u7: ['f(x) ≥ 0', '∫ f = 1', 'P = área', 'F(x) = ∫ f', 'E(X), V(X)'],
    u8: ['X ~ N(μ, σ)', 'z = (x − μ)/σ', 'Tabla Φ(z)', 'Área', 'Decisión'],
    u9: ['Población μ, σ', 'Muestra x̄, s', 'σ/√n', '¿σ conocido? z : t', 'x̄ ± e'],
    u10: ['H₀: μ = μ₀', 'Ha y α', 'Estadístico', 'Región o valor P', 'Rechazar o no'],
  };

  // trap = la confusión típica del tema
  const TRAPS = {
    u1: 'Discreta (se <b>cuenta</b>) va en <b>barras</b> separadas; continua (se <b>mide</b>) va en <b>histograma</b> sin espacios. La frecuencia relativa acumulada del último valor siempre es <b>1</b>.',
    u2: 'La varianza muestral divide por <b>n − 1</b>, no por n, y queda en <b>unidades al cuadrado</b>. La media es sensible a los datos atípicos; la mediana no.',
    u3: '“Mutuamente excluyentes” (A ∩ B = ∅) <b>no</b> es lo mismo que “independientes” (P(A ∩ B) = P(A)·P(B)). Complementarios ⇒ excluyentes, pero no al revés.',
    u4: 'P(A | B) ≠ P(B | A). En Bayes, el denominador es la <b>probabilidad total</b> de lo observado, no la probabilidad a priori.',
    u5: 'P(X &lt; 5) en una discreta es <b>F(4)</b>, no F(5): con enteros, “&lt;” y “≤” cambian el resultado. P(X = a) = F(a) − F(a − 1).',
    u6: 'Binomial: hay un <b>n</b> fijo de ensayos. Poisson: hay un <b>promedio λ</b> por intervalo y no hay n. “Al menos 2” es 1 − P(X ≤ 1).',
    u7: 'En una continua <b>P(X = a) = 0</b>, por eso &lt; y ≤ dan lo mismo. f(x) no es una probabilidad: puede valer más que 1. De F se pasa a f <b>derivando</b>.',
    u8: 'La tabla da el área a la <b>izquierda</b> de z. Para la derecha: 1 − Φ(z). En la exponencial de la cátedra <b>β es la media</b> (β = 1/λ).',
    u9: 'Con σ <b>conocido</b> se usa z; con σ <b>desconocido</b> y muestra chica, t con <b>n − 1</b> grados de libertad. El error estándar es σ/√n, no σ.',
    u10: 'H₀ lleva <b>siempre el igual</b>. Se rechaza H₀ si <b>P &lt; α</b>. “No rechazar” no prueba que H₀ sea verdadera.',
  };

  // Un SVG de 150×120 por tema. Sin animación (reduced-motion) cada uno queda en un estado final legible.
  const d = (s) => `style="animation-delay:${s}s"`;
  const AX = '<path d="M12 8V108H142" class="gx-strong"/>';
  const gaussPath = (mu, s, amp, x0 = 14, x1 = 140) => Array.from({ length: 61 }, (_, k) => { const x = x0 + ((x1 - x0) * k) / 60; return `${k ? 'L' : 'M'}${x.toFixed(1)} ${(106 - amp * Math.exp(-(((x - mu) / s) ** 2) / 2)).toFixed(1)}`; }).join('');
  const bars = (hs, x0, w, cls, step = 0.15) => hs.map((hh, i) => `<rect x="${x0 + i * w}" y="${106 - hh}" width="${w - 3}" height="${hh}" rx="2" class="${cls}" ${d((i * step).toFixed(2))}/>`).join('');
  const GLYPHS = {
    u1: `${AX}${bars([22, 46, 70, 88, 60, 34, 16], 16, 18, 'gx-soft gx-grow-y')}<text x="120" y="20" class="gx-t gx-tc">f</text>`,
    u2: `<path d="M10 92H140" class="gx-strong"/><path d="M75 92L66 108H84Z" class="gx-tri"/>
      ${[24, 40, 52, 64, 86, 98, 126].map((x, i) => `<circle cx="${x}" cy="84" r="6" class="gx-dem-f gx-pop" ${d((i * 0.12).toFixed(2))}/>`).join('')}
      <path d="M75 20V76" class="gx-price gx-dash"/><text x="75" y="14" class="gx-t gx-tc">x̄</text>
      <path d="M40 50H110" class="gx-acc-s gx-grow" ${d(1)}/><text x="75" y="44" class="gx-t">± s</text>`,
    u3: `<rect x="8" y="10" width="134" height="100" rx="8" class="gx-box"/><text x="20" y="26" class="gx-t">S</text>
      <circle cx="58" cy="62" r="32" class="gx-soft" style="opacity:.8"/><circle cx="94" cy="62" r="32" style="fill:var(--c-eq);opacity:.25;stroke:var(--c-eq)"/>
      <text x="44" y="66" class="gx-t gx-tc">A</text><text x="108" y="66" class="gx-t" style="fill:var(--c-eq)">B</text><text x="76" y="66" class="gx-t gx-ink gx-pop" ${d(0.8)}>A∩B</text>`,
    u4: `<circle cx="16" cy="60" r="6" class="gx-node"/>
      <path d="M22 58L70 26M22 62L70 94" class="gx-acc-s gx-draw" pathLength="1"/>
      <path d="M76 26L130 12M76 26L130 40M76 94L130 80M76 94L130 108" class="gx-line"/>
      <path d="M76 94L130 80" class="gx-sup gx-draw" pathLength="1" ${d(0.8)}/>
      <circle cx="73" cy="26" r="5" class="gx-dem-f"/><circle cx="73" cy="94" r="5" class="gx-dem-f"/>
      <circle cx="132" cy="80" r="6" class="gx-eqf gx-pop" ${d(1.4)}/><text x="104" y="70" class="gx-t gx-tc">P(B|A₂)</text><text x="40" y="22" class="gx-t">P(A₁)</text>`,
    u5: `${AX}${[[24, 18], [48, 46], [72, 74], [96, 46], [120, 18]].map(([x, hh], i) => `<path d="M${x} 106V${106 - hh}" class="gx-dem gx-draw" pathLength="1" ${d((i * 0.18).toFixed(2))}/><circle cx="${x}" cy="${106 - hh}" r="4" class="gx-dem-f gx-pop" ${d((0.3 + i * 0.18).toFixed(2))}/>`).join('')}
      <path d="M14 100H36V86H60V58H84V40H108V30H140" class="gx-sup gx-dash gx-draw" pathLength="1" ${d(1.2)}/><text x="132" y="22" class="gx-t" style="fill:var(--c-s)">F</text>`,
    u6: `${AX}${bars([12, 34, 52, 50, 34, 18, 8], 16, 17, 'gx-soft gx-grow-y', 0.1)}<path d="${gaussPath(66, 22, 54)}" class="gx-price gx-draw" pathLength="1" ${d(1)}/><text x="122" y="30" class="gx-t gx-tc">n·p</text>`,
    u7: `${AX}<path d="${Array.from({ length: 41 }, (_, k) => { const x = 14 + k * 3.1, u = k / 40; return `${k ? 'L' : 'M'}${x.toFixed(1)} ${(106 - 90 * 6 * u * (1 - u) * 0.62).toFixed(1)}`; }).join('')}" class="gx-dem gx-draw" pathLength="1"/>
      <path d="M52 106${Array.from({ length: 13 }, (_, k) => { const x = 52 + k * 3.1, u = (x - 14) / 124; return `L${x.toFixed(1)} ${(106 - 90 * 6 * u * (1 - u) * 0.62).toFixed(1)}`; }).join('')}L89 106Z" class="gx-soft gx-pop" ${d(1)} style="opacity:.7"/><text x="70" y="98" class="gx-t gx-tc gx-pop" ${d(1.2)}>∫</text>`,
    u8: `${AX}<path d="${gaussPath(77, 18, 86)}" class="gx-dem gx-draw" pathLength="1"/>
      <path d="M59 106${Array.from({ length: 13 }, (_, k) => { const x = 59 + k * 3; return `L${x} ${(106 - 86 * Math.exp(-(((x - 77) / 18) ** 2) / 2)).toFixed(1)}`; }).join('')}L95 106Z" class="gx-soft gx-pop" ${d(1)} style="opacity:.7"/>
      <text x="77" y="96" class="gx-t gx-tc">68 %</text><text x="77" y="118" class="gx-t">μ</text>`,
    u9: `${AX}<path d="${gaussPath(77, 9, 88)}" class="gx-dem gx-draw" pathLength="1" ${d(0.6)}/><path d="${gaussPath(77, 30, 30)}" class="gx-line"/>
      ${[0, 1, 2, 3, 4].map((i) => `<path d="M${50 + i * 3} ${24 + i * 14}H${96 + i * 4}" class="gx-acc-s gx-grow" ${d((0.9 + i * 0.2).toFixed(2))}/>`).join('')}<path d="M77 14V106" class="gx-price gx-dash"/>`,
    u10: `${AX}<path d="${gaussPath(70, 18, 86)}" class="gx-dem"/>
      <path d="M104 106${Array.from({ length: 13 }, (_, k) => { const x = 104 + k * 3; return `L${x} ${(106 - 86 * Math.exp(-(((x - 70) / 18) ** 2) / 2)).toFixed(1)}`; }).join('')}L140 106Z" style="fill:var(--err);opacity:.35"/>
      <path d="M104 30V106" class="gx-sup gx-dash"/><text x="124" y="26" class="gx-t" style="fill:var(--err)">α</text>
      <circle cx="118" cy="104" r="6" class="gx-eqf gx-pop" ${d(0.8)}/><text x="70" y="14" class="gx-t gx-tc">H₀</text>`,
  };
  const glyph = (modId) => (GLYPHS[modId] ? `<svg viewBox="0 0 150 120" focusable="false">${GLYPHS[modId]}</svg>` : '');

  // Pantalla de entrada: se cierra sola, con un clic o con cualquier tecla
  function interstitial(n, title, mod) {
    return new Promise((res) => {
      const unit = UNITS.find((u) => u.id === mod.unit);
      const tag = `Tema ${mod.tema} · TP ${mod.tp} · ${unit.title}`;
      const stages = PIPES[mod.id];
      const el = document.createElement('div');
      el.className = 'inter';
      el.dataset.u = mod.unit;
      el.tabIndex = -1;
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-modal', 'true');
      el.setAttribute('aria-label', `Lección ${n}: ${title.replace(/<[^>]*>/g, '')}`);
      el.innerHTML = `<div class="inter-box">
        <p class="inter-typed" style="--steps:${tag.length}" aria-hidden="true">${tag}</p>
        <h2>${mod.title}</h2>
        <p class="inter-pipe" aria-hidden="true">${stages.map((s, i) => `${i ? '<span class="ar">→</span>' : ''}<span class="s" ${d((0.35 + i * 0.16).toFixed(2))}>${s}</span>`).join('')}</p>
        <p class="inter-trap"><span class="lbl">Error típico en el parcial</span>${TRAPS[mod.id]}</p>
        <p class="inter-hint">Tocá o presioná una tecla para entrar</p>
      </div>`;
      let closed = false;
      const end = (e) => {
        if (closed) return;
        closed = true;
        // La tecla que cierra no llega a los atajos de la guía (flechas, /, Escape)
        if (e?.type === 'keydown') { e.preventDefault(); e.stopPropagation(); }
        window.removeEventListener('keydown', end, true);
        el.classList.add('out');
        setTimeout(() => el.remove(), 330);
        res();
      };
      el.addEventListener('click', end);
      window.addEventListener('keydown', end, true);
      document.body.append(el);
      el.focus();
      setTimeout(end, 3200);
    });
  }

  // Al entrar a una lección de otro tema. skip = true solo registra el tema (primera carga).
  let lastModule = null;
  function intro(lessonId, skip) {
    const i = LESSONS.findIndex((l) => l.id === lessonId);
    const mod = MODULES.find((m) => m.id === LESSONS[i]?.module);
    if (!mod || mod.id === lastModule) return Promise.resolve();
    lastModule = mod.id;
    if (skip || RM.matches || !PIPES[mod.id]) return Promise.resolve();
    return interstitial(i + 1, LESSONS[i].title, mod);
  }

  window.ANIM = { intro, glyph };
})();
