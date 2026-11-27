// Schema animato e mini-diagrammi: Colata sottovuoto (Thompson 2007, pp. 40–43).
// Fasi: 1 stampo in silicone dal modello, 2 rimozione del modello, 3 chiusura e colata sottovuoto,
// 4 polimerizzazione in forno, 5 estrazione.
'use strict';
const C = require('../componenti');
const { anim, freccia, calore, etichetta, pezzo } = C;

// pezzo: guscio a vaschetta rovesciata (sezione), con canale di colata, distributore e materozze
const PEZZO = 'M320,200 H500 V262 H486 V214 H334 V262 H320 Z';
const CANALI = 'M406,130 H414 V292 H406 Z M300,284 H414 V292 H300 Z M300,262 H308 V292 H300 Z M300,262 H334 V270 H300 Z';
const MATEROZZE = 'M352,130 H360 V200 H352 Z M462,130 H470 V200 H462 Z';
const CAVITA = `${PEZZO} ${CANALI} ${MATEROZZE}`;

function schema(id) {
  return `
<!-- Camera a vuoto -->
<rect x="170" y="14" width="480" height="330" rx="10" fill="none" stroke="var(--testo-2)" stroke-width="2" stroke-dasharray="8 5"/>
${etichetta({ testo: 'Camera a vuoto', tx: 180, ty: 36 })}
<g${anim({ op: [0, 0, 1, 0, 0] })}>${freccia({ id, x1: 640, y1: 330, x2: 700, y2: 330, tipo: 'vuoto' })}${etichetta({ testo: 'aria aspirata', tx: 660, ty: 316 })}</g>

<!-- Stampo in silicone, metà B (inferiore) -->
<g${anim({ op: [1, 1, 1, 1, 1] }, { op: 0 })}>
  <path d="M260,225 H560 V320 H260 Z ${CAVITA}" fill="url(#${id}-tratteggio)" fill-rule="evenodd" class="contorno" clip-path="url(#${id}-sotto)"/>
</g>
<clipPath id="${id}-sotto" clipPathUnits="userSpaceOnUse"><rect x="250" y="225" width="320" height="100"/></clipPath>
<clipPath id="${id}-sopra" clipPathUnits="userSpaceOnUse"><rect x="250" y="120" width="320" height="105"/></clipPath>

<!-- Modello master -->
<path d="${PEZZO}" class="macchina"${anim({ op: [1, 0, 0, 0, 0] }, { op: 1 })}/>
${etichetta({ testo: 'Modello (master)', tx: 590, ty: 240, px: 500, py: 232, extra: anim({ op: [1, 0, 0, 0, 0] }, { op: 1 }) })}

<!-- PUR: riempimento dal basso verso l'alto -->
<clipPath id="${id}-livello" clipPathUnits="userSpaceOnUse"><rect x="250" y="126" width="320" height="170"${anim({ sy: [0, 0, 1, 1, 1] }, { sy: 0 }, [0, 296])}/></clipPath>
<g clip-path="url(#${id}-livello)">
  <path d="${PEZZO} ${CANALI}" class="m-fuso contorno"${anim({ op: [1, 1, 1, 0, 0] }, { op: 1 })}/>
  <path d="${MATEROZZE}" class="m-fuso contorno"${anim({ op: [1, 1, 1, 0, 0] }, { op: 1 })}/>
</g>
<path d="${PEZZO}" class="m-finito sezionato contorno"${anim({ op: [0, 0, 0, 1, 1] }, { op: 0 })}/>
<path d="${CANALI} ${MATEROZZE}" class="m-finito contorno"${anim({ op: [0, 0, 0, 1, 0] }, { op: 0 })}/>

<!-- Metà A (superiore): si solleva per togliere il modello e il pezzo -->
<g${anim({ ty: [0, -70, 0, 0, -70], op: [1, 1, 1, 1, 1] }, { ty: 0, op: 0 })}>
  <path d="M260,130 H560 V225 H260 Z ${CAVITA}" fill="url(#${id}-tratteggio)" fill-rule="evenodd" class="contorno" clip-path="url(#${id}-sopra)"/>
  ${etichetta({ testo: 'Stampo in silicone (metà A)', tx: 600, ty: 150 })}
</g>
${etichetta({ testo: 'Metà B', tx: 600, ty: 300 })}

<!-- Bicchiere con il PUR miscelato -->
<g${anim({ op: [0, 0, 1, 0, 0] })}>
  <path d="M384,48 H436 L430,96 H390 Z" class="macchina"/>
  <rect x="392" y="62" width="36" height="32" class="m-fuso"/>
  <line x1="410" y1="96" x2="410" y2="128" stroke="var(--fuso)" stroke-width="5"/>
  ${etichetta({ testo: 'PUR bicomponente miscelato', tx: 450, ty: 70 })}
</g>

<!-- Forno a 40 °C -->
<g${anim({ op: [0, 0, 0, 1, 0] })}>
  ${[300, 410, 520].map((x) => calore({ id, x, y: 334, lungo: 26, dir: -1 })).join('')}
  ${etichetta({ testo: 'forno a 40 °C', tx: 540, ty: 342 })}
</g>
<!-- Aria nelle materozze per staccare il pezzo -->
<g${anim({ op: [0, 0, 0, 0, 1] })}>${[356, 466].map((x) => freccia({ id, x1: x, y1: 60, x2: x, y2: 118 })).join('')}</g>
${etichetta({ testo: 'Materozze', tx: 180, ty: 112, px: 352, py: 150 })}
${etichetta({ testo: 'Canale di colata', tx: 180, ty: 196, px: 406, py: 286 })}
`;
}

const coppie = {
  spessore: {
    ok: ['Pareti di almeno 3 mm', 'Spessore consigliato superiore a 1 mm, idealmente non meno di 3 mm.', () => `${pezzo({ d: 'M15,40 H145 V100 H129 V58 H31 V100 H15 Z' })}${C.etichetta({ testo: '≥ 3 mm', tx: 80, ty: 34, ancora: 'middle' })}`],
    ko: ['Pareti sottilissime su grandi aree', 'Si arriva a 0,5 mm solo su piccole zone: su superfici estese è da evitare.', () => `${pezzo({ d: 'M15,50 H145 V100 H141 V54 H19 V100 H15 Z' })}${C.etichetta({ testo: '0,5 mm', tx: 80, ty: 44, ancora: 'middle' })}`],
  },
  spigoli: {
    ok: ['Bordi arrotondati', 'Dettagli con un minimo di raggio si riproducono bene.', () => pezzo({ d: 'M15,90 H120 Q145,90 145,65 V60 H15 Z' })],
    ko: ['Spigoli a lama di coltello', 'I dettagli molto affilati sono difficili da riprodurre con qualsiasi stampaggio.', () => `${pezzo({ d: 'M15,90 H145 L15,60 Z' })}<circle cx="140" cy="88" r="9" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  sottosquadri: {
    ok: ['Sottosquadro leggero: lo stampo si flette', 'Il silicone è flessibile: piccoli sottosquadri si estraggono deformando lo stampo.', (id) => `<path d="M10,20 H150 V100 H10 Z M40,40 H110 L116,60 H34 Z" fill="url(#${id}-tratteggio)" fill-rule="evenodd" class="contorno"/>${pezzo({ d: 'M40,40 H110 L116,60 H34 Z' })}`],
    ko: ['Rientro profondo senza nucleo', 'I rientri più grandi richiedono nuclei o inserti nello stampo.', (id) => `<path d="M10,20 H150 V100 H10 Z M40,40 H110 V86 H96 V54 H54 V86 H40 Z" fill="url(#${id}-tratteggio)" fill-rule="evenodd" class="contorno"/>${pezzo({ d: 'M40,40 H110 V86 H96 V54 H54 V86 H40 Z' })}<circle cx="75" cy="70" r="13" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  sovrastampaggio: ['Sovrastampaggio', 'Il pezzo rigido viene tolto dal primo stampo e messo in un secondo, dove si cola il materiale morbido sopra.', (id) => `
    <rect x="20" y="40" width="80" height="40" class="m-finito contorno"/>
    ${freccia({ id, x1: 108, y1: 60, x2: 132, y2: 60 })}
    <rect x="140" y="40" width="60" height="40" class="m-finito contorno"/>
    <path d="M140,40 H200 V30 Q170,18 140,30 Z" class="m-fuso contorno"/>
    ${etichetta({ testo: 'rigido (simil-ABS)', tx: 10, ty: 100 })}${etichetta({ testo: '+ morbido (simil-TPE)', tx: 92, ty: 116 })}`],
};

module.exports = { viewBox: '0 0 820 360', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
