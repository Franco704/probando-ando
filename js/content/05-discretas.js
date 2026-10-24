/* Tema 5 (1er parcial): variables aleatorias discretas, función de probabilidad, acumulada, esperanza y varianza. Clase 5 (Prof. Teri) y TP 3, ejercicios 1 a 8. */
(() => {
  const { LESSONS, h, st: S } = window.GUIDE;
  const { note, def, table, eq, frac, lab, num, bars, steps, fig } = h;
  const n4 = (v) => num(v, 4);
  const fr = (a, b) => `${a}/${b}`;

  // TP 3, ej. 2: suma de dos dados
  const SUM = Array.from({ length: 11 }, (_, i) => { const x = i + 2; return [x, 6 - Math.abs(x - 7)]; });
  const Fsum = (x) => SUM.filter((r) => r[0] <= x).reduce((a, r) => a + r[1], 0);
  // TP 3, ej. 4 y 7: f(x) = x/15
  const X15 = [1, 2, 3, 4, 5].map((x) => [x, x / 15]), m15 = S.moments(X15);
  // TP 3, ej. 5 y 8: defectos por 10 m de tela
  const DEF = [[0, 0.41], [1, 0.37], [2, 0.16], [3, 0.05], [4, 0.01]], mDEF = S.moments(DEF);
  const Fdef = (x) => DEF.filter((r) => r[0] <= x).reduce((a, r) => a + r[1], 0);
  // Clase: llamadas por hora y dado
  const CALL = [[0, 0.1], [1, 0.2], [2, 0.4], [3, 0.2], [4, 0.1]], DIE = [1, 2, 3, 4, 5, 6].map((x) => [x, 1 / 6]);
  const mDIE = S.moments(DIE);
  const momTable = (pairs) => table(['x', 'f(x)', 'x·f(x)', 'x²·f(x)'], pairs.map(([x, p]) => [x, n4(p), n4(x * p), n4(x * x * p)]).concat([['<b>Σ</b>', n4(S.sum(pairs.map((q) => q[1]))), `<b>${n4(S.moments(pairs).E)}</b>`, `<b>${n4(S.moments(pairs).E2)}</b>`]]));

  LESSONS.push(
    {
      id: 'variable-aleatoria',
      module: 'u5',
      title: 'Variable aleatoria y función de probabilidad',
      keywords: 'variable aleatoria discreta continua rango RX función de probabilidad función de masa f(x) = P(X = x) condiciones suma igual a 1',
      tldr: 'Una <strong>variable aleatoria X</strong> es una función que asigna un número real a cada resultado del espacio muestral (por ejemplo, “número de caras”). Es <strong>discreta</strong> si toma valores aislados (enteros) y <strong>continua</strong> si toma valores en un intervalo real. La <mark>función de probabilidad f(x) = P(X = x)</mark> de una discreta cumple f(x) ≥ 0 y <mark>Σ f(x) = 1</mark>.',
      goals: ['Definir variable aleatoria y su rango R<sub>X</sub>.', 'Clasificar variables aleatorias en discretas y continuas.', 'Construir y validar una función de probabilidad.'],
      body: `
        <h2>De resultados a números</h2>
        ${def('Variable aleatoria', 'Es una función que asigna un número real a cada resultado del espacio muestral S de un experimento aleatorio.', 'Clase 5')}
        <p>Ejemplo: ε = “lanzar dos monedas”, X = número de caras. S = {(s,s), (c,s), (s,c), (c,c)} y X vale 0, 1, 1 y 2. El <strong>rango</strong> es R<sub>X</sub> = {0, 1, 2}: el conjunto de valores que puede tomar X.</p>
        <p>Otro de la clase: un banco con 3 cajeros; S son las 8 ternas de vacío/ocupado y X = “cajeros ocupados” tiene R<sub>X</sub> = {0, 1, 2, 3}.</p>
        ${table(['Tipo', 'Valores', 'Ejemplos'], [['<strong>Discreta</strong>', 'aislados, asociados a enteros (contar)', 'caras, defectos, clientes, accidentes'], ['<strong>Continua</strong>', 'cualquier real de un intervalo (medir)', 'tiempo, peso, distancia, duración']])}
        ${lab(0)}
        <h2>Función de probabilidad (función de masa)</h2>
        ${eq('f(x) = P(X = x) &nbsp;&nbsp; con &nbsp; a) f(xᵢ) ≥ 0 ∀ i &nbsp;&nbsp; b) Σ f(xᵢ) = 1', 'Condiciones')}
        <p>Dos monedas: f(0) = 1/4, f(1) = 2/4, f(2) = 1/4. Todas son positivas y suman 1: es una función de probabilidad válida. Se grafica con <strong>bastones o barras</strong> en cada valor.</p>
        ${fig(bars({ pts: [[0, 0.25], [1, 0.5], [2, 0.25]], yl: 'f(x)', xl: 'caras', labels: true, anim: false, bw: 0.18 }), 'X = número de caras en dos monedas.')}
        ${note('Para ver si una f(x) “puede ser” función de probabilidad, verificá las dos condiciones: ningún valor negativo y suma 1. Si te dan una constante c desconocida, se despeja de Σ f(x) = 1.', 'exam')}`,
      labs: [
        { type: 'classify', title: 'Clasificá las variables aleatorias (TP 3, ej. 1)', buckets: ['Discreta', 'Continua'], keepOrder: true, items: [
          { t: 'Kilómetros que viaja un vendedor en un mes', b: 1, why: 'Una distancia se mide.' },
          { t: 'Número de cuentas de un banco en un momento dado', b: 0, why: 'Se cuentan.' },
          { t: 'Tiempo de espera en una ventanilla', b: 1, why: 'Tiempo: medición.' },
          { t: 'Clientes nuevos de un banco en un mes', b: 0, why: 'Conteo.' },
          { t: 'Período de vigencia de un medicamento', b: 1, why: 'Duración en el tiempo.' },
          { t: 'Peso de la carga de trigo de un vagón', b: 1, why: 'Peso: medición.' },
          { t: 'Accidentes de trabajo en una fábrica', b: 0, why: 'Conteo.' },
          { t: 'Demandas recibidas por una aseguradora en un día', b: 0, why: 'Conteo.' },
        ] },
      ],
      exercises: [
        { title: 'Clasificar variables aleatorias', official: '3.1', level: 1, prompt: '<p>Clasificar por su tipo: kilómetros de un vendedor en un mes; cuentas de un banco; tiempo de espera en una ventanilla; clientes nuevos en un mes; vigencia de un medicamento; peso de la carga de trigo; accidentes de trabajo; demandas a una aseguradora en un día.</p>',
          solution: { explain: '<p><strong>Discretas</strong> (se cuentan): cuentas del banco, clientes nuevos, accidentes, demandas recibidas.</p><p><strong>Continuas</strong> (se miden): kilómetros, tiempo de espera, período de vigencia, peso de la carga.</p>' } },
        { title: 'Hallar la constante c', official: '3.3', level: 1, prompt: '<p>Determinar c para que f(x) = c(x² + 1), x = 0, 1, 2, 3, sea una distribución de probabilidad.</p>',
          solution: { explain: `<p>Σ f(x) = c(1 + 2 + 5 + 10) = 18c = 1 → <strong>c = 1/18</strong>. Entonces f(0) = 1/18, f(1) = 2/18, f(2) = 5/18, f(3) = 10/18; todas positivas.</p>` } },
        { title: '¿Es f(x) = x/15 una función de probabilidad?', official: '3.4', level: 1, prompt: '<p>Verificar si f(x) = x/15, x = 1, 2, 3, 4, 5 puede ser la función de probabilidad de una variable aleatoria. Si lo es, obtener la función acumulativa.</p>',
          solution: { explain: `<p>Todos los valores son positivos y Σ = (1 + 2 + 3 + 4 + 5)/15 = 15/15 = 1. <strong>Sí lo es</strong>.</p>${table(['x', 'f(x)', 'F(x)'], X15.map(([x, p], i) => [x, fr(x, 15), fr(X15.slice(0, i + 1).reduce((a, r) => a + r[0], 0), 15)]))}<p>F(x) = 0 si x &lt; 1; 1/15 si 1 ≤ x &lt; 2; 3/15 si 2 ≤ x &lt; 3; 6/15 si 3 ≤ x &lt; 4; 10/15 si 4 ≤ x &lt; 5; 1 si x ≥ 5.</p>` } },
      ],
      quiz: [
        { q: 'Una variable aleatoria es…', o: ['un suceso', 'una función que asigna un número real a cada resultado de S', 'una probabilidad', 'un conjunto de datos'], a: 1, e: 'Por ejemplo, el número de caras.' },
        { q: 'X = número de caras en dos monedas. R<sub>X</sub> =', o: ['{1, 2}', '{0, 1, 2}', '{c, s}', '{0, 1, 2, 3, 4}'], a: 1, e: 'Puede no salir ninguna.' },
        { q: 'El tiempo de espera en una ventanilla es una variable aleatoria…', o: ['discreta', 'continua', 'cualitativa', 'constante'], a: 1, e: 'Se mide.' },
        { q: 'Una función de probabilidad discreta debe cumplir…', o: ['f(x) ≥ 0 y Σ f(x) = 1', 'f(x) ≤ 1 solamente', 'Σ f(x) = 0', 'f creciente'], a: 0, e: 'Las dos condiciones.' },
        { q: 'Si f(x) = c(x² + 1) en x = 0, 1, 2, 3, entonces c =', o: ['1/14', '1/18', '1/4', '18'], a: 1, e: '18c = 1.' },
        { q: 'En dos monedas, P(X = 1) es…', o: ['1/4', '1/2', '3/4', '1/3'], a: 1, e: '(c,s) y (s,c).' },
      ],
      open: [
        { t: 'num', q: 'Hallá c para que f(x) = c·x, x = 1, 2, 3, 4, sea una función de probabilidad.', a: 0.1, e: 'c(1 + 2 + 3 + 4) = 10c = 1 → c = 0,1.' },
        { t: 'text', q: '¿Qué condiciones tiene que cumplir una función para ser función de probabilidad de una variable discreta?', k: [['no negativa', '≥ 0', '>= 0', 'mayor o igual', 'positiva'], ['suma', 'sumatoria', 'σ'], ['1', 'uno']], e: 'Que todos sus valores sean <b>no negativos</b> (f(xᵢ) ≥ 0) y que la <b>suma</b> de todos sea <b>1</b>.' },
      ],
      sources: [
        { title: 'Clase 5: Distribuciones de probabilidad, variables aleatorias discretas', ref: 'Prof. Teri', points: ['Definición de variable aleatoria, rango R<sub>X</sub>, ejemplos de dos monedas y de los 3 cajeros.', 'Condiciones de la función de probabilidad discreta.'] },
      ],
    },
    {
      id: 'funcion-acumulada-discreta',
      module: 'u5',
      title: 'Función de distribución acumulada',
      keywords: 'función de distribución acumulada F(x) = P(X ≤ x) escalonada creciente P(X < a) P(X > a) P(a ≤ X ≤ b) dos dados suma',
      tldr: 'La <mark>acumulada F(x) = P(X ≤ x)</mark> suma las probabilidades hasta x. En una discreta es <strong>escalonada</strong>, creciente, vale 0 antes del menor valor y 1 después del mayor. Con F se calcula todo: P(X ≤ b) = F(b); <strong>P(X &lt; b) = F(b − 1)</strong>; P(X &gt; a) = 1 − F(a); P(X = a) = F(a) − F(a − 1); P(a ≤ X ≤ b) = F(b) − F(a − 1).',
      goals: ['Construir F(x) a partir de f(x) y al revés.', 'Graficar la acumulada escalonada.', 'Calcular probabilidades de intervalos cuidando &lt; y ≤.'],
      body: `
        <h2>Definición y características</h2>
        ${eq('F(x) = P(X ≤ x) = Σ<sub>xᵢ ≤ x</sub> f(xᵢ)', 'Acumulada')}
        <ul><li>0 ≤ F(x) ≤ 1.</li><li>Es <strong>escalonada</strong> y <strong>creciente</strong>: salta en cada valor de X (el salto es f(x)) y es plana entre valores.</li><li>F(x) = 0 para x anterior al menor valor; F(x) = 1 para x posterior al mayor.</li><li>Se define en toda la recta, de −∞ a +∞.</li></ul>
        <h3>Ejemplo de la clase: un dado</h3>
        ${fig(steps({ pts: DIE.map(([x], i) => [x, (i + 1) / 6]), anim: false, yt: [1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6, 1] }), 'F(x) del dado: escalones de 1/6. Punto lleno: el valor que toma F en el salto.')}
        <h2>Probabilidades con la acumulada</h2>
        ${table(['Pedido', 'Con F (X entera)', 'Dado: ejemplo'], [
          ['P(X ≤ b)', 'F(b)', 'P(X ≤ 4) = 4/6'],
          ['P(X &lt; b)', 'F(b − 1)', 'P(X &lt; 5) = F(4) = 4/6 = 0,66'],
          ['P(X &gt; a)', '1 − F(a)', 'P(X &gt; 4) = 1 − 4/6 = 0,33'],
          ['P(X ≥ a)', '1 − F(a − 1)', 'P(X ≥ 3) = 1 − 2/6'],
          ['P(X = a)', 'F(a) − F(a − 1)', 'P(X = 2) = 2/6 − 1/6 = 1/6'],
          ['P(a ≤ X ≤ b)', 'F(b) − F(a − 1)', 'P(3 ≤ X ≤ 6) = 1 − 2/6 = 0,66'],
        ])}
        ${note('El error clásico: P(X &lt; 5) = F(5). En una discreta con valores enteros, “menor que 5” deja afuera al 5: es F(4). En las continuas (tema 7) esto ya no importa.', 'warn')}
        ${lab(0)}`,
      labs: [
        { type: 'discrete', title: 'Suma de dos dados: f(x) y F(x)', intro: 'La distribución del TP 3, ejercicio 2. Elegí a y b para calcular P(a ≤ X ≤ b) y pasá a la acumulada.', dist: 'custom', lock: true, pmf: SUM.map(([x, c]) => [x, c / 36]), a: 3, b: 6 },
      ],
      exercises: [
        { title: 'Suma de dos dados', official: '3.2', level: 2, prompt: '<p>Se tira un dado rojo y uno verde. a) Espacio muestral. b) X = suma de puntos: tabla con valores, número de ocurrencias y P(X = x). c) Graficar. d) Función de distribución. e) Graficarla. f) P(X &gt; 7), P(X &lt; 5), P(X ≤ 6), P(3 ≤ X ≤ 6).</p>',
          solution: { explain: `<p>a) S = {(1,1), (1,2), …, (6,6)}: 36 pares ordenados equiprobables.</p>
            <p>b) y d)</p>${table(['x', 'ocurrencias', 'f(x)', 'F(x)'], SUM.map(([x, c]) => [x, c, `${c}/36`, `${Fsum(x)}/36`]))}
            ${fig(bars({ pts: SUM.map(([x, c]) => [x, c / 36]), yl: 'f(x)', xl: 'suma', anim: false }), 'c) Forma triangular: el 7 es el más probable (6/36).')}
            ${fig(steps({ pts: SUM.map(([x]) => [x, Fsum(x) / 36]), anim: false, xl: 'suma' }), 'e) Acumulada escalonada.')}
            <p>f) P(X &gt; 7) = 1 − F(7) = 1 − 21/36 = 15/36 = <strong>${n4(15 / 36)}</strong>.<br>
            P(X &lt; 5) = F(4) = 6/36 = <strong>${n4(6 / 36)}</strong>.<br>
            P(X ≤ 6) = F(6) = 15/36 = <strong>${n4(15 / 36)}</strong> (el símbolo se perdió en el TP; si fuera P(X ≥ 6) = 1 − F(5) = 26/36 = ${n4(26 / 36)}).<br>
            P(3 ≤ X ≤ 6) = F(6) − F(2) = 15/36 − 1/36 = 14/36 = <strong>${n4(14 / 36)}</strong>.</p>` } },
        { title: 'Defectos por 10 m de tela', official: '3.5', level: 2, prompt: `<p>${table(['x', '0', '1', '2', '3', '4'], [['f(x)', '0,41', '0,37', '0,16', '0,05', '0,01']])}</p><p>a) Dibujar F. b) P(X &lt; 3) con F. c) P(1 &lt; X &lt; 4). d) P(X &gt; 2).</p>`,
          solution: { explain: `${table(['x', 'f(x)', 'F(x)'], DEF.map(([x, p]) => [x, num(p, 2), num(Fdef(x), 2)]))}${fig(steps({ pts: DEF.map(([x]) => [x, Fdef(x)]), anim: false, xl: 'defectos' }), 'a) F(x) del número de defectos.')}
            <p>b) P(X &lt; 3) = F(2) = <strong>0,94</strong>.</p><p>c) P(1 &lt; X &lt; 4) = P(X = 2) + P(X = 3) = F(3) − F(1) = 0,99 − 0,78 = <strong>0,21</strong>.</p><p>d) P(X &gt; 2) = 1 − F(2) = <strong>0,06</strong>.</p>` } },
        { title: 'De la acumulada a la función de probabilidad', official: '3.6', level: 2, prompt: '<p>F(x) = 0 si x &lt; 1; 1/3 si 1 ≤ x &lt; 4; 1/2 si 4 ≤ x &lt; 6; 5/6 si 6 ≤ x &lt; 10; 1 si x ≥ 10. Determinar a) P(2 &lt; X ≤ 6); b) P(X = 4); c) la función de probabilidad.</p>',
          solution: { explain: `<p>Los saltos de F están en 1, 4, 6 y 10.</p><p>a) P(2 &lt; X ≤ 6) = F(6) − F(2) = 5/6 − 1/3 = <strong>1/2</strong>.</p><p>b) P(X = 4) = salto en 4 = 1/2 − 1/3 = <strong>1/6</strong>.</p><p>c)</p>${table(['x', '1', '4', '6', '10'], [['f(x)', '1/3', '1/6', '1/3', '1/6']])}<p>Suma: 2/6 + 1/6 + 2/6 + 1/6 = 1. ✓</p>` } },
      ],
      quiz: [
        { q: 'F(x) = P(X ≤ x) en una discreta es…', o: ['continua y decreciente', 'escalonada y creciente', 'siempre lineal', 'igual a f(x)'], a: 1, e: 'Salta en cada valor de X.' },
        { q: 'Para X entera, P(X < 5) =', o: ['F(5)', 'F(4)', '1 − F(5)', 'F(5) − F(4)'], a: 1, e: 'El 5 queda afuera.' },
        { q: 'P(X = a) a partir de F es…', o: ['F(a)', 'F(a) − F(a − 1)', '1 − F(a)', 'F(a + 1)'], a: 1, e: 'Es el tamaño del salto.' },
        { q: 'Con el dado, P(X > 4) =', o: ['4/6', '2/6', '1/6', '5/6'], a: 1, e: '1 − F(4).' },
        { q: 'Para x mayor que el máximo valor de X, F(x) vale…', o: ['0', '0,5', '1', 'f(x)'], a: 2, e: 'Ya se acumuló todo.' },
        { q: 'Suma de dos dados: P(X = 7) =', o: ['1/36', '6/36', '7/36', '1/12'], a: 1, e: 'Es el valor más probable.' },
      ],
      open: [
        { t: 'num', q: 'TP 3, ej. 2: P(X > 7) para la suma de dos dados.', a: 15 / 36, e: '1 − F(7) = 1 − 21/36 = 15/36 = 0,4167.' },
        { t: 'num', q: 'TP 3, ej. 5 c): P(1 < X < 4) para los defectos de la tela.', a: 0.21, e: 'F(3) − F(1) = 0,99 − 0,78 = 0,21.' },
        { t: 'num', q: 'TP 3, ej. 6 a): P(2 < X ≤ 6).', a: 0.5, e: 'F(6) − F(2) = 5/6 − 1/3 = 1/2.' },
      ],
      sources: [
        { title: 'Clase 5', ref: 'Prof. Teri', points: ['Características de la acumulada: entre 0 y 1, escalonada, creciente, 0 antes del menor valor y 1 después del mayor.', 'Ejercicio del dado: P(X < 5) = F(4), P(X = 2) = F(2) − F(1), P(X > 4) = 1 − F(4), P(3 ≤ X ≤ 6) = F(6) − F(2).'] },
      ],
    },
    {
      id: 'esperanza-varianza-discreta',
      module: 'u5',
      title: 'Esperanza, varianza y desvío de una discreta',
      keywords: 'esperanza matemática valor esperado media μ E(X) = Σ x f(x) varianza V(X) = E(X²) − E(X)² desvío estándar centro de gravedad',
      tldr: 'La <mark>esperanza E(X) = μ = Σ x·f(x)</mark> es el promedio teórico a largo plazo y el centro de gravedad de las barras; no tiene por qué ser un valor posible (el dado da 3,5). La <mark>varianza V(X) = E(X²) − [E(X)]²</mark>, con E(X²) = Σ x²·f(x), mide la dispersión; el desvío <strong>σ = √V(X)</strong> está en las unidades de X.',
      goals: ['Calcular E(X), E(X²), V(X) y σ desde una tabla.', 'Interpretar la esperanza como promedio a largo plazo.', 'Usar la fórmula abreviada de la varianza.'],
      body: `
        <h2>Esperanza matemática</h2>
        ${eq('E(X) = μ = Σ xᵢ·f(xᵢ)', 'Valor esperado')}
        <p>Es el promedio de los valores ponderado por sus probabilidades: el <strong>centro de gravedad</strong> de la distribución. Ejemplo de la clase: llamadas por hora con f = 0,1; 0,2; 0,4; 0,2; 0,1 para 0 a 4. E(X) = 0·0,1 + 1·0,2 + 2·0,4 + 3·0,2 + 4·0,1 = <strong>2 llamadas/hora</strong>. No significa que entren exactamente 2 cada hora: si se observan muchas horas, el promedio se estabiliza en 2.</p>
        <p>Con el dado: E(X) = (1 + 2 + … + 6)/6 = 21/6 = <strong>3,5</strong>. Ese número no puede salir en el dado: es el promedio teórico si se tirara infinitas veces. El valor esperado siempre está entre el menor y el mayor valor posible.</p>
        <h2>Varianza y desvío</h2>
        ${eq('V(X) = σ² = E(X²) − [E(X)]² &nbsp;&nbsp; con E(X²) = Σ xᵢ²·f(xᵢ) &nbsp;&nbsp; σ = √V(X)', 'Varianza')}
        <p>Varianza chica: los resultados suelen estar cerca de la media; grande: se van lejos para arriba y para abajo. Siempre V(X) ≥ 0.</p>
        ${momTable(DIE)}
        <p>Dado: E(X²) = 91/6 = 15,1667; V(X) = 15,1667 − 3,5² = <strong>${n4(mDIE.V)}</strong>; σ = <strong>${n4(mDIE.sd)}</strong>.</p>
        ${note('Atajo para el parcial: armá la tabla con columnas x, f(x), x·f(x) y x²·f(x). Sumando las dos últimas tenés E(X) y E(X²) de una sola pasada.', 'tip')}
        ${note('La clase escribe E(X²) = 15,16 y V = 2,91 (truncando). Con más decimales: 91/6 = 15,1667 y V = 2,9167. En el parcial conviene arrastrar fracciones o al menos 4 decimales.', 'warn')}
        ${lab(0)}`,
      labs: [
        { type: 'discrete', title: 'Esperanza y varianza de una distribución', intro: 'La distribución de defectos del TP 3, ejercicios 5 y 8. Mirá dónde queda E(X) respecto de las barras.', dist: 'custom', pmf: DEF, a: 0, b: 2 },
      ],
      exercises: [
        { title: 'E, V y σ de f(x) = x/15', official: '3.7', level: 1, prompt: '<p>Calcular la esperanza, la varianza y el desvío estándar de f(x) = x/15, x = 1, …, 5.</p>',
          solution: { explain: `${momTable(X15)}<p>E(X) = 55/15 = <strong>${n4(m15.E)}</strong>. E(X²) = 225/15 = 15. V(X) = 15 − (55/15)² = <strong>${n4(m15.V)}</strong>. σ = <strong>${n4(m15.sd)}</strong>.</p>` } },
        { title: 'E, V y σ de los defectos', official: '3.8', level: 1, prompt: '<p>Calcular la esperanza, la varianza y el desvío de la variable del ejercicio 5 (defectos por 10 m de tela).</p>',
          solution: { explain: `${momTable(DEF)}<p>E(X) = <strong>${n4(mDEF.E)}</strong> defectos cada 10 m. E(X²) = ${n4(mDEF.E2)}. V(X) = ${n4(mDEF.E2)} − ${n4(mDEF.E)}² = <strong>${n4(mDEF.V)}</strong>. σ = <strong>${n4(mDEF.sd)}</strong> defectos.</p>` } },
        { title: 'Llamadas a un técnico (clase)', level: 1, prompt: '<p>X = llamadas por hora, con f(0) = 0,1, f(1) = 0,2, f(2) = 0,4, f(3) = 0,2, f(4) = 0,1. Calcular E(X), V(X) y σ.</p>',
          solution: { explain: `${momTable(CALL)}<p>E(X) = <strong>2</strong>; E(X²) = ${n4(S.moments(CALL).E2)}; V(X) = 5,2 − 4 = <strong>${n4(S.moments(CALL).V)}</strong>; σ = <strong>${n4(S.moments(CALL).sd)}</strong>. La distribución es simétrica alrededor de 2.</p>` } },
      ],
      quiz: [
        { q: 'E(X) de un dado justo es…', o: ['3', '3,5', '4', '21'], a: 1, e: '21/6.' },
        { q: 'V(X) se calcula como…', o: ['E(X)²', 'E(X²) − [E(X)]²', 'Σ x·f(x)', 'E(X) − E(X²)'], a: 1, e: 'Fórmula abreviada.' },
        { q: 'La esperanza…', o: ['siempre es un valor posible de X', 'es el promedio a largo plazo y puede no ser un valor posible', 'es el valor más probable', 'es la mediana'], a: 1, e: 'El dado da 3,5.' },
        { q: 'Si E(X) = 2 y E(X²) = 5,2, V(X) =', o: ['3,2', '1,2', '1,0954', '7,2'], a: 1, e: '5,2 − 4.' },
        { q: 'El desvío σ está en…', o: ['unidades de X al cuadrado', 'las mismas unidades que X', 'porcentaje', 'no tiene unidades'], a: 1, e: 'Es la raíz de la varianza.' },
        { q: 'La varianza de una variable aleatoria es…', o: ['siempre ≥ 0', 'puede ser negativa', 'siempre entre 0 y 1', 'igual a E(X)'], a: 0, e: 'Es un promedio de cuadrados.' },
      ],
      open: [
        { t: 'num', q: 'TP 3, ej. 7: E(X) para f(x) = x/15, x = 1…5.', a: m15.E, e: 'Σx²/15 = 55/15 = 3,6667.' },
        { t: 'num', q: 'TP 3, ej. 7: V(X) para f(x) = x/15.', a: m15.V, e: '15 − 3,6667² = 1,5556.' },
        { t: 'num', q: 'TP 3, ej. 8: E(X) de los defectos de la tela.', a: mDEF.E, e: '0·0,41 + 1·0,37 + 2·0,16 + 3·0,05 + 4·0,01 = 0,88.' },
        { t: 'num', q: 'TP 3, ej. 8: desvío estándar de los defectos.', a: mDEF.sd, e: `V = 1,62 − 0,7744 = 0,8456; σ = ${n4(mDEF.sd)}.` },
        { t: 'text', q: 'Interpretá E(X) = 3,5 para el resultado de un dado.', k: [['promedio', 'media'], ['largo plazo', 'muchas veces', 'infinitas', 'repetir'], ['no puede salir', 'no es un valor posible', 'no sale', 'centro de gravedad']], need: 2, e: 'Es el <b>promedio</b> teórico de los resultados si se tirara el dado <b>muchas veces</b>. No es un resultado posible (no puede salir 3,5): es el <b>centro de gravedad</b> de la distribución.' },
      ],
      sources: [
        { title: 'Clase 5: Esperanza y varianza', ref: 'Prof. Teri', points: ['E(X) = Σ x·f(x) como centro de gravedad; llamadas (E = 2) y dado (E = 3,5).', 'V(X) = E(X²) − [E(X)]²; σ = √V(X).'] },
      ],
    },
  );
})();
