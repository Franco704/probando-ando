/* Tema 4 (1er parcial): probabilidad condicional, independencia, probabilidad total y Bayes. Apunte "Probabilidad Condicional", clase 4 y TP 2, ejercicios 8 a 16. */
(() => {
  const { LESSONS, h } = window.GUIDE;
  const { note, def, table, eq, frac, lab, num } = h;
  const n4 = (v) => num(v, 4);

  // TP 2, ej. 12 (pedidos por sexo y línea)
  const T12 = { m1: 132, m2: 147, f1: 516, f2: 205 };
  const pA = 721 / 1000, pB = 648 / 1000, pAB = 516 / 1000;
  // Bayes de los TP
  const b14 = { pr: [0.3, 0.5, 0.2], lk: [0.1, 0.3, 0.25] };
  const b14D = b14.pr.reduce((s, p, i) => s + p * b14.lk[i], 0);
  const b15 = 0.01 / (0.01 * 1 + 0.99 * 0.001);
  const eco = 0.25 * 0.01 + 0.35 * 0.02 + 0.4 * 0.03;

  LESSONS.push(
    {
      id: 'probabilidad-condicional',
      module: 'u4',
      title: 'Probabilidad condicional y regla de la multiplicación',
      keywords: 'probabilidad condicional dado que espacio muestral reducido regla de la multiplicación tablas de contingencia doble entrada',
      tldr: 'P(A | B) es la probabilidad de A <strong>sabiendo que ocurrió B</strong>: el espacio muestral se <strong>reduce</strong> a B. <mark>P(A | B) = P(A ∩ B)/P(B)</mark>. Despejando sale la <mark>regla de la multiplicación P(A ∩ B) = P(B)·P(A | B)</mark>, que sirve cuando no se conoce la intersección. Ojo: P(A | B) ≠ P(B | A).',
      goals: ['Calcular P(A | B) con la fórmula y con el espacio muestral reducido.', 'Leer probabilidades conjuntas, marginales y condicionales en una tabla de doble entrada.', 'Usar la regla de la multiplicación en extracciones sucesivas.'],
      body: `
        <h2>Información que cambia la probabilidad</h2>
        ${def('Probabilidad condicional', 'Es la probabilidad de que ocurra un suceso A dada la ocurrencia de otro suceso B del mismo espacio muestral. Se nota P(A | B) y se lee “probabilidad de A dado B”.', 'Apunte de Probabilidad Condicional')}
        ${eq(`P(A | B) = ${frac('P(A ∩ B)', 'P(B)')} &nbsp;&nbsp; con P(B) &gt; 0`, 'Probabilidad condicional')}
        <p>En el diagrama de Venn: como se sabe que ocurrió B, el nuevo espacio muestral es B (el <strong>espacio muestral reducido</strong>), y dentro de él A ocupa la parte A ∩ B. Se lee “P(duda | lo que se sabe)”: P(llueva | hace calor).</p>
        ${note('P(A | B) ≠ P(B | A). La probabilidad de tener fiebre si se tiene gripe es alta; la de tener gripe si se tiene fiebre, mucho menor. Escribí siempre primero lo que se pregunta y después, tras la barra, lo que se sabe.', 'warn')}
        <h2>Tablas de doble entrada</h2>
        <p>Ejemplo de la clase: 1000 personas según si fuman y si tienen cáncer de pulmón.</p>
        ${table(['', 'Fumadores (F)', 'No fumadores (F̄)', 'Total'], [['Cáncer (C)', 40, 10, 50], ['Sin cáncer (C̄)', 160, 790, 950], ['Total', 200, 800, 1000]])}
        <ul>
          <li>P(C | F) = (40/1000)/(200/1000) = <strong>0,20</strong>. Con el espacio reducido: 40/200, mismo resultado.</li>
          <li>P(C̄ | F) = 160/200 = <strong>0,80</strong>.</li>
          <li>P(F | C) = 40/50 = <strong>0,80</strong>: entre los enfermos, el 80 % fuma. ¡No es lo mismo que P(C | F)!</li>
          <li>P(F̄ | C) = 10/50 = <strong>0,20</strong>.</li>
        </ul>
        <p>Los totales de fila y columna dan las probabilidades <strong>marginales</strong> (P(C) = 0,05, P(F) = 0,20); las celdas, las <strong>conjuntas</strong> (P(C ∩ F) = 0,04); dividir una celda por su total de fila o columna da una <strong>condicional</strong>.</p>
        <h3>Ejemplos del apunte</h3>
        <ul>
          <li>Osteoporosis y menopausia (1000 mujeres): P(Osteoporosis | Menopausia) = 58/697 = <strong>0,083</strong>.</li>
          <li>El 76 % aprobó Resistencia (A), el 45 % Estática (B) y el 30 % ambas: P(B | A) = 0,30/0,76 = <strong>0,3947</strong>.</li>
          <li>El 30 % aprobó los dos exámenes y el 45 % el primero: P(2.º | 1.º) = 0,30/0,45 = <strong>0,667</strong>.</li>
        </ul>
        ${note('El apunte escribe 58/697 = 0,098, pero 58/697 = 0,0832. El planteo es correcto; es un error de cuenta.', 'warn')}
        <h2>Regla de la multiplicación</h2>
        ${eq('P(A ∩ B) = P(A)·P(B | A) = P(B)·P(A | B)', 'Regla de la multiplicación')}
        <p>Sirve cuando no se conoce la intersección pero sí cómo cambia la segunda probabilidad tras la primera. Dos reyes seguidos sin reposición: P = 4/52 · 3/51 = 12/2652 = <strong>0,0045</strong>.</p>`,
      exercises: [
        { title: 'Un dado y tres sucesos', official: '2.8', level: 1, prompt: '<p>Se tira un dado. A: “menor que 4”; B: “menor o igual que 2”; C: “mayor que 3”. a) P(A | B); b) P(B | A); c) P(A | C); d) P(B | C); e) ¿A y B son independientes?</p>',
          solution: { explain: `<p>A = {1, 2, 3}, B = {1, 2}, C = {4, 5, 6}.</p>
            <p>a) A ∩ B = {1, 2}: P(A | B) = (2/6)/(2/6) = <strong>1</strong>. Si salió 1 o 2, seguro es menor que 4 (B ⊂ A).</p>
            <p>b) P(B | A) = (2/6)/(3/6) = <strong>2/3 = 0,6667</strong>.</p>
            <p>c) A ∩ C = ∅ → P(A | C) = <strong>0</strong>.</p>
            <p>d) B ∩ C = ∅ → P(B | C) = <strong>0</strong>.</p>
            <p>e) P(A ∩ B) = 1/3 y P(A)·P(B) = (1/2)·(1/3) = 1/6. Como 1/3 ≠ 1/6, <strong>son dependientes</strong> (también se ve en a): P(A | B) = 1 ≠ P(A) = 1/2).</p>` } },
        { title: 'Dos dados: suma 7', official: '2.9', level: 1, prompt: '<p>Se tiran un dado rojo y uno negro. a) P(suma = 7). b) P(suma = 7 | el rojo salió 2). c) Comparar y concluir.</p>',
          solution: { explain: '<p>a) 6 casos de 36: P = 1/6 = <strong>0,1667</strong>.</p><p>b) Espacio reducido: los 6 resultados con rojo = 2; solo (2, 5) suma 7. P = <strong>1/6</strong>.</p><p>c) Son iguales: saber el valor del dado rojo no cambia la probabilidad de sumar 7. Los sucesos “suma 7” y “rojo = 2” son <strong>independientes</strong> (para cualquier valor del rojo hay exactamente un valor del negro que completa 7).</p>' } },
        { title: 'Clientes por sexo y residencia', official: '2.11', level: 1, prompt: '<p>Proporciones de clientes: Suburbios: masculino 0,17, femenino 0,67; Ciudad: masculino 0,04, femenino 0,12. Probabilidad de que un adulto elegido: a) resida en los suburbios; b) sea mujer y viva en la ciudad; c) sea hombre.</p>',
          solution: { explain: '<p>a) Marginal de la fila: 0,17 + 0,67 = <strong>0,84</strong>.</p><p>b) Celda conjunta: <strong>0,12</strong>.</p><p>c) Marginal de la columna: 0,17 + 0,04 = <strong>0,21</strong>.</p><p>Control: 0,84 + 0,16 = 1 y 0,21 + 0,79 = 1.</p>' } },
        { title: '1000 pedidos por línea y sexo', official: '2.12', level: 2, prompt: `<p>${table(['Sexo', 'Línea 1', 'Línea 2', 'Total'], [['Masculino', T12.m1, T12.m2, 279], ['Femenino', T12.f1, T12.f2, 721], ['Total', 648, 352, 1000]])}</p><p>A: “el consumidor es mujer”; B: “el pedido es de la línea 1”. a) P(A); b) P(B); c) P(línea 1 y mujer); d) P(línea 1 | mujer); e) ¿A y B son independientes?; f) P(A ∩ B) con la regla multiplicativa.</p>`,
          solution: { explain: `<p>a) P(A) = 721/1000 = <strong>${pA}</strong>. b) P(B) = 648/1000 = <strong>${pB}</strong>. c) P(A ∩ B) = 516/1000 = <strong>${pAB}</strong>.</p>
            <p>d) P(B | A) = 516/721 = <strong>${n4(pAB / pA)}</strong>.</p>
            <p>e) P(A)·P(B) = 0,721·0,648 = ${n4(pA * pB)} ≠ 0,516 = P(A ∩ B) → <strong>dependientes</strong>. (Las mujeres eligen más la línea 1: 71,6 % contra 64,8 % general.)</p>
            <p>f) P(A ∩ B) = P(A)·P(B | A) = 0,721·${n4(pAB / pA)} = <strong>0,516</strong>. ✓</p>` } },
      ],
      quiz: [
        { q: 'P(A | B) se calcula como…', o: ['P(A)·P(B)', 'P(A ∩ B)/P(B)', 'P(A ∩ B)/P(A)', 'P(A) + P(B)'], a: 1, e: 'Dividido por la probabilidad de lo que se sabe.' },
        { q: 'Con la tabla de fumadores, P(cáncer | fumador) es…', o: ['0,04', '0,20', '0,80', '0,05'], a: 1, e: '40/200.' },
        { q: 'Con la misma tabla, P(fumador | cáncer) es…', o: ['0,20', '0,04', '0,80', '0,25'], a: 2, e: '40/50. No es igual a P(C | F).' },
        { q: 'Si P(A) = 0,76 y P(A ∩ B) = 0,30, P(B | A) es…', o: ['0,228', '0,3947', '0,46', '0,6667'], a: 1, e: '0,30/0,76.' },
        { q: 'La regla de la multiplicación dice que P(A ∩ B) =', o: ['P(A) + P(B)', 'P(A)·P(B | A)', 'P(A | B)/P(B)', '1 − P(A)'], a: 1, e: 'Vale siempre; si son independientes se reduce a P(A)·P(B).' },
        { q: 'En el TP 2, ej. 8, P(A | C) = 0 porque…', o: ['A y C son independientes', 'A y C son excluyentes', 'P(C) = 0', 'C ⊂ A'], a: 1, e: 'Si C ocurrió, A no puede ocurrir.' },
      ],
      open: [
        { t: 'num', q: 'TP 2, ej. 8 b): con un dado, A = “menor que 4” y B = “menor o igual que 2”. Calculá P(B | A).', a: 2 / 3, e: 'P(A ∩ B)/P(A) = (2/6)/(3/6) = 2/3.' },
        { t: 'num', q: 'TP 2, ej. 12 d): calculá P(línea 1 | mujer).', a: pAB / pA, e: '516/721 = 0,7157.' },
        { t: 'num', q: 'Tabla de fumadores (40 fumadores con cáncer, 200 fumadores, 50 con cáncer). ¿P(fumador | cáncer)?', a: 0.8, e: '40/50 = 0,80.' },
        { t: 'text', q: 'Explicá qué es el “espacio muestral reducido” en la probabilidad condicional.', k: [['condición', 'dado', 'sabe', 'ocurrió'], ['b'], ['nuevo espacio', 'reduce', 'reducido', 'solo']], e: 'Al saber que <b>ocurrió B</b> (la condición), los resultados posibles ya no son todo S sino solo los de B: B es el <b>nuevo espacio</b> muestral. P(A | B) se calcula como casos de A dentro de B sobre casos de B.' },
      ],
      sources: [
        { title: 'Apunte: Probabilidad Condicional', ref: 'Cátedra, UTN-FRT', points: ['Definición, espacio muestral reducido, ejemplos de osteoporosis, Camilo (0,3947) y los dos exámenes (0,667).'] },
        { title: 'Clase 4: Introducción a la probabilidad, 2.ª parte', ref: 'Prof. Teri', points: ['P(A | B) ≠ P(B | A); regla de la multiplicación “cuando no conozco la intersección”.', 'Tabla fumadores y cáncer: P(C | F) = 0,20, P(F | C) = 0,80.'] },
      ],
    },
    {
      id: 'independencia',
      module: 'u4',
      title: 'Sucesos independientes',
      keywords: 'independencia sucesos independientes dependientes P(A ∩ B) = P(A)·P(B) P(A|B) = P(A) excluyentes tres sucesos mutuamente independientes',
      tldr: 'A y B son <strong>independientes</strong> si saber que ocurrió uno no cambia la probabilidad del otro: <mark>P(A | B) = P(A)</mark>, o lo que es lo mismo, <mark>P(A ∩ B) = P(A)·P(B)</mark>. Si no se cumple, son dependientes. Tres sucesos son independientes si lo son de a pares <strong>y</strong> P(A ∩ B ∩ C) = P(A)·P(B)·P(C).',
      goals: ['Probar la independencia comparando P(A ∩ B) con P(A)·P(B).', 'Distinguir independientes de mutuamente excluyentes.', 'Analizar la independencia de tres sucesos.'],
      body: `
        <h2>Definición</h2>
        ${eq('A y B independientes ⇔ P(A ∩ B) = P(A)·P(B) ⇔ P(A | B) = P(A)', 'Independencia')}
        <p>Reemplazando en la condicional: P(A | B) = P(A)·P(B)/P(B) = P(A). La información sobre B no aporta nada sobre A. Ejemplos: dos tiradas de una moneda; extracciones <strong>con</strong> reposición. En cambio, sin reposición la primera extracción cambia la composición y los sucesos son dependientes.</p>
        ${table(['Si…', 'Entonces'], [['P(A ∩ B) = P(A)·P(B)', 'independientes'], ['P(A ∩ B) ≠ P(A)·P(B)', 'dependientes'], ['A ∩ B = ∅ con P(A), P(B) &gt; 0', 'excluyentes ⇒ dependientes (P(A ∩ B) = 0 ≠ P(A)·P(B))']])}
        ${lab(0)}
        <h2>Tres sucesos</h2>
        <p>A, B y C son (mutuamente) independientes si se cumplen las <strong>cuatro</strong> igualdades: P(A ∩ B) = P(A)P(B), P(A ∩ C) = P(A)P(C), P(B ∩ C) = P(B)P(C) y P(A ∩ B ∩ C) = P(A)P(B)P(C). Basta que falle una para que no lo sean.</p>
        ${note('Para probar independencia en el parcial: calculá los dos lados (P(A ∩ B) y P(A)·P(B)), compará y concluí con una frase. No alcanza con decir “no se afectan”.', 'exam')}`,
      labs: [
        { type: 'venn', title: 'Buscá sucesos independientes', intro: 'Con 12 resultados equiprobables. Ejemplo independiente: A = {1, …, 6} (P = 1/2) y B = {1, 2, 7, 8} (P = 1/3): A ∩ B = {1, 2} y 2/12 = 1/2 · 1/3.', S: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], A: [1, 2, 3, 4, 5, 6], B: [1, 2, 7, 8], label: 'Espacio muestral de 12 resultados equiprobables' },
      ],
      exercises: [
        { title: 'Tres sucesos con datos', official: '2.10', level: 2, prompt: '<p>P(A) = 1/4, P(B) = 1/2, P(C) = 1/6, P(A ∩ C) = 1/12, P(A ∩ B) = 1/8. Verdadero o falso: a) A y B son mutuamente excluyentes; b) A y B son independientes; c) A, B y C son independientes; d) A es independiente de C; e) A es independiente de B.</p>',
          solution: { explain: `<p>(En la versión digital del TP se perdieron los símbolos; las probabilidades dadas solo tienen sentido como intersecciones, porque P(A ∪ C) no puede ser 1/12 &lt; P(A).)</p>
            <p>a) <strong>Falso</strong>: P(A ∩ B) = 1/8 ≠ 0.</p>
            <p>b) <strong>Verdadero</strong>: P(A)·P(B) = 1/4·1/2 = 1/8 = P(A ∩ B).</p>
            <p>c) <strong>Falso</strong>: para eso tienen que ser independientes de a pares, y A y C no lo son (ítem d).</p>
            <p>d) <strong>Falso</strong>: P(A)·P(C) = 1/4·1/6 = 1/24 ≠ 1/12 = P(A ∩ C).</p>
            <p>e) <strong>Verdadero</strong> (es el ítem b).</p>` } },
      ],
      quiz: [
        { q: 'A y B son independientes si…', o: ['A ∩ B = ∅', 'P(A ∩ B) = P(A)·P(B)', 'P(A) = P(B)', 'P(A ∪ B) = 1'], a: 1, e: 'Equivale a P(A | B) = P(A).' },
        { q: 'Dos sucesos excluyentes con probabilidad positiva son…', o: ['independientes', 'dependientes', 'complementarios', 'equiprobables'], a: 1, e: 'P(A ∩ B) = 0 ≠ P(A)·P(B).' },
        { q: 'Extracciones sucesivas sin reposición son…', o: ['independientes', 'dependientes', 'excluyentes', 'imposibles'], a: 1, e: 'La primera cambia la composición.' },
        { q: 'P(A) = 0,4, P(B) = 0,5 y P(A ∩ B) = 0,2. A y B son…', o: ['independientes', 'dependientes', 'excluyentes', 'complementarios'], a: 0, e: '0,4·0,5 = 0,2.' },
        { q: 'Para que A, B y C sean independientes alcanza con…', o: ['que lo sean de a pares', 'que P(A ∩ B ∩ C) = P(A)P(B)P(C)', 'las dos condiciones a la vez', 'que sean excluyentes'], a: 2, e: 'Hacen falta las cuatro igualdades.' },
        { q: 'Si A y B son independientes, P(A | B) es…', o: ['P(B)', 'P(A)', 'P(A)·P(B)', '0'], a: 1, e: 'B no aporta información sobre A.' },
      ],
      open: [
        { t: 'num', q: 'Si A y B son independientes con P(A) = 0,3 y P(B) = 0,6, ¿cuánto vale P(A ∪ B)?', a: 0.72, e: 'P(A ∩ B) = 0,18; P(A ∪ B) = 0,3 + 0,6 − 0,18 = 0,72.' },
        { t: 'text', q: '¿Cómo se prueba si dos sucesos son independientes? Usá el TP 2, ej. 12 como ejemplo.', k: [['p(a)·p(b)', 'p(a).p(b)', 'producto', 'p(a)p(b)'], ['intersección', 'p(a ∩ b)', 'conjunta'], ['dependientes', 'no son independientes', '≠', 'distinto']], need: 2, e: 'Se compara la <b>intersección</b> P(A ∩ B) con el <b>producto</b> P(A)·P(B). En el ej. 12: P(A ∩ B) = 0,516 y P(A)·P(B) = 0,721·0,648 = 0,467. Son <b>distintos</b> → A y B son <b>dependientes</b>.' },
      ],
      sources: [
        { title: 'Apunte: Probabilidad Condicional', ref: 'Cátedra, UTN-FRT', points: ['Probabilidad condicional para sucesos independientes: P(A | B) = P(A).'] },
        { title: 'Clase 4', ref: 'Prof. Teri', points: ['A y B son independientes si P(A | B) = P(A) o P(A ∩ B) = P(A)·P(B); dependientes si P(A ∩ B) ≠ P(A)·P(B).'] },
      ],
    },
    {
      id: 'probabilidad-total-bayes',
      module: 'u4',
      title: 'Probabilidad total y teorema de Bayes',
      keywords: 'partición probabilidad total teorema de Bayes a priori a posteriori árbol de probabilidades sucursales defectuosos despertador urnas cheques ecografías',
      tldr: 'Si A₁, …, Aₙ forman una <strong>partición</strong> de S (excluyentes y cubren todo), la probabilidad de cualquier B se arma por ramas: <mark>P(B) = Σ P(Aᵢ)·P(B | Aᵢ)</mark> (probabilidad total). <strong>Bayes</strong> da vuelta la condicional: sabiendo que ocurrió B, <mark>P(Aᵢ | B) = P(Aᵢ)·P(B | Aᵢ) / P(B)</mark>. P(Aᵢ) son las probabilidades <strong>a priori</strong>; P(Aᵢ | B), las <strong>a posteriori</strong>.',
      goals: ['Reconocer una partición y dibujar el árbol de probabilidades.', 'Aplicar la probabilidad total.', 'Aplicar Bayes para “volver” del efecto observado a la causa.'],
      body: `
        <h2>Partición</h2>
        <p>Los sucesos A₁, A₂, …, Aₙ forman una <strong>partición</strong> de S si son mutuamente excluyentes (Aᵢ ∩ Aⱼ = ∅ para i ≠ j) y su unión es S. Cada resultado cae en exactamente uno: las sucursales de las que proviene un artículo, el aparato con el que se hizo la ecografía, la urna elegida.</p>
        <h2>Probabilidad total</h2>
        <p>Cualquier suceso B se reparte entre las partes: P(B) = P(B ∩ A₁) + … + P(B ∩ Aₙ). Usando la regla de la multiplicación en cada término:</p>
        ${eq('P(B) = Σ P(Aᵢ)·P(B | Aᵢ) = P(A₁)P(B | A₁) + … + P(Aₙ)P(B | Aₙ)', 'Probabilidad total')}
        <p>En el árbol: se multiplica a lo largo de cada camino que termina en B y se suman los caminos. Ejemplo del apunte (peces): 40 % azules con 30 % machos y 60 % rojos con 40 % hembras (60 % machos). P(macho) = 0,4·0,3 + 0,6·0,6 = <strong>0,48</strong>.</p>
        <h2>Teorema de Bayes</h2>
        ${eq(`P(Aᵢ | B) = ${frac('P(Aᵢ)·P(B | Aᵢ)', 'Σ P(Aⱼ)·P(B | Aⱼ)')}`, 'Bayes')}
        ${table(['Término', 'Nombre', 'Qué es'], [['P(Aᵢ)', 'a priori', 'lo que se sabe antes de observar B'], ['P(B | Aᵢ)', 'verosimilitud', 'probabilidad de B en la hipótesis Aᵢ'], ['P(Aᵢ | B)', 'a posteriori', 'lo que se sabe de Aᵢ después de observar B']])}
        <p>Bayes vincula P(A | B) con P(B | A): sabiendo cuán probable es el dolor de cabeza si se tiene gripe, se puede estimar la probabilidad de tener gripe si duele la cabeza. Se usa en diagnóstico médico y en los filtros de spam.</p>
        ${lab(0)}
        <h3>Ejemplo del apunte: ecógrafos</h3>
        <p>Uso de los equipos: 25 %, 35 % y 40 %; probabilidad de error: 1 %, 2 % y 3 %. Un resultado salió con error: ¿qué tan probable es que sea del primer aparato?</p>
        <p>P(E) = 0,25·0,01 + 0,35·0,02 + 0,40·0,03 = ${num(eco, 4)}. P(1.º | E) = 0,0025/${num(eco, 4)} = <strong>${n4(0.0025 / eco)}</strong> ≈ 12 %.</p>
        ${note('Cómo reconocer un Bayes en el enunciado: te dan probabilidades “si viene de…” (P(B | Aᵢ)) y te preguntan “si salió defectuoso, ¿de dónde vino?” (P(Aᵢ | B)). Siempre se calcula primero la probabilidad total, que va al denominador.', 'exam')}`,
      labs: [
        { type: 'bayes', title: 'Árbol del TP 2, ejercicio 14', intro: 'Tres sucursales con sus porcentajes de compra y de defectuosos. Mové los sliders y mirá cómo cambian la probabilidad total y las a posteriori.', names: ['A', 'B', 'C'], priors: b14.pr, likes: b14.lk, ev: 'defectuoso' },
      ],
      exercises: [
        { title: 'El despertador', official: '2.13', level: 1, prompt: '<p>El despertador suena con probabilidad 0,7. Si suena, la persona se despierta (a tiempo) con probabilidad 0,8; si no suena, con 0,30. ¿Probabilidad de llegar a tiempo?</p>',
          solution: { explain: '<p>Partición: suena (S) / no suena (S̄). Probabilidad total: P(T) = P(S)·P(T | S) + P(S̄)·P(T | S̄) = 0,7·0,8 + 0,3·0,3 = 0,56 + 0,09 = <strong>0,65</strong>.</p>' } },
        { title: 'Tres sucursales', official: '2.14', level: 2, prompt: '<p>Se compra el 30 % a la sucursal A, el 50 % a la B y el 20 % a la C. Defectuosos: 0,10 en A, 0,30 en B y 0,25 en C. a) P(defectuoso). b) Si es defectuoso, P(que venga de B).</p>',
          solution: { explain: `<p>a) P(D) = 0,3·0,10 + 0,5·0,30 + 0,2·0,25 = 0,03 + 0,15 + 0,05 = <strong>${num(b14D, 2)}</strong>.</p><p>b) P(B | D) = 0,15/0,23 = <strong>${n4(0.15 / b14D)}</strong>. (A: 0,03/0,23 = ${n4(0.03 / b14D)}; C: 0,05/0,23 = ${n4(0.05 / b14D)}.) Aunque B vende la mitad, explica el 65 % de los defectuosos.</p>` } },
        { title: 'Cheques con fecha adelantada', official: '2.15', level: 2, prompt: '<p>Los clientes con fondos suficientes firman cheques adelantados por error una vez cada mil. Los que firman sin fondos (1 % de los clientes) siempre lo hacen adelantado. Llega un cheque adelantado: ¿probabilidad de que sea de un cliente sin fondos?</p>',
          solution: { explain: `<p>Partición: I (insuficiente, 0,01) y Ī (suficiente, 0,99). P(Adel | I) = 1; P(Adel | Ī) = 0,001.</p><p>P(Adel) = 0,01·1 + 0,99·0,001 = 0,01099.</p><p>P(I | Adel) = 0,01/0,01099 = <strong>${n4(b15)}</strong>. Un cheque adelantado es, con 91 % de probabilidad, de un cliente sin fondos.</p>` } },
        { title: 'Dos urnas con monedas', official: '2.16', level: 2, prompt: '<p>Urna I: un cajón con oro y otro con plata. Urna II: oro en los dos cajones. Se elige una urna al azar y un cajón al azar: la moneda es de oro. ¿Probabilidad de que venga de la urna II?</p>',
          solution: { explain: '<p>P(I) = P(II) = 0,5; P(oro | I) = 0,5; P(oro | II) = 1.</p><p>P(oro) = 0,5·0,5 + 0,5·1 = 0,75. P(II | oro) = 0,5/0,75 = <strong>2/3 ≈ 0,6667</strong>. Ver oro hace más creíble la urna que tiene más oro (de 1/2 a 2/3).</p>' } },
      ],
      quiz: [
        { q: 'Para aplicar probabilidad total, los Aᵢ deben…', o: ['ser independientes', 'formar una partición de S', 'tener la misma probabilidad', 'ser dos'], a: 1, e: 'Excluyentes y que cubran S.' },
        { q: 'En Bayes, P(Aᵢ) se llama probabilidad…', o: ['a posteriori', 'a priori', 'total', 'condicional'], a: 1, e: 'Antes de observar B.' },
        { q: 'El denominador de Bayes es…', o: ['P(Aᵢ)', 'P(B | Aᵢ)', 'la probabilidad total P(B)', '1'], a: 2, e: 'Σ P(Aⱼ)P(B | Aⱼ).' },
        { q: 'Peces: 40 % azules (30 % machos) y 60 % rojos (60 % machos). P(macho) =', o: ['0,45', '0,48', '0,90', '0,36'], a: 1, e: '0,12 + 0,36.' },
        { q: 'Despertador del TP: P(llegar a tiempo) =', o: ['0,56', '0,65', '0,8', '0,3'], a: 1, e: '0,56 + 0,09.' },
        { q: 'Las probabilidades a posteriori de una partición suman…', o: ['P(B)', '1', '0', 'n'], a: 1, e: 'Son una distribución sobre las causas.' },
        { q: 'En el TP 2, ej. 16, observar oro hace que P(urna II)…', o: ['baje a 1/3', 'quede en 1/2', 'suba a 2/3', 'sea 1'], a: 2, e: '0,5/0,75.' },
      ],
      open: [
        { t: 'num', q: 'TP 2, ej. 14 a): probabilidad de que un artículo elegido al azar sea defectuoso.', a: b14D, e: '0,3·0,1 + 0,5·0,3 + 0,2·0,25 = 0,23.' },
        { t: 'num', q: 'TP 2, ej. 14 b): si es defectuoso, probabilidad de que provenga de B.', a: 0.15 / b14D, e: '0,15/0,23 = 0,6522.' },
        { t: 'num', q: 'TP 2, ej. 15: probabilidad de que un cheque adelantado sea de un cliente sin fondos.', a: b15, e: '0,01/(0,01 + 0,99·0,001) = 0,9099.' },
        { t: 'num', q: 'Ecógrafos (25 %, 35 %, 40 % de uso; 1 %, 2 %, 3 % de error): P(1.º aparato | error).', a: 0.0025 / eco, e: `P(E) = ${num(eco, 4)}; 0,0025/${num(eco, 4)} = ${n4(0.0025 / eco)}.` },
        { t: 'text', q: '¿Qué diferencia hay entre una probabilidad a priori y una a posteriori en el teorema de Bayes?', k: [['antes', 'previa', 'sin información'], ['después', 'observar', 'ocurrió', 'dado b', 'actualizada'], ['p(a', 'causa', 'hipótesis']], need: 2, e: 'La <b>a priori</b> P(Aᵢ) es la probabilidad de la causa <b>antes</b> de observar nada. La <b>a posteriori</b> P(Aᵢ | B) es la probabilidad de esa causa <b>después de observar</b> B: Bayes actualiza la a priori con la información nueva.' },
      ],
      sources: [
        { title: 'Apunte: Probabilidad Condicional', ref: 'Cátedra, UTN-FRT', points: ['Partición, teorema de la probabilidad total (peces: 0,48) y teorema de Bayes (ecógrafos: 0,116).'] },
        { title: 'Clase 4', ref: 'Prof. Teri', points: ['Esquema: principio de la multiplicación → probabilidad total → Bayes. “No tengo la intersección”.'] },
      ],
    },
  );
})();
