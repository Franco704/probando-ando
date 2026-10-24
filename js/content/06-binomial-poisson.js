/* Tema 6 (1er parcial): distribuciones Binomial y Poisson. Apunte "Distribuciones de Probabilidad Discreta", clase 6 (Prof. Teri) y TP 3, ejercicios 9 a 17.
   Los valores de tabla se calculan con st.binomCdf y st.poisCdf (los mismos de la página de tablas), redondeados a 4 decimales. */
(() => {
  const { LESSONS, h, st: S } = window.GUIDE;
  const { note, def, table, eq, frac, lab, num, bars, fig } = h;
  const t4 = (v) => num(S.round(v, 4), 4);
  const B = (x, n, p) => S.round(S.binomCdf(n, p, x), 4);
  const Pc = (x, l) => S.round(S.poisCdf(l, x), 4);
  const b = S.binomPmf, po = S.poisPmf;

  LESSONS.push(
    {
      id: 'binomial',
      module: 'u6',
      title: 'Distribución Binomial',
      keywords: 'experimento binomial ensayos de Bernoulli éxito fracaso n p q independientes B(n,p) combinaciones tabla binomial acumulada esperanza np varianza npq',
      tldr: 'Un experimento es <strong>binomial</strong> si tiene <strong>n ensayos fijos</strong>, cada uno con dos resultados (éxito/fracaso), <strong>independientes</strong> y con <strong>p constante</strong>. X = número de éxitos sigue <mark>P(X = x) = C(n, x)·pˣ·qⁿ⁻ˣ</mark>, con q = 1 − p. La tabla da la acumulada B(x; n, p) = P(X ≤ x). Media <mark>E(X) = np</mark>, varianza <mark>V(X) = npq</mark>.',
      goals: ['Reconocer las cuatro condiciones de un experimento binomial.', 'Calcular probabilidades con la fórmula y con la tabla acumulada.', 'Calcular E(X), V(X) y σ de una binomial.'],
      body: `
        <h2>El experimento binomial</h2>
        <p>Muchos experimentos cumplen (exacta o aproximadamente) estas condiciones:</p>
        ${h.flow('Una secuencia de <b>n ensayos</b>, con n fijado antes de empezar.', 'Cada ensayo tiene <b>dos resultados</b> posibles (dicotómico): éxito (E) o fracaso (F).', 'Los ensayos son <b>independientes</b>: uno no influye en los otros.', 'La probabilidad de éxito <b>p es constante</b> de un ensayo a otro; la de fracaso es q = 1 − p.')}
        <p>La variable <strong>X = número de éxitos en los n ensayos</strong> es binomial y se nota X ~ B(n, p). Interesa cuántos éxitos hubo, no en qué ensayos: con n = 3, X(EEF) = 2, X(EFF) = 1.</p>
        ${eq(`P(X = x) = ${frac('n!', 'x!·(n − x)!')} · pˣ · qⁿ⁻ˣ &nbsp;&nbsp; x = 0, 1, …, n`, 'Binomial')}
        <p>C(n, x) cuenta en cuántos órdenes pueden aparecer los x éxitos; pˣqⁿ⁻ˣ es la probabilidad de cada orden.</p>
        <h3>Ejemplo del apunte: la novela</h3>
        <p>El 80 % de los lectores leyó la novela; en un grupo de 4 amigos, P(exactamente 2 la leyeron) = C(4, 2)·0,8²·0,2² = 6·0,64·0,04 = <strong>0,1536</strong>.</p>
        <h3>Ejemplo de la clase: componentes defectuosos</h3>
        <p>5 % defectuosos, lote de 100: P(X = 3) = C(100, 3)·0,05³·0,95⁹⁷ = 161700·0,000125·${num(0.95 ** 97, 4)} = <strong>${t4(b(100, 0.05, 3))}</strong>.</p>
        ${lab(0)}
        <h2>La tabla binomial acumulada</h2>
        <p>La tabla A.1 de Walpole da B(x; n, p) = P(X ≤ x) para n de 1 a 20 (también está en la sección <a href="#/tablas">Tablas</a>). Con ella:</p>
        ${table(['Pedido', 'Con la tabla', 'n = 15, p = 0,2 (apunte)'], [
          ['P(X ≤ 8) “a lo sumo 8”', 'B(8)', t4(S.binomCdf(15, 0.2, 8))],
          ['P(X = 8)', 'B(8) − B(7)', `${t4(S.binomCdf(15, 0.2, 8))} − ${t4(S.binomCdf(15, 0.2, 7))} = ${num(B(8, 15, 0.2) - B(7, 15, 0.2), 4)}`],
          ['P(X ≥ 8) “por lo menos 8”', '1 − B(7)', `1 − ${t4(S.binomCdf(15, 0.2, 7))} = ${num(1 - B(7, 15, 0.2), 4)}`],
          ['P(4 ≤ X ≤ 7)', 'B(7) − B(3)', `${t4(S.binomCdf(15, 0.2, 7))} − ${t4(S.binomCdf(15, 0.2, 3))} = ${num(B(7, 15, 0.2) - B(3, 15, 0.2), 4)}`],
        ])}
        ${note('Traducciones del enunciado: “a lo sumo / cuando mucho / no más de x” = X ≤ x. “Al menos / por lo menos / cuando menos x” = X ≥ x = 1 − B(x − 1). “Más de x” = 1 − B(x). “Menos de x” = B(x − 1).', 'exam')}
        <h2>Media y varianza</h2>
        ${eq('E(X) = n·p &nbsp;&nbsp;&nbsp; V(X) = n·p·q &nbsp;&nbsp;&nbsp; σ = √(npq)', 'Binomial')}
        <p>n = 30, p = 0,5: E = 15, V = 7,5, σ = 2,74. n = 16, p = 0,3: E = 4,8, V = 3,36, σ = 1,83.</p>`,
      labs: [
        { type: 'discrete', title: 'Binomial: mové n y p', intro: 'Con p = 0,5 la distribución es simétrica; con p chico se amontona a la izquierda. Marcá a y b para calcular P(a ≤ X ≤ b) como en la tabla.', dist: 'bin', n: 15, p: 0.2, a: 4, b: 7 },
      ],
      exercises: [
        { title: 'Detener la producción', official: '3.9', level: 2, prompt: '<p>Se revisan 15 unidades por día; P(defectuosa) = 0,05. Se detiene la producción si hay 2 o más defectuosas. ¿Probabilidad de detenerla en un día cualquiera?</p>',
          solution: { explain: `<p>X ~ B(15; 0,05). P(X ≥ 2) = 1 − P(X ≤ 1) = 1 − [P(0) + P(1)] = 1 − [${t4(b(15, 0.05, 0))} + ${t4(b(15, 0.05, 1))}] = <strong>${t4(1 - S.binomCdf(15, 0.05, 1))}</strong>.</p><p>(La tabla de Walpole no tiene p = 0,05: se usa la fórmula.)</p>` } },
        { title: 'Sumas acumuladas con la tabla', official: '3.10', level: 1, prompt: '<p>Con la tabla, P(X ≤ a) para: a) n = 10, p = 0,1, a = 3; b) n = 15, p = 0,6, a = 7; c) n = 20, p = 0,5, a = 14.</p>',
          solution: { explain: `<p>a) B(3; 10; 0,1) = <strong>${t4(S.binomCdf(10, 0.1, 3))}</strong>. b) B(7; 15; 0,6) = <strong>${t4(S.binomCdf(15, 0.6, 7))}</strong>. c) B(14; 20; 0,5) = <strong>${t4(S.binomCdf(20, 0.5, 14))}</strong>.</p>` } },
        { title: 'Fórmula contra tabla', official: '3.11', level: 1, prompt: '<p>Calcular P(X = 3) para n = 5, p = 0,5 con la fórmula y comparar con la tabla.</p>',
          solution: { explain: `<p>Fórmula: C(5,3)·0,5³·0,5² = 10/32 = <strong>0,3125</strong>. Tabla: B(3) − B(2) = ${t4(S.binomCdf(5, 0.5, 3))} − ${t4(S.binomCdf(5, 0.5, 2))} = <strong>0,3125</strong>. Coinciden.</p>` } },
        { title: 'Ocho lecturas de tabla', official: '3.12', level: 2, prompt: '<p>Con la tabla binomial: a) P(X ≤ 5), n = 10, p = 0,4; b) P(X ≥ 17), n = 20, p = 0,5; c) P(X = 5), n = 10, p = 0,4; d) P(X = 4), n = 10, p = 0,5; e) P(X &gt; 5), n = 10, p = 0,4; f) P(X &lt; 5), n = 15, p = 0,4; g) P(X &lt; 5), n = 10, p = 0,4; h) P(X ≥ 15), n = 20, p = 0,3.</p>',
          solution: { explain: `<p>(En la versión digital del TP se perdieron los símbolos ≤ y ≥ de a, b y h; se resuelve la lectura más habitual y se indica la otra.)</p>
            <p>a) B(5; 10; 0,4) = <strong>${t4(S.binomCdf(10, 0.4, 5))}</strong>.</p>
            <p>b) P(X ≥ 17) = 1 − B(16; 20; 0,5) = 1 − ${t4(S.binomCdf(20, 0.5, 16))} = <strong>${num(1 - B(16, 20, 0.5), 4)}</strong> (si fuera ≤ 17: ${t4(S.binomCdf(20, 0.5, 17))}).</p>
            <p>c) B(5) − B(4) = ${t4(S.binomCdf(10, 0.4, 5))} − ${t4(S.binomCdf(10, 0.4, 4))} = <strong>${num(B(5, 10, 0.4) - B(4, 10, 0.4), 4)}</strong>.</p>
            <p>d) B(4; 10; 0,5) − B(3) = ${t4(S.binomCdf(10, 0.5, 4))} − ${t4(S.binomCdf(10, 0.5, 3))} = <strong>${num(B(4, 10, 0.5) - B(3, 10, 0.5), 4)}</strong>.</p>
            <p>e) 1 − B(5; 10; 0,4) = <strong>${num(1 - B(5, 10, 0.4), 4)}</strong>.</p>
            <p>f) B(4; 15; 0,4) = <strong>${t4(S.binomCdf(15, 0.4, 4))}</strong>.</p>
            <p>g) B(4; 10; 0,4) = <strong>${t4(S.binomCdf(10, 0.4, 4))}</strong>.</p>
            <p>h) P(X ≥ 15) = 1 − B(14; 20; 0,3) = <strong>${num(1 - B(14, 20, 0.3), 4)}</strong> (prácticamente 0: con media 6 es casi imposible llegar a 15; si fuera ≤ 15, ≈ 1,0000).</p>` } },
        { title: 'Campaña telefónica', official: '3.13', level: 2, prompt: '<p>Una de cada 20 personas llamadas se une al club. Si 25 personas reciben la llamada, ¿probabilidad de que por lo menos dos se inscriban?</p>',
          solution: { explain: `<p>X ~ B(25; 0,05). P(X ≥ 2) = 1 − [P(0) + P(1)] = 1 − [${t4(b(25, 0.05, 0))} + ${t4(b(25, 0.05, 1))}] = <strong>${t4(1 - S.binomCdf(25, 0.05, 1))}</strong>.</p>` } },
        { title: 'Tiros libres', official: '3.15', level: 2, prompt: '<p>Un basquetbolista encesta el 70 % de los tiros libres. En 14 tiros, probabilidad de que: a) enceste al menos 7; b) falle entre 3 y 6 inclusive; c) falle todos; d) enceste todos.</p>',
          solution: { explain: `<p>X = encestes ~ B(14; 0,7); Y = fallos = 14 − X ~ B(14; 0,3). Como la tabla no siempre tiene p = 0,7, conviene contar fallos.</p>
            <p>a) P(X ≥ 7) = P(Y ≤ 7) = B(7; 14; 0,3) = <strong>${t4(S.binomCdf(14, 0.3, 7))}</strong>.</p>
            <p>b) P(3 ≤ Y ≤ 6) = B(6; 14; 0,3) − B(2; 14; 0,3) = ${t4(S.binomCdf(14, 0.3, 6))} − ${t4(S.binomCdf(14, 0.3, 2))} = <strong>${num(B(6, 14, 0.3) - B(2, 14, 0.3), 4)}</strong>.</p>
            <p>c) P(Y = 14) = 0,3¹⁴ = <strong>${num(0.3 ** 14, 10)}</strong> ≈ 4,8·10⁻⁸.</p>
            <p>d) P(X = 14) = 0,7¹⁴ = <strong>${t4(0.7 ** 14)}</strong>.</p>` } },
      ],
      quiz: [
        { q: '¿Cuál NO es una condición del experimento binomial?', o: ['n fijo', 'ensayos independientes', 'p constante', 'p = 0,5'], a: 3, e: 'p puede ser cualquier valor entre 0 y 1.' },
        { q: 'X ~ B(4; 0,8). P(X = 2) =', o: ['0,64', '0,1536', '0,04', '0,4096'], a: 1, e: '6·0,64·0,04.' },
        { q: '“Por lo menos 8” en la tabla es…', o: ['B(8)', '1 − B(8)', '1 − B(7)', 'B(7)'], a: 2, e: 'P(X ≥ 8) = 1 − P(X ≤ 7).' },
        { q: 'E(X) y V(X) de B(30; 0,5):', o: ['15 y 7,5', '15 y 15', '7,5 y 15', '30 y 0,5'], a: 0, e: 'np y npq.' },
        { q: 'Si p > 0,5 y la tabla no la tiene…', o: ['no se puede calcular', 'se cuentan los fracasos con q = 1 − p', 'se usa Poisson', 'se usa p = 0,5'], a: 1, e: 'P(X ≥ k éxitos) = P(Y ≤ n − k fracasos).' },
        { q: 'Extraer con reposición y contar defectuosos sigue una…', o: ['Poisson', 'Binomial', 'Normal', 'exponencial'], a: 1, e: 'Ensayos independientes con p constante.' },
        { q: 'P(X = x) con la tabla acumulada es…', o: ['B(x)', 'B(x) − B(x − 1)', '1 − B(x)', 'B(x + 1)'], a: 1, e: 'Diferencia de acumuladas.' },
      ],
      open: [
        { t: 'num', q: 'TP 3, ej. 9: probabilidad de detener la producción (n = 15, p = 0,05, dos o más defectuosas).', a: 1 - S.binomCdf(15, 0.05, 1), e: `1 − [P(0) + P(1)] = ${t4(1 - S.binomCdf(15, 0.05, 1))}.` },
        { t: 'num', q: 'TP 3, ej. 13: P(al menos 2 se inscriben) con n = 25 y p = 1/20.', a: 1 - S.binomCdf(25, 0.05, 1), e: `1 − B(1; 25; 0,05) = ${t4(1 - S.binomCdf(25, 0.05, 1))}.` },
        { t: 'num', q: 'X ~ B(10; 0,4). Calculá P(X = 5).', a: b(10, 0.4, 5), e: 'C(10,5)·0,4⁵·0,6⁵ = 252·0,01024·0,07776 = 0,2007.' },
        { t: 'num', q: 'X ~ B(16; 0,3). Calculá el desvío estándar.', a: Math.sqrt(16 * 0.3 * 0.7), e: '√(16·0,3·0,7) = √3,36 = 1,833.' },
        { t: 'text', q: 'Enumerá las condiciones de un experimento binomial.', k: [['n ensayos', 'número fijo', 'n fijo', 'ensayos'], ['dos resultados', 'éxito', 'dicotómico'], ['independientes'], ['p constante', 'probabilidad constante', 'misma probabilidad']], need: 3, e: '1) Un número fijo n de <b>ensayos</b>. 2) Cada ensayo tiene <b>dos resultados</b>: éxito o fracaso. 3) Los ensayos son <b>independientes</b>. 4) La probabilidad de éxito <b>p es constante</b>.' },
      ],
      sources: [
        { title: 'Apunte: Distribuciones de Probabilidad Discreta', ref: 'Cátedra, UTN-FRT', points: ['Condiciones 1 a 4 del experimento binomial y función de masa.', 'Uso de la tabla A.1 de Walpole con n = 15, p = 0,2: 0,9992; 0,0034; 0,0042; 0,3476.'] },
        { title: 'Clase 6: Binomial y Poisson', ref: 'Prof. Teri', points: ['Componentes defectuosos (n = 100, p = 0,05): P(X = 3) ≈ 0,139. Lecturas de tabla: n = 9, p = 0,4 → F(5) = 0,9006; n = 12, p = 0,2.', 'E(X) = np, V(X) = npq.'] },
      ],
    },
    {
      id: 'poisson',
      module: 'u6',
      title: 'Distribución de Poisson',
      keywords: 'Poisson proceso de Poisson lambda promedio por intervalo eventos raros llamadas accidentes errores tabla acumulada E(X) = V(X) = λ binomial o poisson',
      tldr: 'La <strong>Poisson</strong> cuenta cuántos sucesos ocurren en un intervalo de tiempo o región (llamadas por minuto, accidentes por mes, errores por página) cuando se conoce el <strong>promedio λ</strong> por intervalo: <mark>P(X = x) = e^(−λ)·λˣ / x!</mark>, x = 0, 1, 2, … Media y varianza son iguales: <mark>E(X) = V(X) = λ</mark>. Diferencia con la binomial: <strong>no hay n</strong>.',
      goals: ['Reconocer un proceso de Poisson y su parámetro λ.', 'Calcular probabilidades con la fórmula y con la tabla acumulada.', 'Decidir entre Binomial y Poisson a partir del enunciado.'],
      body: `
        <h2>El proceso de Poisson</h2>
        <p>Cuenta resultados en un intervalo de tiempo (un minuto, un día, un año) o una región (una página, un m², un rollo de tela). Propiedades:</p>
        ${h.flow('El número de resultados en un intervalo es <b>independiente</b> del de otro intervalo disjunto: el proceso no tiene memoria.', 'La probabilidad de un resultado en un intervalo muy corto es <b>proporcional</b> a su longitud.', 'La probabilidad de más de un resultado en un intervalo muy corto es <b>insignificante</b>.')}
        ${eq(`P(X = x) = ${frac('e<sup>−λ</sup>·λ<sup>x</sup>', 'x!')} &nbsp;&nbsp; λ &gt; 0, &nbsp; x = 0, 1, 2, …`, 'Poisson')}
        <p>λ es el número <strong>promedio</strong> de resultados por unidad de tiempo, distancia, área o volumen. Si cambia el intervalo, cambia λ en proporción: 3 accidentes por mes son 36 por año.</p>
        <h3>Ejemplos</h3>
        <ul>
          <li>Partículas radiactivas, λ = 4 por milisegundo: P(X = 6) = e⁻⁴·4⁶/6! = <strong>${t4(po(4, 6))}</strong>. Con la tabla: F(6) − F(5) = ${t4(S.poisCdf(4, 6))} − ${t4(S.poisCdf(4, 5))}.</li>
          <li>Camiones-tanque, λ = 10 por día, el puerto aloja 15: P(X &gt; 15) = 1 − F(15) = 1 − ${t4(S.poisCdf(10, 15))} = <strong>${num(1 - Pc(15, 10), 4)}</strong>.</li>
          <li>Servidores, λ = 5 fallos por semana: P(X = 3) = e⁻⁵·5³/3! = <strong>${t4(po(5, 3))}</strong>.</li>
          <li>Tabla con λ = 4: P(2 &lt; X ≤ 8) = F(8) − F(2) = ${t4(S.poisCdf(4, 8))} − ${t4(S.poisCdf(4, 2))} = <strong>${num(Pc(8, 4) - Pc(2, 4), 4)}</strong>.</li>
        </ul>
        ${lab(0)}
        <h2>Media y varianza</h2>
        ${eq('E(X) = V(X) = λ', 'Poisson')}
        <h2>¿Binomial o Poisson?</h2>
        ${table(['Pista en el enunciado', 'Distribución'], [['“de n…”, “se eligen n”, “en n tiros”: un número fijo de ensayos y un porcentaje p', '<strong>Binomial</strong> (n, p)'], ['“en promedio … por minuto/día/página”, sin un total de ensayos', '<strong>Poisson</strong> (λ)']])}
        ${note('Dos resultados de la clase 6 tienen errores de cuenta. Autos (λ = 4): P(X = 2) = e⁻⁴·4²/2! = <b>0,1465</b>, no 0,0732. Piezas (n = 50, p = 0,95): P(X ≥ 47) = <b>' + t4(1 - S.binomCdf(50, 0.95, 46)) + '</b>, no 0,99. Los planteos (Poisson y Binomial) sí son correctos.', 'warn')}`,
      labs: [
        { type: 'discrete', title: 'Poisson: mové λ', intro: 'Con λ chico la distribución se pega al 0; al crecer λ se corre y se ensancha (la varianza también es λ).', dist: 'pois', lambda: 3, a: 0, b: 2 },
      ],
      exercises: [
        { title: 'Lesiones laborales', official: '3.14', level: 1, prompt: '<p>Las lesiones graves en una planta tienen una media anual de 2,7. ¿Probabilidad de que el próximo año haya menos de dos?</p>',
          solution: { explain: `<p>X ~ Poisson(2,7). P(X &lt; 2) = P(0) + P(1) = e⁻²·⁷(1 + 2,7) = ${t4(Math.exp(-2.7))}·3,7 = <strong>${t4(S.poisCdf(2.7, 1))}</strong>.</p>` } },
        { title: 'Accidentes en una intersección', official: '3.16', level: 1, prompt: '<p>En promedio hay 3 accidentes por mes. Probabilidad de que en un mes: a) ocurran exactamente 5; b) ocurran menos de 3.</p>',
          solution: { explain: `<p>a) P(X = 5) = e⁻³·3⁵/5! = <strong>${t4(po(3, 5))}</strong> (tabla: F(5) − F(4) = ${t4(S.poisCdf(3, 5))} − ${t4(S.poisCdf(3, 4))}).</p><p>b) P(X &lt; 3) = F(2) = <strong>${t4(S.poisCdf(3, 2))}</strong>.</p>` } },
        { title: 'Llamadas a un taller', official: '3.17', level: 2, prompt: '<p>Promedio de 1,2 llamadas por minuto. En un minuto, probabilidad de: a) menos de dos; b) más de tres; c) menos de dos o más de tres; d) dos o tres.</p>',
          solution: { explain: `<p>X ~ Poisson(1,2).</p><p>a) P(X &lt; 2) = F(1) = <strong>${t4(S.poisCdf(1.2, 1))}</strong>.</p><p>b) P(X &gt; 3) = 1 − F(3) = 1 − ${t4(S.poisCdf(1.2, 3))} = <strong>${num(1 - Pc(3, 1.2), 4)}</strong>.</p><p>c) Son excluyentes: ${t4(S.poisCdf(1.2, 1))} + ${num(1 - Pc(3, 1.2), 4)} = <strong>${num(Pc(1, 1.2) + 1 - Pc(3, 1.2), 4)}</strong>.</p><p>d) Es el complemento de c): P(2) + P(3) = ${t4(po(1.2, 2))} + ${t4(po(1.2, 3))} = <strong>${num(Pc(3, 1.2) - Pc(1, 1.2), 4)}</strong>.</p>` } },
        { title: 'Correos no deseados (clase)', level: 1, prompt: '<p>Se reciben en promedio 2 correos no deseados por hora. ¿Probabilidad de recibir exactamente 3 en una hora? ¿Binomial o Poisson?</p>',
          solution: { explain: `<p>Poisson: hay un promedio por intervalo y no hay n. P(X = 3) = e⁻²·2³/3! = <strong>${t4(po(2, 3))}</strong>.</p>` } },
      ],
      quiz: [
        { q: 'El parámetro de la Poisson es…', o: ['n y p', 'λ, el promedio por intervalo', 'μ y σ', 'β'], a: 1, e: 'Las tablas de Walpole lo llaman μ.' },
        { q: 'En una Poisson, E(X) y V(X)…', o: ['son iguales a λ', 'E = λ y V = λ²', 'E = np y V = npq', 'no existen'], a: 0, e: 'Media igual a varianza.' },
        { q: 'λ = 4. P(X = 2) =', o: ['0,0732', '0,1465', '0,2381', '0,5'], a: 1, e: 'e⁻⁴·16/2 = 8e⁻⁴.' },
        { q: '“En promedio 5 fallos por semana; ¿probabilidad de 3 fallos?” es…', o: ['Binomial', 'Poisson', 'Normal', 'hipergeométrica'], a: 1, e: 'Promedio por intervalo, sin n.' },
        { q: '“El 95 % de las piezas cumple; se toman 50” es…', o: ['Binomial', 'Poisson', 'exponencial', 'uniforme'], a: 0, e: 'n fijo y p constante.' },
        { q: 'Si en promedio hay 3 accidentes por mes, por año el λ es…', o: ['3', '12', '36', '0,25'], a: 2, e: 'Se escala con el intervalo.' },
        { q: 'Con la tabla de Poisson, P(X > 15) =', o: ['F(15)', '1 − F(15)', '1 − F(14)', 'F(16)'], a: 1, e: '“Más de 15” deja afuera al 15.' },
      ],
      open: [
        { t: 'num', q: 'TP 3, ej. 14: λ = 2,7 lesiones por año. P(menos de dos)?', a: S.poisCdf(2.7, 1), e: `e⁻²·⁷·3,7 = ${t4(S.poisCdf(2.7, 1))}.` },
        { t: 'num', q: 'TP 3, ej. 16 a): λ = 3 accidentes por mes. P(exactamente 5)?', a: po(3, 5), e: `e⁻³·243/120 = ${t4(po(3, 5))}.` },
        { t: 'num', q: 'TP 3, ej. 17 b): λ = 1,2 llamadas por minuto. P(más de tres)?', a: 1 - S.poisCdf(1.2, 3), e: `1 − F(3) = ${num(1 - Pc(3, 1.2), 4)}.` },
        { t: 'num', q: 'Partículas radiactivas: λ = 4 por milisegundo. P(X = 6)?', a: po(4, 6), e: 'e⁻⁴·4096/720 = 0,1042.' },
        { t: 'text', q: '¿Cómo decidís si un problema es Binomial o Poisson?', k: [['n', 'número fijo', 'ensayos'], ['p', 'probabilidad de éxito', 'porcentaje'], ['promedio', 'λ', 'lambda', 'por unidad', 'intervalo']], e: 'Si hay un <b>número fijo n de ensayos</b> con una <b>probabilidad de éxito p</b> constante, es Binomial. Si solo se da un <b>promedio λ por intervalo</b> de tiempo o región (sin n), es Poisson.' },
      ],
      sources: [
        { title: 'Apunte: Distribuciones de Probabilidad Discreta', ref: 'Cátedra, UTN-FRT', points: ['Propiedades del proceso de Poisson y función de probabilidad.', 'Partículas (λ = 4): 0,1042; camiones-tanque (λ = 10): 0,0487 con la tabla A.2.'] },
        { title: 'Clase 6', ref: 'Prof. Teri', points: ['Servidores (λ = 5, x = 3): 0,1404; tabla λ = 4: P(2 < X ≤ 8) = 0,741.', 'E(X) = V(X) = λ. ¿Binomial o Poisson?: autos, correos y piezas.'] },
      ],
    },
  );
})();
