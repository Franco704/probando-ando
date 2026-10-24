# Probando Ando

Guía de estudio de **Probabilidad y Estadística 2026 (UTN-FRT, Ingeniería en Sistemas de Información, comisiones 3K1 a 3K4)**, armada con los apuntes de la cátedra, las clases de la Prof. Teri y los trabajos prácticos 1 a 6. Separada por instancia de examen, cada una con su color:

- **Primer parcial** (azul): estadística descriptiva y medidas (TP 1), probabilidad, condicional y Bayes (TP 2), variables aleatorias discretas, Binomial y Poisson (TP 3).
- **Segundo parcial** (violeta): variables aleatorias continuas, Normal y exponencial (TP 4), muestreo, Teorema del Límite Central e intervalos de confianza (TP 5), test de hipótesis (TP 6).
- **Final** (ámbar): toda la materia.

Contenido:

- 29 lecciones con la teoría de la cátedra, glifo animado por tema y pantalla de entrada con el error típico del parcial.
- 28 laboratorios interactivos: tabla de frecuencias e histograma, medidas sobre un diagrama de puntos, asimetría, sucesos en un diagrama de Venn, ley de los grandes números, árbol de Bayes, distribuciones discretas (Binomial, Poisson y las de los TP), área bajo densidades, tipificación y tabla normal (directa e inversa), exponencial, Teorema del Límite Central, t contra normal, intervalos de confianza simulados, test de hipótesis y errores de tipo I y II.
- 180 preguntas de opción múltiple y 110 **preguntas abiertas corregidas al instante**: cálculos con tolerancia de redondeo (acepta “0,1536”, “1/6” o “15 %”) y teóricas por conceptos clave, con respuesta modelo.
- 95 ejercicios resueltos, 89 de ellos de los TP 1 a 6. Las tablas de frecuencias, las medidas, las probabilidades y los valores de tabla se calculan en la página con el mismo código que los laboratorios.
- **Tablas** de la cátedra (Binomial y Poisson acumuladas, Normal estándar y t de Student) calculadas en la página, porque las del material vienen como imágenes.
- Cuestionario por tema, simulacro de cada parcial y del final (opción múltiple + abiertas), repaso de lo fallado, taller de gráficas y hoja de fórmulas.

Sitio en GitHub Pages: [franco704.github.io/probando-ando](https://franco704.github.io/probando-ando/)

No necesita instalación: es HTML, CSS y JavaScript. Abrí `index.html`. El progreso se guarda en el navegador.

Pruebas: `node tests/st.test.js` (cálculos contra los ejemplos de clase y de los apuntes) y `node tests/content.test.js` (estructura del contenido; también verifica que cada pregunta abierta acepte su propia respuesta).

## Notas sobre el material

- En la versión digital de algunos TP se perdieron símbolos (∪, ∩, ≤, ≥, complementos y algunas fórmulas). Donde pasó (TP 2 ej. 2, 7 y 10; TP 3 ej. 2 y 12; TP 4 ej. 7), la solución indica qué lectura se resolvió y, si hay dos posibles, da las dos.
- Se señalan errores de cuenta del material: el lote con 2 % de defectuosos (0,00292, no 0,0292), la osteoporosis (58/697 = 0,0832), los autos de la clase 6 (0,1465) y las piezas (P(X ≥ 47) = 0,7604).
- La moda de datos agrupados usa Mo = L + A·f(i+1)/(f(i−1) + f(i+1)); el apunte escribe f(i−1) en el numerador. La lección lo explica y muestra también la variante de Czuber.

## También probá

- [Backeando Ando](https://franco704.github.io/backeando-ando/) ([repositorio](https://github.com/Franco704/backeando-ando))
- [Fronteando Ando](https://franco704.github.io/fronteando-ando/) ([repositorio](https://github.com/Franco704/fronteando-ando))
- [Diseñando Ando](https://franco704.github.io/disenando-ando/) ([repositorio](https://github.com/Franco704/disenando-ando))
- [Iterando Ando](https://franco704.github.io/iterando-ando/) ([repositorio](https://github.com/Franco704/iterando-ando))
- [Modulando Ando](https://franco704.github.io/modulando-ando/) ([repositorio](https://github.com/Franco704/modulando-ando))
- [Economizar](https://franco704.github.io/economizar/) ([repositorio](https://github.com/Franco704/economizar))

## Agradecimientos

A **Mateo Rusconi**, autor original de las animaciones que esta guía hereda de Backeando Ando: la pantalla de entrada a cada tema, los glifos animados de las lecciones y los microefectos de los cuestionarios vienen de su "Laboratorio Frontend DSW".
