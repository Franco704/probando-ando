/* Tema 8 (2do parcial): distribuciones Normal y exponencial. Clase 8, TP 4 (introducción a la normal y ejercicios 10 a 20).
   Las soluciones leen la tabla como en el parcial: z con dos decimales (st.z2) y Φ con cuatro (st.phiT); la búsqueda inversa elige el z de la tabla más cercano. */
(() => {
  const { LESSONS, h, st: S } = window.GUIDE;
  const { note, def, table, eq, frac, lab, num, area, fig } = h;
  const n4 = (v) => num(v, 4), z2 = (v) => num(S.z2(v), 2), F = (z) => S.phiT(z);
  // Búsqueda inversa en la tabla: el z con dos decimales cuyo Φ está más cerca del área pedida
  const zT = (p) => { let best = 0; for (let k = -349; k <= 349; k++) { const z = k / 100; if (Math.abs(S.phi(z) - p) < Math.abs(S.phi(best) - p)) best = z; } return best; };
  const zf = (x, mu, s) => S.z2((x - mu) / s);
  const curve = (mu, s, shade, cap, ticks) => fig(area({ x: [mu - 3.6 * s, mu + 3.6 * s], ymax: S.normPdf(mu, mu, s) * 1.2, f: (x) => S.normPdf(x, mu, s), shade, anim: false, ticks: { x: ticks || [-3, -2, -1, 0, 1, 2, 3].map((k) => mu + k * s), y: [] } }), cap);
  const std = (shade, cap) => curve(0, 1, shade, cap);

  // TP 4, ej. 15 y 16
  const e15 = (z) => Math.round(F(z) * 10000);
  const e16a = 65 + zT(0.2) * 18, e16b = 65 + zT(0.85) * 18;

  LESSONS.push(
    {
      id: 'normal',
      module: 'u8',
      title: 'La distribución Normal y la tabla de z',
      keywords: 'distribución normal campana de Gauss media desvío simétrica normal estándar tipificar estandarizar z = (x − μ)/σ tabla Φ regla empírica 68 95 99,7',
      tldr: 'La <strong>Normal N(μ, σ)</strong> es la campana de Gauss: simétrica alrededor de μ, con media = mediana = moda y área total 1. Para usar la tabla se <strong>tipifica</strong>: <mark>z = (x − μ)/σ</mark> lleva cualquier normal a la <strong>estándar</strong> N(0, 1). La tabla da <mark>Φ(z) = P(Z ≤ z)</mark>, el área a la izquierda. Regla empírica: μ ± σ tiene el 68 %, μ ± 2σ el 95 % y μ ± 3σ el 99,7 %.',
      goals: ['Describir la normal y el efecto de μ y σ en la curva.', 'Tipificar y leer Φ(z) en la tabla, para la izquierda, la derecha y entre dos valores.', 'Usar la regla empírica para estimar rápido.'],
      body: `
        <h2>La campana de Gauss</h2>
        <p>Es la distribución continua más importante: describe muchos fenómenos de la naturaleza, la industria y la investigación (mediciones físicas, lluvias, piezas fabricadas).</p>
        ${eq(`f(x) = ${frac('1', 'σ√(2π)')} · e<sup>−½((x − μ)/σ)²</sup> &nbsp;&nbsp; −∞ &lt; x &lt; ∞`, 'Densidad normal')}
        <ul>
          <li>Depende de la media μ (dónde está el centro) y del desvío σ (qué tan ancha es).</li>
          <li>Es <strong>simétrica</strong> respecto de μ: 50 % de los valores a cada lado. Media = mediana = moda.</li>
          <li>El área bajo la curva es 1. E(X) = μ y V(X) = σ².</li>
          <li>Con igual σ y distinta μ las curvas se corren; con igual μ y mayor σ, la curva es más baja y ancha.</li>
        </ul>
        ${curve(0, 1, [[-1, 1], [-2, -1, 'a-sig'], [1, 2, 'a-sig']], 'Regla empírica: 68 % entre μ ± σ (naranja), 95 % entre μ ± 2σ, 99,7 % entre μ ± 3σ.')}
        <h2>Tipificar</h2>
        ${eq('z = (x − μ) / σ', 'Transformación a la normal estándar')}
        <p>Si X ~ N(μ, σ), entonces Z = (X − μ)/σ ~ N(0, 1). z dice <strong>a cuántos desvíos</strong> de la media está x. Así una sola tabla sirve para todas las normales. Ejemplo: X ~ N(200; 50) va de μ − 3σ = 50 a μ + 3σ = 350 casi en su totalidad.</p>
        <h2>Leer la tabla</h2>
        <p>La tabla es de doble entrada: fila con z hasta el primer decimal y columna con el segundo. Da el <strong>área a la izquierda</strong>: P(Z ≤ 0,23) = <strong>${n4(F(0.23))}</strong>.</p>
        ${table(['Pedido', 'Con la tabla'], [['P(Z ≤ z)', 'Φ(z)'], ['P(Z ≥ z)', '1 − Φ(z)'], ['P(z₁ ≤ Z ≤ z₂)', 'Φ(z₂) − Φ(z₁)'], ['P(|Z| ≤ z)', 'Φ(z) − Φ(−z) = 2Φ(z) − 1']])}
        <h3>Ejemplos de la clase y del TP</h3>
        <ul>
          <li>Circuito integrado: μ = 3 años, σ = 0,5. P(X &lt; 2,3): z = (2,3 − 3)/0,5 = −1,4 → Φ(−1,4) = <strong>${n4(F(-1.4))}</strong>.</li>
          <li>μ = 50, σ = 10: P(45 ≤ X ≤ 62) = Φ(1,2) − Φ(−0,5) = ${n4(F(1.2))} − ${n4(F(-0.5))} = <strong>${n4(F(1.2) - F(-0.5))}</strong>.</li>
          <li>Tiempo de reacción, μ = 1,25 s, σ = 0,46: P(1 ≤ X ≤ 1,75) = Φ(1,09) − Φ(−0,54) = ${n4(F(1.09))} − ${n4(F(-0.54))} = <strong>${n4(F(1.09) - F(-0.54))}</strong>.</li>
          <li>Alturas, μ = 170, σ = 10: P(160 ≤ X ≤ 180) = Φ(1) − Φ(−1) = <strong>${n4(F(1) - F(-1))}</strong> (la regla del 68 %).</li>
        </ul>
        ${lab(0)}
        ${note('Siempre dibujá la campana y sombreá el área pedida antes de buscar en la tabla. Así se ve de inmediato si hay que restar de 1 o restar dos áreas, y si el resultado tiene que ser mayor o menor que 0,5.', 'exam')}`,
      labs: [
        { type: 'normal', title: 'Tipificar y leer la tabla', intro: 'Datos del ejemplo de la clase (μ = 50, σ = 10, entre 45 y 62). Cambiá μ, σ y los extremos; probá también la búsqueda inversa.', mu: 50, sigma: 10, a: 45, b: 62, mode: 'between' },
      ],
      exercises: [
        { title: 'Seis áreas de la normal estándar', official: '4.10', level: 1, prompt: '<p>Z ~ N(0, 1). Con la tabla: a) P(−1,5 ≤ Z ≤ 0); b) P(−2,5 ≤ Z ≤ 1); c) P(0,82 ≤ Z ≤ 1,35); d) P(0 ≤ Z ≤ 1,25); e) P(Z ≥ 1,38); f) P(|Z| ≤ 1,28).</p>',
          solution: { explain: `<p>a) Φ(0) − Φ(−1,5) = 0,5 − ${n4(F(-1.5))} = <strong>${n4(0.5 - F(-1.5))}</strong>.</p>
            <p>b) Φ(1) − Φ(−2,5) = ${n4(F(1))} − ${n4(F(-2.5))} = <strong>${n4(F(1) - F(-2.5))}</strong>.</p>
            <p>c) Φ(1,35) − Φ(0,82) = ${n4(F(1.35))} − ${n4(F(0.82))} = <strong>${n4(F(1.35) - F(0.82))}</strong>.</p>
            <p>d) Φ(1,25) − 0,5 = <strong>${n4(F(1.25) - 0.5)}</strong>.</p>
            <p>e) 1 − Φ(1,38) = 1 − ${n4(F(1.38))} = <strong>${n4(1 - F(1.38))}</strong>.</p>
            <p>f) Φ(1,28) − Φ(−1,28) = ${n4(F(1.28))} − ${n4(F(-1.28))} = <strong>${n4(F(1.28) - F(-1.28))}</strong>.</p>
            ${std([[-1.28, 1.28]], 'f) El área central entre −1,28 y 1,28 es casi el 80 %.')}` } },
        { title: 'Normal μ = 250, σ = 30', official: '4.12', level: 1, prompt: '<p>X ~ N(250; 30). Hallar: a) P(280 ≤ X ≤ 310); b) P(X ≤ 350); c) P(X ≥ 320); d) P(X ≥ 220).</p>',
          solution: { explain: `<p>a) z = (280 − 250)/30 = 1 y z = (310 − 250)/30 = 2: Φ(2) − Φ(1) = ${n4(F(2))} − ${n4(F(1))} = <strong>${n4(F(2) - F(1))}</strong>.</p>
            <p>b) z = 100/30 = 3,33: Φ(3,33) = <strong>${n4(F(3.33))}</strong>.</p>
            <p>c) z = 70/30 = 2,33: 1 − ${n4(F(2.33))} = <strong>${n4(1 - F(2.33))}</strong>.</p>
            <p>d) z = −30/30 = −1: 1 − Φ(−1) = 1 − ${n4(F(-1))} = <strong>${n4(1 - F(-1))}</strong>.</p>` } },
        { title: 'Ingresos de una ciudad', official: '4.14', level: 2, prompt: '<p>Ingreso con μ = 45.000 y σ = 5.000, normal. a) % con renta superior a 55.000. b) % entre 50.000 y 52.000. c) Renta a partir de la cual está el 10 % de mayores ingresos. d) Ingreso tope del 15 % de menores ingresos.</p>',
          solution: { explain: `<p>a) z = 10.000/5.000 = 2: 1 − ${n4(F(2))} = ${n4(1 - F(2))} → <strong>${num((1 - F(2)) * 100, 2)} %</strong>.</p>
            <p>b) z = 1 y z = 1,4: Φ(1,4) − Φ(1) = ${n4(F(1.4))} − ${n4(F(1))} = ${n4(F(1.4) - F(1))} → <strong>${num((F(1.4) - F(1)) * 100, 2)} %</strong>.</p>
            <p>c) Área a la izquierda 0,90 → z = ${z2(zT(0.9))}. x = 45.000 + ${z2(zT(0.9))}·5.000 = <strong>${num(45000 + zT(0.9) * 5000, 0)}</strong>.</p>
            <p>d) Área a la izquierda 0,15 → z = ${z2(zT(0.15))}. x = 45.000 ${num(zT(0.15) * 5000, 0)} = <strong>${num(45000 + zT(0.15) * 5000, 0)}</strong>.</p>` } },
        { title: 'Salarios de 10.000 trabajadores', official: '4.15', level: 2, prompt: '<p>Salarios normales con media 110 y varianza 64. ¿Cuántos trabajadores tienen salarios: a) ≤ 110; b) ≤ 125; c) ≤ 90; d) ≥ 106; e) entre 100 y 120 inclusive?</p>',
          solution: { explain: `<p>σ = √64 = <strong>8</strong> (¡la varianza no va en la fórmula de z!). Cantidad = 10.000 × probabilidad.</p>
            <p>a) z = 0: 0,5 → <strong>5.000</strong>.</p>
            <p>b) z = 15/8 = 1,875 ≈ 1,88: ${n4(F(1.88))} → <strong>${num(e15(1.88), 0)}</strong>.</p>
            <p>c) z = −20/8 = −2,5: ${n4(F(-2.5))} → <strong>${num(e15(-2.5), 0)}</strong>.</p>
            <p>d) z = −4/8 = −0,5: 1 − ${n4(F(-0.5))} = ${n4(1 - F(-0.5))} → <strong>${num(10000 - e15(-0.5), 0)}</strong>.</p>
            <p>e) z = ±1,25: ${n4(F(1.25))} − ${n4(F(-1.25))} = ${n4(F(1.25) - F(-1.25))} → <strong>${num(e15(1.25) - e15(-1.25), 0)}</strong>.</p>` } },
        { title: 'Sacos de harina', official: '4.17', level: 1, prompt: '<p>Peso normal con μ = 35 lb y σ = 5 lb. Probabilidad de que un saco: a) pese a lo más 24,2875 lb; b) pese por lo menos 26,0025 lb.</p>',
          solution: { explain: `<p>a) z = (24,2875 − 35)/5 = −2,1425 ≈ −2,14: Φ(−2,14) = <strong>${n4(F(-2.14))}</strong>.</p><p>b) z = (26,0025 − 35)/5 = −1,7995 ≈ −1,80: 1 − Φ(−1,80) = 1 − ${n4(F(-1.8))} = <strong>${n4(1 - F(-1.8))}</strong>.</p>` } },
        { title: 'Altura sentados y diseño del auto', official: '4.18', level: 1, prompt: '<p>Alturas sentados normales con μ = 36,0 pulgadas y σ = 1,4. El diseño acomoda hasta 38,8. ¿P(un hombre al azar mida menos de 38,8)? ¿Es factible el diseño?</p>',
          solution: { explain: `<p>z = (38,8 − 36)/1,4 = 2: Φ(2) = <strong>${n4(F(2))}</strong>. El 97,7 % de los hombres entra; solo el 2,3 % queda afuera. El diseño es <strong>factible</strong> (aunque podría revisarse si se busca cubrir el 99 %).</p>` } },
      ],
      quiz: [
        { q: 'La tabla de la normal estándar da…', o: ['el área a la derecha de z', 'el área a la izquierda de z', 'la altura de la curva', 'el valor de z'], a: 1, e: 'Φ(z) = P(Z ≤ z).' },
        { q: 'Para tipificar se usa…', o: ['z = (x − μ)·σ', 'z = (x − μ)/σ', 'z = (x − σ)/μ', 'z = x/μ'], a: 1, e: 'Cuántos desvíos se aleja de la media.' },
        { q: 'En una normal, P(X > μ) =', o: ['0', '0,5', '0,68', '1'], a: 1, e: 'Es simétrica.' },
        { q: 'Aproximadamente qué porcentaje cae entre μ − 2σ y μ + 2σ?', o: ['68 %', '95 %', '99,7 %', '50 %'], a: 1, e: 'Regla empírica.' },
        { q: 'Si la varianza es 64, en la fórmula de z va…', o: ['64', '8', '32', '4096'], a: 1, e: 'El desvío.' },
        { q: 'P(Z ≥ 1,38) =', o: ['Φ(1,38)', '1 − Φ(1,38)', 'Φ(−1,38) − 1', '0,5 + Φ(1,38)'], a: 1, e: 'Complemento (o, por simetría, Φ(−1,38)).' },
        { q: 'Con igual μ, una normal de mayor σ es…', o: ['más alta y angosta', 'más baja y ancha', 'igual', 'corrida a la derecha'], a: 1, e: 'El área sigue siendo 1.' },
      ],
      open: [
        { t: 'num', q: 'TP 4, ej. 10 c): P(0,82 ≤ Z ≤ 1,35).', a: F(1.35) - F(0.82), e: `${n4(F(1.35))} − ${n4(F(0.82))} = ${n4(F(1.35) - F(0.82))}.` },
        { t: 'num', q: 'TP 4, ej. 12 a): X ~ N(250; 30). P(280 ≤ X ≤ 310).', a: F(2) - F(1), e: 'Φ(2) − Φ(1) = 0,9772 − 0,8413 = 0,1359.' },
        { t: 'num', q: 'Circuito integrado: μ = 3, σ = 0,5. P(X < 2,3).', a: F(-1.4), e: 'z = −1,4 → 0,0808.' },
        { t: 'num', q: 'TP 4, ej. 15 e): ¿cuántos de los 10.000 trabajadores ganan entre 100 y 120? (μ = 110, σ² = 64)', a: e15(1.25) - e15(-1.25), tol: 0.005, e: `z = ±1,25 → ${n4(F(1.25) - F(-1.25))} · 10.000 = ${e15(1.25) - e15(-1.25)}.` },
        { t: 'text', q: 'Explicá qué significa tipificar una variable normal y para qué sirve.', k: [['z', 'normal estándar', 'n(0', 'n(0,1)', 'n(0; 1)'], ['restar la media', 'x − μ', 'menos la media', 'x - μ'], ['dividir', 'desvío', 'σ'], ['tabla']], need: 3, e: 'Es pasar de X ~ N(μ, σ) a la <b>normal estándar</b> Z ~ N(0, 1) con z = (x − μ)/σ: se <b>resta la media</b> y se <b>divide por el desvío</b>. z indica a cuántos desvíos de la media está x y permite usar una única <b>tabla</b> para cualquier normal.' },
      ],
      sources: [
        { title: 'TP 4: introducción a la distribución normal', ref: 'Cátedra, UTN-FRT', points: ['Densidad normal y normal estándar; ejemplo del circuito integrado: P(X < 2,3) = P(Z < −1,4) = 0,0808.'] },
        { title: 'Clase 8: Normal y exponencial', ref: 'Prof. Teri', points: ['Campana de Gauss, características, tipificación y lectura de la tabla de doble entrada.', 'Regla 68 / 95 / 99,7 % con el precio del cobre (μ = 100, σ = 10); ejercicios 1 a 4.'] },
      ],
    },
    {
      id: 'normal-inversa',
      module: 'u8',
      title: 'Búsqueda inversa: del área al valor de x',
      keywords: 'normal inversa percentil buscar z dada el área valor de abscisa x = μ + z·σ porcentaje superior inferior grupos puntajes',
      tldr: 'A veces se conoce el área y se busca el valor: “¿a partir de qué renta está el 10 % más rico?”. Se busca el área <strong>dentro</strong> de la tabla, se lee el <strong>z</strong> y se despeja <mark>x = μ + z·σ</mark>. Si el área dada es a la derecha, primero se pasa a la izquierda (1 − área).',
      goals: ['Encontrar z a partir de un área.', 'Convertir z en un valor de x.', 'Resolver problemas de cortes (percentiles) en contexto.'],
      body: `
        <h2>El camino al revés</h2>
        ${h.flow('Dibujar la campana y ubicar el área conocida.', 'Pasarla a área a la <b>izquierda</b> del valor buscado (si es a la derecha: 1 − área).', 'Buscar esa área en el <b>cuerpo</b> de la tabla y leer z (fila + columna).', 'Despejar: <b>x = μ + z·σ</b>.')}
        ${table(['Área a la izquierda', 'z (tabla)', 'Uso típico'], [['0,90', z2(zT(0.9)), '10 % superior'], ['0,95', '1,645', 'una cola al 5 %'], ['0,975', '1,96', 'dos colas al 5 %'], ['0,995', '2,575', 'dos colas al 1 %'], ['0,85', z2(zT(0.85)), '15 % superior'], ['0,15', z2(zT(0.15)), '15 % inferior']])}
        ${note('Cuando el área cae justo entre dos valores de la tabla (0,95 está entre Φ(1,64) = 0,9495 y Φ(1,65) = 0,9505), la cátedra toma el promedio: 1,645. Lo mismo con 0,995 → 2,575.', 'tip')}
        ${lab(0)}`,
      labs: [
        { type: 'normal', title: 'Búsqueda inversa', intro: 'Elegí “Inversa”, poné μ = 300, σ = 20 y el área a la izquierda (TP 4, ej. 13).', mu: 300, sigma: 20, a: 280, b: 320, p: 0.8, mode: 'left' },
      ],
      exercises: [
        { title: 'Valores de a en N(0, 1)', official: '4.11', level: 2, prompt: '<p>Z ~ N(0, 1). Hallar a tal que: a) P(Z ≤ a) = 0,85; b) P(Z ≥ a) = 0,85; c) P(Z ≤ a) = 0,15; d) P(Z &gt; a) = 0,15; e) P(Z ≥ a) = 0,4483; f) P(−1,28 ≤ Z ≤ a) = 0,7482.</p>',
          solution: { explain: `<p>a) Φ(a) = 0,85 → a = <strong>${z2(zT(0.85))}</strong>.</p>
            <p>b) P(Z ≥ a) = 0,85 → Φ(a) = 0,15 → a = <strong>${z2(zT(0.15))}</strong>.</p>
            <p>c) Φ(a) = 0,15 → a = <strong>${z2(zT(0.15))}</strong>.</p>
            <p>d) P(Z &gt; a) = 0,15 → Φ(a) = 0,85 → a = <strong>${z2(zT(0.85))}</strong>.</p>
            <p>e) Φ(a) = 1 − 0,4483 = 0,5517 → a = <strong>${z2(zT(0.5517))}</strong>.</p>
            <p>f) Φ(a) = 0,7482 + Φ(−1,28) = 0,7482 + ${n4(F(-1.28))} = ${n4(0.7482 + F(-1.28))} → a = <strong>${z2(zT(0.7482 + F(-1.28)))}</strong>.</p>` } },
        { title: 'Abscisas en N(300; 20)', official: '4.13', level: 2, prompt: '<p>X ~ N(300; 20). Hallar a tal que: a) P(X ≤ a) = 0,80; b) P(X ≤ a) = 0,40; c) P(X ≥ a) = 0,80; d) P(340 ≤ X ≤ a) = 0,0166.</p>',
          solution: { explain: `<p>a) z = ${z2(zT(0.8))} → a = 300 + ${z2(zT(0.8))}·20 = <strong>${num(300 + zT(0.8) * 20, 1)}</strong>.</p>
            <p>b) z = ${z2(zT(0.4))} → a = <strong>${num(300 + zT(0.4) * 20, 1)}</strong>.</p>
            <p>c) Φ(z) = 0,20 → z = ${z2(zT(0.2))} → a = <strong>${num(300 + zT(0.2) * 20, 1)}</strong>.</p>
            <p>d) 340 → z = 2: Φ(z) = 0,0166 + ${n4(F(2))} = ${n4(0.0166 + F(2))} → z = ${z2(zT(0.0166 + F(2)))} → a = <strong>${num(300 + zT(0.0166 + F(2)) * 20, 1)}</strong>.</p>` } },
        { title: 'Tres grupos según un test', official: '4.16', level: 2, prompt: '<p>Puntajes N(65; 18). Se clasifica en baja (20 %), aceptable (65 %) y excelente (15 %) cultura general. ¿Qué puntajes separan los grupos?</p>',
          solution: { explain: `<p>Corte 1: deja 0,20 a la izquierda → z = ${z2(zT(0.2))} → x = 65 + (${z2(zT(0.2))})·18 = <strong>${num(e16a, 2)}</strong>.</p><p>Corte 2: deja 0,20 + 0,65 = 0,85 a la izquierda → z = ${z2(zT(0.85))} → x = 65 + ${z2(zT(0.85))}·18 = <strong>${num(e16b, 2)}</strong>.</p><p>Baja: menos de ${num(e16a, 1)}; aceptable: entre ${num(e16a, 1)} y ${num(e16b, 1)}; excelente: más de ${num(e16b, 1)}.</p>` } },
      ],
      quiz: [
        { q: 'Si P(Z ≥ a) = 0,85, entonces Φ(a) =', o: ['0,85', '0,15', '0,5', '1,85'], a: 1, e: 'Se pasa a la izquierda.' },
        { q: 'Despejando de la tipificación, x =', o: ['μ + z·σ', 'μ − z/σ', 'z·μ + σ', '(z − μ)/σ'], a: 0, e: 'z = (x − μ)/σ.' },
        { q: 'El z que deja 0,975 a la izquierda es…', o: ['1,645', '1,96', '2,575', '0,975'], a: 1, e: 'Muy usado en intervalos del 95 %.' },
        { q: 'Si el área buscada a la izquierda es menor que 0,5, z es…', o: ['positivo', 'negativo', '0', 'mayor que 1'], a: 1, e: 'Queda a la izquierda de la media.' },
      ],
      open: [
        { t: 'num', q: 'TP 4, ej. 11 a): a tal que P(Z ≤ a) = 0,85 (con dos decimales).', a: zT(0.85), e: `En la tabla, 0,85 está más cerca de Φ(${z2(zT(0.85))}) = ${n4(F(zT(0.85)))}.` },
        { t: 'num', q: 'TP 4, ej. 13 a): X ~ N(300; 20), a tal que P(X ≤ a) = 0,80.', a: 300 + zT(0.8) * 20, tol: 0.002, e: `z = ${z2(zT(0.8))}; a = 300 + ${z2(zT(0.8))}·20 = ${num(300 + zT(0.8) * 20, 1)}.` },
        { t: 'num', q: 'TP 4, ej. 14 c): ingresos N(45.000; 5.000). Renta a partir de la cual está el 10 % más alto.', a: 45000 + zT(0.9) * 5000, tol: 0.002, e: `z = ${z2(zT(0.9))} → 45.000 + ${z2(zT(0.9))}·5.000 = ${num(45000 + zT(0.9) * 5000, 0)}.` },
      ],
      sources: [
        { title: 'TP 4, ejercicios 11, 13, 14 y 16', ref: 'Cátedra, UTN-FRT', points: ['Búsquedas inversas en N(0, 1) y en normales con μ y σ.'] },
        { title: 'Clase 9: valores críticos', ref: 'Prof. Teri', points: ['z = 1,96 para 0,975; 2,575 (promedio de 2,57 y 2,58) para 0,995.'] },
      ],
    },
    {
      id: 'exponencial',
      module: 'u8',
      title: 'Distribución exponencial',
      keywords: 'distribución exponencial tiempo de espera entre eventos β media λ tasa 1/λ función acumulada 1 − e^(−x/β) falta de memoria vida útil',
      tldr: 'La <strong>exponencial</strong> describe <strong>cuánto hay que esperar</strong> hasta que ocurra algo (la próxima llamada, la falla de un componente). En la cátedra se usa con <mark>β = tiempo promedio</mark>: f(x) = (1/β)e^(−x/β) y <mark>F(x) = 1 − e^(−x/β)</mark> para x ≥ 0. Media β, varianza β². Si el dato es una tasa λ (eventos por unidad de tiempo, la de Poisson), <strong>β = 1/λ</strong>.',
      goals: ['Reconocer cuándo usar la exponencial.', 'Calcular probabilidades con F(x) = 1 − e^(−x/β).', 'Pasar de una tasa λ al parámetro β.'],
      body: `
        <h2>Tiempos de espera</h2>
        <p>Se usa para eventos que ocurren al azar con una frecuencia promedio: llamadas a un call center, vida de dispositivos, tiempo entre accidentes, llegada de clientes a un banco, duración de componentes electrónicos.</p>
        ${eq(`f(x) = ${frac('1', 'β')}·e<sup>−x/β</sup> (x ≥ 0) &nbsp;&nbsp;&nbsp; F(x) = P(X ≤ x) = 1 − e<sup>−x/β</sup>`, 'Exponencial')}
        ${eq('μ = β &nbsp;&nbsp;&nbsp; σ² = β² &nbsp;&nbsp;&nbsp; β = 1/λ', 'Parámetros')}
        <ul><li>Forma <strong>decreciente</strong>: lo más probable son esperas cortas.</li><li>Asintótica: nunca llega a 0.</li><li>β chico ⇒ cae rápido; β grande ⇒ cae lento.</li></ul>
        ${fig(area({ x: [0, 16], ymax: 0.3, f: (x) => S.expPdf(x, 4), shade: [[7, 16]], anim: false }), 'β = 4 años: P(X > 7) = e^(−7/4) = 0,1738 (área sombreada).')}
        <h3>Ejemplos de la clase</h3>
        <ul>
          <li>Componente con vida promedio β = 4 años: P(X &gt; 7) = 1 − F(7) = e^(−7/4) = <strong>${n4(Math.exp(-7 / 4))}</strong>.</li>
          <li>Clientes a razón de λ = 2 por minuto → β = 1/2: P(X &gt; 3) = e^(−3/0,5) = e⁻⁶ = <strong>${n4(Math.exp(-6))}</strong>.</li>
        </ul>
        ${note('Leé con cuidado el dato: “dura en promedio 1000 h” es β = 1000; “llegan 2 por minuto” es λ = 2, entonces β = 0,5 min. En el TP 4, ej. 20 la densidad viene como 3e^(−3x): ahí λ = 3 y β = 1/3.', 'warn')}
        ${note('Relación con Poisson: si los eventos llegan según Poisson con λ por unidad de tiempo, el tiempo entre eventos es exponencial con β = 1/λ.', 'tip')}
        ${lab(0)}`,
      labs: [
        { type: 'density', title: 'Exponencial', intro: 'La densidad 3e^(−3x) del TP 4, ej. 20. Sombreá desde 1/3 hasta el final para ver P(X > 1/3) = e⁻¹.', fn: 'exp' },
      ],
      exercises: [
        { title: 'Duración de un dispositivo', official: '4.19', level: 1, prompt: '<p>La duración tiene promedio 1000 h y distribución exponencial. a) P(dure entre 400 y 800 h). b) P(pasen 200 h antes de una falla).</p>',
          solution: { explain: `<p>β = 1000. a) P(400 &lt; X &lt; 800) = F(800) − F(400) = e^(−0,4) − e^(−0,8) = ${n4(Math.exp(-0.4))} − ${n4(Math.exp(-0.8))} = <strong>${n4(Math.exp(-0.4) - Math.exp(-0.8))}</strong>.</p><p>b) P(X &gt; 200) = e^(−0,2) = <strong>${n4(Math.exp(-0.2))}</strong>.</p>` } },
        { title: 'f(x) = 3e^(−3x)', official: '4.20', level: 1, prompt: '<p>X tiene densidad 3e^(−3x) para x ≥ 0. Hallar a) P(X &gt; 1/3); b) P(X &lt; 1/2).</p>',
          solution: { explain: `<p>Es exponencial con λ = 3, β = 1/3: F(x) = 1 − e^(−3x).</p><p>a) P(X &gt; 1/3) = e^(−1) = <strong>${n4(Math.exp(-1))}</strong>.</p><p>b) P(X &lt; 1/2) = 1 − e^(−1,5) = <strong>${n4(1 - Math.exp(-1.5))}</strong>.</p>` } },
      ],
      quiz: [
        { q: 'La exponencial modela…', o: ['número de éxitos en n ensayos', 'tiempo de espera hasta un evento', 'alturas de personas', 'suma de dados'], a: 1, e: 'Esperas y duraciones.' },
        { q: 'Con β = 4, P(X > 7) =', o: ['1 − e^(−7/4)', 'e^(−7/4)', 'e^(−28)', '7/4'], a: 1, e: '1 − F(7).' },
        { q: 'Si llegan en promedio 2 clientes por minuto, β =', o: ['2 min', '0,5 min', '4 min', '1 min'], a: 1, e: 'β = 1/λ.' },
        { q: 'Media y varianza de la exponencial:', o: ['β y β', 'β y β²', 'λ y λ', '1/β y β'], a: 1, e: 'σ = β.' },
        { q: 'La densidad exponencial es…', o: ['simétrica', 'decreciente', 'creciente', 'constante'], a: 1, e: 'Máxima en 0.' },
      ],
      open: [
        { t: 'num', q: 'TP 4, ej. 19 a): β = 1000 h. P(400 < X < 800).', a: Math.exp(-0.4) - Math.exp(-0.8), e: 'e^(−0,4) − e^(−0,8) = 0,6703 − 0,4493 = 0,2210.' },
        { t: 'num', q: 'TP 4, ej. 20 b): f(x) = 3e^(−3x). P(X < 1/2).', a: 1 - Math.exp(-1.5), e: '1 − e^(−1,5) = 0,7769.' },
        { t: 'num', q: 'Clase: vida promedio de 4 años. P(dure más de 7 años).', a: Math.exp(-7 / 4), e: 'e^(−1,75) = 0,1738.' },
      ],
      sources: [
        { title: 'Clase 8: Distribución exponencial', ref: 'Prof. Teri', points: ['f(x) = (1/β)e^(−x/β), F(x) = 1 − e^(−x/β); μ = β, σ² = β²; β = 1/λ.', 'Componente con β = 4 (0,1737) y clientes con λ = 2 (0,0024).'] },
      ],
    },
  );
})();
