/* Tema 3 (1er parcial): introducción a la probabilidad. Apunte "Introducción a la Probabilidad", clase 3 (Prof. Teri) y TP 2, ejercicios 1 a 7.
   Las probabilidades de conteo se calculan con st.comb y st.perm. */
(() => {
  const { LESSONS, h, st: S } = window.GUIDE;
  const { note, def, table, eq, frac, lab, num } = h;
  const n4 = (v) => num(v, 4);
  const big = (v) => num(v, 0);
  const C = S.comb;

  // TP 2, ej. 4 a 7
  const e4a = 2 * (10 / 16) * (6 / 16), e4b = (C(10, 1) * C(6, 1)) / C(16, 2);
  const e5 = { b: 47 / 52, c: (4 / 52) * (48 / 51), d: 1 - (39 / 52) * (38 / 51), e: 39 / 51, f: 40 / 52 };
  const e6 = (r, b) => (C(6, r) * C(8, b)) / C(14, 5);
  const e7b = (4 * 4 * 4 * 4) / (52 * 51 * 50 * 49), e7d = (C(4, 3) * C(4, 2)) / C(52, 5), e7e = 1 - C(48, 5) / C(52, 5);
  const def2 = (C(4, 2) * C(196, 3)) / C(200, 5);

  LESSONS.push(
    {
      id: 'espacio-muestral-sucesos',
      module: 'u3',
      title: 'Experimentos, espacio muestral y sucesos',
      keywords: 'experimento aleatorio determinístico espacio muestral S extensión comprensión suceso evento elemental unión intersección complemento diferencia mutuamente excluyentes Venn',
      tldr: 'Un experimento es <strong>aleatorio</strong> si, repetido en las mismas condiciones, puede dar resultados distintos. El <mark>espacio muestral S</mark> es el conjunto de todos sus resultados posibles; un <mark>suceso</mark> es un subconjunto de S. Con los sucesos se opera como con conjuntos: <strong>unión</strong> A ∪ B, <strong>intersección</strong> A ∩ B, <strong>complemento</strong> Ā. Dos sucesos son <strong>mutuamente excluyentes</strong> si A ∩ B = ∅.',
      goals: ['Distinguir un experimento determinístico de uno aleatorio.', 'Escribir el espacio muestral por extensión o por comprensión y contar sus elementos.', 'Operar sucesos (unión, intersección, complemento) y reconocer sucesos excluyentes.'],
      body: `
        <h2>Determinístico o aleatorio</h2>
        <p>Un fenómeno es <strong>determinístico</strong> cuando, partiendo de las mismas condiciones, se sabe con certeza qué va a pasar (el tiempo que tarda en caer un objeto desde la misma altura). Es <strong>aleatorio</strong> cuando no se puede predecir el resultado: bajo las mismas condiciones no siempre da lo mismo (una moneda, un dado, una carta, una bolilla). La probabilidad estudia los aleatorios; se nota ε al experimento.</p>
        <h2>Espacio muestral</h2>
        ${def('Espacio muestral S', 'Es el conjunto de todos los resultados posibles de un fenómeno o experimento aleatorio. Sus elementos se expresan de forma conjuntista.', 'Apunte de Introducción a la Probabilidad')}
        <p>Se puede escribir por <strong>extensión</strong> (listando: S = {1; 2; 3; 4; 5; 6}) o por <strong>comprensión</strong> (con una regla: S = {x / x ∈ ℕ, x ≤ 6}). El número de elementos se nota #(S).</p>
        ${table(['Experimento ε', 'Espacio muestral', '#(S)'], [
          ['Lanzar un dado', '{1, 2, 3, 4, 5, 6}', '6'],
          ['Lanzar dos monedas', '{(c,c), (c,s), (s,c), (s,s)}', '4'],
          ['Un dado azul y uno rojo', '{(1,1), (1,2), …, (6,6)} pares ordenados', '6·6 = 36'],
          ['Una moneda y un dado', '{(c,1), …, (c,6), (s,1), …, (s,6)}', '2·6 = 12'],
          ['Vida útil de un ventilador (horas)', '{t / t ∈ ℝ ∧ t ≥ 0}', 'infinito (continuo)'],
        ])}
        <p>Cuando el orden importa, cada resultado es un conjunto <strong>ordenado</strong>: un par (2-tupla), una terna (3-tupla), una k-tupla. Cinco tiradas de un dado dan 5-tuplas como (1, 3, 6, 2, 4).</p>
        <h2>Sucesos y operaciones</h2>
        <p>Un <strong>suceso</strong> (o evento) es un subconjunto de S y se nota con mayúsculas. Los <strong>sucesos elementales</strong> son cada uno de los elementos de S. Con un dado, A = “par” = {2, 4, 6} y B = “mayor que 3” = {4, 5, 6}:</p>
        ${table(['Operación', 'Significado', 'Resultado'], [['A ∪ B', 'ocurre A, o B, o ambos', '{2, 4, 5, 6}'], ['A ∩ B', 'ocurren A y B a la vez', '{4, 6}'], ['Ā', 'no ocurre A', '{1, 3, 5}'], ['A − B', 'ocurre A pero no B', '{2}']])}
        ${lab(0)}
        <h2>Mutuamente excluyentes</h2>
        <p>A y B son <strong>mutuamente excluyentes</strong> si no tienen elementos en común: A ∩ B = ∅ (no pueden ocurrir juntos). Un suceso y su complemento siempre lo son, y además juntos cubren S.</p>
        ${note('No confundir con <b>independientes</b> (tema 4): excluyentes es una propiedad de los conjuntos (A ∩ B = ∅); independientes es una propiedad de las probabilidades (P(A ∩ B) = P(A)·P(B)). Dos sucesos excluyentes con probabilidad positiva son siempre <b>dependientes</b>: si ocurre uno, el otro ya no puede ocurrir.', 'warn')}`,
      labs: [
        { type: 'venn', title: 'Armá los sucesos con un dado', intro: 'Empieza con A = par y B = mayor que 3. Probá A = {1, 2} y B = {3, 4}: son excluyentes. ¿Encontrás dos sucesos independientes?', S: [1, 2, 3, 4, 5, 6], A: [2, 4, 6], B: [4, 5, 6] },
      ],
      exercises: [
        { title: 'Espacios muestrales', official: '2.1', level: 1, prompt: '<p>Determinar un espacio muestral para: a) extraer una carta de una baraja de 52; b) contar los defectuosos en un lote de 500; c) lanzar 2 veces una moneda; d) lanzar una moneda y un dado; e) medir el tiempo entre dos llegadas sucesivas a una cola.</p>',
          solution: { explain: `<p>a) S = {A♠, 2♠, …, K♠, A♥, …, K♥, A♦, …, K♦, A♣, …, K♣}: 4 palos × 13 valores = <strong>52</strong> elementos.</p>
            <p>b) S = {0, 1, 2, …, 500}: <strong>501</strong> elementos (puede no haber ningún defectuoso o serlo todos).</p>
            <p>c) S = {(c,c), (c,s), (s,c), (s,s)}: <strong>4</strong> pares ordenados.</p>
            <p>d) S = {(c,1), (c,2), …, (c,6), (s,1), …, (s,6)}: 2·6 = <strong>12</strong>.</p>
            <p>e) S = {t / t ∈ ℝ, t ≥ 0}: infinito no numerable (es una medición de tiempo).</p>` } },
        { title: 'Moneda y dado: operar sucesos', official: '2.2', level: 1, prompt: '<p>Se lanza una moneda y un dado. A: “cara en la moneda”; B: “número impar en el dado”. Enumerar los elementos de los sucesos pedidos (A, B, sus complementos, uniones e intersecciones).</p>',
          solution: { explain: `<p>En la versión digital del TP se perdieron los símbolos de las operaciones; estas son todas las combinaciones habituales:</p>
            ${table(['Suceso', 'Elementos', '#'], [
              ['A', '{(c,1), (c,2), (c,3), (c,4), (c,5), (c,6)}', 6],
              ['B', '{(c,1), (c,3), (c,5), (s,1), (s,3), (s,5)}', 6],
              ['A ∪ B', '{(c,1), (c,2), (c,3), (c,4), (c,5), (c,6), (s,1), (s,3), (s,5)}', 9],
              ['A ∩ B', '{(c,1), (c,3), (c,5)}', 3],
              ['Ā', '{(s,1), …, (s,6)}', 6], ['B̄', '{(c,2), (c,4), (c,6), (s,2), (s,4), (s,6)}', 6],
              ['Ā ∩ B', '{(s,1), (s,3), (s,5)}', 3], ['A ∩ B̄', '{(c,2), (c,4), (c,6)}', 3],
              ['Ā ∩ B̄ = (A ∪ B)‾', '{(s,2), (s,4), (s,6)}', 3],
            ])}
            <p>Control: #(A ∪ B) = #A + #B − #(A ∩ B) = 6 + 6 − 3 = 9.</p>` } },
        { title: 'Complementarios y excluyentes', official: '2.3', level: 1, prompt: '<p>Verdadero o falso, justificando: a) si dos sucesos son complementarios, entonces son mutuamente excluyentes; b) si dos sucesos son mutuamente excluyentes, entonces son complementarios.</p>',
          solution: { explain: '<p>a) <strong>Verdadero</strong>: si B = Ā, entonces A ∩ Ā = ∅ por definición de complemento.</p><p>b) <strong>Falso</strong>: con un dado, A = {1} y B = {2} no tienen elementos en común (excluyentes) pero A ∪ B = {1, 2} ≠ S, así que B no es el complemento de A. Para ser complementarios además tienen que cubrir todo S.</p>' } },
      ],
      quiz: [
        { q: 'Un experimento aleatorio es aquel que…', o: ['siempre da el mismo resultado', 'en las mismas condiciones puede dar resultados distintos', 'no tiene espacio muestral', 'depende del experimentador'], a: 1, e: 'Ejemplos: moneda, dado, cartas.' },
        { q: '¿Cuántos elementos tiene el espacio muestral de lanzar un dado azul y uno rojo?', o: ['12', '36', '21', '6'], a: 1, e: 'Pares ordenados: 6·6.' },
        { q: 'Con un dado, A = {2, 4, 6} y B = {4, 5, 6}. A ∩ B es…', o: ['{2, 4, 5, 6}', '{4, 6}', '{5}', '∅'], a: 1, e: 'Elementos comunes.' },
        { q: 'Un suceso es…', o: ['un elemento de S únicamente', 'un subconjunto de S', 'una probabilidad', 'un número real'], a: 1, e: 'Los elementales son los elementos de S.' },
        { q: 'A y B son mutuamente excluyentes si…', o: ['A ∪ B = S', 'A ∩ B = ∅', 'P(A ∩ B) = P(A)·P(B)', 'A = B'], a: 1, e: 'No pueden ocurrir a la vez.' },
        { q: 'S = {x / x ∈ ℕ, x ≤ 6} está escrito por…', o: ['extensión', 'comprensión', 'diagrama', 'tabla'], a: 1, e: 'Por extensión se listan los elementos.' },
        { q: 'El tiempo entre dos llegadas a una cola tiene un espacio muestral…', o: ['finito', 'numerable', 'continuo (t ≥ 0)', 'vacío'], a: 2, e: 'Es una medición.' },
      ],
      open: [
        { t: 'num', q: '¿Cuántos elementos tiene el espacio muestral de lanzar tres dados?', a: 216, e: '6·6·6 = 216 ternas ordenadas.' },
        { t: 'text', q: '¿Es lo mismo que dos sucesos sean mutuamente excluyentes que independientes? Explicá.', k: [['no'], ['intersección vacía', 'a ∩ b = ∅', 'no pueden ocurrir', 'no tienen elementos en común', 'vacía'], ['producto', 'p(a)·p(b)', 'p(a).p(b)', 'p(a)p(b)', 'no afecta']], e: '<b>No</b>. Excluyentes: la <b>intersección es vacía</b>, no pueden ocurrir juntos. Independientes: la ocurrencia de uno no afecta al otro, P(A ∩ B) = P(A)·P(B) (el <b>producto</b>). Si son excluyentes y tienen probabilidad positiva, son dependientes.' },
      ],
      sources: [
        { title: 'Apunte: Introducción a la Probabilidad', ref: 'Cátedra, UTN-FRT', points: ['Fenómenos determinísticos y aleatorios, espacio muestral, sucesos, unión, intersección, complemento, excluyentes.'] },
        { title: 'Clase 3: Introducción a la probabilidad, 1.ª parte', ref: 'Prof. Teri', points: ['Espacio muestral por extensión y por comprensión; pares ordenados y k-tuplas.', 'Ejercicios resueltos: carta, ojos de una familia, tres dados, moneda dos veces, dado y moneda.'] },
      ],
    },
    {
      id: 'laplace-axiomas',
      module: 'u3',
      title: 'Laplace, frecuencia y axiomas de probabilidad',
      keywords: 'definición clásica Laplace casos favorables posibles equiprobables frecuencia relativa ley de los grandes números axiomas de Kolmogorov consecuencias complemento unión',
      tldr: 'Si todos los resultados son equiprobables, <mark>P(A) = casos favorables / casos posibles</mark> (Laplace). Repetido muchas veces, la <strong>frecuencia relativa</strong> de A se estabiliza en P(A). La definición <strong>axiomática</strong> pide tres cosas: P(S) = 1, 0 ≤ P(A) ≤ 1 y P(A ∪ B) = P(A) + P(B) si son excluyentes. De ahí salen P(Ā) = 1 − P(A) y la regla general <mark>P(A ∪ B) = P(A) + P(B) − P(A ∩ B)</mark>.',
      goals: ['Calcular probabilidades con la definición clásica.', 'Relacionar frecuencia relativa y probabilidad.', 'Enunciar los axiomas y usar sus consecuencias (complemento, unión de dos y tres sucesos).'],
      body: `
        <h2>Definición clásica (Laplace)</h2>
        ${eq(`P(A) = ${frac('Nº de resultados favorables', 'Nº de resultados posibles')}`, 'Laplace')}
        <p>Vale solo si cada elemento de S tiene <strong>la misma probabilidad</strong> de ocurrir. Ejemplo: P(par con un dado) = 3/6 = 0,5; P(carta roja) = 26/52 = 0,5.</p>
        ${note('Dejá la probabilidad indicada como un número entre 0 y 1 (0,66, no 66). Si te piden porcentaje, aclaralo: “hay un 66 % de probabilidad…”.', 'tip')}
        <h2>Frecuencia relativa y probabilidad</h2>
        <p>Si se repite el experimento n veces y A ocurre k veces, la frecuencia relativa k/n se acerca a P(A) cuando n crece. Así se estiman probabilidades cuando no hay simetría (¿cuál es la probabilidad de que falle un disco?): se observa la frecuencia en muchos casos.</p>
        ${lab(0)}
        <h2>Definición axiomática</h2>
        <p>Sea ε un experimento, S su espacio muestral y A, B sucesos de S. La probabilidad es un número real que cumple:</p>
        ${table(['Axioma', 'Enunciado', 'Significa'], [['1', 'P(S) = 1', 'algo de S ocurre seguro'], ['2', '0 ≤ P(A) ≤ 1', 'la probabilidad está entre 0 y 1'], ['3', 'P(A ∪ B) = P(A) + P(B) si A ∩ B = ∅', 'para excluyentes, se suman']])}
        <h3>Consecuencias</h3>
        ${eq('P(Ā) = 1 − P(A) &nbsp;&nbsp;&nbsp; P(∅) = 0', 'Complemento y vacío')}
        ${eq('P(A ∪ B) = P(A) + P(B) − P(A ∩ B)', 'Unión general')}
        ${eq('P(A ∪ B ∪ C) = P(A) + P(B) + P(C) − P(A ∩ B) − P(A ∩ C) − P(B ∩ C) + P(A ∩ B ∩ C)', 'Tres sucesos')}
        <p>Se resta P(A ∩ B) porque esa parte se contó dos veces (una en A y otra en B). Si son excluyentes, P(A ∩ B) = 0 y vuelve el axioma 3.</p>
        ${note('El complemento es la herramienta para “al menos uno”: P(al menos un as) = 1 − P(ningún as). Es mucho más corto que sumar todos los casos.', 'exam')}`,
      labs: [
        { type: 'lln', title: 'La frecuencia relativa se estabiliza', intro: 'Simulá el experimento muchas veces. Con 50 repeticiones la frecuencia puede estar lejos de la probabilidad; con 3000, casi encima.' },
      ],
      exercises: [
        { title: 'Unión con un dado', level: 1, prompt: '<p>Con un dado, A = “par” y B = “mayor que 3”. Calcular P(A ∪ B) con la regla general y verificar contando.</p>', solution: { explain: '<p>P(A) = 3/6, P(B) = 3/6, A ∩ B = {4, 6} → P(A ∩ B) = 2/6. P(A ∪ B) = 3/6 + 3/6 − 2/6 = <strong>4/6 = 0,6667</strong>. Contando: A ∪ B = {2, 4, 5, 6}, 4 de 6. ✓</p>' } },
        { title: 'Al menos un 6 en cuatro tiradas', level: 2, prompt: '<p>Se lanza un dado 4 veces. ¿Cuál es la probabilidad de obtener al menos un 6?</p>', solution: { explain: `<p>#(S) = 6⁴ = 1296. “Ningún 6”: 5⁴ = 625 resultados. P(al menos un 6) = 1 − 625/1296 = <strong>${n4(1 - 625 / 1296)}</strong>.</p>` } },
      ],
      quiz: [
        { q: 'La definición de Laplace exige que los resultados sean…', o: ['muchos', 'equiprobables', 'independientes', 'continuos'], a: 1, e: 'Si no, hay que usar otra forma de asignar probabilidades.' },
        { q: 'P(S) vale…', o: ['0', '0,5', '1', 'depende de S'], a: 2, e: 'Axioma 1.' },
        { q: 'Si P(A) = 0,3, P(Ā) es…', o: ['0,3', '0,7', '1,3', '0'], a: 1, e: '1 − 0,3.' },
        { q: 'P(A) = 0,76, P(B) = 0,45 y P(A ∩ B) = 0,30. P(A ∪ B) es…', o: ['1,21', '0,91', '0,30', '0,46'], a: 1, e: '0,76 + 0,45 − 0,30 = 0,91.' },
        { q: 'Al repetir un experimento muchas veces, la frecuencia relativa de A…', o: ['crece sin límite', 'se estabiliza cerca de P(A)', 'tiende a 0', 'tiende a 1'], a: 1, e: 'Ley de los grandes números.' },
        { q: '¿Cuál de estos valores NO puede ser una probabilidad?', o: ['0', '0,999', '1', '1,2'], a: 3, e: 'Axioma 2: entre 0 y 1.' },
        { q: 'Para calcular “al menos uno” conviene usar…', o: ['la unión de todos los casos', 'el complemento: 1 − P(ninguno)', 'Bayes', 'la mediana'], a: 1, e: 'Es una sola cuenta.' },
      ],
      open: [
        { t: 'num', q: 'Se extrae una carta de una baraja de 52. ¿Cuál es la probabilidad de que sea una figura (J, Q o K)?', a: 12 / 52, e: '12 figuras: P = 12/52 = 0,2308.' },
        { t: 'num', q: 'Con dos dados, ¿cuál es la probabilidad de que la suma sea 7?', a: 6 / 36, e: 'Casos favorables: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) = 6 de 36 → 0,1667.' },
        { t: 'num', q: 'Si P(A) = 0,5, P(B) = 0,4 y P(A ∪ B) = 0,7, ¿cuánto vale P(A ∩ B)?', a: 0.2, e: 'P(A ∩ B) = P(A) + P(B) − P(A ∪ B) = 0,5 + 0,4 − 0,7 = 0,2.' },
        { t: 'text', q: 'Enunciá los tres axiomas de la probabilidad.', k: [['p(s) = 1', 'p(s)=1', 'espacio muestral es 1', 'espacio muestral igual a 1'], ['entre 0 y 1', '0 ≤ p', '0 <= p', 'mayor o igual a 0'], ['excluyentes', 'a ∩ b = ∅', 'suma']], e: '1) <b>P(S) = 1</b>. 2) <b>0 ≤ P(A) ≤ 1</b>. 3) Si A y B son mutuamente <b>excluyentes</b> (A ∩ B = ∅), P(A ∪ B) = P(A) + P(B).' },
      ],
      sources: [
        { title: 'Apunte: Introducción a la Probabilidad', ref: 'Cátedra, UTN-FRT', points: ['Definición clásica de Laplace; definición axiomática y consecuencias (complemento, vacío, unión de dos y tres sucesos).'] },
        { title: 'Clase 3', ref: 'Prof. Teri', points: ['P(carta roja) = 26/52 = 0,5. “Dejar indicada la probabilidad como un número entre 0 y 1”.'] },
      ],
    },
    {
      id: 'conteo-combinatoria',
      module: 'u3',
      title: 'Conteo: multiplicación, permutaciones y combinaciones',
      keywords: 'principio de multiplicación con reposición sin reposición reemplazo permutaciones variaciones combinaciones número combinatorio factorial baraja urna bolas cartas',
      tldr: 'Para aplicar Laplace hay que <strong>contar</strong>. <mark>Principio de multiplicación</mark>: m formas y luego n formas dan m·n. Con reposición, r elecciones entre n dan <strong>nʳ</strong>; sin reposición y con orden, <strong>n·(n−1)·…</strong> (permutaciones); sin orden, <mark>combinaciones C(n, r) = n!/[r!(n − r)!]</mark>. La pregunta clave: <strong>¿importa el orden? ¿se repone?</strong>',
      goals: ['Contar resultados con el principio de multiplicación, con y sin reposición.', 'Decidir entre permutación y combinación.', 'Calcular probabilidades con combinatoria (urnas, cartas, lotes con defectuosos).'],
      body: `
        <h2>Principio de multiplicación</h2>
        <p>Si una operación se puede hacer de m formas y después otra de n formas, juntas se pueden hacer de <strong>m·n</strong> formas. Ejemplos de la clase:</p>
        <ul>
          <li>Dos viajeros, 3 hoteles, cada uno en un hotel distinto: 3·2 = <strong>6</strong>.</li>
          <li>Ir de Buenos Aires a Córdoba en uno de 10 aviones y volver en otro: 10·9 = <strong>90</strong>.</li>
          <li>Lanzar un dado 4 veces: 6·6·6·6 = 6⁴ = <strong>1296</strong>.</li>
          <li>Tres tornillos de 5, de a uno <strong>con</strong> reposición: 5³ = <strong>125</strong>.</li>
          <li>Cinco cartas <strong>en orden</strong> sin reposición: 52·51·50·49·48 = <strong>311.875.200</strong>.</li>
        </ul>
        <h2>¿Importa el orden?</h2>
        ${table(['Situación', 'Cómo se cuenta', 'Fórmula'], [
          ['Con reposición, importa el orden', 'n opciones en cada una de las r elecciones', 'nʳ'],
          ['Sin reposición, importa el orden (permutación)', 'n·(n − 1)·…·(n − r + 1)', `${frac('n!', '(n − r)!')}`],
          ['Sin reposición, no importa el orden (combinación)', 'grupos de r elementos', `C(n, r) = ${frac('n!', 'r!·(n − r)!')}`],
        ])}
        ${def('Combinación sin repetición', 'Todo grupo de r elementos tomados de un conjunto de n elementos distintos, de forma que no se consideran todos los elementos, el orden no importa y no se repiten los elementos.', 'Clase 3')}
        <p>“Un subconjunto ordenado se llama <strong>permutación</strong>; uno no ordenado, <strong>combinación</strong>.” Manos de 5 cartas (sin orden): C(52, 5) = <strong>2.598.960</strong>. Cada mano corresponde a 5! = 120 órdenes: 311.875.200/120 = 2.598.960.</p>
        ${lab(0)}
        <h2>Probabilidad con combinatoria</h2>
        <h3>Urna: con y sin reposición</h3>
        <p>3 rojas y 7 blancas; se sacan 2. P(1.ª roja y 2.ª blanca): <strong>con</strong> reposición (independientes) 3/10·7/10 = <strong>0,21</strong>; <strong>sin</strong> reposición (dependientes) 3/10·7/9 = 21/90 = <strong>0,2333</strong>.</p>
        <h3>Lote con defectuosos (el patrón del TP)</h3>
        <p>Lote de 200 con 2 % defectuosos (4 D y 196 ND); se toman 5 sin reposición. P(exactamente 2 D):</p>
        ${eq(`P = ${frac('C(4, 2)·C(196, 3)', 'C(200, 5)')} = ${frac(`${C(4, 2)} · ${big(C(196, 3))}`, big(C(200, 5)))} = ${num(def2, 5)}`, 'favorables / posibles')}
        ${note(`El apunte informa 0,0292417 (“un 2,9 %”), pero la cuenta da <b>${num(def2, 7)}</b>, es decir, un 0,29 %. Es un corrimiento de la coma; el planteo (favorables = C(4,2)·C(196,3), posibles = C(200,5)) es el correcto.`, 'warn')}
        <p>La estructura “elegir x de los buenos y n − x de los malos” sobre “elegir n del total” sirve para urnas, cartas y lotes. Si el muestreo fuera con reposición, cada extracción sería un ensayo independiente: es la idea de la distribución binomial (tema 6).</p>`,
      labs: [
        { type: 'calc', title: 'Calculadora de conteo', fields: [{ id: 'n', label: 'n (elementos disponibles)', value: 52 }, { id: 'r', label: 'r (elementos que se toman)', value: 5 }],
          run: (v) => { const n = Math.round(v.n), r = Math.round(v.r); if (!(n >= 0 && r >= 0 && r <= n && n <= 170)) return 'Usá 0 ≤ r ≤ n ≤ 170.'; return `Con reposición, con orden:  n^r = ${big(n ** r)}\nSin reposición, con orden:  n!/(n − r)! = ${big(S.perm(n, r))}\nSin reposición, sin orden:  C(n, r) = ${big(C(n, r))}\nPermutaciones de los r:    r! = ${big(S.fact(r))}`; } },
      ],
      exercises: [
        { title: 'Lote de 16 artículos', official: '2.4', level: 2, prompt: '<p>Un lote tiene 10 artículos sin defecto y 6 con defecto. Se escogen 2. Probabilidad de que exactamente uno sea sin defecto: a) con sustitución; b) sin sustitución.</p>',
          solution: { explain: `<p>a) Con sustitución las extracciones son independientes; hay dos órdenes posibles (bueno-malo o malo-bueno): P = 2·(10/16)·(6/16) = 120/256 = <strong>${n4(e4a)}</strong>.</p><p>b) Sin sustitución: P = C(10,1)·C(6,1)/C(16,2) = 10·6/120 = <strong>${n4(e4b)}</strong>. (Con orden: 2·(10/16)·(6/15) = 0,5, lo mismo.)</p>` } },
        { title: 'Dos cartas sucesivas', official: '2.5', level: 2, prompt: '<p>Se extraen 2 cartas sucesivamente (sin reposición) de una baraja de 52. a) Espacio muestral y cantidad de elementos. Probabilidad de que: b) la primera no sea un diez de trébol ni un as; c) la primera sea un as y la segunda no; d) al menos una sea diamante; e) no sean del mismo palo; f) la segunda no sea una figura.</p>',
          solution: { explain: `<p>a) S = pares ordenados de cartas distintas: #(S) = 52·51 = <strong>2652</strong>.</p>
            <p>b) “Diez de trébol o as” son 1 + 4 = 5 cartas: P = 1 − 5/52 = 47/52 = <strong>${n4(e5.b)}</strong>.</p>
            <p>c) P = (4/52)·(48/51) = 192/2652 = <strong>${n4(e5.c)}</strong>.</p>
            <p>d) Por complemento: P(ningún diamante) = (39/52)·(38/51). P = 1 − 1482/2652 = <strong>${n4(e5.d)}</strong>.</p>
            <p>e) La primera es cualquiera; la segunda tiene que ser de otro palo: 39 de las 51 restantes. P = 39/51 = <strong>${n4(e5.e)}</strong>.</p>
            <p>f) Por simetría, la segunda carta tiene la misma distribución que la primera: P(figura) = 12/52. P = 40/52 = <strong>${n4(e5.f)}</strong>. (Verificación: 12/52·40/51 + 40/52·39/51 = 40/52.)</p>` } },
        { title: 'Urna con 6 rojas y 8 azules', official: '2.6', level: 2, prompt: '<p>Se extraen 5 bolas sin reemplazo de una urna con 6 rojas y 8 azules. a) Espacio muestral y cantidad de elementos. Probabilidad de: b) 3 rojas y 2 azules; c) 4 rojas y 1 azul; d) 2 rojas y 3 azules.</p>',
          solution: { explain: `<p>a) S = grupos de 5 bolas de 14 (sin orden): #(S) = C(14, 5) = <strong>${C(14, 5)}</strong>.</p>
            <p>b) C(6,3)·C(8,2)/C(14,5) = 20·28/2002 = <strong>${n4(e6(3, 2))}</strong>.</p>
            <p>c) C(6,4)·C(8,1)/2002 = 15·8/2002 = <strong>${n4(e6(4, 1))}</strong>.</p>
            <p>d) C(6,2)·C(8,3)/2002 = 15·56/2002 = <strong>${n4(e6(2, 3))}</strong>.</p>` } },
        { title: 'Cinco cartas sin reemplazo', official: '2.7', level: 3, prompt: '<p>Se extraen 5 cartas sin reemplazo de una baraja de 52. a) Espacio muestral y cantidad de elementos. Probabilidad de: b) 1 nueve, 1 diez, 1 reina y 1 rey en ese orden; c) lo mismo en cualquier orden; d) 3 dieces y 2 jotas; e) al menos un as.</p>',
          solution: { explain: `<p>a) Sin orden: #(S) = C(52, 5) = <strong>${big(C(52, 5))}</strong> manos (con orden serían 311.875.200).</p>
            <p>b) y c) El enunciado nombra 4 cartas para 5 extracciones; se resuelve para las <strong>primeras cuatro</strong> cartas (la quinta puede ser cualquiera). En ese orden: P = (4/52)·(4/51)·(4/50)·(4/49) = 256/6.497.400 = <strong>${num(e7b, 8)}</strong> ≈ 3,94·10⁻⁵. En cualquier orden se multiplica por los 4! = 24 órdenes: <strong>${num(24 * e7b, 6)}</strong>.</p>
            <p>d) C(4,3)·C(4,2)/C(52,5) = 4·6/2.598.960 = <strong>${num(e7d, 8)}</strong> ≈ 9,23·10⁻⁶.</p>
            <p>e) Por complemento: P(ningún as) = C(48,5)/C(52,5) = ${big(C(48, 5))}/${big(C(52, 5))}. P = <strong>${n4(e7e)}</strong>.</p>` } },
      ],
      quiz: [
        { q: 'Se lanza un dado 3 veces. ¿Cuántos resultados hay?', o: ['18', '216', '120', '3'], a: 1, e: '6³.' },
        { q: '¿Cuántas manos de 5 cartas hay en una baraja de 52?', o: ['311.875.200', '2.598.960', '52⁵', '260'], a: 1, e: 'C(52, 5): el orden no importa.' },
        { q: 'C(n, r) se usa cuando…', o: ['importa el orden y hay reposición', 'no importa el orden y no hay reposición', 'importa el orden y no hay reposición', 'siempre'], a: 1, e: 'Es un grupo, no una secuencia.' },
        { q: 'Urna con 3 rojas y 7 blancas, 2 extracciones sin reposición. P(roja y luego blanca) es…', o: ['0,21', '0,2333', '0,3', '0,7'], a: 1, e: '3/10·7/9 = 21/90.' },
        { q: 'C(6, 2) vale…', o: ['12', '15', '30', '36'], a: 1, e: '6!/(2!·4!) = 15.' },
        { q: 'Con reposición, las extracciones son…', o: ['dependientes', 'independientes', 'excluyentes', 'imposibles'], a: 1, e: 'Se restablecen las condiciones originales.' },
        { q: 'Diez aviones: ir en uno y volver en otro distinto se puede hacer de…', o: ['100', '90', '20', '19'], a: 1, e: '10·9.' },
      ],
      open: [
        { t: 'num', q: 'TP 2, ej. 4 b): 10 buenos y 6 defectuosos, se eligen 2 sin sustitución. ¿Probabilidad de exactamente un bueno?', a: e4b, e: 'C(10,1)·C(6,1)/C(16,2) = 60/120 = 0,5.' },
        { t: 'num', q: 'TP 2, ej. 6 b): urna con 6 rojas y 8 azules, 5 extracciones sin reemplazo. P(3 rojas y 2 azules)?', a: e6(3, 2), e: '20·28/2002 = 0,2797.' },
        { t: 'num', q: 'TP 2, ej. 7 e): P(al menos un as) en 5 cartas.', a: e7e, e: '1 − C(48,5)/C(52,5) = 1 − 0,6588 = 0,3412.' },
        { t: 'num', q: 'Dos cartas sin reposición: ¿probabilidad de que ambas sean reyes?', a: (4 / 52) * (3 / 51), e: '4/52·3/51 = 12/2652 = 0,0045.' },
        { t: 'text', q: '¿Cómo decidís si un problema de conteo se resuelve con permutaciones o con combinaciones?', k: [['orden'], ['permutación', 'permutaciones', 'importa'], ['combinación', 'combinaciones', 'no importa']], e: 'Hay que preguntarse si importa el <b>orden</b>. Si importa (una secuencia, “en ese orden”), son <b>permutaciones</b>; si no importa (un grupo, una mano), son <b>combinaciones</b>. Además se mira si hay reposición.' },
      ],
      sources: [
        { title: 'Apunte: Introducción a la Probabilidad', ref: 'Cátedra, UTN-FRT', points: ['Principio de multiplicación (hoteles, aviones, dado 4 veces, tornillos con sustitución).', 'Urna 3 rojas y 7 blancas con y sin reemplazamiento; lote de 200 con 2 % defectuosos con combinaciones.'] },
        { title: 'Clase 3', ref: 'Prof. Teri', points: ['Cinco cartas en orden: 311.875.200; manos de 5: C(52, 5) = 2.598.960.', '“Un subconjunto ordenado se llama permutación”; combinaciones sin repetición.'] },
      ],
    },
  );
})();
