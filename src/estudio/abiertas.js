// Preguntas abiertas corregidas al instante: cálculos con tolerancia de redondeo (decimal, fracción o porcentaje) y teóricas por conceptos.
import { $ } from '../nucleo/dom.js';
import { S } from '../estadistica/calculos.js';
import { preguntaPorId } from '../temario/indice.js';
import { registrar } from './progreso.js';

const TIPO = { num: 'Cálculo', text: 'Teórica' };
const entrada = (q) => (q.t === 'text'
  ? '<textarea rows="3" aria-label="Tu respuesta" placeholder="Escribí tu respuesta como en el parcial"></textarea>'
  : `<input type="text" inputmode="decimal" autocomplete="off" spellcheck="false" aria-label="Tu respuesta" placeholder="Ej: 0,2514 · 1/6 · 15 %">${q.u ? `<span class="oq-u">${q.u}</span>` : ''}`);

// modo 'inline' / 'review': botón Comprobar por pregunta. 'exam': se corrige todo junto (devuelve { grade, answered }).
export function montarAbiertas(el, qs, { mode, start = 0 } = {}) {
  el.innerHTML = `<ol class="oq-list" start="${start + 1}">${qs.map((q, n) => `
    <li class="oq" data-id="${q.id}" data-t="${q.t}">
      <p class="oq-q"><span class="q-n">${start + n + 1}.</span> <span class="oq-kind">${TIPO[q.t]}</span> ${q.q}${mode !== 'inline' ? `<span class="q-from">${q.lesson.title}</span>` : ''}</p>
      <div class="oq-in">${entrada(q)}${mode === 'exam' ? '' : '<button class="btn sm primary" type="button" data-act="check">Comprobar</button>'}</div>
      <div class="oq-fb" aria-live="polite"></div>
    </li>`).join('')}</ol>`;
  const devolucion = (li, q, res) => {
    li.classList.remove('is-ok', 'is-bad');
    li.classList.add(res.ok ? 'is-ok' : 'is-bad');
    const propia = !res.ok && q.t === 'text' && !res.empty && mode !== 'exam';
    $('.oq-fb', li).innerHTML = `${res.html}
      <details class="oq-model" ${res.ok || mode === 'exam' ? '' : 'open'}><summary>${q.t === 'text' ? 'Respuesta modelo' : 'Desarrollo'}</summary><div>${q.e}</div></details>
      ${propia ? '<p class="oq-self"><button class="btn sm" type="button" data-act="self">Mi respuesta decía lo mismo con otras palabras</button></p>' : ''}
      ${!res.ok ? `<p class="q-link"><a href="#/${q.lesson.id}">Releer “${q.lesson.title}”</a></p>` : ''}`;
  };
  const valor = (li) => $('input, textarea', li).value;
  if (mode !== 'exam') {
    el.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      const li = b.closest('.oq'), q = preguntaPorId[li.dataset.id];
      if (b.dataset.act === 'check') { const res = S.checkOpen(q, valor(li)); devolucion(li, q, res); if (!res.empty) registrar(q, res.ok); }
      if (b.dataset.act === 'self') { registrar(q, true); li.classList.replace('is-bad', 'is-ok'); b.closest('.oq-self').innerHTML = '<span class="chip ok">Marcada como correcta</span>'; }
    });
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.matches('input')) { e.preventDefault(); $('[data-act="check"]', e.target.closest('.oq')).click(); }
    });
    return null;
  }
  return {
    answered: () => [...el.querySelectorAll('.oq')].filter((li) => valor(li).trim()).length,
    grade: () => [...el.querySelectorAll('.oq')].map((li) => {
      const q = preguntaPorId[li.dataset.id], res = S.checkOpen(q, valor(li));
      devolucion(li, q, res);
      $('input, textarea', li).disabled = true;
      registrar(q, res.ok);
      return [q, res.ok];
    }),
  };
}
