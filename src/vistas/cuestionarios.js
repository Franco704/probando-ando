// Práctica con preguntas: cuestionario de un módulo, simulacro de un parcial (o del final), repaso de lo fallado y abiertas.
import { $, shuffle } from '../nucleo/dom.js';
import { PARCIALES, PENDIENTES, PREGUNTAS, ABIERTAS, preguntaPorId, parcial, leccionesDe, modulosDe, modulo, etiqueta } from '../temario/indice.js';
import { montarCuestionario } from '../estudio/opcion-multiple.js';
import { montarAbiertas } from '../estudio/abiertas.js';
import { respuestas, mejores, guardarMejor, paraRepasar, siguienteLeccion } from '../estudio/progreso.js';

// Primero las que fallaste, después las que nunca respondiste, al final las que acertaste
const peso = (q) => (respuestas[q.id]?.ok === false ? 0 : respuestas[q.id] ? 2 : 1);

export function vistaCuestionarioModulo(main, m) {
  document.title = `Cuestionario: ${m.title}`;
  document.body.dataset.unit = m.unit;
  const pool = PREGUNTAS.filter((q) => q.module === m.id);
  const qs = shuffle(pool).sort((a, b) => peso(a) - peso(b)).slice(0, 15);
  const os = shuffle(ABIERTAS.filter((q) => q.module === m.id)).sort((a, b) => peso(a) - peso(b)).slice(0, 3);
  main.innerHTML = `
    <article class="lesson quiz-page">
      <p class="crumb"><a href="#/${leccionesDe(m.id)[0].id}">Tema ${m.tema}: ${m.title}</a></p>
      <h1>Cuestionario del módulo</h1>
      <p class="tldr">${qs.length} preguntas de opción múltiple de las ${pool.length} del módulo y ${os.length} abiertas. Aparecen primero las que fallaste y las que nunca respondiste.${mejores[m.id] != null ? ` Tu mejor resultado: ${mejores[m.id]} %.` : ''}</p>
      <div class="quiz-mount"></div>
    </article>`;
  montarCuestionario($('.quiz-mount', main), qs, { mode: 'exam', extra: os, onFinish: (pct) => guardarMejor(m.id, pct) });
}

export function vistaSimulacro(main, uid) {
  const u = parcial(uid);
  if (!u) { location.replace(`#/simulacro/${modulo(siguienteLeccion().module).unit}`); return; }
  document.title = `Simulacro ${u.title.toLowerCase()}, Probando Ando`;
  document.body.dataset.unit = u.id;
  const mods = modulosDe(u.id);
  // Reparte las preguntas entre las unidades para que ninguna domine
  const repartir = (pool, max) => {
    const porMod = mods.map((m) => shuffle(pool.filter((q) => q.module === m.id))).filter((a) => a.length);
    const out = [];
    for (let i = 0; out.length < max && porMod.some((a) => a[i]); i++) shuffle(porMod).forEach((a) => a[i] && out.length < max && out.push(a[i]));
    return out;
  };
  const qs = repartir(PREGUNTAS, 20), os = repartir(ABIERTAS, 5);
  const pend = PENDIENTES.filter((m) => u.all || m.unit === u.id);
  main.innerHTML = `
    <article class="lesson quiz-page">
      <nav class="filtro" aria-label="Elegir el simulacro">${PARCIALES.map((x) => `<a class="btn sm" data-u="${x.id}" href="#/simulacro/${x.id}"${x === u ? ' aria-current="page"' : ''}>${x.title}</a>`).join('')}</nav>
      <h1>Simulacro: ${u.title.toLowerCase()}</h1>
      <p class="tldr">${qs.length} preguntas de opción múltiple y ${os.length} abiertas de ${u.name.toLowerCase()} (temas ${mods.map((m) => m.tema).join(', ')}). Respondé todas y corregí al final.${pend.length ? ` Todavía no entran ${pend.map((m) => m.title).join(' ni ')}: su contenido está pendiente.` : ''} La práctica de cálculo se completa con los ejercicios de los TP de cada lección y las <a href="#/tablas">tablas</a>.</p>
      <div class="quiz-mount"></div>
    </article>`;
  montarCuestionario($('.quiz-mount', main), shuffle(qs), { mode: 'exam', extra: os });
}

export function vistaRepaso(main) {
  document.title = 'Repasar, Probando Ando';
  const ids = paraRepasar();
  const qs = ids.map((id) => preguntaPorId[id]).filter((q) => !q.open);
  const os = ids.map((id) => preguntaPorId[id]).filter((q) => q.open);
  main.innerHTML = `
    <article class="lesson quiz-page">
      <h1>Repasar</h1>
      ${ids.length ? `<p class="tldr">${ids.length === 1 ? 'Esta es la pregunta que respondiste mal' : `Estas son las ${ids.length} preguntas que respondiste mal`} la última vez. Cuando aciertes una, sale de la lista.</p><div class="quiz-mount"></div>${os.length ? '<h2>Abiertas</h2><div class="open-mount"></div>' : ''}`
        : `<p class="tldr">No tenés preguntas pendientes. Cada vez que falles una, en una lección, un cuestionario o un simulacro, aparece acá para que la vuelvas a intentar.</p>
           <p class="acciones">${PARCIALES.map((u, i) => `<a class="btn${i ? '' : ' primary'}" href="#/simulacro/${u.id}">Simulacro: ${u.title.toLowerCase()}</a>`).join('')}</p>`}
    </article>`;
  if (qs.length) montarCuestionario($('.quiz-mount', main), qs, { mode: 'review' });
  if (os.length) montarAbiertas($('.open-mount', main), os, { mode: 'review' });
}

// Todas las abiertas, filtrables por parcial
export function vistaAbiertas(main, uid) {
  const u = parcial(uid);
  document.title = 'Preguntas abiertas, Probando Ando';
  if (u) document.body.dataset.unit = u.id;
  const mods = u ? modulosDe(u.id) : modulosDe('final');
  const qs = ABIERTAS.filter((q) => mods.some((m) => m.id === q.module));
  const bien = qs.filter((q) => respuestas[q.id]?.ok).length;
  main.innerHTML = `
    <article class="lesson quiz-page">
      <h1>Preguntas abiertas</h1>
      <p class="tldr">Como en el parcial: hay que escribir la respuesta, no elegirla. <mark>Cálculos</mark>: decimal, fracción o porcentaje (0,1536 · 1/6 · 15 %), con tolerancia de redondeo. <mark>Teóricas</mark>: se buscan los conceptos que no pueden faltar; si dijiste lo mismo con otras palabras, marcala como correcta después de leer la respuesta modelo.</p>
      <nav class="filtro" aria-label="Filtrar por parcial">
        <a class="btn sm" href="#/abiertas"${u ? '' : ' aria-current="page"'}>Todas (${ABIERTAS.length})</a>
        ${PARCIALES.filter((x) => !x.all).map((x) => `<a class="btn sm" data-u="${x.id}" href="#/abiertas/${x.id}"${u === x ? ' aria-current="page"' : ''}>${x.title} (${ABIERTAS.filter((q) => modulo(q.module).unit === x.id).length})</a>`).join('')}
      </nav>
      <p class="sec-lede">${bien} de ${qs.length} resueltas bien.</p>
      ${mods.map((m) => (qs.some((q) => q.module === m.id) ? `<section class="open-mod" data-u="${m.unit}"><h2><span class="mod-tag">${etiqueta(m)}</span>${m.title}</h2><div class="open-mount" data-m="${m.id}"></div></section>` : '')).join('')}
    </article>`;
  let k = 0;
  main.querySelectorAll('.open-mount').forEach((el) => { const mq = qs.filter((q) => q.module === el.dataset.m); montarAbiertas(el, mq, { mode: 'review', start: k }); k += mq.length; });
}
