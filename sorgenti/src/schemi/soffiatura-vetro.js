// Schema animato e mini-diagrammi: Soffiatura del vetro (Thompson 2007, pp. 152–159).
// Schema principale: soffiatura artigianale (studio). Fasi: 1 raccolta, 2 marveratura, 3 soffiatura,
// 4 formatura e pontello, 5 ricottura.
'use strict';
const C = require('../componenti');
const { anim, freccia, calore, etichetta } = C;

const GOCCIA = 'M380,200 m0,-30 a40,30 0 1,1 0,60 a40,30 0 1,1 0,-60 Z';
const PARISON = 'M380,174 H450 Q480,174 480,200 Q480,226 450,226 H380 Z';
const BOLLA = 'M380,186 Q400,140 470,140 Q540,140 540,200 Q540,260 470,260 Q400,260 380,214 Z M396,200 Q410,154 470,154 Q526,154 526,200 Q526,246 470,246 Q410,246 396,200 Z';
const VASO = 'M380,190 Q392,190 400,176 Q420,128 480,128 Q556,128 560,200 Q556,272 480,272 Q420,272 400,224 Q392,210 380,210 Z M396,200 Q410,142 480,142 Q542,142 546,200 Q542,258 480,258 Q410,258 396,200 Z';
const v = (d, cls, extra = '') => `<path d="${d}" fill-rule="evenodd" class="${cls} contorno"${extra}/>`;

function schema(id) {
  return `
<!-- canna da soffio, sempre in rotazione -->
<rect x="70" y="194" width="320" height="12" class="scuro"/>
${C.rotazione({ id, cx: 150, cy: 200, r: 22 })}
${etichetta({ testo: 'Canna da soffio (gira di continuo)', tx: 70, ty: 166 })}

<!-- vetro -->
${v(GOCCIA, 'm-fuso', anim({ op: [1, 0, 0, 0, 0] }, { op: 1 }))}
${v(PARISON, 'm-fuso', anim({ op: [0, 1, 0, 0, 0] }, { op: 0 }))}
${v(BOLLA, 'm-fuso', anim({ op: [0, 0, 1, 0, 0] }, { op: 0 }))}
${v(VASO, 'm-fuso', anim({ op: [0, 0, 0, 1, 0] }, { op: 0 }))}
${v(VASO, 'm-finito', anim({ op: [0, 0, 0, 0, 1] }, { op: 0 }))}

<!-- 1: crogiolo -->
<g${anim({ op: [1, 0, 0, 0, 0] }, { op: 1 })}>
  <path d="M330,250 H560 V340 H330 Z" class="macchina"/><rect x="340" y="260" width="210" height="70" class="m-fuso"/>
  ${etichetta({ testo: 'Crogiolo a oltre 1120 °C', tx: 580, ty: 300 })}
</g>
<!-- 2: marver -->
<g${anim({ op: [0, 1, 0, 0, 0] })}>
  <rect x="320" y="228" width="240" height="20" class="m-stampo contorno"/>
  ${etichetta({ testo: 'Marver: tavolo d\'acciaio lucidato', tx: 580, ty: 244 })}
</g>
<!-- 3: soffio e gloryhole -->
<g${anim({ op: [0, 0, 1, 0, 0] })}>
  ${freccia({ id, x1: 60, y1: 236, x2: 120, y2: 236 })}${etichetta({ testo: 'aria soffiata', tx: 60, ty: 258 })}
  ${[480, 520].map((x) => calore({ id, x, y: 70, lungo: 34 })).join('')}${etichetta({ testo: 'riscaldo nel "gloryhole" (circa 800 °C)', tx: 560, ty: 80 })}
</g>
<!-- 4: pinze (pucellas) -->
<g${anim({ op: [0, 0, 0, 1, 0] })}>
  <path d="M600,100 L410,182 M600,300 L410,218" stroke="var(--testo)" stroke-width="5" fill="none"/>
  ${etichetta({ testo: 'Pinze (pucellas) e sagome di legno bagnato', tx: 500, ty: 80 })}
</g>
<!-- 5: forno di ricottura -->
<g${anim({ op: [0, 0, 0, 0, 1] })}>
  <rect x="350" y="100" width="240" height="200" rx="10" fill="none" stroke="var(--testo-2)" stroke-width="2" stroke-dasharray="7 5"/>
  ${etichetta({ testo: 'Ricottura: raffreddamento lento (36 ore nel caso studio)', tx: 300, ty: 330 })}
</g>
${etichetta({ testo: 'il vetro deve restare sopra i 600 °C', tx: 70, ty: 330, extra: anim({ op: [1, 1, 1, 1, 0] }, { op: 1 }) })}
`;
}

const pz = (d) => `<path d="${d}" fill-rule="evenodd" class="m-finito contorno"/>`;
const coppie = {
  forme: {
    ok: ['Forme morbide e raccordate', 'Addolcire la forma il più possibile riduce le concentrazioni di tensione nel vetro.', () => pz('M50,20 Q30,60 50,100 H110 Q130,60 110,20 Z M58,26 Q42,60 58,94 H102 Q118,60 102,26 Z')],
    ko: ['Spigoli e cambi bruschi', 'Le zone che si raffreddano a velocità diverse accumulano tensioni e il vetro può rompersi.', () => `${pz('M40,20 H120 V60 H90 V100 H70 V60 H40 Z M48,28 H112 V52 H82 V92 H78 V52 H48 Z')}<circle cx="90" cy="60" r="10" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  sformo: {
    ok: ['Sformo di 5° negli stampi', 'Nella produzione in stampo si lavora di solito con 5° di sformo; con forme tonde o ellittiche non è un problema.', (id) => `<path d="M10,10 H150 V110 H10 Z M50,20 L44,100 H116 L110,20 Z" fill="url(#${id}-tratteggio)" fill-rule="evenodd" class="contorno"/>${pz('M50,20 L44,100 H116 L110,20 H104 L110,94 H50 L56,20 Z')}${C.etichetta({ testo: '5°', tx: 122, ty: 60 })}`],
    ko: ['Pareti verticali in stampo', 'Senza sformo il pezzo non si stacca facilmente dallo stampo.', (id) => `<path d="M10,10 H150 V110 H10 Z M46,20 V100 H114 V20 Z" fill="url(#${id}-tratteggio)" fill-rule="evenodd" class="contorno"/>${pz('M46,20 V100 H114 V20 H108 V94 H52 V20 Z')}`],
  },
  simmetria: {
    ok: ['Pezzo simmetrico, collo centrato', 'Nella produzione meccanizzata i pezzi devono essere simmetrici e con il collo al centro, per adattarsi alle linee di riempimento ed etichettatura.', () => pz('M70,10 H90 V30 Q120,40 120,70 V105 H40 V70 Q40,40 70,30 Z M76,14 H84 V34 Q114,44 114,70 V99 H46 V70 Q46,44 76,34 Z')],
    ko: ['Collo fuori asse', 'Un collo decentrato non si adatta alla linea di produzione.', () => `${pz('M100,10 H120 V30 Q130,40 130,70 V105 H30 V70 Q30,40 100,30 Z M106,14 H114 V34 Q124,44 124,70 V99 H36 V70 Q36,44 106,34 Z')}<circle cx="110" cy="20" r="12" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  soffiosoffio: ['Soffio-soffio meccanico', 'Una goccia di vetro cade nel primo stampo: il collo si forma e l\'aria crea un primo abbozzo; poi l\'abbozzo passa nello stampo finale e viene soffiato nella forma definitiva.', (id) => `
    <path d="M20,30 H90 V110 H20 Z M40,40 H70 V90 H40 Z" fill="url(#${id}-tratteggio)" fill-rule="evenodd" class="contorno"/><path d="M40,40 H70 V90 H40 Z" class="m-fuso contorno"/>
    ${C.freccia({ id, x1: 96, y1: 70, x2: 120, y2: 70 })}
    <path d="M130,20 H210 V110 H130 Z M150,30 H190 V100 H150 Z" fill="url(#${id}-tratteggio)" fill-rule="evenodd" class="contorno"/><path d="M150,30 H190 V100 H150 Z M156,36 H184 V94 H156 Z" fill-rule="evenodd" class="m-fuso contorno"/>`],
  pressasoffio: ['Pressa-soffio meccanico', 'Il primo abbozzo e il collo si formano con un punzone invece che con l\'aria; poi si soffia nello stampo finale.', (id) => `
    <path d="M40,30 H130 V110 H40 Z M60,40 H110 V100 H60 Z" fill="url(#${id}-tratteggio)" fill-rule="evenodd" class="contorno"/><path d="M60,40 H110 V100 H60 Z M74,40 H96 V86 H74 Z" fill-rule="evenodd" class="m-fuso contorno"/>
    <rect x="76" y="0" width="18" height="84" class="m-stampo contorno"/>`],
};

module.exports = { viewBox: '0 40 820 320', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
