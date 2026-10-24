/* Tema 9 (2do parcial): población y muestra, distribución de la media muestral, Teorema del Límite Central, t de Student e intervalos de confianza.
   Clase 9 (Prof. Teri) y TP 5. Los valores críticos se calculan con st.zInv y st.tInv (coinciden con la tabla al tercer decimal). */
(() => {
  const { LESSONS, h, st: S } = window.GUIDE;
  const { note, def, table, eq, frac, lab, num, area, fig } = h;
  const n4 = (v) => num(v, 4), n3 = (v) => num(v, 3), F = (z) => S.phiT(z);
  // Valores críticos como los usa la cátedra: 1,96 y 2,575 (promedio de la tabla)
  const zc = (conf) => ({ 0.9: 1.645, 0.95: 1.96, 0.99: 2.575 }[conf] ?? S.zInv((1 - conf) / 2));
  const ciZ = (x, s, n, conf) => { const z = zc(conf), e = (z * s) / Math.sqrt(n); return { z, e, lo: x - e, hi: x + e, se: s / Math.sqrt(n) }; };
  const ciT = (x, s, n, conf) => { const t = S.tInv((1 - conf) / 2, n - 1), e = (t * s) / Math.sqrt(n); return { t, e, lo: x - e, hi: x + e, se: s / Math.sqrt(n) }; };
  const iv = (c, d = 3) => `${num(c.lo, d)} &lt; μ &lt; ${num(c.hi, d)}`;

  const E9 = [9.8, 10.2, 10.4, 9.8, 10, 10.2, 9.6], E11 = [464, 461, 458, 478, 461, 459, 458, 469, 452, 460];
  const c6 = ciZ(80, 15, 36, 0.95), c7 = ciZ(2, 0.6, 144, 0.99), c8a = ciZ(99, 2, 40, 0.99), c8b = ciZ(99, 2, 40, 0.95);
  const c9 = ciT(S.mean(E9), S.sd(E9), 7, 0.95), c10 = ciT(21.9, 1.42, 36, 0.99), c10z = ciZ(21.9, 1.42, 36, 0.99), c11 = ciT(S.mean(E11), S.sd(E11), 10, 0.95);
  const zinc95 = ciZ(2.6, 0.3, 36, 0.95), zinc99 = ciZ(2.6, 0.3, 36, 0.99);

  LESSONS.push(
    {
      id: 'poblacion-muestra-tlc',
      module: 'u9',
      title: 'Población, muestra y el Teorema del Límite Central',
      keywords: 'estadística inferencial población finita infinita muestra parámetros estadísticos μ σ x̄ s distribución de la media muestral error estándar σ/√n Teorema del Límite Central n ≥ 30',
      tldr: 'La inferencia saca conclusiones de una <strong>población</strong> (parámetros μ, σ) a partir de una <strong>muestra</strong> (estadísticos x̄, s). Si se toman muchas muestras de tamaño n, las medias x̄ forman su propia distribución con <mark>media μ y desvío σ/√n</mark> (error estándar). El <mark>Teorema del Límite Central</mark> dice que, si n es grande (n ≥ 30), x̄ es aproximadamente <strong>normal</strong> aunque la población no lo sea.',
      goals: ['Distinguir parámetros poblacionales y estadísticos muestrales.', 'Calcular la media y el error estándar de x̄.', 'Enunciar el TLC y aplicarlo para calcular probabilidades sobre x̄.'],
      body: `
        <h2>Población y muestra</h2>
        <p>La <strong>estadística inferencial</strong> predice o saca conclusiones sobre una población a partir de una muestra. Medir a todos es técnica, financiera o logísticamente imposible (pesar a todos los recién nacidos de una región), así que se toma una muestra al azar.</p>
        ${table(['', 'Población (parámetros)', 'Muestra (estadísticos)'], [['Media', 'μ', 'x̄'], ['Desvío', 'σ', 's'], ['Varianza', 'σ²', 's²'], ['Tamaño', 'N (finita o infinita)', 'n']])}
        <p>Los estadísticos son <strong>aproximaciones</strong> de los parámetros y cambian de una muestra a otra: cada muestra tiene su x̄ y su s.</p>
        <h2>La distribución de la media muestral</h2>
        ${eq(`μ<sub>x̄</sub> = μ &nbsp;&nbsp;&nbsp; σ<sub>x̄</sub> = ${frac('σ', '√n')}`, 'Media y error estándar de x̄')}
        <p>Las medias se reparten alrededor de la verdadera μ, pero mucho más juntas que los datos sueltos: su desvío (el <strong>error estándar</strong>) es σ/√n. Para reducirlo a la mitad hay que cuadruplicar n.</p>
        ${def('Teorema del Límite Central', 'Sea x̄ la media de una muestra aleatoria de tamaño n tomada de una población con media μ y varianza σ² finitas. Entonces z = (x̄ − μ)/(σ/√n) tiene (aproximadamente) una distribución N(0, 1).', 'Clase 9')}
        ${table(['Población', 'Tamaño n', 'Distribución de x̄'], [['Normal', 'cualquiera', 'normal exacta'], ['No normal', 'n ≥ 30', 'aproximadamente normal (TLC)'], ['Parecida a la normal', 'n &lt; 30', 'aproximadamente normal'], ['Muy distinta de la normal', 'n &lt; 30', 'no se puede asegurar']])}
        ${lab(0)}
        <p>El ejemplo de la clase: un jugador acierta el 70 % de los tiros libres. Con n = 1 la distribución tiene dos barras (0 y 1); con n = 5 es asimétrica; con n = 25 y n = 100 ya es una campana. Lo mismo con un dado: un dado es uniforme, pero el promedio de muchos dados es normal.</p>
        <h3>Ejemplo de la clase: focos</h3>
        <p>Duración ≈ normal con μ = 800 h y σ = 40 h; muestra de 16 focos. σ<sub>x̄</sub> = 40/√16 = 10. P(x̄ &lt; 775) = P(Z &lt; (775 − 800)/10) = Φ(−2,5) = <strong>${n4(F(-2.5))}</strong>: muy poco probable que el promedio de 16 focos dure menos de 775 h.</p>
        ${note('El error típico: tipificar x̄ con σ en lugar de σ/√n. Si la pregunta es sobre <b>un</b> elemento, se usa σ; si es sobre el <b>promedio de n</b>, σ/√n.', 'warn')}`,
      labs: [
        { type: 'clt', title: 'Teorema del Límite Central', intro: 'Elegí una población (incluso muy asimétrica) y mové n: cada barra resume 600 medias de muestras de tamaño n. La curva naranja es N(μ, σ/√n).', pop: 'exp', n: 2 },
      ],
      exercises: [
        { title: 'Media muestral de n = 36', official: '5.1', level: 1, prompt: '<p>Muestra de n = 36 de una normal con μ = 8 y σ = 0,6. a) ¿Qué desvío tiene x̄? b) P(x̄ &gt; 8,1).</p>',
          solution: { explain: `<p>a) σ<sub>x̄</sub> = 0,6/√36 = <strong>0,1</strong>.</p><p>b) z = (8,1 − 8)/0,1 = 1: P(x̄ &gt; 8,1) = 1 − Φ(1) = <strong>${n4(1 - F(1))}</strong>.</p>` } },
        { title: 'Media y desvío de x̄', official: '5.2', level: 1, prompt: '<p>Determinar la media y el desvío de x̄ en: a) n = 25, μ = 10, σ² = 9; b) n = 100, μ = 5, σ² = 4; c) n = 36, μ = 120, σ² = 1.</p>',
          solution: { explain: '<p>a) μ<sub>x̄</sub> = 10; σ<sub>x̄</sub> = 3/5 = <strong>0,6</strong>. b) μ<sub>x̄</sub> = 5; σ<sub>x̄</sub> = 2/10 = <strong>0,2</strong>. c) μ<sub>x̄</sub> = 120; σ<sub>x̄</sub> = 1/6 = <strong>0,1667</strong>. Atención: el dato es la varianza; hay que sacar la raíz.</p>' } },
        { title: 'Clientes de 25 tiendas', official: '5.3', level: 1, prompt: '<p>Clientes por semana: μ = 5000, σ = 500. Muestra de 25 tiendas: P(x̄ &lt; 5075)?</p>',
          solution: { explain: `<p>σ<sub>x̄</sub> = 500/5 = 100. z = 75/100 = 0,75: Φ(0,75) = <strong>${n4(F(0.75))}</strong>.</p>` } },
        { title: 'Vida de mezcladores', official: '5.4', level: 2, prompt: '<p>Duración ≈ normal con μ = 5 años y σ = 1 año. Muestras de 9 mezcladores. a) P(4,4 &lt; x̄ &lt; 5,2). b) Valor de x̄ a la derecha del cual cae el 15 % de las medias.</p>',
          solution: { explain: `<p>σ<sub>x̄</sub> = 1/3.</p><p>a) z₁ = (4,4 − 5)/(1/3) = −1,8; z₂ = (5,2 − 5)/(1/3) = 0,6. P = Φ(0,6) − Φ(−1,8) = ${n4(F(0.6))} − ${n4(F(-1.8))} = <strong>${n4(F(0.6) - F(-1.8))}</strong>.</p><p>b) Área a la izquierda 0,85 → z = 1,04. x̄ = 5 + 1,04·(1/3) = <strong>${n4(5 + 1.04 / 3)}</strong> años.</p>` } },
      ],
      quiz: [
        { q: 'μ y σ son…', o: ['estadísticos muestrales', 'parámetros poblacionales', 'valores críticos', 'frecuencias'], a: 1, e: 'x̄ y s son los muestrales.' },
        { q: 'El error estándar de x̄ es…', o: ['σ', 'σ/n', 'σ/√n', 'σ²/n'], a: 2, e: 'El desvío de las medias.' },
        { q: 'Según el TLC, con n ≥ 30 la distribución de x̄ es…', o: ['igual a la de la población', 'aproximadamente normal', 'exponencial', 't de Student siempre'], a: 1, e: 'Sin importar la forma de la población.' },
        { q: 'Si la población es normal, x̄ es normal…', o: ['solo si n ≥ 30', 'para cualquier n', 'nunca', 'solo si σ es desconocido'], a: 1, e: 'Exacta.' },
        { q: 'Para reducir el error estándar a la mitad hay que…', o: ['duplicar n', 'cuadruplicar n', 'dividir n por 2', 'duplicar σ'], a: 1, e: '√(4n) = 2√n.' },
        { q: 'Focos: μ = 800, σ = 40, n = 16. σ<sub>x̄</sub> =', o: ['40', '10', '2,5', '50'], a: 1, e: '40/4.' },
      ],
      open: [
        { t: 'num', q: 'TP 5, ej. 3: μ = 5000, σ = 500, n = 25. P(x̄ < 5075).', a: F(0.75), e: 'z = 75/100 = 0,75 → 0,7734.' },
        { t: 'num', q: 'TP 5, ej. 4 a): μ = 5, σ = 1, n = 9. P(4,4 < x̄ < 5,2).', a: F(0.6) - F(-1.8), e: 'Φ(0,6) − Φ(−1,8) = 0,7257 − 0,0359 = 0,6898.' },
        { t: 'num', q: 'Focos de la clase: P(x̄ < 775) con μ = 800, σ = 40, n = 16.', a: F(-2.5), e: 'z = −2,5 → 0,0062.' },
        { t: 'text', q: 'Enunciá el Teorema del Límite Central y explicá por qué es tan importante.', k: [['media muestral', 'x̄', 'promedio'], ['normal'], ['n grande', 'n ≥ 30', 'tamaño', 'n >= 30', 'muestra grande'], ['cualquier población', 'no normal', 'sin importar', 'forma de la población']], need: 3, e: 'Si se toman muestras de tamaño <b>n grande</b> (n ≥ 30) de una población con media μ y desvío σ, la distribución de la <b>media muestral</b> x̄ es aproximadamente <b>normal</b> con media μ y desvío σ/√n, <b>sin importar la forma de la población</b>. Es importante porque permite usar la tabla normal para hacer inferencias sobre μ casi siempre.' },
      ],
      sources: [
        { title: 'Clase 9: Población y muestra', ref: 'Prof. Teri', points: ['Población finita e infinita; notación de parámetros y estadísticos.', 'TLC: población normal → x̄ normal para cualquier n; si n ≥ 30, aproximación buena; si n < 30, solo si la población es parecida a la normal.', 'Ejemplos del tiro libre, del dado y de los focos (0,0062).'] },
      ],
    },
    {
      id: 't-student',
      module: 'u9',
      title: 'σ desconocido: la t de Student',
      keywords: 't de Student grados de libertad ν = n − 1 σ desconocido desviación muestral s tabla t colas pesadas z o t cuándo usar',
      tldr: 'Si no se conoce σ y se usa la s de la muestra, <mark>T = (x̄ − μ)/(s/√n)</mark> no sigue una normal sino una <strong>t de Student</strong> con <mark>ν = n − 1 grados de libertad</mark>. Es simétrica y con forma de campana, pero con <strong>colas más pesadas</strong>; cuanto mayor ν, más se parece a la normal. La tabla da el t que deja un área α a la derecha.',
      goals: ['Decidir entre z y t según σ y la población.', 'Leer la tabla t con grados de libertad y área a la derecha.', 'Calcular probabilidades sobre x̄ con t.'],
      body: `
        <h2>Dos escenarios</h2>
        ${table(['Conozco σ', 'No conozco σ (uso s)'], [['Z = (x̄ − μ)/(σ/√n) ~ Normal', 'T = (x̄ − μ)/(s/√n) ~ t con ν = n − 1']])}
        <p>Los <strong>grados de libertad</strong> son el parámetro que define la forma de la curva t. Ejemplo de las sillas: 6 personas y 6 sillas; las primeras 5 eligen libremente, la sexta ya no tiene opción. Hay 5 grados de libertad (con la media fijada, solo n − 1 desvíos son libres).</p>
        ${lab(0)}
        <h2>Leer la tabla t</h2>
        <p>Se entra con ν (fila) y el área α a la derecha (columna). Con n = 10, ν = 9 y P(T &gt; t₀) = 0,15 → t₀ = <strong>${n4(S.tInv(0.15, 9))}</strong>. La tabla completa está en <a href="#/tablas">Tablas</a>.</p>
        <h3>Ejemplos de la clase</h3>
        <ul>
          <li>Calidad del aire: n = 16, s = 10,8585, ¿P(|x̄ − μ| &lt; 8)? T = 8/(10,8585/4) = 2,947 con ν = 15. La tabla da P(T &gt; 2,947) = 0,005, entonces P(−2,947 &lt; T &lt; 2,947) = 1 − 2·0,005 = <strong>0,99</strong>.</li>
          <li>n = 36, s = 12, ¿P(|x̄ − μ| &lt; 4,88)? T = 4,88/2 = 2,44 con ν = 35: P(T &gt; 2,44) ≈ 0,010 → <strong>0,98</strong>. Con la normal se hubiera obtenido 0,9854: con n grande la diferencia es chica.</li>
        </ul>
        <h2>Qué distribución usar (TP 5, ej. 5)</h2>
        ${table(['Muestra', 'Población', 'σ', 'Se usa'], [
          ['chica', 'normal', 'conocido', '<strong>z</strong>'],
          ['chica', 'no normal', 'conocido', '<strong>ninguna</strong> (el TLC no alcanza)'],
          ['chica', 'normal', 'desconocido', '<strong>t</strong> con n − 1'],
          ['chica', 'no normal', 'desconocido', '<strong>ninguna</strong>'],
          ['grande', 'normal', 'desconocido', '<strong>t</strong> (≈ z, con s)'],
          ['grande', 'no normal', 'desconocido', '<strong>z</strong> con s, por el TLC'],
        ])}
        ${note('La t exige que la población sea (aproximadamente) normal. Con n ≥ 30 la t y la z casi coinciden y muchos libros usan z con s; la cátedra marca la regla “no conozco σ → t”.', 'exam')}`,
      labs: [
        { type: 'tdist', title: 't contra normal', intro: 'Con pocos grados de libertad la t tiene colas más gruesas y el valor crítico es mayor. Subí ν y mirá cómo se acerca a la normal.', v: 4, alpha: 0.025 },
      ],
      exercises: [
        { title: '¿t, normal o ninguna?', official: '5.5', level: 2, prompt: '<p>Determinar si corresponde la t o la normal estándar (o ninguna) para la media muestral: a) muestra chica de población normal con σ conocido; b) chica, no normal, σ conocido; c) chica, normal, σ desconocido; d) chica, no normal, σ desconocido; e) grande, normal, σ desconocido; f) grande, no normal, σ desconocido.</p>',
          solution: { explain: '<p>a) <strong>Normal (z)</strong>: población normal ⇒ x̄ normal; σ conocido.</p><p>b) <strong>Ninguna</strong>: con n chico y población no normal no vale el TLC.</p><p>c) <strong>t</strong> con n − 1 grados de libertad.</p><p>d) <strong>Ninguna</strong>.</p><p>e) <strong>t</strong> (es la distribución exacta); con n grande se aproxima bien con z.</p><p>f) <strong>Normal (z)</strong> usando s, por el TLC (n grande).</p>' } },
      ],
      quiz: [
        { q: 'Si σ es desconocido y la población es normal con n = 10, se usa…', o: ['z', 't con 9 grados de libertad', 't con 10 grados de libertad', 'Poisson'], a: 1, e: 'ν = n − 1.' },
        { q: 'Comparada con la normal, la t tiene…', o: ['colas más livianas', 'colas más pesadas', 'media distinta de 0', 'forma asimétrica'], a: 1, e: 'Por la incertidumbre extra de usar s.' },
        { q: 'Al aumentar los grados de libertad, la t…', o: ['se aleja de la normal', 'se parece cada vez más a la normal', 'se vuelve asimétrica', 'no cambia'], a: 1, e: 'Con ν → ∞ es la normal.' },
        { q: 'La tabla t de la cátedra da…', o: ['el área a la izquierda', 'el t que deja un área α a la derecha', 'la densidad', 'el valor P'], a: 1, e: 'P(T > t<sub>α</sub>) = α.' },
        { q: 'Muestra chica, población no normal y σ desconocido:', o: ['z', 't', 'ninguna de las dos', 'exponencial'], a: 2, e: 'No se cumplen los supuestos.' },
      ],
      open: [
        { t: 'num', q: 'Con ν = 15, ¿qué t deja un área de 0,005 a la derecha?', a: S.tInv(0.005, 15), tol: 0.002, e: 't = 2,947.' },
        { t: 'num', q: 'Con ν = 9, ¿qué t deja un área de 0,025 a la derecha?', a: S.tInv(0.025, 9), tol: 0.002, e: 't = 2,262 (se usa para un intervalo del 95 % con n = 10).' },
        { t: 'text', q: '¿Cuándo se usa la distribución t de Student en lugar de la normal?', k: [['desconoc', 'no se conoce', 'no conozco'], ['s', 'desvío muestral', 'desviación muestral'], ['normal'], ['n − 1', 'grados de libertad', 'n-1']], need: 3, e: 'Cuando el desvío poblacional σ es <b>desconocido</b> y se reemplaza por el <b>desvío muestral s</b>, con una población (aproximadamente) <b>normal</b>. Se usa con <b>n − 1 grados de libertad</b>.' },
      ],
      sources: [
        { title: 'Clase 9: Distribución t de Student', ref: 'Prof. Teri', points: ['Conozco σ → Normal; no conozco σ → t. ν = n − 1 (ejemplo de las sillas).', 'Lectura de la tabla: n = 10, P(T > t₀) = 0,15 → 1,0997. Calidad del aire (0,99) y n = 36 (0,98 contra 0,9854 con z).'] },
      ],
    },
    {
      id: 'intervalos-confianza',
      module: 'u9',
      title: 'Intervalos de confianza para la media',
      keywords: 'intervalo de confianza nivel de confianza 1 − α z α/2 t α/2 error de estimación x̄ ± z σ/√n estimación puntual estimación por intervalo',
      tldr: 'x̄ es una estimación <strong>puntual</strong> de μ; como cambia de muestra en muestra, se da un <strong>intervalo</strong> que la contiene con una confianza 1 − α. Con σ conocido: <mark>x̄ ± z<sub>α/2</sub>·σ/√n</mark>. Con σ desconocido: <mark>x̄ ± t<sub>α/2; n−1</sub>·s/√n</mark>. Valores típicos: z = 1,645 (90 %), <strong>1,96 (95 %)</strong>, <strong>2,575 (99 %)</strong>.',
      goals: ['Deducir el intervalo a partir de P(−z<sub>α/2</sub> &lt; Z &lt; z<sub>α/2</sub>) = 1 − α.', 'Calcular intervalos con z y con t.', 'Interpretar el nivel de confianza y el efecto de n y de 1 − α en el ancho.'],
      body: `
        <h2>De la probabilidad al intervalo</h2>
        <p>Por el TLC, P(−z<sub>α/2</sub> &lt; (x̄ − μ)/(σ/√n) &lt; z<sub>α/2</sub>) = 1 − α. Despejando μ:</p>
        ${eq(`x̄ − z<sub>α/2</sub>·${frac('σ', '√n')} &lt; μ &lt; x̄ + z<sub>α/2</sub>·${frac('σ', '√n')}`, 'σ conocido')}
        ${eq(`x̄ − t<sub>α/2; n−1</sub>·${frac('s', '√n')} &lt; μ &lt; x̄ + t<sub>α/2; n−1</sub>·${frac('s', '√n')}`, 'σ desconocido')}
        <p>z<sub>α/2</sub> es el valor que deja α/2 en cada cola. Para 95 %: α = 0,05, α/2 = 0,025, área a la izquierda 0,975 → z = 1,96. Para 99 %: α/2 = 0,005, área 0,995 → entre 2,57 y 2,58, la cátedra toma <strong>2,575</strong>. El término z·σ/√n es el <strong>error de estimación</strong> (la mitad del ancho).</p>
        ${fig(area({ x: [-3.6, 3.6], ymax: 0.48, f: (x) => S.normPdf(x), shade: [[-1.96, 1.96], [-3.6, -1.96, 'a-rej'], [1.96, 3.6, 'a-rej']], anim: false, ticks: { x: [-1.96, 1.96], y: [] }, texts: [{ x: 0, y: 0.12, t: '0,95', cls: 'c-res' }, { x: -2.6, y: 0.06, t: '0,025', cls: 'pl-small' }, { x: 2.6, y: 0.06, t: '0,025', cls: 'pl-small' }] }), 'Nivel de confianza 95 %: 0,025 en cada cola.')}
        <h3>Ejemplo de la clase: zinc en un río</h3>
        <p>n = 36, x̄ = 2,6 g/ml, σ = 0,3. Error estándar 0,3/6 = 0,05.</p>
        <ul><li>95 %: 2,6 ± 1,96·0,05 = 2,6 ± 0,098 → <strong>${iv(zinc95, 2)}</strong> g/ml.</li><li>99 %: 2,6 ± 2,575·0,05 = 2,6 ± 0,129 → <strong>${iv(zinc99, 2)}</strong> g/ml.</li></ul>
        <p>Más confianza ⇒ intervalo más ancho. Para angostarlo sin perder confianza hay que aumentar n.</p>
        ${lab(0)}
        ${note('Cómo se interpreta: “estamos 95 % seguros de que μ está entre 2,50 y 2,70”. Formalmente, el 95 % de los intervalos construidos así (con distintas muestras) contiene a μ. μ es fija; lo que varía es el intervalo.', 'exam')}`,
      labs: [
        { type: 'ci', title: 'Cuarenta intervalos, una μ', intro: 'Cada barra es el intervalo de una muestra distinta de una población con μ = 50 y σ = 10. Las rojas no atrapan a μ. Cambiá el nivel de confianza y n.', n: 16, conf: 0.95 },
      ],
      exercises: [
        { title: 'Peso de pasajeros', official: '5.6', level: 1, prompt: '<p>Muestra de 36 pasajeros con x̄ = 80 kg; σ = 15 kg. ¿Valor probable de μ con 0,95 de confianza?</p>',
          solution: { explain: `<p>σ conocido → z = 1,96. Error = 1,96·15/√36 = 1,96·2,5 = ${n3(c6.e)}. Intervalo: <strong>${iv(c6, 2)}</strong> kg.</p>` } },
        { title: 'Tiempo de reacción de camioneros', official: '5.7', level: 1, prompt: '<p>n = 144, x̄ = 2 s, σ = 0,6 s. Intervalo del 99 % para el tiempo medio de reacción.</p>',
          solution: { explain: `<p>Error estándar 0,6/12 = 0,05. Error = 2,575·0,05 = ${n4(c7.e)}. Intervalo: <strong>${iv(c7, 3)}</strong> segundos.</p>` } },
        { title: 'Paquetes de 100 g', official: '5.8', level: 2, prompt: '<p>Muestra de 40 paquetes con x̄ = 99 g; σ = 2 g. ¿El intervalo del 99 % para el peso medio abarca los 100 g anunciados? ¿Y el del 95 %?</p>',
          solution: { explain: `<p>Error estándar = 2/√40 = ${n4(c8a.se)}.</p><p>99 %: 99 ± 2,575·${n4(c8a.se)} = 99 ± ${n3(c8a.e)} → <strong>${iv(c8a, 3)}</strong>. <strong>No</strong> incluye 100.</p><p>95 %: 99 ± 1,96·${n4(c8b.se)} = 99 ± ${n3(c8b.e)} → <strong>${iv(c8b, 3)}</strong>. Tampoco incluye 100.</p><p>Con ambos niveles, el peso medio real parece estar por debajo de lo anunciado: el envase no cumple.</p>` } },
        { title: 'Siete recipientes de ácido', official: '5.9', level: 2, prompt: `<p>Contenidos (litros): ${E9.map((x) => num(x, 1)).join(' – ')}. Intervalo del 95 % para la media, suponiendo población aproximadamente normal.</p>`,
          solution: { explain: `<p>x̄ = ${n4(S.mean(E9))}; s = ${n4(S.sd(E9))}. σ desconocido y n = 7 → t con ν = 6: t<sub>0,025</sub> = ${n3(c9.t)}.</p><p>Error = ${n3(c9.t)}·${n4(S.sd(E9))}/√7 = ${n4(c9.e)}. Intervalo: <strong>${iv(c9, 3)}</strong> litros.</p>` } },
        { title: 'Refrescos de una máquina', official: '5.10', level: 2, prompt: '<p>n = 36 refrescos, x̄ = 21,9 dl, s = 1,42 dl. Intervalo del 99 % para la media.</p>',
          solution: { explain: `<p>σ desconocido → t con ν = 35: t<sub>0,005</sub> = ${n3(c10.t)}. Error = ${n3(c10.t)}·1,42/6 = ${n4(c10.e)}. Intervalo: <strong>${iv(c10, 3)}</strong> dl.</p><p>Con n = 36 muchos libros usan z = 2,575: ${iv(c10z, 3)}; la diferencia es mínima.</p>` } },
        { title: 'Diez paquetes de un producto', official: '5.11', level: 2, prompt: `<p>Pesos (g): ${E11.join(' – ')}. Intervalo del 95 % para la media, suponiendo población normal.</p>`,
          solution: { explain: `<p>x̄ = ${n4(S.mean(E11))} g; s = ${n4(S.sd(E11))} g. t con ν = 9: t<sub>0,025</sub> = ${n3(c11.t)}.</p><p>Error = ${n3(c11.t)}·${n4(S.sd(E11))}/√10 = ${n4(c11.e)}. Intervalo: <strong>${iv(c11, 2)}</strong> g.</p>` } },
      ],
      quiz: [
        { q: 'Para un intervalo del 95 % con σ conocido se usa z =', o: ['1,645', '1,96', '2,575', '0,95'], a: 1, e: 'Deja 0,025 en cada cola.' },
        { q: 'Si aumenta el nivel de confianza (con el mismo n), el intervalo…', o: ['se angosta', 'se ensancha', 'no cambia', 'se corre'], a: 1, e: 'Hace falta un z mayor.' },
        { q: 'Si aumenta n (con la misma confianza), el intervalo…', o: ['se angosta', 'se ensancha', 'no cambia', 'desaparece'], a: 0, e: 'El error estándar σ/√n baja.' },
        { q: 'Con σ desconocido, n = 7 y población normal, el valor crítico es…', o: ['z<sub>α/2</sub>', 't<sub>α/2</sub> con 6 g.l.', 't<sub>α/2</sub> con 7 g.l.', 'z<sub>α</sub>'], a: 1, e: 'ν = n − 1.' },
        { q: '“95 % de confianza” significa que…', o: ['μ cambia el 5 % de las veces', 'el 95 % de los intervalos así construidos contiene a μ', 'el 95 % de los datos está en el intervalo', 'x̄ = μ con probabilidad 0,95'], a: 1, e: 'La confianza es del método.' },
        { q: 'El error de estimación con σ conocido es…', o: ['z·σ', 'z·σ/√n', 'σ/√n', 'x̄ − μ'], a: 1, e: 'La mitad del ancho.' },
      ],
      open: [
        { t: 'num', q: 'TP 5, ej. 6: límite inferior del intervalo del 95 % (n = 36, x̄ = 80, σ = 15).', a: c6.lo, e: `80 − 1,96·2,5 = ${n3(c6.lo)}.` },
        { t: 'num', q: 'TP 5, ej. 7: límite superior del intervalo del 99 % (n = 144, x̄ = 2, σ = 0,6).', a: c7.hi, e: `2 + 2,575·0,05 = ${n4(c7.hi)}.` },
        { t: 'num', q: 'TP 5, ej. 9: error de estimación (mitad del ancho) del intervalo del 95 %.', a: c9.e, tol: 0.01, e: `${n3(c9.t)}·${n4(S.sd(E9))}/√7 = ${n4(c9.e)}.` },
        { t: 'num', q: 'TP 5, ej. 11: límite inferior del intervalo del 95 %.', a: c11.lo, tol: 0.001, e: `${n4(S.mean(E11))} − ${n4(c11.e)} = ${num(c11.lo, 2)}.` },
        { t: 'text', q: 'En el TP 5, ej. 8, ¿qué concluís sobre el peso anunciado de 100 g?', k: [['no incluye', 'no contiene', 'no abarca', 'fuera'], ['100'], ['menor', 'por debajo', 'menos', 'no cumple']], need: 2, e: 'Ni el intervalo del 99 % ni el del 95 % <b>incluyen</b> los <b>100</b> g: el peso medio verdadero parece estar <b>por debajo</b> de lo anunciado.' },
      ],
      sources: [
        { title: 'Clase 9: Intervalos de confianza', ref: 'Prof. Teri', points: ['Deducción a partir de P(−z<sub>α/2</sub> < Z < z<sub>α/2</sub>) = 1 − α.', 'Zinc en un río: 2,5 < μ < 2,7 (95 %) y 2,47 < μ < 2,73 (99 %, z = 2,575).'] },
      ],
    },
  );
})();
