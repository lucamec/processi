// Schema animato e mini-diagrammi: Imbutitura profonda (Thompson 2007, pp. 88–91).
// Imbutitura inversa: 1 carico, 2 prima imbutitura, 3 imbutitura inversa, 4 estrazione.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;

const S0 = 'M256,172 H564';
const S1 = 'M322,300 V178 Q322,170 330,170 H490 Q498,170 498,178 V300';
const S2 = 'M322,300 V178 Q322,170 330,170 H366 Q374,170 374,178 V318 Q374,326 382,326 H438 Q446,326 446,318 V178 Q446,170 454,170 H490 Q498,170 498,178 V300';
const lam = (d, col, extra = '') => `<path d="${d}" fill="none" stroke-width="5" stroke-linejoin="round" style="stroke:var(--${col})"${extra}/>`;

function schema(id) {
  return `
<!-- matrice inferiore: anello con foro centrale -->
<path d="M330,176 H370 V340 H330 Z M450,176 H490 V340 H450 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
<rect x="300" y="340" width="220" height="16" class="macchina"/>
${etichetta({ testo: 'Matrice inferiore', tx: 560, ty: 330 })}

<!-- lamiera -->
${lam(S0, 'grezzo', anim({ op: [1, 0, 0, 0] }, { op: 1 }))}
${lam(S1, 'fuso', anim({ op: [0, 1, 0, 0] }, { op: 0 }))}
${lam(S2, 'fuso', anim({ op: [0, 0, 1, 0] }, { op: 0 }))}
<g${anim({ ty: [0, 0, 0, -200], op: [0, 0, 0, 1] }, { op: 0 })}>${lam(S2, 'finito')}</g>
${etichetta({ testo: 'Grezzo di lamiera oliato', tx: 40, ty: 160, px: 258, py: 170, extra: anim({ op: [1, 0, 0, 0] }, { op: 1 }) })}

<!-- premilamiera: scende sui lati della matrice -->
<g${anim({ ty: [0, 128, 128, 0] }, { ty: 0 })}>
  <path d="M256,120 H318 V166 H256 Z M502,120 H564 V166 H502 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
  <rect x="256" y="96" width="308" height="24" class="macchina"/>
</g>
${etichetta({ testo: 'Premilamiera', tx: 580, ty: 112 })}

<!-- punzone: entra nel foro in senso opposto -->
<g${anim({ ty: [-150, -150, 0, -150] }, { ty: -150 })}>
  <rect x="378" y="60" width="64" height="262" fill="url(#${id}-tratteggio)" class="contorno"/>
  <g${anim({ op: [0, 0, 1, 0] })}>${freccia({ id, x1: 410, y1: 20, x2: 410, y2: 58 })}</g>
</g>
${etichetta({ testo: 'Punzone', tx: 300, ty: 40 })}
<g${anim({ op: [0, 1, 0, 0] })}>${freccia({ id, x1: 287, y1: 60, x2: 287, y2: 92 })}${freccia({ id, x1: 533, y1: 60, x2: 533, y2: 92 })}</g>
`;
}

const ln = (d, w = 5, col = 'finito') => `<path d="${d}" fill="none" stroke-width="${w}" stroke-linejoin="round" style="stroke:var(--${col})"/>`;
const coppie = {
  lunghezza: {
    ok: ['Profondità entro 5 diametri', 'La lunghezza dell\'imbutitura può arrivare a 5 volte il diametro del pezzo.', () => `${ln('M60,10 V95 H100 V10')}${C.etichetta({ testo: 'L ≤ 5 D', tx: 116, ty: 60 })}`],
    ko: ['Imbutitura lunga con lamiera sottile', 'Nelle imbutiture lunghe lo spessore si riduce: servono lamiere più spesse, altrimenti il fondo si strappa.', () => `${ln('M70,4 V104 H90 V4', 2)}<circle cx="80" cy="104" r="10" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  sottosquadri: {
    ok: ['Rientri fatti dopo la formatura', 'I movimenti laterali nello stampo costano moltissimo: spesso si eseguono dopo l\'imbutitura.', (id) => `${ln('M50,10 V95 H110 V10')}<rect x="112" y="40" width="24" height="16" class="m-stampo contorno"/>${C.freccia({ id, x1: 150, y1: 70, x2: 122, y2: 70 })}`],
    ko: ['Rientri nello stesso ciclo', 'Ottenerli con stampi progressivi o azioni perpendicolari fa crescere molto il costo dello stampo.', () => `${ln('M50,10 V40 L40,50 V95 H120 V50 L110,40 V10')}<circle cx="42" cy="48" r="10" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  bordo: {
    ok: ['Margine da rifilare sul bordo', 'Grinze e difetti si formano sul perimetro: si lascia materiale in più e si rifila dopo la formatura.', () => `${ln('M30,30 H50 V95 H110 V30 H130')}<line x1="50" y1="22" x2="50" y2="40" stroke="var(--ko)" stroke-dasharray="3 3" stroke-width="2"/><line x1="110" y1="22" x2="110" y2="40" stroke="var(--ko)" stroke-dasharray="3 3" stroke-width="2"/>`],
    ko: ['Nessun margine', 'Senza margine le grinze del bordo restano sul pezzo finito.', () => `${ln('M50,26 Q53,30 50,34 Q47,38 50,42 V95 H110 V42 Q113,38 110,34 Q107,30 110,26')}<circle cx="50" cy="32" r="10" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  inversa: ['Imbutitura inversa', 'La lamiera viene imbutita due volte nella stessa operazione, rovesciando la forma dopo la prima: ciclo più rapido e meno stampi.', (id) => `
    <path d="M70,40 H90 V118 H70 Z M130,40 H150 V118 H130 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
    ${ln('M66,110 V40 H94 V110 H126 V40 H154 V110', 4, 'fuso')}
    <rect x="96" y="0" width="28" height="104" fill="url(#${id}-tratteggio)" class="contorno"/>`],
  progressiva: ['Stampi progressivi', 'Le forme molto profonde o complesse passano per una serie di stampi, ognuno dei quali allunga un po\' il pezzo.', () => `
    ${[[30, 30], [95, 55], [165, 85]].map(([x, h]) => ln(`M${x},20 V${20 + h} H${x + 30} V20`, 4)).join('')}
    ${etichetta({ testo: '1 → 2 → 3', tx: 110, ty: 122, ancora: 'middle' })}`],
};

module.exports = { viewBox: '0 0 820 370', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 128 } };
