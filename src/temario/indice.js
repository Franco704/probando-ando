// Todo el temario listo para las vistas, más las consultas que usan.
import { PARCIALES, MODULOS as TODOS_LOS_MODULOS } from './catalogo.js';
import { LESSONS } from './lecciones.js';
import { FORMULAS } from '../estudio/formulas.js';

export { PARCIALES, TODOS_LOS_MODULOS, FORMULAS };
export const LECCIONES = LESSONS;
// Solo los módulos que ya tienen lecciones cargadas; el resto se muestra como pendiente
export const MODULOS = TODOS_LOS_MODULOS.filter((m) => LECCIONES.some((l) => l.module === m.id));
export const PENDIENTES = TODOS_LOS_MODULOS.filter((m) => !MODULOS.includes(m));

// Todas las preguntas con id estable (lección:índice y lección:oN): el progreso guardado depende de estos ids.
export const PREGUNTAS = LECCIONES.flatMap((l) => (l.quiz || []).map((q, i) => ({ ...q, id: `${l.id}:${i}`, lesson: l, module: l.module })));
export const ABIERTAS = LECCIONES.flatMap((l) => (l.open || []).map((q, i) => ({ ...q, id: `${l.id}:o${i}`, lesson: l, module: l.module, open: true })));
export const preguntaPorId = Object.fromEntries([...PREGUNTAS, ...ABIERTAS].map((q) => [q.id, q]));
export const EJERCICIOS = LECCIONES.flatMap((l) => (l.exercises || []).map((ex) => ({ ex, l })));

export const parcial = (id) => PARCIALES.find((u) => u.id === id);
export const modulo = (id) => TODOS_LOS_MODULOS.find((m) => m.id === id);
export const leccionesDe = (modId) => LECCIONES.filter((l) => l.module === modId);
// Módulos que entran en un parcial: el final integra todos
export const modulosDe = (u) => (parcial(u)?.all ? MODULOS : MODULOS.filter((m) => m.unit === u));
export const etiqueta = (m) => `Tema ${m.tema}, TP ${m.tp}`;
