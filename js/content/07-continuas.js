/* Tema 7 (2do parcial): variables aleatorias continuas, densidad, acumulada, esperanza y varianza. Clase 7 y TP 4, ejercicios 1 a 9. */
(() => {
  const { LESSONS, h, labUtil } = window.GUIDE;
  const { note, def, table, eq, frac, lab, num, area, fig, plot } = h;
  const n4 = (v) => num(v, 4);
  // Gráfico de F(x) por tramos: segs = [[x0, x1, F]] y rango
  const cdfPlot = (F, x, cap) => fig(plot({ x, y: [0, 1.12], w: 440, h: 190, xl: 'x', yl: 'F(x)', anim: false, ticks: { x: labUtil.niceTicks(x, 6), y: [0.5, 1] }, curves: [{ f: F, n: 240, cls: 'c-sig' }] }), cap);

  LESSONS.push(
    {
      id: 'densidad',
      module: 'u7',
      title: 'Función de densidad: probabilidad como área',
      keywords: 'variable aleatoria continua función de densidad de probabilidad fdp f(x) ≥ 0 integral igual a 1 área bajo la curva P(X = a) = 0 constante k',
      tldr: 'En una variable <strong>continua</strong> la probabilidad no está en los puntos sino en los intervalos: es el <mark>área bajo la función de densidad</mark>. f(x) es una densidad si <mark>f(x) ≥ 0 y ∫ f(x) dx = 1</mark>, y P(a &lt; X &lt; b) = ∫ₐᵇ f(x) dx. Como bajo un punto no hay área, <strong>P(X = a) = 0</strong> y da lo mismo &lt; que ≤.',
      goals: ['Verificar si una función es densidad y hallar una constante k.', 'Calcular probabilidades integrando la densidad.', 'Explicar por qué P(X = a) = 0.'],
      body: `
        <h2>De barras a áreas</h2>
        <p>Una variable continua toma cualquier valor de un intervalo real (tiempos, pesos, errores de medición). Ya no se puede asignar probabilidad a cada valor: hay infinitos. En su lugar se usa una curva, la <strong>función de densidad</strong>, y la probabilidad es el área debajo.</p>
        ${def('Función de densidad de probabilidad (fdp)', 'f(x) es una distribución de probabilidad continua si a) f(x) ≥ 0 para todo x y b) ∫ f(x) dx = 1 sobre toda la recta: el área debajo de la fdp es 1.', 'Clase 7')}
        ${eq('P(a &lt; X &lt; b) = ∫ₐᵇ f(x) dx', 'Probabilidad = área')}
        ${h.flow('Área total bajo la curva = 1.', 'Probabilidad = área entre a y b.', 'P(X = a) = 0: bajo un punto no hay área.')}
        ${eq('P(a &lt; X &lt; b) = P(a ≤ X &lt; b) = P(a &lt; X ≤ b) = P(a ≤ X ≤ b)', 'Consecuencia')}
        ${note('f(x) <b>no</b> es una probabilidad: puede valer más que 1 (en el TP 4, ej. 1, f(1) = 1,5). Lo que no puede superar 1 es el área.', 'warn')}
        <h3>Ejemplo de la clase: error de predicción de una IA</h3>
        <p>f(x) = x²/3 en −1 &lt; x &lt; 2. Es ≥ 0 y ∫₋₁² x²/3 dx = x³/9 |₋₁² = 8/9 + 1/9 = 1: es una densidad. P(0 &lt; X ≤ 1) = x³/9 |₀¹ = <strong>1/9 = 0,111</strong>.</p>
        ${fig(area({ x: [-1.4, 2.4], ymax: 1.5, f: (x) => (x > -1 && x < 2 ? (x * x) / 3 : 0), shade: [[0, 1]], anim: false, dom: [-1.4, 2.4] }), 'Área sombreada: P(0 < X ≤ 1) = 1/9.')}
        <h3>Hallar una constante</h3>
        <p>Si la densidad tiene una constante (c·x² en 0 &lt; x &lt; 3), se despeja de ∫ f = 1: c·x³/3 |₀³ = 9c = 1 → c = 1/9. Luego P(1 &lt; X &lt; 2) = (8 − 1)/27 = <strong>7/27 = 0,26</strong>.</p>
        ${lab(0)}`,
      labs: [
        { type: 'density', title: 'Área bajo la densidad', intro: 'Elegí una densidad de los TP o de la clase y mové a y b: el área sombreada es la probabilidad. El primer indicador verifica que el área total sea 1.', fn: 'tp41' },
      ],
      exercises: [
        { title: 'Hallar k para kx² en [−1; 1]', official: '4.1', level: 2, prompt: '<p>f(x) = kx² si −1 ≤ x ≤ 1, 0 en otro caso. a) Hallar k. b) Hallar F(x). c) Graficar f y F. d) Calcular P(X ≤ 1/2) y P(−1/2 ≤ X ≤ 1/2).</p>',
          solution: { explain: `<p>a) ∫₋₁¹ kx² dx = k·x³/3 |₋₁¹ = k·2/3 = 1 → <strong>k = 3/2</strong>.</p>
            <p>b) F(x) = ∫₋₁ˣ (3/2)u² du = u³/2 |₋₁ˣ = <strong>(x³ + 1)/2</strong> para −1 ≤ x ≤ 1; 0 antes y 1 después.</p>
            ${fig(area({ x: [-1.5, 1.5], ymax: 1.8, f: (x) => (Math.abs(x) <= 1 ? 1.5 * x * x : 0), shade: [[-0.5, 0.5]], anim: false }), 'c) f(x) = (3/2)x²: simétrica, con más masa cerca de los extremos.')}
            ${cdfPlot((x) => (x < -1 ? 0 : x > 1 ? 1 : (x ** 3 + 1) / 2), [-1.5, 1.5], 'c) F(x) = (x³ + 1)/2: sube de 0 a 1 y pasa por 1/2 en x = 0.')}
            <p>d) P(X ≤ 1/2) = F(1/2) = (1/8 + 1)/2 = <strong>9/16 = 0,5625</strong>. P(−1/2 ≤ X ≤ 1/2) = F(1/2) − F(−1/2) = 9/16 − 7/16 = <strong>1/8 = 0,125</strong>.</p>` } },
        { title: 'f(x) = 6x(1 − x)', official: '4.2', level: 2, prompt: '<p>f(x) = 6x(1 − x) si 0 &lt; x &lt; 1. a) Verificar que es fdp y graficarla. b) Obtener F(x). c) Calcular P(X &lt; 1/2 | 1/3 &lt; X &lt; 2/3).</p>',
          solution: { explain: `<p>a) f ≥ 0 en (0, 1) y ∫₀¹ (6x − 6x²) dx = 3x² − 2x³ |₀¹ = 1. ✓</p>${fig(area({ x: [-0.2, 1.2], ymax: 1.8, f: (x) => (x > 0 && x < 1 ? 6 * x * (1 - x) : 0), shade: [[1 / 3, 0.5]], anim: false }), 'Parábola con máximo 1,5 en x = 1/2.')}
            <p>b) <strong>F(x) = 3x² − 2x³</strong> en [0, 1].</p>
            <p>c) P(X &lt; 1/2 | 1/3 &lt; X &lt; 2/3) = P(1/3 &lt; X &lt; 1/2)/P(1/3 &lt; X &lt; 2/3). F(1/3) = 7/27, F(1/2) = 1/2, F(2/3) = 20/27. Numerador: 1/2 − 7/27 = 13/54; denominador: 13/27. Resultado: <strong>1/2</strong> (tiene sentido: la densidad es simétrica respecto de 1/2).</p>` } },
        { title: 'k/√x en [0; 4]', official: '4.3', level: 2, prompt: '<p>f(x) = k/√x si 0 &lt; x ≤ 4. a) Hallar k. b) F(x). c) P(X &gt; 1).</p>',
          solution: { explain: '<p>a) ∫₀⁴ k·x^(−1/2) dx = 2k√x |₀⁴ = 4k = 1 → <strong>k = 1/4</strong>.</p><p>b) F(x) = ∫₀ˣ du/(4√u) = <strong>√x/2</strong> en [0, 4].</p><p>c) P(X &gt; 1) = 1 − F(1) = 1 − 1/2 = <strong>0,5</strong>. (La densidad se hace infinita en 0 pero el área es finita.)</p>' } },
      ],
      quiz: [
        { q: 'En una variable continua, P(X = a) vale…', o: ['f(a)', '0', 'F(a)', '1'], a: 1, e: 'No hay área bajo un punto.' },
        { q: 'Para que f sea una densidad hace falta…', o: ['f(x) ≤ 1', 'f(x) ≥ 0 y área total 1', 'f creciente', 'f continua'], a: 1, e: 'Las dos condiciones.' },
        { q: 'P(a < X < b) en una continua es…', o: ['f(b) − f(a)', 'el área bajo f entre a y b', 'f(a)·f(b)', '(b − a)·f(a)'], a: 1, e: '∫ₐᵇ f(x) dx.' },
        { q: 'f(x) = kx² en [−1; 1]. k =', o: ['1/2', '3/2', '2/3', '3'], a: 1, e: 'k·2/3 = 1.' },
        { q: '¿Puede una densidad valer 1,5 en algún punto?', o: ['no, nunca', 'sí, lo que vale 1 es el área', 'solo si es discreta', 'solo en x = 0'], a: 1, e: 'f no es probabilidad.' },
        { q: 'En una continua, P(a ≤ X ≤ b) comparada con P(a < X < b) es…', o: ['mayor', 'menor', 'igual', 'depende'], a: 2, e: 'Los extremos no aportan.' },
      ],
      open: [
        { t: 'num', q: 'TP 4, ej. 1 d): con f(x) = (3/2)x² en [−1; 1], calculá P(X ≤ 1/2).', a: 9 / 16, e: 'F(1/2) = (1/8 + 1)/2 = 9/16 = 0,5625.' },
        { t: 'num', q: 'TP 4, ej. 3: hallá k para f(x) = k/√x en (0; 4].', a: 0.25, e: '4k = 1 → k = 1/4.' },
        { t: 'num', q: 'Clase: f(x) = x²/9 en (0; 3). Calculá P(1 < X < 2).', a: 7 / 27, e: '(8 − 1)/27 = 0,2593.' },
        { t: 'text', q: '¿Por qué en una variable aleatoria continua la probabilidad de un valor puntual es cero?', k: [['área'], ['punto', 'ancho cero', 'un solo valor'], ['integral']], need: 2, e: 'Porque la probabilidad es el <b>área</b> bajo la densidad (una <b>integral</b>), y bajo un <b>punto</b> (ancho cero) no hay área: ∫ₐᵃ f(x) dx = 0.' },
      ],
      sources: [
        { title: 'Clase 7: Distribuciones de probabilidad continuas', ref: 'Prof. Teri', points: ['Condiciones de la fdp, P(a < X < b) como integral, P(a) = 0 e igualdad de < y ≤.', 'Ejercicios resueltos: error de una IA (x²/3), residuos electrónicos, metales preciosos (c = 1/9).'] },
      ],
    },
    {
      id: 'acumulada-continua',
      module: 'u7',
      title: 'Función acumulada de una continua',
      keywords: 'función de distribución acumulada F(x) integral de la densidad derivar F para obtener f P(a ≤ X ≤ b) = F(b) − F(a) uniforme por tramos',
      tldr: 'La acumulada de una continua es <mark>F(x) = P(X ≤ x) = ∫₋∞ˣ f(u) du</mark>: el área a la izquierda de x. Es continua, creciente, va de 0 a 1. Se calcula <strong>integrando</strong> f y, al revés, <mark>f(x) = F′(x)</mark> (se <strong>deriva</strong>). Con ella: P(a ≤ X ≤ b) = F(b) − F(a) y P(X &gt; a) = 1 − F(a).',
      goals: ['Obtener F integrando f, por tramos.', 'Obtener f derivando F.', 'Calcular probabilidades con F.'],
      body: `
        <h2>Definición y propiedades</h2>
        ${eq('F(x) = P(X ≤ x) = ∫₋∞ˣ f(u) du', 'Acumulada')}
        <ul>
          <li>0 ≤ F(x) ≤ 1; F = 0 a la izquierda del soporte y F = 1 a la derecha.</li>
          <li>P(a ≤ X ≤ b) = F(b) − F(a); P(X &gt; a) = 1 − F(a).</li>
          <li><strong>f(x) = dF(x)/dx</strong>: si te dan F, derivás para obtener f.</li>
        </ul>
        <h3>Cómo armarla por tramos</h3>
        <p>Ejemplo de la clase: f(x) = x²/3 en (−1, 2). Para −1 &lt; x &lt; 2: F(x) = ∫₋₁ˣ u²/3 du = (x³ + 1)/9. Completa:</p>
        ${eq('F(x) = 0 si x ≤ −1 &nbsp;·&nbsp; (x³ + 1)/9 si −1 &lt; x &lt; 2 &nbsp;·&nbsp; 1 si x ≥ 2', 'Por tramos')}
        <p>Entonces P(0 ≤ X &lt; 1) = F(1) − F(0) = 2/9 − 1/9 = 1/9, el mismo resultado que integrando directo.</p>
        ${note('Al escribir F por tramos, verificá que los tramos “empalmen”: F tiene que ser continua (en el borde izquierdo del soporte vale 0 y en el derecho, 1). Si no empalma, hay un error de integración.', 'tip')}
        <p>Otro de la clase: f(x) = 1/8 + 3x/8 en [0, 2] → F(x) = x/8 + 3x²/16, y F(2) = 2/8 + 12/16 = 1 ✓.</p>
        ${lab(0)}`,
      labs: [
        { type: 'density', title: 'f y F juntas', intro: 'Arriba la densidad con el área entre a y b; abajo la acumulada. La diferencia de alturas F(b) − F(a) es exactamente esa área.', fn: 'c5' },
      ],
      exercises: [
        { title: 'F(x) = x en (0; 1)', official: '4.4', level: 1, prompt: '<p>F(x) = 0 si x ≤ 0; x si 0 &lt; x &lt; 1; 1 si x ≥ 1. a) Graficar F y f. b) P(X &lt; 1), P(X = 0,5), P(0,5 ≤ X ≤ 1), P(X &gt; 0,5).</p>',
          solution: { explain: `<p>f(x) = F′(x) = <strong>1</strong> en (0, 1) y 0 fuera: es la <strong>uniforme</strong> en (0, 1).</p>${fig(area({ x: [-0.4, 1.4], ymax: 1.4, f: (x) => (x > 0 && x < 1 ? 1 : 0), shade: [[0.5, 1]], anim: false }), 'f(x) = 1: un rectángulo de área 1.')}
            <p>P(X &lt; 1) = F(1) = <strong>1</strong>; P(X = 0,5) = <strong>0</strong>; P(0,5 ≤ X ≤ 1) = 1 − 0,5 = <strong>0,5</strong>; P(X &gt; 0,5) = 1 − F(0,5) = <strong>0,5</strong>.</p>` } },
        { title: 'F(x) = x/4 + 1/2 en [−2; 2]', official: '4.5', level: 1, prompt: '<p>F(x) = 0 si x ≤ −2; x/4 + 1/2 si −2 ≤ x ≤ 2; 1 si x ≥ 2. a) Hallar f. b) Graficar F y f. c) Probabilidad de que X sea: menor que 1; mayor que 3; entre 1,5 y 2; menor que 2.</p>',
          solution: { explain: `<p>a) f(x) = F′(x) = <strong>1/4</strong> en [−2, 2]: uniforme.</p>${cdfPlot((x) => (x < -2 ? 0 : x > 2 ? 1 : x / 4 + 0.5), [-3, 3], 'b) F es una recta de 0 a 1 entre −2 y 2.')}
            <p>c.1) P(X &lt; 1) = F(1) = 1/4 + 1/2 = <strong>0,75</strong>. c.2) P(X &gt; 3) = 1 − F(3) = <strong>0</strong>. c.3) P(1,5 &lt; X &lt; 2) = F(2) − F(1,5) = 1 − 0,875 = <strong>0,125</strong> (con f: 0,5·1/4). c.4) P(X &lt; 2) = <strong>1</strong>.</p>` } },
        { title: 'F por tramos con dos pendientes', official: '4.6', level: 2, prompt: '<p>F(x) = 0 si x &lt; 0; x/2 si 0 ≤ x &lt; 1; x − 1/2 si 1 ≤ x &lt; 1,5; 1 si x ≥ 1,5. a) Graficar F y f. b) P(0,4 &lt; X ≤ 1,3) y P(X &gt; 0,5).</p>',
          solution: { explain: `<p>f(x) = F′(x) = <strong>1/2</strong> en [0, 1) y <strong>1</strong> en [1; 1,5). Área: 1·1/2 + 0,5·1 = 1 ✓. F empalma: x/2 = 1/2 y x − 1/2 = 1/2 en x = 1.</p>${fig(area({ x: [-0.3, 1.8], ymax: 1.3, f: (x) => (x >= 0 && x < 1 ? 0.5 : x >= 1 && x < 1.5 ? 1 : 0), shade: [[0.4, 1.3]], anim: false }), 'f en dos escalones. Sombreado: P(0,4 < X ≤ 1,3).')}
            <p>P(0,4 &lt; X ≤ 1,3) = F(1,3) − F(0,4) = 0,8 − 0,2 = <strong>0,6</strong>. P(X &gt; 0,5) = 1 − F(0,5) = 1 − 0,25 = <strong>0,75</strong>.</p>` } },
        { title: 'F lineal en [−2; 2]', official: '4.7', level: 1, prompt: '<p>F(x) = 0 si x ≤ −2; (x + 2)/4 si −2 &lt; x &lt; 2; 1 si x ≥ 2. a) Hallar f. b) P(X = −2), P(0 ≤ X ≤ 2), P(−2 &lt; X &lt; 1).</p>',
          solution: { explain: '<p>(El tramo central se lee (x + 2)/4, la única forma que empalma con 0 en −2 y con 1 en 2; es la misma variable del ej. 5.)</p><p>a) f(x) = <strong>1/4</strong> en (−2, 2).</p><p>b) P(X = −2) = <strong>0</strong> (continua). P(0 ≤ X ≤ 2) = F(2) − F(0) = 1 − 1/2 = <strong>0,5</strong>. P(−2 &lt; X &lt; 1) = F(1) − F(−2) = 3/4 − 0 = <strong>0,75</strong>.</p>' } },
        { title: 'Duración de un dispositivo', official: '4.8', level: 3, prompt: '<p>f(x) = 100/x² para x &gt; 100 (horas). A = “dura menos de 200 h”, B = “dura más de 150 h”. a) P(A) y P(B). b) P(A | B). c) ¿A y B son independientes?</p>',
          solution: { explain: `<p>F(x) = ∫₁₀₀ˣ 100/u² du = −100/u |₁₀₀ˣ = <strong>1 − 100/x</strong> para x &gt; 100.</p>
            <p>a) P(A) = F(200) = 1 − 1/2 = <strong>0,5</strong>. P(B) = 1 − F(150) = 100/150 = <strong>2/3 ≈ 0,6667</strong>.</p>
            <p>b) A ∩ B = 150 &lt; X &lt; 200: P = F(200) − F(150) = 0,5 − 1/3 = 1/6. P(A | B) = (1/6)/(2/3) = <strong>1/4 = 0,25</strong>.</p>
            <p>c) P(A)·P(B) = 0,5·2/3 = 1/3 ≠ 1/6 = P(A ∩ B) → <strong>dependientes</strong> (también P(A | B) = 0,25 ≠ P(A) = 0,5).</p>` } },
      ],
      quiz: [
        { q: 'Si te dan F(x) de una continua, f(x) se obtiene…', o: ['integrando F', 'derivando F', 'restando F(x) − F(x − 1)', 'f = 1 − F'], a: 1, e: 'f = F′.' },
        { q: 'P(a ≤ X ≤ b) con F es…', o: ['F(b) − F(a)', 'F(b) − F(a − 1)', 'F(a)·F(b)', 'F(b) + F(a)'], a: 0, e: 'En continuas no hace falta el −1.' },
        { q: 'F(x) = x en (0; 1). ¿Qué distribución es?', o: ['exponencial', 'uniforme en (0; 1)', 'normal', 'Poisson'], a: 1, e: 'f = 1 en (0, 1).' },
        { q: 'TP 4, ej. 8: F(x) = 1 − 100/x. P(X < 200) =', o: ['0,5', '0,25', '2/3', '1/6'], a: 0, e: '1 − 100/200.' },
        { q: 'La acumulada de una continua es…', o: ['escalonada', 'continua y creciente', 'decreciente', 'igual a la densidad'], a: 1, e: 'Sin saltos.' },
        { q: 'Si F(1) = 0,8 y F(0,4) = 0,2, P(0,4 < X ≤ 1) =', o: ['1', '0,6', '0,16', '0,4'], a: 1, e: '0,8 − 0,2.' },
      ],
      open: [
        { t: 'num', q: 'TP 4, ej. 6 b): calculá P(0,4 < X ≤ 1,3).', a: 0.6, e: 'F(1,3) − F(0,4) = (1,3 − 0,5) − 0,4/2 = 0,8 − 0,2 = 0,6.' },
        { t: 'num', q: 'TP 4, ej. 8 b): calculá P(A | B) (dura menos de 200 h sabiendo que dura más de 150 h).', a: 0.25, e: '(1/6)/(2/3) = 1/4.' },
        { t: 'num', q: 'TP 4, ej. 5 c.3): P(1,5 < X < 2) con F(x) = x/4 + 1/2.', a: 0.125, e: '1 − 0,875 = 0,125.' },
        { t: 'text', q: '¿Cómo se pasa de la densidad a la acumulada y de la acumulada a la densidad?', k: [['integr'], ['deriv']], e: 'De f a F se <b>integra</b>: F(x) = ∫₋∞ˣ f(u) du. De F a f se <b>deriva</b>: f(x) = F′(x).' },
      ],
      sources: [
        { title: 'Clase 7: Distribución acumulada', ref: 'Prof. Teri', points: ['F(x) = ∫ f(u) du; P(a ≤ X ≤ b) = F(b) − F(a); f = dF/dx.', 'Ejercicios 4 y 5: F(x) = (x³ + 1)/9 y F(x) = x/8 + 3x²/16.'] },
      ],
    },
    {
      id: 'esperanza-varianza-continua',
      module: 'u7',
      title: 'Esperanza, varianza y coeficiente de variación',
      keywords: 'esperanza continua E(X) = ∫ x f(x) dx varianza E(X²) desvío coeficiente de variación CV estabilidad del proceso',
      tldr: 'Igual que en las discretas, cambiando sumas por integrales: <mark>E(X) = ∫ x·f(x) dx</mark>, <mark>V(X) = E(X²) − [E(X)]²</mark> con E(X²) = ∫ x²·f(x) dx, y σ = √V(X). El <strong>coeficiente de variación CV = σ/μ</strong> mide la dispersión relativa: en la clase, un proceso se considera estable si CV &lt; 30 %.',
      goals: ['Calcular E(X), V(X) y σ de una densidad.', 'Calcular e interpretar el coeficiente de variación.'],
      body: `
        ${eq('E(X) = μ = ∫ x·f(x) dx &nbsp;&nbsp; E(X²) = ∫ x²·f(x) dx &nbsp;&nbsp; V(X) = E(X²) − [E(X)]² &nbsp;&nbsp; σ = √V(X)', 'Continuas')}
        <h2>Ejemplo de la clase: plomo recuperado</h2>
        <p>f(x) = (3/2)(1 − x²) en 0 ≤ x ≤ 1 (kg de plomo por lote).</p>
        <ul>
          <li>E(X) = (3/2)∫₀¹ (x − x³) dx = (3/2)(1/2 − 1/4) = <strong>3/8 = 0,375 kg</strong>.</li>
          <li>E(X²) = (3/2)∫₀¹ (x² − x⁴) dx = (3/2)(1/3 − 1/5) = <strong>1/5</strong>.</li>
          <li>V(X) = 1/5 − (3/8)² = <strong>19/320 = 0,0594 kg²</strong>; σ = <strong>0,2437 kg</strong>.</li>
          <li>CV = σ/μ = 0,2437/0,375 = <strong>65 %</strong>.</li>
        </ul>
        ${note('Interpretación de la clase: CV &lt; 30 % es un proceso estable. Un 65 % es variabilidad muy alta: un lote puede dar casi 1 kg y el siguiente casi nada; el ingeniero debe intervenir el reactor para bajar el CV.', 'exam')}
        ${lab(0)}
        ${note('Si la densidad es simétrica respecto de un punto, la esperanza es ese punto (sin integrar): por eso en el TP 4, ej. 9 E(X) = 0.', 'tip')}`,
      labs: [
        { type: 'density', title: 'E, V y CV de una densidad', intro: 'Elegí la densidad del plomo y comprobá E = 0,375 y CV ≈ 65 %. Probá otras: ¿cuál tiene menor CV?', fn: 'c6' },
      ],
      exercises: [
        { title: 'E, V y σ de (3/2)x²', official: '4.9', level: 2, prompt: '<p>f(x) = (3/2)x² si −1 ≤ x ≤ 1. Calcular la esperanza, la varianza y el desvío.</p>',
          solution: { explain: `<p>E(X) = ∫₋₁¹ (3/2)x³ dx = (3/8)x⁴ |₋₁¹ = <strong>0</strong> (integrando impar: la densidad es simétrica respecto de 0).</p><p>E(X²) = ∫₋₁¹ (3/2)x⁴ dx = (3/10)x⁵ |₋₁¹ = <strong>3/5</strong>.</p><p>V(X) = 3/5 − 0² = <strong>0,6</strong>; σ = √0,6 = <strong>${n4(Math.sqrt(0.6))}</strong>. (El CV no tiene sentido con μ = 0.)</p>` } },
        { title: 'Residuos electrónicos (clase)', level: 2, prompt: '<p>X = horas entre llegadas de dispositivos, f(x) = 0,15·e^(−0,15(x − 0,5)) para x ≥ 0,5. ¿Probabilidad de que pasen como mucho 5 horas?</p>',
          solution: { explain: `<p>P(X ≤ 5) = ∫₀,₅⁵ 0,15·e^(−0,15(x − 0,5)) dx = [−e^(−0,15(x − 0,5))]₀,₅⁵ = 1 − e^(−0,675) = <strong>${n4(1 - Math.exp(-0.675))}</strong>. Hay un 49 % de probabilidad de que pasen como máximo 5 horas (la clase escribe 49,5 % en el texto y 0,491 en la cuenta; el valor es 0,4908).</p>` } },
      ],
      quiz: [
        { q: 'E(X) de una continua es…', o: ['∫ f(x) dx', '∫ x·f(x) dx', 'Σ x·f(x)', 'F(μ)'], a: 1, e: 'Suma → integral.' },
        { q: 'Si f es simétrica respecto de 0, E(X) =', o: ['1', '0', 'V(X)', 'no existe'], a: 1, e: 'Las masas se compensan.' },
        { q: 'Plomo: μ = 0,375 y σ = 0,244. CV =', o: ['0,65 %', '65 %', '15 %', '1,54'], a: 1, e: '0,244/0,375.' },
        { q: 'Según la clase, un proceso es estable si CV es…', o: ['mayor que 50 %', 'menor que 30 %', 'igual a 1', 'negativo'], a: 1, e: 'Baja variabilidad relativa.' },
        { q: 'V(X) se calcula como…', o: ['E(X²) − [E(X)]²', '[E(X)]² − E(X²)', 'E(X)/σ', '∫ f(x)² dx'], a: 0, e: 'Igual que en discretas.' },
      ],
      open: [
        { t: 'num', q: 'TP 4, ej. 9: varianza de f(x) = (3/2)x² en [−1; 1].', a: 0.6, e: 'E(X) = 0 y E(X²) = 3/5 → V = 0,6.' },
        { t: 'num', q: 'Clase (plomo): f(x) = (3/2)(1 − x²) en [0; 1]. Calculá E(X).', a: 0.375, e: '(3/2)(1/2 − 1/4) = 3/8.' },
        { t: 'num', q: 'Clase (plomo): calculá V(X).', a: 19 / 320, e: '1/5 − 9/64 = 19/320 = 0,0594.' },
        { t: 'text', q: '¿Qué indica un coeficiente de variación del 65 % en un proceso industrial?', k: [['variabilidad', 'dispersión'], ['alta', 'muy alta', 'grande'], ['no confiable', 'inestable', 'no es estable', 'intervenir', '30']], need: 2, e: 'Que la <b>variabilidad</b> es muy <b>alta</b> respecto del promedio (el desvío es el 65 % de la media). El proceso <b>no es estable</b> ni confiable (la referencia es CV &lt; 30 %): hay que intervenir para bajarlo.' },
      ],
      sources: [
        { title: 'Clase 7: Esperanza y varianza', ref: 'Prof. Teri', points: ['E(X) = ∫ x f(x) dx, V(X) = E(X²) − [E(X)]².', 'Ejercicio 6 (plomo): E = 0,375 kg, V = 19/320, σ = 0,244 kg, CV = 65,1 %; criterio de estabilidad CV < 30 %.'] },
      ],
    },
  );
})();
