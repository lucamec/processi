// Schema animato e mini-diagrammi: Fusione in sabbia (Thompson 2007, pp. 120–123).
// Fasi: 1 formatura della staffa inferiore, 2 anima e chiusura, 3 colata, 4 solidificazione, 5 distaffatura.
'use strict';
const C = require('../componenti');
const { anim, freccia, calore, etichetta } = C;

const PEZZO = 'M320,150 H500 V250 H486 V164 H334 V250 H320 Z';
const ANIMA = 'M334,164 H486 V250 H334 Z';
const CANALI = 'M264,90 H280 V262 H264 Z M264,250 H320 V262 H264 Z M402,90 H418 V150 H402 Z';

function schema(id) {
  return `
<clipPath id="${id}-sotto" clipPathUnits="userSpaceOnUse"><rect x="230" y="200" width="360" height="130"/></clipPath>
<clipPath id="${id}-sopra" clipPathUnits="userSpaceOnUse"><rect x="230" y="80" width="360" height="120"/></clipPath>
<!-- staffa inferiore (drag) -->
<path d="M240,200 H580 V320 H240 Z ${PEZZO} ${CANALI}" fill="url(#${id}-tratteggio)" fill-rule="evenodd" class="contorno" clip-path="url(#${id}-sotto)"${anim({ op: [1, 1, 1, 1, 0] }, { op: 1 })}/>
<rect x="236" y="196" width="348" height="128" fill="none" stroke="var(--testo)" stroke-width="4"${anim({ op: [1, 1, 1, 1, 0] }, { op: 1 })}/>
${etichetta({ testo: 'Staffa inferiore', tx: 600, ty: 300 })}
<!-- modello in legno (fase 1) -->
<path d="${PEZZO} M334,164 H486 V250 H334 Z" class="macchina"${anim({ op: [1, 0, 0, 0, 0] }, { op: 1 })}/>
${etichetta({ testo: 'Modello (legno o alluminio)', tx: 30, ty: 150, px: 320, py: 160, extra: anim({ op: [1, 0, 0, 0, 0] }, { op: 1 }) })}
<!-- anima in sabbia -->
<path d="${ANIMA}" fill="url(#${id}-tratteggio)" class="contorno"${anim({ op: [0, 1, 1, 1, 0] }, { op: 0 })}/>
${etichetta({ testo: 'Anima in sabbia', tx: 30, ty: 300, px: 380, py: 240, extra: anim({ op: [0, 1, 1, 1, 0] }) })}

<!-- metallo: riempimento dal basso -->
<clipPath id="${id}-livello" clipPathUnits="userSpaceOnUse"><rect x="250" y="86" width="270" height="180"${anim({ sy: [0, 0, 1, 1, 1] }, { sy: 0 }, [0, 266])}/></clipPath>
<g clip-path="url(#${id}-livello)"><path d="${PEZZO} ${CANALI}" class="m-fuso contorno"${anim({ op: [1, 1, 1, 0, 0] }, { op: 1 })}/></g>
<path d="${PEZZO} ${CANALI}" class="m-finito contorno"${anim({ op: [0, 0, 0, 1, 0] }, { op: 0 })}/>
<path d="${PEZZO}" class="m-finito sezionato contorno"${anim({ op: [0, 0, 0, 0, 1] }, { op: 0 })}/>

<!-- staffa superiore (cope) con canale di colata e materozza -->
<g${anim({ ty: [-130, 0, 0, 0, -130], op: [1, 1, 1, 1, 0] }, { ty: -130, op: 1 })}>
  <path d="M240,90 H580 V200 H240 Z ${PEZZO} ${CANALI}" fill="url(#${id}-tratteggio)" fill-rule="evenodd" class="contorno" clip-path="url(#${id}-sopra)"/>
  <rect x="236" y="86" width="348" height="114" fill="none" stroke="var(--testo)" stroke-width="4"/>
</g>
${etichetta({ testo: 'Staffa superiore', tx: 600, ty: 120 })}
${etichetta({ testo: 'Canale di colata', tx: 30, ty: 230, px: 264, py: 230 })}
${etichetta({ testo: 'Materozza', tx: 430, ty: 60, px: 410, py: 92 })}

<!-- colata -->
<g${anim({ op: [0, 0, 1, 0, 0] })}>
  <path d="M220,30 H290 L282,70 H228 Z" class="macchina"/><line x1="272" y1="70" x2="272" y2="92" stroke="var(--fuso)" stroke-width="8"/>
  ${etichetta({ testo: 'Alluminio fuso (> 900 °C in preparazione)', tx: 300, ty: 40 })}
</g>
<g${anim({ op: [0, 0, 0, 1, 0] })}>${[272, 410].map((x) => calore({ id, x, y: 60, lungo: 26 })).join('')}${etichetta({ testo: 'polvere esotermica: tiene caldi canale e materozza', tx: 300, ty: 40 })}</g>
<g${anim({ op: [0, 0, 0, 0, 1] })}>${etichetta({ testo: 'La sabbia si rompe e il pezzo si separa dai canali', tx: 240, ty: 300 })}</g>
`;
}

const pz = (d) => `<path d="${d}" class="m-finito contorno"/>`;
const coppie = {
  sformo: {
    ok: ['Sformo di 1–5° (di solito 2°)', 'Le pareti inclinate permettono di sfilare il modello dalla sabbia senza rovinarla; anche le anime vogliono sformo.', (id) => `<path d="M10,20 H150 V100 H10 Z M40,100 L50,40 H110 L120,100 Z" fill="url(#${id}-tratteggio)" fill-rule="evenodd" class="contorno"/>${pz('M40,100 L50,40 H110 L120,100 Z')}${C.etichetta({ testo: '2°', tx: 124, ty: 70 })}`],
    ko: ['Pareti verticali', 'Senza sformo il modello trascina la sabbia quando si estrae.', (id) => `<path d="M10,20 H150 V100 H10 Z M45,100 V40 H115 V100 Z" fill="url(#${id}-tratteggio)" fill-rule="evenodd" class="contorno"/>${pz('M45,100 V40 H115 V100 Z')}${C.etichetta({ testo: '0°', tx: 122, ty: 70 })}`],
  },
  spessore: {
    ok: ['Spessore costante, raccordi graduali', 'Le variazioni di spessore vanno evitate; quelle piccole si risolvono con rastremature e raccordi.', () => pz('M10,90 H60 Q75,90 80,76 L90,50 H150 V66 H100 L94,84 Q88,106 60,106 H10 Z')],
    ko: ['Salto brusco di spessore', 'Le sezioni diverse si raffreddano e si ritirano in modo diverso.', () => `${pz('M10,70 H80 V30 H150 V100 H10 Z')}<circle cx="80" cy="70" r="11" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  sezioni: {
    ok: ['Grandi differenze: fondere in più parti', 'Se serve un grande cambio di sezione, le parti si fondono separatamente e poi si assemblano.', () => `${pz('M10,60 H70 V90 H10 Z')}${pz('M90,20 H150 V100 H90 Z')}<line x1="80" y1="50" x2="80" y2="100" stroke="var(--testo-2)" stroke-dasharray="3 3"/>`],
    ko: ['Massa e parete sottile insieme', 'Un blocco massiccio unito a una parete sottile si ritira in modo diverso: deformazioni e porosità.', () => `${pz('M10,60 H90 V20 H150 V100 H10 V90 Z')}<circle cx="90" cy="75" r="12" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  verde: ['Sabbia a verde', 'Sabbia mescolata ad argilla e acqua, compattata sul modello e lasciata asciugare: l\'acqua residua bollirebbe creando sacche d\'aria. Fino al 95% della sabbia si ricicla.', (id) => `<rect x="20" y="20" width="180" height="90" fill="url(#${id}-tratteggio)" class="contorno"/><path d="M70,110 V60 H150 V110" class="cavita contorno"/>${etichetta({ testo: 'sabbia + argilla + acqua', tx: 110, ty: 14, ancora: 'middle' })}`],
  secca: ['Sabbia legata (a secco)', 'Ogni granello è rivestito di una resina vinilestere che indurisce a temperatura ambiente: stampi più rapidi e finitura migliore.', (id) => `<rect x="20" y="20" width="180" height="90" fill="url(#${id}-tratteggio)" class="contorno"/><path d="M70,110 V60 H150 V110" class="cavita contorno" stroke-width="3"/>${etichetta({ testo: 'sabbia con resina', tx: 110, ty: 14, ancora: 'middle' })}`],
  evaporativo: ['Modello evaporativo', 'Un modello di schiuma (polistirene) resta nella sabbia e il metallo fuso lo brucia mentre entra: utile per prototipi e piccolissime serie, con finitura inferiore.', (id) => `<rect x="20" y="20" width="180" height="90" fill="url(#${id}-tratteggio)" class="contorno"/><path d="M70,110 V60 H110 V110 Z" class="m-fuso contorno"/><path d="M110,110 V60 H150 V110 Z" fill="#ffffff" stroke="var(--testo)"/>${etichetta({ testo: 'metallo · schiuma', tx: 110, ty: 124, ancora: 'middle' })}`],
};

module.exports = { viewBox: '0 20 820 330', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 130 } };
