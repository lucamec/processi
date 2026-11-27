// Schema animato e mini-diagrammi: Colaggio ceramico (Thompson 2007, pp. 172–175).
// Fasi: 1 riempimento, 2 formazione della parete, 3 svuotamento, 4 sformatura, 5 cottura.
'use strict';
const C = require('../componenti');
const { anim, calore, etichetta } = C;

const CX = 410;
const sim = (half) => { const dx = half.map(([r, y]) => `${CX + r},${y}`), sx = half.slice().reverse().map(([r, y]) => `${CX - r},${y}`); return `M${dx.join(' L')} L${sx.join(' L')} Z`; };
const CAVITA = sim([[0, 290], [60, 290], [90, 240], [90, 170], [40, 120], [40, 90], [0, 90]]);
const GUSCIO = sim([[0, 290], [60, 290], [90, 240], [90, 170], [40, 120], [40, 90], [30, 90], [30, 124], [78, 172], [78, 236], [54, 278], [0, 278]]);

function schema(id) {
  return `
<!-- stampo in gesso in due metà -->
<g${anim({ tx: [0, 0, 0, -70, 0] }, { tx: 0 })}>
  <path d="M${CX},70 H280 V310 H${CX} Z ${CAVITA}" fill="url(#${id}-tratteggio)" fill-rule="evenodd" class="contorno" clip-path="url(#${id}-sx)"/>
</g>
<g${anim({ tx: [0, 0, 0, 70, 0] }, { tx: 0 })}>
  <path d="M${CX},70 H540 V310 H${CX} Z ${CAVITA}" fill="url(#${id}-tratteggio)" fill-rule="evenodd" class="contorno" clip-path="url(#${id}-dx)"/>
</g>
<clipPath id="${id}-sx" clipPathUnits="userSpaceOnUse"><rect x="270" y="60" width="${CX - 270}" height="260"/></clipPath>
<clipPath id="${id}-dx" clipPathUnits="userSpaceOnUse"><rect x="${CX}" y="60" width="140" height="260"/></clipPath>
${etichetta({ testo: 'Stampo in gesso (assorbe l\'acqua)', tx: 560, ty: 100 })}
<!-- barbottina che riempie e poi si svuota -->
<path d="${CAVITA}" class="m-grezzo"${anim({ op: [1, 1, 0, 0, 0] }, { op: 0 })}/>
${etichetta({ testo: 'Barbottina (argilla, minerali, acqua)', tx: 30, ty: 330, px: 390, py: 260, extra: anim({ op: [1, 1, 0, 0, 0] }, { op: 0 }) })}
<!-- guscio di argilla che si deposita sulle pareti -->
<path d="${GUSCIO}" class="m-fuso contorno"${anim({ op: [0, 1, 1, 1, 0] }, { op: 0 })}/>
<path d="${GUSCIO}" class="m-finito sezionato contorno"${anim({ op: [0, 0, 0, 0, 1] }, { op: 0 })}/>
<g${anim({ op: [0, 0, 1, 0, 0] })}>${etichetta({ testo: 'la barbottina in eccesso si versa via', tx: 30, ty: 330 })}</g>
<g${anim({ op: [0, 0, 0, 1, 0] })}>${etichetta({ testo: 'pezzo "a cuoio": si stacca e si rifila', tx: 30, ty: 330 })}</g>
<g${anim({ op: [0, 0, 0, 0, 1] })}>${[350, 470].map((x) => calore({ id, x, y: 360, lungo: 30, dir: -1 })).join('')}${etichetta({ testo: 'cottura in biscotto a 1125 °C, poi smalto', tx: 30, ty: 330 })}</g>
`;
}

const pz = (d) => `<path d="${d}" fill-rule="evenodd" class="m-finito contorno"/>`;
const coppie = {
  sottosquadri: {
    ok: ['Stampo in 2–3 parti, senza sottosquadri', 'Lo stampo va progettato per eliminare i sottosquadri con il minor numero di pezzi.', (id) => `<path d="M10,10 H80 V110 H10 Z M40,20 Q70,60 40,100 Z" fill="url(#${id}-tratteggio)" fill-rule="evenodd" class="contorno"/><path d="M80,10 H150 V110 H80 Z" fill="url(#${id}-tratteggio)" class="contorno"/>`],
    ko: ['Forma che richiede molti tasselli', 'Ogni pezzo in più dello stampo allunga il ciclo e aumenta i costi.', (id) => `${[[10, 10], [56, 10], [102, 10], [10, 62], [56, 62], [102, 62]].map(([x, y]) => `<rect x="${x}" y="${y}" width="46" height="52" fill="url(#${id}-tratteggio)" class="contorno"/>`).join('')}<circle cx="80" cy="62" r="20" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  ritiro: {
    ok: ['Stampo maggiorato per il ritiro', 'Il ritiro è di circa l\'8%, secondo il materiale: le misure dello stampo ne tengono conto.', () => `<rect x="30" y="20" width="100" height="80" fill="none" stroke="var(--testo-2)" stroke-dasharray="4 3"/>${pz('M34,24 H126 V96 H34 Z M42,32 H118 V96 H42 Z')}${C.etichetta({ testo: '+8%', tx: 136, ty: 24 })}`],
    ko: ['Stampo alle misure finali', 'Senza compensazione il pezzo cotto risulta più piccolo del previsto.', () => `<rect x="30" y="20" width="100" height="80" fill="none" stroke="var(--ko)" stroke-dasharray="4 3"/>${pz('M38,28 H122 V92 H38 Z M46,36 H114 V92 H46 Z')}`],
  },
  assemblaggi: {
    ok: ['Pezzo in un\'unica colata', 'Le operazioni di assemblaggio costano e si evitano dove possibile.', () => pz('M50,110 Q30,90 30,60 Q30,20 80,20 Q130,20 130,60 Q130,90 110,110 Z M58,104 Q40,88 40,60 Q40,30 80,30 Q120,30 120,60 Q120,88 102,104 Z')],
    ko: ['Molte parti da incollare', 'Ogni giunzione aggiunge lavoro manuale, il costo maggiore del processo.', () => `${pz('M50,110 Q30,90 30,60 Q30,20 80,20 Q130,20 130,60 Q130,90 110,110 Z M58,104 Q40,88 40,60 Q40,30 80,30 Q120,30 120,60 Q120,88 102,104 Z')}${[[30, 60], [130, 60], [80, 20]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="8" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`).join('')}`],
  },
};

const varianti = {
  automatico: ['Colaggio automatizzato', 'Gli stampi in gesso durano circa 50 pezzi; il colaggio automatizzato arriva a molte migliaia di pezzi.', (id) => `
    ${[30, 90, 150].map((x) => `<rect x="${x}" y="30" width="44" height="70" fill="url(#${id}-tratteggio)" class="contorno"/><rect x="${x + 10}" y="40" width="24" height="50" class="m-grezzo"/>`).join('')}
    <line x1="20" y1="22" x2="200" y2="22" stroke="var(--testo-2)" stroke-width="4"/>`],
};

module.exports = { viewBox: '0 50 820 330', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
