// Progreso del alumno, guardado en el navegador. Las claves pa-* son las de la versión anterior: nadie pierde lo hecho.
import { almacen } from '../nucleo/almacen.js';
import { LECCIONES, PREGUNTAS, ABIERTAS, preguntaPorId, leccionesDe } from '../temario/indice.js';

export const hechas = new Set(almacen.leer('pa-done', []));
// Resultado por pregunta: { [id]: { ok, tries } }. id = lección:índice (opción múltiple) o lección:oN (abierta)
export const respuestas = almacen.leer('pa-answers', {});
export const mejores = almacen.leer('pa-best', {});

const oyentes = new Set();
export const alCambiarProgreso = (fn) => oyentes.add(fn);
const avisar = () => oyentes.forEach((fn) => fn());

export function alternarHecha(id) {
  hechas.has(id) ? hechas.delete(id) : hechas.add(id);
  almacen.guardar('pa-done', [...hechas]);
  avisar();
  return hechas.has(id);
}

export function registrar(q, ok) {
  respuestas[q.id] = { ok, tries: (respuestas[q.id]?.tries || 0) + 1 };
  almacen.guardar('pa-answers', respuestas);
  avisar();
}

export function guardarMejor(modId, pct) {
  mejores[modId] = Math.max(mejores[modId] ?? 0, pct);
  almacen.guardar('pa-best', mejores);
  avisar();
}

export const paraRepasar = () => Object.keys(respuestas).filter((id) => preguntaPorId[id] && !respuestas[id].ok);
export const hechasDe = (modId) => leccionesDe(modId).filter((l) => hechas.has(l.id)).length;
export const siguienteLeccion = () => LECCIONES.find((l) => !hechas.has(l.id)) || LECCIONES[0];

// Porcentaje de aciertos del módulo; null hasta tener al menos 3 respuestas
export function aciertos(modId) {
  const qs = [...PREGUNTAS, ...ABIERTAS].filter((q) => q.module === modId && respuestas[q.id]);
  return qs.length < 3 ? null : Math.round((qs.filter((q) => respuestas[q.id].ok).length / qs.length) * 100);
}
