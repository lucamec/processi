// Componenti SVG condivisi (usati da build.js in Node per generare il markup).
// Tutte le funzioni restituiscono stringhe SVG. I colori vengono da classi CSS
// definite in src/stile.css (m-stampo, m-grezzo, m-fuso, m-finito, m-flusso).
'use strict';

// Palette di riferimento (deve coincidere con le variabili in stile.css).
const PALETTE = {
  stampo: { nome: 'Stampo / utensile', classe: 'm-stampo', colore: '#8d99a6' },
  grezzo: { nome: 'Materiale grezzo (granuli, polvere, lamiera)', classe: 'm-grezzo', colore: '#cfb37a' },
  fuso: { nome: 'Materiale fuso o in lavorazione (accento)', classe: 'm-fuso', colore: '#f06a1d' },
  finito: { nome: 'Pezzo finito (solidificato)', classe: 'm-finito', colore: '#3f8f8a' },
  flusso: { nome: 'Flussi: calore, pressione, vuoto, aria', classe: 'm-flusso', colore: '#4c62d9' },
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Attributo di animazione: tracce per fase. Esempio: anim({ tx: [0, 0, 60] }, { tx: 0 })
// produce data-k="tx:0,0,60" e data-i="tx:0" (valore iniziale della fase 1).
function anim(tracce, iniziali, origine) {
  const k = Object.entries(tracce).map(([p, v]) => `${p}:${v.join(',')}`).join(';');
  let s = ` data-k="${k}"`;
  if (iniziali) s += ` data-i="${Object.entries(iniziali).map(([p, v]) => `${p}:${v}`).join(';')}"`;
  if (origine) s += ` data-o="${origine.join(',')}"`;
  return s;
}

// Definizioni comuni: tratteggio di sezione (45°), punte di freccia, onda di calore.
// `id` rende univoci gli identificatori quando più SVG convivono nella pagina.
function defs(id) {
  return `<defs>
  <pattern id="${id}-tratteggio" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <rect width="8" height="8" class="m-stampo"/>
    <line x1="0" y1="0" x2="0" y2="8" class="tratteggio-linea"/>
  </pattern>
  <pattern id="${id}-tratteggio-pezzo" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
    <rect width="6" height="6" class="m-finito"/>
    <line x1="0" y1="0" x2="0" y2="6" class="tratteggio-linea-chiara"/>
  </pattern>
  <marker id="${id}-punta" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
    <path d="M0,0 L10,5 L0,10 z" class="m-flusso"/>
  </marker>
  <marker id="${id}-punta-scura" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path d="M0,0 L10,5 L0,10 z" class="riempi-testo"/>
  </marker>
</defs>`;
}

// Parte sezionata di stampo/utensile: rettangolo con tratteggio standard.
function stampo({ id, x, y, w, h, extra = '' }) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${id}-tratteggio)" class="contorno"${extra}/>`;
}

// Sagoma qualsiasi sezionata (path) con tratteggio.
function sezione({ id, d, extra = '' }) {
  return `<path d="${d}" fill="url(#${id}-tratteggio)" class="contorno"${extra}/>`;
}

// Pezzo: path riempito con la classe del materiale (grezzo, fuso, finito).
function pezzo({ d, materiale = 'finito', extra = '' }) {
  const sez = materiale === 'finito' ? ' sezionato' : '';
  return `<path d="${d}" class="${PALETTE[materiale].classe}${sez} contorno"${extra}/>`;
}

// Ugello conico rivolto verso destra, con punta in (x, y).
function ugello({ id, x, y, lungo = 34, alto = 40, foro = 8 }) {
  const h = alto / 2, f = foro / 2;
  return `<g class="ugello">
  <path d="M${x - lungo},${y - h} L${x},${y - f - 4} L${x},${y + f + 4} L${x - lungo},${y + h} z" fill="url(#${id}-tratteggio)" class="contorno"/>
  <rect x="${x - lungo}" y="${y - f}" width="${lungo}" height="${foro}" class="cavita"/>
</g>`;
}

// Utensile generico (punzone/fresa) come rettangolo pieno non sezionato.
function utensile({ x, y, w, h, extra = '' }) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" class="m-stampo contorno"${extra}/>`;
}

// Freccia di flusso (pressione, aria, vuoto): linea con punta. tipo: 'pressione' | 'vuoto' | 'aria'
function freccia({ id, x1, y1, x2, y2, tipo = 'pressione', extra = '' }) {
  const cls = tipo === 'vuoto' ? 'flusso-linea tratteggiata' : 'flusso-linea';
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}" marker-end="url(#${id}-punta)"${extra}/>`;
}

// Onda di calore verticale (verso il basso se dir = 1) che parte da (x, y).
function calore({ id, x, y, lungo = 26, dir = 1, extra = '' }) {
  const s = dir * lungo / 4;
  const d = `M${x},${y} q6,${s / 2} 0,${s} q-6,${s / 2} 0,${s} q6,${s / 2} 0,${s} q-6,${s / 2} 0,${s}`;
  return `<path d="${d}" class="flusso-linea" fill="none" marker-end="url(#${id}-punta)"${extra}/>`;
}

// Simbolo di rotazione attorno a (cx, cy).
function rotazione({ id, cx, cy, r = 20, extra = '' }) {
  return `<path d="M${cx + r},${cy} A${r},${r} 0 1 1 ${cx},${cy - r}" class="flusso-linea" fill="none" marker-end="url(#${id}-punta)"${extra}/>`;
}

// Etichetta con linea di richiamo. (tx, ty) testo, (px, py) punto indicato.
function etichetta({ testo, tx, ty, px, py, ancora = 'start', extra = '' }) {
  const linea = px === undefined ? '' : `<line x1="${px}" y1="${py}" x2="${tx}" y2="${ty - 5}" class="richiamo"/>`;
  return `<g class="etichetta"${extra}>${linea}<text x="${tx}" y="${ty}" text-anchor="${ancora}">${esc(testo)}</text></g>`;
}

// Legenda HTML dei materiali (sempre accanto allo schema).
function legendaMateriali(voci = Object.keys(PALETTE)) {
  const righe = voci.map((k) => `<li><svg width="22" height="16" aria-hidden="true" focusable="false"><rect x="1" y="1" width="20" height="14" class="${PALETTE[k].classe}${k === 'finito' ? ' sezionato' : ''} contorno"${k === 'stampo' ? ' fill="url(#legenda-tratteggio)"' : ''}/></svg>${esc(PALETTE[k].nome)}</li>`);
  return `<div class="legenda" role="group" aria-label="Legenda dei colori">
  <svg width="0" height="0" aria-hidden="true" focusable="false" style="position:absolute">${defs('legenda')}</svg>
  <p class="legenda-titolo">Legenda</p>
  <ul>${righe.join('')}
    <li><svg width="22" height="16" aria-hidden="true" focusable="false"><line x1="2" y1="8" x2="18" y2="8" class="flusso-linea" marker-end="url(#legenda-punta)"/></svg>Freccia continua: pressione o movimento del fluido</li>
    <li><svg width="22" height="16" aria-hidden="true" focusable="false"><path d="M4,2 q4,2 0,4 q-4,2 0,4 q4,2 0,4" class="flusso-linea" fill="none"/></svg>Linea ondulata: calore</li>
  </ul>
  <p class="legenda-nota">Il tratteggio indica le parti sezionate: scuro a 45° per stampi e utensili, chiaro a −45° per il pezzo.</p>
</div>`;
}

// Involucro per mini-diagrammi (vincoli, varianti).
function mini({ id, titolo, desc, w = 160, h = 110, corpo }) {
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="${id}-t ${id}-d" class="mini-svg"><title id="${id}-t">${esc(titolo)}</title><desc id="${id}-d">${esc(desc)}</desc>${defs(id)}${corpo(id)}</svg>`;
}

module.exports = { PALETTE, esc, anim, defs, stampo, sezione, pezzo, ugello, utensile, freccia, calore, rotazione, etichetta, legendaMateriali, mini };
