/* Tema 1 (1er parcial): estadística descriptiva, datos y distribuciones de frecuencias. Apunte "Estadística Descriptiva", clase 1 (Prof. Teri) y TP 1, I parte.
   Las tablas y gráficos de las soluciones se calculan con st.js a partir de los datos del TP. */
(() => {
  const { LESSONS, h, st: S } = window.GUIDE;
  const { note, def, table, eq, frac, lab, num, bars, histo, steps, fig } = h;
  const n4 = (v) => num(v, 4);

  // Tabla de frecuencias sin agrupar y su gráfico de barras
  const discTable = (data) => {
    const t = S.freqTable(data);
    return table(['x', 'f', 'fr = f/n', 'F', 'Fr'], t.map((r) => [num(r.x, 2), r.f, n4(r.fr), r.F, n4(r.Fr)]).concat([['<b>Total</b>', `<b>${data.length}</b>`, '<b>1</b>', '', '']]));
  };
  const discBars = (data, xl, cap) => fig(bars({ pts: S.freqTable(data).map((r) => [r.x, r.fr]), yl: 'fr', xl, labels: true, anim: false }), cap);
  // Tabla agrupada y su histograma
  const groupTable = (cl) => {
    const g = S.grouped(cl);
    return table(['Clase [a; b)', 'Marca m', 'f', 'fr', 'F', 'Fr'], g.rows.map((r) => [`[${num(r.a, 2)}; ${num(r.b, 2)})`, num(r.m, 3), r.f, n4(r.fr), r.F, n4(r.Fr)]).concat([['<b>Total</b>', '', `<b>${g.n}</b>`, '<b>1</b>', '', '']]));
  };
  const groupHist = (cl, xl, cap) => { const g = S.grouped(cl); return fig(histo({ cls: g.rows.map((r) => [r.a, r.b, r.fr]), xl, labels: true, anim: false }), cap); };
  const ord = (data) => `<p class="mono">${S.sorted(data).map((x) => num(x, 2)).join(' · ')}</p>`;

  // Datos de los TP
  const E1 = [2, 1, 4, 2, 7, 1, 3, 2, 3, 1, 6, 3, 4, 3, 4, 3, 3, 1, 4, 5, 1, 4, 7, 2, 1, 1, 2, 5, 6, 6];
  const E2 = [4, 3, 5, 6, 1, 0, 3, 2, 4, 0, 3, 1, 2, 3, 5, 3, 2, 4, 5, 0, 3, 2, 4, 0, 5];
  const E3 = [2, 4, 2, 32, 9, 9, 2, 6, 3, 1, 14, 9, 16, 7, 8, 19, 6, 4, 4, 2, 4, 18, 0, 6, 13, 7, 2, 8, 0, 1, 14, 1, 2, 2, 18, 8, 24, 1, 8, 5, 1, 3, 11, 18, 26, 3, 12, 23, 5, 4];
  const E4 = [3.1, 4.2, 2.3, 3.3, 2.8, 5.3, 3.5, 3.1, 2.6, 3.3, 4.7, 3.7, 3.0, 2.6, 4.0, 3.8, 4.4, 3.2, 3.2, 3.8, 5.1, 3.7, 2.3, 4.3, 3.9];
  const E6 = [3.1, 4.9, 2.8, 3.6, 2.5, 4.5, 3.5, 3.7, 4.1, 4.9, 2.9, 2.1, 3.5, 4.0, 3.7, 2.7, 4.0, 4.4, 3.7, 4.2, 3.8, 6.2, 2.5, 2.9, 2.8, 5.1, 1.8, 5.6, 2.2, 3.4, 2.5, 3.6, 5.1, 4.8, 1.6, 3.6, 6.1, 4.7, 3.9, 3.9, 4.3, 5.7, 3.7, 4.6, 4.0, 5.6, 4.9, 4.2, 3.1, 3.9];
  const E7 = [3.6, 1.9, 2.1, 0.3, 0.8, 0.2, 1.0, 1.4, 1.8, 1.6, 1.1, 1.8, 0.3, 1.1, 0.5, 1.2, 0.6, 1.1, 0.8, 1.7, 1.4, 0.2, 1.3, 3.1, 0.4, 2.3, 1.8, 4.5, 0.9, 0.7, 0.6, 2.8, 2.5, 1.1, 0.4, 1.2, 0.4, 1.3, 0.8, 1.3, 1.1, 1.2, 0.8, 1.0, 0.9, 0.7, 3.1, 1.7, 1.1, 2.2, 1.6, 1.9, 5.2, 0.5, 1.8, 0.3, 1.1, 0.6, 0.7, 0.6];
  const E8 = [2.6, 1.8, 2.6, 3.7, 1.9, 2.1, 2.7, 3.0, 2.4, 2.3, 3.1, 2.6, 2.6, 2.5, 2.7, 2.7, 2.9, 3.4, 1.9, 2.3, 3.3, 2.2, 3.5, 3.0, 2.5];
  const C3 = S.makeClasses(E3, 0, 5), C4 = S.makeClasses(E4, 2, 0.5), C6 = S.makeClasses(E6, 1.55, 0.5), C7 = S.makeClasses(E7, 0.2, 0.75), C8 = S.makeClasses(E8, 1.8, 0.4);
  const C9 = [[10, 20, 1], [20, 30, 5], [30, 40, 10], [40, 50, 15], [50, 60, 10], [60, 70, 9]];
  // Ejemplo del apunte: atletas
  const ATL = [0.2, 8.4, 14.3, 6.5, 3.4, 4.6, 9.1, 4.3, 3.5, 1.5, 6.4, 15.2, 16.1, 19.8, 5.4, 12.1, 9.6, 8.7, 12.1, 3.2];
  const sturg = (n) => `k = 1 + 3,322·log(${n}) = ${num(S.sturges(n), 2)}`;

  LESSONS.push(
    {
      id: 'que-es-estadistica',
      module: 'u1',
      title: 'Qué estudia la estadística',
      keywords: 'estadística descriptiva inferencial población muestra individuo variable cualitativa cuantitativa discreta continua datos Achenwall transversalidad',
      tldr: 'La estadística se ocupa de <strong>obtener, ordenar y analizar datos</strong> para explicar y predecir fenómenos. La <mark>descriptiva</mark> resume un conjunto de datos con tablas, gráficos y medidas; la <mark>inferencial</mark> saca conclusiones sobre una <strong>población</strong> a partir de una <strong>muestra</strong>. Toda la materia empieza por clasificar la variable: cualitativa, o cuantitativa discreta (se cuenta) o continua (se mide).',
      goals: ['Distinguir estadística descriptiva e inferencial.', 'Definir individuo, población y muestra con un ejemplo.', 'Clasificar una variable en cualitativa, cuantitativa discreta o continua.'],
      body: `
        <h2>La ciencia de los datos</h2>
        ${def('Estadística', 'Disciplina científica que se ocupa de la obtención, orden y análisis de un conjunto de datos con el fin de obtener explicaciones y predicciones sobre fenómenos observados.', 'Apunte de Estadística Descriptiva')}
        <p>La palabra se atribuye al economista prusiano Gottfried Achenwall (1719–1772), que la entendía como “la ciencia de las cosas que pertenecen al Estado”. Hoy es <strong>transversal</strong>: el mismo método sirve en biología, física, economía, sociología o en sistemas (tiempos de respuesta, fallas de servidores, tráfico de una red).</p>
        <h2>Las dos ramas</h2>
        ${table(['Rama', 'Qué hace', 'Ejemplo'], [
          ['<strong>Descriptiva</strong>', 'Recolecta, organiza, resume y presenta un conjunto de datos con tablas, gráficos y medidas (media, desvío…).', 'Tabla y gráfico de la demanda diaria de un producto durante 30 días.'],
          ['<strong>Inferencial</strong>', 'Hace predicciones y generalizaciones sobre la población a partir de una muestra, midiendo la incertidumbre.', 'Con 36 pasajeros pesados, estimar el peso medio de todos los pasajeros con 95 % de confianza.'],
        ])}
        <p>La descriptiva sirve para una población o para una muestra. La inferencial trabaja <strong>siempre</strong> con muestras: es la segunda mitad de la materia (temas 9 y 10).</p>
        <h2>Individuo, población y muestra</h2>
        <ul>
          <li><strong>Individuo</strong>: cualquier elemento que porta información sobre lo que se estudia (un alumno, una vivienda, un foco).</li>
          <li><strong>Población</strong>: el conjunto de todos los individuos que portan esa información (todas las viviendas de la ciudad). Puede ser <strong>finita</strong> (los libros de una biblioteca) o <strong>infinita</strong> (todos los mamíferos del océano).</li>
          <li><strong>Muestra</strong>: un subconjunto de la población, elegido para que sea representativo (las 20 casas que efectivamente se relevan).</li>
        </ul>
        ${note('En el TP 1 todos los ejercicios trabajan con <strong>una muestra</strong> (n = tamaño de la muestra). Por eso la varianza del tema 2 divide por n − 1.', 'exam')}
        <h2>Tipos de variables</h2>
        <p>Una <strong>variable estadística</strong> es una característica que puede tomar distintos valores que se miden u observan. Hay que clasificarla antes de elegir la tabla y el gráfico:</p>
        ${table(['Tipo', 'Qué mide', 'Ejemplos', 'Gráfico'], [
          ['<strong>Cualitativa</strong> (categórica)', 'Una cualidad, no se mide con números', 'nacionalidad, color, calificación EX/MB/B/R', 'barras o sectores'],
          ['<strong>Cuantitativa discreta</strong>', 'Una cantidad que surge de <strong>contar</strong>: valores enteros', 'errores de carga, celulares por persona, demanda diaria', '<strong>barras</strong> separadas'],
          ['<strong>Cuantitativa continua</strong>', 'Una cantidad que surge de <strong>medir</strong>: cualquier real en un intervalo', 'altura, tiempo de servicio, peso, rédito en %', '<strong>histograma</strong> (barras juntas)'],
        ])}
        ${note('Regla práctica de la clase: “¿lo cuento o lo mido?”. La edad es cuantitativa continua (puede tomar infinitos valores en un continuo), aunque en la práctica se redondee a años.', 'tip')}
        <p>Los <strong>datos</strong> son las respuestas numéricas recopiladas: discretos si vienen de un conteo, continuos si vienen de una medición. Se pueden obtener de fuentes publicadas, diseñando un experimento, haciendo un estudio u observando comportamientos.</p>
        ${lab(0)}`,
      labs: [
        { type: 'classify', title: '¿Qué tipo de variable es?', buckets: ['Cualitativa', 'Cuantitativa discreta', 'Cuantitativa continua'], items: [
          { t: 'Demanda diaria de un producto (en decenas)', b: 1, why: 'Se cuentan unidades.' },
          { t: 'Número de errores de un operador al cargar datos', b: 1, why: 'Conteo: 0, 1, 2…' },
          { t: 'Rédito por dividendo de una acción (%)', b: 2, why: 'Se mide; puede tomar cualquier valor en un intervalo.' },
          { t: 'Tiempo de atención a un cliente (min)', b: 2, why: 'Tiempo: medición.' },
          { t: 'Color de ojos', b: 0, why: 'Una cualidad.' },
          { t: 'Calificación EX, MB, B, R', b: 0, why: 'Categorías (ordinales), no cantidades.' },
          { t: 'Solicitudes de préstamo otorgadas por un banco en un mes', b: 1, why: 'Se cuentan solicitudes.' },
          { t: 'Resistencia al esfuerzo cortante de una soldadura (lb)', b: 2, why: 'Medición física.' },
        ] },
      ],
      quiz: [
        { q: 'La estadística inferencial…', o: ['solo hace tablas y gráficos', 'saca conclusiones sobre una población a partir de una muestra', 'trabaja siempre con toda la población', 'no considera la incertidumbre'], a: 1, e: 'Generaliza de la muestra a la población midiendo la incertidumbre.' },
        { q: 'El número de cuentas de un banco en un momento dado es una variable…', o: ['cualitativa', 'cuantitativa discreta', 'cuantitativa continua', 'no es una variable'], a: 1, e: 'Se cuenta.' },
        { q: 'El peso de la carga de trigo en un vagón es…', o: ['cualitativa', 'discreta', 'continua', 'categórica'], a: 2, e: 'Se mide: cualquier valor real en un rango.' },
        { q: 'Una muestra es…', o: ['el total de individuos', 'un subconjunto de la población', 'un individuo', 'una variable'], a: 1, e: 'Elegida para ser representativa.' },
        { q: 'Los libros de una biblioteca forman una población…', o: ['infinita', 'finita', 'muestral', 'continua'], a: 1, e: 'Tienen una cantidad limitada y conocida.' },
        { q: '¿Qué gráfico corresponde a una variable continua agrupada en clases?', o: ['barras separadas', 'histograma', 'diagrama de Venn', 'árbol'], a: 1, e: 'Barras contiguas cuya base es el intervalo de clase.' },
        { q: 'Los datos discretos surgen de…', o: ['una medición', 'un conteo', 'una opinión', 'un gráfico'], a: 1, e: 'Los continuos, de una medición.' },
      ],
      open: [
        { t: 'text', q: 'Explicá la diferencia entre estadística descriptiva e inferencial.', k: [['describe', 'resume', 'organiza', 'presenta'], ['muestra'], ['población'], ['concluir', 'conclusiones', 'predecir', 'generalizar', 'inferir']], need: 3, e: 'La <b>descriptiva</b> recolecta, organiza, resume y presenta un conjunto de datos (tablas, gráficos, medidas). La <b>inferencial</b> usa una <b>muestra</b> para sacar <b>conclusiones</b> o predicciones sobre la <b>población</b>, teniendo en cuenta la incertidumbre.' },
        { t: 'text', q: '¿Cuál es la diferencia entre una variable cuantitativa discreta y una continua? Dá un ejemplo de cada una.', k: [['contar', 'conteo', 'cuenta', 'enteros'], ['medir', 'medición', 'mide', 'reales', 'intervalo']], e: 'La <b>discreta</b> surge de <b>contar</b> y toma valores enteros (número de errores de carga). La <b>continua</b> surge de <b>medir</b> y puede tomar cualquier valor real en un intervalo (tiempo de servicio, altura).' },
      ],
      sources: [
        { title: 'Apunte: Estadística Descriptiva', ref: 'Cátedra Probabilidad y Estadística, UTN-FRT', points: ['Definición de estadística y ramas descriptiva e inferencial.', 'Individuo, población y muestra; variables cualitativas y cuantitativas; datos discretos y continuos.'] },
        { title: 'Clase 1: Repaso de estadística', ref: 'Prof. Teri', points: ['Clasificación de variables y elección del gráfico: barras para discretas, histograma para continuas agrupadas.'] },
      ],
    },
    {
      id: 'frecuencias-discretas',
      module: 'u1',
      title: 'Tablas de frecuencias y gráfico de barras',
      keywords: 'ordenar datos frecuencia absoluta relativa acumulada tabla de frecuencias gráfico de barras datos discretos sin agrupar',
      tldr: 'Ordenar los datos y contar cuántas veces aparece cada valor da la <strong>frecuencia absoluta f</strong>. Dividiendo por n sale la <strong>relativa fr = f/n</strong>; sumando hacia abajo, las <strong>acumuladas F y Fr</strong>. Con datos discretos se grafica con <mark>barras separadas</mark>, una por valor. Control rápido: Σf = n, Σfr = 1 y la última Fr = 1.',
      goals: ['Ordenar un conjunto de datos y construir la tabla x, f, fr, F, Fr.', 'Responder preguntas del tipo “¿cuántos tienen como máximo…?” con la acumulada.', 'Graficar frecuencias relativas con barras y la acumulada como escalera.'],
      body: `
        <h2>Del montón de datos a la tabla</h2>
        <p>El apunte parte de 150 respuestas a una encuesta (escala de 1 a 9). Así, en bruto, es difícil saber cuántas personas respondieron, cuál fue la respuesta más frecuente o cuántos están en desacuerdo. Hay tres pasos que ordenan todo:</p>
        ${h.flow('<b>Ordenar</b> de menor a mayor: no se pierde información, solo cambia el orden.', '<b>Contar</b> cada valor distinto: la <b>frecuencia absoluta f</b>.', '<b>Acumular</b>: F suma todas las f desde el primer valor hasta el actual.', '<b>Relativizar</b>: fr = f/n y Fr = F/n (proporciones del total).')}
        ${table(['x', 'f', 'fr', 'F', 'Fr'], [[1, 6, '0,0400', 6, '0,0400'], [2, 11, '0,0733', 17, '0,1133'], [3, 12, '0,0800', 29, '0,1933'], [4, 30, '0,2000', 59, '0,3933'], [5, 40, '0,2667', 99, '0,6600'], [6, 25, '0,1667', 124, '0,8267'], [7, 14, '0,0933', 138, '0,9200'], [8, 9, '0,0600', 147, '0,9800'], [9, 3, '0,0200', 150, '1,0000'], ['<b>Total</b>', '<b>150</b>', '<b>1</b>', '', '']])}
        <p>Ahora las preguntas se leen en la tabla: fueron <strong>150</strong> encuestados (Σf), la respuesta más frecuente fue <strong>5</strong> (40 veces) y <strong>59</strong> personas respondieron como máximo 4 (F de x = 4).</p>
        ${eq(`f<sub>r</sub> = ${frac('f', 'n')} &nbsp;&nbsp;&nbsp; F<sub>r</sub> = ${frac('F', 'n')}`, 'Frecuencias relativas')}
        ${note('Chequeos que no fallan: la suma de las f es n, la suma de las fr es 1 y la última F (o Fr) vale n (o 1). Si no te da, contaste mal.', 'tip')}
        <h2>Gráfico de barras</h2>
        <p>Para datos <strong>discretos</strong> se usa el gráfico de barras: cada barra vertical representa un valor, su altura es la frecuencia y entre barras queda espacio (no hay valores intermedios). La suma de las alturas de fr es 1, el 100 % de los datos. La frecuencia relativa acumulada se dibuja como una <strong>escalera</strong> que sube en cada valor y termina en 1.</p>
        ${lab(0)}
        <h2>Ejemplo de la clase: celulares</h2>
        <p>En la clase 1 se tabuló el número de celulares de 20 personas (valores 25 a 35). Se calcula fr = f/20 y se acumula: por ejemplo x = 28 tiene f = 3, fr = 0,15 y Fr = 0,45 (el 45 % tiene 28 o menos).</p>`,
      labs: [
        { type: 'freq', title: 'Tabla y gráfico de un conjunto discreto', intro: 'Datos del TP 1, ejercicio 1 (demanda diaria en decenas). Cambiá algún dato y mirá cómo se rehace la tabla; pasá a la acumulada para ver la escalera.', data: E1, kind: 'disc', xl: 'demanda' },
      ],
      exercises: [
        { title: 'Demanda diaria de un producto', official: '1.1', level: 1, prompt: `<p>Demanda diaria (en decenas) de un producto durante 30 días:</p><p class="mono">${E1.join(' ')}</p><p>a) ¿Qué tipo de datos son? b) Ordenarlos. c) ¿Cuántos valores distintos hay y cuántas veces se repite cada uno? d) Tabular. e) Frecuencia relativa. f) Relativa acumulada. g) Graficar las frecuencias relativas.</p>`,
          solution: { explain: `<p>a) Cuantitativos <strong>discretos</strong>: se cuentan unidades (decenas de productos).</p><p>b) Ordenados:</p>${ord(E1)}<p>c) Hay <strong>${S.freqTable(E1).length} valores distintos</strong> (1 a 7); las repeticiones son las f de la tabla. d), e) y f):</p>${discTable(E1)}${discBars(E1, 'demanda', 'g) Barras de frecuencia relativa: el valor más frecuente es 1 (7 días) y la demanda baja hacia 7.')}` } },
        { title: 'Errores de 25 operadores', official: '1.2', level: 1, prompt: `<p>Número de errores cometidos por 25 operadores de computación durante la carga de datos:</p><p class="mono">${E2.join(' ')}</p><p>a) Tipo de datos. b) Ordenar. c) Valores distintos y repeticiones. d) Tabular. e) Frecuencia relativa. f) Graficar.</p>`,
          solution: { explain: `<p>a) Cuantitativos <strong>discretos</strong> (conteo de errores).</p><p>b)</p>${ord(E2)}<p>c) ${S.freqTable(E2).length} valores distintos, de 0 a 6. d) y e):</p>${discTable(E2)}${discBars(E2, 'errores', 'f) El valor más frecuente es 3 errores (6 operadores, fr = 0,24).')}` } },
      ],
      quiz: [
        { q: 'Si n = 20 y un valor aparece 3 veces, su frecuencia relativa es…', o: ['3', '0,15', '0,3', '20/3'], a: 1, e: 'fr = f/n = 3/20.' },
        { q: 'La frecuencia acumulada F de un valor es…', o: ['su frecuencia absoluta', 'la suma de las frecuencias de todos los valores hasta él inclusive', 'la frecuencia del valor siguiente', 'f/n'], a: 1, e: 'Por eso responde “¿cuántos tienen como máximo x?”.' },
        { q: 'La suma de todas las frecuencias relativas da…', o: ['n', '100', '1', 'depende de los datos'], a: 2, e: 'Representan el 100 % de los datos.' },
        { q: 'En la tabla del apunte (F(4) = 59, n = 150), ¿cuántos respondieron más de 4?', o: ['59', '91', '40', '150'], a: 1, e: '150 − 59 = 91.' },
        { q: 'El gráfico de barras se usa para datos…', o: ['continuos agrupados', 'discretos', 'cualquier dato', 'acumulados únicamente'], a: 1, e: 'Las barras quedan separadas porque no hay valores intermedios.' },
        { q: 'La última frecuencia relativa acumulada siempre vale…', o: ['0', '0,5', '1', 'n'], a: 2, e: 'Acumula todos los datos.' },
      ],
      open: [
        { t: 'num', q: `Con los datos del TP 1, ej. 1 (demanda diaria), ¿qué proporción de los días la demanda fue de 3 decenas o menos? (Fr de x = 3)`, a: S.freqTable(E1).find((r) => r.x === 3).Fr, e: `F(3) = ${S.freqTable(E1).filter((r) => r.x <= 3).map((r) => r.f).join(' + ')} = ${S.freqTable(E1).find((r) => r.x === 3).F} días de 30 → Fr = ${n4(S.freqTable(E1).find((r) => r.x === 3).Fr)}.` },
        { t: 'num', q: 'En el TP 1, ej. 2 (errores de 25 operadores), ¿cuál es la frecuencia relativa del valor 0?', a: 4 / 25, e: 'Cuatro operadores no cometieron errores: fr = 4/25 = 0,16.' },
        { t: 'num', q: 'En la tabla del apunte (n = 150), el valor 5 tiene f = 40. ¿Cuál es su frecuencia relativa?', a: 40 / 150, e: 'fr = 40/150 = 0,2667.' },
      ],
      sources: [
        { title: 'Apunte: Estadística Descriptiva', ref: 'Cátedra, UTN-FRT', points: ['Tablas 1 a 4 de la encuesta de 150 personas: ordenar, frecuencia absoluta, acumulada y relativas.', 'El gráfico de barras para datos discretos; la suma de las alturas es el 100 %.'] },
        { title: 'Clase 1: Repaso TP 1, 1.ª parte', ref: 'Prof. Teri', points: ['Tabla de celulares (25 a 35) con f, fr y Fr; gráfico de barras y de la acumulada.'] },
      ],
    },
    {
      id: 'datos-agrupados',
      module: 'u1',
      title: 'Datos agrupados: intervalos de clase e histograma',
      keywords: 'intervalos de clase Sturges amplitud rango marca de clase histograma polígono de frecuencias datos continuos agrupados límites',
      tldr: 'Con datos <strong>continuos</strong> (o con muchos valores discretos) se agrupa en <strong>clases</strong> [a; b) de igual amplitud. El número de clases sale de la tabla de la cátedra o de <mark>Sturges: k = 1 + 3,322·log n</mark>; la amplitud es <mark>R/k</mark> (rango sobre k). Cada clase se representa por su <strong>marca</strong> (punto medio) y se grafica con un <strong>histograma</strong>: barras contiguas, sin espacios.',
      goals: ['Calcular rango, número de clases (Sturges) y amplitud.', 'Armar los intervalos de clase con sus marcas y frecuencias.', 'Construir el histograma y discutir datos agrupados contra sin agrupar.'],
      body: `
        <h2>Cuándo agrupar</h2>
        <p>Si la variable es continua, casi no hay valores repetidos: una tabla “valor por valor” sería tan larga como los datos. Se agrupa en <strong>intervalos de clase</strong>. También conviene agrupar datos discretos cuando hay muchos valores distintos (TP 1, ej. 3: de 0 a 32 solicitudes).</p>
        <h2>Los pasos del apunte</h2>
        ${h.flow('<b>Rango</b>: R = dato mayor − dato menor.', '<b>Número de clases k</b>: por la tabla (10 a 100 datos → 4 a 8 clases; 100 a 1000 → 8 a 11; 1000 a 10000 → 11 a 20) o por Sturges.', '<b>Amplitud</b>: A = R/k, redondeada a un valor cómodo. Es la misma para todas las clases.', '<b>Límites</b>: la primera clase empieza en el mínimo o un poco antes; cada límite superior es el inferior de la siguiente. La primera contiene al menor dato y la última al mayor.', '<b>Contar</b> los datos de cada clase [a; b) y calcular marca, f, fr, F y Fr.')}
        ${eq('k = 1 + 3,322 · log n &nbsp;&nbsp;&nbsp; A = R / k', 'Sturges y amplitud')}
        ${eq(`m<sub>i</sub> = ${frac('a<sub>i</sub> + b<sub>i</sub>', '2')}`, 'Marca de clase')}
        <p>La <strong>marca de clase</strong> es el punto medio del intervalo y representa a todos sus datos en los cálculos del tema 2.</p>
        <h3>Ejemplo del apunte: kilos que bajaron 20 atletas</h3>
        <p class="mono">${ATL.map((x) => num(x, 1)).join(' · ')}</p>
        <p>R = 19,8 − 0,2 = 19,6. Sturges: ${sturg(20)} → k = 5. A = 19,6/5 = 3,92 → 4. Clases desde 0:</p>
        ${groupTable(S.makeClasses(ATL, 0, 4))}
        ${groupHist(S.makeClasses(ATL, 0, 4), 'kg', 'Histograma: la superficie de cada barra es proporcional a la frecuencia. Sin espacios entre clases (salvo una clase vacía).')}
        ${note('Convención de los intervalos: [a; b) incluye el límite inferior y excluye el superior. Un dato que cae justo en un límite va a la clase de la derecha. Escribilo así en el parcial para que no haya ambigüedad.', 'warn')}
        <h2>Histograma y polígono de frecuencias</h2>
        <p>En el eje horizontal van los <strong>límites</strong> de las clases; cada clase es una columna cuya base cubre el intervalo y cuya altura es f o fr. Uniendo los puntos medios de los techos (las marcas) se obtiene el <strong>polígono de frecuencias</strong>. La acumulada agrupada (ojiva) se dibuja uniendo los límites superiores con su Fr.</p>
        ${lab(0)}
        <h2>¿Agrupar o no agrupar?</h2>
        <p>Agrupar <strong>pierde información</strong>: después solo se sabe en qué clase cae cada dato, no su valor exacto. Por eso las medidas calculadas con datos agrupados son <strong>aproximadas</strong> (tema 2). Se gana una visión clara de la forma de la distribución. La recomendación de la clase: si los datos vienen sueltos, calculá media y desvío <strong>sin agrupar</strong>; agrupá para la tabla y el gráfico cuando son continuos o muchos discretos.</p>
        ${note('Con pocas clases el histograma esconde la forma; con demasiadas aparecen huecos y picos que son ruido. El TP 1, ej. 17 compara 10 y 20 clases con los mismos datos.', 'exam')}`,
      labs: [
        { type: 'freq', title: 'Construí las clases', intro: 'Datos del TP 1, ejercicio 3 (solicitudes de préstamo de 50 bancos). Probá amplitudes 3, 5 y 8 y mirá cómo cambia el histograma. Sturges sugiere k ≈ 7.', data: E3, kind: 'cont', start: 0, w: 5, xl: 'solicitudes' },
      ],
      exercises: [
        { title: 'Solicitudes de préstamo en 50 bancos', official: '1.3', level: 2, prompt: `<p>Número de solicitudes de préstamo otorgadas en un mes por 50 bancos:</p><p class="mono">${E3.join(' ')}</p><p>a) Ordenar. b) Construir intervalos con una amplitud adecuada. c) Tabular con la frecuencia absoluta. d) Relativa. e) Relativa acumulada. f) Histograma de frecuencias relativas.</p>`,
          solution: { explain: `<p>a)</p>${ord(E3)}<p>b) R = 32 − 0 = 32. ${sturg(50)} → 7 clases; A = 32/7 ≈ 4,6 → <strong>5</strong>, desde 0.</p><p>c), d) y e):</p>${groupTable(C3)}${groupHist(C3, 'solicitudes', 'f) Muy asimétrica a la derecha: la mayoría de los bancos otorgó menos de 10 solicitudes.')}<p>Otra amplitud razonable (4 o 6) también es correcta si cubre todos los datos con 5 a 8 clases.</p>` } },
        { title: 'Rédito por dividendo de 25 acciones', official: '1.4', level: 2, prompt: `<p>Réditos por dividendo (%) de 25 acciones comunes de banco:</p><p class="mono">${E4.map((x) => num(x, 1)).join(' ')}</p><p>a) Tipo de datos. b) Ordenar. c) Menor y mayor valor. d) Intervalos de amplitud 0,5. e) y f) Tabular con la frecuencia absoluta. g) Relativa. h) Relativa acumulada. i) Gráfico.</p>`,
          solution: { explain: `<p>a) Cuantitativos <strong>continuos</strong> (un porcentaje medido).</p><p>b)</p>${ord(E4)}<p>c) Menor: <strong>2,3</strong>; mayor: <strong>5,3</strong>. d) Con amplitud 0,5 desde 2,0:</p>${groupTable(C4)}${groupHist(C4, 'rédito %', 'i) Histograma: la mayoría de los réditos está entre 3 % y 4 %.')}` } },
        { title: 'El mismo rédito sin agrupar', official: '1.5', level: 2, prompt: '<p>Resolvé el ejercicio anterior sin agrupar los datos: a) frecuencias relativa y relativa acumulada; b) gráfico. Compará: ¿qué conviene, agrupar o no? ¿Por qué?</p>',
          solution: { explain: `${discTable(E4)}${discBars(E4, 'rédito %', 'Sin agrupar: casi todas las barras miden 1/25 o 2/25 y la forma no se ve.')}<p><strong>Comparación</strong>: sin agrupar hay ${S.freqTable(E4).length} valores distintos para 25 datos, casi todos con f = 1 o 2: la tabla es larga y el gráfico no muestra la forma. Agrupados en 7 clases se ve dónde se concentran (3 a 4 %). Para datos continuos conviene <strong>agrupar para describir y graficar</strong>; para calcular media y desvío exactos conviene usar los datos sueltos.</p>` } },
        { title: 'Clases de amplitud 0,5 desde 1,55', official: '1.6', level: 2, prompt: `<p>Con los 50 datos:</p><p class="mono">${E6.map((x) => num(x, 1)).join(' ')}</p><p>a) Construir clases de amplitud 0,5 empezando en 1,55 (1,55 a 2,05; 2,05 a 2,55; …). b) Frecuencias absolutas y relativas. c) Histograma de frecuencias relativas.</p>`,
          solution: { explain: `<p>Empezar en 1,55 (con un decimal más que los datos) evita que algún dato caiga justo en un límite.</p>${groupTable(C6)}${groupHist(C6, 'x', 'Distribución aproximadamente simétrica con centro cerca de 3,8.')}` } },
        { title: 'Tiempos de servicio en un supermercado', official: '1.7', level: 2, prompt: `<p>Tiempos de servicio (min) de 60 clientes:</p><p class="mono">${E7.map((x) => num(x, 1)).join(' ')}</p><p>a) Ordenar. b) Menor y mayor valor. c) Intervalos con amplitud adecuada. d) Frecuencia absoluta. e) Relativa. f) Relativa acumulada. g) Histograma.</p>`,
          solution: { explain: `<p>a)</p>${ord(E7)}<p>b) Menor <strong>0,2</strong> min; mayor <strong>5,2</strong> min (el enunciado dice “rédito” por error: es el tiempo mayor).</p><p>c) R = 5,0. ${sturg(60)} → 7 clases; A = 5/7 ≈ 0,71 → <strong>0,75</strong>, desde 0,2:</p>${groupTable(C7)}${groupHist(C7, 'minutos', `g) Muy asimétrica a la derecha: el ${num(((C7[0][2] + C7[1][2] + C7[2][2]) / 60) * 100, 0)} % se atiende en menos de 2,45 minutos y unos pocos tardan mucho.`)}<p>Para la cadena: dimensionar los mostradores por el tiempo típico (≈ 1 min) pero prever la cola larga de clientes lentos.</p>` } },
        { title: 'Promedios de 25 estudiantes', official: '1.8', level: 1, prompt: `<p>Promedios de calificaciones de 25 estudiantes de Sistemas:</p><p class="mono">${E8.map((x) => num(x, 1)).join(' ')}</p><p>Construir un histograma de frecuencias relativas.</p>`,
          solution: { explain: `<p>R = 3,7 − 1,8 = 1,9. ${sturg(25)} → 5 o 6 clases; A ≈ 0,38 → <strong>0,4</strong>, desde 1,8:</p>${groupTable(C8)}${groupHist(C8, 'promedio', `La clase [2,6; 3,0) es la más frecuente: ${C8[2][2]} de 25 estudiantes (${num((C8[2][2] / 25) * 100, 0)} %).`)}` } },
        { title: 'Tabla dada: ¿continua o discreta?', official: '1.9', level: 2, prompt: '<p>Clases 10–20, 20–30, …, 60–70 con frecuencias 1, 5, 10, 15, 10, 9 (total 50). Determinar las frecuencias relativas y relativas acumuladas, construir el histograma. ¿Puede tratarse de una variable continua? ¿Y discreta? ¿Por qué?</p>',
          solution: { explain: `${groupTable(C9)}${groupHist(C9, 'x', 'La clase modal es [40; 50).')}<p><strong>Continua</strong>: sí, es lo natural; los intervalos contiguos cubren todos los reales entre 10 y 70.</p><p><strong>Discreta</strong>: también puede ser: una variable de conteo con muchos valores (por ejemplo, entre 10 y 69 unidades) se agrupa en clases para resumirla, como en el ej. 3. La tabla sola no permite saberlo: hay que conocer cómo se obtuvieron los datos (¿se contaron o se midieron?).</p>` } },
      ],
      quiz: [
        { q: 'Con n = 50 datos, Sturges da…', o: ['k ≈ 3,3', 'k ≈ 6,6', 'k ≈ 50', 'k ≈ 16,6'], a: 1, e: '1 + 3,322·log 50 = 1 + 3,322·1,699 = 6,64 → 7 clases.' },
        { q: 'La marca de clase de [2,75; 3,25) es…', o: ['2,75', '3', '3,25', '0,5'], a: 1, e: '(2,75 + 3,25)/2 = 3.' },
        { q: 'La amplitud de clase se calcula como…', o: ['n/k', 'R/k', 'k/R', 'R·k'], a: 1, e: 'Rango sobre número de clases, redondeado.' },
        { q: 'En el intervalo [20; 30), el valor 30…', o: ['pertenece a esa clase', 'pertenece a la clase siguiente', 'no se cuenta', 'se reparte entre las dos'], a: 1, e: 'El límite superior está abierto.' },
        { q: 'En un histograma las barras…', o: ['van separadas', 'van juntas, con base en el intervalo de clase', 'tienen todas la misma altura', 'representan valores puntuales'], a: 1, e: 'Solo hay hueco si una clase tiene f = 0.' },
        { q: 'Al agrupar datos…', o: ['se gana precisión', 'se pierde información: las medidas quedan aproximadas', 'no cambia nada', 'aumenta n'], a: 1, e: 'Cada dato se reemplaza por su marca de clase.' },
        { q: 'Según la tabla de la cátedra, para 10 a 100 datos conviene usar…', o: ['2 o 3 clases', '4 a 8 clases', '11 a 20 clases', '50 clases'], a: 1, e: '100 a 1000 datos: 8 a 11; 1000 a 10000: 11 a 20.' },
      ],
      open: [
        { t: 'num', q: '¿Cuántas clases sugiere Sturges para n = 20 datos? (valor sin redondear)', a: S.sturges(20), tol: 0.005, e: 'k = 1 + 3,322·log 20 = 1 + 3,322·1,301 = 5,32 → 5 clases.' },
        { t: 'num', q: 'En el TP 1, ej. 3 con clases de amplitud 5 desde 0, ¿cuál es la frecuencia relativa acumulada de la clase [5; 10)?', a: S.grouped(C3).rows[1].Fr, e: `Clase [0; 5): ${C3[0][2]} bancos; [5; 10): ${C3[1][2]}. F = ${C3[0][2] + C3[1][2]} → Fr = ${C3[0][2] + C3[1][2]}/50 = ${n4((C3[0][2] + C3[1][2]) / 50)}.` },
        { t: 'num', q: 'En el ejemplo de los atletas (R = 19,6 y k = 5), ¿cuál es la amplitud exacta antes de redondear?', a: 3.92, e: 'A = 19,6/5 = 3,92 → se redondea a 4.' },
        { t: 'text', q: '¿Qué se gana y qué se pierde al agrupar los datos en intervalos de clase?', k: [['forma', 'resumen', 'visión', 'claridad', 'condensar'], ['pierde', 'pérdida'], ['aproximad', 'marca de clase', 'exact']], need: 2, e: 'Se gana un <b>resumen</b> claro de la <b>forma</b> de la distribución. Se <b>pierde</b> información: cada dato se reemplaza por la <b>marca de clase</b>, así que las medidas calculadas quedan <b>aproximadas</b>.' },
      ],
      sources: [
        { title: 'Apunte: Estadística Descriptiva', ref: 'Cátedra, UTN-FRT', points: ['Pasos para construir la tabla de una variable continua: número de intervalos (tabla o Sturges), amplitud L = R/k, límites y marca de clase.', 'Ejemplo de los atletas: R = 19,6, k = 5, L = 4. Histograma sin espacios entre clases.'] },
        { title: 'Clase 1: histograma de alturas', ref: 'Prof. Teri', points: ['Tabla [1,63; 1,67) … [1,83; 1,87) con f, fr y Fr y su histograma: “sabemos que los datos son continuos”.'] },
      ],
    },
  );
})();
