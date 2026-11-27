// Schema animato e mini-diagrammi: Battitura della lamiera (Thompson 2007, pp. 72–77).
// Sequenza del caso studio: 1 lamiera tagliata, 2 ruota inglese, 3 martellatura su sagoma,
// 4 saldatura TIG dei pannelli, 5 spianatura e lucidatura.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;

const PIANA = 'M220,250 H600';
const CURVA = 'M220,250 Q410,170 600,250';
const SAGOMATA = 'M220,250 Q300,175 380,178 Q395,160 425,160 Q440,178 470,178 Q560,184 600,250';
const lam = (d, col, extra = '') => `<path d="${d}" fill="none" stroke-width="6" stroke-linecap="round" style="stroke:var(--${col})"${extra}/>`;

function schema(id) {
  return `
<!-- banco -->
<rect x="180" y="300" width="460" height="14" class="macchina"/>

<!-- lamiera nelle varie fasi -->
${lam(PIANA, 'grezzo', anim({ op: [1, 0, 0, 0, 0] }, { op: 1 }))}
${lam(CURVA, 'fuso', anim({ op: [0, 1, 0, 0, 0] }, { op: 0 }))}
${lam(SAGOMATA, 'fuso', anim({ op: [0, 0, 1, 1, 0] }, { op: 0 }))}
${lam(SAGOMATA, 'finito', anim({ op: [0, 0, 0, 0, 1] }, { op: 0 }))}
${etichetta({ testo: 'Lamiera (alluminio, acciaio, magnesio)', tx: 40, ty: 236, px: 222, py: 250 })}

<!-- 2: ruota inglese -->
<g${anim({ op: [0, 1, 0, 0, 0], tx: [0, 0, 0, 0, 0] })}>
  <circle cx="410" cy="150" r="34" fill="url(#${id}-tratteggio)" class="contorno"${anim({ rot: [0, 720, 720, 720, 720] }, { rot: 0 }, [410, 150])}/>
  <path d="M376,232 Q410,206 444,232 V262 H376 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
  ${etichetta({ testo: 'Ruota piatta', tx: 460, ty: 130 })}${etichetta({ testo: 'Incudine bombata', tx: 460, ty: 262 })}
  ${freccia({ id, x1: 300, y1: 120, x2: 360, y2: 120 })}${freccia({ id, x1: 520, y1: 100, x2: 460, y2: 100 })}
  ${etichetta({ testo: 'passate avanti e indietro: la lamiera si incurva in due direzioni', tx: 210, ty: 84 })}
</g>

<!-- 3: martellatura su sagoma in resina epossidica -->
<g${anim({ op: [0, 0, 1, 0, 0] })}>
  <path d="M226,256 Q300,181 380,184 Q395,166 425,166 Q440,184 470,184 Q560,190 594,256 V296 H226 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
  ${etichetta({ testo: 'Sagoma in resina epossidica (o acciaio)', tx: 450, ty: 290 })}
  <g${anim({ ty: [0, 0, 0, 0, 0], rot: [0, 0, 0, 0, 0] })}>
    <rect x="418" y="104" width="16" height="50" class="m-stampo contorno"/><rect x="400" y="94" width="52" height="14" class="scuro"/>
    ${freccia({ id, x1: 470, y1: 110, x2: 470, y2: 150 })}
  </g>
  ${etichetta({ testo: 'Battitore (in nylon o alluminio) colpito dal martello', tx: 480, ty: 116 })}
</g>

<!-- 4: saldatura TIG di due pannelli -->
<g${anim({ op: [0, 0, 0, 1, 0] })}>
  <rect x="404" y="110" width="12" height="46" class="scuro"/>
  <circle cx="410" cy="162" r="7" fill="#fff" stroke="var(--fuso)" stroke-width="4"/>
  <line x1="410" y1="150" x2="410" y2="320" stroke="var(--ko)" stroke-width="2" stroke-dasharray="5 4"/>
  ${etichetta({ testo: 'Saldatura TIG fra pannelli formati separatamente', tx: 430, ty: 120 })}
</g>

<!-- 5: spianatura con martello e tasso -->
<g${anim({ op: [0, 0, 0, 0, 1] })}>
  <rect x="290" y="140" width="60" height="16" class="m-stampo contorno"/><rect x="314" y="96" width="12" height="44" class="scuro"/>
  <path d="M294,214 Q320,196 346,214 V236 H294 Z" class="m-stampo contorno"/>
  ${etichetta({ testo: 'Martello da spianare', tx: 360, ty: 120 })}${etichetta({ testo: 'Tasso (contro-stampo)', tx: 40, ty: 228, px: 294, py: 228 })}
</g>
`;
}

const lin = (d, col = 'finito', w = 5) => `<path d="${d}" fill="none" stroke-width="${w}" stroke-linecap="round" style="stroke:var(--${col})"/>`;
const coppie = {
  spessore: {
    ok: ['Lamiera entro lo spessore lavorabile', 'Alluminio fino a 6 mm, acciaio fino a 3 mm.', () => `${lin('M15,80 Q80,30 145,80', 'finito', 5)}${C.etichetta({ testo: 'Al ≤ 6 mm · acciaio ≤ 3 mm', tx: 80, ty: 106, ancora: 'middle' })}`],
    ko: ['Lamiera troppo spessa', 'Oltre questi spessori la lamiera non si lavora a mano.', () => `${lin('M15,80 Q80,30 145,80', 'finito', 16)}<circle cx="80" cy="55" r="16" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  pannelli: {
    ok: ['Più pannelli saldati', 'Le forme grandi si dividono in pannelli formati separatamente e saldati senza giunzioni visibili.', () => `${lin('M15,90 Q50,30 80,30')}${lin('M80,30 Q110,30 145,90')}<line x1="80" y1="18" x2="80" y2="44" stroke="var(--ko)" stroke-width="2" stroke-dasharray="3 3"/>`],
    ko: ['Forma grande da un unico foglio', 'Ricavare tutta la forma da un solo pezzo è di solito poco pratico.', () => `${lin('M15,90 Q50,10 80,20 Q110,10 145,90')}<circle cx="80" cy="22" r="12" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  rigidita: {
    ok: ['Nervature, bordature e flange', 'Imbutiture e bordi piegati irrigidiscono la lamiera senza aumentarne il peso.', () => lin('M15,95 V70 H45 Q55,52 65,70 H95 Q105,52 115,70 H145 V95')],
    ko: ['Pannello piano senza rinforzi', 'Una grande superficie liscia si flette facilmente.', () => `${lin('M15,70 H145')}<path d="M15,70 Q80,96 145,70" fill="none" stroke="var(--ko)" stroke-width="2" stroke-dasharray="4 3"/>`],
  },
};

const varianti = {
  sacco: ['Imbutitura a mano su sacco', 'La lamiera viene battuta con un mazzuolo dentro un sacco di sabbia o di pallini, che cede seguendo il colpo.', () => `
    <path d="M40,90 Q110,130 180,90 Q180,60 110,60 Q40,60 40,90 Z" class="m-grezzo contorno"/>
    ${lin('M50,70 Q110,105 170,70', 'fuso', 5)}
    <path d="M100,8 Q120,4 128,20 L118,40 Q104,34 100,8 Z" class="m-stampo contorno"/>
    ${etichetta({ testo: 'sacco di sabbia', tx: 110, ty: 122, ancora: 'middle' })}`],
  sagoma: ['Martellatura su sagoma', 'Battitori di plastica o metallo colpiti con un martello stirano e comprimono la lamiera sulla sagoma; i battitori metallici servono per pieghe strette e superfici piane.', (id) => `
    <path d="M20,110 V70 Q110,20 200,70 V110 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
    ${lin('M20,66 Q110,16 200,66', 'fuso', 5)}
    <rect x="104" y="0" width="12" height="30" class="m-stampo contorno"/>`],
  ruota: ['Ruota inglese', 'La lamiera passa avanti e indietro fra una ruota piatta e un\'incudine bombata: ogni passata la stira un poco e la incurva in due direzioni.', (id) => `
    <circle cx="110" cy="30" r="24" fill="url(#${id}-tratteggio)" class="contorno"/>
    <path d="M86,92 Q110,72 134,92 V112 H86 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
    ${lin('M20,72 Q110,50 200,72', 'fuso', 5)}`],
  spianatura: ['Spianatura', 'Operazione di finitura: colpi leggeri e sovrapposti con un martello a faccia piatta contro un tasso lisciano la superficie; poi si lima, si carteggia e si lucida.', () => `
    <rect x="80" y="10" width="60" height="16" class="m-stampo contorno"/><rect x="104" y="0" width="12" height="12" class="scuro"/>
    ${lin('M20,50 Q110,30 200,50', 'finito', 5)}
    <path d="M84,70 Q110,52 136,70 V96 H84 Z" class="m-stampo contorno"/>`],
};

module.exports = { viewBox: '0 0 820 330', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
