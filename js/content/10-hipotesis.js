/* Tema 10 (2do parcial): test de hipótesis para la media, región de rechazo, valor P y errores de tipo I y II. Clase 10 (Prof. Teri) y TP 6.
   Los estadísticos, valores críticos y valores P se calculan con st.test. */
(() => {
  const { LESSONS, h, st: S } = window.GUIDE;
  const { note, def, table, eq, frac, lab, num, area, fig } = h;
  const n4 = (v) => num(v, 4), n3 = (v) => num(v, 3);
  const SYM = { left: '<', right: '>', two: '≠' };
  // Desarrollo completo de un test para μ con los pasos de la clase
  function steps(o) {
    const T = S.test(o.xbar, o.mu0, o.s, o.n, o.alpha, o.tail, o.known);
    const k = o.known ? 'z' : 't', crit = o.critTxt || `${o.tail === 'two' ? '±' : o.tail === 'left' ? '−' : ''}${n3(T.crit)}`;
    const f = o.known ? (x) => S.normPdf(x) : (x) => S.tPdf(x, T.df), L = Math.max(4, Math.abs(T.stat) + 0.8);
    const rej = o.tail === 'left' ? [[-L, -T.crit, 'a-rej']] : o.tail === 'right' ? [[T.crit, L, 'a-rej']] : [[-L, -T.crit, 'a-rej'], [T.crit, L, 'a-rej']];
    return { T, html: `<p><b>Hipótesis</b>: H₀: μ = ${num(o.mu0, 4)} &nbsp; Ha: μ ${SYM[o.tail]} ${num(o.mu0, 4)} (${o.tail === 'two' ? 'dos colas' : 'una cola'}), α = ${num(o.alpha, 3)}.</p>
      <p><b>Estadístico</b> (${o.known ? 'σ conocido → z' : `σ desconocido → t con ν = ${o.n - 1}`}): ${k} = (${num(o.xbar, 4)} − ${num(o.mu0, 4)})/(${num(o.s, 4)}/√${o.n}) = ${num(o.xbar - o.mu0, 4)}/${n4(T.se)} = <strong>${n3(T.stat)}</strong>.</p>
      <p><b>Valor crítico</b>: ${k} = ${crit}.</p>${fig(area({ x: [-L, L], ymax: 0.46, f, shade: rej, anim: false, ticks: { x: [-3, -2, -1, 0, 1, 2, 3].filter((x) => Math.abs(x) < L), y: [] }, vlines: [{ x: T.stat, cls: T.reject ? 'c-stop' : 'c-pass', label: `${k} = ${num(T.stat, 2)}` }] }), 'En rojo, la región de rechazo de H₀.')}
      <p><b>Valor P</b>: ${o.tail === 'two' ? `2·P(${k.toUpperCase()} &gt; |${num(T.stat, 2)}|)` : o.tail === 'left' ? `P(${k.toUpperCase()} &lt; ${num(T.stat, 2)})` : `P(${k.toUpperCase()} &gt; ${num(T.stat, 2)})`} = <strong>${n4(T.p)}</strong> ${T.p < o.alpha ? '&lt;' : '≥'} α = ${num(o.alpha, 3)}.</p>
      <p><b>Decisión</b>: <strong>${T.reject ? 'se rechaza H₀' : 'no se rechaza H₀'}</strong>. ${o.concl}</p>` };
  }

  const ex1 = steps({ xbar: 780, mu0: 800, s: 40, n: 30, alpha: 0.04, tail: 'left', known: true, concl: 'Hay evidencia de que la vida media de los focos es menor que 800 h.' });
  const ex2 = steps({ xbar: 71.8, mu0: 70, s: 8.9, n: 100, alpha: 0.05, tail: 'right', known: true, critTxt: '1,645', concl: 'La vida promedio actual es mayor que 70 años.' });
  const ex3 = steps({ xbar: 21.9, mu0: 22.2, s: 1.42, n: 36, alpha: 0.05, tail: 'left', known: true, critTxt: '−1,645', concl: 'No hay evidencia suficiente de que el contenido medio sea menor que 22,2 dl.' });
  const ex4 = steps({ xbar: 34000, mu0: 35000, s: 2000, n: 16, alpha: 0.025, tail: 'left', known: false, concl: 'Con α = 0,025 no hay razón suficiente para creer que la vida media sea menor que 35.000 km (el t queda muy cerca del crítico).' });
  const ex5 = steps({ xbar: 42, mu0: 46, s: 11.9, n: 12, alpha: 0.05, tail: 'left', known: true, critTxt: '−1,645', concl: 'No se puede afirmar que el consumo medio sea menor que 46 kWh al año.' });
  const ex6 = steps({ xbar: 33.1, mu0: 35, s: 4.3, n: 20, alpha: 0.1, tail: 'left', known: true, concl: 'El tiempo medio para hacer el examen es menor que 35 minutos.' });
  const sedal = S.test(7.8, 8, 0.5, 50, 0.01, 'two');
  const pan = S.test(23.75, 24, 1, 1861, 0.01, 'left');

  LESSONS.push(
    {
      id: 'hipotesis-planteo',
      module: 'u10',
      title: 'Hipótesis nula y alternativa',
      keywords: 'decisiones estadísticas hipótesis estadística hipótesis nula H0 hipótesis alternativa Ha una cola dos colas nivel de significancia α región de rechazo región de aceptación',
      tldr: 'Un <strong>test de hipótesis</strong> usa una muestra para decidir entre dos afirmaciones contradictorias sobre un parámetro. La <mark>hipótesis nula H₀</mark> lleva <strong>siempre el igual</strong> (“no hay cambios, no hay diferencias”): H₀: μ = μ₀. La <mark>alternativa Ha</mark> es lo que se quiere probar: μ &lt; μ₀ o μ &gt; μ₀ (<strong>una cola</strong>) o μ ≠ μ₀ (<strong>dos colas</strong>). El <strong>nivel de significancia α</strong> es el área de la región de rechazo.',
      goals: ['Plantear H₀ y Ha a partir de un enunciado.', 'Distinguir tests de una y de dos colas.', 'Ubicar la región de rechazo según Ha y α.'],
      body: `
        <h2>Decisiones estadísticas</h2>
        <p>Son decisiones sobre una población tomadas con información muestral: ¿un medicamento es realmente eficaz? ¿un nuevo sistema de detección de intrusos encuentra más ataques que el anterior? Hay que decidir cuál de dos suposiciones contradictorias sobre un parámetro es la correcta.</p>
        ${def('Hipótesis estadística', 'Es una aseveración o conjetura respecto al valor de un parámetro de la población; por ejemplo, μ = 0,75 para el diámetro interno promedio de un tubo de PVC.', 'Clase 10')}
        ${def('Test (prueba) de hipótesis', 'Es un método que utiliza datos muestrales para decidir si la hipótesis nula debe ser rechazada.', 'Clase 10')}
        <h2>H₀ y Ha</h2>
        ${table(['', 'Hipótesis nula H₀', 'Hipótesis alternativa Ha'], [['Qué dice', 'No hay cambios, mejoras ni diferencias respecto de lo conocido', 'Lo que se desea probar; lo opuesto a H₀'], ['Forma', 'H₀: μ = μ₀ (siempre con igual)', 'μ &lt; μ₀ · μ &gt; μ₀ · μ ≠ μ₀']])}
        <p>Detector de intrusos: H₀: el nuevo detecta lo mismo que el viejo; Ha: detecta más. Recubrimiento de almohadones: la vida actual es 1000 h y solo se cambia si la evidencia muestra que el nuevo dura más: <strong>H₀: μ = 1000</strong> contra <strong>Ha: μ &gt; 1000</strong>.</p>
        ${table(['Ha', 'Tipo', 'Región de rechazo (σ conocido)'], [['μ &lt; μ₀', 'una cola, izquierda', 'z &lt; −z<sub>α</sub>'], ['μ &gt; μ₀', 'una cola, derecha', 'z &gt; z<sub>α</sub>'], ['μ ≠ μ₀', 'dos colas', '|z| &gt; z<sub>α/2</sub> (α/2 en cada cola)']])}
        ${fig(area({ x: [-3.8, 3.8], ymax: 0.46, f: (x) => S.normPdf(x), shade: [[-3.8, -2.575, 'a-rej'], [2.575, 3.8, 'a-rej']], anim: false, ticks: { x: [-2.575, 2.575], y: [] }, texts: [{ x: 0, y: 0.15, t: 'aceptación (1 − α)', cls: 'pl-small' }, { x: -3.1, y: 0.05, t: 'α/2', cls: 'c-stop' }, { x: 3.1, y: 0.05, t: 'α/2', cls: 'c-stop' }] }), 'Dos colas con α = 0,01: ±2,575 son los valores críticos.')}
        ${note('La palabra del enunciado define la cola: “menor que”, “disminuyó”, “menos de” → izquierda. “Mayor que”, “excede”, “aumentó” → derecha. “Distinto”, “cambió”, “difiere” → dos colas. H₀ nunca lleva &lt; ni &gt;.', 'exam')}
        ${lab(0)}`,
      labs: [
        { type: 'classify', title: '¿Qué Ha corresponde?', buckets: ['Ha: μ < μ₀', 'Ha: μ > μ₀', 'Ha: μ ≠ μ₀'], items: [
          { t: 'Los focos duran menos de 800 h', b: 0, why: '“Menos de”: cola izquierda.' },
          { t: 'La vida promedio hoy es mayor que 70 años', b: 1, why: '“Mayor que”: cola derecha.' },
          { t: 'La resistencia media del sedal es distinta de 8 kg', b: 2, why: '“Distinta”: dos colas.' },
          { t: 'El nuevo recubrimiento dura más de 1000 h', b: 1, why: 'Solo interesa si excede.' },
          { t: 'Las hogazas pesan menos de 24 onzas', b: 0, why: 'La multa es por peso menor.' },
          { t: 'Los dos medicamentos no tienen la misma eficacia', b: 2, why: 'No dice cuál es mejor.' },
        ] },
      ],
      quiz: [
        { q: 'La hipótesis nula H₀…', o: ['es lo que se quiere probar', 'lleva siempre el signo igual', 'puede ser μ < μ₀', 'se acepta siempre'], a: 1, e: '“No hay cambios”.' },
        { q: 'Ha: μ ≠ μ₀ corresponde a un test de…', o: ['una cola a la izquierda', 'una cola a la derecha', 'dos colas', 'ninguna cola'], a: 2, e: 'α/2 en cada cola.' },
        { q: 'α es…', o: ['el área de la región de rechazo', 'el valor P', 'la media muestral', 'la potencia'], a: 0, e: 'El nivel de significancia.' },
        { q: '“Solo se cambia si el nuevo dura más que 1000 h”. Ha:', o: ['μ = 1000', 'μ < 1000', 'μ > 1000', 'μ ≠ 1000'], a: 2, e: 'La evidencia tiene que mostrar que excede.' },
        { q: 'Con α = 0,05 y una cola a la derecha, el valor crítico z es…', o: ['1,96', '1,645', '2,575', '0,05'], a: 1, e: 'Deja 0,05 a la derecha.' },
      ],
      open: [
        { t: 'num', q: '¿Cuál es el valor crítico z de un test de dos colas con α = 0,05?', a: 1.96, e: 'α/2 = 0,025 en cada cola → z = ±1,96.' },
        { t: 'text', q: 'Planteá H₀ y Ha: un fabricante dice que sus llantas duran 35.000 km y se sospecha que duran menos.', k: [['h0', 'h₀', 'nula'], ['= 35000', '= 35.000', 'igual a 35'], ['< 35000', '< 35.000', 'menor', 'menos']], need: 3, e: '<b>H₀</b>: μ = 35.000 km (lo que afirma el fabricante, con el igual). <b>Ha</b>: μ &lt; 35.000 km (lo que se sospecha). Es un test de una cola a la izquierda.' },
      ],
      sources: [
        { title: 'Clase 10: Test de hipótesis', ref: 'Prof. Teri', points: ['Decisiones estadísticas, hipótesis estadística, H₀ con el igual y Ha con <, > o ≠.', 'Una y dos colas, regiones de rechazo y de aceptación; recubrimiento de almohadones (H₀: μ = 1000, Ha: μ > 1000).'] },
      ],
    },
    {
      id: 'test-media',
      module: 'u10',
      title: 'Test para la media: región de rechazo y valor P',
      keywords: 'test para la media σ conocido z σ desconocido t estadístico de prueba valor crítico región de rechazo valor P p-valor rechazar H0 decisión pasos',
      tldr: 'Pasos: 1) plantear H₀ y Ha; 2) calcular el <strong>estadístico</strong> <mark>z = (x̄ − μ₀)/(σ/√n)</mark> (o t con s y n − 1 g.l.); 3) compararlo con el <strong>valor crítico</strong>, o calcular el <mark>valor P</mark>: la probabilidad de un resultado tan extremo si H₀ fuera cierta; 4) <strong>si P &lt; α, se rechaza H₀</strong>. Las dos formas dan siempre la misma decisión.',
      goals: ['Resolver un test con región de rechazo y con valor P.', 'Elegir z o t según σ.', 'Redactar la conclusión en el contexto del problema.'],
      body: `
        <h2>Los pasos de la clase</h2>
        ${h.flow('Plantear H₀: μ = μ₀ y Ha (&lt;, &gt; o ≠). Fijar α.', 'Calcular el estadístico: z = (x̄ − μ₀)/(σ/√n) si σ es conocido; t = (x̄ − μ₀)/(s/√n) con ν = n − 1 si no.', 'Región de rechazo: buscar el valor crítico y ver si el estadístico cae en la zona roja. O valor P: el área más allá del estadístico (doble si son dos colas).', 'Decidir (rechazar H₀ si cae en la región o si P &lt; α) y concluir con palabras del problema.')}
        <h2>El valor P</h2>
        <p>Es un “medidor de rareza”: qué tan probable es obtener por puro azar un resultado como el observado (o más extremo), <strong>suponiendo que H₀ es cierta</strong>. Si P es muy chico, lo observado es demasiado raro para ser casualidad y se rechaza H₀. Cuanto más chico P, más fuerte la evidencia contra H₀.</p>
        ${table(['Ha', 'Valor P'], [['μ &lt; μ₀', 'P(Z &lt; z)'], ['μ &gt; μ₀', 'P(Z &gt; z)'], ['μ ≠ μ₀', '2·P(Z &gt; |z|)']])}
        <h3>Ejemplo de la clase: sedal de pesca (dos colas)</h3>
        <p>Se afirma μ = 8 kg (σ = 0,5); 50 sedales dan x̄ = 7,8; α = 0,01. z = (7,8 − 8)/(0,5/√50) = <strong>${num(sedal.stat, 2)}</strong>. Valores críticos ±2,575: z cae en la región de rechazo. Valor P = 2·P(Z &lt; −2,83) = 2·${n4(S.phiT(-2.83))} = <strong>${n4(2 * S.phiT(-2.83))}</strong> &lt; 0,01. <strong>Se rechaza</strong> que μ = 8: hay un 0,46 % de probabilidad de observar 7,8 kg por azar si la fábrica dijera la verdad.</p>
        ${lab(0)}
        ${note('Conclusión con contexto: no alcanza “se rechaza H₀”. Escribí qué significa: “con un nivel de significancia de 0,01 hay evidencia de que la resistencia media difiere de 8 kg”. Y si no se rechaza: “no hay evidencia suficiente para afirmar…” (no se “prueba” H₀).', 'exam')}`,
      labs: [
        { type: 'htest', title: 'Test para μ', intro: 'Arranca con el sedal de la clase. Cargá los datos de cualquier ejercicio del TP 6: elegí la Ha y si σ es conocido.', mu0: 8, xbar: 7.8, s: 0.5, n: 50, alpha: 0.01, tail: 'two', known: true },
      ],
      exercises: [
        { title: 'Vida de los focos', official: '6.1', level: 1, prompt: '<p>Focos con vida ≈ normal y σ = 40 h. Una muestra de 30 da x̄ = 780 h. Probar H₀: μ = 800 contra Ha: μ &lt; 800 con α = 0,04.</p>', solution: { explain: ex1.html } },
        { title: 'Vida promedio mayor que 70 años', official: '6.2', level: 1, prompt: '<p>Muestra de 100 personas: vida promedio 71,8 años; σ = 8,9 años. ¿Indica que la vida promedio hoy es mayor que 70 años? α = 0,05.</p>', solution: { explain: ex2.html } },
        { title: 'Refrescos de 22,2 dl', official: '6.3', level: 1, prompt: '<p>Muestra de 36 refrescos: x̄ = 21,9 dl; σ = 1,42 dl. Probar H₀: μ = 22,2 contra Ha: μ &lt; 22,2 con α = 0,05.</p>', solution: { explain: ex3.html } },
        { title: 'Llantas de 35.000 km (σ desconocido)', official: '6.4', level: 2, prompt: '<p>Muestra de 16 llantas: x̄ = 34.000 km, s = 2.000 km. ¿Hay razón para creer que μ &lt; 35.000? α = 0,025.</p>', solution: { explain: `${ex4.html}<p>σ es desconocido y n = 16 es chico: se usa t con 15 g.l. (suponiendo vida aproximadamente normal). Con z (−2 &lt; −1,96) se habría rechazado: elegir mal la distribución cambia la decisión.</p>` } },
        { title: 'Consumo de un aparato', official: '6.5', level: 1, prompt: '<p>Se publicó un consumo medio de 46 kWh al año. 12 hogares dan x̄ = 42; σ = 11,9 (poblacional). ¿Sugiere, con α = 0,05, que consumen menos de 46?</p>', solution: { explain: ex5.html } },
        { title: 'Tiempo de examen', official: '6.6', level: 1, prompt: '<p>Tiempo normal con media 35 min. 20 estudiantes dan x̄ = 33,1; σ = 4,3 (poblacional). Probar al 10 % que μ = 35 contra μ &lt; 35.</p>', solution: { explain: ex6.html } },
      ],
      quiz: [
        { q: 'Se rechaza H₀ cuando…', o: ['P > α', 'P < α', 'P = 0,5', 'el estadístico es positivo'], a: 1, e: 'El resultado es demasiado raro bajo H₀.' },
        { q: 'En un test de dos colas, el valor P es…', o: ['P(Z > |z|)', '2·P(Z > |z|)', 'P(Z < z)', '1 − α'], a: 1, e: 'Se suman las dos colas.' },
        { q: 'Con σ desconocido y n = 16, el estadístico es…', o: ['z', 't con 15 g.l.', 't con 16 g.l.', 'χ²'], a: 1, e: 'ν = n − 1.' },
        { q: 'TP 6, ej. 2: z = 2,02 con crítico 1,645 (cola derecha). Entonces…', o: ['no se rechaza H₀', 'se rechaza H₀', 'hay que cambiar α', 'el test no sirve'], a: 1, e: '2,02 > 1,645 y P = 0,0217 < 0,05.' },
        { q: '“No se rechaza H₀” significa…', o: ['que H₀ está probada', 'que no hay evidencia suficiente contra H₀', 'que Ha es verdadera', 'que hubo un error de cálculo'], a: 1, e: 'Solo falta evidencia.' },
        { q: 'El valor P es la probabilidad de…', o: ['que H₀ sea cierta', 'observar un resultado tan extremo como el obtenido si H₀ es cierta', 'cometer error tipo II', 'que μ = x̄'], a: 1, e: 'Un “medidor de rareza”.' },
      ],
      open: [
        { t: 'num', q: 'TP 6, ej. 1: calculá el estadístico z (x̄ = 780, μ₀ = 800, σ = 40, n = 30).', a: ex1.T.stat, tol: 0.005, e: `z = −20/(40/√30) = −20/7,303 = ${n3(ex1.T.stat)}.` },
        { t: 'num', q: 'TP 6, ej. 2: valor P del test (z = 2,02, cola derecha).', a: 1 - S.phiT(2.02), tol: 0.02, e: '1 − Φ(2,02) = 1 − 0,9783 = 0,0217.' },
        { t: 'num', q: 'TP 6, ej. 3: estadístico z (x̄ = 21,9, μ₀ = 22,2, σ = 1,42, n = 36).', a: ex3.T.stat, tol: 0.005, e: `z = −0,3/0,2367 = ${n3(ex3.T.stat)}.` },
        { t: 'num', q: 'TP 6, ej. 4: estadístico t (x̄ = 34.000, μ₀ = 35.000, s = 2.000, n = 16).', a: -2, e: 't = −1000/(2000/4) = −2.' },
        { t: 'text', q: 'TP 6, ej. 6: ¿qué decidís y por qué? (z ≈ −1,98, α = 0,10, cola izquierda)', k: [['rechaza'], ['menor', 'menos de 35', '< 35'], ['crítico', '−1,28', '-1,28', 'p <', 'valor p', 'región']], need: 2, e: 'Se <b>rechaza</b> H₀: z = −1,98 cae en la <b>región</b> de rechazo (z &lt; −1,28) y el valor P ≈ 0,024 &lt; 0,10. El tiempo medio para el examen es <b>menor</b> que 35 minutos.' },
      ],
      sources: [
        { title: 'Clase 10', ref: 'Prof. Teri', points: ['Sedal (dos colas, α = 0,01): z = −2,83, P = 0,0046, se rechaza. Vida media (cola derecha, α = 0,05): z = 2,02, P = 0,0217, se rechaza.', 'El valor P como “medidor de rareza”: si P < α se rechaza H₀.'] },
      ],
    },
    {
      id: 'errores-tipo',
      module: 'u10',
      title: 'Errores de tipo I y tipo II',
      keywords: 'error tipo I falso positivo α error tipo II falso negativo β potencia 1 − β nivel de confianza tamaño de muestra consecuencias decisión ética',
      tldr: 'Al decidir con una muestra se puede errar de dos formas. <mark>Error tipo I</mark>: rechazar H₀ siendo verdadera (falso positivo); su probabilidad es <strong>α</strong>. <mark>Error tipo II</mark>: no rechazar H₀ siendo falsa (falso negativo); su probabilidad es <strong>β</strong>. La <strong>potencia</strong> 1 − β es detectar lo que hay. Bajar α sube β; <strong>aumentar n baja los dos</strong>.',
      goals: ['Definir los errores de tipo I y II con un ejemplo.', 'Relacionar α, β, potencia y tamaño de muestra.', 'Discutir qué error es más grave según el contexto.'],
      body: `
        <h2>La tabla de decisiones</h2>
        ${table(['Decisión \\ Realidad', 'H₀ verdadera', 'H₀ falsa'], [['No rechazo H₀', 'acierto (1 − α, nivel de confianza)', '<strong>error tipo II</strong> (β)'], ['Rechazo H₀', '<strong>error tipo I</strong> (α, nivel de significación)', 'acierto (1 − β, potencia)']])}
        <h3>El perro del aeropuerto (clase)</h3>
        <p>H₀: no hay droga en la valija; Ha: hay droga. <strong>Tipo I</strong>: el perro marca la valija, se revisa y no había nada (falso positivo). <strong>Tipo II</strong>: la valija tenía droga y el perro no la detectó (falso negativo).</p>
        <h3>Placas con plomo (clase)</h3>
        <p>H₀: la placa no tiene niveles peligrosos (es segura); Ha: sí los tiene. Tipo I: se descarta como tóxica una placa limpia (pérdida de material). Tipo II: una placa contaminada sigue en la línea (riesgo sanitario y ambiental).</p>
        ${lab(0)}
        <h2>Relaciones</h2>
        <ul>
          <li>α lo fija quien hace el test: α = 0,05 es 5 % de probabilidad de equivocarse al rechazar H₀.</li>
          <li>α y β están relacionados: disminuir uno, con n fijo, aumenta el otro.</li>
          <li>Aumentar el tamaño de la muestra <strong>reduce α y β a la vez</strong> (las campanas se angostan).</li>
          <li>Cuanto más lejos está la verdadera μ de μ₀, menor β (más fácil detectar la diferencia).</li>
        </ul>
        ${note('“Minimizar el error no es un problema matemático: es una decisión ética y estratégica” (clase 10). En los medicamentos, un tipo II (declarar iguales dos drogas distintas) puede poner en riesgo vidas; ahí conviene una α más alta para ganar potencia, o más pacientes.', 'exam')}`,
      labs: [
        { type: 'errors', title: 'α, β y potencia', intro: 'Test de cola derecha con μ₀ = 50 y σ = 10. Bajá α y mirá crecer β; subí n y mirá cómo bajan los dos.', alpha: 0.05, n: 25, d: 3 },
      ],
      exercises: [
        { title: '¿Qué error es más grave?', official: '6.7', level: 2, prompt: '<p>a) ¿Cuál es más grave, un error de tipo I o de tipo II? b) ¿Por qué hay que tener en cuenta la probabilidad de cometer cada uno?</p>',
          solution: { explain: '<p>a) <strong>Depende del contexto</strong>: de las consecuencias de cada error. En el ejemplo de los medicamentos (H₀: igual eficacia), el tipo I (declararlos distintos cuando son iguales) no daña al paciente, pero el tipo II (declararlos iguales cuando uno es peor) puede poner en riesgo vidas: ahí es más grave el II. En un juicio (H₀: inocente), el tipo I (condenar a un inocente) suele considerarse el más grave.</p><p>b) Porque toda decisión con una muestra tiene riesgo de error: hay que fijar α según el costo de un falso positivo y elegir n para que β (el costo de un falso negativo) sea aceptable. Conocer ambas probabilidades permite diseñar el test de forma responsable.</p>' } },
        { title: 'La panadería multada', official: '6.8', level: 3, prompt: '<p>Una panadería pagó una multa por vender hogazas de menos de 24 onzas. Se compara H₀: μ = 24 contra Ha: μ &lt; 24, con n = 1861 y σ = 1 onza. a) Describir los errores de tipo I y II y sus consecuencias. b) ¿Se rechaza H₀ con α = 0,01 si x̄ = 23,75? c) ¿Es razonable α = 0,01? ¿Cambia la decisión con α = 0,001? d) ¿Es aconsejable comprar en esta panadería?</p>',
          solution: { explain: `<p>a) <strong>Tipo I</strong>: concluir que las hogazas pesan menos de 24 onzas cuando en realidad cumplen: la panadería paga una multa injusta. <strong>Tipo II</strong>: concluir que cumplen cuando pesan menos: los consumidores siguen pagando por pan que no reciben.</p>
            <p>b) z = (23,75 − 24)/(1/√1861) = −0,25/${n4(pan.se)} = <strong>${num(pan.stat, 2)}</strong>. Crítico −2,33 (α = 0,01). z cae muy lejos en la región de rechazo; P ≈ 0. <strong>Se rechaza H₀</strong> y se acepta Ha: el peso medio es menor que 24 onzas.</p>
            <p>c) Sí, α = 0,01 es razonable: el tipo I implica multar a un comercio, así que conviene que sea poco probable. Con α = 0,001 el crítico es −3,09 y z = ${num(pan.stat, 1)} sigue en la región de rechazo: <strong>la decisión no cambia</strong>. Con n = 1861 la evidencia es abrumadora.</p>
            <p>d) No es aconsejable: la evidencia indica que se vende pan con menos peso del establecido (en promedio, un cuarto de onza menos).</p>` } },
      ],
      quiz: [
        { q: 'Error tipo I es…', o: ['no rechazar H₀ falsa', 'rechazar H₀ verdadera', 'rechazar H₀ falsa', 'aceptar Ha verdadera'], a: 1, e: 'Falso positivo; probabilidad α.' },
        { q: 'Error tipo II es…', o: ['rechazar H₀ verdadera', 'no rechazar H₀ falsa', 'no rechazar H₀ verdadera', 'calcular mal z'], a: 1, e: 'Falso negativo; probabilidad β.' },
        { q: 'La potencia de un test es…', o: ['α', 'β', '1 − β', '1 − α'], a: 2, e: 'Probabilidad de rechazar H₀ cuando es falsa.' },
        { q: 'Con n fijo, si se baja α…', o: ['baja β', 'sube β', 'β no cambia', 'sube la potencia'], a: 1, e: 'Es más difícil rechazar.' },
        { q: 'Para bajar α y β a la vez hay que…', o: ['aumentar n', 'bajar n', 'usar dos colas', 'cambiar H₀'], a: 0, e: 'Las campanas se angostan.' },
        { q: 'El perro marca una valija sin droga (H₀: no hay droga). Es un error…', o: ['tipo I', 'tipo II', 'de muestreo', 'no es un error'], a: 0, e: 'Se rechazó H₀ siendo verdadera.' },
      ],
      open: [
        { t: 'num', q: 'TP 6, ej. 8 b): estadístico z de la panadería (x̄ = 23,75, μ₀ = 24, σ = 1, n = 1861).', a: pan.stat, tol: 0.005, e: `z = −0,25·√1861 = ${num(pan.stat, 2)}.` },
        { t: 'text', q: 'Definí los errores de tipo I y tipo II y decí cómo se llaman sus probabilidades.', k: [['rechazar', 'rechazo'], ['verdadera', 'cierta'], ['no rechazar', 'aceptar', 'acepto'], ['falsa'], ['α', 'alfa'], ['β', 'beta']], need: 5, e: 'Tipo I: <b>rechazar</b> H₀ cuando es <b>verdadera</b>; su probabilidad es <b>α</b> (nivel de significación). Tipo II: <b>no rechazar</b> (aceptar) H₀ cuando es <b>falsa</b>; su probabilidad es <b>β</b>.' },
        { t: 'text', q: '¿Qué efecto tiene aumentar el tamaño de la muestra sobre los errores de tipo I y II?', k: [['reduce', 'disminuye', 'baja'], ['ambos', 'los dos', 'α y β', 'simultánea']], e: 'Aumentar n <b>reduce</b> α y β de forma <b>simultánea</b>: la distribución de x̄ se angosta y las campanas bajo H₀ y bajo Ha se superponen menos.' },
      ],
      sources: [
        { title: 'Clase 10: Tipos de errores', ref: 'Prof. Teri', points: ['Tipo I (falso positivo, α) y tipo II (falso negativo, β), con el programa “Alerta Aeropuerto” y las placas con plomo.', 'Tabla de decisiones con 1 − α (nivel de confianza) y 1 − β (potencia). Aumentar n reduce α y β a la vez.', 'Medicamentos: el error tipo II puede poner en riesgo vidas.'] },
      ],
    },
  );
})();
