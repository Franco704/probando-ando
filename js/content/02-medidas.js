/* Tema 2 (1er parcial): medidas de posición y de dispersión. Apunte "Medidas de Centralización y Dispersión", clase 2 (Prof. Teri) y TP 1, II parte.
   Los desarrollos (sumas, posiciones, interpolaciones) se generan con st.js a partir de los datos del TP. */
(() => {
  const { LESSONS, h, st: S } = window.GUIDE;
  const { note, def, table, eq, frac, lab, num, histo, fig } = h;
  const n4 = (v) => num(v, 4);

  // Desarrollo completo con datos sin agrupar
  function loose(data, unit = '') {
    const s = S.sorted(data), n = data.length, m = S.mean(data), v = S.variance(data), mo = S.modes(data);
    const pos = (n + 1) / 2;
    const med = n % 2 ? `posición (n + 1)/2 = ${num(pos, 1)} → Me = <strong>${num(S.median(data), 4)}</strong>` : `posición (n + 1)/2 = ${num(pos, 1)}: promedio de los datos ${n / 2}.º y ${n / 2 + 1}.º → Me = (${num(s[n / 2 - 1], 3)} + ${num(s[n / 2], 3)})/2 = <strong>${num(S.median(data), 4)}</strong>`;
    const t = S.freqTable(data);
    const tabulated = t.length < n;
    return `<p>Ordenados (n = ${n}):</p><p class="mono">${s.map((x) => num(x, 3)).join(' · ')}</p>
      <p><b>Media</b>: x̄ = Σx/n = ${num(S.sum(data), 4)}/${n} = <strong>${num(m, 4)}</strong>${unit}.</p>
      <p><b>Mediana</b>: ${med}.</p>
      <p><b>Moda</b>: ${mo.length ? `${mo.map((x) => num(x, 3)).join(' y ')} (${S.modeName(mo)}${tabulated ? `, f = ${Math.max(...t.map((r) => r.f))}` : ''})` : 'no tiene: ningún valor se repite más que otro (amodal)'}.</p>
      ${tabulated ? table(['x', 'f', 'x − x̄', '(x − x̄)²·f'], t.map((r) => [num(r.x, 3), r.f, num(r.x - m, 4), num((r.x - m) ** 2 * r.f, 4)]).concat([['<b>Σ</b>', n, '', `<b>${num(S.sum(t.map((r) => (r.x - m) ** 2 * r.f)), 4)}</b>`]]))
        : table(['x', 'x − x̄', '(x − x̄)²'], data.map((x) => [num(x, 3), num(x - m, 4), num((x - m) ** 2, 4)]).concat([['<b>Σ</b>', '0', `<b>${num(v * (n - 1), 4)}</b>`]]))}
      <p><b>Varianza</b>: s² = Σ(x − x̄)²/(n − 1) = ${num(v * (n - 1), 4)}/${n - 1} = <strong>${num(v, 4)}</strong>${unit ? `${unit}²` : ''}.</p>
      <p><b>Desvío estándar</b>: s = √${num(v, 4)} = <strong>${num(Math.sqrt(v), 4)}</strong>${unit}.</p>`;
  }
  // Desarrollo completo con datos agrupados
  function grouped(cl, unit = '') {
    const g = S.grouped(cl), A = cl[0][1] - cl[0][0];
    const M = g.rows[g.medIdx], Mo = g.rows[g.modeIdx];
    return `${table(['Clase', 'm', 'f', 'F', 'm·f', '(m − x̄)²·f'], g.rows.map((r, i) => [`[${num(r.a, 3)}; ${num(r.b, 3)})${i === g.medIdx ? ' ← Me' : ''}${i === g.modeIdx ? ' ← Mo' : ''}`, num(r.m, 3), r.f, r.F, num(r.m * r.f, 4), num((r.m - g.mean) ** 2 * r.f, 4)])
      .concat([['<b>Σ</b>', '', `<b>${g.n}</b>`, '', `<b>${num(S.sum(g.rows.map((r) => r.m * r.f)), 4)}</b>`, `<b>${num(S.sum(g.rows.map((r) => (r.m - g.mean) ** 2 * r.f)), 4)}</b>`]]))}
      <p><b>Media</b>: x̄ = Σm·f/n = ${num(S.sum(g.rows.map((r) => r.m * r.f)), 4)}/${g.n} = <strong>${num(g.mean, 4)}</strong>${unit}.</p>
      <p><b>Mediana</b>: n/2 = ${num(g.n / 2, 1)} cae en [${num(M.a, 3)}; ${num(M.b, 3)}) (la primera F que llega a ${num(g.n / 2, 1)}). Me = L + A·(n/2 − F<sub>i−1</sub>)/f<sub>i</sub> = ${num(M.a, 3)} + ${num(A, 3)}·(${num(g.n / 2, 1)} − ${g.Fprev})/${M.f} = <strong>${num(g.median, 4)}</strong>${unit}.</p>
      <p><b>Moda</b>: clase modal [${num(Mo.a, 3)}; ${num(Mo.b, 3)}) (f = ${Mo.f}). Mo = L + A·f<sub>i+1</sub>/(f<sub>i−1</sub> + f<sub>i+1</sub>) = ${num(Mo.a, 3)} + ${num(A, 3)}·${g.fn}/(${g.fp} + ${g.fn}) = <strong>${num(g.mode, 4)}</strong>${unit}.</p>
      <p><b>Varianza</b>: s² = Σ(m − x̄)²·f/(n − 1) = ${num(g.var * (g.n - 1), 4)}/${g.n - 1} = <strong>${num(g.var, 4)}</strong>. <b>Desvío</b>: s = <strong>${num(g.sd, 4)}</strong>${unit}.</p>`;
  }
  const hist = (cl, xl, cap) => { const g = S.grouped(cl); return fig(histo({ cls: g.rows.map((r) => [r.a, r.b, r.fr]), xl, labels: true, anim: false }), cap); };

  const CALLS = [84, 91, 72, 68, 87, 78];
  const E10 = [2, 9, 11, 5, 6, 13, 15, 8];
  const E11 = [50, 48.5, 70.2, 61.1, 50.5, 78, 49, 64.3, 73.7, 44.8, 57.4, 63.6];
  const E12 = [20, 10, 40, 20, 70, 10, 30, 20, 30, 10, 60, 30, 40, 30, 40, 30, 30, 10, 40, 50, 10, 40, 70, 20, 10, 10, 20, 50, 60, 60];
  const E13 = [4, 3, 5, 6, 1, 0, 3, 2, 4, 0, 3, 1, 2, 3, 5, 3, 2, 4, 5, 0, 3, 2, 4, 0, 5];
  const E13b = [...E13.slice(0, -1), 15];
  const C11 = S.makeClasses(E11, 44, 7);
  const C14 = [[10, 20, 1], [20, 30, 5], [30, 40, 8], [40, 50, 15], [50, 60, 10], [60, 70, 9], [70, 80, 2]];
  const C15 = [[2.25, 2.75, 4], [2.75, 3.25, 6], [3.25, 3.75, 5], [3.75, 4.25, 5], [4.25, 4.75, 3], [4.75, 5.25, 1], [5.25, 5.75, 1]];
  const C16 = [[1, 2, 20], [2, 3, 19], [3, 4, 17], [4, 5, 13], [5, 6, 11], [6, 7, 9], [7, 8, 5], [8, 9, 4], [9, 10, 2]];
  const E17 = [5434, 4948, 4521, 4570, 4990, 5702, 5241, 5112, 5015, 4659, 4806, 4637, 5670, 4381, 4820, 5043, 4886, 4599, 5288, 5299, 4848, 5378, 5260, 5055, 5828, 5218, 4859, 4780, 5027, 5008, 4609, 4772, 5133, 5095, 4618, 4848, 5089, 5518, 5333, 5164, 5342, 5069, 4755, 4925, 5001, 4803, 4951, 5679, 5256, 5207, 5621, 4918, 5138, 4786, 4500, 5461, 5049, 4974, 4592, 4173, 5296, 4965, 5170, 4740, 5173, 4568, 5653, 5078, 4900, 4968, 5248, 5245, 4723, 5275, 5419, 5205, 4452, 5227, 5555, 5388, 5498, 4681, 5076, 4774, 4931, 4493, 5309, 5582, 4308, 4823, 4417, 5364, 5640, 5069, 5188, 5764, 5273, 5042, 5189, 4986];
  const AGES = [[0, 10, 3], [10, 20, 6], [20, 30, 7], [30, 40, 12], [40, 50, 3]];
  const gA = S.grouped(AGES), g11 = S.grouped(C11);

  LESSONS.push(
    {
      id: 'media-mediana-moda',
      module: 'u2',
      title: 'Media, mediana y moda',
      keywords: 'medidas de tendencia central posición media aritmética promedio mediana moda amodal unimodal bimodal multimodal centro de gravedad datos atípicos',
      tldr: 'Las medidas de <strong>tendencia central</strong> resumen los datos en un valor representativo. La <mark>media x̄ = Σx/n</mark> es el punto de equilibrio (Σ(x − x̄) = 0) pero se deja arrastrar por los atípicos. La <mark>mediana</mark> es el dato del medio de la muestra ordenada, posición (n + 1)/2. La <mark>moda</mark> es el valor más repetido y puede no existir o no ser única.',
      goals: ['Calcular media, mediana y moda de datos sueltos y tabulados.', 'Explicar por qué la media es el centro de gravedad y por qué es sensible a los atípicos.', 'Nombrar un conjunto amodal, unimodal, bimodal o multimodal.'],
      body: `
        <h2>Para qué sirven</h2>
        <p>Hay dos familias de medidas: las de <strong>tendencia central o posición</strong> (media, mediana, moda), que dicen dónde está el “centro”, y las de <strong>dispersión</strong> (varianza, desvío), que dicen cuán separados están los datos de ese centro. Ejemplos de la clase: el promedio de temperaturas de la semana es la “temperatura típica”; la mediana de las notas muestra el desempeño “central” del grupo; el promedio de espera indica cuánto espera “en general” una persona.</p>
        <h2>Media aritmética</h2>
        ${eq(`x̄ = ${frac('Σ x<sub>i</sub>', 'n')} &nbsp;&nbsp; (tabulados: x̄ = ${frac('Σ x<sub>i</sub>·f<sub>i</sub>', 'n')})`, 'Media')}
        <ul>
          <li>Es la medida más usada; solo sirve para datos numéricos.</li>
          <li>Es el <strong>centro de gravedad</strong>: si cada dato fuera una masa de 1 kg sobre una barra, la media es el punto de apoyo que la equilibra.</li>
          <li>Por eso <strong>la suma de las distancias a la media es cero</strong>: Σ(x<sub>i</sub> − x̄) = 0.</li>
          <li>Es <strong>muy sensible a los datos atípicos</strong>: cambiando un solo dato se desplaza. Con atípicos deja de ser una buena medida de posición.</li>
        </ul>
        <h3>Ejemplo de la clase: llamadas por minuto</h3>
        <p>84, 91, 72, 68, 87 y 78 llamadas: x̄ = 480/6 = <strong>80 llamadas/minuto</strong>. Verificación: (84 − 80) + (91 − 80) + (72 − 80) + (68 − 80) + (87 − 80) + (78 − 80) = 4 + 11 − 8 − 12 + 7 − 2 = 0.</p>
        <h2>Mediana</h2>
        ${def('Mediana', 'Es el dato que ocupa la posición central en la muestra ordenada de menor a mayor.', 'Apunte de Medidas de Centralización')}
        ${h.flow('Ordenar de menor a mayor.', 'Ubicar la posición (n + 1)/2.', 'Si n es impar, la mediana es ese dato; si n es par, es el promedio de los dos datos centrales.')}
        <p>Con las llamadas (n = 6): ordenadas 68, 72, 78, 84, 87, 91; posición 3,5 → Me = (78 + 84)/2 = <strong>81</strong>. La mediana deja la mitad de los datos de cada lado y <strong>no se mueve</strong> si el dato más grande se vuelve enorme.</p>
        <h2>Moda</h2>
        <p>Es el valor con <strong>mayor frecuencia absoluta</strong>. No tiene por qué ser única, y se nombra según cuántas haya:</p>
        ${table(['Datos', 'Moda', 'Nombre'], [['1, 2, 3, 4, 5, 6, 7', 'no tiene', '<strong>amodal</strong>'], ['2, 5, 3, 4, 6, 2, 9, 2, 6', '2', '<strong>unimodal</strong>'], ['2, 5, 3, 5, 6, 3, 8', '3 y 5', '<strong>bimodal</strong>'], ['3, 4, 4, 6, 7, 6, 7, 9', '4, 6 y 7', '<strong>multimodal</strong>']])}
        ${note('La moda es la única medida que sirve también para variables <strong>cualitativas</strong> (el color más elegido). La media y la mediana necesitan números.', 'tip')}
        ${lab(0)}
        <h2>Cuál usar</h2>
        <p>Con datos simétricos y sin atípicos las tres coinciden o casi. Si hay valores extremos (sueldos, tiempos de espera), la <strong>mediana</strong> representa mejor al “típico”. Si interesa el valor más común (talle más vendido), la <strong>moda</strong>.</p>`,
      labs: [
        { type: 'measures', title: 'Mové los datos y mirá las medidas', intro: 'Datos del TP 1, ejercicio 10. Agregá un dato atípico: la media se va hacia él, la mediana apenas se mueve. La banda sombreada es x̄ ± s.', data: E10 },
      ],
      exercises: [
        { title: 'Ocho mediciones', official: '1.10', level: 1, prompt: '<p>Encontrar la media, mediana, moda, varianza y desviación estándar de: 2, 9, 11, 5, 6, 13, 15, 8.</p>', solution: { explain: loose(E10) } },
        { title: 'Treinta datos con muchos repetidos', official: '1.12', level: 2, prompt: `<p>Determinar la media, mediana, moda, varianza y desviación estándar de:</p><p class="mono">${E12.join(' ')}</p>`, hints: ['Hay solo 7 valores distintos: tabulá (x, f) y usá Σx·f.'], solution: { explain: loose(E12) } },
        { title: 'Llamadas por minuto (clase)', level: 1, prompt: '<p>84, 91, 72, 68, 87 y 78 llamadas por minuto: hallar media, mediana, moda, varianza y desvío.</p>', solution: { explain: loose(CALLS, ' llamadas/min') + '<p>La clase redondea s ≈ 9 llamadas por minuto. La varianza queda en (llamadas/min)²: por eso se informa el desvío.</p>' } },
      ],
      quiz: [
        { q: 'La media de 84, 91, 72, 68, 87 y 78 es…', o: ['78', '80', '81', '84'], a: 1, e: '480/6 = 80.' },
        { q: 'La suma de los desvíos Σ(x − x̄) siempre vale…', o: ['n', '0', 's²', 'depende de los datos'], a: 1, e: 'Porque la media es el centro de gravedad.' },
        { q: 'Con n = 8 datos ordenados, la mediana es…', o: ['el 4.º dato', 'el 5.º dato', 'el promedio del 4.º y el 5.º', 'el promedio de todos'], a: 2, e: 'Posición (8 + 1)/2 = 4,5.' },
        { q: 'El conjunto 2, 5, 3, 5, 6, 3, 8 es…', o: ['amodal', 'unimodal', 'bimodal', 'multimodal'], a: 2, e: '3 y 5 aparecen dos veces cada uno.' },
        { q: '¿Qué medida es más afectada por un dato atípico?', o: ['la mediana', 'la moda', 'la media', 'ninguna'], a: 2, e: 'La media se desplaza hacia el atípico.' },
        { q: '¿Qué medida de posición se puede calcular para una variable cualitativa?', o: ['media', 'mediana', 'moda', 'varianza'], a: 2, e: 'Solo hace falta contar frecuencias.' },
        { q: '1, 2, 3, 4, 5, 6, 7 tiene moda…', o: ['4', '1', 'no tiene (amodal)', '7'], a: 2, e: 'Todos aparecen una vez.' },
      ],
      open: [
        { t: 'num', q: 'Calculá la media de 2, 9, 11, 5, 6, 13, 15, 8 (TP 1, ej. 10).', a: S.mean(E10), e: 'Σx = 69; x̄ = 69/8 = 8,625.' },
        { t: 'num', q: 'Calculá la mediana de 2, 9, 11, 5, 6, 13, 15, 8.', a: S.median(E10), e: 'Ordenados: 2, 5, 6, 8, 9, 11, 13, 15. Posición 4,5: (8 + 9)/2 = 8,5.' },
        { t: 'num', q: 'Calculá la media de los 30 datos del TP 1, ej. 12.', a: S.mean(E12), e: `Σx = ${S.sum(E12)}; x̄ = ${S.sum(E12)}/30 = ${n4(S.mean(E12))}.` },
        { t: 'text', q: '¿Por qué se dice que la media es el “centro de gravedad” de los datos?', k: [['equilibrio', 'apoyo', 'balance', 'equilibra'], ['suma', 'distancias', 'desvíos'], ['cero', '0']], need: 2, e: 'Si cada dato fuera una masa unitaria sobre una barra, la media es el punto de <b>apoyo</b> que la deja en <b>equilibrio</b>: la <b>suma</b> de las distancias de los datos a la media es <b>cero</b>.' },
      ],
      sources: [
        { title: 'Apunte: Medidas de Centralización y Dispersión', ref: 'Cátedra, UTN-FRT', points: ['Media como centro de gravedad, Σ(x − x̄) = 0 y sensibilidad a atípicos.', 'Mediana: posición (n + 1)/2, impar y par. Moda: no tiene por qué ser única.'] },
        { title: 'Clase 2: Medidas de centralización y dispersión', ref: 'Prof. Teri', points: ['Ejemplo de las llamadas (84, 91, 72, 68, 87, 78): x̄ = 80.', 'Tipos de moda: amodal, unimodal, bimodal, multimodal.'] },
      ],
    },
    {
      id: 'varianza-desvio',
      module: 'u2',
      title: 'Varianza, desvío estándar y rango',
      keywords: 'medidas de dispersión variabilidad varianza muestral desviación estándar típica rango recorrido coeficiente de variación n-1 unidades al cuadrado',
      tldr: 'Dos muestras pueden tener la misma media y una variabilidad muy distinta. La <mark>varianza s² = Σ(x − x̄)²·f/(n − 1)</mark> es el promedio de los cuadrados de las distancias a la media (en unidades al cuadrado). El <mark>desvío s = √s²</mark> vuelve a las unidades de la variable. El <strong>rango</strong> R = máx − mín es la medida más simple, y el <strong>coeficiente de variación</strong> CV = s/x̄ compara dispersiones relativas.',
      goals: ['Calcular varianza y desvío de una muestra (dividiendo por n − 1).', 'Interpretar el desvío en el contexto del problema.', 'Ver cómo un dato atípico cambia media, mediana, moda y desvío.'],
      body: `
        <h2>Por qué hace falta medir la dispersión</h2>
        <p>La media sola no alcanza: dos cursos con promedio 7 pueden ser uno parejo (todos entre 6 y 8) y otro dividido (la mitad con 10 y la mitad con 4). Las medidas de dispersión dicen <strong>hasta qué punto la medida central es representativa</strong>.</p>
        ${table(['Situación', 'Dispersión alta', 'Dispersión baja'], [['Temperaturas de una semana', 'hubo días muy fríos y muy calurosos', 'semana bastante uniforme'], ['Notas de un examen', 'algunos muy bien y otros muy mal', 'rendimiento parejo'], ['Tiempos de espera', 'algunos esperan poco y otros muchísimo', 'servicio parejo']])}
        <h2>Varianza muestral</h2>
        ${eq(`s² = ${frac('Σ (x<sub>i</sub> − x̄)² · f<sub>i</sub>', 'n − 1')}`, 'Varianza')}
        <p>Es el promedio de los <strong>cuadrados</strong> de las distancias a la media (se elevan al cuadrado para que las positivas y negativas no se cancelen). Con datos sueltos f<sub>i</sub> = 1. Se divide por <strong>n − 1</strong> porque trabajamos con una muestra: con n la varianza de la muestra subestimaría a la de la población.</p>
        <h2>Desvío estándar</h2>
        ${eq('s = √s²', 'Desvío estándar (desviación típica)')}
        <p>La varianza queda en <strong>unidades al cuadrado</strong> ((llamadas/min)², kg²), difíciles de interpretar. El desvío vuelve a las unidades originales: con las llamadas, s² = 398/5 = 79,6 (llamadas/min)² y <strong>s ≈ 8,9 ≈ 9 llamadas por minuto</strong>: los minutos típicos se apartan unas 9 llamadas del promedio de 80.</p>
        <h2>Rango y coeficiente de variación</h2>
        ${eq('R<sub>e</sub> = x<sub>máx</sub> − x<sub>mín</sub> &nbsp;&nbsp;&nbsp; CV = s / x̄ (· 100 %)', 'Rango y CV')}
        <p>El rango (o recorrido) solo mira los extremos. El CV expresa el desvío como porcentaje de la media y sirve para comparar variables con unidades o escalas distintas; en la clase 7 se usa el criterio de que un proceso es estable si CV &lt; 30 %.</p>
        ${note('En la calculadora: modo estadístico (SD/STAT), cargar los datos y leer x̄ y <b>s<sub>x</sub></b> (o σ<sub>n−1</sub>). No uses σ<sub>x</sub> (σ<sub>n</sub>): divide por n.', 'warn')}
        <h2>Exactos o aproximados</h2>
        <p>Si los datos están <strong>sin agrupar</strong>, x̄, Me, Mo, s² y s son <strong>valores exactos</strong>. Si están <strong>agrupados</strong>, son <strong>aproximados</strong> (cada dato se reemplaza por su marca de clase). El TP 1, ej. 11 lo muestra con los mismos datos.</p>`,
      exercises: [
        { title: 'Doce valores: sin agrupar y agrupados', official: '1.11', level: 2, prompt: `<p>Media, mediana, moda, varianza y desviación estándar de:</p><p class="mono">${E11.map((x) => num(x, 1)).join(' · ')}</p><p>Primero sin agrupar, después agrupando, y comparar.</p>`,
          solution: { explain: `<h4>Sin agrupar (valores exactos)</h4>${loose(E11)}<h4>Agrupados (amplitud 7 desde 44)</h4>${grouped(C11)}<p><b>Comparación</b>: la media agrupada (${num(g11.mean, 2)}) y el desvío agrupado (${num(g11.sd, 2)}) se parecen a los exactos (${num(S.mean(E11), 2)} y ${num(S.sd(E11), 2)}) pero no son iguales: cada dato se reemplazó por su marca. La moda sin agrupar no existe (todos distintos); agrupando aparece una “clase modal”. Con 12 datos sueltos conviene calcular sin agrupar.</p>` } },
        { title: 'Errores de carga y un dato atípico', official: '1.13', level: 2, prompt: `<p>a) Media, mediana, moda, varianza y desvío de:</p><p class="mono">${E13.join(' ')}</p><p>b) ¿Cómo cambian la media, la mediana, la moda y el desvío si el último valor hubiera sido 15? Explicar.</p>`,
          solution: { explain: `<h4>a)</h4>${loose(E13)}<h4>b) Último valor 15 en lugar de 5</h4>${table(['Medida', 'Original', 'Con 15', 'Cambio'], [['Media', n4(S.mean(E13)), n4(S.mean(E13b)), 'sube: el 15 la arrastra (+10/25 = +0,4)'], ['Mediana', num(S.median(E13), 2), num(S.median(E13b), 2), 'no cambia: el dato del medio es el mismo'], ['Moda', S.modes(E13).join(', '), S.modes(E13b).join(', '), 'no cambia'], ['Desvío s', n4(S.sd(E13)), n4(S.sd(E13b)), 'crece mucho: el atípico está lejos de la media']])}<p>Un solo dato atípico mueve la media y sobre todo el desvío (que eleva las distancias al cuadrado); la mediana y la moda son <strong>resistentes</strong>.</p>` } },
      ],
      quiz: [
        { q: 'La varianza muestral divide por…', o: ['n', 'n − 1', 'n + 1', 'n²'], a: 1, e: 'Así no subestima la varianza de la población.' },
        { q: 'Si los datos están en kg, la varianza está en…', o: ['kg', 'kg²', '%', 'no tiene unidades'], a: 1, e: 'Por eso se informa el desvío, que está en kg.' },
        { q: 'Si a todos los datos se les suma 10, el desvío…', o: ['aumenta 10', 'no cambia', 'se multiplica por 10', 'se hace 0'], a: 1, e: 'Se corre todo junto: las distancias a la media son las mismas.' },
        { q: 'Con las llamadas (Σ(x − x̄)² = 398, n = 6), la varianza es…', o: ['66,3', '79,6', '8,9', '398'], a: 1, e: '398/5 = 79,6.' },
        { q: 'El rango de 2, 9, 11, 5, 6, 13, 15, 8 es…', o: ['8,6', '13', '15', '2'], a: 1, e: '15 − 2 = 13.' },
        { q: 'Con datos agrupados, la media y el desvío son…', o: ['exactos', 'aproximados', 'siempre mayores', 'imposibles de calcular'], a: 1, e: 'Se usan las marcas de clase en vez de los datos.' },
        { q: 'Un CV del 65 % indica…', o: ['un proceso muy estable', 'una variabilidad muy alta respecto de la media', 'que la media es 65', 'un error de cálculo'], a: 1, e: 'En la clase 7, el reactor con CV = 65,1 % “no es confiable”.' },
      ],
      open: [
        { t: 'num', q: 'Calculá la varianza muestral de 2, 9, 11, 5, 6, 13, 15, 8.', a: S.variance(E10), e: `Σ(x − 8,625)² = ${n4(S.variance(E10) * 7)}; s² = ${n4(S.variance(E10) * 7)}/7 = ${n4(S.variance(E10))}.` },
        { t: 'num', q: 'Calculá el desvío estándar de 2, 9, 11, 5, 6, 13, 15, 8.', a: S.sd(E10), e: `s = √${n4(S.variance(E10))} = ${n4(S.sd(E10))}.` },
        { t: 'num', q: 'Calculá el desvío estándar de los errores de carga del TP 1, ej. 13 (25 datos).', a: S.sd(E13), e: `x̄ = ${n4(S.mean(E13))}; s² = ${n4(S.variance(E13))}; s = ${n4(S.sd(E13))}.` },
        { t: 'num', q: 'Llamadas por minuto: x̄ = 80, s ≈ 8,92. ¿Cuál es el coeficiente de variación en %?', a: (S.sd(CALLS) / 80) * 100, e: `CV = 8,922/80 · 100 = ${num((S.sd(CALLS) / 80) * 100, 2)} %.` },
        { t: 'text', q: 'Si al TP 1, ej. 13 le cambiamos el último dato por 15, ¿qué medidas cambian y cuáles no? ¿Por qué?', k: [['media'], ['desvío', 'desviación', 'varianza'], ['mediana'], ['atípico', 'extremo', 'resistente', 'sensible']], need: 3, e: 'Cambian la <b>media</b> (sube de 2,8 a 3,2) y sobre todo el <b>desvío</b> (los cuadrados amplifican la distancia del 15). La <b>mediana</b> y la moda no cambian: son resistentes al dato <b>atípico</b>.' },
      ],
      sources: [
        { title: 'Apunte: Medidas de Centralización y Dispersión', ref: 'Cátedra, UTN-FRT', points: ['Varianza con n − 1, desvío como raíz positiva, rango muestral.'] },
        { title: 'Clase 2', ref: 'Prof. Teri', points: ['Llamadas: s² = 79,6 (llamadas por minuto)², s ≈ 9.', 'Datos sin agrupar → valores exactos; agrupados → aproximados. “Media y desviación: calcular sin agrupar”.'] },
        { title: 'Clase 7: coeficiente de variabilidad', ref: 'Prof. Teri', points: ['CV = σ/μ; un proceso se considera estable con CV < 30 %.'] },
      ],
    },
    {
      id: 'medidas-agrupados',
      module: 'u2',
      title: 'Medidas con datos agrupados y asimetría',
      keywords: 'datos agrupados marca de clase media agrupada mediana interpolación moda clase modal varianza agrupada asimetría simétrica positiva negativa',
      tldr: 'Con datos agrupados cada clase se representa por su <strong>marca m</strong>: x̄ = Σm·f/n y s² = Σ(m − x̄)²·f/(n − 1). La <mark>mediana</mark> se interpola en la clase donde F llega a n/2: Me = L + A·(n/2 − F<sub>i−1</sub>)/f<sub>i</sub>. La <mark>moda</mark> se ubica en la clase de mayor f y se corre hacia la vecina más cargada. Si x̄ = Me = Mo la distribución es simétrica; si x̄ &gt; Me, asimétrica a la derecha.',
      goals: ['Calcular media, mediana, moda, varianza y desvío desde una tabla de clases.', 'Ubicar la clase mediana y la clase modal.', 'Reconocer la asimetría comparando media y mediana.'],
      body: `
        <h2>Media y varianza con marcas de clase</h2>
        ${eq(`x̄ = ${frac('Σ m<sub>i</sub>·f<sub>i</sub>', 'n')} &nbsp;&nbsp;&nbsp; s² = ${frac('Σ (m<sub>i</sub> − x̄)²·f<sub>i</sub>', 'n − 1')}`, 'Agrupados')}
        <p>Es la misma fórmula de los datos tabulados, con la marca de clase en lugar de cada valor: se supone que todos los datos de la clase están en su punto medio.</p>
        <h2>Mediana por interpolación</h2>
        ${eq(`M<sub>e</sub> = L<sub>i</sub> + A · ${frac('n/2 − F<sub>i−1</sub>', 'f<sub>i</sub>')}`, 'Mediana agrupada')}
        <p>L<sub>i</sub>: límite inferior de la clase mediana (la primera cuya F alcanza n/2); F<sub>i−1</sub>: frecuencia acumulada de la clase anterior; f<sub>i</sub>: frecuencia de la clase mediana; A: amplitud. Se supone que los datos están repartidos parejo dentro de la clase.</p>
        <h3>Ejemplo del apunte: edades</h3>
        ${grouped(AGES, ' años')}
        <h2>Moda en la clase modal</h2>
        ${eq(`M<sub>o</sub> = L<sub>i</sub> + A · ${frac('f<sub>i+1</sub>', 'f<sub>i−1</sub> + f<sub>i+1</sub>')}`, 'Moda agrupada')}
        <p>La clase modal es la de mayor frecuencia; dentro de ella la moda se corre hacia la clase vecina con más datos. En las edades: clase [30; 40), f<sub>i−1</sub> = 7, f<sub>i+1</sub> = 3 → Mo = 30 + 10·3/(7 + 3) = <strong>33</strong> (más cerca de la clase anterior, que tiene más datos).</p>
        ${note('El apunte de la cátedra escribe en el numerador f<sub>i−1</sub> y obtiene 30 + 10·7/10 = 37. Ese valor corre la moda hacia la vecina <b>con menos</b> datos, lo contrario de lo que se busca. La fórmula de arriba (f<sub>i+1</sub> arriba) es la de la bibliografía; otra variante muy usada es la de Czuber, Mo = L + A·(f<sub>i</sub> − f<sub>i−1</sub>)/[(f<sub>i</sub> − f<sub>i−1</sub>) + (f<sub>i</sub> − f<sub>i+1</sub>)] = 33,57. Consultá en clase cuál se toma en el parcial.', 'warn')}
        <h2>Asimetría</h2>
        ${lab(0)}
        <ul>
          <li><strong>Simétrica</strong>: x̄ = Me = Mo.</li>
          <li><strong>Asimetría positiva</strong> (cola a la derecha): x̄ &gt; Me. Típica de tiempos de espera y sueldos.</li>
          <li><strong>Asimetría negativa</strong> (cola a la izquierda): x̄ &lt; Me.</li>
        </ul>
        ${note('En el parcial suelen preguntar “¿coinciden las medidas de tendencia central? ¿Por qué?” (TP 1, ej. 16). La respuesta se justifica con la forma del histograma y el orden entre x̄, Me y Mo.', 'exam')}`,
      labs: [
        { type: 'skew', title: 'Media, mediana y moda según la forma' },
        { type: 'freq', title: 'Histograma de 100 soldaduras (TP 1, ej. 17)', intro: 'Probá amplitud 200 (10 clases desde 4000) y amplitud 100 (20 clases). ¿Cambia la forma?', data: E17, kind: 'cont', start: 4000, w: 200, xl: 'lb' },
      ],
      exercises: [
        { title: 'Tabla de 7 clases (10 a 80)', official: '1.14', level: 2, prompt: '<p>Clases 10–20, 20–30, …, 70–80 con frecuencias 1, 5, 8, 15, 10, 9, 2 (total 50). a) Frecuencias relativas y relativas acumuladas. b) Media, mediana, moda, varianza y desvío.</p>',
          solution: { explain: `${table(['Clase', 'fr', 'Fr'], S.grouped(C14).rows.map((r) => [`[${r.a}; ${r.b})`, n4(r.fr), n4(r.Fr)]))}${grouped(C14)}` } },
        { title: 'Tabla con marcas de clase', official: '1.15', level: 2, prompt: '<p>Clases de 2,25 a 5,75 con amplitud 0,5 (marcas 2,5; 3; …; 5,5) y frecuencias 4, 6, 5, 5, 3, 1, 1 (total 25). Calcular media, mediana, moda, varianza y desvío.</p>', solution: { explain: grouped(C15) } },
        { title: '100 datos de 1 a 10: ¿coinciden las medidas?', official: '1.16', level: 2, prompt: '<p>Clases 1–2, 2–3, …, 9–10 con frecuencias 20, 19, 17, 13, 11, 9, 5, 4, 2 (total 100). a) Frecuencias relativas y acumuladas. b) Media, mediana, moda, varianza y desvío. c) ¿Coinciden las medidas de tendencia central? ¿Por qué?</p>',
          solution: { explain: `${table(['Clase', 'fr', 'Fr'], S.grouped(C16).rows.map((r) => [`[${r.a}; ${r.b})`, n4(r.fr), n4(r.Fr)]))}${grouped(C16)}${hist(C16, 'x', 'Las frecuencias bajan de izquierda a derecha: cola larga hacia los valores grandes.')}<p>c) <strong>No coinciden</strong>: Mo (${num(S.grouped(C16).mode, 2)}) &lt; Me (${num(S.grouped(C16).median, 2)}) &lt; x̄ (${num(S.grouped(C16).mean, 2)}). La distribución es <strong>asimétrica a la derecha</strong> (positiva): los pocos valores grandes arrastran la media hacia arriba.</p>` } },
        { title: 'Resistencia de 100 soldaduras', official: '1.17', level: 3, prompt: '<p>Con las 100 resistencias al esfuerzo cortante (lb) del TP: a) histograma de frecuencia relativa con 10 clases de ancho 200 desde 4000; b) con 20 clases de ancho 100; c) ¿hay diferencias significativas? d) medidas de tendencia central y dispersión. (El TP pide Excel; el laboratorio de arriba hace lo mismo.)</p>',
          solution: { explain: `<p>a) Diez clases de 200 lb:</p>${hist(S.makeClasses(E17, 4000, 200), 'lb', 'Campana bastante simétrica centrada cerca de 5000 lb.')}<p>b) Veinte clases de 100 lb:</p>${hist(S.makeClasses(E17, 4000, 100), 'lb', 'Con clases más angostas aparecen picos y huecos que son variación de muestreo.')}<p>c) La forma general es la misma (unimodal y casi simétrica), pero con 20 clases el histograma se ve más “ruidoso” porque cada clase tiene pocos datos. Con 100 datos, Sturges sugiere ${num(S.sturges(100), 1)} ≈ 8 clases: las 10 del ítem a) muestran mejor la forma.</p><p>d) Calculadas sin agrupar (valores exactos): x̄ = <strong>${num(S.mean(E17), 2)}</strong> lb, Me = <strong>${num(S.median(E17), 1)}</strong> lb, moda ${S.modes(E17).length ? `${S.modes(E17).join(' y ')} (se repiten dos veces cada uno)` : 'no hay'}, s² = <strong>${num(S.variance(E17), 1)}</strong> lb², s = <strong>${num(S.sd(E17), 2)}</strong> lb, R = ${S.range(E17)} lb. Media y mediana casi iguales: distribución simétrica.</p>` } },
      ],
      quiz: [
        { q: 'Para la media de datos agrupados se usa…', o: ['el límite inferior de cada clase', 'la marca de clase', 'la frecuencia acumulada', 'la amplitud'], a: 1, e: 'x̄ = Σm·f/n.' },
        { q: 'La clase mediana es…', o: ['la de mayor frecuencia', 'la primera cuya F alcanza n/2', 'la del medio de la tabla', 'la última'], a: 1, e: 'Ahí se interpola Me.' },
        { q: 'En la fórmula de la mediana, F<sub>i−1</sub> es…', o: ['la frecuencia de la clase mediana', 'la acumulada de la clase anterior', 'la acumulada de la clase mediana', 'n/2'], a: 1, e: 'Cuántos datos hay antes de la clase mediana.' },
        { q: 'La clase modal es…', o: ['la primera', 'la de mayor frecuencia absoluta', 'la que contiene a la media', 'la que contiene a n/2'], a: 1, e: 'Puede haber más de una.' },
        { q: 'Si x̄ > Me, la distribución es…', o: ['simétrica', 'asimétrica a la derecha (positiva)', 'asimétrica a la izquierda', 'uniforme'], a: 1, e: 'La cola derecha arrastra a la media.' },
        { q: 'En una distribución perfectamente simétrica y unimodal…', o: ['x̄ > Me > Mo', 'x̄ = Me = Mo', 'x̄ < Mo', 'no hay mediana'], a: 1, e: 'Las tres coinciden.' },
        { q: 'En el ejemplo de edades (n = 31), n/2 = 15,5 cae en la clase…', o: ['[10; 20)', '[20; 30)', '[30; 40)', '[40; 50)'], a: 1, e: 'F: 3, 9, 16 → la tercera clase.' },
      ],
      open: [
        { t: 'num', q: 'Edades del apunte (clases de 10 desde 0, f = 3, 6, 7, 12, 3): calculá la media.', a: gA.mean, e: `Σm·f = 5·3 + 15·6 + 25·7 + 35·12 + 45·3 = 835; x̄ = 835/31 = ${n4(gA.mean)}.` },
        { t: 'num', q: 'Edades del apunte: calculá la mediana por interpolación.', a: gA.median, e: 'Me = 20 + 10·(15,5 − 9)/7 = 29,2857.' },
        { t: 'num', q: 'TP 1, ej. 15: calculá la media de los datos agrupados.', a: S.grouped(C15).mean, e: `Σm·f = ${num(S.sum(S.grouped(C15).rows.map((r) => r.m * r.f)), 2)}; x̄ = ${n4(S.grouped(C15).mean)}.` },
        { t: 'num', q: 'TP 1, ej. 14: calculá el desvío estándar de los datos agrupados.', a: S.grouped(C14).sd, e: `x̄ = ${n4(S.grouped(C14).mean)}; s² = ${n4(S.grouped(C14).var)}; s = ${n4(S.grouped(C14).sd)}.` },
        { t: 'text', q: 'En el TP 1, ej. 16, ¿coinciden media, mediana y moda? Justificá.', k: [['no coinciden', 'no'], ['asimétrica', 'asimetría', 'sesgada'], ['derecha', 'positiva'], ['media mayor', 'x̄ > me', 'media > mediana', 'mayor que la mediana']], need: 3, e: '<b>No coinciden</b>: Mo &lt; Me &lt; x̄. Las frecuencias decrecen hacia los valores grandes, así que la distribución es <b>asimétrica a la derecha</b> (positiva) y la media queda mayor que la mediana.' },
      ],
      sources: [
        { title: 'Apunte: Medidas de Centralización y Dispersión', ref: 'Cátedra, UTN-FRT', points: ['Fórmulas para datos agrupados: media con marcas, mediana con L, n/2, F<sub>i−1</sub>, f<sub>i</sub> y A, moda con f<sub>i−1</sub> y f<sub>i+1</sub>.', 'Ejemplo de edades: x̄ = 26,94 y Me = 29,285.'] },
        { title: 'Clase 2: información adicional', ref: 'Prof. Teri', points: ['Distribuciones simétricas: x̄ = Me = Mo. Asimetría negativa x̄ < Me; positiva x̄ > Me.'] },
      ],
    },
  );
})();
