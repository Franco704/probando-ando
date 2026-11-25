/* Parciales y módulos (unidades del programa con su TP). Cada lección indica su módulo; cada módulo, su parcial. */
  // all: el simulacro toma preguntas de todos los módulos (el final integra la materia completa)
  export const PARCIALES = [
    { id: 'p1', title: 'Primer parcial', name: 'Descriptiva, probabilidad y discretas' },
    { id: 'p2', title: 'Segundo parcial', name: 'Continuas, muestreo e inferencia' },
    { id: 'final', title: 'Final', name: 'Toda la materia', all: true },
  ];

  // stop = nombre corto para el recorrido de la portada; tema = orden del tema en la materia; tp = trabajo práctico (y parte)
  export const MODULOS = [
    { id: 'u1', unit: 'p1', tema: '1', tp: '1 (I)', title: 'Estadística descriptiva: datos y frecuencias', stop: 'f · fr', blurb: 'población y muestra, tipos de variables, tablas de frecuencias, intervalos de clase, barras e histogramas' },
    { id: 'u2', unit: 'p1', tema: '2', tp: '1 (II)', title: 'Medidas de posición y de dispersión', stop: 'x̄ · s', blurb: 'media, mediana y moda con datos sueltos y agrupados, varianza, desvío, rango y asimetría' },
    { id: 'u3', unit: 'p1', tema: '3', tp: '2', title: 'Introducción a la probabilidad', stop: 'P(A)', blurb: 'experimento aleatorio, espacio muestral, sucesos, Laplace, axiomas, conteo y combinatoria' },
    { id: 'u4', unit: 'p1', tema: '4', tp: '2', title: 'Probabilidad condicional y Bayes', stop: 'P(A|B)', blurb: 'probabilidad condicional, regla de la multiplicación, independencia, probabilidad total y Bayes' },
    { id: 'u5', unit: 'p1', tema: '5', tp: '3', title: 'Variables aleatorias discretas', stop: 'f(x)', blurb: 'variable aleatoria, función de probabilidad, acumulada, esperanza, varianza y desvío' },
    { id: 'u6', unit: 'p1', tema: '6', tp: '3', title: 'Distribuciones Binomial y Poisson', stop: 'B · Po', blurb: 'experimento binomial, proceso de Poisson, fórmulas, tablas acumuladas, media y varianza' },
    { id: 'u7', unit: 'p2', tema: '7', tp: '4', title: 'Variables aleatorias continuas', stop: '∫ f dx', blurb: 'función de densidad, área bajo la curva, acumulada F(x), esperanza, varianza y coeficiente de variación' },
    { id: 'u8', unit: 'p2', tema: '8', tp: '4', title: 'Distribuciones Normal y exponencial', stop: 'N(μ, σ)', blurb: 'campana de Gauss, tipificación, tabla de z, búsqueda inversa y tiempo de espera exponencial' },
    { id: 'u9', unit: 'p2', tema: '9', tp: '5', title: 'Muestreo e intervalos de confianza', stop: 'x̄ ± e', blurb: 'población y muestra, distribución de x̄, Teorema del Límite Central, t de Student e intervalos para μ' },
    { id: 'u10', unit: 'p2', tema: '10', tp: '6', title: 'Test de hipótesis', stop: 'H₀', blurb: 'hipótesis nula y alternativa, una y dos colas, región de rechazo, valor P y errores de tipo I y II' },
  ];

